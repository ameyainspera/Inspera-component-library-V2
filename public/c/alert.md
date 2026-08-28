<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Alert

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Alert

Display semantic inline feedback. — category: `feedback`.

```tsx
import { Alert } from '@inspera/components'

<Alert
  intent="Info"
  title="Heads up"
  message="…"
  layout="Simple"
  background={true}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `'Heads up'` |  |
| `message` | `string` | `'This is a contextual inline message that matches the intent severity.'` |  |
| `intent` | `'Info' \| 'Success' \| 'Warning' \| 'Error'` | `'Info'` | Severity / color. Values: Info \| Success \| Warning \| Error. |
| `layout` | `'Simple' \| 'With CTA' \| 'With Close' \| 'With CTA + Close'` | `'Simple'` | Action affordances. Values: Simple \| With CTA \| With Close \| With CTA + Close. |
| `background` | `boolean` | `true` | Tinted fill vs. left-accent only. Values: true \| false. |
| `ctaLabel` | `string` | `'View details'` |  |
| `onCta` | `() => void` | — |  |
| `onClose` | `() => void` | — |  |

**Accessibility** — role `alert`, keyboard operable. Use role="alert" for important messages; Use aria-live="polite" for non-critical alerts; Close button must have aria-label="Close alert".

**Do:** Use for contextual inline messages; Match intent to message severity; Keep alert text concise.
**Don't:** Do not stack more than 2 alerts in the same area; Do not use alerts for permanent content.


---

Tokens: ./tokens.css · Full system: ./llms.txt
