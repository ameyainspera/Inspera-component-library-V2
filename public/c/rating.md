<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Rating

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Rating

Capture or display a star rating. — category: `input-controls`.

```tsx
import { Rating } from '@inspera/components'

<Rating
  value={3}
  max={5}
  size="Medium"
  readOnly={false}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | `0` | Current rating. |
| `max` | `number` | `5` | Number of stars. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Star size. Values: Small \| Medium. |
| `readOnly` | `boolean` | `false` | Display-only mode. Values: true \| false. |
| `showValue` | `boolean` | `false` | Show numeric value. Values: true \| false. |
| `onChange` | `(value: number) => void` | — |  |

**Accessibility** — role `radiogroup`, keyboard operable. Container uses role="radiogroup" with an accessible label; Each star is a radio with aria-checked and an aria-label; Arrow keys adjust the rating.

**Do:** Use for feedback and review scores; Show hover preview when interactive; Use read-only mode to display aggregate scores.
**Don't:** Do not use for precise numeric input; Do not omit accessible labels on stars.

**Deprecated aliases** (do not use): `Star rating`, `Stars`


---

Tokens: ./tokens.css · Full system: ./llms.txt
