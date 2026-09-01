<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Checkbox

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

### Checkbox

Allow multiple selection. - category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Checkbox } from '@inspera/components'

<Checkbox
  label="Send me product updates"
  checked={checked}
  onChange={setChecked}
  size="Medium"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Checkbox label'` | Text beside the box. Always provide one. |
| `checked` | `boolean` | - | Checked state. |
| `indeterminate` | `boolean` | `false` | Partially-selected state, for a parent whose children are mixed. Wins over `checked` visually and announces as `aria-checked="mixed"`. |
| `state` | `'Default' \| 'Hover' \| 'Focused' \| 'Pressed' \| 'Disabled' \| 'Error'` | `'Default'` | Freezes a visual state so documentation can show it without a pointer. `Hover`, `Focused` and `Pressed` are presentation-only - leave them unset in application code, where CSS drives them from the real pointer and keyboard. `Error` and `Disabled` are real application state and belong in your code. |
| `withLabel` | `boolean` | `true` | Render the label. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Indicator size. |
| `onChange` | `(checked: boolean) => void` | - | Fired with the new checked state. |

**Accessibility** - role `checkbox`, keyboard operable. Use aria-checked to reflect state; Group related checkboxes with fieldset and legend.

**Do:** Use for multi-select scenarios; Always provide a label for each checkbox; Group related options together.
**Don't:** Do not use for mutually exclusive options - use Radio Button instead; Do not use without a label.

**Deprecated aliases** (do not use): `Checkbox/Unchecked`, `Checkbox/Checked`, `Checkbox with label`, `Checkbox (fill width)`, `Checkbox (Cards)`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- Keep the native `<input type="checkbox">` in the DOM, visually hidden with `position: absolute; opacity: 0; width: 0; height: 0`. `display: none` removes it from the tab order and from form submission.
- Draw the focus ring on the box via `:focus-visible + .box`. A ring on a 0x0 input is invisible - this is the detail custom checkboxes miss most often.
- The box is 20px (16px small) with a 2px border and `--radius-xs`. Unchecked is `--border-control-strong`; checked fills with `--primary`.
- Indeterminate is a DOM property (`el.indeterminate = true`), not an HTML attribute, and it announces as `aria-checked="mixed"`. Its glyph is `remove`, not a tick. Static markup that cannot run script uses the `inspera-checkbox--mixed` class instead.
- The whole row is the `<label>`, so the text is part of the hit target.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --error:                  #D32F2F;
  --white:                  #ffffff;
  --text-primary:           rgba(0, 0, 0, 0.87);
  --border-control-strong:  #8C8C8C;
  --radius-xs:              2px;
  --focus-ring-width:       2px;
  --focus-ring-offset:      2px;
  --focus-ring-color:       var(--primary);
  --font-sans:              'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  cursor: pointer;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
}

/* Hidden, but still in the DOM, still focusable, still submitted with the
   form. "display: none" or "visibility: hidden" would break all three. */
.inspera-checkbox__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.inspera-checkbox__box {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-xs);
  border: 2px solid var(--border-control-strong);
  background: var(--white);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  flex-shrink: 0;
  transition: all 120ms ease;
}

.inspera-checkbox--small .inspera-checkbox__box { width: 16px; height: 16px; }

/* The tick is a Material Symbol at the box size minus 4. */
.inspera-checkbox__box .material-symbols-outlined {
  font-size: 16px;
  font-variation-settings: 'wght' 600;
}
.inspera-checkbox--small .inspera-checkbox__box .material-symbols-outlined { font-size: 12px; }

.inspera-checkbox__input:checked + .inspera-checkbox__box,
.inspera-checkbox__input:indeterminate + .inspera-checkbox__box,
/* "indeterminate" is a DOM property with no HTML attribute, so static markup
   cannot trigger :indeterminate. The modifier lets server-rendered markup show
   the state; script that sets el.indeterminate gets the pseudo-class. */
.inspera-checkbox--mixed .inspera-checkbox__box {
  border-color: var(--primary);
  background: var(--primary);
}

.inspera-checkbox:hover .inspera-checkbox__box { border-color: var(--primary); background: rgba(0, 64, 128, 0.04); }
.inspera-checkbox:hover .inspera-checkbox__input:checked + .inspera-checkbox__box,
.inspera-checkbox:hover .inspera-checkbox__input:indeterminate + .inspera-checkbox__box,
.inspera-checkbox--mixed:hover .inspera-checkbox__box {
  border-color: var(--primary);
  background: var(--primary);
}

/* The ring goes on the drawn box: the real input is 0x0, so a ring on it is
   invisible. This is the single most-missed detail in a custom checkbox. */
.inspera-checkbox__input:focus-visible + .inspera-checkbox__box {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.inspera-checkbox:active .inspera-checkbox__box { transform: scale(0.92); }

.inspera-checkbox--error .inspera-checkbox__box { border-color: var(--error); }
.inspera-checkbox--error:hover .inspera-checkbox__box { border-color: var(--error); }

.inspera-checkbox--disabled {
  cursor: not-allowed;
  opacity: 0.38;
}
.inspera-checkbox--disabled:hover .inspera-checkbox__box {
  border-color: var(--border-control-strong);
  background: var(--white);
}
```

```html
<label class="inspera-checkbox" for="updates">
  <input class="inspera-checkbox__input" id="updates" type="checkbox" />
  <span class="inspera-checkbox__box" aria-hidden="true">
    <span class="material-symbols-outlined">check</span>
  </span>
  <span>Send me product updates</span>
</label>

<!-- Indeterminate is a DOM property, not an attribute. Set it in script:
     document.getElementById('all').indeterminate = true -->
<label class="inspera-checkbox" for="all">
  <input class="inspera-checkbox__input" id="all" type="checkbox" aria-checked="mixed" />
  <span class="inspera-checkbox__box" aria-hidden="true">
    <span class="material-symbols-outlined">remove</span>
  </span>
  <span>Select all</span>
</label>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
