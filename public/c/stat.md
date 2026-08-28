<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Stat

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Stat

Highlight a key metric with an optional trend. — category: `data-display`.

```tsx
import { Stat } from '@inspera/components'

<Stat
  label="Active candidates"
  value="12,480"
  delta="+8.2% vs last week"
  deltaIntent="up"
  icon="group"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | `'Average score'` | Metric name. |
| `value` **(required)** | `string \| number` | `'84%'` | Metric value. Values: string \| number. |
| `delta` | `string` | `'+4.2%'` | Change indicator text. |
| `deltaIntent` | `'up' \| 'down' \| 'neutral'` | `'up'` | Trend direction / color. Values: up \| down \| neutral. |
| `icon` | `string` | — | Optional leading icon. |
| `helpText` | `string` | — |  |

**Accessibility** — role `group`. Associate the value with its label for screen readers; Convey trend with text, not color alone; Use aria-label to summarize the metric and change.

**Do:** Use for dashboard summaries; Pair a value with a clear label; Indicate trend direction with an icon and text.
**Don't:** Do not rely on color alone for the delta; Do not crowd many stats without spacing.

**Deprecated aliases** (do not use): `Metric`, `KPI`, `Stat card`


---

Tokens: ./tokens.css · Full system: ./llms.txt
