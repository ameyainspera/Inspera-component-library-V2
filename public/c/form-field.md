<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Form Field

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

### Form Field

Standardize label, control, and help/error layout around any input. - category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { FormField } from '@inspera/components'

<FormField
  label="Email address"
  htmlFor="email"
  required={false}
  helpText="We'll never share your email."
>
  <TextInput id="email" showLabel={false} />
</FormField>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | - | Field label text. |
| `htmlFor` | `string` | - | id of the wrapped control for label association. |
| `required` | `boolean` | `false` | Show a required asterisk. |
| `helpText` | `string` | - | Helper text shown below the control. |
| `errorText` | `string` | - | Error message; replaces help text when present. |
| `children` **(required)** | `ReactNode` | - | The control this field wraps. Exactly one. |

**Accessibility** - role `group`, keyboard operable. Associate the label with the control via htmlFor/id; Link error and help text with aria-describedby on the control; Required fields should set aria-required on the control.

**Do:** Wrap any single control for consistent spacing; Use htmlFor to link the label to the control; Show only one of help or error at a time.
**Don't:** Do not wrap multiple unrelated controls; Do not omit the label for accessibility.

**Deprecated aliases** (do not use): `Field wrapper`, `Input group`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- The wrapper owns three links the control cannot make for itself: `for` -> the control id, `aria-describedby` -> the message id, and `aria-invalid` when the message is an error.
- Only one message shows at a time. When there is an error it replaces the help text; it does not stack under it.
- The red asterisk is `aria-hidden` decoration. Requiredness is announced from the control's own `required` attribute - the asterisk alone tells a screen reader nothing.
- Gap between label, control and message is 6px; message text is 12px.
- The nested control keeps its own label markup off (there is already one here) but still needs an accessible name via the outer `for`.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --error:                  #D32F2F;
  --white:                  #ffffff;
  --gray-100:               #F7F7F7;
  --gray-600:               #7A7A7A;
  --blue-300:               #B3D9FF;
  --red-300:                #F9B8B8;
  --action-active:          rgba(0, 0, 0, 0.56);
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

.inspera-input {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  font-family: var(--font-sans);
}

.inspera-input__label {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

/* The bordered box is the wrapper, not the <input>. That is what lets a
   leading or trailing icon sit inside the border. */
.inspera-input__field {
  height: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border-radius: var(--radius-md);
  border: var(--border-width-default) solid var(--border-control);
  background: var(--white);
  transition:
    border-color var(--duration-fast) var(--easing-standard),
    box-shadow var(--duration-fast) var(--easing-standard);
}

.inspera-input--small .inspera-input__field { height: 32px; }

.inspera-input__field:hover { border-color: var(--border-control-strong); }

/* :focus-within, not :focus - the focusable element is the <input> inside. */
.inspera-input__field:focus-within {
  border-color: var(--primary);
  box-shadow: var(--effect-state-focus);
}

/* The control itself is unstyled: no border, no outline, no background. All of
   that belongs to the wrapper, or you get a box inside a box. */
.inspera-input__control {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-sans);
  font-size: 16px;
  color: var(--text-primary);
}

.inspera-input__field .material-symbols-outlined {
  font-size: 20px;
  color: var(--action-active);
}

.inspera-input__help {
  font-size: 12px;
  color: var(--muted-foreground);
}

.inspera-input__error {
  font-size: 12px;
  color: var(--error);
}

/* Invalid outranks hover and focus - the error has to stay legible. */
.inspera-input__field[data-invalid='true'],
.inspera-input__field[data-invalid='true']:hover,
.inspera-input__field[data-invalid='true']:focus-within {
  border-color: var(--error);
  box-shadow: var(--effect-state-error);
}

.inspera-input__field[data-disabled='true'] {
  background: var(--surface-disabled);
  opacity: 0.6;
}

.inspera-input__field[data-readonly='true'] {
  background: var(--gray-100);
}
.inspera-input__field[data-readonly='true']:hover { border-color: var(--border-control); }

.inspera-field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  font-family: var(--font-sans);
}

.inspera-field-group__label {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

/* The asterisk is decorative: requiredness is carried by the control's own
   "required" attribute, which is what a screen reader announces. */
.inspera-field-group__required {
  color: var(--error);
  margin-left: 2px;
}

.inspera-field-group__help  { font-size: 12px; color: var(--muted-foreground); }
.inspera-field-group__error { font-size: 12px; color: var(--error); }
```

```html
<div class="inspera-field-group">
  <label class="inspera-field-group__label" for="email">
    Email address<span class="inspera-field-group__required" aria-hidden="true">*</span>
  </label>
  <div class="inspera-input">
    <div class="inspera-input__field">
      <input class="inspera-input__control" id="email" type="email" required
             aria-describedby="email-msg" />
    </div>
  </div>
  <span class="inspera-field-group__help" id="email-msg">We'll never share your email.</span>
</div>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
