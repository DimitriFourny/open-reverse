#!/bin/sh
# Fetch and build OpenDecomp (git submodule), then install OpenReverse dependencies.
set -eu
cd "$(dirname "$0")/.."

node -e 'process.exit(Number(process.versions.node.split(".")[0]) >= 24 ? 0 : 1)' || {
  echo "OpenReverse requires Node.js 24+ (found $(node --version))." >&2
  exit 1
}
command -v bun >/dev/null 2>&1 || {
  echo "OpenDecomp is built with Bun 1.4.3: npm i -g bun@1.4.3" >&2
  exit 1
}

git submodule update --init vendor/open-decomp
(cd vendor/open-decomp && bun install --frozen-lockfile && bun run build)
npm install
echo "Setup complete. Run 'npm run dev' (development) or 'npm run build && npm start'."
