#!/bin/sh
# Build the static site and publish it on the gh-pages branch (GitHub Pages).
# Everything runs in the browser, so the build is the whole app.
#   scripts/deploy-pages.sh            build, commit to gh-pages, push to origin
#   NO_PUSH=1 scripts/deploy-pages.sh  build and commit only
set -eu
cd "$(dirname "$0")/.."

bun run build
rev=$(git rev-parse --short HEAD)
tmp=$(mktemp -d)
trap 'git worktree remove --force "$tmp" 2>/dev/null || true' EXIT

if git show-ref --verify --quiet refs/heads/gh-pages; then
  git worktree add -q "$tmp" gh-pages
elif git ls-remote --exit-code --heads origin gh-pages >/dev/null 2>&1; then
  git fetch -q origin gh-pages
  git worktree add -q -B gh-pages "$tmp" origin/gh-pages
else
  # First deploy: an orphan branch holding only the site.
  git worktree add -q --detach "$tmp"
  (cd "$tmp" && git checkout -q --orphan gh-pages && git rm -rq --cached .)
fi

find "$tmp" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -r web/dist/. "$tmp"/
touch "$tmp/.nojekyll" # serve every file as is (no Jekyll processing)

cd "$tmp"
git add -A
if git commit -qm "Deploy $rev"; then echo "gh-pages: committed the build of $rev"; else echo "gh-pages: no change"; fi
[ -n "${NO_PUSH:-}" ] || git push -u origin gh-pages
