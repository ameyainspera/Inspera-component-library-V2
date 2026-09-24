<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Button

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

### Button

Trigger an action. - category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Button } from '@inspera/components'

<Button
  label="Button"
  intent="Primary"
  size="Medium"
  content="Text"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Button'` | The button text. Start with a verb - "Save", not "OK". |
| `intent` | `'Primary' \| 'Secondary' \| 'Outline' \| 'Text' \| 'Success' \| 'Warning' \| 'Destructive'` | `'Primary'` | Visual role / semantic weight. |
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Medium'` | Height 32 / 40 / 48. |
| `state` | `'Default' \| 'Hover' \| 'Focused' \| 'Pressed' \| 'Disabled'` | - | Freezes a visual state so documentation can show it without a pointer. Leave unset in application code - hover, focus and active are handled in CSS and work on their own. |
| `content` | `'Text' \| 'Icon + Text' \| 'Text + Icon' \| 'Text + Disclosure'` | `'Text'` | Label / icon composition. |
| `icon` | `string` | `'add'` | Material Symbols name. Only rendered by the icon-bearing content variants. |
| `onClick` | `() => void` | - | Fired on click and on Enter or Space. |

**Accessibility** - role `button`, keyboard operable. Icon-only buttons must have an accessible label.

**Do:** Use Primary for main actions; Use Secondary for alternative actions; Use Destructive only for destructive flows.
**Don't:** Do not create separate component files per intent; Do not use deprecated alias names.

**Deprecated aliases** (do not use): `Primary button`, `Secondary button`, `Outline button`, `Text button`, `Success button`, `Warning button`

#### One-time setup

Paste this once, at the root of the project. Without it the component inherits
the host tool's fonts and any icon renders as its own name instead of a glyph.

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Noto+Sans+Mono:wght@400;500&family=Noto+Serif:wght@400;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');

.material-symbols-outlined,
.material-symbols-rounded,
.material-symbols-sharp {
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
}

.material-symbols-outlined { font-family: 'Material Symbols Outlined'; }
.material-symbols-rounded  { font-family: 'Material Symbols Rounded'; }
.material-symbols-sharp    { font-family: 'Material Symbols Sharp'; }
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
  --primary:               #004080;
  --error:                 #D32F2F;
  --warning:               #EF6C00;
  --success:               #2E7D32;
  --white:                 #ffffff;
  --gray-100:              #F7F7F7;
  --gray-700:              #595959;
  --gray-900:              #272727;
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


---

Tokens: ./tokens.css | Full system: ./llms.txt
