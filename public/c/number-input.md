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
  defaultValue={45}
  min={0}
  max={240}
  step={5}
  suffix="min"
  helpText="Between 0 and 240."
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Field label. Always required: it is the accessible name even when hidden. |
| `placeholder` | `string` | - | Hint shown when empty. |
| `value` | `number` | - | Current value. Controlled - pair with onChange. |
| `defaultValue` | `number` | - | Starting value when uncontrolled. |
| `onChange` | `(value: number) => void` | - | Fired with each committed value - valid, and within min/max. |
| `min` | `number` | - | Minimum allowed value. The decrease button turns off at it. |
| `max` | `number` | - | Maximum allowed value. The increase button turns off at it. |
| `step` | `number` | `1` | Increment applied by the steppers and arrow keys. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Height 32 / 40 (`--control-height-sm/md`), for the value box and both steppers. |
| `showLabel` | `boolean` | `true` | Render the visible label. When false, the label becomes `aria-label`. |
| `suffix` | `string` | - | Unit shown after the number inside the value box, e.g. "min" or "%". |
| `helpText` | `string` | - | Guidance shown below the field. Replaced by errorText when `error` is set. |
| `errorText` | `string` | - | Validation message, shown while `error` is true. |
| `error` | `boolean` | `false` | Marks the field invalid: red border, `aria-invalid`, errorText shown. |
| `disabled` | `boolean` | `false` | Blocks editing and dims the field and both steppers. |
| `readOnly` | `boolean` | `false` | Shows the value without allowing edits. The steppers turn off. |

Also accepts any native `<input>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<input>`. `className` and `style` go on the outermost element.

**Accessibility** - role `spinbutton`, keyboard operable. Input carries aria-invalid in the error state; Up / Down arrows increment and decrement by step; Stepper buttons are named "Decrease <label>" and "Increase <label>" and are disabled at min / max.

**Do:** Clamp values between min and max; Show the unit as an inline suffix; Use a sensible step for the quantity.
**Don't:** Do not use for codes or IDs - use Text Input; Do not hide the steppers when precise adjustment matters.

**Choosing a variant:**
- `size="Medium"`: Forms and settings. The default size.
- `size="Small"`: Dense rows, such as adding time for one candidate in Monitor.
- `readOnly`: The number matters but can't change now, such as the duration of a live test.
- `disabled`: The number is worked out from other settings, or does not apply. Say why in helpText.
- `error`: The number is outside its limits. Say which range is allowed.

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

- Three separate controls in a row, 8px apart: a decrease button, the value box, an increase button. The steppers sit outside the box, not inside its border.
- The steppers are icon-only Primary buttons (`remove` and `add`), square at the field height: 40px, or 32px for Small. Each is named "Decrease <label>" / "Increase <label>" and is disabled at min / max, or when the field is disabled or read-only.
- The value box is at least 80px wide, with the number and its unit centred together ("45 min"). Size the `<input>` to its characters (`width: calc(<n>ch + 2px)`) with tabular figures, and give the unit the same 16px `--text-primary` as the number.
- Hide the native spinner (`appearance: textfield` plus the `-webkit` pseudo-elements): it doubles up with the steppers, and in Chrome it keeps a 14px slot that clips the number.
- Resting border is `--border-control`, going `--border-control-strong` on hover and `--primary` with `--effect-state-focus` on `:focus-within`.
- Clamp to min / max and emit a real `number`, not a string. Up / Down arrows step like the buttons.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --error:                  #D32F2F;
  --success:                #2E7D32;
  --white:                  #ffffff;
  --gray-100:               #F7F7F7;
  --gray-600:               #7A7A7A;
  --gray-700:               #595959;
  --gray-800:               #404040;
  --gray-900:               #272727;
  --blue-300:               #B3D9FF;
  --red-300:                #F9B8B8;
  --orange-600:             #F2A202;
  --text-primary:           rgba(0, 0, 0, 0.87);
  --border-control:         var(--gray-600);
  --border-control-strong:  var(--gray-800);
  --text-placeholder:       var(--gray-700);
  --surface-disabled:       #F5F5F5;
  --muted-foreground:       var(--gray-700);
  --control-height-sm:      32px;
  --control-height-md:      40px;
  --control-height-lg:      44px;
  --radius-sm:              4px;
  --effect-state-focus:     0px 0px 0px 3px var(--blue-300);
  --effect-state-error:     0px 0px 0px 3px var(--red-300);
  --effect-button-shadow:   inset 0px -1px 0px rgba(0, 0, 0, 0.2), 0px 1px 0px rgba(0, 0, 0, 0.08);
  --border-width-default:   1px;
  --focus-ring-width:       2px;
  --focus-ring-offset:      2px;
  --focus-ring-color:       var(--primary);
  --duration-fast:          100ms;
  --easing-standard:        cubic-bezier(0.2, 0, 0, 1);
  --font-sans:              'Inter', system-ui, -apple-system, sans-serif;
  --medium-14-size:         14px;
  --medium-14-line-height:  1.4;
}

