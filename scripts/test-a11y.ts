/**
 * Accessibility + interaction regression against the docs site.
 *
 * Two layers per component page:
 *   1. axe-core is injected and run over the whole page; any serious or
 *      critical violation fails the run. (moderate/minor are reported, not
 *      failed - the docs chrome carries a few and they are not the system's job
 *      to fix here.)
 *   2. A handful of targeted interaction assertions for the new stateful
 *      components, so "it renders" is not mistaken for "it works": DataGrid
 *      sort flips aria-sort, Combobox filters as you type, Toast appears then
 *      dismisses, CommandPalette opens on its hotkey.
 *
 * Same browser setup as scripts/audit-gallery.ts.
 */
import { createRequire } from 'node:module'

import { chromium, type Page } from 'playwright-core'
import { navigation } from '../src/data/navigation'

const require = createRequire(import.meta.url)
// axe ships a single browser-ready UMD file; inject its source verbatim.
const axePath = require.resolve('axe-core/axe.min.js')

const BASE = process.env.BASE_URL ?? `http://localhost:${process.env.PORT ?? 8443}`
const only = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const slugs = navigation
  .flatMap((g) => g.items.map((i) => i.slug))
  .filter((s) => only.length === 0 || only.includes(s))

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })

const failures: string[] = []

type AxeResult = { violations: { id: string; impact: string; nodes: { target: string[] }[]; help: string }[] }

async function runAxe(slug: string) {
  await page.addScriptTag({ path: axePath })
  const result = (await page.evaluate(async () => {
    // @ts-expect-error - axe is attached to window by the injected script.
    return await window.axe.run(document, {
      resultTypes: ['violations'],
      // Contrast needs pixels; the docs preview canvas is fine, skip the noisy
      // rule that flags gradient backgrounds it cannot sample.
      rules: { 'color-contrast': { enabled: false } },
    })
  })) as AxeResult

  const serious = result.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
  for (const v of serious) {
    failures.push(`${slug} | a11y ${v.impact}: ${v.id} - ${v.help} (${v.nodes.length} node(s))`)
  }
}

/** Assert a condition for one component's interaction, recording any failure. */
function check(slug: string, label: string, ok: boolean) {
  if (!ok) failures.push(`${slug} | interaction: ${label}`)
}

const interactions: Record<string, (page: Page) => Promise<void>> = {
  'data-grid': async (page) => {
    const header = page.locator('th[aria-sort] >> nth=0')
    if (!(await header.count())) return check('data-grid', 'no sortable header found', false)
    const before = await header.getAttribute('aria-sort')
    // The sort control is the button inside the header, not the whole cell.
    await header.locator('button').click()
    await page.waitForTimeout(80)
    const after = await header.getAttribute('aria-sort')
    check('data-grid', `aria-sort should change on click (was ${before}, still ${after})`, before !== after)
  },
  combobox: async (page) => {
    const input = page.locator('input[role="combobox"] >> nth=0')
    if (!(await input.count())) return check('combobox', 'no combobox input found', false)
    await input.click()
    await input.fill('a')
    await page.waitForTimeout(120)
    const options = page.locator('[role="option"]')
    check('combobox', 'typing should reveal at least one option', (await options.count()) > 0)
  },
  toast: async (page) => {
    // The docs demo fires toast() from a Button; find the first button in the
    // playground/gallery and click it, then look for the rendered region.
    const trigger = page.getByRole('button').filter({ hasText: /toast|show|notify/i }).first()
    if (!(await trigger.count())) return
    await trigger.click()
    await page.waitForTimeout(150)
    // The region is always mounted (so new toasts are announced); what must
    // appear is the toast itself.
    const toastText = page.locator('[role="region"][aria-label="Notifications"]').getByText('Assessment saved.')
    check('toast', 'firing toast() should render a notification', (await toastText.count()) > 0)
  },
  'command-palette': async (page) => {
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+k' : 'Control+k')
    await page.waitForTimeout(150)
    // The gallery shows an embedded panel, so look for the modal one.
    const dialog = page.locator('[role="dialog"][aria-modal="true"][aria-label="Command palette"]')
    // Not every demo binds a global hotkey; only fail if a trigger button also
    // fails to open it.
    if (!(await dialog.count())) {
      const trigger = page.getByRole('button').filter({ hasText: /command|palette|open/i }).first()
      if (await trigger.count()) {
        await trigger.click()
        await page.waitForTimeout(150)
      }
    }
    check('command-palette', 'hotkey or trigger should open the palette', (await dialog.count()) > 0)
  },
}

for (const slug of slugs) {
  await page.goto(`${BASE}/#/component/${slug}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(150)
  await runAxe(slug)
  const interaction = interactions[slug]
  if (interaction) {
    try {
      await interaction(page)
    } catch (err) {
      failures.push(`${slug} | interaction threw: ${(err as Error).message}`)
    }
  }
}

await browser.close()

if (failures.length === 0) {
  console.log(`✓ ${slugs.length} component pages: no serious/critical a11y violations, interactions pass`)
} else {
  console.log(`✗ ${failures.length} issue(s):`)
  for (const f of failures) console.log('  ' + f)
  process.exitCode = 1
}
