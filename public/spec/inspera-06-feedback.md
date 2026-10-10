<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera Design System - Feedback

> Version 1.0.0. Part 6 of 7 of the AI spec: Alert, Dialog, Snackbar, Toast, Command Palette, Tooltip, Progress, Spinner, Skeleton, Popover, Drawer.
>
> These specs build on `inspera-01-core.md` - its rules, its setup
> (fonts, icon class, tokens) and its foundations. If that file is not in your
> context, ask for it before building. Without it, fonts, icons and colours
> come out wrong.

## Components - feedback

### Alert

Display semantic inline feedback. - category: `feedback`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Alert } from '@inspera/components'

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

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Dialog } from '@inspera/components'

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

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Snackbar } from '@inspera/components'

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

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { ToastProvider } from '@inspera/components'

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

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { CommandPalette } from '@inspera/components'

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

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Tooltip } from '@inspera/components'

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

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Progress } from '@inspera/components'

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

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Spinner } from '@inspera/components'

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

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Skeleton } from '@inspera/components'

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

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Popover } from '@inspera/components'

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

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Drawer } from '@inspera/components'

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

