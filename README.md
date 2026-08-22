# gumadeiras.com

Personal site for Gustavo Madeira Santana.

[gumadeiras.com](https://gumadeiras.com/)

## Local

```bash
bundle install
script/build_site.sh
bundle exec jekyll serve
```

`script/build_site.sh` generates social preview images for posts before the Jekyll build. It needs `rsvg-convert` locally (`brew install librsvg`). It also generates static Markdown siblings beside rendered HTML pages. These files give agents a direct alternate resource on GitHub Pages. GitHub Pages cannot negotiate them at each page's canonical URL.

Run the agent-readiness checks with:

```bash
script/check_agent_readiness.sh
```

## Stack

Jekyll. GitHub Pages. GitHub Actions. Hover DNS.

The selected hosting architecture is intentionally static. Request-dependent HTTP redirects, `Accept` negotiation, `406` responses, and `Vary: Accept` are not available on GitHub Pages.

## License

Content © Gustavo Madeira Santana. Code: [MIT](LICENSE.md).
