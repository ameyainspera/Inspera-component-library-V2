<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Tooltip

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Tooltip

Provide contextual help on hover or focus. — category: `feedback`.

```tsx
import { Tooltip } from '@inspera/components'

<Tooltip
  content="Supplementary help text"
  placement="Top"
  theme="Dark"
  type="Default"
>
  <IconButton icon="help" />
</Tooltip>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | `string` | `'Supplementary help text'` |  |
| `placement` | `'Top' \| 'Bottom' \| 'Left' \| 'Right'` | `'Top'` | Position relative to the trigger. Values: Top \| Bottom \| Left \| Right. |
| `theme` | `'Light' \| 'Dark'` | `'Dark'` | Surface color. Values: Light \| Dark. |
| `type` | `'Default' \| 'Accessibility'` | `'Default'` | Accessibility type uses larger text. Values: Default \| Accessibility. |
| `children` | `ReactNode` | — |  |
| `forceVisible` | `boolean` | `false` | Keep the tooltip visible regardless of hover — used for documentation. |

**Accessibility** — role `tooltip`, keyboard operable. Use role="tooltip" on the tooltip element; Link trigger and tooltip with aria-describedby; Escape key dismisses the tooltip; Tooltip must not contain interactive content.

**Do:** Use for supplementary information; Keep tooltip text short and scannable; Position to avoid clipping viewport edges.
**Don't:** Do not put critical information only in tooltips; Do not use for interactive content — use Popover instead.

**Deprecated aliases** (do not use): `Tooltips`, `Walkthrough`, `a11y tooltips`


---

Tokens: ./tokens.css · Full system: ./llms.txt
