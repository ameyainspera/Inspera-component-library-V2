<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Stepper

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Stepper

Show progress through a sequence of steps. — category: `navigation`.

```tsx
import { Stepper } from '@inspera/components'

<Stepper
  steps={[{ label: 'Details' }, { label: 'Questions' }, { label: 'Review' }]}
  activeStep={1}
  orientation="Horizontal"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `steps` | `Step[]` | `defaultSteps` | Ordered steps. |
| `activeStep` | `number` | `1` | Zero-based index of the current step. |
| `orientation` | `'Horizontal' \| 'Vertical'` | `'Horizontal'` | Layout direction. Values: Horizontal \| Vertical. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Indicator size. Values: Small \| Medium. |

```ts
export interface Step {
  label: string
  description?: string
}
```

**Accessibility** — role `list`. Use an ordered list for step semantics; Mark the current step with aria-current="step"; Convey completion with an icon, not color alone.

**Do:** Use for multi-step flows and wizards; Show completed, current, and upcoming states; Keep step labels short.
**Don't:** Do not use for non-sequential navigation — use Tabs; Do not exceed a handful of steps.

**Deprecated aliases** (do not use): `Wizard`, `Progress steps`, `Step indicator`


---

Tokens: ./tokens.css · Full system: ./llms.txt
