import { type CSSProperties, useId, useRef, useState } from 'react'

export type FileUploadState = 'Default' | 'Dragging' | 'Disabled' | 'Error'

export interface FileUploadProps {
  label?: string
  /** Accepted MIME types / extensions. */
  accept?: string
  /** Allow multiple files. Values: true | false. */
  multiple?: boolean
  /** Forces a visual state for documentation. Omit for real interactivity. */
  state?: FileUploadState
  /** Constraint hint text. */
  helpText?: string
  onFiles?: (files: File[]) => void
}

export default function FileUpload({
  label = 'Upload files',
  accept,
  multiple = false,
  state = 'Default',
  helpText = 'PNG, JPG or PDF up to 10MB',
  onFiles,
}: FileUploadProps) {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const disabled = state === 'Disabled'
  const isError = state === 'Error'
  const isDragging = dragging || state === 'Dragging'

  let border = 'var(--gray-400)'
  let background = 'var(--surface)'
  if (isError) border = 'var(--error)'
  else if (isDragging) { border = 'var(--primary)'; background = 'var(--blue-100)' }

  const zone: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: 320,
    padding: '32px 24px',
    border: `2px dashed ${border}`,
    borderRadius: 'var(--radius-md)',
    background,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    textAlign: 'center',
    transition: 'all 120ms ease',
  }

  const emit = (list: FileList | null) => {
    if (!list) return
    onFiles?.(Array.from(list))
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      aria-disabled={disabled || undefined}
      style={zone}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => {
        if (disabled) return
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click() }
      }}
      onDragOver={(e) => { if (!disabled) { e.preventDefault(); setDragging(true) } }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        if (disabled) return
        e.preventDefault()
        setDragging(false)
        emit(e.dataTransfer.files)
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 40, color: isError ? 'var(--error)' : 'var(--primary)' }} aria-hidden>upload_file</span>
      <div style={{ fontSize: 16, color: 'var(--text-primary)' }}>
        Drag &amp; drop or{' '}
        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>browse</span>
      </div>
      {helpText && (
        <span style={{ fontSize: 12, color: isError ? 'var(--error)' : 'var(--muted-foreground)' }}>{helpText}</span>
      )}
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => emit(e.target.files)}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      />
    </div>
  )
}
