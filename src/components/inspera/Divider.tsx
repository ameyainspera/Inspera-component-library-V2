import { type CSSProperties } from 'react'

export type DividerOrientation = 'Horizontal' | 'Vertical'
export type DividerSpacing = 'Compact' | 'Default' | 'Spacious'

export interface DividerProps {
  /** Divider direction. */
  orientation?: DividerOrientation
  /** Optional centered label (horizontal only). */
  label?: string
  /** Surrounding margin. */
  spacing?: DividerSpacing
}

const spacingMap: Record<DividerSpacing, number> = { Compact: 8, Default: 16, Spacious: 24 }

export default function Divider({
  orientation = 'Horizontal',
  label,
  spacing = 'Default',
}: DividerProps) {
  const gap = spacingMap[spacing]

  if (orientation === 'Vertical') {
    return (
      <span
        role="separator"
        aria-orientation="vertical"
        style={{
          display: 'inline-block',
          width: 1,
          alignSelf: 'stretch',
          minHeight: '1em',
          background: 'var(--border)',
          margin: `0 ${gap}px`,
        }}
      />
    )
  }

  if (label) {
    const line: CSSProperties = { flex: 1, height: 1, background: 'var(--border)' }
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        aria-label={label}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          width: '100%',
          margin: `${gap}px 0`,
          fontFamily: 'var(--font-sans)',
        }}
      >
        <span style={line} />
        <span style={{ fontSize: 13, color: 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>{label}</span>
        <span style={line} />
      </div>
    )
  }

  return (
    <hr
      role="separator"
      aria-orientation="horizontal"
      style={{
        border: 'none',
        height: 1,
        width: '100%',
        background: 'var(--border)',
        margin: `${gap}px 0`,
      }}
    />
  )
}
