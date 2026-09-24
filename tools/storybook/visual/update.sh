#!/usr/bin/env bash
# Re-generates visual baselines inside the same Playwright image CI uses, so fonts and Chromium match byte for byte.
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
image="mcr.microsoft.com/playwright:v$(cd "$root/tools/storybook" && node -p "require('@playwright/test/package.json').version")-noble"

cd "$root"
bun run storybook:build
docker run --rm \
  --user "$(id -u):$(id -g)" \
  --env HOME=/tmp \
  --volume "$root:/work" \
  --workdir /work/tools/storybook \
  "$image" \
  node_modules/.bin/playwright test --config visual/playwright.config.ts --update-snapshots "$@"
