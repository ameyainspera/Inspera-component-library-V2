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
  size="Medium"
  title="Dialog title"
  hasCloseButton={true}
  hasActions={true}
  onClose={() => setOpen(false)}
  onConfirm={handleConfirm}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `'Dialog title'` | Dialog heading. Also the accessible name. |
| `body` | `ReactNode` | `'This is the dialog body. Provide context or a clear description of the action the user is about to take.'` | Dialog content. |
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Medium'` | Panel width 400 / 480 / 560. |
| `hasCloseButton` | `boolean` | `true` | Show the header close affordance. |
| `hasActions` | `boolean` | `true` | Show the footer action buttons. |
| `confirmLabel` | `string` | `'Continue'` | Label for the confirming action. Name the action - "Delete", not "OK". |
| `cancelLabel` | `string` | `'Cancel'` | Label for the dismissing action. |
| `open` | `boolean` | `true` | Whether the dialog is shown. Controlled - pair with onClose. |
| `embedded` | `boolean` | `false` | Render just the panel (no overlay) - used for documentation previews. |
| `onClose` | `() => void` | - | Fired on the close button, the overlay, and Escape. |
| `onConfirm` | `() => void` | - | Fired when the confirming action is activated. |

**Accessibility** - role `dialog`, keyboard operable. Use role="dialog" with aria-modal="true"; Set aria-labelledby to the dialog title; Trap focus inside the dialog when open; Return focus to trigger element on close; Escape key closes the dialog.

**Do:** Use for confirmations and critical decisions; Always provide a way to close the dialog; Keep dialog content focused and concise.
**Don't:** Do not open dialogs from other dialogs; Do not use for non-blocking information - use Alert instead.

**Deprecated aliases** (do not use): `Modal`, `Popup`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- Widths are exactly 400 / 480 / 560 with `max-width: 100%`, `--radius-lg` and `--shadow-500`.
- Wrap the panel in the scrim. `rgba(39,39,39,0.48)`, fixed, full-viewport, at `--z-modal`. Without it the page behind stays clickable and this is a floating card, not a modal.
- `role="dialog"` with `aria-modal="true"` and `aria-labelledby` pointing at the title id. Generate a unique id - a hardcoded one collides the moment two dialogs exist on a page.
- Behaviour the markup cannot express, and that you must add: move focus into the panel on open, trap Tab inside it, return focus to the trigger on close, close on Escape and on a scrim click, and lock body scroll while open.
- The title is 22.78px/500 - an exact export from Figma, not a rounded 24.
- Name the confirming action for what it does ("Delete"), never "OK".

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:       #004080;
  --white:         #ffffff;
  --gray-200:      #EDEDED;
  --gray-900:      #272727;
  --text-primary:  rgba(0, 0, 0, 0.87);
  --border:        var(--gray-200);
  --radius-sm:     4px;
  --radius-lg:     12px;
  --radius-pill:   9999px;
  --shadow-500:    0px 10px 32px rgba(39, 39, 39, 0.1), 0px 6px 14px rgba(39, 39, 39, 0.12);
  --z-modal:       600;
  --font-sans:     'Inter', system-ui, -apple-system, sans-serif;
}

/* The scrim. Fixed, full-viewport, and it closes the dialog when clicked. */
.inspera-dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(39, 39, 39, 0.48);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: var(--z-modal, 1000);
}

.inspera-dialog {
  width: 480px;
  max-width: 100%;
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
}

.inspera-dialog__title {
  margin: 0;
  font-size: 22.78px;
  font-weight: 500;
  line-height: 1.12;
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

.inspera-dialog__body {
  padding: 32px;
  font-size: 16px;
  line-height: 20px;
  color: var(--gray-900);
}

.inspera-dialog__footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid var(--border);
  flex-wrap: wrap;
}

.inspera-dialog__action {
  padding: 12px;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  color: var(--primary);
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  cursor: pointer;
}

.inspera-dialog__action--confirm {
  background: var(--primary);
  color: var(--white);
  box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.08), inset 0px -1px 0px 0px rgba(0, 0, 0, 0.2);
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
      <button type="button" class="inspera-dialog__action">Cancel</button>
      <button type="button" class="inspera-dialog__action inspera-dialog__action--confirm">Delete</button>
    </div>
  </div>
</div>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
