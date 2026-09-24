import { type AriaAttributes, type CSSProperties, type ReactNode, useMemo, useState } from 'react'
import Checkbox from './Checkbox'
import Pagination from './Pagination'
import Select from './Select'

export type DataGridSize = 'Compact' | 'Default'
export type DataGridSortDirection = 'Ascending' | 'Descending'

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

export interface DataGridProps {
  /** Column definitions. */
  columns?: DataGridColumn[]
  /** Row data keyed by column. */
  rows?: Record<string, ReactNode>[]
  /** Stable id per row. Defaults to the row index. */
  getRowId?: (row: Record<string, ReactNode>, index: number) => string
  /** Row height density. */
  size?: DataGridSize
  /** Zebra-stripe rows. */
  striped?: boolean
  /** Highlight rows on hover. */
  hoverable?: boolean
  /** Describes the grid for screen readers. */
  caption?: string

  /** Add a leading selection column with a select-all header box. */
  selectable?: boolean
  /** Controlled set of selected row ids. Pair with onSelectionChange. */
  selectedIds?: string[]
  /** Fired with the full set of selected ids after any change. */
  onSelectionChange?: (ids: string[]) => void

  /** Controlled sort column key. Pair with onSortChange for server sorting. */
  sortBy?: string
  /** Controlled sort direction. */
  sortDirection?: DataGridSortDirection
  /** Fired when a sortable header is activated. Enables controlled sorting. */
  onSortChange?: (key: string, direction: DataGridSortDirection) => void

  /** Trailing per-row actions, revealed on row hover. */
  rowActions?: (row: Record<string, ReactNode>, index: number) => ReactNode
  /** Fired with the row data and its index. */
  onRowClick?: (row: Record<string, ReactNode>, index: number) => void

  /** Show the footer with the range summary, pager and page-size select. */
  footer?: boolean
  /** Total row count across all pages. Defaults to the rendered row count. */
  total?: number
  /** Current page (1-based). */
  page?: number
  /** Total number of pages. */
  pageCount?: number
  /** Rows shown per page, used for the range summary and the size select. */
  pageSize?: number
  /** Selectable page sizes. */
  pageSizeOptions?: number[]
  /** Fired with the requested page. */
  onPageChange?: (page: number) => void
  /** Fired with the requested page size. */
  onPageSizeChange?: (size: number) => void
}

const defaultColumns: DataGridColumn[] = [
  { key: 'candidate', header: 'Candidate', sortable: true },
  { key: 'score', header: 'Score', align: 'right', sortable: true },
  { key: 'status', header: 'Status' },
  { key: 'date', header: 'Last edited', align: 'right', sortable: true },
]

const defaultRows: Record<string, ReactNode>[] = [
  { candidate: 'Amelia Hart', score: 92, status: 'Submitted', date: '12 Mar 2026' },
  { candidate: 'Noah Bennett', score: 78, status: 'In progress', date: '12 Mar 2026' },
  { candidate: 'Olivia Chen', score: 85, status: 'Submitted', date: '11 Mar 2026' },
  { candidate: 'Liam Foster', score: 64, status: 'Not started', date: '09 Mar 2026' },
]

/** Pull a comparable primitive from a cell for client-side sorting. */
function comparableValue(row: Record<string, ReactNode>, col: DataGridColumn): string | number {
  if (col.sortValue) return col.sortValue(row)
  const raw = row[col.key]
  if (typeof raw === 'number' || typeof raw === 'string') return raw
  return ''
}

