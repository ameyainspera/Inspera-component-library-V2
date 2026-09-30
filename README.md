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

## Repository layout

```
src/components/inspera/   The real components. The product builds against these.
src/data/                 Component semantics, tokens, icons, navigation.
src/docs/                 The reference site (Foundations, per-component pages, Icons, Integrate).
src/imports/tokens.css    Token custom properties (generated from src/data/tokens.ts).
src/imports/runtime.css   Icon helpers, keyframes, and every interaction-state rule.
src/index.css             Font wiring and the global CSS entrypoint.

scripts/build-portable.ts The single generator. One source in, every artifact out.
public/                   Generated AI-facing artifacts (spec, tokens, registry).
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
  `pnpm generate`, then `pnpm typecheck`, `pnpm audit:snippets` and
  `pnpm audit:recipes`.

## The AI integration surface

Everything an AI tool needs is generated into `public/` and layered by size, so
a tool takes only what it can use:

| Artifact | For |
| --- | --- |
| `llms.txt` | The index, about 1.5k tokens. What a person pastes. |
| `c/<slug>.md` | One component, about 600 tokens. What an agent fetches on demand. |
| `llms-full.txt` | Everything inline, for tools that cannot fetch. |
| `api.json` | Prop API derived from the TypeScript types. |
| `aliases.json` | Deprecated name to canonical component. |
| `tokens.css` | Custom properties plus icon/keyframe runtime. |
| `inspera.theme.css` | Tailwind v4 `@theme` block. |
| `tokens.w3c.json` | W3C Design Tokens format. |
| `rules/*` | Drop-in rules files for Cursor, Claude Code, Copilot, Windsurf. |

Links inside these files are relative by default. Once the site is hosted, set
`INSPERA_DS_BASE_URL=https://your-host` before `pnpm generate` to emit absolute
URLs, which the drop-in rules files need.

## Checks

No browser needed:

```bash
pnpm typecheck
pnpm verify:generated
pnpm audit:snippets   # every playground control reaches the JSX and the gallery
pnpm audit:pages      # prototyping kits: component lists and download bundles
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
