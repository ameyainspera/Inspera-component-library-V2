<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Progress

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

### Progress

Show completion of an ongoing task. - category: `feedback`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Progress } from '@inspera/components'

<Progress
  variant="Linear"
  value={60}
  intent="Primary"
  size="Medium"
  label="Uploading attachments"
  indeterminate={false}
  showValue={false}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'Linear' \| 'Circular'` | `'Linear'` | Bar or ring. |
| `value` | `number` | `60` | Completion percentage 0-100. Ignored when indeterminate. |
| `indeterminate` | `boolean` | `false` | Unknown-duration animation. |
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Medium'` | Bar height / ring diameter. |
| `intent` | `'Primary' \| 'Success' \| 'Warning' \| 'Error'` | `'Primary'` | Fill color. |
| `showValue` | `boolean` | `false` | Render the percentage. |
| `label` | `string` | `'Progress'` | Accessible name. Say what is progressing, not just "Progress". |

**Accessibility** - role `progressbar`. Use role="progressbar" with aria-valuenow / min / max; Omit aria-valuenow when indeterminate; Provide an accessible label for the task.

**Do:** Use determinate progress when completion is known; Use indeterminate for unknown-duration waits; Match intent color to context.
**Don't:** Do not use for very short operations; Do not fake progress values.

**Deprecated aliases** (do not use): `Progress bar`, `Loading bar`, `Meter`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- The bar heights are 4 / 8 / 12 and the ring diameters 24 / 40 / 56, with stroke widths 3 / 4 / 5.
- `role="progressbar"` with `aria-valuemin`, `aria-valuemax` and an `aria-label` is mandatory. A styled div announces nothing.
- When indeterminate, omit `aria-valuenow` entirely. Sending 0 tells the user it is stuck at zero.
- The indeterminate bar is a 40% sliver swept by keyframes across a clipped track - not a full-width bar that fades.
- The ring is rotated -90deg so the arc starts at twelve o'clock, and the arc length is set by `stroke-dashoffset`.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:       #004080;
  --error:         #D32F2F;
  --warning:       #EF6C00;
  --success:       #2E7D32;
  --gray-200:      #EDEDED;
  --text-primary:  rgba(0, 0, 0, 0.87);
  --radius-pill:   9999px;
  --font-sans:     'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-progress {
  --progress-fill: var(--primary);

  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  font-family: var(--font-sans);
}

.inspera-progress--circular { width: auto; }

.inspera-progress--success { --progress-fill: var(--success); }
.inspera-progress--warning { --progress-fill: var(--warning); }
.inspera-progress--error   { --progress-fill: var(--error); }

/* Linear: a rounded track that clips the fill. */
.inspera-progress__track {
  position: relative;
  flex: 1;
  height: 8px;
  border-radius: var(--radius-pill);
  background: var(--gray-200);
  overflow: hidden;
}
.inspera-progress--small .inspera-progress__track { height: 4px; }
.inspera-progress--large .inspera-progress__track { height: 12px; }

.inspera-progress__fill {
  display: block;
  height: 100%;
  border-radius: var(--radius-pill);
  background: var(--progress-fill);
  transition: width 240ms ease;
}

/* Indeterminate: a 40% sliver that sweeps the track. Width is animated, so the
   fill is absolutely positioned rather than sized by a value. */
.inspera-progress__fill--indeterminate {
  position: absolute;
  top: 0;
  left: 0;
  width: 40%;
  transition: none;
  animation: inspera-indeterminate 1.4s ease infinite;
}

.inspera-progress__value {
  font-size: 14px;
  color: var(--text-primary);
  min-width: 36px;
  text-align: right;
}

/* Circular: the ring spins as a whole when indeterminate. */
.inspera-progress__ring {
  display: inline-flex;
  width: 40px;
  height: 40px;
}
.inspera-progress__ring--indeterminate { animation: inspera-spin 0.9s linear infinite; }
.inspera-progress__ring > svg { transform: rotate(-90deg); }

@keyframes inspera-indeterminate {
  0%   { left: -40%; width: 40%; }
  50%  { width: 55%; }
  100% { left: 100%; width: 40%; }
}

@keyframes inspera-spin {
  to { transform: rotate(360deg); }
}
```

```html
<!-- Linear, 60%. The ARIA is the component: a styled div announces nothing. -->
<span class="inspera-progress">
  <span class="inspera-progress__track" role="progressbar"
        aria-valuemin="0" aria-valuemax="100" aria-valuenow="60" aria-label="Uploading attachments">
    <span class="inspera-progress__fill" style="width: 60%" aria-hidden="true"></span>
  </span>
  <span class="inspera-progress__value">60%</span>
</span>

<!-- Indeterminate: drop aria-valuenow entirely, do not send 0. -->
<span class="inspera-progress">
  <span class="inspera-progress__track" role="progressbar"
        aria-valuemin="0" aria-valuemax="100" aria-label="Loading">
    <span class="inspera-progress__fill inspera-progress__fill--indeterminate" aria-hidden="true"></span>
  </span>
</span>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
