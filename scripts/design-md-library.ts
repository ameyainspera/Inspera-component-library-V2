/**
 * The library as the DESIGN.md audit sees it: read from the generated outputs
 * (public/tokens.css, api.json, aliases.json, llms-full.txt) and the component
 * source. Run `pnpm generate` first, so what is read is current.
 *
 * Shared by the checks (design-md-check.ts) and the claims
 * (design-md-claims.ts), which both compare DESIGN.md against it.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { componentsPackage, fullSpec } from '../src/data/distribution'
import { palette } from '../src/data/tokens'
import type { PropDoc } from './extract-props'

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

export const read = (rel: string) => readFileSync(join(root, rel), 'utf8')

export interface Library {
  /** Every CSS custom property in public/tokens.css, with var() references resolved. */
  vars: Map<string, string>
  /** The .inspera-* classes in public/tokens.css, values resolved. */
  classes: Map<string, Record<string, string>>
  /** Props by component export name, from public/api.json. */
  api: Record<string, PropDoc[]>
  version: string
  aliases: Record<string, string>
  /** Which components use each `--radius-*` / `--shadow-*` token, read from their source. */
  radiusUsers: Record<string, string[]>
  shadowUsers: Record<string, string[]>
  /** A component's source, by file name without .tsx. */
  source: (component: string) => string
  /** The full guide, public/llms-full.txt, and its sections by heading. */
  fullGuide: string
  sections: Map<string, string>
  /** The name the full guide downloads as - DESIGN.md calls it by that name. */
  fullGuideName: string
  packagePublished: boolean
  palette: Record<string, Record<string, string>>
}

function resolveVars(raw: Map<string, string>): Map<string, string> {
  const out = new Map<string, string>()
  for (const [name, value] of raw) {
    let v = value
    for (let i = 0; i < 10 && /var\(--[\w-]+\)/.test(v); i++) {
      v = v.replace(/var\(--([\w-]+)\)/g, (m, ref: string) => raw.get(ref) ?? m)
    }
    out.set(name, v)
  }
  return out
}

