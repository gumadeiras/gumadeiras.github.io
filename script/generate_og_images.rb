#!/usr/bin/env ruby
# frozen_string_literal: true

require 'cgi'
require 'date'
require 'digest'
require 'fileutils'
require 'open3'
require 'pathname'
require 'tempfile'
require 'yaml'

ROOT = Pathname(__dir__).parent.expand_path
POSTS_DIR = ROOT.join('_posts')
OUTPUT_DIR = ROOT.join('assets/images/og')
CACHE_DIR = ROOT.join('.jekyll-cache/og-images')
WIDTH = 1200
HEIGHT = 630

def rsvg_convert
  @rsvg_convert ||= begin
    path = ENV['RSVG_CONVERT'] || find_executable('rsvg-convert')
    abort('rsvg-convert not found. Install librsvg: brew install librsvg, or apt-get install librsvg2-bin.') if path.empty?
    path
  end
end

def find_executable(name)
  ENV.fetch('PATH', '').split(File::PATH_SEPARATOR).each do |directory|
    path = File.join(directory, name)
    return path if File.executable?(path) && !File.directory?(path)
  end

  ''
end

def front_matter(path)
  source = File.read(path)
  match = source.match(/\A---\s*\n(.*?)\n---\s*\n/m)
  return {} unless match

  YAML.safe_load(match[1], permitted_classes: [Date, Time], aliases: true) || {}
end

def post_parts(path)
  basename = File.basename(path, '.md')
  match = basename.match(/\A(\d{4}-\d{2}-\d{2})-(.+)\z/)
  return unless match

  [match[1], match[2]]
end

def wrap_text(text, max_chars, max_lines)
  words = text.to_s.gsub(/\s+/, ' ').strip.split
  lines = []
  current = +''

  words.each do |word|
    candidate = current.empty? ? word : "#{current} #{word}"

    if candidate.length <= max_chars
      current = candidate
      next
    end

    lines << current unless current.empty?
    current = word
  end

  lines << current unless current.empty?
  return lines if lines.length <= max_lines

  clipped = lines.first(max_lines)
  clipped[-1] = clipped[-1].length >= max_chars ? "#{clipped[-1][0, max_chars - 1]}..." : "#{clipped[-1]}..."
  clipped
end

def title_layout(title)
  [86, 78, 70, 62].each do |size|
    max_chars = (900 / (size * 0.62)).floor
    lines = wrap_text(title, max_chars, 4)
    return [size, lines] if lines.length <= 3
  end

  size = 58
  [size, wrap_text(title, (900 / (size * 0.62)).floor, 4)]
end

def card_background_svg
  <<~SVG
    <defs>
      <clipPath id="card-clip">
        <rect x="0" y="0" width="#{WIDTH}" height="#{HEIGHT}"/>
      </clipPath>
      <filter id="soften">
        <feGaussianBlur stdDeviation="34"/>
      </filter>
      <linearGradient id="card-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f4ffff"/>
        <stop offset="0.55" stop-color="#eefafa"/>
        <stop offset="1" stop-color="#f1e1dc"/>
      </linearGradient>
    </defs>
    <g clip-path="url(#card-clip)">
      <rect width="#{WIDTH}" height="#{HEIGHT}" fill="url(#card-bg)"/>
      <path d="M -105 330 C 85 250 210 502 405 410 C 625 305 720 458 900 372 C 1040 305 1140 220 1290 255 L 1290 690 L -105 690 Z" fill="#bdc6d7" opacity="0.72" filter="url(#soften)"/>
      <path d="M 455 500 C 625 330 770 392 925 310 C 1054 242 1138 180 1275 206 L 1275 690 L 455 690 Z" fill="#d9bab6" opacity="0.68" filter="url(#soften)"/>
      <path d="M -70 458 C 165 350 250 550 438 500 C 578 462 652 360 804 414 C 925 457 1010 390 1140 305 L 1140 690 L -70 690 Z" fill="#aeb5c9" opacity="0.54" filter="url(#soften)"/>
      <rect width="#{WIDTH}" height="#{HEIGHT}" fill="#ffffff" opacity="0.08"/>
    </g>
  SVG
