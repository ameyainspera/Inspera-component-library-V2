<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Breadcrumb

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

### Breadcrumb

Show the user's current location in a hierarchy. - category: `navigation`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Breadcrumb } from '@inspera/components'

<Breadcrumb
  items={['Home', 'Assessments', 'Algebra Quiz']}
  separator="Chevron"
  size="Medium"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `string[]` | `defaultItems` | Trail from root to current page. The last entry is the current page and is not a link. |
| `separator` | `'Slash' \| 'Chevron'` | `'Chevron'` | Divider glyph between items. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Text size 14 / 16. |
| `onNavigate` | `(index: number) => void` | - | Fired with the index of the crumb that was clicked. |

**Accessibility** - role `navigation`, keyboard operable. Wrap in nav with aria-label="Breadcrumb"; Use an ordered list for semantic structure; Mark current page with aria-current="page".

**Do:** Use for hierarchical navigation structures; Always include the current page as the last item; Keep breadcrumb labels concise.
**Don't:** Do not use for flat navigation; Do not make the current page breadcrumb a link.

**Deprecated aliases** (do not use): `Breadcrumbs`, `Path navigation`

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

- It is a `<nav aria-label="Breadcrumb">` wrapping an `<ol>` - order is the meaning, so not a `<div>` of spans.
- The last crumb is the current page: `aria-current="page"`, `--text-primary` at 500 weight, and not a control.
- Separators live in their own `<li>` marked `aria-hidden="true"`. Left announced, a screen reader reads "chevron right" between every crumb.
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

/* The separator sizes its own glyph rather than setting a size on the <li>,
   so the chevron can run 2px larger than the text while the slash matches it. */
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
    <li><a class="inspera-breadcrumb__crumb" href="/">Home</a></li>
    <li class="inspera-breadcrumb__separator" aria-hidden="true">
      <span class="material-symbols-outlined">chevron_right</span>
    </li>
    <li><a class="inspera-breadcrumb__crumb" href="/assessments">Assessments</a></li>
    <li class="inspera-breadcrumb__separator" aria-hidden="true">
      <span class="material-symbols-outlined">chevron_right</span>
    </li>
    <li><span class="inspera-breadcrumb__current" aria-current="page">Algebra Quiz</span></li>
  </ol>
</nav>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