/** Headings `##` and `###` start a section; a `####` stays inside its parent. */
export function sectionsOf(text: string): Map<string, string> {
  const out = new Map<string, string>()
  let name: string | null = null
  let body: string[] = []
  const flush = () => {
    if (name === null) return
    let key = name
    for (let n = 2; out.has(key); n++) key = `${name} (${n})`
    out.set(key, body.join('\n'))
  }
  for (const line of text.split('\n')) {
    const m = line.match(/^#{2,3} (.+)$/)
    if (m) {
      flush()
      name = m[1].trim()
      body = [line]
    } else if (name !== null) {
      body.push(line)
    }
  }
  flush()
  return out
}

export function loadLibrary(): Library {
  const css = read('public/tokens.css')
  const raw = new Map<string, string>()
  for (const block of css.match(/:root\s*\{[\s\S]*?\n\}/g) ?? []) {
    for (const m of block.matchAll(/--([\w-]+):\s*([^;]+);/g)) {
      if (!raw.has(m[1])) raw.set(m[1], m[2].replace(/\/\*[\s\S]*?\*\//g, '').trim())
    }
  }
  const vars = resolveVars(raw)
  const classes = new Map<string, Record<string, string>>()
  for (const m of css.matchAll(/\.inspera-([\w-]+)\s*\{([^}]*)\}/g)) {
    const props: Record<string, string> = {}
    for (const p of m[2].matchAll(/([\w-]+):\s*([^;]+);/g)) {
      props[p[1]] = p[2].trim().replace(/var\(--([\w-]+)\)/g, (s, ref: string) => vars.get(ref) ?? s)
    }
    classes.set(m[1], props)
  }

  const apiJson = JSON.parse(read('public/api.json')) as {
    version: string
    components: Record<string, { props: PropDoc[] }>
  }
  const api: Record<string, PropDoc[]> = {}
  for (const [name, c] of Object.entries(apiJson.components)) api[name] = c.props

  const dir = join(root, 'src/components/inspera')
  const sources = new Map<string, string>()
  for (const f of readdirSync(dir).filter((n) => n.endsWith('.tsx'))) {
    sources.set(f.replace(/\.tsx$/, ''), readFileSync(join(dir, f), 'utf8'))
  }
  const users = (prefix: string, tokens: string[]) => {
    const out: Record<string, string[]> = {}
    for (const t of tokens) {
      out[t] = [...sources].filter(([, src]) => src.includes(`var(--${prefix}-${t})`)).map(([n]) => n).sort()
    }
    return out
  }

  // Links in the guide are relative unless INSPERA_DS_BASE_URL is set. Hash
  // the relative form either way, so choosing a host is not a change.
  const base = (process.env.INSPERA_DS_BASE_URL ?? '').replace(/\/$/, '')
  const fullGuide = read(`public/${fullSpec.file}`)
  const normalised = base ? fullGuide.split(`${base}/`).join('./') : fullGuide

  return {
    vars,
    classes,
    api,
    version: apiJson.version,
    aliases: (JSON.parse(read('public/aliases.json')) as { aliases: Record<string, string> }).aliases,
    radiusUsers: users('radius', ['none', 'xs', 'sm', 'md', 'lg', 'xl', 'pill']),
    shadowUsers: users('shadow', ['100', '200', '300', '400', '500', '600']),
    source: (component) => sources.get(component) ?? '',
    fullGuide,
    sections: sectionsOf(normalised),
    fullGuideName: fullSpec.saveAs,
    packagePublished: componentsPackage.published,
    palette,
  }
}

// ---------------------------------------------------------------------------
// Small readers for library facts.
// ---------------------------------------------------------------------------

/** `16px` -> 16. */
export function px(v: string | undefined): number | null {
  const m = v?.match(/^(-?[\d.]+)(px)?$/)
  return m ? Number(m[1]) : null
}

/** The numbers in a prop's description, in order: "Panel width 400 / 480 / 560" -> [400, 480, 560]. */
export function describedNumbers(lib: Library, component: string, prop: string): number[] {
  const doc = lib.api[component]?.find((p) => p.name === prop)?.description ?? ''
  return [...doc.replace(/`[^`]*`/g, '').matchAll(/\d+(?:\.\d+)?/g)].map((m) => Number(m[0]))
}

/** The string literals of a prop's union type: "'Small' | 'Medium'" -> [Small, Medium]. */
export function unionOf(lib: Library, component: string, prop: string): string[] {
  const type = lib.api[component]?.find((p) => p.name === prop)?.type ?? ''
  return [...type.matchAll(/'([^']+)'/g)].map((m) => m[1])
}

/** Of the components named, those that never use `--radius-<token>`. */
export function missingRadius(lib: Library, token: string, components: string[]): string[] {
  return components.filter((c) => !lib.radiusUsers[token]?.includes(c))
}

/** Of the components named, those that never use `--shadow-<level>`. */
export function missingShadow(lib: Library, level: string, components: string[]): string[] {
  return components.filter((c) => !lib.shadowUsers[level]?.includes(c))
}

/**
 * The radius token on one named style object in a component's source:
 * `const triggerStyle: CSSProperties = { ... borderRadius: 'var(--radius-sm)' }`
 * -> 'sm'. Null when the object or its radius is not there, so a renamed
 * object fails the check rather than passing it unread.
 */
export function styleRadius(lib: Library, component: string, style: string): string | null {
  const src = lib.source(component)
  const start = src.indexOf(`const ${style}: CSSProperties = {`)
  if (start < 0) return null
  const body = src.slice(start, src.indexOf('\n  }', start))
  return body.match(/borderRadius: 'var\(--radius-([\w]+)\)'/)?.[1] ?? null
}

/** Button's horizontal padding per size, from its size map. */
export function buttonPadding(lib: Library): Record<string, number> {
  const out: Record<string, number> = {}
  for (const m of lib.source('Button').matchAll(/(Small|Medium|Large):\s*\{[^}]*?\bpx:\s*(\d+)/g)) out[m[1]] = Number(m[2])
  return out
}

/** Every file under a folder, as `/`-separated paths relative to it. Skips Finder's .DS_Store. */
export function filesUnder(dir: string): string[] {
  const base = join(root, dir)
  const out: string[] = []
  const walk = (d: string) => {
    if (!existsSync(d)) return
    for (const name of readdirSync(d)) {
      if (name === '.DS_Store') continue
      const abs = join(d, name)
      if (statSync(abs).isDirectory()) walk(abs)
      else out.push(relative(base, abs).split('\\').join('/'))
    }
  }
  walk(base)
  return out.sort()
}
