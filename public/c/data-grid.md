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
  caption="Tests"
  columns={[
    { key: 'name', header: 'Test', sortable: true },
    {
      key: 'candidates',
      header: 'Candidates',
      align: 'right',
      sortable: true,
    },
    { key: 'status', header: 'Status' },
    { key: 'edited', header: 'Last edited', align: 'right', sortable: true },
  ]}
  rows={[
    {
      id: 'algebra',
      name: 'Algebra Quiz',
      candidates: 128,
      status: <Badge label="Live" intent="Success" />,
      edited: '12 Mar 2026',
    },
    {
      id: 'history',
      name: 'History Midterm',
      candidates: 96,
      status: <Badge label="Draft" intent="Neutral" />,
      edited: '11 Mar 2026',
    },
    {
      id: 'biology',
      name: 'Biology Final',
      candidates: 210,
      status: <Badge label="Scheduled" intent="Info" />,
      edited: '09 Mar 2026',
    },
  ]}
  getRowId={(row) => row.id}
  selectable
  rowActions={(row) => (
    <Menu
      label="Actions"
      aria-label={`Actions for ${row.name}`}
      items={[{ label: 'Edit', icon: 'edit' }, { label: 'Delete', icon: 'delete', danger: true }]}
    />
  )}
  footer
  total={242}
  pageCount={13}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` **(required)** | `DataGridColumn[]` | - | Column definitions. |
| `rows` **(required)** | `DataGridRow[]` | - | Row data keyed by column. |
| `getRowId` | `(row: DataGridRow, index: number) => string` | - | Stable id per row. Defaults to the row's position in `rows` - its position as given, not as sorted, so a selection stays on the row it was made on. |
| `size` | `'Compact' \| 'Default'` | `'Default'` | Row height density. |
| `striped` | `boolean` | `false` | Zebra-stripe rows. |
| `hoverable` | `boolean` | `true` | Highlight rows on hover and reveal row actions on hover. |
| `caption` | `string` | - | Describes the grid for screen readers. |
| `selectable` | `boolean` | `false` | Add a leading selection column with a select-all header box. |
| `selectedIds` | `string[]` | - | Selected row ids. Controlled - pair with onSelectionChange. |
| `defaultSelectedIds` | `string[]` | `[]` | Starting selection when uncontrolled. |
| `onSelectionChange` | `(ids: string[]) => void` | - | Fired with every selected id after any change. |
| `sort` | `DataGridSort` | - | Active sort. Controlled - pair with onSortChange. |
| `defaultSort` | `DataGridSort` | - | Starting sort when uncontrolled. |
| `onSortChange` | `(sort: DataGridSort) => void` | - | Fired when a sortable header is activated. |
| `manualSorting` | `boolean` | `false` | Rows arrive already sorted (server-side), so the grid only shows the state. |
| `rowActions` | `(row: DataGridRow, index: number) => ReactNode` | - | Trailing per-row actions. Revealed on hover and focus when `hoverable`. |
| `onRowClick` | `(row: DataGridRow, index: number) => void` | - | Makes rows clickable and keyboard-operable (Enter / Space). |
| `footer` | `boolean` | `false` | Show the footer with the range summary, pager and page-size select. |
| `total` | `number` | - | Total row count across all pages. Defaults to the rendered row count. |
| `pageCount` | `number` | `1` | Total number of pages. |
| `page` | `number` | - | Current page (1-based). Controlled - pair with onPageChange. |
| `defaultPage` | `number` | `1` | Starting page when uncontrolled. |
| `onPageChange` | `(page: number) => void` | - | Fired with the requested page. |
| `pageSize` | `number` | - | Rows per page. Controlled - pair with onPageSizeChange. |
| `defaultPageSize` | `number` | `20` | Starting page size when uncontrolled. |
| `onPageSizeChange` | `(size: number) => void` | - | Fired with the requested page size. |
| `pageSizeOptions` | `number[]` | `[10, 20, 50, 100]` | Selectable page sizes. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

```ts
export type DataGridRow = Record<string, ReactNode>

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
   * Value used for sorting when the cell renders a non-primitive node (a
   * Badge, say). Without it such a column cannot sort.
   */
  sortValue?: (row: DataGridRow) => string | number
}

