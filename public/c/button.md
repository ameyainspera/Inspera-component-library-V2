<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Button

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Button

Trigger an action. — category: `input-controls`.

```tsx
import { Button } from '@inspera/components'

<Button
  label="Button"
  intent="Primary"
  size="Medium"
  content="Text"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Button'` |  |
| `intent` | `'Success' \| 'Warning' \| 'Primary' \| 'Secondary' \| 'Outline' \| 'Text' \| 'Destructive'` | `'Primary'` | Visual role / semantic weight. Values: Primary \| Secondary \| Outline \| Text \| Success \| Warning \| Destructive. |
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Medium'` | Height 32 / 40 / 48. Values: Small \| Medium \| Large. |
| `state` | `'Default' \| 'Hover' \| 'Focused' \| 'Pressed' \| 'Disabled'` | `'Default'` | Forces a visual state for documentation. Omit for real interactivity. |
| `content` | `'Text' \| 'Icon + Text' \| 'Text + Icon' \| 'Text + Disclosure'` | `'Text'` | Label / icon composition. Values: Text \| Icon + Text \| Text + Icon \| Text + Disclosure. |
| `icon` | `string` | `'add'` |  |
| `onClick` | `() => void` | — |  |

**Accessibility** — role `button`, keyboard operable. Icon-only buttons must have an accessible label.

**Do:** Use Primary for main actions; Use Secondary for alternative actions; Use Destructive only for destructive flows.
**Don't:** Do not create separate component files per intent; Do not use deprecated alias names.

**Deprecated aliases** (do not use): `Primary button`, `Secondary button`, `Outline button`, `Text button`, `Success button`, `Warning button`


---

Tokens: ./tokens.css · Full system: ./llms.txt
