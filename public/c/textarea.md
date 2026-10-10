<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Textarea

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

### Textarea

Collect multi-line text input. - category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Textarea } from '@inspera/components'

<Textarea
  label="Feedback"
  placeholder="Share your thoughts..."
  rows={3}
  helpText="Keep it constructive."
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Field label. Always required: it is the accessible name even when hidden. |
| `placeholder` | `string` | - | Hint shown when empty. Not a substitute for the label. |
| `value` | `string` | - | Current value. Controlled - pair with onChange. |
| `defaultValue` | `string` | `''` | Starting value when uncontrolled. |
| `onChange` | `(value: string) => void` | - | Fired with the new value on every keystroke. |
| `rows` | `number` | `4` | Visible text rows. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Vertical padding density. |
| `showLabel` | `boolean` | `true` | Render the visible label. When false, the label becomes `aria-label`. |
| `helpText` | `string` | - | Guidance shown below the field. Replaced by errorText when `error` is set. |
| `errorText` | `string` | - | Validation message, shown while `error` is true. |
| `error` | `boolean` | `false` | Marks the field invalid: red border, `aria-invalid`, errorText shown. |
| `disabled` | `boolean` | `false` | Blocks editing and dims the field. |
| `readOnly` | `boolean` | `false` | Shows the value without allowing edits. |
| `maxLength` | `number` | - | Maximum character length. |
| `showCount` | `boolean` | `false` | Show a character counter. |

Also accepts any native `<textarea>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<textarea>`. `className` and `style` go on the outermost element.

**Accessibility** - role `textbox`, keyboard operable. Always associate the label with the textarea using htmlFor/id; Link error text with aria-describedby; aria-invalid reflects the error state.

**Do:** Always include a visible label; Use rows to hint expected length; Show a character counter when a max length applies.
**Don't:** Do not use for single-line input - use Text Input instead; Do not turn off resizing without a reason.

**Choosing a variant:**
- `size="Medium"`: Forms and settings. The default size.
- `size="Small"`: Dense panels, such as a comment under each criterion while marking.
- `showCount`: There is a length limit people need to watch, such as a message to candidates' screens. Set maxLength with it.
- `error`: The text is required or invalid. Say what to fix in errorText, such as a marking guide that AI-supported marking needs.
- `readOnly`: The text matters but can no longer change here, such as feedback once marks are confirmed. It can still be selected and copied.
- `disabled`: The field does not apply yet. Say what makes it available, such as choosing Custom message.

**Deprecated aliases** (do not use): `Text area`, `Multiline input`, `Comment box`

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

- Same field treatment as Text Input, but the wrapper is a column so the counter sits inside the border, under the text.
- Vertical padding is 8px (6px small); horizontal stays 12px at both sizes.
- `resize: vertical` only. Free resize lets the user drag the field out of the layout.
- The counter is presentational - pair `maxlength` on the control with it, and do not rely on the counter to enforce the limit.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --error:                  #D32F2F;
  --white:                  #ffffff;
  --gray-100:               #F7F7F7;
  --gray-600:               #7A7A7A;
  --gray-700:               #595959;
  --gray-800:               #404040;
  --blue-300:               #B3D9FF;
  --red-300:                #F9B8B8;
  --text-primary:           rgba(0, 0, 0, 0.87);
  --border-control:         var(--gray-600);
  --border-control-strong:  var(--gray-800);
  --text-placeholder:       var(--gray-700);
  --surface-disabled:       #F5F5F5;
  --muted-foreground:       var(--gray-700);
  --radius-sm:              4px;
  --effect-state-focus:     0px 0px 0px 3px var(--blue-300);
  --effect-state-error:     0px 0px 0px 3px var(--red-300);
  --border-width-default:   1px;
  --duration-fast:          100ms;
  --easing-standard:        cubic-bezier(0.2, 0, 0, 1);
  --font-sans:              'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-textarea {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  font-family: var(--font-sans);
}

.inspera-textarea__label {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

/* Column, not row: the counter sits under the text, inside the border. */
.inspera-textarea__field {
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  border: var(--border-width-default) solid var(--border-control);
  background: var(--white);
  transition:
    border-color var(--duration-fast) var(--easing-standard),
    box-shadow var(--duration-fast) var(--easing-standard);
}

.inspera-textarea--small .inspera-textarea__field { padding: 6px 12px; }

.inspera-textarea__field:hover { border-color: var(--border-control-strong); }

.inspera-textarea__field:focus-within {
  border-color: var(--primary);
  box-shadow: var(--effect-state-focus);
}

.inspera-textarea__control {
  width: 100%;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  /* Vertical only. Free resize lets the user drag it out of the layout. */
  resize: vertical;
  font-family: var(--font-sans);
  font-size: 16px;
  color: var(--text-primary);
}
.inspera-textarea__control::placeholder { color: var(--text-placeholder); opacity: 1; }

.inspera-textarea__count {
  align-self: flex-end;
  margin-top: 4px;
  font-size: 12px;
  color: var(--muted-foreground);
}

.inspera-textarea__help  { font-size: 12px; color: var(--muted-foreground); }
.inspera-textarea__error { font-size: 12px; color: var(--error); }

.inspera-textarea__field[data-invalid='true'],
.inspera-textarea__field[data-invalid='true']:hover,
.inspera-textarea__field[data-invalid='true']:focus-within {
  border-color: var(--error);
  box-shadow: var(--effect-state-error);
}

.inspera-textarea__field[data-disabled='true'] {
  background: var(--surface-disabled);
  opacity: 0.6;
}

.inspera-textarea__field[data-readonly='true'] { background: var(--gray-100); }
.inspera-textarea__field[data-readonly='true']:hover { border-color: var(--border-control); }
```

```html
<div class="inspera-textarea">
  <label class="inspera-textarea__label" for="feedback">Feedback</label>
  <div class="inspera-textarea__field">
    <textarea class="inspera-textarea__control" id="feedback" rows="4"
              maxlength="280" placeholder="Share your thoughts..."
              aria-describedby="feedback-help"></textarea>
    <span class="inspera-textarea__count">0/280</span>
  </div>
  <span class="inspera-textarea__help" id="feedback-help">Keep it constructive.</span>
</div>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
