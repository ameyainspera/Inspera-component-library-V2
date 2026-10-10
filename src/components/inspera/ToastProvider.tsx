import { type CSSProperties, useEffect, useRef, useState } from 'react'
import Snackbar, { type SnackbarIntent } from './Snackbar'
import { Portal } from './overlay'

export type ToastIntent = SnackbarIntent
export type ToastPosition =
  | 'TopLeft' | 'TopCenter' | 'TopRight'
  | 'BottomLeft' | 'BottomCenter' | 'BottomRight'

export interface ToastOptions {
  /** Accent icon colour. */
  intent?: ToastIntent
  /** Auto-dismiss delay in ms. Pass 0 to keep it until dismissed. Paused while hovered or focused. */
  duration?: number
  /** Inline action label, e.g. "Undo". */
  actionLabel?: string
  /** Fired when the inline action is activated. The toast then closes. */
  onAction?: () => void
}

export interface ToastRecord extends Required<Pick<ToastOptions, 'intent' | 'duration'>> {
  id: number
  message: string
  actionLabel?: string
  onAction?: () => void
}

export interface ToastProviderProps {
  /** Where the stack anchors on screen. */
  position?: ToastPosition
  /** Most toasts on screen at once. Past it, the oldest is dismissed. */
  max?: number
}

// A tiny module-level bus so `toast()` can be called from anywhere - event
// handlers, data layers, outside React - without threading a ref through props.
// A set of listeners, not a single slot: with one slot, unmounting any provider
// cleared it and every later toast went nowhere, even with another mounted.
type Listener = (toasts: ToastRecord[]) => void
let queue: ToastRecord[] = []
const listeners = new Set<Listener>()
let nextId = 1

function publish() {
  const snapshot = [...queue]
  listeners.forEach((l) => l(snapshot))
}

function dismissToast(id: number) {
  queue = queue.filter((t) => t.id !== id)
  publish()
}

export interface ToastFn {
  /**
   * Show a toast from anywhere. Requires a `<ToastProvider />` mounted once near
   * the app root. Returns the toast id so it can be dismissed programmatically.
   */
  (message: string, options?: ToastOptions): number
  /** Imperatively dismiss a toast by the id `toast()` returned. */
  dismiss: (id: number) => void
}

function showToast(message: string, options: ToastOptions = {}): number {
  const record: ToastRecord = {
    id: nextId++,
    message,
    intent: options.intent ?? 'Neutral',
    duration: options.duration ?? 4000,
    actionLabel: options.actionLabel,
    onAction: options.onAction,
  }
  queue = [...queue, record]
  publish()
  return record.id
}

export const toast: ToastFn = Object.assign(showToast, { dismiss: dismissToast })

const POSITION_STYLE: Record<ToastPosition, CSSProperties> = {
  TopLeft: { top: 24, left: 24, alignItems: 'flex-start' },
  TopCenter: { top: 24, left: '50%', transform: 'translateX(-50%)', alignItems: 'center' },
  TopRight: { top: 24, right: 24, alignItems: 'flex-end' },
  BottomLeft: { bottom: 24, left: 24, alignItems: 'flex-start' },
  BottomCenter: { bottom: 24, left: '50%', transform: 'translateX(-50%)', alignItems: 'center' },
  BottomRight: { bottom: 24, right: 24, alignItems: 'flex-end' },
}

/**
 * One toast and its timer. The timer pauses while the pointer or focus is on
 * the toast - someone reaching for "Undo" should not watch it vanish.
 */
function ToastItem({ record }: { record: ToastRecord }) {
  const [paused, setPaused] = useState(false)
  const remaining = useRef(record.duration)

  useEffect(() => {
    if (record.duration <= 0 || paused) return
    const started = Date.now()
    const t = setTimeout(() => dismissToast(record.id), remaining.current)
    return () => {
      clearTimeout(t)
      remaining.current -= Date.now() - started
    }
  }, [record.id, record.duration, paused])

  return (
    <div
      style={{ pointerEvents: 'auto' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Snackbar
        // The stack is the live region; each toast inside it is plain content,
        // so it is announced once, as it is added.
        role="none"
        aria-live="off"
        message={record.message}
        intent={record.intent}
        actionLabel={record.actionLabel}
        onAction={() => {
          record.onAction?.()
          dismissToast(record.id)
        }}
        dismissible
        onClose={() => dismissToast(record.id)}
      />
    </div>
  )
}

export default function ToastProvider({ position = 'BottomRight', max = 4 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([])

  useEffect(() => {
    listeners.add(setToasts)
    setToasts([...queue])
    return () => {
      listeners.delete(setToasts)
    }
  }, [])

  // Past the cap the oldest is dismissed for real. Slicing only hid it, and it
  // came back with a fresh timer as soon as a newer one closed.
  useEffect(() => {
    toasts.slice(0, Math.max(0, toasts.length - max)).forEach((t) => dismissToast(t.id))
  }, [toasts, max])

  const isTop = position.startsWith('Top')
  const visible = toasts.slice(-max)
  // Newest nearest its edge: stack downward from the top, upward from the bottom.
  const ordered = isTop ? visible : [...visible].reverse()

  return (
    <Portal>
      {/* Mounted even when empty. A live region created together with its text
          is often not announced at all. */}
      <div
        role="region"
        aria-label="Notifications"
        className="inspera"
        style={{
          position: 'fixed',
          zIndex: 'var(--z-toast)',
          display: 'flex',
          flexDirection: 'column',
          pointerEvents: 'none',
          ...POSITION_STYLE[position],
        }}
      >
        <div
          aria-live="polite"
          style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: POSITION_STYLE[position].alignItems }}
        >
          {ordered.map((record) => (
            <ToastItem key={record.id} record={record} />
          ))}
        </div>
      </div>
    </Portal>
  )
}
