<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Date Picker

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Date Picker

Select a calendar date from a popover. — category: `input-controls`.

```tsx
import { DatePicker } from '@inspera/components'

<DatePicker
  label="Due date"
  value="2026-08-19"
  onChange={setDate}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Date'` |  |
| `value` | `string` | — | Selected date (YYYY-MM-DD). |
| `placeholder` | `string` | `'Select date'` | Trigger placeholder. |
| `state` | `'Default' \| 'Focused' \| 'Disabled' \| 'Error'` | `'Default'` | Forces a visual state for documentation. Omit for real interactivity. |
| `showLabel` | `boolean` | `true` | Show the field label. Values: true \| false. |
| `defaultOpen` | `boolean` | `false` | Open the calendar initially. Values: true \| false. |
| `onChange` | `(iso: string) => void` | — |  |

**Accessibility** — role `dialog`, keyboard operable. Trigger uses aria-haspopup="dialog" and aria-expanded; Popover uses role="dialog" with a label; Day cells are buttons with descriptive aria-labels; Escape closes the popover.

**Do:** Use for selecting a single calendar date; Highlight today and the selected day; Provide clear month navigation.
**Don't:** Do not use for free-form date typing without validation; Do not trap keyboard focus without an escape.

**Deprecated aliases** (do not use): `Calendar input`, `Date field`


---

Tokens: ./tokens.css · Full system: ./llms.txt