end

def site_svg
  <<~SVG
    <svg xmlns="http://www.w3.org/2000/svg" width="#{WIDTH}" height="#{HEIGHT}" viewBox="0 0 #{WIDTH} #{HEIGHT}">
      #{card_background_svg}
      <text x="112" y="352" font-family="Fira Code, Menlo, Consolas, monospace" font-size="88" font-weight="700" fill="#111111" letter-spacing="0">gumadeiras.com</text>
    </svg>
  SVG
end

def post_svg(title:, url:, date:)
  title_size, title_lines = title_layout(title)
  title_line_height = (title_size * 1.18).round
  title_start_y = 235

  title_tspans = title_lines.each_with_index.map do |line, index|
    y = title_start_y + (index * title_line_height)
    %(<tspan x="112" y="#{y}">#{CGI.escapeHTML(line)}</tspan>)
  end.join

  <<~SVG
    <svg xmlns="http://www.w3.org/2000/svg" width="#{WIDTH}" height="#{HEIGHT}" viewBox="0 0 #{WIDTH} #{HEIGHT}">
      #{card_background_svg}
      <text font-family="Fira Code, Menlo, Consolas, monospace" font-size="#{title_size}" font-weight="700" fill="#111111" letter-spacing="0">#{title_tspans}</text>
      <text x="112" y="#{title_start_y + (title_lines.length * title_line_height) + 44}" font-family="Fira Code, Menlo, Consolas, monospace" font-size="25" fill="#111111" opacity="0.78" letter-spacing="0">#{CGI.escapeHTML(date)}</text>
      <text x="112" y="#{title_start_y + (title_lines.length * title_line_height) + 80}" font-family="Fira Code, Menlo, Consolas, monospace" font-size="25" fill="#111111" opacity="0.78" letter-spacing="0">#{CGI.escapeHTML(url)}</text>
    </svg>
  SVG
end

def write_png(svg, output_path)
  FileUtils.mkdir_p(output_path.dirname)

  Tempfile.create(['og-image', '.svg']) do |file|
    file.write(svg)
    file.flush

    stdout, stderr, status = Open3.capture3(rsvg_convert, '--format=png', '--output', output_path.to_s, file.path)
    abort("rsvg-convert failed for #{output_path}:\n#{stdout}\n#{stderr}") unless status.success?
  end
end

generated = 0
site_output_path = OUTPUT_DIR.join('site.png')
site_svg = site_svg()
site_digest = Digest::SHA256.hexdigest(site_svg)
site_digest_path = CACHE_DIR.join('site.sha256')

unless site_output_path.file? && site_digest_path.file? && site_digest_path.read == site_digest
  write_png(site_svg, site_output_path)
  FileUtils.mkdir_p(site_digest_path.dirname)
  site_digest_path.write(site_digest)
  generated += 1
end

Dir.glob(POSTS_DIR.join('*.md')).sort.each do |post_path|
  parts = post_parts(post_path)
  next unless parts

  data = front_matter(post_path)
  next if data['published'] == false

  date, slug = parts
  title = data.fetch('title')
  url = "gumadeiras.com/#{date[0, 4]}/#{date[5, 2]}/#{date[8, 2]}/#{slug}"
  display_date = Date.parse(date).strftime('%b %-d, %Y')
  output_path = OUTPUT_DIR.join("#{date}-#{slug}.png")
  svg = post_svg(title: title, url: url, date: display_date)
  digest = Digest::SHA256.hexdigest(svg)
  digest_path = CACHE_DIR.join("#{date}-#{slug}.sha256")

  next if output_path.file? && digest_path.file? && digest_path.read == digest

  write_png(svg, output_path)
  FileUtils.mkdir_p(digest_path.dirname)
  digest_path.write(digest)
  generated += 1
end

puts "generated #{generated} og image#{generated == 1 ? '' : 's'}"
