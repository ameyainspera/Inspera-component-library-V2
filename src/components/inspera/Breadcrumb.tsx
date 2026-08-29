import { type CSSProperties, Fragment } from 'react'

export type BreadcrumbSeparator = 'Slash' | 'Chevron'
export type BreadcrumbSize = 'Small' | 'Medium'

export interface BreadcrumbProps {
  /** Trail from root to current page. The last entry is the current page and is not a link. */
  items?: string[]
  /** Divider glyph between items. */
  separator?: BreadcrumbSeparator
  /** Text size 14 / 16. */
  size?: BreadcrumbSize
  /** Fired with the index of the crumb that was clicked. */
  onNavigate?: (index: number) => void
}

const defaultItems = ['Home', 'Assessments', 'Mathematics', 'Algebra Quiz']

export default function Breadcrumb({
  items = defaultItems,
  separator = 'Chevron',
  size = 'Medium',
  onNavigate,
}: BreadcrumbProps) {
  const fontSize = size === 'Small' ? 14 : 16
  const sep: CSSProperties = { color: 'var(--gray-400)', display: 'inline-flex', alignItems: 'center' }

  return (
    <nav aria-label="Breadcrumb">
      <ol style={{ display: 'flex', alignItems: 'center', gap: 8, listStyle: 'none', margin: 0, padding: 0, flexWrap: 'wrap' }}>
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <Fragment key={item}>
              <li>
                {last ? (
                  <span aria-current="page" style={{ fontSize, fontWeight: 500, color: 'var(--text-primary)' }}>{item}</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onNavigate?.(i)}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize, color: 'var(--primary)', fontFamily: 'var(--font-sans)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline' }}
                    onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none' }}
                  >
                    {item}
                  </button>
                )}
              </li>
              {!last && (
                <li aria-hidden style={sep}>
                  {separator === 'Chevron' ? (
                    <span className="material-symbols-outlined" style={{ fontSize: fontSize + 2 }}>chevron_right</span>
                  ) : (
                    <span style={{ fontSize }}>/</span>
                  )}
                </li>
              )}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
