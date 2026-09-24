import { type CSSProperties } from 'react'
import { cx, type NativeAttrs } from './types'

export type SnackbarIntent = 'Neutral' | 'Info' | 'Success' | 'Warning' | 'Error'

export interface SnackbarProps {
  /** What happened. One short sentence. */
  message: string
  /** Accent icon color. */
  intent?: SnackbarIntent
  /** Label for an inline action, typically "Undo". Shown when set. */
  actionLabel?: string
  /** Fired when the inline action is activated. */
  onAction?: () => void
  /** Show a close button. Pair with onClose. */
  dismissible?: boolean
  /** Fired when the close button is activated. */
  onClose?: () => void
}

const accentMap: Record<SnackbarIntent, { color: string; icon: string }> = {
  Neutral: { color: 'var(--white)', icon: 'notifications' },
  Info: { color: 'var(--blue-400)', icon: 'info' },
  Success: { color: 'var(--green-400)', icon: 'check_circle' },
  Warning: { color: 'var(--orange-400)', icon: 'warning' },
  Error: { color: 'var(--red-400)', icon: 'error' },
}

export default function Snackbar({
  message,
  intent = 'Neutral',
  actionLabel,
  onAction,
  dismissible = false,
  onClose,
  className,
  style,
  ...rest
}: SnackbarProps & NativeAttrs<'div', SnackbarProps>) {
  const a = accentMap[intent]
  const bar: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 12,
    // Never wider than the screen, and free to grow for a two-line message -
    // a fixed 48px height let longer text spill out of the bar.
    minWidth: 'min(300px, 100%)',
    maxWidth: 480,
    minHeight: 48,
    padding: '8px 8px 8px 16px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--gray-900)',
    color: 'var(--white)',
    boxShadow: 'var(--shadow-300)',
    fontFamily: 'var(--font-sans)',
    ...style,
  }
  return (
    <div className={cx('inspera', className)} style={bar} role="status" aria-live="polite" {...rest}>
      <span className="material-symbols-outlined" style={{ fontSize: 20, color: a.color, flexShrink: 0, fontVariationSettings: "'FILL' 1" }} aria-hidden>
        {a.icon}
      </span>
      <span style={{ flex: 1, fontSize: 16 }}>{message}</span>
      {actionLabel && (
        <button
          type="button"
          className="inspera-interactive"
          onClick={onAction}
          style={{ background: 'none', border: 'none', padding: '0 8px', color: a.color, fontWeight: 600, fontSize: 16, cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          {actionLabel}
        </button>
      )}
      {dismissible && (
        <button
          type="button"
          className="inspera-interactive"
          onClick={onClose}
          aria-label="Dismiss"
          style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: 'color-mix(in srgb, var(--white) 70%, transparent)', display: 'inline-flex' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>close</span>
        </button>
      )}
    </div>
  )
}
