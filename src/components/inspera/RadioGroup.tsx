import { useId, useState } from 'react'
import RadioButton, { type RadioState } from './RadioButton'

export type RadioGroupState = 'Default' | 'Disabled' | 'Error'
export type RadioGroupOrientation = 'Vertical' | 'Horizontal'

export interface RadioOption {
  label: string
  value: string
}

export interface RadioGroupProps {
  /** Group label, announced as the radiogroup name. */
  label?: string
  /** Shared input name for the group. */
  name?: string
  /** Radio options. */
  options?: RadioOption[]
  /** Selected option value. */
  value?: string
  /** Layout direction. */
  orientation?: RadioGroupOrientation
  /** Forces a visual state for documentation. Omit for real interactivity. */
  state?: RadioGroupState
  /** Fired with the newly selected value. */
  onChange?: (value: string) => void
}

const DEFAULT_OPTIONS: RadioOption[] = [
  { label: 'Standard delivery', value: 'standard' },
  { label: 'Express delivery', value: 'express' },
  { label: 'Pickup in store', value: 'pickup' },
]

export default function RadioGroup({
  label,
  name,
  options = DEFAULT_OPTIONS,
  value,
  orientation = 'Vertical',
  state = 'Default',
  onChange,
}: RadioGroupProps) {
  const groupId = useId()
  const fieldName = name ?? groupId
  const [internal, setInternal] = useState<string | undefined>(undefined)
  const selected = value ?? internal

  const disabled = state === 'Disabled'
  const isError = state === 'Error'

  const itemState: RadioState = disabled ? 'Disabled' : isError ? 'Error' : 'Default'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && (
        <span id={`${groupId}-label`} style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</span>
      )}
      <div
        role="radiogroup"
        aria-label={label ? undefined : 'Radio group'}
        aria-labelledby={label ? `${groupId}-label` : undefined}
        style={{
          display: 'flex',
          flexDirection: orientation === 'Vertical' ? 'column' : 'row',
          gap: orientation === 'Vertical' ? 0 : 24,
        }}
      >
        {options.map((opt) => (
          <RadioButton
            key={opt.value}
            label={opt.label}
            name={fieldName}
            selected={selected === opt.value}
            state={selected === opt.value && !disabled && !isError ? 'Default' : itemState}
            onChange={() => {
              if (disabled) return
              setInternal(opt.value)
              onChange?.(opt.value)
            }}
          />
        ))}
      </div>
    </div>
  )
}
