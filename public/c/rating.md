<!-- Inspera Design System v1.0.0 — generated file, do not edit. -->

# Inspera — Rating

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

### Rating

Capture or display a star rating. — category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library — build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Rating } from '@inspera/components'

<Rating
  value={score}
  onChange={setScore}
  max={5}
  size="Medium"
  readOnly={false}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | — | Current rating. Controlled — pair with onChange. Omit it and the component tracks its own, the same contract Checkbox and Toggle use. |
| `max` | `number` | `5` | Number of stars. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Star size. |
| `readOnly` | `boolean` | `false` | Display-only mode. |
| `showValue` | `boolean` | `false` | Show numeric value. |
| `onChange` | `(value: number) => void` | — | Fired with the chosen rating. Not fired when readOnly. |

**Accessibility** — role `radiogroup`, keyboard operable. Container uses role="radiogroup" with an accessible label; Each star is a radio with aria-checked and an aria-label; Arrow keys adjust the rating.

**Do:** Use for feedback and review scores; Show hover preview when interactive; Use read-only mode to display aggregate scores.
**Don't:** Do not use for precise numeric input; Do not omit accessible labels on stars.

**Deprecated aliases** (do not use): `Star rating`, `Stars`

#### Without the package — exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- One glyph — `star` — with the variable font’s FILL axis at 0 or 1. Swapping to a different outline glyph changes the shape and makes the row jump on hover.
- Filled stars are `--warning` #EF6C00; empty ones `--gray-400`. Stars are 28px (20px small) with a 2px gap.
- `role="radiogroup"` with `role="radio"` stars, a roving tabindex, and arrow keys that both move focus and set the value.
- Every star needs its own label ("3 stars"), or the control announces as five unlabelled radios.
- Hovering previews the rating up to the pointer; leaving restores the committed value.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:            #004080;
  --warning:            #EF6C00;
  --gray-400:           #BCBCBC;
  --gray-600:           #7A7A7A;
  --muted-foreground:   var(--gray-600);
  --radius-xs:          2px;
  --focus-ring-width:   2px;
  --focus-ring-offset:  2px;
  --focus-ring-color:   var(--primary);
  --font-mono:          'Noto Sans Mono', ui-monospace, SFMono-Regular, monospace;
}

.inspera-rating {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.inspera-rating__stars {
  display: inline-flex;
  gap: 2px;
}

.inspera-rating__star {
  font-size: 28px;
  line-height: 1;
  color: var(--gray-400);
  /* Same glyph, different fill axis. Swapping to a "star_outline" glyph shifts
     the shape and makes the row jump as you hover across it. */
  font-variation-settings: 'FILL' 0;
  border-radius: var(--radius-xs);
  cursor: pointer;
}

.inspera-rating--small .inspera-rating__star { font-size: 20px; }

.inspera-rating__star--filled {
  color: var(--warning);
  font-variation-settings: 'FILL' 1;
}

.inspera-rating__star:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.inspera-rating--readonly .inspera-rating__star { cursor: default; }

.inspera-rating__value {
  font-size: 14px;
  color: var(--muted-foreground);
  font-family: var(--font-mono);
}
```

```html
<!-- Roving tabindex again: one tab stop, arrows move and set the value. -->
<div class="inspera-rating" role="radiogroup" aria-label="Rating">
  <div class="inspera-rating__stars">
    <span class="material-symbols-outlined inspera-rating__star inspera-rating__star--filled"
          role="radio" aria-checked="false" aria-label="1 star" tabindex="-1">star</span>
    <span class="material-symbols-outlined inspera-rating__star inspera-rating__star--filled"
          role="radio" aria-checked="false" aria-label="2 stars" tabindex="-1">star</span>
    <span class="material-symbols-outlined inspera-rating__star inspera-rating__star--filled"
          role="radio" aria-checked="true" aria-label="3 stars" tabindex="0">star</span>
    <span class="material-symbols-outlined inspera-rating__star"
          role="radio" aria-checked="false" aria-label="4 stars" tabindex="-1">star</span>
    <span class="material-symbols-outlined inspera-rating__star"
          role="radio" aria-checked="false" aria-label="5 stars" tabindex="-1">star</span>
  </div>
</div>
```


---

Tokens: ./tokens.css · Full system: ./llms.txt
