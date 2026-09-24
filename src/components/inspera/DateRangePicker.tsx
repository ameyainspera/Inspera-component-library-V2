import { type CSSProperties, useEffect, useId, useRef, useState } from 'react'

export type DateRangePickerState = 'Default' | 'Focused' | 'Disabled' | 'Error'

export interface DateRange {
  /** Range start (YYYY-MM-DD) or null. */
  start: string | null
  /** Range end (YYYY-MM-DD) or null. */
  end: string | null
}

export interface DateRangePickerProps {
  /** Field label. */
  label?: string
  /** Selected range. Controlled - pair with onChange. */
  value?: DateRange
  /** Trigger placeholder. */
  placeholder?: string
  /**
   * Freezes a visual state so documentation can show it without a pointer.
   * `Focused` is presentation-only. `Error` and `Disabled` are real state.
   */
  state?: DateRangePickerState
  /** Show the field label. */
  showLabel?: boolean
  /** Open the calendar initially. */
  defaultOpen?: boolean
  /** Fired with the range once both ends are chosen. */
  onChange?: (range: DateRange) => void
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function toIso(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function fmt(iso: string | null) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${MONTHS[m - 1].slice(0, 3)} ${y}`
}

export default function DateRangePicker({
  label = 'Date range',
  value,
  placeholder = 'Select a range',
  state = 'Default',
  showLabel = true,
  defaultOpen = false,
  onChange,
}: DateRangePickerProps) {
  const id = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [internal, setInternal] = useState<DateRange>(value ?? { start: null, end: null })
  const range = value ?? internal
  const [open, setOpen] = useState(defaultOpen)

  const disabled = state === 'Disabled'
  const isError = state === 'Error'

  useEffect(() => { setOpen(defaultOpen) }, [defaultOpen])

  const base = range.start ? new Date(range.start) : new Date()
  const [viewY, setViewY] = useState(base.getFullYear())
  const [viewM, setViewM] = useState(base.getMonth())

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const setRange = (next: DateRange) => {
    if (!value) setInternal(next)
    if (next.start && next.end) onChange?.(next)
  }

  const pick = (iso: string) => {
    // First click starts a new range; second click closes it (ordered).
    if (!range.start || (range.start && range.end)) {
      setRange({ start: iso, end: null })
    } else {
      if (iso < range.start) setRange({ start: iso, end: range.start })
      else setRange({ start: range.start, end: iso })
      setOpen(false)
    }
  }

  const inRange = (iso: string) =>
    range.start && range.end && iso >= range.start && iso <= range.end
  const isEnd = (iso: string) => iso === range.start || iso === range.end

  const field: CSSProperties = {
    height: 40,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '0 12px',
    borderRadius: 'var(--radius-md)',
    borderWidth: 'var(--border-width-default)',
    borderStyle: 'solid',
    background: disabled ? 'var(--surface-disabled)' : 'var(--white)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
  }

  const navBtn: CSSProperties = {
    width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    border: 'none', background: 'transparent', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text-primary)',
  }

  function renderMonth(y: number, m: number) {
    const firstDay = new Date(y, m, 1).getDay()
    const daysInMonth = new Date(y, m + 1, 0).getDate()
    const cells: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)

    return (
      <div style={{ width: 240 }}>
        <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
          {MONTHS[m]} {y}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
          {WEEKDAYS.map((w) => (
            <span key={w} style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', padding: '4px 0' }}>{w}</span>
          ))}
          {cells.map((d, i) => {
            if (d === null) return <span key={`e-${i}`} />
            const iso = toIso(y, m, d)
            const end = isEnd(iso)
            const within = inRange(iso)
            return (
              <button
                key={d}
                type="button"
                aria-label={`${MONTHS[m]} ${d}, ${y}`}
                aria-pressed={end || undefined}
                onClick={() => pick(iso)}
                style={{
                  height: 32,
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  background: end ? 'var(--primary)' : within ? 'var(--blue-100)' : 'transparent',
                  color: end ? 'var(--white)' : 'var(--text-primary)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                {d}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const nextM = viewM === 11 ? 0 : viewM + 1
  const nextY = viewM === 11 ? viewY + 1 : viewY

  const display = range.start
    ? `${fmt(range.start)} - ${range.end ? fmt(range.end) : '...'}`
    : ''

  return (
    <div ref={rootRef} style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', position: 'relative', fontFamily: 'var(--font-sans)' }}>
      {showLabel && (
        <label htmlFor={id} style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</label>
      )}
      <button
        id={id}
        type="button"
        className="inspera-interactive inspera-field"
        data-force-state={open ? 'Open' : state === 'Focused' ? 'Focused' : undefined}
        data-invalid={isError || undefined}
        data-disabled={disabled || undefined}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-invalid={isError || undefined}
        onClick={() => setOpen((o) => !o)}
        style={{ ...field, textAlign: 'left', font: 'inherit' }}
      >
        <span style={{ flex: 1, fontSize: 16, color: display ? 'var(--text-primary)' : 'var(--text-placeholder)' }}>
          {display || placeholder}
        </span>
        <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--action-active)' }} aria-hidden>date_range</span>
      </button>

      {open && !disabled && (
        <div
          role="dialog"
          aria-label="Choose date range"
          style={{
            position: 'absolute',
            top: showLabel ? 74 : 48,
            left: 0,
            zIndex: 20,
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
            <button type="button" aria-label="Next month" style={navBtn} onClick={() => {
              const m = viewM + 1
              if (m > 11) { setViewM(0); setViewY(viewY + 1) } else setViewM(m)
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>chevron_right</span>
            </button>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            {renderMonth(viewY, viewM)}
            {renderMonth(nextY, nextM)}
          </div>
        </div>
      )}
    </div>
  )
}
