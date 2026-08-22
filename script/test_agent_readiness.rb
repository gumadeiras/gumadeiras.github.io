#!/usr/bin/env ruby
# frozen_string_literal: true

require 'json'
require 'net/http'
require 'nokogiri'
require 'pathname'
require 'uri'

ROOT = Pathname(__dir__).parent.expand_path
SITE = ROOT.join('_site')
REQUIRED_RECOVERY_PATHS = %w[/ /sitemap.xml /llms.txt].freeze
REDIRECT_PATHS = %w[/qbiowc/ /2026/04/26/memex].freeze

class Checks
  def initialize
    @failures = []
    @passes = 0
  end

  def assert(label)
    if yield
      @passes += 1
    else
      @failures << label
    end
  rescue StandardError => error
    @failures << "#{label}: #{error.class}: #{error.message}"
  end

  def finish
    if @failures.empty?
      puts "passed #{@passes} agent-readiness checks"
      return
    end

    warn "failed #{@failures.length} agent-readiness checks:"
    @failures.each { |failure| warn "- #{failure}" }
    exit 1
  end
end

def html(path)
  Nokogiri::HTML(path.read)
end

def readable_characters(path)
  html(path).at_css('main').text.gsub(/\s+/, ' ').strip.length
end

def candidates_for(url_path)
  path = URI.decode_www_form_component(url_path).delete_prefix('/')
  direct = SITE.join(path)
  return [SITE.join('index.html')] if path.empty?
  return [direct.join('index.html')] if url_path.end_with?('/')
  return [direct] unless File.extname(path).empty?

  [direct, Pathname("#{direct}.html"), direct.join('index.html')]
end

def generated_url_for(path)
  relative = path.relative_path_from(SITE).to_s
  return '/' if relative == 'index.html'
  return "/#{relative.delete_suffix('index.html')}" if relative.end_with?('/index.html')

  "/#{relative.delete_suffix('.html')}"
end

def local_links
  Dir[SITE.join('**/*.html')].flat_map do |path|
    document = html(Pathname(path))
    base = "https://gumadeiras.com#{generated_url_for(Pathname(path))}"

    document.css('a[href], link[href]').filter_map do |element|
      href = element['href']
      next if href.nil? || href.empty? || href.start_with?('#', 'mailto:', 'tel:', 'javascript:')

      url = URI.join(base, href)
      next unless url.host == 'gumadeiras.com'

      [path, href, url.path]
    rescue URI::InvalidURIError
      [path, href, nil]
    end
  end
end

def json_ld_documents
  Dir[SITE.join('**/*.html')].flat_map do |path|
    html(Pathname(path)).css('script[type="application/ld+json"]').map do |script|
      [path, JSON.parse(script.text)]
    end
  end
end

def contains_key?(value, forbidden)
  case value
  when Hash
    value.any? { |key, child| forbidden.include?(key) || contains_key?(child, forbidden) }
  when Array
    value.any? { |child| contains_key?(child, forbidden) }
  else
    false
  end
end

def request(base_url, path, accept: nil, head: false)
  uri = URI.join(base_url, path)
  request_class = head ? Net::HTTP::Head : Net::HTTP::Get
  request = request_class.new(uri.request_uri)
  request['Accept'] = accept if accept
  Net::HTTP.start(uri.host, uri.port) { |http| http.request(request) }
end

checks = Checks.new

checks.assert('generated site exists') { SITE.directory? }

required_files = %w[
  index.html llms.txt sitemap.xml robots.txt 404.html 404.md
  about/index.html contact/index.html privacy/index.html
].map { |path| SITE.join(path) }
checks.assert('required pages and machine-readable files exist') { required_files.all?(&:file?) }

homepage = html(SITE.join('index.html'))
homepage_h1 = homepage.css('main h1')
checks.assert('homepage has exactly one meaningful h1') do
  homepage_h1.length == 1 && homepage_h1.first.text.downcase.include?('gustavo madeira santana')
end
checks.assert('homepage keeps substantive static content') { readable_characters(SITE.join('index.html')) > 500 }
checks.assert('homepage h1 keeps the existing plain visual treatment') { homepage_h1.first['class'].to_s.split.include?('plain-title') }

%w[about contact privacy].each do |page|
  checks.assert("#{page} page has at least 500 readable characters") do
    readable_characters(SITE.join(page, 'index.html')) >= 500
  end
end

