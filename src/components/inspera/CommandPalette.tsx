import { type CSSProperties, type KeyboardEvent, useEffect, useId, useMemo, useRef, useState } from 'react'
import { Portal, useEscapeLayer, useScrimDismiss } from './overlay'
import { cx, type NativeAttrs } from './types'
import { useControllableState } from './useControllableState'
import { useModalBehavior } from './useModalBehavior'

export interface Command {
  /** Stable id. */
  id: string
  /** Primary label shown in the list. */
  label: string
  /** Optional Material Symbols icon. */
  icon?: string
  /** Optional grouping heading. Commands with the same group should be adjacent. */
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
  commands: Command[]
  /** Open state. Controlled - pair with onOpenChange. */
  open?: boolean
  /** Open initially, when uncontrolled. */
  defaultOpen?: boolean
  /** Fired when the open state should change. */
  onOpenChange?: (open: boolean) => void
  /** Fired with the chosen command. */
  onSelect?: (command: Command) => void
  /**
   * Bind Cmd/Ctrl+K to toggle the palette. Mount one palette with this per
   * page. Ignored while focus is in a textarea or rich-text editor, which often
   * use the same shortcut.
   */
  hotkey?: boolean
  /** Search field placeholder. */
  placeholder?: string
  /** Shown when nothing matches. */
  emptyText?: string
  /** @internal Render the panel inline, without the overlay - for documentation. */
  embedded?: boolean
}

/** Editors bind Cmd/Ctrl+K themselves (insert link); leave it to them. */
function isEditor(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null
  return Boolean(el && (el.tagName === 'TEXTAREA' || el.isContentEditable))
}

export default function CommandPalette({
  commands,
  open,
  defaultOpen = false,
  onOpenChange,
  onSelect,
  hotkey = true,
  placeholder = 'Type a command or search...',
  emptyText = 'No matching commands',
  embedded = false,
  className,
  style,
  ...rest
}: CommandPaletteProps & NativeAttrs<'div', CommandPaletteProps>) {
  const id = useId()
  const listId = `${id}-list`
  const optionId = (i: number) => `${id}-opt-${i}`
  const [isOpen, setOpen] = useControllableState(open, defaultOpen, onOpenChange)
  const modal = !embedded && isOpen
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const panel = useModalBehavior(modal)
  const scrim = useScrimDismiss(() => setOpen(false))
  useEscapeLayer(modal, () => setOpen(false))

  // Latest open state for the hotkey listener, without re-binding it.
  const openRef = useRef(isOpen)
  openRef.current = isOpen

  useEffect(() => {
    if (!hotkey || embedded) return
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'k') return
      if (e.defaultPrevented || isEditor(e.target)) return
      e.preventDefault()
      setOpen(!openRef.current)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [hotkey, embedded, setOpen])

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setActive(0)
    }
  }, [isOpen])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) =>
      `${c.label} ${c.keywords ?? ''} ${c.group ?? ''}`.toLowerCase().includes(q),
    )
  }, [commands, query])

  useEffect(() => {
    document.getElementById(optionId(active))?.scrollIntoView({ block: 'nearest' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  const choose = (cmd: Command) => {
    cmd.onSelect?.()
    onSelect?.(cmd)
    setOpen(false)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    const last = filtered.length - 1
    if (last < 0) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, last)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0) }
    else if (e.key === 'End') { e.preventDefault(); setActive(last) }
    else if (e.key === 'Enter') { e.preventDefault(); if (filtered[active]) choose(filtered[active]) }
  }

  if (!embedded && !isOpen) return null

  // Commands grouped in order, so each group is a real `role="group"` inside
  // the listbox. Headings used to sit in plain <li>s among the options.
  const groups: { name?: string; items: { cmd: Command; index: number }[] }[] = []
  filtered.forEach((cmd, index) => {
    const last = groups[groups.length - 1]
    if (last && last.name === cmd.group) last.items.push({ cmd, index })
    else groups.push({ name: cmd.group, items: [{ cmd, index }] })
  })

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

  const content = (
    <div
      ref={panel}
      tabIndex={-1}
      role="dialog"
      aria-modal={modal || undefined}
      aria-label="Command palette"
      className={cx('inspera', className)}
      style={{
        width: 'min(560px, calc(100vw - 32px))',
        background: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        border: 'var(--border-width-default) solid var(--border)',
        boxShadow: 'var(--shadow-300)',
        overflow: 'hidden',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', height: 52, borderBottom: 'var(--border-width-default) solid var(--border)' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--muted-foreground)' }} aria-hidden>search</span>
        <input
          role="combobox"
          aria-label="Search commands"
          aria-expanded
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={filtered[active] ? optionId(active) : undefined}
          value={query}
          placeholder={placeholder}
          onChange={(e) => { setQuery(e.target.value); setActive(0) }}
          onKeyDown={onKeyDown}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: 'var(--font-sans)', fontSize: 18, color: 'var(--text-primary)', minWidth: 0,
          }}
        />
        <kbd style={{ fontSize: 12, color: 'var(--muted-foreground)', border: 'var(--border-width-default) solid var(--border)', borderRadius: 'var(--radius-xs)', padding: '2px 6px' }}>Esc</kbd>
      </div>

      {/* Searching and arrowing happen in the input (aria-activedescendant),
          but a list that scrolls must also be reachable by Tab, so a keyboard
          user can scroll it directly. */}
      <div id={listId} role="listbox" aria-label="Commands" tabIndex={0} style={{ padding: 8, maxHeight: 360, overflowY: 'auto' }}>
        {groups.map((g, gi) => {
          const rows = g.items.map(({ cmd, index }) => (
            <div
              key={cmd.id}
              id={optionId(index)}
              role="option"
              aria-selected={index === active}
              onMouseEnter={() => setActive(index)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(cmd)}
              style={rowStyle(index)}
            >
              {cmd.icon && <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--action-active)' }} aria-hidden>{cmd.icon}</span>}
              <span style={{ flex: 1 }}>{cmd.label}</span>
              {cmd.hint && <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>{cmd.hint}</span>}
            </div>
          ))
          if (!g.name) return <div key={`g${gi}`}>{rows}</div>
          return (
            <div key={`g${gi}`} role="group" aria-labelledby={`${id}-g${gi}`}>
              <div id={`${id}-g${gi}`} role="presentation" style={{ padding: '10px 16px 4px', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--muted-foreground)' }}>
                {g.name}
              </div>
              {rows}
            </div>
          )
        })}
      </div>
      {filtered.length === 0 && (
        <div role="status" style={{ padding: '16px 16px 24px', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 14 }}>{emptyText}</div>
      )}
    </div>
  )

  if (embedded) return content

  return (
    <Portal>
      <div
        {...scrim}
        className="inspera"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 'var(--z-modal)',
          background: 'var(--scrim)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: '12vh',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {content}
      </div>
    </Portal>
  )
}
