import { type CSSProperties, type ReactElement, type ReactNode, cloneElement, isValidElement, useEffect, useId, useState } from 'react'

export type TooltipPlacement = 'Top' | 'Bottom' | 'Left' | 'Right'
export type TooltipTheme = 'Light' | 'Dark'
export type TooltipType = 'Default' | 'Accessibility'

export interface TooltipProps {
  /** The hint text. Keep it short; never put essential information here alone. */
  content?: string
  /** Position relative to the trigger. */
  placement?: TooltipPlacement
  /** Surface color. */
  theme?: TooltipTheme
  /** Accessibility type uses larger text. */
  type?: TooltipType
  /** The element the tooltip describes. */
  children?: ReactNode
  /** Keep the tooltip visible regardless of hover - used for documentation. */
  forceVisible?: boolean
}

const ARROW = 8 // square size px
const GAP = 8   // bubble-to-trigger gap (must be >= ARROW/2 so arrow fits)

function positionStyle(placement: TooltipPlacement): CSSProperties {
  switch (placement) {
    case 'Top':    return { bottom: `calc(100% + ${GAP}px)`, left: '50%', transform: 'translateX(-50%)' }
    case 'Bottom': return { top:    `calc(100% + ${GAP}px)`, left: '50%', transform: 'translateX(-50%)' }
    case 'Left':   return { right:  `calc(100% + ${GAP}px)`, top: '50%',  transform: 'translateY(-50%)' }
    case 'Right':  return { left:   `calc(100% + ${GAP}px)`, top: '50%',  transform: 'translateY(-50%)' }
  }
}

function arrowStyle(placement: TooltipPlacement, dark: boolean): CSSProperties {
  const half = ARROW / 2
  const bg = dark ? 'var(--gray-900)' : 'var(--white)'
  const border = dark ? 'transparent' : 'var(--border-strong)'
  const base: CSSProperties = { position: 'absolute', width: ARROW, height: ARROW, background: bg, zIndex: 31 }
  switch (placement) {
    case 'Top':
      return { ...base, bottom: -half, left: '50%', marginLeft: -half, transform: 'rotate(45deg)',
        borderRight: `1px solid ${border}`, borderBottom: `1px solid ${border}` }
    case 'Bottom':
      return { ...base, top: -half, left: '50%', marginLeft: -half, transform: 'rotate(45deg)',
        borderLeft: `1px solid ${border}`, borderTop: `1px solid ${border}` }
    case 'Left':
      return { ...base, right: -half, top: '50%', marginTop: -half, transform: 'rotate(45deg)',
        borderRight: `1px solid ${border}`, borderTop: `1px solid ${border}` }
    case 'Right':
      return { ...base, left: -half, top: '50%', marginTop: -half, transform: 'rotate(45deg)',
        borderLeft: `1px solid ${border}`, borderBottom: `1px solid ${border}` }
  }
}

export default function Tooltip({
  content = 'Supplementary help text',
  placement = 'Top',
  theme = 'Dark',
  type = 'Default',
  children,
  forceVisible = false,
}: TooltipProps) {
  const id = useId()
  const [hovered, setHovered] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const visible = forceVisible || (hovered && !dismissed)

  // The spec promises Escape dismisses the tooltip; nothing implemented it.
  // WCAG 1.4.13 requires it for content that appears on hover or focus.
  useEffect(() => {
    if (!hovered) { setDismissed(false); return }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDismissed(true) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [hovered])

  const dark = theme === 'Dark'
  const bubble: CSSProperties = {
    position: 'absolute',
    ...positionStyle(placement),
    maxWidth: 240,
    width: 'max-content',
    padding: type === 'Accessibility' ? '10px 12px' : '8px 12px',
    borderRadius: 'var(--radius-sm)',
    background: dark ? 'var(--gray-900)' : 'var(--white)',
    color: dark ? 'var(--white)' : 'var(--text-primary)',
    border: dark ? 'none' : '1px solid var(--border-strong)',
    fontFamily: 'var(--font-sans)',
    fontSize: type === 'Accessibility' ? 14 : 12,
    lineHeight: 1.4,
    boxShadow: 'var(--shadow-100)',
    zIndex: 30,
    pointerEvents: 'none',
    opacity: visible ? 1 : 0,
    transition: 'opacity 140ms ease',
  }

  // A custom trigger has to carry the describedby too, or the tooltip it owns
  // is never announced - the spec's "link trigger and tooltip" held only for
  // the built-in trigger below.
  const trigger = children
    ? isValidElement(children)
      ? cloneElement(children as ReactElement<{ 'aria-describedby'?: string }>, { 'aria-describedby': id })
      : children
    : (
    <button
      type="button"
      aria-describedby={id}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-strong)', background: 'var(--white)', fontFamily: 'var(--font-sans)', cursor: 'help' }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--action-active)' }} aria-hidden>help</span>
    </button>
  )

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {trigger}
      <span id={id} role="tooltip" style={bubble}>
        {content}
        <span aria-hidden style={arrowStyle(placement, dark)} />
      </span>
    </span>
  )
}
