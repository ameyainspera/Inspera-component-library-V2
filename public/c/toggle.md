<!-- Inspera Design System v1.0.0 — generated 2026-08-29. Do not edit. -->

# Inspera — Toggle

1. Do not invent design decisions. Never invent a colour, spacing value, radius, shadow, font size, weight, icon library, focus style, breakpoint, or component variant that this document defines.
2. Use a canonical component before building a lookalike. If one exists for the job, use it.
3. Never rename a canonical component or prop. A deprecated alias may be understood as input, but output must use the canonical name.
4. Consume tokens, not literals. Raw values here define what a token resolves to; application code references `var(--token)`.
5. Do not introduce another design system. No Material UI, Bootstrap, Ant, Chakra, shadcn default styling, Tailwind default palette, or Radix Themes look. Headless behaviour libraries are fine if restyled entirely to this spec.
6. No arbitrary Tailwind values where a token exists. Never `bg-[#004080]` — use the token.
7. Inter for product UI. Noto Sans Mono only for code, identifiers and technical values; Noto Serif only for long-form content.
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

### Toggle

Switch a setting on or off instantly. — category: `input-controls`.

```tsx
import { Toggle } from '@inspera/components'

<Toggle
  label="Enable notifications"
  checked={false}
  size="Medium"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Toggle setting'` | Text beside the switch describing the setting. |
| `checked` | `boolean` | — | On / off state. |
| `state` | `'Default' \| 'Hover' \| 'Focused' \| 'Disabled'` | `'Default'` | Forces a visual state for documentation. Omit for real interactivity. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Track / thumb size. |
| `withLabel` | `boolean` | `true` | Render the label. |
| `onChange` | `(checked: boolean) => void` | — | Fired with the new on/off state. |

**Accessibility** — role `switch`, keyboard operable. Use role="switch" for the toggle; Use aria-checked to reflect on/off state; Space key toggles the switch.

**Do:** Use for immediate on/off settings; Provide a clear label describing the setting; Show the current state visually.
**Don't:** Do not use for form submissions — use Checkbox instead; Do not use without a visible label.

**Deprecated aliases** (do not use): `Switch`, `Toggle switch`


---

Tokens: ./tokens.css · Full system: ./llms.txt
