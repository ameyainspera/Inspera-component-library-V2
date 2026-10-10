import { type CSSProperties, type ReactNode, createContext, useContext, useId } from 'react'
import { cx, type NativeAttrs } from './types'

export interface FormFieldProps {
  /** Field label text. */
  label: string
  /**
   * Only needed to wrap a control that is not from this library. Inspera
   * controls pick up the field's id, description and error state on their own.
   */
  htmlFor?: string
  /** Show a required asterisk and mark the control required. */
  required?: boolean
  /** Helper text shown below the control. */
  helpText?: string
  /** Error message; replaces help text and marks the control invalid. */
  errorText?: string
  /** The control this field wraps. Exactly one. */
  children: ReactNode
}

/**
 * What a FormField hands to the control inside it. Without this the field's
 * label, help text and error were decoration: the control had no id to point
 * the label at and no way to learn the description or error.
 */
interface FormFieldContextValue {
  id: string
  messageId: string
  hasMessage: boolean
  invalid: boolean
  required: boolean
}

const FormFieldContext = createContext<FormFieldContextValue | null>(null)

/** Shared by every labelled field: TextInput, Textarea, Select, and the rest. */
export const labelStyle: CSSProperties = {
  fontSize: 16,
  fontWeight: 500,
  color: 'var(--text-primary)',
}

export interface FieldA11y {
  /** Put on the focusable control. */
  id: string
  labelId: string
  /** Render the component's own visible label. False inside a FormField, which draws it. */
  ownLabel: boolean
  /** `aria-label` for the control when no visible label names it. */
  ariaLabel?: string
  /** Only set when the message it points at is actually rendered. */
  describedBy?: string
  invalid: boolean
  required: boolean
  /** The message the component renders itself; empty inside a FormField. */
  message?: { id: string; text: string; error: boolean }
}

/**
 * The label, description and validity wiring for one field.
 *
 * Standalone, the field names itself (visible label, or `aria-label` when the
 * label is hidden) and renders its own help or error text. Inside a FormField
 * it defers all of that to the field, so there is exactly one label and one
 * message.
 */
export function useFieldA11y(opts: {
  id?: string
  label: string
  showLabel: boolean
  helpText?: string
  errorText?: string
  error: boolean
  required?: boolean
}): FieldA11y {
  const ctx = useContext(FormFieldContext)
  const generated = useId()

  if (ctx) {
    return {
      id: opts.id ?? ctx.id,
      labelId: `${ctx.id}-label`,
      ownLabel: false,
      describedBy: ctx.hasMessage ? ctx.messageId : undefined,
      invalid: opts.error || ctx.invalid,
      required: Boolean(opts.required) || ctx.required,
    }
  }

  const id = opts.id ?? generated
  const text = opts.error && opts.errorText ? opts.errorText : opts.helpText
  const message = text ? { id: `${id}-msg`, text, error: Boolean(opts.error && opts.errorText) } : undefined
  return {
    id,
    labelId: `${id}-label`,
    ownLabel: opts.showLabel,
    ariaLabel: opts.showLabel ? undefined : opts.label,
    describedBy: message?.id,
    invalid: opts.error,
    required: Boolean(opts.required),
    message,
  }
}

/** Help or error text under a field. Renders nothing when there is none. */
export function FieldMessage({ field }: { field: FieldA11y }) {
  if (!field.message) return null
  return (
    <span
      id={field.message.id}
      style={{ fontSize: 12, color: field.message.error ? 'var(--error)' : 'var(--muted-foreground)' }}
    >
      {field.message.text}
    </span>
  )
}

/**
 * The line under a checkbox, radio button or toggle label: its description, or
 * its error. It starts where the label text starts (`indent` is the indicator
 * plus its 8px gap) and sits 4px under it, the label-to-message spacing of
 * every field. It is never dimmed with a disabled control: it often says why.
 */
export function ControlMessage({ id, children, error, indent, offset }: {
  id: string
  children: ReactNode
  error: boolean
  /** The indicator's width plus its gap, so the line starts under the label text. */
  indent: number
  /** Pulls the line up into the label's own vertical padding. */
  offset: number
}) {
  return (
    <span
      id={id}
      style={{
        display: 'block',
        marginTop: offset,
        paddingLeft: indent,
        fontSize: 12,
        lineHeight: 1.4,
        color: error ? 'var(--error)' : 'var(--muted-foreground)',
      }}
    >
      {children}
    </span>
  )
}

export default function FormField({
  label,
  htmlFor,
  required = false,
  helpText,
  errorText,
  children,
  className,
  style,
  ...rest
}: FormFieldProps & NativeAttrs<'div', FormFieldProps>) {
  const base = useId()
  const id = htmlFor ?? `${base}-control`
  const messageId = `${base}-msg`
  const message = errorText ?? helpText

  return (
    <FormFieldContext.Provider
      value={{ id, messageId, hasMessage: Boolean(message), invalid: Boolean(errorText), required }}
    >
      <div
        className={cx('inspera', className)}
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', width: '100%', fontFamily: 'var(--font-sans)', ...style }}
        {...rest}
      >
        <label id={`${id}-label`} htmlFor={id} style={labelStyle}>
          {label}
          {required && (
            <span style={{ color: 'var(--error)', marginLeft: 2 }} aria-hidden>*</span>
          )}
        </label>
        {children}
        {message && (
          <span id={messageId} style={{ fontSize: 12, color: errorText ? 'var(--error)' : 'var(--muted-foreground)' }}>
            {message}
          </span>
        )}
      </div>
    </FormFieldContext.Provider>
  )
}
