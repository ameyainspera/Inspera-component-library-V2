import { type CSSProperties, type KeyboardEvent, useRef } from 'react'
import { cx, type NativeAttrs } from './types'
import { useControllableState } from './useControllableState'

export type SegmentedControlSize = 'Small' | 'Medium'

export interface SegmentedControlItem {
  value: string
  /** Shown text. Defaults to `value`. */
  label?: string
}

export interface SegmentedControlProps {
  /** Names the group for assistive tech, e.g. "Date range". Not shown. */
  label: string
  /** Segments, in order. Plain strings when value and label match. */
  items: (string | SegmentedControlItem)[]
  /** Selected segment value. Controlled - pair with onChange. */
  value?: string
  /** Starting segment when uncontrolled. Defaults to the first. */
  defaultValue?: string
  /** Fired with the chosen segment's value. */
  onChange?: (value: string) => void
  /** Segment height. */
  size?: SegmentedControlSize
  /** Stretch to fill the row. */
  fullWidth?: boolean
  /** Blocks interaction and dims the control. */
  disabled?: boolean
}

const normalise = (o: string | SegmentedControlItem) =>
  typeof o === 'string' ? { value: o, label: o } : { value: o.value, label: o.label ?? o.value }

export default function SegmentedControl({
  label,
  items,
  value,
  defaultValue,
  onChange,
  size = 'Medium',
  fullWidth = false,
  disabled = false,
  className,
  style,
  ...rest
}: SegmentedControlProps & NativeAttrs<'div', SegmentedControlProps>) {
  const segments = items.map(normalise)
  const [active, setActive] = useControllableState(value, defaultValue ?? segments[0]?.value ?? '', onChange)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const height = size === 'Small' ? 32 : 40
  const index = Math.max(0, segments.findIndex((s) => s.value === active))

  // Arrow keys move the selection *and* the focus. Moving only the selection
  // left focus on a button that had just become tabIndex -1.
  const onKeyDown = (e: KeyboardEvent) => {
    if (disabled || segments.length === 0) return
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1
      : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = (index + step + segments.length) % segments.length
    setActive(segments[next].value)
    buttons.current[next]?.focus()
  }

  const track: CSSProperties = {
    display: 'inline-flex',
    gap: 2,
    padding: 4,
    background: 'var(--gray-100)',
    borderRadius: 'var(--radius-md)',
    width: fullWidth ? '100%' : undefined,
    opacity: disabled ? 0.38 : 1,
    ...style,
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      aria-disabled={disabled || undefined}
      className={cx('inspera', className)}
      style={track}
      onKeyDown={onKeyDown}
      {...rest}
    >
      {segments.map((seg, i) => {
        const isActive = i === index
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
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all var(--duration-fast) var(--easing-standard)',
        }
        return (
          <button
            key={seg.value}
            ref={(node) => { buttons.current[i] = node }}
            type="button"
            role="radio"
            className="inspera-interactive"
            aria-checked={isActive}
            tabIndex={isActive ? 0 : -1}
            disabled={disabled}
            style={segment}
            onClick={() => setActive(seg.value)}
          >
            {seg.label}
          </button>
        )
      })}
    </div>
  )
}
