/**
 * build-portable.ts - the single generator that keeps every distribution
 * output in sync with the source of truth.
 *
 * Source of truth:
 *   - src/data/tokens.ts      (token values)
 *   - src/data/components.ts  (component semantics)
 *   - src/imports/runtime.css (component states, keyframes, icon helpers; copied verbatim)
 *
 * Generated outputs (never hand-edited):
 *   - src/imports/tokens.css         :root custom properties for the docs app
 *   - public/llms.txt                index any LLM tool can paste
 *   - public/llms-full.txt           the same content, everything inline
 *   - public/spec/*.md               that same text in parts: a core, then groups of components
 *   - public/inspera-00-start-here.md  opens the AI spec zip: DESIGN.md and the full guide together
 *   - public/design/**               the design guide (design-md/), copied byte for byte
 *   - public/c/<slug>.md             one self-contained file per component
 *   - public/tokens.w3c.json         W3C Design Tokens JSON
 *   - packages/components/styles.css  tokens + runtime CSS shipped by the npm package
 *   - packages/components/README.md   only its marked blocks: component list, fonts
 *   - public/tokens.css, kit/styles.css  the same stylesheet for the web and the Make kit
 *   - kit/guidelines/tokens.md        kit token reference
 *   - kit/guidelines/components.md    kit component catalog + APIs
 *   - kit/.figma/make/kit.json        kit manifest
 *
 * Run with: pnpm generate
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, rmSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { componentList } from '../src/data/components'
import { registry, snippetFor } from '../src/docs/registry'
import { contexts } from '../src/docs/contexts'
import {
  componentsPackage, artifacts, fullSpec, specParts, specGuide, fileName, type SpecPart, aiSpecGuide,
} from '../src/data/distribution'
import {
  contract, precedence, whenUnsure, patterns, designGuideNote,
  formRules, tableRules, feedbackHierarchy, checklist, workedScreen,
} from '../src/data/guidance'
import {
  designGuideSource, designGuideServed, designGuideFiles, designGuideMarkers,
  knownDifferences, projectInstructions, whichFileWins, aiWillAsk,
} from '../src/data/design-md'
import { examplePages } from '../src/docs/pages/registry'
import { textSafeShades } from './contrast'
import { checkDesignMd, summarise as summariseDesignMd } from './design-md-check'
import { extractComponentProps, type PropDoc } from './extract-props'
import type { ComponentSpec } from '../src/data/types'
import { recipes } from '../src/data/recipes'
import {
  brandColors, semanticColors, brandAccents, palette,
  spacing, controlHeights, radius, shadows, typeScale,
  systemTokens, fonts, baseColors,
  borderWidths, focusRing, motion, zIndex, breakpoints, fontWeights, effects,
} from '../src/data/tokens'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
/**
 * Every generated artifact must be plain ASCII.
 *
 * These files go out as text/plain and text/markdown, and neither content type
 * carries a charset unless the server adds one. When it does not, the browser
 * falls back to windows-1252 and decodes each UTF-8 byte separately, so an em
 * dash (E2 80 94) arrives as three characters. That is where the mojibake in
 * the AI spec came from: the bytes on disk were always correct.
 *
 * Sending the right charset is the other half of the fix, but it depends on a
 * host that has not been chosen yet, and these files are also pasted into
 * editors, chat windows and context uploaders that each guess for themselves.
 * Staying inside ASCII leaves nothing to guess wrong about.
 */
const assertAscii = (rel: string, content: string) => {
  const lines = content.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const found = lines[i].match(/[^\x00-\x7F]/)
    if (!found) continue
    const point = found[0].codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')
    throw new Error(
      `${rel}:${i + 1} contains a non-ASCII character "${found[0]}" (U+${point}).\n` +
        `  ${lines[i].trim().slice(0, 100)}\n` +
        'Generated files must be ASCII so they survive being served without a charset. ' +
        'Use an ASCII equivalent in the source string.',
    )
  }
}

/**
 * `--check` generates everything in memory and compares it with what is on
 * disk instead of writing. It is the drift gate: the folder is not always a git
 * repository, so "regenerate, then diff" cannot be relied on.
 */
const CHECK = process.argv.includes('--check')
const drifted: string[] = []
/** What this run produced, so sizes can be measured without touching disk. */
const produced = new Map<string, string>()

const write = (rel: string, content: string) => {
  assertAscii(rel, content)
  produced.set(rel, content)
  const abs = join(root, rel)
  if (CHECK) {
    let current: string | null = null
    try {
      current = readFileSync(abs, 'utf8')
    } catch {
      /* missing counts as drift */
    }
    if (current !== content) drifted.push(rel)
    return
  }
  mkdirSync(dirname(abs), { recursive: true })
  writeFileSync(abs, content)
  console.log('  ✓', rel)
}

/**
 * Publish a file that arrives from outside this repo, byte for byte.
 *
 * The design guide (design-md/) is written by the design system team, and its
 * text is theirs: it is published exactly as received, never rewritten. That
 * includes its non-ASCII characters - some carry meaning, such as the euro and
 * degree signs in its UX writing rules - so `assertAscii` does not apply.
 * Everything else about a generated file does: `--check` compares the copy
 * with the source, and the copy is measured like any other artifact.
 */
const copyVerbatim = (from: string, to: string) => {
  const raw = readFileSync(join(root, from))
  const content = raw.toString('utf8')
  if (!Buffer.from(content, 'utf8').equals(raw)) {
    throw new Error(`${from} is not valid UTF-8. Ask its authors for a UTF-8 copy; it cannot be published as it is.`)
  }
  produced.set(to, content)
  const abs = join(root, to)
  if (CHECK) {
    let current: Buffer | null = null
    try {
      current = readFileSync(abs)
    } catch {
      /* missing counts as drift */
    }
    if (!current || !current.equals(raw)) drifted.push(to)
    return
  }
  mkdirSync(dirname(abs), { recursive: true })
  writeFileSync(abs, raw)
  console.log('  ✓', to, '(verbatim)')
}

// ---------------------------------------------------------------------------
// Token CSS - generated from src/data/tokens.ts, the single typed source.
//
// This replaced a regex that scraped the :root block out of src/index.css. That
// scrape silently broke when index.css was reformatted: it dropped the Material
// Symbols base rule and two keyframes, and could not see tokens that had no
// CSS declaration yet. Generating forwards from typed data means the CSS, the
// docs and the W3C JSON cannot disagree.
// ---------------------------------------------------------------------------
const cssName = (name: string) => name.replace(/\./g, '-').replace('-main', '')

function tokenBlock(label: string, entries: { name: string; value: string; note?: string }[]): string {
  const width = Math.max(...entries.map((e) => e.name.length))
  const lines = entries.map((e) => {
    const decl = `  --${e.name}: ${e.value};`
    return e.note ? `${decl.padEnd(width + 12)} /* ${e.note} */` : decl
  })
  return `  /* ${label} */\n${lines.join('\n')}`
}

/** The `:root { ... }` block: every token in tokens.ts, as a custom property. */
function buildRootCss(): string {
  const blocks: string[] = []

  blocks.push(tokenBlock('Brand', brandColors.map((c) => ({ name: cssName(c.name), value: c.value, note: c.note }))))
  blocks.push(tokenBlock('Semantic', semanticColors.map((c) => ({ name: c.name, value: c.value }))))
  blocks.push(tokenBlock('Brand accents', brandAccents.map((c) => ({ name: `accent-${c.name}`, value: c.value }))))
  blocks.push(tokenBlock('Base', baseColors))

  for (const [family, shades] of Object.entries(palette)) {
    blocks.push(tokenBlock(
      `Palette - ${family}`,
      Object.entries(shades).map(([shade, value]) => ({ name: `${family}-${shade}`, value })),
    ))
  }

  for (const [label, entries] of Object.entries(systemTokens)) {
    blocks.push(tokenBlock(label, entries))
  }

  blocks.push(tokenBlock('Spacing', spacing.map((sp) => ({ name: `space-${sp.token}`, value: `${sp.value}px` }))))
  blocks.push(tokenBlock('Control height', controlHeights.map((c) => ({ name: `control-height-${c.token}`, value: `${c.value}px`, note: c.note }))))
  blocks.push(tokenBlock('Radius', radius.map((r) => ({ name: `radius-${r.token}`, value: `${r.value}px` }))))
  blocks.push(tokenBlock('Elevation', shadows.map((sh) => ({ name: `shadow-${sh.token}`, value: sh.value }))))
  blocks.push(tokenBlock('Effects', effects.map((e) => ({ name: `effect-${e.name}`, value: e.value, note: e.note }))))
  blocks.push(tokenBlock('Border width', borderWidths.map((b) => ({ name: `border-width-${b.token}`, value: b.value }))))
  blocks.push(tokenBlock('Focus ring', focusRing))
  blocks.push(tokenBlock('Motion - duration', motion.duration.map((d) => ({ name: `duration-${d.token}`, value: d.value, note: d.note }))))
  blocks.push(tokenBlock('Motion - easing', motion.easing.map((e) => ({ name: `easing-${e.token}`, value: e.value, note: e.note }))))
  blocks.push(tokenBlock('Layering', zIndex.map((z) => ({ name: `z-${z.token}`, value: String(z.value), note: z.note }))))
  blocks.push(tokenBlock('Breakpoints', breakpoints.map((b) => ({ name: `breakpoint-${b.token}`, value: `${b.value}px` }))))
  blocks.push(tokenBlock('Typography - family', fonts))
  blocks.push(tokenBlock(
    'Typography - scale',
    typeScale.flatMap((t) => [
      { name: `${t.name}-size`, value: `${t.size}px` },
      { name: `${t.name}-weight`, value: String(t.weight) },
      { name: `${t.name}-line-height`, value: String(t.lineHeight) },
      ...(t.tracking !== undefined ? [{ name: `${t.name}-tracking`, value: `${t.tracking}px` }] : []),
    ]),
  ))

  return `:root {\n${blocks.join('\n\n')}\n}\n`
}

