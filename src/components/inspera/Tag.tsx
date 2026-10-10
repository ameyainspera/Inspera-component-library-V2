import { type CSSProperties, type MouseEventHandler } from 'react'
import { cx, type NativeAttrs } from './types'

export type TagIntent = 'Neutral' | 'Info' | 'Success' | 'Warning' | 'Error'
export type TagSize = 'Small' | 'Medium'

export interface TagProps {
  /** Tag text. */
  label: string
  /** Semantic colour. */
  intent?: TagIntent
  /** Tag height. */
  size?: TagSize
  /** Show a remove button. Pair with onRemove. */
  removable?: boolean
  /** Optional leading icon. */
  leadingIcon?: string
  /** Fired when the remove button is activated. */
  onRemove?: () => void
  /** Makes the tag text itself a button. */
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const intentMap: Record<TagIntent, { bg: string; fg: string }> = {
  Neutral: { bg: 'var(--surface-neutral)', fg: 'var(--gray-900)' },
  Info: { bg: 'var(--info-surface)', fg: 'var(--info-text)' },
  Success: { bg: 'var(--success-surface)', fg: 'var(--success-text)' },
  Warning: { bg: 'var(--warning-surface)', fg: 'var(--warning-text)' },
  Error: { bg: 'var(--error-surface)', fg: 'var(--error-text)' },
}

/** Strips the UA button look so a button inside the pill reads as the pill's text. */
const bare: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  margin: 0,
  padding: 0,
  border: 'none',
  background: 'transparent',
  color: 'inherit',
  font: 'inherit',
  cursor: 'pointer',
  borderRadius: 'var(--radius-pill)',
}

export default function Tag({
  label,
  intent = 'Neutral',
  size = 'Medium',
  removable = false,
  leadingIcon,
  onRemove,
  onClick,
  className,
  style,
  ...rest
}: TagProps & NativeAttrs<'span', TagProps>) {
  const c = intentMap[intent]
  const small = size === 'Small'
  const iconSize = small ? 14 : 16

  const pill: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    height: small ? 20 : 24,
    padding: small ? '0 6px' : '0 8px',
    borderRadius: 'var(--radius-pill)',
    background: c.bg,
    color: c.fg,
    fontFamily: 'var(--font-sans)',
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    cursor: 'default',
    ...style,
  }

  const text = (
    <>
      {leadingIcon && (
        <span className="material-symbols-outlined" style={{ fontSize: iconSize, fontVariationSettings: "'FILL' 1" }} aria-hidden>
          {leadingIcon}
        </span>
      )}
      {label}
    </>
  )

  // The tag's own button and the remove button are siblings inside the pill.
  // A clickable, removable tag used to put one <button> inside the other,
  // which browsers and screen readers both handle unpredictably.
  return (
    <span className={cx('inspera', className)} style={pill} {...rest}>
      {onClick ? (
        <button type="button" className="inspera-interactive" onClick={onClick} style={bare}>{text}</button>
      ) : (
        text
      )}
      {removable && (
        <button
          type="button"
          className="inspera-interactive"
          aria-label={`Remove ${label}`}
          onClick={() => onRemove?.()}
          style={{
            ...bare,
            gap: undefined,
            justifyContent: 'center',
            marginLeft: 2,
            marginRight: -2,
            width: iconSize + 2,
            height: iconSize + 2,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: iconSize }} aria-hidden>
            close
          </span>
        </button>
      )}
    </span>
  )
}
