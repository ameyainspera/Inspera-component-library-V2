import { type CSSProperties, type ReactNode, useId } from 'react'
import Button from './Button'
import { Portal, useEscapeLayer, useScrimDismiss } from './overlay'
import { cx, type NativeAttrs } from './types'
import { useModalBehavior } from './useModalBehavior'

export type DialogSize = 'Small' | 'Medium' | 'Large'

export interface DialogProps {
  /** Whether the dialog is shown. Controlled - pair with onClose. */
  open: boolean
  /** Dialog heading. Also the accessible name. */
  title: string
  /** Dialog content. */
  children?: ReactNode
  /** Panel width 400 / 480 / 560. */
  size?: DialogSize
  /** Show the header close button. */
  hasCloseButton?: boolean
  /** Show the footer action buttons. */
  hasActions?: boolean
  /** Label for the confirming action. Name the action - "Delete", not "OK". */
  confirmLabel?: string
  /** Label for the dismissing action. */
  cancelLabel?: string
  /** Fired on the close button, Cancel, the scrim, and Escape. */
  onClose?: () => void
  /** Fired when the confirming action is activated. */
  onConfirm?: () => void
  /** @internal Render just the panel inline, not as a modal - for documentation. */
  embedded?: boolean
}

const widthMap: Record<DialogSize, number> = { Small: 400, Medium: 480, Large: 560 }

export default function Dialog({
  open,
  title,
  children,
  size = 'Medium',
  hasCloseButton = true,
  hasActions = true,
  confirmLabel = 'Continue',
  cancelLabel = 'Cancel',
  onClose,
  onConfirm,
  embedded = false,
  className,
  style,
  ...rest
}: DialogProps & NativeAttrs<'div', DialogProps>) {
  // useId, not a constant: the gallery renders several dialogs on one page.
  const titleId = useId()
  const modal = !embedded && open
  const panel = useModalBehavior(modal)
  const scrim = useScrimDismiss(onClose)
  useEscapeLayer(modal, () => onClose?.())

  if (!embedded && !open) return null

  const panelStyle: CSSProperties = {
    width: widthMap[size],
    maxWidth: '100%',
    maxHeight: embedded ? undefined : 'calc(100vh - 32px)',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 'var(--radius-lg)',
    background: 'var(--white)',
    color: 'var(--text-primary)',
    boxShadow: 'var(--shadow-500)',
    fontFamily: 'var(--font-sans)',
    ...style,
  }

  const content = (
    <div
      ref={panel}
      tabIndex={-1}
      className={cx('inspera', className)}
      style={panelStyle}
      role="dialog"
      aria-modal={modal || undefined}
      aria-labelledby={titleId}
      {...rest}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px', borderBottom: 'var(--border-width-default) solid var(--border)',
        gap: 12, minHeight: 64, flexShrink: 0,
      }}>
        <h2 id={titleId} style={{
          margin: 0, fontSize: 'var(--h2-size)', fontWeight: 'var(--h2-weight)', lineHeight: 'var(--h2-line-height)',
          color: 'var(--gray-900)', letterSpacing: -0.2,
        }}>
          {title}
        </h2>
        {hasCloseButton && (
          <button
            type="button"
            className="inspera-interactive"
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

      {/* Body - scrolls on its own so a long dialog keeps its header and actions. */}
      <div style={{ padding: 32, fontSize: 16, lineHeight: '20px', color: 'var(--gray-900)', overflowY: 'auto' }}>
        {children}
      </div>

      {/* Footer - the library's own Button, so dialog actions match every other button. */}
      {hasActions && (
        <div style={{
          display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8,
          padding: '16px 24px', borderTop: 'var(--border-width-default) solid var(--border)', flexWrap: 'wrap', flexShrink: 0,
        }}>
          <Button label={cancelLabel} intent="Text" onClick={onClose} />
          <Button label={confirmLabel} intent="Primary" onClick={onConfirm} />
        </div>
      )}
    </div>
  )

  if (embedded) return content

  return (
    <Portal>
      <div
        {...scrim}
        className="inspera"
        style={{
          position: 'fixed', inset: 0, background: 'var(--scrim)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 16, zIndex: 'var(--z-modal)',
        }}
      >
        {content}
      </div>
    </Portal>
  )
}
