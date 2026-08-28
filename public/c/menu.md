<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Menu

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Menu

Present a list of actions in a dropdown. — category: `navigation`.

```tsx
import { Menu } from '@inspera/components'

<Menu
  label="Actions"
  placement="Bottom Start"
  items={[{ label: 'Edit', icon: 'edit' }, { label: 'Delete', icon: 'delete', danger: true }]}
  onSelect={handleSelect}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Actions'` | Trigger label. |
| `items` | `MenuItem[]` | `sampleItems` | Menu items. |
| `placement` | `'Bottom Start' \| 'Bottom End'` | `'Bottom Start'` | Alignment to trigger. Values: Bottom Start \| Bottom End. |
| `open` | `boolean` | — |  |
| `defaultOpen` | `boolean` | `false` | Open on mount. Values: true \| false. |
| `forceVisible` | `boolean` | `false` | Always render the open menu, for documentation. |
| `onSelect` | `(label: string) => void` | — |  |

```ts
export interface MenuItem {
  label: string
  icon?: string
  danger?: boolean
  disabled?: boolean
  divider?: boolean
}
```

**Accessibility** — role `menu`, keyboard operable. Trigger uses aria-haspopup="menu" and aria-expanded; Items use role="menuitem"; Arrow keys move, Enter selects, Escape closes; Outside click closes the menu.

**Do:** Use for grouped actions and overflow; Separate destructive actions with a divider; Keep item labels action-oriented.
**Don't:** Do not use for selecting a value — use Select; Do not nest menus more than one level.

**Deprecated aliases** (do not use): `Dropdown menu`, `Action menu`, `Context menu`, `Overflow menu`


---

Tokens: ./tokens.css · Full system: ./llms.txt
