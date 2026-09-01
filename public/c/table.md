<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Table

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

### Table

Display structured data in rows and columns. - category: `data-display`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Table } from '@inspera/components'

<Table
  size="Default"
  striped={false}
  columns={[{ key: 'name', header: 'Assessment' }]}
  rows={[{ name: 'Algebra Quiz' }]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `TableColumn[]` | `defaultColumns` | Column definitions. |
| `rows` | `Record<string, ReactNode>[]` | `defaultRows` | Row data keyed by column. |
| `size` | `'Compact' \| 'Default'` | `'Default'` | Row height density. |
| `striped` | `boolean` | `false` | Zebra-stripe rows. |
| `hoverable` | `boolean` | `true` | Highlight rows on hover. |
| `selectable` | `boolean` | `false` | Add a row selection column. |
| `caption` | `string` | - | Describes the table for screen readers. Provide one unless a heading already names it. |
| `onRowClick` | `(row: Record<string, ReactNode>, index: number) => void` | - | Fired with the row data and its index. |

```ts
export interface TableColumn {
  key: string
  header: string
  align?: 'left' | 'right' | 'center'
  width?: string | number
}
```

**Accessibility** - role `table`, keyboard operable. Use semantic table / thead / tbody markup; Header cells use scope="col"; Provide a caption or aria-label describing the table.

**Do:** Use for comparable, structured records; Right-align numeric columns; Keep headers concise.
**Don't:** Do not use tables for page layout; Do not overload rows with unrelated actions.

**Deprecated aliases** (do not use): `Data table`, `Grid`, `Datagrid`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- Use a real `<table>` with `<thead>`, `<tbody>` and `scope="col"` on every header. A grid of divs loses row and column association completely.
- Row height is 52px (40px compact) and the header sits on `--gray-100`. Cells are 14px with 16px horizontal padding.
- Right-align numeric columns only, so digits line up. Never right-align text.
- The stripe is passed as the row's resting fill (`--inspera-row-bg`) rather than a plain background, so the hover rule can still win on striped rows.
- Selection checkboxes need a per-row `aria-label` ("Select row 3") and `accent-color: var(--primary)`.
- Give the table a `<caption>` unless a heading immediately above already names it.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:           #004080;
  --error:             #D32F2F;
  --warning:           #EF6C00;
  --info:              #0288D1;
  --success:           #2E7D32;
  --white:             #ffffff;
  --gray-100:          #F7F7F7;
  --gray-200:          #EDEDED;
  --gray-600:          #7A7A7A;
  --gray-700:          #595959;
  --gray-900:          #272727;
  --action-hover:      rgba(0, 0, 0, 0.04);
  --text-primary:      rgba(0, 0, 0, 0.87);
  --info-surface:      #E1F5FE;
  --success-surface:   #E8F5E9;
  --warning-surface:   #FFF3E0;
  --error-surface:     #FFEBEE;
  --surface-neutral:   #F0F0F0;
  --border:            var(--gray-200);
  --muted-foreground:  var(--gray-600);
  --radius-md:         8px;
  --radius-pill:       9999px;
  --duration-fast:     100ms;
  --easing-standard:   cubic-bezier(0.2, 0, 0, 1);
  --font-sans:         'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-badge {
  /* Fill and text come from the intent modifier below. */
  --badge-bg: var(--surface-neutral);
  --badge-fg: var(--gray-900);

  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 24px;
  padding: 0 8px;
  border-radius: var(--radius-pill);
  background: var(--badge-bg);
  color: var(--badge-fg);
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
}

/* Small changes height and padding only - never the 12px type. */
.inspera-badge--small { height: 20px; padding: 0 6px; }

/* Neutral is written out even though it matches the base, so the class name
   stays correct if the default ever moves. */
.inspera-badge--neutral { --badge-bg: var(--surface-neutral); --badge-fg: var(--gray-900); }
.inspera-badge--info    { --badge-bg: var(--info-surface);    --badge-fg: var(--info); }
.inspera-badge--success { --badge-bg: var(--success-surface); --badge-fg: var(--success); }
.inspera-badge--warning { --badge-bg: var(--warning-surface); --badge-fg: var(--warning); }
.inspera-badge--error   { --badge-bg: var(--error-surface);   --badge-fg: var(--error); }

/* The icon is filled, not outlined, at 16px (14px in a small badge). */
.inspera-badge .material-symbols-outlined {
  font-size: 16px;
  font-variation-settings: 'FILL' 1;
}
.inspera-badge--small .material-symbols-outlined { font-size: 14px; }

.inspera-table {
  border-collapse: collapse;
  width: 100%;
  font-family: var(--font-sans);
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.inspera-table caption {
  caption-side: top;
  text-align: left;
  padding: 0 0 8px;
  font-size: 13px;
  color: var(--muted-foreground);
}

.inspera-table th,
.inspera-table td {
  padding: 0 16px;
  font-size: 14px;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
  text-align: left;
}

.inspera-table th {
  font-weight: 600;
  color: var(--gray-700);
}

.inspera-table thead tr {
  background: var(--gray-100);
  height: 52px;
}

.inspera-table tbody tr {
  height: 52px;
  cursor: default;
  /* The stripe is the row's resting fill, passed as a variable. Setting it as
     a plain background would outrank the hover rule below. */
  background: var(--inspera-row-bg, var(--white));
  transition: background var(--duration-fast) var(--easing-standard);
}

.inspera-table--compact thead tr,
.inspera-table--compact tbody tr { height: 40px; }

.inspera-table--striped tbody tr:nth-child(even) { --inspera-row-bg: var(--gray-100); }

.inspera-table--hoverable tbody tr:hover { background: var(--action-hover); }

/* Numbers right-align so the digits line up; text never does. Scoped through
   the table so it outranks the "th, td" rule above, which is more specific
   than a bare class on its own. */
.inspera-table th.inspera-table__cell--right,
.inspera-table td.inspera-table__cell--right { text-align: right; }

.inspera-table th.inspera-table__select,
.inspera-table td.inspera-table__select {
  width: 44px;
  text-align: center;
}
.inspera-table__select input {
  width: 16px;
  height: 16px;
  accent-color: var(--primary);
  cursor: pointer;
}
```

```html
<table class="inspera-table inspera-table--hoverable">
  <caption>Candidate results, March 2026</caption>
  <thead>
    <tr>
      <th scope="col">Assessment</th>
      <th scope="col" class="inspera-table__cell--right">Items</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Algebra Quiz</td>
      <td class="inspera-table__cell--right">24</td>
      <td><span class="inspera-badge inspera-badge--success" role="status">Live</span></td>
    </tr>
  </tbody>
</table>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
