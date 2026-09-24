import { type CSSProperties, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Snackbar, { type SnackbarIntent } from './Snackbar'

export type ToastIntent = SnackbarIntent
export type ToastPosition =
  | 'top-left' | 'top-center' | 'top-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right'

export interface ToastOptions {
  /** Accent icon color. */
  intent?: ToastIntent
  /** Auto-dismiss delay in ms. Pass 0 to keep it until dismissed. */
  duration?: number
  /** Inline action label, e.g. "Undo". */
  actionLabel?: string
  /** Fired when the inline action is activated. */
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
  /** Cap on simultaneously visible toasts. Oldest is dropped past the limit. */
  max?: number
}

// A tiny module-level bus so `toast()` can be called from anywhere - event
// handlers, data layers, outside React - without threading a ref through props.
// The provider is the single subscriber that renders whatever is pushed here.
type Listener = (toasts: ToastRecord[]) => void
let queue: ToastRecord[] = []
let listener: Listener | null = null
let nextId = 1

function publish() {
  listener?.([...queue])
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
  'top-left': { top: 24, left: 24, alignItems: 'flex-start' },
  'top-center': { top: 24, left: '50%', transform: 'translateX(-50%)', alignItems: 'center' },
  'top-right': { top: 24, right: 24, alignItems: 'flex-end' },
  'bottom-left': { bottom: 24, left: 24, alignItems: 'flex-start' },
  'bottom-center': { bottom: 24, left: '50%', transform: 'translateX(-50%)', alignItems: 'center' },
  'bottom-right': { bottom: 24, right: 24, alignItems: 'flex-end' },
}

/** Auto-dismiss timer for one toast, isolated so each has its own lifecycle. */
function ToastItem({ record }: { record: ToastRecord }) {
  useEffect(() => {
    if (record.duration <= 0) return
    const t = setTimeout(() => dismissToast(record.id), record.duration)
    return () => clearTimeout(t)
  }, [record.id, record.duration])

  return (
    <Snackbar
      message={record.message}
      intent={record.intent}
      hasAction={Boolean(record.actionLabel)}
      actionLabel={record.actionLabel}
      onAction={() => {
        record.onAction?.()
        dismissToast(record.id)
      }}
      onClose={() => dismissToast(record.id)}
    />
  )
}

export default function ToastProvider({ position = 'bottom-right', max = 4 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([])

  useEffect(() => {
    listener = setToasts
    setToasts([...queue])
    return () => {
      listener = null
    }
  }, [])

  if (typeof document === 'undefined') return null

  const isTop = position.startsWith('top')
  const visible = toasts.slice(-max)
  // Newest nearest its edge: stack downward from the top, upward from the bottom.
  const ordered = isTop ? visible : [...visible].reverse()

  return createPortal(
    <div
      role="region"
      aria-label="Notifications"
      style={{
        position: 'fixed',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        pointerEvents: 'none',
        ...POSITION_STYLE[position],
      }}
    >
      {ordered.map((record) => (
        <div key={record.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem record={record} />
        </div>
      ))}
    </div>,
    document.body,
  )
}
