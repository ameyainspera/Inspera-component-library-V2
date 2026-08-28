<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Empty State

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Empty State

Communicate the absence of content and offer a next step. — category: `data-display`.

```tsx
import { EmptyState } from '@inspera/components'

<EmptyState
  icon="inbox"
  title="No assessments yet"
  description="Create your first assessment."
  actionLabel="New assessment"
  size="Medium"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | `string` | `'inbox'` | Material Symbols icon name. |
| `title` | `string` | `'No results found'` | Primary message. |
| `description` | `string` | `'Try adjusting your filters or search terms.'` | Supporting explanation. |
| `actionLabel` | `string` | — | Optional primary action label. |
| `onAction` | `() => void` | — |  |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Overall scale. Values: Small \| Medium. |

**Accessibility** — role `status`, keyboard operable. Announce dynamically-appearing empty states with role="status"; The action must be a real focusable button; The illustration/icon is decorative (aria-hidden).

**Do:** Explain why the area is empty; Offer a clear next action when possible; Keep the tone helpful.
**Don't:** Do not leave empty areas blank with no guidance; Do not use for transient loading — use Skeleton.

**Deprecated aliases** (do not use): `Blank slate`, `Zero state`, `No data`


---

Tokens: ./tokens.css · Full system: ./llms.txt
