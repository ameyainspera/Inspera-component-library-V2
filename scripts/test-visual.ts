/**
 * Visual regression against the docs site.
 *
 * For each component page, screenshot the State gallery panel - a deterministic
 * shot, because every interactive state is frozen through the `data-force-state`
 * mechanism in src/imports/runtime.css rather than a live hover or focus. Then
 * compare pixel-for-pixel against a committed baseline.
 *
 * This reuses the exact browser setup as scripts/audit-gallery.ts (system
 * Chrome via playwright-core, slugs from navigation) so there is one way to
 * drive the docs site in CI, not two.
 *
 *   pnpm test:visual          compare against baselines, fail on any diff
 *   pnpm test:visual:update   (re)write baselines, never fails on a diff
 *
 * Baselines live in tests/visual/__baselines__/<slug>.png and are committed.
 * Diffs for a failing run are written to tests/visual/__diffs__/ (gitignored)
 * so a reviewer can see exactly which pixels moved.
 */
import { mkdirSync, existsSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'

import { navigation } from '../src/data/navigation'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const baselineDir = join(root, 'tests/visual/__baselines__')
const diffDir = join(root, 'tests/visual/__diffs__')

const BASE = process.env.BASE_URL ?? `http://localhost:${process.env.PORT ?? 8443}`
const update = process.argv.includes('--update')
// Optional slug filter: `pnpm test:visual -- data-grid combobox`.
const only = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const slugs = navigation
  .flatMap((g) => g.items.map((i) => i.slug))
  .filter((s) => only.length === 0 || only.includes(s))

// A pixel is "different" only past this per-channel threshold, and the run only
// fails past a small ratio of changed pixels - antialiasing shifts a handful of
// pixels between otherwise identical renders and should not fail a build.
const MATCH_THRESHOLD = 0.1
const FAIL_RATIO = 0.001

mkdirSync(baselineDir, { recursive: true })
if (!update) {
  rmSync(diffDir, { recursive: true, force: true })
  mkdirSync(diffDir, { recursive: true })
}

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  // Pin the scale factor so a baseline captured on one machine matches the
  // next; a HiDPI host would otherwise double every dimension.
  deviceScaleFactor: 1,
})

type Outcome = { slug: string; status: 'pass' | 'fail' | 'new' | 'missing'; detail?: string }
const results: Outcome[] = []

for (const slug of slugs) {
  await page.goto(`${BASE}/#/component/${slug}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(150)

  // The State gallery panel is the deterministic surface. Locate its <section>
  // the same way audit-gallery does, then shoot just that element.
  const handle = await page.evaluateHandle(() => {
    const heading = [...document.querySelectorAll('h2')].find((h) => h.textContent?.trim() === 'States')
    return heading?.closest('section') ?? null
  })
  const element = handle.asElement()
  if (!element) {
    results.push({ slug, status: 'missing', detail: 'no States gallery' })
    continue
  }

  const shot = await element.screenshot({ type: 'png' })
  const baselinePath = join(baselineDir, `${slug}.png`)

  if (update || !existsSync(baselinePath)) {
    writeFileSync(baselinePath, shot)
    results.push({ slug, status: update ? 'pass' : 'new' })
    continue
  }

  const actual = PNG.sync.read(shot)
  const expected = PNG.sync.read(readFileSync(baselinePath))

  if (actual.width !== expected.width || actual.height !== expected.height) {
    results.push({
      slug,
      status: 'fail',
      detail: `size ${actual.width}x${actual.height} != baseline ${expected.width}x${expected.height}`,
    })
    writeFileSync(join(diffDir, `${slug}.png`), shot)
    continue
  }

  const diff = new PNG({ width: actual.width, height: actual.height })
  const changed = pixelmatch(
    actual.data, expected.data, diff.data, actual.width, actual.height,
    { threshold: MATCH_THRESHOLD },
  )
  const ratio = changed / (actual.width * actual.height)
  if (ratio > FAIL_RATIO) {
    writeFileSync(join(diffDir, `${slug}.png`), PNG.sync.write(diff))
    results.push({ slug, status: 'fail', detail: `${changed} px changed (${(ratio * 100).toFixed(2)}%)` })
  } else {
    results.push({ slug, status: 'pass' })
  }
}

await browser.close()

const failed = results.filter((r) => r.status === 'fail' || r.status === 'missing')
const created = results.filter((r) => r.status === 'new')

for (const r of created) console.log(`  + baseline created: ${r.slug}`)
for (const r of failed) console.log(`  ✗ ${r.slug} | ${r.detail}`)

if (update) {
  console.log(`✓ wrote ${results.length} baseline(s) to tests/visual/__baselines__`)
} else if (failed.length === 0) {
  const suffix = created.length ? ` (${created.length} new baseline(s))` : ''
  console.log(`✓ all ${results.length} component pages match their visual baseline${suffix}`)
} else {
  console.log(`✗ ${failed.length} of ${results.length} page(s) changed. Diffs in tests/visual/__diffs__.`)
  console.log('  If the change is intentional, re-run with: pnpm test:visual:update')
  process.exitCode = 1
}
