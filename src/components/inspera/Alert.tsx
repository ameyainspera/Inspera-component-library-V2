import { type CSSProperties } from 'react'
import { cx, type NativeAttrs } from './types'

export type AlertIntent = 'Info' | 'Success' | 'Warning' | 'Error'

export interface AlertProps {
  /** Supporting detail. Keep it to one or two sentences. */
  message: string
  /** Short headline stating what happened. Optional. */
  title?: string
  /** Severity / color. Warning and Error interrupt screen readers; Info and Success wait. */
  intent?: AlertIntent
  /** Tinted fill; false draws a left accent bar on a clear background. */
  background?: boolean
  /** Label for an inline action link, e.g. "View details". Shown when set. */
  actionLabel?: string
  /** Fired when the inline action is activated. */
  onAction?: () => void
  /** Show a close button. Pair with onClose. */
  dismissible?: boolean
  /** Fired when the close button is activated. */
  onClose?: () => void
}

const intentMap: Record<AlertIntent, { bg: string; fg: string; icon: string }> = {
  Info: { bg: 'var(--info-surface)', fg: 'var(--info)', icon: 'info' },
  Success: { bg: 'var(--success-surface)', fg: 'var(--success)', icon: 'check_circle' },
  Warning: { bg: 'var(--warning-surface)', fg: 'var(--warning)', icon: 'warning' },
  Error: { bg: 'var(--error-surface)', fg: 'var(--error)', icon: 'error' },
}

export default function Alert({
  message,
  title,
  intent = 'Info',
  background = true,
  actionLabel,
  onAction,
  dismissible = false,
  onClose,
  className,
  style,
  ...rest
}: AlertProps & NativeAttrs<'div', AlertProps>) {
  const c = intentMap[intent]

  const box: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    width: '100%',
    maxWidth: '100%',
    padding: '12px 16px',
    borderRadius: 'var(--radius-md)',
    background: background ? c.bg : 'transparent',
    borderStyle: 'solid',
    borderColor: c.fg,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: background ? 1 : 4,
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)',
    ...style,
  }

  // role="alert" already implies aria-live="assertive", so severity decides
  // which one applies rather than both at once.
  const urgent = intent === 'Error' || intent === 'Warning'

  return (
    <div
      className={cx('inspera', className)}
      style={box}
      {...(urgent ? { role: 'alert' } : { role: 'status', 'aria-live': 'polite' as const })}
      {...rest}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 20, color: c.fg, flexShrink: 0, marginTop: 1, fontVariationSettings: "'FILL' 1" }} aria-hidden>
        {c.icon}
      </span>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {title && <span style={{ fontSize: 16, fontWeight: 500 }}>{title}</span>}
        <span style={{ fontSize: 16, lineHeight: 1.4, color: 'var(--gray-700)' }}>{message}</span>
        {actionLabel && (
          <button
            type="button"
            className="inspera-interactive"
            onClick={onAction}
            style={{ alignSelf: 'flex-start', marginTop: 8, background: 'none', border: 'none', padding: 0, color: c.fg, fontWeight: 600, fontSize: 14, cursor: 'pointer', textDecoration: 'underline' }}
          >
            {actionLabel}
          </button>
        )}
      </div>
      {dismissible && (
        <button
          type="button"
          className="inspera-interactive"
          onClick={onClose}
          aria-label="Close alert"
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--action-active)', display: 'inline-flex' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>close</span>
        </button>
      )}
    </div>
  )
}
