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
src/index.css             Token custom properties + font wiring.

scripts/build-portable.ts The single generator. One source in, every artifact out.
public/                   Generated AI-facing artifacts (spec, tokens, registry).
packages/components/      @inspera/components — the npm package (private registry).
kit/                      The Figma Make kit.
docs/history/             Superseded documents, kept for provenance.
```

## Distribution

One source, several outputs, each matched to what a given tool can actually
consume. See [DISTRIBUTION.md](DISTRIBUTION.md).

## Contributing

- Never hand-edit a generated file; change the source and run `pnpm generate`.
- Components must accept `className`, `style`, a `ref`, and spread rest props.
- Style with tokens (`var(--…)`); raw hex is rejected by lint.
- Every component must satisfy the accessibility contract declared for it in
  `src/data/components.ts`.
