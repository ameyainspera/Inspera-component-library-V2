<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Select

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Select

Select one option from a list. — category: `input-controls`.

```tsx
import { Select } from '@inspera/components'

<Select
  label="Country"
  widthMode="Fixed"
  search={false}
  options={['Norway', 'Sweden', 'Denmark']}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Country'` | Render the label. Values: true \| false. |
| `placeholder` | `string` | `'Select an option'` |  |
| `options` | `string[]` | `defaultOptions` |  |
| `value` | `string` | — |  |
| `state` | `'Error' \| 'Default' \| 'Hover' \| 'Focused' \| 'Disabled' \| 'Open'` | `'Default'` | Forces a visual state for documentation. Omit for real interactivity. |
| `widthMode` | `'Fixed' \| 'Content Adaptable'` | `'Fixed'` | Trigger sizing. Values: Fixed \| Content Adaptable. |
| `showLabel` | `boolean` | `true` |  |
| `search` | `boolean` | `false` | Filterable option list. Values: true \| false. |
| `onChange` | `(value: string) => void` | — |  |

**Accessibility** — role `combobox`, keyboard operable. Use aria-expanded to indicate open state; Use aria-activedescendant for highlighted option; Support arrow key navigation through options.

**Do:** Use for 5+ options where space is limited; Always provide a label; Show a clear placeholder when no option is selected.
**Don't:** Do not use for fewer than 3 options — use Radio Button instead; Do not nest selects inside other selects.

**Deprecated aliases** (do not use): `Select / Fixed width`, `Select / Content adaptable`, `Dropdown`, `Dropdown with Label`


---

Tokens: ./tokens.css · Full system: ./llms.txt
