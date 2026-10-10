<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera Design System - Data display - tables and lists

> Version 1.0.0. Part 4 of 7 of the AI spec: Table, Data Grid, List.
>
> These specs build on `inspera-01-core.md` - its rules, its setup
> (fonts, icon class, tokens) and its foundations. If that file is not in your
> context, ask for it before building. Without it, fonts, icons and colours
> come out wrong.

## Components - data-display

### Table

Display structured data in rows and columns. - category: `data-display`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Table } from '@inspera/components'

<Table
  caption="Assessments"
  columns={[
    { key: 'name', header: 'Assessment' },
    { key: 'items', header: 'Items', align: 'right' },
    { key: 'status', header: 'Status' },
  ]}
  rows={[
    {
      name: 'Algebra Quiz',
      items: 24,
      status: <Badge label="Live" intent="Success" />,
    },
    {
      name: 'History Midterm',
      items: 40,
      status: <Badge label="Draft" intent="Neutral" />,
    },
    {
      name: 'Biology Final',
      items: 60,
      status: <Badge label="Scheduled" intent="Info" />,
    },
  ]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` **(required)** | `TableColumn[]` | - | Column definitions. |
| `rows` **(required)** | `TableRow[]` | - | Row data keyed by column. |
| `getRowId` | `(row: TableRow, index: number) => string` | - | Stable id per row, for selection and keys. Defaults to the row's position. |
| `size` | `'Compact' \| 'Default'` | `'Default'` | Row height density. |
| `striped` | `boolean` | `false` | Zebra-stripe rows. |
| `hoverable` | `boolean` | `true` | Highlight rows on hover. |
| `selectable` | `boolean` | `false` | Add a selection column with a select-all box. |
| `selectedIds` | `string[]` | - | Selected row ids. Controlled - pair with onSelectionChange. |
| `defaultSelectedIds` | `string[]` | `[]` | Starting selection when uncontrolled. |
| `onSelectionChange` | `(ids: string[]) => void` | - | Fired with every selected id after any change. |
| `caption` | `string` | - | Describes the table for screen readers. Provide one unless a heading already names it. |
| `onRowClick` | `(row: TableRow, index: number) => void` | - | Makes rows clickable and keyboard-operable (Enter / Space). |

Also accepts any native `<table>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<table>`. `className` and `style` go on the outermost element.

```ts
export interface TableColumn {
  key: string
  header: string
  align?: 'left' | 'right' | 'center'
  width?: string | number
}

export type TableRow = Record<string, ReactNode>
```

**Accessibility** - role `table`, keyboard operable. Use semantic table / thead / tbody markup; Header cells use scope="col"; Provide a caption or aria-label describing the table.

**Do:** Use for comparable, structured records; Right-align numeric columns; Keep headers concise.
**Don't:** Do not use tables for page layout; Do not overload rows with unrelated actions.

**Choosing a variant:**
- `size="Default"`: Short tables people read row by row, such as the questions of a test. The default size.
- `size="Compact"`: Long rosters people scan, such as all tests in Deliver.
- `striped`: Wide rows that people read across, such as a roster with many columns.
- `selectable`: People act on several rows at once, such as messaging candidates. Show what they can do once rows are selected.
- `hoverable="false"`: Rows that open nothing, such as a summary of results. Without the hover, nothing suggests they can be clicked.

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
  --white:             #ffffff;
  --gray-100:          #F7F7F7;
  --gray-200:          #EDEDED;
  --gray-700:          #595959;
  --gray-900:          #272727;
  --blue-800:          #004080;
  --green-800:         #106542;
  --red-700:           #A50D0D;
  --orange-800:        #7E5501;
  --action-hover:      rgba(0, 0, 0, 0.04);
  --text-primary:      rgba(0, 0, 0, 0.87);
  --info-surface:      #E1F5FE;
  --success-surface:   #E8F5E9;
  --warning-surface:   #FFF3E0;
  --error-surface:     #FFEBEE;
  --info-text:         var(--blue-800);
  --success-text:      var(--green-800);
  --warning-text:      var(--orange-800);
  --error-text:        var(--red-700);
  --surface-neutral:   #F0F0F0;
  --border:            var(--gray-200);
  --muted-foreground:  var(--gray-700);
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
.inspera-badge--info    { --badge-bg: var(--info-surface);    --badge-fg: var(--info-text); }
.inspera-badge--success { --badge-bg: var(--success-surface); --badge-fg: var(--success-text); }
.inspera-badge--warning { --badge-bg: var(--warning-surface); --badge-fg: var(--warning-text); }
.inspera-badge--error   { --badge-bg: var(--error-surface);   --badge-fg: var(--error-text); }

/* The icon is filled, not outlined, at 16px (14px in a small badge). */
.inspera-badge .material-symbols-outlined {
  font-size: 16px;
  font-variation-settings: 'FILL' 1;
}
.inspera-badge--small .material-symbols-outlined { font-size: 14px; }

.inspera-table {
  /* separate, not collapse: browsers ignore border-radius on a collapsed table. */
  border-collapse: separate;
  border-spacing: 0;
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

/* The table's own border closes the last row. */
.inspera-table tbody tr:last-child td { border-bottom: none; }

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
  margin: 0;
  vertical-align: middle;
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
      iconOnly
      size="Small"
      label={`Actions for ${row.name}`}
      placement="BottomEnd"
      items={[{ label: 'Edit', icon: 'edit' }, { label: 'Duplicate', icon: 'content_copy' }, { label: '', divider: true }, { label: 'Delete', icon: 'delete', danger: true }]}
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
| `hoverable` | `boolean` | `true` | Highlight rows on hover, and bring row actions to full strength on hover. |
| `caption` | `string` | - | Describes the grid for screen readers. |
| `selectable` | `boolean` | `false` | Add a leading selection column with a select-all header box. |
| `selectedIds` | `string[]` | - | Selected row ids. Controlled - pair with onSelectionChange. |
| `defaultSelectedIds` | `string[]` | `[]` | Starting selection when uncontrolled. |
| `onSelectionChange` | `(ids: string[]) => void` | - | Fired with every selected id after any change. |
| `sort` | `DataGridSort` | - | Active sort. Controlled - pair with onSortChange. |
| `defaultSort` | `DataGridSort` | - | Starting sort when uncontrolled. |
| `onSortChange` | `(sort: DataGridSort) => void` | - | Fired when a sortable header is activated. |
| `manualSorting` | `boolean` | `false` | Rows arrive already sorted (server-side), so the grid only shows the state. |
| `rowActions` | `(row: DataGridRow, index: number) => ReactNode` | - | Trailing per-row actions. Always visible; quieter at rest, full strength on row hover and focus when `hoverable`. Use an icon-only Small Menu named for its row: `<Menu iconOnly size="Small" label={`Actions for ${row.name}`} ... />`. |
| `onRowClick` | `(row: DataGridRow, index: number) => void` | - | Makes rows clickable and keyboard-operable (Enter / Space). |
| `footer` | `boolean` | `false` | Show the footer with the range summary, pager and page-size select. |
| `total` | `number` | - | Total row count across all pages, when `rows` is one page of a larger set fetched page by page. The range then reads from the page and page size ("21 - 40 of 179"). Defaults to the rendered row count. |
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

**Choosing a variant:**
- `size="Compact"`: Long lists people scan, such as every test in Deliver.
- `striped`: Many columns that people read across.
- `selectable`: People act on several rows at once, such as assigning scripts to a grader.
- `footer`: More rows than fit on one page. The footer says where people are and pages through the rest.
- `footer="false"`: A short set that fits on one page, such as the graders on one test.

**Deprecated aliases** (do not use): `Data table`, `Advanced table`, `Grid`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- A data grid is a Table plus four things: a leading selection column, sortable headers, per-row actions, and a footer pager. Each is a documented component - Checkbox, Menu, Pagination and Select - so reach for those rather than rebuilding them.
- Sortable headers are buttons inside the `<th>`; the `<th>` carries `aria-sort` (`ascending` / `descending` / `none`). The active column is `--primary` with a solid arrow.
- Selection keys on a stable row id, never the row position - sort the table and the selection must stay on the same rows. Select-all acts on the rows on screen and is mixed when only some are selected.
- Row actions are one Menu per row behind a Small icon-only `more_vert` trigger (32px, a Text button), not a labelled button. Each trigger needs its own name ("Actions for Ada Lovelace"): a column of identical names is indistinguishable to a screen reader. Actions are always visible, at 0.7 opacity at rest and full strength on row hover, keyboard focus and touch screens, so people can see a row has actions without hovering it.
- The footer shows "start - end of total", the pager, and a rows-per-page Select. Page long datasets rather than rendering every row. When the rows are one page of a larger set, the range comes from the page and the page size: page 4 of 20 rows is "61 - 80", and only the last page ends early.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --error:                  #D32F2F;
  --success:                #2E7D32;
  --white:                  #ffffff;
  --gray-100:               #F7F7F7;
  --gray-200:               #EDEDED;
  --gray-300:               #D9D9D9;
  --gray-600:               #7A7A7A;
  --gray-700:               #595959;
  --gray-800:               #404040;
  --gray-900:               #272727;
  --blue-100:               #F0F7FF;
  --blue-300:               #B3D9FF;
  --red-300:                #F9B8B8;
  --orange-600:             #F2A202;
  --primary-focus-ring:     rgba(0, 64, 128, 0.3);
  --action-hover:           rgba(0, 0, 0, 0.04);
  --action-disabled:        rgba(0, 0, 0, 0.38);
  --text-primary:           rgba(0, 0, 0, 0.87);
  --error-surface:          #FFEBEE;
  --border-control:         var(--gray-600);
  --border-control-strong:  var(--gray-800);
  --text-placeholder:       var(--gray-700);
  --surface-disabled:       #F5F5F5;
  --surface:                var(--white);
  --border:                 var(--gray-200);
  --border-strong:          var(--gray-300);
  --muted-foreground:       var(--gray-700);
  --control-height-sm:      32px;
  --control-height-md:      40px;
  --control-height-lg:      44px;
  --radius-xs:              2px;
  --radius-sm:              4px;
  --radius-md:              8px;
  --shadow-200:             0px 8px 8px rgba(39, 39, 39, 0.08), 0px 4px 6px rgba(39, 39, 39, 0.12);
  --effect-state-focus:     0px 0px 0px 3px var(--blue-300);
  --effect-state-error:     0px 0px 0px 3px var(--red-300);
  --effect-button-shadow:   inset 0px -1px 0px rgba(0, 0, 0, 0.2), 0px 1px 0px rgba(0, 0, 0, 0.08);
  --border-width-default:   1px;
  --focus-ring-width:       2px;
  --focus-ring-offset:      2px;
  --focus-ring-color:       var(--primary);
  --duration-fast:          100ms;
  --easing-standard:        cubic-bezier(0.2, 0, 0, 1);
  --z-dropdown:             300;
  --font-sans:              'Inter', system-ui, -apple-system, sans-serif;
  --medium-14-size:         14px;
  --medium-14-line-height:  1.4;
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
  width: 18px;
  height: 18px;
  border-radius: var(--radius-xs);
  border: 2px solid var(--border-control);
  background: var(--white);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  flex-shrink: 0;
  transition: all 120ms ease;
}

/* The tick is a Material Symbol at the box size minus 4. */
.inspera-checkbox__box .material-symbols-outlined {
  font-size: 14px;
  font-variation-settings: 'wght' 600;
}

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

/* In error the border is red whether or not the box is checked, so a group
   in error reads as one. A checked box keeps its blue fill, and only an
   unchecked one takes the red hover tint. */
.inspera-checkbox--error .inspera-checkbox__box { border-color: var(--error); }
.inspera-checkbox--error:hover .inspera-checkbox__box { border-color: var(--error); background: var(--error-surface); }
.inspera-checkbox--error .inspera-checkbox__input:checked + .inspera-checkbox__box,
.inspera-checkbox--error .inspera-checkbox__input:indeterminate + .inspera-checkbox__box,
.inspera-checkbox--error.inspera-checkbox--mixed .inspera-checkbox__box,
.inspera-checkbox--error:hover .inspera-checkbox__input:checked + .inspera-checkbox__box,
.inspera-checkbox--error:hover .inspera-checkbox__input:indeterminate + .inspera-checkbox__box,
.inspera-checkbox--error.inspera-checkbox--mixed:hover .inspera-checkbox__box {
  border-color: var(--error);
  background: var(--primary);
}

.inspera-checkbox--disabled {
  cursor: not-allowed;
  opacity: 0.38;
}
.inspera-checkbox--disabled:hover .inspera-checkbox__box {
  border-color: var(--border-control);
  background: var(--white);
}

/* A line under the label: a description, or the error in its place. The
   field stacks the row and the line. The line starts under the label text
   (the 18px box plus its 8px gap) and sits 4px under it, pulled up into the
   row's 8px padding. It is not dimmed with a disabled box: it often says why
   the option is unavailable. */
.inspera-checkbox-field {
  display: inline-flex;
  flex-direction: column;
  font-family: var(--font-sans);
}
.inspera-checkbox__message {
  margin-top: -4px;
  padding-left: 26px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--muted-foreground);
}
.inspera-checkbox__message--error { color: var(--error); }

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
  border-radius: var(--radius-sm);
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
  gap: 4px;
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
  border-radius: var(--radius-sm);
  border: var(--border-width-default) solid var(--border-control);
  background: var(--white);
  /* Placeholder colour until a value is set, then --text-primary. */
  color: var(--text-placeholder);
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
  height: var(--control-height-md);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  border-radius: var(--radius-sm);
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

/* Small: 32px, with 14px text and a 16px chevron, as a Small button. */
.inspera-menu__trigger--small {
  height: var(--control-height-sm);
  gap: 4px;
  padding: 0 8px;
  font-size: 14px;
}
.inspera-menu__trigger--small .material-symbols-outlined { font-size: 16px; }

/* Icon only (table rows, card headers, toolbars): the trigger is the canonical
   Text icon-only button with more_vert, and the menu sits beside it as usual. */

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

.inspera-btn {
  /* Fill, text and border come from the intent modifier below. */
  --btn-bg: var(--primary);
  --btn-fg: var(--white);
  --btn-border: transparent;
  --btn-shadow: var(--effect-button-shadow);
  --btn-bg-hover: color-mix(in srgb, var(--btn-bg) 90%, black);
  --btn-bg-active: color-mix(in srgb, var(--btn-bg) 82%, black);
  --btn-shadow-hover: inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 2px 6px rgba(0, 64, 128, 0.24);
  --btn-shadow-active: inset 0 1px 2px rgba(0, 0, 0, 0.24);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: var(--control-height-md);
  min-width: 80px;
  padding: 0 16px;
  border-radius: var(--radius-sm);
  border: var(--border-width-default) solid var(--btn-border);
  background: var(--btn-bg);
  color: var(--btn-fg);
  box-shadow: var(--btn-shadow);
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.25;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background var(--duration-fast) var(--easing-standard),
    border-color var(--duration-fast) var(--easing-standard),
    box-shadow var(--duration-fast) var(--easing-standard),
    transform var(--duration-fast) var(--easing-standard);
}

/* Sizes change height and padding. Small also steps down to 14px type and a
   16px icon (see the end of this block). */
.inspera-btn--small {
  height: var(--control-height-sm);
  padding: 0 12px;
  gap: 4px;
  font-size: var(--medium-14-size);
  line-height: var(--medium-14-line-height);
}
.inspera-btn--large { height: var(--control-height-lg); padding: 0 20px; }

/* Icon only: a square the height of the button. It still needs aria-label. */
.inspera-btn--icon-only { width: var(--control-height-md); min-width: 0; padding: 0; }
.inspera-btn--small.inspera-btn--icon-only { width: var(--control-height-sm); }
.inspera-btn--large.inspera-btn--icon-only { width: var(--control-height-lg); }

/* Solid intents differ only in fill; hover and pressed derive from it. */
.inspera-btn--primary     { --btn-bg: var(--primary); }
.inspera-btn--success     { --btn-bg: var(--success); }
/* Warning takes dark text on orange-600: white on --warning is 3.08:1. */
.inspera-btn--warning     { --btn-bg: var(--orange-600); --btn-fg: var(--gray-900); }
.inspera-btn--destructive { --btn-bg: var(--error); }
.inspera-btn--secondary {
  --btn-bg: var(--gray-100);
  --btn-fg: var(--gray-900);
  --btn-border: var(--gray-700);
}

/* Outline and Text carry no fill and no shadow; they tint on interaction. */
.inspera-btn--outline,
.inspera-btn--text {
  --btn-bg: transparent;
  --btn-fg: var(--primary);
  --btn-shadow: none;
  --btn-shadow-hover: none;
  --btn-shadow-active: none;
  --btn-bg-hover: color-mix(in srgb, var(--primary) 8%, transparent);
  --btn-bg-active: color-mix(in srgb, var(--primary) 12%, transparent);
}
.inspera-btn--outline { --btn-border: var(--primary); }

.inspera-btn:hover:not(:disabled) {
  background: var(--btn-bg-hover);
  box-shadow: var(--btn-shadow-hover);
}
/* A button that opens a menu keeps its hover fill while the menu is open. */
.inspera-btn[aria-expanded='true'] { background: var(--btn-bg-hover); }
.inspera-btn:active:not(:disabled) {
  background: var(--btn-bg-active);
  box-shadow: var(--btn-shadow-active);
  transform: translateY(1px);
}
.inspera-btn:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}
.inspera-btn:disabled { opacity: 0.38; cursor: not-allowed; }

.inspera-btn .material-symbols-outlined { font-size: 20px; }
.inspera-btn--small .material-symbols-outlined { font-size: 16px; }

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
/* Width 1px shrinks the column to the trigger it holds. */
.inspera-datagrid__actions { width: 1px; text-align: right; }

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

/* Row actions are always visible. They sit back at rest (0.7 keeps the icon
   above 3:1) and come to full strength on row hover or keyboard focus. */
.inspera-datagrid__actions > * { opacity: 0.7; transition: opacity var(--duration-fast) var(--easing-standard); }
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
              <button type="button" class="inspera-btn inspera-btn--text inspera-btn--small inspera-btn--icon-only" aria-haspopup="menu" aria-expanded="false" aria-label="Actions for Ada Lovelace">
                <span class="material-symbols-outlined" aria-hidden="true">more_vert</span>
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
              <button type="button" class="inspera-btn inspera-btn--text inspera-btn--small inspera-btn--icon-only" aria-haspopup="menu" aria-expanded="false" aria-label="Actions for Grace Hopper">
                <span class="material-symbols-outlined" aria-hidden="true">more_vert</span>
              </button>
            </div>
          </td>
        </tr>
    </tbody>
  </table>
  <div class="inspera-datagrid__footer">
    <span class="inspera-datagrid__range">61 - 80 of 242</span>
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


### List

Present a vertical series of related items. - category: `data-display`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { List } from '@inspera/components'

<List
  items={[
    {
      primary: 'General settings',
      secondary: 'Language, timezone, theme',
      leadingIcon: 'settings',
      trailingIcon: 'chevron_right',
    },
    {
      primary: 'Notifications',
      secondary: 'Email and push preferences',
      leadingIcon: 'notifications',
      trailingIcon: 'chevron_right',
    },
    {
      primary: 'Security',
      secondary: 'Password and two-factor auth',
      leadingIcon: 'lock',
      trailingIcon: 'chevron_right',
    },
  ]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` **(required)** | `ListItem[]` | - | List rows. |
| `divided` | `boolean` | `true` | Show dividers between rows. |
| `interactive` | `boolean` | `false` | Make rows clickable. |
| `size` | `'Compact' \| 'Default'` | `'Default'` | Row density. |
| `onItemClick` | `(item: ListItem, index: number) => void` | - | Fired with the item and its index. Set interactive as well. |

Also accepts any native `<ul>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<ul>`. `className` and `style` go on the outermost element.

```ts
export interface ListItem {
  /** Stable key. Defaults to the row position. */
  id?: string
  primary: string
  secondary?: string
  /** Material Symbols name shown before the text. */
  leadingIcon?: string
  /** Material Symbols name shown after the text, e.g. `chevron_right`. */
  trailingIcon?: string
  /** Any element before the text - an Avatar, a Checkbox. */
  leading?: ReactNode
  /** Any element after the text - a Badge, a count. Strings render as text. */
  trailing?: ReactNode
}
```

**Accessibility** - role `list`, keyboard operable. Use semantic list markup (ul / li); Interactive rows are buttons and keyboard focusable; Provide meaningful text for each item.

**Do:** Use for settings, results, and simple records; Keep primary text scannable; Use secondary text for supporting detail.
**Don't:** Do not use for comparable tabular data - use Table; Do not make only part of a row clickable.

**Choosing a variant:**
- `size="Default"`: Lists people read item by item, such as the activity on a test. The default size.
- `size="Compact"`: Dense side panels, such as the candidates who need help in Monitor.
- `interactive`: Each row opens something, such as a page of settings. The whole row is the target.
- `divided="false"`: Short lists that read as one group, where whitespace separates the rows.

**Deprecated aliases** (do not use): `List view`, `Item list`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- Set the four border longhands, never the `border` shorthand. A shorthand on the row wipes the bottom border that draws the divider - the exact bug this component shipped with.
- Interactive rows are `<button>` inside the `<li>`, so focus and Enter/Space work without a keydown handler.
- Row padding is 12px (8px compact) vertical, 16px horizontal; primary text 14px/500, secondary 13px `--muted-foreground`.
- The divider is on every row but the last, drawn by `li:not(:last-child)` rather than by counting in script.
- Leading and trailing icons are 20px (18px compact) and always `aria-hidden` - the row's text is the label.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:           #004080;
  --white:             #ffffff;
  --gray-200:          #EDEDED;
  --gray-700:          #595959;
  --action-hover:      rgba(0, 0, 0, 0.04);
  --text-primary:      rgba(0, 0, 0, 0.87);
  --border:            var(--gray-200);
  --muted-foreground:  var(--gray-700);
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

