# Components

The Inspera kit ships 48 components. Import from `@inspera/kit`. Read the
component's entry before using it - prop names and variant casing are exact.

## input-controls

### Button

Trigger an action. - category: `input-controls`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Button } from '@inspera/kit'

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

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { TextInput } from '@inspera/kit'

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


### Checkbox

Allow multiple selection. - category: `input-controls`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Checkbox } from '@inspera/kit'

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


### Radio Button

Allow single selection. - category: `input-controls`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { RadioButton } from '@inspera/kit'

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

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Select } from '@inspera/kit'

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

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Toggle } from '@inspera/kit'

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

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Textarea } from '@inspera/kit'

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


### Form Field

Lay out a label, control and help or error text consistently around any input. - category: `input-controls`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { FormField } from '@inspera/kit'

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


### Slider

Select a numeric value from a continuous range. - category: `input-controls`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Slider } from '@inspera/kit'

<Slider
  label="Volume"
  defaultValue={40}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | What is being adjusted. Required: it is the accessible name even when hidden. |
| `min` | `number` | `0` | Minimum value. |
| `max` | `number` | `100` | Maximum value. |
| `step` | `number` | `1` | Increment granularity. |
| `value` | `number` | - | Current value. Controlled - pair with onChange. |
| `defaultValue` | `number` | - | Starting value when uncontrolled. Defaults to the midpoint. |
| `onChange` | `(value: number) => void` | - | Fired as the value changes, by drag or arrow key. |
| `formatValue` | `(value: number) => string` | - | Formats the shown value and what assistive tech announces, e.g. `(v) => v + '%'`. |
| `showValue` | `boolean` | `true` | Show the current value. |
| `showLabel` | `boolean` | `true` | Render the visible label. When false, the label becomes `aria-label`. |
| `disabled` | `boolean` | `false` | Blocks interaction and dims the control. |

Also accepts any native `<input>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<input>`. `className` and `style` go on the outermost element.

**Accessibility** - role `slider`, keyboard operable. Use role="slider" with aria-valuemin / aria-valuemax / aria-valuenow; Provide an accessible label via aria-label; Arrow keys adjust the value.

**Do:** Use for adjustable numeric ranges; Show the current value for precision; Provide a clear label.
**Don't:** Do not use for exact numeric entry - use Number Input instead; Do not use without min/max bounds.

**Choosing a variant:**
- `showValue`: People set a level they need to know exactly, such as a similarity threshold.
- `showValue="false"`: Only the position matters, such as playback volume.
- `showLabel="false"`: Something next to it already says what it is, such as a zoom icon in a viewer toolbar. The label still names it for screen readers.
- `disabled`: The setting depends on another one that is off. Say which under it.

**Deprecated aliases** (do not use): `Range`, `Range slider`

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
  --gray-700:           #595959;
  --text-primary:       rgba(0, 0, 0, 0.87);
  --muted-foreground:   var(--gray-700);
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


### Segmented Control

Choose one option from a small set of mutually exclusive segments. - category: `input-controls`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { SegmentedControl } from '@inspera/kit'

<SegmentedControl
  label="Date range"
  items={['Day', 'Week', 'Month']}
  defaultValue="Week"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Names the group for assistive tech, e.g. "Date range". Not shown. |
| `items` **(required)** | `(string \| SegmentedControlItem)[]` | - | Segments, in order. Plain strings when value and label match. |
| `value` | `string` | - | Selected segment value. Controlled - pair with onChange. |
| `defaultValue` | `string` | - | Starting segment when uncontrolled. Defaults to the first. |
| `onChange` | `(value: string) => void` | - | Fired with the chosen segment's value. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Segment height. |
| `fullWidth` | `boolean` | `false` | Stretch to fill the row. |
| `disabled` | `boolean` | `false` | Blocks interaction and dims the control. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

```ts
export interface SegmentedControlItem {
  value: string
  /** Shown text. Defaults to `value`. */
  label?: string
}
```

**Accessibility** - role `radiogroup`, keyboard operable. Container uses role="radiogroup"; Each segment uses role="radio" with aria-checked; Arrow keys move between segments.

**Do:** Use for 2-4 mutually exclusive views; Keep labels short and parallel; Show the active segment clearly.
**Don't:** Do not use for more than 4 options - use Tabs or Select; Do not use for multi-select.

**Choosing a variant:**
- `size="Medium"`: A switch above the content it changes, such as how results are broken down. The default size.
- `size="Small"`: Card headers and dense toolbars, such as the period of a dashboard card.
- `fullWidth`: A narrow panel, where the segments share its width, such as the device in a preview panel.
- `disabled`: The views are not available yet. Say why next to it.

**Deprecated aliases** (do not use): `Segment control`, `Toggle group`, `Button group`

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

- Segments are joined and outlined: white `--surface`, `--gray-800` text and a `--border-control` border, overlapping by one border so each join is a single line. Only the outer corners take `--radius-sm`.
- The selected segment is `--blue-100` with `--primary` (blue-800) text and a `--blue-700` border, at 600 weight. It sits above its neighbours so the blue border shows on all four sides, and the weight marks it as well as the colour.
- Heights and type match Button: 40px with 16px text, or 32px with 14px text when small - the same heights as Text Input, so they line up in a toolbar.
- A hidden bold copy of the label (`::after` from `data-label`) holds the bold width, so selecting a segment does not shift the others.
- Use `role="radiogroup"` with `role="radio"` children and a roving tabindex: the selected item is the only tab stop, and arrows move between them.
- For more than about four options, or for anything not mutually exclusive, use Tabs or a Select instead.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                         #004080;
  --white:                           #ffffff;
  --gray-600:                        #7A7A7A;
  --gray-800:                        #404040;
  --blue-100:                        #F0F7FF;
  --blue-700:                        #0059B3;
  --border-control:                  var(--gray-600);
  --surface:                         var(--white);
  --control-height-sm:               32px;
  --control-height-md:               40px;
  --radius-sm:                       4px;
  --border-width-default:            1px;
  --focus-ring-width:                2px;
  --focus-ring-offset:               2px;
  --focus-ring-color:                var(--primary);
  --duration-fast:                   100ms;
  --easing-standard:                 cubic-bezier(0.2, 0, 0, 1);
  --font-sans:                       'Inter', system-ui, -apple-system, sans-serif;
  --default-16-regular-size:         16px;
  --default-16-regular-line-height:  1.25;
  --medium-14-size:                  14px;
  --medium-14-line-height:           1.4;
}

.inspera-segmented { display: inline-flex; }
.inspera-segmented--full { width: 100%; }

.inspera-segmented__item {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: var(--control-height-md);
  padding: 0 12px;
  border: var(--border-width-default) solid var(--border-control);
  border-radius: 0;
  background: var(--surface);
  color: var(--gray-800);
  font-family: var(--font-sans);
  font-size: var(--default-16-regular-size);
  line-height: var(--default-16-regular-line-height);
  font-weight: 400;
  white-space: nowrap;
  cursor: pointer;
  transition: background var(--duration-fast) var(--easing-standard);
}

/* Neighbours overlap by one border, so each join is a single line. Only the
   outer corners are rounded. */
.inspera-segmented__item + .inspera-segmented__item { margin-left: calc(var(--border-width-default) * -1); }
.inspera-segmented__item:first-child { border-radius: var(--radius-sm) 0 0 var(--radius-sm); }
.inspera-segmented__item:last-child { border-radius: 0 var(--radius-sm) var(--radius-sm) 0; }
.inspera-segmented__item:only-child { border-radius: var(--radius-sm); }

.inspera-segmented--small .inspera-segmented__item {
  height: var(--control-height-sm);
  font-size: var(--medium-14-size);
  line-height: var(--medium-14-line-height);
}
.inspera-segmented--full .inspera-segmented__item { flex: 1; }

.inspera-segmented__item[aria-checked='false']:hover:not(:disabled) {
  background: color-mix(in srgb, var(--surface) 96%, black);
}

.inspera-segmented__item:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.inspera-segmented--disabled { opacity: 0.38; }
.inspera-segmented--disabled .inspera-segmented__item { cursor: not-allowed; }

/* Selected: raised above its neighbours so the blue border shows on all four
   sides, and bold as well as blue - blue against gray text alone would leave
   the choice to colour. */
.inspera-segmented__item[aria-checked='true'] {
  z-index: 1;
  background: var(--blue-100);
  color: var(--primary);
  border-color: var(--blue-700);
  font-weight: 600;
}

/* A hidden bold copy of the label holds the bold width, so selecting a
   segment does not shift the ones after it. */
.inspera-segmented__label {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}
.inspera-segmented__label::after {
  content: attr(data-label);
  content: attr(data-label) / '';
  height: 0;
  overflow: hidden;
  visibility: hidden;
  font-weight: 600;
  pointer-events: none;
  user-select: none;
}
```

```html
<!-- Roving tabindex: the group is one tab stop and the arrows move inside it. -->
<div class="inspera-segmented" role="radiogroup" aria-label="Date range">
  <button type="button" class="inspera-segmented__item" role="radio" aria-checked="true" tabindex="0"><span class="inspera-segmented__label" data-label="Day">Day</span></button>
  <button type="button" class="inspera-segmented__item" role="radio" aria-checked="false" tabindex="-1"><span class="inspera-segmented__label" data-label="Week">Week</span></button>
  <button type="button" class="inspera-segmented__item" role="radio" aria-checked="false" tabindex="-1"><span class="inspera-segmented__label" data-label="Month">Month</span></button>
</div>
```


### Date Picker

Select a calendar date from a popover. - category: `input-controls`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { DatePicker } from '@inspera/kit'

<DatePicker
  label="Due date"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Field label. Always required: it is the accessible name even when hidden. |
| `value` | `string` | - | Selected date (YYYY-MM-DD). Controlled - pair with onChange. |
| `defaultValue` | `string` | - | Starting date when uncontrolled (YYYY-MM-DD). |
| `onChange` | `(iso: string) => void` | - | Fired with the selected date as an ISO string (YYYY-MM-DD). |
| `open` | `boolean` | - | Calendar open state. Controlled - pair with onOpenChange. |
| `defaultOpen` | `boolean` | `false` | Open the calendar initially, when uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | - | Fired when the calendar opens or closes. |
| `placeholder` | `string` | `'Select date'` | Trigger text when no date is chosen. |
| `showLabel` | `boolean` | `true` | Render the visible label. When false, the label becomes `aria-label`. |
| `helpText` | `string` | - | Guidance shown below the field. Replaced by errorText when `error` is set. |
| `errorText` | `string` | - | Validation message, shown while `error` is true. |
| `error` | `boolean` | `false` | Marks the field invalid: red border and errorText shown. |
| `disabled` | `boolean` | `false` | Blocks interaction and dims the field. |

Also accepts any native `<button>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<button>`. `className` and `style` go on the outermost element.

**Accessibility** - role `dialog`, keyboard operable. Trigger uses aria-haspopup="dialog" and aria-expanded; Popover uses role="dialog" with a label; Day cells are buttons with descriptive aria-labels; Escape closes the popover.

**Do:** Use for selecting a single calendar date; Highlight today and the selected day; Provide clear month navigation.
**Don't:** Do not use for free-form date typing without validation; Do not trap keyboard focus without an escape.

**Choosing a variant:**
- `error`: The date is missing or out of range. Say which date is allowed, such as an end date after the start date.
- `disabled`: The date does not apply with the current settings. Say what makes it available.

**Deprecated aliases** (do not use): `Calendar input`, `Date field`

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

- The grid is `repeat(7, 1fr)` and always padded to 42 cells with empty spans. A grid sized to the month makes the panel jump height as you page through it.
- Leading blanks come from the first of the month's weekday index - they are empty `<span>`s, not disabled buttons, so they are skipped by the keyboard.
- Every day button needs a full `aria-label` ("March 1, 2026"). A bare "1" tells a screen reader nothing.
- Today is outlined with a 1px `--primary` border; the selected day is filled with `--primary`. A day that is both shows only the fill.
- The panel is anchored under the trigger, `--radius-md` on `--surface` with `--shadow-200`, and closes on Escape and on an outside click.
- Store and emit ISO `YYYY-MM-DD`, never a locale-formatted string. Show it as people read a date: "19 Aug 2026", as Date Range Picker does.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --error:                  #D32F2F;
  --white:                  #ffffff;
  --gray-200:               #EDEDED;
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
  --surface:                var(--white);
  --border:                 var(--gray-200);
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

.inspera-datepicker {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  position: relative;
  font-family: var(--font-sans);
}

.inspera-datepicker__label {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.inspera-datepicker__trigger {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border-radius: var(--radius-sm);
  border: var(--border-width-default) solid var(--border-control);
  background: var(--white);
  cursor: pointer;
  text-align: left;
  font: inherit;
  transition:
    border-color var(--duration-fast) var(--easing-standard),
    box-shadow var(--duration-fast) var(--easing-standard);
}

.inspera-datepicker__trigger:hover { border-color: var(--border-control-strong); }

.inspera-datepicker__trigger:focus-visible,
.inspera-datepicker__trigger[aria-expanded='true'] {
  border-color: var(--primary);
  box-shadow: var(--effect-state-focus);
  outline: none;
}

.inspera-datepicker__value {
  flex: 1;
  font-size: 16px;
  color: var(--text-placeholder);
}
.inspera-datepicker__value--set { color: var(--text-primary); }

/* The trigger and its panel share an anchor, so the calendar opens directly
   under the field whether or not a label sits above it. */
.inspera-datepicker__anchor { position: relative; }

.inspera-datepicker__trigger[data-invalid='true'],
.inspera-datepicker__trigger[data-invalid='true']:hover {
  border-color: var(--error);
  box-shadow: var(--effect-state-error);
}
.inspera-datepicker__trigger:disabled {
  background: var(--surface-disabled);
  opacity: 0.6;
  cursor: not-allowed;
}
.inspera-datepicker__trigger:disabled:hover { border-color: var(--border-control); }

.inspera-datepicker__error { font-size: 12px; color: var(--error); }

.inspera-datepicker__trigger .material-symbols-outlined {
  font-size: 20px;
  color: var(--action-active);
}

.inspera-datepicker__panel {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: var(--z-dropdown);
  width: 280px;
  padding: 12px;
  background: var(--surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-200);
  border: 1px solid var(--border);
}

.inspera-datepicker__nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.inspera-datepicker__nav-btn {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--text-primary);
}
.inspera-datepicker__nav-btn .material-symbols-outlined { font-size: 20px; }

.inspera-datepicker__month {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.inspera-datepicker__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.inspera-datepicker__weekday {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--muted-foreground);
  padding: 4px 0;
}

.inspera-datepicker__day {
  height: 32px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 14px;
  cursor: pointer;
}

/* Today is outlined; the selection is filled. Both at once would read as two
   selected days. */
.inspera-datepicker__day--today { border: 1px solid var(--primary); }

.inspera-datepicker__day--selected {
  background: var(--primary);
  color: var(--white);
  border: none;
}
```

```html
<div class="inspera-datepicker">
  <label class="inspera-datepicker__label" for="due">Due date</label>
  <button class="inspera-datepicker__trigger" id="due" type="button"
          aria-haspopup="dialog" aria-expanded="false">
    <span class="inspera-datepicker__value">Select date</span>
    <span class="material-symbols-outlined" aria-hidden="true">calendar_today</span>
  </button>

  <!-- Rendered only while open. -->
  <div class="inspera-datepicker__panel" role="dialog" aria-label="Choose date">
    <div class="inspera-datepicker__nav">
      <button class="inspera-datepicker__nav-btn" type="button" aria-label="Previous month">
        <span class="material-symbols-outlined" aria-hidden="true">chevron_left</span>
      </button>
      <span class="inspera-datepicker__month">March 2026</span>
      <button class="inspera-datepicker__nav-btn" type="button" aria-label="Next month">
        <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
      </button>
    </div>
    <div class="inspera-datepicker__grid">
      <span class="inspera-datepicker__weekday">Su</span>
      <!-- ...Mo through Sa... -->
      <span></span><!-- leading blanks to the first weekday -->
      <button class="inspera-datepicker__day" type="button" aria-label="March 1, 2026">1</button>
      <!-- ...padded to 42 cells so the panel height never changes... -->
    </div>
  </div>
</div>
```


### File Upload

Upload files via drag-and-drop or browse. - category: `input-controls`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { FileUpload } from '@inspera/kit'

<FileUpload
  label="Attachments"
  accept="image/*,.pdf"
  helpText="PNG, JPG or PDF up to 10MB"
  onFiles={handleFiles}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | What to upload, e.g. "Attachments". The file input's accessible name. |
| `accept` | `string` | - | Accepted MIME types / extensions, e.g. "image/*,.pdf". Applies to drops too. |
| `multiple` | `boolean` | `false` | Allow more than one file. A drop of several is cut to the first when false. |
| `helpText` | `string` | - | Constraint hint, e.g. "PNG, JPG or PDF up to 10MB". Replaced by errorText when `error` is set. |
| `errorText` | `string` | - | Validation message, shown while `error` is true. |
| `error` | `boolean` | `false` | Marks the zone invalid: red border and `aria-invalid`. |
| `disabled` | `boolean` | `false` | Blocks interaction and dims the zone. |
| `onFiles` | `(files: File[]) => void` | - | Fired with the selected files, from both drop and browse. |

Also accepts any native `<input>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<input>`. `className` and `style` go on the outermost element.

**Accessibility** - role `button`, keyboard operable. Dropzone uses role="button" and is keyboard focusable; Enter / Space open the file browser; Provide an accessible label describing the action.

**Do:** Support both drag-and-drop and click-to-browse; State accepted file types and size limits; Give visible drag feedback.
**Don't:** Do not hide the option to browse; Do not leave out the accepted file types and size limit.

**Choosing a variant:**
- `multiple="false"`: One file, which a new upload replaces, such as invigilator instructions.
- `multiple`: Several files that go together, such as resources for a question set. List the files under the drop zone.
- `error`: The file can't be used. Say why and what to upload instead.
- `disabled`: Uploading isn't possible here, such as for someone who doesn't own the test. Say why.

**Deprecated aliases** (do not use): `Dropzone`, `File dropzone`, `Uploader`

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

- The zone is a `<label>` around a visually hidden `<input type="file">`. Clicking the zone opens the picker natively, and the input is the one focusable control, named by `aria-label` and described by the help text. Do not use a `<div role="button">` with the input inside it - that nests one control in another.
- Filter dropped files by the same `accept` and `multiple` rules as the picker, and reset the input value after each choice so picking the same file twice still fires.
- Border is 2px dashed `--border-control`; a 1px dash reads as a table rule at this size.
- The drag state and hover share one look: `--primary` border on a `--blue-100` wash. A drag shows it even in error, because the zone is about to take a new file; hover keeps the error red. Handle `dragover`, `dragleave` and `drop`, and `preventDefault` on dragover or the browser opens the file instead.
- Always state the constraint ("PNG, JPG or PDF up to 10MB") - a bare drop zone gives no way to know what will be rejected.
- Disabled dims the icon and the prompt to 0.6 and drops the link look from "browse", but not the help text: say there why uploading is not possible, and keep it readable.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:            #004080;
  --error:              #D32F2F;
  --white:              #ffffff;
  --gray-600:           #7A7A7A;
  --gray-700:           #595959;
  --blue-100:           #F0F7FF;
  --text-primary:       rgba(0, 0, 0, 0.87);
  --border-control:     var(--gray-600);
  --surface:            var(--white);
  --muted-foreground:   var(--gray-700);
  --radius-md:          8px;
  --focus-ring-width:   2px;
  --focus-ring-offset:  2px;
  --focus-ring-color:   var(--primary);
  --duration-fast:      100ms;
  --easing-standard:    cubic-bezier(0.2, 0, 0, 1);
  --font-sans:          'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-upload {
  /* Anchors the visually hidden input, so focusing it never scrolls the page. */
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 32px 24px;
  /* Dashed, and 2px - a 1px dashed border reads as a table rule at this size. */
  border: 2px dashed var(--border-control);
  border-radius: var(--radius-md);
  background: var(--surface);
  cursor: pointer;
  text-align: center;
  font-family: var(--font-sans);
  transition: all var(--duration-fast) var(--easing-standard);
}

/* The input inside has the focus; the zone draws the ring for it. */
.inspera-upload:has(.inspera-upload__input:focus-visible) {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.inspera-upload__icon {
  font-size: 40px;
  color: var(--primary);
}

.inspera-upload__prompt {
  font-size: 16px;
  color: var(--text-primary);
}

.inspera-upload__browse {
  color: var(--primary);
  font-weight: 600;
}

.inspera-upload__help {
  font-size: 12px;
  color: var(--muted-foreground);
}

/* The native input is the real control: visually hidden but focusable, and
   named by aria-label. A 0x0 input is skipped by some browsers' Tab order. */
.inspera-upload__input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.inspera-upload--error {
  border-color: var(--error);
}
.inspera-upload--error .inspera-upload__icon,
.inspera-upload--error .inspera-upload__help { color: var(--error); }

/* The pointer and a drag share one look. A drag shows even in error - the
   zone is about to take a new file - while hover keeps an error's red. */
.inspera-upload:not(.inspera-upload--disabled):not(.inspera-upload--error):hover,
.inspera-upload--dragging {
  border-color: var(--primary);
  background: var(--blue-100);
}
.inspera-upload--dragging .inspera-upload__icon { color: var(--primary); }

.inspera-upload--disabled {
  cursor: not-allowed;
}
/* Disabled dims the icon and the prompt, not the help text: it usually says
   why uploading is not possible, so it stays readable. "browse" stops looking
   like a link. */
.inspera-upload--disabled .inspera-upload__icon,
.inspera-upload--disabled .inspera-upload__prompt { opacity: 0.6; }
.inspera-upload--disabled .inspera-upload__browse { color: inherit; font-weight: inherit; }
```

```html
<!-- A <label> around the file input: clicking anywhere opens the picker
     natively, and the input stays the one focusable, named control. -->
<label class="inspera-upload" for="attachments">
  <span class="material-symbols-outlined inspera-upload__icon" aria-hidden="true">upload_file</span>
  <span class="inspera-upload__prompt" aria-hidden="true">
    Drag &amp; drop or <span class="inspera-upload__browse">browse</span>
  </span>
  <span class="inspera-upload__help" id="attachments-help">PNG, JPG or PDF up to 10MB</span>
  <input class="inspera-upload__input" id="attachments" type="file" accept="image/*,.pdf" multiple
         aria-label="Attachments" aria-describedby="attachments-help" />
</label>
```


### Radio Group

Group mutually exclusive radio options. - category: `input-controls`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { RadioGroup } from '@inspera/kit'

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

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { CheckboxGroup } from '@inspera/kit'

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


### Rating

Capture or display a star rating. - category: `input-controls`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Rating } from '@inspera/kit'

<Rating
  label="Question difficulty"
  defaultValue={3}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | What is being rated, e.g. "Question difficulty". The accessible name; not shown. |
| `value` | `number` | - | Current rating. Controlled - pair with onChange. |
| `defaultValue` | `number` | `0` | Starting rating when uncontrolled. |
| `onChange` | `(value: number) => void` | - | Fired with the chosen rating; 0 when cleared. Not fired when readOnly. |
| `max` | `number` | `5` | Number of stars. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Star size. |
| `readOnly` | `boolean` | `false` | Display-only: announced as "4 of 5 stars", not as a set of choices. |
| `showValue` | `boolean` | `false` | Show the numeric value beside the stars. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

**Accessibility** - role `radiogroup`, keyboard operable. Container uses role="radiogroup" with an accessible label; Each star is a radio with aria-checked and an aria-label; Arrow keys adjust the rating.

**Do:** Use for feedback and review scores; Preview the rating on hover when interactive; Use read-only mode to show an average score.
**Don't:** Do not use for precise numeric input; Do not omit accessible labels on stars.

**Choosing a variant:**
- `size="Medium"`: A single rating people give in a form. The default size.
- `size="Small"`: Dense lists, such as rating each question in a review.
- `readOnly`: A rating people read but cannot change, such as the average of several reviews.
- `showValue`: The exact score matters, such as when people compare ratings down a list.

**Deprecated aliases** (do not use): `Star rating`, `Stars`

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

- One glyph - `star` - with the variable font's FILL axis at 0 or 1. Swapping to a different outline glyph changes the shape and makes the row jump on hover.
- Filled stars are `--warning` #EF6C00; empty ones `--border-control`. Stars are 28px (20px small) with a 2px gap.
- `role="radiogroup"` with `role="radio"` stars, a roving tabindex, and arrow keys that both move focus and set the value.
- Every star needs its own label ("3 stars"), or the control announces as five unlabelled radios.
- Hovering previews the rating up to the pointer; leaving restores the committed value.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:            #004080;
  --warning:            #EF6C00;
  --gray-600:           #7A7A7A;
  --gray-700:           #595959;
  --border-control:     var(--gray-600);
  --muted-foreground:   var(--gray-700);
  --radius-xs:          2px;
  --focus-ring-width:   2px;
  --focus-ring-offset:  2px;
  --focus-ring-color:   var(--primary);
  --font-mono:          'Noto Sans Mono', ui-monospace, SFMono-Regular, monospace;
}

.inspera-rating {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.inspera-rating__stars {
  display: inline-flex;
  gap: 2px;
}

.inspera-rating__star {
  font-size: 28px;
  line-height: 1;
  color: var(--border-control);
  /* Same glyph, different fill axis. Swapping to a "star_outline" glyph shifts
     the shape and makes the row jump as you hover across it. */
  font-variation-settings: 'FILL' 0;
  border-radius: var(--radius-xs);
  cursor: pointer;
}

.inspera-rating--small .inspera-rating__star { font-size: 20px; }

.inspera-rating__star--filled {
  color: var(--warning);
  font-variation-settings: 'FILL' 1;
}

.inspera-rating__star:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.inspera-rating--readonly .inspera-rating__star { cursor: default; }

.inspera-rating__value {
  font-size: 14px;
  color: var(--muted-foreground);
  font-family: var(--font-mono);
}
```

```html
<!-- Roving tabindex again: one tab stop, arrows move and set the value. -->
<div class="inspera-rating" role="radiogroup" aria-label="Rating">
  <div class="inspera-rating__stars">
    <span class="material-symbols-outlined inspera-rating__star inspera-rating__star--filled"
          role="radio" aria-checked="false" aria-label="1 star" tabindex="-1">star</span>
    <span class="material-symbols-outlined inspera-rating__star inspera-rating__star--filled"
          role="radio" aria-checked="false" aria-label="2 stars" tabindex="-1">star</span>
    <span class="material-symbols-outlined inspera-rating__star inspera-rating__star--filled"
          role="radio" aria-checked="true" aria-label="3 stars" tabindex="0">star</span>
    <span class="material-symbols-outlined inspera-rating__star"
          role="radio" aria-checked="false" aria-label="4 stars" tabindex="-1">star</span>
    <span class="material-symbols-outlined inspera-rating__star"
          role="radio" aria-checked="false" aria-label="5 stars" tabindex="-1">star</span>
  </div>
</div>
```


### OTP Input

Enter a one-time verification code. - category: `input-controls`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { OtpInput } from '@inspera/kit'

<OtpInput
  label="Verification code"
  defaultValue="123"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Names the code, e.g. "Verification code". Required: it labels the group. |
| `length` | `number` | `6` | Number of digit boxes. |
| `value` | `string` | - | Current code. Controlled - pair with onChange. |
| `defaultValue` | `string` | `''` | Starting code when uncontrolled. |
| `onChange` | `(value: string) => void` | - | Fired with the digits entered so far; complete when its length equals `length`. |
| `showLabel` | `boolean` | `false` | Render the visible label above the boxes. |
| `error` | `boolean` | `false` | Marks every box invalid: red border and `aria-invalid`. |
| `disabled` | `boolean` | `false` | Blocks input and dims the boxes. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

**Accessibility** - role `textbox`, keyboard operable. Each box has an aria-label "Digit N"; aria-invalid reflects the error state; Backspace moves focus to the previous box; paste distributes digits.

**Do:** Auto-advance focus as digits are entered; Support paste of the full code; Use a monospace font for even alignment.
**Don't:** Do not make people move between boxes by hand; Do not allow non-numeric characters.

**Choosing a variant:**
- `error`: The code is wrong or has expired. Say what to do next, such as check the code or send a new one.
- `disabled`: Entry is paused, such as after too many tries. Say when people can try again.

**Deprecated aliases** (do not use): `PIN input`, `Verification code`, `Code input`

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

- One `<input>` per digit, 44x48, `--radius-sm`, in `--font-mono` at 20px so the digits do not shift as they are typed.
- `autocomplete="one-time-code"` goes on the first box only, and `off` on the rest. On every box the platform offers the code once per field.
- Wrap the boxes in `role="group"` named for the code ("Verification code"); each box is `aria-label="Digit N of 6"` with `inputmode="numeric"`.
- Keep one slot per box: a digit typed into box 3 stays in box 3, and Backspace clears only its own box. Storing the code as one string collapses the gaps.
- Wire the behaviour: typing advances focus, Backspace on an empty box moves back and clears, arrows move between boxes, and a paste on any box fills the rest.
- Focus is per box - do not ring the whole row.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --error:                  #D32F2F;
  --white:                  #ffffff;
  --gray-600:               #7A7A7A;
  --gray-800:               #404040;
  --blue-300:               #B3D9FF;
  --red-300:                #F9B8B8;
  --text-primary:           rgba(0, 0, 0, 0.87);
  --border-control:         var(--gray-600);
  --border-control-strong:  var(--gray-800);
  --surface-disabled:       #F5F5F5;
  --radius-sm:              4px;
  --effect-state-focus:     0px 0px 0px 3px var(--blue-300);
  --effect-state-error:     0px 0px 0px 3px var(--red-300);
  --border-width-default:   1px;
  --duration-fast:          100ms;
  --easing-standard:        cubic-bezier(0.2, 0, 0, 1);
  --font-mono:              'Noto Sans Mono', ui-monospace, SFMono-Regular, monospace;
}

