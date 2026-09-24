import {
  type CSSProperties, type ReactElement, cloneElement, isValidElement, useEffect, useId, useRef, useState,
} from 'react'
import { Portal, type Side, useAnchoredPosition, useEscapeLayer } from './overlay'
import { type NativeAttrs } from './types'

export type TooltipPlacement = 'Top' | 'Bottom' | 'Left' | 'Right'
export type TooltipTheme = 'Light' | 'Dark'
export type TooltipVariant = 'Default' | 'Accessibility'

export interface TooltipProps {
  /** The hint text. Keep it short; never put essential information here alone. */
  content: string
  /**
   * The element the tooltip describes: one focusable element, e.g. an
   * icon-only Button. It receives `aria-describedby` pointing at the tooltip.
   */
  children: ReactElement
  /** Preferred side. It flips when there is no room. */
  placement?: TooltipPlacement
  /** Surface color. */
  theme?: TooltipTheme
  /** Accessibility uses larger text and more padding. */
  variant?: TooltipVariant
  /** @internal Keep the bubble visible, drawn inline - for documentation. */
  forceVisible?: boolean
}

const ARROW = 8
const GAP = 8
const sideOf: Record<TooltipPlacement, Side> = { Top: 'top', Bottom: 'bottom', Left: 'left', Right: 'right' }

function inlinePosition(placement: TooltipPlacement): CSSProperties {
  switch (placement) {
    case 'Top':    return { position: 'absolute', bottom: `calc(100% + ${GAP}px)`, left: '50%', transform: 'translateX(-50%)' }
    case 'Bottom': return { position: 'absolute', top:    `calc(100% + ${GAP}px)`, left: '50%', transform: 'translateX(-50%)' }
    case 'Left':   return { position: 'absolute', right:  `calc(100% + ${GAP}px)`, top: '50%',  transform: 'translateY(-50%)' }
    case 'Right':  return { position: 'absolute', left:   `calc(100% + ${GAP}px)`, top: '50%',  transform: 'translateY(-50%)' }
  }
}

function arrowStyle(side: Side, dark: boolean, offset: number | null): CSSProperties {
  const half = ARROW / 2
  const bg = dark ? 'var(--gray-900)' : 'var(--white)'
  const border = `var(--border-width-default) solid ${dark ? 'transparent' : 'var(--border-strong)'}`
  const along = offset === null ? '50%' : offset
  const base: CSSProperties = { position: 'absolute', width: ARROW, height: ARROW, background: bg, transform: 'rotate(45deg)' }
  switch (side) {
    case 'top':    return { ...base, bottom: -half, left: along, marginLeft: -half, borderRight: border, borderBottom: border }
    case 'bottom': return { ...base, top: -half, left: along, marginLeft: -half, borderLeft: border, borderTop: border }
    case 'left':   return { ...base, right: -half, top: along, marginTop: -half, borderRight: border, borderTop: border }
    case 'right':  return { ...base, left: -half, top: along, marginTop: -half, borderLeft: border, borderBottom: border }
  }
}

export default function Tooltip({
  content,
  children,
  placement = 'Top',
  theme = 'Dark',
  variant = 'Default',
  forceVisible = false,
  className,
  style,
  ...rest
}: TooltipProps & NativeAttrs<'span', TooltipProps>) {
  const id = useId()
  // Pointer and focus are tracked apart: moving the mouse away used to hide the
  // tooltip while the trigger still had keyboard focus.
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const leaveTimer = useRef<number | undefined>(undefined)
  const shown = forceVisible || ((hovered || focused) && !dismissed)
  const live = shown && !forceVisible

  const anchor = useRef<HTMLSpanElement>(null)
  const bubbleRef = useRef<HTMLSpanElement>(null)
  const pos = useAnchoredPosition(live, anchor, bubbleRef, { side: sideOf[placement], align: 'center', offset: GAP })

  // WCAG 1.4.13: dismissible with Escape without moving focus. Registered as a
  // layer so Escape closes the tooltip, not the dialog it sits in.
  useEscapeLayer(live, () => setDismissed(true))
  useEffect(() => {
    if (!hovered && !focused) setDismissed(false)
  }, [hovered, focused])
  useEffect(() => () => window.clearTimeout(leaveTimer.current), [])

  // A short grace period lets the pointer cross the gap onto the bubble, which
  // WCAG 1.4.13 also requires to be hoverable.
  const enter = () => { window.clearTimeout(leaveTimer.current); setHovered(true) }
  const leave = () => { leaveTimer.current = window.setTimeout(() => setHovered(false), 100) }

  const dark = theme === 'Dark'
  const side = forceVisible ? sideOf[placement] : pos.side
  const bubble: CSSProperties = {
    maxWidth: 240,
    width: 'max-content',
    padding: variant === 'Accessibility' ? '10px 12px' : '8px 12px',
    borderRadius: 'var(--radius-sm)',
    background: dark ? 'var(--gray-900)' : 'var(--white)',
    color: dark ? 'var(--white)' : 'var(--text-primary)',
    border: dark ? 'none' : 'var(--border-width-default) solid var(--border-strong)',
    fontFamily: 'var(--font-sans)',
    fontSize: variant === 'Accessibility' ? 14 : 12,
    lineHeight: 1.4,
    boxShadow: 'var(--shadow-100)',
    zIndex: 'var(--z-tooltip)',
    ...(forceVisible ? inlinePosition(placement) : pos.style),
    ...style,
  }

  // Keep whatever description the trigger already had, and add ours.
  const trigger = isValidElement(children)
    ? cloneElement(children as ReactElement<{ 'aria-describedby'?: string }>, {
        'aria-describedby': [
          (children.props as { 'aria-describedby'?: string })['aria-describedby'],
          id,
        ].filter(Boolean).join(' '),
      })
    : children

  // Always in the DOM - `hidden` when not shown - so the trigger's
  // aria-describedby resolves even before the first hover.
  const node = (
    <span
      ref={bubbleRef}
      id={id}
      role="tooltip"
      hidden={!shown}
      className={className ? `inspera ${className}` : 'inspera'}
      style={bubble}
      onMouseEnter={enter}
      onMouseLeave={leave}
      {...rest}
    >
      {content}
      <span aria-hidden style={arrowStyle(side, dark, forceVisible ? null : pos.arrow)} />
    </span>
  )

  return (
    <span
      ref={anchor}
      className="inspera"
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {trigger}
      {forceVisible ? node : <Portal>{node}</Portal>}
    </span>
  )
}
