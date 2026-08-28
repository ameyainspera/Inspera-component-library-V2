import { type CSSProperties, useState } from 'react'

export type TabsStyle = 'Underline' | 'Contained'
export type TabsSize = 'Small' | 'Medium'

export interface TabItem {
  label: string
  icon?: string
}

export interface TabsProps {
  items?: TabItem[]
  /** Visual treatment. Values: Underline | Contained. */
  style?: TabsStyle
  /** Tab height 40 / 48. Values: Small | Medium. */
  size?: TabsSize
  /** Stretch tabs to fill the row. Values: true | false. */
  fullWidth?: boolean
  value?: number
  onChange?: (index: number) => void
}

const defaultItems: TabItem[] = [
  { label: 'Overview' },
  { label: 'Questions' },
  { label: 'Settings' },
  { label: 'Results' },
]

export default function Tabs({
  items = defaultItems,
  style = 'Underline',
  size = 'Medium',
  fullWidth = false,
  value,
  onChange,
}: TabsProps) {
  const [internal, setInternal] = useState(0)
  const active = value ?? internal
  const h = size === 'Small' ? 40 : 48
  const contained = style === 'Contained'

  const list: CSSProperties = {
    display: 'flex',
    gap: contained ? 4 : 0,
    padding: contained ? 4 : 0,
    borderBottom: contained ? 'none' : '1px solid var(--border-strong)',
    background: contained ? 'var(--gray-100)' : 'transparent',
    borderRadius: contained ? 'var(--radius-md)' : 0,
    width: fullWidth ? '100%' : 'auto',
  }

  return (
    <div role="tablist" style={list} aria-label="Section tabs">
      {items.map((item, i) => {
        const on = i === active
        const tab: CSSProperties = {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          height: contained ? h - 8 : h,
          padding: '0 16px',
          flex: fullWidth ? 1 : 'none',
          borderTop: 'none',
          borderRight: 'none',
          borderLeft: 'none',
          background: contained && on ? '#FFFFFF' : 'transparent',
          borderRadius: contained ? 'var(--radius-sm)' : 0,
          boxShadow: contained && on ? 'var(--shadow-100)' : 'none',
          borderBottom: !contained ? `2px solid ${on ? 'var(--primary)' : 'transparent'}` : 'none',
          color: on ? 'var(--primary)' : 'var(--gray-700)',
          fontFamily: 'var(--font-sans)',
          fontSize: 16,
          fontWeight: 500,
          cursor: 'pointer',
          marginBottom: !contained ? -1 : 0,
          transition: 'color 120ms ease, border-color 120ms ease',
        }
        return (
          <button
            key={item.label}
            type="button"
            role="tab"
            aria-selected={on}
            style={tab}
            onClick={() => { setInternal(i); onChange?.(i) }}
          >
            {item.icon && <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>{item.icon}</span>}
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
