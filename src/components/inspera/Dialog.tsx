import { type CSSProperties, type ReactNode, useEffect, useId } from 'react'
import { useModalBehavior } from './useModalBehavior'

export type DialogSize = 'Small' | 'Medium' | 'Large'

export interface DialogProps {
  /** Dialog heading. Also the accessible name. */
  title?: string
  /** Dialog content. */
  body?: ReactNode
  /** Panel width 400 / 480 / 560. */
  size?: DialogSize
  /** Show the header close affordance. */
  hasCloseButton?: boolean
  /** Show the footer action buttons. */
  hasActions?: boolean
  /** Label for the confirming action. Name the action - "Delete", not "OK". */
  confirmLabel?: string
  /** Label for the dismissing action. */
  cancelLabel?: string
  /** Whether the dialog is shown. Controlled - pair with onClose. */
  open?: boolean
  /** Render just the panel (no overlay) - used for documentation previews. */
  embedded?: boolean
  /** Fired on the close button, the overlay, and Escape. */
  onClose?: () => void
  /** Fired when the confirming action is activated. */
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
  // useId, not a constant: the States gallery renders six dialogs on one page,
  // and a hardcoded id gave every one of them the same `dialog-title`.
  const titleId = useId()
  const panel = useModalBehavior(!embedded && open)

  useEffect(() => {
    if (embedded || !open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [embedded, open, onClose])

  if (!open) return null

  const panelStyle: CSSProperties = {
    width: widthMap[size],
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 'var(--radius-lg)',
    background: 'var(--white)',
    color: 'var(--text-primary)',
    boxShadow: 'var(--shadow-500)',
    fontFamily: 'var(--font-sans)',
  }

  const content = (
    <div ref={panel} tabIndex={-1} style={panelStyle} role="dialog" aria-modal={!embedded} aria-labelledby={titleId}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px', borderBottom: '1px solid var(--border)',
        gap: 12, minHeight: 64,
      }}>
        <h2 id={titleId} style={{
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
