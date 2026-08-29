<!-- Inspera Design System v1.0.0 — generated 2026-08-29. Do not edit. -->

# Inspera — Dialog

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

### Dialog

Present content or actions that require user attention. — category: `feedback`.

```tsx
import { Dialog } from '@inspera/components'

<Dialog
  open={open}
  size="Medium"
  title="Dialog title"
  hasCloseButton={true}
  hasActions={true}
  onClose={() => setOpen(false)}
  onConfirm={handleConfirm}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `'Dialog title'` | Dialog heading. Also the accessible name. |
| `body` | `ReactNode` | `'This is the dialog body. Provide context or a clear description of the action the user is about to take.'` | Dialog content. |
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Medium'` | Panel width 400 / 480 / 560. |
| `hasCloseButton` | `boolean` | `true` | Show the header close affordance. |
| `hasActions` | `boolean` | `true` | Show the footer action buttons. |
| `confirmLabel` | `string` | `'Continue'` | Label for the confirming action. Name the action — "Delete", not "OK". |
| `cancelLabel` | `string` | `'Cancel'` | Label for the dismissing action. |
| `open` | `boolean` | `true` | Whether the dialog is shown. Controlled — pair with onClose. |
| `embedded` | `boolean` | `false` | Render just the panel (no overlay) — used for documentation previews. |
| `onClose` | `() => void` | — | Fired on the close button, the overlay, and Escape. |
| `onConfirm` | `() => void` | — | Fired when the confirming action is activated. |

**Accessibility** — role `dialog`, keyboard operable. Use role="dialog" with aria-modal="true"; Set aria-labelledby to the dialog title; Trap focus inside the dialog when open; Return focus to trigger element on close; Escape key closes the dialog.

**Do:** Use for confirmations and critical decisions; Always provide a way to close the dialog; Keep dialog content focused and concise.
**Don't:** Do not open dialogs from other dialogs; Do not use for non-blocking information — use Alert instead.

**Deprecated aliases** (do not use): `Modal`, `Popup`


---

Tokens: ./tokens.css · Full system: ./llms.txt
