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
  Primary: { bg: 'var(--primary)', fg: 'var(--white)', border: 'transparent' },
  Secondary: { bg: 'var(--gray-100)', fg: 'var(--gray-900)', border: 'var(--gray-700)' },
  Outline: { bg: 'transparent', fg: 'var(--primary)', border: 'var(--primary)' },
  Text: { bg: 'transparent', fg: 'var(--primary)', border: 'transparent' },
  Success: { bg: 'var(--success)', fg: 'var(--white)', border: 'transparent' },
  Warning: { bg: 'var(--warning)', fg: 'var(--white)', border: 'transparent' },
  Destructive: { bg: 'var(--error)', fg: 'var(--white)', border: 'transparent' },
}

const sizeMap: Record<ButtonSize, { h: number; px: number; gap: number }> = {
  Small: { h: 32, px: 12, gap: 6 },
  Medium: { h: 40, px: 16, gap: 8 },
  Large: { h: 48, px: 24, gap: 10 },
}

/**
 * Darken a colour by mixing it toward black, in CSS.
 *
 * This replaced JS hex arithmetic. Once the intent map became tokens, the old
 * helper's `if (!hex.startsWith('#')) return hex` guard returned `var(--primary)`
 * untouched, so Hover and Pressed silently stopped shading. color-mix works on
 * whatever the token resolves to.
 */
function darken(color: string, amount: number): string {
  return `color-mix(in srgb, ${color} ${Math.round((1 - amount) * 100)}%, black)`
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
  else if (state === 'Pressed' && !isSolid) background = 'color-mix(in srgb, var(--primary) 12%, transparent)'
  else if (state === 'Hover' && !isSolid) background = 'color-mix(in srgb, var(--primary) 8%, transparent)'

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
