import { type CSSProperties, useEffect, useId, useRef, useState } from 'react'

export type DatePickerState = 'Default' | 'Focused' | 'Disabled' | 'Error'

export interface DatePickerProps {
  label?: string
  /** Selected date (YYYY-MM-DD). */
  value?: string
  /** Trigger placeholder. */
  placeholder?: string
  /** Forces a visual state for documentation. Omit for real interactivity. */
  state?: DatePickerState
  /** Show the field label. Values: true | false. */
  showLabel?: boolean
  /** Open the calendar initially. Values: true | false. */
  defaultOpen?: boolean
  onChange?: (iso: string) => void
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function toIso(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export default function DatePicker({
  label = 'Date',
  value,
  placeholder = 'Select date',
  state = 'Default',
  showLabel = true,
  defaultOpen = false,
  onChange,
}: DatePickerProps) {
  const id = useId()
  const [internal, setInternal] = useState<string | undefined>(value)
  const current = value ?? internal
  const [open, setOpen] = useState(defaultOpen)
  const rootRef = useRef<HTMLDivElement>(null)

  const disabled = state === 'Disabled'
  const isError = state === 'Error'
  const isFocused = state === 'Focused'

  const today = new Date()
  const initial = current ? new Date(current) : today
  const [viewY, setViewY] = useState(initial.getFullYear())
  const [viewM, setViewM] = useState(initial.getMonth())

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  let border = '#C4C4C4'
  if (isError) border = 'var(--error)'
  else if (isFocused) border = 'var(--primary)'

  const field: CSSProperties = {
    height: 40,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '0 12px',
    borderRadius: 'var(--radius-md)',
    border: `1px solid ${border}`,
    background: disabled ? '#F5F5F5' : '#FFFFFF',
    boxShadow: isFocused ? '0 0 0 3px var(--primary-focus-ring)' : isError ? '0 0 0 3px rgba(249,184,184,0.6)' : 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
  }

  const firstDay = new Date(viewY, viewM, 1).getDay()
  const daysInMonth = new Date(viewY, viewM + 1, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length < 42) cells.push(null)

  const isToday = (d: number) =>
    d === today.getDate() && viewM === today.getMonth() && viewY === today.getFullYear()
  const isSelected = (d: number) => current === toIso(viewY, viewM, d)

  const pick = (d: number) => {
    const iso = toIso(viewY, viewM, d)
    setInternal(iso)
    onChange?.(iso)
    setOpen(false)
  }

  const navBtn: CSSProperties = {
    width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    border: 'none', background: 'transparent', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text-primary)',
  }

  return (
    <div ref={rootRef} style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 280, position: 'relative' }}>
      {showLabel && (
        <label htmlFor={id} style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</label>
      )}
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-invalid={isError || undefined}
        onClick={() => setOpen((o) => !o)}
        style={{ ...field, textAlign: 'left', font: 'inherit' }}
      >
        <span style={{ flex: 1, fontSize: 16, color: current ? 'var(--text-primary)' : '#8C8C8C' }}>
          {current || placeholder}
        </span>
        <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--action-active)' }} aria-hidden>calendar_today</span>
      </button>

      {open && !disabled && (
        <div
          role="dialog"
          aria-label="Choose date"
          style={{
            position: 'absolute',
            top: showLabel ? 74 : 48,
            left: 0,
            zIndex: 20,
            width: 280,
            padding: 12,
            background: 'var(--surface)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-200)',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <button type="button" aria-label="Previous month" style={navBtn} onClick={() => {
              const m = viewM - 1
              if (m < 0) { setViewM(11); setViewY(viewY - 1) } else setViewM(m)
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>chevron_left</span>
            </button>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{MONTHS[viewM]} {viewY}</span>
            <button type="button" aria-label="Next month" style={navBtn} onClick={() => {
              const m = viewM + 1
              if (m > 11) { setViewM(0); setViewY(viewY + 1) } else setViewM(m)
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>chevron_right</span>
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {WEEKDAYS.map((w) => (
              <span key={w} style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', padding: '4px 0' }}>{w}</span>
            ))}
            {cells.map((d, i) => d === null ? (
              <span key={`e-${i}`} />
            ) : (
              <button
                key={d}
                type="button"
                aria-label={`${MONTHS[viewM]} ${d}, ${viewY}`}
                aria-pressed={isSelected(d)}
                onClick={() => pick(d)}
                style={{
                  height: 32,
                  border: isToday(d) && !isSelected(d) ? '1px solid var(--primary)' : 'none',
                  borderRadius: 'var(--radius-sm)',
                  background: isSelected(d) ? 'var(--primary)' : 'transparent',
                  color: isSelected(d) ? 'var(--white)' : 'var(--text-primary)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
