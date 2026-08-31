/**
 * Prove each framework-free recipe renders identically to the real component.
 *
 * A recipe is only worth shipping if it is the component rather than a
 * description of it. Chrome is the arbiter: render the real React component
 * and the recipe markup on the same page, with the same stylesheets, and
 * compare what the engine actually computes. If someone changes Button.tsx and
 * forgets recipes.ts, this fails loudly instead of quietly shipping an
 * off-brand button to every AI tool the team uses.
 */
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import Button, { type ButtonIntent, type ButtonSize } from '../src/components/inspera/Button'
import { recipes } from '../src/data/recipes'
import { registry } from '../src/docs/registry'

// Hermetic on purpose: the comparison needs the two stylesheets and nothing
// else, so this runs in CI without a dev server, a build, or a network.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const stylesheets = ['public/tokens.css', 'src/runtime.css']
  .map((f) => readFileSync(join(root, f), 'utf8'))
  .join('\n')

/** Everything that decides whether a button looks right. */
const PROPS = [
  'border-top-left-radius', 'border-top-width', 'border-top-style', 'border-top-color',
  'background-color', 'color', 'box-shadow',
  'height', 'min-width', 'padding-left', 'padding-right', 'column-gap',
  'font-family', 'font-size', 'font-weight', 'line-height',
  'display', 'align-items', 'justify-content', 'white-space', 'cursor', 'opacity',
]

const intents: ButtonIntent[] = [
  'Primary', 'Secondary', 'Outline', 'Text', 'Success', 'Warning', 'Destructive',
]
const sizes: ButtonSize[] = ['Small', 'Medium', 'Large']
const modifier: Record<string, string> = {
  Primary: 'inspera-btn--primary', Secondary: 'inspera-btn--secondary',
  Outline: 'inspera-btn--outline', Text: 'inspera-btn--text',
  Success: 'inspera-btn--success', Warning: 'inspera-btn--warning',
  Destructive: 'inspera-btn--destructive',
  Small: 'inspera-btn--small', Medium: '', Large: 'inspera-btn--large',
}

// Build the pairs in Node so the real side is genuinely the React component's
// own output, not a hand-copy of it.
const cases = intents.flatMap((intent) =>
  sizes.map((size) => ({
    name: `${intent} / ${size}`,
    real: renderToStaticMarkup(createElement(Button, { intent, size, label: 'Save' })),
    recipeClass: ['inspera-btn', modifier[intent], modifier[size]].filter(Boolean).join(' '),
  })),
)

// ---------------------------------------------------------------------------
// Cheap check first, before paying for a browser: every class the live markup
// emits must actually exist in the CSS shipped beside it. A modifier that the
// stylesheet does not define is invisible — the button renders, it just
// renders wrong, which is the whole failure mode this file exists to stop.
// ---------------------------------------------------------------------------
const classProblems: string[] = []
for (const [slug, recipe] of Object.entries(recipes)) {
  const entry = registry[slug]
  if (!entry) {
    classProblems.push(`${slug} · recipe has no playground entry to drive it`)
    continue
  }
  const seen = new Set<string>()
  for (const [key, def] of Object.entries(entry.controls)) {
    for (const option of def.options) {
      const markup = recipe.markup({ ...entry.defaults, [key]: option })
      for (const m of markup.matchAll(/class="([^"]+)"/g)) {
        for (const cls of m[1].split(/\s+/)) {
          if (cls.startsWith('inspera-') && !seen.has(cls)) {
            seen.add(cls)
            if (!recipe.css.includes(`.${cls}`)) {
              classProblems.push(`${slug} · markup uses .${cls}, which the recipe CSS never defines`)
            }
          }
        }
      }
    }
  }
}
if (classProblems.length > 0) {
  console.error(`\n✗ ${classProblems.length} recipe markup problem(s):\n`)
  for (const p of classProblems) console.error('  ' + p)
  process.exit(1)
}

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1200, height: 800 } })
await page.setContent(`<!doctype html><style>${stylesheets}</style><body></body>`)

const problems = await page.evaluate(
  ({ cases, css, props }) => {
    const style = document.createElement('style')
    style.textContent = css
    document.head.append(style)

    const host = document.createElement('div')
    document.body.append(host)
    const found: string[] = []

    for (const c of cases) {
      host.innerHTML = `<div>${c.real}</div><div><button type="button" class="${c.recipeClass}">Save</button></div>`
      const real = host.querySelector('.inspera-button') as HTMLElement
      const mock = host.querySelector('.inspera-btn') as HTMLElement
      if (!real || !mock) { found.push(`${c.name} · could not render both sides`); continue }

      const a = getComputedStyle(real)
      const b = getComputedStyle(mock)
      for (const p of props) {
        if (a.getPropertyValue(p) !== b.getPropertyValue(p)) {
          found.push(`${c.name} · ${p}: component "${a.getPropertyValue(p)}" vs recipe "${b.getPropertyValue(p)}"`)
        }
      }

      // Hover and pressed are pseudo-classes, so compare the colours they
      // resolve to rather than trying to drive a pointer.
      for (const [label, x, y] of [
        ['hover fill', '--inspera-bg-hover', '--btn-bg-hover'],
        ['pressed fill', '--inspera-bg-active', '--btn-bg-active'],
      ] as const) {
        const resolved: string[] = []
        for (const [el, v] of [[real, x], [mock, y]] as const) {
          const probe = document.createElement('div')
          probe.style.background = `var(${v})`
          el.append(probe)
          resolved.push(getComputedStyle(probe).backgroundColor)
          probe.remove()
        }
        if (resolved[0] !== resolved[1]) {
          found.push(`${c.name} · ${label}: component "${resolved[0]}" vs recipe "${resolved[1]}"`)
        }
      }
    }
    host.remove()
    return found
  },
  { cases, css: recipes.button.css, props: PROPS },
)

await browser.close()

if (problems.length > 0) {
  console.error(`\n✗ Recipe drifted from the component in ${problems.length} place(s):\n`)
  for (const p of problems) console.error('  ' + p)
  console.error('\nFix src/data/recipes.ts (or the component) so they agree.\n')
  process.exit(1)
}
console.log(
  `✓ recipe matches the component across ${cases.length} intent × size combinations, ` +
    'and every class its markup emits is defined',
)
