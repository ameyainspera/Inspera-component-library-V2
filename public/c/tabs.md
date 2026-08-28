<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Tabs

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Tabs

Organize content into switchable panels. — category: `navigation`.

```tsx
import { Tabs } from '@inspera/components'

<Tabs
  items={[{ label: 'Overview' }, { label: 'Questions' }]}
  style="Underline"
  size="Medium"
  fullWidth={false}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `TabItem[]` | `defaultItems` |  |
| `style` | `'Underline' \| 'Contained'` | `'Underline'` | Visual treatment. Values: Underline \| Contained. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Tab height 40 / 48. Values: Small \| Medium. |
| `fullWidth` | `boolean` | `false` | Stretch tabs to fill the row. Values: true \| false. |
| `value` | `number` | — |  |
| `onChange` | `(index: number) => void` | — |  |

```ts
export interface TabItem {
  label: string
  icon?: string
}
```

**Accessibility** — role `tablist`, keyboard operable. Use role="tablist" on the tab container; Each tab uses role="tab" with aria-selected; Tab panels use role="tabpanel" linked by aria-labelledby; Arrow keys navigate between tabs.

**Do:** Use to organize related content sections; Label tabs clearly and concisely; Use a maximum of 6 tabs per set.
**Don't:** Do not use tabs for sequential steps — use a stepper instead; Do not nest tab sets inside other tab sets.

**Deprecated aliases** (do not use): `Tab bar`, `Tab navigation`


---

Tokens: ./tokens.css · Full system: ./llms.txt
