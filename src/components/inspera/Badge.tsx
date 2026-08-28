import { type CSSProperties } from 'react'

export type BadgeIntent = 'Neutral' | 'Info' | 'Success' | 'Warning' | 'Error'
export type BadgeSize = 'Small' | 'Medium'

export interface BadgeProps {
  label?: string
  intent?: BadgeIntent
  size?: BadgeSize
  withIcon?: boolean
  icon?: string
}

const intentMap: Record<BadgeIntent, { bg: string; fg: string; icon: string }> = {
  Neutral: { bg: '#F0F0F0', fg: '#272727', icon: 'circle' },
  Info: { bg: '#E1F5FE', fg: '#0288D1', icon: 'info' },
  Success: { bg: '#E8F5E9', fg: '#2E7D32', icon: 'check_circle' },
  Warning: { bg: '#FFF3E0', fg: '#EF6C00', icon: 'warning' },
  Error: { bg: '#FFEBEE', fg: '#D32F2F', icon: 'error' },
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
