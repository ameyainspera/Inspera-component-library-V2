import { type CSSProperties } from 'react'
import Avatar, { type AvatarContent, type AvatarSize } from './Avatar'

export interface AvatarGroupItem {
  content?: AvatarContent
  name?: string
}

export interface AvatarGroupProps {
  avatars?: AvatarGroupItem[]
  max?: number
  size?: AvatarSize
}

const sizeMap: Record<AvatarSize, number> = { Small: 32, Medium: 40, Large: 56 }

const defaultAvatars: AvatarGroupItem[] = [
  { content: 'Image', name: 'Amelia Hart' },
  { content: 'Initials', name: 'Noah Bennett' },
  { content: 'Image', name: 'Olivia Chen' },
  { content: 'Initials', name: 'Liam Foster' },
  { content: 'Icon', name: 'Guest user' },
]

function initialsFor(name?: string): string {
  if (!name) return '??'
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '??'
}

export default function AvatarGroup({
  avatars = defaultAvatars,
  max = 4,
  size = 'Medium',
}: AvatarGroupProps) {
  const dim = sizeMap[size]
  const overlap = Math.round(dim * 0.3)
  const visible = avatars.slice(0, max)
  const overflow = avatars.length - visible.length

  const ring: CSSProperties = {
    display: 'inline-flex',
    borderRadius: '9999px',
    boxShadow: '0 0 0 2px var(--white)',
  }

  return (
    <div
      role="group"
      aria-label={`${avatars.length} participants`}
      style={{ display: 'inline-flex', alignItems: 'center', fontFamily: 'var(--font-sans)' }}
    >
      {visible.map((a, i) => (
        <span key={i} style={{ ...ring, marginLeft: i === 0 ? 0 : -overlap, zIndex: i }}>
          <Avatar
            size={size}
            content={a.content ?? 'Initials'}
            initials={initialsFor(a.name)}
            alt={a.name ?? 'Participant'}
          />
        </span>
      ))}
      {overflow > 0 && (
        <span
          aria-label={`${overflow} more`}
          style={{
            ...ring,
            marginLeft: -overlap,
            zIndex: visible.length,
            width: dim,
            height: dim,
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--gray-200)',
            color: 'var(--gray-700)',
            fontSize: dim * 0.34,
            fontWeight: 500,
          }}
        >
          +{overflow}
        </span>
      )}
    </div>
  )
}