const GENERATED_HEADER = (from: string) =>
  `/* Inspera Design System - GENERATED FILE, DO NOT EDIT.\n` +
  `   Source: ${from}. Regenerate with \`pnpm generate\`. */\n\n`

/**
 * One utility class per Figma type style. Four separate custom properties are
 * awkward to apply correctly; `class="inspera-h1"` is not.
 */
function buildTypeClasses(): string {
  const rules = typeScale.map((t) => {
    const decl = [
      `font-family: ${t.fontFamily ?? 'var(--font-sans)'}`,
      `font-size: var(--${t.name}-size)`,
      `font-weight: var(--${t.name}-weight)`,
      `line-height: var(--${t.name}-line-height)`,
      ...(t.tracking !== undefined ? [`letter-spacing: var(--${t.name}-tracking)`] : []),
      ...(t.transform ? [`text-transform: ${t.transform}`] : []),
      ...(t.decoration ? [`text-decoration: ${t.decoration}`] : []),
    ]
    return `.inspera-${t.name} {\n  ${decl.join(';\n  ')};\n}`
  })
  return `/* Type styles - one class per Figma style (${typeScale.length} total). */\n\n${rules.join('\n\n')}\n`
}

/** The stylesheet shipped to consumers: tokens + the runtime CSS, verbatim. */
function buildDistributedCss(): string {
  const runtime = readFileSync(join(root, 'src/imports/runtime.css'), 'utf8')
    .replace(/^\/\*[\s\S]*?\*\/\n\n/, '') // strip the authoring preamble
  return (
    GENERATED_HEADER('src/data/tokens.ts + src/imports/runtime.css') +
    buildRootCss() +
    '\n' +
    buildTypeClasses() +
    '\n' +
    runtime
  )
}

// ---------------------------------------------------------------------------
// W3C Design Tokens Community Group JSON
// ---------------------------------------------------------------------------
function buildW3CTokens() {
  const color: Record<string, unknown> = {}
  for (const c of brandColors) color[c.name.replace('.main', '')] = { $type: 'color', $value: c.value }
  for (const c of semanticColors) color[c.name] = { $type: 'color', $value: c.value }
  const accent: Record<string, unknown> = {}
  for (const c of brandAccents) accent[c.name] = { $type: 'color', $value: c.value }
  color.accent = accent
  for (const [family, shades] of Object.entries(palette)) {
    const group: Record<string, unknown> = {}
    for (const [shade, value] of Object.entries(shades)) group[shade] = { $type: 'color', $value: value }
    color[family] = group
  }

  const dimension = (entries: { token: string; value: number }[]) => {
    const g: Record<string, unknown> = {}
    for (const e of entries) g[e.token] = { $type: 'dimension', $value: `${e.value}px` }
    return g
  }

  const shadow: Record<string, unknown> = {}
  for (const s of shadows) shadow[s.token] = { $type: 'shadow', $value: s.value, $description: 'See --shadow-* in tokens.css' }

  const typography: Record<string, unknown> = {}
  for (const t of typeScale) {
    typography[t.token] = {
      $type: 'typography',
      $value: { fontFamily: 'Inter', fontSize: `${t.size}px`, fontWeight: t.weight },
    }
  }

  return {
    $description: 'Inspera Design System tokens (W3C Design Tokens format). Generated - do not edit.',
    color,
    spacing: dimension(spacing),
    controlHeight: dimension(controlHeights),
    radius: dimension(radius.map((r) => ({ token: r.token, value: r.value }))),
    shadow,
    typography,
  }
}

// ---------------------------------------------------------------------------
// Per-component markdown block (shared by llms.txt and kit components.md).
//
// The prop table is derived from the component's TypeScript interface, never
// hand-written, and the example is the same JSX the reference site's playground
// emits - so the spec, the site and the component always agree.
// ---------------------------------------------------------------------------
const componentApi = extractComponentProps()

/** Pipes inside a cell would otherwise split it into new columns. */
const cell = (v: string) => v.replace(/\|/g, '\\|')

function propTable(props: PropDoc[]): string {
  if (props.length === 0) return '_No props._'
  const rows = props.map((p) => {
    const name = p.required ? `\`${p.name}\` **(required)**` : `\`${p.name}\``
    return `| ${name} | \`${cell(p.type)}\` | ${p.default ? `\`${cell(p.default)}\`` : '-'} | ${cell(p.description ?? '')} |`
  })
  return `| Prop | Type | Default | Description |\n| --- | --- | --- | --- |\n${rows.join('\n')}`
}

/**
 * One sentence under the table saying what else the component takes. Without
 * it a reader assumes the table is exhaustive and reaches for a wrapper div to
 * get an `id` or a `className` onto the element.
 */
function nativeNote(native: string | undefined): string {
  if (!native) return ''
  return (
    `\nAlso accepts any native \`<${native}>\` attribute (\`id\`, \`name\`, \`aria-*\`, ` +
    `\`data-*\`, event handlers, \`ref\`), forwarded to the \`<${native}>\`. ` +
    '`className` and `style` go on the outermost element.\n'
  )
}

/** Resolve a spec to its real React export, failing loudly on a mismatch. */
function exportNameFor(c: ComponentSpec): string {
  const name = c.exportName ?? c.name.replace(/\s+/g, '')
  if (!componentApi[name]) {
    throw new Error(
      `Spec "${c.name}" (${c.slug}) resolves to export "${name}", which does not ` +
        `exist in src/components/inspera. Set \`exportName\` on the spec, or fix the component.`,
    )
  }
  return name
}

/** Shapes a prop refers to - without these, `items: TabItem[]` is a dead end. */
function relatedTypesBlock(related: Record<string, string>): string {
  const entries = Object.entries(related)
  if (entries.length === 0) return ''
  return `\n\`\`\`ts\n${entries.map(([, src]) => src).join('\n\n')}\n\`\`\`\n`
}

// ---------------------------------------------------------------------------
// Visual contract - the component as plain HTML + CSS.
//
// The prop table only helps a tool that can import the package. Most AI
// builders cannot (see distribution.ts - the scope is unpublished), so they
// hand-roll the element and invent whatever the spec left unsaid: the radius,
// the fill, the padding, the weight. Emitting the real CSS, with the tokens it
// needs resolved to literals, removes the guessing entirely.
// ---------------------------------------------------------------------------

/** Every token declaration, parsed back out of the CSS we just generated. */
function tokenMap(): Map<string, string> {
  const map = new Map<string, string>()
  for (const line of buildRootCss().split('\n')) {
    const m = line.match(/^\s*--([\w-]+):\s*([^;]+);/)
    if (m) map.set(m[1], m[2].trim())
  }
  return map
}

/**
 * The exact token subset a recipe references, resolved transitively and
 * ordered as tokens.css orders them - so the block stays readable and a
 * consumer pastes seventeen lines instead of the whole 686-line file.
 *
 * Order matters here. This used to ask "does the name start with the recipe's
 * class prefix?" first, and treat anything that did as a recipe-private
 * property. `--avatar-surface` is a real design token, so Avatar's block
 * silently omitted it and a pasted Avatar rendered with no fill. Asking the
 * token map first means a documented token can never be shadowed by a class
 * name; only names the design system does not define can be local.
 */
