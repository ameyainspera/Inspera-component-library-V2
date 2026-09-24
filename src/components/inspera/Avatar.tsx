import { type CSSProperties, useEffect, useState } from 'react'
import { cx, type NativeAttrs } from './types'

export type AvatarSize = 'Small' | 'Medium' | 'Large'
export type AvatarStatus = 'None' | 'Online' | 'Offline' | 'Busy'

export interface AvatarProps {
  /** The person's name. Gives the initials and the accessible name. */
  name: string
  /** Photo URL. Without one - or if it fails to load - the initials show. */
  src?: string
  /** Material Symbols name shown instead of initials, e.g. for a guest. */
  icon?: string
  /** Diameter 32 / 40 / 56. */
  size?: AvatarSize
  /** Presence indicator dot. Announced with the name. */
  status?: AvatarStatus
}

const sizeMap: Record<AvatarSize, number> = { Small: 32, Medium: 40, Large: 56 }
const statusColor: Record<Exclude<AvatarStatus, 'None'>, string> = {
  Online: 'var(--success)',
  Offline: 'var(--gray-500)',
  Busy: 'var(--error)',
}

/** "Ada Lovelace" -> "AL"; a single name gives one letter. */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0]?.[0] ?? '')
  return letters.toUpperCase()
}

export default function Avatar({
  name,
  src,
  icon,
  size = 'Medium',
  status = 'None',
  className,
  style,
  ...rest
}: AvatarProps & NativeAttrs<'span', AvatarProps>) {
  const dim = sizeMap[size]
  // A photo that fails to load falls back to initials instead of a broken image.
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [src])
  const showImage = Boolean(src) && !failed

  const base: CSSProperties = {
    position: 'relative',
    width: dim,
    height: dim,
    borderRadius: 'var(--radius-pill)',
    background: 'var(--avatar-surface)',
    color: 'var(--gray-900)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
    fontFamily: 'var(--font-sans)',
    fontWeight: 500,
    fontSize: dim * 0.4,
  }

  const dot = dim * 0.28
  const accessibleName = status === 'None' ? name : `${name}, ${status}`

  return (
    <span
      className={cx('inspera', className)}
      style={{ position: 'relative', display: 'inline-flex', ...style }}
      role="img"
      aria-label={accessibleName}
      {...rest}
    >
      <span style={base} aria-hidden>
        {showImage ? (
          <img src={src} alt="" onError={() => setFailed(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : icon ? (
          <span className="material-symbols-outlined" style={{ fontSize: dim * 0.55, color: 'var(--gray-600)' }}>{icon}</span>
        ) : (
          <span>{initialsOf(name)}</span>
        )}
      </span>
      {status !== 'None' && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: dot,
            height: dot,
            borderRadius: 'var(--radius-pill)',
            background: statusColor[status],
            border: 'var(--border-width-strong) solid var(--white)',
          }}
        />
      )}
    </span>
  )
}
