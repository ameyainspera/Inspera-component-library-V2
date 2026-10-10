<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera Design System - Input controls - basic

> Version 1.0.0. Part 2 of 7 of the AI spec: Button, Text Input, Checkbox, Radio Button, Select, Toggle, Textarea, Form Field, Radio Group, Checkbox Group.
>
> These specs build on `inspera-01-core.md` - its rules, its setup
> (fonts, icon class, tokens) and its foundations. If that file is not in your
> context, ask for it before building. Without it, fonts, icons and colours
> come out wrong.

## Components - input-controls

### Button

Trigger an action. - category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Button } from '@inspera/components'

<Button
  label="Button"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | The button text. Start with a verb - "Save", not "OK". With `iconOnly` it is not shown but becomes the accessible name, so it is still required. |
| `intent` | `'Primary' \| 'Secondary' \| 'Outline' \| 'Text' \| 'Success' \| 'Warning' \| 'Destructive'` | `'Primary'` | Visual role / semantic weight. |
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Medium'` | Height 32 / 40 / 44 (`--control-height-sm/md/lg`). Small also steps down to 14px text and a 16px icon. |
| `leadingIcon` | `string` | - | Material Symbols name shown before the label. |
| `trailingIcon` | `string` | - | Material Symbols name shown after the label. Use `expand_more` for a menu trigger. |
| `iconOnly` | `boolean` | `false` | Show only the icon (`leadingIcon`, else `trailingIcon`); `label` becomes the accessible name. |
| `disabled` | `boolean` | `false` | Blocks interaction and dims the button. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native button type. Defaults to `button`, so a Button never submits a form by accident. |
| `onClick` | `MouseEventHandler<HTMLButtonElement>` | - | Fired on click and on Enter or Space. |

Also accepts any native `<button>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<button>`. `className` and `style` go on the outermost element.

**Accessibility** - role `button`, keyboard operable. Icon-only buttons must have an accessible label.

**Do:** Use Primary for the main action; Use Secondary for an alternative to the main action; Use Destructive only for actions that delete data or cannot be undone.
**Don't:** Do not create a separate component for each intent - set the intent prop; Do not use deprecated alias names.

**Choosing a variant:**
- `intent="Primary"`: The one main action of a page, form or dialog, such as New test or Publish. Use one per view.
- `intent="Secondary"`: An alternative to the main action, placed next to it, such as Save draft beside Next or Publish.
- `intent="Outline"`: A standalone action on the content around it, such as Export in a table toolbar.
- `intent="Text"`: A low-emphasis action: Cancel in a form footer, View all in a card header.
- `intent="Success"`: A positive decision, such as approving a candidate's request for more time. Keep the way to decline beside it.
- `intent="Warning"`: An action with consequences that can be undone, such as pausing a candidate's test.
- `intent="Destructive"`: An action that deletes data or cannot be undone, such as deleting a test. Say what will be lost next to it.
- `size="Small"`: Dense areas such as table rows, toolbars and filter bars, next to Small inputs.
- `size="Large"`: One prominent call to action, such as Start test, or a touch-first screen. Not a whole row of buttons.

**Deprecated aliases** (do not use): `Primary button`, `Secondary button`, `Outline button`, `Text button`, `Success button`, `Warning button`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- Corner radius is 4px (`--radius-sm`). Not 6, not 8, not `rounded-lg`.
- Type is 16px/600 at every size - Small and Large change height, padding and gap only.
- Primary is `--primary` #004080, a deep navy. It is not a mid blue and never a gradient.
- Every solid intent carries the inset top-light button shadow; Outline and Text carry none.
- Hover darkens the fill to 90% and pressed to 82%, both mixed toward black - no separate hover token.
- Minimum width is 80px, so short labels still read as buttons.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --error:                  #D32F2F;
  --success:                #2E7D32;
  --white:                  #ffffff;
  --gray-100:               #F7F7F7;
  --gray-700:               #595959;
  --gray-900:               #272727;
  --orange-600:             #F2A202;
  --control-height-sm:      32px;
  --control-height-md:      40px;
  --control-height-lg:      44px;
  --radius-sm:              4px;
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
```

```html
<button type="button" class="inspera-btn inspera-btn--primary">Save</button>

<button type="button" class="inspera-btn inspera-btn--secondary inspera-btn--small">Cancel</button>