.inspera-otp {
  display: inline-flex;
  gap: 8px;
}

.inspera-otp__box {
  width: 44px;
  height: 48px;
  text-align: center;
  border: var(--border-width-default) solid var(--border-control);
  border-radius: var(--radius-sm);
  background: var(--white);
  /* Monospace so the digits do not shift as they are typed. */
  font-family: var(--font-mono);
  font-size: 20px;
  color: var(--text-primary);
  outline: none;
  transition:
    border-color var(--duration-fast) var(--easing-standard),
    box-shadow var(--duration-fast) var(--easing-standard);
}

.inspera-otp__box:hover { border-color: var(--border-control-strong); }

.inspera-otp__box:focus {
  border-color: var(--primary);
  box-shadow: var(--effect-state-focus);
}

.inspera-otp__box[data-invalid='true'] {
  border-color: var(--error);
  box-shadow: var(--effect-state-error);
}

.inspera-otp__box[data-disabled='true'] {
  background: var(--surface-disabled);
  opacity: 0.6;
}
```

```html
<!-- autocomplete="one-time-code" on the FIRST box only, so the platform
     offers the SMS code once rather than once per digit. -->
<div class="inspera-otp">
  <input class="inspera-otp__box" type="text" inputmode="numeric" maxlength="1"
         autocomplete="one-time-code" aria-label="Digit 1" />
  <input class="inspera-otp__box" type="text" inputmode="numeric" maxlength="1"
         autocomplete="off" aria-label="Digit 2" />
  <input class="inspera-otp__box" type="text" inputmode="numeric" maxlength="1"
         autocomplete="off" aria-label="Digit 3" />
</div>
```


### Number Input

Enter and adjust a numeric value with steppers. - category: `input-controls`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { NumberInput } from '@inspera/kit'

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


### Combobox

Filter a list of options by typing to select one. - category: `input-controls`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Combobox } from '@inspera/kit'

<Combobox
  label="Assessment"
  options={[
    { value: 'algebra', label: 'Algebra Quiz', icon: 'quiz' },
    { value: 'biology', label: 'Biology Final', icon: 'science' },
    { value: 'history', label: 'History Midterm', icon: 'history_edu' },
    { value: 'physics', label: 'Physics Lab', icon: 'experiment' },
  ]}
  placeholder="Search assessments..."
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Field label. Always required: it is the accessible name even when hidden. |
| `options` **(required)** | `ComboboxOption[]` | - | The full option list. Filtered as the user types. |
| `placeholder` | `string` | `'Search...'` | Shown when nothing is typed or selected. |
| `value` | `string` | - | Selected value. Controlled - pair with onChange. |
| `defaultValue` | `string` | - | Starting value when uncontrolled. |
| `onChange` | `(value: string) => void` | - | Fired with the chosen value (or the free text, with allowCustomValue). |
| `showLabel` | `boolean` | `true` | Render the visible label. When false, the label becomes `aria-label`. |
| `allowCustomValue` | `boolean` | `false` | Allow a typed value that matches no option to be committed. |
| `emptyText` | `string` | `'No matches'` | Text shown when no option matches the query. |
| `helpText` | `string` | - | Guidance shown below the field. Replaced by errorText when `error` is set. |
| `errorText` | `string` | - | Validation message, shown while `error` is true. |
| `error` | `boolean` | `false` | Marks the field invalid: red border, `aria-invalid`, errorText shown. |
| `disabled` | `boolean` | `false` | Blocks interaction and dims the field. |

Also accepts any native `<input>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<input>`. `className` and `style` go on the outermost element.

```ts
export interface ComboboxOption {
  /** Value returned on select. */
  value: string
  /** Text shown in the list and field. Defaults to the value. */
  label?: string
  /** Optional Material Symbols icon shown before the label. */
  icon?: string
}
```

**Accessibility** - role `combobox`, keyboard operable. Input uses role="combobox" with aria-expanded and aria-controls; Options use role="option" with aria-selected; aria-activedescendant tracks the highlighted option; Up / Down / Enter navigate.

**Do:** Filter options as the user types; Allow custom values only when free text is valid; Show an empty state when nothing matches.
**Don't:** Do not use for a handful of fixed options - use Select; Do not commit a value the user has not confirmed.

**Choosing a variant:**
- `allowCustomValue="false"`: Picking one item out of hundreds by typing its name, such as a grader from all staff.
- `allowCustomValue`: Free text is a valid answer too, such as a new topic for a question.
- `error`: Nothing valid is chosen. Say what to choose.
- `disabled`: The field does not apply right now. Say why.

**Deprecated aliases** (do not use): `Autocomplete`, `Typeahead`, `Search select`

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

- The resting element is the closed field only - a search icon, an unstyled input, and a chevron. The listbox mounts on focus and unmounts on blur or Escape.
- The input is `role="combobox"` with `aria-expanded` and `aria-controls`; each option is `role="option"` with `aria-selected`, and `aria-activedescendant` tracks the highlighted one.
- Field chrome is identical to the text input: 40px, `--radius-sm`, `--border-control` to `--primary` on focus with `--effect-state-focus`.
- The active option is filled `--blue-100`. Up / Down move it, Enter commits, Escape closes.
- Only allow a typed value that matches no option when free text is genuinely valid; otherwise force a choice from the list.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --error:                  #D32F2F;
  --white:                  #ffffff;
  --gray-200:               #EDEDED;
  --gray-600:               #7A7A7A;
  --gray-700:               #595959;
  --gray-800:               #404040;
  --blue-100:               #F0F7FF;
  --blue-300:               #B3D9FF;
  --red-300:                #F9B8B8;
  --action-active:          rgba(0, 0, 0, 0.56);
  --text-primary:           rgba(0, 0, 0, 0.87);
  --border-control:         var(--gray-600);
  --border-control-strong:  var(--gray-800);
  --text-placeholder:       var(--gray-700);
  --surface-disabled:       #F5F5F5;
  --surface:                var(--white);
  --border:                 var(--gray-200);
  --radius-sm:              4px;
  --radius-md:              8px;
  --shadow-200:             0px 8px 8px rgba(39, 39, 39, 0.08), 0px 4px 6px rgba(39, 39, 39, 0.12);
  --effect-state-focus:     0px 0px 0px 3px var(--blue-300);
  --effect-state-error:     0px 0px 0px 3px var(--red-300);
  --border-width-default:   1px;
  --z-dropdown:             300;
  --font-sans:              'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-combobox {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  position: relative;
  font-family: var(--font-sans);
}

.inspera-combobox__label {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.inspera-combobox__field {
  /* Anchors the option list, which opens directly below the field. */
  position: relative;
  height: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border-radius: var(--radius-sm);
  border: var(--border-width-default) solid var(--border-control);
  background: var(--white);
}

.inspera-combobox__field:hover { border-color: var(--border-control-strong); }
.inspera-combobox__field:focus-within {
  border-color: var(--primary);
  box-shadow: var(--effect-state-focus);
}

.inspera-combobox__control {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-sans);
  font-size: 16px;
  color: var(--text-primary);
}
.inspera-combobox__control::placeholder { color: var(--text-placeholder); opacity: 1; }

.inspera-combobox__icon {
  font-size: 20px;
  color: var(--action-active);
}
/* The chevron rotates when the listbox is open. */
.inspera-combobox__chevron { cursor: pointer; transition: transform 140ms ease; }
.inspera-combobox__field[aria-expanded='true'] .inspera-combobox__chevron { transform: rotate(180deg); }

/* Rendered only while open, anchored under the field. */
.inspera-combobox__list {
  /* Inside the field, so it lines up with the field's outer border. */
  position: absolute;
  top: calc(100% + 4px);
  left: -1px;
  right: -1px;
  z-index: var(--z-dropdown, 20);
  margin: 0;
  padding: 6px;
  list-style: none;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-200);
}

.inspera-combobox__option {
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  font-size: 16px;
  color: var(--text-primary);
  cursor: pointer;
}
.inspera-combobox__option[aria-selected='true'] { background: var(--blue-100); }

.inspera-combobox__field[data-invalid='true'],
.inspera-combobox__field[data-invalid='true']:hover,
.inspera-combobox__field[data-invalid='true']:focus-within {
  border-color: var(--error);
  box-shadow: var(--effect-state-error);
}
.inspera-combobox__field[data-disabled='true'] {
  background: var(--surface-disabled);
  opacity: 0.6;
}
.inspera-combobox__field[data-disabled='true'] .inspera-combobox__chevron { cursor: not-allowed; }
.inspera-combobox__error { font-size: 12px; color: var(--error); }
```

```html
<div class="inspera-combobox">
  <label class="inspera-combobox__label" for="country">Country</label>
  <div class="inspera-combobox__field">
    <span class="material-symbols-outlined inspera-combobox__icon" aria-hidden="true">search</span>
    <input class="inspera-combobox__control" id="country" role="combobox"
           aria-expanded="false" aria-controls="country-list" aria-autocomplete="list"
           placeholder="Search countries" />
    <span class="material-symbols-outlined inspera-combobox__icon inspera-combobox__chevron" aria-hidden="true">expand_more</span>
    <!-- Rendered only while open, inside the field so it sits right under it. -->
    <ul class="inspera-combobox__list" id="country-list" role="listbox">
      <li class="inspera-combobox__option" role="option" aria-selected="true">Norway</li>
      <li class="inspera-combobox__option" role="option" aria-selected="false">Sweden</li>
    </ul>
  </div>
</div>
```


### Date Range Picker

Select a start and end date from a calendar. - category: `input-controls`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { DateRangePicker } from '@inspera/kit'

<DateRangePicker
  label="Test window"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Field label. Always required: it is the accessible name even when hidden. |
| `value` | `DateRange` | - | Selected range. Controlled - pair with onChange. |
| `defaultValue` | `DateRange` | - | Starting range when uncontrolled. |
| `onChange` | `(range: DateRange) => void` | - | Fired with the range once both ends are chosen. |
| `open` | `boolean` | - | Calendar open state. Controlled - pair with onOpenChange. |
| `defaultOpen` | `boolean` | `false` | Open the calendar initially, when uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | - | Fired when the calendar opens or closes. |
| `placeholder` | `string` | `'Select a range'` | Trigger text when no range is chosen. |
| `showLabel` | `boolean` | `true` | Render the visible label. When false, the label becomes `aria-label`. |
| `helpText` | `string` | - | Guidance shown below the field. Replaced by errorText when `error` is set. |
| `errorText` | `string` | - | Validation message, shown while `error` is true. |
| `error` | `boolean` | `false` | Marks the field invalid: red border and errorText shown. |
| `disabled` | `boolean` | `false` | Blocks interaction and dims the field. |

Also accepts any native `<button>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<button>`. `className` and `style` go on the outermost element.

```ts
export interface DateRange {
  /** Range start (YYYY-MM-DD). */
  start: string
  /** Range end (YYYY-MM-DD), on or after start. */
  end: string
}
```

**Accessibility** - role `dialog`, keyboard operable. Trigger uses aria-haspopup and aria-expanded; Calendar opens in a role="dialog" popover; Day cells use aria-pressed to mark the selected range.

**Do:** Show two months for cross-month ranges; Highlight the full span between endpoints; Confirm the range only once both ends are chosen.
**Don't:** Do not use for a single date - use Date Picker; Do not allow an end date before the start date.

**Choosing a variant:**
- `error`: The range is incomplete or impossible, such as a window that ends before it starts. Say what to fix.
- `disabled`: The range is set somewhere else, such as by the exam office. Say who sets it.

**Deprecated aliases** (do not use): `Range calendar`, `Date range`, `Period picker`

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

- The reusable surface is the closed trigger; the calendar it opens is a `role="dialog"` popover on `--surface` with `--shadow-200`, anchored under the trigger.
- The popover shows two months side by side (each a `repeat(7, 1fr)` grid) so a range that crosses a month boundary is visible without paging.
- The two endpoints are filled `--primary` with white text; every day between them is filled `--blue-100`. First click sets the start, second click sets the end and closes.
- The trigger shows "start - end" once both are chosen (`__value--set`), placeholder text otherwise. Store and emit ISO `YYYY-MM-DD`.
- Trigger chrome matches the other fields: 40px, `--radius-sm`, `--border-control` to `--primary` with `--effect-state-focus`.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --error:                  #D32F2F;
  --white:                  #ffffff;
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
  --radius-sm:              4px;
  --effect-state-focus:     0px 0px 0px 3px var(--blue-300);
  --effect-state-error:     0px 0px 0px 3px var(--red-300);
  --border-width-default:   1px;
  --font-sans:              'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-daterange {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  position: relative;
  font-family: var(--font-sans);
}

.inspera-daterange__label {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.inspera-daterange__trigger {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border-radius: var(--radius-sm);
  border: var(--border-width-default) solid var(--border-control);
  background: var(--white);
  cursor: pointer;
  text-align: left;
  font: inherit;
}

.inspera-daterange__trigger:hover { border-color: var(--border-control-strong); }
.inspera-daterange__trigger:focus-visible,
.inspera-daterange__trigger[aria-expanded='true'] {
  border-color: var(--primary);
  box-shadow: var(--effect-state-focus);
  outline: none;
}

.inspera-daterange__value {
  flex: 1;
  font-size: 16px;
  color: var(--text-placeholder);
}
.inspera-daterange__value--set { color: var(--text-primary); }

/* The trigger and its panel share an anchor, so the calendar opens directly
   under the field whether or not a label sits above it. */
.inspera-daterange__anchor { position: relative; }

.inspera-daterange__trigger[data-invalid='true'],
.inspera-daterange__trigger[data-invalid='true']:hover {
  border-color: var(--error);
  box-shadow: var(--effect-state-error);
}
.inspera-daterange__trigger:disabled {
  background: var(--surface-disabled);
  opacity: 0.6;
  cursor: not-allowed;
}
.inspera-daterange__trigger:disabled:hover { border-color: var(--border-control); }

.inspera-daterange__error { font-size: 12px; color: var(--error); }

.inspera-daterange__trigger .material-symbols-outlined {
  font-size: 20px;
  color: var(--action-active);
}
```

```html
<div class="inspera-daterange">
  <label class="inspera-daterange__label" for="period">Reporting period</label>
  <button class="inspera-daterange__trigger" id="period" type="button"
          aria-haspopup="dialog" aria-expanded="false">
    <span class="inspera-daterange__value">Select date range</span>
    <span class="material-symbols-outlined" aria-hidden="true">date_range</span>
  </button>
</div>
```


## data-display

### Card

Group related content in a contained surface. - category: `data-display`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Card } from '@inspera/kit'

<Card
  title="Algebra Quiz"
  body="24 questions, 45 minutes. Covers linear equations and inequalities."
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | - | Heading for the card. Also the accessible name of an interactive card. |
| `body` | `string` | - | Short body copy. For anything richer, pass children instead. |
| `elevation` | `'Flat' \| 'Raised' \| 'Outlined'` | `'Raised'` | Surface treatment. |
| `padding` | `'Compact' \| 'Default' \| 'Spacious'` | `'Default'` | Internal padding (12 / 16 / 24). |
| `interactive` | `boolean` | `false` | The whole card becomes one click target: it lifts on hover, sinks when pressed and takes a focus ring. |
| `selected` | `boolean` | - | Selected state. Controlled - pair with onSelectedChange. Setting it makes the card a toggle: interactive, and selected or not with each click. |
| `defaultSelected` | `boolean` | - | Starting selection when uncontrolled. Also makes the card a toggle. |
| `onSelectedChange` | `(selected: boolean) => void` | - | Fired with the new selection when the card is clicked. |
| `children` | `ReactNode` | - | Card contents. Replaces title and body. |
| `onClick` | `MouseEventHandler<HTMLButtonElement>` | - | Fired when an interactive card is activated. |

Also accepts any native `<article>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<article>`. `className` and `style` go on the outermost element.

**Accessibility** - role `article`, keyboard operable. An interactive card is an article with one button stretched over it, named by the title; A selectable card is a toggle: its button carries aria-pressed, and the selected tick is a second cue besides the border colour; Non-interactive cards use role="article" or a semantic section.

**Do:** Use to group related content; Maintain consistent padding within a view; Use raised elevation for primary content cards.
**Don't:** Do not nest cards inside other cards; Do not use an empty card just for layout.

**Choosing a variant:**
- `elevation="Raised"`: Cards that lead a page on the grey canvas, such as what to continue on the home page.
- `elevation="Flat"`: Page content on the grey canvas, such as the summaries on a test's overview. No shadow, so it stays quiet.
- `elevation="Outlined"`: Cards on a white page, where a shadow would be heavy, such as tests in the Cards view.
- `padding="Compact"`: Dense grids and side panels, where many cards share the space.
- `padding="Spacious"`: A card with one main message that needs room to read, such as a summary before publishing.
- `interactive`: The whole card opens one thing, such as a question type to start from. Put no other buttons or links inside it.
- `selected`: People pick options laid out as cards, such as the question types to add to a set. Each click selects or clears the card.

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

- Radius is `--radius-lg`. Padding is 12 / 16 / 24 for Compact / Default / Spacious.
- Flat has neither border nor shadow, Raised adds `--shadow-200`, Outlined adds a 1px `--border-strong`. Never both a shadow and a strong border.
- The transparent 1px border at rest is deliberate: without it, Outlined would be 2px wider than Flat.
- An interactive card stays an `<article>` with one transparent `<button class="inspera-card__link">` stretched over it, named by the title. Never wrap the card in a `<button>` (headings inside a button are invalid) and never put a click handler on a `<div>`.
- Interactive states: hover and keyboard focus lift to `--shadow-300`; pressed sinks to `--shadow-100` with the `--action-hover` wash over the white; keyboard focus also draws the standard focus ring around the whole card.
- A selectable card is a toggle: the button carries `aria-pressed`. Selected is a 2px `--primary` edge (border plus a 1px outline inset by 2px) and a `check_circle` tick at the top right; the right padding keeps room for the tick at all times.
- Title 16px/500, body 16px/1.4 in `--gray-700` - the body is not smaller than the title.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:            #004080;
  --white:              #ffffff;
  --gray-300:           #D9D9D9;
  --gray-700:           #595959;
  --action-hover:       rgba(0, 0, 0, 0.04);
  --text-primary:       rgba(0, 0, 0, 0.87);
  --border-strong:      var(--gray-300);
  --radius-lg:          12px;
  --shadow-100:         0px 4px 4px rgba(39, 39, 39, 0.08), 0px 2px 4px rgba(39, 39, 39, 0.12);
  --shadow-200:         0px 8px 8px rgba(39, 39, 39, 0.08), 0px 4px 6px rgba(39, 39, 39, 0.12);
  --shadow-300:         0px 8px 16px rgba(39, 39, 39, 0.08), 0px 6px 8px rgba(39, 39, 39, 0.12);
  --focus-ring-width:   2px;
  --focus-ring-offset:  2px;
  --focus-ring-color:   var(--primary);
  --font-sans:          'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 16px;
  border-radius: var(--radius-lg);
  background: var(--white);
  color: var(--text-primary);
  font-family: var(--font-sans);
  /* A transparent border at rest, so switching to Outlined does not resize the
     card. Dropping it and adding a border only on the modifier shifts layout. */
  border: 1px solid transparent;
  box-shadow: none;
  text-align: left;
  cursor: default;
}

.inspera-card--compact  { padding: 12px; }
.inspera-card--spacious { padding: 24px; }

.inspera-card--raised   { box-shadow: var(--shadow-200); }
.inspera-card--outlined { border-color: var(--border-strong); }

/* Interactive: one transparent button stretched over the whole card. The
   card stays an <article>, so its heading is still a heading - wrapping it all
   in a <button> flattened title and body into one long button name. */
.inspera-card__link {
  position: absolute;
  inset: 0;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: inherit;
  background: transparent;
  cursor: pointer;
}
.inspera-card__link:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

/* Hover and keyboard focus lift the card; pressing sinks it below its rest
   and lays the neutral --action-hover wash over the white. */
.inspera-card--interactive:hover,
.inspera-card--interactive:has(:focus-visible) { box-shadow: var(--shadow-300); }
.inspera-card--interactive:active {
  background: linear-gradient(var(--action-hover), var(--action-hover)), var(--white);
  box-shadow: var(--shadow-100);
}

/* Selectable: the link toggles aria-pressed. The right padding keeps room for
   the tick whether or not the card is selected, so selecting never reflows. */
.inspera-card--selectable { padding-right: 44px; }
.inspera-card--compact.inspera-card--selectable  { padding-right: 40px; }
.inspera-card--spacious.inspera-card--selectable { padding-right: 52px; }

/* Selected: a 2px primary edge - the border plus an outline just inside it,
   so the card keeps its size - and a tick, so colour is not the only cue. */
.inspera-card--selected {
  border-color: var(--primary);
  outline: 1px solid var(--primary);
  outline-offset: -2px;
}
.inspera-card__tick {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 20px;
  color: var(--primary);
}
.inspera-card--compact  .inspera-card__tick { top: 12px; right: 12px; }
.inspera-card--spacious .inspera-card__tick { top: 24px; right: 24px; }

.inspera-card__title {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.inspera-card__body {
  margin: 0;
  font-size: 16px;
  line-height: 1.4;
  color: var(--gray-700);
}
```

```html
<article class="inspera-card inspera-card--raised">
  <h3 class="inspera-card__title">Algebra Quiz</h3>
  <p class="inspera-card__body">24 questions, 45 minutes.</p>
</article>

<!-- Interactive: the card stays an <article>; one button stretched over it, named by the title. -->
<article class="inspera-card inspera-card--outlined inspera-card--interactive">
  <h3 class="inspera-card__title">History Midterm</h3>
  <p class="inspera-card__body">Open the assessment.</p>
  <button type="button" class="inspera-card__link" aria-label="History Midterm"></button>
</article>

<!-- Selected: a toggle. Flip aria-pressed and the --selected class together, and show the tick. -->
<article class="inspera-card inspera-card--outlined inspera-card--interactive inspera-card--selectable inspera-card--selected">
  <h3 class="inspera-card__title">Multiple choice</h3>
  <p class="inspera-card__body">One or more correct answers.</p>
  <span class="material-symbols-outlined inspera-card__tick" aria-hidden="true">check_circle</span>
  <button type="button" class="inspera-card__link" aria-label="Multiple choice" aria-pressed="true"></button>
</article>
```


### Badge

Display a short status label or count. - category: `data-display`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Badge } from '@inspera/kit'

<Badge
  label="Neutral"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | The badge text. One or two words. |
| `intent` | `'Neutral' \| 'Info' \| 'Success' \| 'Warning' \| 'Error'` | `'Neutral'` | Semantic colour. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Height 20 / 24. |
| `withIcon` | `boolean` | `false` | Show a leading status icon. |
| `icon` | `string` | - | Material Symbols name shown before the label when withIcon is set. |

Also accepts any native `<span>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<span>`. `className` and `style` go on the outermost element.

**Accessibility** - role `status`. Use aria-label for icon-only badges; Use role="status" for dynamic count badges.

**Do:** Use for status indicators and counts; Keep labels short - 1 to 2 words; Use each intent for the same meaning everywhere.
**Don't:** Do not use for long text; Do not make badges interactive - use Tag or Button.

**Choosing a variant:**
- `intent="Neutral"`: A status with no judgement, such as Draft or Archived.
- `intent="Info"`: Something upcoming or for information, such as Scheduled.
- `intent="Success"`: A good or finished state, such as Live or Graded.
- `intent="Warning"`: Needs attention soon, such as Needs grading.
- `intent="Error"`: Something has gone wrong, such as Overdue or Failed.
- `size="Medium"`: Next to a page or card title.
- `size="Small"`: Inside dense rows, such as the status column of a table.

**Deprecated aliases** (do not use): `Status Badge`, `Tag`, `Chip`

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

- Height is 24px (20px small) and the radius is a full pill - not `rounded-md`.
- Type is 12px/500 at both sizes; Small changes height and padding only.
- Neutral is `--surface-neutral` with `--gray-900` text, not a grey chip with white text.
- Every intent pairs a `*-surface` tint with the matching solid as the text colour.
- The icon is Material Symbols Outlined with `FILL 1`, at 16px (14px small).
- Static text, not a live region: `role="status"` on every badge makes a table of 50 rows announce 50 times. Announce a status change once, from where it happened.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --gray-900:         #272727;
  --blue-800:         #004080;
  --green-800:        #106542;
  --red-700:          #A50D0D;
  --orange-800:       #7E5501;
  --info-surface:     #E1F5FE;
  --success-surface:  #E8F5E9;
  --warning-surface:  #FFF3E0;
  --error-surface:    #FFEBEE;
  --info-text:        var(--blue-800);
  --success-text:     var(--green-800);
  --warning-text:     var(--orange-800);
  --error-text:       var(--red-700);
  --surface-neutral:  #F0F0F0;
  --radius-pill:      9999px;
  --font-sans:        'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-badge {
  /* Fill and text come from the intent modifier below. */
  --badge-bg: var(--surface-neutral);
  --badge-fg: var(--gray-900);

  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 24px;
  padding: 0 8px;
  border-radius: var(--radius-pill);
  background: var(--badge-bg);
  color: var(--badge-fg);
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
}

