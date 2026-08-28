import { type CSSProperties, type ReactNode, useId, useState } from 'react'

export type TooltipPlacement = 'Top' | 'Bottom' | 'Left' | 'Right'
export type TooltipTheme = 'Light' | 'Dark'
export type TooltipType = 'Default' | 'Accessibility'

export interface TooltipProps {
  content?: string
  /** Position relative to the trigger. Values: Top | Bottom | Left | Right. */
  placement?: TooltipPlacement
  /** Surface color. Values: Light | Dark. */
  theme?: TooltipTheme
  /** Accessibility type uses larger text. Values: Default | Accessibility. */
  type?: TooltipType
  children?: ReactNode
  /** Keep the tooltip visible regardless of hover — used for documentation. */
  forceVisible?: boolean
}

const ARROW = 8 // square size px
const GAP = 8   // bubble ↔ trigger gap (must be >= ARROW/2 so arrow fits)

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
  const bg = dark ? '#272727' : '#FFFFFF'
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
  const visible = forceVisible || hovered

  const dark = theme === 'Dark'
  const bubble: CSSProperties = {
    position: 'absolute',
    ...positionStyle(placement),
    maxWidth: 240,
    width: 'max-content',
    padding: type === 'Accessibility' ? '10px 12px' : '8px 12px',
    borderRadius: 'var(--radius-sm)',
    background: dark ? '#272727' : '#FFFFFF',
    color: dark ? '#FFFFFF' : 'var(--text-primary)',
    border: dark ? 'none' : '1px solid var(--border-strong)',
    fontSize: type === 'Accessibility' ? 14 : 12,
    lineHeight: 1.4,
    boxShadow: 'var(--shadow-100)',
    zIndex: 30,
    pointerEvents: 'none',
    opacity: visible ? 1 : 0,
    transition: 'opacity 140ms ease',
  }

  const trigger = children ?? (
    <button
      type="button"
      aria-describedby={id}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-strong)', background: '#fff', cursor: 'help' }}
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
