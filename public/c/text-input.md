<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Text Input

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

### Text Input

Collect single-line text input. - category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { TextInput } from '@inspera/components'

<TextInput
  label="Email address"
  placeholder="jane@inspera.com"
  helpText="We'll never share your email."
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Field label. Always required: it is the accessible name even when hidden. |
| `placeholder` | `string` | - | Hint shown when empty. Not a substitute for the label. |
| `value` | `string` | - | Current value. Controlled - pair with onChange. |
| `defaultValue` | `string` | `''` | Starting value when uncontrolled. |
| `onChange` | `(value: string) => void` | - | Fired with the new value on every keystroke. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Control height. |
| `leadingIcon` | `string` | - | Material Symbols name shown before the text. |
| `trailingIcon` | `string` | - | Material Symbols name shown after the text. Decorative only. |
| `showLabel` | `boolean` | `true` | Render the visible label. When false, the label becomes `aria-label`. |
| `helpText` | `string` | - | Guidance shown below the field. Replaced by errorText when `error` is set. |
| `errorText` | `string` | - | Validation message, shown while `error` is true. |
| `error` | `boolean` | `false` | Marks the field invalid: red border, `aria-invalid`, errorText shown. |
| `disabled` | `boolean` | `false` | Blocks editing and dims the field. |
| `readOnly` | `boolean` | `false` | Shows the value without allowing edits. |

Also accepts any native `<input>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<input>`. `className` and `style` go on the outermost element.

**Accessibility** - role `textbox`, keyboard operable. Always associate the label with the input using htmlFor/id; Link error text with aria-describedby; Required fields must use aria-required.

**Do:** Always include a visible label; Use placeholder text only as an example of the expected input; Show error messages below the input.
**Don't:** Do not use the placeholder as the label; Do not disable an input without saying why.

**Choosing a variant:**
- `size="Medium"`: Forms and settings. The default size.
- `size="Small"`: Dense areas such as table toolbars, filter bars and side panels.
- `error`: The value is invalid. Say what to fix in errorText, under the field.
- `readOnly`: The value matters but cannot be changed here, such as the code of a published test. It can still be selected and copied.
- `disabled`: The field does not apply right now. Say nearby what makes it available.

**Deprecated aliases** (do not use): `Text inputs`, `Content`, `Content (small)`

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

- The border belongs to the wrapper, not the `<input>`. The input itself has no border, no outline and no background - otherwise icons cannot sit inside the field.
- Focus is `:focus-within` on the wrapper, drawn as `--effect-state-focus` (a 3px box-shadow) plus a `--primary` border. Fields ring with a shadow; buttons ring with an outline.
- Height is 40px (32px small), radius `--radius-sm`, resting border `--border-control` (gray-600) going to `--border-control-strong` on hover.
- Help and error text are 12px. Help text is optional. Only one shows at a time, and `aria-describedby` points at whichever it is - leave it off when neither shows.
- A visible `<label>` with `for` is required. A placeholder is not a label.

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
  --action-active:          rgba(0, 0, 0, 0.56);
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

.inspera-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
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
  border-radius: var(--radius-sm);
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
/* Set, not left to the browser: its default can fall under 4.5:1. */
.inspera-input__control::placeholder { color: var(--text-placeholder); opacity: 1; }

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
```

```html
<div class="inspera-input">
  <label class="inspera-input__label" for="email">Email address</label>
  <div class="inspera-input__field">
    <input class="inspera-input__control" id="email" type="email"
           placeholder="jane@inspera.com" aria-describedby="email-help" />
  </div>
  <span class="inspera-input__help" id="email-help">We'll never share your email.</span>
</div>

<!-- Invalid. aria-invalid and aria-describedby both point at the message. -->
<div class="inspera-input">
  <label class="inspera-input__label" for="email2">Email address</label>
  <div class="inspera-input__field" data-invalid="true">
    <span class="material-symbols-outlined" aria-hidden="true">mail</span>
    <input class="inspera-input__control" id="email2" type="email"
           aria-invalid="true" aria-describedby="email2-err" />
  </div>
  <span class="inspera-input__error" id="email2-err">Enter a valid email address.</span>
</div>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
