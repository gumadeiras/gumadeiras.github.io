#!/usr/bin/env ruby
# frozen_string_literal: true

require 'fileutils'
require 'nokogiri'
require 'pathname'
require 'reverse_markdown'

site_dir = Pathname(ARGV[0] || '_site').expand_path
abort("site directory not found: #{site_dir}") unless site_dir.directory?

generated = 0

Dir.glob(site_dir.join('**/*.html')).sort.each do |html_path|
  document = Nokogiri::HTML(File.read(html_path))
  main = document.at_css('main')
  next unless main

  main.css('script, style, [data-theme-toggle]').remove
  main.css('img[alt=""]').remove
  main.css('details').each { |details| details.name = 'div' }
  main.css('summary').each { |summary| summary.name = 'h2' }
  main.css('a[href^="#"]').each do |anchor|
    anchor.remove if anchor.text.strip == '#'
  end

  markdown = ReverseMarkdown.convert(
    main.inner_html,
    github_flavored: true,
    unknown_tags: :bypass
  )
  markdown = markdown.lines.map(&:rstrip).join("\n").gsub(/\n{3,}/, "\n\n").strip
  next if markdown.empty?

  output_path = Pathname(html_path.sub(/\.html\z/, '.md'))
  FileUtils.mkdir_p(output_path.dirname)
  output_path.write("#{markdown}\n")
  generated += 1
end

puts "generated #{generated} markdown representation#{generated == 1 ? '' : 's'}"
