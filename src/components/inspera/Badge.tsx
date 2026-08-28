import { type CSSProperties } from 'react'

export type BadgeIntent = 'Neutral' | 'Info' | 'Success' | 'Warning' | 'Error'
export type BadgeSize = 'Small' | 'Medium'

export interface BadgeProps {
  label?: string
  /** Semantic color. Values: Neutral | Info | Success | Warning | Error. */
  intent?: BadgeIntent
  /** Height 20 / 24. Values: Small | Medium. */
  size?: BadgeSize
  /** Show a leading status icon. Values: true | false. */
  withIcon?: boolean
  icon?: string
}

const intentMap: Record<BadgeIntent, { bg: string; fg: string; icon: string }> = {
  Neutral: { bg: 'var(--surface-neutral)', fg: 'var(--gray-900)', icon: 'circle' },
  Info: { bg: 'var(--info-surface)', fg: 'var(--info)', icon: 'info' },
  Success: { bg: 'var(--success-surface)', fg: 'var(--success)', icon: 'check_circle' },
  Warning: { bg: 'var(--warning-surface)', fg: 'var(--warning)', icon: 'warning' },
  Error: { bg: 'var(--error-surface)', fg: 'var(--error)', icon: 'error' },
}

export default function Badge({
  label = 'Badge',
  intent = 'Neutral',
  size = 'Medium',
  withIcon = false,
  icon,
}: BadgeProps) {
  const c = intentMap[intent]
  const small = size === 'Small'
  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    height: small ? 20 : 24,
    padding: small ? '0 6px' : '0 8px',
    borderRadius: 'var(--radius-pill)',
    background: c.bg,
    color: c.fg,
    fontFamily: 'var(--font-sans)',
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 1,
    whiteSpace: 'nowrap',
  }
  return (
    <span style={style} role="status">
      {withIcon && (
        <span className="material-symbols-outlined" style={{ fontSize: small ? 14 : 16, fontVariationSettings: "'FILL' 1" }} aria-hidden>
          {icon ?? c.icon}
        </span>
      )}
      {label}
    </span>
  )
}
