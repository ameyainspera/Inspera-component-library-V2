# Plan: Fix empty docs pages for the six new components (+ full recipes)

## Context

Six components were recently added (DataGrid, Toast, Combobox, DateRangePicker,
NumberInput, CommandPalette) and wired into the barrel
(`src/components/inspera/index.ts`), the sidebar (`src/data/navigation.ts`), and
the docs `registry` (`src/docs/registry.tsx`). Their pages render **empty**.

Root cause: `src/docs/ComponentPage.tsx` looks up `spec = components[slug]`
(from `src/data/components.ts`) and, at line 111, short-circuits to
"Component not found." whenever the spec is missing. The six were never added to
`components.ts`, so their pages are blank - header, purpose, tokens,
accessibility, do/don't, props table, and AI copy blocks all derive from that
`ComponentSpec`.

Two coupled consequences of adding those specs:
- `scripts/build-portable.ts` (`pnpm generate`) asserts each spec resolves to a
  real export. `Toast.tsx` exports `ToastProvider`/`ToastProviderProps`, but
  `scripts/extract-props.ts` keys APIs by **filename** and reads `${filename}Props`
  - so it produces no API for `Toast` and generate would throw.
- `scripts/audit-recipes.ts` has a coverage gate (line 74): it fails if **any**
  `componentList` entry lacks a recipe in `src/data/recipes.tsx`. So once the six
  specs land, all six also need recipes (the user confirmed authoring full
  HTML+CSS recipes).

Outcome: all six pages render fully; `pnpm generate` succeeds; `pnpm audit:recipes`
stays green with real "Without the package" HTML+CSS for each.

## Changes

### 1. Add six `ComponentSpec` entries to `src/data/components.ts`

Add one entry per slug (templates: `otp-input` line 494, `table` line 516),
placed by category for a clean diff. Fields per `ComponentSpec` in
`src/data/types.ts`: `slug`, `name`, `category`, `purpose`, `keywords`,
`status:'ready'`, `deprecatedAliases:[]`, `tokens`, `accessibility`, `usage`.
Export names must resolve (name-without-spaces, except toast):
`DataGrid`, `Combobox`, `DateRangePicker`, `NumberInput`, `CommandPalette`, and
`toast` -> **`exportName:'ToastProvider'`**.

### 2. Rename `Toast.tsx` -> `ToastProvider.tsx`

`git mv` the file (interface already `ToastProviderProps`, default export already
`ToastProvider`); update the two `'./Toast'` import paths in
`src/components/inspera/index.ts` (lines 80, 83). The barrel is the only
importer. This makes filename === export === `${name}Props`, matching every
other component so `extract-props` and `exportNameFor` resolve.

### 3. Add an `embedded` prop to `CommandPalette`

CommandPalette and Toast are the only two that `createPortal`. To make
CommandPalette auditable (SSR renders nothing through a portal), add an
`embedded` prop that renders the panel inline without the portal/overlay -
exactly the precedent `Dialog.tsx` and `Drawer.tsx` already set (both accept
`embedded`). No change needed for Toast (its recipe renders a Snackbar; see 4).

### 4. Author six recipes in `src/data/recipes.tsx`

Each recipe: `className`, `css` (self-contained, `var(--token)` only), `html`
(doc example), `markup(v)` (live playground HTML), `component(v)` (the real
component for the audit), plus `notes`, and `composes`/`vars`/`rootOnly` as
needed. `scripts/audit-recipes.ts` renders `component(v)` vs `markup(v)` in
Chrome and compares computed styles element-for-element across one case per
non-`state` control value - the author controls both sides, so each recipe
renders a representative **resting** surface. Per component:

- **number-input** - inline stepper field: wrapper > label + field(input +
  optional suffix + two stepper buttons). Cases: size Small/Medium, suffix
  none/min/%. Direct, moderate.
- **combobox** - closed field (input + search icon); the listbox only opens on
  focus, so the resting DOM is stable. Cases: allowCustomValue false/true (no
  resting-DOM change). Moderate.
- **date-range-picker** - trigger-only, mirroring the existing `datePicker`
  recipe (line 2942), which documents just the closed trigger. `component`/
  `markup` render the closed trigger regardless of `defaultOpen`; the two-month
  calendar is described in `notes`. Moderate.
- **data-grid** - `composes: ['table','checkbox','pagination','select']`.
  `component(v)` renders a modest grid (a few columns, `selectable`, optional
  `footer`; **no `rowActions`** so no nested Menu to replicate), `markup(v)`
  mirrors the thead (select-all checkbox + sortable headers) / tbody (row
  checkboxes) / footer (range text + Pagination + page-size Select). Largest
  recipe; high but tractable since nothing here portals at rest.
- **command-palette** - uses the new `embedded` prop:
  `component: (v) => <CommandPalette embedded commands={...} />`; `markup`
  mirrors the panel (search field + grouped command list). `notes` cover the
  overlay/hotkey/focus behaviour. Moderate.
- **toast** - `composes: ['snackbar']`; `component: (v) => <Snackbar
  intent={v.intent} hasAction={v.withAction==='true'} .../>`, `markup` mirrors a
  single snackbar. `notes` explain the ToastProvider mount, the stack, `position`,
  and auto-dismiss (which the static markup cannot express). Moderate.

## Regeneration (required, currently permission-blocked)

Props tables and AI copy blocks read from generated files
(`src/data/component-api.generated.ts`, `component-docs.generated.ts`) that don't
yet contain the six slugs. After the source edits run `pnpm generate`. Pages
render before regeneration (the page tolerates empty `props`/`doc`), but those
sections stay empty until it runs. Build-tool commands are denied in this
environment, so the user runs these.

## Critical files

- `src/data/components.ts` - the six `ComponentSpec` entries (fixes empty pages).
- `src/components/inspera/Toast.tsx` -> `ToastProvider.tsx` + two edits in
  `src/components/inspera/index.ts`.
- `src/components/inspera/CommandPalette.tsx` - add `embedded` prop
  (pattern: `Dialog.tsx`, `Drawer.tsx`).
- `src/data/recipes.tsx` - six new recipes + register them in the `recipes`
  record (keyed by slug, `export const recipes` line 5017); import the
  components they render (`DataGrid`, `Combobox`, `DateRangePicker`,
  `NumberInput`, `CommandPalette`; `Snackbar` already imported).
- Reference (read-only): `src/docs/ComponentPage.tsx`, `src/data/types.ts`,
  `scripts/extract-props.ts`, `scripts/build-portable.ts`,
  `scripts/audit-recipes.ts`, and recipe templates `datePicker`/`table`/`select`
  /`dialog` in `recipes.tsx`.

## Verification (user runs; build tools blocked here)

1. `pnpm typecheck` passes.
2. `pnpm generate` completes without throwing (proves Toast rename + every
   spec's export resolve).
3. `pnpm audit:recipes` passes: coverage complete, every markup class is
   defined, and each recipe matches its component element-for-element.
4. `pnpm audit:ascii` / `pnpm verify:generated` still pass.
5. In the docs site, open `/#/component/{data-grid,combobox,date-range-picker,
   number-input,toast,command-palette}`: all panels render (no "Component not
   found."), including the "HTML + CSS" code tab and AI copy blocks.
6. New components appear in `public/llms.txt` and have `public/c/<slug>.md` with
   a "Without the package" section.
