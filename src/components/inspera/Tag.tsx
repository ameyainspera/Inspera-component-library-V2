import { type CSSProperties } from 'react'

export type TagIntent = 'Neutral' | 'Info' | 'Success' | 'Warning' | 'Error'
export type TagSize = 'Small' | 'Medium'

export interface TagProps {
  /** Tag text. */
  label: string
  /** Semantic color. Values: Neutral | Info | Success | Warning | Error. */
  intent?: TagIntent
  /** Tag height. Values: Small | Medium. */
  size?: TagSize
  /** Show a remove affordance. Values: true | false. */
  removable?: boolean
  /** Optional leading icon. */
  leadingIcon?: string
  onRemove?: () => void
  onClick?: () => void
}

const intentMap: Record<TagIntent, { bg: string; fg: string }> = {
  Neutral: { bg: 'var(--surface-neutral)', fg: 'var(--gray-900)' },
  Info: { bg: 'var(--info-surface)', fg: 'var(--info)' },
  Success: { bg: 'var(--success-surface)', fg: 'var(--success)' },
  Warning: { bg: 'var(--warning-surface)', fg: 'var(--warning)' },
  Error: { bg: 'var(--error-surface)', fg: 'var(--error)' },
}

export default function Tag({
  label,
  intent = 'Neutral',
  size = 'Medium',
  removable = false,
  leadingIcon,
  onRemove,
  onClick,
}: TagProps) {
  const c = intentMap[intent]
  const small = size === 'Small'
  const clickable = !!onClick

  const style: CSSProperties = {
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
    border: 'none',
    cursor: clickable ? 'pointer' : 'default',
  }

  const iconSize = small ? 14 : 16

  const inner = (
    <>
      {leadingIcon && (
        <span className="material-symbols-outlined" style={{ fontSize: iconSize, fontVariationSettings: "'FILL' 1" }} aria-hidden>
          {leadingIcon}
        </span>
      )}
      {label}
      {removable && (
        <button
          type="button"
          aria-label={`Remove ${label}`}
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 2,
            marginRight: -2,
            padding: 0,
            width: iconSize + 2,
            height: iconSize + 2,
            border: 'none',
            background: 'transparent',
            color: 'inherit',
            cursor: 'pointer',
            borderRadius: 'var(--radius-pill)',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: iconSize }} aria-hidden>
            close
          </span>
        </button>
      )}
    </>
  )

  if (clickable) {
    return (
      <button type="button" onClick={onClick} style={style}>
        {inner}
      </button>
    )
  }

  return <span style={style}>{inner}</span>
}