function tokensUsedBy(slug: string, css: string, declared: Set<string>): string[] {
  const all = tokenMap()
  const needed = new Set<string>()
  const walk = (text: string) => {
    for (const m of text.matchAll(/var\(--([\w-]+)/g)) {
      const name = m[1]
      if (needed.has(name)) continue
      const value = all.get(name)
      if (value !== undefined) {
        needed.add(name)
        walk(value)
        continue
      }
      // Not a design token. It must then be something the recipe sets itself,
      // or the CSS references a property nothing will ever define - which
      // renders as an unstyled element rather than an error, so fail here.
      if (!declared.has(name)) {
        throw new Error(
          `Recipe "${slug}" uses var(--${name}), which is neither a design token nor set ` +
            'anywhere in its own CSS. A custom property nothing defines renders as nothing. ' +
            'Add it to src/data/tokens.ts, set it in the recipe, or fix the name.',
        )
      }
    }
  }
  walk(css)
  return [...all.keys()].filter((n) => needed.has(n))
}

/**
 * `standalone` decides whether the fonts and icon class ride along.
 *
 * The full guide states them once under Setup, so repeating them under all 42
 * components would add a thousand lines of the same thing to a document
 * already large enough to matter. A per-component file, or the block copied
 * out of the docs site, has no Setup next to it and does need them.
 */
function recipeBlock(slug: string, standalone: boolean): string {
  const recipe = recipes[slug]
  if (!recipe) return ''
  const all = tokenMap()
  // A recipe that builds on another ships that one's CSS too. Without this the
  // published block styles the wrapper and leaves the button inside it bare -
  // exactly the half-finished output the recipes exist to prevent.
  const composed = (recipe.composes ?? []).map((c) => {
    const dep = recipes[c]
    if (!dep) throw new Error(`Recipe "${slug}" composes "${c}", which does not exist.`)
    return dep.css
  })
  const css = [...composed, recipe.css].join('\n\n')
  // Scan the markup too, not just the stylesheet. Spinner puts its colours in
  // SVG `stroke` attributes, so a CSS-only scan emitted an empty token block
  // for it - and a consumer pasting the HTML got an uncoloured ring.
  // What the recipe sets for itself, read from its own declarations rather than
  // guessed from its class name. A list inferred from a prefix goes stale and,
  // worse, swallows real tokens that happen to share it.
  const declared = new Set(
    [...css.matchAll(/--([\w-]+)\s*:/gm)].map((m) => m[1]),
  )
  const used = tokensUsedBy(slug, `${css}\n${recipe.html}`, declared)
  if (used.length === 0) {
    throw new Error(`Recipe "${slug}" references no design tokens - check the class prefix.`)
  }
  const width = Math.max(...used.map((n) => n.length))
  const decls = used.map((n) => `  --${n}:`.padEnd(width + 6) + ` ${all.get(n)};`).join('\n')
  const notes = recipe.notes?.length
    ? `\n${recipe.notes.map((n) => `- ${n}`).join('\n')}\n`
    : ''

  return `
${standalone ? `${buildSetupCompact()}\n` : ''}#### Without the package - exact HTML and CSS

Use this whenever \`@inspera/components\` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.
${notes}
\`\`\`css
/* Tokens this component needs. Paste once, at \`:root\`. */
:root {
${decls}
}

${css}
\`\`\`

\`\`\`html
${recipe.html}
\`\`\`
`
}

function componentMarkdown(c: ComponentSpec, importPath: string, standalone = true): string {
  const exportName = exportNameFor(c)
  const { props, relatedTypes, native } = componentApi[exportName]
  const entry = registry[c.slug]
  const example = entry ? snippetFor(c.slug, entry.defaults) : `<${exportName} />`
  const aliases = c.deprecatedAliases.length
    ? `\n**Deprecated aliases** (do not use): ${c.deprecatedAliases.map((a) => `\`${a}\``).join(', ')}\n`
    : ''

  const installed = componentsPackage.published
    ? ''
    : `\n> \`${importPath}\` is **not published yet**. If you cannot resolve that import, do\n> not swap in another UI library - build the markup from the HTML and CSS under\n> **Without the package** below, which is this component exactly.\n`

  return `### ${c.name}

${c.purpose} - category: \`${c.category}\`.
${installed}
\`\`\`tsx
import { ${exportName} } from '${importPath}'

${example}
\`\`\`

${propTable(props)}
${nativeNote(native)}${relatedTypesBlock(relatedTypes)}
**Accessibility** - role \`${c.accessibility.role}\`${c.accessibility.keyboard ? ', keyboard operable' : ''}. ${c.accessibility.ariaNotes.join('; ')}.

**Do:** ${c.usage.do.join('; ')}.
**Don't:** ${c.usage.dont.join('; ')}.
${variantGuide(c)}${aliases}${recipeBlock(c.slug, standalone)}`
}

/** When to pick each variant - the same lines the site shows under its in-context scenes. */
function variantGuide(c: ComponentSpec): string {
  const lines = c.usage.variants ?? []
  if (lines.length === 0) return ''
  const name = (prop: string, value: string) => (value === 'true' ? `\`${prop}\`` : `\`${prop}="${value}"\``)
  return `\n**Choosing a variant:**\n${lines.map((g) => `- ${name(g.prop, g.value)}: ${g.when}`).join('\n')}\n`
}

/**
 * Fails generation when variant guidance or an in-context scene names a prop,
 * value or control that does not exist - a typo would otherwise ship as advice
 * for a variant the component does not have, or leave a scene with no caption.
 */
