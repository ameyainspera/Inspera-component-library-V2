import { type CSSProperties, useId } from 'react'
import { cx, type NativeAttrs } from './types'

export type ProgressVariant = 'Linear' | 'Circular'
export type ProgressSize = 'Small' | 'Medium' | 'Large'
export type ProgressIntent = 'Primary' | 'Success' | 'Warning' | 'Error'

export interface ProgressProps {
  /** What is progressing, e.g. "Uploading attachments". The accessible name. */
  label: string
  /** Bar or ring. */
  variant?: ProgressVariant
  /** Completion percentage 0-100. Required unless indeterminate. */
  value?: number
  /** Unknown-duration animation. */
  indeterminate?: boolean
  /** Bar height / ring diameter. */
  size?: ProgressSize
  /** Fill color. */
  intent?: ProgressIntent
  /** Render the percentage. */
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
  label,
  variant = 'Linear',
  value = 0,
  indeterminate = false,
  size = 'Medium',
  intent = 'Primary',
  showValue = false,
  className,
  style,
  ...rest
}: ProgressProps & NativeAttrs<'span', ProgressProps>) {
  const id = useId()
  const clamped = Math.max(0, Math.min(100, value))
  const color = intentMap[intent]

  const ariaProps = {
    role: 'progressbar' as const,
    'aria-valuemin': 0,
    'aria-valuemax': 100,
    ...(indeterminate ? {} : { 'aria-valuenow': clamped }),
    'aria-label': label,
  }

  if (variant === 'Circular') {
    const d = circularDiameter[size]
    const stroke = size === 'Small' ? 3 : size === 'Medium' ? 4 : 5
    const r = (d - stroke) / 2
    const circumference = 2 * Math.PI * r
    const dashOffset = circumference * (1 - clamped / 100)

    return (
      <span className={cx('inspera', className)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-sans)', ...style }} {...rest}>
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
              style={{ transition: indeterminate ? undefined : 'stroke-dashoffset var(--duration-normal) var(--easing-standard)' }}
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
    <span className={cx('inspera', className)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, width: '100%', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
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
              transition: 'width var(--duration-normal) var(--easing-standard)',
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
