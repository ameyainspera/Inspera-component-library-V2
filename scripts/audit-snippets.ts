/**
 * The playground's copyable JSX must be the code that produced the preview.
 *
 * It is the one place on a component page showing real, working, lowercase
 * API at the instance level - so when a control moves the preview but not the
 * snippet, the block hands you code that does not build what you are looking
 * at. Same failure class as the Capitalized-prop bug that started all this:
 * silently wrong, no error, and only visible if you already knew the answer.
 *
 * Two rules:
 *   1. Every control must change the snippet when it changes.
 *   2. A snippet may not pass a presentation-only `state`. The prop carries two
 *      different kinds of value: Hover/Focused/Pressed/Filled freeze an
 *      appearance for the gallery and are meaningless in application code,
 *      while Error/Disabled/ReadOnly are real application state with no other
 *      way to set them. Copyable JSX may teach the second group and must not
 *      teach the first.
 */
import { registry } from '../src/docs/registry'

const PRESENTATION_ONLY = ['Hover', 'Focused', 'Pressed', 'Filled']
const problems: string[] = []

for (const [slug, entry] of Object.entries(registry)) {
  const rendered = entry.snippet(entry.defaults)

  for (const key of Object.keys(entry.controls)) {
    const alt = entry.controls[key].options.find((o) => o !== entry.defaults[key])
    if (alt === undefined) {
      problems.push(`${slug} | control "${key}" has no alternative value to test`)
      continue
    }
    // `state` legitimately does not reach the JSX for its presentation-only
    // values, so it is exempt from rule 1 but not from rule 2.
    if (key !== 'state' && entry.snippet({ ...entry.defaults, [key]: alt }) === rendered) {
      problems.push(`${slug} | control "${key}" moves the preview but not the JSX`)
    }
  }

  // Rule 2 across every single-control variation, not just the defaults - an
  // error or disabled branch only appears once a control is moved.
  for (const [key, def] of Object.entries(entry.controls)) {
    for (const option of def.options) {
      const out = entry.snippet({ ...entry.defaults, [key]: option })
      for (const bad of PRESENTATION_ONLY) {
        if (out.includes(`state="${bad}"`)) {
          problems.push(`${slug} | ${key}="${option}" yields JSX passing state="${bad}", which is presentation-only`)
        }
      }
    }
  }
}

const controls = Object.values(registry).reduce((n, e) => n + Object.keys(e.controls).length, 0)

if (problems.length > 0) {
  console.error(`\n✗ ${problems.length} playground control(s) out of sync with the copyable JSX:\n`)
  for (const p of problems) console.error('  ' + p)
  console.error('\nFix the `snippet` in src/docs/registry.tsx so it reflects the control.\n')
  process.exit(1)
}
console.log(`✓ snippets: ${controls} controls across ${Object.keys(registry).length} components all reflected in the JSX`)