.inspera-btn {
  /* Fill, text and border come from the intent modifier below. */
  --btn-bg: var(--primary);
  --btn-fg: var(--white);
  --btn-border: transparent;
  --btn-shadow: var(--effect-button-shadow);
  --btn-bg-hover: color-mix(in srgb, var(--btn-bg) 90%, black);
  --btn-bg-active: color-mix(in srgb, var(--btn-bg) 82%, black);
  --btn-shadow-hover: inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 2px 6px rgba(0, 64, 128, 0.24);
  --btn-shadow-active: inset 0 1px 2px rgba(0, 0, 0, 0.24);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: var(--control-height-md);
  min-width: 80px;
  padding: 0 16px;
  border-radius: var(--radius-sm);
  border: var(--border-width-default) solid var(--btn-border);
  background: var(--btn-bg);
  color: var(--btn-fg);
  box-shadow: var(--btn-shadow);
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.25;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background var(--duration-fast) var(--easing-standard),
    border-color var(--duration-fast) var(--easing-standard),
    box-shadow var(--duration-fast) var(--easing-standard),
    transform var(--duration-fast) var(--easing-standard);
}

/* Sizes change height and padding. Small also steps down to 14px type and a
   16px icon (see the end of this block). */
.inspera-btn--small {
  height: var(--control-height-sm);
  padding: 0 12px;
  gap: 4px;
  font-size: var(--medium-14-size);
  line-height: var(--medium-14-line-height);
}
.inspera-btn--large { height: var(--control-height-lg); padding: 0 20px; }

/* Icon only: a square the height of the button. It still needs aria-label. */
.inspera-btn--icon-only { width: var(--control-height-md); min-width: 0; padding: 0; }
.inspera-btn--small.inspera-btn--icon-only { width: var(--control-height-sm); }
.inspera-btn--large.inspera-btn--icon-only { width: var(--control-height-lg); }

/* Solid intents differ only in fill; hover and pressed derive from it. */
.inspera-btn--primary     { --btn-bg: var(--primary); }
.inspera-btn--success     { --btn-bg: var(--success); }
/* Warning takes dark text on orange-600: white on --warning is 3.08:1. */
.inspera-btn--warning     { --btn-bg: var(--orange-600); --btn-fg: var(--gray-900); }
.inspera-btn--destructive { --btn-bg: var(--error); }
.inspera-btn--secondary {
  --btn-bg: var(--gray-100);
  --btn-fg: var(--gray-900);
  --btn-border: var(--gray-700);
}

/* Outline and Text carry no fill and no shadow; they tint on interaction. */
.inspera-btn--outline,
.inspera-btn--text {
  --btn-bg: transparent;
  --btn-fg: var(--primary);
  --btn-shadow: none;
  --btn-shadow-hover: none;
  --btn-shadow-active: none;
  --btn-bg-hover: color-mix(in srgb, var(--primary) 8%, transparent);
  --btn-bg-active: color-mix(in srgb, var(--primary) 12%, transparent);
}
.inspera-btn--outline { --btn-border: var(--primary); }

