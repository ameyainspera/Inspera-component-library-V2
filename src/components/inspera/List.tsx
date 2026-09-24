import { type CSSProperties, type ReactNode } from 'react'
import Icon from './Icon'
import { cx, type NativeAttrs } from './types'

export type ListSize = 'Compact' | 'Default'

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

export interface ListProps {
  /** List rows. */
  items: ListItem[]
  /** Show dividers between rows. */
  divided?: boolean
  /** Make rows clickable. */
  interactive?: boolean
  /** Row density. */
  size?: ListSize
  /** Fired with the item and its index. Set interactive as well. */
  onItemClick?: (item: ListItem, index: number) => void
}

export default function List({
  items,
  divided = true,
  interactive = false,
  size = 'Default',
  onItemClick,
  className,
  style,
  ...rest
}: ListProps & NativeAttrs<'ul', ListProps>) {
  const padY = size === 'Compact' ? 8 : 12
  const iconSize = size === 'Compact' ? 18 : 20

  // Icons are named explicitly. Treating every string in `leading`/`trailing`
  // as an icon name turned `trailing="3 new"` into a broken glyph.
  const slot = (icon: string | undefined, node: ReactNode, color: string) =>
    icon || node ? (
      <span
        style={{
          display: 'inline-flex',
          flexShrink: 0,
          // Text styling only when there is text; an icon-only slot is bare.
          ...(node !== undefined ? { alignItems: 'center', gap: 8, fontSize: 13, color } : null),
        }}
      >
        {node}
        {icon && <Icon name={icon} size={iconSize} color={color} />}
      </span>
    ) : null

  const rowContent = (item: ListItem) => (
    <>
      {slot(item.leadingIcon, item.leading, 'var(--text-secondary)')}
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0, textAlign: 'left' }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{item.primary}</span>
        {item.secondary && (
          <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>{item.secondary}</span>
        )}
      </span>
      {slot(item.trailingIcon, item.trailing, 'var(--muted-foreground)')}
    </>
  )

  // Every border side is set as a longhand on purpose: a later `border`
  // shorthand used to reset the divider, so `divided` did nothing on a
  // clickable list. Hover is CSS (.inspera-row in runtime.css).
  const rowStyle = (i: number): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    padding: `${padY}px 16px`,
    borderTop: 'none',
    borderRight: 'none',
    borderLeft: 'none',
    borderBottom: divided && i < items.length - 1 ? 'var(--border-width-default) solid var(--border)' : 'none',
    borderRadius: interactive ? 'var(--radius-sm)' : undefined,
    font: 'inherit',
    cursor: interactive ? 'pointer' : 'default',
  })

  return (
    <ul
      role="list"
      className={cx('inspera', className)}
      style={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
        width: '100%',
        fontFamily: 'var(--font-sans)',
        background: 'var(--white)',
        border: 'var(--border-width-default) solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        ...style,
      }}
      {...rest}
    >
      {items.map((item, i) => (
        <li key={item.id ?? i}>
          {interactive ? (
            <button
              type="button"
              className="inspera-interactive inspera-row"
              onClick={() => onItemClick?.(item, i)}
              style={rowStyle(i)}
            >
              {rowContent(item)}
            </button>
          ) : (
            <div style={rowStyle(i)}>{rowContent(item)}</div>
          )}
        </li>
      ))}
    </ul>
  )
}
