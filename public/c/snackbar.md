<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Snackbar

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

### Snackbar

Show brief, non-blocking feedback at the bottom of the screen. - category: `feedback`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Snackbar } from '@inspera/components'

<Snackbar
  intent="Neutral"
  message="Assessment saved."
  hasAction={false}
  hasClose={true}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `message` | `string` | `'Assessment saved successfully.'` | What happened. One short sentence. |
| `intent` | `'Neutral' \| 'Info' \| 'Success' \| 'Warning' \| 'Error'` | `'Neutral'` | Accent icon color. |
| `hasAction` | `boolean` | `false` | Show an inline action (e.g. Undo). |
| `hasClose` | `boolean` | `true` | Show the dismiss button. |
| `actionLabel` | `string` | `'Undo'` | Label for the inline action, typically "Undo". |
| `onAction` | `() => void` | - | Fired when the inline action is activated. |
| `onClose` | `() => void` | - | Fired when dismissed. |

**Accessibility** - role `status`, keyboard operable. Use role="status" with aria-live="polite"; Action button must be focusable; Auto-dismiss timing must be generous (5s minimum).

**Do:** Use for brief confirmation messages; Include an undo action when appropriate; Limit to one snackbar at a time.
**Don't:** Do not use for critical errors - use Alert or Dialog instead; Do not stack multiple snackbars.

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
  min-width: 300px;
  max-width: 480px;
  height: 48px;
  padding: 0 8px 0 16px;
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
  color: rgba(255, 255, 255, 0.7);
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


---

Tokens: ./tokens.css | Full system: ./llms.txt
