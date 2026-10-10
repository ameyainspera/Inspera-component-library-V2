<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Toast

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


---

Tokens: ./tokens.css | Full system: ./llms.txt
