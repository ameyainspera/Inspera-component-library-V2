import { type CSSProperties, type FocusEvent, useRef, useState } from 'react'
import { CalendarMonth, addMonths, formatDay, parseIso, toIso } from './calendar'
import { FieldMessage, labelStyle, useFieldA11y } from './FormField'
import { Portal, useAnchoredPosition, useEscapeLayer, useOutsidePress } from './overlay'
import { assignRef, cx, type ForceState, type NativeAttrs } from './types'
import { useControllableState } from './useControllableState'

export interface DateRange {
  /** Range start (YYYY-MM-DD). */
  start: string
  /** Range end (YYYY-MM-DD), on or after start. */
  end: string
}

export interface DateRangePickerProps {
  /** Field label. Always required: it is the accessible name even when hidden. */
  label: string
  /** Selected range. Controlled - pair with onChange. */
  value?: DateRange
  /** Starting range when uncontrolled. */
  defaultValue?: DateRange
  /** Fired with the range once both ends are chosen. */
  onChange?: (range: DateRange) => void
  /** Calendar open state. Controlled - pair with onOpenChange. */
  open?: boolean
  /** Open the calendar initially, when uncontrolled. */
  defaultOpen?: boolean
  /** Fired when the calendar opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Trigger text when no range is chosen. */
  placeholder?: string
  /** Render the visible label. When false, the label becomes `aria-label`. */
  showLabel?: boolean
  /** Guidance shown below the field. Replaced by errorText when `error` is set. */
  helpText?: string
  /** Validation message, shown while `error` is true. */
  errorText?: string
  /** Marks the field invalid: red border and errorText shown. */
  error?: boolean
  /** Blocks interaction and dims the field. */
  disabled?: boolean
  /** @internal Freezes a hover, focus or open look for the docs gallery. `Open` draws the calendar inline. */
  forceState?: ForceState
}

/** First day of the month containing `iso`. */
const monthOf = (iso: string) => {
  const d = parseIso(iso) ?? new Date()
  return toIso(new Date(d.getFullYear(), d.getMonth(), 1))
}

