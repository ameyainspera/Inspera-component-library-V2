import { type CSSProperties, useId } from 'react'
import { assignRef, cx, type ForceState, type NativeAttrs } from './types'
import { useControllableState } from './useControllableState'

export type CheckboxSize = 'Small' | 'Medium'

export interface CheckboxProps {
  /** Text beside the box. Required: it is the accessible name even when hidden. */
  label: string
  /** Checked state. Controlled - pair with onChange. */
  checked?: boolean
  /** Starting checked state when uncontrolled. */
  defaultChecked?: boolean
  /** Fired with the new checked state. */
  onChange?: (checked: boolean) => void
  /**
   * Partially-selected state, for a parent whose children are mixed. Wins over
   * `checked` visually and announces as mixed.
   */
  indeterminate?: boolean
  /** Render the label text. When false, the label becomes `aria-label`. */
  withLabel?: boolean
  /** Indicator size. */
  size?: CheckboxSize
  /** Blocks interaction and dims the control. */
  disabled?: boolean
  /** Marks the control invalid: red border and `aria-invalid`. */
  error?: boolean
  /** @internal Freezes a hover, focus or pressed look for the docs gallery. */
  forceState?: ForceState
}

export default function Checkbox({
  label,
  checked,
  defaultChecked = false,
  onChange,
  indeterminate = false,
  withLabel = true,
  size = 'Medium',
  disabled = false,
  error = false,
  forceState,
  className,
  style,
  id,
  ref,
  ...rest
}: CheckboxProps & NativeAttrs<'input', CheckboxProps>) {
  const generated = useId()
  const inputId = id ?? generated
  const [isChecked, setChecked] = useControllableState(checked, defaultChecked, onChange)
  const dim = size === 'Small' ? 16 : 20

  const resting = error ? 'var(--error)' : 'var(--border-control-strong)'
  const marked = isChecked || indeterminate

  // Colours only. Hover, focus and pressed are CSS (.inspera-control in
  // runtime.css), so the box responds to a real pointer and a real Tab.
  const box: CSSProperties & Record<string, string | number> = {
    '--inspera-indicator-border': marked ? 'var(--primary)' : resting,
    '--inspera-indicator-bg': marked ? 'var(--primary)' : 'var(--white)',
    '--inspera-indicator-border-hover': marked || error ? 'var(--inspera-indicator-border)' : 'var(--primary)',
    '--inspera-indicator-bg-hover': marked ? 'var(--primary)' : 'var(--primary-hover-overlay)',
    width: dim,
    height: dim,
    borderRadius: 'var(--radius-xs)',
    borderWidth: 'var(--border-width-strong)',
    borderStyle: 'solid',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--white)',
    flexShrink: 0,
    transition: 'all var(--duration-fast) var(--easing-standard)',
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
        padding: '8px 0',
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
        checked={isChecked}
        disabled={disabled}
        aria-label={withLabel ? undefined : label}
        aria-invalid={error || undefined}
        // `indeterminate` is a DOM property with no attribute, and a click
        // clears it. Writing it on every render keeps the DOM, and so what a
        // screen reader announces, in step with the prop.
        ref={(node) => {
          if (node) node.indeterminate = indeterminate
          assignRef(ref, node)
        }}
        onChange={(e) => setChecked(e.target.checked)}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
        {...rest}
      />
      <span className="inspera-control-indicator" style={box} aria-hidden>
        {marked && (
          <span className="material-symbols-outlined" style={{ fontSize: dim - 4, fontVariationSettings: "'wght' 600" }}>
            {indeterminate ? 'remove' : 'check'}
          </span>
        )}
      </span>
      {withLabel && <span>{label}</span>}
    </label>
  )
}
