<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Checkbox Group

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Checkbox Group

Group related multi-select checkboxes. — category: `input-controls`.

```tsx
import { CheckboxGroup } from '@inspera/components'

<CheckboxGroup
  label="Notifications"
  value={['email']}
  orientation="Vertical"
  options={[{ label: 'Email', value: 'email' }]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — |  |
| `options` | `CheckboxOption[]` | `DEFAULT_OPTIONS` | Checkbox options. |
| `value` | `string[]` | — | Selected option values. |
| `orientation` | `'Vertical' \| 'Horizontal'` | `'Vertical'` | Layout direction. Values: Vertical \| Horizontal. |
| `state` | `'Default' \| 'Disabled' \| 'Error'` | `'Default'` | Forces a visual state for documentation. Omit for real interactivity. |
| `onChange` | `(value: string[]) => void` | — |  |

```ts
export interface CheckboxOption {
  label: string
  value: string
}
```

**Accessibility** — role `group`, keyboard operable. Container uses role="group" with aria-labelledby; Each option is a checkbox with aria-checked; Group related options under a shared legend/label.

**Do:** Use for selecting multiple related options; Provide a group label; Keep options parallel and concise.
**Don't:** Do not use for mutually exclusive options — use Radio Group; Do not omit the group label.

**Deprecated aliases** (do not use): `Checkbox list`, `Multi-select group`


---

Tokens: ./tokens.css · Full system: ./llms.txt
