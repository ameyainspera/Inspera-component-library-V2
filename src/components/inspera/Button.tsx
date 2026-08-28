import { type CSSProperties, type ReactNode } from 'react'

export type ButtonIntent =
  | 'Primary' | 'Secondary' | 'Outline' | 'Text' | 'Success' | 'Warning' | 'Destructive'
export type ButtonSize = 'Small' | 'Medium' | 'Large'
export type ButtonState = 'Default' | 'Hover' | 'Focused' | 'Pressed' | 'Disabled'
export type ButtonContent = 'Text' | 'Icon + Text' | 'Text + Icon' | 'Text + Disclosure'

export interface ButtonProps {
  label?: string
  /** Visual role / semantic weight. Values: Primary | Secondary | Outline | Text | Success | Warning | Destructive. */
  intent?: ButtonIntent
  /** Height 32 / 40 / 48. Values: Small | Medium | Large. */
  size?: ButtonSize
  /** Forces a visual state for documentation. Omit for real interactivity. */
  state?: ButtonState
  /** Label / icon composition. Values: Text | Icon + Text | Text + Icon | Text + Disclosure. */
  content?: ButtonContent
  icon?: string
  onClick?: () => void
}

const intentMap: Record<ButtonIntent, { bg: string; fg: string; border: string }> = {
  Primary: { bg: '#004080', fg: '#FFFFFF', border: 'transparent' },
  Secondary: { bg: '#F7F7F7', fg: '#272727', border: '#595959' },
  Outline: { bg: 'transparent', fg: '#004080', border: '#004080' },
  Text: { bg: 'transparent', fg: '#004080', border: 'transparent' },
  Success: { bg: '#2E7D32', fg: '#FFFFFF', border: 'transparent' },
  Warning: { bg: '#EF6C00', fg: '#FFFFFF', border: 'transparent' },
  Destructive: { bg: '#D32F2F', fg: '#FFFFFF', border: 'transparent' },
}

const sizeMap: Record<ButtonSize, { h: number; px: number; gap: number }> = {
  Small: { h: 32, px: 12, gap: 6 },
  Medium: { h: 40, px: 16, gap: 8 },
  Large: { h: 48, px: 24, gap: 10 },
}

// Darken a solid hex by a percentage (used for the Pressed state).
function darken(hex: string, amount: number): string {
  if (!hex.startsWith('#')) return hex
  const n = parseInt(hex.slice(1), 16)
  const r = Math.max(0, ((n >> 16) & 255) * (1 - amount))
  const g = Math.max(0, ((n >> 8) & 255) * (1 - amount))
  const b = Math.max(0, (n & 255) * (1 - amount))
  return `rgb(${r | 0}, ${g | 0}, ${b | 0})`
}

export default function Button({
  label = 'Button',
  intent = 'Primary',
  size = 'Medium',
  state = 'Default',
  content = 'Text',
  icon = 'add',
  onClick,
}: ButtonProps) {
  const c = intentMap[intent]
  const s = sizeMap[size]
  const isSolid = c.bg !== 'transparent'
  const disabled = state === 'Disabled'

  let background = c.bg
  if (state === 'Pressed' && isSolid) background = darken(c.bg, 0.18)
  else if (state === 'Hover' && isSolid) background = darken(c.bg, 0.1)
  else if (state === 'Pressed' && !isSolid) background = 'rgba(0, 64, 128, 0.12)'
  else if (state === 'Hover' && !isSolid) background = 'rgba(0, 64, 128, 0.08)'

  const style: CSSProperties = {
    height: s.h,
    minWidth: 80,
    padding: `0 ${s.px}px`,
    gap: s.gap,
    borderRadius: 'var(--radius-sm)',
    background,
    color: c.fg,
    border: `1px solid ${c.border}`,
    fontFamily: 'var(--font-sans)',
    fontSize: 16,
    fontWeight: 600,
    lineHeight: '140%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.38 : 1,
    outline: state === 'Focused' ? '2px solid var(--primary-focus-ring)' : 'none',
    outlineOffset: 2,
    boxShadow: !isSolid
      ? 'none'
      : state === 'Hover'
        ? 'inset 0px -1px 0px rgba(0,0,0,0.2), 0px 2px 6px rgba(0,64,128,0.24)'
        : state === 'Pressed'
          ? 'inset 0px 1px 2px rgba(0,0,0,0.24)'
          : 'inset 0px -1px 0px rgba(0,0,0,0.2), 0px 1px 0px rgba(0,0,0,0.08)',
    transform: state === 'Pressed' ? 'translateY(1px)' : 'none',
    transition: 'background 120ms ease, box-shadow 120ms ease, transform 120ms ease',
    whiteSpace: 'nowrap',
  }

  const iconEl: ReactNode = (
    <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>
      {content === 'Text + Disclosure' ? 'expand_more' : icon}
    </span>
  )

  return (
    <button
      type="button"
      style={style}
      disabled={disabled}
      onClick={onClick}
      aria-label={content === 'Icon + Text' || content === 'Text' ? undefined : label}
    >
      {content === 'Icon + Text' && iconEl}
      <span>{label}</span>
      {(content === 'Text + Icon' || content === 'Text + Disclosure') && iconEl}
    </button>
  )
}