/* Small changes height and padding only - never the 12px type. */
.inspera-badge--small { height: 20px; padding: 0 6px; }

/* Neutral is written out even though it matches the base, so the class name
   stays correct if the default ever moves. */
.inspera-badge--neutral { --badge-bg: var(--surface-neutral); --badge-fg: var(--gray-900); }
.inspera-badge--info    { --badge-bg: var(--info-surface);    --badge-fg: var(--info-text); }
.inspera-badge--success { --badge-bg: var(--success-surface); --badge-fg: var(--success-text); }
.inspera-badge--warning { --badge-bg: var(--warning-surface); --badge-fg: var(--warning-text); }
.inspera-badge--error   { --badge-bg: var(--error-surface);   --badge-fg: var(--error-text); }

/* The icon is filled, not outlined, at 16px (14px in a small badge). */
.inspera-badge .material-symbols-outlined {
  font-size: 16px;
  font-variation-settings: 'FILL' 1;
}
.inspera-badge--small .material-symbols-outlined { font-size: 14px; }
```

```html
<span class="inspera-badge inspera-badge--success">Live</span>

<span class="inspera-badge inspera-badge--neutral inspera-badge--small">Draft</span>

<!-- With an icon. Material Symbols Outlined, filled - never another set. -->
<span class="inspera-badge inspera-badge--error">
  <span class="material-symbols-outlined" aria-hidden="true">error</span>
  Failed
</span>
```


### Avatar

Represent a user or entity with an image or initials. - category: `data-display`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Avatar } from '@inspera/kit'

<Avatar
  name="Jane Cooper"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` **(required)** | `string` | - | The person's name. Gives the initials and the accessible name. |
| `src` | `string` | - | Photo URL. Without one - or if it fails to load - the initials show. |
| `icon` | `string` | - | Material Symbols name shown instead of initials, e.g. for a guest. |
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Medium'` | Diameter 32 / 40 / 56. |
| `status` | `'None' \| 'Online' \| 'Offline' \| 'Busy'` | `'None'` | Presence indicator dot. Announced with the name. |

Also accepts any native `<span>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<span>`. `className` and `style` go on the outermost element.

**Accessibility** - role `img`. Provide alt text for image avatars; Use aria-label for initials and icon variants.

**Do:** Use for user profiles and participant lists; Provide meaningful alt text; Use consistent sizing within a context.
**Don't:** Do not stretch or distort avatar images; Do not use random colours - the same person always gets the same colour.

**Choosing a variant:**
- `size="Small"`: Dense rows, such as who wrote each comment in a thread.
- `size="Medium"`: Lists and request rows. The default size.
- `size="Large"`: The header of a page or panel about one person, such as a candidate's details.
- `status="Online"`: The person is available now, such as a grader you could hand a script to. Say it in words beside it.
- `status="Offline"`: The person is not connected. Say since when, such as Last seen 14:02.
- `status="Busy"`: The person is busy with something others have to wait for, such as marking the script you opened.

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

- Diameters are 32 / 40 / 56. Initials are 40% of that, the icon 55%, the status dot 28% - never a fixed size.
- The surface uses `--avatar-surface`, not a random grey, and `--radius-pill`.
- The status dot needs its 2px `--white` ring, or it disappears against a photo.
- The accessible name lives on the surface (`role="img"`); the initials themselves are decorative text.
- The wrapper is separate from the surface because the surface clips its image with `overflow: hidden`, which would cut the dot in half.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --error:           #D32F2F;
  --success:         #2E7D32;
  --white:           #ffffff;
  --gray-500:        #949494;
  --gray-600:        #7A7A7A;
  --gray-900:        #272727;
  --avatar-surface:  #E0E0E0;
  --radius-pill:     9999px;
  --font-sans:       'Inter', system-ui, -apple-system, sans-serif;
}

/* The wrapper exists so the status dot can be positioned against the
   avatar without being clipped by its overflow: hidden. */
.inspera-avatar {
  position: relative;
  display: inline-flex;
}

.inspera-avatar__surface {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-pill);
  background: var(--avatar-surface);
  color: var(--gray-900);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  font-family: var(--font-sans);
  font-weight: 500;
  /* Initials are 40% of the diameter, so they scale with the avatar. */
  font-size: 16px;
}

.inspera-avatar--small .inspera-avatar__surface  { width: 32px; height: 32px; font-size: 12.8px; }
.inspera-avatar--large .inspera-avatar__surface  { width: 56px; height: 56px; font-size: 22.4px; }

.inspera-avatar__surface img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* The icon variant is 55% of the diameter, larger than the initials. */
.inspera-avatar__surface .material-symbols-outlined {
  font-size: 22px;
  color: var(--gray-600);
}
.inspera-avatar--small .inspera-avatar__surface .material-symbols-outlined { font-size: 17.6px; }
.inspera-avatar--large .inspera-avatar__surface .material-symbols-outlined { font-size: 30.8px; }

/* The dot is 28% of the diameter, with a 2px white ring so it stays legible
   against a photo. */
.inspera-avatar__status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 11.2px;
  height: 11.2px;
  border-radius: 9999px;
  border: 2px solid var(--white);
}
.inspera-avatar--small .inspera-avatar__status { width: 8.96px; height: 8.96px; }
.inspera-avatar--large .inspera-avatar__status { width: 15.68px; height: 15.68px; }

.inspera-avatar__status--online  { background: var(--success); }
.inspera-avatar__status--offline { background: var(--gray-500); }
.inspera-avatar__status--busy    { background: var(--error); }
```

```html
<!-- Initials. The accessible name carries them, since the text is decorative. -->
<span class="inspera-avatar">
  <span class="inspera-avatar__surface" role="img" aria-label="Jane Cooper (JC)">
    <span>JC</span>
  </span>
</span>

<!-- Photo, with a status dot. -->
<span class="inspera-avatar">
  <span class="inspera-avatar__surface" role="img" aria-label="Jane Cooper">
    <img src="/avatar.jpg" alt="Jane Cooper" />
  </span>
  <span class="inspera-avatar__status inspera-avatar__status--online" aria-label="Online"></span>
</span>
```


### Table

Display structured data in rows and columns. - category: `data-display`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Table } from '@inspera/kit'

<Table
  caption="Assessments"
  columns={[
    { key: 'name', header: 'Assessment' },
    { key: 'items', header: 'Items', align: 'right' },
    { key: 'status', header: 'Status' },
  ]}
  rows={[
    {
      name: 'Algebra Quiz',
      items: 24,
      status: <Badge label="Live" intent="Success" />,
    },
    {
      name: 'History Midterm',
      items: 40,
      status: <Badge label="Draft" intent="Neutral" />,
    },
    {
      name: 'Biology Final',
      items: 60,
      status: <Badge label="Scheduled" intent="Info" />,
    },
  ]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` **(required)** | `TableColumn[]` | - | Column definitions. |
| `rows` **(required)** | `TableRow[]` | - | Row data keyed by column. |
| `getRowId` | `(row: TableRow, index: number) => string` | - | Stable id per row, for selection and keys. Defaults to the row's position. |
| `size` | `'Compact' \| 'Default'` | `'Default'` | Row height density. |
| `striped` | `boolean` | `false` | Zebra-stripe rows. |
| `hoverable` | `boolean` | `true` | Highlight rows on hover. |
| `selectable` | `boolean` | `false` | Add a selection column with a select-all box. |
| `selectedIds` | `string[]` | - | Selected row ids. Controlled - pair with onSelectionChange. |
| `defaultSelectedIds` | `string[]` | `[]` | Starting selection when uncontrolled. |
| `onSelectionChange` | `(ids: string[]) => void` | - | Fired with every selected id after any change. |
| `caption` | `string` | - | Describes the table for screen readers. Provide one unless a heading already names it. |
| `onRowClick` | `(row: TableRow, index: number) => void` | - | Makes rows clickable and keyboard-operable (Enter / Space). |

Also accepts any native `<table>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<table>`. `className` and `style` go on the outermost element.

```ts
export interface TableColumn {
  key: string
  header: string
  align?: 'left' | 'right' | 'center'
  width?: string | number
}

export type TableRow = Record<string, ReactNode>
```

**Accessibility** - role `table`, keyboard operable. Use semantic table / thead / tbody markup; Header cells use scope="col"; Provide a caption or aria-label describing the table.

**Do:** Use for comparable, structured records; Right-align numeric columns; Keep headers concise.
**Don't:** Do not use tables for page layout; Do not overload rows with unrelated actions.

**Choosing a variant:**
- `size="Default"`: Short tables people read row by row, such as the questions of a test. The default size.
- `size="Compact"`: Long rosters people scan, such as all tests in Deliver.
- `striped`: Wide rows that people read across, such as a roster with many columns.
- `selectable`: People act on several rows at once, such as messaging candidates. Show what they can do once rows are selected.
- `hoverable="false"`: Rows that open nothing, such as a summary of results. Without the hover, nothing suggests they can be clicked.

**Deprecated aliases** (do not use): `Data table`, `Grid`, `Datagrid`

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

- Use a real `<table>` with `<thead>`, `<tbody>` and `scope="col"` on every header. A grid of divs loses row and column association completely.
- Row height is 52px (40px compact) and the header sits on `--gray-100`. Cells are 14px with 16px horizontal padding.
- Right-align numeric columns only, so digits line up. Never right-align text.
- The stripe is passed as the row's resting fill (`--inspera-row-bg`) rather than a plain background, so the hover rule can still win on striped rows.
- Selection checkboxes need a per-row `aria-label` ("Select row 3") and `accent-color: var(--primary)`.
- Give the table a `<caption>` unless a heading immediately above already names it.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:           #004080;
  --white:             #ffffff;
  --gray-100:          #F7F7F7;
  --gray-200:          #EDEDED;
  --gray-700:          #595959;
  --gray-900:          #272727;
  --blue-800:          #004080;
  --green-800:         #106542;
  --red-700:           #A50D0D;
  --orange-800:        #7E5501;
  --action-hover:      rgba(0, 0, 0, 0.04);
  --text-primary:      rgba(0, 0, 0, 0.87);
  --info-surface:      #E1F5FE;
  --success-surface:   #E8F5E9;
  --warning-surface:   #FFF3E0;
  --error-surface:     #FFEBEE;
  --info-text:         var(--blue-800);
  --success-text:      var(--green-800);
  --warning-text:      var(--orange-800);
  --error-text:        var(--red-700);
  --surface-neutral:   #F0F0F0;
  --border:            var(--gray-200);
  --muted-foreground:  var(--gray-700);
  --radius-md:         8px;
  --radius-pill:       9999px;
  --duration-fast:     100ms;
  --easing-standard:   cubic-bezier(0.2, 0, 0, 1);
  --font-sans:         'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-badge {
  /* Fill and text come from the intent modifier below. */
  --badge-bg: var(--surface-neutral);
  --badge-fg: var(--gray-900);

  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 24px;
  padding: 0 8px;
  border-radius: var(--radius-pill);
  background: var(--badge-bg);
  color: var(--badge-fg);
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
}

/* Small changes height and padding only - never the 12px type. */
.inspera-badge--small { height: 20px; padding: 0 6px; }

/* Neutral is written out even though it matches the base, so the class name
   stays correct if the default ever moves. */
.inspera-badge--neutral { --badge-bg: var(--surface-neutral); --badge-fg: var(--gray-900); }
.inspera-badge--info    { --badge-bg: var(--info-surface);    --badge-fg: var(--info-text); }
.inspera-badge--success { --badge-bg: var(--success-surface); --badge-fg: var(--success-text); }
.inspera-badge--warning { --badge-bg: var(--warning-surface); --badge-fg: var(--warning-text); }
.inspera-badge--error   { --badge-bg: var(--error-surface);   --badge-fg: var(--error-text); }

/* The icon is filled, not outlined, at 16px (14px in a small badge). */
.inspera-badge .material-symbols-outlined {
  font-size: 16px;
  font-variation-settings: 'FILL' 1;
}
.inspera-badge--small .material-symbols-outlined { font-size: 14px; }

.inspera-table {
  /* separate, not collapse: browsers ignore border-radius on a collapsed table. */
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  font-family: var(--font-sans);
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.inspera-table caption {
  caption-side: top;
  text-align: left;
  padding: 0 0 8px;
  font-size: 13px;
  color: var(--muted-foreground);
}

.inspera-table th,
.inspera-table td {
  padding: 0 16px;
  font-size: 14px;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
  text-align: left;
}

.inspera-table th {
  font-weight: 600;
  color: var(--gray-700);
}

/* The table's own border closes the last row. */
.inspera-table tbody tr:last-child td { border-bottom: none; }

.inspera-table thead tr {
  background: var(--gray-100);
  height: 52px;
}

.inspera-table tbody tr {
  height: 52px;
  cursor: default;
  /* The stripe is the row's resting fill, passed as a variable. Setting it as
     a plain background would outrank the hover rule below. */
  background: var(--inspera-row-bg, var(--white));
  transition: background var(--duration-fast) var(--easing-standard);
}

.inspera-table--compact thead tr,
.inspera-table--compact tbody tr { height: 40px; }

.inspera-table--striped tbody tr:nth-child(even) { --inspera-row-bg: var(--gray-100); }

.inspera-table--hoverable tbody tr:hover { background: var(--action-hover); }

/* Numbers right-align so the digits line up; text never does. Scoped through
   the table so it outranks the "th, td" rule above, which is more specific
   than a bare class on its own. */
.inspera-table th.inspera-table__cell--right,
.inspera-table td.inspera-table__cell--right { text-align: right; }

.inspera-table th.inspera-table__select,
.inspera-table td.inspera-table__select {
  width: 44px;
  text-align: center;
}
.inspera-table__select input {
  width: 16px;
  height: 16px;
  margin: 0;
  vertical-align: middle;
  accent-color: var(--primary);
  cursor: pointer;
}
```

```html
<table class="inspera-table inspera-table--hoverable">
  <caption>Candidate results, March 2026</caption>
  <thead>
    <tr>
      <th scope="col">Assessment</th>
      <th scope="col" class="inspera-table__cell--right">Items</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Algebra Quiz</td>
      <td class="inspera-table__cell--right">24</td>
      <td><span class="inspera-badge inspera-badge--success" role="status">Live</span></td>
    </tr>
  </tbody>
</table>
```


### Data Grid

Display large datasets with sorting, selection and paging. - category: `data-display`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { DataGrid } from '@inspera/kit'

<DataGrid
  caption="Tests"
  columns={[
    { key: 'name', header: 'Test', sortable: true },
    {
      key: 'candidates',
      header: 'Candidates',
      align: 'right',
      sortable: true,
    },
    { key: 'status', header: 'Status' },
    { key: 'edited', header: 'Last edited', align: 'right', sortable: true },
  ]}
  rows={[
    {
      id: 'algebra',
      name: 'Algebra Quiz',
      candidates: 128,
      status: <Badge label="Live" intent="Success" />,
      edited: '12 Mar 2026',
    },
    {
      id: 'history',
      name: 'History Midterm',
      candidates: 96,
      status: <Badge label="Draft" intent="Neutral" />,
      edited: '11 Mar 2026',
    },
    {
      id: 'biology',
      name: 'Biology Final',
      candidates: 210,
      status: <Badge label="Scheduled" intent="Info" />,
      edited: '09 Mar 2026',
    },
  ]}
  getRowId={(row) => row.id}
  selectable
  rowActions={(row) => (
    <Menu
      iconOnly
      size="Small"
      label={`Actions for ${row.name}`}
      placement="BottomEnd"
      items={[{ label: 'Edit', icon: 'edit' }, { label: 'Duplicate', icon: 'content_copy' }, { label: '', divider: true }, { label: 'Delete', icon: 'delete', danger: true }]}
    />
  )}
  footer
  total={242}
  pageCount={13}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` **(required)** | `DataGridColumn[]` | - | Column definitions. |
| `rows` **(required)** | `DataGridRow[]` | - | Row data keyed by column. |
| `getRowId` | `(row: DataGridRow, index: number) => string` | - | Stable id per row. Defaults to the row's position in `rows` - its position as given, not as sorted, so a selection stays on the row it was made on. |
| `size` | `'Compact' \| 'Default'` | `'Default'` | Row height density. |
| `striped` | `boolean` | `false` | Zebra-stripe rows. |
| `hoverable` | `boolean` | `true` | Highlight rows on hover, and bring row actions to full strength on hover. |
| `caption` | `string` | - | Describes the grid for screen readers. |
| `selectable` | `boolean` | `false` | Add a leading selection column with a select-all header box. |
| `selectedIds` | `string[]` | - | Selected row ids. Controlled - pair with onSelectionChange. |
| `defaultSelectedIds` | `string[]` | `[]` | Starting selection when uncontrolled. |
| `onSelectionChange` | `(ids: string[]) => void` | - | Fired with every selected id after any change. |
| `sort` | `DataGridSort` | - | Active sort. Controlled - pair with onSortChange. |
| `defaultSort` | `DataGridSort` | - | Starting sort when uncontrolled. |
| `onSortChange` | `(sort: DataGridSort) => void` | - | Fired when a sortable header is activated. |
| `manualSorting` | `boolean` | `false` | Rows arrive already sorted (server-side), so the grid only shows the state. |
| `rowActions` | `(row: DataGridRow, index: number) => ReactNode` | - | Trailing per-row actions. Always visible; quieter at rest, full strength on row hover and focus when `hoverable`. Use an icon-only Small Menu named for its row: `<Menu iconOnly size="Small" label={`Actions for ${row.name}`} ... />`. |
| `onRowClick` | `(row: DataGridRow, index: number) => void` | - | Makes rows clickable and keyboard-operable (Enter / Space). |
| `footer` | `boolean` | `false` | Show the footer with the range summary, pager and page-size select. |
| `total` | `number` | - | Total row count across all pages, when `rows` is one page of a larger set fetched page by page. The range then reads from the page and page size ("21 - 40 of 179"). Defaults to the rendered row count. |
| `pageCount` | `number` | `1` | Total number of pages. |
| `page` | `number` | - | Current page (1-based). Controlled - pair with onPageChange. |
| `defaultPage` | `number` | `1` | Starting page when uncontrolled. |
| `onPageChange` | `(page: number) => void` | - | Fired with the requested page. |
| `pageSize` | `number` | - | Rows per page. Controlled - pair with onPageSizeChange. |
| `defaultPageSize` | `number` | `20` | Starting page size when uncontrolled. |
| `onPageSizeChange` | `(size: number) => void` | - | Fired with the requested page size. |
| `pageSizeOptions` | `number[]` | `[10, 20, 50, 100]` | Selectable page sizes. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

```ts
export type DataGridRow = Record<string, ReactNode>

export interface DataGridColumn {
  /** Key into each row's data object. */
  key: string
  /** Column header text. */
  header: string
  /** Cell + header alignment. */
  align?: 'left' | 'right' | 'center'
  /** Fixed column width. */
  width?: string | number
  /** Allow the column to sort. A caret appears in the header. */
  sortable?: boolean
  /**
   * Value used for sorting when the cell renders a non-primitive node (a
   * Badge, say). Without it such a column cannot sort.
   */
  sortValue?: (row: DataGridRow) => string | number
}

export interface DataGridSort {
  key: string
  direction: DataGridSortDirection
}
```

**Accessibility** - role `table`, keyboard operable. Sortable headers expose aria-sort and toggle on activation; The selection column uses labelled checkboxes with a select-all header; Built on semantic table markup with a caption or aria-label.

**Do:** Use for dense, sortable, selectable datasets; Page long lists rather than rendering everything; Right-align numeric columns.
**Don't:** Do not use for a few static rows - use Table; Do not overload every row with competing actions.

**Choosing a variant:**
- `size="Compact"`: Long lists people scan, such as every test in Deliver.
- `striped`: Many columns that people read across.
- `selectable`: People act on several rows at once, such as assigning scripts to a grader.
- `footer`: More rows than fit on one page. The footer says where people are and pages through the rest.
- `footer="false"`: A short set that fits on one page, such as the graders on one test.

**Deprecated aliases** (do not use): `Data table`, `Advanced table`, `Grid`

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

- A data grid is a Table plus four things: a leading selection column, sortable headers, per-row actions, and a footer pager. Each is a documented component - Checkbox, Menu, Pagination and Select - so reach for those rather than rebuilding them.
- Sortable headers are buttons inside the `<th>`; the `<th>` carries `aria-sort` (`ascending` / `descending` / `none`). The active column is `--primary` with a solid arrow.
- Selection keys on a stable row id, never the row position - sort the table and the selection must stay on the same rows. Select-all acts on the rows on screen and is mixed when only some are selected.
- Row actions are one Menu per row behind a Small icon-only `more_vert` trigger (32px, a Text button), not a labelled button. Each trigger needs its own name ("Actions for Ada Lovelace"): a column of identical names is indistinguishable to a screen reader. Actions are always visible, at 0.7 opacity at rest and full strength on row hover, keyboard focus and touch screens, so people can see a row has actions without hovering it.
- The footer shows "start - end of total", the pager, and a rows-per-page Select. Page long datasets rather than rendering every row. When the rows are one page of a larger set, the range comes from the page and the page size: page 4 of 20 rows is "61 - 80", and only the last page ends early.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --error:                  #D32F2F;
  --success:                #2E7D32;
  --white:                  #ffffff;
  --gray-100:               #F7F7F7;
  --gray-200:               #EDEDED;
  --gray-300:               #D9D9D9;
  --gray-600:               #7A7A7A;
  --gray-700:               #595959;
  --gray-800:               #404040;
  --gray-900:               #272727;
  --blue-100:               #F0F7FF;
  --blue-300:               #B3D9FF;
  --red-300:                #F9B8B8;
  --orange-600:             #F2A202;
  --primary-focus-ring:     rgba(0, 64, 128, 0.3);
  --action-hover:           rgba(0, 0, 0, 0.04);
  --action-disabled:        rgba(0, 0, 0, 0.38);
  --text-primary:           rgba(0, 0, 0, 0.87);
  --error-surface:          #FFEBEE;
  --border-control:         var(--gray-600);
  --border-control-strong:  var(--gray-800);
  --text-placeholder:       var(--gray-700);
  --surface-disabled:       #F5F5F5;
  --surface:                var(--white);
  --border:                 var(--gray-200);
  --border-strong:          var(--gray-300);
  --muted-foreground:       var(--gray-700);
  --control-height-sm:      32px;
  --control-height-md:      40px;
  --control-height-lg:      44px;
  --radius-xs:              2px;
  --radius-sm:              4px;
  --radius-md:              8px;
  --shadow-200:             0px 8px 8px rgba(39, 39, 39, 0.08), 0px 4px 6px rgba(39, 39, 39, 0.12);
  --effect-state-focus:     0px 0px 0px 3px var(--blue-300);
  --effect-state-error:     0px 0px 0px 3px var(--red-300);
  --effect-button-shadow:   inset 0px -1px 0px rgba(0, 0, 0, 0.2), 0px 1px 0px rgba(0, 0, 0, 0.08);
  --border-width-default:   1px;
  --focus-ring-width:       2px;
  --focus-ring-offset:      2px;
  --focus-ring-color:       var(--primary);
  --duration-fast:          100ms;
  --easing-standard:        cubic-bezier(0.2, 0, 0, 1);
  --z-dropdown:             300;
  --font-sans:              'Inter', system-ui, -apple-system, sans-serif;
  --medium-14-size:         14px;
  --medium-14-line-height:  1.4;
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

.inspera-pagination__list {
  display: flex;
  align-items: center;
  /* Wrap rather than overflow: a long pager has to degrade in a narrow column,
     not spill out of it. */
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.inspera-pagination__item {
  min-width: 40px;
  height: 40px;
  padding: 0 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease;
}

.inspera-pagination--small .inspera-pagination__item {
  min-width: 32px;
  height: 32px;
  font-size: 14px;
}

.inspera-pagination__item:hover:not(:disabled):not([aria-current='page']) {
  background: var(--action-hover);
}

.inspera-pagination__item[aria-current='page'] {
  background: var(--primary);
  color: var(--white);
}

.inspera-pagination__item:disabled {
  color: var(--action-disabled);
  cursor: not-allowed;
}

.inspera-pagination__item .material-symbols-outlined { font-size: 20px; }
.inspera-pagination--small .inspera-pagination__item .material-symbols-outlined { font-size: 18px; }

/* The gap marker is not a control: a span, hidden from assistive tech. */
.inspera-pagination__ellipsis {
  cursor: default;
  color: var(--muted-foreground);
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

.inspera-menu {
  position: relative;
  display: inline-block;
  font-family: var(--font-sans);
}

.inspera-menu__trigger {
  height: var(--control-height-md);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-strong);
  background: var(--white);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: none;
  transition: box-shadow 120ms ease;
}

.inspera-menu__trigger[aria-expanded='true'] {
  box-shadow: 0 0 0 3px var(--primary-focus-ring);
}

.inspera-menu__trigger .material-symbols-outlined {
  font-size: 20px;
  transition: transform 140ms ease;
}
.inspera-menu__trigger[aria-expanded='true'] .material-symbols-outlined { transform: rotate(180deg); }

/* Small: 32px, with 14px text and a 16px chevron, as a Small button. */
.inspera-menu__trigger--small {
  height: var(--control-height-sm);
  gap: 4px;
  padding: 0 8px;
  font-size: 14px;
}
.inspera-menu__trigger--small .material-symbols-outlined { font-size: 16px; }

/* Icon only (table rows, card headers, toolbars): the trigger is the canonical
   Text icon-only button with more_vert, and the menu sits beside it as usual. */

.inspera-menu__list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: auto;
  min-width: 180px;
  padding: 4px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-200);
  z-index: var(--z-dropdown, 20);
}

/* Bottom End aligns the panel's right edge to the trigger's, for a menu near
   the right edge of the viewport. */
.inspera-menu__list--end { left: auto; right: 0; }

.inspera-menu__item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
  text-align: left;
  cursor: pointer;
  opacity: 1;
  transition: background 120ms ease;
}

/* The highlight follows the keyboard cursor, so hover and arrow keys have to
   drive the same state. */
.inspera-menu__item--active,
.inspera-menu__item:hover:not(:disabled) { background: var(--action-hover); }

.inspera-menu__item--danger { color: var(--error); }

.inspera-menu__item:disabled {
  color: var(--action-disabled);
  cursor: not-allowed;
  opacity: 0.6;
}

.inspera-menu__item .material-symbols-outlined { font-size: 20px; }

