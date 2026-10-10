import { type CSSProperties } from 'react'
import { cx, type NativeAttrs } from './types'

export type BreadcrumbSeparator = 'Slash' | 'Chevron'
export type BreadcrumbSize = 'Small' | 'Medium'

export interface BreadcrumbItem {
  label: string
  /** Link target. Crumbs with an href are real links - they open in a new tab and show their URL. */
  href?: string
}

export interface BreadcrumbProps {
  /** Trail from root to current page. The last entry is the current page and is not a link. */
  items: (string | BreadcrumbItem)[]
  /** Divider glyph between items. */
  separator?: BreadcrumbSeparator
  /** Text size 14 / 16. */
  size?: BreadcrumbSize
  /** Fired with the index of a crumb without an href, for client-side routing. */
  onNavigate?: (index: number) => void
  /** Names the navigation landmark. */
  label?: string
}

export default function Breadcrumb({
  items,
  separator = 'Chevron',
  size = 'Medium',
  onNavigate,
  label = 'Breadcrumb',
  className,
  style,
  ...rest
}: BreadcrumbProps & NativeAttrs<'nav', BreadcrumbProps>) {
  const fontSize = size === 'Small' ? 14 : 16
  const sep: CSSProperties = { color: 'var(--gray-400)', display: 'inline-flex', alignItems: 'center' }
  const crumbs = items.map((it) => (typeof it === 'string' ? { label: it } : it))
  const linkStyle: CSSProperties = {
    background: 'none', border: 'none', padding: 0, cursor: 'pointer',
    fontSize, color: 'var(--primary)', fontFamily: 'var(--font-sans)',
  }

  return (
    <nav aria-label={label} className={cx('inspera', className)} style={{ fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <ol style={{ display: 'flex', alignItems: 'center', gap: 8, listStyle: 'none', margin: 0, padding: 0, flexWrap: 'wrap' }}>
        {crumbs.map((item, i) => {
          const last = i === crumbs.length - 1
          return (
            // Each separator sits in the same item as the crumb before it, so a
            // wrapped trail breaks after a separator and never starts a line with one.
            <li key={`${item.label}-${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              {last ? (
                <span aria-current="page" style={{ fontSize, fontWeight: 500, color: 'var(--text-primary)' }}>{item.label}</span>
              ) : item.href ? (
                // Hover underline is CSS (.inspera-underline-hover), so
                // keyboard focus gets it too - JS mouse handlers did not.
                <a href={item.href} className="inspera-interactive inspera-underline-hover" style={linkStyle}>{item.label}</a>
              ) : (
                <button type="button" className="inspera-interactive inspera-underline-hover" onClick={() => onNavigate?.(i)} style={linkStyle}>
                  {item.label}
                </button>
              )}
              {!last && (
                <span aria-hidden style={sep}>
                  {separator === 'Chevron' ? (
                    <span className="material-symbols-outlined" style={{ fontSize: fontSize + 2 }}>chevron_right</span>
                  ) : (
                    <span style={{ fontSize }}>/</span>
                  )}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
