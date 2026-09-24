<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Number Input

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

### Number Input

Enter and adjust a numeric value with steppers. - category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { NumberInput } from '@inspera/components'

<NumberInput
  label="Duration"
  value={value}
  onChange={setValue}
  min={0}
  max={240}
  step={5}
  size="Medium"
  suffix="min"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Amount'` | Field label. |
| `placeholder` | `string` | `'0'` | Hint shown when empty. |
| `value` | `number` | - | Current value. Controlled - pair with onChange. |
| `min` | `number` | - | Minimum allowed value. |
| `max` | `number` | - | Maximum allowed value. |
| `step` | `number` | `1` | Increment applied by the steppers and arrow keys. |
| `state` | `'Default' \| 'Focused' \| 'Disabled' \| 'Error' \| 'ReadOnly'` | `'Default'` | Freezes a visual state so documentation can show it without a pointer. `Focused` is presentation-only. `Error`, `Disabled` and `ReadOnly` are real application state. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Control height. |
| `showLabel` | `boolean` | `true` | Render the field label. |
| `suffix` | `string` | - | Unit suffix shown inside the field, e.g. "min" or "%". |
| `helpText` | `string` | - | Helper text. |
| `errorText` | `string` | - | Error message, shown when state is Error. |
| `onChange` | `(value: number) => void` | - | Fired with the new numeric value. |

**Accessibility** - role `spinbutton`, keyboard operable. Input carries aria-invalid in the error state; Up / Down arrows increment and decrement by step; Stepper buttons have aria-labels and are disabled at min / max.

**Do:** Clamp values between min and max; Show the unit as an inline suffix; Use a sensible step for the quantity.
**Don't:** Do not use for codes or IDs - use a text field; Do not hide the steppers when precise adjustment matters.

**Deprecated aliases** (do not use): `Stepper`, `Spinner input`, `Quantity picker`

#### One-time setup

Paste this once, at the root of the project. Without it the component inherits
the host tool's fonts and any icon renders as its own name instead of a glyph.

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Noto+Sans+Mono:wght@400;500&family=Noto+Serif:wght@400;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');

.material-symbols-outlined {
  font-weight: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  direction: ltr;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  font-feature-settings: 'liga';
  -webkit-font-feature-settings: 'liga';
  -moz-font-feature-settings: 'liga';
  user-select: none;
  font-family: 'Material Symbols Outlined';
}
```

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- The border belongs to the `__field` wrapper, not the `<input>`; the input and both steppers are unstyled so they share one border.
- Hide the native spinner (`appearance: textfield` plus the `-webkit` pseudo-elements) or it doubles up with the custom steppers.
- Steppers are 28px square, `--radius-sm`, `--action-active`, and go `--action-disabled` at min / max. Up / Down arrows do the same as the buttons.
- Resting border is `--border-control`, going `--border-control-strong` on hover and `--primary` with `--effect-state-focus` on `:focus-within`.
- Clamp to min / max and emit a real `number`, not a string.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --white:                  #ffffff;
  --gray-600:               #7A7A7A;
  --blue-300:               #B3D9FF;
  --action-active:          rgba(0, 0, 0, 0.56);
  --action-disabled:        rgba(0, 0, 0, 0.38);
  --text-primary:           rgba(0, 0, 0, 0.87);
  --border-control:         #C4C4C4;
  --border-control-strong:  #8C8C8C;
  --muted-foreground:       var(--gray-600);
  --radius-sm:              4px;
  --radius-md:              8px;
  --effect-state-focus:     0px 0px 0px 3px var(--blue-300);
  --border-width-default:   1px;
  --font-sans:              'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-number {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  font-family: var(--font-sans);
}

.inspera-number__label {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

/* The border is on the wrapper. Steppers and input sit inside it unstyled. */
.inspera-number__field {
  height: 40px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 4px 0 12px;
  border-radius: var(--radius-md);
  border: var(--border-width-default) solid var(--border-control);
  background: var(--white);
}

.inspera-number--small .inspera-number__field { height: 32px; }

.inspera-number__field:hover { border-color: var(--border-control-strong); }
.inspera-number__field:focus-within {
  border-color: var(--primary);
  box-shadow: var(--effect-state-focus);
}

/* The input carries no chrome; the UA spinner is hidden so it never doubles
   up with our own steppers. */
.inspera-number__control {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-sans);
  font-size: 16px;
  color: var(--text-primary);
  appearance: textfield;
  -webkit-appearance: textfield;
}
.inspera-number__control::-webkit-outer-spin-button,
.inspera-number__control::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

.inspera-number__suffix {
  font-size: 14px;
  color: var(--muted-foreground);
}

.inspera-number__steppers { display: inline-flex; }

.inspera-number__step {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  color: var(--action-active);
  cursor: pointer;
}
.inspera-number__step:disabled { color: var(--action-disabled); cursor: not-allowed; }
.inspera-number__step .material-symbols-outlined { font-size: 20px; }
```

```html
<div class="inspera-number">
  <label class="inspera-number__label" for="duration">Duration</label>
  <div class="inspera-number__field">
    <input class="inspera-number__control" id="duration" type="number"
           inputmode="numeric" aria-label="Duration" />
    <span class="inspera-number__suffix">min</span>
    <span class="inspera-number__steppers">
      <button type="button" class="inspera-number__step" aria-label="Decrease Duration">
        <span class="material-symbols-outlined" aria-hidden="true">remove</span>
      </button>
      <button type="button" class="inspera-number__step" aria-label="Increase Duration">
        <span class="material-symbols-outlined" aria-hidden="true">add</span>
      </button>
    </span>
  </div>
</div>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
