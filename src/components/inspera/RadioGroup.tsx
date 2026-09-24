import { useId } from 'react'
import RadioButton from './RadioButton'
import { labelStyle } from './FormField'
import { cx, type NativeAttrs } from './types'
import { useControllableState } from './useControllableState'

export type RadioGroupOrientation = 'Vertical' | 'Horizontal'

export interface RadioOption {
  label: string
  value: string
}

export interface RadioGroupProps {
  /** Group label, announced as the radiogroup name. */
  label: string
  /** Radio options. */
  options: RadioOption[]
  /** Selected option value. Controlled - pair with onChange. */
  value?: string
  /** Starting selection when uncontrolled. */
  defaultValue?: string
  /** Fired with the newly selected value. */
  onChange?: (value: string) => void
  /** Shared input name for the group. Generated when unset. */
  name?: string
  /** Layout direction. */
  orientation?: RadioGroupOrientation
  /** Guidance shown below the options. Replaced by errorText when `error` is set. */
  helpText?: string
  /** Validation message, shown while `error` is true. */
  errorText?: string
  /** Marks the group invalid and shows errorText. */
  error?: boolean
  /** Disables every option. */
  disabled?: boolean
}

export default function RadioGroup({
  label,
  options,
  value,
  defaultValue,
  onChange,
  name,
  orientation = 'Vertical',
  helpText,
  errorText,
  error = false,
  disabled = false,
  className,
  style,
  ...rest
}: RadioGroupProps & NativeAttrs<'div', RadioGroupProps>) {
  const groupId = useId()
  const fieldName = name ?? groupId
  const [selected, setSelected] = useControllableState<string | undefined>(
    value,
    defaultValue,
    onChange as ((v: string | undefined) => void) | undefined,
  )
  const message = error && errorText ? errorText : helpText
  const messageId = `${groupId}-msg`

  return (
    <div
      className={cx('inspera', className)}
      style={{ display: 'flex', flexDirection: 'column', gap: 4, fontFamily: 'var(--font-sans)', ...style }}
    >
      <span id={`${groupId}-label`} style={labelStyle}>{label}</span>
      <div
        role="radiogroup"
        aria-labelledby={`${groupId}-label`}
        aria-describedby={message ? messageId : undefined}
        aria-invalid={error || undefined}
        aria-disabled={disabled || undefined}
        style={{
          display: 'flex',
          flexDirection: orientation === 'Vertical' ? 'column' : 'row',
          flexWrap: 'wrap',
          columnGap: 24,
          rowGap: 0,
        }}
        {...rest}
      >
        {options.map((opt) => (
          <RadioButton
            key={opt.value}
            label={opt.label}
            value={opt.value}
            name={fieldName}
            selected={selected === opt.value}
            disabled={disabled}
            error={error}
            onChange={() => {
              if (!disabled) setSelected(opt.value)
            }}
          />
        ))}
      </div>
      {message && (
        <span id={messageId} style={{ fontSize: 12, color: error && errorText ? 'var(--error)' : 'var(--muted-foreground)' }}>
          {message}
        </span>
      )}
    </div>
  )
}
