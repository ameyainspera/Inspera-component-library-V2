import { type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { cx, srOnly, type NativeAttrs } from './types'

export type LinkIntent = 'Default' | 'Muted'
export type LinkSize = 'Small' | 'Medium'
export type LinkUnderline = 'Always' | 'Hover' | 'None'

export interface LinkProps {
  /** Destination URL. Always a real one - use a Button for actions. */
  href: string
  /** Link text. */
  children?: ReactNode
  /** Link text, when not passing children. */
  label?: string
  /** Colour emphasis. */
  intent?: LinkIntent
  /** Text size. */
  size?: LinkSize
  /** Underline behaviour. */
  underline?: LinkUnderline
  /** Open in a new tab, with an icon and a spoken "opens in a new tab". */
  external?: boolean
  /** Non-interactive state. */
  disabled?: boolean
  /** Material Symbols name shown before the text. */
  leadingIcon?: string
  /** Material Symbols name shown after the text. */
  trailingIcon?: string
  /** Fired on activation. Use for client-side routing, not to replace href. */
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

export default function Link({
  href,
  children,
  label,
  intent = 'Default',
  size = 'Medium',
  underline = 'Hover',
  external = false,
  disabled = false,
  leadingIcon,
  trailingIcon,
  onClick,
  className,
  style,
  ...rest
}: LinkProps & NativeAttrs<'a', LinkProps>) {
  const color = disabled
    ? 'var(--action-disabled)'
    : intent === 'Muted'
      ? 'var(--text-secondary)'
      : 'var(--primary)'

  const anchor: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    color,
    fontFamily: 'var(--font-sans)',
    fontSize: size === 'Small' ? 14 : 16,
    fontWeight: 500,
    // Hover underline is the class's job (.inspera-underline-hover); an inline
    // value here would outrank its :hover rule.
    textDecoration: underline === 'Always' ? 'underline' : underline === 'Hover' && !disabled ? undefined : 'none',
    textUnderlineOffset: 2,
    cursor: disabled ? 'not-allowed' : 'pointer',
    borderRadius: 'var(--radius-xs)',
    transition: 'color var(--duration-fast) var(--easing-standard)',
    ...style,
  }
  const iconSize = size === 'Small' ? 16 : 18

  return (
    <a
      href={disabled ? undefined : href}
      // Focus ring from :focus-visible (.inspera-interactive) and hover
      // underline from CSS. Both were JS state, so the ring also showed on
      // every mouse click.
      className={cx('inspera inspera-interactive', underline === 'Hover' && !disabled && 'inspera-underline-hover', className)}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault()
          return
        }
        onClick?.(e)
      }}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      role={disabled ? 'link' : undefined}
      aria-disabled={disabled || undefined}
      style={anchor}
      {...rest}
    >
      {leadingIcon && (
        <span className="material-symbols-outlined" style={{ fontSize: iconSize }} aria-hidden>{leadingIcon}</span>
      )}
      {children ?? label}
      {trailingIcon && (
        <span className="material-symbols-outlined" style={{ fontSize: iconSize }} aria-hidden>{trailingIcon}</span>
      )}
      {external && !trailingIcon && (
        <span className="material-symbols-outlined" style={{ fontSize: iconSize }} aria-hidden>open_in_new</span>
      )}
      {external && <span style={srOnly}> (opens in a new tab)</span>}
    </a>
  )
}
