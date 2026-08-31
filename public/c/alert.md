<!-- Inspera Design System v1.0.0 — generated file, do not edit. -->

# Inspera — Alert

1. Do not invent design decisions. Never invent a colour, spacing value, radius, shadow, font size, weight, icon library, focus style, breakpoint, or component variant that this document defines.
2. Use a canonical component before building a lookalike. If one exists for the job, use it.
3. Never rename a canonical component or prop. A deprecated alias may be understood as input, but output must use the canonical name.
4. Consume tokens, not literals. Raw values here define what a token resolves to; application code references `var(--token)`.
5. Do not introduce another design system. No Material UI, Bootstrap, Ant, Chakra, shadcn default styling, Tailwind default palette, or Radix Themes look. Headless behaviour libraries are fine if restyled entirely to this spec.
6. No arbitrary Tailwind values where a token exists. Never `bg-[#004080]` — use the token.
7. Inter for product UI. Noto Sans Mono only for code, identifiers and technical values; Noto Serif only for long-form content.
8. Material Symbols Outlined only. Do not mix in Lucide, Heroicons, or Font Awesome.
9. Accessibility is part of the component contract, not an enhancement. Keyboard operation, visible focus, labels, roles, names, and states are required.
10. Never use colour alone to carry meaning. Pair it with text, an icon, or shape.
11. Respect `prefers-reduced-motion: reduce` — drop non-essential motion.
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

### Alert

Display semantic inline feedback. — category: `feedback`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library — build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Alert } from '@inspera/components'

<Alert
  intent="Info"
  title="Heads up"
  message="…"
  layout="Simple"
  background={true}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `'Heads up'` | Short headline stating what happened. |
| `message` | `string` | `'This is a contextual inline message that matches the intent severity.'` | Supporting detail. Keep it to one or two sentences. |
| `intent` | `'Info' \| 'Success' \| 'Warning' \| 'Error'` | `'Info'` | Severity / color. |
| `layout` | `'Simple' \| 'With CTA' \| 'With Close' \| 'With CTA + Close'` | `'Simple'` | Action affordances. |
| `background` | `boolean` | `true` | Tinted fill vs. left-accent only. |
| `ctaLabel` | `string` | `'View details'` | Label for the inline action. Only rendered by the "With CTA" layouts. |
| `onCta` | `() => void` | — | Fired when the inline action is activated. |
| `onClose` | `() => void` | — | Fired when the alert is dismissed. Only rendered by the "With Close" layouts. |

**Accessibility** — role `alert`, keyboard operable. Error and Warning announce as role="alert"; Info and Success as a polite role="status" — never both on one element, since role="alert" already implies assertive; Close button must have aria-label="Close alert".

**Do:** Use for contextual inline messages; Match intent to message severity; Keep alert text concise.
**Don't:** Do not stack more than 2 alerts in the same area; Do not use alerts for permanent content.

#### Without the package — exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- Each intent pairs the `*-surface` tint as background with the solid colour as both border and icon.
- The live region follows severity: Error and Warning use `role="alert"`, Info and Success use `role="status"` with `aria-live="polite"`. Never put `role="alert"` and `aria-live="polite"` on the same element — alert already implies assertive.
- The icon is filled (`FILL 1`) at 20px, nudged 1px down so it sits on the title baseline.
- Without the tint, the accent becomes a 4px left border and the other three sides stay 1px.
- The close button needs `aria-label="Close alert"` — an unlabelled × announces as nothing.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --error:            #D32F2F;
  --warning:          #EF6C00;
  --info:             #0288D1;
  --success:          #2E7D32;
  --gray-700:         #595959;
  --action-active:    rgba(0, 0, 0, 0.56);
  --text-primary:     rgba(0, 0, 0, 0.87);
  --info-surface:     #E1F5FE;
  --success-surface:  #E8F5E9;
  --warning-surface:  #FFF3E0;
  --error-surface:    #FFEBEE;
  --radius-md:        8px;
  --font-sans:        'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-alert {
  --alert-bg: var(--info-surface);
  --alert-fg: var(--info);

  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  max-width: 100%;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  background: var(--alert-bg);
  border: 1px solid var(--alert-fg);
  color: var(--text-primary);
  font-family: var(--font-sans);
}

.inspera-alert--info    { --alert-bg: var(--info-surface);    --alert-fg: var(--info); }
.inspera-alert--success { --alert-bg: var(--success-surface); --alert-fg: var(--success); }
.inspera-alert--warning { --alert-bg: var(--warning-surface); --alert-fg: var(--warning); }
.inspera-alert--error   { --alert-bg: var(--error-surface);   --alert-fg: var(--error); }

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


---

Tokens: ./tokens.css · Full system: ./llms.txt
