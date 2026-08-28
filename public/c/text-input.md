<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Text Input

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Text Input

Collect single-line text input. — category: `input-controls`.

```tsx
import { TextInput } from '@inspera/components'

<TextInput
  label="Email address"
  placeholder="jane@inspera.com"
  size="Medium"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Label'` | Show the field label. Values: true \| false. |
| `placeholder` | `string` | `'Placeholder text'` |  |
| `value` | `string` | — |  |
| `state` | `'Default' \| 'Hover' \| 'Focused' \| 'Disabled' \| 'Error' \| 'Filled' \| 'ReadOnly'` | `'Default'` | Forces a visual state for documentation. Omit for real interactivity. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Control height. Values: Small \| Medium. |
| `leadingIcon` | `string` | — | Show a leading icon. Values: true \| false. |
| `trailingIcon` | `string` | — | Show a trailing icon. Values: true \| false. |
| `showLabel` | `boolean` | `true` |  |
| `helpText` | `string` | — | Show helper text. Values: true \| false. |
| `errorText` | `string` | — | Show error message. Values: true \| false. |
| `onChange` | `(value: string) => void` | — |  |

**Accessibility** — role `textbox`, keyboard operable. Always associate label with input using htmlFor/id; Error text must be linked via aria-describedby; Required fields must use aria-required.

**Do:** Always include a visible label; Provide clear placeholder text as a hint; Show error messages below the input.
**Don't:** Do not use placeholder as the only label; Do not disable inputs without explanation.

**Deprecated aliases** (do not use): `Text inputs`, `Content`, `Content (small)`


---

Tokens: ./tokens.css · Full system: ./llms.txt
