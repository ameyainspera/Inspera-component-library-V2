<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Snackbar

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Snackbar

Show brief, non-blocking feedback at the bottom of the screen. — category: `feedback`.

```tsx
import { Snackbar } from '@inspera/components'

<Snackbar
  intent="Neutral"
  message="Assessment saved."
  hasAction={false}
  hasClose={true}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `message` | `string` | `'Assessment saved successfully.'` |  |
| `intent` | `'Info' \| 'Success' \| 'Warning' \| 'Error' \| 'Neutral'` | `'Neutral'` | Accent icon color. Values: Neutral \| Info \| Success \| Warning \| Error. |
| `hasAction` | `boolean` | `false` | Show an inline action (e.g. Undo). Values: true \| false. |
| `hasClose` | `boolean` | `true` | Show the dismiss button. Values: true \| false. |
| `actionLabel` | `string` | `'Undo'` |  |
| `onAction` | `() => void` | — |  |
| `onClose` | `() => void` | — |  |

**Accessibility** — role `status`, keyboard operable. Use role="status" with aria-live="polite"; Action button must be focusable; Auto-dismiss timing must be generous (5s minimum).

**Do:** Use for brief confirmation messages; Include an undo action when appropriate; Limit to one snackbar at a time.
**Don't:** Do not use for critical errors — use Alert or Dialog instead; Do not stack multiple snackbars.

**Deprecated aliases** (do not use): `Toast`, `Notification bar`


---

Tokens: ./tokens.css · Full system: ./llms.txt
