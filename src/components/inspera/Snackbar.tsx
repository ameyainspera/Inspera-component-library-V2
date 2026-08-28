import { type CSSProperties } from 'react'

export type SnackbarIntent = 'Neutral' | 'Info' | 'Success' | 'Warning' | 'Error'

export interface SnackbarProps {
  message?: string
  /** Accent icon color. Values: Neutral | Info | Success | Warning | Error. */
  intent?: SnackbarIntent
  /** Show an inline action (e.g. Undo). Values: true | false. */
  hasAction?: boolean
  /** Show the dismiss button. Values: true | false. */
  hasClose?: boolean
  actionLabel?: string
  onAction?: () => void
  onClose?: () => void
}

const accentMap: Record<SnackbarIntent, { color: string; icon: string }> = {
  Neutral: { color: '#FFFFFF', icon: 'notifications' },
  Info: { color: '#7ABDFF', icon: 'info' },
  Success: { color: '#8DECC5', icon: 'check_circle' },
  Warning: { color: '#FED27C', icon: 'warning' },
  Error: { color: '#F58484', icon: 'error' },
}

export default function Snackbar({
  message = 'Assessment saved successfully.',
  intent = 'Neutral',
  hasAction = false,
  hasClose = true,
  actionLabel = 'Undo',
  onAction,
  onClose,
}: SnackbarProps) {
  const a = accentMap[intent]
  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 12,
    minWidth: 300,
    maxWidth: 480,
    height: 48,
    padding: '0 8px 0 16px',
    borderRadius: 'var(--radius-md)',
    background: '#272727',
    color: '#FFFFFF',
    boxShadow: 'var(--shadow-300)',
  }
  return (
    <div style={style} role="status" aria-live="polite">
      <span className="material-symbols-outlined" style={{ fontSize: 20, color: a.color, flexShrink: 0, fontVariationSettings: "'FILL' 1" }} aria-hidden>
        {a.icon}
      </span>
      <span style={{ flex: 1, fontSize: 16 }}>{message}</span>
      {hasAction && (
        <button
          type="button"
          onClick={onAction}
          style={{ background: 'none', border: 'none', padding: '0 8px', color: a.color, fontWeight: 600, fontSize: 16, cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          {actionLabel}
        </button>
      )}
      {hasClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: 'rgba(255,255,255,0.7)', display: 'inline-flex' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>close</span>
        </button>
      )}
    </div>
  )
}
