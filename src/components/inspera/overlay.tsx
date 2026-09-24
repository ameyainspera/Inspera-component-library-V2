import {
  type CSSProperties, type MouseEvent as ReactMouseEvent, type ReactNode, type RefObject,
  useEffect, useLayoutEffect, useRef, useState,
} from 'react'
import { createPortal } from 'react-dom'

// ---------------------------------------------------------------------------
// Portal
//
// Floating panels used to render inline, absolutely positioned inside the
// trigger's wrapper. Any ancestor with `overflow: hidden` or `auto` - a table,
// a card, a scroll area - cut them off; the DataGrid row menu was clipped by
// its own table. Rendering into <body> takes them out of every such container.
// ---------------------------------------------------------------------------

/**
 * Renders children into document.body. Synchronous on the client, so a panel
 * exists in the same commit as its owner's effects (focus, measuring); server
 * rendering gets nothing.
 */
export function Portal({ children }: { children: ReactNode }) {
  if (typeof document === 'undefined') return null
  return createPortal(children, document.body)
}

// ---------------------------------------------------------------------------
// Anchored positioning
// ---------------------------------------------------------------------------

export type Side = 'top' | 'bottom' | 'left' | 'right'
export type Align = 'start' | 'center' | 'end'

export interface AnchoredPosition {
  /** `position: fixed` coordinates for the panel. Hidden until measured. */
  style: CSSProperties
  /** The side actually used - it flips when the preferred side has no room. */
  side: Side
  /** Distance along the panel edge to the anchor's centre, for an arrow. */
  arrow: number
}

const EDGE = 8

/**
 * Places a panel against an anchor with `position: fixed`, flipping to the
 * opposite side when the preferred one would run off the viewport and
 * clamping so it never leaves the screen. Re-measures on scroll (any scroll
 * container, via capture), resize, and size changes of either element.
 */
export function useAnchoredPosition(
  open: boolean,
  anchor: RefObject<HTMLElement | null>,
  floating: RefObject<HTMLElement | null>,
  { side = 'bottom', align = 'start', offset = 4, matchWidth = false }:
    { side?: Side; align?: Align; offset?: number; matchWidth?: boolean } = {},
): AnchoredPosition {
  const [pos, setPos] = useState<{ top: number; left: number; side: Side; arrow: number; width?: number } | null>(null)

  useLayoutEffect(() => {
    if (!open) {
      setPos(null)
      return
    }
    const update = () => {
      const a = anchor.current?.getBoundingClientRect()
      const f = floating.current
      if (!a || !f) return
      const fw = matchWidth ? a.width : f.offsetWidth
      const fh = f.offsetHeight
      const vw = window.innerWidth
      const vh = window.innerHeight

      let s = side
      const room = {
        top: a.top - offset - EDGE,
        bottom: vh - a.bottom - offset - EDGE,
        left: a.left - offset - EDGE,
        right: vw - a.right - offset - EDGE,
      }
      const opposite: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }
      const need = s === 'top' || s === 'bottom' ? fh : fw
      if (room[s] < need && room[opposite[s]] > room[s]) s = opposite[s]

      let top: number
      let left: number
      if (s === 'top' || s === 'bottom') {
        top = s === 'bottom' ? a.bottom + offset : a.top - offset - fh
        left = align === 'start' ? a.left : align === 'end' ? a.right - fw : a.left + a.width / 2 - fw / 2
      } else {
        left = s === 'right' ? a.right + offset : a.left - offset - fw
        top = align === 'start' ? a.top : align === 'end' ? a.bottom - fh : a.top + a.height / 2 - fh / 2
      }
      left = Math.max(EDGE, Math.min(left, vw - EDGE - fw))
      top = Math.max(EDGE, Math.min(top, vh - EDGE - fh))

      const arrow = s === 'top' || s === 'bottom'
        ? a.left + a.width / 2 - left
        : a.top + a.height / 2 - top
      setPos({ top, left, side: s, arrow, width: matchWidth ? a.width : undefined })
    }

    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    const ro = new ResizeObserver(update)
    if (anchor.current) ro.observe(anchor.current)
    if (floating.current) ro.observe(floating.current)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
      ro.disconnect()
    }
  }, [open, anchor, floating, side, align, offset, matchWidth])

  return {
    style: pos
      ? { position: 'fixed', top: pos.top, left: pos.left, ...(pos.width !== undefined ? { width: pos.width } : {}) }
      // Measured before paint (layout effect), so this frame is never seen.
      : { position: 'fixed', top: 0, left: 0, visibility: 'hidden' },
    side: pos?.side ?? side,
    arrow: pos?.arrow ?? 0,
  }
}

// ---------------------------------------------------------------------------
// Layer stack
//
// Every overlay listened for Escape on the document, so one press closed a
// Menu *and* the Dialog it sat in. Open overlays register here; only the most
// recently opened one handles Escape.
// ---------------------------------------------------------------------------

const stack: number[] = []
let nextId = 1

/**
 * Registers an open layer and calls `onEscape` only when it is the topmost
 * one. Pass `enabled: false` for a layer that should not take Escape.
 */
export function useEscapeLayer(open: boolean, onEscape: () => void, enabled = true) {
  const handler = useRef(onEscape)
  handler.current = onEscape

  useEffect(() => {
    if (!open || !enabled) return
    const id = nextId++
    stack.push(id)
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || stack[stack.length - 1] !== id) return
      e.stopPropagation()
      handler.current()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      const at = stack.indexOf(id)
      if (at !== -1) stack.splice(at, 1)
    }
  }, [open, enabled])
}

/**
 * Closes on a pointer press outside every given element. With panels in a
 * portal, "outside the trigger's wrapper" is no longer "outside the panel",
 * so both are checked.
 */
export function useOutsidePress(
  open: boolean,
  refs: RefObject<HTMLElement | null>[],
  onOutside: () => void,
) {
  const handler = useRef(onOutside)
  handler.current = onOutside

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (refs.every((r) => !r.current || !r.current.contains(target))) handler.current()
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
    // The refs array is rebuilt each render; the refs inside it are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])
}

/**
 * Handlers for a modal's scrim. A click fires on the element under the
 * *release*, so selecting text in a dialog and letting go over the scrim used
 * to close it. This closes only when the press started on the scrim too.
 */
export function useScrimDismiss(onDismiss?: () => void) {
  const pressedOnScrim = useRef(false)
  return {
    onMouseDown: (e: ReactMouseEvent) => {
      pressedOnScrim.current = e.target === e.currentTarget
    },
    onClick: (e: ReactMouseEvent) => {
      if (pressedOnScrim.current && e.target === e.currentTarget) onDismiss?.()
      pressedOnScrim.current = false
    },
  }
}
