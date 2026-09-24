import { type AriaAttributes, type CSSProperties, type KeyboardEvent, type ReactNode, useMemo } from 'react'
import Checkbox from './Checkbox'
import Pagination from './Pagination'
import Select from './Select'
import { rowName } from './Table'
import { cx, srOnly, type NativeAttrs } from './types'
import { useControllableState } from './useControllableState'

export type DataGridSize = 'Compact' | 'Default'
export type DataGridSortDirection = 'Ascending' | 'Descending'

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

export interface DataGridProps {
  /** Column definitions. */
  columns: DataGridColumn[]
  /** Row data keyed by column. */
  rows: DataGridRow[]
  /**
   * Stable id per row. Defaults to the row's position in `rows` - its position
   * as given, not as sorted, so a selection stays on the row it was made on.
   */
  getRowId?: (row: DataGridRow, index: number) => string
  /** Row height density. */
  size?: DataGridSize
  /** Zebra-stripe rows. */
  striped?: boolean
  /** Highlight rows on hover and reveal row actions on hover. */
  hoverable?: boolean
  /** Describes the grid for screen readers. */
  caption?: string

  /** Add a leading selection column with a select-all header box. */
  selectable?: boolean
  /** Selected row ids. Controlled - pair with onSelectionChange. */
  selectedIds?: string[]
  /** Starting selection when uncontrolled. */
  defaultSelectedIds?: string[]
  /** Fired with every selected id after any change. */
  onSelectionChange?: (ids: string[]) => void

  /** Active sort. Controlled - pair with onSortChange. */
  sort?: DataGridSort
  /** Starting sort when uncontrolled. */
  defaultSort?: DataGridSort
  /** Fired when a sortable header is activated. */
  onSortChange?: (sort: DataGridSort) => void
  /** Rows arrive already sorted (server-side), so the grid only shows the state. */
  manualSorting?: boolean

  /** Trailing per-row actions. Revealed on hover and focus when `hoverable`. */
  rowActions?: (row: DataGridRow, index: number) => ReactNode
  /** Makes rows clickable and keyboard-operable (Enter / Space). */
  onRowClick?: (row: DataGridRow, index: number) => void

  /** Show the footer with the range summary, pager and page-size select. */
  footer?: boolean
  /** Total row count across all pages. Defaults to the rendered row count. */
  total?: number
  /** Total number of pages. */
  pageCount?: number
  /** Current page (1-based). Controlled - pair with onPageChange. */
  page?: number
  /** Starting page when uncontrolled. */
  defaultPage?: number
  /** Fired with the requested page. */
  onPageChange?: (page: number) => void
  /** Rows per page. Controlled - pair with onPageSizeChange. */
  pageSize?: number
  /** Starting page size when uncontrolled. */
  defaultPageSize?: number
  /** Fired with the requested page size. */
  onPageSizeChange?: (size: number) => void
  /** Selectable page sizes. */
  pageSizeOptions?: number[]
}

/** Pull a comparable primitive from a cell for client-side sorting. */
function comparableValue(row: DataGridRow, col: DataGridColumn): string | number {
  if (col.sortValue) return col.sortValue(row)
  const raw = row[col.key]
  if (typeof raw === 'number' || typeof raw === 'string') return raw
  return ''
}

