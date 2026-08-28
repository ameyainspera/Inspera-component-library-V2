import { type CSSProperties } from 'react'

export type AvatarSize = 'Small' | 'Medium' | 'Large'
export type AvatarContent = 'Image' | 'Initials' | 'Icon'
export type AvatarStatus = 'None' | 'Online' | 'Offline' | 'Busy'

export interface AvatarProps {
  /** Diameter 32 / 40 / 56. Values: Small | Medium | Large. */
  size?: AvatarSize
  /** What fills the avatar. Values: Image | Initials | Icon. */
  content?: AvatarContent
  /** Presence indicator dot. Values: None | Online | Offline | Busy. */
  status?: AvatarStatus
  initials?: string
  imageSrc?: string
  alt?: string
  icon?: string
}

const sizeMap: Record<AvatarSize, number> = { Small: 32, Medium: 40, Large: 56 }
const statusColor: Record<Exclude<AvatarStatus, 'None'>, string> = {
  Online: 'var(--success)',
  Offline: 'var(--gray-500)',
  Busy: 'var(--error)',
}

export default function Avatar({
  size = 'Medium',
  content = 'Initials',
  status = 'None',
  initials = 'JC',
  imageSrc = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=112&h=112&fit=crop&auto=format',
  alt = 'User avatar',
  icon = 'person',
}: AvatarProps) {
  const dim = sizeMap[size]
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
  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}>
      <span style={base} role="img" aria-label={content === 'Initials' ? `${alt} (${initials})` : alt}>
        {content === 'Image' && (
          <img src={imageSrc} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
        {content === 'Initials' && <span>{initials}</span>}
        {content === 'Icon' && (
          <span className="material-symbols-outlined" style={{ fontSize: dim * 0.55, color: 'var(--gray-600)' }} aria-hidden>{icon}</span>
        )}
      </span>
      {status !== 'None' && (
        <span
          aria-label={status}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: dot,
            height: dot,
            borderRadius: '9999px',
            background: statusColor[status],
            border: '2px solid var(--white)',
          }}
        />
      )}
    </span>
  )
}
