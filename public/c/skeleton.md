<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Skeleton

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Skeleton

Show placeholder shapes while content loads. — category: `feedback`.

```tsx
import { Skeleton } from '@inspera/components'

<Skeleton
  variant="Text"
  lines={3}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'Text' \| 'Rect' \| 'Circle'` | `'Text'` | Placeholder shape. Values: Text \| Rect \| Circle. |
| `width` | `string \| number` | — | Explicit width. Values: string \| number. |
| `height` | `string \| number` | — | Explicit height. Values: string \| number. |
| `lines` | `number` | `1` | Number of text lines. Only applies to the Text variant. |
| `radius` | `string \| number` | — |  |

**Accessibility** — role `presentation`. Skeletons are decorative and aria-hidden; Announce the real content once loaded; Mirror the layout of the content being loaded.

**Do:** Match skeleton shapes to real content; Use for perceived performance on initial load; Replace with content as soon as it arrives.
**Don't:** Do not animate skeletons indefinitely; Do not use for user-triggered actions — use Spinner.

**Deprecated aliases** (do not use): `Placeholder`, `Shimmer`, `Ghost`


---

Tokens: ./tokens.css · Full system: ./llms.txt