export default function DataGrid({
  columns,
  rows,
  getRowId,
  size = 'Default',
  striped = false,
  hoverable = true,
  caption,
  selectable = false,
  selectedIds,
  defaultSelectedIds = [],
  onSelectionChange,
  sort: sortProp,
  defaultSort,
  onSortChange,
  manualSorting = false,
  rowActions,
  onRowClick,
  footer = false,
  total,
  pageCount = 1,
  page: pageProp,
  defaultPage = 1,
  onPageChange,
  pageSize: pageSizeProp,
  defaultPageSize = 20,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className,
  style,
  ...rest
}: DataGridProps & NativeAttrs<'div', DataGridProps>) {
  const rowH = size === 'Compact' ? 40 : 52

  // Ids come from each row's position in `rows` as given. Keying on the sorted
  // position moved a selection onto a different row the moment you sorted.
  const idFor = useMemo(() => {
    const map = new Map<DataGridRow, string>()
    rows.forEach((row, i) => map.set(row, getRowId ? getRowId(row, i) : String(i)))
    return (row: DataGridRow) => map.get(row)!
  }, [rows, getRowId])

  const [selected, setSelected] = useControllableState(selectedIds, defaultSelectedIds, onSelectionChange)
  const [sort, setSort] = useControllableState<DataGridSort | undefined>(
    sortProp,
    defaultSort,
    onSortChange as ((s: DataGridSort | undefined) => void) | undefined,
  )
  const [page, setPage] = useControllableState(pageProp, defaultPage, onPageChange)
  const [pageSize, setPageSize] = useControllableState(pageSizeProp, defaultPageSize, onPageSizeChange)

  const requestSort = (key: string) =>
    setSort({ key, direction: sort?.key === key && sort.direction === 'Ascending' ? 'Descending' : 'Ascending' })

  const sortedRows = useMemo(() => {
    if (manualSorting || !sort) return rows
    const col = columns.find((c) => c.key === sort.key)
    if (!col) return rows
    const factor = sort.direction === 'Ascending' ? 1 : -1
    return [...rows].sort((a, b) => {
      const av = comparableValue(a, col)
      const bv = comparableValue(b, col)
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * factor
      return String(av).localeCompare(String(bv)) * factor
    })
  }, [rows, columns, sort, manualSorting])

  const shownIds = sortedRows.map(idFor)
  const allSelected = shownIds.length > 0 && shownIds.every((id) => selected.includes(id))
  const someSelected = shownIds.some((id) => selected.includes(id))
  const toggleRow = (id: string) =>
    setSelected(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id])
  // Select-all acts on the rows on screen and leaves selections made on other
  // pages alone; it used to replace the whole selection.
  const toggleAll = () =>
    setSelected(allSelected
      ? selected.filter((id) => !shownIds.includes(id))
      : [...new Set([...selected, ...shownIds])])

  const cell = (last: boolean): CSSProperties => ({
    padding: '0 16px',
    fontSize: 14,
    color: 'var(--text-primary)',
    borderBottom: last ? 'none' : 'var(--border-width-default) solid var(--border)',
    whiteSpace: 'nowrap',
  })
  const head: CSSProperties = { ...cell(false), fontWeight: 600, color: 'var(--gray-700)' }

  const totalRows = total ?? sortedRows.length
  const rangeStart = totalRows === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeEnd = Math.min(totalRows, rangeStart + sortedRows.length - 1)

  const onRowKey = (e: KeyboardEvent, row: DataGridRow, i: number) => {
    if (e.target !== e.currentTarget || (e.key !== 'Enter' && e.key !== ' ')) return
    e.preventDefault()
    onRowClick?.(row, i)
  }

  return (
    <div className={cx('inspera', className)} style={{ width: '100%', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <table
        style={{
          // `separate`, not `collapse`: browsers ignore border-radius on a
          // collapsed table. Row menus render in a portal, so the clip here
          // no longer cuts them off.
          borderCollapse: 'separate',
          borderSpacing: 0,
          width: '100%',
          background: 'var(--white)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          border: 'var(--border-width-default) solid var(--border)',
        }}
      >
        {caption && (
          <caption style={{ captionSide: 'top', textAlign: 'left', padding: '0 0 8px', fontSize: 13, color: 'var(--muted-foreground)' }}>
            {caption}
          </caption>
        )}
        <thead>
          <tr style={{ background: 'var(--gray-100)', height: rowH }}>
            {selectable && (
              <th scope="col" style={{ ...head, width: 44, textAlign: 'center' }}>
                <Checkbox
                  label="Select all rows"
                  withLabel={false}
                  checked={allSelected}
                  indeterminate={!allSelected && someSelected}
                  onChange={toggleAll}
                />
              </th>
            )}
            {columns.map((col) => {
              const isActive = sort?.key === col.key
              const ariaSort: AriaAttributes['aria-sort'] = !col.sortable
                ? undefined
                : isActive
                  ? sort?.direction === 'Ascending' ? 'ascending' : 'descending'
                  : 'none'
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={ariaSort}
                  style={{ ...head, width: col.width, textAlign: col.align ?? 'left' }}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      className="inspera-interactive"
                      onClick={() => requestSort(col.key)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        font: 'inherit',
                        fontWeight: 600,
                        color: isActive ? 'var(--primary)' : 'var(--gray-700)',
                        cursor: 'pointer',
                        flexDirection: col.align === 'right' ? 'row-reverse' : 'row',
                      }}
                    >
                      {col.header}
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 18, opacity: isActive ? 1 : 0.35 }}
                        aria-hidden
                      >
                        {isActive && sort?.direction === 'Descending' ? 'arrow_downward' : 'arrow_upward'}
                      </span>
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              )
            })}
            {rowActions && (
              <th scope="col" style={{ ...head, position: 'relative', width: 96 }}>
                <span style={srOnly}>Actions</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, i) => {
            const id = idFor(row)
            const last = i === sortedRows.length - 1
            const isSelected = selected.includes(id)
            const fill = isSelected ? 'var(--blue-100)' : striped && i % 2 === 1 ? 'var(--gray-100)' : 'var(--white)'
            return (
              <tr
                key={id}
                className={hoverable ? 'inspera-interactive inspera-row' : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onClick={onRowClick ? () => onRowClick(row, i) : undefined}
                onKeyDown={onRowClick ? (e) => onRowKey(e, row, i) : undefined}
                style={{
                  '--inspera-row-bg': fill,
                  height: rowH,
                  ...(hoverable ? null : { background: fill }),
                  cursor: onRowClick ? 'pointer' : 'default',
                } as CSSProperties}
              >
                {selectable && (
                  <td style={{ ...cell(last), textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      label={`Select ${rowName(row, columns, i)}`}
                      withLabel={false}
                      checked={isSelected}
                      onChange={() => toggleRow(id)}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} style={{ ...cell(last), textAlign: col.align ?? 'left' }}>
                    {row[col.key]}
                  </td>
                ))}
                {rowActions && (
                  <td
                    className="inspera-row-actions"
                    style={{ ...cell(last), textAlign: 'right' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {rowActions(row, i)}
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>

      {footer && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            padding: '12px 4px 0',
          }}
        >
          <span style={{ fontSize: 14, color: 'var(--muted-foreground)' }}>
            {rangeStart} - {rangeEnd} of {totalRows}
          </span>
          <Pagination page={page} pageCount={pageCount} size="Small" onChange={setPage} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span aria-hidden style={{ fontSize: 14, color: 'var(--muted-foreground)' }}>Rows per page</span>
            <Select
              label="Rows per page"
              showLabel={false}
              widthMode="Hug"
              value={String(pageSize)}
              options={pageSizeOptions.map(String)}
              onChange={(v) => setPageSize(Number(v))}
            />
          </div>
        </div>
      )}
    </div>
  )
}
