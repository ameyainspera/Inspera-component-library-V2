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
| What does a component *mean* — purpose, a11y contract, do/don't, legacy names? | `src/data/components.ts` |
| What are the tokens? | `src/data/tokens.ts` |

Everything else in this repo — `public/`, `kit/`, `packages/components/tokens.css`
— is **generated** from those by `scripts/build-portable.ts`. Generated files
carry a "do not edit" header and are verified in CI (`pnpm generate` must leave
the tree clean).

> `docs/history/DESIGN_SYSTEM_AI_READY_V4.md` is **superseded**. It was the
> original hand-written spec and is retained only for provenance. It describes
> 14 components with Figma-style Capitalized variant names that do not match the
> real React API.

## Repository layout

```
src/components/inspera/   The real components. The product builds against these.
src/data/                 Component semantics, tokens, icons, navigation.
src/docs/                 The reference site (Foundations, per-component pages, Icons, Integrate).
src/tokens.css            Token custom properties (generated from src/data/tokens.ts).
src/runtime.css           Icon helpers, keyframes, and every interaction-state rule.
src/index.css             Font wiring and the global CSS entrypoint.

scripts/build-portable.ts The single generator. One source in, every artifact out.
public/                   Generated AI-facing artifacts (spec, tokens, registry).
packages/components/      @inspera/components — the npm package. Builds, but not yet published.
kit/                      The Figma Make kit.
docs/history/             Superseded documents, kept for provenance.
```

## Distribution

One source, several outputs, each matched to what a given tool can actually
consume. See [DISTRIBUTION.md](DISTRIBUTION.md).

## Contributing

- Never hand-edit a generated file; change the source and run `pnpm generate`.
- Style with tokens (`var(--…)`). A handful of one-off `rgba()` shadows remain
  in the components; do not add more.
- Interaction state belongs in `src/runtime.css`, never in an inline style. An
  inline `background` or `border` outranks any class selector, so setting one
  on the element silently defeats its own `:hover` and `:focus-visible` rules —
  see the comments in that file for the shape each component opts into.
- Every component must satisfy the accessibility contract declared for it in
  `src/data/components.ts`. If you change the contract, change the component.

### Known gaps

- Components do not yet accept `className`, `style`, a `ref`, or rest props —
  only `Icon` does. Until they do, a consumer cannot add so much as a margin to
  a `Button` from the outside.
- There is no linter. The token rule above is a convention, not an enforced one.

## The AI integration surface

Everything an AI tool needs is generated into `public/` and layered by size, so
a tool takes only what it can use:

| Artifact | For |
| --- | --- |
| `llms.txt` | The index — ~1.5k tokens. What a person pastes. |
| `c/<slug>.md` | One component, ~600 tokens. What an agent fetches on demand. |
| `llms-full.txt` | Everything inline, for tools that cannot fetch. |
| `api.json` | Prop API derived from the TypeScript types. |
| `aliases.json` | Deprecated name → canonical component. |
| `tokens.css` | Custom properties + icon/keyframe runtime. |
| `inspera.theme.css` | Tailwind v4 `@theme` block. |
| `tokens.w3c.json` | W3C Design Tokens format. |
| `rules/*` | Drop-in rules files for Cursor, Claude Code, Copilot, Windsurf. |

Links inside these files are relative by default. Once the site is hosted, set
`INSPERA_DS_BASE_URL=https://your-host` before `pnpm generate` to emit absolute
URLs, which the drop-in rules files need.

## Checking the reference site's layout

```bash
pnpm dev              # in one terminal
pnpm audit:layout     # in another
```

Drives every component page in a real browser and fails if any Playground or
State-gallery preview overflows its cell. Components size to their container,
so the gallery grid owns the width budget — see `galleryLayout` in
`src/docs/registry.tsx`. Add a component, add its entry there.
