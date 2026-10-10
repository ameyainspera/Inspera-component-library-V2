import { type CSSProperties } from 'react'
import Button from './Button'
import { cx, type NativeAttrs } from './types'

export type EmptyStateSize = 'Small' | 'Medium'
export type EmptyStateActionIntent = 'Primary' | 'Secondary'

export interface EmptyStateProps {
  /** Primary message, e.g. "No assessments yet". */
  title: string
  /** Supporting explanation: why it is empty, or what to do next. */
  description?: string
  /** Material Symbols icon name. */
  icon?: string
  /** Optional action label. */
  actionLabel?: string
  /** Fired when the action is activated. Only rendered when actionLabel is set. */
  onAction?: () => void
  /**
   * The action's emphasis. Primary when it is the main thing to do on the
   * page; Secondary inside a panel, or beside a page that already has its own
   * main action, so the view keeps one Primary.
   */
  actionIntent?: EmptyStateActionIntent
  /** Overall scale. */
  size?: EmptyStateSize
}

export default function EmptyState({
  title,
  description,
  icon = 'inbox',
  actionLabel,
  onAction,
  actionIntent = 'Primary',
  size = 'Medium',
  className,
  style,
  ...rest
}: EmptyStateProps & NativeAttrs<'div', EmptyStateProps>) {
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
    ...style,
  }

  // Not a live region: an empty state is page content, and `role="status"`
  // around it (action button included) made it announce itself on render.
  return (
    <div className={cx('inspera', className)} style={container} {...rest}>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: circle,
          height: circle,
          borderRadius: 'var(--radius-pill)',
          background: 'var(--gray-100)',
          marginBottom: 4,
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: iconSize, color: 'var(--muted-foreground)' }} aria-hidden>
          {icon}
        </span>
      </span>
      <h3 style={{ margin: 0, fontSize: small ? 16 : 18, fontWeight: 500 }}>{title}</h3>
      {description && (
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.4, color: 'var(--muted-foreground)', maxWidth: 320 }}>
          {description}
        </p>
      )}
      {actionLabel && (
        <div style={{ marginTop: 8 }}>
          <Button label={actionLabel} intent={actionIntent} size={small ? 'Small' : 'Medium'} onClick={onAction} />
        </div>
      )}
    </div>
  )
}
