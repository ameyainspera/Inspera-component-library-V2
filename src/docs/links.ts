import type { MouseEvent } from 'react'

/**
 * Click handler for an in-app `<a href="#/...">`. A plain click routes through
 * the app, which also resets the scroll position; a modified or middle click
 * falls through to the browser, so "open in new tab" and "copy link" work.
 */
export function followLink(navigate: (hash: string) => void, hash: string) {
  return (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(hash)
  }
}