function checkVariantGuidance() {
  for (const c of componentList) {
    const where = `components.ts "${c.slug}" usage.variants`
    const { props } = componentApi[exportNameFor(c)]
    for (const g of c.usage.variants ?? []) {
      const prop = props.find((p) => p.name === g.prop)
      if (!prop) throw new Error(`${where}: "${g.prop}" is not a prop of ${exportNameFor(c)}.`)
      const values = prop.type === 'boolean' ? ['true', 'false'] : [...prop.type.matchAll(/'([^']+)'/g)].map((m) => m[1])
      if (!values.includes(g.value)) {
        throw new Error(`${where}: ${g.prop}="${g.value}" is not a value of \`${prop.type}\`.`)
      }
    }
  }
  for (const [slug, scenes] of Object.entries(contexts)) {
    const where = `contexts.tsx "${slug}"`
    const entry = registry[slug]
    const spec = componentList.find((c) => c.slug === slug)
    if (!entry || !spec) throw new Error(`${where}: not a component slug.`)
    const fallbacks = scenes!.filter((s) => !s.when).length
    if (fallbacks !== 1) throw new Error(`${where}: needs exactly one scene without \`when\` (the fallback), found ${fallbacks}.`)
    for (const s of scenes!) {
      for (const [key, values] of Object.entries(s.when ?? {})) {
        const control = entry.controls[key]
        if (!control) throw new Error(`${where}: \`when\` uses "${key}", which is not a playground control.`)
        for (const value of values) {
          if (!control.options.includes(value)) throw new Error(`${where}: "${value}" is not an option of the ${key} control.`)
          if (!spec.usage.variants?.some((g) => g.prop === key && g.value === value)) {
            throw new Error(
              `${where}: a scene is for ${key}="${value}", but components.ts has no usage.variants line for it, ` +
                'so the scene would show without saying why that variant belongs there.',
            )
          }
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Portable spec - public/llms-full.txt (AGENTS/llms.txt style)
// ---------------------------------------------------------------------------
function buildLlmsTxt(): string {
  const byCategory: Record<string, ComponentSpec[]> = {}
  for (const c of componentList) (byCategory[c.category] ??= []).push(c)

  const sections = Object.entries(byCategory)
    .map(([cat, list]) =>
      `## Components - ${cat}\n\n${list.map((c) => componentMarkdown(c, '@inspera/components', false)).join('\n\n')}`)
    .join('\n\n')

  return `# Inspera Design System - complete AI build guide

> Version ${VERSION}. Everything needed to generate on-brand Inspera UI, in one
> document: the foundations, then all ${componentList.length} components with
> their real prop APIs.
>
> This is the full text, sized for an uploaded context file. A tool that
> re-sends its context on every message should use llms.txt instead, which
> links a spec per component.

${packageBlock()}

## Rules

${RULES}

${DESIGN_GUIDE}

${buildSetup()}

${buildFoundations({ compact: false })}

${buildGuidance()}

${sections}
`
}

/** Foundations on their own, for an agent that only needs the tokens. */
function buildFoundationsDoc(): string {
  return `${provenance()}

# Inspera Design System - Foundations

Version ${VERSION}. Colour, typography, spacing, radius and depth. Components
are documented separately - see llms.txt for the index.

${buildFoundations({ compact: false })}
`
}

// ---------------------------------------------------------------------------
// npm package README - hand-written, with generated blocks
//
// The README said "15 components" and wired JetBrains Mono long after both
// stopped being true. The parts that follow the source are now written here,
// between <!-- generated:NAME --> markers; the prose around them stays
// hand-written.
// ---------------------------------------------------------------------------
function spliceGenerated(text: string, file: string, name: string, content: string): string {
  const start = `<!-- generated:${name} -->`
  const end = `<!-- /generated:${name} -->`
  const i = text.indexOf(start)
  const j = text.indexOf(end)
  if (i < 0 || j < i) throw new Error(`${file}: missing the ${start} ... ${end} markers`)
  return `${text.slice(0, i + start.length)}\n${content}\n${text.slice(j)}`
}

function buildPackageReadme(): string {
  const file = 'packages/components/README.md'
  const byCategory: Record<string, ComponentSpec[]> = {}
  for (const c of componentList) (byCategory[c.category] ??= []).push(c)
  const components = [
    `${componentList.length} components, by category:`,
    '',
    ...Object.entries(byCategory).map(([cat, list]) => `- **${cat}** (${list.length}): ${list.map((c) => `\`${exportNameFor(c)}\``).join(', ')}`),
  ].join('\n')
  // The same font imports the reference site loads, in the same order.
  const fonts = [
    '```css',
    ...readFileSync(join(root, 'src/index.css'), 'utf8')
      .split('\n')
      .filter((l) => l.startsWith("@import url('https://fonts.googleapis.com")),
    '```',
  ].join('\n')
  let text = readFileSync(join(root, file), 'utf8')
  text = spliceGenerated(text, file, 'components', components)
  text = spliceGenerated(text, file, 'fonts', fonts)
  return text
}

// ---------------------------------------------------------------------------
// Figma Make kit - components.md + tokens.md + manifest
// ---------------------------------------------------------------------------
function buildKitComponentsMd(): string {
  const byCategory: Record<string, ComponentSpec[]> = {}
  for (const c of componentList) (byCategory[c.category] ??= []).push(c)
  const sections = Object.entries(byCategory)
    .map(([cat, list]) =>
      `## ${cat}\n\n${list.map((c) => componentMarkdown(c, '@inspera/kit')).join('\n\n')}`)
    .join('\n\n')
  return `# Components

The Inspera kit ships ${componentList.length} components. Import from \`@inspera/kit\`. Read the
component's entry before using it - prop names and variant casing are exact.

${sections}
`
}

/**
 * The kit's token reference is the same document as the portable foundations.
 * It used to be a thinner hand-rolled copy covering only colour, radius and
 * spacing, which meant shadows, motion, layering and effects were simply absent
 * from the kit - and any new category had to be remembered twice.
 */
function buildKitTokensMd(): string {
  return `# Tokens

All tokens are CSS custom properties defined in \`styles.css\` (imported during
setup). Reference them as \`var(--primary)\`, \`var(--radius-md)\`,
\`var(--space-4)\`.

${buildFoundations({ compact: false })}
`
}

function buildKitManifest() {
  return {
    name: '@inspera/kit',
    version: '1.0.0',
    displayName: 'Inspera Design System',
    description: 'Canonical Inspera components, tokens, and guidance for Figma Make.',
    guidelines: 'guidelines/Guidelines.md',
    styles: 'styles.css',
    entry: 'src/index.ts',
    fonts: [
      { family: 'Inter', styles: ['400', '500', '600'] },
      { family: 'Noto Sans Mono', styles: ['400', '500', '600'] },
      { family: 'Noto Serif', styles: ['400', '500', '600'] },
      { family: 'Material Symbols Outlined', styles: ['variable'] },
    ],
  }
}

// ---------------------------------------------------------------------------
// The AI integration surface.
//
// Layered on purpose. The single 16k-token spec was too large to paste into
// most chat contexts and burned budget in every builder, so tools got all of it
// or none of it. Now each tool takes the strongest form it can consume:
//   llms.txt        small index - what you paste
//   c/<slug>.md     one component - what an agent fetches
//   llms-full.txt   everything inline - the fallback
//   spec/*.md       the same text in parts - for tools that cannot take it whole
//   api.json        the prop API, machine-readable
// ---------------------------------------------------------------------------
const VERSION = JSON.parse(
  readFileSync(join(root, 'packages/components/package.json'), 'utf8'),
).version as string

/** Absolute base for generated links. Unset until a host is chosen. */
const BASE_URL = (process.env.INSPERA_DS_BASE_URL ?? '').replace(/\/$/, '')
const url = (path: string) => (BASE_URL ? `${BASE_URL}/${path}` : `./${path}`)

/**
 * Deliberately carries no build date.
 *
 * A `new Date()` stamp made every generated file differ from its committed
 * copy the day after it was committed, so `verify:generated` - which
 * regenerates and fails on any diff - would have failed every CI run from the
 * next day onwards, on a diff that was only the date. The version is the part
 * a consumer can act on; when a file was built is what git history is for.
 */
const provenance = () =>
  `<!-- Inspera Design System v${VERSION} - generated file, do not edit. -->`

const num = (items: string[]) => items.map((r, i) => `${i + 1}. ${r}`).join('\n')

const RULES = `${num(contract)}

**Prop names are camelCase and case-sensitive** (\`intent\`, not \`Intent\`). React
silently ignores an unknown prop, so a capitalised name renders the default
variant with no error at all. Variant *values* are Capitalised
(\`intent="Primary"\`, \`size="Medium"\`).

**When two instructions conflict**, this order wins:

${num(precedence)}

**When the spec does not answer your question:**

${whenUnsure.map((r) => `- ${r}`).join('\n')}`

/**
 * How this spec works beside DESIGN.md, the design guide it ships with. A
 * section of its own, after the rules, rather than part of RULES: RULES is
 * also repeated in every per-component file, which an agent fetches one at a
 * time to build that component and which has no use for it.
 */
const DESIGN_GUIDE = `## Working with DESIGN.md

${designGuideNote.map((r) => `- ${r}`).join('\n')}`

/**
 * Everything a consumer needs before a single component will look right.
 *
 * The document named Inter and Material Symbols in its rules and its
 * done-checklist, and then gave no way to load either. A recipe only ever sets
 * `font-size` on `.material-symbols-outlined`; the rule that makes that class a
 * font lives in src/imports/runtime.css, which is not part of the download. So a
 * designer who pasted the spec into an AI tool got correct colours, correct
 * radii, correct spacing - and every icon rendered as its own name, the word
 * "add" sitting inside the button.
 *
 * The icon rule is lifted out of runtime.css rather than retyped, so the rule
 * that ships and the rule that is documented cannot drift apart.
 */
function iconRuleFromRuntime(): string {
  const runtime = readFileSync(join(root, 'src/imports/runtime.css'), 'utf8')
  // Outlined is the only face runtime.css defines, so the block is the one rule
  // from its selector to its closing brace.
  const start = runtime.indexOf('.material-symbols-outlined {')
  const close = start === -1 ? -1 : runtime.indexOf('\n}', start)
  const end = close === -1 ? -1 : close + 2
  if (start === -1 || end === -1) {
    throw new Error(
      'Could not find the Material Symbols block in src/imports/runtime.css. buildSetup() ' +
        'copies it verbatim so the documented rule matches the shipped one - fix the ' +
        'markers here if that file was restructured.',
    )
  }
  return runtime.slice(start, end).trim()
}

/**
 * The webfont imports. Weights come from the type scale, so the request never
 * omits one the spec goes on to use.
 *
 * Google's stylesheet for Material Symbols ships the `.material-symbols-outlined`
 * class itself, not only the @font-face, so this import is the load-bearing
 * half. The rule copied out of runtime.css is still worth publishing: it pins
 * the variation axes and covers a consumer who self-hosts the font instead.
 */
function fontImports(): string {
  const families = [
    `Inter:wght@${fontWeights.join(';')}`,
    'Noto+Sans+Mono:wght@400;500',
    'Noto+Serif:wght@400;600',
  ].join('&family=')
  return (
    `@import url('https://fonts.googleapis.com/css2?family=${families}&display=swap');\n` +
    "@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');"
  )
}

/**
 * Fonts and the icon class, without the token block.
 *
 * Per-component files and the docs site's HTML + CSS tab already carry the
 * token subset that component needs, but neither carried the fonts - so
 * copying one component in isolation produced correct colours and an icon that
 * rendered as the word "add".
 */
function buildSetupCompact(): string {
  return `#### One-time setup

Paste this once, at the root of the project. Without it the component inherits
the host tool's fonts and any icon renders as its own name instead of a glyph.

\`\`\`css
${fontImports()}

${iconRuleFromRuntime()}
\`\`\`
`
}

function buildSetup(): string {
  const iconRule = iconRuleFromRuntime()

  return `## Setup

Paste these three blocks once, at the root of the project, before using any
component below. Without them the components inherit the host tool's fonts and
every icon renders as its own name.

**1. Fonts.** ${fonts.map((f) => `\`${f.value.split(',')[0]}\` (${f.note.toLowerCase()})`).join(', ')}.

\`\`\`css
${fontImports()}
\`\`\`

**2. The icon class.** Every component that shows an icon writes
\`<span class="material-symbols-outlined">icon_name</span>\`. That class needs
this rule, or the span shows the literal text instead of the glyph. Icon names
are lowercase with underscores (\`arrow_forward\`, \`more_vert\`); the full set is
at fonts.google.com/icons, Outlined style only.

\`\`\`css
${iconRule}
\`\`\`

**3. The tokens.** Every value in this document resolves through one of these.
Each component section below repeats the tokens it needs. If you paste this full
block, you can skip those repeats; it also has the spacing and type scales, which
the component blocks leave out.

\`\`\`css
${buildRootCss()}
\`\`\`
`
}

/**
 * The screen templates: the site's working copies of real Inspera screens.
 * DESIGN.md sends an AI building a whole screen to this section by name, so
 * the heading must stay "Screen templates". Only templates that are ready
 * and built at least in part from library components are listed; a pasted
 * reference screen is not a library template.
 */
function buildScreenTemplates(): string {
  const listed = examplePages.filter((p) => p.status === 'ready' && p.uses.length > 0)
  const rows = listed
    .map((p) => `| [${p.name}](${url(`#/pages/${p.slug}`)}) | ${cell(p.location ?? '-')} | ${cell(p.description)} | ${p.uses.map((u) => `\`${u}\``).join(', ')} |`)
    .join('\n')
  return `## Screen templates

Working copies of real Inspera screens, built at least in part from library
components. When you build a whole screen or a large region, pick the template
whose purpose matches the task and follow its layout, regions and component
choices.

- The global app shell in a template - the top bar and navigation - is the
  existing product's. It stays as it is.
- The parts of a template not yet rebuilt from library components keep the
  existing product's styling. Treat them as the as-is reference, not as library
  styling.
- Each template's full source - its tokens, components and page - is one
  download on the library's Screen templates page.

| Template | Where in the product | What it shows | Library components |
| --- | --- | --- | --- |
${rows}`
}

/** Composition, form, table and feedback guidance - how to build a screen. */
function buildGuidance(): string {
  const patternBlocks = patterns
    .map((p) =>
      `#### ${p.name}\n\nBuild from: ${p.from.map((c) => `\`${c}\``).join(', ')}.\n\n` +
      p.guidance.map((g) => `- ${g}`).join('\n'))
    .join('\n\n')

  return `## Composition patterns

These are **compositions, not new components**. They do not authorise a new
export - they say how to arrange the canonical ones. If a requested pattern is
not here and not a canonical component, build it from canonical components and
say so; do not invent a new one.

${patternBlocks}

## Forms

${formRules.map((r) => `- ${r}`).join('\n')}

## Data tables

${tableRules.map((r) => `- ${r}`).join('\n')}

## Which feedback component

| Scope | Use |
| --- | --- |
${feedbackHierarchy.map((f) => `| ${f.scope} | ${f.use} |`).join('\n')}

Never put something the user must retain or act on later in a Snackbar.

## A complete screen

${workedScreen.summary}

${workedScreen.notes.map((n) => `- ${n}`).join('\n')}

\`\`\`tsx
${workedScreen.tsx}
\`\`\`

Same screen without the package:

\`\`\`html
${workedScreen.html}
\`\`\`

${buildScreenTemplates()}

## Before you call it done

${checklist.map((c) => `**${c.group}**\n\n${c.items.map((i) => `- [ ] ${i}`).join('\n')}`).join('\n\n')}
`
}

/**
 * Foundations - the design decisions every component is built from.
 *
 * `compact` collapses each palette family onto one line for the paste-able
 * index; the full form gets a table per family. Both carry real values: an
 * agent that cannot load tokens.css still needs to know that --blue-600 is
 * #007BF5, or it will invent a blue.
 */
function buildFoundations({ compact }: { compact: boolean }): string {
  const swatch = (name: string, value: string, note?: string) =>
    `| \`${name}\` | \`var(--${cssName(name)})\` | ${value} |${note ? ` ${note} |` : ' |'}`

  const colourHead = '| Token | CSS variable | Value | Use |\n| --- | --- | --- | --- |'

  const brand = [
    ...brandColors.map((c) => swatch(c.name, c.value, c.note)),
    ...semanticColors.map((c) => swatch(c.name, c.value, `Use only for its meaning (${c.name})`)),
    ...brandAccents.map((c) => swatch(`accent.${c.name}`, c.value, 'Sparingly, for accent moments')),
  ].join('\n')

  const paletteSection = compact
    ? Object.entries(palette)
        .map(([family, shades]) =>
          `- **${family}** - ${Object.entries(shades).map(([sh, v]) => `${sh} \`${v}\``).join(' | ')}`)
        .join('\n')
    : Object.entries(palette)
        .map(([family, shades]) =>
          `#### ${family}\n\n| Shade | CSS variable | Value |\n| --- | --- | --- |\n` +
          Object.entries(shades)
            .map(([sh, v]) => `| ${sh} | \`var(--${family}-${sh})\` | ${v} |`)
            .join('\n'))
        .join('\n\n')

  // Measured against white and the gray-100 canvas, the two backgrounds text
  // sits on. See scripts/contrast.ts for why this is computed.
  const textSafe = Object.entries(textSafeShades(palette, [baseColors[0].value, palette.gray['100']]))
    .map(([family, shade]) => `${family} ${shade}`)
    .join(', ')

  const roles = Object.entries(systemTokens)
    .map(([label, entries]) =>
      `**${label}** - ` +
      entries.map((t) => `\`var(--${t.name})\` ${t.value}`).join(', '))
    .join('\n\n')

  const typeRow = (t: (typeof typeScale)[number]) => {
    const extras = [
      t.tracking !== undefined ? `${t.tracking > 0 ? '+' : ''}${t.tracking}px tracking` : '',
      t.transform ?? '',
      t.decoration ?? '',
      t.note ?? '',
      t.pending?.length ? `unconfirmed: ${t.pending.join(', ')}` : '',
    ].filter(Boolean).join(', ')
    return `| \`${t.token}\` | \`.inspera-${t.name}\` | ${t.size}px | ${t.weight} | ${t.lineHeight} | ${extras} |`
  }
  const typeGroup = (label: string, rows: typeof typeScale) =>
    `#### ${label}\n\n| Style | Class | Size | Weight | Line height | Notes |\n| --- | --- | --- | --- | --- | --- |\n` +
    rows.map(typeRow).join('\n')

  const groupOrder = ['Default', 'Regular', 'Medium', 'Heading', 'Extended', 'Paragraph', 'Extra', 'Documentation'] as const
  const type = groupOrder
    .map((g) => typeGroup(g, typeScale.filter((t) => t.group === g)))
    .filter((block) => !block.endsWith('| --- |'))
    .join('\n\n')

  const space = spacing
    .map((sp) => `| \`${sp.token}\` | \`var(--space-${sp.token})\` | ${sp.value}px |`)
    .join('\n')

  const controlHeight = controlHeights
    .map((c) => `| \`${c.token}\` | \`var(--control-height-${c.token})\` | ${c.value}px | ${c.note} |`)
    .join('\n')

  const usage = radiusUsage()
  const rad = radius
    .map((r) => {
      const users = usage[r.token] ?? []
      const used = users.length ? users.join(', ') : '-'
      return `| \`${r.token}\` | \`var(--radius-${r.token})\` | ${r.value === 9999 ? 'fully round' : `${r.value}px`} | ${r.usage} | ${used} |`
    })
    .join('\n')

  const depth = shadows
    .map((sh) => `| \`shadow.${sh.token}\` | \`var(--shadow-${sh.token})\` | \`${sh.value}\` |`)
    .join('\n')

  return `## Foundations

Every value below is a CSS custom property, declared in the \`:root\` block under
Setup. Paste that block once, then reference tokens as \`var(--primary)\`,
\`var(--space-4)\`, \`var(--radius-md)\`. Never hardcode a colour that is not in
this list.

### Colour - brand & semantic

${colourHead}
${brand}

### Colour - palette

Each family runs 100 (lightest) to 900 (darkest); 100-300 are surface tints.
For text, use this shade or a darker one - the lightest that reaches 4.5:1 on
both white and the gray-100 canvas: ${textSafe}.

${paletteSection}

### Colour - roles

Prefer a role token over a raw palette shade wherever one exists.

${roles}

### Typography

Inter for all UI text (weights ${fontWeights.join(', ')}). Noto Sans Mono for
code, identifiers and token values. Noto Serif for long-form content. Material
Symbols Outlined for icons.

Every style below has a ready-made class - prefer \`class="inspera-h1"\` over
setting four properties by hand.

Sizes are exact, exported from Figma. Figma exports font-size only for text
styles, so a row marked *unconfirmed* has a line height or weight inferred from
the V3 spec rather than measured.

${type}

### Spacing

Use the scale - no arbitrary pixel values.

| Token | CSS variable | Value |
| --- | --- | --- |
${space}

### Control height

The height of a sized control. Small, Medium and Large mean these heights
wherever a control offers them.

| Token | CSS variable | Value | Use |
| --- | --- | --- | --- |
${controlHeight}

### Radius

Small-to-medium radii: \`sm\` for controls, including inputs, selects and
pickers; \`md\` for panels and alerts; \`lg\` for cards and dialogs. Pills only
for shapes that are conceptually round.

"Used by" lists the components that use each radius, read from their source.

| Token | CSS variable | Value | When to use | Used by |
| --- | --- | --- | --- | --- |
${rad}

### Depth / elevation

Flat by default. Prefer a border over a shadow for separation; use \`200\` for
cards and \`500\` for dialogs.

| Token | CSS variable | Value |
| --- | --- | --- |
${depth}

### Effects

Focus rings, validation rings, the button highlight and link underlines. Apply
as \`box-shadow\`. Their colours are palette colours.

| Token | CSS variable | Value | Use |
| --- | --- | --- | --- |
${effects.map((e) => `| \`${e.name}\` | \`var(--effect-${e.name})\` | \`${e.value}\` | ${[e.note, e.pending?.length ? `unconfirmed: ${e.pending.join(', ')}` : ''].filter(Boolean).join(' | ')} |`).join('\n')}

