import { type CSSProperties, type ReactNode, useId } from 'react'
import { ControlMessage } from './FormField'
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
  /**
   * A line under the label: what the setting does, or why it is locked. Shown
   * with a visible label, and linked to the switch with `aria-describedby`.
   */
  description?: ReactNode
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
  description,
  forceState,
  className,
  style,
  id,
  'aria-describedby': describedByProp,
  ...rest
}: ToggleProps & NativeAttrs<'input', ToggleProps>) {
  const generated = useId()
  const inputId = id ?? generated
  // The line under the label, only beside a visible label it can line up with.
  const withMessage = withLabel && description !== undefined && description !== null && description !== ''
  const messageId = `${inputId}-msg`
  const describedBy = [describedByProp, withMessage ? messageId : undefined].filter(Boolean).join(' ') || undefined
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

  const control = (
    <label
      htmlFor={inputId}
      // With a description, the outer wrapper takes the consumer's class and style.
      className={cx('inspera inspera-control', withMessage ? undefined : className)}
      data-force-state={disabled ? undefined : forceState}
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
        ...(withMessage ? null : style),
      }}
    >
      <input
        id={inputId}
        type="checkbox"
        role="switch"
        checked={isOn}
        disabled={disabled}
        aria-label={withLabel ? undefined : label}
        aria-describedby={describedBy}
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

  if (!withMessage) return control
  return (
    <div className={cx('inspera', className)} style={{ display: 'inline-flex', flexDirection: 'column', fontFamily: 'var(--font-sans)', ...style }}>
      {control}
      {/* The toggle row has no padding of its own, so the 4px gap is a plain
          margin. The indent is the track plus its 8px gap. */}
      <ControlMessage id={messageId} error={false} indent={trackW + 8} offset={4}>{description}</ControlMessage>
    </div>
  )
}
