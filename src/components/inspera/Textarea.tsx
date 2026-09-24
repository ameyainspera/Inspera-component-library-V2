import { type CSSProperties, useEffect, useId, useState } from 'react'

export type TextareaState =
  | 'Default' | 'Hover' | 'Focused' | 'Filled' | 'Error' | 'Disabled' | 'ReadOnly'
export type TextareaSize = 'Small' | 'Medium'

export interface TextareaProps {
  /** Field label. */
  label?: string
  /** Hint shown when empty. Not a substitute for the label. */
  placeholder?: string
  /** Current value. Controlled - pair with onChange. */
  value?: string
  /** Visible text rows. */
  rows?: number
  /** Vertical padding density. */
  size?: TextareaSize
  /**
   * Freezes a visual state so documentation can show it without a pointer.
   * `Hover`, `Focused` and `Filled` are presentation-only - leave them unset in
   * application code, where CSS drives them from the real pointer and keyboard.
   * `Error`, `Disabled` and `ReadOnly` are real application state and belong in
   * your code.
   */
  state?: TextareaState
  /** Show the field label. */
  showLabel?: boolean
  /** Guidance shown below the field. Replaced by errorText when invalid. */
  helpText?: string
  /** Validation message. Linked to the control via aria-describedby. */
  errorText?: string
  /** Maximum character length. */
  maxLength?: number
  /** Show character counter. */
  showCount?: boolean
  /** Fired with the new value on every keystroke. */
  onChange?: (value: string) => void
}

export default function Textarea({
  label = 'Description',
  placeholder = 'Placeholder text',
  value,
  rows = 4,
  size = 'Medium',
  state = 'Default',
  showLabel = true,
  helpText,
  errorText,
  maxLength,
  showCount = false,
  onChange,
}: TextareaProps) {
  const id = useId()
  const [internal, setInternal] = useState(state === 'Filled' ? 'The quick brown fox jumps over the lazy dog.' : '')
  const current = value ?? internal

  // `state="Filled"` has to be an effect, not just a useState initializer: the
  // docs playground swaps the prop on a live instance rather than remounting
  // it, and an initializer only ever runs once - so the control showed an
  // empty field. Only seeds the sample text; typing still wins afterwards.
  useEffect(() => {
    if (state === 'Filled') setInternal('The quick brown fox jumps over the lazy dog.')
  }, [state])

  const disabled = state === 'Disabled'
  const readOnly = state === 'ReadOnly'
  const isError = state === 'Error'


  const padY = size === 'Small' ? 6 : 8

  const field: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    padding: `${padY}px 12px`,
    borderRadius: 'var(--radius-md)',
    borderWidth: 'var(--border-width-default)',
    borderStyle: 'solid',
    background: disabled ? 'var(--surface-disabled)' : readOnly ? 'var(--gray-100)' : 'var(--white)',
    opacity: disabled ? 0.6 : 1,
  }

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
        <textarea
          id={id}
          value={current}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          aria-invalid={isError || undefined}
          aria-describedby={errorText ? `${id}-err` : helpText ? `${id}-help` : undefined}
          onChange={(e) => {
            setInternal(e.target.value)
            onChange?.(e.target.value)
          }}
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            resize: 'vertical',
            fontFamily: 'var(--font-sans)',
            fontSize: 16,
            color: 'var(--text-primary)',
            minWidth: 0,
            width: '100%',
          }}
        />
        {showCount && (
          <span style={{ alignSelf: 'flex-end', fontSize: 12, color: 'var(--muted-foreground)', marginTop: 4 }}>
            {current.length}{maxLength ? `/${maxLength}` : ''}
          </span>
        )}
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
