/**
 * DESIGN.md against the library: the checks behind `pnpm audit:design-md`.
 *
 * design-md/ is written by the design system team and never edited here, so
 * when it and the library disagree, nothing is fixed on the spot. Instead,
 * every disagreement is made visible and deliberate:
 *
 *   - Exact checks, wherever DESIGN.md states something the library holds as
 *     data: token values, component names, props, variants, sizes, radii.
 *   - Review triggers, for what it says in prose. A claim names the sections
 *     of the full guide it describes; when one of them changes, the claim is
 *     up for review until someone re-reads it and runs `--update`, the way
 *     `test:visual:update` accepts new screenshots.
 *   - Known differences (src/data/design-md.ts). Each acknowledges a
 *     disagreement and says which file to follow, and they ship as errata in
 *     the start-here note. A difference that is not listed fails the audit,
 *     and so does a listed one that no longer reproduces, so the errata that
 *     ship stay true.
 *
 * Read-only. scripts/audit-design-md.ts prints the report; the claims are in
 * scripts/design-md-claims.ts.
 */
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { designGuideFiles, designGuideMarkers, designGuideServed, designGuideSource, knownDifferences } from '../src/data/design-md'
import { contrastRatio, TEXT_CONTRAST } from './contrast'
import { acknowledged, claims, frontMatterComponents, type Claim } from './design-md-claims'
import { describedNumbers, filesUnder, loadLibrary, missingRadius, px, read, root, unionOf } from './design-md-library'

/** Where reviewed section hashes are kept. Local tooling; it does not ship. */
export const LOCK_FILE = 'scripts/design-md.lock.json'

type FrontMatter = Record<string, Record<string, string | Record<string, string>>>

/** The YAML front matter of DESIGN.md: up to three levels of plain maps, which is all the format uses. */
export function frontMatter(text: string): { data: FrontMatter; lineOf: (path: string) => number } {
  const lines = text.split('\n')
  const data: FrontMatter = {}
  const lineNo = new Map<string, number>()
  if (lines[0] !== '---') return { data, lineOf: () => 1 }
  const unquote = (v: string) => v.trim().replace(/^"(.*)"$/, '$1')
  let top = ''
  let second = ''
  for (let i = 1; i < lines.length && lines[i] !== '---'; i++) {
    const line = lines[i]
    let m: RegExpMatchArray | null
    if ((m = line.match(/^([\w-]+):\s*(.*)$/))) {
      top = m[1]
      data[top] = {}
      lineNo.set(top, i + 1)
    } else if ((m = line.match(/^ {2}"?([\w-]+)"?:\s*(.*)$/)) && top) {
      second = m[1]
      data[top][second] = m[2].trim() === '' ? {} : unquote(m[2])
      lineNo.set(`${top}.${second}`, i + 1)
    } else if ((m = line.match(/^ {4}([\w-]+):\s*(.*)$/)) && top && second) {
      const parent = data[top][second]
      if (typeof parent === 'object') parent[m[1]] = unquote(m[2])
      lineNo.set(`${top}.${second}.${m[1]}`, i + 1)
    }
  }
  return { data, lineOf: (path) => lineNo.get(path) ?? 1 }
}

export interface Finding {
  /** Stable id: what known differences and the acknowledgement list refer to. */
  key: string
  file: string
  line: number
  /** What DESIGN.md says. */
  says: string
  /** What the library does instead. */
  library: string
  /** The known difference that acknowledges it, if any. */
  known?: string
}

export interface Report {
  /** Disagreements no known difference covers. These fail the audit. */
  drift: Finding[]
  /** Disagreements a known difference covers. These ship as errata. */
  acknowledged: Finding[]
  /** Broken links between the design guide and the library: missing files, moved quotes, stale errata. */
  integrity: string[]
  /** Claims whose sections of the full guide changed since they were last reviewed. */
  review: { section: string; claims: Claim[] }[]
  /** Worth a look, but not a disagreement with the library. */
  warnings: string[]
  /** Checks that could not read the library's value, so did not run. */
  unverifiable: string[]
  /** Section hashes as they are now, for `--update`. */
  hashes: Record<string, string>
  counts: { claims: number; tokens: number; components: number }
}

