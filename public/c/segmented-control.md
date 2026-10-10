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
  label="Date range"
  items={['Day', 'Week', 'Month']}
  defaultValue="Week"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Names the group for assistive tech, e.g. "Date range". Not shown. |
| `items` **(required)** | `(string \| SegmentedControlItem)[]` | - | Segments, in order. Plain strings when value and label match. |
| `value` | `string` | - | Selected segment value. Controlled - pair with onChange. |
| `defaultValue` | `string` | - | Starting segment when uncontrolled. Defaults to the first. |
| `onChange` | `(value: string) => void` | - | Fired with the chosen segment's value. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Segment height. |
| `fullWidth` | `boolean` | `false` | Stretch to fill the row. |
| `disabled` | `boolean` | `false` | Blocks interaction and dims the control. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

```ts
export interface SegmentedControlItem {
  value: string
  /** Shown text. Defaults to `value`. */
  label?: string
}
```

**Accessibility** - role `radiogroup`, keyboard operable. Container uses role="radiogroup"; Each segment uses role="radio" with aria-checked; Arrow keys move between segments.

**Do:** Use for 2-4 mutually exclusive views; Keep labels short and parallel; Show the active segment clearly.
**Don't:** Do not use for more than 4 options - use Tabs or Select; Do not use for multi-select.

**Choosing a variant:**
- `size="Medium"`: A switch above the content it changes, such as how results are broken down. The default size.
- `size="Small"`: Card headers and dense toolbars, such as the period of a dashboard card.
- `fullWidth`: A narrow panel, where the segments share its width, such as the device in a preview panel.
- `disabled`: The views are not available yet. Say why next to it.

**Deprecated aliases** (do not use): `Segment control`, `Toggle group`, `Button group`

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

- Segments are joined and outlined: white `--surface`, `--gray-800` text and a `--border-control` border, overlapping by one border so each join is a single line. Only the outer corners take `--radius-sm`.
- The selected segment is `--blue-100` with `--primary` (blue-800) text and a `--blue-700` border, at 600 weight. It sits above its neighbours so the blue border shows on all four sides, and the weight marks it as well as the colour.
- Heights and type match Button: 40px with 16px text, or 32px with 14px text when small - the same heights as Text Input, so they line up in a toolbar.
- A hidden bold copy of the label (`::after` from `data-label`) holds the bold width, so selecting a segment does not shift the others.
- Use `role="radiogroup"` with `role="radio"` children and a roving tabindex: the selected item is the only tab stop, and arrows move between them.
- For more than about four options, or for anything not mutually exclusive, use Tabs or a Select instead.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                         #004080;
  --white:                           #ffffff;
  --gray-600:                        #7A7A7A;
  --gray-800:                        #404040;
  --blue-100:                        #F0F7FF;
  --blue-700:                        #0059B3;
  --border-control:                  var(--gray-600);
  --surface:                         var(--white);
  --control-height-sm:               32px;
  --control-height-md:               40px;
  --radius-sm:                       4px;
  --border-width-default:            1px;
  --focus-ring-width:                2px;
  --focus-ring-offset:               2px;
  --focus-ring-color:                var(--primary);
  --duration-fast:                   100ms;
  --easing-standard:                 cubic-bezier(0.2, 0, 0, 1);
  --font-sans:                       'Inter', system-ui, -apple-system, sans-serif;
  --default-16-regular-size:         16px;
  --default-16-regular-line-height:  1.25;
  --medium-14-size:                  14px;
  --medium-14-line-height:           1.4;
}

.inspera-segmented { display: inline-flex; }
.inspera-segmented--full { width: 100%; }

.inspera-segmented__item {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: var(--control-height-md);
  padding: 0 12px;
  border: var(--border-width-default) solid var(--border-control);
  border-radius: 0;
  background: var(--surface);
  color: var(--gray-800);
  font-family: var(--font-sans);
  font-size: var(--default-16-regular-size);
  line-height: var(--default-16-regular-line-height);
  font-weight: 400;
  white-space: nowrap;
  cursor: pointer;
  transition: background var(--duration-fast) var(--easing-standard);
}

/* Neighbours overlap by one border, so each join is a single line. Only the
   outer corners are rounded. */
.inspera-segmented__item + .inspera-segmented__item { margin-left: calc(var(--border-width-default) * -1); }
.inspera-segmented__item:first-child { border-radius: var(--radius-sm) 0 0 var(--radius-sm); }
.inspera-segmented__item:last-child { border-radius: 0 var(--radius-sm) var(--radius-sm) 0; }
.inspera-segmented__item:only-child { border-radius: var(--radius-sm); }

.inspera-segmented--small .inspera-segmented__item {
  height: var(--control-height-sm);
  font-size: var(--medium-14-size);
  line-height: var(--medium-14-line-height);
}
.inspera-segmented--full .inspera-segmented__item { flex: 1; }

.inspera-segmented__item[aria-checked='false']:hover:not(:disabled) {
  background: color-mix(in srgb, var(--surface) 96%, black);
}

.inspera-segmented__item:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.inspera-segmented--disabled { opacity: 0.38; }
.inspera-segmented--disabled .inspera-segmented__item { cursor: not-allowed; }

/* Selected: raised above its neighbours so the blue border shows on all four
   sides, and bold as well as blue - blue against gray text alone would leave
   the choice to colour. */
.inspera-segmented__item[aria-checked='true'] {
  z-index: 1;
  background: var(--blue-100);
  color: var(--primary);
  border-color: var(--blue-700);
  font-weight: 600;
}

/* A hidden bold copy of the label holds the bold width, so selecting a
   segment does not shift the ones after it. */
.inspera-segmented__label {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}
.inspera-segmented__label::after {
  content: attr(data-label);
  content: attr(data-label) / '';
  height: 0;
  overflow: hidden;
  visibility: hidden;
  font-weight: 600;
  pointer-events: none;
  user-select: none;
}
```

```html
<!-- Roving tabindex: the group is one tab stop and the arrows move inside it. -->
<div class="inspera-segmented" role="radiogroup" aria-label="Date range">
  <button type="button" class="inspera-segmented__item" role="radio" aria-checked="true" tabindex="0"><span class="inspera-segmented__label" data-label="Day">Day</span></button>
  <button type="button" class="inspera-segmented__item" role="radio" aria-checked="false" tabindex="-1"><span class="inspera-segmented__label" data-label="Week">Week</span></button>
  <button type="button" class="inspera-segmented__item" role="radio" aria-checked="false" tabindex="-1"><span class="inspera-segmented__label" data-label="Month">Month</span></button>
</div>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
