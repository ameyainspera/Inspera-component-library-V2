import { type CSSProperties, type KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'
import { FieldMessage, labelStyle, useFieldA11y } from './FormField'
import { Portal, useAnchoredPosition, useEscapeLayer, useOutsidePress } from './overlay'
import { assignRef, cx, type ForceState, type NativeAttrs } from './types'
import { useControllableState } from './useControllableState'

export interface ComboboxOption {
  /** Value returned on select. */
  value: string
  /** Text shown in the list and field. Defaults to the value. */
  label?: string
  /** Optional Material Symbols icon shown before the label. */
  icon?: string
}

export interface ComboboxProps {
  /** Field label. Always required: it is the accessible name even when hidden. */
  label: string
  /** The full option list. Filtered as the user types. */
  options: ComboboxOption[]
  /** Shown when nothing is typed or selected. */
  placeholder?: string
  /** Selected value. Controlled - pair with onChange. */
  value?: string
  /** Starting value when uncontrolled. */
  defaultValue?: string
  /** Fired with the chosen value (or the free text, with allowCustomValue). */
  onChange?: (value: string) => void
  /** Render the visible label. When false, the label becomes `aria-label`. */
  showLabel?: boolean
  /** Allow a typed value that matches no option to be committed. */
  allowCustomValue?: boolean
  /** Text shown when no option matches the query. */
  emptyText?: string
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

const labelOf = (o: ComboboxOption) => o.label ?? o.value

export default function Combobox({
  label,
  options,
  placeholder = 'Search...',
  value,
  defaultValue,
  onChange,
  showLabel = true,
  allowCustomValue = false,
  emptyText = 'No matches',
  helpText,
  errorText,
  error = false,
  disabled = false,
  forceState,
  className,
  style,
  id,
  onKeyDown,
  ref,
  ...rest
}: ComboboxProps & NativeAttrs<'input', ComboboxProps>) {
  const field = useFieldA11y({ id, label, showLabel, helpText, errorText, error })
  const listId = `${field.id}-list`
  const optionId = (i: number) => `${field.id}-opt-${i}`

  const [selected, setSelected] = useControllableState<string | undefined>(
    value,
    defaultValue,
    onChange as ((v: string | undefined) => void) | undefined,
  )
  const selectedOption = options.find((o) => o.value === selected)
  // What the field shows when not being edited: the chosen option's label, or
  // free text committed with allowCustomValue.
  const committedText = selectedOption ? labelOf(selectedOption) : (allowCustomValue ? selected ?? '' : '')

  const [query, setQuery] = useState(committedText)
  const [openState, setOpen] = useState(false)
  const frozenOpen = forceState === 'Open' && !disabled
  const open = frozenOpen || openState
  const [active, setActive] = useState(0)

  // Follow the selection when it changes - keyed on the text, not the options
  // array, so a parent re-rendering with an inline array does not wipe typing.
  useEffect(() => {
    setQuery(committedText)
  }, [committedText])

  const root = useRef<HTMLDivElement>(null)
  const box = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement | null>(null)
  const panel = useRef<HTMLDivElement>(null)
  const pos = useAnchoredPosition(openState && !frozenOpen, box, panel, { matchWidth: true })

  // With the query still equal to the selection, show the whole list so the
  // field can be reopened without deleting text first.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q || q === committedText.toLowerCase()) return options
    return options.filter((o) => labelOf(o).toLowerCase().includes(q))
  }, [options, query, committedText])

  const show = () => {
    if (disabled) return
    setActive(Math.max(0, filtered.findIndex((o) => o.value === selected)))
    setOpen(true)
  }

  /** Close, keeping only text that means something: an option, or allowed free text. */
  const settle = () => {
    setOpen(false)
    const typed = query.trim()
    if (allowCustomValue && typed && typed !== committedText) setSelected(typed)
    else setQuery(committedText)
  }

  const commit = (opt: ComboboxOption) => {
    setSelected(opt.value)
    setQuery(labelOf(opt))
    setOpen(false)
  }

  useEscapeLayer(openState, () => {
    setOpen(false)
    setQuery(committedText)
  })
  useOutsidePress(openState, [root, panel], settle)

  useEffect(() => {
    if (!open) return
    document.getElementById(optionId(active))?.scrollIntoView({ block: 'nearest' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, open])

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e)
    if (disabled || e.defaultPrevented) return
    const last = filtered.length - 1
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!openState) show()
      else setActive((a) => (e.key === 'ArrowDown' ? Math.min(a + 1, last) : Math.max(a - 1, 0)))
    } else if (e.key === 'Home' && openState) {
      e.preventDefault()
      setActive(0)
    } else if (e.key === 'End' && openState) {
      e.preventDefault()
      setActive(Math.max(last, 0))
    } else if (e.key === 'Enter') {
      if (openState && filtered[active]) {
        e.preventDefault()
        commit(filtered[active])
      } else if (allowCustomValue && query.trim()) {
        e.preventDefault()
        settle()
      }
    } else if (e.key === 'Tab' && openState) {
      settle()
    }
  }

  const fieldBox: CSSProperties = {
    height: 40,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '0 12px',
    borderRadius: 'var(--radius-sm)',
    borderWidth: 'var(--border-width-default)',
    borderStyle: 'solid',
    background: disabled ? 'var(--surface-disabled)' : 'var(--white)',
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
      // Inside the field box, so it lines up with the field's outer border.
      ? { position: 'absolute', top: 'calc(100% + 4px)', left: -1, right: -1 }
      : pos.style),
  }

  const list = (
    <div ref={panel} style={panelStyle}>
      <ul
        id={listId}
        role="listbox"
        aria-labelledby={field.ariaLabel ? undefined : field.labelId}
        aria-label={field.ariaLabel}
        style={{ margin: 0, padding: 0, listStyle: 'none', maxHeight: 260, overflowY: 'auto' }}
      >
        {filtered.map((opt, i) => {
          const isSelected = selected === opt.value
          return (
            <li
              key={opt.value}
              id={optionId(i)}
              role="option"
              aria-selected={isSelected}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => { e.preventDefault(); commit(opt) }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 16,
                cursor: 'pointer',
                background: i === active ? 'var(--blue-100)' : 'transparent',
                color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                fontWeight: isSelected ? 500 : 400,
              }}
            >
              {opt.icon && <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>{opt.icon}</span>}
              <span style={{ flex: 1 }}>{labelOf(opt)}</span>
              {isSelected && (
                <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>check</span>
              )}
            </li>
          )
        })}
      </ul>
      {filtered.length === 0 && (
        <div role="status" style={{ padding: '8px 12px', color: 'var(--muted-foreground)', fontSize: 14 }}>{emptyText}</div>
      )}
    </div>
  )

  return (
    <div
      ref={root}
      className={cx('inspera', className)}
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', width: '100%', fontFamily: 'var(--font-sans)', ...style }}
    >
      {field.ownLabel && (
        <label id={field.labelId} htmlFor={field.id} style={labelStyle}>{label}</label>
      )}
        <div
          ref={box}
          className="inspera-interactive inspera-field"
          data-force-state={open ? 'Open' : disabled ? undefined : forceState}
          data-invalid={field.invalid || undefined}
          data-disabled={disabled || undefined}
          style={{ ...fieldBox, position: 'relative' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--action-active)' }} aria-hidden>search</span>
          <input
            ref={(node) => {
              input.current = node
              assignRef(ref, node)
            }}
            id={field.id}
            role="combobox"
            aria-label={field.ariaLabel}
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            aria-autocomplete="list"
            aria-activedescendant={open && filtered[active] ? optionId(active) : undefined}
            aria-invalid={field.invalid || undefined}
            aria-describedby={field.describedBy}
            value={query}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="off"
            onChange={(e) => { setQuery(e.target.value); setActive(0); setOpen(true) }}
            onClick={() => !openState && show()}
            onKeyDown={handleKey}
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: 'var(--font-sans)', fontSize: 16, color: 'var(--text-primary)', minWidth: 0,
            }}
            {...rest}
          />
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: 20,
              color: 'var(--action-active)',
              transform: open ? 'rotate(180deg)' : 'none',
              transition: 'transform var(--duration-fast) var(--easing-standard)',
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
            aria-hidden
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              if (disabled) return
              if (openState) settle()
              else { show(); input.current?.focus() }
            }}
          >
            expand_more
          </span>
          {frozenOpen && list}
        </div>
        {!frozenOpen && openState && !disabled && <Portal>{list}</Portal>}
      <FieldMessage field={field} />
    </div>
  )
}
