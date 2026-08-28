import { type CSSProperties, useId, useRef, useState } from 'react'

export type OtpInputState = 'Default' | 'Focused' | 'Error' | 'Disabled'

export interface OtpInputProps {
  /** Number of digit boxes. */
  length?: number
  /** Current code value. */
  value?: string
  /** Forces a visual state for documentation. Omit for real interactivity. */
  state?: OtpInputState
  onChange?: (value: string) => void
}

export default function OtpInput({
  length = 6,
  value,
  state = 'Default',
  onChange,
}: OtpInputProps) {
  const id = useId()
  const [internal, setInternal] = useState('')
  const current = value ?? internal
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const disabled = state === 'Disabled'
  const isError = state === 'Error'
  const isFocused = state === 'Focused'

  const chars = Array.from({ length }, (_, i) => current[i] ?? '')

  const commit = (next: string) => {
    const trimmed = next.slice(0, length)
    setInternal(trimmed)
    onChange?.(trimmed)
  }

  const setCharAt = (i: number, ch: string) => {
    const arr = chars.slice()
    arr[i] = ch
    commit(arr.join(''))
  }

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!chars[i] && i > 0) {
        e.preventDefault()
        setCharAt(i - 1, '')
        refs.current[i - 1]?.focus()
      } else {
        setCharAt(i, '')
      }
    } else if (e.key === 'ArrowLeft' && i > 0) {
      refs.current[i - 1]?.focus()
    } else if (e.key === 'ArrowRight' && i < length - 1) {
      refs.current[i + 1]?.focus()
    }
  }

  const onInput = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const ch = e.target.value.replace(/\D/g, '').slice(-1)
    if (!ch) return
    setCharAt(i, ch)
    if (i < length - 1) refs.current[i + 1]?.focus()
  }

  const onPaste = (i: number, e: React.ClipboardEvent) => {
    e.preventDefault()
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length - i)
    if (!digits) return
    const arr = chars.slice()
    for (let k = 0; k < digits.length; k++) arr[i + k] = digits[k]
    commit(arr.join(''))
    const nextIndex = Math.min(i + digits.length, length - 1)
    refs.current[nextIndex]?.focus()
  }

  return (
    <div style={{ display: 'inline-flex', gap: 8 }}>
      {chars.map((ch, i) => {
        const box: CSSProperties = {
          width: 44,
          height: 48,
          textAlign: 'center',
          border: `1px solid ${isError ? 'var(--error)' : isFocused && i === 0 ? 'var(--primary)' : 'var(--border-control)'}`,
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
            type="text"
            inputMode="numeric"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            maxLength={1}
            value={ch}
            disabled={disabled}
            aria-label={`Digit ${i + 1}`}
            aria-invalid={isError || undefined}
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
}
