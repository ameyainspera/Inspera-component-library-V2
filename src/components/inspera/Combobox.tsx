import { type CSSProperties, useEffect, useId, useMemo, useRef, useState } from 'react'

export type ComboboxState = 'Default' | 'Focused' | 'Disabled' | 'Error'

export interface ComboboxOption {
  /** Value returned on select. */
  value: string
  /** Text shown in the list and field. Defaults to the value. */
  label?: string
  /** Optional Material Symbols icon shown before the label. */
  icon?: string
}

export interface ComboboxProps {
  /** Field label. */
  label?: string
  /** Shown when nothing is typed or selected. */
  placeholder?: string
  /** The full option list. Filtered as the user types. */
  options?: ComboboxOption[]
  /** Selected value. Controlled - pair with onChange. */
  value?: string
  /**
   * Freezes a visual state so documentation can show it without a pointer.
   * `Focused` is presentation-only. `Error` and `Disabled` are real state.
   */
  state?: ComboboxState
  /** Render the field label. */
  showLabel?: boolean
  /** Allow a typed value that matches no option to be committed. */
  allowCustomValue?: boolean
  /** Text shown when no option matches the query. */
  emptyText?: string
  /** Fired with the chosen value (or free text when allowCustomValue). */
  onChange?: (value: string) => void
}

const defaultOptions: ComboboxOption[] = [
  { value: 'algebra', label: 'Algebra Quiz', icon: 'quiz' },
  { value: 'biology', label: 'Biology Final', icon: 'science' },
  { value: 'history', label: 'History Midterm', icon: 'history_edu' },
  { value: 'physics', label: 'Physics Lab', icon: 'experiment' },
  { value: 'english', label: 'English Essay', icon: 'edit_note' },
]

const labelOf = (o: ComboboxOption) => o.label ?? o.value

export default function Combobox({
  label = 'Assessment',
  placeholder = 'Search assessments...',
  options = defaultOptions,
  value,
  state = 'Default',
  showLabel = true,
  allowCustomValue = false,
  emptyText = 'No matches',
  onChange,
}: ComboboxProps) {
  const id = useId()
  const rootRef = useRef<HTMLDivElement>(null)

  const selectedOption = useMemo(
    () => options.find((o) => o.value === value) ?? null,
    [options, value],
  )

  const [query, setQuery] = useState(selectedOption ? labelOf(selectedOption) : '')
  const [open, setOpen] = useState(state === 'Focused')
  const [active, setActive] = useState(0)

  const disabled = state === 'Disabled'
  const isError = state === 'Error'

  useEffect(() => {
    setQuery(selectedOption ? labelOf(selectedOption) : '')
  }, [selectedOption])

  useEffect(() => {
    if (state === 'Focused') setOpen(true)
  }, [state])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  // When a selection exists and the query still equals its label, show the whole
  // list so the field can be reopened without deleting text first.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q || (selectedOption && q === labelOf(selectedOption).toLowerCase())) return options
    return options.filter((o) => labelOf(o).toLowerCase().includes(q))
  }, [options, query, selectedOption])

  const commit = (opt: ComboboxOption) => {
    setQuery(labelOf(opt))
    onChange?.(opt.value)
    setOpen(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!open) setOpen(true)
      else setActive((a) => Math.min(a + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (open && filtered[active]) commit(filtered[active])
      else if (allowCustomValue && query.trim()) {
        onChange?.(query.trim())
        setOpen(false)
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

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
    opacity: disabled ? 0.6 : 1,
  }

  return (
    <div ref={rootRef} style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', position: 'relative', fontFamily: 'var(--font-sans)' }}>
      {showLabel && (
        <label htmlFor={id} style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</label>
      )}
      <div
        className="inspera-interactive inspera-field"
        data-force-state={open ? 'Open' : state === 'Focused' ? 'Focused' : undefined}
        data-invalid={isError || undefined}
        data-disabled={disabled || undefined}
        style={field}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--action-active)' }} aria-hidden>search</span>
        <input
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={open && filtered[active] ? `${id}-opt-${active}` : undefined}
          aria-invalid={isError || undefined}
          value={query}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setActive(0) }}
          onFocus={() => !disabled && setOpen(true)}
          onKeyDown={onKeyDown}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: 'var(--font-sans)', fontSize: 16, color: 'var(--text-primary)', minWidth: 0,
          }}
        />
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 20, color: 'var(--action-active)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 140ms ease', cursor: disabled ? 'not-allowed' : 'pointer' }}
          aria-hidden
          onClick={() => !disabled && setOpen((o) => !o)}
        >
          expand_more
        </span>
      </div>

      {open && !disabled && (
        <ul
          id={`${id}-list`}
          role="listbox"
          style={{
            position: 'absolute',
            top: showLabel ? 74 : 48,
            left: 0,
            right: 0,
            margin: 0,
            padding: 4,
            listStyle: 'none',
            background: 'var(--white)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-200)',
            zIndex: 20,
            maxHeight: 260,
            overflowY: 'auto',
          }}
        >
          {filtered.length === 0 && (
            <li style={{ padding: '8px 12px', color: 'var(--muted-foreground)', fontSize: 14 }}>{emptyText}</li>
          )}
          {filtered.map((opt, i) => (
            <li
              key={opt.value}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={value === opt.value}
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
                color: value === opt.value ? 'var(--primary)' : 'var(--text-primary)',
                fontWeight: value === opt.value ? 500 : 400,
              }}
            >
              {opt.icon && <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>{opt.icon}</span>}
              <span style={{ flex: 1 }}>{labelOf(opt)}</span>
              {value === opt.value && (
                <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>check</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