### Motion

Motion explains a state change; it does not decorate. Under
\`prefers-reduced-motion: reduce\`, drop non-essential transitions.

| Token | CSS variable | Value | Use |
| --- | --- | --- | --- |
${motion.duration.map((d) => `| \`duration.${d.token}\` | \`var(--duration-${d.token})\` | ${d.value} | ${d.note ?? ''} |`).join('\n')}
${motion.easing.map((e) => `| \`easing.${e.token}\` | \`var(--easing-${e.token})\` | \`${e.value}\` | ${e.note ?? ''} |`).join('\n')}

### Layering

Use the scale. Never an arbitrary value such as \`99999\`.

| Token | CSS variable | Value | Use |
| --- | --- | --- | --- |
${zIndex.map((z) => `| \`z.${z.token}\` | \`var(--z-${z.token})\` | ${z.value} | ${z.note ?? ''} |`).join('\n')}

### Breakpoints

Shared layout thresholds, not device names. Prefer responding to available
space over user-agent detection.

| Token | CSS variable | Min width |
| --- | --- | --- |
${breakpoints.map((b) => `| \`${b.token}\` | \`var(--breakpoint-${b.token})\` | ${b.value}px |`).join('\n')}

### Borders & focus

| Token | CSS variable | Value |
| --- | --- | --- |
${borderWidths.map((b) => `| \`border-width.${b.token}\` | \`var(--border-width-${b.token})\` | ${b.value} |`).join('\n')}
${focusRing.map((f) => `| \`${f.name}\` | \`var(--${f.name})\` | ${f.value} |`).join('\n')}

Focus is never removed, only replaced by something at least as visible:

\`\`\`css
:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}
\`\`\`
`
}

/**
 * The install block, told straight. The package builds from this repo but is
 * unpublished, so printing `npm i @inspera/components` as an instruction sends
 * every reader to a 404. Flip `published` in src/data/distribution.ts and this
 * becomes the real instruction everywhere.
 */
function packageBlock(): string {
  if (componentsPackage.published) {
    return `If the project can install packages, prefer the real components - they enforce
this spec at runtime:

\`\`\`bash
npm i ${componentsPackage.name}
\`\`\`
\`\`\`tsx
import '${componentsPackage.name}/styles.css'
import { Button, TextInput } from '${componentsPackage.name}'
\`\`\`

Otherwise follow the definitions below verbatim.`
  }
  return `> **\`${componentsPackage.name}\` is NOT published.** ${componentsPackage.status}
> Do not tell anyone to install it, and do not assume it resolves.
>
> ${componentsPackage.insteadUse}

Follow the definitions in this document verbatim. Import paths shown per
component (\`import { Button } from '${componentsPackage.name}'\`) are the
canonical names for when the package ships - today, implement the component
from its spec instead.`
}

