import { type CSSProperties, type KeyboardEvent, useEffect, useId, useRef, useState } from 'react'
import { Portal, useAnchoredPosition, useEscapeLayer, useOutsidePress } from './overlay'
import { assignRef, cx, type NativeAttrs } from './types'
import { useControllableState } from './useControllableState'

export type MenuPlacement = 'BottomStart' | 'BottomEnd'

export interface MenuItem {
  label: string
  /** Passed to onSelect. Defaults to the label. */
  value?: string
  icon?: string
  /** Red text, for destructive actions. Put these last, after a divider. */
  danger?: boolean
  disabled?: boolean
  /** A separator line instead of an item; `label` is ignored. */
  divider?: boolean
  /** Fired when this item is chosen, before the menu-level onSelect. */
  onSelect?: () => void
}

export interface MenuProps {
  /** Trigger text. Pass `aria-label` too when the text alone is ambiguous, e.g. per-row "Actions". */
  label: string
  /** Menu items, in order. */
  items: MenuItem[]
  /** Aligns the menu to the trigger's start or end edge. */
  placement?: MenuPlacement
  /** Open state. Controlled - pair with onOpenChange. */
  open?: boolean
  /** Open on mount, when uncontrolled. */
  defaultOpen?: boolean
  /** Fired when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Fired with the chosen item's value (its label, unless set). */
  onSelect?: (value: string, item: MenuItem) => void
  /** @internal Draw the open menu inline, always - for documentation. */
  forceVisible?: boolean
}

export default function Menu({
  label,
  items,
  placement = 'BottomStart',
  open,
  defaultOpen = false,
  onOpenChange,
  onSelect,
  forceVisible = false,
  className,
  style,
  ref,
  ...rest
}: MenuProps & NativeAttrs<'button', MenuProps>) {
  const id = useId()
  const menuId = `${id}-menu`
  const [isOpenState, setOpen] = useControllableState(open, defaultOpen, onOpenChange)
  const live = isOpenState && !forceVisible
  const isOpen = forceVisible || isOpenState

  const [active, setActive] = useState(-1)
  const typed = useRef({ text: '', at: 0 })
  const trigger = useRef<HTMLButtonElement | null>(null)
  const panel = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const pos = useAnchoredPosition(live, trigger, panel, { align: placement === 'BottomEnd' ? 'end' : 'start' })

  const enabled = items.map((it, i) => (!it.divider && !it.disabled ? i : -1)).filter((i) => i !== -1)

  const openAt = (index: number) => {
    setActive(index)
    setOpen(true)
  }
  const close = (refocus = true) => {
    setOpen(false)
    setActive(-1)
    if (refocus) trigger.current?.focus()
  }

  useEscapeLayer(live, () => close())
  useOutsidePress(live, [trigger, panel], () => close(false))

  // Focus follows the active item, so a screen reader announces each one.
  // Moving only a highlight left assistive tech on the trigger, hearing nothing.
  useEffect(() => {
    if (live && active >= 0) itemRefs.current[active]?.focus()
  }, [live, active])

  const choose = (item: MenuItem) => {
    if (item.disabled || item.divider) return
    item.onSelect?.()
    onSelect?.(item.value ?? item.label, item)
    close()
  }

  const move = (dir: 1 | -1) => {
    if (enabled.length === 0) return
    const at = enabled.indexOf(active)
    const next = at === -1 ? (dir === 1 ? 0 : enabled.length - 1) : (at + dir + enabled.length) % enabled.length
    setActive(enabled[next])
  }

  const onTriggerKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openAt(enabled[0] ?? -1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      openAt(enabled[enabled.length - 1] ?? -1)
    }
  }

  const onMenuKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1) }
    else if (e.key === 'Home') { e.preventDefault(); setActive(enabled[0] ?? -1) }
    else if (e.key === 'End') { e.preventDefault(); setActive(enabled[enabled.length - 1] ?? -1) }
    else if (e.key === 'Tab') close(false)
    else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey && e.key !== ' ') {
      // Type-ahead: jump to the next item starting with what was typed.
      const now = Date.now()
      typed.current.text = (now - typed.current.at < 600 ? typed.current.text : '') + e.key.toLowerCase()
      typed.current.at = now
      const hit = enabled.find((i) => items[i].label.toLowerCase().startsWith(typed.current.text))
      if (hit !== undefined) setActive(hit)
    }
  }

  const triggerStyle: CSSProperties = {
    height: 40,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '0 12px',
    borderRadius: 'var(--radius-md)',
    border: 'var(--border-width-default) solid var(--border-strong)',
    background: 'var(--white)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)',
    fontSize: 16,
    fontWeight: 500,
    cursor: 'pointer',
    // An open menu keeps a ring on its trigger, so it is clear what it belongs to.
    boxShadow: isOpen ? '0 0 0 3px var(--primary-focus-ring)' : 'none',
    transition: 'box-shadow var(--duration-fast) var(--easing-standard)',
    ...style,
  }

  const panelStyle: CSSProperties = {
    minWidth: 180,
    padding: 4,
    background: 'var(--surface)',
    border: 'var(--border-width-default) solid var(--border)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-200)',
    zIndex: 'var(--z-dropdown)',
    fontFamily: 'var(--font-sans)',
    ...(forceVisible
      ? {
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: placement === 'BottomStart' ? 0 : 'auto',
          right: placement === 'BottomEnd' ? 0 : 'auto',
        }
      : pos.style),
  }

  const menu = (
    <div ref={panel} id={menuId} role="menu" aria-label={label} onKeyDown={onMenuKey} style={panelStyle}>
      {items.map((item, i) => {
        if (item.divider) {
          return <div key={`d${i}`} role="separator" style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
        }
        const color = item.disabled
          ? 'var(--action-disabled)'
          : item.danger ? 'var(--error)' : 'var(--text-primary)'
        return (
          <button
            key={`${item.value ?? item.label}-${i}`}
            ref={(node) => { itemRefs.current[i] = node }}
            type="button"
            role="menuitem"
            className="inspera-interactive inspera-row"
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
              color,
              fontFamily: 'var(--font-sans)',
              fontSize: 16,
              textAlign: 'left',
              cursor: item.disabled ? 'not-allowed' : 'pointer',
              opacity: item.disabled ? 0.6 : 1,
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
  )

  return (
    <div className={cx('inspera', className)} style={{ position: 'relative', display: 'inline-block', fontFamily: 'var(--font-sans)' }}>
      <button
        ref={(node) => {
          trigger.current = node
          assignRef(ref, node)
        }}
        type="button"
        className="inspera-interactive"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        style={triggerStyle}
        onClick={() => (isOpenState ? close(false) : openAt(-1))}
        onKeyDown={onTriggerKey}
        {...rest}
      >
        {label}
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 20, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-fast) var(--easing-standard)' }}
          aria-hidden
        >
          expand_more
        </span>
      </button>
      {forceVisible ? menu : live && <Portal>{menu}</Portal>}
    </div>
  )
}
