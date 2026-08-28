import { type CSSProperties } from 'react'

export type StatDeltaIntent = 'up' | 'down' | 'neutral'

export interface StatProps {
  label: string
  value: string | number
  delta?: string
  deltaIntent?: StatDeltaIntent
  icon?: string
  helpText?: string
}

const deltaMap: Record<StatDeltaIntent, { color: string; icon: string }> = {
  up: { color: '#2E7D32', icon: 'trending_up' },
  down: { color: '#D32F2F', icon: 'trending_down' },
  neutral: { color: 'var(--muted-foreground)', icon: 'trending_flat' },
}

export default function Stat({
  label = 'Average score',
  value = '84%',
  delta = '+4.2%',
  deltaIntent = 'up',
  icon,
  helpText,
}: Partial<StatProps>) {
  const d = deltaMap[deltaIntent]

  const container: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    minWidth: 200,
    padding: 16,
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    background: 'var(--white)',
    fontFamily: 'var(--font-sans)',
    color: 'var(--text-primary)',
  }

  return (
    <div style={container}>
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
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 500, color: d.color }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>
            {d.icon}
          </span>
          {delta}
        </span>
      )}
      {helpText && <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{helpText}</span>}
    </div>
  )
}
