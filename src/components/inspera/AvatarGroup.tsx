import { type CSSProperties } from 'react'
import Avatar, { type AvatarSize } from './Avatar'
import { cx, type NativeAttrs } from './types'

export interface AvatarGroupItem {
  /** The person's name: initials and accessible name. */
  name: string
  /** Photo URL. */
  src?: string
  /** Material Symbols name shown instead of initials. */
  icon?: string
}

export interface AvatarGroupProps {
  /** People to show, in order. */
  avatars: AvatarGroupItem[]
  /** How many to show before collapsing the rest into "+N". */
  max?: number
  /** Avatar diameter. */
  size?: AvatarSize
}

const sizeMap: Record<AvatarSize, number> = { Small: 32, Medium: 40, Large: 56 }

export default function AvatarGroup({
  avatars,
  max = 4,
  size = 'Medium',
  className,
  style,
  ...rest
}: AvatarGroupProps & NativeAttrs<'div', AvatarGroupProps>) {
  const dim = sizeMap[size]
  const overlap = Math.round(dim * 0.3)
  const visible = avatars.slice(0, max)
  const overflow = avatars.length - visible.length

  const ring: CSSProperties = {
    display: 'inline-flex',
    borderRadius: 'var(--radius-pill)',
    boxShadow: '0 0 0 2px var(--white)',
  }

  return (
    <div
      role="group"
      aria-label={`${avatars.length} ${avatars.length === 1 ? 'person' : 'people'}`}
      className={cx('inspera', className)}
      style={{ display: 'inline-flex', alignItems: 'center', fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {visible.map((a, i) => (
        <span key={`${a.name}-${i}`} style={{ ...ring, marginLeft: i === 0 ? 0 : -overlap, zIndex: i }}>
          <Avatar size={size} name={a.name} src={a.src} icon={a.icon} />
        </span>
      ))}
      {overflow > 0 && (
        <span
          role="img"
          aria-label={`and ${overflow} more`}
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
