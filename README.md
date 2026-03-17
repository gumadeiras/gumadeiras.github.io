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
gem install bundler:2.2.9

# Install dependencies
bundle _2.2.9_ install

# Run the same build path used in production
script/build_site.sh

# Or run a local dev server
bundle _2.2.9_ exec jekyll serve

# Visit http://localhost:4000
```

The production site is built by `.github/workflows/jekyll.yml` and deployed to GitHub Pages. `script/build_site.sh` runs Jekyll and fingerprints CSS, fonts, and image assets in the generated `_site` output to improve cacheability.

## License

Content © Gustavo Madeira Santana. Code under [MIT License](LICENSE.md).

Built with Jekyll and GitHub Pages.
