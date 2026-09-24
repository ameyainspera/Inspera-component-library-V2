# Using Inspera to guide AI-built projects

This repo is both the **interactive reference site** for the Inspera Design System and its **distribution hub**. One source of truth feeds three outputs, each matched to what a given AI builder can actually consume, so projects stay on-brand whichever tool builds them.

## Source of truth

- `src/components/inspera/*` - the React components. Styled with inline styles, `var(--token)` values and `src/imports/runtime.css`; no Tailwind, so they render the same in any app.
- `src/data/tokens.ts` - token values.
- `src/data/components.ts` - component semantics: purpose, rules, accessibility, do and don't.
- `src/docs/registry.tsx` - the playground controls, snippets and gallery for each component. The spec's examples come from here too.

Everything below is generated or packaged from these. Nothing is maintained twice.

## The three outputs

| Output | For | Enforcement | Command |
| --- | --- | --- | --- |
| **npm package** `@inspera/components` | Code-based builders (Cursor, v0, Lovable, Bolt) and hand-written React | Strong - real importable components | `pnpm build:pkg` (`packages/components/`) |
| **Portable spec** `public/llms.txt`, `llms-full.txt`, `c/<slug>.md`, `api.json`, `tokens.w3c.json`, `rules/*` | Any LLM tool (Claude, ChatGPT, paste or link) | Advisory - the model follows it | `pnpm generate` |
| **Figma Make kit** `kit/` | Figma Make | Strongest, but Make-only | `pnpm generate`, then publish in Figma (`kit/README.md`) |

The package is not published yet: the `@inspera` npm scope is unclaimed (`src/data/distribution.ts` holds that status, and the Integrate page shows it).

## Regenerate everything

```bash
pnpm generate    # tokens.css, portable spec, rules files, kit, package styles.css + README blocks
pnpm build:pkg   # @inspera/components -> packages/components/dist (ESM + .d.ts)
```

`pnpm verify:generated` regenerates in memory and fails if any committed output differs, so a source change can't ship without its outputs.

## Checks

No browser needed:

```bash
pnpm typecheck
pnpm verify:generated
pnpm audit:snippets   # every playground control reaches the JSX and the gallery
pnpm audit:pages      # example pages: component lists and download bundles
pnpm audit:search
pnpm audit:ascii      # shipped text files are plain ASCII
```

Chrome, with the dev server running for the last two:

```bash
pnpm audit:recipes    # HTML+CSS recipes match their components element for element
pnpm audit:spec       # components render correctly from the spec alone
pnpm audit:layout     # playground and gallery fit on every component page
pnpm test:a11y        # axe + keyboard interactions on every component page
```

## Honest limits

- **npm package** works only where dependencies can be installed; the consumer wires fonts (the package README lists the imports).
- **Portable spec** is advisory - nothing enforces it; it's the universal fallback.
- **Make kit** truly enforces, but only inside Figma Make, and publishing is a manual Figma action.
