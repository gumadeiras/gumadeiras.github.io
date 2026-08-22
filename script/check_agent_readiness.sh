#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

port="${AGENT_READINESS_PORT:-4178}"
site_url="http://127.0.0.1:${port}"

script/build_site.sh
bundle _2.7.1_ exec jekyll serve --skip-initial-build --no-watch --host 127.0.0.1 --port "$port" &
server_pid=$!

cleanup() {
  kill -INT "$server_pid" 2>/dev/null || true
  wait "$server_pid" 2>/dev/null || true
}
trap cleanup EXIT

for _attempt in {1..40}; do
  if curl --fail --silent "$site_url/" >/dev/null 2>&1; then
    SITE_URL="$site_url" bundle _2.7.1_ exec ruby script/test_agent_readiness.rb
    exit
  fi
  sleep 0.25
done

echo "local Jekyll server did not start at $site_url" >&2
exit 1