.inspera-menu__separator {
  height: 1px;
  background: var(--border);
  margin: 4px 0;
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

.inspera-datagrid { width: 100%; font-family: var(--font-sans); }

.inspera-datagrid__table {
  width: 100%;
  /* separate, not collapse: browsers ignore border-radius on a collapsed table. */
  border-collapse: separate;
  border-spacing: 0;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.inspera-datagrid__head-row { background: var(--gray-100); }

.inspera-datagrid__th,
.inspera-datagrid__td {
  padding: 0 16px;
  height: 52px;
  font-size: 14px;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
  text-align: left;
}
.inspera-datagrid__row:last-child .inspera-datagrid__td { border-bottom: none; }
.inspera-datagrid--compact .inspera-datagrid__th,
.inspera-datagrid--compact .inspera-datagrid__td { height: 40px; }

.inspera-datagrid__th {
  font-weight: 600;
  color: var(--gray-700);
}
.inspera-datagrid__select { width: 44px; text-align: center; }
/* Width 1px shrinks the column to the trigger it holds. */
.inspera-datagrid__actions { width: 1px; text-align: right; }

/* The sortable header is a bare button carrying the arrow. */
.inspera-datagrid__sort {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  font-weight: 600;
  color: var(--gray-700);
  cursor: pointer;
}
.inspera-datagrid__sort--active { color: var(--primary); }
.inspera-datagrid__sort .material-symbols-outlined { font-size: 18px; opacity: 0.35; }
.inspera-datagrid__sort--active .material-symbols-outlined { opacity: 1; }

.inspera-datagrid__row { background: var(--white); }
.inspera-datagrid__row--striped { background: var(--gray-100); }
.inspera-datagrid__row--selected { background: var(--blue-100); }
.inspera-datagrid__row:hover { background: var(--action-hover); }

/* Row actions are always visible. They sit back at rest (0.7 keeps the icon
   above 3:1) and come to full strength on row hover or keyboard focus. */
.inspera-datagrid__actions > * { opacity: 0.7; transition: opacity var(--duration-fast) var(--easing-standard); }
.inspera-datagrid__row:hover .inspera-datagrid__actions > *,
.inspera-datagrid__row:focus-within .inspera-datagrid__actions > * { opacity: 1; }
@media (hover: none) {
  .inspera-datagrid__actions > * { opacity: 1; }
}

.inspera-datagrid__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px 4px 0;
}
.inspera-datagrid__range,
.inspera-datagrid__pagesize-label { font-size: 14px; color: var(--muted-foreground); }
.inspera-datagrid__pagesize { display: flex; align-items: center; gap: 8px; }

.inspera-datagrid__visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}
```

```html
<div class="inspera-datagrid">
  <table class="inspera-datagrid__table">
    <thead>
      <tr class="inspera-datagrid__head-row">
        <th class="inspera-datagrid__th inspera-datagrid__select" scope="col"><label class="inspera-checkbox inspera-checkbox--mixed" for="dg-all"><input class="inspera-checkbox__input" id="dg-all" type="checkbox" aria-label="Select all rows" /><span class="inspera-checkbox__box" aria-hidden="true"><span class="material-symbols-outlined">remove</span></span></label></th>
        <th class="inspera-datagrid__th" scope="col" aria-sort="ascending">
          <button type="button" class="inspera-datagrid__sort inspera-datagrid__sort--active">
            Candidate
            <span class="material-symbols-outlined" aria-hidden="true">arrow_upward</span>
          </button>
        </th>
        <th class="inspera-datagrid__th" scope="col">Status</th>
        <th class="inspera-datagrid__th inspera-datagrid__actions" scope="col"><span class="inspera-datagrid__visually-hidden">Actions</span></th>
      </tr>
    </thead>
    <tbody>
        <tr class="inspera-datagrid__row inspera-datagrid__row--selected">
          <td class="inspera-datagrid__td inspera-datagrid__select"><label class="inspera-checkbox" for="dg-row-0"><input class="inspera-checkbox__input" id="dg-row-0" type="checkbox" aria-label="Select Ada Lovelace" checked /><span class="inspera-checkbox__box" aria-hidden="true"><span class="material-symbols-outlined">check</span></span></label></td>
          <td class="inspera-datagrid__td">Ada Lovelace</td>
          <td class="inspera-datagrid__td">Submitted</td>
          <td class="inspera-datagrid__td inspera-datagrid__actions">
            <div class="inspera-menu">
              <button type="button" class="inspera-btn inspera-btn--text inspera-btn--small inspera-btn--icon-only" aria-haspopup="menu" aria-expanded="false" aria-label="Actions for Ada Lovelace">
                <span class="material-symbols-outlined" aria-hidden="true">more_vert</span>
              </button>
            </div>
          </td>
        </tr>
        <tr class="inspera-datagrid__row">
          <td class="inspera-datagrid__td inspera-datagrid__select"><label class="inspera-checkbox" for="dg-row-1"><input class="inspera-checkbox__input" id="dg-row-1" type="checkbox" aria-label="Select Grace Hopper" /><span class="inspera-checkbox__box" aria-hidden="true"></span></label></td>
          <td class="inspera-datagrid__td">Grace Hopper</td>
          <td class="inspera-datagrid__td">In progress</td>
          <td class="inspera-datagrid__td inspera-datagrid__actions">
            <div class="inspera-menu">
              <button type="button" class="inspera-btn inspera-btn--text inspera-btn--small inspera-btn--icon-only" aria-haspopup="menu" aria-expanded="false" aria-label="Actions for Grace Hopper">
                <span class="material-symbols-outlined" aria-hidden="true">more_vert</span>
              </button>
            </div>
          </td>
        </tr>
    </tbody>
  </table>
  <div class="inspera-datagrid__footer">
    <span class="inspera-datagrid__range">61 - 80 of 242</span>
    <nav class="inspera-pagination inspera-pagination--small" aria-label="Pagination">
      <ul class="inspera-pagination__list">
        <li><button type="button" class="inspera-pagination__item" aria-label="First page"><span class="material-symbols-outlined" aria-hidden="true">first_page</span></button></li>
        <li><button type="button" class="inspera-pagination__item" aria-label="Previous page"><span class="material-symbols-outlined" aria-hidden="true">chevron_left</span></button></li>
        <li><button type="button" class="inspera-pagination__item" aria-label="Page 1">1</button></li>
        <li><span class="inspera-pagination__item inspera-pagination__ellipsis" aria-hidden="true">...</span></li>
        <li><button type="button" class="inspera-pagination__item" aria-label="Page 3">3</button></li>
        <li><button type="button" class="inspera-pagination__item" aria-label="Page 4" aria-current="page">4</button></li>
        <li><button type="button" class="inspera-pagination__item" aria-label="Page 5">5</button></li>
        <li><span class="inspera-pagination__item inspera-pagination__ellipsis" aria-hidden="true">...</span></li>
        <li><button type="button" class="inspera-pagination__item" aria-label="Page 12">12</button></li>
        <li><button type="button" class="inspera-pagination__item" aria-label="Next page"><span class="material-symbols-outlined" aria-hidden="true">chevron_right</span></button></li>
        <li><button type="button" class="inspera-pagination__item" aria-label="Last page"><span class="material-symbols-outlined" aria-hidden="true">last_page</span></button></li>
      </ul>
    </nav>
    <div class="inspera-datagrid__pagesize">
      <span class="inspera-datagrid__pagesize-label" aria-hidden="true">Rows per page</span>
      <div class="inspera-select inspera-select--auto">
        <div class="inspera-select__anchor">
          <div class="inspera-select__trigger inspera-select__trigger--filled" role="combobox" tabindex="0" aria-label="Rows per page" aria-expanded="false" aria-haspopup="listbox">
            <span>20</span>
            <span class="material-symbols-outlined" aria-hidden="true">expand_more</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```


### Accordion

Show and hide sections of related content. - category: `data-display`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Accordion } from '@inspera/kit'

<Accordion
  items={[
    {
      title: 'What is Inspera?',
      content: 'A digital assessment platform for education and certification.',
    },
    {
      title: 'How are results scored?',
      content: 'Automatically for objective items, with manual grading for essays.',
    },
    {
      title: 'Is it accessible?',
      content: 'Yes - components follow WCAG 2.1 AA guidance.',
    },
  ]}
  defaultValue={[0]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` **(required)** | `AccordionItem[]` | - | Accordion sections. |
| `selection` | `'Single' \| 'Multiple'` | `'Single'` | Whether one or several sections can be open at once. |
| `value` | `number[]` | - | Open section indexes. Controlled - pair with onChange. |
| `defaultValue` | `number[]` | `[]` | Sections open at first, when uncontrolled. All closed by default. |
| `onChange` | `(open: number[]) => void` | - | Fired with the open section indexes after a toggle. |
| `iconPosition` | `'Left' \| 'Right'` | `'Right'` | Chevron placement. |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` | `3` | Heading level wrapping each trigger, to fit the page outline. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

```ts
export interface AccordionItem {
  /** Stable key. Defaults to the title. */
  id?: string
  title: string
  content: ReactNode
}
```

**Accessibility** - role `region`, keyboard operable. Header is a button with aria-expanded and aria-controls; Panel uses role="region" linked via aria-labelledby; Enter / Space toggle the section.

**Do:** Use to reveal detail only when people ask for it; Keep section titles scannable; Use Single mode when only one section is relevant at a time.
**Don't:** Do not nest accordions deeply; Do not hide critical content behind collapsed sections.

**Choosing a variant:**
- `selection="Single"`: Reference people look up one part at a time, such as what to do when a candidate loses connection.
- `selection="Multiple"`: People work across several sections at once, such as the groups of a test's settings.
- `iconPosition="Right"`: Most accordions. The title leads and the chevron sits at the end of the row.
- `iconPosition="Left"`: Lists that read like a tree, such as the sections of a question set, so the chevrons line up the levels.

**Deprecated aliases** (do not use): `Disclosure`, `Collapse`, `Expander`

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

- Each header is a `<button>` inside an `<h3>`. The heading gives the section its place in the document outline; the button makes it operable.
- `aria-expanded` on the trigger and `aria-controls` pointing at the panel, with the panel as `role="region"` labelled back by the trigger id. All four, or the pattern does not work.
- Collapse with the `hidden` attribute so the panel leaves both the tab order and the accessibility tree.
- The chevron rotates 180deg driven off `[aria-expanded="true"]`, so the attribute and the arrow cannot disagree.
- Icon-left reverses the flex row rather than reordering the markup, so the title is still read first.
- Single mode closes the open panel when another opens; multiple leaves them independent. Neither changes the markup.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --white:             #ffffff;
  --gray-200:          #EDEDED;
  --gray-700:          #595959;
  --text-primary:      rgba(0, 0, 0, 0.87);
  --border:            var(--gray-200);
  --muted-foreground:  var(--gray-700);
  --radius-md:         8px;
  --font-sans:         'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-accordion {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  font-family: var(--font-sans);
  background: var(--white);
}

/* Rules between items, not around them - the wrapper already has a border. */
.inspera-accordion__item + .inspera-accordion__item {
  border-top: 1px solid var(--border);
}

.inspera-accordion__heading { margin: 0; }

.inspera-accordion__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 14px 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  font: inherit;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

/* Icon on the left: reverse the row rather than reordering the markup, so the
   reading order still starts with the title. */
.inspera-accordion--icon-left .inspera-accordion__trigger { flex-direction: row-reverse; }

.inspera-accordion__title { flex: 1; text-align: left; }

.inspera-accordion__chevron {
  font-size: 24px;
  color: var(--muted-foreground);
  transition: transform 160ms ease;
  transform: rotate(0deg);
}

.inspera-accordion__trigger[aria-expanded='true'] .inspera-accordion__chevron {
  transform: rotate(180deg);
}

.inspera-accordion__panel {
  padding: 0 16px 16px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--gray-700);
}

/* Collapsed panels use the "hidden" attribute, so they leave the tab order and
   the accessibility tree. display:none via a class does the first but is
   easier to get wrong. */
.inspera-accordion__panel[hidden] { padding: 0 16px; }
```

```html
<div class="inspera-accordion">
  <div class="inspera-accordion__item">
    <h3 class="inspera-accordion__heading">
      <button type="button" class="inspera-accordion__trigger"
              id="acc-h1" aria-expanded="true" aria-controls="acc-p1">
        <span class="inspera-accordion__title">How is my exam graded?</span>
        <span class="material-symbols-outlined inspera-accordion__chevron" aria-hidden="true">expand_more</span>
      </button>
    </h3>
    <div class="inspera-accordion__panel" id="acc-p1" role="region" aria-labelledby="acc-h1">
      Responses are marked against the rubric configured for each question.
    </div>
  </div>
  <div class="inspera-accordion__item">
    <h3 class="inspera-accordion__heading">
      <button type="button" class="inspera-accordion__trigger"
              id="acc-h2" aria-expanded="false" aria-controls="acc-p2">
        <span class="inspera-accordion__title">Can I review my answers?</span>
        <span class="material-symbols-outlined inspera-accordion__chevron" aria-hidden="true">expand_more</span>
      </button>
    </h3>
    <div class="inspera-accordion__panel" id="acc-p2" role="region" aria-labelledby="acc-h2" hidden>
      You can revisit any answered question before submitting.
    </div>
  </div>
</div>
```


### Tag

Label, categorise or filter with a removable chip. - category: `data-display`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Tag } from '@inspera/kit'

<Tag
  label="Neutral"
  leadingIcon="label"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Tag text. |
| `intent` | `'Neutral' \| 'Info' \| 'Success' \| 'Warning' \| 'Error'` | `'Neutral'` | Semantic colour. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Tag height. |
| `removable` | `boolean` | `false` | Show a remove button. Pair with onRemove. |
| `leadingIcon` | `string` | - | Optional leading icon. |
| `onRemove` | `() => void` | - | Fired when the remove button is activated. |
| `onClick` | `MouseEventHandler<HTMLButtonElement>` | - | Makes the tag text itself a button. |

Also accepts any native `<span>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<span>`. `className` and `style` go on the outermost element.

**Accessibility** - role `status`, keyboard operable. Removable tags expose a button with aria-label "Remove {label}"; Interactive tags must be keyboard focusable; Use aria-label for icon-only tags.

**Do:** Use for filters, categories, and selections; Keep labels to 1-2 words; Provide a remove control when tags are dismissible.
**Don't:** Do not use for status that never changes - use Badge; Do not pack long text into a tag.

**Choosing a variant:**
- `intent="Neutral"`: Labels with no judgement, such as a question's topic.
- `intent="Info"`: A label that adds context people should notice, such as Calculator allowed.
- `intent="Success"`: A label that confirms something, such as Reviewed on a question.
- `intent="Warning"`: A label that asks for a second look, such as Needs review.
- `intent="Error"`: A label for a problem with the item, such as No answer key.
- `size="Small"`: Dense rows, such as the labels on each question in a list.
- `removable`: Filters in use and values people chose, which they can take off again. A filter tag keeps the intent of the label it filters by.

**Deprecated aliases** (do not use): `Chip`, `Pill`, `Label`

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

- Identical geometry to Badge: 24px tall (20px small), full pill radius, 12px/500 type.
- The remove control is a `<button>` with `aria-label="Remove <label>"` - never a bare icon span, and never just "close".
- The leading icon is filled (`FILL 1`); the close icon is not.
- A tag with no `onClick` is a `<span>` and takes `cursor: default`. Only a clickable tag becomes a `<button>`.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --gray-900:         #272727;
  --blue-800:         #004080;
  --green-800:        #106542;
  --red-700:          #A50D0D;
  --orange-800:       #7E5501;
  --info-surface:     #E1F5FE;
  --success-surface:  #E8F5E9;
  --warning-surface:  #FFF3E0;
  --error-surface:    #FFEBEE;
  --info-text:        var(--blue-800);
  --success-text:     var(--green-800);
  --warning-text:     var(--orange-800);
  --error-text:       var(--red-700);
  --surface-neutral:  #F0F0F0;
  --radius-pill:      9999px;
  --font-sans:        'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-tag {
  --tag-bg: var(--surface-neutral);
  --tag-fg: var(--gray-900);

  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 24px;
  padding: 0 8px;
  border: none;
  border-radius: var(--radius-pill);
  background: var(--tag-bg);
  color: var(--tag-fg);
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  cursor: default;
}

.inspera-tag--small { height: 20px; padding: 0 6px; }

/* Neutral is written out even though it matches the base, so the class name
   stays correct if the default ever moves. */
.inspera-tag--neutral { --tag-bg: var(--surface-neutral); --tag-fg: var(--gray-900); }
.inspera-tag--info    { --tag-bg: var(--info-surface);    --tag-fg: var(--info-text); }
.inspera-tag--success { --tag-bg: var(--success-surface); --tag-fg: var(--success-text); }
.inspera-tag--warning { --tag-bg: var(--warning-surface); --tag-fg: var(--warning-text); }
.inspera-tag--error   { --tag-bg: var(--error-surface);   --tag-fg: var(--error-text); }

.inspera-tag .material-symbols-outlined {
  font-size: 16px;
  font-variation-settings: 'FILL' 1;
}
.inspera-tag--small .material-symbols-outlined { font-size: 14px; }

/* The remove control. Square, inherits the tag's colour, and keeps its own
   accessible name - "Remove <label>", not a bare "close". */
.inspera-tag__remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font: inherit;
  width: 18px;
  height: 18px;
  margin-left: 2px;
  margin-right: -2px;
  padding: 0;
  border: none;
  border-radius: var(--radius-pill);
  background: transparent;
  color: inherit;
  cursor: pointer;
}
.inspera-tag--small .inspera-tag__remove { width: 16px; height: 16px; }

.inspera-tag__remove .material-symbols-outlined {
  font-variation-settings: 'FILL' 0;
}
```

```html
<span class="inspera-tag inspera-tag--neutral">Mathematics</span>

<!-- With a leading icon and a remove control. -->
<span class="inspera-tag inspera-tag--info">
  <span class="material-symbols-outlined" aria-hidden="true">label</span>
  Algebra
  <button type="button" class="inspera-tag__remove" aria-label="Remove Algebra">
    <span class="material-symbols-outlined" aria-hidden="true">close</span>
  </button>
</span>
```


### Divider

Separate content with a thin rule. - category: `data-display`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Divider } from '@inspera/kit'

<Divider />
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'Horizontal' \| 'Vertical'` | `'Horizontal'` | Divider direction. A vertical divider needs a flex row around it. |
| `label` | `string` | - | Optional centred label (horizontal only). |
| `spacing` | `'Compact' \| 'Default' \| 'Spacious'` | `'Default'` | Surrounding margin, 8 / 16 / 24px on each side. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

**Accessibility** - role `separator`. Use role="separator" with aria-orientation; Purely decorative dividers may be aria-hidden.

**Do:** Use to group and separate related content; Use a labelled divider to introduce a section; Keep dividers hairline-thin.
**Don't:** Do not overuse dividers where whitespace suffices; Do not use heavy rules.

**Choosing a variant:**
- `orientation="Horizontal"`: Between groups stacked in a panel. Labelled or, it separates two ways to do the same thing, such as adding candidates.
- `orientation="Vertical"`: Between groups of controls in a row, such as the tool groups of an editor toolbar.
- `spacing="Compact"`: Dense panels, such as between the groups of a question's settings.
- `spacing="Spacious"`: Between the major sections of a long form.

**Deprecated aliases** (do not use): `Separator`, `Rule`, `HR`

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

- The rule is 1px of `--border` as a background, not a border. A bare `<hr>` keeps the browser default and renders as a grey groove.
- Spacing is margin on the divider itself: 16px default, 8px compact, 24px spacious - on the block axis horizontally, the inline axis vertically.
- A labelled divider is a flex row of rule / label / rule, with the label at 13px `--muted-foreground`. It is not text laid over a line.
- Always carry `role="separator"` and `aria-orientation`; a labelled one also needs `aria-label`.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --gray-200:          #EDEDED;
  --gray-700:          #595959;
  --border:            var(--gray-200);
  --muted-foreground:  var(--gray-700);
  --font-sans:         'Inter', system-ui, -apple-system, sans-serif;
}

/* Horizontal, unlabelled. The border reset matters: a bare <hr> keeps the
   browser's inset border and renders as a two-tone groove. */
.inspera-divider {
  border: none;
  height: 1px;
  width: 100%;
  background: var(--border);
  margin: 16px 0;
}

.inspera-divider--compact  { margin: 8px 0; }
.inspera-divider--spacious { margin: 24px 0; }

/* Vertical: a 1px column that stretches to its flex parent. */
.inspera-divider--vertical {
  display: inline-block;
  width: 1px;
  height: auto;
  align-self: stretch;
  min-height: 1em;
  background: var(--border);
  margin: 0 16px;
}
.inspera-divider--vertical.inspera-divider--compact  { margin: 0 8px; }
.inspera-divider--vertical.inspera-divider--spacious { margin: 0 24px; }

/* Labelled: a flex row whose rules grow to fill either side of the text. */
.inspera-divider--labelled {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: auto;
  background: none;
  margin: 16px 0;
  font-family: var(--font-sans);
}
.inspera-divider--labelled.inspera-divider--compact  { margin: 8px 0; }
.inspera-divider--labelled.inspera-divider--spacious { margin: 24px 0; }

.inspera-divider__rule {
  flex: 1;
  height: 1px;
  background: var(--border);
}

.inspera-divider__label {
  font-size: 13px;
  color: var(--muted-foreground);
  white-space: nowrap;
}
```

```html
<hr class="inspera-divider" role="separator" aria-orientation="horizontal" />

<!-- Vertical, inside a flex row. -->
<span class="inspera-divider inspera-divider--vertical" role="separator" aria-orientation="vertical"></span>

<!-- Labelled: the label names the separator for assistive tech too. -->
<div class="inspera-divider inspera-divider--labelled" role="separator" aria-orientation="horizontal" aria-label="OR">
  <span class="inspera-divider__rule"></span>
  <span class="inspera-divider__label">OR</span>
  <span class="inspera-divider__rule"></span>
</div>
```


### Empty State

Communicate the absence of content and offer a next step. - category: `data-display`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { EmptyState } from '@inspera/kit'

<EmptyState
  title="No assessments yet"
  description="Create your first assessment to get started."
  actionLabel="New assessment"
  onAction={createAssessment}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` **(required)** | `string` | - | Primary message, e.g. "No assessments yet". |
| `description` | `string` | - | Supporting explanation: why it is empty, or what to do next. |
| `icon` | `string` | `'inbox'` | Material Symbols icon name. |
| `actionLabel` | `string` | - | Optional action label. |
| `onAction` | `() => void` | - | Fired when the action is activated. Only rendered when actionLabel is set. |
| `actionIntent` | `'Primary' \| 'Secondary'` | `'Primary'` | The action's emphasis. Primary when it is the main thing to do on the page; Secondary inside a panel, or beside a page that already has its own main action, so the view keeps one Primary. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Overall scale. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

**Accessibility** - role `status`, keyboard operable. Announce an empty state that appears after load with role="status"; The action must be a real focusable button; The illustration or icon is decorative (aria-hidden).

**Do:** Explain why the area is empty; Offer a clear next action when possible; Keep the tone helpful.
**Don't:** Do not leave empty areas blank with no guidance; Do not use for transient loading - use Skeleton.

**Choosing a variant:**
- `size="Medium"`: A page or a whole table with nothing in it yet, such as a first visit to Question sets.
- `size="Small"`: A card or panel with nothing in it, such as no candidates needing help.
- `actionIntent="Primary"`: The action is the main thing to do on the page, such as creating the first question set. The default.
- `actionIntent="Secondary"`: Inside a panel, or beside a page that already has its main action, so the view keeps one Primary.

**Deprecated aliases** (do not use): `Blank slate`, `Zero state`, `No data`

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

- The icon sits in an 80px circle of `--gray-100` (56px when small). Without the circle it reads as a broken image.
- Title 18px/500, body 14px `--muted-foreground` capped at 320px so it wraps to two short lines rather than one long one.
- The action is the ordinary Button component, not a bespoke link: `inspera-btn--primary` when it is the main thing to do on the page, `inspera-btn--secondary` inside a panel or beside a page that already has its main action, so the view keeps one Primary.
- Not a live region: an empty state is page content, and `role="status"` around it (action included) announces it every time it renders. When a filter empties a list, announce the result count from the filter, in a separate polite live region.

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
  --text-primary:           rgba(0, 0, 0, 0.87);
  --muted-foreground:       var(--gray-700);
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

.inspera-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  padding: 32px;
  font-family: var(--font-sans);
  color: var(--text-primary);
}

.inspera-empty--small { padding: 16px; }

/* The icon lives inside a filled circle, not on its own. */
.inspera-empty__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 9999px;
  background: var(--gray-100);
  margin-bottom: 4px;
}
.inspera-empty--small .inspera-empty__icon { width: 56px; height: 56px; }

.inspera-empty__icon .material-symbols-outlined {
  font-size: 40px;
  color: var(--muted-foreground);
}
.inspera-empty--small .inspera-empty__icon .material-symbols-outlined { font-size: 28px; }

.inspera-empty__title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}
.inspera-empty--small .inspera-empty__title { font-size: 16px; }

.inspera-empty__body {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  color: var(--muted-foreground);
  max-width: 320px;
}

/* The action is a normal Button, spaced away from the copy. */
.inspera-empty__action { margin-top: 8px; }
```

```html
<div class="inspera-empty">
  <span class="inspera-empty__icon">
    <span class="material-symbols-outlined" aria-hidden="true">inbox</span>
  </span>
  <h3 class="inspera-empty__title">No assessments yet</h3>
  <p class="inspera-empty__body">Create your first assessment to get started.</p>
  <div class="inspera-empty__action">
    <button type="button" class="inspera-btn inspera-btn--primary">New assessment</button>
  </div>
</div>
```


### Avatar Group

Show a set of users as overlapping avatars with an overflow count. - category: `data-display`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { AvatarGroup } from '@inspera/kit'

<AvatarGroup
  avatars={[
    { name: 'Ada Lovelace' },
    { name: 'Linus Torvalds' },
    { name: 'Grace Hopper' },
    { name: 'Alan Turing' },
    { name: 'Katherine Johnson' },
    { name: 'Edsger Dijkstra' },
  ]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `avatars` **(required)** | `AvatarGroupItem[]` | - | People to show, in order. |
| `max` | `number` | `4` | How many to show before collapsing the rest into "+N". |
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Medium'` | Avatar diameter. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

```ts
export interface AvatarGroupItem {
  /** The person's name: initials and accessible name. */
  name: string
  /** Photo URL. */
  src?: string
  /** Material Symbols name shown instead of initials. */
  icon?: string
}
```

**Accessibility** - role `group`. Wrap in a group with an aria-label describing the set; Each avatar keeps its own accessible label; The overflow chip states the hidden count.

**Do:** Use for participant and collaborator lists; Cap visible avatars and show a +N overflow; Keep sizing consistent within a context.
**Don't:** Do not show dozens of avatars inline; Do not omit the overflow count.

**Choosing a variant:**
- `size="Small"`: Dense rows, such as the graders on each test in a table.
- `size="Medium"`: Cards and headers, such as the graders on a test's overview. The default size.
- `size="Large"`: The header of a page about one team, such as a marking committee.

**Deprecated aliases** (do not use): `Avatar stack`, `Facepile`

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

- Overlap is about 20% of the diameter as a negative left margin - 6 / 8 / 12px for small / medium / large - and the first item has none. With the 2px ring, each avatar stops short of the initials it overlaps; more overlap hides their second letter.
- The separating ring is a `box-shadow`, not a border: a border would grow each avatar and break the spacing.
- The overflow chip is `+N` on `--gray-200` at 34% of the diameter, sized identically to an avatar.
- The group carries `role="group"` and a count in its label; the chip carries "N more". Overlapping avatars are meaningless to a screen reader without both.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --error:           #D32F2F;
  --success:         #2E7D32;
  --white:           #ffffff;
  --gray-200:        #EDEDED;
  --gray-500:        #949494;
  --gray-600:        #7A7A7A;
  --gray-700:        #595959;
  --gray-900:        #272727;
  --avatar-surface:  #E0E0E0;
  --radius-pill:     9999px;
  --font-sans:       'Inter', system-ui, -apple-system, sans-serif;
}

