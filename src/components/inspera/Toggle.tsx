import { type CSSProperties, useId, useState } from 'react'

export type ToggleState = 'Default' | 'Hover' | 'Focused' | 'Disabled'
export type ToggleSize = 'Small' | 'Medium'

export interface ToggleProps {
  label?: string
  /** On / off state. Values: true | false. */
  checked?: boolean
  /** Forces a visual state for documentation. Omit for real interactivity. */
  state?: ToggleState
  /** Track / thumb size. Values: Small | Medium. */
  size?: ToggleSize
  /** Render the label. Values: true | false. */
  withLabel?: boolean
  onChange?: (checked: boolean) => void
}

export default function Toggle({
  label = 'Toggle setting',
  checked,
  state = 'Default',
  size = 'Medium',
  withLabel = true,
  onChange,
}: ToggleProps) {
  const id = useId()
  const [internal, setInternal] = useState(false)
  const isOn = checked ?? internal
  const disabled = state === 'Disabled'
  const isFocused = state === 'Focused'

  const trackW = size === 'Small' ? 36 : 44
  const trackH = size === 'Small' ? 20 : 24
  const thumb = size === 'Small' ? 16 : 20

  const track: CSSProperties = {
    width: trackW,
    height: trackH,
    borderRadius: 'var(--radius-pill)',
    background: isOn ? 'var(--primary)' : '#C4C4C4',
    padding: 2,
    display: 'inline-flex',
    alignItems: 'center',
    flexShrink: 0,
    boxShadow: isFocused ? '0 0 0 3px var(--primary-focus-ring)' : 'none',
    transition: 'background 140ms ease',
  }

  const thumbStyle: CSSProperties = {
    width: thumb,
    height: thumb,
    borderRadius: '9999px',
    background: '#FFFFFF',
    boxShadow: state === 'Hover' ? '0 1px 4px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.2)',
    transform: isOn ? `translateX(${trackW - thumb - 4}px)` : 'translateX(0)',
    transition: 'transform 160ms cubic-bezier(0.4, 0, 0.2, 1)',
  }

  return (
    <label
      htmlFor={id}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.38 : 1,
        color: 'var(--text-primary)',
        fontSize: 16,
      }}
    >
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={isOn}
        disabled={disabled}
        aria-checked={isOn}
        onChange={(e) => {
          setInternal(e.target.checked)
          onChange?.(e.target.checked)
        }}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      />
      <span style={track} aria-hidden>
        <span style={thumbStyle} />
      </span>
      {withLabel && <span>{label}</span>}
    </label>
  )
}
