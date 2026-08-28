import { type CSSProperties } from 'react'

export type AlertIntent = 'Info' | 'Success' | 'Warning' | 'Error'
export type AlertLayout = 'Simple' | 'With CTA' | 'With Close' | 'With CTA + Close'

export interface AlertProps {
  title?: string
  message?: string
  /** Severity / color. Values: Info | Success | Warning | Error. */
  intent?: AlertIntent
  /** Action affordances. Values: Simple | With CTA | With Close | With CTA + Close. */
  layout?: AlertLayout
  /** Tinted fill vs. left-accent only. Values: true | false. */
  background?: boolean
  ctaLabel?: string
  onCta?: () => void
  onClose?: () => void
}

const intentMap: Record<AlertIntent, { bg: string; fg: string; icon: string }> = {
  Info: { bg: 'var(--info-surface)', fg: 'var(--info)', icon: 'info' },
  Success: { bg: 'var(--success-surface)', fg: 'var(--success)', icon: 'check_circle' },
  Warning: { bg: 'var(--warning-surface)', fg: 'var(--warning)', icon: 'warning' },
  Error: { bg: 'var(--error-surface)', fg: 'var(--error)', icon: 'error' },
}

export default function Alert({
  title = 'Heads up',
  message = 'This is a contextual inline message that matches the intent severity.',
  intent = 'Info',
  layout = 'Simple',
  background = true,
  ctaLabel = 'View details',
  onCta,
  onClose,
}: AlertProps) {
  const c = intentMap[intent]
  const hasCta = layout === 'With CTA' || layout === 'With CTA + Close'
  const hasClose = layout === 'With Close' || layout === 'With CTA + Close'

  const style: CSSProperties = {
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
  }

  return (
    <div style={style} role="alert" aria-live="polite">
      <span className="material-symbols-outlined" style={{ fontSize: 20, color: c.fg, flexShrink: 0, marginTop: 1, fontVariationSettings: "'FILL' 1" }} aria-hidden>
        {c.icon}
      </span>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 16, fontWeight: 500 }}>{title}</span>
        <span style={{ fontSize: 16, lineHeight: 1.4, color: 'var(--gray-700)' }}>{message}</span>
        {hasCta && (
          <button
            type="button"
            onClick={onCta}
            style={{ alignSelf: 'flex-start', marginTop: 8, background: 'none', border: 'none', padding: 0, color: c.fg, fontWeight: 600, fontSize: 14, cursor: 'pointer', textDecoration: 'underline' }}
          >
            {ctaLabel}
          </button>
        )}
      </div>
      {hasClose && (
        <button
          type="button"
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
