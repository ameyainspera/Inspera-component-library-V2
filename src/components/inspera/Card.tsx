import { type CSSProperties, type MouseEventHandler, type ReactNode } from 'react'
import { cx, type ForceState, type NativeAttrs } from './types'
import { useControllableState } from './useControllableState'

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
  /** The whole card becomes one click target: it lifts on hover, sinks when pressed and takes a focus ring. */
  interactive?: boolean
  /**
   * Selected state. Controlled - pair with onSelectedChange. Setting it makes
   * the card a toggle: interactive, and selected or not with each click.
   */
  selected?: boolean
  /** Starting selection when uncontrolled. Also makes the card a toggle. */
  defaultSelected?: boolean
  /** Fired with the new selection when the card is clicked. */
  onSelectedChange?: (selected: boolean) => void
  /** Card contents. Replaces title and body. */
  children?: ReactNode
  /** Fired when an interactive card is activated. */
  onClick?: MouseEventHandler<HTMLButtonElement>
  /** @internal Freezes a hover, focus or pressed look for the docs gallery. */
  forceState?: ForceState
}

const padMap: Record<CardPadding, number> = { Compact: 12, Default: 16, Spacious: 24 }

/** The selected tick's size, plus the gap kept between it and the content. */
const TICK = 20
const TICK_GAP = 8

export default function Card({
  title,
  body,
  elevation = 'Raised',
  padding = 'Default',
  interactive = false,
  selected,
  defaultSelected,
  onSelectedChange,
  children,
  onClick,
  forceState,
  className,
  style,
  ...rest
}: CardProps & NativeAttrs<'article', CardProps>) {
  const selectable = selected !== undefined || defaultSelected !== undefined || onSelectedChange !== undefined
  const [isSelected, setSelected] = useControllableState(selected, defaultSelected ?? false, onSelectedChange)
  const clickable = interactive || selectable
  const pad = padMap[padding]

  const surface: CSSProperties & Record<string, string | number> = {
    // Resting shadow as a variable, and the white fill in runtime.css, so the
    // hover and pressed rules there can win.
    '--inspera-card-shadow': elevation === 'Raised' ? 'var(--shadow-200)' : 'none',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: '100%',
    padding: pad,
    // Room for the tick, kept whether or not the card is selected so that
    // selecting it never reflows the content.
    ...(selectable ? { paddingRight: pad + TICK + TICK_GAP } : null),
    borderRadius: 'var(--radius-lg)',
    color: 'var(--text-primary)',
    borderWidth: 'var(--border-width-default)',
    borderStyle: 'solid',
    // Inline, so selected has to be decided here: a class could not outrank it.
    borderColor: selectable && isSelected ? 'var(--primary)' : elevation === 'Outlined' ? 'var(--border-strong)' : 'transparent',
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
      className={cx(
        'inspera inspera-card-hover',
        clickable && 'inspera-card-hover--interactive',
        isSelected && selectable && 'inspera-card-hover--selected',
        className,
      )}
      data-force-state={clickable ? forceState : undefined}
      style={surface}
      {...rest}
    >
      {content}
      {selectable && isSelected && (
        // A second cue besides the border colour, so selection does not rest on colour alone.
        <span
          className="material-symbols-outlined"
          aria-hidden
          style={{ position: 'absolute', top: pad, right: pad, fontSize: TICK, color: 'var(--primary)' }}
        >
          check_circle
        </span>
      )}
      {clickable && (
        // One transparent button over the whole card. Wrapping the card in a
        // <button> put headings and paragraphs inside it, which is invalid and
        // flattens them into a single run-on name for screen readers.
        <button
          type="button"
          className="inspera-interactive"
          data-force-state={forceState}
          aria-label={title}
          aria-pressed={selectable ? isSelected : undefined}
          onClick={(e) => {
            if (selectable) setSelected(!isSelected)
            onClick?.(e)
          }}
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