llms = SITE.join('llms.txt').read
checks.assert('llms.txt has exactly one h1') { llms.scan(/^# /).length == 1 }
checks.assert('llms.txt explains when to use the site') { llms.include?('When to use this site') }
checks.assert('llms.txt denies nonexistent services') do
  llms.include?('does not provide an API, authentication system, webhook service, or MCP server')
end
%w[/ /archive/ /about/ /contact/ /privacy/ /sitemap.xml].each do |path|
  checks.assert("llms.txt links #{path}") { llms.include?("https://gumadeiras.com#{path}") }
end

broken_links = local_links.reject do |_source, _href, path|
  path && candidates_for(path).any?(&:file?)
end
checks.assert('all generated internal links resolve') { broken_links.empty? }

json_documents = json_ld_documents
person = json_documents.find { |_path, data| data['@type'] == 'Person' }&.last
checks.assert('homepage has accurate Person JSON-LD') do
  person && person.values_at('name', 'description', 'url', 'jobTitle').all? { |value| !value.to_s.empty? }
end
checks.assert('Person JSON-LD uses verified sameAs links') do
  person && %w[
    https://github.com/gumadeiras
    https://scholar.google.com/citations?user=L603SPwAAAAJ
    https://www.linkedin.com/in/gumadeiras/
    https://x.com/gumadeiras
  ].all? { |url| person.fetch('sameAs').include?(url) }
end
checks.assert('JSON-LD has no Organization') do
  json_documents.none? { |_path, data| JSON.generate(data).include?('Organization') }
end
checks.assert('JSON-LD has no address, telephone, or contact point') do
  forbidden = %w[address telephone contactPoint]
  json_documents.none? { |_path, data| contains_key?(data, forbidden) }
end
checks.assert('WebSite JSON-LD appears only on the homepage') do
  json_documents.select { |_path, data| data['@type'] == 'WebSite' }.map(&:first) == [SITE.join('index.html').to_s]
end
checks.assert('favicon and visible logo assets remain') do
  %w[favicon.ico favicon.png apple-touch-icon.png assets/images/me.jpg].all? { |path| ROOT.join(path).file? }
end

sitemap = SITE.join('sitemap.xml').read
checks.assert('sitemap excludes redirect-only URLs') { REDIRECT_PATHS.none? { |path| sitemap.include?(path) } }
checks.assert('redirect stubs remain explicit static-host near-misses') do
  qbiowc = SITE.join('qbiowc/index.html').read
  memex = candidates_for('/2026/04/26/memex').find(&:file?).read
  [qbiowc, memex].all? { |body| body.match?(/http-equiv=["']refresh["']/i) } &&
    [qbiowc, memex].none? { |body| body.match?(/location\.(?:href|replace)|window\.location/i) }
end

html_pages = Dir[SITE.join('**/*.html')].map { |path| Pathname(path) }.select { |path| html(path).at_css('main') }
checks.assert('every rendered content page has a generated Markdown sibling') do
  html_pages.all? { |path| Pathname(path.to_s.sub(/\.html\z/, '.md')).file? }
end
checks.assert('generated Markdown is useful text, not an HTML dump') do
  html_pages.all? do |path|
    markdown = Pathname(path.to_s.sub(/\.html\z/, '.md')).read
    markdown.length > 80 && !markdown.include?('<main') && markdown.match?(/^# /)
  end
end
checks.assert('homepage Markdown keeps one h1 and lower heading levels') do
  markdown = SITE.join('index.md').read
  markdown.scan(/^# /).length == 1 && markdown.include?('## links (involved)')
end
checks.assert('HTML pages advertise retrievable Markdown siblings and llms.txt') do
  html_pages.all? do |path|
    document = html(path)
    markdown_link = document.at_css('link[rel="alternate"][type="text/markdown"]')
    llms_link = document.at_css('link[rel="alternate"][type="text/plain"][href$="llms.txt"]')
    markdown_link && llms_link && candidates_for(markdown_link['href']).any?(&:file?)
  end
end

recovery_links = html(SITE.join('404.html')).css('main a[href]').map { |link| link['href'] }
checks.assert('HTML 404 contains every required recovery link') do
  REQUIRED_RECOVERY_PATHS.all? { |path| recovery_links.include?(path) }
end
markdown_404 = SITE.join('404.md').read
checks.assert('Markdown 404 contains every required recovery link') do
  REQUIRED_RECOVERY_PATHS.all? { |path| markdown_404.include?("](#{path})") }
end

if ENV['SITE_URL']
  base_url = ENV.fetch('SITE_URL')
  homepage_html = request(base_url, '/', accept: 'text/html')
  homepage_markdown_request = request(base_url, '/', accept: 'text/markdown')

  checks.assert('local server returns static HTML for the homepage') do
    homepage_html.code == '200' && homepage_html['content-type'].to_s.include?('text/html')
  end
  checks.assert('GitHub Pages constraint: Accept markdown still returns HTML') do
    homepage_markdown_request.code == '200' && homepage_markdown_request['content-type'].to_s.include?('text/html')
  end
  checks.assert('GitHub Pages constraint: Vary does not contain Accept') do
    !homepage_markdown_request['vary'].to_s.downcase.split(',').map(&:strip).include?('accept')
  end
  checks.assert('explicit Markdown sibling is retrievable') do
    response = request(base_url, '/index.md', accept: 'text/markdown')
    response.code == '200' && response['content-type'].to_s.include?('text/markdown') &&
      response.body.include?('# [hello.]')
  end

  REDIRECT_PATHS.each do |path|
    checks.assert("GitHub Pages constraint: GET #{path} is a meta-refresh 200") do
      response = request(base_url, "#{path}?source=agent")
      response.code == '200' && response.body.match?(/http-equiv=["']refresh["']/i)
    end
    checks.assert("GitHub Pages constraint: HEAD #{path} cannot emit a permanent redirect") do
      response = request(base_url, path, head: true)
      response.code == '200' && response['location'].nil?
    end
  end

  unknown_html = request(base_url, '/definitely-missing-agent-check', accept: 'text/html')
  unknown_markdown = request(base_url, '/definitely-missing-agent-check', accept: 'text/markdown')
  checks.assert('unknown HTML path returns a real 404 with recovery content') do
    unknown_html.code == '404' && REQUIRED_RECOVERY_PATHS.all? { |path| unknown_html.body.include?("href=\"#{path}\"") }
  end
  checks.assert('GitHub Pages constraint: Markdown unknown path returns the HTML 404') do
    unknown_markdown.code == '404' && unknown_markdown['content-type'].to_s.include?('text/html')
  end

  puts 'blocked by selected static hosting: permanent HTTP redirects, canonical Accept negotiation, 406, Vary: Accept, and Markdown 404 selection'
end

checks.finish