/** The small index - this is what a person pastes into a chat. */
function buildLlmsIndex(): string {
  const byCategory: Record<string, ComponentSpec[]> = {}
  for (const c of componentList) (byCategory[c.category] ??= []).push(c)

  const index = Object.entries(byCategory)
    .map(([cat, list]) =>
      `### ${cat}\n\n` +
      list.map((c) => `- [${c.name}](${url(`c/${c.slug}.md`)}) - ${c.purpose}`).join('\n'))
    .join('\n\n')

  return `# Inspera Design System - AI build guide

> Version ${VERSION}. Generate on-brand Inspera UI in any AI builder.
> This index is deliberately small. Fetch the linked file for each component
> you actually use, rather than loading the whole system.

${packageBlock()}

## Rules

${RULES}

${DESIGN_GUIDE}

${buildFoundations({ compact: true })}

## Components

${index}

## Machine-readable artifacts

| File | What it is |
| --- | --- |
| [llms-full.txt](${url('llms-full.txt')}) | The complete document: foundations plus every component inline |
| [${designGuideServed}/DESIGN.md](${url(`${designGuideServed}/DESIGN.md`)}) | The design guide: user roles, existing versus new UI, hierarchy, layout and UI text. Read it before designing a screen; its reference files are in \`${designGuideServed}/references/\` |
| [${aiSpecGuide}](${url(aiSpecGuide)}) | How DESIGN.md and the full guide fit together, and the known differences between them |
| [${specGuide}](${url(specGuide)}) | The complete document in ${specParts.length} parts: a core every component needs, then groups of components |
| [foundations.md](${url('foundations.md')}) | Colour, typography, spacing, radius and depth only |
| [guidance.md](${url('guidance.md')}) | Composition patterns, form and table rules, and a final checklist |
| [api.json](${url('api.json')}) | Every prop, generated from the TypeScript types |
| [tokens.css](${url('tokens.css')}) | Tokens as CSS custom properties, plus the icon and animation rules |
| [inspera.theme.css](${url('inspera.theme.css')}) | Tailwind v4 \`@theme\` block |
| [tokens.w3c.json](${url('tokens.w3c.json')}) | W3C Design Tokens format |
| [aliases.json](${url('aliases.json')}) | Old component names mapped to the current ones |
`
}

/** One self-contained file per component, for agents that fetch on demand. */
function buildComponentFiles(): { path: string; content: string }[] {
  return componentList.map((c) => ({
    path: `public/c/${c.slug}.md`,
    content: `${provenance()}

# Inspera - ${c.name}

${RULES}

${componentMarkdown(c, '@inspera/components')}

---

Tokens: ${url('tokens.css')} | Full system: ${url('llms.txt')}
`,
  }))
}

// ---------------------------------------------------------------------------
// The guide in parts - public/spec/*.md
//
// llms-full.txt is right for an uploaded project file and far too big for a
// tool that only takes what fits in a message. The parts are its text
// regrouped: a core every component needs, then small groups of components, so
// a designer hands their AI the core plus the groups they use. They are built
// from the same functions as llms-full.txt rather than cut out of it, so the
// two cannot disagree. Which component goes where is decided in
// src/data/distribution.ts, beside the other downloads.
// ---------------------------------------------------------------------------

/**
 * Past this a part is too big for the tools the parts exist for. The largest
 * is about 19k today; the budget leaves room to grow, then fails the build
 * rather than let the parts drift back into one big file.
 */
const SPEC_PART_BUDGET = 24_000

/** Bytes over four - the same estimate every size on the site uses. */
const estimateTokens = (text: string) => Math.round(Buffer.byteLength(text, 'utf8') / 4)

interface ResolvedPart {
  part: SpecPart
  components: ComponentSpec[]
}

/**
 * Each part's components, checked so every component lands in exactly one
 * part. A component nobody assigned would otherwise vanish from the parts
 * while staying in the full guide - the one failure nobody would notice.
 */
function resolveSpecParts(): ResolvedPart[] {
  const where = 'specParts in src/data/distribution.ts'
  const bySlug = new Map(componentList.map((c) => [c.slug, c]))
  const placed = new Map<string, string>()

  const resolved = specParts.map((part, i) => {
    if ((i === 0) !== (part.components.length === 0)) {
      throw new Error(
        `${where}: the first part is the core and lists no components; every other part lists ` +
          `at least one. "${part.file}" breaks that.`,
      )
    }
    return {
      part,
      components: part.components.map((slug) => {
        const c = bySlug.get(slug)
        if (!c) throw new Error(`${where}: "${part.file}" lists "${slug}", which is not a component slug.`)
        const other = placed.get(slug)
        if (other) {
          throw new Error(`${where}: "${slug}" is in both ${other} and ${part.file}. A component belongs to one part.`)
        }
        placed.set(slug, part.file)
        return c
      }),
    }
  })

  const missing = componentList.filter((c) => !placed.has(c.slug))
  if (missing.length > 0) {
    throw new Error(
      `${where}: ${missing.map((c) => `"${c.slug}"`).join(', ')} is in no part, so the parts ` +
        'would leave it out. Add it to the part it belongs in.',
    )
  }
  return resolved
}

/**
 * The core: everything the component parts build on, plus a map of where each
 * component lives. Without the map, an AI holding the core and one part would
 * read a missing component as a gap in the system and build a lookalike.
 */
function buildSpecCore(parts: ResolvedPart[]): string {
  const map = parts
    .slice(1)
    .map(({ part, components }) => `- \`${fileName(part.file)}\` - ${components.map((c) => c.name).join(', ')}`)
    .join('\n')

  return `${provenance()}

# Inspera Design System - ${parts[0].part.title}

> Version ${VERSION}. Part 1 of ${parts.length} of the AI spec: the rules, the setup (fonts,
> icon class, tokens), the foundations, composition patterns and the done
> checklist. Every other part builds on this one.

${packageBlock()}

## Where each component is specified

Component specs are in the other parts, not in this one. If you need a component
and its part is not in your context, ask for that part. Do not build the
component from memory or substitute a lookalike.

${map}

## Rules

${RULES}

${DESIGN_GUIDE}

${buildSetup()}

${buildFoundations({ compact: false })}

${buildGuidance()}
`
}

/** One group of components, pointing back at the core it depends on. */
function buildSpecPart(parts: ResolvedPart[], index: number): string {
  const { part, components } = parts[index]
  const byCategory: Record<string, ComponentSpec[]> = {}
  for (const c of components) (byCategory[c.category] ??= []).push(c)
  const sections = Object.entries(byCategory)
    .map(([cat, list]) =>
      `## Components - ${cat}\n\n${list.map((c) => componentMarkdown(c, '@inspera/components', false)).join('\n\n')}`)
    .join('\n\n')

  return `${provenance()}

# Inspera Design System - ${part.title}

> Version ${VERSION}. Part ${index + 1} of ${parts.length} of the AI spec: ${components.map((c) => c.name).join(', ')}.
>
> These specs build on \`${fileName(parts[0].part.file)}\` - its rules, its setup
> (fonts, icon class, tokens) and its foundations. If that file is not in your
> context, ask for it before building. Without it, fonts, icons and colours
> come out wrong.

${sections}
`
}

// ---------------------------------------------------------------------------
// The start-here notes. Each zip opens with one, written for the person who
// unpacks it and for the AI it is handed to. Both zips carry the design guide
// (DESIGN.md), so both say how it and the spec fit together.
// ---------------------------------------------------------------------------

/** `~13k tokens`, measured from what this run produced. */
const tokensLabel = (tokens: number) =>
  tokens >= 1000 ? `~${Math.round(tokens / 1000)}k tokens` : `~${tokens} tokens`

/** The design guide's files, measured. They are copied before anything that describes them is built. */
function designGuideRows(): string {
  return designGuideFiles
    .map((f) => {
      const copy = produced.get(`public/${designGuideServed}/${f.path}`)
      if (copy === undefined) throw new Error(`Copy ${designGuideSource}/${f.path} before building a note that describes it.`)
      return `| \`${f.path}\` | ${cell(f.readWhen)} | ${tokensLabel(estimateTokens(copy))} |`
    })
    .join('\n')
}

/** DESIGN.md's own version as its authors wrote it, such as "draft v1.4". */
function designGuideVersion(): string | null {
  const v = produced.get(`public/${designGuideServed}/DESIGN.md`)?.match(/Draft v[\d.]+/)?.[0]
  return v ? v.replace(/^Draft/, 'draft') : null
}

/** The split DESIGN.md states for itself, from the reader's side (src/data/design-md.ts). */
const WHICH_FILE_WINS = `## Which file wins

${whichFileWins.map((l) => `- ${l}`).join('\n')}`

function knownDifferencesBlock(): string {
  if (knownDifferences.length === 0) {
    return '## Known differences\n\nNone. DESIGN.md and the full guide agree on everything the library checks.'
  }
  return `## Known differences

DESIGN.md and the full guide disagree on these today. Until each one is fixed,
do what the last column says.

| Topic | DESIGN.md says | The library does | Follow |
| --- | --- | --- | --- |
${knownDifferences.map((d) => `| ${d.topic} | ${cell(d.designMd)} | ${cell(d.library)} | ${cell(d.follow)} |`).join('\n')}`
}

const WHAT_THE_AI_ASKS = `## What your AI will ask you

DESIGN.md tells the AI to ask before it designs, so have these ready:

${aiWillAsk.map((a) => `- **${a.what}** - ${a.detail}`).join('\n')}

When it cannot ask, it states what it assumed, using the markers below.`

