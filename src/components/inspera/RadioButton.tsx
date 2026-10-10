import { type CSSProperties, type ReactNode, useEffect, useId, useRef } from 'react'
import { ControlMessage } from './FormField'
import { assignRef, cx, type ForceState, type NativeAttrs } from './types'

/** The ring's size. A circle needs 2px more than the 18px checkbox to look as large. */
const RING = 20
import { useControllableState } from './useControllableState'

export interface RadioButtonProps {
  /** Text beside the control. Required: it is the accessible name even when hidden. */
  label: string
  /** Selected state. Controlled - pair with onChange. */
  selected?: boolean
  /** Starting selected state when uncontrolled. */
  defaultSelected?: boolean
  /** Fired when this option becomes selected. */
  onChange?: (selected: boolean) => void
  /**
   * Shared form name. Every radio in a group must use the same value. Left
   * unset, each radio gets its own generated name and stands alone.
   */
  name?: string
  /** Render the label text. When false, the label becomes `aria-label`. */
  withLabel?: boolean
  /** Blocks interaction and dims the control. */
  disabled?: boolean
  /** Marks the control invalid: a red ring, selected or not, and `aria-invalid` on the input. */
  error?: boolean
  /**
   * A line under the label: what the option means, or why it is unavailable.
   * Shown with a visible label, and linked to the radio with `aria-describedby`.
   * An error belongs to the group (Radio Group's `errorText`), not to one option.
   */
  description?: ReactNode
  /** @internal Freezes a hover, focus or pressed look for the docs gallery. */
  forceState?: ForceState
}

export default function RadioButton({
  label,
  selected,
  defaultSelected = false,
  onChange,
  name,
  withLabel = true,
  disabled = false,
  error = false,
  description,
  forceState,
  className,
  style,
  id,
  ref,
  'aria-describedby': describedByProp,
  ...rest
}: RadioButtonProps & NativeAttrs<'input', RadioButtonProps>) {
  const generated = useId()
  const inputId = id ?? generated
  // The line under the label, only beside a visible label it can line up with.
  const withMessage = withLabel && description !== undefined && description !== null && description !== ''
  const messageId = `${inputId}-msg`
  const describedBy = [describedByProp, withMessage ? messageId : undefined].filter(Boolean).join(' ') || undefined
  const groupName = name ?? inputId
  const input = useRef<HTMLInputElement | null>(null)
  const controlled = selected !== undefined
  const [isSelected, setSelected] = useControllableState(selected, defaultSelected, onChange)

  // Choosing another radio in the same group never fires a change event on
  // this one, so an uncontrolled radio kept drawing its dot after it had been
  // deselected - several dots at once. Listen for the group and follow the DOM.
  useEffect(() => {
    if (controlled) return
    const onGroupChange = (e: Event) => {
      const t = e.target as HTMLInputElement
      if (t !== input.current && t.type === 'radio' && t.name === groupName && input.current) {
        setSelected(input.current.checked)
      }
    }
    document.addEventListener('change', onGroupChange)
    return () => document.removeEventListener('change', onGroupChange)
  }, [controlled, groupName, setSelected])

  // In error the ring is red whether or not the radio is selected; the dot
  // stays blue. A selected radio used to lose the red, so a group in error
  // read as one right option among wrong ones.
  const ring = error ? 'var(--error)' : isSelected ? 'var(--primary)' : 'var(--border-control)'

  // Colours only. Hover, focus and pressed are CSS (.inspera-control in
  // runtime.css), so the dot responds to a real pointer and a real Tab.
  const outer: CSSProperties & Record<string, string | number> = {
    '--inspera-indicator-border': ring,
    '--inspera-indicator-bg': 'var(--white)',
    '--inspera-indicator-border-hover': isSelected || error ? ring : 'var(--primary)',
    '--inspera-indicator-bg-hover': error ? 'var(--error-surface)' : 'var(--primary-hover-overlay)',
    width: RING,
    height: RING,
    borderRadius: 'var(--radius-pill)',
    borderWidth: 'var(--border-width-strong)',
    borderStyle: 'solid',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all var(--duration-fast) var(--easing-standard)',
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
        ref={(node) => {
          input.current = node
          assignRef(ref, node)
        }}
        type="radio"
        name={groupName}
        checked={isSelected}
        disabled={disabled}
        aria-label={withLabel ? undefined : label}
        aria-invalid={error || undefined}
        aria-describedby={describedBy}
        onChange={() => setSelected(true)}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
        {...rest}
      />
      <span className="inspera-control-indicator" style={outer} aria-hidden>
        {isSelected && (
          <span style={{ width: 10, height: 10, borderRadius: 'var(--radius-pill)', background: 'var(--primary)' }} />
        )}
      </span>
      {withLabel && <span>{label}</span>}
    </label>
  )

  if (!withMessage) return control
  return (
    <div className={cx('inspera', className)} style={{ display: 'inline-flex', flexDirection: 'column', fontFamily: 'var(--font-sans)', ...style }}>
      {control}
      {/* -4 leaves 4px under the label's padded row; the indent is the ring plus its gap. */}
      <ControlMessage id={messageId} error={false} indent={RING + 8} offset={-4}>{description}</ControlMessage>
    </div>
  )
}
