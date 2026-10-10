import { type CSSProperties, type DragEvent, useId, useState } from 'react'
import { cx, type NativeAttrs } from './types'

export interface FileUploadProps {
  /** What to upload, e.g. "Attachments". The file input's accessible name. */
  label: string
  /** Accepted MIME types / extensions, e.g. "image/*,.pdf". Applies to drops too. */
  accept?: string
  /** Allow more than one file. A drop of several is cut to the first when false. */
  multiple?: boolean
  /** Constraint hint, e.g. "PNG, JPG or PDF up to 10MB". Replaced by errorText when `error` is set. */
  helpText?: string
  /** Validation message, shown while `error` is true. */
  errorText?: string
  /** Marks the zone invalid: red border and `aria-invalid`. */
  error?: boolean
  /** Blocks interaction and dims the zone. */
  disabled?: boolean
  /** Fired with the selected files, from both drop and browse. */
  onFiles?: (files: File[]) => void
  /** @internal Shows the drag-over look for the docs gallery. */
  forceDragging?: boolean
}

/** Does a file match an `accept` string (".pdf", "image/*", "application/pdf")? */
function accepts(file: File, accept?: string): boolean {
  if (!accept) return true
  return accept.split(',').map((a) => a.trim().toLowerCase()).some((rule) => {
    if (!rule) return false
    if (rule.startsWith('.')) return file.name.toLowerCase().endsWith(rule)
    if (rule.endsWith('/*')) return file.type.toLowerCase().startsWith(rule.slice(0, -1))
    return file.type.toLowerCase() === rule
  })
}

export default function FileUpload({
  label,
  accept,
  multiple = false,
  helpText,
  errorText,
  error = false,
  disabled = false,
  onFiles,
  forceDragging = false,
  className,
  style,
  id,
  ...rest
}: FileUploadProps & NativeAttrs<'input', FileUploadProps>) {
  const generated = useId()
  const inputId = id ?? generated
  const messageId = `${inputId}-msg`
  // Counted, not a boolean: dragleave fires every time the pointer crosses
  // into a child element, which made the highlight flicker.
  const [depth, setDepth] = useState(0)
  const isDragging = !disabled && (forceDragging || depth > 0)
  const message = error && errorText ? errorText : helpText

  const zone: CSSProperties = {
    // Anchors the visually hidden input, so focusing it never scrolls the page.
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    padding: '32px 24px',
    // The 2px dashed border and the wash come from runtime.css (.inspera-dropzone),
    // so hover and a drag can change them: a drag shows even in error.
    borderRadius: 'var(--radius-md)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    textAlign: 'center',
    fontFamily: 'var(--font-sans)',
    transition: 'all var(--duration-fast) var(--easing-standard)',
    ...style,
  }

  const emit = (list: FileList | null) => {
    if (!list || list.length === 0) return
    const files = Array.from(list).filter((f) => accepts(f, accept))
    if (files.length > 0) onFiles?.(multiple ? files : files.slice(0, 1))
  }

  const drag = (delta: number) => (e: DragEvent) => {
    if (disabled) return
    e.preventDefault()
    setDepth((d) => Math.max(0, d + delta))
  }

  return (
    // A <label> rather than a div with role="button": clicking it opens the
    // picker natively, and the file input inside stays the one focusable,
    // named control instead of an unnamed tab stop nested in a fake button.
    <label
      htmlFor={inputId}
      className={cx('inspera inspera-dropzone', className)}
      data-disabled={disabled || undefined}
      data-error={error || undefined}
      data-dragging={isDragging || undefined}
      style={zone}
      onDragEnter={drag(1)}
      onDragOver={(e) => { if (!disabled) e.preventDefault() }}
      onDragLeave={drag(-1)}
      onDrop={(e) => {
        if (disabled) return
        e.preventDefault()
        setDepth(0)
        emit(e.dataTransfer.files)
      }}
    >
      {/* Disabled dims the icon and the prompt, not the message: it usually
          says why uploading is not possible, so it stays readable. */}
      <span className="material-symbols-outlined" style={{ fontSize: 40, color: error && !isDragging ? 'var(--error)' : 'var(--primary)', opacity: disabled ? 0.6 : 1 }} aria-hidden>upload_file</span>
      <span style={{ fontSize: 16, color: 'var(--text-primary)', opacity: disabled ? 0.6 : 1 }} aria-hidden>
        Drag &amp; drop or{' '}
        {/* "browse" only looks like a link when it does something. */}
        <span style={disabled ? undefined : { color: 'var(--primary)', fontWeight: 600 }}>browse</span>
      </span>
      {message && (
        <span id={messageId} style={{ fontSize: 12, color: error ? 'var(--error)' : 'var(--muted-foreground)' }}>{message}</span>
      )}
      <input
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        aria-label={label}
        aria-describedby={message ? messageId : undefined}
        aria-invalid={error || undefined}
        onChange={(e) => {
          emit(e.target.files)
          // Reset, or choosing the same file again fires no change event.
          e.target.value = ''
        }}
        style={{ position: 'absolute', opacity: 0, width: 1, height: 1, overflow: 'hidden' }}
        {...rest}
      />
    </label>
  )
}
