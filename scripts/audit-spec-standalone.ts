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
 */
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const spec = readFileSync(join(root, 'public/llms-full.txt'), 'utf8')

/** The CSS fences under Setup: fonts, the icon class, and the token block. */
function setupCss(): string {
  const start = spec.indexOf('## Setup')
  const end = spec.indexOf('## Foundations')
  if (start === -1 || end === -1 || end < start) {
    throw new Error('llms-full.txt has no Setup section. The spec cannot stand on its own without it.')
  }
  const fences = [...spec.slice(start, end).matchAll(/```css\n([\s\S]*?)```/g)].map((m) => m[1])
  if (fences.length < 3) {
    throw new Error(`Setup should carry fonts, the icon rule and the tokens; found ${fences.length} CSS blocks.`)
  }
  return fences.join('\n')
}

/** A component's own HTML and CSS, exactly as the document publishes them. */
function componentBlock(heading: string): { css: string; html: string } {
  const start = spec.indexOf(`### ${heading}\n`)
  if (start === -1) throw new Error(`No "${heading}" section in llms-full.txt.`)
  const next = spec.indexOf('\n### ', start + 1)
  const section = spec.slice(start, next === -1 ? undefined : next)
  const css = section.match(/```css\n([\s\S]*?)```/)
  const html = section.match(/```html\n([\s\S]*?)```/)
  if (!css || !html) throw new Error(`"${heading}" is missing its HTML or CSS block.`)
  return { css: css[1], html: html[1] }
}

const CASES = ['Button', 'Alert', 'Empty State']

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 900, height: 600 } })
const problems: string[] = []
const setup = setupCss()

for (const heading of CASES) {
  const { css, html } = componentBlock(heading)
  // Deliberately nothing else: no runtime.css, no font links, no tokens.css.
  await page.setContent(
    `<!doctype html><meta charset="utf-8"><style>${setup}\n${css}</style>` +
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
        `${heading}: icon "${bad.name}" renders as text, not a glyph ` +
          `(${bad.ratio.toFixed(1)}x its font size, family ${bad.family})`,
      )
    }
  }
  if (result.uiFont && !/Inter/.test(result.uiFont)) {
    problems.push(`${heading}: UI text falls back to ${result.uiFont} instead of Inter`)
  }
}

await browser.close()

if (problems.length > 0) {
  console.error(`\n[x] the spec does not stand on its own (${problems.length} problem(s)):\n`)
  for (const p of problems) console.error('  ' + p)
  console.error('\nA designer pasting this into an AI tool gets this result. Fix the Setup section.\n')
  process.exit(1)
}
console.log(`[ok] standalone: ${CASES.length} components render correctly from the spec alone`)
