<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Tag

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

### Tag

Label, categorize, or filter with a removable chip. - category: `data-display`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Tag } from '@inspera/components'

<Tag
  label="Neutral"
  intent="Neutral"
  size="Medium"
  removable={false}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Tag text. |
| `intent` | `'Neutral' \| 'Info' \| 'Success' \| 'Warning' \| 'Error'` | `'Neutral'` | Semantic color. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Tag height. |
| `removable` | `boolean` | `false` | Show a remove affordance. |
| `leadingIcon` | `string` | - | Optional leading icon. |
| `onRemove` | `() => void` | - | Fired when the remove control is activated. Set removable as well. |
| `onClick` | `() => void` | - | Fired when the tag itself is activated. |

**Accessibility** - role `status`, keyboard operable. Removable tags expose a button with aria-label "Remove {label}"; Interactive tags must be keyboard focusable; Use aria-label for icon-only tags.

**Do:** Use for filters, categories, and selections; Keep labels to 1-2 words; Provide a remove control when tags are dismissible.
**Don't:** Do not use for status that never changes - use Badge; Do not pack long text into a tag.

**Deprecated aliases** (do not use): `Chip`, `Pill`, `Label`

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

- Identical geometry to Badge: 24px tall (20px small), full pill radius, 12px/500 type.
- The remove control is a `<button>` with `aria-label="Remove <label>"` - never a bare icon span, and never just "close".
- The leading icon is filled (`FILL 1`); the close icon is not.
- A tag with no `onClick` is a `<span>` and takes `cursor: default`. Only a clickable tag becomes a `<button>`.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --error:            #D32F2F;
  --warning:          #EF6C00;
  --info:             #0288D1;
  --success:          #2E7D32;
  --gray-900:         #272727;
  --info-surface:     #E1F5FE;
  --success-surface:  #E8F5E9;
  --warning-surface:  #FFF3E0;
  --error-surface:    #FFEBEE;
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
.inspera-tag--info    { --tag-bg: var(--info-surface);    --tag-fg: var(--info); }
.inspera-tag--success { --tag-bg: var(--success-surface); --tag-fg: var(--success); }
.inspera-tag--warning { --tag-bg: var(--warning-surface); --tag-fg: var(--warning); }
.inspera-tag--error   { --tag-bg: var(--error-surface);   --tag-fg: var(--error); }

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


---

Tokens: ./tokens.css | Full system: ./llms.txt
