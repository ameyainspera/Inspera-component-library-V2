/**
 * Measure every component page's State gallery in a real browser and report
 * any preview that overflows its cell.
 *
 * Components size to their container now, so a preview that does not fit is a
 * gallery-width problem, not a component problem — and eyeballing 42 pages is
 * not a check.
 */
import { chromium } from 'playwright-core'
import { navigation } from '../src/data/navigation'

const BASE = process.env.BASE_URL ?? 'http://localhost:5321'
const slugs = navigation.flatMap((g) => g.items.map((i) => i.slug))

// Use the system Chrome: the cached Playwright build predates this version.
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })

// Deliberately only two checks. A "preview looks small in its cell" heuristic
// was tried and removed: for overlay components (Tooltip, Popover, Menu) the
// measurable child is the trigger, not the floating panel, so it flagged
// correct layouts and stayed silent on real ones.
const problems: string[] = []

for (const slug of slugs) {
  await page.goto(`${BASE}/#/component/${slug}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(120)

  // Playground: the live preview canvas must not clip or overflow either.
  const playground = await page.evaluate(() => {
    const heading = [...document.querySelectorAll('h2')].find((h) => h.textContent?.trim() === 'Playground')
    const panel = heading?.closest('section')
    const canvas = panel?.querySelector('div[style*="radial-gradient"]') as HTMLElement | null
    if (!canvas) return null
    return {
      overflowX: canvas.scrollWidth - canvas.clientWidth,
      width: canvas.clientWidth,
      height: canvas.clientHeight,
    }
  })
  if (playground && playground.overflowX > 1) {
    problems.push(`${slug} · playground preview overflows by ${playground.overflowX}px`)
  }

  const result = await page.evaluate(() => {
    const heading = [...document.querySelectorAll('h2')].find((h) => h.textContent?.trim() === 'States')
    const panel = heading?.closest('section')
    if (!panel) return { found: false, cells: [] as any[] }
    const grid = panel.querySelector('div[style*="grid"]')
    if (!grid) return { found: false, cells: [] as any[] }

    const cells = [...grid.children].map((col) => {
      const box = col.firstElementChild as HTMLElement
      const label = (col.lastElementChild as HTMLElement)?.textContent ?? '?'
      const inner = box?.firstElementChild as HTMLElement | null
      return {
        label,
        overflowX: box ? box.scrollWidth - box.clientWidth : 0,
        cellWidth: box?.clientWidth ?? 0,
        contentWidth: inner?.getBoundingClientRect().width ?? 0,
        height: box?.clientHeight ?? 0,
      }
    })
    return { found: true, cells }
  })

  if (!result.found) { problems.push(`${slug}: no States gallery found`); continue }

  for (const c of result.cells) {
    if (c.overflowX > 1) {
      problems.push(`${slug} · "${c.label}" overflows by ${c.overflowX}px (cell ${c.cellWidth}px)`)
    }
    if (c.height > 620) {
      problems.push(`${slug} · "${c.label}" is ${c.height}px tall`)
    }
  }
}

await browser.close()

if (problems.length === 0) {
  console.log(`✓ all ${slugs.length} component pages: playground + state gallery fit`)
} else {
  console.log(`✗ ${problems.length} issue(s):`)
  for (const p of problems) console.log('  ' + p)
}
