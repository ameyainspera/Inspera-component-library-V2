/**
 * Prove each framework-free recipe renders identically to the real component.
 *
 * A recipe is only worth shipping if it *is* the component rather than a
 * description of it. Chrome is the arbiter: render the real React component and
 * the recipe markup on the same page, with the same stylesheets, and compare
 * what the engine actually computes - element by element, through the whole
 * tree, not just at the root. If someone changes Button.tsx and forgets
 * recipes.tsx, this fails loudly instead of quietly shipping an off-brand
 * button to every AI tool the team uses.
 *
 * Cases come from the playground's own controls, so a recipe is exercised
 * across exactly the variants the site offers and cannot quietly cover fewer.
 */
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'
import { renderToStaticMarkup } from 'react-dom/server'
import { componentList } from '../src/data/components'
import { recipes } from '../src/data/recipes'
import { registry } from '../src/docs/registry'

// Hermetic on purpose: the comparison needs the two stylesheets and nothing
// else, so this runs in CI without a dev server, a build, or a network.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const stylesheets = ['public/tokens.css', 'src/runtime.css']
  .map((f) => readFileSync(join(root, f), 'utf8'))
  .join('\n')

/** Everything that decides whether an element looks right, for any component. */
const SHARED_PROPS = [
  'display', 'position', 'box-sizing',
  'width', 'height', 'min-width', 'min-height', 'max-width',
  'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
  'border-top-style', 'border-top-color', 'border-bottom-color', 'border-left-color',
  'border-top-left-radius', 'border-bottom-right-radius',
  'background-color', 'color', 'box-shadow', 'opacity',
  'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing',
  'text-align', 'text-decoration-line', 'text-transform', 'white-space',
  'align-items', 'justify-content', 'flex-direction', 'flex-wrap',
  'column-gap', 'row-gap', 'cursor', 'overflow-x', 'overflow-y',
]

/**
 * One case per single-control variation, plus the defaults - the same shape
 * audit-snippets uses. `state` is skipped: its Hover/Focused/Pressed values
 * freeze an appearance for the docs, and a recipe describes the resting element
 * plus real pseudo-classes, so there is nothing to compare.
 */
function casesFor(slug: string): { name: string; values: Record<string, string> }[] {
  const entry = registry[slug]
  const out = [{ name: 'defaults', values: entry.defaults }]
  for (const [key, def] of Object.entries(entry.controls)) {
    if (key === 'state') continue
    for (const option of def.options) {
      if (option === entry.defaults[key]) continue
      out.push({ name: `${key}=${option}`, values: { ...entry.defaults, [key]: option } })
    }
  }
  return out
}

const problems: string[] = []

// ---------------------------------------------------------------------------
// Coverage first. Every published spec opens by telling a tool that cannot
// install the package to build from the HTML and CSS under "Without the
// package" - a section only a recipe produces. A component with no recipe ships
// a spec that points at nothing, which is worse than saying nothing at all.
// ---------------------------------------------------------------------------
const missing = componentList.filter((c) => !recipes[c.slug])
if (missing.length > 0) {
  console.error(`\n✗ ${missing.length} component(s) have no recipe:\n`)
  for (const c of missing) console.error(`  ${c.slug} (${c.name})`)
  console.error('\nAdd one in src/data/recipes.tsx, or the generated spec will\n' +
    'promise a "Without the package" section it cannot produce.\n')
  process.exit(1)
}

// ---------------------------------------------------------------------------
// Cheap checks next, before paying for a browser.
// ---------------------------------------------------------------------------
for (const [slug, recipe] of Object.entries(recipes)) {
  const entry = registry[slug]
  if (!entry) {
    problems.push(`${slug} | recipe has no playground entry to drive it`)
    continue
  }
  // Every class the live markup emits must actually exist in the CSS shipped
  // beside it. A modifier the stylesheet does not define is invisible - the
  // element renders, it just renders wrong, which is the failure this stops.
  const seen = new Set<string>()
  for (const { values } of casesFor(slug)) {
    for (const m of recipe.markup(values).matchAll(/class="([^"]+)"/g)) {
      for (const cls of m[1].split(/\s+/)) {
        if (!cls.startsWith('inspera-') || seen.has(cls)) continue
        seen.add(cls)
        // Material Symbols helpers live in runtime.css, not in the recipe.
        if (cls.startsWith('material-symbols')) continue
        // A composed recipe's CSS ships alongside this one, so its classes count.
        const available = [recipe, ...(recipe.composes ?? []).map((c) => recipes[c])]
        if (!available.every(Boolean)) {
          problems.push(`${slug} | composes a recipe that does not exist`)
          continue
        }
        if (!available.some((r) => r.css.includes(`.${cls}`))) {
          problems.push(`${slug} | markup uses .${cls}, which no recipe CSS defines`)
        }
      }
    }
  }
}
if (problems.length > 0) {
  console.error(`\n✗ ${problems.length} recipe markup problem(s):\n`)
  for (const p of problems) console.error('  ' + p)
  process.exit(1)
}

