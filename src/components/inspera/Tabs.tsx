import { type CSSProperties, type KeyboardEvent, type ReactNode, useId, useRef } from 'react'
import { cx, type NativeAttrs } from './types'
import { useControllableState } from './useControllableState'

export type TabsVariant = 'Underline' | 'Contained'
export type TabsSize = 'Small' | 'Medium'

export interface TabItem {
  label: string
  /** Identifies the tab in value/onChange. Defaults to the label. */
  value?: string
  icon?: string
  /** The tab's panel. When items carry content, Tabs renders the panels too. */
  content?: ReactNode
}

export interface TabsProps {
  /** The tabs, in order. */
  items: TabItem[]
  /** Visual treatment. */
  variant?: TabsVariant
  /** Tab height 40 / 48. */
  size?: TabsSize
  /** Stretch tabs to fill the row. */
  fullWidth?: boolean
  /** Active tab's value. Controlled - pair with onChange. */
  value?: string
  /** Starting tab when uncontrolled. Defaults to the first. */
  defaultValue?: string
  /** Fired with the newly selected tab's value. */
  onChange?: (value: string) => void
  /** Names the tab list for assistive tech, when no heading does. */
  label?: string
}

export default function Tabs({
  items,
  variant = 'Underline',
  size = 'Medium',
  fullWidth = false,
  value,
  defaultValue,
  onChange,
  label,
  className,
  style,
  ...rest
}: TabsProps & NativeAttrs<'div', TabsProps>) {
  const id = useId()
  const valueOf = (item: TabItem) => item.value ?? item.label
  const [active, setActive] = useControllableState(value, defaultValue ?? (items[0] ? valueOf(items[0]) : ''), onChange)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const index = Math.max(0, items.findIndex((it) => valueOf(it) === active))
  const hasPanels = items.some((it) => it.content !== undefined)
  const h = size === 'Small' ? 40 : 48
  const contained = variant === 'Contained'

  // One tab stop for the whole list; arrows, Home and End move between tabs
  // and select as they go.
  const onKeyDown = (e: KeyboardEvent) => {
    const last = items.length - 1
    const next =
      e.key === 'ArrowRight' ? (index === last ? 0 : index + 1)
        : e.key === 'ArrowLeft' ? (index === 0 ? last : index - 1)
        : e.key === 'Home' ? 0
        : e.key === 'End' ? last
        : null
    if (next === null) return
    e.preventDefault()
    setActive(valueOf(items[next]))
    tabs.current[next]?.focus()
  }

  const list: CSSProperties = {
    display: 'flex',
    gap: contained ? 4 : 0,
    padding: contained ? 4 : 0,
    borderBottom: contained ? 'none' : 'var(--border-width-default) solid var(--border-strong)',
    background: contained ? 'var(--gray-100)' : 'transparent',
    borderRadius: contained ? 'var(--radius-sm)' : 0,
    width: fullWidth ? '100%' : 'auto',
  }

  // Without panels the tab list is the whole component, so it takes the
  // passthrough props itself rather than gaining an empty wrapper.
  const tablist = (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      {...(hasPanels ? { style: list } : { className: cx('inspera', className), style: { ...list, ...style }, ...rest })}
    >
      {items.map((item, i) => {
        const on = i === index
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
          background: contained && on ? 'var(--white)' : 'transparent',
          borderRadius: contained ? 'var(--radius-xs)' : 0,
          boxShadow: contained && on ? 'var(--shadow-100)' : 'none',
          borderBottom: !contained ? `2px solid ${on ? 'var(--primary)' : 'transparent'}` : 'none',
          color: on ? 'var(--primary)' : 'var(--gray-700)',
          fontFamily: 'var(--font-sans)',
          fontSize: 16,
          fontWeight: 500,
          cursor: 'pointer',
          marginBottom: !contained ? -1 : 0,
          transition: 'color var(--duration-fast) var(--easing-standard), border-color var(--duration-fast) var(--easing-standard)',
        }
        return (
          <button
            key={`${valueOf(item)}-${i}`}
            ref={(node) => { tabs.current[i] = node }}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            className="inspera-interactive"
            aria-selected={on}
            aria-controls={hasPanels ? `${id}-panel-${i}` : undefined}
            tabIndex={on ? 0 : -1}
            style={tab}
            onClick={() => setActive(valueOf(item))}
          >
            {item.icon && <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>{item.icon}</span>}
            {item.label}
          </button>
        )
      })}
    </div>
  )

  if (!hasPanels) return tablist

  return (
    <div className={cx('inspera', className)} style={{ fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      {tablist}
      {hasPanels && items.map((item, i) => (
        <div
          key={`${valueOf(item)}-${i}`}
          role="tabpanel"
          id={`${id}-panel-${i}`}
          aria-labelledby={`${id}-tab-${i}`}
          hidden={i !== index}
          tabIndex={0}
          style={{ paddingTop: 16 }}
        >
          {item.content}
        </div>
      ))}
    </div>
  )
}
