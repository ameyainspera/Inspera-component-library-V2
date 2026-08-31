import { type CSSProperties, type ReactNode } from 'react'

export type ButtonIntent =
  | 'Primary' | 'Secondary' | 'Outline' | 'Text' | 'Success' | 'Warning' | 'Destructive'
export type ButtonSize = 'Small' | 'Medium' | 'Large'
export type ButtonState = 'Default' | 'Hover' | 'Focused' | 'Pressed' | 'Disabled'
export type ButtonContent = 'Text' | 'Icon + Text' | 'Text + Icon' | 'Text + Disclosure'

export interface ButtonProps {
  /** The button text. Start with a verb — "Save", not "OK". */
  label?: string
  /** Visual role / semantic weight. */
  intent?: ButtonIntent
  /** Height 32 / 40 / 48. */
  size?: ButtonSize
  /**
   * Freezes a visual state so documentation can show it without a pointer.
   * Leave unset in application code — hover, focus and active are handled in
   * CSS and work on their own.
   */
  state?: ButtonState
  /** Label / icon composition. */
  content?: ButtonContent
  /** Material Symbols name. Only rendered by the icon-bearing content variants. */
  icon?: string
  /** Fired on click and on Enter or Space. */
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
  state,
  content = 'Text',
  icon = 'add',
  onClick,
}: ButtonProps) {
  const c = intentMap[intent]
  const s = sizeMap[size]
  const isSolid = c.bg !== 'transparent'
  const disabled = state === 'Disabled'

  // Hover and pressed are CSS (see .inspera-button in runtime.css). The
  // component only supplies the colours; the pseudo-classes do the rest, so a
  // Button reacts to a real pointer instead of only to a prop.
  const style: CSSProperties & Record<string, string | number> = {
    '--inspera-bg': c.bg,
    '--inspera-fg': c.fg,
    '--inspera-border': c.border,
    '--inspera-shadow': isSolid ? 'var(--effect-button-shadow)' : 'none',
    '--inspera-bg-hover': isSolid ? darken(c.bg, 0.1) : 'color-mix(in srgb, var(--primary) 8%, transparent)',
    '--inspera-bg-active': isSolid ? darken(c.bg, 0.18) : 'color-mix(in srgb, var(--primary) 12%, transparent)',
    '--inspera-shadow-hover': isSolid
      ? 'inset 0px -1px 0px rgba(0,0,0,0.2), 0px 2px 6px rgba(0,64,128,0.24)'
      : 'none',
    '--inspera-shadow-active': isSolid ? 'inset 0px 1px 2px rgba(0,0,0,0.24)' : 'none',
    height: s.h,
    minWidth: 80,
    padding: `0 ${s.px}px`,
    gap: s.gap,
    borderRadius: 'var(--radius-sm)',
    borderWidth: 'var(--border-width-default)',
    borderStyle: 'solid',
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--default-16-medium-size)',
    fontWeight: 600,
    lineHeight: 'var(--default-16-medium-line-height)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.38 : 1,
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
      className="inspera-interactive inspera-button"
      data-force-state={state && state !== 'Default' ? state : undefined}
      style={style}
      disabled={disabled}
      onClick={onClick}
      aria-label={content === 'Icon + Text' || content === 'Text' ? undefined : label}
    >
      {content === 'Icon + Text' && iconEl}
      {/* The label only needs its own element when it sits beside an icon.
          A text-only button wrapped its label in a span that carried nothing,
          which made the rendered DOM differ from the HTML the spec publishes
          for the same button — for no visual gain. */}
      {content === 'Text' ? label : <span>{label}</span>}
      {(content === 'Text + Icon' || content === 'Text + Disclosure') && iconEl}
    </button>
  )
}
