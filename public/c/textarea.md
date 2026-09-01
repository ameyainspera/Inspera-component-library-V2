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
  size="Medium"
  showCount={false}
  maxLength={280}
  helpText="Keep it constructive."
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Description'` | Field label. |
| `placeholder` | `string` | `'Placeholder text'` | Hint shown when empty. Not a substitute for the label. |
| `value` | `string` | - | Current value. Controlled - pair with onChange. |
| `rows` | `number` | `4` | Visible text rows. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Vertical padding density. |
| `state` | `'Default' \| 'Hover' \| 'Focused' \| 'Filled' \| 'Error' \| 'Disabled' \| 'ReadOnly'` | `'Default'` | Freezes a visual state so documentation can show it without a pointer. `Hover`, `Focused` and `Filled` are presentation-only - leave them unset in application code, where CSS drives them from the real pointer and keyboard. `Error`, `Disabled` and `ReadOnly` are real application state and belong in your code. |
| `showLabel` | `boolean` | `true` | Show the field label. |
| `helpText` | `string` | - | Guidance shown below the field. Replaced by errorText when invalid. |
| `errorText` | `string` | - | Validation message. Linked to the control via aria-describedby. |
| `maxLength` | `number` | - | Maximum character length. |
| `showCount` | `boolean` | `false` | Show character counter. |
| `onChange` | `(value: string) => void` | - | Fired with the new value on every keystroke. |

**Accessibility** - role `textbox`, keyboard operable. Always associate label with textarea using htmlFor/id; Error text must be linked via aria-describedby; aria-invalid reflects the error state.

**Do:** Always include a visible label; Use rows to hint expected length; Show a character counter when a max length applies.
**Don't:** Do not use for single-line input - use Text Input instead; Do not disable resize without reason.

**Deprecated aliases** (do not use): `Text area`, `Multiline input`, `Comment box`

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
  --gray-600:               #7A7A7A;
  --blue-300:               #B3D9FF;
  --red-300:                #F9B8B8;
  --text-primary:           rgba(0, 0, 0, 0.87);
  --border-control:         #C4C4C4;
  --border-control-strong:  #8C8C8C;
  --surface-disabled:       #F5F5F5;
  --muted-foreground:       var(--gray-600);
  --radius-md:              8px;
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
  gap: 6px;
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
  border-radius: var(--radius-md);
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
