# @inspera/components

Canonical [Inspera Design System](../../README.md) components and tokens for React — the real, importable source of truth. Use this in any code-based AI builder (Cursor, v0, Lovable, Bolt) or hand-written React app so generated UI is on-brand and consistent.

## Status

> **Not published.** This package builds from the repo, but it has never been
> pushed to a registry — the `@inspera` scope is unclaimed, so
> `npm i @inspera/components` returns a 404. Publishing is one edit in
> `src/data/distribution.ts` plus a `publishConfig` here.
>
> Until then, use the portable spec in `public/` — `llms.txt` and the
> per-component files under `public/c/`.

## Install (once published)

```bash
npm i @inspera/components
```

Import the tokens stylesheet once at your app root, then use the components:

```tsx
import '@inspera/components/tokens.css'
import { Button, TextInput, Alert } from '@inspera/components'

export default function Example() {
  return (
    <>
      <TextInput label="Email" placeholder="you@school.edu" />
      <Button intent="Primary">Save</Button>
      <Alert intent="Success" title="Saved" message="Your changes are live." />
    </>
  )
}
```

Token values are also available as JS:

```ts
import { palette, spacing, radius } from '@inspera/components/tokens'
```

## Fonts

The tokens reference **Inter**, **Noto Sans Mono**, and **Material Symbols Outlined**. Wire them however your project wires Google Fonts — e.g. in a Vite/CSS app, add before all other CSS:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-25..200&display=swap');
```

## Components

15 canonical components across four categories: **input-controls** (Button, TextInput, Checkbox, RadioButton, Select, Toggle), **data-display** (Card, Badge, Avatar), **feedback** (Alert, Dialog, Snackbar, Tooltip), **navigation** (Tabs, Breadcrumb).

Full per-component API, states, and accessibility notes live in the reference site and in the portable spec (`public/inspera-llms.txt`).

## Build

```bash
pnpm build   # tsup → dist/ (ESM + .d.ts)
```

Sources are re-exported from the reference app (`src/components/inspera`, `src/data/tokens`), so this package cannot drift from the live library.
