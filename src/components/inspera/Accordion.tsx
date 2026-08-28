import { type CSSProperties, type ReactNode, useId, useState } from 'react'

export type AccordionType = 'Single' | 'Multiple'
export type AccordionIconPosition = 'Left' | 'Right'

export interface AccordionItem {
  title: string
  content: ReactNode
}

export interface AccordionProps {
  items?: AccordionItem[]
  type?: AccordionType
  defaultOpenIndex?: number
  iconPosition?: AccordionIconPosition
}

const defaultItems: AccordionItem[] = [
  { title: 'How is my exam graded?', content: 'Responses are marked against the rubric configured for each question, with results released once grading is complete.' },
  { title: 'Can I review my answers?', content: 'You can revisit any answered question before submitting, provided the section allows backward navigation.' },
  { title: 'What happens if I lose connection?', content: 'Your progress is saved automatically. Reconnect and resume from where you left off within the allotted time.' },
]

export default function Accordion({
  items = defaultItems,
  type = 'Single',
  defaultOpenIndex = 0,
  iconPosition = 'Right',
}: AccordionProps) {
  const baseId = useId()
  const [open, setOpen] = useState<Set<number>>(
    () => (defaultOpenIndex >= 0 ? new Set([defaultOpenIndex]) : new Set()),
  )

  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(i)) {
        next.delete(i)
      } else {
        if (type === 'Single') next.clear()
        next.add(i)
      }
      return next
    })
  }

  const chevron = (isOpen: boolean): CSSProperties => ({
    fontSize: 24,
    color: 'var(--muted-foreground)',
    transition: 'transform 160ms ease',
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  })

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 480,
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        fontFamily: 'var(--font-sans)',
        background: 'var(--white)',
      }}
    >
      {items.map((item, i) => {
        const isOpen = open.has(i)
        const headerId = `${baseId}-h-${i}`
        const panelId = `${baseId}-p-${i}`
        return (
          <div key={i} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}>
            <h3 style={{ margin: 0 }}>
              <button
                type="button"
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: iconPosition === 'Left' ? 'row-reverse' : 'row',
                  gap: 12,
                  width: '100%',
                  padding: '14px 16px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: iconPosition === 'Left' ? 'left' : 'left',
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
            </h3>
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
