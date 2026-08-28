<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Form Field

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Form Field

Standardize label, control, and help/error layout around any input. — category: `input-controls`.

```tsx
import { FormField } from '@inspera/components'

<FormField
  label="Email address"
  htmlFor="email"
  required={false}
  helpText="We'll never share your email."
>
  <TextInput id="email" showLabel={false} />
</FormField>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Field label text. |
| `htmlFor` | `string` | — | id of the wrapped control for label association. |
| `required` | `boolean` | `false` | Show a required asterisk. Values: true \| false. |
| `helpText` | `string` | — | Helper text shown below the control. |
| `errorText` | `string` | — | Error message; replaces help text when present. |
| `children` **(required)** | `ReactNode` | — |  |

**Accessibility** — role `group`, keyboard operable. Associate the label with the control via htmlFor/id; Link error and help text with aria-describedby on the control; Required fields should set aria-required on the control.

**Do:** Wrap any single control for consistent spacing; Use htmlFor to link the label to the control; Show only one of help or error at a time.
**Don't:** Do not wrap multiple unrelated controls; Do not omit the label for accessibility.

**Deprecated aliases** (do not use): `Field wrapper`, `Input group`


---

Tokens: ./tokens.css · Full system: ./llms.txt
