import { type CSSProperties } from 'react'
import { FieldMessage, labelStyle, useFieldA11y } from './FormField'
import { cx, type ForceState, type NativeAttrs } from './types'
import { useControllableState } from './useControllableState'

export type TextareaSize = 'Small' | 'Medium'

export interface TextareaProps {
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
  /** Visible text rows. */
  rows?: number
  /** Vertical padding density. */
  size?: TextareaSize
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
  /** Maximum character length. */
  maxLength?: number
  /** Show a character counter. */
  showCount?: boolean
  /** @internal Freezes a hover or focus look for the docs gallery. */
  forceState?: ForceState
}

export default function Textarea({
  label,
  placeholder,
  value,
  defaultValue = '',
  onChange,
  rows = 4,
  size = 'Medium',
  showLabel = true,
  helpText,
  errorText,
  error = false,
  disabled = false,
  readOnly = false,
  maxLength,
  showCount = false,
  forceState,
  className,
  style,
  id,
  required,
  ...rest
}: TextareaProps & NativeAttrs<'textarea', TextareaProps>) {
  const [current, setCurrent] = useControllableState(value, defaultValue, onChange)
  const field = useFieldA11y({ id, label, showLabel, helpText, errorText, error, required })
  const countId = `${field.id}-count`

  const box: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    padding: `${size === 'Small' ? 6 : 8}px 12px`,
    borderRadius: 'var(--radius-sm)',
    borderWidth: 'var(--border-width-default)',
    borderStyle: 'solid',
    background: disabled ? 'var(--surface-disabled)' : readOnly ? 'var(--gray-100)' : 'var(--white)',
    opacity: disabled ? 0.6 : 1,
  }

  const describedBy = [field.describedBy, showCount ? countId : undefined].filter(Boolean).join(' ') || undefined

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
        <textarea
          id={field.id}
          value={current}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          required={field.required || undefined}
          aria-label={field.ariaLabel}
          aria-invalid={field.invalid || undefined}
          aria-describedby={describedBy}
          onChange={(e) => setCurrent(e.target.value)}
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            resize: disabled || readOnly ? 'none' : 'vertical',
            fontFamily: 'var(--font-sans)',
            fontSize: 16,
            color: 'var(--text-primary)',
            minWidth: 0,
            width: '100%',
          }}
          {...rest}
        />
        {showCount && (
          <span id={countId} style={{ alignSelf: 'flex-end', fontSize: 12, color: 'var(--muted-foreground)', marginTop: 4 }}>
            {current.length}{maxLength ? `/${maxLength}` : ''}
          </span>
        )}
      </div>
      <FieldMessage field={field} />
    </div>
  )
}
