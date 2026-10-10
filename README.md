# Inspera Design System

The canonical Inspera component library: an interactive reference site, the real
React components the product is built from, and the distribution layer that lets
any AI tool generate on-brand Inspera UI.

```bash
pnpm install
pnpm dev        # reference site on :8443 (override with PORT)
pnpm generate   # re-derive every distributed artifact from source
pnpm build:pkg  # build @inspera/components
```

## Source of truth

There is exactly one, and it is the code. Three files answer three different
questions, and nothing else is authoritative:

| Question | Authoritative source |
| --- | --- |
| What props does a component take? | The `*Props` TypeScript interfaces in `src/components/inspera/*.tsx` |
| What does a component mean, its purpose, a11y contract, do/don't, legacy names? | `src/data/components.ts` |
| What are the tokens? | `src/data/tokens.ts` |

Everything else in this repo, `public/`, `kit/`, `packages/components/styles.css`,
is **generated** from those by `scripts/build-portable.ts`. Generated files
carry a "do not edit" header and are verified in CI (`pnpm generate` must leave
the tree clean).

One folder is neither source nor generated: `design-md/`, the design guide
(DESIGN.md and its references), written by the design system team. It says how
to design an Inspera screen; the code above says how each component is built.
It is published exactly as received and never edited here. See
[The design guide](#the-design-guide).

## Repository layout

```
src/components/inspera/   The real components. The product builds against these.
src/data/                 Component semantics, tokens, icons, navigation.
src/docs/                 The reference site (Foundations, per-component pages, Icons, Integrate).
src/imports/tokens.css    Token custom properties (generated from src/data/tokens.ts).
src/imports/runtime.css   Icon helpers, keyframes, and every interaction-state rule.
src/index.css             Font wiring and the global CSS entrypoint.

scripts/build-portable.ts The single generator. One source in, every artifact out.
design-md/                The design guide, from the design system team. Never edited here.
public/                   Generated AI-facing artifacts (spec, tokens, registry, the design guide's copy).
packages/components/      @inspera/components, the npm package. Builds, but not yet published.
kit/                      The Figma Make kit.
```

## Distribution

One source, several outputs, each matched to what a given tool can actually
consume. See [DISTRIBUTION.md](DISTRIBUTION.md).

## Contributing

- Never hand-edit a generated file; change the source and run `pnpm generate`.
- Style with tokens (`var(--...)`) and `runtime.css` classes only, no Tailwind
  classes inside `src/components/inspera/`.
- Interaction state belongs in `src/imports/runtime.css`, never in an inline
  style. An inline `background` or `border` outranks any class selector, so
  setting one on the element silently defeats its own `:hover` and
  `:focus-visible` rules, see the comments in that file for the shape each
  component opts into.
- Every component must satisfy the accessibility contract declared for it in
  `src/data/components.ts`. If you change the contract, change the component.
- Components accept `className`, `style` and native attributes via `NativeAttrs`,
  and spread them on the root element.
- After changing a component, its tokens or its registry entry: run
  `pnpm generate`, then `pnpm typecheck`, `pnpm audit:snippets`,
  `pnpm audit:recipes` and `pnpm audit:design-md`.

## The AI integration surface

Everything an AI tool needs is generated into `public/` and layered by size, so
a tool takes only what it can use:

| Artifact | For |
| --- | --- |
| `llms.txt` | The index, about 6k tokens. What a person pastes. |
| `c/<slug>.md` | One component, about 2-3k tokens. What an agent fetches on demand. |
| `llms-full.txt` | Everything inline, about 95k tokens, for tools that cannot fetch. |
| `spec/*.md` | The same text in parts: a core plus groups of components, each under 20k tokens, for tools that cannot take the whole file. Zipped on the AI spec page; `specParts` in `src/data/distribution.ts` says which component goes where. |
| `api.json` | Prop API derived from the TypeScript types. |
| `aliases.json` | Deprecated name to canonical component. |
| `tokens.css` | Custom properties plus icon/keyframe runtime. |
| `inspera.theme.css` | Tailwind v4 `@theme` block. |
| `tokens.w3c.json` | W3C Design Tokens format. |
| `rules/*` | Drop-in rules files for Cursor, Claude Code, Copilot, Windsurf. |
| `design/DESIGN.md`, `design/references/*` | The design guide, copied byte for byte from `design-md/`. Read before designing a screen. |
| `inspera-00-start-here.md` | Opens the AI spec zip: how DESIGN.md and the full guide fit together, and the known differences between them. |

Links inside these files are relative by default. Once the site is hosted, set
`INSPERA_DS_BASE_URL=https://your-host` before `pnpm generate` to emit absolute
URLs, which the drop-in rules files need.

## The design guide

`design-md/` holds DESIGN.md, in Google Labs' DESIGN.md format, and its
reference files. The AI spec page downloads it together with the full guide
(`llms-full.txt`, saved as `inspera-design-system.md`) as one zip, in the
layout DESIGN.md refers to:

```
inspera-ai-spec-<version>/
  inspera-00-start-here.md     read order, which file wins, setup, known differences
  DESIGN.md
  references/
  inspera-design-system.md
```

DESIGN.md relies on the library for tokens, component names, props, sizes and
radii, so `pnpm audit:design-md` checks every one of them:

- Values the library holds as data are compared exactly.
- Prose claims (scripts/design-md-claims.ts) name the sections of the full
  guide they describe. When one changes, they are up for review until someone
  re-reads them and runs `pnpm audit:design-md --update`.
- Disagreements are acknowledged in `knownDifferences` (src/data/design-md.ts),
  each saying which file to follow. They ship as errata in the start-here note.
  A disagreement not listed fails the audit, and so does a listed one that no
  longer reproduces.
- `pnpm audit:design-md --request` prints a change request for the design
  system team.

When a new version of the design guide arrives, replace the folder wholesale,
run `pnpm audit:design-md`, then `pnpm generate`.

## Checks

No browser needed:

```bash
pnpm typecheck
pnpm verify:generated
pnpm audit:snippets   # every playground control reaches the JSX and the gallery
pnpm audit:pages      # screen templates: component lists and download bundles
pnpm audit:search
pnpm audit:ascii      # shipped text files are plain ASCII
pnpm audit:design-md  # DESIGN.md is still in step with the library
```

These need Chrome. The last two also need the dev server running:

```bash
pnpm audit:recipes    # HTML+CSS recipes match their components element for element
pnpm audit:spec       # components render correctly from the spec alone
pnpm audit:layout     # playground and gallery fit on every component page
pnpm test:a11y        # axe + keyboard interactions on every component page
```
