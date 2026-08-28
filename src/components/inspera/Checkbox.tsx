import { type CSSProperties, useId, useState } from 'react'

export type CheckboxState =
  | 'Default' | 'Hover' | 'Focused' | 'Pressed' | 'Disabled' | 'Error'
export type CheckboxSize = 'Small' | 'Medium'

export interface CheckboxProps {
  label?: string
  checked?: boolean
  /** Forces a visual state for documentation. Omit for real interactivity. */
  state?: CheckboxState
  withLabel?: boolean
  size?: CheckboxSize
  onChange?: (checked: boolean) => void
}

export default function Checkbox({
  label = 'Checkbox label',
  checked,
  state = 'Default',
  withLabel = true,
  size = 'Medium',
  onChange,
}: CheckboxProps) {
  const id = useId()
  const [internal, setInternal] = useState(false)
  const isChecked = checked ?? internal
  const disabled = state === 'Disabled'
  const isError = state === 'Error'
  const isFocused = state === 'Focused'
  const dim = size === 'Small' ? 16 : 20

  let border = isError ? 'var(--error)' : '#8C8C8C'
  if (state === 'Hover') border = 'var(--primary)'

  const box: CSSProperties = {
    width: dim,
    height: dim,
    borderRadius: 'var(--radius-xs)',
    border: `2px solid ${isChecked ? 'var(--primary)' : border}`,
    background: isChecked ? 'var(--primary)' : state === 'Hover' ? 'rgba(0,64,128,0.04)' : '#FFFFFF',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
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
        type="checkbox"
        checked={isChecked}
        disabled={disabled}
        aria-checked={isChecked}
        onChange={(e) => {
          setInternal(e.target.checked)
          onChange?.(e.target.checked)
        }}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      />
      <span style={box} aria-hidden>
        {isChecked && (
          <span className="material-symbols-outlined" style={{ fontSize: dim - 4, fontVariationSettings: "'wght' 600" }}>
            check
          </span>
        )}
      </span>
      {withLabel && <span>{label}</span>}
    </label>
  )
}
