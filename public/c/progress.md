<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Progress

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Progress

Show completion of an ongoing task. — category: `feedback`.

```tsx
import { Progress } from '@inspera/components'

<Progress
  variant="Linear"
  value={60}
  intent="Primary"
  size="Medium"
  indeterminate={false}
  showValue={false}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'Linear' \| 'Circular'` | `'Linear'` | Bar or ring. Values: Linear \| Circular. |
| `value` | `number` | `60` | Completion percentage 0–100. Ignored when indeterminate. |
| `indeterminate` | `boolean` | `false` | Unknown-duration animation. Values: true \| false. |
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Medium'` | Bar height / ring diameter. Values: Small \| Medium \| Large. |
| `intent` | `'Success' \| 'Warning' \| 'Error' \| 'Primary'` | `'Primary'` | Fill color. Values: Primary \| Success \| Warning \| Error. |
| `showValue` | `boolean` | `false` | Render the percentage. Values: true \| false. |

**Accessibility** — role `progressbar`. Use role="progressbar" with aria-valuenow / min / max; Omit aria-valuenow when indeterminate; Provide an accessible label for the task.

**Do:** Use determinate progress when completion is known; Use indeterminate for unknown-duration waits; Match intent color to context.
**Don't:** Do not use for very short operations; Do not fake progress values.

**Deprecated aliases** (do not use): `Progress bar`, `Loading bar`, `Meter`


---

Tokens: ./tokens.css · Full system: ./llms.txt
