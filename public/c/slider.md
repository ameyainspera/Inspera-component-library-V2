<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Slider

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

### Slider

Select a numeric value from a continuous range. - category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Slider } from '@inspera/components'

<Slider
  label="Volume"
  min={0}
  max={100}
  value={volume}
  onChange={setVolume}
  showValue={true}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Value'` | Field label describing what is being adjusted. |
| `min` | `number` | `0` | Minimum value. |
| `max` | `number` | `100` | Maximum value. |
| `value` | `number` | - | Current value. Controlled - pair with onChange. |
| `step` | `number` | `1` | Increment granularity. |
| `state` | `'Default' \| 'Focused' \| 'Disabled'` | `'Default'` | Freezes a visual state so documentation can show it without a pointer. `Focused` is presentation-only - leave it unset in application code, where CSS drives it from the real pointer and keyboard. `Disabled` is real application state and belongs in your code. |
| `showValue` | `boolean` | `true` | Show the current value. |
| `showLabel` | `boolean` | `true` | Show the field label. |
| `onChange` | `(value: number) => void` | - | Fired as the value changes, by drag or arrow key. |

**Accessibility** - role `slider`, keyboard operable. Use role="slider" with aria-valuemin / aria-valuemax / aria-valuenow; Provide an accessible label via aria-label; Arrow keys adjust the value.

**Do:** Use for adjustable numeric ranges; Show the current value for precision; Provide a clear label.
**Don't:** Do not use for exact numeric entry - use Text Input instead; Do not use without min/max bounds.

**Deprecated aliases** (do not use): `Range`, `Range slider`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- Keep a real `<input type="range">`, made invisible with `opacity: 0` over the drawn track. Arrows, Home/End, Page Up/Down and touch drag all come free; a div rebuild loses every one of them.
- The thumb takes `pointer-events: none` so the input underneath receives the drag.
- Track is 4px `--gray-300`, fill is `--primary`, thumb is 20px white with a 2px `--primary` border.
- Position the thumb with `left: <pct>%` and `transform: translate(-50%, -50%)`, so it centres on the value rather than hanging off the end.
- The focus ring goes on the drawn thumb, since the real input is invisible.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:            #004080;
  --white:              #ffffff;
  --gray-300:           #D9D9D9;
  --gray-600:           #7A7A7A;
  --text-primary:       rgba(0, 0, 0, 0.87);
  --muted-foreground:   var(--gray-600);
  --radius-pill:        9999px;
  --focus-ring-width:   2px;
  --focus-ring-offset:  2px;
  --focus-ring-color:   var(--primary);
  --font-sans:          'Inter', system-ui, -apple-system, sans-serif;
  --font-mono:          'Noto Sans Mono', ui-monospace, SFMono-Regular, monospace;
}

.inspera-slider {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  font-family: var(--font-sans);
}

.inspera-slider__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.inspera-slider__label {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.inspera-slider__value {
  font-size: 14px;
  color: var(--muted-foreground);
  font-family: var(--font-mono);
}

.inspera-slider__control {
  position: relative;
  height: 20px;
  display: flex;
  align-items: center;
}

.inspera-slider__track {
  position: absolute;
  left: 0;
  right: 0;
  height: 4px;
  border-radius: var(--radius-pill);
  background: var(--gray-300);
}

.inspera-slider__fill {
  position: absolute;
  left: 0;
  height: 4px;
  border-radius: var(--radius-pill);
  background: var(--primary);
}

/* Drawn, and deliberately not hit-testable - the real input above it takes
   every pointer event, so drag, click-to-seek and touch all still work. */
.inspera-slider__thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  background: var(--white);
  border: 2px solid var(--primary);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  pointer-events: none;
}

/* The native input, invisible but fully functional: arrows, Home/End, Page
   Up/Down and touch drag all come free. Rebuilding this with a div loses them. */
.inspera-slider__input {
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 20px;
  margin: 0;
  opacity: 0;
  cursor: pointer;
}

.inspera-slider__input:focus-visible + .inspera-slider__thumb,
.inspera-slider__control:has(:focus-visible) .inspera-slider__thumb {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.inspera-slider--disabled { opacity: 0.5; }
.inspera-slider--disabled .inspera-slider__input { cursor: not-allowed; }
```

```html
<div class="inspera-slider">
  <div class="inspera-slider__head">
    <label class="inspera-slider__label" for="volume">Volume</label>
    <span class="inspera-slider__value">50</span>
  </div>
  <div class="inspera-slider__control">
    <div class="inspera-slider__track"></div>
    <div class="inspera-slider__fill" style="width: 50%"></div>
    <span class="inspera-slider__thumb" style="left: 50%"></span>
    <input class="inspera-slider__input" id="volume" type="range"
           min="0" max="100" value="50" aria-label="Volume" />
  </div>
</div>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
