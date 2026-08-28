import { type CSSProperties, useId, useState } from 'react'

export type RatingSize = 'Small' | 'Medium'

export interface RatingProps {
  value?: number
  max?: number
  size?: RatingSize
  readOnly?: boolean
  showValue?: boolean
  onChange?: (value: number) => void
}

export default function Rating({
  value = 0,
  max = 5,
  size = 'Medium',
  readOnly = false,
  showValue = false,
  onChange,
}: RatingProps) {
  const groupId = useId()
  const [internal, setInternal] = useState(value)
  const [hover, setHover] = useState(0)
  const current = onChange ? internal : value
  const display = hover || current

  const fontSize = size === 'Small' ? 20 : 28
  const interactive = !readOnly

  const select = (v: number) => {
    if (!interactive) return
    setInternal(v)
    onChange?.(v)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!interactive) return
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      select(Math.min(max, current + 1))
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      select(Math.max(0, current - 1))
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label="Rating"
      tabIndex={interactive ? 0 : -1}
      onKeyDown={onKeyDown}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, outline: 'none' }}
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
          }
          return (
            <span
              key={v}
              role="radio"
              aria-checked={v === current}
              aria-label={`${v} star${v > 1 ? 's' : ''}`}
              id={`${groupId}-${v}`}
              className="material-symbols-outlined"
              style={star}
              onClick={() => select(v)}
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
