<!-- Inspera Design System v1.0.0 — generated file, do not edit. -->

# Inspera — List

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

### List

Present a vertical series of related items. — category: `data-display`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library — build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { List } from '@inspera/components'

<List
  size="Default"
  divided={true}
  interactive={false}
  items={[{ primary: 'General settings', secondary: '…', leading: 'settings' }]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `ListItem[]` | `defaultItems` | List rows. |
| `divided` | `boolean` | `true` | Show dividers between rows. |
| `interactive` | `boolean` | `false` | Make rows clickable. |
| `size` | `'Compact' \| 'Default'` | `'Default'` | Row density. |
| `onItemClick` | `(item: ListItem, index: number) => void` | — | Fired with the item and its index. Set interactive as well. |

```ts
export interface ListItem {
  primary: string
  secondary?: string
  leading?: ReactNode
  trailing?: ReactNode
}
```

**Accessibility** — role `list`, keyboard operable. Use semantic list markup (ul / li); Interactive rows are buttons and keyboard focusable; Provide meaningful text for each item.

**Do:** Use for settings, results, and simple records; Keep primary text scannable; Use secondary text for supporting detail.
**Don't:** Do not use for comparable tabular data — use Table; Do not make only part of a row clickable.

**Deprecated aliases** (do not use): `List view`, `Item list`

#### Without the package — exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- Set the four border longhands, never the `border` shorthand. A shorthand on the row wipes the bottom border that draws the divider — the exact bug this component shipped with.
- Interactive rows are `<button>` inside the `<li>`, so focus and Enter/Space work without a keydown handler.
- Row padding is 12px (8px compact) vertical, 16px horizontal; primary text 14px/500, secondary 13px `--muted-foreground`.
- The divider is on every row but the last, drawn by `li:not(:last-child)` rather than by counting in script.
- Leading and trailing icons are 20px (18px compact) and always `aria-hidden` — the row’s text is the label.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:           #004080;
  --white:             #ffffff;
  --gray-200:          #EDEDED;
  --gray-600:          #7A7A7A;
  --action-hover:      rgba(0, 0, 0, 0.04);
  --text-primary:      rgba(0, 0, 0, 0.87);
  --border:            var(--gray-200);
  --muted-foreground:  var(--gray-600);
  --radius-sm:         4px;
  --radius-md:         8px;
  --focus-ring-width:  2px;
  --focus-ring-color:  var(--primary);
  --duration-fast:     100ms;
  --easing-standard:   cubic-bezier(0.2, 0, 0, 1);
  --font-sans:         'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-list {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  font-family: var(--font-sans);
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.inspera-list__row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  /* Longhands, not the "border" shorthand: a shorthand here wipes the divider
     that the row below sets on its bottom edge. */
  border-top: none;
  border-right: none;
  border-left: none;
  border-bottom: none;
  font: inherit;
  cursor: default;
  background: transparent;
}

.inspera-list--compact .inspera-list__row { padding: 8px 16px; }

.inspera-list--divided li:not(:last-child) > .inspera-list__row {
  border-bottom: 1px solid var(--border);
}

/* Interactive rows are real buttons, so they focus and activate for free. */
.inspera-list__row--interactive {
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background var(--duration-fast) var(--easing-standard);
}
.inspera-list__row--interactive:hover { background: var(--action-hover); }
.inspera-list__row--interactive:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: -2px;
}

.inspera-list__slot {
  display: inline-flex;
  flex-shrink: 0;
}

.inspera-list__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
  text-align: left;
}

.inspera-list__primary {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.inspera-list__secondary {
  font-size: 13px;
  color: var(--muted-foreground);
}
```

```html
<ul class="inspera-list inspera-list--divided" role="list">
  <li>
    <div class="inspera-list__row">
      <span class="inspera-list__slot">
        <span class="material-symbols-outlined" aria-hidden="true">settings</span>
      </span>
      <span class="inspera-list__text">
        <span class="inspera-list__primary">General settings</span>
        <span class="inspera-list__secondary">Language, timezone, theme</span>
      </span>
    </div>
  </li>
</ul>

<!-- Interactive rows are <button>, not a div with onclick. -->
<ul class="inspera-list inspera-list--divided" role="list">
  <li>
    <button type="button" class="inspera-list__row inspera-list__row--interactive">
      <span class="inspera-list__text">
        <span class="inspera-list__primary">Notifications</span>
      </span>
      <span class="inspera-list__slot">
        <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
      </span>
    </button>
  </li>
</ul>
```


---

Tokens: ./tokens.css · Full system: ./llms.txt
