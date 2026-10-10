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
  // Button's heights and type at each size - Text Input's heights too - so the
  // control lines up with them in a toolbar.
  const height = size === 'Small' ? 'var(--control-height-sm)' : 'var(--control-height-md)'
  const type = size === 'Small' ? 'medium-14' : 'default-16-regular'
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

  const group: CSSProperties = {
    display: 'inline-flex',
    width: fullWidth ? '100%' : undefined,
    opacity: disabled ? 0.38 : 1,
    ...style,
  }

  const last = segments.length - 1
  const r = 'var(--radius-sm)'

  return (
    <div
      role="radiogroup"
      aria-label={label}
      aria-disabled={disabled || undefined}
      className={cx('inspera', className)}
      style={group}
      onKeyDown={onKeyDown}
      {...rest}
    >
      {segments.map((seg, i) => {
        const isActive = i === index
        // Joined, outlined segments, the look of the product's own switches.
        // Neighbours overlap by one border so each join is a single line, and
        // the selected segment sits above them so its blue border shows on
        // all four sides. Fills and colours go through runtime.css
        // (.inspera-segment), where an unselected segment's hover can win.
        const segment: CSSProperties & Record<`--${string}`, string> = {
          '--inspera-bg': isActive ? 'var(--blue-100)' : 'var(--surface)',
          '--inspera-fg': isActive ? 'var(--primary)' : 'var(--gray-800)',
          '--inspera-border': isActive ? 'var(--blue-700)' : 'var(--border-control)',
          position: 'relative',
          zIndex: isActive ? 1 : undefined,
          flex: fullWidth ? 1 : undefined,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height,
          padding: '0 12px',
          marginLeft: i === 0 ? 0 : 'calc(var(--border-width-default) * -1)',
          borderWidth: 'var(--border-width-default)',
          borderStyle: 'solid',
          borderRadius: `${i === 0 ? r : 0} ${i === last ? r : 0} ${i === last ? r : 0} ${i === 0 ? r : 0}`,
          fontFamily: 'var(--font-sans)',
          fontSize: `var(--${type}-size)`,
          lineHeight: `var(--${type}-line-height)`,
          // Weight as well as colour marks the selection: blue against gray
          // text alone would leave it to colour (WCAG 1.4.1).
          fontWeight: isActive ? 600 : 400,
          whiteSpace: 'nowrap',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }
        return (
          <button
            key={seg.value}
            ref={(node) => { buttons.current[i] = node }}
            type="button"
            role="radio"
            className="inspera-interactive inspera-segment"
            aria-checked={isActive}
            tabIndex={isActive ? 0 : -1}
            disabled={disabled}
            style={segment}
            onClick={() => setActive(seg.value)}
          >
            <span className="inspera-segment__label" data-label={seg.label}>{seg.label}</span>
          </button>
        )
      })}
    </div>
  )
}
