<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Breadcrumb

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Breadcrumb

Show the user's current location in a hierarchy. — category: `navigation`.

```tsx
import { Breadcrumb } from '@inspera/components'

<Breadcrumb
  items={['Home', 'Assessments', 'Algebra Quiz']}
  separator="Chevron"
  size="Medium"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `string[]` | `defaultItems` |  |
| `separator` | `'Slash' \| 'Chevron'` | `'Chevron'` | Divider glyph between items. Values: Slash \| Chevron. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Text size 14 / 16. Values: Small \| Medium. |
| `onNavigate` | `(index: number) => void` | — |  |

**Accessibility** — role `navigation`, keyboard operable. Wrap in nav with aria-label="Breadcrumb"; Use an ordered list for semantic structure; Mark current page with aria-current="page".

**Do:** Use for hierarchical navigation structures; Always include the current page as the last item; Keep breadcrumb labels concise.
**Don't:** Do not use for flat navigation; Do not make the current page breadcrumb a link.

**Deprecated aliases** (do not use): `Breadcrumbs`, `Path navigation`


---

Tokens: ./tokens.css · Full system: ./llms.txt
