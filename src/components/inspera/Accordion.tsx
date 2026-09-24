import { type CSSProperties, type KeyboardEvent, type ReactNode, useId, useRef } from 'react'
import { cx, type NativeAttrs } from './types'
import { useControllableState } from './useControllableState'

export type AccordionSelection = 'Single' | 'Multiple'
export type AccordionIconPosition = 'Left' | 'Right'

export interface AccordionItem {
  /** Stable key. Defaults to the title. */
  id?: string
  title: string
  content: ReactNode
}

export interface AccordionProps {
  /** Accordion sections. */
  items: AccordionItem[]
  /** Whether one or several sections can be open at once. */
  selection?: AccordionSelection
  /** Open section indexes. Controlled - pair with onChange. */
  value?: number[]
  /** Sections open at first, when uncontrolled. All closed by default. */
  defaultValue?: number[]
  /** Fired with the open section indexes after a toggle. */
  onChange?: (open: number[]) => void
  /** Chevron placement. */
  iconPosition?: AccordionIconPosition
  /** Heading level wrapping each trigger, to fit the page outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6
}

export default function Accordion({
  items,
  selection = 'Single',
  value,
  defaultValue = [],
  onChange,
  iconPosition = 'Right',
  headingLevel = 3,
  className,
  style,
  ...rest
}: AccordionProps & NativeAttrs<'div', AccordionProps>) {
  const baseId = useId()
  const [open, setOpen] = useControllableState(value, defaultValue, onChange)
  const triggers = useRef<(HTMLButtonElement | null)[]>([])
  const Heading = `h${headingLevel}` as const

  const toggle = (i: number) => {
    if (open.includes(i)) setOpen(open.filter((x) => x !== i))
    else setOpen(selection === 'Single' ? [i] : [...open, i])
  }

  // Arrow keys, Home and End move between section headers.
  const onKey = (e: KeyboardEvent, i: number) => {
    const last = items.length - 1
    const target =
      e.key === 'ArrowDown' ? (i === last ? 0 : i + 1)
        : e.key === 'ArrowUp' ? (i === 0 ? last : i - 1)
        : e.key === 'Home' ? 0
        : e.key === 'End' ? last
        : null
    if (target === null) return
    e.preventDefault()
    triggers.current[target]?.focus()
  }

  const chevron = (isOpen: boolean): CSSProperties => ({
    fontSize: 24,
    color: 'var(--muted-foreground)',
    transition: 'transform var(--duration-normal) var(--easing-standard)',
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  })

  return (
    <div
      className={cx('inspera', className)}
      style={{
        width: '100%',
        border: 'var(--border-width-default) solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        fontFamily: 'var(--font-sans)',
        background: 'var(--white)',
        ...style,
      }}
      {...rest}
    >
      {items.map((item, i) => {
        const isOpen = open.includes(i)
        const headerId = `${baseId}-h-${i}`
        const panelId = `${baseId}-p-${i}`
        return (
          <div key={item.id ?? `${item.title}-${i}`} style={{ borderTop: i === 0 ? 'none' : 'var(--border-width-default) solid var(--border)' }}>
            <Heading style={{ margin: 0 }}>
              <button
                ref={(node) => { triggers.current[i] = node }}
                type="button"
                id={headerId}
                className="inspera-interactive inspera-row"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                onKeyDown={(e) => onKey(e, i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: iconPosition === 'Left' ? 'row-reverse' : 'row',
                  gap: 12,
                  width: '100%',
                  padding: '14px 16px',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  font: 'inherit',
                  fontSize: 16,
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                }}
              >
                <span style={{ flex: 1, textAlign: 'left' }}>{item.title}</span>
                <span className="material-symbols-outlined" style={chevron(isOpen)} aria-hidden>
                  expand_more
                </span>
              </button>
            </Heading>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              hidden={!isOpen}
              style={{
                padding: isOpen ? '0 16px 16px' : '0 16px',
                fontSize: 14,
                lineHeight: 1.5,
                color: 'var(--gray-700)',
              }}
            >
              {item.content}
            </div>
          </div>
        )
      })}
    </div>
  )
}
