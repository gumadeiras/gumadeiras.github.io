# gumadeiras.com

Personal website of **Gustavo Madeira Santana** — researcher, computer engineer, neuroscientist.

🌐 **Live site:** [gumadeiras.com](https://gumadeiras.com/)

---

## Tech Stack

- **Framework:** [Jekyll](https://jekyllrb.com/)
- **Hosting:** GitHub Pages
- **Font:** [Fira Code](https://fonts.google.com/specimen/Fira+Code)
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
# Install dependencies
bundle install

# Run locally
bundle exec jekyll serve

# Visit http://localhost:4000
```

## License

Content © Gustavo Madeira Santana. Code under [MIT License](LICENSE.md).

---

*Built with ☕ and 🧠*
