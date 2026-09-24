import { buildPageBundle } from './bundle'
import type { ExamplePage } from './registry'

/**
 * The sources a page bundle can draw on, read at build time. Only the Download
 * button imports this module, and it does so on demand - so these raw strings
 * stay out of the app bundle. The glob used to be all of `src/`.
 */
const RAW = import.meta.glob(
  [
    '/src/components/inspera/*.{ts,tsx}',
    '/src/docs/pages/*.tsx',
    '/src/imports/pasted_text/*.tsx',
    '/src/imports/*.css',
    '/src/index.css',
  ],
  { query: '?raw', import: 'default', eager: true },
) as Record<string, string>

/** Trigger a browser download of the page bundle as a `.md` text file. */
export function downloadPageBundle(page: ExamplePage): void {
  const text = buildPageBundle(page, (path) => RAW[path])
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${page.slug}.md`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
