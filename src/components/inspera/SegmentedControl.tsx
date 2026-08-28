import { type CSSProperties, useId, useState } from 'react'

export type SegmentedControlSize = 'Small' | 'Medium'

export interface SegmentedControlProps {
  items?: string[]
  value?: number
  size?: SegmentedControlSize
  fullWidth?: boolean
  onChange?: (index: number) => void
}

export default function SegmentedControl({
  items = ['Day', 'Week', 'Month'],
  value,
  size = 'Medium',
  fullWidth = false,
  onChange,
}: SegmentedControlProps) {
  const groupId = useId()
  const [internal, setInternal] = useState(0)
  const active = value ?? internal
  const height = size === 'Small' ? 32 : 40

  const select = (i: number) => {
    setInternal(i)
    onChange?.(i)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      select((active + 1) % items.length)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      select((active - 1 + items.length) % items.length)
    }
  }

  const track: CSSProperties = {
    display: 'inline-flex',
    gap: 2,
    padding: 4,
    background: 'var(--gray-100)',
    borderRadius: 'var(--radius-md)',
    width: fullWidth ? '100%' : undefined,
  }

  return (
    <div role="radiogroup" style={track} onKeyDown={onKeyDown}>
      {items.map((item, i) => {
        const isActive = i === active
        const segment: CSSProperties = {
          flex: fullWidth ? 1 : undefined,
          height,
          padding: '0 16px',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          background: isActive ? 'var(--surface)' : 'transparent',
          boxShadow: isActive ? 'var(--shadow-100)' : 'none',
          color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
          fontFamily: 'var(--font-sans)',
          fontSize: 14,
          fontWeight: isActive ? 600 : 500,
          cursor: 'pointer',
          transition: 'all 120ms ease',
        }
        return (
          <button
            key={item}
            type="button"
            role="radio"
            aria-checked={isActive}
            tabIndex={isActive ? 0 : -1}
            id={`${groupId}-${i}`}
            style={segment}
            onClick={() => select(i)}
          >
            {item}
          </button>
        )
      })}
    </div>
  )
}
