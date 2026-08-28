import { type CSSProperties, useId, useState } from 'react'

export type SliderState = 'Default' | 'Focused' | 'Disabled'

export interface SliderProps {
  label?: string
  /** Minimum value. */
  min?: number
  /** Maximum value. */
  max?: number
  value?: number
  /** Increment granularity. */
  step?: number
  /** Forces a visual state for documentation. Omit for real interactivity. */
  state?: SliderState
  /** Show the current value. Values: true | false. */
  showValue?: boolean
  /** Show the field label. Values: true | false. */
  showLabel?: boolean
  onChange?: (value: number) => void
}

export default function Slider({
  label = 'Value',
  min = 0,
  max = 100,
  value,
  step = 1,
  state = 'Default',
  showValue = true,
  showLabel = true,
  onChange,
}: SliderProps) {
  const id = useId()
  const [internal, setInternal] = useState(Math.round((min + max) / 2))
  const current = value ?? internal
  const disabled = state === 'Disabled'
  const isFocused = state === 'Focused'

  const pct = max === min ? 0 : ((current - min) / (max - min)) * 100

  const thumb: CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: `${pct}%`,
    transform: 'translate(-50%, -50%)',
    width: 20,
    height: 20,
    borderRadius: '9999px',
    background: '#FFFFFF',
    border: '2px solid var(--primary)',
    boxShadow: isFocused ? '0 0 0 3px var(--primary-focus-ring)' : '0 1px 2px rgba(0,0,0,0.2)',
    pointerEvents: 'none',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 280, opacity: disabled ? 0.5 : 1 }}>
      {(showLabel || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {showLabel && (
            <label htmlFor={id} style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</label>
          )}
          {showValue && (
            <span style={{ fontSize: 14, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>{current}</span>
          )}
        </div>
      )}
      <div style={{ position: 'relative', height: 20, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, height: 4, borderRadius: 'var(--radius-pill)', background: 'var(--gray-300)' }} />
        <div style={{ position: 'absolute', left: 0, width: `${pct}%`, height: 4, borderRadius: 'var(--radius-pill)', background: 'var(--primary)' }} />
        <span style={thumb} aria-hidden />
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={current}
          disabled={disabled}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={current}
          aria-label={label}
          onChange={(e) => {
            const n = Number(e.target.value)
            setInternal(n)
            onChange?.(n)
          }}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            width: '100%',
            margin: 0,
            opacity: 0,
            height: 20,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        />
      </div>
    </div>
  )
}
