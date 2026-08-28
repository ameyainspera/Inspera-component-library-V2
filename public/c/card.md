<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Card

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Card

Group related content in a contained surface. — category: `data-display`.

```tsx
import { Card } from '@inspera/components'

<Card
  title="Algebra Quiz"
  elevation="Raised"
  padding="Default"
  interactive={false}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `'Card title'` |  |
| `body` | `string` | `'Group related content in a contained surface using consistent padding and elevation.'` |  |
| `elevation` | `'Flat' \| 'Raised' \| 'Outlined'` | `'Raised'` | Surface treatment. Values: Flat \| Raised \| Outlined. |
| `padding` | `'Default' \| 'Compact' \| 'Spacious'` | `'Default'` | Internal padding (12 / 16 / 24). Values: Compact \| Default \| Spacious. |
| `interactive` | `boolean` | `false` | Renders as a focusable button with hover elevation. Values: true \| false. |
| `children` | `string \| number \| bigint \| boolean \| import('/Users/inspera/Documents/Working Mockups/Component Library V2/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index').ReactElement<unknown, string \| import('/Users/inspera/Documents/Working Mockups/Component Library V2/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index').JSXElementConstructor<any>> \| Iterable<ReactNode> \| import('/Users/inspera/Documents/Working Mockups/Component Library V2/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index').ReactPortal \| Promise<string \| number \| bigint \| boolean \| import('/Users/inspera/Documents/Working Mockups/Component Library V2/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index').ReactPortal \| import('/Users/inspera/Documents/Working Mockups/Component Library V2/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index').ReactElement<unknown, string \| import('/Users/inspera/Documents/Working Mockups/Component Library V2/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index').JSXElementConstructor<any>> \| Iterable<ReactNode> \| null \| undefined> \| null` | — |  |
| `onClick` | `() => void` | — |  |

**Accessibility** — role `article`, keyboard operable. Interactive cards should use role="button" or be wrapped in an anchor; Non-interactive cards use role="article" or a semantic section.

**Do:** Use to group related content; Maintain consistent padding within a view; Use raised elevation for primary content cards.
**Don't:** Do not nest cards inside other cards; Do not use cards for layout-only purposes without content.


---

Tokens: ./tokens.css · Full system: ./llms.txt
