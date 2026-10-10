import { useId } from 'react'
import Checkbox from './Checkbox'
import { labelStyle } from './FormField'
import { cx, type NativeAttrs } from './types'
import { useControllableState } from './useControllableState'

export type CheckboxGroupOrientation = 'Vertical' | 'Horizontal'

export interface CheckboxOption {
  label: string
  value: string
}

export interface CheckboxGroupProps {
  /** Group label, announced as the group's name. */
  label: string
  /** Checkbox options. */
  options: CheckboxOption[]
  /** Selected option values. Controlled - pair with onChange. */
  value?: string[]
  /** Starting selection when uncontrolled. */
  defaultValue?: string[]
  /** Fired with the full array of selected values. */
  onChange?: (value: string[]) => void
  /** Layout direction. */
  orientation?: CheckboxGroupOrientation
  /** Guidance shown below the options. Replaced by errorText when `error` is set. */
  helpText?: string
  /** Validation message, shown while `error` is true. */
  errorText?: string
  /** Marks every option invalid and shows errorText. */
  error?: boolean
  /** Disables every option. */
  disabled?: boolean
}

export default function CheckboxGroup({
  label,
  options,
  value,
  defaultValue = [],
  onChange,
  orientation = 'Vertical',
  helpText,
  errorText,
  error = false,
  disabled = false,
  className,
  style,
  ...rest
}: CheckboxGroupProps & NativeAttrs<'div', CheckboxGroupProps>) {
  const groupId = useId()
  const [selected, setSelected] = useControllableState(value, defaultValue, onChange)
  const message = error && errorText ? errorText : helpText
  const messageId = `${groupId}-msg`

  const toggle = (v: string) => {
    if (disabled) return
    setSelected(selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v])
  }

  // The same shape as RadioGroup: a labelled `role="group"`. A fieldset would
  // work too, but one pattern for both groups is easier to get right.
  return (
    <div
      className={cx('inspera', className)}
      style={{ display: 'flex', flexDirection: 'column', gap: 4, fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      <span id={`${groupId}-label`} style={labelStyle}>{label}</span>
      <div
        role="group"
        aria-labelledby={`${groupId}-label`}
        aria-describedby={message ? messageId : undefined}
        aria-disabled={disabled || undefined}
        style={{
          display: 'flex',
          flexDirection: orientation === 'Vertical' ? 'column' : 'row',
          flexWrap: 'wrap',
          columnGap: 24,
          rowGap: 0,
        }}
      >
        {options.map((opt) => (
          <Checkbox
            key={opt.value}
            label={opt.label}
            value={opt.value}
            checked={selected.includes(opt.value)}
            disabled={disabled}
            error={error}
            onChange={() => toggle(opt.value)}
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
