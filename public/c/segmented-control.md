<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Segmented Control

1. Do not invent design decisions. Never invent a colour, spacing value, radius, shadow, font size, weight, icon library, focus style, breakpoint, or component variant that this document defines.
2. Use a canonical component before building a lookalike. If one exists for the job, use it.
3. Never rename a canonical component or prop. A deprecated alias may be understood as input, but output must use the canonical name.
4. Consume tokens, not literals. Raw values here define what a token resolves to; application code references `var(--token)`.
5. Do not introduce another design system. No Material UI, Bootstrap, Ant, Chakra, shadcn default styling, Tailwind default palette, or Radix Themes look. Headless behaviour libraries are fine if restyled entirely to this spec.
6. No arbitrary Tailwind values where a token exists. Never `bg-[#004080]` — use the token.
7. Inter for product UI. JetBrains Mono only for code, identifiers, and technical values.
8. Material Symbols Outlined only. Do not mix in Lucide, Heroicons, or Font Awesome.
9. Accessibility is part of the component contract, not an enhancement. Keyboard operation, visible focus, labels, roles, names, and states are required.
10. Never use colour alone to carry meaning. Pair it with text, an icon, or shape.
11. Respect `prefers-reduced-motion: reduce` — drop non-essential motion.
12. Compose rather than invent. If a pattern is not a canonical component, build it from canonical components using the patterns below.
13. Do not silently add a component. If the system genuinely cannot express something, emit `DESIGN_SYSTEM_GAP` in your output and use the closest documented composition.
14. No decoration that competes with hierarchy: no gradients, glassmorphism, oversized radii, decorative shadows, or animated backgrounds.

**Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
silently ignores an unknown prop, so a capitalised name renders the default
variant with no error at all. Variant *values* are Capitalised
(`intent="Primary"`, `size="Medium"`).

**When two instructions conflict**, this order wins:

1. Accessibility and safety requirements
2. The rules above
3. Token definitions
4. Canonical component specifications
5. Composition patterns
6. Product requirements supplied with the task
7. Examples

**When the spec does not answer your question:**

- Reuse the nearest canonical component or composition.
- Reuse an existing token.
- Preserve the established density and hierarchy.
- Do not infer a brand colour or visual style from framework defaults.
- Mark a genuinely missing primitive `DESIGN_SYSTEM_GAP` rather than presenting it as canonical.

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
