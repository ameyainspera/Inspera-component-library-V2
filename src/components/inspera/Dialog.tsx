import { type CSSProperties, type ReactNode, useEffect } from 'react'

export type DialogSize = 'Small' | 'Medium' | 'Large'

export interface DialogProps {
  title?: string
  body?: ReactNode
  /** Panel width 400 / 480 / 560. Values: Small | Medium | Large. */
  size?: DialogSize
  /** Show the header close affordance. Values: true | false. */
  hasCloseButton?: boolean
  /** Show the footer action buttons. Values: true | false. */
  hasActions?: boolean
  confirmLabel?: string
  cancelLabel?: string
  open?: boolean
  /** Render just the panel (no overlay) — used for documentation previews. */
  embedded?: boolean
  onClose?: () => void
  onConfirm?: () => void
}

const widthMap: Record<DialogSize, number> = { Small: 400, Medium: 480, Large: 560 }

export default function Dialog({
  title = 'Dialog title',
  body = 'This is the dialog body. Provide context or a clear description of the action the user is about to take.',
  size = 'Medium',
  hasCloseButton = true,
  hasActions = true,
  confirmLabel = 'Continue',
  cancelLabel = 'Cancel',
  open = true,
  embedded = false,
  onClose,
  onConfirm,
}: DialogProps) {
  useEffect(() => {
    if (embedded || !open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [embedded, open, onClose])

  if (!open) return null

  const panel: CSSProperties = {
    width: widthMap[size],
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 'var(--radius-lg)',
    background: 'var(--white)',
    color: 'var(--text-primary)',
    boxShadow: 'var(--shadow-500)',
  }

  const content = (
    <div style={panel} role="dialog" aria-modal={!embedded} aria-labelledby="dialog-title">
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px', borderBottom: '1px solid var(--border)',
        gap: 12, minHeight: 64,
      }}>
        <h2 id="dialog-title" style={{
          margin: 0, fontSize: 22.78, fontWeight: 500, lineHeight: 1.12,
          color: 'var(--gray-900)', letterSpacing: -0.2,
        }}>
          {title}
        </h2>
        {hasCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              flexShrink: 0, background: 'none', border: 'none', padding: 8,
              cursor: 'pointer', color: 'var(--gray-900)', display: 'inline-flex',
              borderRadius: 'var(--radius-pill)', lineHeight: 0,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 24 }} aria-hidden>close</span>
          </button>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: 32, fontSize: 16, lineHeight: '20px', color: 'var(--gray-900)' }}>
        {body}
      </div>

      {/* Footer */}
      {hasActions && (
        <div style={{
          display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10,
          padding: '16px 24px', borderTop: '1px solid var(--border)', flexWrap: 'wrap',
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '12px', borderRadius: 'var(--radius-sm)',
              border: 'none', background: 'transparent',
              color: 'var(--primary)', fontWeight: 500, fontSize: 16,
              lineHeight: '20px', cursor: 'pointer', fontFamily: 'var(--font-sans)',
            }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              padding: '12px', borderRadius: 'var(--radius-sm)',
              border: 'none', background: 'var(--primary)', color: 'var(--white)',
              fontWeight: 500, fontSize: 16, lineHeight: '20px',
              cursor: 'pointer', fontFamily: 'var(--font-sans)',
              boxShadow: '0px 1px 0px 0px rgba(0,0,0,0.08), inset 0px -1px 0px 0px rgba(0,0,0,0.2)',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      )}
    </div>
  )

  if (embedded) return content

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(39,39,39,0.48)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16, zIndex: 1000,
      }}
    >
      <div onClick={(e) => e.stopPropagation()}>{content}</div>
    </div>
  )
}
