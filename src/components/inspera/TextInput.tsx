import { type CSSProperties, useId, useState } from 'react'

export type TextInputState =
  | 'Default' | 'Hover' | 'Focused' | 'Disabled' | 'Error' | 'Filled' | 'ReadOnly'
export type TextInputSize = 'Small' | 'Medium'

export interface TextInputProps {
  /** Show the field label. Values: true | false. */
  label?: string
  placeholder?: string
  value?: string
  /** Forces a visual state for documentation. Omit for real interactivity. */
  state?: TextInputState
  /** Control height. Values: Small | Medium. */
  size?: TextInputSize
  /** Show a leading icon. Values: true | false. */
  leadingIcon?: string
  /** Show a trailing icon. Values: true | false. */
  trailingIcon?: string
  showLabel?: boolean
  /** Show helper text. Values: true | false. */
  helpText?: string
  /** Show error message. Values: true | false. */
  errorText?: string
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
  const [focused, setFocused] = useState(false)
  const [internal, setInternal] = useState(state === 'Filled' ? 'Jane Cooper' : '')
  const current = value ?? internal

  const disabled = state === 'Disabled'
  const readOnly = state === 'ReadOnly'
  const isError = state === 'Error'
  const isFocused = focused || state === 'Focused'

  let border = 'var(--border-control)'
  if (isError) border = 'var(--error)'
  else if (isFocused) border = 'var(--primary)'
  else if (state === 'Hover') border = 'var(--border-control-strong)'

  const height = size === 'Small' ? 32 : 40

  const field: CSSProperties = {
    height,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '0 12px',
    borderRadius: 'var(--radius-md)',
    border: `1px solid ${border}`,
    background: disabled ? 'var(--surface-disabled)' : readOnly ? 'var(--gray-100)' : 'var(--white)',
    boxShadow: isFocused ? '0 0 0 3px var(--primary-focus-ring)' : isError ? '0 0 0 3px rgba(249,184,184,0.6)' : 'none',
    transition: 'border-color 120ms ease, box-shadow 120ms ease',
    opacity: disabled ? 0.6 : 1,
  }

  const iconStyle: CSSProperties = { fontSize: 20, color: 'var(--action-active)' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      {showLabel && (
        <label htmlFor={id} style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)' }}>
          {label}
        </label>
      )}
      <div style={field}>
        {leadingIcon && <span className="material-symbols-outlined" style={iconStyle} aria-hidden>{leadingIcon}</span>}
        <input
          id={id}
          value={current}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={isError || undefined}
          aria-describedby={errorText ? `${id}-err` : helpText ? `${id}-help` : undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
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
