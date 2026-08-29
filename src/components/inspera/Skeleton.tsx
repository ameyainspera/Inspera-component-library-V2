import { type CSSProperties } from 'react'

export type SkeletonVariant = 'Text' | 'Rect' | 'Circle'

export interface SkeletonProps {
  /** Placeholder shape. */
  variant?: SkeletonVariant
  /** Explicit width. */
  width?: string | number
  /** Explicit height. */
  height?: string | number
  /** Number of text lines. Only applies to the Text variant. */
  lines?: number
  /** Corner radius override. Match the shape being stood in for. */
  radius?: string | number
}

const shimmer: CSSProperties = {
  backgroundImage: 'linear-gradient(90deg, var(--gray-200) 25%, var(--gray-100) 37%, var(--gray-200) 63%)',
  backgroundSize: '400% 100%',
  animation: 'inspera-shimmer 1.4s ease infinite',
}

export default function Skeleton({
  variant = 'Text',
  width,
  height,
  lines = 1,
  radius,
}: SkeletonProps) {
  if (variant === 'Circle') {
    const size = width ?? height ?? 40
    return (
      <span
        role="presentation"
        aria-hidden
        style={{
          ...shimmer,
          display: 'inline-block',
          width: size,
          height: height ?? size,
          borderRadius: radius ?? 'var(--radius-pill)',
        }}
      />
    )
  }

  if (variant === 'Rect') {
    return (
      <span
        role="presentation"
        aria-hidden
        style={{
          ...shimmer,
          display: 'block',
          width: width ?? '100%',
          height: height ?? 120,
          borderRadius: radius ?? 'var(--radius-md)',
        }}
      />
    )
  }

  const count = Math.max(1, lines)
  return (
    <span role="presentation" aria-hidden style={{ display: 'flex', flexDirection: 'column', gap: 8, width: width ?? '100%' }}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          style={{
            ...shimmer,
            display: 'block',
            width: count > 1 && i === count - 1 ? '60%' : '100%',
            height: height ?? 12,
            borderRadius: radius ?? 'var(--radius-sm)',
          }}
        />
      ))}
    </span>
  )
}
