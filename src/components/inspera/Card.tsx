import { type CSSProperties, type MouseEventHandler, type ReactNode } from 'react'
import { cx, type NativeAttrs } from './types'

export type CardElevation = 'Flat' | 'Raised' | 'Outlined'
export type CardPadding = 'Compact' | 'Default' | 'Spacious'

export interface CardProps {
  /** Heading for the card. Also the accessible name of an interactive card. */
  title?: string
  /** Short body copy. For anything richer, pass children instead. */
  body?: string
  /** Surface treatment. */
  elevation?: CardElevation
  /** Internal padding (12 / 16 / 24). */
  padding?: CardPadding
  /** The whole card becomes one click target, with hover elevation and a focus ring. */
  interactive?: boolean
  /** Card contents. Replaces title and body. */
  children?: ReactNode
  /** Fired when an interactive card is activated. */
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const padMap: Record<CardPadding, number> = { Compact: 12, Default: 16, Spacious: 24 }

export default function Card({
  title,
  body,
  elevation = 'Raised',
  padding = 'Default',
  interactive = false,
  children,
  onClick,
  className,
  style,
  ...rest
}: CardProps & NativeAttrs<'article', CardProps>) {
  const surface: CSSProperties & Record<string, string | number> = {
    // Resting shadow as a variable, so the hover rule in runtime.css can win.
    '--inspera-card-shadow': elevation === 'Raised' ? 'var(--shadow-200)' : 'none',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: '100%',
    padding: padMap[padding],
    borderRadius: 'var(--radius-lg)',
    background: 'var(--white)',
    color: 'var(--text-primary)',
    border: elevation === 'Outlined' ? 'var(--border-width-default) solid var(--border-strong)' : 'var(--border-width-default) solid transparent',
    textAlign: 'left',
    fontFamily: 'var(--font-sans)',
    cursor: 'default',
    ...style,
  }

  const content = children ?? (
    <>
      {title && <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>{title}</h3>}
      {body && <p style={{ margin: 0, fontSize: 16, lineHeight: 1.4, color: 'var(--gray-700)' }}>{body}</p>}
    </>
  )

  return (
    <article
      className={cx('inspera inspera-card-hover', interactive && 'inspera-card-hover--interactive', className)}
      style={surface}
      {...rest}
    >
      {content}
      {interactive && (
        // One transparent button over the whole card. Wrapping the card in a
        // <button> put headings and paragraphs inside it, which is invalid and
        // flattens them into a single run-on name for screen readers.
        <button
          type="button"
          className="inspera-interactive"
          aria-label={title}
          onClick={onClick}
          style={{
            position: 'absolute',
            inset: 0,
            margin: 0,
            padding: 0,
            border: 'none',
            borderRadius: 'inherit',
            background: 'transparent',
            cursor: 'pointer',
          }}
        />
      )}
    </article>
  )
}
