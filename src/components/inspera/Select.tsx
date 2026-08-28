import { type CSSProperties, useEffect, useId, useRef, useState } from 'react'

export type SelectState =
  | 'Default' | 'Hover' | 'Focused' | 'Disabled' | 'Error' | 'Open'
export type SelectWidthMode = 'Fixed' | 'Content Adaptable'

export interface SelectProps {
  /** Render the label. Values: true | false. */
  label?: string
  placeholder?: string
  options?: string[]
  value?: string
  /** Forces a visual state for documentation. Omit for real interactivity. */
  state?: SelectState
  /** Trigger sizing. Values: Fixed | Content Adaptable. */
  widthMode?: SelectWidthMode
  showLabel?: boolean
  /** Filterable option list. Values: true | false. */
  search?: boolean
  onChange?: (value: string) => void
}

const defaultOptions = ['Norway', 'Sweden', 'Denmark', 'Finland', 'Iceland']

export default function Select({
  label = 'Country',
  placeholder = 'Select an option',
  options = defaultOptions,
  value,
  state = 'Default',
  widthMode = 'Fixed',
  showLabel = true,
  search = false,
  onChange,
}: SelectProps) {
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(state === 'Open')
  const [selected, setSelected] = useState<string | null>(value ?? null)
  const [active, setActive] = useState(0)
  const [query, setQuery] = useState('')

  const disabled = state === 'Disabled'
  const isError = state === 'Error'
  const forcedFocus = state === 'Focused' || state === 'Open'

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const filtered = search && query
    ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : options

  let border = isError ? 'var(--error)' : 'var(--border-control)'
  if (open || forcedFocus) border = 'var(--primary)'
  else if (state === 'Hover') border = 'var(--border-control-strong)'

  const choose = (opt: string) => {
    setSelected(opt)
    onChange?.(opt)
    setOpen(false)
    setQuery('')
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return
    if (e.key === 'ArrowDown') { e.preventDefault(); if (!open) setOpen(true); else setActive((a) => Math.min(a + 1, filtered.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); if (open && filtered[active]) choose(filtered[active]); else setOpen(true) }
    else if (e.key === 'Escape') setOpen(false)
  }

  const trigger: CSSProperties = {
    height: 40,
    width: widthMode === 'Fixed' ? 220 : 'auto',
    minWidth: 120,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    padding: '0 12px',
    borderRadius: 'var(--radius-md)',
    border: `1px solid ${border}`,
    background: disabled ? 'var(--surface-disabled)' : 'var(--white)',
    color: selected ? 'var(--text-primary)' : 'var(--muted-foreground)',
    fontFamily: 'var(--font-sans)',
    fontSize: 16,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    boxShadow: open || forcedFocus ? '0 0 0 3px var(--primary-focus-ring)' : 'none',
    transition: 'border-color 120ms ease, box-shadow 120ms ease',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: widthMode === 'Fixed' ? 220 : 'auto' }}>
      {showLabel && (
        <label htmlFor={id} style={{ fontSize: 16, fontWeight: 500 }}>{label}</label>
      )}
      <div ref={ref} style={{ position: 'relative' }}>
        <div
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-haspopup="listbox"
          tabIndex={disabled ? -1 : 0}
          style={trigger}
          onClick={() => !disabled && setOpen((o) => !o)}
          onKeyDown={onKeyDown}
        >
          <span>{selected ?? placeholder}</span>
          <span className="material-symbols-outlined" style={{ fontSize: 20, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 140ms ease' }} aria-hidden>
            expand_more
          </span>
        </div>
        {open && (
          <ul
            id={`${id}-list`}
            role="listbox"
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
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
              maxHeight: 240,
              overflowY: 'auto',
            }}
          >
            {search && (
              <li style={{ padding: 4 }}>
                <input
                  autoFocus
                  value={query}
                  placeholder="Search…"
                  onChange={(e) => { setQuery(e.target.value); setActive(0) }}
                  style={{
                    width: '100%', boxSizing: 'border-box', height: 32, padding: '0 8px',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                    fontFamily: 'var(--font-sans)', fontSize: 14, outline: 'none',
                  }}
                />
              </li>
            )}
            {filtered.length === 0 && (
              <li style={{ padding: '8px 12px', color: 'var(--muted-foreground)', fontSize: 14 }}>No matches</li>
            )}
            {filtered.map((opt, i) => (
              <li
                key={opt}
                role="option"
                aria-selected={selected === opt}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(opt)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 16,
                  cursor: 'pointer',
                  background: i === active ? 'var(--blue-100)' : 'transparent',
                  color: selected === opt ? 'var(--primary)' : 'var(--text-primary)',
                  fontWeight: selected === opt ? 500 : 400,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {opt}
                {selected === opt && (
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>check</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
