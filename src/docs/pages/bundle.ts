import type { ExamplePage } from './registry'

/**
 * Builds a single self-contained text file for an example page so anyone can
 * hand it to an AI assistant and rebuild the screen from scratch: the design
 * tokens, the runtime CSS, the font wiring, every library file the page needs,
 * its non-library imports, and the page source itself.
 *
 * This module is pure - it reads source through the `read` function it is
 * given. `download.ts` supplies Vite's `?raw` glob in the browser, so the
 * download always reflects the current code; `scripts/audit-pages.ts` supplies
 * the file system, and checks that every bundle resolves its own imports.
 */
export type ReadSource = (path: string) => string | undefined

const LIB = '/src/components/inspera/'
const BARREL = `${LIB}index.ts`

/** Relative specifiers of every `import ... from` / `export ... from` in a file. */
export function relativeImports(src: string): string[] {
  return [...src.matchAll(/(?:^|\n)\s*(?:import|export)\s[^'"]*?from\s*['"](\.{1,2}\/[^'"]+)['"]/g)].map((m) => m[1])
}

/** Resolve a relative specifier from an absolute /src path, trying the TS extensions. */
export function resolveImport(from: string, spec: string, read: ReadSource): string | undefined {
  const parts = from.split('/').slice(0, -1)
  for (const seg of spec.split('/')) {
    if (seg === '..') parts.pop()
    else if (seg !== '.') parts.push(seg)
  }
  const base = parts.join('/')
  return [`${base}.tsx`, `${base}.ts`, `${base}/index.ts`, base].find((p) => read(p) !== undefined)
}

/** Names a file imports from the library barrel, types included. */
export function libraryImportNames(src: string): string[] {
  const names: string[] = []
  for (const m of src.matchAll(/import\s*(?:type\s*)?\{([^}]*)\}\s*from\s*['"][^'"]*components\/inspera['"]/g)) {
    for (const raw of m[1].split(',')) {
      const name = raw.replace(/^\s*type\s+/, '').split(/\s+as\s+/)[0].trim()
      if (name) names.push(name)
    }
  }
  return names
}

interface BarrelExport {
  statement: string
  names: string[]
  /** Names exported as a component (`default as X`). */
  components: string[]
  target: string
}

function barrelExports(read: ReadSource): BarrelExport[] {
  const src = read(BARREL) ?? ''
  return [...src.matchAll(/export\s+(?:type\s+)?\{([^}]*)\}\s*from\s*['"](\.\/[^'"]+)['"]/g)].map((m) => {
    const entries = m[1].split(',').map((s) => s.trim()).filter(Boolean)
    return {
      statement: m[0],
      names: entries.map((s) => s.split(/\s+as\s+/).pop()!.trim()),
      components: entries.filter((s) => /^default\s+as\s+/.test(s)).map((s) => s.split(/\s+as\s+/)[1].trim()),
      target: resolveImport(BARREL, m[2], read) ?? '',
    }
  })
}

/** The library components a page renders - what its gallery card lists. */
export function libraryComponentsUsed(page: ExamplePage, read: ReadSource): string[] {
  const components = new Set(barrelExports(read).flatMap((e) => e.components))
  const sources = [page.entry, ...(page.extras ?? [])].filter(Boolean).map((p) => read(p!) ?? '')
  return [...new Set(sources.flatMap(libraryImportNames))].filter((n) => components.has(n))
}

/**
 * Every library file a page needs: the modules its imported names come from,
 * then everything those import in turn (the shared hooks, types and overlay
 * helpers). The full barrel re-exports all components, so the bundle carries a
 * barrel trimmed to just these files - otherwise its imports would not resolve.
 */
export function libraryFiles(page: ExamplePage, read: ReadSource): { path: string; body: string }[] {
  const exports = barrelExports(read)
  const sources = [page.entry, ...(page.extras ?? [])].filter(Boolean).map((p) => read(p!) ?? '')
  const wanted = new Set(sources.flatMap(libraryImportNames))
  if (wanted.size === 0) return []

  const seen = new Set<string>()
  const visit = (path: string) => {
    if (seen.has(path) || !path.startsWith(LIB)) return
    const src = read(path)
    if (src === undefined) return
    seen.add(path)
    for (const spec of relativeImports(src)) {
      const next = resolveImport(path, spec, read)
      if (next) visit(next)
    }
  }
  for (const e of exports) if (e.names.some((n) => wanted.has(n))) visit(e.target)

  const barrel = [
    '// Trimmed to the files this page needs. The full library barrel exports every component.',
    ...exports.filter((e) => seen.has(e.target)).map((e) => e.statement),
    '',
  ].join('\n')

  return [...[...seen].sort().map((path) => ({ path, body: read(path)! })), { path: BARREL, body: barrel }]
}

/** Font `@import` lines that must lead the consumer's global stylesheet. */
function fontImports(read: ReadSource): string {
  return (read('/src/index.css') ?? '')
    .split('\n')
    .filter((l) => l.trim().startsWith('@import url('))
    .join('\n')
}

