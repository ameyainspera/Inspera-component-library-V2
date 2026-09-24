import { type CSSProperties, type ReactNode, useId } from 'react'
import { Portal, useEscapeLayer, useScrimDismiss } from './overlay'
import { cx, type NativeAttrs } from './types'
import { useModalBehavior } from './useModalBehavior'

export type DrawerSide = 'Right' | 'Left' | 'Bottom'
export type DrawerSize = 'Small' | 'Medium' | 'Large'

export interface DrawerProps {
  /** Whether the drawer is shown. Controlled - pair with onClose. */
  open: boolean
  /** Header title. Also the accessible name. */
  title: string
  /** Panel contents. */
  children?: ReactNode
  /** Edge it slides from. */
  side?: DrawerSide
  /** Panel width 320 / 400 / 560 (height, for Bottom). */
  size?: DrawerSize
  /** Show the header close button. */
  hasCloseButton?: boolean
  /** Fired on the close button, the scrim, and Escape. */
  onClose?: () => void
  /** @internal Render just the panel inline, not as a modal - for documentation. */
  embedded?: boolean
}

const sizeMap: Record<DrawerSize, number> = { Small: 320, Medium: 400, Large: 560 }

export default function Drawer({
  open,
  title,
  children,
  side = 'Right',
  size = 'Medium',
  hasCloseButton = true,
  onClose,
  embedded = false,
  className,
  style,
  ...rest
}: DrawerProps & NativeAttrs<'div', DrawerProps>) {
  const id = useId()
  const modal = !embedded && open
  const panel = useModalBehavior(modal)
  const scrim = useScrimDismiss(onClose)
  useEscapeLayer(modal, () => onClose?.())

  if (!embedded && !open) return null

  const isBottom = side === 'Bottom'
  const extent = sizeMap[size]

  const panelStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--surface)',
    color: 'var(--text-primary)',
    boxShadow: 'var(--shadow-500)',
    fontFamily: 'var(--font-sans)',
    ...(embedded
      ? {
          width: isBottom ? '100%' : extent,
          maxWidth: '100%',
          // `embedded` exists only so the drawer can be shown inline in docs.
          height: isBottom ? extent : 320,
          borderRadius: 'var(--radius-md)',
          border: 'var(--border-width-default) solid var(--border)',
          overflow: 'hidden',
        }
      : {
          position: 'absolute',
          // Slides in from its edge (keyframes in runtime.css; off under
          // reduced motion). The docs described an animation none existed for.
          animation: `inspera-drawer-${side.toLowerCase()} var(--duration-slow) var(--easing-enter)`,
          ...(isBottom
            ? { left: 0, right: 0, bottom: 0, height: extent, maxHeight: '90%' }
            : side === 'Right'
              ? { top: 0, bottom: 0, right: 0, width: extent, maxWidth: '100%' }
              : { top: 0, bottom: 0, left: 0, width: extent, maxWidth: '100%' }),
        }),
    ...style,
  }

  const content = (
    <div
      ref={panel}
      tabIndex={-1}
      className={cx('inspera inspera-drawer-slide', className)}
      style={panelStyle}
      role="dialog"
      aria-modal={modal || undefined}
      aria-labelledby={id}
      {...rest}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '16px 20px', borderBottom: 'var(--border-width-default) solid var(--border)', flexShrink: 0 }}>
        <h2 id={id} style={{ margin: 0, fontSize: 18, fontWeight: 500 }}>{title}</h2>
        {hasCloseButton && (
          <button
            type="button"
            className="inspera-interactive"
            onClick={onClose}
            aria-label="Close"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--action-active)', display: 'inline-flex' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 22 }} aria-hidden>close</span>
          </button>
        )}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 20, fontSize: 16, lineHeight: 1.5, color: 'var(--gray-700)' }}>
        {children}
      </div>
    </div>
  )

  if (embedded) return content

  return (
    <Portal>
      <div
        {...scrim}
        className="inspera"
        style={{ position: 'fixed', inset: 0, background: 'var(--scrim)', zIndex: 'var(--z-modal)' }}
      >
        {content}
      </div>
    </Portal>
  )
}
