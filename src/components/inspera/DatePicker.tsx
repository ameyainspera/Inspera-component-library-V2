import { type CSSProperties, type FocusEvent, useRef, useState } from 'react'
import { CalendarMonth, MONTHS, addMonths, parseIso, toIso } from './calendar'
import { FieldMessage, labelStyle, useFieldA11y } from './FormField'
import { Portal, useAnchoredPosition, useEscapeLayer, useOutsidePress } from './overlay'
import { assignRef, cx, type ForceState, type NativeAttrs } from './types'
import { useControllableState } from './useControllableState'

export interface DatePickerProps {
  /** Field label. Always required: it is the accessible name even when hidden. */
  label: string
  /** Selected date (YYYY-MM-DD). Controlled - pair with onChange. */
  value?: string
  /** Starting date when uncontrolled (YYYY-MM-DD). */
  defaultValue?: string
  /** Fired with the selected date as an ISO string (YYYY-MM-DD). */
  onChange?: (iso: string) => void
  /** Calendar open state. Controlled - pair with onOpenChange. */
  open?: boolean
  /** Open the calendar initially, when uncontrolled. */
  defaultOpen?: boolean
  /** Fired when the calendar opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Trigger text when no date is chosen. */
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

export default function DatePicker({
  label,
  value,
  defaultValue,
  onChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  placeholder = 'Select date',
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
}: DatePickerProps & NativeAttrs<'button', DatePickerProps>) {
  const field = useFieldA11y({ id, label, showLabel, helpText, errorText, error })
  const [current, setCurrent] = useControllableState<string | undefined>(
    value,
    defaultValue,
    onChange as ((v: string | undefined) => void) | undefined,
  )
  const [openState, setOpenState] = useControllableState(openProp, defaultOpen, onOpenChange)
  const frozenOpen = forceState === 'Open'
  const open = !disabled && (frozenOpen || openState)

  // The day holding the calendar's single tab stop. It also decides which
  // month is on screen, so the view always follows the selection.
  const [focused, setFocused] = useState(current ?? toIso(new Date()))
  const [keyboard, setKeyboard] = useState(false)
  const view = parseIso(focused) ?? new Date()

  const trigger = useRef<HTMLButtonElement | null>(null)
  const panel = useRef<HTMLDivElement>(null)
  const live = open && !frozenOpen
  const pos = useAnchoredPosition(live, trigger, panel)

  const show = () => {
    setFocused(current ?? toIso(new Date()))
    setKeyboard(true)
    setOpenState(true)
  }
  const hide = (refocus = true) => {
    setOpenState(false)
    setKeyboard(false)
    if (refocus) trigger.current?.focus()
  }
  const pick = (iso: string) => {
    setCurrent(iso)
    hide()
  }

  useEscapeLayer(live, () => hide())
  useOutsidePress(live, [trigger, panel], () => hide(false))

  // Tabbing out of the calendar closes it, like any popup the user has left.
  const onPanelBlur = (e: FocusEvent) => {
    const next = e.relatedTarget as Node | null
    if (next && !panel.current?.contains(next) && next !== trigger.current) hide(false)
  }

  // Border and ring live in CSS (.inspera-field in runtime.css) so the trigger
  // reacts to a real pointer and a real Tab.
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

  const calendar = (
    <div
      ref={panel}
      role="dialog"
      aria-label={`Choose ${label.toLowerCase()}`}
      onBlur={onPanelBlur}
      style={{
        zIndex: 'var(--z-dropdown)',
        width: 280,
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
        <button type="button" className="inspera-interactive" aria-label="Previous month" style={navBtn} onClick={() => { setKeyboard(false); setFocused(addMonths(focused, -1)) }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>chevron_left</span>
        </button>
        <span aria-live="polite" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
          {MONTHS[view.getMonth()]} {view.getFullYear()}
        </span>
        <button type="button" className="inspera-interactive" aria-label="Next month" style={navBtn} onClick={() => { setKeyboard(false); setFocused(addMonths(focused, 1)) }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>chevron_right</span>
        </button>
      </div>
      <CalendarMonth
        year={view.getFullYear()}
        month={view.getMonth()}
        focused={focused}
        onFocusDay={(iso) => { setKeyboard(true); setFocused(iso) }}
        onPick={pick}
        dayState={(iso) => ({ selected: iso === current })}
        autoFocus={live && keyboard}
      />
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
          aria-label={field.ariaLabel ? `${field.ariaLabel}${current ? `, ${current}` : ''}` : undefined}
          aria-describedby={field.describedBy}
          onClick={() => (openState ? hide(false) : show())}
          style={box}
          {...rest}
        >
          <span style={{ flex: 1, fontSize: 16, color: current ? 'var(--text-primary)' : 'var(--text-placeholder)' }}>
            {current || placeholder}
          </span>
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--action-active)' }} aria-hidden>calendar_today</span>
        </button>
        {frozenOpen ? calendar : live && <Portal>{calendar}</Portal>}
      </div>
      <FieldMessage field={field} />
    </div>
  )
}