// ---------------------------------------------------------------------------
// The real comparison, in Chrome.
// ---------------------------------------------------------------------------
type Case = {
  slug: string
  name: string
  real: string
  mock: string
  props: string[]
  vars: [string, string, string][]
  rootOnly: boolean
}

const cases: Case[] = []
for (const [slug, recipe] of Object.entries(recipes)) {
  for (const { name, values } of casesFor(slug)) {
    cases.push({
      slug,
      name,
      real: renderToStaticMarkup(recipe.component(values)),
      mock: recipe.markup(values),
      props: [...SHARED_PROPS, ...(recipe.props ?? [])],
      vars: recipe.vars ?? [],
      rootOnly: recipe.rootOnly ?? false,
    })
  }
}

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1200, height: 800 } })
await page.setContent(`<!doctype html><style>${stylesheets}</style><body></body>`)
// tsx compiles this file with esbuild's keepNames transform, which rewrites the
// helpers inside the page.evaluate body into `__name(...)` calls. That helper is
// defined at module scope in Node, not in the page, so it has to exist there too.
await page.addScriptTag({ content: 'window.__name = (f) => f' })

const css = Object.values(recipes).map((r) => r.css).join('\n\n')

const found = await page.evaluate(
  ({ cases, css }) => {
    const style = document.createElement('style')
    style.textContent = css
    document.head.append(style)

    const out: string[] = []

    /** Resolve `var(--x)` as the browser sees it, inside this element. */
    const resolve = (el: HTMLElement, prop: string) => {
      const probe = document.createElement('div')
      probe.style.background = `var(${prop})`
      el.append(probe)
      const v = getComputedStyle(probe).backgroundColor
      probe.remove()
      return v
    }

    for (const c of cases) {
      // Two identically-sized hosts, so anything that sizes to its container
      // gets the same budget on both sides.
      const wrap = document.createElement('div')
      wrap.innerHTML =
        `<div style="width:600px" id="real">${c.real}</div>` +
        `<div style="width:600px" id="mock">${c.mock}</div>`
      document.body.append(wrap)

      // React 19 hoists resource hints (a preload <link> ahead of an <img>).
      // They render nothing, so they are not the recipe's job to reproduce.
      for (const hoisted of wrap.querySelectorAll('link, script, style')) hoisted.remove()

      const realRoot = wrap.querySelector('#real')!.firstElementChild as HTMLElement
      const mockRoot = wrap.querySelector('#mock')!.firstElementChild as HTMLElement
      if (!realRoot || !mockRoot) {
        out.push(`${c.slug} | ${c.name} | could not render both sides`)
        wrap.remove()
        continue
      }

      const walk = (a: HTMLElement, b: HTMLElement, path: string) => {
        if (a.tagName !== b.tagName) {
          out.push(`${c.slug} | ${c.name} | ${path}: component is <${a.tagName.toLowerCase()}>, recipe is <${b.tagName.toLowerCase()}>`)
          return
        }
        const sa = getComputedStyle(a)
        const sb = getComputedStyle(b)
        for (const p of c.props) {
          const va = sa.getPropertyValue(p)
          const vb = sb.getPropertyValue(p)
          if (va !== vb) out.push(`${c.slug} | ${c.name} | ${path} | ${p}: component "${va}" vs recipe "${vb}"`)
        }
        if (c.rootOnly) return
        const ca = [...a.children] as HTMLElement[]
        const cb = [...b.children] as HTMLElement[]
        if (ca.length !== cb.length) {
          out.push(`${c.slug} | ${c.name} | ${path}: component has ${ca.length} child element(s), recipe has ${cb.length}`)
          return
        }
        for (let i = 0; i < ca.length; i++) walk(ca[i], cb[i], `${path} > ${ca[i].tagName.toLowerCase()}[${i}]`)
      }
      walk(realRoot, mockRoot, realRoot.tagName.toLowerCase())

      for (const [label, x, y] of c.vars) {
        const va = resolve(realRoot, x)
        const vb = resolve(mockRoot, y)
        if (va !== vb) out.push(`${c.slug} | ${c.name} | ${label}: component "${va}" vs recipe "${vb}"`)
      }

      wrap.remove()
    }
    return out
  },
  { cases, css },
)

await browser.close()

if (found.length > 0) {
  // One component can produce hundreds of near-identical lines; show enough to
  // act on and say how many were held back.
  const shown = found.slice(0, 60)
  console.error(`\n✗ Recipe drifted from the component in ${found.length} place(s):\n`)
  for (const p of shown) console.error('  ' + p)
  if (found.length > shown.length) console.error(`\n  ...and ${found.length - shown.length} more.`)
  console.error('\nFix src/data/recipes.tsx (or the component) so they agree.\n')
  process.exit(1)
}

const covered = Object.keys(recipes).length
console.log(
  `✓ ${cases.length} case(s) across ${covered} recipe(s) match their components ` +
    'element for element, and every class the markup emits is defined',
)
