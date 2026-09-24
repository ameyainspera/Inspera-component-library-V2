<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Data Grid

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

### Data Grid

Display large datasets with sorting, selection and paging. - category: `data-display`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { DataGrid } from '@inspera/components'

<DataGrid
  size="Default"
  selectable
  footer
  columns={[
    { key: 'name', header: 'Test', sortable: true },
    { key: 'status', header: 'Status' },
  ]}
  rows={rows}
  getRowId={(row) => row.id}
  onSelectionChange={setSelected}
  total={242}
  page={page}
  pageCount={13}
  onPageChange={setPage}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `DataGridColumn[]` | `defaultColumns` | Column definitions. |
| `rows` | `Record<string, ReactNode>[]` | `defaultRows` | Row data keyed by column. |
| `getRowId` | `(row: Record<string, ReactNode>, index: number) => string` | - | Stable id per row. Defaults to the row index. |
| `size` | `'Compact' \| 'Default'` | `'Default'` | Row height density. |
| `striped` | `boolean` | `false` | Zebra-stripe rows. |
| `hoverable` | `boolean` | `true` | Highlight rows on hover. |
| `caption` | `string` | - | Describes the grid for screen readers. |
| `selectable` | `boolean` | `false` | Add a leading selection column with a select-all header box. |
| `selectedIds` | `string[]` | - | Controlled set of selected row ids. Pair with onSelectionChange. |
| `onSelectionChange` | `(ids: string[]) => void` | - | Fired with the full set of selected ids after any change. |
| `sortBy` | `string` | - | Controlled sort column key. Pair with onSortChange for server sorting. |
| `sortDirection` | `'Ascending' \| 'Descending'` | - | Controlled sort direction. |
| `onSortChange` | `(key: string, direction: DataGridSortDirection) => void` | - | Fired when a sortable header is activated. Enables controlled sorting. |
| `rowActions` | `(row: Record<string, ReactNode>, index: number) => ReactNode` | - | Trailing per-row actions, revealed on row hover. |
| `onRowClick` | `(row: Record<string, ReactNode>, index: number) => void` | - | Fired with the row data and its index. |
| `footer` | `boolean` | `false` | Show the footer with the range summary, pager and page-size select. |
| `total` | `number` | - | Total row count across all pages. Defaults to the rendered row count. |
| `page` | `number` | `1` | Current page (1-based). |
| `pageCount` | `number` | `1` | Total number of pages. |
| `pageSize` | `number` | `20` | Rows shown per page, used for the range summary and the size select. |
| `pageSizeOptions` | `number[]` | `[10, 20, 50, 100]` | Selectable page sizes. |
| `onPageChange` | `(page: number) => void` | - | Fired with the requested page. |
| `onPageSizeChange` | `(size: number) => void` | - | Fired with the requested page size. |

```ts
export interface DataGridColumn {
  /** Key into each row's data object. */
  key: string
  /** Column header text. */
  header: string
  /** Cell + header alignment. */
  align?: 'left' | 'right' | 'center'
  /** Fixed column width. */
  width?: string | number
  /** Allow the column to sort. A caret appears in the header. */
  sortable?: boolean
  /**
   * Value used for sorting when the cell renders a non-primitive node. Return a
   * string or number; without it a sortable column falls back to `row[key]`.
   */
  sortValue?: (row: Record<string, ReactNode>) => string | number
}
```

**Accessibility** - role `table`, keyboard operable. Sortable headers expose aria-sort and toggle on activation; The selection column uses labelled checkboxes with a select-all header; Built on semantic table markup with a caption or aria-label.

**Do:** Use for dense, sortable, selectable datasets; Page long lists rather than rendering everything; Right-align numeric columns.
**Don't:** Do not use for a few static rows - use Table; Do not overload every row with competing actions.

**Deprecated aliases** (do not use): `Data table`, `Advanced table`, `Grid`

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

- A data grid is a Table plus three things: a leading selection column, sortable headers, and a footer pager. Each is a documented component - Checkbox, Pagination and Select - so reach for those rather than rebuilding them.
- The header row is `--gray-100`; cells are 52px tall (40px compact), 14px, with a `--border` bottom rule. Right-align numeric columns.
- A sortable header is a bare `<button>` carrying the label and an arrow; it sets `aria-sort` on the `<th>` and tints `--primary` when active. The arrow sits at 0.35 opacity until then.
- Selected rows fill `--blue-100`; zebra striping fills alternate rows `--gray-100`. A row cannot be both - selection wins.
- The footer shows "start - end of total", the pager, and a rows-per-page Select. Page long datasets rather than rendering every row.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --error:                  #D32F2F;
  --white:                  #ffffff;
  --gray-100:               #F7F7F7;
  --gray-200:               #EDEDED;
  --gray-600:               #7A7A7A;
  --gray-700:               #595959;
  --blue-100:               #F0F7FF;
  --action-hover:           rgba(0, 0, 0, 0.04);
  --action-disabled:        rgba(0, 0, 0, 0.38);
  --text-primary:           rgba(0, 0, 0, 0.87);
  --border-control-strong:  #8C8C8C;
  --border:                 var(--gray-200);
  --muted-foreground:       var(--gray-600);
  --radius-xs:              2px;
  --radius-md:              8px;
  --focus-ring-width:       2px;
  --focus-ring-offset:      2px;
  --focus-ring-color:       var(--primary);
  --duration-fast:          100ms;
  --easing-standard:        cubic-bezier(0.2, 0, 0, 1);
  --font-sans:              'Inter', system-ui, -apple-system, sans-serif;
}

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

