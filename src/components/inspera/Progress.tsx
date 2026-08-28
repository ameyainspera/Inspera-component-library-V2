import { type CSSProperties, useId } from 'react'

export type ProgressVariant = 'Linear' | 'Circular'
export type ProgressSize = 'Small' | 'Medium' | 'Large'
export type ProgressIntent = 'Primary' | 'Success' | 'Warning' | 'Error'

export interface ProgressProps {
  /** Bar or ring. Values: Linear | Circular. */
  variant?: ProgressVariant
  /** Completion percentage 0–100. Ignored when indeterminate. */
  value?: number
  /** Unknown-duration animation. Values: true | false. */
  indeterminate?: boolean
  /** Bar height / ring diameter. Values: Small | Medium | Large. */
  size?: ProgressSize
  /** Fill color. Values: Primary | Success | Warning | Error. */
  intent?: ProgressIntent
  /** Render the percentage. Values: true | false. */
  showValue?: boolean
}

const intentMap: Record<ProgressIntent, string> = {
  Primary: 'var(--primary)',
  Success: 'var(--success)',
  Warning: 'var(--warning)',
  Error: 'var(--error)',
}

const linearHeight: Record<ProgressSize, number> = { Small: 4, Medium: 8, Large: 12 }
const circularDiameter: Record<ProgressSize, number> = { Small: 24, Medium: 40, Large: 56 }

export default function Progress({
  variant = 'Linear',
  value = 60,
  indeterminate = false,
  size = 'Medium',
  intent = 'Primary',
  showValue = false,
}: ProgressProps) {
  const id = useId()
  const clamped = Math.max(0, Math.min(100, value))
  const color = intentMap[intent]

  const ariaProps = {
    role: 'progressbar' as const,
    'aria-valuemin': 0,
    'aria-valuemax': 100,
    ...(indeterminate ? {} : { 'aria-valuenow': clamped }),
    'aria-label': 'Progress',
  }

  if (variant === 'Circular') {
    const d = circularDiameter[size]
    const stroke = size === 'Small' ? 3 : size === 'Medium' ? 4 : 5
    const r = (d - stroke) / 2
    const circumference = 2 * Math.PI * r
    const dashOffset = circumference * (1 - clamped / 100)

    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <span
          {...ariaProps}
          style={{
            display: 'inline-flex',
            width: d,
            height: d,
            ...(indeterminate ? { animation: 'inspera-spin 0.9s linear infinite' } : null),
          }}
        >
          <svg width={d} height={d} viewBox={`0 0 ${d} ${d}`} style={{ transform: 'rotate(-90deg)' }} aria-hidden>
            <circle cx={d / 2} cy={d / 2} r={r} fill="none" stroke="var(--gray-200)" strokeWidth={stroke} />
            <circle
              cx={d / 2}
              cy={d / 2}
              r={r}
              fill="none"
              stroke={color}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={indeterminate ? circumference * 0.7 : dashOffset}
              style={{ transition: indeterminate ? undefined : 'stroke-dashoffset 240ms ease' }}
            />
          </svg>
        </span>
        {showValue && !indeterminate && (
          <span style={{ fontSize: 14, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>{clamped}%</span>
        )}
      </span>
    )
  }

  const h = linearHeight[size]
  const track: CSSProperties = {
    position: 'relative',
    flex: 1,
    height: h,
    borderRadius: 'var(--radius-pill)',
    background: 'var(--gray-200)',
    overflow: 'hidden',
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, width: '100%' }}>
      <span {...ariaProps} aria-describedby={showValue ? id : undefined} style={track}>
        {indeterminate ? (
          <span
            aria-hidden
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '40%',
              borderRadius: 'var(--radius-pill)',
              background: color,
              animation: 'inspera-indeterminate 1.4s ease infinite',
            }}
          />
        ) : (
          <span
            aria-hidden
            style={{
              display: 'block',
              height: '100%',
              width: `${clamped}%`,
              borderRadius: 'var(--radius-pill)',
              background: color,
              transition: 'width 240ms ease',
            }}
          />
        )}
      </span>
      {showValue && !indeterminate && (
        <span id={id} style={{ fontSize: 14, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', minWidth: 36, textAlign: 'right' }}>
          {clamped}%
        </span>
      )}
    </span>
  )
}
