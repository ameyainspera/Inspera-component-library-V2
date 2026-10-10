import { type CSSProperties, type KeyboardEvent, useRef, useState } from 'react'
import { cx, type NativeAttrs } from './types'
import { useControllableState } from './useControllableState'

export type RatingSize = 'Small' | 'Medium'

export interface RatingProps {
  /** What is being rated, e.g. "Question difficulty". The accessible name; not shown. */
  label: string
  /** Current rating. Controlled - pair with onChange. */
  value?: number
  /** Starting rating when uncontrolled. */
  defaultValue?: number
  /** Fired with the chosen rating; 0 when cleared. Not fired when readOnly. */
  onChange?: (value: number) => void
  /** Number of stars. */
  max?: number
  /** Star size. */
  size?: RatingSize
  /** Display-only: announced as "4 of 5 stars", not as a set of choices. */
  readOnly?: boolean
  /** Show the numeric value beside the stars. */
  showValue?: boolean
}

export default function Rating({
  label,
  value,
  defaultValue = 0,
  onChange,
  max = 5,
  size = 'Medium',
  readOnly = false,
  showValue = false,
  className,
  style,
  ...rest
}: RatingProps & NativeAttrs<'div', RatingProps>) {
  const [current, setCurrent] = useControllableState(value, defaultValue, onChange)
  const [hover, setHover] = useState(0)
  const stars = useRef<(HTMLSpanElement | null)[]>([])
  const display = hover || current
  const fontSize = size === 'Small' ? 20 : 28
  const interactive = !readOnly

  const select = (v: number) => {
    if (interactive) setCurrent(v)
  }

  // Roving tabindex: the group is one stop, and the arrows move within it.
  const tabStop = current > 0 ? current : 1

  const onKeyDown = (v: number) => (e: KeyboardEvent) => {
    if (!interactive) return
    const next =
      e.key === 'ArrowRight' || e.key === 'ArrowUp' ? Math.min(max, v + 1)
        : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? Math.max(1, v - 1)
        : e.key === 'Home' ? 1
        : e.key === 'End' ? max
        : e.key === ' ' || e.key === 'Enter' ? v
        // A rating that can be set must be able to be unset.
        : e.key === 'Backspace' || e.key === 'Delete' ? 0
        : null
    if (next === null) return
    e.preventDefault()
    select(next)
    stars.current[Math.max(next, 1) - 1]?.focus()
  }

  const starStyle = (filled: boolean): CSSProperties => ({
    fontSize,
    color: filled ? 'var(--warning)' : 'var(--border-control)',
    fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0",
    cursor: interactive ? 'pointer' : 'default',
    lineHeight: 1,
    borderRadius: 'var(--radius-xs)',
  })

  const summary = `${current} of ${max} stars`

  return (
    <div
      role={readOnly ? 'img' : 'radiogroup'}
      aria-label={readOnly ? `${label}: ${summary}` : label}
      className={cx('inspera', className)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, ...style }}
      {...rest}
    >
      <div style={{ display: 'inline-flex', gap: 2 }}>
        {Array.from({ length: max }, (_, i) => i + 1).map((v) =>
          readOnly ? (
            <span key={v} aria-hidden className="material-symbols-outlined" style={starStyle(v <= display)}>star</span>
          ) : (
            <span
              key={v}
              ref={(el) => { stars.current[v - 1] = el }}
              role="radio"
              aria-checked={v === current}
              aria-label={`${v} star${v > 1 ? 's' : ''}`}
              tabIndex={v === tabStop ? 0 : -1}
              className="material-symbols-outlined inspera-interactive"
              style={starStyle(v <= display)}
              // Clicking the chosen star again clears the rating.
              onClick={() => select(v === current ? 0 : v)}
              onKeyDown={onKeyDown(v)}
              onMouseEnter={() => setHover(v)}
              onMouseLeave={() => setHover(0)}
            >
              star
            </span>
          ),
        )}
      </div>
      {showValue && (
        <span aria-hidden={readOnly || undefined} style={{ fontSize: 14, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
          {current}/{max}
        </span>
      )}
    </div>
  )
}