<button type="button" class="inspera-btn inspera-btn--destructive">Delete test</button>

<!-- Icon + Text. The icon is Material Symbols Outlined, never another set. -->
<button type="button" class="inspera-btn inspera-btn--primary">
  <span class="material-symbols-outlined" aria-hidden="true">add</span>
  <span>Add question</span>
</button>

<!-- Icon-only still needs an accessible name. -->
<button type="button" class="inspera-btn inspera-btn--text" aria-label="More options">
  <span class="material-symbols-outlined" aria-hidden="true">more_vert</span>
</button>
```


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


### Radio Button

Allow single selection. - category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { RadioButton } from '@inspera/components'

<RadioButton
  label="Standard delivery"
  name="delivery"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Text beside the control. Required: it is the accessible name even when hidden. |
| `selected` | `boolean` | - | Selected state. Controlled - pair with onChange. |
| `defaultSelected` | `boolean` | `false` | Starting selected state when uncontrolled. |
| `onChange` | `(selected: boolean) => void` | - | Fired when this option becomes selected. |
| `name` | `string` | - | Shared form name. Every radio in a group must use the same value. Left unset, each radio gets its own generated name and stands alone. |
| `withLabel` | `boolean` | `true` | Render the label text. When false, the label becomes `aria-label`. |
| `disabled` | `boolean` | `false` | Blocks interaction and dims the control. |
| `error` | `boolean` | `false` | Marks the control invalid: a red ring, selected or not, and `aria-invalid` on the input. |
| `description` | `ReactNode` | - | A line under the label: what the option means, or why it is unavailable. Shown with a visible label, and linked to the radio with `aria-describedby`. An error belongs to the group (Radio Group's `errorText`), not to one option. |

Also accepts any native `<input>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<input>`. `className` and `style` go on the outermost element.

**Accessibility** - role `radio`, keyboard operable. Use role="radiogroup" for the group container; Use aria-checked to indicate selected state; Arrow keys navigate between options in the group; The description under the label is linked with aria-describedby.

**Do:** Use for mutually exclusive options; Always group inside a radiogroup; Pre-select a sensible default; Give an option a description when it needs a line of its own, such as why it is unavailable.
**Don't:** Do not use when people can choose more than one option - use Checkbox instead; Do not use a single radio button on its own.

**Choosing a variant:**
- `withLabel`: Each option needs a description or content of its own under it, so the options are laid out one by one. Otherwise use Radio Group.
- `withLabel="false"`: The row next to it names the option, such as a template in a list. Keep the label for screen readers.
- `error`: No option is chosen and one is required. Mark every option in the set and say what to choose.
- `disabled`: One option can't be chosen here. Say why under it.

**Deprecated aliases** (do not use): `Radiobutton`, `Radiobuttons`, `Radio Button New-BonW`, `Radio Button New-BonY`, `Radio Button New-WonB`, `Radio Button New-YonB`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- Identical structure to Checkbox: a visually hidden native `<input type="radio">` plus a drawn circle, with the ring on the circle.
- The circle is 20px with a 2px border and `--radius-pill`; the selected dot is a 10px child element, not a background, so it stays centred while the circle scales on press.
- In error the ring is `--error`, selected or not; the dot stays `--primary`. The hover tint is `--error-surface`, and the focus ring stays `--primary`.
- Grouping is the `name` attribute. Every radio in one question shares it, and unrelated questions must not - two groups sharing a name become one.
- For a set of options prefer the Radio Group component, which owns the name and the group label for you.
- An option that needs a line of its own (what it means, or why it is unavailable) takes a description under its label in `.inspera-radio__message`, linked with `aria-describedby`, 28px in. The error belongs to the group, not to one option.

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
  --radius-pill:        9999px;
  --focus-ring-width:   2px;
  --focus-ring-offset:  2px;
  --focus-ring-color:   var(--primary);
  --font-sans:          'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-radio {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  cursor: pointer;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
}

.inspera-radio__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.inspera-radio__circle {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-pill);
  border: 2px solid var(--border-control);
  background: var(--white);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 120ms ease;
}

/* The dot is a child element, not a background - it has to stay centred as the
   circle scales on press. */
.inspera-radio__dot {
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  background: var(--primary);
}

.inspera-radio__input:checked + .inspera-radio__circle { border-color: var(--primary); }

.inspera-radio:hover .inspera-radio__circle { border-color: var(--primary); background: rgba(0, 64, 128, 0.04); }

.inspera-radio__input:focus-visible + .inspera-radio__circle {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.inspera-radio:active .inspera-radio__circle { transform: scale(0.92); }

/* In error the ring is red whether or not the radio is selected, so a group
   in error reads as one. The dot stays blue. */
.inspera-radio--error .inspera-radio__circle,
.inspera-radio--error .inspera-radio__input:checked + .inspera-radio__circle { border-color: var(--error); }
.inspera-radio--error:hover .inspera-radio__circle { border-color: var(--error); background: var(--error-surface); }

.inspera-radio--disabled { cursor: not-allowed; opacity: 0.38; }

/* A description under the label, linked with aria-describedby. It starts
   where the label text starts (the 20px circle plus its 8px gap) and sits 4px
   under it, pulled up into the row's 8px padding. Not dimmed when disabled:
   it often says why the option is unavailable. */
.inspera-radio-field {
  display: inline-flex;
  flex-direction: column;
  font-family: var(--font-sans);
}
.inspera-radio__message {
  margin-top: -4px;
  padding-left: 28px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--muted-foreground);
}
```

