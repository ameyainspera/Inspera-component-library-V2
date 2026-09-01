import { type CSSProperties, type ReactNode, useState } from 'react'

export type TableSize = 'Compact' | 'Default'

export interface TableColumn {
  key: string
  header: string
  align?: 'left' | 'right' | 'center'
  width?: string | number
}

export interface TableProps {
  /** Column definitions. */
  columns?: TableColumn[]
  /** Row data keyed by column. */
  rows?: Record<string, ReactNode>[]
  /** Row height density. */
  size?: TableSize
  /** Zebra-stripe rows. */
  striped?: boolean
  /** Highlight rows on hover. */
  hoverable?: boolean
  /** Add a row selection column. */
  selectable?: boolean
  /** Describes the table for screen readers. Provide one unless a heading already names it. */
  caption?: string
  /** Fired with the row data and its index. */
  onRowClick?: (row: Record<string, ReactNode>, index: number) => void
}

const defaultColumns: TableColumn[] = [
  { key: 'candidate', header: 'Candidate' },
  { key: 'score', header: 'Score', align: 'right' },
  { key: 'status', header: 'Status' },
  { key: 'date', header: 'Date', align: 'right' },
]

const defaultRows: Record<string, ReactNode>[] = [
  { candidate: 'Amelia Hart', score: '92%', status: 'Submitted', date: '12 Mar 2026' },
  { candidate: 'Noah Bennett', score: '78%', status: 'In progress', date: '12 Mar 2026' },
  { candidate: 'Olivia Chen', score: '85%', status: 'Submitted', date: '11 Mar 2026' },
  { candidate: 'Liam Foster', score: '-', status: 'Not started', date: '-' },
]

export default function Table({
  columns = defaultColumns,
  rows = defaultRows,
  size = 'Default',
  striped = false,
  hoverable = true,
  selectable = false,
  caption,
  onRowClick,
}: TableProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const rowH = size === 'Compact' ? 40 : 52

  const toggle = (i: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  const cellBase: CSSProperties = {
    padding: '0 16px',
    fontSize: 14,
    color: 'var(--text-primary)',
    borderBottom: '1px solid var(--border)',
    whiteSpace: 'nowrap',
  }

  return (
    <table
      style={{
        borderCollapse: 'collapse',
        width: '100%',
        fontFamily: 'var(--font-sans)',
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
            <th scope="col" style={{ ...cellBase, width: 44, textAlign: 'center', fontWeight: 600, color: 'var(--gray-700)' }} />
          )}
          {columns.map((col) => (
            <th
              key={col.key}
              scope="col"
              style={{
                ...cellBase,
                width: col.width,
                textAlign: col.align ?? 'left',
                fontWeight: 600,
                color: 'var(--gray-700)',
              }}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => {
          const isStriped = striped && i % 2 === 1
          // Hover is CSS (.inspera-row in runtime.css). The stripe is passed as
          // the row's resting fill rather than set inline, because an inline
          // background would outrank the hover rule and striped rows would stop
          // responding to the pointer.
          return (
            <tr
              key={i}
              className={hoverable ? 'inspera-interactive inspera-row' : undefined}
              onClick={onRowClick ? () => onRowClick(row, i) : undefined}
              style={{
                '--inspera-row-bg': isStriped ? 'var(--gray-100)' : 'var(--white)',
                height: rowH,
                ...(hoverable ? null : { background: isStriped ? 'var(--gray-100)' : 'var(--white)' }),
                cursor: onRowClick ? 'pointer' : 'default',
              } as CSSProperties}
            >
              {selectable && (
                <td style={{ ...cellBase, textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selected.has(i)}
                    aria-label={`Select row ${i + 1}`}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => toggle(i)}
                    style={{ width: 16, height: 16, accentColor: 'var(--primary)', cursor: 'pointer' }}
                  />
                </td>
              )}
              {columns.map((col) => (
                <td key={col.key} style={{ ...cellBase, textAlign: col.align ?? 'left' }}>
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
