import { type CSSProperties, useEffect, useState } from 'react'
import { FieldMessage, labelStyle, useFieldA11y } from './FormField'
import { cx, type ForceState, type NativeAttrs } from './types'
import { useControllableState } from './useControllableState'

export type NumberInputSize = 'Small' | 'Medium'

export interface NumberInputProps {
  /** Field label. Always required: it is the accessible name even when hidden. */
  label: string
  /** Hint shown when empty. */
  placeholder?: string
  /** Current value. Controlled - pair with onChange. */
  value?: number
  /** Starting value when uncontrolled. */
  defaultValue?: number
  /** Fired with each committed value - valid, and within min/max. */
  onChange?: (value: number) => void
  /** Minimum allowed value. */
  min?: number
  /** Maximum allowed value. */
  max?: number
  /** Increment applied by the steppers and arrow keys. */
  step?: number
  /** Control height. */
  size?: NumberInputSize
  /** Render the visible label. When false, the label becomes `aria-label`. */
  showLabel?: boolean
  /** Unit suffix shown inside the field, e.g. "min" or "%". */
  suffix?: string
  /** Guidance shown below the field. Replaced by errorText when `error` is set. */
  helpText?: string
  /** Validation message, shown while `error` is true. */
  errorText?: string
  /** Marks the field invalid: red border, `aria-invalid`, errorText shown. */
  error?: boolean
  /** Blocks editing and dims the field. */
  disabled?: boolean
  /** Shows the value without allowing edits. */
  readOnly?: boolean
  /** @internal Freezes a hover or focus look for the docs gallery. */
  forceState?: ForceState
}

const clamp = (n: number, min?: number, max?: number) => {
  let out = n
  if (typeof min === 'number') out = Math.max(out, min)
  if (typeof max === 'number') out = Math.min(out, max)
  return out
}

/** Decimal places in the step, so 0.1 + 0.2 lands on 0.3 and not 0.30000000000000004. */
const precision = (step: number) => (String(step).split('.')[1] ?? '').length

export default function NumberInput({
  label,
  placeholder,
  value,
  defaultValue,
  onChange,
  min,
  max,
  step = 1,
  size = 'Medium',
  showLabel = true,
  suffix,
  helpText,
  errorText,
  error = false,
  disabled = false,
  readOnly = false,
  forceState,
  className,
  style,
  id,
  required,
  onBlur,
  ...rest
}: NumberInputProps & NativeAttrs<'input', NumberInputProps>) {
  const [current, setCurrent] = useControllableState<number | undefined>(
    value,
    defaultValue,
    onChange as ((n: number | undefined) => void) | undefined,
  )
  const field = useFieldA11y({ id, label, showLabel, helpText, errorText, error, required })

  // What is typed, kept apart from the committed number. Clamping every
  // keystroke made some values impossible to enter: with min=10, typing "15"
  // became 10 the moment the "1" landed.
  const [draft, setDraft] = useState(current === undefined ? '' : String(current))
  useEffect(() => {
    setDraft(current === undefined ? '' : String(current))
  }, [current])

  const round = (n: number) => Number(n.toFixed(precision(step)))
  const inRange = (n: number) =>
    (typeof min !== 'number' || n >= min) && (typeof max !== 'number' || n <= max)

  const commit = (n: number) => {
    const next = round(clamp(n, min, max))
    setCurrent(next)
    setDraft(String(next))
  }

  const bump = (dir: 1 | -1) => {
    if (disabled || readOnly) return
    commit((current ?? min ?? 0) + dir * step)
  }

  const atMin = typeof min === 'number' && current !== undefined && current <= min
  const atMax = typeof max === 'number' && current !== undefined && current >= max
  // Decimal and negative values need a keyboard with a point and a minus key.
  const decimalKeys = precision(step) > 0 || (typeof min === 'number' ? min < 0 : true)

  const box: CSSProperties = {
    height: size === 'Small' ? 32 : 40,
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
    <div
      className={cx('inspera', className)}
      style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', fontFamily: 'var(--font-sans)', ...style }}
    >
      {field.ownLabel && (
        <label id={field.labelId} htmlFor={field.id} style={labelStyle}>{label}</label>
      )}
      <div
        className="inspera-interactive inspera-field"
        data-force-state={forceState}
        data-invalid={field.invalid || undefined}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        style={box}
      >
        <input
          id={field.id}
          type="number"
          inputMode={decimalKeys ? 'decimal' : 'numeric'}
          value={draft}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          readOnly={readOnly}
          required={field.required || undefined}
          aria-label={field.ariaLabel}
          aria-invalid={field.invalid || undefined}
          aria-describedby={field.describedBy}
          onChange={(e) => {
            const text = e.target.value
            setDraft(text)
            const n = Number(text)
            // Report a value as soon as it is a complete, in-range number;
            // anything else waits for blur.
            if (text !== '' && Number.isFinite(n) && inRange(n)) setCurrent(round(n))
          }}
          onBlur={(e) => {
            const n = Number(draft)
            if (draft === '' || !Number.isFinite(n)) setDraft(current === undefined ? '' : String(current))
            else commit(n)
            onBlur?.(e)
          }}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: 'var(--font-sans)', fontSize: 16, color: 'var(--text-primary)', minWidth: 0,
            // The UA spinner would double up with our steppers.
            appearance: 'textfield', WebkitAppearance: 'textfield',
          }}
          {...rest}
        />
        {suffix && <span style={{ fontSize: 14, color: 'var(--muted-foreground)' }}>{suffix}</span>}
        <span style={{ display: 'inline-flex' }}>
          <button type="button" className="inspera-interactive" aria-label={`Decrease ${label}`} disabled={disabled || readOnly || atMin} style={stepBtn(Boolean(atMin))} onClick={() => bump(-1)}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>remove</span>
          </button>
          <button type="button" className="inspera-interactive" aria-label={`Increase ${label}`} disabled={disabled || readOnly || atMax} style={stepBtn(Boolean(atMax))} onClick={() => bump(1)}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>add</span>
          </button>
        </span>
      </div>
      <FieldMessage field={field} />
    </div>
  )
}
