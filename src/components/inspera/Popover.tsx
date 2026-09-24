import {
  type CSSProperties, type MouseEvent, type ReactElement, type ReactNode,
  cloneElement, isValidElement, useEffect, useId, useRef,
} from 'react'
import { Portal, type Side, useAnchoredPosition, useEscapeLayer, useOutsidePress } from './overlay'
import { cx, type NativeAttrs } from './types'
import { useControllableState } from './useControllableState'

export type PopoverPlacement = 'Top' | 'Bottom' | 'Left' | 'Right'

export interface PopoverProps {
  /** The element that toggles the popover - usually a Button. */
  trigger: ReactElement
  /** Popover body. May hold interactive content. */
  content: ReactNode
  /** Optional panel heading; also the panel's accessible name. */
  title?: string
  /** Preferred side. It flips when there is no room. */
  placement?: PopoverPlacement
  /** Open state. Controlled - pair with onOpenChange. */
  open?: boolean
  /** Open on mount, when uncontrolled. */
  defaultOpen?: boolean
  /** Fired when the popover opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** @internal Draw the panel inline and always open - for documentation. */
  forceVisible?: boolean
}

const sideOf: Record<PopoverPlacement, Side> = { Top: 'top', Bottom: 'bottom', Left: 'left', Right: 'right' }
const GAP = 10

/** Inline placement, used only by the frozen documentation rendering. */
function inlinePosition(placement: PopoverPlacement): CSSProperties {
  switch (placement) {
    case 'Top': return { position: 'absolute', bottom: `calc(100% + ${GAP}px)`, left: '50%', transform: 'translateX(-50%)' }
    case 'Bottom': return { position: 'absolute', top: `calc(100% + ${GAP}px)`, left: '50%', transform: 'translateX(-50%)' }
    case 'Left': return { position: 'absolute', right: `calc(100% + ${GAP}px)`, top: '50%', transform: 'translateY(-50%)' }
    case 'Right': return { position: 'absolute', left: `calc(100% + ${GAP}px)`, top: '50%', transform: 'translateY(-50%)' }
  }
}

/** The arrow on the panel edge facing the trigger, `offset` along that edge. */
function arrowStyle(side: Side, offset: number | null): CSSProperties {
  const base: CSSProperties = { position: 'absolute', width: 10, height: 10, background: 'var(--surface)', transform: 'rotate(45deg)' }
  const border = 'var(--border-width-default) solid var(--border)'
  const along = offset === null ? '50%' : offset
  switch (side) {
    case 'top': return { ...base, bottom: -5, left: along, marginLeft: -5, borderRight: border, borderBottom: border }
    case 'bottom': return { ...base, top: -5, left: along, marginLeft: -5, borderLeft: border, borderTop: border }
    case 'left': return { ...base, right: -5, top: along, marginTop: -5, borderRight: border, borderTop: border }
    case 'right': return { ...base, left: -5, top: along, marginTop: -5, borderLeft: border, borderBottom: border }
  }
}

const FOCUSABLE = 'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'

export default function Popover({
  trigger,
  content,
  title,
  placement = 'Bottom',
  open,
  defaultOpen = false,
  onOpenChange,
  forceVisible = false,
  className,
  style,
  ...rest
}: PopoverProps & NativeAttrs<'div', PopoverProps>) {
  const id = useId()
  const [isOpenState, setOpen] = useControllableState(open, defaultOpen, onOpenChange)
  const live = isOpenState && !forceVisible
  const isOpen = forceVisible || isOpenState

  const anchor = useRef<HTMLSpanElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const pos = useAnchoredPosition(live, anchor, panel, { side: sideOf[placement], align: 'center', offset: GAP })

  const close = (refocus: boolean) => {
    setOpen(false)
    if (refocus) anchor.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus()
  }
  useEscapeLayer(live, () => close(true))
  useOutsidePress(live, [anchor, panel], () => close(false))

  // A popover holds interactive content, so opening it moves focus inside -
  // otherwise a keyboard user has no way to reach what it offers.
  useEffect(() => {
    if (!live || !panel.current) return
    ;(panel.current.querySelector<HTMLElement>(FOCUSABLE) ?? panel.current).focus()
  }, [live])

  // The ARIA state and the click belong on the trigger itself. They used to
  // sit on a wrapper span, which is not focusable, so assistive tech never
  // learned the button opened anything.
  const triggerNode = isValidElement(trigger)
    ? cloneElement(trigger as ReactElement<{ onClick?: (e: MouseEvent) => void } & Record<string, unknown>>, {
        'aria-expanded': isOpen,
        'aria-haspopup': 'dialog',
        'aria-controls': isOpen ? id : undefined,
        onClick: (e: MouseEvent) => {
          ;(trigger.props as { onClick?: (e: MouseEvent) => void }).onClick?.(e)
          if (!forceVisible) setOpen(!isOpenState)
        },
      })
    : trigger

  const panelStyle: CSSProperties = {
    zIndex: 'var(--z-popover)',
    maxWidth: 280,
    width: 'max-content',
    padding: 16,
    borderRadius: 'var(--radius-md)',
    background: 'var(--surface)',
    color: 'var(--text-primary)',
    border: 'var(--border-width-default) solid var(--border)',
    boxShadow: 'var(--shadow-300)',
    textAlign: 'left',
    fontFamily: 'var(--font-sans)',
    ...(forceVisible ? inlinePosition(placement) : pos.style),
    ...style,
  }

  const side = forceVisible ? sideOf[placement] : pos.side
  const panelNode = (
    <div
      ref={panel}
      id={id}
      tabIndex={-1}
      role="dialog"
      aria-labelledby={title ? `${id}-title` : undefined}
      className={cx('inspera', className)}
      style={panelStyle}
      {...rest}
    >
      <span style={arrowStyle(side, forceVisible ? null : pos.arrow)} aria-hidden />
      {title && <h3 id={`${id}-title`} style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600 }}>{title}</h3>}
      <div style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--muted-foreground)' }}>{content}</div>
    </div>
  )

  return (
    <span ref={anchor} className="inspera" style={{ position: 'relative', display: 'inline-flex' }}>
      {triggerNode}
      {forceVisible ? panelNode : live && <Portal>{panelNode}</Portal>}
    </span>
  )
}
