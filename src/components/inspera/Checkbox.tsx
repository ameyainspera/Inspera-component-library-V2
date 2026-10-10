import { type CSSProperties, type ReactNode, useId } from 'react'
import { ControlMessage } from './FormField'
import { assignRef, cx, type ForceState, type NativeAttrs } from './types'
import { useControllableState } from './useControllableState'

/**
 * The box is one size, 18px. A Small size used to shrink only the box, not the
 * 16px label beside it, so it saved no space and drew an undersized box.
 */
const BOX = 18

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
  /** Blocks interaction and dims the control. */
  disabled?: boolean
  /** Marks the control invalid: a red border, checked or not, and `aria-invalid` on the input. */
  error?: boolean
  /**
   * A line under the label: what the option does, or why it is unavailable.
   * Shown with a visible label, and linked to the box with `aria-describedby`.
   */
  description?: ReactNode
  /** Replaces the description while `error` is set. Say what to do: "Confirm the marks to submit them." */
  errorText?: string
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
  disabled = false,
  error = false,
  description,
  errorText,
  forceState,
  className,
  style,
  id,
  ref,
  'aria-describedby': describedByProp,
  ...rest
}: CheckboxProps & NativeAttrs<'input', CheckboxProps>) {
  const generated = useId()
  const inputId = id ?? generated
  const [isChecked, setChecked] = useControllableState(checked, defaultChecked, onChange)

  // The line under the label. With the label hidden there is nothing to line
  // it up with: the row that names the option carries the text instead.
  const failing = error && Boolean(errorText)
  const message = failing ? errorText : description
  const withMessage = withLabel && message !== undefined && message !== null && message !== ''
  const messageId = `${inputId}-msg`
  const describedBy = [describedByProp, withMessage ? messageId : undefined].filter(Boolean).join(' ') || undefined

  // In error the border is red whether or not the box is checked; a checked
  // box keeps its blue fill. It used to lose the red once checked, so a group
  // in error read as some options right and some wrong, and hovering put a
  // blue tint inside a red box.
  const marked = isChecked || indeterminate
  const border = error ? 'var(--error)' : marked ? 'var(--primary)' : 'var(--border-control)'

  // Colours only. Hover, focus and pressed are CSS (.inspera-control in
  // runtime.css), so the box responds to a real pointer and a real Tab.
  const box: CSSProperties & Record<string, string | number> = {
    '--inspera-indicator-border': border,
    '--inspera-indicator-bg': marked ? 'var(--primary)' : 'var(--white)',
    '--inspera-indicator-border-hover': marked || error ? border : 'var(--primary)',
    '--inspera-indicator-bg-hover': marked ? 'var(--primary)' : error ? 'var(--error-surface)' : 'var(--primary-hover-overlay)',
    width: BOX,
    height: BOX,
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

  const control = (
    <label
      htmlFor={inputId}
      // With a message, the outer wrapper takes the consumer's class and style.
      className={cx('inspera inspera-control', withMessage ? undefined : className)}
      data-force-state={disabled ? undefined : forceState}
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
        ...(withMessage ? null : style),
      }}
    >
      <input
        id={inputId}
        type="checkbox"
        checked={isChecked}
        disabled={disabled}
        aria-label={withLabel ? undefined : label}
        aria-invalid={error || undefined}
        aria-describedby={describedBy}
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
          <span className="material-symbols-outlined" style={{ fontSize: BOX - 4, fontVariationSettings: "'wght' 600" }}>
            {indeterminate ? 'remove' : 'check'}
          </span>
        )}
      </span>
      {withLabel && <span>{label}</span>}
    </label>
  )

  if (!withMessage) return control
  return (
    <div className={cx('inspera', className)} style={{ display: 'inline-flex', flexDirection: 'column', fontFamily: 'var(--font-sans)', ...style }}>
      {control}
      {/* The label's 8px bottom padding is its hit area; -4 leaves the 4px
          label-to-message gap. The indent is the box plus its 8px gap. */}
      <ControlMessage id={messageId} error={failing} indent={BOX + 8} offset={-4}>{message}</ControlMessage>
    </div>
  )
}
