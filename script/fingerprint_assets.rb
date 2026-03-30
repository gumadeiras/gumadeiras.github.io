#!/usr/bin/env ruby
# frozen_string_literal: true

require 'digest'
require 'pathname'

site_dir = Pathname(ARGV[0] || '_site').expand_path
site_url = (ARGV[1] || '').sub(%r{/\z}, '')
baseurl = (ARGV[2] || '').sub(%r{/\z}, '')
baseurl = '' if baseurl == '/'

abort("site directory not found: #{site_dir}") unless site_dir.directory?

TEXT_EXTENSIONS = %w[.css .html .json .txt .xml].freeze
FINGERPRINT_GLOBS = [
  'assets/css/*.css',
  'assets/fonts/*.{woff,woff2,ttf,otf}',
  'assets/images/*.{jpg,jpeg,png,svg,webp,avif,gif}'
].freeze

fingerprinted_paths = Dir.glob(FINGERPRINT_GLOBS.map { |pattern| site_dir.join(pattern).to_s }).sort

replacements = {}

fingerprinted_paths.each do |asset_path|
  next unless File.file?(asset_path)

  absolute_path = Pathname(asset_path)
  relative_path = absolute_path.relative_path_from(site_dir).to_s
  extension = absolute_path.extname
  basename = absolute_path.basename(extension).to_s
  digest = Digest::SHA256.file(asset_path).hexdigest[0, 12]
  digested_relative_path = File.join(File.dirname(relative_path), "#{basename}-#{digest}#{extension}").sub(%r{\A\./}, '')
  digested_absolute_path = site_dir.join(digested_relative_path)

  File.rename(asset_path, digested_absolute_path)

  original_public_path = "/#{relative_path}"
  digested_public_path = "/#{digested_relative_path}"

  replacements[original_public_path] = digested_public_path
  unless baseurl.empty?
    replacements["#{baseurl}#{original_public_path}"] = "#{baseurl}#{digested_public_path}"
  end
  replacements["#{site_url}#{original_public_path}"] = "#{site_url}#{digested_public_path}" unless site_url.empty?
  unless site_url.empty? || baseurl.empty?
    replacements["#{site_url}#{baseurl}#{original_public_path}"] = "#{site_url}#{baseurl}#{digested_public_path}"
  end
end

text_files = Dir.glob(site_dir.join('**', '*').to_s).select do |candidate|
  File.file?(candidate) && TEXT_EXTENSIONS.include?(File.extname(candidate))
end

ordered_replacements = replacements.sort_by { |from, _to| -from.length }

text_files.each do |text_file|
  original_content = File.binread(text_file)
  updated_content = original_content.dup

  ordered_replacements.each do |from, to|
    updated_content.gsub!(from, to)
  end

  next if updated_content == original_content

  File.binwrite(text_file, updated_content)
end
