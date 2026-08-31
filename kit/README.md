# Inspera Figma Make Kit

Kit authoring tree for Figma Make. It enforces the Inspera Design System *inside Figma Make* — once installed, the Make agent must build with these components, tokens, and guidance.

## Layout

```
kit/
  .figma/make/kit.json     manifest (generated)
  styles.css               token custom properties (generated)
  src/index.ts             component barrel (single-sourced from the library)
  guidelines/
    Guidelines.md          entry — "MUST READ" manifest
    overview.md            look & feel
    setup.md               install + font wiring
    tokens.md              token reference (generated)
    components.md          component catalog + APIs (generated)
    icons.md               icon set + rules
```

Generated files (`kit.json`, `styles.css`, `tokens.md`, `components.md`) come from `pnpm generate` at the repo root and must not be hand-edited — they stay in sync with the source of truth in `src/`.

## Publishing (manual, in Figma)

The in-sandbox CLI can only *consume/reconcile* kits, not publish them. Publishing is a Figma product-UI action:

1. Run `pnpm generate` and `pnpm build:pkg` so this tree and the package output are current.
2. In Figma Make, open **Kits → Create / Publish kit** and point it at this `kit/` directory (or the published `@inspera/kit` package).
3. Confirm the manifest (`.figma/make/kit.json`), `styles.css`, and `guidelines/Guidelines.md` are detected.
4. Publish. New Make projects can then attach the Inspera kit and will be constrained to it.

## Limits

Kit enforcement is **Figma-Make-only**. For other AI builders, use `@inspera/components` (npm) or the portable spec at `public/llms.txt`.