/* The wrapper exists so the status dot can be positioned against the
   avatar without being clipped by its overflow: hidden. */
.inspera-avatar {
  position: relative;
  display: inline-flex;
}

.inspera-avatar__surface {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-pill);
  background: var(--avatar-surface);
  color: var(--gray-900);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  font-family: var(--font-sans);
  font-weight: 500;
  /* Initials are 40% of the diameter, so they scale with the avatar. */
  font-size: 16px;
}

.inspera-avatar--small .inspera-avatar__surface  { width: 32px; height: 32px; font-size: 12.8px; }
.inspera-avatar--large .inspera-avatar__surface  { width: 56px; height: 56px; font-size: 22.4px; }

.inspera-avatar__surface img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* The icon variant is 55% of the diameter, larger than the initials. */
.inspera-avatar__surface .material-symbols-outlined {
  font-size: 22px;
  color: var(--gray-600);
}
.inspera-avatar--small .inspera-avatar__surface .material-symbols-outlined { font-size: 17.6px; }
.inspera-avatar--large .inspera-avatar__surface .material-symbols-outlined { font-size: 30.8px; }

/* The dot is 28% of the diameter, with a 2px white ring so it stays legible
   against a photo. */
.inspera-avatar__status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 11.2px;
  height: 11.2px;
  border-radius: 9999px;
  border: 2px solid var(--white);
}
.inspera-avatar--small .inspera-avatar__status { width: 8.96px; height: 8.96px; }
.inspera-avatar--large .inspera-avatar__status { width: 15.68px; height: 15.68px; }

.inspera-avatar__status--online  { background: var(--success); }
.inspera-avatar__status--offline { background: var(--gray-500); }
.inspera-avatar__status--busy    { background: var(--error); }

.inspera-avatar-group {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-sans);
}

/* Each avatar sits in a ring and pulls left over the one before it. The ring
   is a box-shadow, not a border, so it does not change the avatar's size. */
.inspera-avatar-group__item {
  display: inline-flex;
  border-radius: 9999px;
  box-shadow: 0 0 0 2px var(--white);
  margin-left: -8px;
}
.inspera-avatar-group--small .inspera-avatar-group__item { margin-left: -6px; }
.inspera-avatar-group--large .inspera-avatar-group__item { margin-left: -12px; }

/* Last, so it outranks the size modifiers above: nothing overlaps the first. */
.inspera-avatar-group__item:first-child { margin-left: 0; }

/* The overflow chip is the same circle, filled and labelled +N. */
.inspera-avatar-group__more {
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--gray-200);
  color: var(--gray-700);
  font-size: 13.6px;
  font-weight: 500;
}
.inspera-avatar-group--small .inspera-avatar-group__more { width: 32px; height: 32px; font-size: 10.88px; }
.inspera-avatar-group--large .inspera-avatar-group__more { width: 56px; height: 56px; font-size: 19.04px; }
```

```html
<div class="inspera-avatar-group" role="group" aria-label="6 participants">
  <span class="inspera-avatar-group__item">
    <span class="inspera-avatar">
      <span class="inspera-avatar__surface" role="img" aria-label="Ada Lovelace (AL)"><span>AL</span></span>
    </span>
  </span>
  <span class="inspera-avatar-group__item">
    <span class="inspera-avatar">
      <span class="inspera-avatar__surface" role="img" aria-label="Grace Hopper (GH)"><span>GH</span></span>
    </span>
  </span>
  <span class="inspera-avatar-group__item inspera-avatar-group__more" aria-label="4 more">+4</span>
</div>
```


### Stat

Highlight a key metric with an optional trend. - category: `data-display`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Stat } from '@inspera/kit'

<Stat
  label="Active candidates"
  value="12,480"
  delta="+8.2% vs last week"
  deltaIntent="Up"
  icon="group"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Metric name. |
| `value` **(required)** | `string \| number` | - | Metric value. |
| `delta` | `string` | - | Change indicator text, e.g. "+8.2% vs last week". Omit when there is no comparison. |
| `deltaIntent` | `'Up' \| 'Down' \| 'Neutral'` | `'Neutral'` | Trend direction: sets the arrow, the colour and what is announced. |
| `icon` | `string` | - | Optional leading icon. |
| `helpText` | `string` | - | Optional context below the value, such as the comparison period. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

**Accessibility** - role `group`. Associate the value with its label for screen readers; Convey the trend with text, not colour alone; Use aria-label to summarise the metric and change.

**Do:** Use for dashboard summaries; Pair a value with a clear label; Indicate trend direction with an icon and text.
**Don't:** Do not rely on colour alone for the change; Do not crowd many stats together without spacing.

**Choosing a variant:**
- `deltaIntent="Up"`: The figure rose and that is good, such as a higher pass rate than last sitting. The arrow is green.
- `deltaIntent="Down"`: The figure fell and that needs attention, such as fewer submissions on time. The arrow is red.
- `deltaIntent="Neutral"`: No real change, or a change that is neither good nor bad. Still say it in words, such as Same as last sitting.

**Deprecated aliases** (do not use): `Metric`, `KPI`, `Stat card`

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

- The label is 12px/600 uppercase with 0.04em tracking in `--muted-foreground` - not body text.
- The value is 28px/600 at line-height 1.1. It is the only large type in the tile.
- The tile uses `--radius-lg` and a 1px `--border`, with no shadow.
- Trend colour is `--success` up, `--error` down, `--muted-foreground` flat, and always ships with the matching arrow so the direction is not colour-only.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --error:             #D32F2F;
  --success:           #2E7D32;
  --white:             #ffffff;
  --gray-200:          #EDEDED;
  --gray-700:          #595959;
  --text-primary:      rgba(0, 0, 0, 0.87);
  --border:            var(--gray-200);
  --muted-foreground:  var(--gray-700);
  --radius-lg:         12px;
  --font-sans:         'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-stat {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 200px;
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--white);
  font-family: var(--font-sans);
  color: var(--text-primary);
}

/* Label row: the metric name, with an optional icon pushed to the far end. */
.inspera-stat__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.inspera-stat__label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--muted-foreground);
}

.inspera-stat__head .material-symbols-outlined {
  font-size: 20px;
  color: var(--muted-foreground);
}

.inspera-stat__value {
  font-size: 28px;
  font-weight: 600;
  line-height: 1.1;
}

/* The delta carries the trend colour; the arrow is not decorative repetition,
   it is the direction for anyone who cannot rely on the colour alone. */
.inspera-stat__delta {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
}
.inspera-stat__delta .material-symbols-outlined { font-size: 18px; }

/* The arrow and colour carry direction for sighted users; this says it aloud. */
.inspera-stat__trend {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

.inspera-stat__delta--up      { color: var(--success); }
.inspera-stat__delta--down    { color: var(--error); }
.inspera-stat__delta--neutral { color: var(--muted-foreground); }
```

```html
<div class="inspera-stat">
  <div class="inspera-stat__head">
    <span class="inspera-stat__label">Active candidates</span>
    <span class="material-symbols-outlined" aria-hidden="true">group</span>
  </div>
  <span class="inspera-stat__value">12,480</span>
  <span class="inspera-stat__delta inspera-stat__delta--up">
    <span class="material-symbols-outlined" aria-hidden="true">trending_up</span>
    +8.2% vs last week
  </span>
</div>
```


### List

Present a vertical series of related items. - category: `data-display`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { List } from '@inspera/kit'

<List
  items={[
    {
      primary: 'General settings',
      secondary: 'Language, timezone, theme',
      leadingIcon: 'settings',
      trailingIcon: 'chevron_right',
    },
    {
      primary: 'Notifications',
      secondary: 'Email and push preferences',
      leadingIcon: 'notifications',
      trailingIcon: 'chevron_right',
    },
    {
      primary: 'Security',
      secondary: 'Password and two-factor auth',
      leadingIcon: 'lock',
      trailingIcon: 'chevron_right',
    },
  ]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` **(required)** | `ListItem[]` | - | List rows. |
| `divided` | `boolean` | `true` | Show dividers between rows. |
| `interactive` | `boolean` | `false` | Make rows clickable. |
| `size` | `'Compact' \| 'Default'` | `'Default'` | Row density. |
| `onItemClick` | `(item: ListItem, index: number) => void` | - | Fired with the item and its index. Set interactive as well. |

Also accepts any native `<ul>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<ul>`. `className` and `style` go on the outermost element.

```ts
export interface ListItem {
  /** Stable key. Defaults to the row position. */
  id?: string
  primary: string
  secondary?: string
  /** Material Symbols name shown before the text. */
  leadingIcon?: string
  /** Material Symbols name shown after the text, e.g. `chevron_right`. */
  trailingIcon?: string
  /** Any element before the text - an Avatar, a Checkbox. */
  leading?: ReactNode
  /** Any element after the text - a Badge, a count. Strings render as text. */
  trailing?: ReactNode
}
```

**Accessibility** - role `list`, keyboard operable. Use semantic list markup (ul / li); Interactive rows are buttons and keyboard focusable; Provide meaningful text for each item.

**Do:** Use for settings, results, and simple records; Keep primary text scannable; Use secondary text for supporting detail.
**Don't:** Do not use for comparable tabular data - use Table; Do not make only part of a row clickable.

**Choosing a variant:**
- `size="Default"`: Lists people read item by item, such as the activity on a test. The default size.
- `size="Compact"`: Dense side panels, such as the candidates who need help in Monitor.
- `interactive`: Each row opens something, such as a page of settings. The whole row is the target.
- `divided="false"`: Short lists that read as one group, where whitespace separates the rows.

**Deprecated aliases** (do not use): `List view`, `Item list`

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

- Set the four border longhands, never the `border` shorthand. A shorthand on the row wipes the bottom border that draws the divider - the exact bug this component shipped with.
- Interactive rows are `<button>` inside the `<li>`, so focus and Enter/Space work without a keydown handler.
- Row padding is 12px (8px compact) vertical, 16px horizontal; primary text 14px/500, secondary 13px `--muted-foreground`.
- The divider is on every row but the last, drawn by `li:not(:last-child)` rather than by counting in script.
- Leading and trailing icons are 20px (18px compact) and always `aria-hidden` - the row's text is the label.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:           #004080;
  --white:             #ffffff;
  --gray-200:          #EDEDED;
  --gray-700:          #595959;
  --action-hover:      rgba(0, 0, 0, 0.04);
  --text-primary:      rgba(0, 0, 0, 0.87);
  --border:            var(--gray-200);
  --muted-foreground:  var(--gray-700);
  --radius-sm:         4px;
  --radius-md:         8px;
  --focus-ring-width:  2px;
  --focus-ring-color:  var(--primary);
  --duration-fast:     100ms;
  --easing-standard:   cubic-bezier(0.2, 0, 0, 1);
  --font-sans:         'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-list {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  font-family: var(--font-sans);
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.inspera-list__row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  /* Longhands, not the "border" shorthand: a shorthand here wipes the divider
     that the row below sets on its bottom edge. */
  border-top: none;
  border-right: none;
  border-left: none;
  border-bottom: none;
  font: inherit;
  cursor: default;
  background: transparent;
}

.inspera-list--compact .inspera-list__row { padding: 8px 16px; }

.inspera-list--divided li:not(:last-child) > .inspera-list__row {
  border-bottom: 1px solid var(--border);
}

/* Interactive rows are real buttons, so they focus and activate for free. */
.inspera-list__row--interactive {
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background var(--duration-fast) var(--easing-standard);
}
.inspera-list__row--interactive:hover { background: var(--action-hover); }
.inspera-list__row--interactive:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: -2px;
}

.inspera-list__slot {
  display: inline-flex;
  flex-shrink: 0;
}

.inspera-list__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
  text-align: left;
}

.inspera-list__primary {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.inspera-list__secondary {
  font-size: 13px;
  color: var(--muted-foreground);
}
```

```html
<ul class="inspera-list inspera-list--divided" role="list">
  <li>
    <div class="inspera-list__row">
      <span class="inspera-list__slot">
        <span class="material-symbols-outlined" aria-hidden="true">settings</span>
      </span>
      <span class="inspera-list__text">
        <span class="inspera-list__primary">General settings</span>
        <span class="inspera-list__secondary">Language, timezone, theme</span>
      </span>
    </div>
  </li>
</ul>

<!-- Interactive rows are <button>, not a div with onclick. -->
<ul class="inspera-list inspera-list--divided" role="list">
  <li>
    <button type="button" class="inspera-list__row inspera-list__row--interactive">
      <span class="inspera-list__text">
        <span class="inspera-list__primary">Notifications</span>
      </span>
      <span class="inspera-list__slot">
        <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
      </span>
    </button>
  </li>
</ul>
```


## feedback

### Alert

Display semantic inline feedback. - category: `feedback`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Alert } from '@inspera/kit'

<Alert
  title="Grading in progress"
  message="Results will be released once every essay is marked."
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `message` **(required)** | `string` | - | Supporting detail. Keep it to one or two sentences. |
| `title` | `string` | - | Short headline stating what happened. Optional. |
| `intent` | `'Info' \| 'Success' \| 'Warning' \| 'Error'` | `'Info'` | Severity and colour. Warning and Error interrupt screen readers; Info and Success wait. |
| `background` | `boolean` | `true` | Tinted fill; false draws a left accent bar on a clear background. |
| `actionLabel` | `string` | - | Label for an inline action link, e.g. "View details". Shown when set. |
| `onAction` | `() => void` | - | Fired when the inline action is activated. |
| `dismissible` | `boolean` | `false` | Show a close button. Pair with onClose. |
| `onClose` | `() => void` | - | Fired when the close button is activated. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

**Accessibility** - role `alert`, keyboard operable. Error and Warning announce as role="alert"; Info and Success as a polite role="status" - never both on one element, since role="alert" already implies assertive; Close button must have aria-label="Close alert".

**Do:** Use for messages about the content around them; Match the intent to how serious the message is; Keep alert text concise.
**Don't:** Do not stack more than 2 alerts in the same area; Do not use alerts for permanent content.

**Choosing a variant:**
- `intent="Info"`: Context people need before they act, such as grading still being in progress.
- `intent="Success"`: Confirms an outcome that stays relevant on the page, such as a published test. For a passing confirmation, use Snackbar.
- `intent="Warning"`: A problem that does not block progress but needs attention, such as candidates who have not started.
- `intent="Error"`: Something blocks the whole form or section. Say what to fix; field errors still go on the fields.

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

- Each intent pairs the `*-surface` tint as background with the solid colour as both border and icon.
- The live region follows severity: Error and Warning use `role="alert"`, Info and Success use `role="status"` with `aria-live="polite"`. Never put `role="alert"` and `aria-live="polite"` on the same element - alert already implies assertive.
- The icon is filled (`FILL 1`) at 20px, nudged 1px down so it sits on the title baseline.
- Without the tint, the accent becomes a 4px left border and the other three sides stay 1px.
- The close button needs `aria-label="Close alert"` - an unlabelled x announces as nothing.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --error:            #D32F2F;
  --warning:          #EF6C00;
  --info:             #0288D1;
  --success:          #2E7D32;
  --gray-700:         #595959;
  --blue-800:         #004080;
  --green-800:        #106542;
  --red-700:          #A50D0D;
  --orange-800:       #7E5501;
  --action-active:    rgba(0, 0, 0, 0.56);
  --text-primary:     rgba(0, 0, 0, 0.87);
  --info-surface:     #E1F5FE;
  --success-surface:  #E8F5E9;
  --warning-surface:  #FFF3E0;
  --error-surface:    #FFEBEE;
  --info-text:        var(--blue-800);
  --success-text:     var(--green-800);
  --warning-text:     var(--orange-800);
  --error-text:       var(--red-700);
  --radius-md:        8px;
  --font-sans:        'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-alert {
  --alert-bg: var(--info-surface);
  --alert-border: var(--info);
  /* Icon and action: the solid colours miss 4.5:1 on their own tints. */
  --alert-fg: var(--info-text);

  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  max-width: 100%;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  background: var(--alert-bg);
  border: 1px solid var(--alert-border);
  color: var(--text-primary);
  font-family: var(--font-sans);
}

.inspera-alert--info    { --alert-bg: var(--info-surface);    --alert-border: var(--info);    --alert-fg: var(--info-text); }
.inspera-alert--success { --alert-bg: var(--success-surface); --alert-border: var(--success); --alert-fg: var(--success-text); }
.inspera-alert--warning { --alert-bg: var(--warning-surface); --alert-border: var(--warning); --alert-fg: var(--warning-text); }
.inspera-alert--error   { --alert-bg: var(--error-surface);   --alert-border: var(--error);   --alert-fg: var(--error-text); }

/* No tint: the accent moves to a 4px left edge instead. */
.inspera-alert--plain {
  background: transparent;
  border-left-width: 4px;
}

.inspera-alert__icon {
  flex-shrink: 0;
  margin-top: 1px;
  font-size: 20px;
  color: var(--alert-fg);
  font-variation-settings: 'FILL' 1;
}

.inspera-alert__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.inspera-alert__title {
  font-size: 16px;
  font-weight: 500;
}

.inspera-alert__message {
  font-size: 16px;
  line-height: 1.4;
  color: var(--gray-700);
}

.inspera-alert__cta {
  align-self: flex-start;
  margin-top: 8px;
  padding: 0;
  border: none;
  background: none;
  color: var(--alert-fg);
  font-weight: 600;
  font-size: 14px;
  text-decoration: underline;
  cursor: pointer;
}

.inspera-alert__close {
  padding: 0;
  border: none;
  background: none;
  color: var(--action-active);
  display: inline-flex;
  cursor: pointer;
}
.inspera-alert__close .material-symbols-outlined { font-size: 20px; }
```

```html
<!-- Error and Warning are urgent: role="alert" (already assertive). -->
<div class="inspera-alert inspera-alert--error" role="alert">
  <span class="material-symbols-outlined inspera-alert__icon" aria-hidden="true">error</span>
  <div class="inspera-alert__content">
    <span class="inspera-alert__title">Upload failed</span>
    <span class="inspera-alert__message">The file exceeds the 10MB limit.</span>
  </div>
</div>

<!-- Info and Success are not: a polite status region instead. Never both. -->
<div class="inspera-alert inspera-alert--success" role="status" aria-live="polite">
  <span class="material-symbols-outlined inspera-alert__icon" aria-hidden="true">check_circle</span>
  <div class="inspera-alert__content">
    <span class="inspera-alert__title">Saved</span>
    <span class="inspera-alert__message">Your changes are published.</span>
  </div>
  <button type="button" class="inspera-alert__close" aria-label="Close alert">
    <span class="material-symbols-outlined" aria-hidden="true">close</span>
  </button>
</div>
```


### Dialog

Present content or actions that require user attention. - category: `feedback`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Dialog } from '@inspera/kit'

<Dialog
  open={open}
  title="Publish assessment?"
  confirmLabel="Publish"
  onClose={() => setOpen(false)}
  onConfirm={handlePublish}
>
  Candidates will be able to start it at the scheduled time.
</Dialog>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` **(required)** | `boolean` | - | Whether the dialog is shown. Controlled - pair with onClose. |
| `title` **(required)** | `string` | - | Dialog heading. Also the accessible name. |
| `children` | `ReactNode` | - | Dialog content. |
| `size` | `'Medium' \| 'Large'` | `'Medium'` | Panel width 480 / 640. Medium for a question or confirmation, Large for a summary or short form to check first. |
| `hasCloseButton` | `boolean` | `true` | Show the header close button. |
| `hasActions` | `boolean` | `true` | Show the footer action buttons. |
| `confirmLabel` | `string` | `'Continue'` | Label for the confirming action. Name the action - "Delete", not "OK". |
| `confirmIntent` | `'Primary' \| 'Destructive'` | `'Primary'` | The confirming button's intent. Destructive when the action deletes something or cannot be undone. |
| `cancelLabel` | `string` | `'Cancel'` | Label for the dismissing action. |
| `footerStart` | `ReactNode` | - | Short text at the start of the footer, before the actions - what confirming will do, such as "2 filters set". Not for a second action. |
| `onClose` | `() => void` | - | Fired on the close button, Cancel, the scrim, and Escape. |
| `onConfirm` | `() => void` | - | Fired when the confirming action is activated. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

**Accessibility** - role `dialog`, keyboard operable. Use role="dialog" with aria-modal="true"; Set aria-labelledby to the dialog title; Trap focus inside the dialog when open; Return focus to trigger element on close; Escape key closes the dialog.

**Do:** Use for confirmations and critical decisions; Always provide a way to close the dialog; Keep dialog content focused and concise; Set confirmIntent="Destructive" when confirming deletes something or cannot be undone, and name the action: "Delete assessment"; Use footerStart for a short status of what confirming will do, such as "2 filters set".
**Don't:** Do not open dialogs from other dialogs; Do not put a second action in footerStart - it is for text only; Do not use for non-blocking information - use Alert instead.

**Choosing a variant:**
- `size="Medium"`: A question or a confirmation, such as releasing results or pausing a test. The default.
- `size="Large"`: A confirmation with a summary or a short form to check first, such as the settings before publishing.
- `confirmIntent="Primary"`: Confirming moves something forward, such as releasing results. Name the action on the button.
- `confirmIntent="Destructive"`: Confirming deletes something or can't be undone, such as deleting a test. Name the object and say what will be lost.
- `hasActions="false"`: The dialog only shows information, such as keyboard shortcuts. The close button is the way out.

**Deprecated aliases** (do not use): `Modal`, `Popup`

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

- Widths are exactly 480 (Medium) and 640 (Large) with `max-width: 100%`, `--radius-lg` and `--shadow-500`.
- Wrap the panel in the scrim: `--scrim`, fixed, full-viewport, at `--z-modal`. Without it the page behind stays clickable and this is a floating card, not a modal.
- The footer actions are the canonical Button - `inspera-btn--text` to cancel, `inspera-btn--primary` to confirm, or `inspera-btn--destructive` when confirming deletes something or cannot be undone (`confirmIntent="Destructive"`). Do not style dialog buttons separately.
- A short status can lead the footer (`footerStart`, `inspera-dialog__footer-start`): what confirming will do, such as "2 filters set". It is text, never a second action - extra actions belong in the body.
- `role="dialog"` with `aria-modal="true"` and `aria-labelledby` pointing at the title id. Generate a unique id - a hardcoded one collides the moment two dialogs exist on a page.
- Behaviour the markup cannot express, and that you must add: move focus into the panel on open, trap Tab inside it, return focus to the trigger on close, close on Escape and on a scrim click, and lock body scroll while open.
- The title uses the `--h2-*` type tokens (22.78px/500) - an exact export from Figma, not a rounded 24.
- Name the confirming action for what it does ("Delete"), never "OK".

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --error:                  #D32F2F;
  --success:                #2E7D32;
  --white:                  #ffffff;
  --gray-100:               #F7F7F7;
  --gray-200:               #EDEDED;
  --gray-700:               #595959;
  --gray-900:               #272727;
  --orange-600:             #F2A202;
  --text-primary:           rgba(0, 0, 0, 0.87);
  --text-secondary:         var(--gray-700);
  --border:                 var(--gray-200);
  --scrim:                  rgba(39, 39, 39, 0.48);
  --control-height-sm:      32px;
  --control-height-md:      40px;
  --control-height-lg:      44px;
  --radius-sm:              4px;
  --radius-lg:              12px;
  --radius-pill:            9999px;
  --shadow-500:             0px 10px 32px rgba(39, 39, 39, 0.1), 0px 6px 14px rgba(39, 39, 39, 0.12);
  --effect-button-shadow:   inset 0px -1px 0px rgba(0, 0, 0, 0.2), 0px 1px 0px rgba(0, 0, 0, 0.08);
  --border-width-default:   1px;
  --focus-ring-width:       2px;
  --focus-ring-offset:      2px;
  --focus-ring-color:       var(--primary);
  --duration-fast:          100ms;
  --easing-standard:        cubic-bezier(0.2, 0, 0, 1);
  --z-modal:                600;
  --font-sans:              'Inter', system-ui, -apple-system, sans-serif;
  --medium-14-size:         14px;
  --medium-14-line-height:  1.4;
  --h2-size:                22.78px;
  --h2-weight:              500;
  --h2-line-height:         1.12;
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

/* The scrim. Fixed, full-viewport, and it closes the dialog when clicked. */
.inspera-dialog-overlay {
  position: fixed;
  inset: 0;
  background: var(--scrim);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: var(--z-modal);
}

.inspera-dialog {
  width: 480px;
  max-width: 100%;
  /* A long dialog scrolls its body; header and actions stay put. */
  max-height: calc(100vh - 32px);
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  background: var(--white);
  color: var(--text-primary);
  box-shadow: var(--shadow-500);
  font-family: var(--font-sans);
}

.inspera-dialog--large { width: 640px; }

.inspera-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 24px;
  border-bottom: 1px solid var(--border);
  min-height: 64px;
  flex-shrink: 0;
}

.inspera-dialog__title {
  margin: 0;
  font-size: var(--h2-size);
  font-weight: var(--h2-weight);
  line-height: var(--h2-line-height);
  color: var(--gray-900);
  letter-spacing: -0.2px;
}

.inspera-dialog__close {
  flex-shrink: 0;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--gray-900);
  display: inline-flex;
  border-radius: var(--radius-pill);
  line-height: 0;
}
.inspera-dialog__close .material-symbols-outlined { font-size: 24px; }
.inspera-dialog__close:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.inspera-dialog__body {
  padding: 32px;
  font-size: 16px;
  line-height: 20px;
  color: var(--gray-900);
  overflow-y: auto;
}

/* The actions are the canonical Button - Text for cancel, Primary to confirm -
   so a dialog's buttons match every other button in the product. */
.inspera-dialog__footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid var(--border);
  flex-wrap: wrap;
  flex-shrink: 0;
}

/* Optional status before the actions. The auto margin keeps the actions at
   the end, wherever the row wraps. */
.inspera-dialog__footer-start {
  margin-right: auto;
  font-size: 14px;
  line-height: 1.4;
  color: var(--text-secondary);
}
```

```html
<!-- The scrim is required. Without it the page behind stays clickable and
     the "modal" is a floating card. -->
<div class="inspera-dialog-overlay">
  <div class="inspera-dialog" role="dialog" aria-modal="true"
       aria-labelledby="dlg-title" tabindex="-1">
    <div class="inspera-dialog__header">
      <h2 class="inspera-dialog__title" id="dlg-title">Delete assessment?</h2>
      <button type="button" class="inspera-dialog__close" aria-label="Close dialog">
        <span class="material-symbols-outlined" aria-hidden="true">close</span>
      </button>
    </div>
    <div class="inspera-dialog__body">This cannot be undone.</div>
    <div class="inspera-dialog__footer">
      <button type="button" class="inspera-btn inspera-btn--text">Cancel</button>
      <button type="button" class="inspera-btn inspera-btn--destructive">Delete</button>
    </div>
  </div>
