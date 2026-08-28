import { type CSSProperties, type ReactNode, useState } from 'react'

export type LinkIntent = 'Default' | 'Muted'
export type LinkSize = 'Small' | 'Medium'
export type LinkUnderline = 'Always' | 'Hover' | 'None'

export interface LinkProps {
  children?: ReactNode
  label?: string
  href?: string
  intent?: LinkIntent
  size?: LinkSize
  underline?: LinkUnderline
  external?: boolean
  disabled?: boolean
  leadingIcon?: string
  trailingIcon?: string
  onClick?: (e: React.MouseEvent) => void
}

export default function Link({
  children,
  label = 'Learn more',
  href = '#',
  intent = 'Default',
  size = 'Medium',
  underline = 'Hover',
  external = false,
  disabled = false,
  leadingIcon,
  trailingIcon,
  onClick,
}: LinkProps) {
  const [hover, setHover] = useState(false)
  const [focus, setFocus] = useState(false)

  const color = disabled
    ? 'var(--action-disabled)'
    : intent === 'Muted'
      ? 'var(--gray-600)'
      : 'var(--primary)'

  const showUnderline =
    underline === 'Always' || (underline === 'Hover' && hover && !disabled)

  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    color,
    fontFamily: 'var(--font-sans)',
    fontSize: size === 'Small' ? 14 : 16,
    fontWeight: 500,
    textDecoration: showUnderline ? 'underline' : 'none',
    textUnderlineOffset: 2,
    cursor: disabled ? 'not-allowed' : 'pointer',
    borderRadius: 'var(--radius-xs)',
    outline: focus && !disabled ? '2px solid var(--primary-focus-ring)' : 'none',
    outlineOffset: 2,
    transition: 'color 120ms ease',
  }
  const iconSize = size === 'Small' ? 16 : 18

  return (
    <a
      href={disabled ? undefined : href}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault()
          return
        }
        onClick?.(e)
      }}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      aria-disabled={disabled || undefined}
      style={style}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
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
    </a>
  )
}
