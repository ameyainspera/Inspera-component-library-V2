import { type CSSProperties, useEffect, useId, useRef, useState } from 'react'

export type MenuPlacement = 'Bottom Start' | 'Bottom End'

export interface MenuItem {
  label: string
  icon?: string
  danger?: boolean
  disabled?: boolean
  divider?: boolean
}

export interface MenuProps {
  /** Trigger label. */
  label?: string
  /** Menu items. */
  items?: MenuItem[]
  /** Alignment to trigger. Values: Bottom Start | Bottom End. */
  placement?: MenuPlacement
  open?: boolean
  /** Open on mount. Values: true | false. */
  defaultOpen?: boolean
  /** Always render the open menu, for documentation. */
  forceVisible?: boolean
  onSelect?: (label: string) => void
}

// Sample action set with a divider before the destructive Delete item.
const sampleItems: MenuItem[] = [
  { label: 'Edit', icon: 'edit' },
  { label: 'Duplicate', icon: 'content_copy' },
  { label: '', divider: true },
  { label: 'Delete', icon: 'delete', danger: true },
]

export default function Menu({
  label = 'Actions',
  items = sampleItems,
  placement = 'Bottom Start',
  open,
  defaultOpen = false,
  forceVisible = false,
  onSelect,
}: MenuProps) {
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)
  const [internal, setInternal] = useState(defaultOpen)
  const isControlled = open !== undefined
  const isOpen = forceVisible || (isControlled ? open! : internal)
  const [active, setActive] = useState(0)

  const focusable = items
    .map((it, i) => ({ it, i }))
    .filter(({ it }) => !it.divider && !it.disabled)
    .map(({ i }) => i)

  const setOpen = (v: boolean) => {
    if (!isControlled) setInternal(v)
  }

  useEffect(() => {
    if (!isOpen || forceVisible) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [isOpen, forceVisible])

  const choose = (item: MenuItem) => {
    if (item.disabled || item.divider) return
    onSelect?.(item.label)
    setOpen(false)
  }

  const moveActive = (dir: 1 | -1) => {
    if (focusable.length === 0) return
    const pos = focusable.indexOf(active)
    const nextPos = pos === -1
      ? (dir === 1 ? 0 : focusable.length - 1)
      : (pos + dir + focusable.length) % focusable.length
    setActive(focusable[nextPos])
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (!isOpen) { setOpen(true); setActive(focusable[0] ?? 0) } else moveActive(1) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (!isOpen) { setOpen(true); setActive(focusable[focusable.length - 1] ?? 0) } else moveActive(-1) }
    else if (e.key === 'Enter' || e.key === ' ') { if (isOpen) { e.preventDefault(); choose(items[active]) } }
    else if (e.key === 'Escape') { setOpen(false) }
  }

  const trigger: CSSProperties = {
    height: 40,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '0 12px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-strong)',
    background: 'var(--white)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)',
    fontSize: 16,
    fontWeight: 500,
    cursor: 'pointer',
    boxShadow: isOpen ? '0 0 0 3px var(--primary-focus-ring)' : 'none',
    transition: 'box-shadow 120ms ease',
  }

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={`${id}-menu`}
        style={trigger}
        onClick={() => setOpen(!isOpen)}
        onKeyDown={onKeyDown}
      >
        {label}
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 20, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 140ms ease' }}
          aria-hidden
        >
          expand_more
        </span>
      </button>
      {isOpen && (
        <div
          id={`${id}-menu`}
          role="menu"
          aria-label={label}
          onKeyDown={onKeyDown}
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: placement === 'Bottom Start' ? 0 : 'auto',
            right: placement === 'Bottom End' ? 0 : 'auto',
            minWidth: 180,
            padding: 4,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-200)',
            zIndex: 20,
          }}
        >
          {items.map((item, i) => {
            if (item.divider) {
              return <div key={`d${i}`} role="separator" aria-hidden style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
            }
            const on = i === active
            const color = item.disabled
              ? 'var(--action-disabled)'
              : item.danger ? 'var(--error)' : 'var(--text-primary)'
            return (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                tabIndex={-1}
                aria-disabled={item.disabled || undefined}
                disabled={item.disabled}
                onMouseEnter={() => !item.disabled && setActive(i)}
                onClick={() => choose(item)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  background: on && !item.disabled ? 'var(--action-hover)' : 'transparent',
                  color,
                  fontFamily: 'var(--font-sans)',
                  fontSize: 16,
                  textAlign: 'left',
                  cursor: item.disabled ? 'not-allowed' : 'pointer',
                  opacity: item.disabled ? 0.6 : 1,
                  transition: 'background 120ms ease',
                }}
              >
                {item.icon && (
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>{item.icon}</span>
                )}
                {item.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