</div>
```


### Snackbar

Show brief, non-blocking feedback at the bottom of the screen. - category: `feedback`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Snackbar } from '@inspera/kit'

<Snackbar
  message="Assessment saved."
  dismissible
  onClose={handleClose}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `message` **(required)** | `string` | - | What happened. One short sentence. |
| `intent` | `'Neutral' \| 'Info' \| 'Success' \| 'Warning' \| 'Error'` | `'Neutral'` | Accent icon colour. |
| `actionLabel` | `string` | - | Label for an inline action, typically "Undo". Shown when set. |
| `onAction` | `() => void` | - | Fired when the inline action is activated. |
| `dismissible` | `boolean` | `false` | Show a close button. Pair with onClose. |
| `onClose` | `() => void` | - | Fired when the close button is activated. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

**Accessibility** - role `status`, keyboard operable. Use role="status" with aria-live="polite"; Action button must be focusable; Auto-dismiss timing must be generous (5s minimum).

**Do:** Use for brief confirmation messages; Include an undo action when appropriate; Limit to one snackbar at a time.
**Don't:** Do not use for critical errors - use Alert or Dialog instead; Do not stack multiple snackbars.

**Choosing a variant:**
- `intent="Neutral"`: A routine change just happened, such as Draft saved. The default.
- `intent="Info"`: Something people may want to know now, such as a newer version being available.
- `intent="Success"`: A task just finished, such as moving a question. Offer Undo when it can be undone.
- `intent="Warning"`: Something is not quite right, but work can go on, such as being offline while changes are kept.
- `intent="Error"`: An action failed and can be tried again, such as Couldn't save. Put Try again on it.

**Deprecated aliases** (do not use): `Toast`, `Notification bar`

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

- The bar is always `--gray-900` with white text. The intent tints the icon and the action label only - a green snackbar is wrong.
- Fixed 48px height, `--radius-md`, `--shadow-300`, and asymmetric padding (16px leading, 8px trailing) because the close button carries its own.
- Accents are the 400 shade of each family, which reads on the dark bar; the 600 shades do not.
- Always `role="status"` with `aria-live="polite"` - a snackbar must never interrupt, which is also why nothing the user has to act on later belongs here.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --white:       #ffffff;
  --gray-900:    #272727;
  --blue-400:    #7ABDFF;
  --green-400:   #8DECC5;
  --red-400:     #F58484;
  --orange-400:  #FED27C;
  --radius-md:   8px;
  --shadow-300:  0px 8px 16px rgba(39, 39, 39, 0.08), 0px 6px 8px rgba(39, 39, 39, 0.12);
  --font-sans:   'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-snackbar {
  /* The accent tints the icon and the action, not the bar. */
  --snackbar-accent: var(--white);

  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: min(300px, 100%);
  max-width: 480px;
  min-height: 48px;
  padding: 8px 8px 8px 16px;
  border-radius: var(--radius-md);
  background: var(--gray-900);
  color: var(--white);
  box-shadow: var(--shadow-300);
  font-family: var(--font-sans);
}

.inspera-snackbar--neutral { --snackbar-accent: var(--white); }
.inspera-snackbar--info    { --snackbar-accent: var(--blue-400); }
.inspera-snackbar--success { --snackbar-accent: var(--green-400); }
.inspera-snackbar--warning { --snackbar-accent: var(--orange-400); }
.inspera-snackbar--error   { --snackbar-accent: var(--red-400); }

.inspera-snackbar__icon {
  flex-shrink: 0;
  font-size: 20px;
  color: var(--snackbar-accent);
  font-variation-settings: 'FILL' 1;
}

.inspera-snackbar__message {
  flex: 1;
  font-size: 16px;
}

.inspera-snackbar__action {
  padding: 0 8px;
  border: none;
  background: none;
  color: var(--snackbar-accent);
  font-weight: 600;
  font-size: 16px;
  white-space: nowrap;
  cursor: pointer;
}

.inspera-snackbar__close {
  padding: 4px;
  border: none;
  background: none;
  color: color-mix(in srgb, var(--white) 70%, transparent);
  display: inline-flex;
  cursor: pointer;
}
.inspera-snackbar__close .material-symbols-outlined { font-size: 20px; }
```

```html
<div class="inspera-snackbar inspera-snackbar--success" role="status" aria-live="polite">
  <span class="material-symbols-outlined inspera-snackbar__icon" aria-hidden="true">check_circle</span>
  <span class="inspera-snackbar__message">Assessment saved.</span>
  <button type="button" class="inspera-snackbar__action">Undo</button>
  <button type="button" class="inspera-snackbar__close" aria-label="Dismiss">
    <span class="material-symbols-outlined" aria-hidden="true">close</span>
  </button>
</div>
```


### Toast

Show brief notifications by calling toast() from anywhere in the app. - category: `feedback`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { ToastProvider } from '@inspera/kit'

// Mount once near your app root:
<ToastProvider />

// Then call from anywhere:
toast('Assessment saved.', {
  intent: 'Success',
})
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `position` | `'TopLeft' \| 'TopCenter' \| 'TopRight' \| 'BottomLeft' \| 'BottomCenter' \| 'BottomRight'` | `'BottomRight'` | Where the stack anchors on screen. |
| `max` | `number` | `4` | Most toasts on screen at once. Past it, the oldest is dismissed. |

**Accessibility** - role `region`, keyboard operable. The stack is a role="region" labelled "Notifications" with aria-live; Each toast is announced when it appears; Action and dismiss buttons are focusable.

**Do:** Mount ToastProvider once near the app root; Call toast() for brief, dismissible feedback; Keep errors on screen longer, or until dismissed.
**Don't:** Do not use for blocking confirmation - use Dialog; Do not stack more toasts than the screen can show.

**Choosing a variant:**
- `position="BottomRight"`: Most screens. Away from the page title and its main action. The default.
- `position="BottomLeft"`: Screens with a panel on the right, such as the question settings in Author.
- `position="TopCenter"`: Screens with a bar fixed to the bottom, such as the step footer of New test.
- `position="BottomCenter"`: Touch screens and narrow windows, such as Monitor on an iPad.

**Deprecated aliases** (do not use): `Notification`, `Flash message`, `Snackbar stack`

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

- A toast is a Snackbar: `--gray-900` bar, white text, the intent tinting only the icon and the action. See the Snackbar recipe for the bar itself.
- Mount one `ToastProvider` near the app root; it owns the fixed stack. Call `toast(message, { intent, actionLabel, onAction })` from anywhere - the point is firing them imperatively, not rendering them in place.
- `position` (BottomRight, BottomCenter, TopRight, TopCenter, and the Left variants) sets where the stack anchors; new toasts push on and old ones auto-dismiss on a timer, so give errors a longer or manual timeout.
- Each toast is announced through the stack `role="region"` labelled "Notifications"; the bar itself stays `role="status"` / `aria-live="polite"` so it never interrupts.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --white:       #ffffff;
  --gray-900:    #272727;
  --blue-400:    #7ABDFF;
  --green-400:   #8DECC5;
  --red-400:     #F58484;
  --orange-400:  #FED27C;
  --radius-md:   8px;
  --shadow-300:  0px 8px 16px rgba(39, 39, 39, 0.08), 0px 6px 8px rgba(39, 39, 39, 0.12);
  --font-sans:   'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-snackbar {
  /* The accent tints the icon and the action, not the bar. */
  --snackbar-accent: var(--white);

  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: min(300px, 100%);
  max-width: 480px;
  min-height: 48px;
  padding: 8px 8px 8px 16px;
  border-radius: var(--radius-md);
  background: var(--gray-900);
  color: var(--white);
  box-shadow: var(--shadow-300);
  font-family: var(--font-sans);
}

.inspera-snackbar--neutral { --snackbar-accent: var(--white); }
.inspera-snackbar--info    { --snackbar-accent: var(--blue-400); }
.inspera-snackbar--success { --snackbar-accent: var(--green-400); }
.inspera-snackbar--warning { --snackbar-accent: var(--orange-400); }
.inspera-snackbar--error   { --snackbar-accent: var(--red-400); }

.inspera-snackbar__icon {
  flex-shrink: 0;
  font-size: 20px;
  color: var(--snackbar-accent);
  font-variation-settings: 'FILL' 1;
}

.inspera-snackbar__message {
  flex: 1;
  font-size: 16px;
}

.inspera-snackbar__action {
  padding: 0 8px;
  border: none;
  background: none;
  color: var(--snackbar-accent);
  font-weight: 600;
  font-size: 16px;
  white-space: nowrap;
  cursor: pointer;
}

.inspera-snackbar__close {
  padding: 4px;
  border: none;
  background: none;
  color: color-mix(in srgb, var(--white) 70%, transparent);
  display: inline-flex;
  cursor: pointer;
}
.inspera-snackbar__close .material-symbols-outlined { font-size: 20px; }


```

```html
<!-- A toast is a Snackbar the provider mounts into a fixed stack. -->
<div class="inspera-snackbar inspera-snackbar--success" role="status" aria-live="polite">
  <span class="material-symbols-outlined inspera-snackbar__icon" aria-hidden="true">check_circle</span>
  <span class="inspera-snackbar__message">Assessment saved.</span>
  <button type="button" class="inspera-snackbar__action">Undo</button>
  <button type="button" class="inspera-snackbar__close" aria-label="Dismiss">
    <span class="material-symbols-outlined" aria-hidden="true">close</span>
  </button>
</div>
```


### Command Palette

Search and run commands from a keyboard-driven overlay. - category: `feedback`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { CommandPalette } from '@inspera/kit'

<CommandPalette
  open={open}
  onOpenChange={setOpen}
  commands={[
    { id: 'new-test', label: 'Create new test', icon: 'add_circle', group: 'Actions', onSelect: createTest },
    { id: 'go-monitor', label: 'Go to Monitor', icon: 'monitor_heart', group: 'Navigate', onSelect: () => navigate('/monitor') },
  ]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `commands` **(required)** | `Command[]` | - | The commands to search. |
| `open` | `boolean` | - | Open state. Controlled - pair with onOpenChange. |
| `defaultOpen` | `boolean` | `false` | Open initially, when uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | - | Fired when the open state should change. |
| `onSelect` | `(command: Command) => void` | - | Fired with the chosen command. |
| `hotkey` | `boolean` | `true` | Bind Cmd/Ctrl+K to toggle the palette. Mount one palette with this per page. Ignored while focus is in a textarea or rich-text editor, which often use the same shortcut. |
| `placeholder` | `string` | `'Type a command or search...'` | Search field placeholder. |
| `emptyText` | `string` | `'No matching commands'` | Shown when nothing matches. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

```ts
export interface Command {
  /** Stable id. */
  id: string
  /** Primary label shown in the list. */
  label: string
  /** Optional Material Symbols icon. */
  icon?: string
  /** Optional grouping heading. Commands with the same group should be adjacent. */
  group?: string
  /** Right-aligned hint, e.g. a shortcut or section name. */
  hint?: string
  /** Extra words to match against beyond the label. */
  keywords?: string
  /** Fired when the command is chosen. */
  onSelect?: () => void
}
```

**Accessibility** - role `dialog`, keyboard operable. Panel is a role="dialog" with aria-modal; The list uses role="listbox" and items role="option"; Cmd/Ctrl+K toggles it; Up / Down / Enter navigate and run.

**Do:** Group commands by section; Bind a discoverable hotkey (Cmd/Ctrl+K); Filter commands as the user types.
**Don't:** Do not make it the only way to reach main navigation; Do not leave focus inside it after it closes.

**Choosing a variant:**
- `hotkey`: Ctrl or Cmd K opens it from anywhere, for people who move around the product a lot. Show the shortcut where it can be opened.
- `hotkey="false"`: Ctrl or Cmd K already does something on the page, such as inserting a link in the question editor. Open the palette from a button instead.

**Deprecated aliases** (do not use): `Command menu`, `Quick actions`, `Spotlight`

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

- On the page the panel sits inside a fixed, dimmed overlay (`position: fixed; inset: 0`) centred horizontally and pushed down ~12vh. `embedded` renders just the panel for documentation.
- The panel is `--radius-lg` on `--white` with `--shadow-300`; the 52px search row is divided from the list by a `--border` rule.
- Commands group under uppercase 12px headings. Each group is a `role="group"` inside the listbox, labelled by its heading; the options keep one keyboard index across groups.
- The active option is filled `--blue-100` and starts on the first row. Up / Down move it, Enter runs it, Escape closes; Cmd/Ctrl+K toggles the whole palette.
- It is a `role="dialog"` with `aria-modal`; the input is `role="combobox"` over a `role="listbox"`, with `aria-activedescendant` on the active option. Trap Tab inside while open, and return focus to the trigger when it closes.
- Cmd/Ctrl+K toggles it - but not while focus is in a textarea or rich-text editor, which use that shortcut themselves.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --white:             #ffffff;
  --gray-200:          #EDEDED;
  --gray-700:          #595959;
  --blue-100:          #F0F7FF;
  --action-active:     rgba(0, 0, 0, 0.56);
  --text-primary:      rgba(0, 0, 0, 0.87);
  --text-placeholder:  var(--gray-700);
  --border:            var(--gray-200);
  --muted-foreground:  var(--gray-700);
  --radius-xs:         2px;
  --radius-sm:         4px;
  --radius-lg:         12px;
  --shadow-300:        0px 8px 16px rgba(39, 39, 39, 0.08), 0px 6px 8px rgba(39, 39, 39, 0.12);
  --font-sans:         'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-cmdk {
  width: min(560px, calc(100vw - 32px));
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-300);
  overflow: hidden;
  font-family: var(--font-sans);
}

.inspera-cmdk__search {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 52px;
  padding: 0 16px;
  border-bottom: 1px solid var(--border);
}

.inspera-cmdk__search-icon { font-size: 22px; color: var(--muted-foreground); }

.inspera-cmdk__input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-sans);
  font-size: 18px;
  color: var(--text-primary);
}
.inspera-cmdk__input::placeholder { color: var(--text-placeholder); opacity: 1; }

.inspera-cmdk__kbd {
  font-size: 12px;
  color: var(--muted-foreground);
  border: 1px solid var(--border);
  border-radius: var(--radius-xs);
  padding: 2px 6px;
}

.inspera-cmdk__list {
  list-style: none;
  margin: 0;
  padding: 8px;
  max-height: 360px;
  overflow-y: auto;
}

.inspera-cmdk__group {
  padding: 10px 16px 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--muted-foreground);
}

.inspera-cmdk__option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  background: transparent;
  color: var(--text-primary);
  font-size: 16px;
}
.inspera-cmdk__option[aria-selected='true'] { background: var(--blue-100); }

.inspera-cmdk__option-icon { font-size: 22px; color: var(--action-active); }
.inspera-cmdk__option-label { flex: 1; }
.inspera-cmdk__option-hint { font-size: 13px; color: var(--muted-foreground); }
```

```html
<!-- The panel lives inside a fixed, dimmed overlay centred near the top. -->
<div class="inspera-cmdk" role="dialog" aria-modal="true" aria-label="Command palette">
  <div class="inspera-cmdk__search">
    <span class="material-symbols-outlined inspera-cmdk__search-icon" aria-hidden="true">search</span>
    <input class="inspera-cmdk__input" role="combobox" aria-expanded="true"
           aria-label="Search commands" aria-controls="cmdk-list" aria-autocomplete="list"
           aria-activedescendant="cmdk-opt-0" placeholder="Type a command or search..." />
    <kbd class="inspera-cmdk__kbd">Esc</kbd>
  </div>
  <!-- Groups are real role="group"s inside the listbox, each named by its
       heading; options carry ids so the input can point at the active one. -->
  <div class="inspera-cmdk__list" id="cmdk-list" role="listbox" aria-label="Commands">
    <div role="group" aria-labelledby="cmdk-g0">
      <div class="inspera-cmdk__group" id="cmdk-g0" role="presentation">Actions</div>
      <div class="inspera-cmdk__option" id="cmdk-opt-0" role="option" aria-selected="true">
        <span class="material-symbols-outlined inspera-cmdk__option-icon" aria-hidden="true">add_circle</span>
        <span class="inspera-cmdk__option-label">Create new test</span>
        <span class="inspera-cmdk__option-hint">C then T</span>
      </div>
    </div>
    <div role="group" aria-labelledby="cmdk-g1">
      <div class="inspera-cmdk__group" id="cmdk-g1" role="presentation">Navigate</div>
      <div class="inspera-cmdk__option" id="cmdk-opt-1" role="option" aria-selected="false">
        <span class="material-symbols-outlined inspera-cmdk__option-icon" aria-hidden="true">send</span>
        <span class="inspera-cmdk__option-label">Go to Deliver</span>
      </div>
    </div>
  </div>
</div>
```


### Tooltip

Provide contextual help on hover or focus. - category: `feedback`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Tooltip } from '@inspera/kit'

<Tooltip
  content="Get help with this page"
>
  <Button label="Help" intent="Outline" leadingIcon="help" iconOnly />
</Tooltip>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `content` **(required)** | `string` | - | The hint text. Keep it short; never put essential information here alone. |
| `children` **(required)** | `ReactElement` | - | The element the tooltip describes: one focusable element, e.g. an icon-only Button. It receives `aria-describedby` pointing at the tooltip. |
| `placement` | `'Top' \| 'Bottom' \| 'Left' \| 'Right'` | `'Top'` | Preferred side. It flips when there is no room. |
| `theme` | `'Light' \| 'Dark'` | `'Dark'` | Surface colour. |
| `variant` | `'Default' \| 'Accessibility'` | `'Default'` | Accessibility uses larger text and more padding. |

Also accepts any native `<span>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<span>`. `className` and `style` go on the outermost element.

**Accessibility** - role `tooltip`, keyboard operable. Use role="tooltip" on the tooltip element; Link trigger and tooltip with aria-describedby; Escape key dismisses the tooltip; Tooltip must not contain interactive content.

**Do:** Use for supplementary information; Keep tooltip text short and scannable; Place it so it is not cut off at the edge of the screen.
**Don't:** Do not put critical information only in tooltips; Do not use for interactive content - use Popover instead.

**Choosing a variant:**
- `placement="Top"`: Most tooltips, above the control, such as icon buttons in a toolbar. The default.
- `placement="Bottom"`: Controls near the top of the screen, such as icon buttons in the page header.
- `placement="Right"`: Controls on the left of the screen, such as a flag at the end of a row in a narrow list.
- `placement="Left"`: Controls at the right edge, such as the last icon on a table row.
- `theme="Light"`: Dark surfaces, such as the navy tool rail of the question set editor, where a dark bubble would disappear.
- `variant="Accessibility"`: A longer explanation, such as what a statistical term means, in larger text that is easier to read.

**Deprecated aliases** (do not use): `Tooltips`, `Walkthrough`, `a11y tooltips`

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

- The trigger points at the bubble with `aria-describedby`, and the bubble is `role="tooltip"`. A custom trigger needs that attribute too - the tooltip is not announced without it.
- Show on `:hover` **and** `:focus-within`. A hint only a mouse can reach is unreachable for anyone navigating by keyboard.
- The bubble takes `pointer-events: none` so it can never sit between the pointer and what it describes.
- Dark is `--gray-900` with white text and no border; Light is white with a 1px `--border-strong`, and the arrow has to pick up that border on its two trigger-facing edges.
- Default type is 12px; the accessibility type is 14px with more padding, for hints that carry real instruction.
- Escape must dismiss it (WCAG 1.4.13), and nothing essential may live only here - a tooltip is supplementary by definition.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --error:                  #D32F2F;
  --success:                #2E7D32;
  --white:                  #ffffff;
  --gray-100:               #F7F7F7;
  --gray-300:               #D9D9D9;
  --gray-700:               #595959;
  --gray-900:               #272727;
  --orange-600:             #F2A202;
  --text-primary:           rgba(0, 0, 0, 0.87);
  --border-strong:          var(--gray-300);
  --control-height-sm:      32px;
  --control-height-md:      40px;
  --control-height-lg:      44px;
  --radius-sm:              4px;
  --shadow-100:             0px 4px 4px rgba(39, 39, 39, 0.08), 0px 2px 4px rgba(39, 39, 39, 0.12);
  --effect-button-shadow:   inset 0px -1px 0px rgba(0, 0, 0, 0.2), 0px 1px 0px rgba(0, 0, 0, 0.08);
  --border-width-default:   1px;
  --focus-ring-width:       2px;
  --focus-ring-offset:      2px;
  --focus-ring-color:       var(--primary);
  --duration-fast:          100ms;
  --easing-standard:        cubic-bezier(0.2, 0, 0, 1);
  --z-tooltip:              800;
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

.inspera-tooltip {
  position: relative;
  display: inline-flex;
}

.inspera-tooltip__bubble {
  position: absolute;
  max-width: 240px;
  width: max-content;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  background: var(--gray-900);
  color: var(--white);
  border: none;
  font-family: var(--font-sans);
  font-size: 12px;
  line-height: 1.4;
  box-shadow: var(--shadow-100);
  z-index: var(--z-tooltip, 30);
  /* Never a pointer target: hovering the hint must not keep it open, and it
     must never sit between the pointer and the thing it describes. */
  pointer-events: none;
  opacity: 0;
  transition: opacity 140ms ease;
}

/* Shown on hover and on keyboard focus. Focus is not optional - a hint only
   available to a mouse is unreachable for half the people who need it. */
.inspera-tooltip:hover .inspera-tooltip__bubble,
.inspera-tooltip:focus-within .inspera-tooltip__bubble { opacity: 1; }

/* The accessibility type is larger, for hints that carry real instruction. */
.inspera-tooltip__bubble--accessibility { padding: 10px 12px; font-size: 14px; }

.inspera-tooltip__bubble--light {
  background: var(--white);
  color: var(--text-primary);
  border: 1px solid var(--border-strong);
}

.inspera-tooltip__bubble--top    { bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); }
.inspera-tooltip__bubble--bottom { top: calc(100% + 8px); left: 50%; transform: translateX(-50%); }
.inspera-tooltip__bubble--left   { right: calc(100% + 8px); top: 50%; transform: translateY(-50%); }
.inspera-tooltip__bubble--right  { left: calc(100% + 8px); top: 50%; transform: translateY(-50%); }

.inspera-tooltip__arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--gray-900);
  transform: rotate(45deg);
  z-index: 31;
}

.inspera-tooltip__bubble--light .inspera-tooltip__arrow { background: var(--white); }

.inspera-tooltip__bubble--top .inspera-tooltip__arrow {
  bottom: -4px; left: 50%; margin-left: -4px;
  border-right: 1px solid transparent; border-bottom: 1px solid transparent;
}
.inspera-tooltip__bubble--bottom .inspera-tooltip__arrow {
  top: -4px; left: 50%; margin-left: -4px;
  border-left: 1px solid transparent; border-top: 1px solid transparent;
}
.inspera-tooltip__bubble--left .inspera-tooltip__arrow {
  right: -4px; top: 50%; margin-top: -4px;
  border-right: 1px solid transparent; border-top: 1px solid transparent;
}
.inspera-tooltip__bubble--right .inspera-tooltip__arrow {
  left: -4px; top: 50%; margin-top: -4px;
  border-left: 1px solid transparent; border-bottom: 1px solid transparent;
}

.inspera-tooltip__bubble--light.inspera-tooltip__bubble--top .inspera-tooltip__arrow {
  border-right-color: var(--border-strong); border-bottom-color: var(--border-strong);
}
.inspera-tooltip__bubble--light.inspera-tooltip__bubble--bottom .inspera-tooltip__arrow {
  border-left-color: var(--border-strong); border-top-color: var(--border-strong);
}
.inspera-tooltip__bubble--light.inspera-tooltip__bubble--left .inspera-tooltip__arrow {
  border-right-color: var(--border-strong); border-top-color: var(--border-strong);
}
.inspera-tooltip__bubble--light.inspera-tooltip__bubble--right .inspera-tooltip__arrow {
  border-left-color: var(--border-strong); border-bottom-color: var(--border-strong);
}


```

```html
<span class="inspera-tooltip">
  <!-- Any focusable trigger works; it must name itself and point at the bubble. -->
  <button type="button" class="inspera-btn inspera-btn--outline inspera-btn--icon-only"
          aria-label="Help" aria-describedby="tip-1">
    <span class="material-symbols-outlined" aria-hidden="true">help</span>
  </button>
  <span class="inspera-tooltip__bubble inspera-tooltip__bubble--top" id="tip-1" role="tooltip">
    Get help with this page
    <span class="inspera-tooltip__arrow" aria-hidden="true"></span>
  </span>
</span>
```


### Progress

Show completion of an ongoing task. - category: `feedback`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Progress } from '@inspera/kit'

<Progress
  label="Uploading attachments"
  value={60}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | What is progressing, e.g. "Uploading attachments". The accessible name. |
| `variant` | `'Linear' \| 'Circular'` | `'Linear'` | Bar or ring. |
| `value` | `number` | `0` | Completion percentage 0-100. Required unless indeterminate. |
| `indeterminate` | `boolean` | `false` | Unknown-duration animation. |
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Medium'` | Bar height / ring diameter. |
| `intent` | `'Primary' \| 'Success' \| 'Warning' \| 'Error'` | `'Primary'` | Fill colour. |
| `showValue` | `boolean` | `false` | Render the percentage. |

Also accepts any native `<span>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<span>`. `className` and `style` go on the outermost element.

**Accessibility** - role `progressbar`. Use role="progressbar" with aria-valuenow / min / max; Omit aria-valuenow when indeterminate; Provide an accessible label for the task.

**Do:** Show a value when you know how far along the task is; Use indeterminate when you do not know how long it will take; Match the intent colour to the context.
**Don't:** Do not use for very short operations; Do not fake progress values.

**Choosing a variant:**
- `variant="Circular"`: A compact place such as a dashboard tile, where a bar would not fit beside the figure.
- `intent="Primary"`: Work that is under way, such as marking. The default.
- `intent="Success"`: The work is done, such as every response marked.
- `intent="Warning"`: The work is behind, such as marking due tomorrow with most of it left.
- `intent="Error"`: The work has failed or is overdue. Say what to do next.
- `size="Small"`: Inside table rows and list items, with the count beside it.
- `size="Large"`: One task that is the focus of the screen, such as an import.
- `indeterminate`: How long it will take is not known yet, such as preparing an export.
- `showValue`: People need the exact percentage. Prefer a count in words beside the bar, such as 12 of 40.

**Deprecated aliases** (do not use): `Progress bar`, `Loading bar`, `Meter`

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

- The bar heights are 4 / 8 / 12 and the ring diameters 24 / 40 / 56, with stroke widths 3 / 4 / 5.
- `role="progressbar"` with `aria-valuemin`, `aria-valuemax` and an `aria-label` is mandatory. A styled div announces nothing.
- When indeterminate, omit `aria-valuenow` entirely. Sending 0 tells the user it is stuck at zero.
- The indeterminate bar is a 40% sliver swept by keyframes across a clipped track - not a full-width bar that fades.
- The ring is rotated -90deg so the arc starts at twelve o'clock, and the arc length is set by `stroke-dashoffset`.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:       #004080;
  --error:         #D32F2F;
  --warning:       #EF6C00;
  --success:       #2E7D32;
  --gray-200:      #EDEDED;
  --text-primary:  rgba(0, 0, 0, 0.87);
  --radius-pill:   9999px;
  --font-sans:     'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-progress {
  --progress-fill: var(--primary);

  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  font-family: var(--font-sans);
}

.inspera-progress--circular { width: auto; }

.inspera-progress--success { --progress-fill: var(--success); }
.inspera-progress--warning { --progress-fill: var(--warning); }
.inspera-progress--error   { --progress-fill: var(--error); }

/* Linear: a rounded track that clips the fill. */
.inspera-progress__track {
  position: relative;
  flex: 1;
  height: 8px;
  border-radius: var(--radius-pill);
  background: var(--gray-200);
  overflow: hidden;
}
.inspera-progress--small .inspera-progress__track { height: 4px; }
.inspera-progress--large .inspera-progress__track { height: 12px; }

