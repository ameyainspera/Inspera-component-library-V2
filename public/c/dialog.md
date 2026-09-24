<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Dialog

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
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Medium'` | Panel width 400 / 480 / 560. |
| `hasCloseButton` | `boolean` | `true` | Show the header close button. |
| `hasActions` | `boolean` | `true` | Show the footer action buttons. |
| `confirmLabel` | `string` | `'Continue'` | Label for the confirming action. Name the action - "Delete", not "OK". |
| `cancelLabel` | `string` | `'Cancel'` | Label for the dismissing action. |
| `onClose` | `() => void` | - | Fired on the close button, Cancel, the scrim, and Escape. |
| `onConfirm` | `() => void` | - | Fired when the confirming action is activated. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

**Accessibility** - role `dialog`, keyboard operable. Use role="dialog" with aria-modal="true"; Set aria-labelledby to the dialog title; Trap focus inside the dialog when open; Return focus to trigger element on close; Escape key closes the dialog.

**Do:** Use for confirmations and critical decisions; Always provide a way to close the dialog; Keep dialog content focused and concise.
**Don't:** Do not open dialogs from other dialogs; Do not use for non-blocking information - use Alert instead.

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

- Widths are exactly 400 / 480 / 560 with `max-width: 100%`, `--radius-lg` and `--shadow-500`.
- Wrap the panel in the scrim: `--scrim`, fixed, full-viewport, at `--z-modal`. Without it the page behind stays clickable and this is a floating card, not a modal.
- The footer actions are the canonical Button - `inspera-btn--text` to cancel, `inspera-btn--primary` (or `--destructive`) to confirm. Do not style dialog buttons separately.
- `role="dialog"` with `aria-modal="true"` and `aria-labelledby` pointing at the title id. Generate a unique id - a hardcoded one collides the moment two dialogs exist on a page.
- Behaviour the markup cannot express, and that you must add: move focus into the panel on open, trap Tab inside it, return focus to the trigger on close, close on Escape and on a scrim click, and lock body scroll while open.
- The title uses the `--h2-*` type tokens (22.78px/500) - an exact export from Figma, not a rounded 24.
- Name the confirming action for what it does ("Delete"), never "OK".

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:               #004080;
  --error:                 #D32F2F;
  --warning:               #EF6C00;
  --success:               #2E7D32;
  --white:                 #ffffff;
  --gray-100:              #F7F7F7;
  --gray-200:              #EDEDED;
  --gray-700:              #595959;
  --gray-900:              #272727;
  --text-primary:          rgba(0, 0, 0, 0.87);
  --border:                var(--gray-200);
  --scrim:                 rgba(39, 39, 39, 0.48);
  --radius-sm:             4px;
  --radius-lg:             12px;
  --radius-pill:           9999px;
  --shadow-500:            0px 10px 32px rgba(39, 39, 39, 0.1), 0px 6px 14px rgba(39, 39, 39, 0.12);
  --effect-button-shadow:  inset 0px -1px 0px rgba(0, 0, 0, 0.2), 0px 1px 0px rgba(0, 0, 0, 0.08);
  --border-width-default:  1px;
  --focus-ring-width:      2px;
  --focus-ring-offset:     2px;
  --focus-ring-color:      var(--primary);
  --duration-fast:         100ms;
  --easing-standard:       cubic-bezier(0.2, 0, 0, 1);
  --z-modal:               600;
  --font-sans:             'Inter', system-ui, -apple-system, sans-serif;
  --h2-size:               22.78px;
  --h2-weight:             500;
  --h2-line-height:        1.12;
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
  height: 40px;
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

/* Sizes change height, padding and gap only - never the 16px type. */
.inspera-btn--small { height: 32px; padding: 0 12px; gap: 6px; }
.inspera-btn--large { height: 48px; padding: 0 24px; gap: 10px; }

/* Icon only: a square the height of the button. It still needs aria-label. */
.inspera-btn--icon-only { width: 40px; min-width: 0; padding: 0; }
.inspera-btn--small.inspera-btn--icon-only { width: 32px; }
.inspera-btn--large.inspera-btn--icon-only { width: 48px; }

/* Solid intents differ only in fill; hover and pressed derive from it. */
.inspera-btn--primary     { --btn-bg: var(--primary); }
.inspera-btn--success     { --btn-bg: var(--success); }
.inspera-btn--warning     { --btn-bg: var(--warning); }
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

.inspera-dialog--small { width: 400px; }
.inspera-dialog--large { width: 560px; }

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


---

Tokens: ./tokens.css | Full system: ./llms.txt
