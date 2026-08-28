# Online Inspera Component Library

## Context

The team maintains a Figma component library (`Component-Library`) that has accumulated noise and undefined variants alongside the real, canonical components. They already distilled the *cleaned* system into `src/imports/DESIGN_SYSTEM_AI_READY_V4.md` — 14 canonical components, a full token system, canonical states, accessibility notes, and a deprecated-alias map.

The goal is an **online, interactive component library** that:
- lets people browse each component, switch between its states/variants, and interact with it in context, and
- doubles as an AI-shareable reference — a single link that AI mockup tools (Figma Make and others) can consume to generate on-brand UI, via copyable per-component specs/prompts.

Note: the Figma `/design/` file cannot be read by the available tooling (FigJam-only), so `DESIGN_SYSTEM_AI_READY_V4.md` is the source of truth — which is exactly its stated purpose.

### Decisions confirmed with user
- **Emphasis:** Both equally — polished visual docs *and* AI copy blocks per component.
- **Scope (first pass):** Core Input Controls only — Button, Text Input, Checkbox, Radio Button, Select, Toggle — each fully interactive with all states/variants. Remaining 8 components (Card, Badge, Avatar, Alert, Dialog, Snackbar, Tooltip, Tabs, Breadcrumb) are listed in the nav as "coming soon" so the structure is complete and extensible.
- **Styling:** Dogfood — the entire docs site is styled with Inspera tokens (Inter, `#004080`, spacing/radius/shadow scales).

## Approach

Build a small docs-site architecture on the existing Vite + React 19 + Tailwind v4 scaffold. Data-driven: component metadata drives both the visual docs and the AI copy blocks so the two never drift.

### 1. Foundation / tokens — `src/index.css`
- Keep `@import 'tailwindcss';` first, then add Google Fonts `@import` for **Inter** and **Material Symbols Outlined** (both public Google fonts; wire per AGENTS.md Google Fonts convention — CSS2 `@import` before other statements... actually place font `@import`s immediately after the Tailwind import, which must remain first).
- Add a Tailwind v4 `@theme` block + `:root` CSS custom properties for the full token set from MD §3: brand colors, semantic colors, palette shades, spacing, radius, shadows, typography sizes. These are the single styling source for both the site chrome and the components.
- Add a `.material-symbols-outlined` helper class (font-variation-settings) per MD §3.10.

### 2. Data layer — `src/data/`
- `tokens.ts` — exports the token objects (colors, palette, spacing, radius, shadows, typography) transcribed from MD §3, for rendering the Foundations page and token-usage tables.
- `components.ts` — one typed record per component (from MD §5): `name, category, purpose, variants, defaults, layout, typography, styling/intentMap, behavior, accessibility, usage, deprecatedAliases`. Drives docs + AI copy.
- `navigation.ts` — category → component list (MD §6), with `status: 'ready' | 'coming-soon'`.
- `types.ts` — shared shapes.

### 3. Inspera components — `src/components/inspera/`
Real, reusable, typed React components for the 6 core controls, each supporting all variants/states from MD §5 as props, styled only via tokens, implementing the a11y notes (roles, aria, keyboard):
- `Button.tsx` (Intent × Size × State × Content), `TextInput.tsx`, `Checkbox.tsx`, `RadioButton.tsx` (+ radiogroup), `Select.tsx` (real listbox/combobox), `Toggle.tsx`.
- `index.ts` barrel export. Default-export each component per AGENTS.md.

### 4. Docs shell & pages — `src/App.tsx` + `src/docs/`
- `App.tsx`: app shell — top bar (library title, brand), left **Sidebar** (categories from `navigation.ts`, ready vs coming-soon), main content area. Lightweight hash-based routing (`#/foundations`, `#/component/button`) — no router dependency needed; a small `useHash()` hook keeps it simple.
- `docs/Sidebar.tsx`, `docs/FoundationsPage.tsx` (renders token swatches/scales), `docs/ComponentPage.tsx`.
- `ComponentPage.tsx` composes reusable doc primitives:
  - **PreviewCanvas** — live component rendered in an isolated surface (dot-grid backdrop reusing the existing App aesthetic).
  - **VariantControls** — interactive switchers (segmented controls / toggles) generated from the component's `variants` map so the user changes state/intent/size/content and sees the live component update. This is the "switch between states and interact" requirement.
  - **StateGallery** — static grid showing every state at once for scanning.
  - **PropsTable** — variants, defaults, types from metadata.
  - **TokenUsage** — which tokens the component consumes.
  - **A11yPanel** — role, keyboard, aria notes.
  - **AICopyPanel** — copy-to-clipboard blocks: (a) the canonical spec YAML for this component, (b) a ready-to-paste generation prompt following MD §8.1. This is the "share link to AI platforms" payload.
