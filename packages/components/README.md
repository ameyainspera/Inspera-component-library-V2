# @inspera/components

Canonical Inspera Design System components and tokens for React - the real, importable source of truth. Use it in a code-based AI builder (Cursor, v0, Lovable, Bolt) or a hand-written React app so the UI it produces matches the product.

## Status

Not published yet. The `@inspera` npm scope is unclaimed, so `npm i @inspera/components` returns 404 today. Until a registry is chosen, build it from this repo (`pnpm build:pkg`) and install the folder, or use the portable spec (`llms.txt`) the reference site serves.

## Use

Requires React 19: components take `ref` as an ordinary prop.

Import the stylesheet once at your app root, then use the components:

```tsx
import '@inspera/components/styles.css'
import { Alert, Button, TextInput } from '@inspera/components'

export default function Example() {
  return (
    <>
      <TextInput label="Email" placeholder="you@school.edu" />
      <Button label="Save" />
      <Alert intent="Success" title="Saved" message="Your changes are live." />
    </>
  )
}
```

`styles.css` holds the design tokens (`var(--primary)`, `var(--space-4)`, ...), the text-style classes, and the runtime rules components need for hover, focus, pressed and animation. Components style themselves with it and inline styles; Tailwind is not required.

Every component also accepts `className`, `style`, `id`, `ref` and the native attributes of its root element.

Token values are also available as JS:

```ts
import { palette, spacing, radius } from '@inspera/components/tokens'
```

## Fonts

The stylesheet refers to **Inter**, **Noto Sans Mono**, **Noto Serif** and **Material Symbols Outlined**, but does not load them. Wire them however your project wires Google Fonts - in a Vite or plain CSS app, put these before all other CSS:

<!-- generated:fonts -->
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Mono:wght@400;500;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;500;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-25..200&display=swap');
```
<!-- /generated:fonts -->

## Components

<!-- generated:components -->
48 components, by category:

- **input-controls** (19): `Button`, `TextInput`, `Checkbox`, `RadioButton`, `Select`, `Toggle`, `Textarea`, `FormField`, `Slider`, `SegmentedControl`, `DatePicker`, `FileUpload`, `RadioGroup`, `CheckboxGroup`, `Rating`, `OtpInput`, `NumberInput`, `Combobox`, `DateRangePicker`
- **data-display** (12): `Card`, `Badge`, `Avatar`, `Table`, `DataGrid`, `Accordion`, `Tag`, `Divider`, `EmptyState`, `AvatarGroup`, `Stat`, `List`
- **feedback** (11): `Alert`, `Dialog`, `Snackbar`, `ToastProvider`, `CommandPalette`, `Tooltip`, `Progress`, `Spinner`, `Skeleton`, `Popover`, `Drawer`
- **navigation** (6): `Tabs`, `Breadcrumb`, `Pagination`, `Menu`, `Stepper`, `Link`
<!-- /generated:components -->

Each component's API, states and accessibility notes are on the reference site and in its portable spec (`llms.txt` links one file per component).

## Build

```bash
pnpm build   # tsup -> dist/ (ESM + .d.ts)
```

Sources are re-exported from the reference app (`src/components/inspera`, `src/data/tokens`), so this package cannot drift from the live library. The generated blocks in this README and `styles.css` are written by `pnpm generate` at the repo root.
