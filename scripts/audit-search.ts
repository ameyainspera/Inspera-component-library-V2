/**
 * Search quality check.
 *
 * The point of sidebar search is that you do NOT have to know the canonical
 * name - so the thing worth testing is the vocabulary people actually type.
 * Each case asserts the expected component is the top hit; a case that merely
 * ranks is reported as a near-miss, not a pass.
 */
import { componentList } from '../src/data/components'
import { navigation } from '../src/data/navigation'
import { search, type Searchable } from '../src/docs/search'

const items: Searchable[] = componentList.map((c) => ({
  id: c.slug,
  name: c.name,
  detail: c.purpose,
  group: navigation.find((g) => g.category === c.category)?.label ?? c.category,
  terms: [...(c.keywords ?? []), ...c.deprecatedAliases],
  href: `#/component/${c.slug}`,
}))

/** [query, expected top hit] */
const CASES: [string, string][] = [
  // Synonyms - the main reason this exists.
  ['modal', 'Dialog'], ['popup', 'Dialog'], ['toast', 'Snackbar'],
  ['dropdown', 'Select'], ['combobox', 'Select'], ['switch', 'Toggle'],
  ['wizard', 'Stepper'], ['chip', 'Badge'], ['datagrid', 'Table'],
  ['calendar', 'Date Picker'], ['faq', 'Accordion'], ['kpi', 'Stat'],
  ['facepile', 'Avatar Group'], ['no results', 'Empty State'],
  ['2fa', 'OTP Input'], ['pager', 'Pagination'], ['side panel', 'Drawer'],
  ['separator', 'Divider'], ['shimmer', 'Skeleton'], ['stars', 'Rating'],
  ['loader', 'Spinner'], ['dropzone', 'File Upload'], ['anchor', 'Link'],
  // Typos.
  ['dilaog', 'Dialog'], ['slect', 'Select'], ['togle', 'Toggle'],
  ['snakbar', 'Snackbar'], ['breadcrum', 'Breadcrumb'], ['acordion', 'Accordion'],
  ['tooltp', 'Tooltip'], ['paginaton', 'Pagination'],
  // Abbreviations and partials.
  ['txtinput', 'Text Input'], ['textinput', 'Text Input'], ['btn', 'Button'],
  ['segctrl', 'Segmented Control'], ['avgroup', 'Avatar Group'],
]

// Known-ambiguous words: several components legitimately answer to these, so
// we only require the expected one to appear, not to win.
const AMBIGUOUS = new Set(['dropdown', 'loading'])

let failures = 0
for (const [query, expected] of CASES) {
  const hits = search(query, items)
  const rank = hits.findIndex((h) => h.item.name === expected)
  const ok = AMBIGUOUS.has(query) ? rank >= 0 && rank < 3 : hits[0]?.item.name === expected
  if (!ok) {
    failures++
    const got = hits[0]?.item.name ?? '(nothing)'
    console.log(
      `  ✗ "${query}" -> ${got}; expected ${expected}` +
        (rank >= 0 ? ` (ranked #${rank + 1})` : ' (absent from results)'),
    )
  }
}

// Junk must not match, or the fuzzy tiers are too loose to be useful.
for (const junk of ['zzzzzz', 'qqqq', 'xylophone']) {
  const hits = search(junk, items)
  if (hits.length > 0) {
    failures++
    console.log(`  ✗ "${junk}" should match nothing, got ${hits.length} (top: ${hits[0].item.name})`)
  }
}

console.log(
  failures === 0
    ? `✓ search: ${CASES.length} vocabulary cases pass, junk queries return nothing`
    : `✗ search: ${failures} failure(s)`,
)
process.exit(failures === 0 ? 0 : 1)