const sha = (text: string) => createHash('sha256').update(text).digest('hex').slice(0, 16)
const norm = (v: string) => v.replace(/\s+/g, '').toLowerCase()
const lineOfText = (text: string, needle: string) => {
  const i = text.indexOf(needle)
  return i < 0 ? 1 : text.slice(0, i).split('\n').length
}

/** `#rrggbb`, or `rgba(r, g, b, a)` flattened onto a solid background, as `#rrggbb`. */
function solid(colour: string, over: string): string | null {
  if (/^#[0-9a-f]{6}$/i.test(colour)) return colour
  const m = colour.match(/^rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\s*\)$/)
  if (!m || !/^#[0-9a-f]{6}$/i.test(over)) return null
  const a = m[4] === undefined ? 1 : Number(m[4])
  const bg = [1, 3, 5].map((i) => parseInt(over.slice(i, i + 2), 16))
  return `#${[1, 2, 3].map((i, k) => Math.round(a * Number(m[i]) + (1 - a) * bg[k]).toString(16).padStart(2, '0')).join('')}`
}

export function readLock(): Record<string, string> {
  try {
    return (JSON.parse(read(LOCK_FILE)) as { sections: Record<string, string> }).sections
  } catch {
    return {}
  }
}

export function checkDesignMd(): Report {
  const lib = loadLibrary()
  const findings: Finding[] = []
  const integrity: string[] = []
  const warnings: string[] = []
  const unverifiable: string[] = []

  // -- The folder: exactly the listed files, each published byte for byte. --
  const listed = designGuideFiles.map((f) => f.path)
  const present = filesUnder(designGuideSource)
  for (const p of listed.filter((p) => !present.includes(p))) {
    integrity.push(`${designGuideSource}/${p} is listed in src/data/design-md.ts but missing from the folder.`)
  }
  for (const p of present.filter((p) => !listed.includes(p))) {
    integrity.push(`${designGuideSource}/${p} is not listed in src/data/design-md.ts, so it is not published. List it, with when to read it.`)
  }
  const docs = new Map<string, string>()
  for (const p of listed.filter((p) => present.includes(p))) {
    const source = readFileSync(join(root, designGuideSource, p))
    docs.set(p, source.toString('utf8'))
    const copy = join(root, 'public', designGuideServed, p)
    if (!existsSync(copy) || !readFileSync(copy).equals(source)) {
      integrity.push(`public/${designGuideServed}/${p} differs from ${designGuideSource}/${p}. Run pnpm generate.`)
    }
  }
  const design = docs.get('DESIGN.md') ?? ''
  const where = (file: string, needle: string) => lineOfText(docs.get(file) ?? '', needle)

  // -- What the library says about DESIGN.md must still be true of it. --
  for (const f of listed.filter((p) => p !== 'DESIGN.md')) {
    if (!design.includes(f)) integrity.push(`DESIGN.md no longer mentions ${f}, but the start-here note says when to read it. Update designGuideFiles.`)
  }
  for (const m of designGuideMarkers) {
    if (!design.includes(m.name)) integrity.push(`DESIGN.md no longer uses the marker ${m.name}, but the AI spec page explains it. Update designGuideMarkers.`)
  }
  for (const [file, text] of docs) {
    // File names only: not the `{rounded.md}` token references in the front matter.
    const cites = new Set([...text.matchAll(/(?<![\w{./-])(?:[\w-]+\/)*[\w-]+\.md\b/g)].map((m) => m[0]))
    for (const cited of cites) {
      const found = cited === lib.fullGuideName || cited === 'DESIGN.md' || listed.includes(cited) || listed.includes(`references/${cited}`)
      if (!found) warnings.push(`${file}:${lineOfText(text, cited)} cites ${cited}, which is not in the folder.`)
    }
  }

  // -- Example code that would not work if copied: a library component given a
  //    controlled prop with no handler renders a control nobody can change. --
  const CONTROLLED: Record<string, string> = { value: 'onChange', checked: 'onChange', page: 'onChange', open: 'onClose' }
  for (const [file, text] of docs) {
    for (const block of text.matchAll(/```(?:tsx|jsx)\n([\s\S]*?)```/g)) {
      // A tag's attributes, allowing one level of nested braces: options={['A', 'B']}, onRemove={() => {}}.
      for (const tag of block[1].matchAll(/<([A-Z]\w*)((?:[^<>{}]|\{(?:[^{}]|\{[^{}]*\})*\})*?)\/?>/g)) {
        if (!lib.api[tag[1]]) continue
        const attrs = new Set([...tag[2].matchAll(/(?:^|\s)([a-zA-Z]+)(?==|\s|$)/g)].map((m) => m[1]))
        for (const [prop, handler] of Object.entries(CONTROLLED)) {
          if (!attrs.has(prop) || attrs.has(handler)) continue
          const at = lineOfText(text, block[0]) + block[1].slice(0, tag.index).split('\n').length
          const fallback = `default${prop[0].toUpperCase()}${prop.slice(1)}`
          warnings.push(`${file}:${at} <${tag[1]}> sets \`${prop}\` with no \`${handler}\`, so code copied from it renders a control that cannot be changed. \`${fallback}\` would work.`)
        }
      }
    }
  }

  // -- Front matter: tokens. --
  const fm = frontMatter(design)
  const fmFinding = (path: string, says: string, library: string) =>
    findings.push({ key: `front-matter:${path}`, file: 'DESIGN.md', line: fm.lineOf(path), says, library })
  let tokens = 0
  for (const [name, value] of Object.entries(fm.data.colors ?? {})) {
    tokens++
    const actual = lib.vars.get(name)
    if (typeof value !== 'string') continue
    if (actual === undefined) fmFinding(`colors.${name}`, `colour ${name}: ${value}`, `there is no --${name} token`)
    else if (norm(actual) !== norm(value)) fmFinding(`colors.${name}`, `colour ${name}: ${value}`, `--${name} is ${actual}`)
  }
  for (const [name, style] of Object.entries(fm.data.typography ?? {})) {
    tokens++
    if (typeof style !== 'object') continue
    const cls = lib.classes.get(name)
    if (!cls) {
      fmFinding(`typography.${name}`, `type style ${name}`, `there is no .inspera-${name} class`)
      continue
    }
    const differs: string[] = []
    if (px(cls['font-size']) !== px(style.fontSize)) differs.push(`size ${cls['font-size']}`)
    if (String(cls['font-weight']) !== String(style.fontWeight)) differs.push(`weight ${cls['font-weight']}`)
    if (cls['line-height'] !== undefined && String(cls['line-height']) !== String(style.lineHeight)) differs.push(`line height ${cls['line-height']}`)
    if ((px(cls['letter-spacing']) ?? 0) !== (px(style.letterSpacing) ?? 0)) differs.push(`letter spacing ${cls['letter-spacing'] ?? '0'}`)
    if (!(cls['font-family'] ?? '').includes(style.fontFamily ?? '')) differs.push(`family ${cls['font-family']}`)
    if (differs.length > 0) {
      fmFinding(`typography.${name}`, `type style ${name}: ${style.fontSize} / ${style.fontWeight} / ${style.lineHeight}`, `.inspera-${name} has ${differs.join(', ')}`)
    }
  }
  for (const [group, prefix] of [['rounded', 'radius'], ['spacing', 'space']] as const) {
    for (const [name, value] of Object.entries(fm.data[group] ?? {})) {
      tokens++
      const actual = lib.vars.get(`${prefix}-${name}`)
      if (typeof value === 'string' && px(actual) !== px(value)) {
        fmFinding(`${group}.${name}`, `${group} ${name}: ${value}`, `--${prefix}-${name} is ${actual ?? 'missing'}`)
      }
    }
  }
  const palettePath = 'references/tokens-palette.md'
  for (const m of (docs.get(palettePath) ?? '').matchAll(/^\s+([\w-]+):\s*"(#[0-9A-Fa-f]{6})"/gm)) {
    tokens++
    const actual = lib.vars.get(m[1])
    if (!actual || norm(actual) !== norm(m[2])) {
      findings.push({ key: `palette:${m[1]}`, file: palettePath, line: where(palettePath, m[0].trim()), says: `${m[1]}: ${m[2]}`, library: `--${m[1]} is ${actual ?? 'missing'}` })
    }
  }

  // -- Front matter: components. --
  const colourOf = (ref: string | undefined) => {
    const m = ref?.match(/^\{colors\.([\w-]+)\}$/)
    const v = m ? fm.data.colors?.[m[1]] : undefined
    return typeof v === 'string' ? v : undefined
  }
  const surface = colourOf('{colors.surface}') ?? '#ffffff'
  for (const [name, props] of Object.entries(fm.data.components ?? {})) {
    if (typeof props !== 'object') continue
    const spec = frontMatterComponents[name.replace(/-(hover|active)$/, '')]
    if (!spec) {
      integrity.push(`DESIGN.md:${fm.lineOf(`components.${name}`)} describes a component "${name}" that scripts/design-md-claims.ts does not map, so nothing checks it. Add it to frontMatterComponents.`)
    }
    for (const [prop, value] of Object.entries(props)) {
      const ref = value.match(/^\{(colors|typography|rounded)\.([\w-]+)\}$/)
      if (ref && !(fm.data[ref[1]] && ref[2] in fm.data[ref[1]])) {
        fmFinding(`components.${name}.${prop}`, `${name} ${prop}: ${value}`, `${ref[1]}.${ref[2]} is not defined in the front matter`)
      }
      if (prop === 'rounded' && ref && spec && missingRadius(lib, ref[2], [spec.component]).length > 0) {
        const uses = Object.keys(lib.radiusUsers).filter((t) => lib.radiusUsers[t].includes(spec.component))
        fmFinding(`components.${name}.rounded`, `${name} is ${ref[2]}`, `${spec.component} does not use --radius-${ref[2]} (it uses ${uses.join(', ') || 'none'})`)
      }
      const measure = spec?.measures?.[prop]
      if (measure) {
        const actual = measure(lib, name)
        if (actual === null) unverifiable.push(`DESIGN.md front matter ${name}.${prop}: could not read the library's value`)
        else if (actual !== px(value)) fmFinding(`components.${name}.${prop}`, `${name} ${prop}: ${value}`, `${actual}px`)
      }
    }
    // The contrast of the pairs DESIGN.md prescribes. A warning, not a
    // difference: the library ships the same tokens, so both are wrong together.
    const text = colourOf(props.textColor)
    if (text && !/disabled/.test(name)) {
      const bg = solid(colourOf(props.backgroundColor) ?? surface, surface)
      const fg = bg ? solid(text, bg) : null
      if (bg && fg) {
        const ratio = contrastRatio(fg, bg)
        if (ratio < TEXT_CONTRAST) {
          warnings.push(`DESIGN.md:${fm.lineOf(`components.${name}`)} ${name}: ${props.textColor} on ${props.backgroundColor ?? '{colors.surface}'} is ${ratio.toFixed(2)}:1, under the 4.5:1 WCAG AA minimum for text.`)
        }
      }
    }
  }

  // -- references/components.md: the component index against the API. --
  const indexPath = 'references/components.md'
  const index = docs.get(indexPath) ?? ''
  const indexed = new Set<string>()
  // Required props the row states in words: "exactly one child control", "Table props +".
  const REQUIRED_IN_PROSE: Record<string, string[]> = { FormField: ['children'], Tooltip: ['children'], DataGrid: ['columns', 'rows'] }
  // Documented on something the component takes, not on it: "column `align: 'right'`".
  const NESTED: Record<string, string[]> = { Table: ['align'] }
  // The index lists Toast; the export is the provider plus a `toast()` function.
  const apiName = (n: string) => (n === 'Toast' ? 'ToastProvider' : n)
  for (const row of index.matchAll(/^\| `(\w+)` \| [^|]+ \| (.+) \|$/gm)) {
    const [, rowName, cellText] = row
    const name = apiName(rowName)
    indexed.add(name)
    const props = lib.api[name]
    const key = (prop?: string) => `components.md:${rowName}${prop ? `.${prop}` : ''}`
    const line = index.slice(0, row.index).split('\n').length
    const find = (prop: string | undefined, says: string, library: string) => findings.push({ key: key(prop), file: indexPath, line, says, library })
    if (!props) {
      find(undefined, `${rowName} is a component`, 'there is no such component')
      continue
    }
    const starred = new Set<string>()
    for (const segment of cellText.split(' · ')) {
      let last: string | null = null
      for (const t of segment.matchAll(/`([^`]+)`(\*)?/g)) {
        const tick = t[1]
        if (lib.api[tick] || tick.includes('(')) continue
        if (segment.slice(0, t.index).endsWith('defaults to ')) {
          const def = props.find((p) => p.name === last)?.default?.replace(/^'(.*)'$/, '$1')
          if (last && def !== tick) find(last, `${last} defaults to ${tick}`, `the default is ${def ?? 'unset'}`)
          continue
        }
        const prop = tick.split(/[\s:=]/)[0]
        if (NESTED[name]?.includes(prop)) continue
        const doc = props.find((p) => p.name === prop)
        if (!doc) {
          find(prop, `${rowName} has a prop \`${prop}\``, 'there is no such prop')
          continue
        }
        if (t[2]) {
          starred.add(prop)
          if (!doc.required) find(prop, `${prop} is required`, 'it is optional')
        }
        last = prop
      }
      if (!last) continue
      // What follows the last prop: a default "(4)", or values "Small 32/Medium 40".
      const tail = segment.slice(segment.lastIndexOf('`') + 1).trim()
      const def = tail.match(/^\((\d+)\)$/)
      if (def) {
        const actual = props.find((p) => p.name === last)?.default
        if (actual !== def[1]) find(last, `${last} defaults to ${def[1]}`, `the default is ${actual ?? 'unset'}`)
        continue
      }
      const values = tail.replace(/\([^)]*\)/g, '').trim()
      if (!/^[A-Z0-9][\w ]*(\/[\w ]+)*$/.test(values)) continue
      const prop: string = last
      const union = unionOf(lib, name, prop)
      const described = describedNumbers(lib, name, prop)
      const items = values.split('/').map((v) => v.trim())
      const said: number[] = []
      const has: number[] = []
      const labels: string[] = []
      items.forEach((item, i) => {
        const word = item.match(/^[A-Z][A-Za-z]*/)?.[0]
        const n = item.match(/(\d+)(px)?$/)?.[1]
        if (word && !union.includes(word)) {
          find(prop, `${prop} can be ${word}`, union.length ? `its values are ${union.join(', ')}` : 'it is not a variant prop')
        }
        if (n !== undefined) {
          said.push(Number(n))
          has.push(described[word ? union.indexOf(word) : i] ?? NaN)
          labels.push(word ?? '')
        }
      })
      if (said.length === 0) continue
      // Sizes listed without names, in another number than the prop documents:
      // a size added or dropped. The prop's own list is what the library has.
      if (labels.every((l) => l === '') && described.length > 0 && said.length !== described.length) {
        find(prop, `${prop} ${values}`, described.join('/'))
        continue
      }
      if (has.some((n) => Number.isNaN(n))) {
        unverifiable.push(`${indexPath} ${rowName}.${prop} "${values}": the prop's description gives no sizes to compare`)
      } else if (said.some((n, i) => n !== has[i])) {
        find(prop, `${prop} ${values}`, has.map((n, i) => `${labels[i]} ${n}`.trim()).join('/'))
      }
    }
    for (const p of props.filter((p) => p.required && !starred.has(p.name))) {
      if (!REQUIRED_IN_PROSE[name]?.includes(p.name)) find(p.name, `${p.name} is optional (no *)`, 'it is required')
    }
  }
  for (const name of Object.keys(lib.api).filter((n) => !indexed.has(n))) {
    findings.push({ key: `components.md:${name}`, file: indexPath, line: 1, says: `the index has no ${name}`, library: `${name} is a component` })
  }

  // -- Claims: what DESIGN.md says in prose. --
  const hashes: Record<string, string> = {}
  const reviewed = readLock()
  const changed = new Map<string, Claim[]>()
  for (const claim of claims) {
    const text = docs.get(claim.file)
    if (text === undefined) continue
    if (!text.includes(claim.quote)) {
      integrity.push(`${claim.file} no longer says "${claim.quote.trim()}" (claim ${claim.id}). DESIGN.md changed here: re-read it and update the claim in scripts/design-md-claims.ts.`)
      continue
    }
    if (claim.check) {
      const library = claim.check(lib)
      if (library !== null) findings.push({ key: `claim:${claim.id}`, file: claim.file, line: lineOfText(text, claim.quote), says: claim.says, library, known: claim.known })
    }
    for (const section of claim.sections ?? []) {
      const body = lib.sections.get(section)
      if (body === undefined) {
        integrity.push(`Claim ${claim.id} names the full guide's "${section}" section, which does not exist.`)
        continue
      }
      hashes[section] = sha(body)
      if (reviewed[section] !== hashes[section]) changed.set(section, [...(changed.get(section) ?? []), claim])
    }
  }
  const review = [...changed].map(([section, list]) => ({ section, claims: list }))

  // -- Sort findings into acknowledged and new; check the errata still hold. --
  const knownIds = new Set(knownDifferences.map((d) => d.id))
  for (const [k, id] of Object.entries(acknowledged)) {
    if (!knownIds.has(id)) integrity.push(`scripts/design-md-claims.ts acknowledges ${k} with "${id}", which is not a known difference.`)
  }
  for (const c of claims.filter((c) => c.known && !knownIds.has(c.known))) {
    integrity.push(`Claim ${c.id} points at known difference "${c.known}", which does not exist.`)
  }
  for (const f of findings) if (!f.known) f.known = acknowledged[f.key]
  const drift = findings.filter((f) => !f.known)
  const acked = findings.filter((f) => f.known)
  for (const d of knownDifferences) {
    const keys = Object.keys(acknowledged).filter((k) => acknowledged[k] === d.id)
    const covering = claims.filter((c) => c.known === d.id)
    if (keys.length === 0 && covering.length === 0) {
      integrity.push(`Known difference "${d.id}" is tied to no check. Tie it to a claim or a finding, or remove it.`)
      continue
    }
    // Provable only when every part of it is checked; a prose-only part is left to review.
    if (covering.every((c) => c.check) && !acked.some((f) => f.known === d.id)) {
      integrity.push(`Known difference "${d.id}" no longer reproduces: DESIGN.md and the library agree now. Remove it from src/data/design-md.ts, so the errata stay true.`)
    }
  }

  return {
    drift,
    acknowledged: acked,
    integrity,
    review,
    warnings,
    unverifiable,
    hashes,
    counts: { claims: claims.length, tokens, components: indexed.size },
  }
}

/** One line for `pnpm generate`, which reports this but never fails on it. */
export function summarise(r: Report): string {
  const parts = [
    r.drift.length > 0 && `${r.drift.length} new difference(s)`,
    r.integrity.length > 0 && `${r.integrity.length} broken link(s)`,
    r.review.length > 0 && `${r.review.length} changed section(s) to review`,
  ].filter(Boolean)
  return parts.length === 0
    ? `DESIGN.md: in step with the library; ${knownDifferences.length} known difference(s) ship as errata.`
    : `DESIGN.md: ${parts.join(', ')}. Run pnpm audit:design-md.`
}
