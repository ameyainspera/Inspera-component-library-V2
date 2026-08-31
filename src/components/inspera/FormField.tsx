import { type ReactNode, useId } from 'react'

export interface FormFieldProps {
  /** Field label text. */
  label?: string
  /** id of the wrapped control for label association. */
  htmlFor?: string
  /** Show a required asterisk. */
  required?: boolean
  /** Helper text shown below the control. */
  helpText?: string
  /** Error message; replaces help text when present. */
  errorText?: string
  /** The control this field wraps. Exactly one. */
  children: ReactNode
}

export default function FormField({
  label,
  htmlFor,
  required = false,
  helpText,
  errorText,
  children,
}: FormFieldProps) {
  const fallbackId = useId()
  const helpId = `${fallbackId}-help`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', fontFamily: 'var(--font-sans)' }}>
      {label && (
        <label htmlFor={htmlFor} style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)' }}>
          {label}
          {required && (
            <span style={{ color: 'var(--error)', marginLeft: 2 }} aria-hidden>*</span>
          )}
        </label>
      )}
      {children}
      {errorText ? (
        <span id={helpId} style={{ fontSize: 12, color: 'var(--error)' }}>{errorText}</span>
      ) : helpText ? (
        <span id={helpId} style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{helpText}</span>
      ) : null}
    </div>
  )
}
