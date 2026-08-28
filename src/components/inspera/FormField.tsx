import { type ReactNode, useId } from 'react'

export interface FormFieldProps {
  label?: string
  htmlFor?: string
  required?: boolean
  helpText?: string
  errorText?: string
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 280 }}>
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
