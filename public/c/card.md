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
  body="24 questions, 45 minutes. Covers linear equations and inequalities."
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | - | Heading for the card. Also the accessible name of an interactive card. |
| `body` | `string` | - | Short body copy. For anything richer, pass children instead. |
| `elevation` | `'Flat' \| 'Raised' \| 'Outlined'` | `'Raised'` | Surface treatment. |
| `padding` | `'Compact' \| 'Default' \| 'Spacious'` | `'Default'` | Internal padding (12 / 16 / 24). |
| `interactive` | `boolean` | `false` | The whole card becomes one click target: it lifts on hover, sinks when pressed and takes a focus ring. |
| `selected` | `boolean` | - | Selected state. Controlled - pair with onSelectedChange. Setting it makes the card a toggle: interactive, and selected or not with each click. |
| `defaultSelected` | `boolean` | - | Starting selection when uncontrolled. Also makes the card a toggle. |
| `onSelectedChange` | `(selected: boolean) => void` | - | Fired with the new selection when the card is clicked. |
| `children` | `ReactNode` | - | Card contents. Replaces title and body. |
| `onClick` | `MouseEventHandler<HTMLButtonElement>` | - | Fired when an interactive card is activated. |

Also accepts any native `<article>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<article>`. `className` and `style` go on the outermost element.

**Accessibility** - role `article`, keyboard operable. An interactive card is an article with one button stretched over it, named by the title; A selectable card is a toggle: its button carries aria-pressed, and the selected tick is a second cue besides the border colour; Non-interactive cards use role="article" or a semantic section.

**Do:** Use to group related content; Maintain consistent padding within a view; Use raised elevation for primary content cards.
**Don't:** Do not nest cards inside other cards; Do not use an empty card just for layout.

**Choosing a variant:**
- `elevation="Raised"`: Cards that lead a page on the grey canvas, such as what to continue on the home page.
- `elevation="Flat"`: Page content on the grey canvas, such as the summaries on a test's overview. No shadow, so it stays quiet.
- `elevation="Outlined"`: Cards on a white page, where a shadow would be heavy, such as tests in the Cards view.
- `padding="Compact"`: Dense grids and side panels, where many cards share the space.
- `padding="Spacious"`: A card with one main message that needs room to read, such as a summary before publishing.
- `interactive`: The whole card opens one thing, such as a question type to start from. Put no other buttons or links inside it.
- `selected`: People pick options laid out as cards, such as the question types to add to a set. Each click selects or clears the card.

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

- Radius is `--radius-lg`. Padding is 12 / 16 / 24 for Compact / Default / Spacious.
- Flat has neither border nor shadow, Raised adds `--shadow-200`, Outlined adds a 1px `--border-strong`. Never both a shadow and a strong border.
- The transparent 1px border at rest is deliberate: without it, Outlined would be 2px wider than Flat.
- An interactive card stays an `<article>` with one transparent `<button class="inspera-card__link">` stretched over it, named by the title. Never wrap the card in a `<button>` (headings inside a button are invalid) and never put a click handler on a `<div>`.
- Interactive states: hover and keyboard focus lift to `--shadow-300`; pressed sinks to `--shadow-100` with the `--action-hover` wash over the white; keyboard focus also draws the standard focus ring around the whole card.
- A selectable card is a toggle: the button carries `aria-pressed`. Selected is a 2px `--primary` edge (border plus a 1px outline inset by 2px) and a `check_circle` tick at the top right; the right padding keeps room for the tick at all times.
- Title 16px/500, body 16px/1.4 in `--gray-700` - the body is not smaller than the title.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:            #004080;
  --white:              #ffffff;
  --gray-300:           #D9D9D9;
  --gray-700:           #595959;
  --action-hover:       rgba(0, 0, 0, 0.04);
  --text-primary:       rgba(0, 0, 0, 0.87);
  --border-strong:      var(--gray-300);
  --radius-lg:          12px;
  --shadow-100:         0px 4px 4px rgba(39, 39, 39, 0.08), 0px 2px 4px rgba(39, 39, 39, 0.12);
  --shadow-200:         0px 8px 8px rgba(39, 39, 39, 0.08), 0px 4px 6px rgba(39, 39, 39, 0.12);
  --shadow-300:         0px 8px 16px rgba(39, 39, 39, 0.08), 0px 6px 8px rgba(39, 39, 39, 0.12);
  --focus-ring-width:   2px;
  --focus-ring-offset:  2px;
  --focus-ring-color:   var(--primary);
  --font-sans:          'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 16px;
  border-radius: var(--radius-lg);
  background: var(--white);
  color: var(--text-primary);
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

/* Interactive: one transparent button stretched over the whole card. The
   card stays an <article>, so its heading is still a heading - wrapping it all
   in a <button> flattened title and body into one long button name. */
.inspera-card__link {
  position: absolute;
  inset: 0;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: inherit;
  background: transparent;
  cursor: pointer;
}
.inspera-card__link:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

/* Hover and keyboard focus lift the card; pressing sinks it below its rest
   and lays the neutral --action-hover wash over the white. */
.inspera-card--interactive:hover,
.inspera-card--interactive:has(:focus-visible) { box-shadow: var(--shadow-300); }
.inspera-card--interactive:active {
  background: linear-gradient(var(--action-hover), var(--action-hover)), var(--white);
  box-shadow: var(--shadow-100);
}

/* Selectable: the link toggles aria-pressed. The right padding keeps room for
   the tick whether or not the card is selected, so selecting never reflows. */
.inspera-card--selectable { padding-right: 44px; }
.inspera-card--compact.inspera-card--selectable  { padding-right: 40px; }
.inspera-card--spacious.inspera-card--selectable { padding-right: 52px; }

/* Selected: a 2px primary edge - the border plus an outline just inside it,
   so the card keeps its size - and a tick, so colour is not the only cue. */
.inspera-card--selected {
  border-color: var(--primary);
  outline: 1px solid var(--primary);
  outline-offset: -2px;
}
.inspera-card__tick {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 20px;
  color: var(--primary);
}
.inspera-card--compact  .inspera-card__tick { top: 12px; right: 12px; }
.inspera-card--spacious .inspera-card__tick { top: 24px; right: 24px; }

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
  <p class="inspera-card__body">24 questions, 45 minutes.</p>
</article>

<!-- Interactive: the card stays an <article>; one button stretched over it, named by the title. -->
<article class="inspera-card inspera-card--outlined inspera-card--interactive">
  <h3 class="inspera-card__title">History Midterm</h3>
  <p class="inspera-card__body">Open the assessment.</p>
  <button type="button" class="inspera-card__link" aria-label="History Midterm"></button>
</article>

<!-- Selected: a toggle. Flip aria-pressed and the --selected class together, and show the tick. -->
<article class="inspera-card inspera-card--outlined inspera-card--interactive inspera-card--selectable inspera-card--selected">
  <h3 class="inspera-card__title">Multiple choice</h3>
  <p class="inspera-card__body">One or more correct answers.</p>
  <span class="material-symbols-outlined inspera-card__tick" aria-hidden="true">check_circle</span>
  <button type="button" class="inspera-card__link" aria-label="Multiple choice" aria-pressed="true"></button>
</article>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
