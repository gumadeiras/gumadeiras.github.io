# gumadeiras.com

Personal website of **Gustavo Madeira Santana** — researcher, computer engineer, neuroscientist.

🌐 **Live site:** [gumadeiras.com](https://gumadeiras.com/)

---

## About

I'm a PhD student in Neuroscience at Yale University, working at the intersection of olfaction, vision, and neural computation in *Drosophila*. My research focuses on understanding how flies detect and navigate odor gradients.

Previously, I worked on low-power digital signal processing and audio/video compression algorithms.

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

Papers are managed in `_data/papers.yml` with citation counts that are automatically updated weekly via my assistant [Pinguini](https://github.com/gumadeiras/clawd) 🐧

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
