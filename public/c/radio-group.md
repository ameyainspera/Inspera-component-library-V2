<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Radio Group

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Radio Group

Group mutually exclusive radio options. — category: `input-controls`.

```tsx
import { RadioGroup } from '@inspera/components'

<RadioGroup
  label="Delivery speed"
  name="delivery"
  value="standard"
  orientation="Vertical"
  options={[{ label: 'Standard', value: 'standard' }]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — |  |
| `name` | `string` | — | Shared input name for the group. |
| `options` | `RadioOption[]` | `DEFAULT_OPTIONS` | Radio options. |
| `value` | `string` | — | Selected option value. |
| `orientation` | `'Vertical' \| 'Horizontal'` | `'Vertical'` | Layout direction. Values: Vertical \| Horizontal. |
| `state` | `'Error' \| 'Default' \| 'Disabled'` | `'Default'` | Forces a visual state for documentation. Omit for real interactivity. |
| `onChange` | `(value: string) => void` | — |  |

**Accessibility** — role `radiogroup`, keyboard operable. Container uses role="radiogroup" with an accessible label; Each option is a radio with aria-checked; Arrow keys navigate between options.

**Do:** Use for single selection among 2–6 options; Provide a group label; Pre-select a sensible default.
**Don't:** Do not use for multi-select — use Checkbox Group; Do not use a single radio alone.

**Deprecated aliases** (do not use): `Radio list`, `Option group`


---

Tokens: ./tokens.css · Full system: ./llms.txt
