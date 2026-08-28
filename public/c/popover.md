<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Popover

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Popover

Show interactive content anchored to a trigger. — category: `feedback`.

```tsx
import { Popover } from '@inspera/components'

<Popover
  placement="Bottom"
  title="Filter results"
  trigger={<Button label="Filters" />}
  content={<FilterForm />}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `trigger` | `ReactNode` | — | Element that toggles the popover. |
| `title` | `string` | `'Popover title'` | Optional panel heading. |
| `content` | `ReactNode` | `'Popover content with interactive elements.'` | Popover body content. |
| `placement` | `'Top' \| 'Bottom' \| 'Left' \| 'Right'` | `'Bottom'` | Position relative to the trigger. Values: Top \| Bottom \| Left \| Right. |
| `open` | `boolean` | — |  |
| `defaultOpen` | `boolean` | `false` | Open on mount. Values: true \| false. |
| `forceVisible` | `boolean` | `false` | Keep the panel visible regardless of state — used for documentation. |
| `onOpenChange` | `(open: boolean) => void` | — |  |

**Accessibility** — role `dialog`, keyboard operable. Trigger uses aria-haspopup and aria-expanded; Panel uses role="dialog"; Escape and outside-click close the popover; May contain interactive content (unlike Tooltip).

**Do:** Use for rich, interactive overflow content; Anchor to the triggering element; Allow dismissal via Escape and outside click.
**Don't:** Do not use for simple hover hints — use Tooltip; Do not stack popovers.

**Deprecated aliases** (do not use): `Flyout`, `Overlay panel`


---

Tokens: ./tokens.css · Full system: ./llms.txt