```html
<!-- Every radio in one group shares a name. Radios with no name, or with
     a shared generic name across unrelated questions, will fight each other. -->
<label class="inspera-radio" for="standard">
  <input class="inspera-radio__input" id="standard" type="radio" name="delivery" />
  <span class="inspera-radio__circle" aria-hidden="true">
    <span class="inspera-radio__dot"></span>
  </span>
  <span>Standard delivery</span>
</label>

<label class="inspera-radio" for="express">
  <input class="inspera-radio__input" id="express" type="radio" name="delivery" />
  <span class="inspera-radio__circle" aria-hidden="true"></span>
  <span>Express delivery</span>
</label>
```


### Select

Select one option from a list. - category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Select } from '@inspera/components'

<Select
  label="Country"
  options={['Norway', 'Sweden', 'Denmark', 'Finland', 'Iceland']}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Field label. Always required: it is the accessible name even when hidden. |
| `options` **(required)** | `(string \| SelectOption)[]` | - | The choices, in display order. Plain strings when value and label match. |
| `placeholder` | `string` | `'Select an option'` | Shown when nothing is selected. Not a substitute for the label. |
| `value` | `string` | - | Selected value. Controlled - pair with onChange. |
| `defaultValue` | `string` | - | Starting value when uncontrolled. |
| `onChange` | `(value: string) => void` | - | Fired with the selected value. |
| `widthMode` | `'Fixed' \| 'Hug'` | `'Fixed'` | `Fixed` is 220px wide; `Hug` fits the selected text. |
| `showLabel` | `boolean` | `true` | Render the visible label. When false, the label becomes `aria-label`. |
| `search` | `boolean` | `false` | Adds a filter box at the top of the list. |
| `helpText` | `string` | - | Guidance shown below the field. Replaced by errorText when `error` is set. |
| `errorText` | `string` | - | Validation message, shown while `error` is true. |
| `error` | `boolean` | `false` | Marks the field invalid: red border, `aria-invalid`, errorText shown. |
| `disabled` | `boolean` | `false` | Blocks interaction and dims the field. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

```ts
export interface SelectOption {
  value: string
  /** Shown text. Defaults to `value`. */
  label?: string
}
```

**Accessibility** - role `combobox`, keyboard operable. Use aria-expanded to indicate open state; Use aria-activedescendant for highlighted option; Support arrow key navigation through options.

**Do:** Use for 5+ options where space is limited; Always provide a label; Show a clear placeholder when no option is selected.
**Don't:** Do not use for fewer than 3 options - use Radio Group instead; Do not nest selects inside other selects.

**Choosing a variant:**
- `widthMode="Fixed"`: Forms. The trigger keeps one width (220px) whatever is chosen, so the form does not shift as values change.
- `widthMode="Hug"`: Toolbars and filter bars, where the trigger is only as wide as its value.
- `search`: Long lists, roughly 10 options or more, so people can type to narrow them.
- `error`: A required choice is missing. Say what to choose in errorText.

