import { type CSSProperties, type ReactNode } from 'react'

export type CardElevation = 'Flat' | 'Raised' | 'Outlined'
export type CardPadding = 'Compact' | 'Default' | 'Spacious'

export interface CardProps {
  /** Optional heading for the card. */
  title?: string
  /** Short body copy. For anything richer, pass children instead. */
  body?: string
  /** Surface treatment. */
  elevation?: CardElevation
  /** Internal padding (12 / 16 / 24). */
  padding?: CardPadding
  /** Renders as a focusable button with hover elevation. */
  interactive?: boolean
  /** Card contents. Takes precedence over title and body. */
  children?: ReactNode
  /** Fired when an interactive card is activated. Set interactive as well, or there is no affordance. */
  onClick?: () => void
}

const padMap: Record<CardPadding, number> = { Compact: 12, Default: 16, Spacious: 24 }

export default function Card({
  title = 'Card title',
  body = 'Group related content in a contained surface using consistent padding and elevation.',
  elevation = 'Raised',
  padding = 'Default',
  interactive = false,
  children,
  onClick,
}: CardProps) {
  const style: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: '100%',
    padding: padMap[padding],
    borderRadius: 'var(--radius-lg)',
    background: 'var(--white)',
    color: 'var(--text-primary)',
    border: elevation === 'Outlined' ? '1px solid var(--border-strong)' : '1px solid transparent',
    boxShadow: elevation === 'Raised' ? 'var(--shadow-200)' : 'none',
    cursor: interactive ? 'pointer' : 'default',
    transition: 'box-shadow 140ms ease, transform 140ms ease',
    textAlign: 'left',
  }

  const content = children ?? (
    <>
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>{title}</h3>
      <p style={{ margin: 0, fontSize: 16, lineHeight: 1.4, color: 'var(--gray-700)' }}>{body}</p>
    </>
  )

  if (interactive) {
    return (
      <button
        type="button"
        onClick={onClick}
        style={style}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-300)' }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = elevation === 'Raised' ? 'var(--shadow-200)' : 'none' }}
      >
        {content}
      </button>
    )
  }

  return <article style={style}>{content}</article>
}
