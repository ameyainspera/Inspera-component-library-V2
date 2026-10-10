import { type CSSProperties, type KeyboardEvent, useEffect, useRef, useState } from 'react'
import { FieldMessage, labelStyle, useFieldA11y } from './FormField'
import { Portal, useAnchoredPosition, useEscapeLayer, useOutsidePress } from './overlay'
import { assignRef, cx, type ForceState, type NativeAttrs } from './types'
import { useControllableState } from './useControllableState'

export type SelectWidthMode = 'Fixed' | 'Hug'

export interface SelectOption {
  value: string
  /** Shown text. Defaults to `value`. */
  label?: string
}

export interface SelectProps {
  /** Field label. Always required: it is the accessible name even when hidden. */
  label: string
  /** The choices, in display order. Plain strings when value and label match. */
  options: (string | SelectOption)[]
  /** Shown when nothing is selected. Not a substitute for the label. */
  placeholder?: string
  /** Selected value. Controlled - pair with onChange. */
  value?: string
  /** Starting value when uncontrolled. */
  defaultValue?: string
  /** Fired with the selected value. */
  onChange?: (value: string) => void
  /** `Fixed` is 220px wide; `Hug` fits the selected text. */
  widthMode?: SelectWidthMode
  /** Render the visible label. When false, the label becomes `aria-label`. */
  showLabel?: boolean
  /** Adds a filter box at the top of the list. */
  search?: boolean
  /** Guidance shown below the field. Replaced by errorText when `error` is set. */
  helpText?: string
  /** Validation message, shown while `error` is true. */
  errorText?: string
  /** Marks the field invalid: red border, `aria-invalid`, errorText shown. */
  error?: boolean
  /** Blocks interaction and dims the field. */
  disabled?: boolean
  /** @internal Freezes a hover, focus or open look for the docs gallery. `Open` draws the list inline. */
  forceState?: ForceState
}

const normalise = (o: string | SelectOption) =>
  typeof o === 'string' ? { value: o, label: o } : { value: o.value, label: o.label ?? o.value }

