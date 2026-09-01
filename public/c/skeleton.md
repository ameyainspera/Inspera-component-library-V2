<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Skeleton

1. Do not invent design decisions. Never invent a colour, spacing value, radius, shadow, font size, weight, icon library, focus style, breakpoint, or component variant that this document defines.
2. Use a canonical component before building a lookalike. If one exists for the job, use it.
3. Never rename a canonical component or prop. A deprecated alias may be understood as input, but output must use the canonical name.
4. Consume tokens, not literals. Raw values here define what a token resolves to; application code references `var(--token)`.
5. Do not introduce another design system. No Material UI, Bootstrap, Ant, Chakra, shadcn default styling, Tailwind default palette, or Radix Themes look. Headless behaviour libraries are fine if restyled entirely to this spec.
6. No arbitrary Tailwind values where a token exists. Never `bg-[#004080]` - use the token.
7. Inter for product UI. Noto Sans Mono only for code, identifiers and technical values; Noto Serif only for long-form content.
8. Material Symbols Outlined only. Do not mix in Lucide, Heroicons, or Font Awesome.
9. Accessibility is part of the component contract, not an enhancement. Keyboard operation, visible focus, labels, roles, names, and states are required.
10. Never use colour alone to carry meaning. Pair it with text, an icon, or shape.
11. Respect `prefers-reduced-motion: reduce` - drop non-essential motion.
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

### Skeleton

Show placeholder shapes while content loads. - category: `feedback`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Skeleton } from '@inspera/components'

<Skeleton
  variant="Text"
  lines={3}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'Text' \| 'Rect' \| 'Circle'` | `'Text'` | Placeholder shape. |
| `width` | `string \| number` | - | Explicit width. |
| `height` | `string \| number` | - | Explicit height. |
| `lines` | `number` | `1` | Number of text lines. Only applies to the Text variant. |
| `radius` | `string \| number` | - | Corner radius override. Match the shape being stood in for. |

**Accessibility** - role `presentation`. Skeletons are decorative and aria-hidden; Announce the real content once loaded; Mirror the layout of the content being loaded.

**Do:** Match skeleton shapes to real content; Use for perceived performance on initial load; Replace with content as soon as it arrives.
**Don't:** Do not animate skeletons indefinitely; Do not use for user-triggered actions - use Spinner.

**Deprecated aliases** (do not use): `Placeholder`, `Shimmer`, `Ghost`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- The shimmer is a 400%-wide linear gradient panned by `background-position`, 1.4s ease infinite. It is not an opacity pulse.
- Text lines are 12px tall with `--radius-sm` and an 8px gap; the last of several is 60% wide so the block reads as a paragraph.
- Rect uses `--radius-md`, Circle uses `--radius-pill`. Match the radius to whatever the placeholder stands in for.
- Always `aria-hidden` - a skeleton is decoration, and announcing it interrupts the user with nothing.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --gray-100:     #F7F7F7;
  --gray-200:     #EDEDED;
  --radius-sm:    4px;
  --radius-md:    8px;
  --radius-pill:  9999px;
}

.inspera-skeleton {
  /* The shimmer: an oversized gradient panned across the element. A pulsing
     opacity is a different effect and reads as a flash, not a load. */
  background-image: linear-gradient(90deg, var(--gray-200) 25%, var(--gray-100) 37%, var(--gray-200) 63%);
  background-size: 400% 100%;
  animation: inspera-shimmer 1.4s ease infinite;
}

.inspera-skeleton--text {
  display: block;
  width: 100%;
  height: 12px;
  border-radius: var(--radius-sm);
}

.inspera-skeleton--rect {
  display: block;
  width: 100%;
  height: 120px;
  border-radius: var(--radius-md);
}

.inspera-skeleton--circle {
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-pill);
}

/* A stack of lines, with the last one short so it reads as a paragraph. */
.inspera-skeleton-lines {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  background: none;
  animation: none;
}
.inspera-skeleton-lines > .inspera-skeleton--text:last-child:not(:only-child) { width: 60%; }

@keyframes inspera-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

```html
<!-- Three text lines. The wrapper is not itself a shimmering block. -->
<span class="inspera-skeleton-lines" role="presentation" aria-hidden="true">
  <span class="inspera-skeleton inspera-skeleton--text"></span>
  <span class="inspera-skeleton inspera-skeleton--text"></span>
  <span class="inspera-skeleton inspera-skeleton--text"></span>
</span>

<span class="inspera-skeleton inspera-skeleton--circle" role="presentation" aria-hidden="true"></span>

<span class="inspera-skeleton inspera-skeleton--rect" role="presentation" aria-hidden="true"></span>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