**Deprecated aliases** (do not use): `Select / Fixed width`, `Select / Content adaptable`, `Dropdown`, `Dropdown with Label`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- The trigger is a `role="combobox"` element with `tabindex="0"`, `aria-expanded`, `aria-haspopup="listbox"` and `aria-controls` pointing at the list. None of that comes free - this is not a native `<select>`.
- The list is `role="listbox"` with `role="option"` children carrying `aria-selected`; it is positioned against the trigger, not appended to the body.
- Keep the keyboard cursor and the selected value as two different states. The highlighted option (`--active`, `--blue-100`) is where the arrows are; `aria-selected` is what has been chosen.
- The chevron rotates 180deg while open, driven off `aria-expanded` so the attribute and the visual cannot disagree.
- Keyboard: Down opens and moves, Up moves back, Enter commits, Escape closes.
- Fixed width is 220px; Content Adaptable drops to `auto` with a 120px floor.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --error:                  #D32F2F;
  --white:                  #ffffff;
  --gray-300:               #D9D9D9;
  --gray-600:               #7A7A7A;
  --gray-700:               #595959;
  --gray-800:               #404040;
  --blue-100:               #F0F7FF;
  --blue-300:               #B3D9FF;
  --red-300:                #F9B8B8;
  --text-primary:           rgba(0, 0, 0, 0.87);
  --border-control:         var(--gray-600);
  --border-control-strong:  var(--gray-800);
  --text-placeholder:       var(--gray-700);
  --surface-disabled:       #F5F5F5;
  --border-strong:          var(--gray-300);
  --muted-foreground:       var(--gray-700);
  --radius-sm:              4px;
  --radius-md:              8px;
  --shadow-200:             0px 8px 8px rgba(39, 39, 39, 0.08), 0px 4px 6px rgba(39, 39, 39, 0.12);
  --effect-state-focus:     0px 0px 0px 3px var(--blue-300);
  --effect-state-error:     0px 0px 0px 3px var(--red-300);
  --border-width-default:   1px;
  --duration-fast:          100ms;
  --easing-standard:        cubic-bezier(0.2, 0, 0, 1);
  --z-dropdown:             300;
  --font-sans:              'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-select {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 220px;
  font-family: var(--font-sans);
}

/* Content-adaptable: the trigger grows with the longest value instead of
   holding a fixed 220px. */
.inspera-select--auto { width: auto; }

.inspera-select__label {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.inspera-select__anchor { position: relative; }

.inspera-select__trigger {
  height: 40px;
  width: 220px;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 12px;
  border-radius: var(--radius-sm);
  border: var(--border-width-default) solid var(--border-control);
  background: var(--white);
  /* Placeholder colour until a value is set, then --text-primary. */
  color: var(--text-placeholder);
  font-family: var(--font-sans);
  font-size: 16px;
  cursor: pointer;
  transition:
    border-color var(--duration-fast) var(--easing-standard),
    box-shadow var(--duration-fast) var(--easing-standard);
}

.inspera-select--auto .inspera-select__trigger { width: auto; }

.inspera-select__trigger--filled { color: var(--text-primary); }

.inspera-select__trigger:hover { border-color: var(--border-control-strong); }

.inspera-select__trigger:focus-visible,
.inspera-select__trigger[aria-expanded='true'] {
  border-color: var(--primary);
  box-shadow: var(--effect-state-focus);
  outline: none;
}

.inspera-select__trigger .material-symbols-outlined {
  font-size: 20px;
  transition: transform 140ms ease;
}
.inspera-select__trigger[aria-expanded='true'] .material-symbols-outlined { transform: rotate(180deg); }

/* Invalid outranks hover and focus - the error has to stay legible. */
.inspera-select__trigger[aria-invalid='true'],
.inspera-select__trigger[aria-invalid='true']:hover {
  border-color: var(--error);
  box-shadow: var(--effect-state-error);
}
/* A div cannot be :disabled, so the state is read from aria-disabled. */
.inspera-select__trigger[aria-disabled='true'] {
  background: var(--surface-disabled);
  opacity: 0.6;
  cursor: not-allowed;
}
.inspera-select__trigger[aria-disabled='true']:hover { border-color: var(--border-control); }

.inspera-select__error { font-size: 12px; color: var(--error); }

/* The list is anchored to the trigger, not appended to the body. */
.inspera-select__list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  margin: 0;
  padding: 4px;
  list-style: none;
  background: var(--white);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-200);
  z-index: var(--z-dropdown, 20);
  max-height: 240px;
  overflow-y: auto;
}

