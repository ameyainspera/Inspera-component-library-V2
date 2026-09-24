/**
 * The playground's contract, checked without a browser.
 *
 * The copyable JSX is the one place on a component page showing real, working
 * API at the instance level, and the gallery is where a designer scans every
 * variant. Both are derived from the same registry entry; this makes sure the
 * derivation holds for every control:
 *
 *   1. A props control changes the snippet when it changes. If it moves the
 *      preview and not the code, the code does not build what is shown.
 *   2. A preview-only control (hover, focus, an open panel) never changes the
 *      snippet - it is not a prop.
 *   3. No docs-only prop (`forceState`, `forceVisible`, `embedded`) ever
 *      reaches copyable code, in any combination.
 *   4. Every option of every props control appears in the gallery.
 */
import { galleryFor, registry, snippetFor } from '../src/docs/registry'

const DOCS_ONLY = ['forceState', 'forceVisible', 'forceDragging', 'embedded']
const problems: string[] = []

for (const [slug, entry] of Object.entries(registry)) {
  const base = snippetFor(slug, entry.defaults)

  for (const [key, def] of Object.entries(entry.controls)) {
    for (const option of def.options) {
      if (option === entry.defaults[key]) continue
      const out = snippetFor(slug, { ...entry.defaults, [key]: option })
      if (def.group === 'preview') {
        if (out !== base) problems.push(`${slug} | preview control "${key}=${option}" changes the JSX; preview looks are not props`)
      } else if (out === base) {
        problems.push(`${slug} | control "${key}=${option}" moves the preview but not the JSX`)
      }
      for (const prop of DOCS_ONLY) {
        if (new RegExp(`\\b${prop}\\b`).test(out)) problems.push(`${slug} | ${key}="${option}" puts docs-only \`${prop}\` in the JSX`)
      }
    }
  }

  // Gallery coverage: each option of each props control, somewhere.
  const gallery = galleryFor(slug)
  const cells = [
    ...gallery.sections.flatMap((s) => s.cells.map((c) => c.values)),
    ...(gallery.matrix
      ? gallery.matrix.rowOptions.flatMap((row) => gallery.matrix!.cols.map((c) => ({ ...c.values, [gallery.matrix!.rows]: row })))
      : []),
  ]
  const omitted = new Set(entry.gallery?.omit ?? [])
  for (const [key, def] of Object.entries(entry.controls)) {
    if (omitted.has(key)) continue
    for (const option of def.options) {
      if (option === 'None' && def.group === 'preview') continue
      if (!cells.some((v) => v[key] === option)) {
        problems.push(`${slug} | gallery never shows ${key}="${option}"`)
      }
    }
  }
}

const controls = Object.values(registry).reduce((n, e) => n + Object.keys(e.controls).length, 0)

if (problems.length > 0) {
  console.error(`\n✗ ${problems.length} playground problem(s):\n`)
  for (const p of problems) console.error('  ' + p)
  console.error('\nFix the entry in src/docs/registry.tsx.\n')
  process.exit(1)
}
console.log(`✓ ${controls} controls across ${Object.keys(registry).length} components: every one reaches the JSX and the gallery`)
