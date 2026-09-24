import { type CSSProperties, useEffect, useId, useState } from 'react'

export type NumberInputState = 'Default' | 'Focused' | 'Disabled' | 'Error' | 'ReadOnly'
export type NumberInputSize = 'Small' | 'Medium'

export interface NumberInputProps {
  /** Field label. */
  label?: string
  /** Hint shown when empty. */
  placeholder?: string
  /** Current value. Controlled - pair with onChange. */
  value?: number
  /** Minimum allowed value. */
  min?: number
  /** Maximum allowed value. */
  max?: number
  /** Increment applied by the steppers and arrow keys. */
  step?: number
  /**
   * Freezes a visual state so documentation can show it without a pointer.
   * `Focused` is presentation-only. `Error`, `Disabled` and `ReadOnly` are real
   * application state.
   */
  state?: NumberInputState
  /** Control height. */
  size?: NumberInputSize
  /** Render the field label. */
  showLabel?: boolean
  /** Unit suffix shown inside the field, e.g. "min" or "%". */
  suffix?: string
  /** Helper text. */
  helpText?: string
  /** Error message, shown when state is Error. */
  errorText?: string
  /** Fired with the new numeric value. */
  onChange?: (value: number) => void
}

const clamp = (n: number, min?: number, max?: number) => {
  let out = n
  if (typeof min === 'number') out = Math.max(out, min)
  if (typeof max === 'number') out = Math.min(out, max)
  return out
}

export default function NumberInput({
  label = 'Amount',
  placeholder = '0',
  value,
  min,
  max,
  step = 1,
  state = 'Default',
  size = 'Medium',
  showLabel = true,
  suffix,
  helpText,
  errorText,
  onChange,
}: NumberInputProps) {
  const id = useId()
  const [internal, setInternal] = useState<number | undefined>(value)
  const current = value ?? internal

  useEffect(() => { if (value !== undefined) setInternal(value) }, [value])

  const disabled = state === 'Disabled'
  const readOnly = state === 'ReadOnly'
  const isError = state === 'Error'
  const height = size === 'Small' ? 32 : 40

  const commit = (n: number) => {
    const next = clamp(n, min, max)
    setInternal(next)
    onChange?.(next)
  }

  const bump = (dir: 1 | -1) => {
    if (disabled || readOnly) return
    commit((current ?? 0) + dir * step)
  }

  const atMin = typeof min === 'number' && current !== undefined && current <= min
  const atMax = typeof max === 'number' && current !== undefined && current >= max

  const field: CSSProperties = {
    height,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '0 4px 0 12px',
    borderRadius: 'var(--radius-md)',
    borderWidth: 'var(--border-width-default)',
    borderStyle: 'solid',
    background: disabled ? 'var(--surface-disabled)' : readOnly ? 'var(--gray-100)' : 'var(--white)',
    opacity: disabled ? 0.6 : 1,
  }

  const stepBtn = (off: boolean): CSSProperties => ({
    width: 28,
    height: 28,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    background: 'transparent',
    borderRadius: 'var(--radius-sm)',
    color: off || disabled || readOnly ? 'var(--action-disabled)' : 'var(--action-active)',
    cursor: off || disabled || readOnly ? 'not-allowed' : 'pointer',
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', fontFamily: 'var(--font-sans)' }}>
      {showLabel && (
        <label htmlFor={id} style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</label>
      )}
      <div
        className="inspera-interactive inspera-field"
        data-force-state={state === 'Focused' ? 'Focused' : undefined}
        data-invalid={isError || undefined}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        style={field}
      >
        <input
          id={id}
          type="number"
          inputMode="numeric"
          value={current ?? ''}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={isError || undefined}
          aria-describedby={errorText ? `${id}-err` : helpText ? `${id}-help` : undefined}
          onChange={(e) => {
            if (e.target.value === '') { setInternal(undefined); return }
            commit(Number(e.target.value))
          }}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: 'var(--font-sans)', fontSize: 16, color: 'var(--text-primary)', minWidth: 0,
            // The UA spinner would double up with our steppers.
            appearance: 'textfield', WebkitAppearance: 'textfield',
          }}
        />
        {suffix && <span style={{ fontSize: 14, color: 'var(--muted-foreground)' }}>{suffix}</span>}
        <span style={{ display: 'inline-flex' }}>
          <button type="button" aria-label={`Decrease ${label}`} disabled={disabled || readOnly || atMin} style={stepBtn(Boolean(atMin))} onClick={() => bump(-1)}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>remove</span>
          </button>
          <button type="button" aria-label={`Increase ${label}`} disabled={disabled || readOnly || atMax} style={stepBtn(Boolean(atMax))} onClick={() => bump(1)}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>add</span>
          </button>
        </span>
      </div>
      {isError && errorText && (
        <span id={`${id}-err`} style={{ fontSize: 12, color: 'var(--error)' }}>{errorText}</span>
      )}
      {!isError && helpText && (
        <span id={`${id}-help`} style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{helpText}</span>
      )}
    </div>
  )
}
