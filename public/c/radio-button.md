<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Radio Button

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Radio Button

Allow single selection. — category: `input-controls`.

```tsx
import { RadioButton } from '@inspera/components'

<RadioButton
  label="Standard delivery"
  name="delivery"
  selected={false}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Radio option'` |  |
| `selected` | `boolean` | — | Selected state. Values: true \| false. |
| `name` | `string` | `'radio'` |  |
| `state` | `'Default' \| 'Hover' \| 'Focused' \| 'Pressed' \| 'Disabled' \| 'Error'` | `'Default'` | Forces a visual state for documentation. Omit for real interactivity. |
| `withLabel` | `boolean` | `true` | Render the label. Values: true \| false. |
| `onChange` | `(selected: boolean) => void` | — |  |

**Accessibility** — role `radio`, keyboard operable. Use role="radiogroup" for the group container; Use aria-checked to indicate selected state; Arrow keys navigate between options in the group.

**Do:** Use for mutually exclusive options; Always group inside a radiogroup; Pre-select a default when appropriate.
**Don't:** Do not use for multi-select — use Checkbox instead; Do not use a single radio button alone.

**Deprecated aliases** (do not use): `Radiobutton`, `Radiobuttons`, `Radio Button New-BonW`, `Radio Button New-BonY`, `Radio Button New-WonB`, `Radio Button New-YonB`


---

Tokens: ./tokens.css · Full system: ./llms.txt
