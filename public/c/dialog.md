<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Dialog

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Dialog

Present content or actions that require user attention. — category: `feedback`.

```tsx
import { Dialog } from '@inspera/components'

<Dialog
  open={open}
  size="Medium"
  title="Dialog title"
  hasCloseButton={true}
  hasActions={true}
  onClose={() => setOpen(false)}
  onConfirm={handleConfirm}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `'Dialog title'` |  |
| `body` | `ReactNode` | `'This is the dialog body. Provide context or a clear description of the action the user is about to take.'` |  |
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Medium'` | Panel width 400 / 480 / 560. Values: Small \| Medium \| Large. |
| `hasCloseButton` | `boolean` | `true` | Show the header close affordance. Values: true \| false. |
| `hasActions` | `boolean` | `true` | Show the footer action buttons. Values: true \| false. |
| `confirmLabel` | `string` | `'Continue'` |  |
| `cancelLabel` | `string` | `'Cancel'` |  |
| `open` | `boolean` | `true` |  |
| `embedded` | `boolean` | `false` | Render just the panel (no overlay) — used for documentation previews. |
| `onClose` | `() => void` | — |  |
| `onConfirm` | `() => void` | — |  |

**Accessibility** — role `dialog`, keyboard operable. Use role="dialog" with aria-modal="true"; Set aria-labelledby to the dialog title; Trap focus inside the dialog when open; Return focus to trigger element on close; Escape key closes the dialog.

**Do:** Use for confirmations and critical decisions; Always provide a way to close the dialog; Keep dialog content focused and concise.
**Don't:** Do not open dialogs from other dialogs; Do not use for non-blocking information — use Alert instead.

**Deprecated aliases** (do not use): `Modal`, `Popup`


---

Tokens: ./tokens.css · Full system: ./llms.txt
