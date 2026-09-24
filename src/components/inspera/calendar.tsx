import { type CSSProperties, type KeyboardEvent, useEffect, useRef } from 'react'

export const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export function toIso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/**
 * A YYYY-MM-DD string as a *local* date. `new Date('2026-08-01')` parses as
 * UTC midnight, which anywhere west of UTC is the evening of the day before -
 * so the calendar opened on the previous month.
 */
export function parseIso(iso: string | null | undefined): Date | null {
  if (!iso) return null
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

export function addDays(iso: string, n: number): string {
  const d = parseIso(iso) ?? new Date()
  d.setDate(d.getDate() + n)
  return toIso(d)
}

/** Same day of the month, n months away, clamped to the month's length. */
export function addMonths(iso: string, n: number): string {
  const d = parseIso(iso) ?? new Date()
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1)
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate()
  target.setDate(Math.min(d.getDate(), last))
  return toIso(target)
}

export function formatDay(iso: string | null | undefined): string {
  const d = parseIso(iso)
  return d ? `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}` : ''
}

export interface DayState {
  selected?: boolean
  /** Between the ends of a range. */
  within?: boolean
}

/**
 * One month of day buttons with grid keyboard navigation: arrows move a day
 * or a week, Home/End jump to the week's edges, PageUp/PageDown change month.
 * Only the focused day is a tab stop, so the calendar costs one Tab, not 31.
 */
export function CalendarMonth({
  year, month, focused, onFocusDay, onPick, dayState, autoFocus, showTitle = false,
}: {
  year: number
  month: number
  /** The day that holds the roving tab stop (YYYY-MM-DD). */
  focused: string
  onFocusDay: (iso: string) => void
  onPick: (iso: string) => void
  dayState: (iso: string) => DayState
  /** Move DOM focus to the focused day whenever it changes. */
  autoFocus: boolean
  showTitle?: boolean
}) {
  const grid = useRef<HTMLDivElement>(null)
  const today = toIso(new Date())

  useEffect(() => {
    if (!autoFocus) return
    grid.current?.querySelector<HTMLButtonElement>(`[data-iso="${focused}"]`)?.focus()
  }, [focused, autoFocus])

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, iso: string) => {
    const d = parseIso(iso)!
    const moves: Record<string, () => string> = {
      ArrowLeft: () => addDays(iso, -1),
      ArrowRight: () => addDays(iso, 1),
      ArrowUp: () => addDays(iso, -7),
      ArrowDown: () => addDays(iso, 7),
      Home: () => addDays(iso, -d.getDay()),
      End: () => addDays(iso, 6 - d.getDay()),
      PageUp: () => addMonths(iso, e.shiftKey ? -12 : -1),
      PageDown: () => addMonths(iso, e.shiftKey ? 12 : 1),
    }
    const move = moves[e.key]
    if (!move) return
    e.preventDefault()
    onFocusDay(move())
  }

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div>
      {showTitle && (
        <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
          {MONTHS[month]} {year}
        </div>
      )}
      <div ref={grid} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {WEEKDAYS.map((w) => (
          <span key={w} aria-hidden style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', padding: '4px 0' }}>{w}</span>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <span key={`e-${i}`} />
          const iso = toIso(new Date(year, month, d))
          const { selected, within } = dayState(iso)
          const isToday = iso === today
          const style: CSSProperties = {
            height: 32,
            border: isToday && !selected ? 'var(--border-width-default) solid var(--primary)' : 'none',
            borderRadius: 'var(--radius-sm)',
            background: selected ? 'var(--primary)' : within ? 'var(--blue-100)' : 'transparent',
            color: selected ? 'var(--white)' : 'var(--text-primary)',
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            cursor: 'pointer',
          }
          return (
            <button
              key={d}
              type="button"
              className="inspera-interactive"
              data-iso={iso}
              tabIndex={iso === focused ? 0 : -1}
              aria-label={`${MONTHS[month]} ${d}, ${year}`}
              aria-pressed={selected || within || false}
              aria-current={isToday ? 'date' : undefined}
              onClick={() => onPick(iso)}
              onKeyDown={(e) => onKey(e, iso)}
              style={style}
            >
              {d}
            </button>
          )
        })}
      </div>
    </div>
  )
}
