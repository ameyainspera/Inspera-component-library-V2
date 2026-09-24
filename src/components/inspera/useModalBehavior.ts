import { useEffect, useRef } from 'react'

const FOCUSABLE = [
  'a[href]', 'button:not(:disabled)', 'input:not(:disabled)', 'select:not(:disabled)',
  'textarea:not(:disabled)', 'summary', 'iframe', '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

// Shared across every open modal, so nested ones unlock the page only when
// the last one closes. Each used to save and restore body overflow on its own,
// and closing them out of order left the page locked or unlocked for good.
let lockCount = 0
let savedOverflow = ''
let savedPadding = ''

function lockScroll() {
  if (lockCount++ > 0) return
  const body = document.body
  savedOverflow = body.style.overflow
  savedPadding = body.style.paddingRight
  // Hiding the scrollbar widens the page; pad it back so nothing jumps.
  const gap = window.innerWidth - document.documentElement.clientWidth
  body.style.overflow = 'hidden'
  if (gap > 0) body.style.paddingRight = `${gap}px`
}

function unlockScroll() {
  if (--lockCount > 0) return
  document.body.style.overflow = savedOverflow
  document.body.style.paddingRight = savedPadding
}

/**
 * Makes everything outside the modal inert - unreachable by Tab, by a screen
 * reader's virtual cursor, and by the pointer. Returns the undo.
 */
function inertOutside(panel: HTMLElement): () => void {
  let top: HTMLElement = panel
  while (top.parentElement && top.parentElement !== document.body) top = top.parentElement
  const changed: HTMLElement[] = []
  for (const el of Array.from(document.body.children) as HTMLElement[]) {
    if (el === top || el.inert || el.tagName === 'SCRIPT') continue
    el.inert = true
    changed.push(el)
  }
  return () => changed.forEach((el) => { el.inert = false })
}

/**
 * The things an overlay owes a keyboard user, in one place so Dialog, Drawer
 * and Command Palette cannot drift apart:
 *
 *   1. Focus moves into the panel when it opens, and back to whatever opened it
 *      when it closes.
 *   2. Tab and Shift-Tab wrap inside the panel - including when nothing in it
 *      is focusable, or when the panel itself holds focus, the two cases that
 *      used to let focus escape.
 *   3. The page behind is inert and does not scroll.
 *
 * Returns the ref to put on the panel. `active` should be false for the
 * documentation's inline `embedded` rendering, which is not a modal at all.
 */
export function useModalBehavior<T extends HTMLElement = HTMLDivElement>(active: boolean) {
  const panel = useRef<T>(null)

  useEffect(() => {
    if (!active || !panel.current) return
    const opener = document.activeElement as HTMLElement | null
    const root = panel.current

    const first = root.querySelector<HTMLElement>(FOCUSABLE)
    ;(first ?? root).focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const stops = [...root.querySelectorAll<HTMLElement>(FOCUSABLE)]
      if (stops.length === 0) {
        e.preventDefault()
        root.focus()
        return
      }
      const firstStop = stops[0]
      const lastStop = stops[stops.length - 1]
      const at = document.activeElement
      if (e.shiftKey && (at === firstStop || at === root)) {
        e.preventDefault()
        lastStop.focus()
      } else if (!e.shiftKey && (at === lastStop || !root.contains(at))) {
        e.preventDefault()
        firstStop.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    lockScroll()
    const restoreInert = inertOutside(root)

    return () => {
      document.removeEventListener('keydown', onKey)
      unlockScroll()
      restoreInert()
      opener?.focus?.()
    }
  }, [active])

  return panel
}
