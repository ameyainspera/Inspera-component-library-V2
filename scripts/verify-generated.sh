#!/usr/bin/env bash
# Fail if any generated file is stale relative to its source.
#
# This is the guardrail behind the claim that generated outputs cannot drift.
# Before it existed, the shipped tokens.css still defined --secondary months
# after it was removed from source, and kit/guidelines/tokens.md documented a
# palette that no stylesheet actually contained.
set -euo pipefail

PATHS=(
  src/tokens.css
  src/data/component-api.generated.ts
  src/data/component-docs.generated.ts
  public
  kit
  packages/components/tokens.css
)

pnpm generate

# --porcelain reports modified *and* untracked files under these paths.
DIRTY="$(git status --porcelain -- "${PATHS[@]}")"

if [ -n "$DIRTY" ]; then
  echo ""
  echo "✗ Generated files are stale. Run 'pnpm generate' and commit the result."
  echo ""
  echo "$DIRTY"
  exit 1
fi

echo "✓ Generated files are up to date."
