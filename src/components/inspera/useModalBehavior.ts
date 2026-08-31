import { useEffect, useRef } from 'react'

const FOCUSABLE = [
  'a[href]', 'button:not(:disabled)', 'input:not(:disabled)', 'select:not(:disabled)',
  'textarea:not(:disabled)', '[tabindex]:not([tabindex="-1"])',
].join(',')

/**
 * The three things an overlay owes a keyboard user, in one place so Dialog and
 * Drawer cannot drift apart:
 *
 *   1. Focus moves into the panel when it opens, and back to whatever opened it
 *      when it closes — otherwise Tab resumes at the top of the document and
 *      the user has to walk the whole page to get back.
 *   2. Tab and Shift-Tab wrap inside the panel. Without this, focus walks out
 *      into the page behind the scrim, which is still there and still clickable.
 *   3. The page behind does not scroll.
 *
 * Returns the ref to put on the panel. `active` should be false for the
 * documentation's inline `embedded` rendering, which is not a modal at all.
 */
export function useModalBehavior(active: boolean) {
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active) return
    const opener = document.activeElement as HTMLElement | null

    const first = panel.current?.querySelector<HTMLElement>(FOCUSABLE)
    ;(first ?? panel.current)?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !panel.current) return
      const stops = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
      if (stops.length === 0) return
      const edge = e.shiftKey ? stops[0] : stops[stops.length - 1]
      if (document.activeElement === edge) {
        e.preventDefault()
        ;(e.shiftKey ? stops[stops.length - 1] : stops[0]).focus()
      }
    }
    document.addEventListener('keydown', onKey)

    const scrollLock = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = scrollLock
      opener?.focus?.()
    }
  }, [active])

  return panel
}
