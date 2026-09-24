import { type CSSProperties, useEffect, useId, useRef } from 'react'
import { assignRef, cx, type ForceState, type NativeAttrs } from './types'
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
  /** Marks the control invalid: red ring and `aria-invalid`. */
  error?: boolean
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
  forceState,
  className,
  style,
  id,
  ref,
  ...rest
}: RadioButtonProps & NativeAttrs<'input', RadioButtonProps>) {
  const generated = useId()
  const inputId = id ?? generated
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

  const resting = isSelected
    ? 'var(--primary)'
    : error ? 'var(--error)' : 'var(--border-control-strong)'

  // Colours only. Hover, focus and pressed are CSS (.inspera-control in
  // runtime.css), so the dot responds to a real pointer and a real Tab.
  const outer: CSSProperties & Record<string, string | number> = {
    '--inspera-indicator-border': resting,
    '--inspera-indicator-bg': 'var(--white)',
    '--inspera-indicator-border-hover': isSelected || error ? resting : 'var(--primary)',
    '--inspera-indicator-bg-hover': 'var(--primary-hover-overlay)',
    width: 20,
    height: 20,
    borderRadius: 'var(--radius-pill)',
    borderWidth: 'var(--border-width-strong)',
    borderStyle: 'solid',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
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
}