export interface DataGridSort {
  key: string
  direction: DataGridSortDirection
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

- A data grid is a Table plus four things: a leading selection column, sortable headers, per-row actions, and a footer pager. Each is a documented component - Checkbox, Menu, Pagination and Select - so reach for those rather than rebuilding them.
- Sortable headers are buttons inside the `<th>`; the `<th>` carries `aria-sort` (`ascending` / `descending` / `none`). The active column is `--primary` with a solid arrow.
- Selection keys on a stable row id, never the row position - sort the table and the selection must stay on the same rows. Select-all acts on the rows on screen and is mixed when only some are selected.
- Every row-action trigger needs its own name ("Actions for Ada Lovelace"): a column of identical "Actions" buttons is indistinguishable to a screen reader. Actions reveal on row hover and on keyboard focus, and are always visible on touch screens.
- The footer shows "start - end of total", the pager, and a rows-per-page Select. Page long datasets rather than rendering every row.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --error:                  #D32F2F;
  --white:                  #ffffff;
  --gray-100:               #F7F7F7;
  --gray-200:               #EDEDED;
  --gray-300:               #D9D9D9;
  --gray-600:               #7A7A7A;
  --gray-700:               #595959;
  --blue-100:               #F0F7FF;
  --blue-300:               #B3D9FF;
  --red-300:                #F9B8B8;
  --primary-focus-ring:     rgba(0, 64, 128, 0.3);
  --action-hover:           rgba(0, 0, 0, 0.04);
  --action-disabled:        rgba(0, 0, 0, 0.38);
  --text-primary:           rgba(0, 0, 0, 0.87);
  --border-control:         #C4C4C4;
  --border-control-strong:  #8C8C8C;
  --surface-disabled:       #F5F5F5;
  --surface:                var(--white);
  --border:                 var(--gray-200);
  --border-strong:          var(--gray-300);
  --muted-foreground:       var(--gray-600);
  --radius-xs:              2px;
  --radius-sm:              4px;
  --radius-md:              8px;
  --shadow-200:             0px 8px 8px rgba(39, 39, 39, 0.08), 0px 4px 6px rgba(39, 39, 39, 0.12);
  --effect-state-focus:     0px 0px 0px 3px var(--blue-300);
  --effect-state-error:     0px 0px 0px 3px var(--red-300);
  --border-width-default:   1px;
  --focus-ring-width:       2px;
  --focus-ring-offset:      2px;
  --focus-ring-color:       var(--primary);
  --duration-fast:          100ms;
  --easing-standard:        cubic-bezier(0.2, 0, 0, 1);
  --z-dropdown:             300;
  --font-sans:              'Inter', system-ui, -apple-system, sans-serif;
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

.inspera-select {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 220px;
  font-family: var(--font-sans);
}

/* Content-adaptable: the trigger grows with the longest value instead of
   holding a fixed 220px. */
.inspera-select--auto { width: auto; }

.inspera-select__label {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.inspera-select__anchor { position: relative; }

.inspera-select__trigger {
  height: 40px;
  width: 220px;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 12px;
  border-radius: var(--radius-md);
  border: var(--border-width-default) solid var(--border-control);
  background: var(--white);
  /* Muted while showing the placeholder; --text-primary once a value is set. */
  color: var(--muted-foreground);
  font-family: var(--font-sans);
  font-size: 16px;
  cursor: pointer;
  transition:
    border-color var(--duration-fast) var(--easing-standard),
    box-shadow var(--duration-fast) var(--easing-standard);
}

.inspera-select--auto .inspera-select__trigger { width: auto; }

.inspera-select__trigger--filled { color: var(--text-primary); }

.inspera-select__trigger:hover { border-color: var(--border-control-strong); }

.inspera-select__trigger:focus-visible,
.inspera-select__trigger[aria-expanded='true'] {
  border-color: var(--primary);
  box-shadow: var(--effect-state-focus);
  outline: none;
}

.inspera-select__trigger .material-symbols-outlined {
  font-size: 20px;
  transition: transform 140ms ease;
}
.inspera-select__trigger[aria-expanded='true'] .material-symbols-outlined { transform: rotate(180deg); }

/* Invalid outranks hover and focus - the error has to stay legible. */
.inspera-select__trigger[aria-invalid='true'],
.inspera-select__trigger[aria-invalid='true']:hover {
  border-color: var(--error);
  box-shadow: var(--effect-state-error);
}
/* A div cannot be :disabled, so the state is read from aria-disabled. */
.inspera-select__trigger[aria-disabled='true'] {
  background: var(--surface-disabled);
  opacity: 0.6;
  cursor: not-allowed;
}
.inspera-select__trigger[aria-disabled='true']:hover { border-color: var(--border-control); }

.inspera-select__error { font-size: 12px; color: var(--error); }

/* The list is anchored to the trigger, not appended to the body. */
.inspera-select__list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  margin: 0;
  padding: 4px;
  list-style: none;
  background: var(--white);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-200);
  z-index: var(--z-dropdown, 20);
  max-height: 240px;
  overflow-y: auto;
}

