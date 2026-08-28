<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Segmented Control

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Segmented Control

Choose one option from a small set of mutually exclusive segments. — category: `input-controls`.

```tsx
import { SegmentedControl } from '@inspera/components'

<SegmentedControl
  items={['Day', 'Week', 'Month']}
  value={1}
  size="Medium"
  fullWidth={false}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `string[]` | `['Day', 'Week', 'Month']` | Segment labels. |
| `value` | `number` | — | Active segment index. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Segment height. Values: Small \| Medium. |
| `fullWidth` | `boolean` | `false` | Stretch to fill the row. Values: true \| false. |
| `onChange` | `(index: number) => void` | — |  |

**Accessibility** — role `radiogroup`, keyboard operable. Container uses role="radiogroup"; Each segment uses role="radio" with aria-checked; Arrow keys move between segments.

**Do:** Use for 2–4 mutually exclusive views; Keep labels short and parallel; Show the active segment clearly.
**Don't:** Do not use for more than 4 options — use Tabs or Select; Do not use for multi-select.

**Deprecated aliases** (do not use): `Segment control`, `Toggle group`, `Button group`


---

Tokens: ./tokens.css · Full system: ./llms.txt
