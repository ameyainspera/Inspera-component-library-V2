<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Table

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Table

Display structured data in rows and columns. — category: `data-display`.

```tsx
import { Table } from '@inspera/components'

<Table
  size="Default"
  striped={false}
  columns={[{ key: 'name', header: 'Assessment' }]}
  rows={[{ name: 'Algebra Quiz' }]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `TableColumn[]` | `defaultColumns` | Column definitions. |
| `rows` | `Record<string, ReactNode>[]` | `defaultRows` | Row data keyed by column. |
| `size` | `'Default' \| 'Compact'` | `'Default'` | Row height density. Values: Compact \| Default. |
| `striped` | `boolean` | `false` | Zebra-stripe rows. Values: true \| false. |
| `hoverable` | `boolean` | `true` | Highlight rows on hover. Values: true \| false. |
| `selectable` | `boolean` | `false` | Add a row selection column. Values: true \| false. |
| `caption` | `string` | — |  |
| `onRowClick` | `(row: Record<string, ReactNode>, index: number) => void` | — |  |

**Accessibility** — role `table`, keyboard operable. Use semantic table / thead / tbody markup; Header cells use scope="col"; Provide a caption or aria-label describing the table.

**Do:** Use for comparable, structured records; Right-align numeric columns; Keep headers concise.
**Don't:** Do not use tables for page layout; Do not overload rows with unrelated actions.

**Deprecated aliases** (do not use): `Data table`, `Grid`, `Datagrid`


---

Tokens: ./tokens.css · Full system: ./llms.txt
