import type { ExamplePage } from './registry'

/**
 * Builds a single self-contained text file for an example page so anyone can
 * hand it to an AI assistant and rebuild the screen from scratch: the design
 * tokens, the runtime CSS, the font wiring, every library component the page
 * uses, its non-library imports, and the page source itself.
 *
 * Source is read at build time via Vite's `?raw` glob, so the download always
 * reflects the current code - there is no separate copy to keep in sync.
 */
const RAW = import.meta.glob('/src/**/*.{ts,tsx,css}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const read = (path: string): string => RAW[path] ?? ''

/** Font `@import` lines that must lead the consumer's global stylesheet. */
function fontImports(): string {
  const css = read('/src/index.css')
  return css
    .split('\n')
    .filter((l) => l.trim().startsWith('@import url('))
    .join('\n')
}

/** The `<Name>.tsx` files for every component imported from the library. */
function insperaComponentFiles(entrySrc: string): string[] {
  const block = entrySrc.match(
    /import\s*(?:type\s*)?\{([^}]*)\}\s*from\s*['"][^'"]*components\/inspera['"]/,
  )
  if (!block) return []
  const names = block[1]
    .split(',')
    .map((n) => n.replace(/\btype\b/, '').trim().split(/\s+as\s+/)[0].trim())
    .filter(Boolean)
  const paths = new Set<string>()
  for (const name of names) {
    const p = `/src/components/inspera/${name}.tsx`
    if (RAW[p]) paths.add(p)
  }
  // Include the barrel so the imports in the page resolve as written.
  if (paths.size && RAW['/src/components/inspera/index.ts']) {
    paths.add('/src/components/inspera/index.ts')
  }
  return [...paths]
}

const fence = (path: string, lang: string, body: string): string =>
  `### \`${path.replace(/^\/src\//, 'src/')}\`\n\n\`\`\`${lang}\n${body.trimEnd()}\n\`\`\`\n`

/**
 * The complete, ready-to-paste global stylesheet. Everything that must be
 * global lives here in the ONE correct order so the consumer can copy a single
 * file instead of reassembling three blocks and getting the order wrong:
 *   1. font @import lines  (MUST precede the Tailwind import, or Lightning CSS
 *      drops them and every Material Symbols icon renders as its ligature text)
 *   2. @import 'tailwindcss'
 *   3. the design tokens   (the var(--…) custom properties everything reads)
 *   4. the runtime CSS     (icon helper classes + component keyframes)
 */
function globalCss(): string {
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
    fontImports(),
    '',
    "/* 2. Tailwind CSS v4. */",
    "@import 'tailwindcss';",
    '',
    '/* 3. Design tokens - the var(--…) custom properties. */',
    read('/src/imports/tokens.css').trimEnd(),
    '',
    '/* 4. Runtime CSS - Material Symbols helpers + component keyframes. */',
    read('/src/imports/runtime.css').trimEnd(),
    '',
  ].join('\n')
}

/** Assemble the full Markdown bundle for a page. */
export function buildPageBundle(page: ExamplePage): string {
  const entry = page.entry ?? ''
  const entrySrc = read(entry)
  const extras = page.extras ?? []
  const components = insperaComponentFiles(entrySrc)

  const parts: string[] = []

  // A concrete manifest of every file this bundle contains, so the assistant
  // recreates the exact paths instead of inventing its own structure.
  const files = [
    '- `src/index.css` - the complete global stylesheet (§1). **Required.**',
    ...components.map((p) => `- \`${p.replace(/^\/src\//, 'src/')}\``),
    ...extras.map((p) => `- \`${p.replace(/^\/src\//, 'src/')}\``),
    `- \`${entry.replace(/^\/src\//, 'src/')}\` - the page itself.`,
  ].join('\n')

  parts.push(
    `# ${page.name} - Inspera build bundle`,
    '',
    page.description,
    '',
    'This file is self-contained: give it to any AI coding assistant and ask it ' +
      'to rebuild the page exactly. It includes the complete global stylesheet ' +
      '(fonts + Tailwind + design tokens + runtime CSS in the correct order), ' +
      'every library component the page uses, its supporting modules, and the ' +
      'page code.',
    '',
    '**Stack:** React + TypeScript + Tailwind CSS v4.',
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
    globalCss(),
    '```',
    '',
  )

  if (components.length) {
    parts.push('## 2. Library components used by this page', '')
    for (const path of components) parts.push(fence(path, 'tsx', read(path)))
  }

  if (extras.length) {
    parts.push('## 3. Supporting modules', '')
    for (const path of extras) parts.push(fence(path, 'tsx', read(path)))
  }

  parts.push('## 4. The page', '', fence(entry, 'tsx', entrySrc))

  return parts.join('\n')
}

/** Trigger a browser download of the page bundle as a `.md` text file. */
export function downloadPageBundle(page: ExamplePage): void {
  const text = buildPageBundle(page)
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
