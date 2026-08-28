<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Textarea

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Textarea

Collect multi-line text input. — category: `input-controls`.

```tsx
import { Textarea } from '@inspera/components'

<Textarea
  label="Feedback"
  placeholder="Share your thoughts…"
  size="Medium"
  showCount={false}
  maxLength={280}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Description'` |  |
| `placeholder` | `string` | `'Placeholder text'` |  |
| `value` | `string` | — |  |
| `rows` | `number` | `4` | Visible text rows. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Vertical padding density. Values: Small \| Medium. |
| `state` | `'Error' \| 'Default' \| 'Hover' \| 'Focused' \| 'Disabled' \| 'Filled' \| 'ReadOnly'` | `'Default'` | Forces a visual state for documentation. Omit for real interactivity. |
| `showLabel` | `boolean` | `true` | Show the field label. Values: true \| false. |
| `helpText` | `string` | — |  |
| `errorText` | `string` | — |  |
| `maxLength` | `number` | — | Maximum character length. |
| `showCount` | `boolean` | `false` | Show character counter. Values: true \| false. |
| `onChange` | `(value: string) => void` | — |  |

**Accessibility** — role `textbox`, keyboard operable. Always associate label with textarea using htmlFor/id; Error text must be linked via aria-describedby; aria-invalid reflects the error state.

**Do:** Always include a visible label; Use rows to hint expected length; Show a character counter when a max length applies.
**Don't:** Do not use for single-line input — use Text Input instead; Do not disable resize without reason.

**Deprecated aliases** (do not use): `Text area`, `Multiline input`, `Comment box`


---

Tokens: ./tokens.css · Full system: ./llms.txt
