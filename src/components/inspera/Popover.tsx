import { type CSSProperties, type ReactNode, useEffect, useId, useRef, useState } from 'react'

export type PopoverPlacement = 'Top' | 'Bottom' | 'Left' | 'Right'

export interface PopoverProps {
  /** Element that toggles the popover. */
  trigger?: ReactNode
  /** Optional panel heading. */
  title?: string
  /** Popover body content. */
  content?: ReactNode
  /** Position relative to the trigger. */
  placement?: PopoverPlacement
  /** Controlled open state. Leave unset to let the popover manage itself. */
  open?: boolean
  /** Open on mount. */
  defaultOpen?: boolean
  /** Keep the panel visible regardless of state - used for documentation. */
  forceVisible?: boolean
  /** Fired when the popover opens or closes. */
  onOpenChange?: (open: boolean) => void
}

function panelPosition(placement: PopoverPlacement): CSSProperties {
  const gap = 10
  switch (placement) {
    case 'Top': return { bottom: `calc(100% + ${gap}px)`, left: '50%', transform: 'translateX(-50%)' }
    case 'Bottom': return { top: `calc(100% + ${gap}px)`, left: '50%', transform: 'translateX(-50%)' }
    case 'Left': return { right: `calc(100% + ${gap}px)`, top: '50%', transform: 'translateY(-50%)' }
    case 'Right': return { left: `calc(100% + ${gap}px)`, top: '50%', transform: 'translateY(-50%)' }
  }
}

function arrowPosition(placement: PopoverPlacement): CSSProperties {
  const base: CSSProperties = { position: 'absolute', width: 10, height: 10, background: 'var(--surface)', transform: 'rotate(45deg)' }
  switch (placement) {
    case 'Top': return { ...base, bottom: -5, left: '50%', marginLeft: -5, borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }
    case 'Bottom': return { ...base, top: -5, left: '50%', marginLeft: -5, borderLeft: '1px solid var(--border)', borderTop: '1px solid var(--border)' }
    case 'Left': return { ...base, right: -5, top: '50%', marginTop: -5, borderRight: '1px solid var(--border)', borderTop: '1px solid var(--border)' }
    case 'Right': return { ...base, left: -5, top: '50%', marginTop: -5, borderLeft: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }
  }
}

export default function Popover({
  trigger,
  title = 'Popover title',
  content = 'Popover content with interactive elements.',
  placement = 'Bottom',
  open,
  defaultOpen = false,
  forceVisible = false,
  onOpenChange,
}: PopoverProps) {
  const id = useId()
  const rootRef = useRef<HTMLSpanElement>(null)
  const [internal, setInternal] = useState(defaultOpen)
  const isControlled = open !== undefined
  const isOpen = forceVisible || (isControlled ? open! : internal)

  const setOpen = (next: boolean) => {
    if (!isControlled) setInternal(next)
    onOpenChange?.(next)
  }

  useEffect(() => {
    if (!isOpen || forceVisible) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, forceVisible])

  const triggerNode = trigger ?? (
    <button
      type="button"
      style={{ height: 40, padding: '0 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', background: 'var(--white)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
    >
      Open
    </button>
  )

  const panel: CSSProperties = {
    position: 'absolute',
    ...panelPosition(placement),
    zIndex: 40,
    maxWidth: 280,
    width: 'max-content',
    padding: 16,
    borderRadius: 'var(--radius-md)',
    background: 'var(--surface)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-300)',
    textAlign: 'left',
    fontFamily: 'var(--font-sans)',
  }

  return (
    <span ref={rootRef} style={{ position: 'relative', display: 'inline-flex' }}>
      <span
        onClick={() => setOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls={id}
        style={{ display: 'inline-flex' }}
      >
        {triggerNode}
      </span>
      {isOpen && (
        <div id={id} role="dialog" aria-modal={false} aria-labelledby={`${id}-title`} style={panel}>
          <span style={arrowPosition(placement)} aria-hidden />
          {title && <h3 id={`${id}-title`} style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600 }}>{title}</h3>}
          <div style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--muted-foreground)' }}>{content}</div>
        </div>
      )}
    </span>
  )
}
