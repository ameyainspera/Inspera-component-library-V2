/**
 * Is DESIGN.md still in step with the library?
 *
 *   pnpm audit:design-md             the report; fails on anything not yet acknowledged
 *   pnpm audit:design-md --update    after re-reading the claims it lists, record the review
 *   pnpm audit:design-md --request   a change request to send the design system team
 *   pnpm audit:design-md --verbose   also list the checks that could not run
 *
 * It reads the generated outputs, so run `pnpm generate` first. How the
 * checks work is in scripts/design-md-check.ts.
 */
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { knownDifferences } from '../src/data/design-md'
import { checkDesignMd, LOCK_FILE, type Finding, type Report } from './design-md-check'
import { root } from './design-md-library'

const args = new Set(process.argv.slice(2))
const report: Report = checkDesignMd()
const at = (f: Finding) => `${f.file}:${f.line}`
const titleOf = (id: string) => knownDifferences.find((d) => d.id === id)

if (args.has('--update')) {
  const sections = Object.fromEntries(Object.entries(report.hashes).sort(([a], [b]) => a.localeCompare(b)))
  writeFileSync(
    join(root, LOCK_FILE),
    JSON.stringify(
      {
        about:
          'Sections of the full guide whose DESIGN.md claims were last re-read against them. Written by pnpm audit:design-md --update; do not edit.',
        sections,
      },
      null,
      2,
    ) + '\n',
  )
  console.log(`Recorded the review of ${Object.keys(sections).length} section(s) of the full guide in ${LOCK_FILE}.\n`)
  report.review = []
}

if (args.has('--request')) {
  // What the design system team can act on: everything that is DESIGN.md's to fix.
  const items = [
    ...report.drift,
    ...report.acknowledged.filter((f) => titleOf(f.known!)?.fixIn !== 'library'),
  ]
  console.log('Change request for design-md/, from the Inspera component library\n')
  if (items.length === 0 && report.warnings.length === 0) console.log('Nothing to change.')
  items.forEach((f, i) => {
    const k = f.known ? titleOf(f.known) : undefined
    console.log(`${i + 1}. ${at(f)}`)
    console.log(`   DESIGN.md: ${f.says}`)
    console.log(`   The library: ${f.library}`)
    if (k) console.log(`   (${k.topic}. Fix in ${k.fixIn}.)`)
  })
  if (report.warnings.length > 0) {
    console.log('\nAlso worth a look:')
    for (const w of report.warnings) console.log(`- ${w}`)
  }
  process.exit(0)
}

console.log(
  `DESIGN.md audit: ${report.counts.claims} claims, ${report.counts.tokens} tokens and ` +
    `${report.counts.components} components checked against the library.\n`,
)

if (report.acknowledged.length > 0) {
  console.log('Known differences (they ship as errata in the start-here note):')
  for (const d of knownDifferences) {
    const own = report.acknowledged.filter((f) => f.known === d.id)
    if (own.length === 0) continue
    console.log(`  ${d.id} - ${d.topic}. Follow: ${d.follow}`)
    for (const f of own) console.log(`    ${at(f)}  ${f.says}  ->  ${f.library}`)
  }
  console.log('')
}

const failed: string[] = []

if (report.drift.length > 0) {
  failed.push(`${report.drift.length} new difference(s)`)
  console.log('New differences - DESIGN.md and the library disagree:')
  for (const f of report.drift) console.log(`  ${at(f)}  ${f.says}  ->  ${f.library}   [${f.key}]`)
  console.log(
    '  Either change the library back, or acknowledge the difference: add it to knownDifferences in\n' +
      '  src/data/design-md.ts (it ships as errata) and tie the key above to it in scripts/design-md-claims.ts.\n' +
      '  Then send the design system team the change request: pnpm audit:design-md --request\n',
  )
}

if (report.integrity.length > 0) {
  failed.push(`${report.integrity.length} broken link(s)`)
  console.log('Broken links between the design guide and the library:')
  for (const line of report.integrity) console.log(`  - ${line}`)
  console.log('')
}

if (report.review.length > 0) {
  failed.push(`${report.review.length} section(s) to review`)
  console.log('Changed since last reviewed - re-read these DESIGN.md claims against the full guide:')
  for (const { section, claims } of report.review) {
    console.log(`  "${section}":`)
    for (const c of claims) console.log(`    ${c.file}: ${c.says}`)
  }
  console.log(
    '  If a claim no longer holds, acknowledge it as a known difference. Then record the review:\n' +
      '  pnpm audit:design-md --update\n',
  )
}

if (report.warnings.length > 0) {
  console.log('Worth a look (not a disagreement with the library):')
  for (const w of report.warnings) console.log(`  - ${w}`)
  console.log('')
}

if (report.unverifiable.length > 0) {
  if (args.has('--verbose')) {
    console.log('Could not check:')
    for (const u of report.unverifiable) console.log(`  - ${u}`)
    console.log('')
  } else {
    console.log(`${report.unverifiable.length} check(s) could not read the library's value (--verbose lists them).\n`)
  }
}

if (failed.length > 0) {
  console.error(`DESIGN.md audit failed: ${failed.join(', ')}.`)
  process.exit(1)
}
console.log(
  report.acknowledged.length > 0
    ? 'DESIGN.md is in step with the library, apart from the known differences above.'
    : 'DESIGN.md is in step with the library.',
)
