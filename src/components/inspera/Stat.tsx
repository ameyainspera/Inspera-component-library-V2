import { type CSSProperties } from 'react'
import { cx, srOnly, type NativeAttrs } from './types'

export type StatDeltaIntent = 'Up' | 'Down' | 'Neutral'

export interface StatProps {
  /** Metric name. */
  label: string
  /** Metric value. */
  value: string | number
  /** Change indicator text, e.g. "+8.2% vs last week". Omit when there is no comparison. */
  delta?: string
  /** Trend direction: sets the arrow, the colour and what is announced. */
  deltaIntent?: StatDeltaIntent
  /** Optional leading icon. */
  icon?: string
  /** Optional context below the value, such as the comparison period. */
  helpText?: string
}

const deltaMap: Record<StatDeltaIntent, { color: string; icon: string; spoken: string }> = {
  Up: { color: 'var(--success)', icon: 'trending_up', spoken: 'Up' },
  Down: { color: 'var(--error)', icon: 'trending_down', spoken: 'Down' },
  Neutral: { color: 'var(--muted-foreground)', icon: 'trending_flat', spoken: 'No change' },
}

export default function Stat({
  label,
  value,
  delta,
  deltaIntent = 'Neutral',
  icon,
  helpText,
  className,
  style,
  ...rest
}: StatProps & NativeAttrs<'div', StatProps>) {
  const d = deltaMap[deltaIntent]

  const container: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    minWidth: 200,
    padding: 16,
    border: 'var(--border-width-default) solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    background: 'var(--white)',
    fontFamily: 'var(--font-sans)',
    color: 'var(--text-primary)',
    ...style,
  }

  return (
    <div className={cx('inspera', className)} style={container} {...rest}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>
          {label}
        </span>
        {icon && (
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--muted-foreground)' }} aria-hidden>
            {icon}
          </span>
        )}
      </div>
      <span style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.1 }}>{value}</span>
      {delta && (
        <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 500, color: d.color }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>
            {d.icon}
          </span>
          {/* The arrow and colour carry direction for sighted users only. */}
          <span style={srOnly}>{d.spoken}: </span>
          {delta}
        </span>
      )}
      {helpText && <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{helpText}</span>}
    </div>
  )
}
