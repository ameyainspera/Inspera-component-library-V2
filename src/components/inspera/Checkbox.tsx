import { type CSSProperties, useEffect, useId, useRef, useState } from 'react'

export type CheckboxState =
  | 'Default' | 'Hover' | 'Focused' | 'Pressed' | 'Disabled' | 'Error'
export type CheckboxSize = 'Small' | 'Medium'

export interface CheckboxProps {
  /** Text beside the box. Always provide one. */
  label?: string
  /** Checked state. */
  checked?: boolean
  /**
   * Partially-selected state, for a parent whose children are mixed. Wins over
   * `checked` visually and announces as `aria-checked="mixed"`.
   */
  indeterminate?: boolean
  /**
   * Freezes a visual state so documentation can show it without a pointer.
   * `Hover`, `Focused` and `Pressed` are presentation-only - leave them unset
   * in application code, where CSS drives them from the real pointer and
   * keyboard. `Error` and `Disabled` are real application state and belong in
   * your code.
   */
  state?: CheckboxState
  /** Render the label. */
  withLabel?: boolean
  /** Indicator size. */
  size?: CheckboxSize
  /** Fired with the new checked state. */
  onChange?: (checked: boolean) => void
}

export default function Checkbox({
  label = 'Checkbox label',
  checked,
  indeterminate = false,
  state = 'Default',
  withLabel = true,
  size = 'Medium',
  onChange,
}: CheckboxProps) {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  const [internal, setInternal] = useState(false)
  const isChecked = checked ?? internal

  // `indeterminate` is a DOM property, not an attribute - React cannot set it
  // from JSX, so it has to be written to the node directly.
  useEffect(() => {
    if (input.current) input.current.indeterminate = indeterminate
  }, [indeterminate])

  const disabled = state === 'Disabled'
  const isError = state === 'Error'
  const dim = size === 'Small' ? 16 : 20

  const resting = isError ? 'var(--error)' : 'var(--border-control-strong)'
  const marked = isChecked || indeterminate

  // Colours only. Hover, focus and pressed are CSS (.inspera-control in
  // runtime.css), so the box responds to a real pointer and a real Tab rather
  // than only to the `state` prop.
  const box: CSSProperties & Record<string, string | number> = {
    '--inspera-indicator-border': marked ? 'var(--primary)' : resting,
    '--inspera-indicator-bg': marked ? 'var(--primary)' : 'var(--white)',
    '--inspera-indicator-border-hover': marked || isError ? 'var(--inspera-indicator-border)' : 'var(--primary)',
    '--inspera-indicator-bg-hover': marked ? 'var(--primary)' : 'rgba(0,64,128,0.04)',
    width: dim,
    height: dim,
    borderRadius: 'var(--radius-xs)',
    borderWidth: 2,
    borderStyle: 'solid',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--white)',
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
        type="checkbox"
        checked={isChecked}
        disabled={disabled}
        ref={input}
        aria-checked={indeterminate ? 'mixed' : isChecked}
        onChange={(e) => {
          setInternal(e.target.checked)
          onChange?.(e.target.checked)
        }}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
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