.inspera-progress__fill {
  display: block;
  height: 100%;
  border-radius: var(--radius-pill);
  background: var(--progress-fill);
  transition: width 240ms ease;
}

/* Indeterminate: a 40% sliver that sweeps the track. Width is animated, so the
   fill is absolutely positioned rather than sized by a value. */
.inspera-progress__fill--indeterminate {
  position: absolute;
  top: 0;
  left: 0;
  width: 40%;
  transition: none;
  animation: inspera-indeterminate 1.4s ease infinite;
}

.inspera-progress__value {
  font-size: 14px;
  color: var(--text-primary);
  min-width: 36px;
  text-align: right;
}

/* Circular: the ring spins as a whole when indeterminate. */
.inspera-progress__ring {
  display: inline-flex;
  width: 40px;
  height: 40px;
}
.inspera-progress__ring--indeterminate { animation: inspera-spin 0.9s linear infinite; }
.inspera-progress__ring > svg { transform: rotate(-90deg); }

@keyframes inspera-indeterminate {
  0%   { left: -40%; width: 40%; }
  50%  { width: 55%; }
  100% { left: 100%; width: 40%; }
}

@keyframes inspera-spin {
  to { transform: rotate(360deg); }
}
```

```html
<!-- Linear, 60%. The ARIA is the component: a styled div announces nothing. -->
<span class="inspera-progress">
  <span class="inspera-progress__track" role="progressbar"
        aria-valuemin="0" aria-valuemax="100" aria-valuenow="60" aria-label="Uploading attachments">
    <span class="inspera-progress__fill" style="width: 60%" aria-hidden="true"></span>
  </span>
  <span class="inspera-progress__value">60%</span>
</span>

<!-- Indeterminate: drop aria-valuenow entirely, do not send 0. -->
<span class="inspera-progress">
  <span class="inspera-progress__track" role="progressbar"
        aria-valuemin="0" aria-valuemax="100" aria-label="Loading">
    <span class="inspera-progress__fill inspera-progress__fill--indeterminate" aria-hidden="true"></span>
  </span>
</span>
```


### Spinner

Indicate an indeterminate loading state. - category: `feedback`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Spinner } from '@inspera/kit'

<Spinner
  label="Loading assessments"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Medium'` | Diameter 16 / 24 / 40. |
| `intent` | `'Primary' \| 'Neutral' \| 'Inverse'` | `'Primary'` | Arc colour. |
| `label` | `string` | `'Loading'` | What is loading, announced to screen readers. |

Also accepts any native `<span>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<span>`. `className` and `style` go on the outermost element.

**Accessibility** - role `status`. Use role="status" with aria-live="polite"; Provide an accessible label via aria-label; Include visually hidden loading text.

**Do:** Use for short waits of unknown length; Use Inverse on dark surfaces; Say what is loading.
**Don't:** Do not use when you can show how far along it is - use Progress; Do not show several spinners at once.

**Choosing a variant:**
- `size="Small"`: Inline, beside the text it is about, such as Updating next to a roster's count.
- `size="Medium"`: Inside a card or panel that is updating. The default size.
- `size="Large"`: A whole panel people are waiting on, such as a preview being built.
- `intent="Neutral"`: Loading that should not pull the eye, such as more of a list loading at its end.
- `intent="Inverse"`: Dark surfaces, such as a video player.

**Deprecated aliases** (do not use): `Loader`, `Loading indicator`, `Activity indicator`

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

- It is an SVG of two circles - a full `--gray-200` track and a coloured arc - not a bordered div with one transparent side.
- The arc is drawn by `stroke-dasharray` = circumference and `stroke-dashoffset` = 70% of it. Change the offset, not the geometry.
- Diameters are 16 / 24 / 40 with stroke widths 2 / 3 / 4.
- Rotation is 0.8s linear infinite on the `<svg>`, so the arc spins and the track does not.
- The visually hidden label is required - `role="status"` with no name announces nothing.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:    #004080;
  --gray-200:   #EDEDED;
  --font-sans:  'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-spinner {
  position: relative;
  display: inline-flex;
  font-family: var(--font-sans);
  width: 24px;
  height: 24px;
}

.inspera-spinner--small { width: 16px; height: 16px; }
.inspera-spinner--large { width: 40px; height: 40px; }

.inspera-spinner > svg {
  animation: inspera-spin 0.8s linear infinite;
}

/* The visually hidden label. A spinner with no accessible name announces
   nothing at all, so this is not optional. */
.inspera-spinner__label {
  font-family: var(--font-sans);
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

@keyframes inspera-spin {
  to { transform: rotate(360deg); }
}
```

```html
<!-- Medium (24px). The track is --gray-200; the arc is the intent colour. -->
<span class="inspera-spinner" role="status" aria-label="Loading assessments">
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10.5" fill="none" stroke="var(--gray-200)" stroke-width="3"></circle>
    <circle cx="12" cy="12" r="10.5" fill="none" stroke="var(--primary)" stroke-width="3"
            stroke-linecap="round" stroke-dasharray="65.97344572538566" stroke-dashoffset="46.18141200776996"></circle>
  </svg>
  <span class="inspera-spinner__label">Loading assessments</span>
</span>
```


### Skeleton

Show placeholder shapes while content loads. - category: `feedback`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Skeleton } from '@inspera/kit'

<Skeleton
  lines={3}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'Text' \| 'Rect' \| 'Circle'` | `'Text'` | Placeholder shape. |
| `width` | `string \| number` | - | Explicit width. |
| `height` | `string \| number` | - | Explicit height. |
| `lines` | `number` | `1` | Number of text lines. Only applies to the Text variant. |
| `radius` | `string \| number` | - | Corner radius override. Match the shape being stood in for. |

Also accepts any native `<span>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<span>`. `className` and `style` go on the outermost element.

**Accessibility** - role `presentation`. Skeletons are decorative and aria-hidden; Announce the real content once loaded; Mirror the layout of the content being loaded.

**Do:** Match skeleton shapes to real content; Use on first load, so the page feels faster; Replace with content as soon as it arrives.
**Don't:** Do not leave skeletons animating indefinitely; Do not use for actions people start - use Spinner.

**Choosing a variant:**
- `variant="Text"`: Lines of text that are loading, such as the rows of a list.
- `variant="Rect"`: Blocks such as a stat tile, a chart or an image.
- `variant="Circle"`: Avatars and other round shapes.

**Deprecated aliases** (do not use): `Placeholder`, `Shimmer`, `Ghost`

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

- The shimmer is a 400%-wide linear gradient panned by `background-position`, 1.4s ease infinite. It is not an opacity pulse.
- Text lines are 12px tall with `--radius-sm` and an 8px gap; the last of several is 60% wide so the block reads as a paragraph.
- Rect uses `--radius-md`, Circle uses `--radius-pill`. Match the radius to whatever the placeholder stands in for.
- Always `aria-hidden` - a skeleton is decoration, and announcing it interrupts the user with nothing.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --gray-100:     #F7F7F7;
  --gray-200:     #EDEDED;
  --radius-sm:    4px;
  --radius-md:    8px;
  --radius-pill:  9999px;
}

.inspera-skeleton {
  /* The shimmer: an oversized gradient panned across the element. A pulsing
     opacity is a different effect and reads as a flash, not a load. */
  background-image: linear-gradient(90deg, var(--gray-200) 25%, var(--gray-100) 37%, var(--gray-200) 63%);
  background-size: 400% 100%;
  animation: inspera-shimmer 1.4s ease infinite;
}

.inspera-skeleton--text {
  display: block;
  width: 100%;
  height: 12px;
  border-radius: var(--radius-sm);
}

.inspera-skeleton--rect {
  display: block;
  width: 100%;
  height: 120px;
  border-radius: var(--radius-md);
}

.inspera-skeleton--circle {
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-pill);
}

/* A stack of lines, with the last one short so it reads as a paragraph. */
.inspera-skeleton-lines {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  background: none;
  animation: none;
}
.inspera-skeleton-lines > .inspera-skeleton--text:last-child:not(:only-child) { width: 60%; }

@keyframes inspera-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

```html
<!-- Three text lines. The wrapper is not itself a shimmering block. -->
<span class="inspera-skeleton-lines" role="presentation" aria-hidden="true">
  <span class="inspera-skeleton inspera-skeleton--text"></span>
  <span class="inspera-skeleton inspera-skeleton--text"></span>
  <span class="inspera-skeleton inspera-skeleton--text"></span>
</span>

<span class="inspera-skeleton inspera-skeleton--circle" role="presentation" aria-hidden="true"></span>

<span class="inspera-skeleton inspera-skeleton--rect" role="presentation" aria-hidden="true"></span>
```


### Popover

Show interactive content anchored to a trigger. - category: `feedback`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Popover } from '@inspera/kit'

<Popover
  trigger={<Button label="Filters" intent="Outline" trailingIcon="expand_more" />}
  title="Filter results"
  content={<FilterForm />}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `trigger` **(required)** | `ReactElement` | - | The element that toggles the popover - usually a Button. |
| `content` **(required)** | `ReactNode` | - | Popover body. May hold interactive content. |
| `title` | `string` | - | Optional panel heading; also the panel's accessible name. |
| `placement` | `'Top' \| 'Bottom' \| 'Left' \| 'Right'` | `'Bottom'` | Preferred side. It flips when there is no room. |
| `open` | `boolean` | - | Open state. Controlled - pair with onOpenChange. |
| `defaultOpen` | `boolean` | `false` | Open on mount, when uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | - | Fired when the popover opens or closes. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

**Accessibility** - role `dialog`, keyboard operable. Trigger uses aria-haspopup and aria-expanded; Panel uses role="dialog"; Escape and outside-click close the popover; May contain interactive content (unlike Tooltip).

**Do:** Use for interactive content that does not fit inline; Anchor it to the element that opens it; Close it on Escape and on a click outside.
**Don't:** Do not use for simple hover hints - use Tooltip; Do not stack popovers.

**Choosing a variant:**
- `placement="Bottom"`: Under the button that opens it, such as Filters in a toolbar. The default.
- `placement="Top"`: Above a trigger low on the screen, such as in the bar at the foot of the marking view.
- `placement="Right"`: Beside an item in a list on the left, so the list stays in view.
- `placement="Left"`: Beside a trigger at the right edge, such as an action at the end of a table row.

**Deprecated aliases** (do not use): `Flyout`, `Overlay panel`

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

- A popover holds interactive content, so it is `role="dialog"` (not `tooltip`), it is reachable by keyboard, and it does not disappear on mouseout.
- The panel is `--radius-md` on `--surface` with a 1px `--border` and `--shadow-300`, 16px padding, capped at 280px with `width: max-content`.
- Placement sets the offset and the centring transform together; the 10px gap leaves room for the arrow without it touching the trigger.
- The arrow is a 10px square rotated 45deg that borrows exactly two of the panel's borders - the two facing the trigger.
- Close on Escape and on an outside click, and return focus to the trigger.
- For plain text with no controls, use a Tooltip. For anything that must be acted on, this.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --error:                  #D32F2F;
  --success:                #2E7D32;
  --white:                  #ffffff;
  --gray-100:               #F7F7F7;
  --gray-200:               #EDEDED;
  --gray-700:               #595959;
  --gray-900:               #272727;
  --orange-600:             #F2A202;
  --text-primary:           rgba(0, 0, 0, 0.87);
  --surface:                var(--white);
  --border:                 var(--gray-200);
  --muted-foreground:       var(--gray-700);
  --control-height-sm:      32px;
  --control-height-md:      40px;
  --control-height-lg:      44px;
  --radius-sm:              4px;
  --radius-md:              8px;
  --shadow-300:             0px 8px 16px rgba(39, 39, 39, 0.08), 0px 6px 8px rgba(39, 39, 39, 0.12);
  --effect-button-shadow:   inset 0px -1px 0px rgba(0, 0, 0, 0.2), 0px 1px 0px rgba(0, 0, 0, 0.08);
  --border-width-default:   1px;
  --focus-ring-width:       2px;
  --focus-ring-offset:      2px;
  --focus-ring-color:       var(--primary);
  --duration-fast:          100ms;
  --easing-standard:        cubic-bezier(0.2, 0, 0, 1);
  --z-popover:              400;
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

.inspera-popover {
  position: relative;
  display: inline-flex;
}

.inspera-popover__trigger { display: inline-flex; }

.inspera-popover__panel {
  position: absolute;
  z-index: var(--z-popover, 40);
  max-width: 280px;
  width: max-content;
  padding: 16px;
  border-radius: var(--radius-md);
  background: var(--surface);
  color: var(--text-primary);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-300);
  text-align: left;
  font-family: var(--font-sans);
}

/* Placement sets the offset and the centring transform together - a 10px gap
   leaves room for the arrow without it touching the trigger. */
.inspera-popover__panel--bottom { top: calc(100% + 10px); left: 50%; transform: translateX(-50%); }
.inspera-popover__panel--top    { bottom: calc(100% + 10px); left: 50%; transform: translateX(-50%); }
.inspera-popover__panel--left   { right: calc(100% + 10px); top: 50%; transform: translateY(-50%); }
.inspera-popover__panel--right  { left: calc(100% + 10px); top: 50%; transform: translateY(-50%); }

/* The arrow is a rotated square that borrows two of the panel's borders. */
.inspera-popover__arrow {
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--surface);
  transform: rotate(45deg);
}

.inspera-popover__panel--bottom .inspera-popover__arrow {
  top: -5px; left: 50%; margin-left: -5px;
  border-left: 1px solid var(--border);
  border-top: 1px solid var(--border);
}
.inspera-popover__panel--top .inspera-popover__arrow {
  bottom: -5px; left: 50%; margin-left: -5px;
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.inspera-popover__panel--left .inspera-popover__arrow {
  right: -5px; top: 50%; margin-top: -5px;
  border-right: 1px solid var(--border);
  border-top: 1px solid var(--border);
}
.inspera-popover__panel--right .inspera-popover__arrow {
  left: -5px; top: 50%; margin-top: -5px;
  border-left: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.inspera-popover__title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
}

.inspera-popover__body {
  font-size: 14px;
  line-height: 1.5;
  color: var(--muted-foreground);
}


```

```html
<span class="inspera-popover">
  <!-- The trigger is the canonical Button, and the ARIA state sits on it -
       not on a wrapper, which is not focusable and announces nothing. -->
  <button type="button" class="inspera-btn inspera-btn--outline"
          aria-expanded="true" aria-haspopup="dialog" aria-controls="filters-popover">Filters</button>
  <div class="inspera-popover__panel inspera-popover__panel--bottom" id="filters-popover"
       role="dialog" aria-labelledby="filters-title">
    <span class="inspera-popover__arrow" aria-hidden="true"></span>
    <h3 class="inspera-popover__title" id="filters-title">Filter results</h3>
    <div class="inspera-popover__body">Show only published assessments.</div>
  </div>
</span>
```


### Drawer

Slide a panel in from the edge of the screen. - category: `feedback`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Drawer } from '@inspera/kit'

<Drawer
  open={open}
  title="Assessment details"
  onClose={() => setOpen(false)}
>
  {children}
</Drawer>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` **(required)** | `boolean` | - | Whether the drawer is shown. Controlled - pair with onClose. |
| `title` **(required)** | `string` | - | Header title. Also the accessible name. |
| `children` | `ReactNode` | - | Panel contents. |
| `side` | `'Right' \| 'Left' \| 'Bottom'` | `'Right'` | Edge it slides from. |
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Medium'` | Panel width 320 / 400 / 560 (height, for Bottom). |
| `hasCloseButton` | `boolean` | `true` | Show the header close button. |
| `onClose` | `() => void` | - | Fired on the close button, the scrim, and Escape. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

**Accessibility** - role `dialog`, keyboard operable. Use role="dialog" with aria-modal="true"; Set aria-labelledby to the drawer title; Trap focus while open and restore it on close; Escape closes the drawer.

**Do:** Use for secondary tasks and detail panels; Provide a clear close control; Return focus to the trigger on close.
**Don't:** Do not use for critical confirmations - use Dialog; Do not open multiple drawers at once.

**Choosing a variant:**
- `side="Right"`: Details of one row while the list stays in view, such as a question from the bank. The default.
- `side="Left"`: Navigation and filters that belong at the left, such as a roster's saved views on a narrow screen.
- `side="Bottom"`: Short actions on a touch screen, such as an invigilator on an iPad acting on one candidate.
- `size="Small"`: A few facts or actions.
- `size="Large"`: Richer detail that still belongs beside the list, such as a question preview. Never a table wider than 5 columns.
- `hasCloseButton="false"`: The drawer has its own way out, such as Close beside its actions, or a list where choosing an item closes it.

**Deprecated aliases** (do not use): `Sheet`, `Side panel`, `Off-canvas`

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

- Side panels are 320 / 400 / 560 wide and pinned top-to-bottom; a bottom drawer takes that number as its height, spans the full width, and caps at 90% of the viewport.
- Same scrim and the same modal obligations as Dialog: focus in, Tab trapped, focus restored, Escape and scrim click close, body scroll locked.
- The body scrolls (`flex: 1; overflow-y: auto`), not the panel - the header has to stay put.
- The header is 16px/20px padding with an 18px/500 title, smaller than a Dialog's because a drawer is a secondary surface.
- Slide it in from its own edge. A drawer that fades in reads as a dialog in the wrong place.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --white:          #ffffff;
  --gray-200:       #EDEDED;
  --gray-700:       #595959;
  --action-active:  rgba(0, 0, 0, 0.56);
  --text-primary:   rgba(0, 0, 0, 0.87);
  --surface:        var(--white);
  --border:         var(--gray-200);
  --scrim:          rgba(39, 39, 39, 0.48);
  --shadow-500:     0px 10px 32px rgba(39, 39, 39, 0.1), 0px 6px 14px rgba(39, 39, 39, 0.12);
  --z-modal:        600;
  --font-sans:      'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-drawer-overlay {
  position: fixed;
  inset: 0;
  background: var(--scrim);
  z-index: var(--z-modal);
}

.inspera-drawer {
  display: flex;
  flex-direction: column;
  background: var(--surface);
  color: var(--text-primary);
  box-shadow: var(--shadow-500);
  font-family: var(--font-sans);
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 400px;
  max-width: 100%;
}

.inspera-drawer--left  { left: 0; right: auto; }
.inspera-drawer--small { width: 320px; }
.inspera-drawer--large { width: 560px; }

/* Bottom pins to the full width and takes its size as height instead. */
.inspera-drawer--bottom {
  top: auto;
  left: 0;
  right: 0;
  width: auto;
  height: 400px;
  max-height: 90%;
}
.inspera-drawer--bottom.inspera-drawer--small { width: auto; height: 320px; }
.inspera-drawer--bottom.inspera-drawer--large { width: auto; height: 560px; }

.inspera-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.inspera-drawer__title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.inspera-drawer__close {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--action-active);
  display: inline-flex;
}
.inspera-drawer__close .material-symbols-outlined { font-size: 22px; }

/* The body scrolls, not the panel - the header stays put. */
.inspera-drawer__body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  font-size: 16px;
  line-height: 1.5;
  color: var(--gray-700);
}
```

```html
<div class="inspera-drawer-overlay">
  <div class="inspera-drawer" role="dialog" aria-modal="true"
       aria-labelledby="drawer-title" tabindex="-1">
    <div class="inspera-drawer__header">
      <h2 class="inspera-drawer__title" id="drawer-title">Assessment details</h2>
      <button type="button" class="inspera-drawer__close" aria-label="Close">
        <span class="material-symbols-outlined" aria-hidden="true">close</span>
      </button>
    </div>
    <div class="inspera-drawer__body">Panel content.</div>
  </div>
</div>
```


## navigation

### Tabs

Organise content into switchable panels. - category: `navigation`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Tabs } from '@inspera/kit'

<Tabs
  items={[
    { label: 'Overview' },
    { label: 'Questions' },
    { label: 'Settings' },
    { label: 'Results' },
  ]}
  label="Assessment sections"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` **(required)** | `TabItem[]` | - | The tabs, in order. |
| `variant` | `'Underline' \| 'Contained'` | `'Underline'` | Visual treatment. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Tab height 40 / 48. |
| `fullWidth` | `boolean` | `false` | Stretch tabs to fill the row. |
| `value` | `string` | - | Active tab's value. Controlled - pair with onChange. |
| `defaultValue` | `string` | - | Starting tab when uncontrolled. Defaults to the first. |
| `onChange` | `(value: string) => void` | - | Fired with the newly selected tab's value. |
| `label` | `string` | - | Names the tab list for assistive tech, when no heading does. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

```ts
export interface TabItem {
  label: string
  /** Identifies the tab in value/onChange. Defaults to the label. */
  value?: string
  icon?: string
  /** The tab's panel. When items carry content, Tabs renders the panels too. */
  content?: ReactNode
}
```

**Accessibility** - role `tablist`, keyboard operable. Use role="tablist" on the tab container; Each tab uses role="tab" with aria-selected; Tab panels use role="tabpanel" linked by aria-labelledby; Arrow keys navigate between tabs.

**Do:** Use to organise related content sections; Label tabs clearly and concisely; Use a maximum of 6 tabs per set.
**Don't:** Do not use tabs for sequential steps - use Stepper instead; Do not nest tab sets inside other tab sets.

**Choosing a variant:**
- `variant="Underline"`: Sibling views of one thing, right under its title, such as a test's Overview, Candidates and Settings.
- `variant="Contained"`: A compact switch inside a panel, such as the rubric and the marking guide beside a response.
- `size="Small"`: Inside cards and panels, such as the views of a chart.
- `fullWidth`: A narrow panel, where the tabs share its width, such as Questions and Resources in the question set editor.

**Deprecated aliases** (do not use): `Tab bar`, `Tab navigation`

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

- Underline tabs are 48px tall (40px small) on a 1px `--border-strong` rail, with `margin-bottom: -1px` so the selected 2px `--primary` underline covers the rail.
- The resting bottom border is a transparent 2px, not none - otherwise selecting a tab shifts the whole row by two pixels.
- Contained tabs drop the rail entirely and become a pill group on `--gray-100`, with the selected tab a white `--shadow-100` card.
- `role="tablist"` / `role="tab"` / `role="tabpanel"`, each tab pointing at its panel with `aria-controls` and each panel back with `aria-labelledby`.
- Roving tabindex: only the selected tab is a tab stop; Left/Right move between them.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:        #004080;
  --white:          #ffffff;
  --gray-100:       #F7F7F7;
  --gray-300:       #D9D9D9;
  --gray-700:       #595959;
  --border-strong:  var(--gray-300);
  --radius-xs:      2px;
  --radius-sm:      4px;
  --shadow-100:     0px 4px 4px rgba(39, 39, 39, 0.08), 0px 2px 4px rgba(39, 39, 39, 0.12);
  --font-sans:      'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-tabs {
  display: flex;
  gap: 0;
  padding: 0;
  border-bottom: 1px solid var(--border-strong);
  background: transparent;
  border-radius: 0;
  width: auto;
}

.inspera-tabs--full { width: 100%; }

/* Contained: a pill group on a tinted track, with no rail underneath. */
.inspera-tabs--contained {
  gap: 4px;
  padding: 4px;
  border-bottom: none;
  background: var(--gray-100);
  border-radius: var(--radius-sm);
}

.inspera-tabs__tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 48px;
  padding: 0 16px;
  flex: none;
  border-top: none;
  border-right: none;
  border-left: none;
  /* A transparent 2px rail at rest, so selecting a tab does not shift the row. */
  border-bottom: 2px solid transparent;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  color: var(--gray-700);
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: -1px;
  transition: color 120ms ease, border-color 120ms ease;
}

.inspera-tabs--small .inspera-tabs__tab { height: 40px; }
.inspera-tabs--full .inspera-tabs__tab { flex: 1; }

.inspera-tabs__tab[aria-selected='true'] {
  border-bottom-color: var(--primary);
  color: var(--primary);
}

/* Contained tabs sit inside the track: no rail, a raised white card instead. */
.inspera-tabs--contained .inspera-tabs__tab {
  height: 40px;
  border-bottom: none;
  border-radius: var(--radius-xs);
  margin-bottom: 0;
}
.inspera-tabs--contained.inspera-tabs--small .inspera-tabs__tab { height: 32px; }

.inspera-tabs--contained .inspera-tabs__tab[aria-selected='true'] {
  background: var(--white);
  box-shadow: var(--shadow-100);
  color: var(--primary);
}

.inspera-tabs__tab .material-symbols-outlined { font-size: 20px; }
```

```html
<div class="inspera-tabs" role="tablist" aria-label="Section tabs">
  <button type="button" class="inspera-tabs__tab" role="tab" aria-selected="true"
          id="tab-overview" aria-controls="panel-overview" tabindex="0">Overview</button>
  <button type="button" class="inspera-tabs__tab" role="tab" aria-selected="false"
          id="tab-questions" aria-controls="panel-questions" tabindex="-1">Questions</button>
</div>

<div id="panel-overview" role="tabpanel" aria-labelledby="tab-overview" tabindex="0">...</div>
<div id="panel-questions" role="tabpanel" aria-labelledby="tab-questions" tabindex="0" hidden>...</div>
```


### Breadcrumb

Show the user's current location in a hierarchy. - category: `navigation`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Breadcrumb } from '@inspera/kit'

<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Assessments', href: '/assessments' },
    { label: 'Mathematics', href: '/assessments/mathematics' },
    'Algebra Quiz',
  ]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` **(required)** | `(string \| BreadcrumbItem)[]` | - | Trail from root to current page. The last entry is the current page and is not a link. |
| `separator` | `'Slash' \| 'Chevron'` | `'Chevron'` | Divider glyph between items. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Text size 14 / 16. |
| `onNavigate` | `(index: number) => void` | - | Fired with the index of a crumb without an href, for client-side routing. |
| `label` | `string` | `'Breadcrumb'` | Names the navigation landmark. |

Also accepts any native `<nav>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<nav>`. `className` and `style` go on the outermost element.

```ts
export interface BreadcrumbItem {
  label: string
  /** Link target. Crumbs with an href are real links - they open in a new tab and show their URL. */
  href?: string
}
```

**Accessibility** - role `navigation`, keyboard operable. Wrap in nav with aria-label="Breadcrumb"; Use an ordered list for semantic structure; Mark current page with aria-current="page".

**Do:** Use where pages sit in a hierarchy; Always include the current page as the last item; Keep breadcrumb labels concise.
**Don't:** Do not use for flat navigation; Do not make the current page a link.

**Choosing a variant:**
- `separator="Chevron"`: Pages in a hierarchy, in the location bar or above a page title. The default.
- `separator="Slash"`: A path of folders, such as where a question is saved in the question bank.
- `size="Small"`: The location bar under the product's top bar.

**Deprecated aliases** (do not use): `Breadcrumbs`, `Path navigation`

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

- It is a `<nav aria-label="Breadcrumb">` wrapping an `<ol>` - order is the meaning, so not a `<div>` of spans.
- The last crumb is the current page: `aria-current="page"`, `--text-primary` at 500 weight, and not a control.
- Each separator is an `aria-hidden="true"` span inside the item of the crumb before it, so a wrapped trail never starts a line with one. Left announced, a screen reader reads "chevron right" between every crumb.
- Crumbs are 16px (14px small) in `--primary`, underlined on hover only. The chevron runs 2px larger than the text.
- With real URLs use `<a href>` rather than `<button>`, keeping the same class - a breadcrumb should be openable in a new tab.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:       #004080;
  --gray-400:      #BCBCBC;
  --text-primary:  rgba(0, 0, 0, 0.87);
  --font-sans:     'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-breadcrumb {
  font-family: var(--font-sans);
}

