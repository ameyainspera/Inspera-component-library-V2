import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export interface Command {
  /** Stable id. */
  id: string
  /** Primary label shown in the list. */
  label: string
  /** Optional Material Symbols icon. */
  icon?: string
  /** Optional grouping heading. */
  group?: string
  /** Right-aligned hint, e.g. a shortcut or section name. */
  hint?: string
  /** Extra words to match against beyond the label. */
  keywords?: string
  /** Fired when the command is chosen. */
  onSelect?: () => void
}

export interface CommandPaletteProps {
  /** The commands to search. */
  commands?: Command[]
  /** Controlled open state. Omit to let the component manage its own. */
  open?: boolean
  /** Open initially (uncontrolled). */
  defaultOpen?: boolean
  /** Bind Cmd/Ctrl+K to toggle the palette. */
  hotkey?: boolean
  /**
   * Render the panel inline without the portal or dimmed overlay. Used by the
   * docs to show the palette on the page (and by the recipe audit, which cannot
   * see through a portal). Mirrors the `embedded` prop on Dialog and Drawer.
   */
  embedded?: boolean
  /** Search field placeholder. */
  placeholder?: string
  /** Shown when nothing matches. */
  emptyText?: string
  /** Fired when the open state should change. */
  onOpenChange?: (open: boolean) => void
  /** Fired with the chosen command. */
  onSelect?: (command: Command) => void
}

const defaultCommands: Command[] = [
  { id: 'new-test', label: 'Create new test', icon: 'add_circle', group: 'Actions', hint: 'C then T' },
  { id: 'new-qset', label: 'Create question set', icon: 'quiz', group: 'Actions' },
  { id: 'invite', label: 'Invite candidates', icon: 'group_add', group: 'Actions' },
  { id: 'go-deliver', label: 'Go to Deliver', icon: 'send', group: 'Navigate' },
  { id: 'go-monitor', label: 'Go to Monitor', icon: 'monitor_heart', group: 'Navigate' },
  { id: 'go-author', label: 'Go to Author', icon: 'edit_document', group: 'Navigate' },
  { id: 'settings', label: 'Open settings', icon: 'settings', group: 'Navigate', hint: 'G then S' },
]

export default function CommandPalette({
  commands = defaultCommands,
  open,
  defaultOpen = false,
  hotkey = true,
  embedded = false,
  placeholder = 'Type a command or search...',
  emptyText = 'No matching commands',
  onOpenChange,
  onSelect,
}: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isOpen = open ?? internalOpen
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const setOpen = (next: boolean) => {
    if (open === undefined) setInternalOpen(next)
    onOpenChange?.(next)
  }

  useEffect(() => {
    if (!hotkey) return
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(!isOpen)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [hotkey, isOpen])

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setActive(0)
      // Focus after the portal paints.
      const t = setTimeout(() => inputRef.current?.focus(), 0)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) =>
      `${c.label} ${c.keywords ?? ''} ${c.group ?? ''}`.toLowerCase().includes(q),
    )
  }, [commands, query])

  const choose = (cmd: Command) => {
    cmd.onSelect?.()
    onSelect?.(cmd)
    setOpen(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); if (filtered[active]) choose(filtered[active]) }
    else if (e.key === 'Escape') { e.preventDefault(); setOpen(false) }
  }

  // Embedded skips the portal and overlay entirely, so it renders even when
  // "closed" - the docs and the recipe audit need the panel on the page.
  if (!embedded && (!isOpen || typeof document === 'undefined')) return null

  // Group headings render inline as the list is walked, so grouped and
  // ungrouped commands share one keyboard index.
  let lastGroup: string | undefined
  const rowStyle = (i: number): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 16px',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    background: i === active ? 'var(--blue-100)' : 'transparent',
    color: 'var(--text-primary)',
    fontSize: 16,
  })

  const panel = (
      <div
        role="dialog"
        aria-modal={embedded ? undefined : 'true'}
        aria-label="Command palette"
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          width: 'min(560px, calc(100vw - 32px))',
          background: 'var(--white)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-300)',
          overflow: 'hidden',
          // Carried on the panel itself so `embedded` (no overlay) still sets it.
          fontFamily: 'var(--font-sans)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', height: 52, borderBottom: '1px solid var(--border)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--muted-foreground)' }} aria-hidden>search</span>
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded
            aria-controls="command-palette-list"
            aria-autocomplete="list"
            value={query}
            placeholder={placeholder}
            onChange={(e) => { setQuery(e.target.value); setActive(0) }}
            onKeyDown={onKeyDown}
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: 'var(--font-sans)', fontSize: 18, color: 'var(--text-primary)', minWidth: 0,
            }}
          />
          <kbd style={{ fontSize: 12, color: 'var(--muted-foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', padding: '2px 6px' }}>Esc</kbd>
        </div>

        <ul id="command-palette-list" role="listbox" style={{ listStyle: 'none', margin: 0, padding: 8, maxHeight: 360, overflowY: 'auto' }}>
          {filtered.length === 0 && (
            <li style={{ padding: '16px', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 14 }}>{emptyText}</li>
          )}
          {filtered.map((cmd, i) => {
            const showGroup = cmd.group && cmd.group !== lastGroup
            lastGroup = cmd.group
            return (
              <li key={cmd.id}>
                {showGroup && (
                  <div style={{ padding: '10px 16px 4px', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--muted-foreground)' }}>
                    {cmd.group}
                  </div>
                )}
                <div
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(cmd)}
                  style={rowStyle(i)}
                >
                  {cmd.icon && <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--action-active)' }} aria-hidden>{cmd.icon}</span>}
                  <span style={{ flex: 1 }}>{cmd.label}</span>
                  {cmd.hint && <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>{cmd.hint}</span>}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
  )

  if (embedded) return panel

  return createPortal(
    <div
      role="presentation"
      onMouseDown={() => setOpen(false)}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'var(--overlay, rgba(15, 23, 42, 0.4))',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {panel}
    </div>,
    document.body,
  )
}
