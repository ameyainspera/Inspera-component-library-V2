import { type CSSProperties, useId, useState } from 'react'

export type RadioState =
  | 'Default' | 'Hover' | 'Focused' | 'Pressed' | 'Disabled' | 'Error'

export interface RadioButtonProps {
  /** Text beside the control. Always provide one. */
  label?: string
  /** Selected state. */
  selected?: boolean
  /**
   * Shared form name. Every radio in a group must use the same value.
   * Left unset, each radio gets its own generated name and stands alone -
   * this used to default to the literal `"radio"`, which silently put every
   * unrelated RadioButton on a page into one mutually exclusive group.
   */
  name?: string
  /**
   * Freezes a visual state so documentation can show it without a pointer.
   * `Hover`, `Focused` and `Pressed` are presentation-only - leave them unset
   * in application code, where CSS drives them from the real pointer and
   * keyboard. `Error` and `Disabled` are real application state and belong in
   * your code.
   */
  state?: RadioState
  /** Render the label. */
  withLabel?: boolean
  /** Fired when this option becomes selected. */
  onChange?: (selected: boolean) => void
}

export default function RadioButton({
  label = 'Radio option',
  selected,
  name,
  state = 'Default',
  withLabel = true,
  onChange,
}: RadioButtonProps) {
  const id = useId()
  const [internal, setInternal] = useState(false)
  const isSelected = selected ?? internal
  const disabled = state === 'Disabled'
  const isError = state === 'Error'

  const resting = isSelected
    ? 'var(--primary)'
    : isError ? 'var(--error)' : 'var(--border-control-strong)'

  // Colours only. Hover, focus and pressed are CSS (.inspera-control in
  // runtime.css), so the dot responds to a real pointer and a real Tab rather
  // than only to the `state` prop.
  const outer: CSSProperties & Record<string, string | number> = {
    '--inspera-indicator-border': resting,
    '--inspera-indicator-bg': 'var(--white)',
    '--inspera-indicator-border-hover': isSelected || isError ? resting : 'var(--primary)',
    '--inspera-indicator-bg-hover': 'rgba(0,64,128,0.04)',
    width: 20,
    height: 20,
    borderRadius: 'var(--radius-pill)',
    borderWidth: 2,
    borderStyle: 'solid',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 120ms ease',
  }

  return (
    <label
      htmlFor={id}
      className="inspera-control"
      data-force-state={state === 'Hover' || state === 'Focused' || state === 'Pressed' ? state : undefined}
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
      }}
    >
      <input
        id={id}
        type="radio"
        name={name ?? id}
        checked={isSelected}
        disabled={disabled}
        aria-checked={isSelected}
        onChange={() => {
          setInternal(true)
          onChange?.(true)
        }}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      />
      <span className="inspera-control-indicator" style={outer} aria-hidden>
        {isSelected && (
          <span style={{ width: 10, height: 10, borderRadius: '9999px', background: 'var(--primary)' }} />
        )}
      </span>
      {withLabel && <span>{label}</span>}
    </label>
  )
}
