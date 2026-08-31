import { useId, useState } from 'react'
import Checkbox, { type CheckboxState } from './Checkbox'

export type CheckboxGroupState = 'Default' | 'Disabled' | 'Error'
export type CheckboxGroupOrientation = 'Vertical' | 'Horizontal'

export interface CheckboxOption {
  label: string
  value: string
}

export interface CheckboxGroupProps {
  /** Group label, announced as the fieldset legend. */
  label?: string
  /** Checkbox options. */
  options?: CheckboxOption[]
  /** Selected option values. */
  value?: string[]
  /** Layout direction. */
  orientation?: CheckboxGroupOrientation
  /** Forces a visual state for documentation. Omit for real interactivity. */
  state?: CheckboxGroupState
  /** Fired with the full array of selected values. */
  onChange?: (value: string[]) => void
}

const DEFAULT_OPTIONS: CheckboxOption[] = [
  { label: 'Email notifications', value: 'email' },
  { label: 'SMS notifications', value: 'sms' },
  { label: 'Push notifications', value: 'push' },
]

export default function CheckboxGroup({
  label,
  options = DEFAULT_OPTIONS,
  value,
  orientation = 'Vertical',
  state = 'Default',
  onChange,
}: CheckboxGroupProps) {
  const groupId = useId()
  const [internal, setInternal] = useState<string[]>([])
  const selected = value ?? internal

  const disabled = state === 'Disabled'
  const isError = state === 'Error'

  const toggle = (v: string) => {
    if (disabled) return
    const next = selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v]
    setInternal(next)
    onChange?.(next)
  }

  return (
    <div
      role="group"
      aria-labelledby={label ? `${groupId}-label` : undefined}
      aria-label={label ? undefined : 'Checkbox group'}
      style={{ display: 'flex', flexDirection: 'column', gap: 4, fontFamily: 'var(--font-sans)' }}
    >
      {label && (
        <span id={`${groupId}-label`} style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</span>
      )}
      <div
        style={{
          display: 'flex',
          flexDirection: orientation === 'Vertical' ? 'column' : 'row',
          gap: orientation === 'Vertical' ? 0 : 24,
        }}
      >
        {options.map((opt) => {
          const checked = selected.includes(opt.value)
          const itemState: CheckboxState = disabled ? 'Disabled' : isError ? 'Error' : 'Default'
          return (
            <Checkbox
              key={opt.value}
              label={opt.label}
              checked={checked}
              state={itemState}
              onChange={() => toggle(opt.value)}
            />
          )
        })}
      </div>
    </div>
  )
}
