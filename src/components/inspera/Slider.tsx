import { type CSSProperties, useId, useState } from 'react'

export type SliderState = 'Default' | 'Focused' | 'Disabled'

export interface SliderProps {
  /** Field label describing what is being adjusted. */
  label?: string
  /** Minimum value. */
  min?: number
  /** Maximum value. */
  max?: number
  /** Current value. Controlled - pair with onChange. */
  value?: number
  /** Increment granularity. */
  step?: number
  /**
   * Freezes a visual state so documentation can show it without a pointer.
   * `Focused` is presentation-only - leave it unset in application code, where
   * CSS drives it from the real pointer and keyboard. `Disabled` is real
   * application state and belongs in your code.
   */
  state?: SliderState
  /** Show the current value. */
  showValue?: boolean
  /** Show the field label. */
  showLabel?: boolean
  /** Fired as the value changes, by drag or arrow key. */
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

  const pct = max === min ? 0 : ((current - min) / (max - min)) * 100

  // The real control is a visually hidden range input, so the ring has to be
  // drawn on the thumb standing in for it - .inspera-control in runtime.css
  // does that from :focus-visible, which is why Tab used to show nothing here.
  const thumb: CSSProperties & Record<string, string | number> = {
    '--inspera-indicator-border': 'var(--primary)',
    '--inspera-indicator-bg': 'var(--white)',
    '--inspera-indicator-border-hover': 'var(--primary)',
    '--inspera-indicator-bg-hover': 'var(--white)',
    position: 'absolute',
    top: '50%',
    left: `${pct}%`,
    transform: 'translate(-50%, -50%)',
    width: 20,
    height: 20,
    borderRadius: '9999px',
    borderWidth: 2,
    borderStyle: 'solid',
    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
    pointerEvents: 'none',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', opacity: disabled ? 0.5 : 1, fontFamily: 'var(--font-sans)' }}>
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
      <div
        className="inspera-control"
        data-force-state={state === 'Focused' ? 'Focused' : undefined}
        data-disabled={disabled || undefined}
        style={{ position: 'relative', height: 20, display: 'flex', alignItems: 'center' }}
      >
        <div style={{ position: 'absolute', left: 0, right: 0, height: 4, borderRadius: 'var(--radius-pill)', background: 'var(--gray-300)' }} />
        <div style={{ position: 'absolute', left: 0, width: `${pct}%`, height: 4, borderRadius: 'var(--radius-pill)', background: 'var(--primary)' }} />
        <span className="inspera-control-indicator" style={thumb} aria-hidden />
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