.inspera-btn:hover:not(:disabled) {
  background: var(--btn-bg-hover);
  box-shadow: var(--btn-shadow-hover);
}
/* A button that opens a menu keeps its hover fill while the menu is open. */
.inspera-btn[aria-expanded='true'] { background: var(--btn-bg-hover); }
.inspera-btn:active:not(:disabled) {
  background: var(--btn-bg-active);
  box-shadow: var(--btn-shadow-active);
  transform: translateY(1px);
}
.inspera-btn:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}
.inspera-btn:disabled { opacity: 0.38; cursor: not-allowed; }

.inspera-btn .material-symbols-outlined { font-size: 20px; }
.inspera-btn--small .material-symbols-outlined { font-size: 16px; }

.inspera-number {
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
  max-width: 100%;
  vertical-align: top;
  font-family: var(--font-sans);
}

.inspera-number__label {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

/* Decrease, the value, increase: three separate controls, 8px apart. The
   steppers are the canonical icon-only Primary button. */
.inspera-number__row {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* The value box: the number and its unit centred together, never under 80px. */
.inspera-number__row > * { flex-shrink: 0; }

.inspera-number__field {
  height: var(--control-height-md);
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 0 8px;
  border-radius: var(--radius-sm);
  border: var(--border-width-default) solid var(--border-control);
  background: var(--white);
  cursor: text;
}

.inspera-number--small .inspera-number__field { height: var(--control-height-sm); }

.inspera-number__field:hover { border-color: var(--border-control-strong); }
.inspera-number__field:focus-within {
  border-color: var(--primary);
  box-shadow: var(--effect-state-focus);
}

/* Only as wide as what it holds - set width to (characters)ch + 2px - so the
   number and the unit read as one: "45 min". Tabular figures make every digit
   exactly 1ch. The UA spinner is hidden: it doubles up with the steppers, and
   Chrome keeps its slot even under appearance: textfield. */
.inspera-number__control {
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-sans);
  font-size: 16px;
  color: var(--text-primary);
  text-align: center;
  font-variant-numeric: tabular-nums;
  cursor: inherit;
  appearance: textfield;
  -webkit-appearance: textfield;
}
.inspera-number__control::placeholder { color: var(--text-placeholder); opacity: 1; }
.inspera-number__control::-webkit-outer-spin-button,
.inspera-number__control::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

.inspera-number__suffix {
  font-family: var(--font-sans);
  font-size: 16px;
  color: var(--text-primary);
}

.inspera-number__help  { font-size: 12px; color: var(--muted-foreground); }
.inspera-number__error { font-size: 12px; color: var(--error); }

/* Invalid outranks hover and focus - the error has to stay legible. */
.inspera-number__field[data-invalid='true'],
.inspera-number__field[data-invalid='true']:hover,
.inspera-number__field[data-invalid='true']:focus-within {
  border-color: var(--error);
  box-shadow: var(--effect-state-error);
}
.inspera-number__field[data-disabled='true'] {
  background: var(--surface-disabled);
  opacity: 0.6;
  cursor: not-allowed;
}
.inspera-number__field[data-readonly='true'] { background: var(--gray-100); }
.inspera-number__field[data-readonly='true']:hover { border-color: var(--border-control); }
```

```html
<div class="inspera-number">
  <label class="inspera-number__label" for="duration">Duration</label>
  <div class="inspera-number__row">
    <button type="button" class="inspera-btn inspera-btn--primary inspera-btn--icon-only" aria-label="Decrease Duration">
      <span class="material-symbols-outlined" aria-hidden="true">remove</span>
    </button>
    <div class="inspera-number__field">
      <input class="inspera-number__control" id="duration" type="number" inputmode="numeric"
             min="0" max="240" step="5" value="45" style="width: calc(2ch + 2px)" />
      <span class="inspera-number__suffix">min</span>
    </div>
    <button type="button" class="inspera-btn inspera-btn--primary inspera-btn--icon-only" aria-label="Increase Duration">
      <span class="material-symbols-outlined" aria-hidden="true">add</span>
    </button>
  </div>
</div>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
