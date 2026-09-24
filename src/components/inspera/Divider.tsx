import { type CSSProperties } from 'react'
import { cx, type NativeAttrs } from './types'

export type DividerOrientation = 'Horizontal' | 'Vertical'
export type DividerSpacing = 'Compact' | 'Default' | 'Spacious'

export interface DividerProps {
  /** Divider direction. A vertical divider needs a flex row around it. */
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
  className,
  style,
  ...rest
}: DividerProps & NativeAttrs<'div', DividerProps>) {
  const gap = spacingMap[spacing]
  const cls = cx('inspera', className)

  // <hr> is a separator already; the vertical rule sits in a row of text, so
  // it is an inline element that says what it is.
  const attrs = rest as Record<string, unknown>

  if (orientation === 'Vertical') {
    return (
      <span
        role="separator"
        aria-orientation="vertical"
        className={cls}
        style={{
          display: 'inline-block',
          width: 1,
          alignSelf: 'stretch',
          minHeight: '1em',
          background: 'var(--border)',
          margin: `0 ${gap}px`,
          ...style,
        }}
        {...attrs}
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
        className={cls}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          width: '100%',
          margin: `${gap}px 0`,
          fontFamily: 'var(--font-sans)',
          ...style,
        }}
        {...rest}
      >
        <span style={line} />
        <span aria-hidden style={{ fontSize: 13, color: 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>{label}</span>
        <span style={line} />
      </div>
    )
  }

  return (
    <hr
      className={cls}
      style={{
        border: 'none',
        height: 1,
        width: '100%',
        background: 'var(--border)',
        margin: `${gap}px 0`,
        ...style,
      }}
      {...attrs}
    />
  )
}
