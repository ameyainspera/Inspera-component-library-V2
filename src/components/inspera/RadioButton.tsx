import { type CSSProperties, useId, useState } from 'react'

export type RadioState =
  | 'Default' | 'Hover' | 'Focused' | 'Pressed' | 'Disabled' | 'Error'

export interface RadioButtonProps {
  label?: string
  /** Selected state. Values: true | false. */
  selected?: boolean
  name?: string
  /** Forces a visual state for documentation. Omit for real interactivity. */
  state?: RadioState
  /** Render the label. Values: true | false. */
  withLabel?: boolean
  onChange?: (selected: boolean) => void
}

export default function RadioButton({
  label = 'Radio option',
  selected,
  name = 'radio',
  state = 'Default',
  withLabel = true,
  onChange,
}: RadioButtonProps) {
  const id = useId()
  const [internal, setInternal] = useState(false)
  const isSelected = selected ?? internal
  const disabled = state === 'Disabled'
  const isError = state === 'Error'
  const isFocused = state === 'Focused'

  let border = isError ? 'var(--error)' : 'var(--border-control-strong)'
  if (isSelected) border = 'var(--primary)'
  else if (state === 'Hover') border = 'var(--primary)'

  const outer: CSSProperties = {
    width: 20,
    height: 20,
    borderRadius: 'var(--radius-pill)',
    border: `2px solid ${border}`,
    background: state === 'Hover' ? 'rgba(0,64,128,0.04)' : 'var(--white)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: isFocused ? '0 0 0 3px var(--primary-focus-ring)' : 'none',
    transform: state === 'Pressed' ? 'scale(0.92)' : 'none',
    transition: 'all 120ms ease',
  }

  return (
    <label
      htmlFor={id}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 0',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.38 : 1,
        color: 'var(--text-primary)',
        fontSize: 16,
      }}
    >
      <input
        id={id}
        type="radio"
        name={name}
        checked={isSelected}
        disabled={disabled}
        aria-checked={isSelected}
        onChange={() => {
          setInternal(true)
          onChange?.(true)
        }}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      />
      <span style={outer} aria-hidden>
        {isSelected && (
          <span style={{ width: 10, height: 10, borderRadius: '9999px', background: 'var(--primary)' }} />
        )}
      </span>
      {withLabel && <span>{label}</span>}
    </label>
  )
}
