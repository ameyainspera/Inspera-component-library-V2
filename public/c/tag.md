<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Tag

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Tag

Label, categorize, or filter with a removable chip. — category: `data-display`.

```tsx
import { Tag } from '@inspera/components'

<Tag
  label="Neutral"
  intent="Neutral"
  size="Medium"
  removable={false}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | — | Tag text. |
| `intent` | `'Info' \| 'Success' \| 'Warning' \| 'Error' \| 'Neutral'` | `'Neutral'` | Semantic color. Values: Neutral \| Info \| Success \| Warning \| Error. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Tag height. Values: Small \| Medium. |
| `removable` | `boolean` | `false` | Show a remove affordance. Values: true \| false. |
| `leadingIcon` | `string` | — | Optional leading icon. |
| `onRemove` | `() => void` | — |  |
| `onClick` | `() => void` | — |  |

**Accessibility** — role `status`, keyboard operable. Removable tags expose a button with aria-label "Remove {label}"; Interactive tags must be keyboard focusable; Use aria-label for icon-only tags.

**Do:** Use for filters, categories, and selections; Keep labels to 1–2 words; Provide a remove control when tags are dismissible.
**Don't:** Do not use for status that never changes — use Badge; Do not pack long text into a tag.

**Deprecated aliases** (do not use): `Chip`, `Pill`, `Label`


---

Tokens: ./tokens.css · Full system: ./llms.txt
