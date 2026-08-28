<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Slider

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Slider

Select a numeric value from a continuous range. — category: `input-controls`.

```tsx
import { Slider } from '@inspera/components'

<Slider
  label="Volume"
  min={0}
  max={100}
  value={40}
  showValue={true}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Value'` |  |
| `min` | `number` | `0` | Minimum value. |
| `max` | `number` | `100` | Maximum value. |
| `value` | `number` | — |  |
| `step` | `number` | `1` | Increment granularity. |
| `state` | `'Default' \| 'Focused' \| 'Disabled'` | `'Default'` | Forces a visual state for documentation. Omit for real interactivity. |
| `showValue` | `boolean` | `true` | Show the current value. Values: true \| false. |
| `showLabel` | `boolean` | `true` | Show the field label. Values: true \| false. |
| `onChange` | `(value: number) => void` | — |  |

**Accessibility** — role `slider`, keyboard operable. Use role="slider" with aria-valuemin / aria-valuemax / aria-valuenow; Provide an accessible label via aria-label; Arrow keys adjust the value.

**Do:** Use for adjustable numeric ranges; Show the current value for precision; Provide a clear label.
**Don't:** Do not use for exact numeric entry — use Text Input instead; Do not use without min/max bounds.

**Deprecated aliases** (do not use): `Range`, `Range slider`


---

Tokens: ./tokens.css · Full system: ./llms.txt