export default function DateRangePicker({
  label,
  value,
  defaultValue,
  onChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  placeholder = 'Select a range',
  showLabel = true,
  helpText,
  errorText,
  error = false,
  disabled = false,
  forceState,
  className,
  style,
  id,
  ref,
  ...rest
}: DateRangePickerProps & NativeAttrs<'button', DateRangePickerProps>) {
  const field = useFieldA11y({ id, label, showLabel, helpText, errorText, error })
  const [range, setRange] = useControllableState<DateRange | undefined>(
    value,
    defaultValue,
    onChange as ((r: DateRange | undefined) => void) | undefined,
  )
  const [openState, setOpenState] = useControllableState(openProp, defaultOpen, onOpenChange)
  const frozenOpen = forceState === 'Open'
  const open = !disabled && (frozenOpen || openState)

  // The first click of a new range lives here, not in `value`: a range only
  // exists once both ends are chosen. Writing half a range into controlled
  // state used to drop the click, so a controlled picker could never finish.
  const [pending, setPending] = useState<string | null>(null)
  const [focused, setFocused] = useState(range?.start ?? toIso(new Date()))
  const [viewStart, setViewStart] = useState(monthOf(focused))
  const [keyboard, setKeyboard] = useState(false)

  const trigger = useRef<HTMLButtonElement | null>(null)
  const panel = useRef<HTMLDivElement>(null)
  const live = open && !frozenOpen
  const pos = useAnchoredPosition(live, trigger, panel)

  /** Move the tab stop, scrolling the two-month view only when it leaves it. */
  const focusDay = (iso: string) => {
    setFocused(iso)
    const m = monthOf(iso)
    if (m < viewStart) setViewStart(m)
    else if (m > addMonths(viewStart, 1)) setViewStart(addMonths(m, -1))
  }

  const show = () => {
    const start = range?.start ?? toIso(new Date())
    setPending(null)
    setFocused(start)
    setViewStart(monthOf(start))
    setKeyboard(true)
    setOpenState(true)
  }
  const hide = (refocus = true) => {
    setOpenState(false)
    setPending(null)
    setKeyboard(false)
    if (refocus) trigger.current?.focus()
  }

  const pick = (iso: string) => {
    if (!pending) {
      setPending(iso)
      return
    }
    setRange(iso < pending ? { start: iso, end: pending } : { start: pending, end: iso })
    hide()
  }

  useEscapeLayer(live, () => hide())
  useOutsidePress(live, [trigger, panel], () => hide(false))

  const onPanelBlur = (e: FocusEvent) => {
    const next = e.relatedTarget as Node | null
    if (next && !panel.current?.contains(next) && next !== trigger.current) hide(false)
  }

  const dayState = (iso: string) => {
    if (pending) return { selected: iso === pending }
    if (!range) return {}
    const end = iso === range.start || iso === range.end
    return { selected: end, within: !end && iso > range.start && iso < range.end }
  }

  const box: CSSProperties = {
    width: '100%',
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
    textAlign: 'left',
    font: 'inherit',
  }

  const navBtn: CSSProperties = {
    width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    border: 'none', background: 'transparent', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text-primary)',
  }

  const months = [viewStart, addMonths(viewStart, 1)].map((iso) => parseIso(iso)!)
  const display = range ? `${formatDay(range.start)} - ${formatDay(range.end)}` : ''

  const calendar = (
    <div
      ref={panel}
      role="dialog"
      aria-label={`Choose ${label.toLowerCase()}`}
      onBlur={onPanelBlur}
      style={{
        zIndex: 'var(--z-dropdown)',
        padding: 12,
        background: 'var(--surface)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-200)',
        border: 'var(--border-width-default) solid var(--border)',
        fontFamily: 'var(--font-sans)',
        ...(frozenOpen ? { position: 'absolute', top: 'calc(100% + 4px)', left: 0 } : pos.style),
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <button type="button" className="inspera-interactive" aria-label="Previous month" style={navBtn} onClick={() => { setKeyboard(false); setViewStart(addMonths(viewStart, -1)) }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>chevron_left</span>
        </button>
        <span aria-live="polite" style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>
          {pending ? 'Choose the end date' : 'Choose the start date'}
        </span>
        <button type="button" className="inspera-interactive" aria-label="Next month" style={navBtn} onClick={() => { setKeyboard(false); setViewStart(addMonths(viewStart, 1)) }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>chevron_right</span>
        </button>
      </div>
      {/* Two months side by side; they stack when the viewport is too narrow. */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {months.map((m) => (
          <div key={m.getMonth()} style={{ width: 240 }}>
            <CalendarMonth
              showTitle
              year={m.getFullYear()}
              month={m.getMonth()}
              focused={focused}
              onFocusDay={(iso) => { setKeyboard(true); focusDay(iso) }}
              onPick={pick}
              dayState={dayState}
              autoFocus={live && keyboard}
            />
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div
      className={cx('inspera', className)}
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 6, width: '100%', fontFamily: 'var(--font-sans)', ...style }}
    >
      {field.ownLabel && (
        <label id={field.labelId} htmlFor={field.id} style={labelStyle}>{label}</label>
      )}
      <div style={{ position: 'relative' }}>
        <button
          ref={(node) => {
            trigger.current = node
            assignRef(ref, node)
          }}
          id={field.id}
          type="button"
          className="inspera-interactive inspera-field"
          data-force-state={open ? 'Open' : forceState}
          data-invalid={field.invalid || undefined}
          data-disabled={disabled || undefined}
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={field.ariaLabel ? `${field.ariaLabel}${display ? `, ${display}` : ''}` : undefined}
          aria-describedby={field.describedBy}
          onClick={() => (openState ? hide(false) : show())}
          style={box}
          {...rest}
        >
          <span style={{ flex: 1, fontSize: 16, color: display ? 'var(--text-primary)' : 'var(--text-placeholder)' }}>
            {display || placeholder}
          </span>
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--action-active)' }} aria-hidden>date_range</span>
        </button>
        {frozenOpen ? calendar : live && <Portal>{calendar}</Portal>}
      </div>
      <FieldMessage field={field} />
    </div>
  )
}