.inspera-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  cursor: pointer;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
}

/* Hidden, but still in the DOM, still focusable, still submitted with the
   form. "display: none" or "visibility: hidden" would break all three. */
.inspera-checkbox__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.inspera-checkbox__box {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-xs);
  border: 2px solid var(--border-control-strong);
  background: var(--white);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  flex-shrink: 0;
  transition: all 120ms ease;
}

.inspera-checkbox--small .inspera-checkbox__box { width: 16px; height: 16px; }

/* The tick is a Material Symbol at the box size minus 4. */
.inspera-checkbox__box .material-symbols-outlined {
  font-size: 16px;
  font-variation-settings: 'wght' 600;
}
.inspera-checkbox--small .inspera-checkbox__box .material-symbols-outlined { font-size: 12px; }

.inspera-checkbox__input:checked + .inspera-checkbox__box,
.inspera-checkbox__input:indeterminate + .inspera-checkbox__box,
/* "indeterminate" is a DOM property with no HTML attribute, so static markup
   cannot trigger :indeterminate. The modifier lets server-rendered markup show
   the state; script that sets el.indeterminate gets the pseudo-class. */
.inspera-checkbox--mixed .inspera-checkbox__box {
  border-color: var(--primary);
  background: var(--primary);
}

.inspera-checkbox:hover .inspera-checkbox__box { border-color: var(--primary); background: rgba(0, 64, 128, 0.04); }
.inspera-checkbox:hover .inspera-checkbox__input:checked + .inspera-checkbox__box,
.inspera-checkbox:hover .inspera-checkbox__input:indeterminate + .inspera-checkbox__box,
.inspera-checkbox--mixed:hover .inspera-checkbox__box {
  border-color: var(--primary);
  background: var(--primary);
}

/* The ring goes on the drawn box: the real input is 0x0, so a ring on it is
   invisible. This is the single most-missed detail in a custom checkbox. */
.inspera-checkbox__input:focus-visible + .inspera-checkbox__box {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.inspera-checkbox:active .inspera-checkbox__box { transform: scale(0.92); }

.inspera-checkbox--error .inspera-checkbox__box { border-color: var(--error); }
.inspera-checkbox--error:hover .inspera-checkbox__box { border-color: var(--error); }

.inspera-checkbox--disabled {
  cursor: not-allowed;
  opacity: 0.38;
}
.inspera-checkbox--disabled:hover .inspera-checkbox__box {
  border-color: var(--border-control-strong);
  background: var(--white);
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

.inspera-datagrid { width: 100%; font-family: var(--font-sans); }

.inspera-datagrid__table {
  width: 100%;
  border-collapse: collapse;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.inspera-datagrid__head-row { background: var(--gray-100); }

.inspera-datagrid__th,
.inspera-datagrid__td {
  padding: 0 16px;
  height: 52px;
  font-size: 14px;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
  text-align: left;
}
.inspera-datagrid--compact .inspera-datagrid__th,
.inspera-datagrid--compact .inspera-datagrid__td { height: 40px; }

.inspera-datagrid__th {
  font-weight: 600;
  color: var(--gray-700);
}
.inspera-datagrid__select { width: 44px; text-align: center; }

/* The sortable header is a bare button carrying the arrow. */
.inspera-datagrid__sort {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  font-weight: 600;
  color: var(--gray-700);
  cursor: pointer;
}
.inspera-datagrid__sort[aria-pressed='true'] { color: var(--primary); }
.inspera-datagrid__sort .material-symbols-outlined { font-size: 18px; opacity: 0.35; }
.inspera-datagrid__sort[aria-pressed='true'] .material-symbols-outlined { opacity: 1; }

.inspera-datagrid__row--selected { background: var(--blue-100); }
.inspera-datagrid__row--striped { background: var(--gray-100); }

.inspera-datagrid__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px 4px 0;
}
.inspera-datagrid__range,
.inspera-datagrid__pagesize-label { font-size: 14px; color: var(--muted-foreground); }
.inspera-datagrid__pagesize { display: flex; align-items: center; gap: 8px; }
```

```html
<div class="inspera-datagrid">
  <table class="inspera-datagrid__table">
    <thead>
      <tr class="inspera-datagrid__head-row">
        <th class="inspera-datagrid__th inspera-datagrid__select" scope="col">
          <!-- select-all checkbox, see the Checkbox recipe -->
        </th>
        <th class="inspera-datagrid__th" scope="col" aria-sort="ascending">
          <button type="button" class="inspera-datagrid__sort" aria-pressed="true">
            Candidate
            <span class="material-symbols-outlined" aria-hidden="true">arrow_upward</span>
          </button>
        </th>
        <th class="inspera-datagrid__th" scope="col">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="inspera-datagrid__td inspera-datagrid__select"><!-- row checkbox --></td>
        <td class="inspera-datagrid__td">Ada Lovelace</td>
        <td class="inspera-datagrid__td">Submitted</td>
      </tr>
    </tbody>
  </table>

  <div class="inspera-datagrid__footer">
    <span class="inspera-datagrid__range">1 - 10 of 42</span>
    <!-- Pagination, see the Pagination recipe -->
    <div class="inspera-datagrid__pagesize">
      <span class="inspera-datagrid__pagesize-label">Rows per page</span>
      <!-- Select, see the Select recipe -->
    </div>
  </div>
</div>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
