import { type CSSProperties } from 'react'

export type TagIntent = 'Neutral' | 'Info' | 'Success' | 'Warning' | 'Error'
export type TagSize = 'Small' | 'Medium'

export interface TagProps {
  label: string
  intent?: TagIntent
  size?: TagSize
  removable?: boolean
  leadingIcon?: string
  onRemove?: () => void
  onClick?: () => void
}

const intentMap: Record<TagIntent, { bg: string; fg: string }> = {
  Neutral: { bg: '#F0F0F0', fg: '#272727' },
  Info: { bg: '#E1F5FE', fg: '#0288D1' },
  Success: { bg: '#E8F5E9', fg: '#2E7D32' },
  Warning: { bg: '#FFF3E0', fg: '#EF6C00' },
  Error: { bg: '#FFEBEE', fg: '#D32F2F' },
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
