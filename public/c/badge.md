<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Badge

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Badge

Display a short status label or count. — category: `data-display`.

```tsx
import { Badge } from '@inspera/components'

<Badge
  label="Neutral"
  intent="Neutral"
  size="Medium"
  withIcon={false}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Badge'` |  |
| `intent` | `'Info' \| 'Success' \| 'Warning' \| 'Error' \| 'Neutral'` | `'Neutral'` | Semantic color. Values: Neutral \| Info \| Success \| Warning \| Error. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Height 20 / 24. Values: Small \| Medium. |
| `withIcon` | `boolean` | `false` | Show a leading status icon. Values: true \| false. |
| `icon` | `string` | — |  |

**Accessibility** — role `status`. Use aria-label for icon-only badges; Use role="status" for dynamic count badges.

**Do:** Use for status indicators and counts; Keep labels short — 1 to 2 words; Use intent colors consistently.
**Don't:** Do not use for long text content; Do not make badges interactive without clear affordance.

**Deprecated aliases** (do not use): `Status Badge`, `Tag`, `Chip`


---

Tokens: ./tokens.css · Full system: ./llms.txt
