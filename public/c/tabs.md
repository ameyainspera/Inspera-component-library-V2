<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Tabs

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

### Tabs

Organize content into switchable panels. - category: `navigation`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Tabs } from '@inspera/components'

<Tabs
  items={[{ label: 'Overview' }, { label: 'Questions' }]}
  style="Underline"
  size="Medium"
  fullWidth={false}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `TabItem[]` | `defaultItems` | The tabs, in order. |
| `style` | `'Underline' \| 'Contained'` | `'Underline'` | Visual treatment. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Tab height 40 / 48. |
| `fullWidth` | `boolean` | `false` | Stretch tabs to fill the row. |
| `value` | `number` | - | Index of the active tab. Controlled - pair with onChange. |
| `onChange` | `(index: number) => void` | - | Fired with the index of the newly selected tab. |

```ts
export interface TabItem {
  label: string
  icon?: string
}
```

**Accessibility** - role `tablist`, keyboard operable. Use role="tablist" on the tab container; Each tab uses role="tab" with aria-selected; Tab panels use role="tabpanel" linked by aria-labelledby; Arrow keys navigate between tabs.

**Do:** Use to organize related content sections; Label tabs clearly and concisely; Use a maximum of 6 tabs per set.
**Don't:** Do not use tabs for sequential steps - use a stepper instead; Do not nest tab sets inside other tab sets.

**Deprecated aliases** (do not use): `Tab bar`, `Tab navigation`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- Underline tabs are 48px tall (40px small) on a 1px `--border-strong` rail, with `margin-bottom: -1px` so the selected 2px `--primary` underline covers the rail.
- The resting bottom border is a transparent 2px, not none - otherwise selecting a tab shifts the whole row by two pixels.
- Contained tabs drop the rail entirely and become a pill group on `--gray-100`, with the selected tab a white `--shadow-100` card.
- `role="tablist"` / `role="tab"` / `role="tabpanel"`, each tab pointing at its panel with `aria-controls` and each panel back with `aria-labelledby`.
- Roving tabindex: only the selected tab is a tab stop; Left/Right move between them.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:        #004080;
  --white:          #ffffff;
  --gray-100:       #F7F7F7;
  --gray-300:       #D9D9D9;
  --gray-700:       #595959;
  --border-strong:  var(--gray-300);
  --radius-sm:      4px;
  --radius-md:      8px;
  --shadow-100:     0px 4px 4px rgba(39, 39, 39, 0.08), 0px 2px 4px rgba(39, 39, 39, 0.12);
  --font-sans:      'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-tabs {
  display: flex;
  gap: 0;
  padding: 0;
  border-bottom: 1px solid var(--border-strong);
  background: transparent;
  border-radius: 0;
  width: auto;
}

.inspera-tabs--full { width: 100%; }

/* Contained: a pill group on a tinted track, with no rail underneath. */
.inspera-tabs--contained {
  gap: 4px;
  padding: 4px;
  border-bottom: none;
  background: var(--gray-100);
  border-radius: var(--radius-md);
}

.inspera-tabs__tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 48px;
  padding: 0 16px;
  flex: none;
  border-top: none;
  border-right: none;
  border-left: none;
  /* A transparent 2px rail at rest, so selecting a tab does not shift the row. */
  border-bottom: 2px solid transparent;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  color: var(--gray-700);
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: -1px;
  transition: color 120ms ease, border-color 120ms ease;
}

.inspera-tabs--small .inspera-tabs__tab { height: 40px; }
.inspera-tabs--full .inspera-tabs__tab { flex: 1; }

.inspera-tabs__tab[aria-selected='true'] {
  border-bottom-color: var(--primary);
  color: var(--primary);
}

/* Contained tabs sit inside the track: no rail, a raised white card instead. */
.inspera-tabs--contained .inspera-tabs__tab {
  height: 40px;
  border-bottom: none;
  border-radius: var(--radius-sm);
  margin-bottom: 0;
}
.inspera-tabs--contained.inspera-tabs--small .inspera-tabs__tab { height: 32px; }

.inspera-tabs--contained .inspera-tabs__tab[aria-selected='true'] {
  background: var(--white);
  box-shadow: var(--shadow-100);
  color: var(--primary);
}

.inspera-tabs__tab .material-symbols-outlined { font-size: 20px; }
```

```html
<div class="inspera-tabs" role="tablist" aria-label="Section tabs">
  <button type="button" class="inspera-tabs__tab" role="tab" aria-selected="true"
          id="tab-overview" aria-controls="panel-overview" tabindex="0">Overview</button>
  <button type="button" class="inspera-tabs__tab" role="tab" aria-selected="false"
          id="tab-questions" aria-controls="panel-questions" tabindex="-1">Questions</button>
</div>

<div id="panel-overview" role="tabpanel" aria-labelledby="tab-overview" tabindex="0">...</div>
<div id="panel-questions" role="tabpanel" aria-labelledby="tab-questions" tabindex="0" hidden>...</div>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