.inspera-select__option {
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: 16px;
  cursor: pointer;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Two different things: --active is the keyboard cursor, [aria-selected] is
   the committed value. Collapsing them loses the arrow-key position. */
.inspera-select__option--active { background: var(--blue-100); }
.inspera-select__option[aria-selected='true'] { color: var(--primary); font-weight: 500; }

.inspera-select__empty {
  padding: 8px 12px;
  color: var(--muted-foreground);
  font-size: 14px;
}
```

```html
<div class="inspera-select">
  <!-- A <label for> cannot name a div, so the trigger points at the label's id. -->
  <span class="inspera-select__label" id="country-label">Country</span>
  <div class="inspera-select__anchor">
    <div class="inspera-select__trigger" id="country" role="combobox" tabindex="0"
         aria-labelledby="country-label" aria-expanded="false" aria-haspopup="listbox">
      <span>Select an option</span>
      <span class="material-symbols-outlined" aria-hidden="true">expand_more</span>
    </div>
    <!-- Rendered only while open. -->
    <ul class="inspera-select__list" id="country-list" role="listbox">
      <li class="inspera-select__option inspera-select__option--active" role="option" aria-selected="false">Norway</li>
      <li class="inspera-select__option" role="option" aria-selected="false">Sweden</li>
    </ul>
  </div>
</div>
```


### Toggle

Switch a setting on or off instantly. - category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Toggle } from '@inspera/components'

<Toggle
  label="Enable notifications"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Text describing the setting. Required: it is the accessible name even when hidden. |
| `checked` | `boolean` | - | On / off state. Controlled - pair with onChange. |
| `defaultChecked` | `boolean` | `false` | Starting state when uncontrolled. |
| `onChange` | `(checked: boolean) => void` | - | Fired with the new on/off state. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Track / thumb size. |
| `withLabel` | `boolean` | `true` | Render the label text. When false, the label becomes `aria-label`. |
| `disabled` | `boolean` | `false` | Blocks interaction and dims the control. |
| `description` | `ReactNode` | - | A line under the label: what the setting does, or why it is locked. Shown with a visible label, and linked to the switch with `aria-describedby`. |

Also accepts any native `<input>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<input>`. `className` and `style` go on the outermost element.

**Accessibility** - role `switch`, keyboard operable. Use role="switch" for the toggle; Use aria-checked to reflect on/off state; Space key toggles the switch; The description under the label is linked with aria-describedby.

**Do:** Use for settings that take effect immediately; Provide a clear label describing the setting; Show the current state visually; Say what the setting does, or why it is locked, in its description.
**Don't:** Do not use for choices that only apply when a form is submitted - use Checkbox instead; Do not hide the label unless the row already names the setting.

**Choosing a variant:**
- `size="Medium"`: Settings pages, one setting per row. The default size.
- `size="Small"`: Dense lists, such as settings in a side panel.
- `withLabel="false"`: The row already names the setting, with the switch at the end of the row, as in a settings list. Keep the label for screen readers.
- `disabled`: The setting is locked, for example by an admin policy. Say why next to it.

**Deprecated aliases** (do not use): `Switch`, `Toggle switch`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- The input carries `role="switch"`. Without it the control announces as a checkbox, which promises a form value rather than an immediate change.
- Track 44x24 (36x20 small), thumb 20px (16px), 2px padding. Thumb travel is track - thumb - 2xpadding: 20px, or 16px when small.
- The track fill is `--border-control` off and `--primary` on. It does not tint on hover - only the thumb shadow deepens.
- The focus ring goes on the track, since the real input is 0x0.
- A toggle applies immediately. If the change needs a Save button, use a Checkbox instead.
- A description goes under the label in `.inspera-toggle__message`, linked with `aria-describedby`: 52px in (44px when small), 4px under the row.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:            #004080;
  --white:              #ffffff;
  --gray-600:           #7A7A7A;
  --gray-700:           #595959;
  --text-primary:       rgba(0, 0, 0, 0.87);
  --border-control:     var(--gray-600);
  --muted-foreground:   var(--gray-700);
  --radius-pill:        9999px;
  --focus-ring-width:   2px;
  --focus-ring-offset:  2px;
  --focus-ring-color:   var(--primary);
  --font-sans:          'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
}

.inspera-toggle__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.inspera-toggle__track {
  width: 44px;
  height: 24px;
  border-radius: var(--radius-pill);
  background: var(--border-control);
  padding: 2px;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  transition: background 140ms ease;
}

.inspera-toggle--small .inspera-toggle__track { width: 36px; height: 20px; }

.inspera-toggle__thumb {
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  background: var(--white);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  transform: translateX(0);
  transition: transform 160ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 120ms ease;
}

.inspera-toggle--small .inspera-toggle__thumb { width: 16px; height: 16px; }

.inspera-toggle__input:checked + .inspera-toggle__track { background: var(--primary); }

/* Travel is track - thumb - (2 x padding). */
.inspera-toggle__input:checked + .inspera-toggle__track .inspera-toggle__thumb {
  transform: translateX(20px);
}
.inspera-toggle--small .inspera-toggle__input:checked + .inspera-toggle__track .inspera-toggle__thumb {
  transform: translateX(16px);
}

.inspera-toggle:hover .inspera-toggle__thumb { box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); }

.inspera-toggle__input:focus-visible + .inspera-toggle__track {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.inspera-toggle--disabled { cursor: not-allowed; opacity: 0.38; }

/* A description under the label, linked with aria-describedby. It starts
   where the label text starts (the track plus its 8px gap) and sits 4px under
   the row. Not dimmed when disabled: it often says why the setting is locked. */
.inspera-toggle-field {
  display: inline-flex;
  flex-direction: column;
  font-family: var(--font-sans);
}
.inspera-toggle__message {
  margin-top: 4px;
  padding-left: 52px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--muted-foreground);
}
.inspera-toggle--small + .inspera-toggle__message { padding-left: 44px; }
```

```html
<label class="inspera-toggle" for="notify">
  <input class="inspera-toggle__input" id="notify" type="checkbox" role="switch" />
  <span class="inspera-toggle__track" aria-hidden="true">
    <span class="inspera-toggle__thumb"></span>
  </span>
  <span>Enable notifications</span>
</label>
```


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


### Form Field

Lay out a label, control and help or error text consistently around any input. - category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { FormField } from '@inspera/components'

<FormField
  label="Email address"
  helpText="We'll never share your email."
>
  <TextInput label="Email address" placeholder="jane@inspera.com" />
</FormField>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Field label text. |
| `htmlFor` | `string` | - | Only needed to wrap a control that is not from this library. Inspera controls pick up the field's id, description and error state on their own. |
| `required` | `boolean` | `false` | Show a required asterisk and mark the control required. |
| `helpText` | `string` | - | Helper text shown below the control. |
| `errorText` | `string` | - | Error message; replaces help text and marks the control invalid. |
| `children` **(required)** | `ReactNode` | - | The control this field wraps. Exactly one. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

**Accessibility** - role `group`, keyboard operable. Associate the label with the control via htmlFor/id; Link error and help text with aria-describedby on the control; Required fields should set aria-required on the control.

**Do:** Wrap any single control for consistent spacing; Use htmlFor to link the label to the control; Show only one of help or error at a time.
**Don't:** Do not wrap several unrelated controls; Do not leave out the label - screen readers need it.

**Choosing a variant:**
- `required`: The form can't be saved without it, in a form where most fields are optional. Mark only those, and say once what the asterisk means.

**Deprecated aliases** (do not use): `Field wrapper`, `Input group`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- The wrapper owns three links the control cannot make for itself: `for` -> the control id, `aria-describedby` -> the message id, and `aria-invalid` when the message is an error.
- Only one message shows at a time. When there is an error it replaces the help text; it does not stack under it.
- The red asterisk is `aria-hidden` decoration. Requiredness is announced from the control's own `required` attribute - the asterisk alone tells a screen reader nothing.
- Gap between label, control and message is 4px (space-1); message text is 12px.
- The nested control keeps its own label markup off (there is already one here) but still needs an accessible name via the outer `for`.

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

.inspera-field-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
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


### Radio Group

Group mutually exclusive radio options. - category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { RadioGroup } from '@inspera/components'

<RadioGroup
  label="Delivery speed"
  options={[
    { label: 'Standard', value: 'standard' },
    { label: 'Express', value: 'express' },
    { label: 'Overnight', value: 'overnight' },
  ]}
  defaultValue="standard"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Group label, announced as the radiogroup name. |
| `options` **(required)** | `RadioOption[]` | - | Radio options. |
| `value` | `string` | - | Selected option value. Controlled - pair with onChange. |
| `defaultValue` | `string` | - | Starting selection when uncontrolled. |
| `onChange` | `(value: string) => void` | - | Fired with the newly selected value. |
| `name` | `string` | - | Shared input name for the group. Generated when unset. |
| `orientation` | `'Vertical' \| 'Horizontal'` | `'Vertical'` | Layout direction. |
| `helpText` | `string` | - | Guidance shown below the options. Replaced by errorText when `error` is set. |
| `errorText` | `string` | - | Validation message, shown while `error` is true. |
| `error` | `boolean` | `false` | Marks the group invalid and shows errorText. |
| `disabled` | `boolean` | `false` | Disables every option. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

```ts
export interface RadioOption {
  label: string
  value: string
}
```

**Accessibility** - role `radiogroup`, keyboard operable. Container uses role="radiogroup" with an accessible label; Each option is a radio with aria-checked; Arrow keys navigate between options.

**Do:** Use for single selection among 2-6 options; Provide a group label; Pre-select a sensible default.
**Don't:** Do not use for multi-select - use Checkbox Group; Do not use a single radio alone.

**Choosing a variant:**
- `orientation="Vertical"`: Most groups. One option per line is the easiest to scan.
- `orientation="Horizontal"`: Two or three short options that fit on one line, such as file formats.
- `error`: A required choice is missing. Say what to choose in errorText.
- `disabled`: The choice is locked or does not apply. Say why in helpText, such as a setting locked while the test is live.

**Deprecated aliases** (do not use): `Radio list`, `Option group`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- The group label is a `<span>` with an id, linked by `aria-labelledby` on the `role="radiogroup"` element. A bare `<label>` cannot name a group.
- Every option shares one `name`, and no other question on the page may reuse it.
- Vertical options have no gap - each row carries its own 8px vertical padding. Horizontal adds a 24px gap.
- Group-level state (error, disabled) is applied to each option, not drawn once on the wrapper.

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
  --radius-pill:        9999px;
  --focus-ring-width:   2px;
  --focus-ring-offset:  2px;
  --focus-ring-color:   var(--primary);
  --font-sans:          'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-radio {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  cursor: pointer;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
}

