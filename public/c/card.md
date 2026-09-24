<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Card

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

### Card

Group related content in a contained surface. - category: `data-display`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Card } from '@inspera/components'

<Card
  title="Algebra Quiz"
  elevation="Raised"
  padding="Default"
  interactive={false}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `'Card title'` | Optional heading for the card. |
| `body` | `string` | `'Group related content in a contained surface using consistent padding and elevation.'` | Short body copy. For anything richer, pass children instead. |
| `elevation` | `'Flat' \| 'Raised' \| 'Outlined'` | `'Raised'` | Surface treatment. |
| `padding` | `'Compact' \| 'Default' \| 'Spacious'` | `'Default'` | Internal padding (12 / 16 / 24). |
| `interactive` | `boolean` | `false` | Renders as a focusable button with hover elevation. |
| `children` | `ReactNode` | - | Card contents. Takes precedence over title and body. |
| `onClick` | `() => void` | - | Fired when an interactive card is activated. Set interactive as well, or there is no affordance. |

**Accessibility** - role `article`, keyboard operable. Interactive cards should use role="button" or be wrapped in an anchor; Non-interactive cards use role="article" or a semantic section.

**Do:** Use to group related content; Maintain consistent padding within a view; Use raised elevation for primary content cards.
**Don't:** Do not nest cards inside other cards; Do not use cards for layout-only purposes without content.

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

- Radius is `--radius-lg`. Padding is 12 / 16 / 24 for Compact / Default / Spacious.
- Flat has neither border nor shadow, Raised adds `--shadow-200`, Outlined adds a 1px `--border-strong`. Never both a shadow and a strong border.
- The transparent 1px border at rest is deliberate: without it, Outlined would be 2px wider than Flat.
- An interactive card is a `<button>`. A `<div>` with a click handler is not keyboard operable and will fail review.
- Title 16px/500, body 16px/1.4 in `--gray-700` - the body is not smaller than the title.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:            #004080;
  --white:              #ffffff;
  --gray-300:           #D9D9D9;
  --gray-700:           #595959;
  --text-primary:       rgba(0, 0, 0, 0.87);
  --border-strong:      var(--gray-300);
  --radius-lg:          12px;
  --shadow-200:         0px 8px 8px rgba(39, 39, 39, 0.08), 0px 4px 6px rgba(39, 39, 39, 0.12);
  --shadow-300:         0px 8px 16px rgba(39, 39, 39, 0.08), 0px 6px 8px rgba(39, 39, 39, 0.12);
  --focus-ring-width:   2px;
  --focus-ring-offset:  2px;
  --focus-ring-color:   var(--primary);
  --font-sans:          'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 16px;
  border-radius: var(--radius-lg);
  background: var(--white);
  color: var(--text-primary);
  /* Stated, not inherited. An interactive card is a <button>, and a button
     falls back to the UA font rather than the page's. */
  font-family: var(--font-sans);
  /* A transparent border at rest, so switching to Outlined does not resize the
     card. Dropping it and adding a border only on the modifier shifts layout. */
  border: 1px solid transparent;
  box-shadow: none;
  text-align: left;
  cursor: default;
}

.inspera-card--compact  { padding: 12px; }
.inspera-card--spacious { padding: 24px; }

.inspera-card--raised   { box-shadow: var(--shadow-200); }
.inspera-card--outlined { border-color: var(--border-strong); }

/* Interactive cards are <button>, so they are focusable and operable by
   keyboard for free. A div with onclick is not. */
.inspera-card--interactive { cursor: pointer; }
.inspera-card--interactive:hover { box-shadow: var(--shadow-300); }
.inspera-card--interactive:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.inspera-card__title {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.inspera-card__body {
  margin: 0;
  font-size: 16px;
  line-height: 1.4;
  color: var(--gray-700);
}
```

```html
<article class="inspera-card inspera-card--raised">
  <h3 class="inspera-card__title">Algebra Quiz</h3>
  <p class="inspera-card__body">24 questions | 45 minutes.</p>
</article>

<!-- Interactive: a real button, never a div with a click handler. -->
<button type="button" class="inspera-card inspera-card--outlined inspera-card--interactive">
  <h3 class="inspera-card__title">History Midterm</h3>
  <p class="inspera-card__body">Open the assessment.</p>
</button>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
