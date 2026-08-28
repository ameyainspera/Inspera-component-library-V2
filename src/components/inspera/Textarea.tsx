import { type CSSProperties, useId, useState } from 'react'

export type TextareaState =
  | 'Default' | 'Hover' | 'Focused' | 'Filled' | 'Error' | 'Disabled' | 'ReadOnly'
export type TextareaSize = 'Small' | 'Medium'

export interface TextareaProps {
  label?: string
  placeholder?: string
  value?: string
  /** Visible text rows. */
  rows?: number
  /** Vertical padding density. Values: Small | Medium. */
  size?: TextareaSize
  /** Forces a visual state for documentation. Omit for real interactivity. */
  state?: TextareaState
  /** Show the field label. Values: true | false. */
  showLabel?: boolean
  helpText?: string
  errorText?: string
  /** Maximum character length. */
  maxLength?: number
  /** Show character counter. Values: true | false. */
  showCount?: boolean
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
  const [focused, setFocused] = useState(false)
  const [internal, setInternal] = useState(state === 'Filled' ? 'The quick brown fox jumps over the lazy dog.' : '')
  const current = value ?? internal

  const disabled = state === 'Disabled'
  const readOnly = state === 'ReadOnly'
  const isError = state === 'Error'
  const isFocused = focused || state === 'Focused'

  let border = 'var(--border-control)'
  if (isError) border = 'var(--error)'
  else if (isFocused) border = 'var(--primary)'
  else if (state === 'Hover') border = 'var(--border-control-strong)'

  const padY = size === 'Small' ? 6 : 8

  const field: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    padding: `${padY}px 12px`,
    borderRadius: 'var(--radius-md)',
    border: `1px solid ${border}`,
    background: disabled ? 'var(--surface-disabled)' : readOnly ? 'var(--gray-100)' : 'var(--white)',
    boxShadow: isFocused ? '0 0 0 3px var(--primary-focus-ring)' : isError ? '0 0 0 3px rgba(249,184,184,0.6)' : 'none',
    transition: 'border-color 120ms ease, box-shadow 120ms ease',
    opacity: disabled ? 0.6 : 1,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      {showLabel && (
        <label htmlFor={id} style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)' }}>
          {label}
        </label>
      )}
      <div style={field}>
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
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
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
