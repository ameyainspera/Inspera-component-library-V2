<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Checkbox

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Checkbox

Allow multiple selection. — category: `input-controls`.

```tsx
import { Checkbox } from '@inspera/components'

<Checkbox
  label="Send me product updates"
  checked={false}
  size="Medium"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Checkbox label'` |  |
| `checked` | `boolean` | — | Checked state. Values: true \| false. |
| `state` | `'Default' \| 'Hover' \| 'Focused' \| 'Pressed' \| 'Disabled' \| 'Error'` | `'Default'` | Forces a visual state for documentation. Omit for real interactivity. |
| `withLabel` | `boolean` | `true` | Render the label. Values: true \| false. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Indicator size. Values: Small \| Medium. |
| `onChange` | `(checked: boolean) => void` | — |  |

**Accessibility** — role `checkbox`, keyboard operable. Use aria-checked to reflect state; Group related checkboxes with fieldset and legend.

**Do:** Use for multi-select scenarios; Always provide a label for each checkbox; Group related options together.
**Don't:** Do not use for mutually exclusive options — use Radio Button instead; Do not use without a label.

**Deprecated aliases** (do not use): `Checkbox/Unchecked`, `Checkbox/Checked`, `Checkbox with label`, `Checkbox (fill width)`, `Checkbox (Cards)`


---

Tokens: ./tokens.css · Full system: ./llms.txt