.inspera-select__option {
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: 16px;
  cursor: pointer;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Two different things: --active is the keyboard cursor, [aria-selected] is
   the committed value. Collapsing them loses the arrow-key position. */
.inspera-select__option--active { background: var(--blue-100); }
.inspera-select__option[aria-selected='true'] { color: var(--primary); font-weight: 500; }

.inspera-select__empty {
  padding: 8px 12px;
  color: var(--muted-foreground);
  font-size: 14px;
}

.inspera-menu {
  position: relative;
  display: inline-block;
  font-family: var(--font-sans);
}

.inspera-menu__trigger {
  height: 40px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-strong);
  background: var(--white);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: none;
  transition: box-shadow 120ms ease;
}

.inspera-menu__trigger[aria-expanded='true'] {
  box-shadow: 0 0 0 3px var(--primary-focus-ring);
}

.inspera-menu__trigger .material-symbols-outlined {
  font-size: 20px;
  transition: transform 140ms ease;
}
.inspera-menu__trigger[aria-expanded='true'] .material-symbols-outlined { transform: rotate(180deg); }

.inspera-menu__list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: auto;
  min-width: 180px;
  padding: 4px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-200);
  z-index: var(--z-dropdown, 20);
}

/* Bottom End aligns the panel's right edge to the trigger's, for a menu near
   the right edge of the viewport. */
.inspera-menu__list--end { left: auto; right: 0; }

.inspera-menu__item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
  text-align: left;
  cursor: pointer;
  opacity: 1;
  transition: background 120ms ease;
}

/* The highlight follows the keyboard cursor, so hover and arrow keys have to
   drive the same state. */
.inspera-menu__item--active,
.inspera-menu__item:hover:not(:disabled) { background: var(--action-hover); }

.inspera-menu__item--danger { color: var(--error); }

.inspera-menu__item:disabled {
  color: var(--action-disabled);
  cursor: not-allowed;
  opacity: 0.6;
}

.inspera-menu__item .material-symbols-outlined { font-size: 20px; }

.inspera-menu__separator {
  height: 1px;
  background: var(--border);
  margin: 4px 0;
}

.inspera-datagrid { width: 100%; font-family: var(--font-sans); }

