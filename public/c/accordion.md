<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Accordion

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Accordion

Show and hide sections of related content. — category: `data-display`.

```tsx
import { Accordion } from '@inspera/components'

<Accordion
  type="Single"
  iconPosition="Right"
  items={[{ title: 'What is Inspera?', content: '…' }]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `AccordionItem[]` | `defaultItems` | Accordion sections. |
| `type` | `'Single' \| 'Multiple'` | `'Single'` | Allow one or many open at once. Values: Single \| Multiple. |
| `defaultOpenIndex` | `number` | `0` | Initially open section. |
| `iconPosition` | `'Left' \| 'Right'` | `'Right'` | Chevron placement. Values: Left \| Right. |

```ts
export interface AccordionItem {
  title: string
  content: ReactNode
}
```

**Accessibility** — role `region`, keyboard operable. Header is a button with aria-expanded and aria-controls; Panel uses role="region" linked via aria-labelledby; Enter / Space toggle the section.

**Do:** Use to progressively disclose content; Keep section titles scannable; Use Single mode when only one section is relevant at a time.
**Don't:** Do not nest accordions deeply; Do not hide critical content behind collapsed sections.

**Deprecated aliases** (do not use): `Disclosure`, `Collapse`, `Expander`


---

Tokens: ./tokens.css · Full system: ./llms.txt
