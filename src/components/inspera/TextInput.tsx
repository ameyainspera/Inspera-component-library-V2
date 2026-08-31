import { type CSSProperties, useEffect, useId, useState } from 'react'

export type TextInputState =
  | 'Default' | 'Hover' | 'Focused' | 'Disabled' | 'Error' | 'Filled' | 'ReadOnly'
export type TextInputSize = 'Small' | 'Medium'

export interface TextInputProps {
  /** Show the field label. */
  label?: string
  /** Hint shown when empty. Not a substitute for the label. */
  placeholder?: string
  /** Current value. Controlled — pair with onChange. */
  value?: string
  /**
   * Freezes a visual state so documentation can show it without a pointer.
   * `Hover`, `Focused` and `Filled` are presentation-only — leave them unset in
   * application code, where CSS drives them from the real pointer and keyboard.
   * `Error`, `Disabled` and `ReadOnly` are real application state and belong in
   * your code.
   */
  state?: TextInputState
  /** Control height. */
  size?: TextInputSize
  /** Show a leading icon. */
  leadingIcon?: string
  /** Show a trailing icon. */
  trailingIcon?: string
  /** Render the visible label. Hiding it still requires an accessible name. */
  showLabel?: boolean
  /** Show helper text. */
  helpText?: string
  /** Show error message. */
  errorText?: string
  /** Fired with the new value on every keystroke. */
  onChange?: (value: string) => void
}

export default function TextInput({
  label = 'Label',
  placeholder = 'Placeholder text',
  value,
  state = 'Default',
  size = 'Medium',
  leadingIcon,
  trailingIcon,
  showLabel = true,
  helpText,
  errorText,
  onChange,
}: TextInputProps) {
  const id = useId()
  const [internal, setInternal] = useState(state === 'Filled' ? 'Jane Cooper' : '')
  const current = value ?? internal

  // `state="Filled"` has to be an effect, not just a useState initializer: the
  // docs playground swaps the prop on a live instance rather than remounting
  // it, and an initializer only ever runs once — so the control showed an
  // empty field. Only seeds the sample text; typing still wins afterwards.
  useEffect(() => {
    if (state === 'Filled') setInternal('Jane Cooper')
  }, [state])

  const disabled = state === 'Disabled'
  const readOnly = state === 'ReadOnly'
  const isError = state === 'Error'


  const height = size === 'Small' ? 32 : 40

  const field: CSSProperties = {
    height,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '0 12px',
    borderRadius: 'var(--radius-md)',
    borderWidth: 'var(--border-width-default)',
    borderStyle: 'solid',
    background: disabled ? 'var(--surface-disabled)' : readOnly ? 'var(--gray-100)' : 'var(--white)',
    opacity: disabled ? 0.6 : 1,
  }

  const iconStyle: CSSProperties = { fontSize: 20, color: 'var(--action-active)' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', fontFamily: 'var(--font-sans)' }}>
      {showLabel && (
        <label htmlFor={id} style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)' }}>
          {label}
        </label>
      )}
      <div
        className="inspera-interactive inspera-field"
        data-force-state={state && state !== 'Default' ? state : undefined}
        data-invalid={isError || undefined}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        style={field}
      >
        {leadingIcon && <span className="material-symbols-outlined" style={iconStyle} aria-hidden>{leadingIcon}</span>}
        <input
          id={id}
          value={current}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={isError || undefined}
          aria-describedby={errorText ? `${id}-err` : helpText ? `${id}-help` : undefined}
          onChange={(e) => {
            setInternal(e.target.value)
            onChange?.(e.target.value)
          }}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: 'var(--font-sans)',
            fontSize: 16,
            color: 'var(--text-primary)',
            minWidth: 0,
          }}
        />
        {trailingIcon && <span className="material-symbols-outlined" style={iconStyle} aria-hidden>{trailingIcon}</span>}
      </div>
      {isError && errorText && (
        <span id={`${id}-err`} style={{ fontSize: 12, color: 'var(--error)' }}>{errorText}</span>
      )}
      {!isError && helpText && (
        <span id={`${id}-help`} style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{helpText}</span>
      )}
    </div>
  )
}
