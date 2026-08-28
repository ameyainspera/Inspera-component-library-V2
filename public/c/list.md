<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — List

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### List

Present a vertical series of related items. — category: `data-display`.

```tsx
import { List } from '@inspera/components'

<List
  size="Default"
  divided={true}
  interactive={false}
  items={[{ primary: 'General settings', secondary: '…', leading: 'settings' }]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `ListItem[]` | `defaultItems` | List rows. |
| `divided` | `boolean` | `true` | Show dividers between rows. Values: true \| false. |
| `interactive` | `boolean` | `false` | Make rows clickable. Values: true \| false. |
| `size` | `'Default' \| 'Compact'` | `'Default'` | Row density. Values: Compact \| Default. |
| `onItemClick` | `(item: ListItem, index: number) => void` | — |  |

**Accessibility** — role `list`, keyboard operable. Use semantic list markup (ul / li); Interactive rows are buttons and keyboard focusable; Provide meaningful text for each item.

**Do:** Use for settings, results, and simple records; Keep primary text scannable; Use secondary text for supporting detail.
**Don't:** Do not use for comparable tabular data — use Table; Do not make only part of a row clickable.

**Deprecated aliases** (do not use): `List view`, `Item list`


---

Tokens: ./tokens.css · Full system: ./llms.txt
