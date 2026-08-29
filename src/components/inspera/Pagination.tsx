import { type CSSProperties, useState } from 'react'

export type PaginationSize = 'Small' | 'Medium'

export interface PaginationProps {
  /** Current page (1-based). */
  page?: number
  /** Total number of pages. */
  pageCount?: number
  /** Pages shown either side of current. */
  siblingCount?: number
  /** Control height. */
  size?: PaginationSize
  /** Show first / last controls. */
  showEdges?: boolean
  /** Fired with the requested page number, 1-based. */
  onChange?: (page: number) => void
}

const ELLIPSIS = '…'

function range(start: number, end: number): number[] {
  const out: number[] = []
  for (let i = start; i <= end; i++) out.push(i)
  return out
}

/** Builds the list of pages/ellipsis to render. */
function buildRange(page: number, pageCount: number, siblingCount: number): (number | string)[] {
  const totalNumbers = siblingCount * 2 + 5
  if (totalNumbers >= pageCount) return range(1, pageCount)

  const leftSibling = Math.max(page - siblingCount, 1)
  const rightSibling = Math.min(page + siblingCount, pageCount)
  const showLeftDots = leftSibling > 2
  const showRightDots = rightSibling < pageCount - 1

  if (!showLeftDots && showRightDots) {
    const leftCount = 3 + siblingCount * 2
    return [...range(1, leftCount), ELLIPSIS, pageCount]
  }
  if (showLeftDots && !showRightDots) {
    const rightCount = 3 + siblingCount * 2
    return [1, ELLIPSIS, ...range(pageCount - rightCount + 1, pageCount)]
  }
  return [1, ELLIPSIS, ...range(leftSibling, rightSibling), ELLIPSIS, pageCount]
}

export default function Pagination({
  page = 1,
  pageCount = 10,
  siblingCount = 1,
  size = 'Medium',
  showEdges = true,
  onChange,
}: PaginationProps) {
  const [internal, setInternal] = useState(page)
  const isControlled = onChange !== undefined && page !== undefined
  const current = isControlled ? page : internal

  const dim = size === 'Small' ? 32 : 40
  const iconSize = size === 'Small' ? 18 : 20
  const fontSize = size === 'Small' ? 14 : 16

  const go = (p: number) => {
    const next = Math.min(Math.max(p, 1), pageCount)
    if (next === current) return
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  const items = buildRange(current, pageCount, siblingCount)

  const cellBase: CSSProperties = {
    minWidth: dim,
    height: dim,
    padding: '0 6px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)',
    fontSize,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background 120ms ease, color 120ms ease',
  }

  const arrow = (icon: string, label: string, target: number, disabled: boolean) => (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={() => go(target)}
      style={{
        ...cellBase,
        color: disabled ? 'var(--action-disabled)' : 'var(--text-primary)',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = 'var(--action-hover)' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: iconSize }} aria-hidden>{icon}</span>
    </button>
  )

  return (
    <nav aria-label="Pagination">
      <ul
        style={{
          display: 'flex',
          alignItems: 'center',
          // Wrap rather than overflow: a pagination bar with many pages must
          // degrade gracefully in a narrow column, not spill out of it.
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 4,
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}
      >
        {showEdges && <li>{arrow('first_page', 'First page', 1, current <= 1)}</li>}
        <li>{arrow('chevron_left', 'Previous page', current - 1, current <= 1)}</li>
        {items.map((it, i) => (
          <li key={typeof it === 'number' ? `p${it}` : `e${i}`}>
            {typeof it === 'string' ? (
              <span aria-hidden style={{ ...cellBase, cursor: 'default', color: 'var(--muted-foreground)' }}>{it}</span>
            ) : (
              <button
                type="button"
                aria-label={`Page ${it}`}
                aria-current={it === current ? 'page' : undefined}
                onClick={() => go(it)}
                style={{
                  ...cellBase,
                  background: it === current ? 'var(--primary)' : 'transparent',
                  color: it === current ? 'var(--white)' : 'var(--text-primary)',
                }}
                onMouseEnter={(e) => { if (it !== current) e.currentTarget.style.background = 'var(--action-hover)' }}
                onMouseLeave={(e) => { if (it !== current) e.currentTarget.style.background = 'transparent' }}
              >
                {it}
              </button>
            )}
          </li>
        ))}
        <li>{arrow('chevron_right', 'Next page', current + 1, current >= pageCount)}</li>
        {showEdges && <li>{arrow('last_page', 'Last page', pageCount, current >= pageCount)}</li>}
      </ul>
    </nav>
  )
}
