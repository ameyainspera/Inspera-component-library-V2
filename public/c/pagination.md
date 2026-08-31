<!-- Inspera Design System v1.0.0 — generated file, do not edit. -->

# Inspera — Pagination

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

### Pagination

Navigate between pages of content. — category: `navigation`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library — build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Pagination } from '@inspera/components'

<Pagination
  page={page}
  pageCount={12}
  size="Medium"
  showEdges={true}
  onChange={setPage}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | `number` | `1` | Current page (1-based). |
| `pageCount` | `number` | `10` | Total number of pages. |
| `siblingCount` | `number` | `1` | Pages shown either side of current. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Control height. |
| `showEdges` | `boolean` | `true` | Show first / last controls. |
| `onChange` | `(page: number) => void` | — | Fired with the requested page number, 1-based. |

**Accessibility** — role `navigation`, keyboard operable. Wrap in nav with aria-label="Pagination"; Mark the current page with aria-current="page"; Disable and aria-disable prev/next at the bounds.

**Do:** Use for long, paged result sets; Show current, first, and last pages; Collapse large gaps with an ellipsis.
**Don't:** Do not use for a handful of items; Do not hide the current page indicator.

**Deprecated aliases** (do not use): `Pager`, `Page navigation`

#### Without the package — exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- A `<nav aria-label="Pagination">` around a `<ul>`; the current page is a button with `aria-current="page"`, filled `--primary`.
- Every page button needs a real label ("Page 4"), and the arrows need "Previous page" / "Next page". A bare chevron announces as nothing.
- The ellipsis is a `<span>` marked `aria-hidden`, not a disabled button — it is a gap marker, not a control.
- Cells are 40px (32px small) with `--radius-md` and a 4px gap, and the list wraps rather than overflowing in a narrow column.
- Disable the arrows at the ends rather than hiding them, so the control does not change width as you page.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:           #004080;
  --white:             #ffffff;
  --gray-600:          #7A7A7A;
  --action-hover:      rgba(0, 0, 0, 0.04);
  --action-disabled:   rgba(0, 0, 0, 0.38);
  --text-primary:      rgba(0, 0, 0, 0.87);
  --muted-foreground:  var(--gray-600);
  --radius-md:         8px;
  --font-sans:         'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-pagination__list {
  display: flex;
  align-items: center;
  /* Wrap rather than overflow: a long pager has to degrade in a narrow column,
     not spill out of it. */
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.inspera-pagination__item {
  min-width: 40px;
  height: 40px;
  padding: 0 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease;
}

.inspera-pagination--small .inspera-pagination__item {
  min-width: 32px;
  height: 32px;
  font-size: 14px;
}

.inspera-pagination__item:hover:not(:disabled):not([aria-current='page']) {
  background: var(--action-hover);
}

.inspera-pagination__item[aria-current='page'] {
  background: var(--primary);
  color: var(--white);
}

.inspera-pagination__item:disabled {
  color: var(--action-disabled);
  cursor: not-allowed;
}

.inspera-pagination__item .material-symbols-outlined { font-size: 20px; }
.inspera-pagination--small .inspera-pagination__item .material-symbols-outlined { font-size: 18px; }

/* The gap marker is not a control: a span, hidden from assistive tech. */
.inspera-pagination__ellipsis {
  cursor: default;
  color: var(--muted-foreground);
}
```

```html
<nav class="inspera-pagination" aria-label="Pagination">
  <ul class="inspera-pagination__list">
    <li><button type="button" class="inspera-pagination__item" aria-label="Previous page">
      <span class="material-symbols-outlined" aria-hidden="true">chevron_left</span>
    </button></li>
    <li><button type="button" class="inspera-pagination__item" aria-label="Page 1">1</button></li>
    <li><span class="inspera-pagination__item inspera-pagination__ellipsis" aria-hidden="true">…</span></li>
    <li><button type="button" class="inspera-pagination__item" aria-label="Page 4" aria-current="page">4</button></li>
    <li><button type="button" class="inspera-pagination__item" aria-label="Next page">
      <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
    </button></li>
  </ul>
</nav>
```


---

Tokens: ./tokens.css · Full system: ./llms.txt