- `docs/CodeBlock.tsx` + `docs/CopyButton.tsx` shared primitives.

### 5. Aesthetic — committed stance
- **Stance: systematic / data-dense docs** (engineering-grade, not SaaS-marketing). Tight, structured, information-first — the right register for a design-system reference that AI tools consume.
- **Type pairing:** **Inter** for UI/headings/body (brand face) + **JetBrains Mono** for specs, code blocks, token values, and AI-copy payloads. Both public Google Fonts, wired via `@import` in `src/index.css` (after the required `@import 'tailwindcss';`).
- **Ground:** clean light canvas (`#F7F7F7`/white surfaces from the palette), deep navy `#004080` as the single interactive accent, hairline borders from `gray.200/300`. Component preview canvases reuse the existing subtle dot-grid backdrop from the current `App.tsx`.
- Inspera tokens govern all component rendering and are non-negotiable; the stance governs the docs chrome. Note: AGENTS.md defines `src/index.css` as the styling entrypoint (there is no `src/styles/theme.css`), so tokens live there.

## Critical files
- `src/index.css` — tokens, fonts, Material Symbols (rewrite).
- `src/data/{tokens,components,navigation,types}.ts` — new.
- `src/components/inspera/{Button,TextInput,Checkbox,RadioButton,Select,Toggle,index}.tsx` — new.
- `src/docs/{Sidebar,FoundationsPage,ComponentPage,PreviewCanvas,VariantControls,StateGallery,PropsTable,TokenUsage,A11yPanel,AICopyPanel,CodeBlock,CopyButton}.tsx` — new.
- `src/App.tsx` — replace placeholder with the docs shell + hash routing.
- `src/main.tsx` / `index.html` — unchanged (existing entrypoint preserved).

## Extensibility
Adding the remaining 8 components later = add a `components.ts` entry + a component file + flip nav status to `ready`. No shell changes needed.

---

# Phase 2 — Make it reusable across AI builders (tri-distribution)

## Context

The library above is built and dogfooded. The new goal: use it to guide *future* projects so designs stay consistent — and not only in Figma Make, but across **any** AI builder (Cursor, v0, Lovable, Claude/ChatGPT, Bolt, etc.). A Figma Make **Kit** enforces a single source of truth, but the Kit mechanism (manifest, attachment, in-editor enforcement) is proprietary to Figma Make and does not run on other platforms. So a Kit alone cannot be "the library and guide everywhere."

The answer is **one source of truth → three coordinated outputs**, each matched to what a given platform can actually consume. The React components + `src/data/tokens.ts` + `DESIGN_SYSTEM_AI_READY_V4.md` we already have *are* that source; this phase adds a build/export layer around them.

User confirmed scope: **all three** targets.

## The single source of truth

- `src/components/inspera/*.tsx` — the 15 real components (already token-styled, typed, a11y-complete).
- `src/data/tokens.ts` — the canonical token objects.
- `src/data/components.ts` + `DESIGN_SYSTEM_AI_READY_V4.md` — the semantic spec (props, states, usage, deprecated aliases, AI prompts).

Everything below is *generated from or packaged from* these — nothing is hand-maintained twice.

## Output 1 — npm package `@inspera/components` (code-based AI builders)

For platforms that can `npm install` (Cursor, v0, Lovable, Bolt, hand-written React). Real, importable components — the strongest possible enforcement short of a Kit.

