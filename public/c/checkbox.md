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
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Text beside the box. Required: it is the accessible name even when hidden. |
| `checked` | `boolean` | - | Checked state. Controlled - pair with onChange. |
| `defaultChecked` | `boolean` | `false` | Starting checked state when uncontrolled. |
| `onChange` | `(checked: boolean) => void` | - | Fired with the new checked state. |
| `indeterminate` | `boolean` | `false` | Partially-selected state, for a parent whose children are mixed. Wins over `checked` visually and announces as mixed. |
| `withLabel` | `boolean` | `true` | Render the label text. When false, the label becomes `aria-label`. |
| `disabled` | `boolean` | `false` | Blocks interaction and dims the control. |
| `error` | `boolean` | `false` | Marks the control invalid: a red border, checked or not, and `aria-invalid` on the input. |
| `description` | `ReactNode` | - | A line under the label: what the option does, or why it is unavailable. Shown with a visible label, and linked to the box with `aria-describedby`. |
| `errorText` | `string` | - | Replaces the description while `error` is set. Say what to do: "Confirm the marks to submit them." |

Also accepts any native `<input>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<input>`. `className` and `style` go on the outermost element.

**Accessibility** - role `checkbox`, keyboard operable. Use aria-checked to reflect state; Group related checkboxes with fieldset and legend; The description or errorText under the label is linked with aria-describedby.

**Do:** Use when people can choose more than one option; Always provide a label for each checkbox; Group related options together; Say why a disabled option is unavailable in its description, right under it; Say what to do in errorText, under the box: "Confirm the marks to submit them".
**Don't:** Do not use for mutually exclusive options - use Radio Group instead; Do not use without a label.

**Choosing a variant:**
- `indeterminate`: A select-all box when only some of the rows are selected.
- `withLabel="false"`: The row already names it, such as a question in a selection list. Keep the label for screen readers.
- `error`: A required tick is missing, such as confirming that marks are final. Say what to do right under it.
- `disabled`: The option does not apply right now. Say under it what makes it available.

**Deprecated aliases** (do not use): `Checkbox/Unchecked`, `Checkbox/Checked`, `Checkbox with label`, `Checkbox (fill width)`, `Checkbox (Cards)`

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

- Keep the native `<input type="checkbox">` in the DOM, visually hidden with `position: absolute; opacity: 0; width: 0; height: 0`. `display: none` removes it from the tab order and from form submission.
- Draw the focus ring on the box via `:focus-visible + .box`. A ring on a 0x0 input is invisible - this is the detail custom checkboxes miss most often.
- The box is 18px, one size, with a 2px border and `--radius-xs`. Unchecked is `--border-control`; checked fills with `--primary`.
- In error the border is `--error`, checked or not; a checked or mixed box keeps its `--primary` fill. An unchecked box takes an `--error-surface` hover tint, and the focus ring stays `--primary`.
- Indeterminate is a DOM property (`el.indeterminate = true`), not an HTML attribute; a native checkbox then announces as mixed by itself, so do not add `aria-checked`. Its glyph is `remove`, not a tick. Static markup that cannot run script uses the `inspera-checkbox--mixed` class instead.
- The whole row is the `<label>`, so the text is part of the hit target.
- A description or error goes under the label in `.inspera-checkbox__message`, linked with `aria-describedby`. It starts where the label text starts (26px in) and stays at full contrast when the box is disabled.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:            #004080;
  --error:              #D32F2F;
  --white:              #ffffff;
  --gray-600:           #7A7A7A;
  --gray-700:           #595959;
  --text-primary:       rgba(0, 0, 0, 0.87);
  --error-surface:      #FFEBEE;
  --border-control:     var(--gray-600);
  --muted-foreground:   var(--gray-700);
  --radius-xs:          2px;
  --focus-ring-width:   2px;
  --focus-ring-offset:  2px;
  --focus-ring-color:   var(--primary);
  --font-sans:          'Inter', system-ui, -apple-system, sans-serif;
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
  width: 18px;
  height: 18px;
  border-radius: var(--radius-xs);
  border: 2px solid var(--border-control);
  background: var(--white);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  flex-shrink: 0;
  transition: all 120ms ease;
}

/* The tick is a Material Symbol at the box size minus 4. */
.inspera-checkbox__box .material-symbols-outlined {
  font-size: 14px;
  font-variation-settings: 'wght' 600;
}

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

/* In error the border is red whether or not the box is checked, so a group
   in error reads as one. A checked box keeps its blue fill, and only an
   unchecked one takes the red hover tint. */
.inspera-checkbox--error .inspera-checkbox__box { border-color: var(--error); }
.inspera-checkbox--error:hover .inspera-checkbox__box { border-color: var(--error); background: var(--error-surface); }
.inspera-checkbox--error .inspera-checkbox__input:checked + .inspera-checkbox__box,
.inspera-checkbox--error .inspera-checkbox__input:indeterminate + .inspera-checkbox__box,
.inspera-checkbox--error.inspera-checkbox--mixed .inspera-checkbox__box,
.inspera-checkbox--error:hover .inspera-checkbox__input:checked + .inspera-checkbox__box,
.inspera-checkbox--error:hover .inspera-checkbox__input:indeterminate + .inspera-checkbox__box,
.inspera-checkbox--error.inspera-checkbox--mixed:hover .inspera-checkbox__box {
  border-color: var(--error);
  background: var(--primary);
}

.inspera-checkbox--disabled {
  cursor: not-allowed;
  opacity: 0.38;
}
.inspera-checkbox--disabled:hover .inspera-checkbox__box {
  border-color: var(--border-control);
  background: var(--white);
}

/* A line under the label: a description, or the error in its place. The
   field stacks the row and the line. The line starts under the label text
   (the 18px box plus its 8px gap) and sits 4px under it, pulled up into the
   row's 8px padding. It is not dimmed with a disabled box: it often says why
   the option is unavailable. */
.inspera-checkbox-field {
  display: inline-flex;
  flex-direction: column;
  font-family: var(--font-sans);
}
.inspera-checkbox__message {
  margin-top: -4px;
  padding-left: 26px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--muted-foreground);
}
.inspera-checkbox__message--error { color: var(--error); }
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
     document.getElementById('all').indeterminate = true
     A native checkbox then announces "mixed" on its own - no aria-checked. -->
<label class="inspera-checkbox inspera-checkbox--mixed" for="all">
  <input class="inspera-checkbox__input" id="all" type="checkbox" />
  <span class="inspera-checkbox__box" aria-hidden="true">
    <span class="material-symbols-outlined">remove</span>
  </span>
  <span>Select all</span>
</label>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
