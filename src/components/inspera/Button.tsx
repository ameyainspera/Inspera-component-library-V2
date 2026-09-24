import { type CSSProperties, type MouseEventHandler } from 'react'
import { cx, type ForceState, type NativeAttrs } from './types'

export type ButtonIntent =
  | 'Primary' | 'Secondary' | 'Outline' | 'Text' | 'Success' | 'Warning' | 'Destructive'
export type ButtonSize = 'Small' | 'Medium' | 'Large'

export interface ButtonProps {
  /**
   * The button text. Start with a verb - "Save", not "OK". With `iconOnly` it
   * is not shown but becomes the accessible name, so it is still required.
   */
  label: string
  /** Visual role / semantic weight. */
  intent?: ButtonIntent
  /** Height 32 / 40 / 48. */
  size?: ButtonSize
  /** Material Symbols name shown before the label. */
  leadingIcon?: string
  /** Material Symbols name shown after the label. Use `expand_more` for a menu trigger. */
  trailingIcon?: string
  /** Show only the icon (`leadingIcon`, else `trailingIcon`); `label` becomes the accessible name. */
  iconOnly?: boolean
  /** Blocks interaction and dims the button. */
  disabled?: boolean
  /** Native button type. Defaults to `button`, so a Button never submits a form by accident. */
  type?: 'button' | 'submit' | 'reset'
  /** Fired on click and on Enter or Space. */
  onClick?: MouseEventHandler<HTMLButtonElement>
  /** @internal Freezes a hover, focus or pressed look for the docs gallery. */
  forceState?: ForceState
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
  label,
  intent = 'Primary',
  size = 'Medium',
  leadingIcon,
  trailingIcon,
  iconOnly = false,
  disabled = false,
  type = 'button',
  onClick,
  forceState,
  className,
  style,
  ...rest
}: ButtonProps & NativeAttrs<'button', ButtonProps>) {
  const c = intentMap[intent]
  const s = sizeMap[size]
  const isSolid = c.bg !== 'transparent'
  const onlyIcon = iconOnly ? (leadingIcon ?? trailingIcon) : undefined

  // Hover and pressed are CSS (see .inspera-button in runtime.css). The
  // component only supplies the colours; the pseudo-classes do the rest, so a
  // Button reacts to a real pointer instead of only to a prop.
  const vars: CSSProperties & Record<string, string | number> = {
    '--inspera-bg': c.bg,
    '--inspera-fg': c.fg,
    '--inspera-border': c.border,
    '--inspera-shadow': isSolid ? 'var(--effect-button-shadow)' : 'none',
    '--inspera-bg-hover': isSolid ? darken(c.bg, 0.1) : 'color-mix(in srgb, var(--primary) 8%, transparent)',
    '--inspera-bg-active': isSolid ? darken(c.bg, 0.18) : 'color-mix(in srgb, var(--primary) 12%, transparent)',
    '--inspera-shadow-hover': isSolid ? 'var(--effect-button-shadow-hover)' : 'none',
    '--inspera-shadow-active': isSolid ? 'var(--effect-button-shadow-active)' : 'none',
    height: s.h,
    // An icon-only button is a square; a labelled one never drops below 80px.
    ...(onlyIcon ? { width: s.h, minWidth: 0, padding: 0 } : { minWidth: 80, padding: `0 ${s.px}px` }),
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
    ...style,
  }

  const icon = (name: string) => (
    <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>
      {name}
    </span>
  )

  return (
    <button
      type={type}
      className={cx('inspera inspera-interactive inspera-button', className)}
      data-force-state={forceState}
      style={vars}
      disabled={disabled}
      onClick={onClick}
      aria-label={onlyIcon ? label : undefined}
      {...rest}
    >
      {onlyIcon ? (
        icon(onlyIcon)
      ) : (
        <>
          {leadingIcon && icon(leadingIcon)}
          {/* The label only needs its own element when it sits beside an icon,
              so a text-only button renders exactly the markup the spec
              publishes for it. */}
          {leadingIcon || trailingIcon ? <span>{label}</span> : label}
          {trailingIcon && icon(trailingIcon)}
        </>
      )}
    </button>
  )
}
