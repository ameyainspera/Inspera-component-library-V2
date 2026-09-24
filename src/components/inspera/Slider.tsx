import { type CSSProperties, useId } from 'react'
import { labelStyle } from './FormField'
import { cx, type ForceState, type NativeAttrs } from './types'
import { useControllableState } from './useControllableState'

export interface SliderProps {
  /** What is being adjusted. Required: it is the accessible name even when hidden. */
  label: string
  /** Minimum value. */
  min?: number
  /** Maximum value. */
  max?: number
  /** Increment granularity. */
  step?: number
  /** Current value. Controlled - pair with onChange. */
  value?: number
  /** Starting value when uncontrolled. Defaults to the midpoint. */
  defaultValue?: number
  /** Fired as the value changes, by drag or arrow key. */
  onChange?: (value: number) => void
  /** Formats the shown value and what assistive tech announces, e.g. `(v) => `${v}%``. */
  formatValue?: (value: number) => string
  /** Show the current value. */
  showValue?: boolean
  /** Render the visible label. When false, the label becomes `aria-label`. */
  showLabel?: boolean
  /** Blocks interaction and dims the control. */
  disabled?: boolean
  /** @internal Freezes a focus look for the docs gallery. */
  forceState?: ForceState
}

export default function Slider({
  label,
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  onChange,
  formatValue,
  showValue = true,
  showLabel = true,
  disabled = false,
  forceState,
  className,
  style,
  id,
  ...rest
}: SliderProps & NativeAttrs<'input', SliderProps>) {
  const generated = useId()
  const inputId = id ?? generated
  // The midpoint, snapped to the step so the first drag does not jump.
  const midpoint = min + Math.round((max - min) / 2 / step) * step
  const [raw, setValue] = useControllableState(value, defaultValue ?? midpoint, onChange)
  const current = Math.min(max, Math.max(min, raw))
  const shown = formatValue ? formatValue(current) : String(current)

  const pct = max === min ? 0 : ((current - min) / (max - min)) * 100

  // The real control is a visually hidden range input, so the ring has to be
  // drawn on the thumb standing in for it - .inspera-control in runtime.css
  // does that from :focus-visible.
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
    borderRadius: 'var(--radius-pill)',
    borderWidth: 'var(--border-width-strong)',
    borderStyle: 'solid',
    boxShadow: 'var(--effect-thumb-shadow)',
    pointerEvents: 'none',
  }

  return (
    <div
      className={cx('inspera', className)}
      style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', opacity: disabled ? 0.5 : 1, fontFamily: 'var(--font-sans)', ...style }}
    >
      {(showLabel || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {showLabel && (
            <label htmlFor={inputId} style={labelStyle}>{label}</label>
          )}
          {showValue && (
            <span aria-hidden style={{ fontSize: 14, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>{shown}</span>
          )}
        </div>
      )}
      <div
        className="inspera-control"
        data-force-state={forceState}
        data-disabled={disabled || undefined}
        style={{ position: 'relative', height: 20, display: 'flex', alignItems: 'center' }}
      >
        <div style={{ position: 'absolute', left: 0, right: 0, height: 4, borderRadius: 'var(--radius-pill)', background: 'var(--gray-300)' }} />
        <div style={{ position: 'absolute', left: 0, width: `${pct}%`, height: 4, borderRadius: 'var(--radius-pill)', background: 'var(--primary)' }} />
        <span className="inspera-control-indicator" style={thumb} aria-hidden />
        <input
          id={inputId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={current}
          disabled={disabled}
          aria-label={showLabel ? undefined : label}
          aria-valuetext={formatValue ? shown : undefined}
          onChange={(e) => setValue(Number(e.target.value))}
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
          {...rest}
        />
      </div>
    </div>
  )
}
