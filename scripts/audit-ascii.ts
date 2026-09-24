/**
 * Everything the library ships must be plain ASCII.
 *
 * The bytes on disk were always valid UTF-8. The problem is what happens
 * afterwards: these files go out as text/plain and text/markdown, and neither
 * content type carries a charset unless the server adds one. When it does not,
 * the browser falls back to windows-1252 and decodes each UTF-8 byte on its
 * own, so an em dash (E2 80 94) shows up as three characters. That is the
 * mojibake that ran through the whole AI spec.
 *
 * Serving a charset fixes the browser and nothing else. These files are also
 * downloaded, opened in editors, pasted into chat windows and fed to context
 * uploaders, each guessing an encoding for itself. ASCII gives them nothing to
 * guess wrong about.
 *
 * The generator asserts this as it writes, but that only covers files it
 * writes. This pass also covers the hand-written ones that ship alongside -
 * the kit's README and guidelines, the package README.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const ROOTS = ['public', 'kit', 'packages/components']
const SKIP = new Set(['node_modules', 'dist', '.git'])
const EXTENSIONS = ['.md', '.txt', '.json', '.css', '.ts', '.tsx', '.windsurfrules', '.mdc']

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue
    const abs = join(dir, name)
    if (statSync(abs).isDirectory()) walk(abs, out)
    else if (EXTENSIONS.some((e) => name.endsWith(e))) out.push(abs)
  }
  return out
}

const problems: string[] = []
let scanned = 0

for (const r of ROOTS) {
  const abs = join(root, r)
  try {
    statSync(abs)
  } catch {
    continue
  }
  for (const file of walk(abs)) {
    scanned++
    const lines = readFileSync(file, 'utf8').split('\n')
    for (let i = 0; i < lines.length; i++) {
      const found = lines[i].match(/[^\x00-\x7F]/)
      if (!found) continue
      const point = found[0].codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')
      problems.push(
        `${relative(root, file)}:${i + 1} "${found[0]}" (U+${point})\n      ${lines[i].trim().slice(0, 90)}`,
      )
      break // one report per file is enough to send someone to it
    }
  }
}

if (problems.length > 0) {
  console.error(`\n[x] ${problems.length} shipped file(s) contain non-ASCII characters:\n`)
  for (const p of problems) console.error('  ' + p)
  console.error(
    '\nThese are served without a charset and will render as mojibake. ' +
      'Use an ASCII equivalent.\n',
  )
  process.exit(1)
}
console.log(`[ok] ascii: ${scanned} shipped files are plain ASCII`)
