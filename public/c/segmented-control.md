<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Segmented Control

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

### Segmented Control

Choose one option from a small set of mutually exclusive segments. - category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { SegmentedControl } from '@inspera/components'

<SegmentedControl
  items={['Day', 'Week', 'Month']}
  value={range}
  onChange={setRange}
  size="Medium"
  fullWidth={false}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `string[]` | `['Day', 'Week', 'Month']` | Segment labels. |
| `value` | `number` | - | Active segment index. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Segment height. |
| `fullWidth` | `boolean` | `false` | Stretch to fill the row. |
| `onChange` | `(index: number) => void` | - | Fired with the index of the chosen segment. |

**Accessibility** - role `radiogroup`, keyboard operable. Container uses role="radiogroup"; Each segment uses role="radio" with aria-checked; Arrow keys move between segments.

**Do:** Use for 2-4 mutually exclusive views; Keep labels short and parallel; Show the active segment clearly.
**Don't:** Do not use for more than 4 options - use Tabs or Select; Do not use for multi-select.

**Deprecated aliases** (do not use): `Segment control`, `Toggle group`, `Button group`

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

- The track is `--gray-100` with 4px padding and `--radius-md`; segments are `--radius-sm` inside it.
- The selected segment becomes a white `--surface` card with `--shadow-100` and `--primary` text at 600 weight. Colour alone is not enough at 14px.
- Segment height is 40px (32px small) and the type stays 14px at both.
- Use `role="radiogroup"` with `role="radio"` children and a roving tabindex: the selected item is the only tab stop, and arrows move between them.
- For more than about four options, or for anything not mutually exclusive, use Tabs or a Select instead.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:           #004080;
  --white:             #ffffff;
  --gray-100:          #F7F7F7;
  --gray-600:          #7A7A7A;
  --surface:           var(--white);
  --muted-foreground:  var(--gray-600);
  --radius-sm:         4px;
  --radius-md:         8px;
  --shadow-100:        0px 4px 4px rgba(39, 39, 39, 0.08), 0px 2px 4px rgba(39, 39, 39, 0.12);
  --font-sans:         'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-segmented {
  display: inline-flex;
  gap: 2px;
  padding: 4px;
  background: var(--gray-100);
  border-radius: var(--radius-md);
}

.inspera-segmented--full { width: 100%; }

.inspera-segmented__item {
  height: 40px;
  padding: 0 16px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  box-shadow: none;
  color: var(--muted-foreground);
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 120ms ease;
}

.inspera-segmented--small .inspera-segmented__item { height: 32px; }
.inspera-segmented--full .inspera-segmented__item { flex: 1; }

/* Selected: a raised white card on the tinted track. Colour alone is not
   enough separation at 14px. */
.inspera-segmented__item[aria-checked='true'] {
  background: var(--surface);
  box-shadow: var(--shadow-100);
  color: var(--primary);
  font-weight: 600;
}
```

```html
<!-- Roving tabindex: the group is one tab stop and the arrows move inside it. -->
<div class="inspera-segmented" role="radiogroup" aria-label="Date range">
  <button type="button" class="inspera-segmented__item" role="radio" aria-checked="true" tabindex="0">Day</button>
  <button type="button" class="inspera-segmented__item" role="radio" aria-checked="false" tabindex="-1">Week</button>
  <button type="button" class="inspera-segmented__item" role="radio" aria-checked="false" tabindex="-1">Month</button>
</div>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
