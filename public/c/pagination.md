<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Pagination

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Pagination

Navigate between pages of content. — category: `navigation`.

```tsx
import { Pagination } from '@inspera/components'

<Pagination
  page={page}
  pageCount={12}
  size="Medium"
  showEdges={true}
  onChange={setPage}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | `number` | `1` | Current page (1-based). |
| `pageCount` | `number` | `10` | Total number of pages. |
| `siblingCount` | `number` | `1` | Pages shown either side of current. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Control height. Values: Small \| Medium. |
| `showEdges` | `boolean` | `true` | Show first / last controls. Values: true \| false. |
| `onChange` | `(page: number) => void` | — |  |

**Accessibility** — role `navigation`, keyboard operable. Wrap in nav with aria-label="Pagination"; Mark the current page with aria-current="page"; Disable and aria-disable prev/next at the bounds.

**Do:** Use for long, paged result sets; Show current, first, and last pages; Collapse large gaps with an ellipsis.
**Don't:** Do not use for a handful of items; Do not hide the current page indicator.

**Deprecated aliases** (do not use): `Pager`, `Page navigation`


---

Tokens: ./tokens.css · Full system: ./llms.txt
