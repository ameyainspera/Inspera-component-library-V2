<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Spinner

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Spinner

Indicate an indeterminate loading state. — category: `feedback`.

```tsx
import { Spinner } from '@inspera/components'

<Spinner
  size="Medium"
  intent="Primary"
  label="Loading assessments"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Medium'` | Diameter 16 / 24 / 40. Values: Small \| Medium \| Large. |
| `intent` | `'Primary' \| 'Neutral' \| 'Inverse'` | `'Primary'` | Arc color. Values: Primary \| Neutral \| Inverse. |
| `label` | `string` | `'Loading'` | Accessible label. |

**Accessibility** — role `status`. Use role="status" with aria-live="polite"; Provide an accessible label via aria-label; Include visually-hidden loading text.

**Do:** Use for short, indeterminate waits; Use Inverse on dark surfaces; Pair with context describing what is loading.
**Don't:** Do not use where determinate Progress is possible; Do not show multiple competing spinners.

**Deprecated aliases** (do not use): `Loader`, `Loading indicator`, `Activity indicator`


---

Tokens: ./tokens.css · Full system: ./llms.txt
