import { type CSSProperties, useEffect, useRef, useState } from 'react'
import Button from './Button'
import { FieldMessage, labelStyle, useFieldA11y } from './FormField'
import { assignRef, cx, type ForceState, type NativeAttrs } from './types'
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
  /** Minimum allowed value. The decrease button turns off at it. */
  min?: number
  /** Maximum allowed value. The increase button turns off at it. */
  max?: number
  /** Increment applied by the steppers and arrow keys. */
  step?: number
  /** Height 32 / 40 (`--control-height-sm/md`), for the value box and both steppers. */
  size?: NumberInputSize
  /** Render the visible label. When false, the label becomes `aria-label`. */
  showLabel?: boolean
  /** Unit shown after the number inside the value box, e.g. "min" or "%". */
  suffix?: string
  /** Guidance shown below the field. Replaced by errorText when `error` is set. */
  helpText?: string
  /** Validation message, shown while `error` is true. */
  errorText?: string
  /** Marks the field invalid: red border, `aria-invalid`, errorText shown. */
  error?: boolean
  /** Blocks editing and dims the field and both steppers. */
  disabled?: boolean
  /** Shows the value without allowing edits. The steppers turn off. */
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
  ref,
  ...rest
}: NumberInputProps & NativeAttrs<'input', NumberInputProps>) {
  const [current, setCurrent] = useControllableState<number | undefined>(
    value,
    defaultValue,
    onChange as ((n: number | undefined) => void) | undefined,
  )
  const field = useFieldA11y({ id, label, showLabel, helpText, errorText, error, required })
  const input = useRef<HTMLInputElement | null>(null)

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
  const locked = disabled || readOnly

  // The input is only as wide as what it holds, so the number and its unit sit
  // centred together ("5 min") rather than at opposite ends of the box.
  // Tabular figures make every digit exactly 1ch; 2px leaves room for the caret.
  const chars = Math.max(draft === '' ? (placeholder?.length ?? 0) : draft.length, 1)

  const box: CSSProperties = {
    height: size === 'Small' ? 'var(--control-height-sm)' : 'var(--control-height-md)',
    minWidth: 80,
    // A min-width replaces a flex item's automatic minimum, so without this a
    // narrow column squeezed the box below its own number and unit.
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: '0 8px',
    borderRadius: 'var(--radius-sm)',
    borderWidth: 'var(--border-width-default)',
    borderStyle: 'solid',
    background: disabled ? 'var(--surface-disabled)' : readOnly ? 'var(--gray-100)' : 'var(--white)',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'text',
  }

  const text: CSSProperties = { fontFamily: 'var(--font-sans)', fontSize: 16, color: 'var(--text-primary)' }

  return (
    <div
      className={cx('inspera', className)}
      style={{ display: 'inline-flex', flexDirection: 'column', gap: 'var(--space-1)', maxWidth: '100%', verticalAlign: 'top', fontFamily: 'var(--font-sans)', ...style }}
    >
      {field.ownLabel && (
        <label id={field.labelId} htmlFor={field.id} style={labelStyle}>{label}</label>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <Button
          label={`Decrease ${label}`}
          intent="Primary"
          size={size}
          leadingIcon="remove"
          iconOnly
          disabled={locked || atMin}
          onClick={() => bump(-1)}
          style={{ flexShrink: 0 }}
        />
        <div
          className="inspera-interactive inspera-field"
          data-force-state={disabled || (readOnly && forceState === 'Hover') ? undefined : forceState}
          data-invalid={field.invalid || undefined}
          data-disabled={disabled || undefined}
          data-readonly={readOnly || undefined}
          style={box}
          // A press on the unit or the padding still lands in the input.
          onMouseDown={(e) => {
            if (e.target === input.current || disabled) return
            e.preventDefault()
            input.current?.focus()
          }}
        >
          <input
            ref={(node) => {
              input.current = node
              assignRef(ref, node)
            }}
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
              const typed = e.target.value
              setDraft(typed)
              const n = Number(typed)
              // Report a value as soon as it is a complete, in-range number;
              // anything else waits for blur.
              if (typed !== '' && Number.isFinite(n) && inRange(n)) setCurrent(round(n))
            }}
            onBlur={(e) => {
              const n = Number(draft)
              if (draft === '' || !Number.isFinite(n)) setDraft(current === undefined ? '' : String(current))
              else commit(n)
              onBlur?.(e)
            }}
            style={{
              ...text,
              width: `calc(${chars}ch + 2px)`,
              padding: 0,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              textAlign: 'center',
              fontVariantNumeric: 'tabular-nums',
              cursor: 'inherit',
              // The UA spinner would double up with our steppers.
              appearance: 'textfield',
              WebkitAppearance: 'textfield',
            }}
            {...rest}
          />
          {suffix && <span style={text}>{suffix}</span>}
        </div>
        <Button
          label={`Increase ${label}`}
          intent="Primary"
          size={size}
          leadingIcon="add"
          iconOnly
          disabled={locked || atMax}
          onClick={() => bump(1)}
          style={{ flexShrink: 0 }}
        />
      </div>
      <FieldMessage field={field} />
    </div>
  )
}