.inspera-datagrid__table {
  width: 100%;
  /* separate, not collapse: browsers ignore border-radius on a collapsed table. */
  border-collapse: separate;
  border-spacing: 0;
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
.inspera-datagrid__row:last-child .inspera-datagrid__td { border-bottom: none; }
.inspera-datagrid--compact .inspera-datagrid__th,
.inspera-datagrid--compact .inspera-datagrid__td { height: 40px; }

.inspera-datagrid__th {
  font-weight: 600;
  color: var(--gray-700);
}
.inspera-datagrid__select { width: 44px; text-align: center; }
.inspera-datagrid__actions { width: 96px; text-align: right; }

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
.inspera-datagrid__sort--active { color: var(--primary); }
.inspera-datagrid__sort .material-symbols-outlined { font-size: 18px; opacity: 0.35; }
.inspera-datagrid__sort--active .material-symbols-outlined { opacity: 1; }

.inspera-datagrid__row { background: var(--white); }
.inspera-datagrid__row--striped { background: var(--gray-100); }
.inspera-datagrid__row--selected { background: var(--blue-100); }
.inspera-datagrid__row:hover { background: var(--action-hover); }

/* Row actions wait for hover or keyboard focus, but stay in the tab order -
   and are always shown where there is no hover to reveal them. */
.inspera-datagrid__actions > * { opacity: 0; transition: opacity var(--duration-fast) var(--easing-standard); }
.inspera-datagrid__row:hover .inspera-datagrid__actions > *,
.inspera-datagrid__row:focus-within .inspera-datagrid__actions > * { opacity: 1; }
@media (hover: none) {
  .inspera-datagrid__actions > * { opacity: 1; }
}

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

.inspera-datagrid__visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}
```

```html
<div class="inspera-datagrid">
  <table class="inspera-datagrid__table">
    <thead>
      <tr class="inspera-datagrid__head-row">
        <th class="inspera-datagrid__th inspera-datagrid__select" scope="col"><label class="inspera-checkbox inspera-checkbox--mixed" for="dg-all"><input class="inspera-checkbox__input" id="dg-all" type="checkbox" aria-label="Select all rows" /><span class="inspera-checkbox__box" aria-hidden="true"><span class="material-symbols-outlined">remove</span></span></label></th>
        <th class="inspera-datagrid__th" scope="col" aria-sort="ascending">
          <button type="button" class="inspera-datagrid__sort inspera-datagrid__sort--active">
            Candidate
            <span class="material-symbols-outlined" aria-hidden="true">arrow_upward</span>
          </button>
        </th>
        <th class="inspera-datagrid__th" scope="col">Status</th>
        <th class="inspera-datagrid__th inspera-datagrid__actions" scope="col"><span class="inspera-datagrid__visually-hidden">Actions</span></th>
      </tr>
    </thead>
    <tbody>
        <tr class="inspera-datagrid__row inspera-datagrid__row--selected">
          <td class="inspera-datagrid__td inspera-datagrid__select"><label class="inspera-checkbox" for="dg-row-0"><input class="inspera-checkbox__input" id="dg-row-0" type="checkbox" aria-label="Select Ada Lovelace" checked /><span class="inspera-checkbox__box" aria-hidden="true"><span class="material-symbols-outlined">check</span></span></label></td>
          <td class="inspera-datagrid__td">Ada Lovelace</td>
          <td class="inspera-datagrid__td">Submitted</td>
          <td class="inspera-datagrid__td inspera-datagrid__actions">
            <div class="inspera-menu">
              <button type="button" class="inspera-menu__trigger" aria-haspopup="menu" aria-expanded="false" aria-label="Actions for Ada Lovelace">
                Actions
                <span class="material-symbols-outlined" aria-hidden="true">expand_more</span>
              </button>
            </div>
          </td>
        </tr>
        <tr class="inspera-datagrid__row">
          <td class="inspera-datagrid__td inspera-datagrid__select"><label class="inspera-checkbox" for="dg-row-1"><input class="inspera-checkbox__input" id="dg-row-1" type="checkbox" aria-label="Select Grace Hopper" /><span class="inspera-checkbox__box" aria-hidden="true"></span></label></td>
          <td class="inspera-datagrid__td">Grace Hopper</td>
          <td class="inspera-datagrid__td">In progress</td>
          <td class="inspera-datagrid__td inspera-datagrid__actions">
            <div class="inspera-menu">
              <button type="button" class="inspera-menu__trigger" aria-haspopup="menu" aria-expanded="false" aria-label="Actions for Grace Hopper">
                Actions
                <span class="material-symbols-outlined" aria-hidden="true">expand_more</span>
              </button>
            </div>
          </td>
        </tr>
    </tbody>
  </table>
  <div class="inspera-datagrid__footer">
    <span class="inspera-datagrid__range">61 - 62 of 242</span>
    <nav class="inspera-pagination inspera-pagination--small" aria-label="Pagination">
      <ul class="inspera-pagination__list">
        <li><button type="button" class="inspera-pagination__item" aria-label="First page"><span class="material-symbols-outlined" aria-hidden="true">first_page</span></button></li>
        <li><button type="button" class="inspera-pagination__item" aria-label="Previous page"><span class="material-symbols-outlined" aria-hidden="true">chevron_left</span></button></li>
        <li><button type="button" class="inspera-pagination__item" aria-label="Page 1">1</button></li>
        <li><span class="inspera-pagination__item inspera-pagination__ellipsis" aria-hidden="true">...</span></li>
        <li><button type="button" class="inspera-pagination__item" aria-label="Page 3">3</button></li>
        <li><button type="button" class="inspera-pagination__item" aria-label="Page 4" aria-current="page">4</button></li>
        <li><button type="button" class="inspera-pagination__item" aria-label="Page 5">5</button></li>
        <li><span class="inspera-pagination__item inspera-pagination__ellipsis" aria-hidden="true">...</span></li>
        <li><button type="button" class="inspera-pagination__item" aria-label="Page 12">12</button></li>
        <li><button type="button" class="inspera-pagination__item" aria-label="Next page"><span class="material-symbols-outlined" aria-hidden="true">chevron_right</span></button></li>
        <li><button type="button" class="inspera-pagination__item" aria-label="Last page"><span class="material-symbols-outlined" aria-hidden="true">last_page</span></button></li>
      </ul>
    </nav>
    <div class="inspera-datagrid__pagesize">
      <span class="inspera-datagrid__pagesize-label" aria-hidden="true">Rows per page</span>
      <div class="inspera-select inspera-select--auto">
        <div class="inspera-select__anchor">
          <div class="inspera-select__trigger inspera-select__trigger--filled" role="combobox" tabindex="0" aria-label="Rows per page" aria-expanded="false" aria-haspopup="listbox">
            <span>20</span>
            <span class="material-symbols-outlined" aria-hidden="true">expand_more</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
