import { type CSSProperties, useId, useState } from 'react'

export type ToggleState = 'Default' | 'Hover' | 'Focused' | 'Disabled'
export type ToggleSize = 'Small' | 'Medium'

export interface ToggleProps {
  /** Text beside the switch describing the setting. */
  label?: string
  /** On / off state. */
  checked?: boolean
  /**
   * Freezes a visual state so documentation can show it without a pointer.
   * `Hover` and `Focused` are presentation-only — leave them unset in
   * application code, where CSS drives them from the real pointer and
   * keyboard. `Disabled` is real application state and belongs in your code.
   */
  state?: ToggleState
  /** Track / thumb size. */
  size?: ToggleSize
  /** Render the label. */
  withLabel?: boolean
  /** Fired with the new on/off state. */
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

  const trackW = size === 'Small' ? 36 : 44
  const trackH = size === 'Small' ? 20 : 24
  const thumb = size === 'Small' ? 16 : 20

  // The track fill is the same on and off the pointer — only the thumb lifts —
  // so both hover properties resolve to the resting value. Hover and focus are
  // CSS (.inspera-control in runtime.css).
  const fill = isOn ? 'var(--primary)' : 'var(--border-control)'
  // Only the fill: the track draws no border, so leaving the border variables
  // unset lets border-color fall back to its initial value, exactly as it does
  // for plain markup that never mentions it.
  const track: CSSProperties & Record<string, string | number> = {
    '--inspera-indicator-bg': fill,
    '--inspera-indicator-bg-hover': fill,
    width: trackW,
    height: trackH,
    borderRadius: 'var(--radius-pill)',
    padding: 2,
    display: 'inline-flex',
    alignItems: 'center',
    flexShrink: 0,
    transition: 'background 140ms ease',
  }

  const thumbStyle: CSSProperties = {
    width: thumb,
    height: thumb,
    borderRadius: '9999px',
    background: 'var(--white)',
    transform: isOn ? `translateX(${trackW - thumb - 4}px)` : 'translateX(0)',
    transition: 'transform 160ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 120ms ease',
  }

  return (
    <label
      htmlFor={id}
      className="inspera-control"
      data-force-state={state === 'Hover' || state === 'Focused' ? state : undefined}
      data-disabled={disabled || undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.38 : 1,
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-sans)',
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
      <span className="inspera-control-indicator inspera-control-track" style={track} aria-hidden>
        <span className="inspera-control-thumb" style={thumbStyle} />
      </span>
      {withLabel && <span>{label}</span>}
    </label>
  )
}