function markersBlock(): string {
  return `## Markers in the AI's answer

| Marker | What it means | What to do |
| --- | --- | --- |
${designGuideMarkers.map((m) => `| \`${m.name}\` | ${cell(m.means)} | ${cell(m.action)} |`).join('\n')}`
}

/**
 * The note at the top of the parts zip, for whoever opens the folder without
 * having seen the AI spec page.
 */
function buildSpecGuide(parts: ResolvedPart[], tokensOf: (file: string) => number): string {
  const k = (file: string) => tokensLabel(tokensOf(file))
  const rows = parts
    .map(({ part, components }) => {
      const contents = components.length
        ? `${part.summary}: ${components.map((c) => c.name).join(', ')}`
        : part.summary
      return `| \`${fileName(part.file)}\` | ${contents} | ${k(part.file)} |`
    })
    .join('\n')
  const core = fileName(parts[0].part.file)

  return `${provenance()}

# Inspera Design System - the AI spec in parts

Version ${VERSION}. The complete AI spec (\`${fullSpec.saveAs}\`, ${k(fullSpec.file)}) cut into
${parts.length} smaller files, for AI tools that cannot take it in one piece, with the
design guide that goes with it: \`DESIGN.md\` and its \`references/\` folder. The
specs are word for word the same; only the packaging differs.

## How to use it

1. **Give your AI \`DESIGN.md\` first, every time.** It says how to design an
   Inspera screen. Add a file from \`references/\` when DESIGN.md says to.
2. **Always give your AI \`${core}\`.** It holds the rules, the
   setup (fonts, icon class, tokens) and the foundations every component builds
   on. Without it, fonts, icons and colours come out wrong.
3. **Add the part for each component you use.** The table below says which
   part holds which component.
4. **Wherever DESIGN.md says "the full guide" or \`${fullSpec.saveAs}\`,** it
   means \`${core}\` for the setup and tokens, plus the part that holds each
   component.
5. **If your tool takes large uploads** - Claude Projects, a custom GPT,
   Cursor's docs - the AI spec zip is simpler: DESIGN.md and the whole spec in
   one folder, nothing to choose.

Keep the \`references/\` folder beside DESIGN.md. DESIGN.md refers to its files
by those paths.

## The design guide

| File | Read it | Size |
| --- | --- | --- |
${designGuideRows()}

## The parts

| File | Contents | Size |
| --- | --- | --- |
${rows}

Sizes are estimates, at about four characters per token.

${WHICH_FILE_WINS}

${knownDifferencesBlock()}

${WHAT_THE_AI_ASKS}

${markersBlock()}
`
}

/**
 * The note at the top of the AI spec zip: what each file is for, the read
 * order, which file wins, how to set up a tool, and the known differences.
 */
function buildAiSpecGuide(): string {
  const full = produced.get(`public/${fullSpec.file}`)
  if (full === undefined) throw new Error(`Write public/${fullSpec.file} before ${aiSpecGuide}; it quotes its size.`)
  const guideVersion = designGuideVersion()

  return `${provenance()}

# Inspera Design System - start here

Version ${VERSION}${guideVersion ? `, with DESIGN.md ${guideVersion}` : ''}. Two documents that work
together, for any AI tool that builds Inspera UI:

- **\`DESIGN.md\`** - the design guide, from the design system team: how to design
  an Inspera screen. Who it is for, existing versus new UI, information
  hierarchy, layout and UI text. Its \`references/\` folder holds the detail.
- **\`${fullSpec.saveAs}\`** - the full guide: how to build each component. The
  setup, the tokens, and every component's props, HTML and CSS.

## What is in this folder

| File | Read it | Size |
| --- | --- | --- |
${designGuideRows()}
| \`${fullSpec.saveAs}\` | The Setup section first, then the section for each component you use. | ${tokensLabel(estimateTokens(full))} |

Keep the file names and the \`references/\` folder as they are. DESIGN.md refers
to them by name.

## Read order

1. \`DESIGN.md\`, all of it.
2. The Setup section of \`${fullSpec.saveAs}\`: fonts, the icon class and the tokens.
3. A file in \`references/\` whenever DESIGN.md says to.
4. The section of \`${fullSpec.saveAs}\` for each component you use.

${WHICH_FILE_WINS}

## Set up your AI tool

- **Chat tools with project files** (Claude Projects, ChatGPT projects and custom
  GPTs, Gemini Gems): upload every file in this folder, then paste the project
  instructions below into the project's instructions.
- **Coding agents** (Claude Code, Cursor, Copilot, Windsurf): put this folder in
  the repository, for example at \`design/inspera/\`, and add one line to the
  agent's rules file (CLAUDE.md, AGENTS.md, a Cursor rule or
  copilot-instructions.md): "For any UI work, read design/inspera/DESIGN.md
  first and follow it. Build components from design/inspera/${fullSpec.saveAs}."
- **Tools that cannot take large files**: download the AI spec in parts instead.
  It has the same DESIGN.md, with the full guide cut into smaller files.

Project instructions:

\`\`\`text
${projectInstructions}
\`\`\`

${WHAT_THE_AI_ASKS}

${markersBlock()}

${knownDifferencesBlock()}

## Check your setup

Ask your AI: "Which Inspera files do you have, and which will you read first?"
It should name DESIGN.md first. Then ask it to design a screen without saying
who it is for: it should ask for the primary user role before it starts, or
state \`USER_ROLE_ASSUMED\` in its answer.
`
}

/** The parts and their start-here note, held to the budget before anything is written. */
function buildSpecFiles(): { path: string; content: string }[] {
  const parts = resolveSpecParts()
  const contents = new Map(
    parts.map(({ part }, i) => [part.file, i === 0 ? buildSpecCore(parts) : buildSpecPart(parts, i)]),
  )
  for (const [file, content] of contents) {
    const tokens = estimateTokens(content)
    if (tokens > SPEC_PART_BUDGET) {
      throw new Error(
        `public/${file} is ~${Math.round(tokens / 1000)}k tokens, over the ${SPEC_PART_BUDGET / 1000}k ` +
          'budget for a part. Move some of its components to another part, or split it, in specParts ' +
          'in src/data/distribution.ts.',
      )
    }
  }

  const full = produced.get(`public/${fullSpec.file}`)
  if (full === undefined) throw new Error(`Write public/${fullSpec.file} before the parts; their guide quotes its size.`)
  const tokensOf = (file: string) => estimateTokens(file === fullSpec.file ? full : contents.get(file)!)

  return [
    ...[...contents].map(([file, content]) => ({ path: `public/${file}`, content })),
    { path: `public/${specGuide}`, content: buildSpecGuide(parts, tokensOf) },
  ]
}

/**
 * Which components actually use each radius token, read from the source rather
 * than asserted in prose - so the Foundations page cannot claim `xl` is for
 * cards when nothing uses it.
 */
function radiusUsage(): Record<string, string[]> {
  const dir = join(root, 'src/components/inspera')
  const files = readdirSync(dir).filter((f) => f.endsWith('.tsx'))
  const out: Record<string, string[]> = {}
  for (const r of radius) {
    const users = files
      .filter((f) => readFileSync(join(dir, f), 'utf8').includes(`var(--radius-${r.token})`))
      .map((f) => f.replace('.tsx', ''))
      .sort()
    out[r.token] = users
  }
  return out
}

/** Prop API as data, so tools can validate rather than infer. */
function buildApiJson() {
  return {
    $schema: 'https://inspera.design/schema/api.json',
    version: VERSION,

    description:
      'Inspera Design System component API, derived from the TypeScript interfaces. ' +
      'Prop names are camelCase and case-sensitive; variant values are Capitalised.',
    components: Object.fromEntries(
      componentList.map((c) => {
        const exportName = exportNameFor(c)
        return [
          exportName,
          {
            slug: c.slug,
            displayName: c.name,
            category: c.category,
            purpose: c.purpose,
            // Synonyms a person or model might use instead of the canonical
            // name: "modal" for Dialog, "dropdown" for Select.
            keywords: c.keywords ?? [],
            importFrom: '@inspera/components',
            props: componentApi[exportName].props,
            relatedTypes: componentApi[exportName].relatedTypes,
            accessibility: c.accessibility,
            usage: c.usage,
            deprecatedAliases: c.deprecatedAliases,
          },
        ]
      }),
    ),
  }
}

/** Deprecated name -> canonical component, so tools can auto-migrate. */
function buildAliasesJson() {
  const aliases: Record<string, string> = {}
  for (const c of componentList) {
    for (const a of c.deprecatedAliases) aliases[a] = exportNameFor(c)
  }
  return { version: VERSION, description: 'Deprecated Inspera name -> canonical component export.', aliases }
}

/** Tailwind v4 @theme - most AI builders emit Tailwind, so meet them there. */
function buildTailwindTheme(): string {
  const lines: string[] = []
  const push = (label: string, entries: [string, string][]) => {
    lines.push(`  /* ${label} */`)
    for (const [k, v] of entries) lines.push(`  ${k}: ${v};`)
    lines.push('')
  }

  push('Brand & semantic', [
    ...brandColors.map((c) => [`--color-${c.name.replace('.main', '')}`, c.value] as [string, string]),
    ...semanticColors.map((c) => [`--color-${c.name}`, c.value] as [string, string]),
    ...brandAccents.map((c) => [`--color-accent-${c.name}`, c.value] as [string, string]),
  ])
  for (const [family, shades] of Object.entries(palette)) {
    push(`Palette - ${family}`, Object.entries(shades).map(([sh, v]) => [`--color-${family}-${sh}`, v]))
  }
  push('Radius', radius.map((r) => [`--radius-${r.token}`, `${r.value}px`]))
  push('Spacing', spacing.map((sp) => [`--spacing-${sp.token}`, `${sp.value}px`]))
  push('Elevation', shadows.map((sh) => [`--shadow-${sh.token}`, sh.value]))
  push('Typography', [
    // Derived from `fonts`, not restated - a duplicated list is how the
    // stylesheet and the Tailwind theme end up disagreeing about the face.
    ...fonts.map((f) => [`--${f.name}`, f.value] as [string, string]),
    ...typeScale.map((t) => [`--text-${t.name}`, `${t.size}px`] as [string, string]),
  ])

  return `/* Inspera Design System v${VERSION} - Tailwind v4 theme. GENERATED, do not edit.

   Most AI builders emit Tailwind utilities, so this exposes every Inspera token
   as a Tailwind theme value: bg-primary, text-gray-700, rounded-md, p-4, shadow-200.

   Usage - in your global stylesheet, after the Tailwind import:
     @import 'tailwindcss';
     @import './inspera.theme.css';
*/

@theme {
${lines.join('\n').trimEnd()}
}
`
}