.inspera-radio__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.inspera-radio__circle {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-pill);
  border: 2px solid var(--border-control);
  background: var(--white);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 120ms ease;
}

/* The dot is a child element, not a background - it has to stay centred as the
   circle scales on press. */
.inspera-radio__dot {
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  background: var(--primary);
}

.inspera-radio__input:checked + .inspera-radio__circle { border-color: var(--primary); }

.inspera-radio:hover .inspera-radio__circle { border-color: var(--primary); background: rgba(0, 64, 128, 0.04); }

.inspera-radio__input:focus-visible + .inspera-radio__circle {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.inspera-radio:active .inspera-radio__circle { transform: scale(0.92); }

/* In error the ring is red whether or not the radio is selected, so a group
   in error reads as one. The dot stays blue. */
.inspera-radio--error .inspera-radio__circle,
.inspera-radio--error .inspera-radio__input:checked + .inspera-radio__circle { border-color: var(--error); }
.inspera-radio--error:hover .inspera-radio__circle { border-color: var(--error); background: var(--error-surface); }

.inspera-radio--disabled { cursor: not-allowed; opacity: 0.38; }

/* A description under the label, linked with aria-describedby. It starts
   where the label text starts (the 20px circle plus its 8px gap) and sits 4px
   under it, pulled up into the row's 8px padding. Not dimmed when disabled:
   it often says why the option is unavailable. */
.inspera-radio-field {
  display: inline-flex;
  flex-direction: column;
  font-family: var(--font-sans);
}
.inspera-radio__message {
  margin-top: -4px;
  padding-left: 28px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--muted-foreground);
}

