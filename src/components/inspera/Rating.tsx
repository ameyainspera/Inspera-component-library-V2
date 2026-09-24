import { type CSSProperties, useId, useRef, useState } from 'react'

export type RatingSize = 'Small' | 'Medium'

export interface RatingProps {
  /**
   * Current rating. Controlled - pair with onChange. Omit it and the component
   * tracks its own, the same contract Checkbox and Toggle use.
   */
  value?: number
  /** Number of stars. */
  max?: number
  /** Star size. */
  size?: RatingSize
  /** Display-only mode. */
  readOnly?: boolean
  /** Show numeric value. */
  showValue?: boolean
  /** Fired with the chosen rating. Not fired when readOnly. */
  onChange?: (value: number) => void
}

export default function Rating({
  value,
  max = 5,
  size = 'Medium',
  readOnly = false,
  showValue = false,
  onChange,
}: RatingProps) {
  const groupId = useId()
  const [internal, setInternal] = useState(0)
  const [hover, setHover] = useState(0)
  const stars = useRef<(HTMLSpanElement | null)[]>([])

  // `value ?? internal` - the same contract as every other control here. This
  // used to read `onChange ? internal : value`, which made an interactive
  // rating impossible without an onChange: `readOnly={false}` did nothing.
  const current = value ?? internal
  const display = hover || current

  const fontSize = size === 'Small' ? 20 : 28
  const interactive = !readOnly

  const select = (v: number) => {
    if (!interactive) return
    setInternal(v)
    onChange?.(v)
  }

  // Roving tabindex: the group is one stop, and the arrows move within it.
  // Previously the arrow handler lived on a non-focusable container, so the
  // "Arrow keys adjust the rating" the spec promises was unreachable.
  const tabStop = current > 0 ? current : 1

  const onKeyDown = (v: number) => (e: React.KeyboardEvent) => {
    if (!interactive) return
    const next =
      e.key === 'ArrowRight' || e.key === 'ArrowDown' ? Math.min(max, v + 1)
        : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? Math.max(1, v - 1)
        : e.key === ' ' || e.key === 'Enter' ? v
        : null
    if (next === null) return
    e.preventDefault()
    select(next)
    stars.current[next - 1]?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label="Rating"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
    >
      <div style={{ display: 'inline-flex', gap: 2 }}>
        {Array.from({ length: max }, (_, i) => i + 1).map((v) => {
          const filled = v <= display
          const star: CSSProperties = {
            fontSize,
            color: filled ? 'var(--warning)' : 'var(--gray-400)',
            fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0",
            cursor: interactive ? 'pointer' : 'default',
            lineHeight: 1,
            borderRadius: 'var(--radius-xs)',
          }
          return (
            <span
              key={v}
              ref={(el) => { stars.current[v - 1] = el }}
              role="radio"
              aria-checked={v === current}
              aria-label={`${v} star${v > 1 ? 's' : ''}`}
              id={`${groupId}-${v}`}
              tabIndex={interactive && v === tabStop ? 0 : -1}
              className="material-symbols-outlined inspera-interactive"
              style={star}
              onClick={() => select(v)}
              onKeyDown={onKeyDown(v)}
              onMouseEnter={() => interactive && setHover(v)}
              onMouseLeave={() => interactive && setHover(0)}
            >
              star
            </span>
          )
        })}
      </div>
      {showValue && (
        <span style={{ fontSize: 14, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
          {current}/{max}
        </span>
      )}
    </div>
  )
}