- New `packages/components/` (or repo-root `package.json` `exports` field) that publishes:
  - the `inspera/*` components via the existing `src/components/inspera/index.ts` barrel,
  - `inspera/tokens.css` (the token custom-properties, extracted from `src/index.css` `:root`),
  - `inspera/tokens` JS/TS export (from `src/data/tokens.ts`).
- Add `tsup` (or `vite build --lib`) to emit ESM + `.d.ts`. Add `build`/`prepublishOnly` scripts.
- README documents install + `import '@inspera/components/tokens.css'` + font wiring.
- Font `@import`s stay the consumer's responsibility (documented), since Google Fonts wiring differs per project.

## Output 2 — portable spec + tokens (any LLM tool, universal fallback)

For platforms with no package install — you paste/link guidance. Advisory but universal.

- `dist/inspera-llms.txt` (or `AGENTS-inspera.md`) — a single self-contained markdown: token table, per-component API + states + do/don't + a ready-to-paste generation prompt, distilled from `components.ts`/`DESIGN_SYSTEM_AI_READY_V4.md`. This is the "share one link/file to any AI" payload the docs site already assembles per-component; this bundles the whole system.
- `dist/tokens.w3c.json` — W3C Design Tokens Community Group format, generated from `src/data/tokens.ts`, so Style Dictionary / Tokens Studio / other tools can import them.
- A small `scripts/build-portable.ts` generator so these regenerate from source (no drift).
- Optionally surface a "Download spec / Copy all" action in the docs site header.

## Output 3 — Figma Make Kit (enforced inside Figma Make)

For Figma Make specifically, where a Kit gives true enforcement (agent must use kit components).

- Author the kit layout Figma Make expects:
  - `guidelines/Guidelines.md` (entry manifest) + `overview.md`, `tokens.md`, `styles.css`, `components.md`, `icons.md`, `setup.md`.
  - components under `src/<KitName>/` (reuse the `inspera/*` sources), styles under `src/styles/`, barrel `src/index.ts`, `.figma/make/kit.json` manifest.
- Generate `guidelines/*` from the same `components.ts`/spec so kit docs match outputs 1 & 2.
- **Publishing is a Figma product-UI action**, not a sandbox CLI step (in-sandbox `figma make kits` only `reconcile`s). Plan documents the authoring layout + a checklist for the user to publish from Figma.

## Honest limits (call out in README)

- npm package: only where dependencies can be installed; consumer wires fonts.
- portable spec/tokens: advisory — the model *should* follow it, nothing enforces it.
- Make Kit: real enforcement, but Figma-Make-only, and publish is manual in Figma.

## Critical files (Phase 2)

- `packages/components/package.json`, build config (`tsup.config.ts`), `README.md` — new.
- `scripts/build-portable.ts` — new generator (spec md + W3C tokens json).
- `dist/inspera-llms.txt`, `dist/tokens.w3c.json` — generated outputs.
- `kit/guidelines/*`, `kit/.figma/make/kit.json`, `kit/src/index.ts` — new kit authoring tree.
- Reuse (no duplication): `src/components/inspera/*`, `src/data/tokens.ts`, `src/data/components.ts`, `src/index.css`.

## Verification (Phase 2)
- `pnpm build` the package; in a scratch consumer, `npm i` the tarball (`npm pack`), import a `Button` + `tokens.css`, confirm it renders on-brand.
- Run `scripts/build-portable.ts`; confirm `inspera-llms.txt` and `tokens.w3c.json` regenerate and validate (paste the llms.txt into an LLM and confirm it produces on-brand markup).
- Validate `kit.json` against the kit schema and confirm `guidelines/Guidelines.md` links resolve; hand the user the Figma publish checklist.

---

## Verification (Phase 1)
- Dev server is already running on `$PORT`; changes hot-reload — open the preview.
- Manually verify: sidebar navigates; each of the 6 component pages renders; VariantControls change the live component across every state/variant; keyboard interaction works (tab/space/enter/arrow on radios & select); AI copy buttons copy the spec + prompt.
- Confirm Inter and Material Symbols load (no fallback fonts / missing glyph boxes).
- Run a typecheck/build only if a runtime error appears; otherwise rely on hot-reload preview per project guidance.
