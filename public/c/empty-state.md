<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Empty State

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

### Empty State

Communicate the absence of content and offer a next step. - category: `data-display`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { EmptyState } from '@inspera/components'

<EmptyState
  icon="inbox"
  title="No assessments yet"
  description="Create your first assessment."
  actionLabel="New assessment"
  size="Medium"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | `string` | `'inbox'` | Material Symbols icon name. |
| `title` | `string` | `'No results found'` | Primary message. |
| `description` | `string` | `'Try adjusting your filters or search terms.'` | Supporting explanation. |
| `actionLabel` | `string` | - | Optional primary action label. |
| `onAction` | `() => void` | - | Fired when the action is activated. Only rendered when actionLabel is set. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Overall scale. |

**Accessibility** - role `status`, keyboard operable. Announce dynamically-appearing empty states with role="status"; The action must be a real focusable button; The illustration/icon is decorative (aria-hidden).

**Do:** Explain why the area is empty; Offer a clear next action when possible; Keep the tone helpful.
**Don't:** Do not leave empty areas blank with no guidance; Do not use for transient loading - use Skeleton.

**Deprecated aliases** (do not use): `Blank slate`, `Zero state`, `No data`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- The icon sits in an 80px circle of `--gray-100` (56px when small). Without the circle it reads as a broken image.
- Title 18px/500, body 14px `--muted-foreground` capped at 320px so it wraps to two short lines rather than one long one.
- The action is the ordinary Button component, not a bespoke link.
- Carry `role="status"` so the empty result is announced when a filter clears the list.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:               #004080;
  --error:                 #D32F2F;
  --warning:               #EF6C00;
  --success:               #2E7D32;
  --white:                 #ffffff;
  --gray-100:              #F7F7F7;
  --gray-600:              #7A7A7A;
  --gray-700:              #595959;
  --gray-900:              #272727;
  --text-primary:          rgba(0, 0, 0, 0.87);
  --muted-foreground:      var(--gray-600);
  --radius-sm:             4px;
  --effect-button-shadow:  inset 0px -1px 0px rgba(0, 0, 0, 0.2), 0px 1px 0px rgba(0, 0, 0, 0.08);
  --border-width-default:  1px;
  --focus-ring-width:      2px;
  --focus-ring-offset:     2px;
  --focus-ring-color:      var(--primary);
  --duration-fast:         100ms;
  --easing-standard:       cubic-bezier(0.2, 0, 0, 1);
  --font-sans:             'Inter', system-ui, -apple-system, sans-serif;
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
<div class="inspera-empty" role="status">
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


---

Tokens: ./tokens.css | Full system: ./llms.txt
