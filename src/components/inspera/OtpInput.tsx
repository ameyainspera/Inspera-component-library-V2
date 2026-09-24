import { type ChangeEvent, type ClipboardEvent, type CSSProperties, type KeyboardEvent, useEffect, useId, useRef, useState } from 'react'
import { labelStyle } from './FormField'
import { cx, type ForceState, type NativeAttrs } from './types'

export interface OtpInputProps {
  /** Names the code, e.g. "Verification code". Required: it labels the group. */
  label: string
  /** Number of digit boxes. */
  length?: number
  /** Current code. Controlled - pair with onChange. */
  value?: string
  /** Starting code when uncontrolled. */
  defaultValue?: string
  /** Fired with the digits entered so far; complete when its length equals `length`. */
  onChange?: (value: string) => void
  /** Render the visible label above the boxes. */
  showLabel?: boolean
  /** Marks every box invalid: red border and `aria-invalid`. */
  error?: boolean
  /** Blocks input and dims the boxes. */
  disabled?: boolean
  /** @internal Freezes a focus look on the first box for the docs gallery. */
  forceState?: ForceState
}

const toSlots = (code: string, length: number) =>
  Array.from({ length }, (_, i) => code[i] ?? '')

export default function OtpInput({
  label,
  length = 6,
  value,
  defaultValue = '',
  onChange,
  showLabel = false,
  error = false,
  disabled = false,
  forceState,
  className,
  style,
  ...rest
}: OtpInputProps & NativeAttrs<'div', OtpInputProps>) {
  const id = useId()
  const refs = useRef<(HTMLInputElement | null)[]>([])

  // One slot per box. Keeping the code as a plain string collapsed gaps: a
  // digit typed into box 3 with boxes 1-2 empty landed in box 1, and Backspace
  // in the middle shifted every later digit left.
  const [slots, setSlots] = useState(() => toSlots(value ?? defaultValue, length))

  // A controlled value that differs from what the boxes show wins. The echo of
  // our own onChange (gaps removed) is equal, so it leaves the gaps alone.
  useEffect(() => {
    if (value !== undefined && value !== slots.join('')) setSlots(toSlots(value, length))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, length])

  const commit = (next: string[]) => {
    setSlots(next)
    onChange?.(next.join(''))
  }

  const setAt = (i: number, ch: string) => {
    const next = slots.slice()
    next[i] = ch
    commit(next)
  }

  const onKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (slots[i]) setAt(i, '')
      else if (i > 0) {
        setAt(i - 1, '')
        refs.current[i - 1]?.focus()
      }
    } else if (e.key === 'Delete') {
      e.preventDefault()
      setAt(i, '')
    } else if (e.key === 'ArrowLeft' && i > 0) {
      e.preventDefault()
      refs.current[i - 1]?.focus()
    } else if (e.key === 'ArrowRight' && i < length - 1) {
      e.preventDefault()
      refs.current[i + 1]?.focus()
    }
  }

  const onInput = (i: number, e: ChangeEvent<HTMLInputElement>) => {
    // The box may briefly hold the old digit plus the new one; keep the newest.
    const ch = e.target.value.replace(/\D/g, '').slice(-1)
    if (!ch) return
    setAt(i, ch)
    if (i < length - 1) refs.current[i + 1]?.focus()
  }

  const onPaste = (i: number, e: ClipboardEvent) => {
    e.preventDefault()
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length - i)
    if (!digits) return
    const next = slots.slice()
    for (let k = 0; k < digits.length; k++) next[i + k] = digits[k]
    commit(next)
    refs.current[Math.min(i + digits.length, length - 1)]?.focus()
  }

  const boxes = (
      <div
        role="group"
        aria-label={showLabel ? undefined : label}
        aria-labelledby={showLabel ? `${id}-label` : undefined}
        {...(showLabel
          ? { style: { display: 'inline-flex', gap: 8 } }
          : { className: cx('inspera', className), style: { display: 'inline-flex', gap: 8, ...style }, ...rest })}
      >
        {slots.map((ch, i) => {
          // Border and ring live in CSS (.inspera-field in runtime.css) so a box
          // reacts to a real pointer and a real Tab.
          const box: CSSProperties = {
            width: 44,
            height: 48,
            textAlign: 'center',
            borderWidth: 'var(--border-width-default)',
            borderStyle: 'solid',
            borderRadius: 'var(--radius-md)',
            background: disabled ? 'var(--surface-disabled)' : 'var(--white)',
            fontFamily: 'var(--font-mono)',
            fontSize: 20,
            color: 'var(--text-primary)',
            outline: 'none',
            opacity: disabled ? 0.6 : 1,
          }
          return (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el }}
              id={`${id}-${i}`}
              className="inspera-interactive inspera-field"
              // Only the first box carries the forced ring: every box lit at
              // once reads as an error, not as focus.
              data-force-state={forceState && i === 0 ? forceState : undefined}
              data-invalid={error || undefined}
              data-disabled={disabled || undefined}
              type="text"
              inputMode="numeric"
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              value={ch}
              disabled={disabled}
              aria-label={`Digit ${i + 1} of ${length}`}
              aria-invalid={error || undefined}
              onChange={(e) => onInput(i, e)}
              onKeyDown={(e) => onKeyDown(i, e)}
              onPaste={(e) => onPaste(i, e)}
              onFocus={(e) => e.target.select()}
              style={box}
            />
          )
        })}
      </div>
  )

  if (!showLabel) return boxes

  return (
    <div
      className={cx('inspera', className)}
      style={{ display: 'inline-flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      <span id={`${id}-label`} style={labelStyle}>{label}</span>
      {boxes}
    </div>
  )
}
