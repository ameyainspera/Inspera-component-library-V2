/**
 * Prototyping Kits, checked without a browser.
 *
 *   1. A page's `uses` list names exactly the library components it imports.
 *      The gallery card shows it as the page's recipe; it used to list
 *      components the page never touched.
 *   2. Every file in a page's download bundle resolves its relative imports to
 *      another file in the same bundle, so the bundle builds once recreated.
 */
import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { libraryComponentsUsed, libraryFiles, relativeImports, resolveImport, type ReadSource } from '../src/docs/pages/bundle'
import { examplePages } from '../src/docs/pages/registry'

const ROOT = join(import.meta.dirname, '..')
const read: ReadSource = (path) => {
  const file = join(ROOT, path)
  return existsSync(file) && statSync(file).isFile() ? readFileSync(file, 'utf8') : undefined
}

const problems: string[] = []
let checked = 0

for (const page of examplePages) {
  if (page.status !== 'ready') continue
  checked++
  const where = page.slug

  for (const path of [page.entry, ...(page.extras ?? [])]) {
    if (!path || read(path) === undefined) problems.push(`${where} | missing source file ${path}`)
  }

  const used = libraryComponentsUsed(page, read).sort()
  const listed = [...page.uses].sort()
  if (used.join() !== listed.join()) {
    problems.push(`${where} | uses lists [${listed.join(', ')}] but the page imports [${used.join(', ')}]`)
  }

  // The bundle, as the downloaded file would recreate it.
  const library = libraryFiles(page, read)
  const bundled = new Map<string, string>([
    ...library.map((f) => [f.path, f.body] as const),
    ...[page.entry!, ...(page.extras ?? [])].map((p) => [p, read(p) ?? ''] as const),
  ])
  const inBundle: ReadSource = (p) => bundled.get(p)
  for (const [path, body] of bundled) {
    for (const spec of relativeImports(body)) {
      if (!resolveImport(path, spec, inBundle)) problems.push(`${where} | bundle: ${path} imports '${spec}', which is not in the bundle`)
    }
  }
}

if (problems.length > 0) {
  console.error(`\n✗ ${problems.length} prototyping-kit problem(s):\n`)
  for (const p of problems) console.error('  ' + p)
  console.error('\nFix src/docs/pages/registry.tsx or src/docs/pages/bundle.ts.\n')
  process.exit(1)
}
console.log(`✓ ${checked} prototyping kits: uses lists match the imports, and every bundle resolves its own imports`)