export default function DataGrid({
  columns = defaultColumns,
  rows = defaultRows,
  getRowId,
  size = 'Default',
  striped = false,
  hoverable = true,
  caption,
  selectable = false,
  selectedIds,
  onSelectionChange,
  sortBy,
  sortDirection,
  onSortChange,
  rowActions,
  onRowClick,
  footer = false,
  total,
  page = 1,
  pageCount = 1,
  pageSize = 20,
  pageSizeOptions = [10, 20, 50, 100],
  onPageChange,
  onPageSizeChange,
}: DataGridProps) {
  const rowH = size === 'Compact' ? 40 : 52
  const idOf = (row: Record<string, ReactNode>, i: number) =>
    getRowId ? getRowId(row, i) : String(i)

  // Selection: controlled when selectedIds is supplied, otherwise internal.
  const [internalSel, setInternalSel] = useState<Set<string>>(new Set())
  const selected = selectedIds ? new Set(selectedIds) : internalSel
  const emitSelection = (next: Set<string>) => {
    if (!selectedIds) setInternalSel(next)
    onSelectionChange?.([...next])
  }
  const toggleRow = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    emitSelection(next)
  }

  // Sort: controlled when onSortChange is supplied, otherwise sort in place.
  const [internalSort, setInternalSort] = useState<{ key: string; dir: DataGridSortDirection } | null>(null)
  const activeSortKey = onSortChange ? sortBy : internalSort?.key
  const activeSortDir: DataGridSortDirection = onSortChange
    ? sortDirection ?? 'Ascending'
    : internalSort?.dir ?? 'Ascending'

  const requestSort = (key: string) => {
    const nextDir: DataGridSortDirection =
      activeSortKey === key && activeSortDir === 'Ascending' ? 'Descending' : 'Ascending'
    if (onSortChange) onSortChange(key, nextDir)
    else setInternalSort({ key, dir: nextDir })
  }

  const sortedRows = useMemo(() => {
    // Controlled sorting is the caller's job; only sort locally when uncontrolled.
    if (onSortChange || !internalSort) return rows
    const col = columns.find((c) => c.key === internalSort.key)
    if (!col) return rows
    const factor = internalSort.dir === 'Ascending' ? 1 : -1
    return [...rows].sort((a, b) => {
      const av = comparableValue(a, col)
      const bv = comparableValue(b, col)
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * factor
      return String(av).localeCompare(String(bv)) * factor
    })
  }, [rows, columns, internalSort, onSortChange])

  const allSelected = sortedRows.length > 0 && sortedRows.every((row, i) => selected.has(idOf(row, i)))
  const someSelected = sortedRows.some((row, i) => selected.has(idOf(row, i)))
  const toggleAll = () => {
    if (allSelected) emitSelection(new Set())
    else emitSelection(new Set(sortedRows.map((row, i) => idOf(row, i))))
  }

  const cellBase: CSSProperties = {
    padding: '0 16px',
    fontSize: 14,
    color: 'var(--text-primary)',
    borderBottom: '1px solid var(--border)',
    whiteSpace: 'nowrap',
  }

  const total_ = total ?? sortedRows.length
  const rangeStart = total_ === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeEnd = Math.min(total_, rangeStart + sortedRows.length - 1)

  return (
    <div style={{ width: '100%', fontFamily: 'var(--font-sans)' }}>
      <table
        style={{
          borderCollapse: 'collapse',
          width: '100%',
          background: 'var(--white)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          border: '1px solid var(--border)',
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
              <th scope="col" style={{ ...cellBase, width: 44, textAlign: 'center' }}>
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
              const isActive = activeSortKey === col.key
              const ariaSort: AriaAttributes['aria-sort'] = !col.sortable
                ? undefined
                : isActive
                  ? activeSortDir === 'Ascending' ? 'ascending' : 'descending'
                  : 'none'
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={ariaSort}
                  style={{
                    ...cellBase,
                    width: col.width,
                    textAlign: col.align ?? 'left',
                    fontWeight: 600,
                    color: 'var(--gray-700)',
                  }}
                >
                  {col.sortable ? (
                    <button
                      type="button"
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
                        {isActive && activeSortDir === 'Descending' ? 'arrow_downward' : 'arrow_upward'}
                      </span>
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              )
            })}
            {rowActions && <th scope="col" style={{ ...cellBase, width: 96 }} aria-label="Row actions" />}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, i) => {
            const id = idOf(row, i)
            const isStriped = striped && i % 2 === 1
            const isSelected = selected.has(id)
            return (
              <tr
                key={id}
                className={hoverable ? 'inspera-interactive inspera-row' : undefined}
                onClick={onRowClick ? () => onRowClick(row, i) : undefined}
                style={{
                  '--inspera-row-bg': isSelected
                    ? 'var(--blue-100)'
                    : isStriped ? 'var(--gray-100)' : 'var(--white)',
                  height: rowH,
                  ...(hoverable ? null : { background: isSelected ? 'var(--blue-100)' : isStriped ? 'var(--gray-100)' : 'var(--white)' }),
                  cursor: onRowClick ? 'pointer' : 'default',
                } as CSSProperties}
              >
                {selectable && (
                  <td style={{ ...cellBase, textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      label={`Select row ${i + 1}`}
                      withLabel={false}
                      checked={isSelected}
                      onChange={() => toggleRow(id)}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} style={{ ...cellBase, textAlign: col.align ?? 'left' }}>
                    {row[col.key]}
                  </td>
                ))}
                {rowActions && (
                  <td
                    className="inspera-row-actions"
                    style={{ ...cellBase, textAlign: 'right' }}
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
            {rangeStart} - {rangeEnd} of {total_}
          </span>
          <Pagination
            page={page}
            pageCount={pageCount}
            size="Small"
            onChange={onPageChange}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, color: 'var(--muted-foreground)' }}>Rows per page</span>
            <Select
              label="Rows per page"
              showLabel={false}
              widthMode="Content Adaptable"
              value={String(pageSize)}
              options={pageSizeOptions.map(String)}
              onChange={(v) => onPageSizeChange?.(Number(v))}
            />
          </div>
        </div>
      )}
    </div>
  )
}