const rel = (path: string) => path.replace(/^\/src\//, 'src/')

const fence = (path: string, lang: string, body: string): string =>
  `### \`${rel(path)}\`\n\n\`\`\`${lang}\n${body.trimEnd()}\n\`\`\`\n`

/**
 * The complete, ready-to-paste global stylesheet. Everything that must be
 * global lives here in the ONE correct order so the consumer can copy a single
 * file instead of reassembling three blocks and getting the order wrong:
 *   1. font @import lines  (MUST precede the Tailwind import, or Lightning CSS
 *      drops them and every Material Symbols icon renders as its ligature text)
 *   2. @import 'tailwindcss'
 *   3. the design tokens   (the var(--…) custom properties everything reads)
 *   4. the runtime CSS     (component states, keyframes and icon helpers)
 */
function globalCss(read: ReadSource): string {
  return [
    '/* ============================================================',
    '   GLOBAL STYLESHEET - import this ONCE at your app root.',
    '   e.g.  import "./index.css"  in your main entry file.',
    '',
    '   The block order below is REQUIRED. Do not reorder it:',
    '   font @imports must come before the Tailwind import, or they',
    '   are dropped and icons render as text (e.g. "chevron_right").',
    '   ============================================================ */',
    '',
    '/* 1. Fonts - must be the very first statements in the file. */',
    fontImports(read),
    '',
    "/* 2. Tailwind CSS v4. */",
    "@import 'tailwindcss';",
    '',
    '/* 3. Design tokens - the var(--…) custom properties. */',
    (read('/src/imports/tokens.css') ?? '').trimEnd(),
    '',
    '/* 4. Runtime CSS - component states, keyframes and icon helpers. */',
    (read('/src/imports/runtime.css') ?? '').trimEnd(),
    '',
  ].join('\n')
}

/** Assemble the full Markdown bundle for a page. */
export function buildPageBundle(page: ExamplePage, read: ReadSource): string {
  const entry = page.entry ?? ''
  const entrySrc = read(entry) ?? ''
  const extras = page.extras ?? []
  const library = libraryFiles(page, read)

  const parts: string[] = []

  // A concrete manifest of every file this bundle contains, so the assistant
  // recreates the exact paths instead of inventing its own structure.
  const files = [
    '- `src/index.css` - the complete global stylesheet (§1). **Required.**',
    ...library.map((f) => `- \`${rel(f.path)}\``),
    ...extras.map((p) => `- \`${rel(p)}\``),
    `- \`${rel(entry)}\` - the page itself.`,
  ].join('\n')

  parts.push(
    `# ${page.name} - Inspera build bundle`,
    '',
    page.description,
    '',
    'This file is self-contained: give it to any AI coding assistant and ask it ' +
      'to rebuild the page exactly. It includes the complete global stylesheet ' +
      '(fonts + Tailwind + design tokens + runtime CSS in the correct order), ' +
      'every library file the page needs, its supporting modules, and the ' +
      'page code.',
    '',
    '**Stack:** React 19 + TypeScript + Tailwind CSS v4.',
    '',
    '---',
    '',
    '## ⚠️ Read this first - do not skip',
    '',
    'Two mistakes will make the page render broken (dark boxes and icons showing ' +
      'as words like `chevron_right`). Avoid both:',
    '',
    '1. **Create `src/index.css` from §1 verbatim and import it once at your app ' +
      'root** (e.g. `import "./index.css"` in `main.tsx`). Every color, border ' +
      'and surface in this page reads from the `var(--…)` tokens defined there - ' +
      'skip it and the whole page falls back to unstyled dark defaults.',
    '2. **Keep the block order inside `src/index.css` exactly as given.** The ' +
      'font `@import` lines MUST come before `@import "tailwindcss"`. Tailwind v4 ' +
      '(Lightning CSS) silently drops `@import`s placed after it, which kills the ' +
      'Material Symbols icon font - icons then render as their ligature text ' +
      '(`edit`, `folder_open`, `chevron_right`, …).',
    '',
    'Do **not** paste the CSS into a component or a `<style>` tag, and do **not** ' +
      'reorder it. Copy `src/index.css` as one file.',
    '',
    '### Files in this bundle',
    '',
    files,
    '',
    '### Verify it worked',
    '',
    '- Inputs and cards have **light/white backgrounds**, not black. ' +
      '(If dark → `src/index.css` is missing or not imported.)',
    '- Icons render as **glyphs**, not words like `chevron_right`. ' +
      '(If words → the font `@import`s are after the Tailwind import, or missing.)',
    '',
    '---',
    '',
    '## 1. `src/index.css` - the complete global stylesheet (copy verbatim)',
    '',
    '```css',
    globalCss(read),
    '```',
    '',
  )

  if (library.length) {
    parts.push(
      '## 2. Library files',
      '',
      'The components this page imports, the shared helpers they depend on, and ' +
        'a barrel trimmed to them. Recreate each at the path shown.',
      '',
    )
    for (const f of library) parts.push(fence(f.path, f.path.endsWith('.tsx') ? 'tsx' : 'ts', f.body))
  }

  if (extras.length) {
    parts.push('## 3. Supporting modules', '')
    for (const path of extras) parts.push(fence(path, 'tsx', read(path) ?? ''))
  }

  parts.push('## 4. The page', '', fence(entry, 'tsx', entrySrc))

  return parts.join('\n')
}
