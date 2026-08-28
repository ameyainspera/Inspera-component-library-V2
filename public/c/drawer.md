<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Drawer

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
| `side` | `'Right' \| 'Left' \| 'Bottom'` | `'Right'` | Edge it slides from. Values: Right \| Left \| Bottom. |
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Medium'` | Panel width / height. Values: Small \| Medium \| Large. |
| `title` | `string` | `'Panel'` | Header title. |
| `hasCloseButton` | `boolean` | `true` | Show the close affordance. Values: true \| false. |
| `children` | `ReactNode` | — |  |
| `embedded` | `boolean` | `false` | Render just the panel inline (no overlay/scrim) — used for documentation previews. |
| `onClose` | `() => void` | — |  |

**Accessibility** — role `dialog`, keyboard operable. Use role="dialog" with aria-modal="true"; Set aria-labelledby to the drawer title; Trap focus while open and restore it on close; Escape closes the drawer.

**Do:** Use for secondary tasks and detail panels; Provide a clear close control; Return focus to the trigger on close.
**Don't:** Do not use for critical confirmations — use Dialog; Do not open multiple drawers at once.

**Deprecated aliases** (do not use): `Sheet`, `Side panel`, `Off-canvas`


---

Tokens: ./tokens.css · Full system: ./llms.txt
