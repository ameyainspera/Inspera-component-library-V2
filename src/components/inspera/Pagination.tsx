import { type CSSProperties } from 'react'
import { cx, type NativeAttrs } from './types'
import { useControllableState } from './useControllableState'

export type PaginationSize = 'Small' | 'Medium'

export interface PaginationProps {
  /** Total number of pages. */
  pageCount: number
  /** Current page (1-based). Controlled - pair with onChange. */
  page?: number
  /** Starting page when uncontrolled. */
  defaultPage?: number
  /** Pages shown either side of current. */
  siblingCount?: number
  /** Control height. */
  size?: PaginationSize
  /** Show first / last controls. */
  showEdges?: boolean
  /** Fired with the requested page number, 1-based. */
  onChange?: (page: number) => void
  /** Names the navigation landmark. Give each pager on a page its own. */
  label?: string
}

const ELLIPSIS = '...'

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
  pageCount,
  page,
  defaultPage = 1,
  siblingCount = 1,
  size = 'Medium',
  showEdges = true,
  onChange,
  label = 'Pagination',
  className,
  style,
  ...rest
}: PaginationProps & NativeAttrs<'nav', PaginationProps>) {
  // Controlled by `page`, not by whether onChange exists: passing onChange just
  // to observe used to freeze the pager.
  const [current, setCurrent] = useControllableState(page, defaultPage, onChange)

  const dim = size === 'Small' ? 32 : 40
  const iconSize = size === 'Small' ? 18 : 20
  const fontSize = size === 'Small' ? 14 : 16

  const go = (p: number) => {
    const next = Math.min(Math.max(p, 1), pageCount)
    if (next !== current) setCurrent(next)
  }

  const items = buildRange(current, pageCount, siblingCount)

  const cellBase: CSSProperties = {
    minWidth: dim,
    height: dim,
    padding: '0 6px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)',
    fontSize,
    fontWeight: 500,
    cursor: 'pointer',
  }

  const arrow = (icon: string, label: string, target: number, disabled: boolean) => (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      // Hover is CSS (.inspera-row), so keyboard focus and pointer agree.
      className="inspera-interactive inspera-row"
      data-disabled={disabled || undefined}
      onClick={() => go(target)}
      style={{
        ...cellBase,
        color: disabled ? 'var(--action-disabled)' : 'var(--text-primary)',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: iconSize }} aria-hidden>{icon}</span>
    </button>
  )

  return (
    <nav aria-label={label} className={cx('inspera', className)} style={style} {...rest}>
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
              <span aria-hidden style={{ ...cellBase, background: 'transparent', cursor: 'default', color: 'var(--muted-foreground)' }}>{it}</span>
            ) : (
              <button
                type="button"
                aria-label={`Page ${it}`}
                aria-current={it === current ? 'page' : undefined}
                // The current page keeps its fill under the pointer, so it is
                // not a hover row.
                className={it === current ? 'inspera-interactive' : 'inspera-interactive inspera-row'}
                onClick={() => go(it)}
                style={{
                  ...cellBase,
                  ...(it === current ? { background: 'var(--primary)' } : null),
                  color: it === current ? 'var(--white)' : 'var(--text-primary)',
                }}
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
