import { type CSSProperties } from 'react'
import Button from './Button'

export type EmptyStateSize = 'Small' | 'Medium'

export interface EmptyStateProps {
  /** Material Symbols icon name. */
  icon?: string
  /** Primary message. */
  title?: string
  /** Supporting explanation. */
  description?: string
  /** Optional primary action label. */
  actionLabel?: string
  onAction?: () => void
  /** Overall scale. Values: Small | Medium. */
  size?: EmptyStateSize
}

export default function EmptyState({
  icon = 'inbox',
  title = 'No results found',
  description = 'Try adjusting your filters or search terms.',
  actionLabel,
  onAction,
  size = 'Medium',
}: EmptyStateProps) {
  const small = size === 'Small'
  const circle = small ? 56 : 80
  const iconSize = small ? 28 : 40

  const container: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: 8,
    padding: small ? 16 : 32,
    fontFamily: 'var(--font-sans)',
    color: 'var(--text-primary)',
  }

  return (
    <div style={container} role="status">
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: circle,
          height: circle,
          borderRadius: '9999px',
          background: 'var(--gray-100)',
          marginBottom: 4,
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: iconSize, color: 'var(--muted-foreground)' }} aria-hidden>
          {icon}
        </span>
      </span>
      <h3 style={{ margin: 0, fontSize: small ? 16 : 18, fontWeight: 500 }}>{title}</h3>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.4, color: 'var(--muted-foreground)', maxWidth: 320 }}>
        {description}
      </p>
      {actionLabel && (
        <div style={{ marginTop: 8 }}>
          <Button label={actionLabel} intent="Primary" size={small ? 'Small' : 'Medium'} onClick={onAction} />
        </div>
      )}
    </div>
  )
}