// ---------------------------------------------------------------------------
// Per-tool rule files. Each is a thin pointer at the canonical artifacts, so
// dropping one into a repo configures that tool without pasting 16k tokens.
// ---------------------------------------------------------------------------
function toolRules(): { path: string; content: string }[] {
  const where = BASE_URL
    ? `Fetch them from ${BASE_URL}/`
    : `They live in this repo's \`public/\` directory (set INSPERA_DS_BASE_URL and regenerate to emit absolute URLs)`

  const body = `# Inspera Design System

All UI in this project uses the Inspera Design System (v${VERSION}).

${RULES}

${DESIGN_GUIDE}

## Reference

${where}

- \`${designGuideServed}/DESIGN.md\` - the design guide: who the screen is for, existing versus new UI, hierarchy, layout and UI text. Read it before designing any screen.
- \`${designGuideServed}/references/<file>.md\` - DESIGN.md's reference files. Read one when DESIGN.md says to.
- \`llms.txt\` - component index. Read this first when building components.
- \`c/<component>.md\` - full spec for one component. Fetch only what you use.
- \`api.json\` - every prop, type and default, machine-readable.
- \`tokens.css\` - import once at the app root.
- \`inspera.theme.css\` - Tailwind v4 \`@theme\` block, if this project uses Tailwind.

${buildFoundations({ compact: true })}

${buildGuidance()}
`

  return [
    { path: 'public/rules/AGENTS.md', content: body },
    { path: 'public/rules/CLAUDE.md', content: body },
    { path: 'public/rules/copilot-instructions.md', content: body },
    { path: 'public/rules/.windsurfrules', content: body },
    {
      path: 'public/rules/inspera.mdc',
      content: `---\ndescription: Inspera Design System - component and token rules\nglobs: ["**/*.tsx", "**/*.jsx", "**/*.css"]\nalwaysApply: true\n---\n\n${body}`,
    },
  ]
}

/** Every file under a folder, as `/`-separated paths relative to it. Skips Finder's .DS_Store. */
function filesUnder(dir: string): string[] {
  const base = join(root, dir)
  const out: string[] = []
  const walk = (d: string) => {
    let names: string[]
    try {
      names = readdirSync(d)
    } catch {
      return
    }
    for (const name of names) {
      if (name === '.DS_Store') continue
      const abs = join(d, name)
      if (statSync(abs).isDirectory()) walk(abs)
      else out.push(relative(base, abs).split('\\').join('/'))
    }
  }
  walk(base)
  return out.sort()
}

/**
 * The design guide, published exactly as the design system team wrote it.
 * Only the files src/data/design-md.ts lists go out; anything else in the
 * folder is reported here, and `pnpm audit:design-md` fails until it is listed.
 */
function publishDesignGuide() {
  const listed = new Set(designGuideFiles.map((f) => f.path))
  for (const f of designGuideFiles) {
    const from = `${designGuideSource}/${f.path}`
    try {
      statSync(join(root, from))
    } catch {
      throw new Error(`${from} is listed in src/data/design-md.ts but is missing. Restore it, or take it off the list.`)
    }
    copyVerbatim(from, `public/${designGuideServed}/${f.path}`)
  }
  const unlisted = filesUnder(designGuideSource).filter((p) => !listed.has(p))
  if (unlisted.length > 0) {
    console.warn(`  ! ${designGuideSource}/ also holds ${unlisted.join(', ')}, which is not published. List it in src/data/design-md.ts.`)
  }
  // A copy whose source has gone would otherwise stay on the site.
  for (const stale of filesUnder(`public/${designGuideServed}`).filter((p) => !listed.has(p))) {
    const rel = `public/${designGuideServed}/${stale}`
    if (CHECK) {
      drifted.push(rel)
    } else {
      rmSync(join(root, rel))
      console.log('  ✗', rel, '(removed: no longer in the design guide)')
    }
  }
}

// ---------------------------------------------------------------------------
console.log('Generating distribution outputs from source of truth...')
checkVariantGuidance()
const distributedCss = buildDistributedCss()
/**
 * Real byte and token counts for each published artifact.
 *
 * The Integrate page and the AI spec page tell people how big a file is so
 * they can decide between uploading it and pasting it. Those numbers were
 * typed by hand and were already wrong: adding the Setup section pushed the
 * full guide from 67k to 71k tokens while the page still said 67k. Measured
 * after everything else is written, so the figure is always the file that
 * shipped. Tokens are bytes/4, which is close enough for the decision it
 * informs and honest about being an estimate.
 */
function artifactSizes(): Record<string, { bytes: number; tokens: number }> {
  const out: Record<string, { bytes: number; tokens: number }> = {}
  const files = new Set([
    ...artifacts.map((a) => a.file),
    specGuide,
    ...specParts.map((p) => p.file),
    aiSpecGuide,
    ...designGuideFiles.map((f) => `${designGuideServed}/${f.path}`),
  ])
  for (const file of files) {
    const content = produced.get(`public/${file}`)
    if (content === undefined) {
      throw new Error(
        `distribution.ts lists "${file}" but public/${file} was not generated. ` +
          'Remove it from distribution.ts, or emit it.',
      )
    }
    out[file] = { bytes: Buffer.byteLength(content, 'utf8'), tokens: estimateTokens(content) }
  }
  return out
}

write(
  'src/data/radius-usage.generated.ts',
  '// GENERATED by scripts/build-portable.ts - which components use each radius\n' +
    '// token, read from the component source. Do not edit.\n\n' +
    'export const radiusUsage: Record<string, string[]> = ' +
    JSON.stringify(radiusUsage(), null, 2) +
    '\n',
)
write(
  'src/data/component-docs.generated.ts',
  '// GENERATED by scripts/build-portable.ts. Do not edit.\n' +
    '// The exact per-component markdown published in llms-full.txt, so the\n' +
    "// site's \"copy for AI\" panel and the portable spec can never disagree.\n\n" +
    'export const componentDocs: Record<string, string> = ' +
    JSON.stringify(
      Object.fromEntries(componentList.map((c) => [c.slug, componentMarkdown(c, '@inspera/components')])),
      null,
      2,
    ) +
    '\n',
)
write(
  'src/data/component-api.generated.ts',
  '// GENERATED by scripts/build-portable.ts from the component TypeScript\n' +
    '// interfaces. Do not edit. Regenerate with `pnpm generate`.\n\n' +
    "import type { ComponentApi, PropDoc } from '../../scripts/extract-props'\n\n" +
    'export type { ComponentApi, PropDoc }\n\n' +
    'export const componentApi: Record<string, ComponentApi> = ' +
    JSON.stringify(componentApi, null, 2) +
    '\n',
)
write(
  'src/imports/tokens.css',
  GENERATED_HEADER('src/data/tokens.ts') + buildRootCss() + '\n' + buildTypeClasses(),
)
// First: the notes below describe these files and measure them.
publishDesignGuide()
write('public/llms.txt', buildLlmsIndex())
write('public/llms-full.txt', buildLlmsTxt())
for (const f of buildSpecFiles()) write(f.path, f.content)
write(`public/${aiSpecGuide}`, buildAiSpecGuide())
write('public/foundations.md', buildFoundationsDoc())
write(
  'public/guidance.md',
  `${provenance()}\n\n# Inspera Design System - Composition & rules\n\n` +
    `Version ${VERSION}. How to assemble the canonical components into screens.\n\n` +
    `## Rules\n\n${RULES}\n\n${DESIGN_GUIDE}\n\n${buildGuidance()}\n`,
)
for (const f of buildComponentFiles()) write(f.path, f.content)
write('public/api.json', JSON.stringify(buildApiJson(), null, 2) + '\n')
write('public/aliases.json', JSON.stringify(buildAliasesJson(), null, 2) + '\n')
write('public/inspera.theme.css', buildTailwindTheme())
write('public/tokens.w3c.json', JSON.stringify(buildW3CTokens(), null, 2) + '\n')
write('packages/components/styles.css', distributedCss)
write('packages/components/README.md', buildPackageReadme())
write('public/tokens.css', distributedCss)
write('kit/styles.css', distributedCss)
for (const f of toolRules()) write(f.path, f.content)
write('kit/guidelines/components.md', buildKitComponentsMd())
write('kit/guidelines/tokens.md', buildKitTokensMd())
write('kit/.figma/make/kit.json', JSON.stringify(buildKitManifest(), null, 2) + '\n')
// Last: sizes are measured from the outputs above, never from a previous run.
write(
  'src/data/artifact-sizes.generated.ts',
  '// GENERATED by scripts/build-portable.ts - measured from the files that were\n' +
    '// just written, so a size shown in the UI is never a stale guess. Do not edit.\n\n' +
    'export const artifactSizes: Record<string, { bytes: number; tokens: number }> = ' +
    JSON.stringify(artifactSizes(), null, 2) +
    '\n\n' +
    '/** The version stamped into every file above. */\n' +
    `export const artifactVersion = ${JSON.stringify(VERSION)}\n`,
)

if (CHECK) {
  if (drifted.length > 0) {
    console.error(`\n${drifted.length} generated file(s) are out of date:`)
    for (const f of drifted) console.error('  ✗', f)
    console.error('\nRun `pnpm generate` and include the result.')
    process.exit(1)
  }
  console.log('All generated files are up to date.')
} else {
  // Not a gate - `pnpm audit:design-md` is. This only makes a new difference
  // between DESIGN.md and the library visible the moment it appears.
  try {
    console.log(summariseDesignMd(checkDesignMd()))
  } catch (e) {
    console.warn(`  ! Could not check DESIGN.md: ${(e as Error).message}`)
  }
  console.log('Done.')
}
