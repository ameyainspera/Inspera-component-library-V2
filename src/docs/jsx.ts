/**
 * One description of a component's props, two outputs: the live element in
 * the playground, and the JSX snippet beside it.
 *
 * The snippets used to be hand-written template strings next to a separate
 * render function, and they drifted: a Progress snippet with a `label` the
 * preview never passed, a FormField snippet with an `id` TextInput did not
 * accept, a Disabled preview whose snippet was not disabled. Building both from
 * the same object makes that impossible.
 */
import { isValidElement } from 'react'
import { componentApi } from '../data/component-api.generated'

const RAW = Symbol('raw')

/** A value that is code in the snippet and something else at runtime. */
export interface Raw {
  [RAW]: true
  code: string
  value: unknown
}

/**
 * `raw('setValue')` prints as `setValue` and is absent at runtime.
 * `raw('<Badge label="Live" />', <Badge label="Live" />)` prints as the JSX
 * and renders as the element.
 */
export const raw = (code: string, value?: unknown): Raw => ({ [RAW]: true, code, value })

const isRaw = (v: unknown): v is Raw => typeof v === 'object' && v !== null && RAW in v

/** Swap every `raw()` for its runtime value, dropping props that come out undefined. */
export function resolve(value: unknown): unknown {
  if (isRaw(value)) return value.value
  if (isValidElement(value) || typeof value === 'function') return value
  if (Array.isArray(value)) return value.map(resolve)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .map(([k, v]) => [k, resolve(v)] as const)
        .filter(([, v]) => v !== undefined),
    )
  }
  return value
}

const quote = (s: string) => (s.includes("'") ? JSON.stringify(s) : `'${s.replace(/\\/g, '\\\\')}'`)

/** A value as a JS literal, the way someone would type it. */
function lit(value: unknown, indent: string): string {
  if (isRaw(value)) return value.code
  if (typeof value === 'string') return quote(value)
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (value === null) return 'null'
  if (typeof value === 'function') return '() => {}'
  const inner = indent + '  '
  if (Array.isArray(value)) {
    const items = value.map((v) => lit(v, inner))
    const flat = `[${items.join(', ')}]`
    return flat.length <= 60 && !flat.includes('\n') ? flat : `[\n${items.map((i) => inner + i).join(',\n')},\n${indent}]`
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).filter(([, v]) => v !== undefined)
    const parts = entries.map(([k, v]) => `${/^[a-zA-Z_$][\w$]*$/.test(k) ? k : quote(k)}: ${lit(v, inner)}`)
    const flat = `{ ${parts.join(', ')} }`
    return flat.length <= 72 && !flat.includes('\n') ? flat : `{\n${parts.map((p) => inner + p).join(',\n')},\n${indent}}`
  }
  return String(value)
}

/** Props that exist for the docs site and never belong in copied code. */
const DOCS_ONLY = new Set(['forceState', 'forceVisible', 'forceDragging', 'embedded'])

/**
 * `<Name prop="..." />` from a props object. A prop equal to the component's
 * own default is left out - it is noise, and a snippet is the example people
 * learn the API from. Required props are always written.
 */
export function toJsx(name: string, props: Record<string, unknown>): string {
  const api = componentApi[name]
  const defaults = new Map(api?.props.map((p) => [p.name, p]) ?? [])
  const attrs: string[] = []

  for (const [key, value] of Object.entries(props)) {
    if (key === 'children' || value === undefined || DOCS_ONLY.has(key)) continue
    const doc = defaults.get(key)
    const text = lit(value, '  ')
    if (doc && !doc.required && doc.default !== undefined && doc.default === text) continue
    if (doc && !doc.required && doc.default === undefined && value === false) continue
    if (value === true) attrs.push(key)
    else if (typeof value === 'string' && !value.includes('"') && !value.includes('\n')) attrs.push(`${key}="${value}"`)
    else attrs.push(`${key}={${text}}`)
  }

  const children = props.children
  const body = children === undefined
    ? undefined
    : isRaw(children) ? children.code : typeof children === 'string' ? children : lit(children, '  ')

  const open = attrs.length === 0 ? `<${name}` : `<${name}\n${attrs.map((a) => `  ${a}`).join('\n')}\n`
  if (body === undefined) return attrs.length === 0 ? `<${name} />` : `${open}/>`
  const indented = body.split('\n').map((l) => `  ${l}`).join('\n')
  return `${attrs.length === 0 ? `<${name}>` : `${open}>`}\n${indented}\n</${name}>`
}
