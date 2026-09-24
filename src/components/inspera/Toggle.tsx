import { type CSSProperties, useId } from 'react'
import { cx, type ForceState, type NativeAttrs } from './types'
import { useControllableState } from './useControllableState'

export type ToggleSize = 'Small' | 'Medium'

export interface ToggleProps {
  /** Text describing the setting. Required: it is the accessible name even when hidden. */
  label: string
  /** On / off state. Controlled - pair with onChange. */
  checked?: boolean
  /** Starting state when uncontrolled. */
  defaultChecked?: boolean
  /** Fired with the new on/off state. */
  onChange?: (checked: boolean) => void
  /** Track / thumb size. */
  size?: ToggleSize
  /** Render the label text. When false, the label becomes `aria-label`. */
  withLabel?: boolean
  /** Blocks interaction and dims the control. */
  disabled?: boolean
  /** @internal Freezes a hover or focus look for the docs gallery. */
  forceState?: ForceState
}

export default function Toggle({
  label,
  checked,
  defaultChecked = false,
  onChange,
  size = 'Medium',
  withLabel = true,
  disabled = false,
  forceState,
  className,
  style,
  id,
  ...rest
}: ToggleProps & NativeAttrs<'input', ToggleProps>) {
  const generated = useId()
  const inputId = id ?? generated
  const [isOn, setOn] = useControllableState(checked, defaultChecked, onChange)

  const trackW = size === 'Small' ? 36 : 44
  const trackH = size === 'Small' ? 20 : 24
  const thumb = size === 'Small' ? 16 : 20

  // The track fill is the same on and off the pointer - only the thumb lifts -
  // so both hover properties resolve to the resting value. Hover and focus are
  // CSS (.inspera-control in runtime.css).
  const fill = isOn ? 'var(--primary)' : 'var(--border-control)'
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
    transition: 'background var(--duration-fast) var(--easing-standard)',
  }

  const thumbStyle: CSSProperties = {
    width: thumb,
    height: thumb,
    borderRadius: 'var(--radius-pill)',
    background: 'var(--white)',
    // Travel = track width - thumb - the 2px padding on each side.
    transform: isOn ? `translateX(${trackW - thumb - 4}px)` : 'translateX(0)',
    transition: 'transform var(--duration-normal) var(--easing-standard), box-shadow var(--duration-fast) var(--easing-standard)',
  }

  return (
    <label
      htmlFor={inputId}
      className={cx('inspera inspera-control', className)}
      data-force-state={forceState}
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
        ...style,
      }}
    >
      <input
        id={inputId}
        type="checkbox"
        role="switch"
        checked={isOn}
        disabled={disabled}
        aria-label={withLabel ? undefined : label}
        onChange={(e) => setOn(e.target.checked)}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
        {...rest}
      />
      <span className="inspera-control-indicator inspera-control-track" style={track} aria-hidden>
        <span className="inspera-control-thumb" style={thumbStyle} />
      </span>
      {withLabel && <span>{label}</span>}
    </label>
  )
}