.inspera-breadcrumb__list {
  display: flex;
  align-items: center;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
}

/* Each separator sits in the item of the crumb before it, so a wrapped trail
   breaks after a separator and never starts a line with one. */
.inspera-breadcrumb__list > li {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* A crumb. Rendered as <button> in the React component because navigation runs
   through a router callback; with real URLs, use <a href> and the same class. */
.inspera-breadcrumb__crumb {
  padding: 0;
  border: none;
  background: none;
  color: var(--primary);
  font-family: var(--font-sans);
  font-size: 16px;
  text-decoration: none;
  cursor: pointer;
}
.inspera-breadcrumb__crumb:hover { text-decoration: underline; }

.inspera-breadcrumb--small .inspera-breadcrumb__crumb { font-size: 14px; }

/* The last crumb is the current page: darker, heavier, and not interactive. */
.inspera-breadcrumb__current {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}
.inspera-breadcrumb--small .inspera-breadcrumb__current { font-size: 14px; }

/* The separator sizes its own glyph, so the chevron can run 2px larger than
   the text while the slash matches it. */
.inspera-breadcrumb__separator {
  color: var(--gray-400);
  display: inline-flex;
  align-items: center;
}

.inspera-breadcrumb__separator .material-symbols-outlined { font-size: 18px; }
.inspera-breadcrumb--small .inspera-breadcrumb__separator .material-symbols-outlined { font-size: 16px; }

.inspera-breadcrumb__slash { font-size: 16px; }
.inspera-breadcrumb--small .inspera-breadcrumb__slash { font-size: 14px; }
```

```html
<nav class="inspera-breadcrumb" aria-label="Breadcrumb">
  <ol class="inspera-breadcrumb__list">
    <li>
      <a class="inspera-breadcrumb__crumb" href="/">Home</a>
      <span class="inspera-breadcrumb__separator" aria-hidden="true"><span class="material-symbols-outlined">chevron_right</span></span>
    </li>
    <li>
      <a class="inspera-breadcrumb__crumb" href="/assessments">Assessments</a>
      <span class="inspera-breadcrumb__separator" aria-hidden="true"><span class="material-symbols-outlined">chevron_right</span></span>
    </li>
    <li><span class="inspera-breadcrumb__current" aria-current="page">Algebra Quiz</span></li>
  </ol>
</nav>
```


### Pagination

Navigate between pages of content. - category: `navigation`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Pagination } from '@inspera/kit'

<Pagination
  pageCount={12}
  defaultPage={4}
  onChange={loadPage}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `pageCount` **(required)** | `number` | - | Total number of pages. |
| `page` | `number` | - | Current page (1-based). Controlled - pair with onChange. |
| `defaultPage` | `number` | `1` | Starting page when uncontrolled. |
| `siblingCount` | `number` | `1` | Pages shown either side of current. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Control height. |
| `showEdges` | `boolean` | `true` | Show first / last controls. |
| `onChange` | `(page: number) => void` | - | Fired with the requested page number, 1-based. |
| `label` | `string` | `'Pagination'` | Names the navigation landmark. Give each pager on a page its own. |

Also accepts any native `<nav>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<nav>`. `className` and `style` go on the outermost element.

**Accessibility** - role `navigation`, keyboard operable. Wrap in nav with aria-label="Pagination"; Mark the current page with aria-current="page"; Disable Previous on the first page and Next on the last.

**Do:** Use for long, paged result sets; Show current, first, and last pages; Collapse large gaps with an ellipsis.
**Don't:** Do not use for a handful of items; Do not hide the current page indicator.

**Choosing a variant:**
- `size="Medium"`: Under a long list that fills the page, such as all tests. The default size.
- `size="Small"`: Dense or narrow places, such as stepping through responses while marking.
- `showEdges`: Many pages, where jumping to the first or last one saves clicks.
- `showEdges="false"`: Up to about 7 pages, when every page number is already shown.

**Deprecated aliases** (do not use): `Pager`, `Page navigation`

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

- A `<nav aria-label="Pagination">` around a `<ul>`; the current page is a button with `aria-current="page"`, filled `--primary`.
- Every page button needs a real label ("Page 4"), and the arrows need "Previous page" / "Next page". A bare chevron announces as nothing.
- The ellipsis is a `<span>` marked `aria-hidden`, not a disabled button - it is a gap marker, not a control.
- Cells are 40px (32px small) with `--radius-md` and a 4px gap, and the list wraps rather than overflowing in a narrow column.
- Disable the arrows at the ends rather than hiding them, so the control does not change width as you page.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:           #004080;
  --white:             #ffffff;
  --gray-700:          #595959;
  --action-hover:      rgba(0, 0, 0, 0.04);
  --action-disabled:   rgba(0, 0, 0, 0.38);
  --text-primary:      rgba(0, 0, 0, 0.87);
  --muted-foreground:  var(--gray-700);
  --radius-sm:         4px;
  --font-sans:         'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-pagination__list {
  display: flex;
  align-items: center;
  /* Wrap rather than overflow: a long pager has to degrade in a narrow column,
     not spill out of it. */
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.inspera-pagination__item {
  min-width: 40px;
  height: 40px;
  padding: 0 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease;
}

.inspera-pagination--small .inspera-pagination__item {
  min-width: 32px;
  height: 32px;
  font-size: 14px;
}

.inspera-pagination__item:hover:not(:disabled):not([aria-current='page']) {
  background: var(--action-hover);
}

.inspera-pagination__item[aria-current='page'] {
  background: var(--primary);
  color: var(--white);
}

.inspera-pagination__item:disabled {
  color: var(--action-disabled);
  cursor: not-allowed;
}

.inspera-pagination__item .material-symbols-outlined { font-size: 20px; }
.inspera-pagination--small .inspera-pagination__item .material-symbols-outlined { font-size: 18px; }

/* The gap marker is not a control: a span, hidden from assistive tech. */
.inspera-pagination__ellipsis {
  cursor: default;
  color: var(--muted-foreground);
}
```

```html
<nav class="inspera-pagination" aria-label="Pagination">
  <ul class="inspera-pagination__list">
    <li><button type="button" class="inspera-pagination__item" aria-label="Previous page">
      <span class="material-symbols-outlined" aria-hidden="true">chevron_left</span>
    </button></li>
    <li><button type="button" class="inspera-pagination__item" aria-label="Page 1">1</button></li>
    <li><span class="inspera-pagination__item inspera-pagination__ellipsis" aria-hidden="true">...</span></li>
    <li><button type="button" class="inspera-pagination__item" aria-label="Page 4" aria-current="page">4</button></li>
    <li><button type="button" class="inspera-pagination__item" aria-label="Next page">
      <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
    </button></li>
  </ul>
</nav>
```


### Menu

Present a list of actions in a dropdown. - category: `navigation`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Menu } from '@inspera/kit'

<Menu
  label="Actions"
  items={[
    { label: 'Edit', icon: 'edit' },
    { label: 'Duplicate', icon: 'content_copy' },
    { label: 'Share', icon: 'share' },
    { label: '', divider: true },
    { label: 'Delete', icon: 'delete', danger: true },
  ]}
  onSelect={handleSelect}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Trigger text. With `iconOnly` it is not shown but names the trigger and the menu, so make it specific: "Actions for Algebra Quiz", not "Actions". |
| `items` **(required)** | `MenuItem[]` | - | Menu items, in order. |
| `placement` | `'BottomStart' \| 'BottomEnd'` | `'BottomStart'` | Aligns the menu to the trigger's start or end edge. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Trigger height 32 / 40 (`--control-height-sm/md`). Small also steps down to 14px text and a 16px icon. |
| `iconOnly` | `boolean` | `false` | Show only an icon - a Text icon-only Button. The overflow trigger for table rows, card headers and toolbars. |
| `icon` | `string` | `'more_vert'` | Material Symbols name for the icon-only trigger. |
| `open` | `boolean` | - | Open state. Controlled - pair with onOpenChange. |
| `defaultOpen` | `boolean` | `false` | Open on mount, when uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | - | Fired when the menu opens or closes. |
| `onSelect` | `(value: string, item: MenuItem) => void` | - | Fired with the chosen item's value (its label, unless set). |

Also accepts any native `<button>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<button>`. `className` and `style` go on the outermost element.

```ts
export interface MenuItem {
  label: string
  /** Passed to onSelect. Defaults to the label. */
  value?: string
  icon?: string
  /** Red text, for destructive actions. Put these last, after a divider. */
  danger?: boolean
  disabled?: boolean
  /** A separator line instead of an item; `label` is ignored. */
  divider?: boolean
  /** Fired when this item is chosen, before the menu-level onSelect. */
  onSelect?: () => void
}
```

**Accessibility** - role `menu`, keyboard operable. Trigger uses aria-haspopup="menu" and aria-expanded; An icon-only trigger is named by label, which says what it acts on: "Actions for Ada Lovelace"; Items use role="menuitem"; Arrow keys move, Enter selects, Escape closes; Outside click closes the menu.

**Do:** Use for grouped actions and overflow; Separate destructive actions with a divider; Start item labels with a verb.
**Don't:** Do not use for selecting a value - use Select; Do not nest menus more than one level.

**Choosing a variant:**
- `placement="BottomStart"`: A trigger at the left of a toolbar, such as the actions for selected candidates. The menu lines up with its left edge.
- `placement="BottomEnd"`: A trigger at the right edge, such as More in a page header or the actions on a table row, so the menu opens inward.
- `iconOnly`: The actions for one table row or one card, where a labelled trigger repeated on every row would crowd it. Name it for its row.
- `size="Small"`: Table rows and dense toolbars, beside Small buttons and inputs.

**Deprecated aliases** (do not use): `Dropdown menu`, `Action menu`, `Context menu`, `Overflow menu`

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

- The trigger takes `aria-haspopup="menu"`, `aria-expanded` and `aria-controls`; the panel is `role="menu"` with `role="menuitem"` buttons at `tabindex="-1"`.
- Focus stays on the trigger and the arrows move a highlight, so hover and the keyboard cursor must drive the same `--active` state.
- Separators are `role="separator"` and `aria-hidden`, 1px of `--border` with a 4px margin.
- Destructive items are `--error` text, never a red fill - a filled row reads as selected.
- The trigger is `--radius-sm`, like the buttons and fields beside it: 40px, or 32px with 14px text for Small. The panel is `--radius-md` on `--surface` with `--shadow-200` and a 180px floor, anchored 4px under the trigger. Bottom End flips it to `right: 0` for menus near the viewport edge.
- For row and card actions, use the icon-only trigger: a Text icon-only button with `more_vert`, keeping its hover fill while open. It shows no text, so its `aria-label` names the thing it acts on ("Actions for Ada Lovelace").
- Escape closes and returns focus to the trigger; an outside click closes without moving focus.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --error:                  #D32F2F;
  --success:                #2E7D32;
  --white:                  #ffffff;
  --gray-100:               #F7F7F7;
  --gray-200:               #EDEDED;
  --gray-300:               #D9D9D9;
  --gray-700:               #595959;
  --gray-900:               #272727;
  --orange-600:             #F2A202;
  --primary-focus-ring:     rgba(0, 64, 128, 0.3);
  --action-hover:           rgba(0, 0, 0, 0.04);
  --action-disabled:        rgba(0, 0, 0, 0.38);
  --text-primary:           rgba(0, 0, 0, 0.87);
  --surface:                var(--white);
  --border:                 var(--gray-200);
  --border-strong:          var(--gray-300);
  --control-height-sm:      32px;
  --control-height-md:      40px;
  --control-height-lg:      44px;
  --radius-sm:              4px;
  --radius-md:              8px;
  --shadow-200:             0px 8px 8px rgba(39, 39, 39, 0.08), 0px 4px 6px rgba(39, 39, 39, 0.12);
  --effect-button-shadow:   inset 0px -1px 0px rgba(0, 0, 0, 0.2), 0px 1px 0px rgba(0, 0, 0, 0.08);
  --border-width-default:   1px;
  --focus-ring-width:       2px;
  --focus-ring-offset:      2px;
  --focus-ring-color:       var(--primary);
  --duration-fast:          100ms;
  --easing-standard:        cubic-bezier(0.2, 0, 0, 1);
  --z-dropdown:             300;
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

.inspera-menu {
  position: relative;
  display: inline-block;
  font-family: var(--font-sans);
}

.inspera-menu__trigger {
  height: var(--control-height-md);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-strong);
  background: var(--white);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: none;
  transition: box-shadow 120ms ease;
}

.inspera-menu__trigger[aria-expanded='true'] {
  box-shadow: 0 0 0 3px var(--primary-focus-ring);
}

.inspera-menu__trigger .material-symbols-outlined {
  font-size: 20px;
  transition: transform 140ms ease;
}
.inspera-menu__trigger[aria-expanded='true'] .material-symbols-outlined { transform: rotate(180deg); }

/* Small: 32px, with 14px text and a 16px chevron, as a Small button. */
.inspera-menu__trigger--small {
  height: var(--control-height-sm);
  gap: 4px;
  padding: 0 8px;
  font-size: 14px;
}
.inspera-menu__trigger--small .material-symbols-outlined { font-size: 16px; }

/* Icon only (table rows, card headers, toolbars): the trigger is the canonical
   Text icon-only button with more_vert, and the menu sits beside it as usual. */

.inspera-menu__list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: auto;
  min-width: 180px;
  padding: 4px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-200);
  z-index: var(--z-dropdown, 20);
}

/* Bottom End aligns the panel's right edge to the trigger's, for a menu near
   the right edge of the viewport. */
.inspera-menu__list--end { left: auto; right: 0; }

.inspera-menu__item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
  text-align: left;
  cursor: pointer;
  opacity: 1;
  transition: background 120ms ease;
}

/* The highlight follows the keyboard cursor, so hover and arrow keys have to
   drive the same state. */
.inspera-menu__item--active,
.inspera-menu__item:hover:not(:disabled) { background: var(--action-hover); }

.inspera-menu__item--danger { color: var(--error); }

.inspera-menu__item:disabled {
  color: var(--action-disabled);
  cursor: not-allowed;
  opacity: 0.6;
}

.inspera-menu__item .material-symbols-outlined { font-size: 20px; }

.inspera-menu__separator {
  height: 1px;
  background: var(--border);
  margin: 4px 0;
}
```

```html
<div class="inspera-menu">
  <button type="button" class="inspera-menu__trigger"
          aria-haspopup="menu" aria-expanded="true" aria-controls="actions-menu">
    Actions
    <span class="material-symbols-outlined" aria-hidden="true">expand_more</span>
  </button>
  <div class="inspera-menu__list" id="actions-menu" role="menu" aria-label="Actions">
    <button type="button" class="inspera-menu__item inspera-menu__item--active" role="menuitem" tabindex="-1">
      <span class="material-symbols-outlined" aria-hidden="true">edit</span>Edit
    </button>
    <div class="inspera-menu__separator" role="separator" aria-hidden="true"></div>
    <button type="button" class="inspera-menu__item inspera-menu__item--danger" role="menuitem" tabindex="-1">
      <span class="material-symbols-outlined" aria-hidden="true">delete</span>Delete
    </button>
  </div>
</div>

<!-- Icon only, for a table row or a card: the trigger is named for what it acts on. -->
<div class="inspera-menu">
  <button type="button" class="inspera-btn inspera-btn--text inspera-btn--small inspera-btn--icon-only"
          aria-haspopup="menu" aria-expanded="false" aria-label="Actions for Ada Lovelace">
    <span class="material-symbols-outlined" aria-hidden="true">more_vert</span>
  </button>
</div>
```


### Stepper

Show progress through a sequence of steps. - category: `navigation`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Stepper } from '@inspera/kit'

<Stepper
  steps={[
    { label: 'Details', description: 'Assessment info' },
    { label: 'Questions', description: 'Add content' },
    { label: 'Settings', description: 'Rules & timing' },
    { label: 'Review', description: 'Publish' },
  ]}
  activeStep={1}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `steps` **(required)** | `Step[]` | - | Ordered steps. |
| `activeStep` | `number` | `0` | Zero-based index of the current step. Steps before it show as completed. |
| `orientation` | `'Horizontal' \| 'Vertical'` | `'Horizontal'` | Layout direction. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Indicator size. |

Also accepts any native `<ol>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<ol>`. `className` and `style` go on the outermost element.

```ts
export interface Step {
  label: string
  description?: string
}
```

**Accessibility** - role `list`. Use an ordered list for step semantics; Mark the current step with aria-current="step"; Convey completion with an icon, not colour alone.

**Do:** Use for multi-step flows and wizards; Show completed, current, and upcoming states; Keep step labels short.
**Don't:** Do not use for non-sequential navigation - use Tabs; Do not use more than a handful of steps.

**Choosing a variant:**
- `orientation="Horizontal"`: Across the top of a flow of a few steps, such as New test.
- `orientation="Vertical"`: Beside the content, when each step needs a line of detail, such as what is left before a test can be published.
- `size="Small"`: Inside dialogs and panels, such as importing candidates.

**Deprecated aliases** (do not use): `Wizard`, `Progress steps`, `Step indicator`

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

- It is an `<ol>`: the order is the meaning. The current step carries `aria-current="step"`.
- Steps take `flex: 1 1 auto`, never `flex: 1`. A zero basis gives every step the same total width, so a long label ends up with a stub connector while a short one gets a long run.
- Keep steps top-aligned. Centring makes the connector sit against the full step height and render down at label level instead of through the circles.
- The connector is offset by half the circle (`margin-top: 15px`, or 11px small) so it passes through the centres.
- Completed and current share the `--primary` fill; only the current one gets the 4px `--primary-focus-ring` halo. Completed shows a tick, upcoming shows its number.
- Indicators are 32px (24px small) and the connector is 2px, filled `--primary` behind completed steps and `--border` ahead of them.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:             #004080;
  --white:               #ffffff;
  --gray-200:            #EDEDED;
  --gray-300:            #D9D9D9;
  --gray-700:            #595959;
  --primary-focus-ring:  rgba(0, 64, 128, 0.3);
  --text-primary:        rgba(0, 0, 0, 0.87);
  --text-secondary:      var(--gray-700);
  --border:              var(--gray-200);
  --border-strong:       var(--gray-300);
  --muted-foreground:    var(--gray-700);
  --radius-pill:         9999px;
  --font-sans:           'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-stepper {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 0;
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
  font-family: var(--font-sans);
}

.inspera-stepper--vertical {
  flex-direction: column;
  align-items: stretch;
  width: auto;
}

/* The step lays out body-then-connector along the stepper's own axis, so a
   horizontal stepper puts them in a row and a vertical one stacks them. Note
   this is the opposite of the body inside it, which stacks the circle over the
   label horizontally and sits them side by side vertically. */
.inspera-stepper__step {
  display: flex;
  flex-direction: row;
  /* Always top-aligned. Centring makes the horizontal connector sit against the
     full step height and render down at label level instead of through the
     circles. */
  align-items: flex-start;
  /* "1 1 auto", not "1": a zero basis gives every step the same total width, so
     a long label leaves a stub of a connector while a short one gets a long
     run. Growing from the content width shares the free space evenly. */
  flex: 1 1 auto;
  min-width: 0;
}

.inspera-stepper__step:last-child { flex: none; }
.inspera-stepper--vertical .inspera-stepper__step { flex-direction: column; flex: none; }

.inspera-stepper__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.inspera-stepper--vertical .inspera-stepper__body {
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
}

.inspera-stepper__indicator {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: var(--radius-pill);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  background: transparent;
  color: var(--text-secondary);
  border: 2px solid var(--border-strong);
  box-shadow: none;
  transition: background 140ms ease, box-shadow 140ms ease;
}

.inspera-stepper--small .inspera-stepper__indicator { width: 24px; height: 24px; }

/* Done and current share the fill; only the current one gets the halo. */
.inspera-stepper__indicator--done,
.inspera-stepper__indicator--active {
  background: var(--primary);
  color: var(--white);
  border: none;
}

.inspera-stepper__indicator--active { box-shadow: 0 0 0 4px var(--primary-focus-ring); }

.inspera-stepper__indicator .material-symbols-outlined { font-size: 18px; }

.inspera-stepper__text {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: center;
}
.inspera-stepper--vertical .inspera-stepper__text { text-align: left; }

/* The indicator is decorative, so each step's status is spoken here. */
.inspera-stepper__status {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

.inspera-stepper__label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
}
.inspera-stepper--small .inspera-stepper__label { font-size: 13px; }

.inspera-stepper__step--done .inspera-stepper__label,
.inspera-stepper__step--active .inspera-stepper__label {
  font-weight: 600;
  color: var(--text-primary);
}

.inspera-stepper__description {
  font-size: 12px;
  color: var(--muted-foreground);
}

/* The connector is nudged by half the circle so it runs through the centres
   rather than under the labels. */
.inspera-stepper__connector {
  height: 2px;
  flex: 1;
  margin: 0 8px;
  margin-top: 15px;
  background: var(--border);
}

.inspera-stepper--small .inspera-stepper__connector { margin-top: 11px; }

.inspera-stepper__connector--done { background: var(--primary); }

.inspera-stepper--vertical .inspera-stepper__connector {
  width: 2px;
  height: auto;
  flex: 1;
  min-height: 20px;
  margin: 4px 0;
  margin-left: 15px;
}
.inspera-stepper--vertical.inspera-stepper--small .inspera-stepper__connector { margin-left: 11px; }
```

```html
<ol class="inspera-stepper" role="list">
  <li class="inspera-stepper__step inspera-stepper__step--done">
    <div class="inspera-stepper__body">
      <span class="inspera-stepper__indicator inspera-stepper__indicator--done" aria-hidden="true">
        <span class="material-symbols-outlined">check</span>
      </span>
      <span class="inspera-stepper__text">
        <span class="inspera-stepper__label">Details</span>
        <span class="inspera-stepper__description">Assessment info</span>
      </span>
    </div>
    <span class="inspera-stepper__connector inspera-stepper__connector--done" aria-hidden="true"></span>
  </li>
  <li class="inspera-stepper__step inspera-stepper__step--active" aria-current="step">
    <div class="inspera-stepper__body">
      <span class="inspera-stepper__indicator inspera-stepper__indicator--active" aria-hidden="true">2</span>
      <span class="inspera-stepper__text">
        <span class="inspera-stepper__label">Questions</span>
      </span>
    </div>
  </li>
</ol>
```


### Link

Navigate to another location or resource. - category: `navigation`.

> `@inspera/kit` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Link } from '@inspera/kit'

<Link
  href="/docs"
  label="Learn more"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `href` **(required)** | `string` | - | Destination URL. Always a real one - use a Button for actions. |
| `children` | `ReactNode` | - | Link text. |
| `label` | `string` | - | Link text, when not passing children. |
| `intent` | `'Default' \| 'Muted'` | `'Default'` | Colour emphasis. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Text size. |
| `underline` | `'Always' \| 'Hover' \| 'None'` | `'Hover'` | Underline behaviour. |
| `external` | `boolean` | `false` | Open in a new tab, with an icon and a spoken "opens in a new tab". |
| `disabled` | `boolean` | `false` | Non-interactive state. |
| `leadingIcon` | `string` | - | Material Symbols name shown before the text. |
| `trailingIcon` | `string` | - | Material Symbols name shown after the text. |
| `onClick` | `(e: MouseEvent<HTMLAnchorElement>) => void` | - | Fired on activation. Use for client-side routing, not to replace href. |

Also accepts any native `<a>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<a>`. `className` and `style` go on the outermost element.

**Accessibility** - role `link`, keyboard operable. Use a real anchor with a valid href; External links set target="_blank" and rel="noreferrer"; Disabled links set aria-disabled and prevent navigation; Focus ring is visible on keyboard focus.

**Do:** Use for navigation, not actions; Signal external links with an icon; Keep link text descriptive.
**Don't:** Do not use links to trigger actions - use Button; Do not use "click here" as link text.

**Choosing a variant:**
- `intent="Muted"`: Secondary links that should not compete, such as the links at the foot of a page.
- `size="Small"`: Tables, captions and other 14px text, such as test titles in a roster.
- `underline="Hover"`: Links that stand apart from other text, such as one under a card. The underline appears on hover. The default.
- `underline="Always"`: Links inside a sentence, where colour alone would not set them apart from the words around them.
- `underline="None"`: Only where the layout already says it is a link, such as the items of a side navigation.
- `external`: Opens another site in a new tab, such as a download from a supplier. The icon says so.
- `disabled`: The page isn't available yet, such as results before marking ends. Say when it will be.

**Deprecated aliases** (do not use): `Hyperlink`, `Text link`, `Anchor`

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

- The default is underline **on hover only** - not always, and not never.
- Colour is `--primary` at 16px/500 (14px when small), with `text-underline-offset: 2px` so the rule clears the descenders.
- An external link gets `target="_blank"`, `rel="noreferrer"`, and the `open_in_new` icon. All three, not one.
- A disabled link carries no `href` and sets `aria-disabled="true"`. Do not leave the href and swallow the click.
- The focus ring is `--primary-focus-ring` at 2px with a 2px offset - different from the solid `--primary` ring buttons use.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:            #004080;
  --gray-700:           #595959;
  --action-disabled:    rgba(0, 0, 0, 0.38);
  --text-secondary:     var(--gray-700);
  --radius-xs:          2px;
  --focus-ring-width:   2px;
  --focus-ring-offset:  2px;
  --focus-ring-color:   var(--primary);
  --duration-fast:      100ms;
  --easing-standard:    cubic-bezier(0.2, 0, 0, 1);
  --font-sans:          'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--primary);
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  text-underline-offset: 2px;
  border-radius: var(--radius-xs);
  cursor: pointer;
  transition: color var(--duration-fast) var(--easing-standard);
}

.inspera-link--small { font-size: 14px; }

.inspera-link--muted { color: var(--text-secondary); }

/* Underline behaviour. Hover is the default; the other two are explicit. */
.inspera-link:hover { text-decoration: underline; }
.inspera-link--underline-always { text-decoration: underline; }
.inspera-link--underline-none:hover { text-decoration: none; }

.inspera-link:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

/* "(opens in a new tab)" for screen readers - the icon alone says nothing. */
.inspera-link__hint {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

/* Disabled: no href, announced with aria-disabled. A link with no href is not
   focusable, which is the behaviour you want. */
.inspera-link--disabled {
  color: var(--action-disabled);
  cursor: not-allowed;
  text-decoration: none;
}
.inspera-link--disabled:hover { text-decoration: none; }

.inspera-link .material-symbols-outlined { font-size: 18px; }
.inspera-link--small .material-symbols-outlined { font-size: 16px; }
```

```html
<a class="inspera-link" href="/docs">Learn more</a>

<!-- External links open in a new tab and say so with an icon. -->
<a class="inspera-link" href="https://inspera.com" target="_blank" rel="noreferrer">
  Documentation
  <span class="material-symbols-outlined" aria-hidden="true">open_in_new</span>
</a>

<a class="inspera-link inspera-link--muted inspera-link--small" href="/skip">Skip for now</a>

<!-- Disabled: no href at all. -->
<a class="inspera-link inspera-link--disabled" aria-disabled="true">Unavailable</a>
```

