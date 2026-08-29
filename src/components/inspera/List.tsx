import { type CSSProperties, type ReactNode, useState } from 'react'
import Icon from './Icon'

export type ListSize = 'Compact' | 'Default'

export interface ListItem {
  primary: string
  secondary?: string
  leading?: ReactNode
  trailing?: ReactNode
}

export interface ListProps {
  /** List rows. */
  items?: ListItem[]
  /** Show dividers between rows. */
  divided?: boolean
  /** Make rows clickable. */
  interactive?: boolean
  /** Row density. */
  size?: ListSize
  /** Fired with the item and its index. Set interactive as well. */
  onItemClick?: (item: ListItem, index: number) => void
}

const defaultItems: ListItem[] = [
  { primary: 'Algebra Quiz', secondary: '24 questions · 45 minutes' },
  { primary: 'Reading Comprehension', secondary: '18 questions · 60 minutes' },
  { primary: 'Chemistry Lab Report', secondary: 'Essay · Due 20 Mar' },
]

export default function List({
  items = defaultItems,
  divided = true,
  interactive = false,
  size = 'Default',
  onItemClick,
}: ListProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const padY = size === 'Compact' ? 8 : 12

  const iconSize = size === 'Compact' ? 18 : 20

  // A string slot is treated as a Material Symbols icon name so it stays
  // consistent with the Icon component and icon library; any other ReactNode
  // (custom element) is rendered as-is.
  const renderSlot = (slot: ReactNode, color: string) =>
    typeof slot === 'string'
      ? <Icon name={slot} size={iconSize} color={color} />
      : slot

  const rowContent = (item: ListItem) => (
    <>
      {item.leading && (
        <span style={{ display: 'inline-flex', flexShrink: 0 }}>
          {renderSlot(item.leading, 'var(--text-secondary, var(--gray-600))')}
        </span>
      )}
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0, textAlign: 'left' }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{item.primary}</span>
        {item.secondary && (
          <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>{item.secondary}</span>
        )}
      </span>
      {item.trailing && (
        <span style={{ display: 'inline-flex', flexShrink: 0 }}>
          {renderSlot(item.trailing, 'var(--muted-foreground)')}
        </span>
      )}
    </>
  )

  const rowStyle = (i: number, isHover: boolean): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    padding: `${padY}px 16px`,
    borderBottom: divided && i < items.length - 1 ? '1px solid var(--border)' : 'none',
    background: interactive && isHover ? 'var(--action-hover, var(--gray-100))' : 'transparent',
    border: interactive ? 'none' : undefined,
    borderRadius: interactive ? 'var(--radius-sm)' : undefined,
    font: 'inherit',
    cursor: interactive ? 'pointer' : 'default',
    transition: 'background 120ms ease',
  })

  return (
    <ul
      role="list"
      style={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
        width: '100%',
        fontFamily: 'var(--font-sans)',
        background: 'var(--white)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}
    >
      {items.map((item, i) => (
        <li key={i}>
          {interactive ? (
            <button
              type="button"
              onClick={() => onItemClick?.(item, i)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={rowStyle(i, hovered === i)}
            >
              {rowContent(item)}
            </button>
          ) : (
            <div style={rowStyle(i, false)}>{rowContent(item)}</div>
          )}
        </li>
      ))}
    </ul>
  )
}