.inspera-radio-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-family: var(--font-sans);
}

.inspera-radio-group__label {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.inspera-radio-group__options {
  display: flex;
  flex-direction: column;
  /* Horizontal options wrap onto a new line rather than overflow. */
  flex-wrap: wrap;
  column-gap: 24px;
  row-gap: 0;
}

/* Horizontal needs real separation; the vertical stack relies on each row's
   own 8px padding instead. */
.inspera-radio-group--horizontal .inspera-radio-group__options {
  flex-direction: row;
}

.inspera-radio-group__error { font-size: 12px; color: var(--error); }
```

```html
<div class="inspera-radio-group">
  <span class="inspera-radio-group__label" id="delivery-label">Delivery speed</span>
  <div class="inspera-radio-group__options" role="radiogroup" aria-labelledby="delivery-label">
    <label class="inspera-radio" for="d-standard">
      <input class="inspera-radio__input" id="d-standard" type="radio" name="delivery" />
      <span class="inspera-radio__circle" aria-hidden="true"></span>
      <span>Standard</span>
    </label>
    <label class="inspera-radio" for="d-express">
      <input class="inspera-radio__input" id="d-express" type="radio" name="delivery" />
      <span class="inspera-radio__circle" aria-hidden="true"></span>
      <span>Express</span>
    </label>
  </div>
</div>
```


### Checkbox Group

Group related multi-select checkboxes. - category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { CheckboxGroup } from '@inspera/components'

<CheckboxGroup
  label="Notifications"
  options={[
    { label: 'Email', value: 'email' },
    { label: 'SMS', value: 'sms' },
    { label: 'Push', value: 'push' },
  ]}
  defaultValue={['email']}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Group label, announced as the group's name. |
| `options` **(required)** | `CheckboxOption[]` | - | Checkbox options. |
| `value` | `string[]` | - | Selected option values. Controlled - pair with onChange. |
| `defaultValue` | `string[]` | `[]` | Starting selection when uncontrolled. |
| `onChange` | `(value: string[]) => void` | - | Fired with the full array of selected values. |
| `orientation` | `'Vertical' \| 'Horizontal'` | `'Vertical'` | Layout direction. |
| `helpText` | `string` | - | Guidance shown below the options. Replaced by errorText when `error` is set. |
| `errorText` | `string` | - | Validation message, shown while `error` is true. |
| `error` | `boolean` | `false` | Marks every option invalid and shows errorText. |
| `disabled` | `boolean` | `false` | Disables every option. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

```ts
export interface CheckboxOption {
  label: string
  value: string
}
```

**Accessibility** - role `group`, keyboard operable. Container uses role="group" with aria-labelledby; Each option is a checkbox with aria-checked; Group related options under a shared legend/label.

**Do:** Use for selecting multiple related options; Provide a group label; Keep options parallel and concise.
**Don't:** Do not use for mutually exclusive options - use Radio Group; Do not omit the group label.

**Choosing a variant:**
- `orientation="Vertical"`: Most groups. One option per line is the easiest to scan.
- `orientation="Horizontal"`: Two or three short options that read as one line, such as Marks, Grades and Comments.
- `error`: At least one option is required. Say so in errorText.
- `disabled`: The choice depends on another setting that is off. Put the group under that setting and say how to turn it on.

**Deprecated aliases** (do not use): `Checkbox list`, `Multi-select group`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- Checkboxes take `role="group"`, not `radiogroup`, and they do **not** share a `name` - each carries its own value.
- The group label is a `<span>` with an id, linked by `aria-labelledby`.
- Same spacing as Radio Group: no gap vertically (rows carry their own padding), 24px horizontally.
- A "select all" control on top of a group is the natural place for the indeterminate checkbox state.

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

.inspera-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-family: var(--font-sans);
}

.inspera-checkbox-group__label {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.inspera-checkbox-group__options {
  display: flex;
  flex-direction: column;
  /* Horizontal options wrap onto a new line rather than overflow. */
  flex-wrap: wrap;
  column-gap: 24px;
  row-gap: 0;
}

.inspera-checkbox-group--horizontal .inspera-checkbox-group__options {
  flex-direction: row;
}

.inspera-checkbox-group__error { font-size: 12px; color: var(--error); }
```

```html
<div class="inspera-checkbox-group">
  <span class="inspera-checkbox-group__label" id="notify-label">Notifications</span>
  <div class="inspera-checkbox-group__options" role="group" aria-labelledby="notify-label">
    <label class="inspera-checkbox" for="n-email">
      <input class="inspera-checkbox__input" id="n-email" type="checkbox" />
      <span class="inspera-checkbox__box" aria-hidden="true"></span>
      <span>Email</span>
    </label>
    <label class="inspera-checkbox" for="n-sms">
      <input class="inspera-checkbox__input" id="n-sms" type="checkbox" />
      <span class="inspera-checkbox__box" aria-hidden="true"></span>
      <span>SMS</span>
    </label>
  </div>
</div>
```

