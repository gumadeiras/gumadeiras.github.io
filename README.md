# gumadeiras.com

Personal website of **Gustavo Madeira Santana** — researcher, computer engineer, neuroscientist.

Live site: [gumadeiras.com](https://gumadeiras.com/)

## Tech Stack

- **Framework:** [Jekyll](https://jekyllrb.com/)
- **Hosting:** GitHub Pages via GitHub Actions
- **Font:** self-hosted Fira Code subsets (`woff2`)
- **Plugins:** jekyll-paginate, jekyll-seo-tag, jekyll-sitemap

## Structure

```
├── _config.yml       # Site configuration
├── _data/
│   └── papers.yml    # Publications with citation counts
├── _includes/        # Reusable components
├── _layouts/         # Page templates
├── _posts/           # Blog posts
├── _sass/            # Stylesheets
├── assets/           # Static files (images, css, js)
└── index.html        # Homepage
```

## Publications

Papers are managed in `_data/papers.yml` with citation counts that are automatically updated weekly by Pinguini, my Pi agent and assistant 🐧

## Local Development

```bash
# Install Ruby 3.2 via Homebrew
brew install ruby@3.2
export PATH="/opt/homebrew/opt/ruby@3.2/bin:$PATH"

# Install Bundler if needed
gem install bundler:2.7.1

# Install dependencies
bundle install

# Run the same build path used in production
script/build_site.sh

# Or run a local dev server
bundle exec jekyll serve

# Visit http://localhost:4000
```

The production site is built by `.github/workflows/jekyll.yml` and deployed to GitHub Pages. `script/build_site.sh` runs Jekyll and fingerprints CSS, fonts, and image assets in the generated `_site` output to improve cacheability.

## Publishing Posts

Create a Markdown file in `_posts` named `YYYY-MM-DD-slug.md` with frontmatter like:

```yaml
---
layout: post
title: My Post Title
description: Short description for previews
summary: Short description for feeds
---
```

By default, published posts will render at `/YYYY/MM/DD/slug`, use the shared post layout, and appear in the feeds. If you want to keep a draft in `_posts` without publishing it yet, add `published: false`.

The homepage is still paper-focused today. If you want blog posts surfaced on the homepage or in a dedicated blog index, that would be a separate UI change.

## License

Content © Gustavo Madeira Santana. Code under [MIT License](LICENSE.md).

Built with Jekyll and GitHub Pages.
