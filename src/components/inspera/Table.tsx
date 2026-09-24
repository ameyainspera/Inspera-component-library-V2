import { type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import { cx, type NativeAttrs } from './types'
import { useControllableState } from './useControllableState'

export type TableSize = 'Compact' | 'Default'

export interface TableColumn {
  key: string
  header: string
  align?: 'left' | 'right' | 'center'
  width?: string | number
}

export type TableRow = Record<string, ReactNode>

export interface TableProps {
  /** Column definitions. */
  columns: TableColumn[]
  /** Row data keyed by column. */
  rows: TableRow[]
  /** Stable id per row, for selection and keys. Defaults to the row's position. */
  getRowId?: (row: TableRow, index: number) => string
  /** Row height density. */
  size?: TableSize
  /** Zebra-stripe rows. */
  striped?: boolean
  /** Highlight rows on hover. */
  hoverable?: boolean
  /** Add a selection column with a select-all box. */
  selectable?: boolean
  /** Selected row ids. Controlled - pair with onSelectionChange. */
  selectedIds?: string[]
  /** Starting selection when uncontrolled. */
  defaultSelectedIds?: string[]
  /** Fired with every selected id after any change. */
  onSelectionChange?: (ids: string[]) => void
  /** Describes the table for screen readers. Provide one unless a heading already names it. */
  caption?: string
  /** Makes rows clickable and keyboard-operable (Enter / Space). */
  onRowClick?: (row: TableRow, index: number) => void
}

/** Table's selection boxes are compact native checkboxes in the brand colour. */
const nativeBox: CSSProperties = { width: 16, height: 16, margin: 0, accentColor: 'var(--primary)', cursor: 'pointer', verticalAlign: 'middle' }

/** A readable name for a row's checkbox: its first text cell, not "row 3". */
export function rowName(row: TableRow, columns: { key: string }[], index: number): string {
  const text = columns.map((c) => row[c.key]).find((v) => typeof v === 'string' || typeof v === 'number')
  return text !== undefined ? String(text) : `row ${index + 1}`
}

export default function Table({
  columns,
  rows,
  getRowId,
  size = 'Default',
  striped = false,
  hoverable = true,
  selectable = false,
  selectedIds,
  defaultSelectedIds = [],
  onSelectionChange,
  caption,
  onRowClick,
  className,
  style,
  ...rest
}: TableProps & NativeAttrs<'table', TableProps>) {
  const [selected, setSelected] = useControllableState(selectedIds, defaultSelectedIds, onSelectionChange)
  const rowH = size === 'Compact' ? 40 : 52
  const ids = rows.map((row, i) => (getRowId ? getRowId(row, i) : String(i)))
  const allSelected = rows.length > 0 && ids.every((id) => selected.includes(id))
  const someSelected = ids.some((id) => selected.includes(id))

  const toggle = (id: string) =>
    setSelected(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id])
  const toggleAll = () =>
    setSelected(allSelected ? selected.filter((id) => !ids.includes(id)) : [...new Set([...selected, ...ids])])

  const cell = (last: boolean): CSSProperties => ({
    padding: '0 16px',
    fontSize: 14,
    color: 'var(--text-primary)',
    borderBottom: last ? 'none' : 'var(--border-width-default) solid var(--border)',
    whiteSpace: 'nowrap',
  })
  const head: CSSProperties = { ...cell(false), fontWeight: 600, color: 'var(--gray-700)' }

  const onRowKey = (e: KeyboardEvent, row: TableRow, i: number) => {
    if (e.target !== e.currentTarget || (e.key !== 'Enter' && e.key !== ' ')) return
    e.preventDefault()
    onRowClick?.(row, i)
  }

  return (
    <table
      className={cx('inspera', className)}
      style={{
        // `separate`, not `collapse`: browsers ignore border-radius on a
        // collapsed table, so the corners came out square.
        borderCollapse: 'separate',
        borderSpacing: 0,
        width: '100%',
        fontFamily: 'var(--font-sans)',
        background: 'var(--white)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: 'var(--border-width-default) solid var(--border)',
        ...style,
      }}
      {...rest}
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
              <input
                type="checkbox"
                aria-label="Select all rows"
                checked={allSelected}
                ref={(node) => { if (node) node.indeterminate = !allSelected && someSelected }}
                onChange={toggleAll}
                style={nativeBox}
              />
            </th>
          )}
          {columns.map((col) => (
            <th key={col.key} scope="col" style={{ ...head, width: col.width, textAlign: col.align ?? 'left' }}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => {
          const id = ids[i]
          const last = i === rows.length - 1
          const isSelected = selected.includes(id)
          const fill = isSelected ? 'var(--blue-100)' : striped && i % 2 === 1 ? 'var(--gray-100)' : 'var(--white)'
          // Hover is CSS (.inspera-row in runtime.css). The fill is passed as
          // the row's resting colour, because an inline background would
          // outrank the hover rule.
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
                  <input
                    type="checkbox"
                    aria-label={`Select ${rowName(row, columns, i)}`}
                    checked={isSelected}
                    onChange={() => toggle(id)}
                    style={nativeBox}
                  />
                </td>
              )}
              {columns.map((col) => (
                <td key={col.key} style={{ ...cell(last), textAlign: col.align ?? 'left' }}>
                  {row[col.key]}
                </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
