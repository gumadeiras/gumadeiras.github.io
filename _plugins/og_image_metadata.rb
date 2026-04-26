# frozen_string_literal: true

module Gumadeiras
  module OgImageMetadata
    module_function

    def image_path(post)
      basename = post.basename_without_ext
      match = basename.match(/\A(\d{4}-\d{2}-\d{2})-(.+)\z/)
      return unless match

      "/assets/images/og/#{match[1]}-#{match[2]}.png"
    end
  end
end

Jekyll::Hooks.register :posts, :pre_render do |post|
  next if post.data.key?('image')
  next if post.data['published'] == false

  path = Gumadeiras::OgImageMetadata.image_path(post)
  next unless path

  post.data['image'] = {
    'path' => path,
    'width' => 1200,
    'height' => 630,
    'alt' => post.data['title']
  }
end
