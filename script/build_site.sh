#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

if ! ruby -e 'exit RUBY_VERSION.start_with?("3.2.") ? 0 : 1' >/dev/null 2>&1; then
  if [[ -x /opt/homebrew/opt/ruby@3.2/bin/ruby ]]; then
    export PATH="/opt/homebrew/opt/ruby@3.2/bin:$PATH"
  fi
fi

baseurl=""
args=("$@")

for ((i = 0; i < ${#args[@]}; i++)); do
  case "${args[i]}" in
    --baseurl)
      if (( i + 1 < ${#args[@]} )); then
        baseurl="${args[i + 1]}"
      fi
      ;;
    --baseurl=*)
      baseurl="${args[i]#*=}"
      ;;
  esac
done

export JEKYLL_ENV="${JEKYLL_ENV:-production}"

ruby script/generate_og_images.rb
bundle _2.7.1_ exec jekyll build "${args[@]}"
ruby script/fingerprint_assets.rb _site "${SITE_URL:-https://gumadeiras.com}" "$baseurl"
