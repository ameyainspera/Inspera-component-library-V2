/**
 * Prove the downloadable spec works with nothing but itself.
 *
 * The whole point of llms-full.txt is that a designer downloads it, drops it
 * into an AI tool as project context, and gets correct Inspera UI. So the test
 * has to be the same shape: take only what the document contains, put it on a
 * blank page, and look at what the browser actually draws.
 *
 * That is how the original defect surfaced. Every component sets `font-size` on
 * `.material-symbols-outlined` and none of them defined the class, because the
 * rule that makes it a font lived in src/runtime.css, which is not part of the
 * download. Colours, radii and spacing were all correct and every icon rendered
 * as its own name - the word "add" sitting inside the button. Nothing in the
 * repo caught it, because everything else renders with runtime.css loaded.
 *
 * The spec also ships in parts (public/spec/), and someone using those gives
 * their AI the core plus the part that holds the component. That is tested the
 * same way: Setup from the core, the component from its own part, nothing else.
 */
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'
import { fullSpec, specParts } from '../src/data/distribution'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (file: string) => readFileSync(join(root, 'public', file), 'utf8')

/** The CSS fences under Setup: fonts, the icon class, and the token block. */
function setupCss(doc: string, file: string): string {
  const start = doc.indexOf('## Setup')
  const end = doc.indexOf('## Foundations')
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`${file} has no Setup section. The spec cannot stand on its own without it.`)
  }
  const fences = [...doc.slice(start, end).matchAll(/```css\n([\s\S]*?)```/g)].map((m) => m[1])
  if (fences.length < 3) {
    throw new Error(`${file}: Setup should carry fonts, the icon rule and the tokens; found ${fences.length} CSS blocks.`)
  }
  return fences.join('\n')
}

/** A component's own HTML and CSS, exactly as the document publishes them. */
function componentBlock(doc: string, file: string, heading: string): { css: string; html: string } {
  const start = doc.indexOf(`### ${heading}\n`)
  if (start === -1) throw new Error(`No "${heading}" section in ${file}.`)
  const next = doc.indexOf('\n### ', start + 1)
  const section = doc.slice(start, next === -1 ? undefined : next)
  const css = section.match(/```css\n([\s\S]*?)```/)
  const html = section.match(/```html\n([\s\S]*?)```/)
  if (!css || !html) throw new Error(`${file}: "${heading}" is missing its HTML or CSS block.`)
  return { css: css[1], html: html[1] }
}

/** One way of getting the spec: its Setup, and where it keeps each component. */
interface Source {
  label: string
  setup: string
  block: (heading: string) => { css: string; html: string }
}

const full = read(fullSpec.file)
const parts = specParts.map((p) => ({ file: p.file, text: read(p.file) }))

const SOURCES: Source[] = [
  {
    label: fullSpec.file,
    setup: setupCss(full, fullSpec.file),
    block: (heading) => componentBlock(full, fullSpec.file, heading),
  },
  {
    label: 'core + part',
    setup: setupCss(parts[0].text, parts[0].file),
    block: (heading) => {
      const part = parts.find((p) => p.text.includes(`### ${heading}\n`))
      if (!part) throw new Error(`No part in public/spec/ has a "${heading}" section.`)
      return componentBlock(part.text, part.file, heading)
    },
  },
]

const CASES = ['Button', 'Alert', 'Empty State']

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 900, height: 600 } })
const problems: string[] = []

for (const source of SOURCES) {
  for (const heading of CASES) {
    const { css, html } = source.block(heading)
    // Deliberately nothing else: no runtime.css, no font links, no tokens.css.
    await page.setContent(
      `<!doctype html><meta charset="utf-8"><style>${source.setup}\n${css}</style>` +
        `<body style="padding:24px">${html}</body>`,
    )
    // Webfonts have to actually arrive before measuring a glyph.
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(400)

    const result = await page.evaluate(() => {
      const icons = [...document.querySelectorAll('.material-symbols-outlined')] as HTMLElement[]
      const body = document.querySelector('[class^="inspera-"], [class*=" inspera-"]') as HTMLElement | null
      return {
        iconCount: icons.length,
        // A glyph is roughly square at its font size. The literal word is far
        // wider, which is the difference between working and broken.
        wide: icons
          .map((el) => ({
            name: el.textContent?.trim() ?? '',
            ratio: el.getBoundingClientRect().width / (parseFloat(getComputedStyle(el).fontSize) || 1),
            family: getComputedStyle(el).fontFamily,
          }))
          .filter((i) => i.ratio > 1.6 || !/Material Symbols/.test(i.family)),
        uiFont: body ? getComputedStyle(body).fontFamily : '',
      }
    })

    if (result.iconCount > 0) {
      for (const bad of result.wide) {
        problems.push(
          `${source.label}, ${heading}: icon "${bad.name}" renders as text, not a glyph ` +
            `(${bad.ratio.toFixed(1)}x its font size, family ${bad.family})`,
        )
      }
    }
    if (result.uiFont && !/Inter/.test(result.uiFont)) {
      problems.push(`${source.label}, ${heading}: UI text falls back to ${result.uiFont} instead of Inter`)
    }
  }
}

await browser.close()

if (problems.length > 0) {
  console.error(`\n[x] the spec does not stand on its own (${problems.length} problem(s)):\n`)
  for (const p of problems) console.error('  ' + p)
  console.error('\nA designer pasting this into an AI tool gets this result. Fix the Setup section.\n')
  process.exit(1)
}
console.log(
  `[ok] standalone: ${CASES.length} components render correctly from the spec alone, ` +
    `as ${SOURCES.map((s) => s.label).join(' and as ')}`,
)
