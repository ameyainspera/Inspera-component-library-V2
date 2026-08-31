<!-- Inspera Design System v1.0.0 — generated file, do not edit. -->

# Inspera — Spinner

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

### Spinner

Indicate an indeterminate loading state. — category: `feedback`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library — build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Spinner } from '@inspera/components'

<Spinner
  size="Medium"
  intent="Primary"
  label="Loading assessments"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Medium'` | Diameter 16 / 24 / 40. |
| `intent` | `'Primary' \| 'Neutral' \| 'Inverse'` | `'Primary'` | Arc color. |
| `label` | `string` | `'Loading'` | Accessible label. |

**Accessibility** — role `status`. Use role="status" with aria-live="polite"; Provide an accessible label via aria-label; Include visually-hidden loading text.

**Do:** Use for short, indeterminate waits; Use Inverse on dark surfaces; Pair with context describing what is loading.
**Don't:** Do not use where determinate Progress is possible; Do not show multiple competing spinners.

**Deprecated aliases** (do not use): `Loader`, `Loading indicator`, `Activity indicator`

#### Without the package — exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- It is an SVG of two circles — a full `--gray-200` track and a coloured arc — not a bordered div with one transparent side.
- The arc is drawn by `stroke-dasharray` = circumference and `stroke-dashoffset` = 70% of it. Change the offset, not the geometry.
- Diameters are 16 / 24 / 40 with stroke widths 2 / 3 / 4.
- Rotation is 0.8s linear infinite on the `<svg>`, so the arc spins and the track does not.
- The visually hidden label is required — `role="status"` with no name announces nothing.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:    #004080;
  --gray-200:   #EDEDED;
  --font-sans:  'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-spinner {
  display: inline-flex;
  width: 24px;
  height: 24px;
}

.inspera-spinner--small { width: 16px; height: 16px; }
.inspera-spinner--large { width: 40px; height: 40px; }

.inspera-spinner > svg {
  animation: inspera-spin 0.8s linear infinite;
}

/* The visually hidden label. A spinner with no accessible name announces
   nothing at all, so this is not optional. */
.inspera-spinner__label {
  font-family: var(--font-sans);
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

@keyframes inspera-spin {
  to { transform: rotate(360deg); }
}
```

```html
<!-- Medium (24px). The track is --gray-200; the arc is the intent colour. -->
<span class="inspera-spinner" role="status" aria-label="Loading assessments">
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10.5" fill="none" stroke="var(--gray-200)" stroke-width="3"></circle>
    <circle cx="12" cy="12" r="10.5" fill="none" stroke="var(--primary)" stroke-width="3"
            stroke-linecap="round" stroke-dasharray="65.97344572538566" stroke-dashoffset="46.18141200776996"></circle>
  </svg>
  <span class="inspera-spinner__label">Loading assessments</span>
</span>
```


---

Tokens: ./tokens.css · Full system: ./llms.txt
