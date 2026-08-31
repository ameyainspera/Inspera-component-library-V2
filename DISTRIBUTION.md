# Using Inspera to guide AI-built projects

This repo is both the **interactive reference site** for the Inspera Design System and its **distribution hub**. One source of truth feeds three outputs, each matched to what a given AI builder can actually consume — so future projects stay on-brand no matter which tool builds them.

## Source of truth

- `src/components/inspera/*` — the 42 real, token-styled React components
- `src/data/tokens.ts` — canonical token values
- `src/data/components.ts` — the semantic spec (purpose, a11y, usage, aliases)
- the `*Props` TypeScript interfaces in `src/components/inspera/*` — the prop APIs

Everything below is generated or packaged from these — nothing is maintained twice.

## The three outputs

| Output | For | Enforcement | Command |
| --- | --- | --- | --- |
| **npm package** `@inspera/components` | Hand-written React, once published | Strong — real importable components, but **not published yet** | `pnpm build:pkg` (`packages/components/`) |
| **Portable spec** `public/llms.txt` + `public/c/<slug>.md` + `public/tokens.w3c.json` | Any LLM tool (Claude, ChatGPT, paste/link) | Advisory — the model follows it | `pnpm generate` |
| **Figma Make kit** `kit/` | Figma Make specifically | Strongest, but Make-only | `pnpm generate` + publish in Figma (`kit/README.md`) |

## Regenerate everything

```bash
pnpm generate    # portable spec, W3C tokens, kit docs/styles/manifest
pnpm build:pkg   # @inspera/components → dist (ESM + .d.ts)
```

`pnpm generate` re-derives all generated files from `src/`, so the outputs can never drift from the live reference site.

## Honest limits

- **npm package** is **not published**. It builds from this repo, but the
  `@inspera` scope is unclaimed, so `npm i @inspera/components` returns a 404.
  Status lives in `src/data/distribution.ts` — flipping `published` there
  updates the site and every generated spec. Note that even once published on a
  private registry, most AI builders (v0, Lovable, Bolt, Figma Make) cannot
  authenticate, so the portable spec stays their only route.
- **Portable spec** is advisory — nothing enforces it; it's the universal fallback.
- **Make kit** truly enforces, but only inside Figma Make, and publishing is a manual Figma action.
