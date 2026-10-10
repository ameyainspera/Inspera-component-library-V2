import { type CSSProperties } from 'react'
import { FieldMessage, labelStyle, useFieldA11y } from './FormField'
import { cx, type ForceState, type NativeAttrs } from './types'
import { useControllableState } from './useControllableState'

export type TextInputSize = 'Small' | 'Medium'

export interface TextInputProps {
  /** Field label. Always required: it is the accessible name even when hidden. */
  label: string
  /** Hint shown when empty. Not a substitute for the label. */
  placeholder?: string
  /** Current value. Controlled - pair with onChange. */
  value?: string
  /** Starting value when uncontrolled. */
  defaultValue?: string
  /** Fired with the new value on every keystroke. */
  onChange?: (value: string) => void
  /** Control height. */
  size?: TextInputSize
  /** Material Symbols name shown before the text. */
  leadingIcon?: string
  /** Material Symbols name shown after the text. Decorative only. */
  trailingIcon?: string
  /** Render the visible label. When false, the label becomes `aria-label`. */
  showLabel?: boolean
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

export default function TextInput({
  label,
  placeholder,
  value,
  defaultValue = '',
  onChange,
  size = 'Medium',
  leadingIcon,
  trailingIcon,
  showLabel = true,
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
  ...rest
}: TextInputProps & NativeAttrs<'input', TextInputProps>) {
  const [current, setCurrent] = useControllableState(value, defaultValue, onChange)
  const field = useFieldA11y({ id, label, showLabel, helpText, errorText, error, required })

  const box: CSSProperties = {
    height: size === 'Small' ? 32 : 40,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '0 12px',
    borderRadius: 'var(--radius-sm)',
    borderWidth: 'var(--border-width-default)',
    borderStyle: 'solid',
    background: disabled ? 'var(--surface-disabled)' : readOnly ? 'var(--gray-100)' : 'var(--white)',
    opacity: disabled ? 0.6 : 1,
  }

  const iconStyle: CSSProperties = { fontSize: 20, color: 'var(--action-active)' }

  return (
    <div
      className={cx('inspera', className)}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', width: '100%', fontFamily: 'var(--font-sans)', ...style }}
    >
      {field.ownLabel && (
        <label id={field.labelId} htmlFor={field.id} style={labelStyle}>
          {label}
        </label>
      )}
      <div
        className="inspera-interactive inspera-field"
        data-force-state={disabled || (readOnly && forceState === 'Hover') ? undefined : forceState}
        data-invalid={field.invalid || undefined}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        style={box}
      >
        {leadingIcon && <span className="material-symbols-outlined" style={iconStyle} aria-hidden>{leadingIcon}</span>}
        <input
          id={field.id}
          value={current}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={field.required || undefined}
          aria-label={field.ariaLabel}
          aria-invalid={field.invalid || undefined}
          aria-describedby={field.describedBy}
          onChange={(e) => setCurrent(e.target.value)}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: 'var(--font-sans)',
            fontSize: 16,
            color: 'var(--text-primary)',
            minWidth: 0,
          }}
          {...rest}
        />
        {trailingIcon && <span className="material-symbols-outlined" style={iconStyle} aria-hidden>{trailingIcon}</span>}
      </div>
      <FieldMessage field={field} />
    </div>
  )
}
