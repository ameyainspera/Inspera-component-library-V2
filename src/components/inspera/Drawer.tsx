import { type CSSProperties, type ReactNode, useEffect, useId } from 'react'
import { useModalBehavior } from './useModalBehavior'

export type DrawerSide = 'Right' | 'Left' | 'Bottom'
export type DrawerSize = 'Small' | 'Medium' | 'Large'

export interface DrawerProps {
  /** Visibility. */
  open?: boolean
  /** Edge it slides from. */
  side?: DrawerSide
  /** Panel width / height. */
  size?: DrawerSize
  /** Header title. */
  title?: string
  /** Show the close affordance. */
  hasCloseButton?: boolean
  /** Panel contents. */
  children?: ReactNode
  /** Render just the panel inline (no overlay/scrim) - used for documentation previews. */
  embedded?: boolean
  /** Fired on the close button, the scrim, and Escape. */
  onClose?: () => void
}

const sizeMap: Record<DrawerSize, number> = { Small: 320, Medium: 400, Large: 560 }

export default function Drawer({
  open = false,
  side = 'Right',
  size = 'Medium',
  title = 'Panel',
  hasCloseButton = true,
  children,
  embedded = false,
  onClose,
}: DrawerProps) {
  const id = useId()
  const panel = useModalBehavior(!embedded && open)

  useEffect(() => {
    if (embedded || !open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [embedded, open, onClose])

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
          // 480 left the preview mostly empty; 320 still reads as a drawer.
          height: isBottom ? extent : 320,
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
        }
      : {
          position: 'absolute',
          ...(isBottom
            ? { left: 0, right: 0, bottom: 0, height: extent, maxHeight: '90%' }
            : side === 'Right'
              ? { top: 0, bottom: 0, right: 0, width: extent, maxWidth: '100%' }
              : { top: 0, bottom: 0, left: 0, width: extent, maxWidth: '100%' }),
        }),
  }

  const content = (
    <div ref={panel} tabIndex={-1} style={panelStyle} role="dialog" aria-modal={!embedded} aria-labelledby={id}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '16px 20px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <h2 id={id} style={{ margin: 0, fontSize: 18, fontWeight: 500 }}>{title}</h2>
        {hasCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--action-active)', display: 'inline-flex' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 22 }} aria-hidden>close</span>
          </button>
        )}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 20, fontSize: 16, lineHeight: 1.5, color: 'var(--gray-700)' }}>
        {children ?? 'Drawer body content.'}
      </div>
    </div>
  )

  if (embedded) return content

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(39,39,39,0.48)', zIndex: 1000 }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ display: 'contents' }}>
        {content}
      </div>
    </div>
  )
}
