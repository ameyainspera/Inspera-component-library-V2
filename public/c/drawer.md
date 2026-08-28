<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Drawer

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Drawer

Slide a panel in from the edge of the screen. — category: `feedback`.

```tsx
import { Drawer } from '@inspera/components'

<Drawer
  open={open}
  side="Right"
  size="Medium"
  title="Assessment details"
  hasCloseButton={true}
  onClose={() => setOpen(false)}
>
  {children}
</Drawer>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | `false` | Visibility. Values: true \| false. |
| `side` | `'Left' \| 'Right' \| 'Bottom'` | `'Right'` | Edge it slides from. Values: Right \| Left \| Bottom. |
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Medium'` | Panel width / height. Values: Small \| Medium \| Large. |
| `title` | `string` | `'Panel'` | Header title. |
| `hasCloseButton` | `boolean` | `true` | Show the close affordance. Values: true \| false. |
| `children` | `string \| number \| bigint \| boolean \| import('/Users/inspera/Documents/Working Mockups/Component Library V2/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index').ReactElement<unknown, string \| import('/Users/inspera/Documents/Working Mockups/Component Library V2/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index').JSXElementConstructor<any>> \| Iterable<ReactNode> \| import('/Users/inspera/Documents/Working Mockups/Component Library V2/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index').ReactPortal \| Promise<string \| number \| bigint \| boolean \| import('/Users/inspera/Documents/Working Mockups/Component Library V2/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index').ReactPortal \| import('/Users/inspera/Documents/Working Mockups/Component Library V2/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index').ReactElement<unknown, string \| import('/Users/inspera/Documents/Working Mockups/Component Library V2/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index').JSXElementConstructor<any>> \| Iterable<ReactNode> \| null \| undefined> \| null` | — |  |
| `embedded` | `boolean` | `false` | Render just the panel inline (no overlay/scrim) — used for documentation previews. |
| `onClose` | `() => void` | — |  |

**Accessibility** — role `dialog`, keyboard operable. Use role="dialog" with aria-modal="true"; Set aria-labelledby to the drawer title; Trap focus while open and restore it on close; Escape closes the drawer.

**Do:** Use for secondary tasks and detail panels; Provide a clear close control; Return focus to the trigger on close.
**Don't:** Do not use for critical confirmations — use Dialog; Do not open multiple drawers at once.

**Deprecated aliases** (do not use): `Sheet`, `Side panel`, `Off-canvas`


---

Tokens: ./tokens.css · Full system: ./llms.txt