export default function Select({
  label,
  options,
  placeholder = 'Select an option',
  value,
  defaultValue,
  onChange,
  widthMode = 'Fixed',
  showLabel = true,
  search = false,
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
}: SelectProps & NativeAttrs<'div', SelectProps>) {
  const field = useFieldA11y({ id, label, showLabel, helpText, errorText, error })
  const listId = `${field.id}-list`
  const optionId = (i: number) => `${field.id}-opt-${i}`

  const items = options.map(normalise)
  const [selected, setSelected] = useControllableState<string | undefined>(
    value,
    defaultValue,
    onChange as ((v: string | undefined) => void) | undefined,
  )
  const [openState, setOpen] = useState(false)
  const frozenOpen = forceState === 'Open' && !disabled
  const open = frozenOpen || openState
  const [active, setActive] = useState(0)
  const [query, setQuery] = useState('')
  const typed = useRef({ text: '', at: 0 })

  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLDivElement | null>(null)
  const panel = useRef<HTMLDivElement>(null)
  const pos = useAnchoredPosition(openState && !frozenOpen, trigger, panel, { matchWidth: true })

  const filtered = search && query
    ? items.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : items
  const current = items.find((o) => o.value === selected)

  // Opening lands on the selected option, not wherever the pointer last was.
  const show = () => {
    if (disabled) return
    setQuery('')
    setActive(Math.max(0, items.findIndex((o) => o.value === selected)))
    setOpen(true)
  }
  const hide = (refocus = true) => {
    setOpen(false)
    setQuery('')
    if (refocus) trigger.current?.focus()
  }
  const choose = (i: number) => {
    const opt = filtered[i]
    if (!opt) return
    setSelected(opt.value)
    hide()
  }

  useEscapeLayer(openState, () => hide())
  useOutsidePress(openState, [root, panel], () => hide(false))

  // Keep the active option in view while arrowing through a long list.
  useEffect(() => {
    if (!open) return
    document.getElementById(optionId(active))?.scrollIntoView({ block: 'nearest' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, open])

  /** Arrow, Home, End and Enter - shared by the trigger and the search box. */
  const navigate = (e: KeyboardEvent) => {
    const last = filtered.length - 1
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, last)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0) }
    else if (e.key === 'End') { e.preventDefault(); setActive(Math.max(last, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); choose(active) }
    else if (e.key === 'Tab') hide(false)
    else return false
    return true
  }

  const onTriggerKey = (e: KeyboardEvent) => {
    if (disabled) return
    if (!openState) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        show()
      }
      return
    }
    if (navigate(e)) return
    if (e.key === ' ') { e.preventDefault(); choose(active); return }
    // Type-ahead: letters typed in quick succession jump to the first match.
    if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const now = Date.now()
      typed.current.text = (now - typed.current.at < 600 ? typed.current.text : '') + e.key.toLowerCase()
      typed.current.at = now
      const hit = filtered.findIndex((o) => o.label.toLowerCase().startsWith(typed.current.text))
      if (hit !== -1) setActive(hit)
    }
  }

  // Border and ring live in CSS (.inspera-field in runtime.css) so the trigger
  // reacts to a real pointer and a real Tab.
  const box: CSSProperties = {
    height: 40,
    width: widthMode === 'Fixed' ? 220 : 'auto',
    minWidth: 120,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    padding: '0 12px',
    borderRadius: 'var(--radius-sm)',
    borderWidth: 'var(--border-width-default)',
    borderStyle: 'solid',
    background: disabled ? 'var(--surface-disabled)' : 'var(--white)',
    color: current ? 'var(--text-primary)' : 'var(--text-placeholder)',
    fontFamily: 'var(--font-sans)',
    fontSize: 16,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
  }

  const panelStyle: CSSProperties = {
    margin: 0,
    padding: 4,
    background: 'var(--white)',
    border: 'var(--border-width-default) solid var(--border-strong)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-200)',
    zIndex: 'var(--z-dropdown)',
    fontFamily: 'var(--font-sans)',
    ...(frozenOpen
      ? { position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0 }
      : pos.style),
  }

  const list = (
    <div ref={panel} style={panelStyle}>
      {search && (
        <div style={{ padding: 4 }}>
          <input
            autoFocus={!frozenOpen}
            value={query}
            placeholder="Search..."
            aria-label={`Filter ${label}`}
            aria-controls={listId}
            aria-activedescendant={filtered[active] ? optionId(active) : undefined}
            onChange={(e) => { setQuery(e.target.value); setActive(0) }}
            onKeyDown={(e) => { navigate(e) }}
            style={{
              width: '100%', height: 32, padding: '0 8px',
              border: 'var(--border-width-default) solid var(--border)', borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-sans)', fontSize: 14, outline: 'none',
            }}
          />
        </div>
      )}
      <ul
        id={listId}
        role="listbox"
        aria-labelledby={field.ariaLabel ? undefined : field.labelId}
        aria-label={field.ariaLabel}
        style={{ margin: 0, padding: 0, listStyle: 'none', maxHeight: 240, overflowY: 'auto' }}
      >
        {filtered.map((opt, i) => {
          const isSelected = opt.value === selected
          return (
            <li
              key={opt.value}
              id={optionId(i)}
              role="option"
              aria-selected={isSelected}
              onMouseEnter={() => setActive(i)}
              // Keep focus on the trigger (or search box) while clicking.
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(i)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 16,
                cursor: 'pointer',
                background: i === active ? 'var(--blue-100)' : 'transparent',
                color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                fontWeight: isSelected ? 500 : 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {opt.label}
              {isSelected && (
                <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>check</span>
              )}
            </li>
          )
        })}
      </ul>
      {filtered.length === 0 && (
        <div role="status" style={{ padding: '8px 12px', color: 'var(--muted-foreground)', fontSize: 14 }}>No matches</div>
      )}
    </div>
  )

  return (
    <div
      className={cx('inspera', className)}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', width: widthMode === 'Fixed' ? 220 : 'auto', fontFamily: 'var(--font-sans)', ...style }}
    >
      {field.ownLabel && (
        <span id={field.labelId} style={labelStyle}>{label}</span>
      )}
      <div ref={root} style={{ position: 'relative' }}>
        <div
          ref={(node) => {
            trigger.current = node
            assignRef(ref, node)
          }}
          id={field.id}
          className="inspera-interactive inspera-field"
          // An open list keeps the focus ring even while the search box inside
          // it holds focus, so Open counts as a focused look.
          data-force-state={open ? 'Open' : disabled ? undefined : forceState}
          data-invalid={field.invalid || undefined}
          data-disabled={disabled || undefined}
          role="combobox"
          // A <label for> cannot name a div, so the label is referenced by id -
          // Select's own, or the surrounding FormField's.
          aria-labelledby={field.ariaLabel ? undefined : field.labelId}
          aria-label={field.ariaLabel}
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-haspopup="listbox"
          aria-activedescendant={open && !search && filtered[active] ? optionId(active) : undefined}
          aria-invalid={field.invalid || undefined}
          aria-describedby={field.describedBy}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : 0}
          style={box}
          onClick={() => (openState ? hide() : show())}
          onKeyDown={onTriggerKey}
          {...rest}
        >
          <span>{current?.label ?? placeholder}</span>
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 20, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-fast) var(--easing-standard)' }}
            aria-hidden
          >
            expand_more
          </span>
        </div>
        {frozenOpen ? list : openState && <Portal>{list}</Portal>}
      </div>
      <FieldMessage field={field} />
    </div>
  )
}
