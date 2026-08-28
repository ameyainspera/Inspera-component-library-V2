/**
 * build-portable.ts — the single generator that keeps every distribution
 * output in sync with the source of truth.
 *
 * Source of truth:
 *   - src/data/tokens.ts      (token values)
 *   - src/data/components.ts  (component semantics)
 *   - src/runtime.css         (icon helper + keyframes, copied verbatim)
 *
 * Generated outputs (never hand-edited):
 *   - src/tokens.css                 :root custom properties for the docs app
 *   - public/inspera-llms.txt        portable spec for any LLM tool
 *   - public/tokens.w3c.json         W3C Design Tokens JSON
 *   - packages/components/tokens.css  token CSS shipped by the npm package
 *   - kit/styles.css                  same tokens for the Figma Make kit
 *   - kit/guidelines/tokens.md        kit token reference
 *   - kit/guidelines/components.md    kit component catalog + APIs
 *   - kit/.figma/make/kit.json        kit manifest
 *
 * Run with: pnpm generate
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { componentList } from '../src/data/components'
import { registry } from '../src/docs/registry'
import { extractComponentProps, type PropDoc } from './extract-props'
import type { ComponentSpec } from '../src/data/types'
import {
  brandColors, semanticColors, brandAccents, palette,
  spacing, radius, shadows, typeScale,
  systemTokens, fonts, baseColors,
  borderWidths, focusRing, motion, zIndex, breakpoints,
} from '../src/data/tokens'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const write = (rel: string, content: string) => {
  const abs = join(root, rel)
  mkdirSync(dirname(abs), { recursive: true })
  writeFileSync(abs, content)
  console.log('  ✓', rel)
}

// ---------------------------------------------------------------------------
// Token CSS — generated from src/data/tokens.ts, the single typed source.
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

/** The `:root { … }` block: every token in tokens.ts, as a custom property. */
function buildRootCss(): string {
  const blocks: string[] = []

  blocks.push(tokenBlock('Brand', brandColors.map((c) => ({ name: cssName(c.name), value: c.value, note: c.note }))))
  blocks.push(tokenBlock('Semantic', semanticColors.map((c) => ({ name: c.name, value: c.value }))))
  blocks.push(tokenBlock('Brand accents', brandAccents.map((c) => ({ name: `accent-${c.name}`, value: c.value }))))
  blocks.push(tokenBlock('Base', baseColors))

  for (const [family, shades] of Object.entries(palette)) {
    blocks.push(tokenBlock(
      `Palette — ${family}`,
      Object.entries(shades).map(([shade, value]) => ({ name: `${family}-${shade}`, value })),
    ))
  }

  for (const [label, entries] of Object.entries(systemTokens)) {
    blocks.push(tokenBlock(label, entries))
  }

  blocks.push(tokenBlock('Spacing', spacing.map((sp) => ({ name: `space-${sp.token}`, value: `${sp.value}px` }))))
  blocks.push(tokenBlock('Radius', radius.map((r) => ({ name: `radius-${r.token}`, value: `${r.value}px` }))))
  blocks.push(tokenBlock('Elevation', shadows.map((sh) => ({ name: `shadow-${sh.token}`, value: sh.value }))))
  blocks.push(tokenBlock('Border width', borderWidths.map((b) => ({ name: `border-width-${b.token}`, value: b.value }))))
  blocks.push(tokenBlock('Focus ring', focusRing))
  blocks.push(tokenBlock('Motion — duration', motion.duration.map((d) => ({ name: `duration-${d.token}`, value: d.value, note: d.note }))))
  blocks.push(tokenBlock('Motion — easing', motion.easing.map((e) => ({ name: `easing-${e.token}`, value: e.value, note: e.note }))))
  blocks.push(tokenBlock('Layering', zIndex.map((z) => ({ name: `z-${z.token}`, value: String(z.value), note: z.note }))))
  blocks.push(tokenBlock('Breakpoints', breakpoints.map((b) => ({ name: `breakpoint-${b.token}`, value: `${b.value}px` }))))
  blocks.push(tokenBlock('Typography — family', fonts))
  blocks.push(tokenBlock(
    'Typography — scale',
    typeScale.flatMap((t) => {
      const n = cssName(t.token)
      return [
        { name: `text-${n}-size`, value: `${t.size}px` },
        { name: `text-${n}-weight`, value: String(t.weight) },
      ]
    }),
  ))

  return `:root {\n${blocks.join('\n\n')}\n}\n`
}

const GENERATED_HEADER = (from: string) =>
  `/* Inspera Design System — GENERATED FILE, DO NOT EDIT.\n` +
  `   Source: ${from}. Regenerate with \`pnpm generate\`. */\n\n`

/** The stylesheet shipped to consumers: tokens + the runtime CSS, verbatim. */
function buildDistributedCss(): string {
  const runtime = readFileSync(join(root, 'src/runtime.css'), 'utf8')
    .replace(/^\/\*[\s\S]*?\*\/\n\n/, '') // strip the authoring preamble
  return GENERATED_HEADER('src/data/tokens.ts + src/runtime.css') + buildRootCss() + '\n' + runtime
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
    $description: 'Inspera Design System tokens (W3C Design Tokens format). Generated — do not edit.',
    color,
    spacing: dimension(spacing),
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
// emits — so the spec, the site and the component always agree.
// ---------------------------------------------------------------------------
const componentApi = extractComponentProps()

/** Pipes inside a cell would otherwise split it into new columns. */
const cell = (v: string) => v.replace(/\|/g, '\\|')

function propTable(props: PropDoc[]): string {
  if (props.length === 0) return '_No props._'
  const rows = props.map((p) => {
    const name = p.required ? `\`${p.name}\` **(required)**` : `\`${p.name}\``
    return `| ${name} | \`${cell(p.type)}\` | ${p.default ? `\`${cell(p.default)}\`` : '—'} | ${cell(p.description ?? '')} |`
  })
  return `| Prop | Type | Default | Description |\n| --- | --- | --- | --- |\n${rows.join('\n')}`
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

/** Shapes a prop refers to — without these, `items: TabItem[]` is a dead end. */
function relatedTypesBlock(related: Record<string, string>): string {
  const entries = Object.entries(related)
  if (entries.length === 0) return ''
  return `\n\`\`\`ts\n${entries.map(([, src]) => src).join('\n\n')}\n\`\`\`\n`
}

function componentMarkdown(c: ComponentSpec, importPath: string): string {
  const exportName = exportNameFor(c)
  const { props, relatedTypes } = componentApi[exportName]
  const entry = registry[c.slug]
  const example = entry ? entry.snippet(entry.defaults) : `<${exportName} />`
  const aliases = c.deprecatedAliases.length
    ? `\n**Deprecated aliases** (do not use): ${c.deprecatedAliases.map((a) => `\`${a}\``).join(', ')}\n`
    : ''

  return `### ${c.name}

${c.purpose} — category: \`${c.category}\`.

\`\`\`tsx
import { ${exportName} } from '${importPath}'

${example}
\`\`\`

${propTable(props)}
${relatedTypesBlock(relatedTypes)}
**Accessibility** — role \`${c.accessibility.role}\`${c.accessibility.keyboard ? ', keyboard operable' : ''}. ${c.accessibility.ariaNotes.join('; ')}.

**Do:** ${c.usage.do.join('; ')}.
**Don't:** ${c.usage.dont.join('; ')}.
${aliases}`
}

// ---------------------------------------------------------------------------
// Portable spec — public/inspera-llms.txt (AGENTS/llms.txt style)
// ---------------------------------------------------------------------------
function buildLlmsTxt(): string {
  const byCategory: Record<string, ComponentSpec[]> = {}
  for (const c of componentList) (byCategory[c.category] ??= []).push(c)

  const sections = Object.entries(byCategory)
    .map(([cat, list]) =>
      `## Components — ${cat}\n\n${list.map((c) => componentMarkdown(c, '@inspera/components')).join('\n\n')}`)
    .join('\n\n')

  return `# Inspera Design System — complete AI build guide

> Version ${VERSION}. Everything needed to generate on-brand Inspera UI, in one
> document: the foundations, then all ${componentList.length} components with
> their real prop APIs.
>
> This is the full text. For a smaller starting point that links a spec per
> component, use llms.txt.

If the project can install packages, prefer the real components — they enforce
this spec at runtime:

\`\`\`bash
npm i @inspera/components   # private registry
\`\`\`
\`\`\`tsx
import '@inspera/components/tokens.css'
import { Button, TextInput } from '@inspera/components'
\`\`\`

Otherwise follow the definitions below verbatim.

## Rules

${RULES}

${buildFoundations({ compact: false })}

${sections}
`
}

/** Foundations on their own, for an agent that only needs the tokens. */
function buildFoundationsDoc(): string {
  return `${provenance()}

# Inspera Design System — Foundations

Version ${VERSION}. Colour, typography, spacing, radius and depth. Components
are documented separately — see llms.txt for the index.

${buildFoundations({ compact: false })}
`
}

// ---------------------------------------------------------------------------
// Figma Make kit — components.md + tokens.md + manifest
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
component's entry before using it — prop names and variant casing are exact.

${sections}
`
}

function buildKitTokensMd(): string {
  const rows = (label: string, items: { name: string; value: string }[]) =>
    `### ${label}\n\n| Token | Value |\n| --- | --- |\n${items.map((i) => `| ${i.name} | ${i.value} |`).join('\n')}`
  const paletteRows = Object.entries(palette)
    .map(([f, shades]) => `### palette.${f}\n\n| Shade | Value |\n| --- | --- |\n${Object.entries(shades).map(([s, v]) => `| ${s} | ${v} |`).join('\n')}`)
    .join('\n\n')
  return `# Tokens

All tokens are CSS custom properties defined in \`styles.css\` (imported by setup).
Reference them as \`var(--primary)\`, \`var(--radius-md)\`, etc.

${rows('Brand', brandColors.map((c) => ({ name: c.name, value: c.value })))}

${rows('Semantic', semanticColors.map((c) => ({ name: c.name, value: c.value })))}

${rows('Accent', brandAccents.map((c) => ({ name: `accent.${c.name}`, value: c.value })))}

${paletteRows}

### Radius

| Token | Value |
| --- | --- |
${radius.map((r) => `| radius.${r.token} | ${r.value}px |`).join('\n')}

### Spacing (px)

${spacing.map((s) => s.value).join(', ')}
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
      { family: 'Inter', styles: ['400', '500', '600', '700'] },
      { family: 'JetBrains Mono', styles: ['400', '500', '600'] },
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
//   llms.txt        small index — what you paste
//   c/<slug>.md     one component — what an agent fetches
//   llms-full.txt   everything inline — the fallback
//   api.json        the prop API, machine-readable
// ---------------------------------------------------------------------------
const VERSION = JSON.parse(
  readFileSync(join(root, 'packages/components/package.json'), 'utf8'),
).version as string

/** Absolute base for generated links. Unset until a host is chosen. */
const BASE_URL = (process.env.INSPERA_DS_BASE_URL ?? '').replace(/\/$/, '')
const url = (path: string) => (BASE_URL ? `${BASE_URL}/${path}` : `./${path}`)

const provenance = () =>
  `<!-- Inspera Design System v${VERSION} — generated ${new Date().toISOString().slice(0, 10)}. Do not edit. -->`

const RULES = `- Use ONLY the ${componentList.length} components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (\`intent\`, not \`Intent\`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (\`intent="Primary"\`, \`size="Medium"\`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.`

/**
 * Foundations — the design decisions every component is built from.
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
          `- **${family}** — ${Object.entries(shades).map(([sh, v]) => `${sh} \`${v}\``).join(' · ')}`)
        .join('\n')
    : Object.entries(palette)
        .map(([family, shades]) =>
          `#### ${family}\n\n| Shade | CSS variable | Value |\n| --- | --- | --- |\n` +
          Object.entries(shades)
            .map(([sh, v]) => `| ${sh} | \`var(--${family}-${sh})\` | ${v} |`)
            .join('\n'))
        .join('\n\n')

  const roles = Object.entries(systemTokens)
    .map(([label, entries]) =>
      `**${label}** — ` +
      entries.map((t) => `\`var(--${t.name})\` ${t.value}`).join(', '))
    .join('\n\n')

  const type = typeScale
    .map((t) => `| \`${t.token}\` | \`var(--text-${cssName(t.token)}-size)\` | ${t.size}px | ${t.weight} |`)
    .join('\n')

  const space = spacing
    .map((sp) => `| \`${sp.token}\` | \`var(--space-${sp.token})\` | ${sp.value}px |`)
    .join('\n')

  const rad = radius
    .map((r) => `| \`${r.token}\` | \`var(--radius-${r.token})\` | ${r.value}px |`)
    .join('\n')

  const depth = shadows
    .map((sh) => `| \`shadow.${sh.token}\` | \`var(--shadow-${sh.token})\` | \`${sh.value}\` |`)
    .join('\n')

  return `## Foundations

Every value below is a CSS custom property. Import the stylesheet once at the
app root and reference tokens as \`var(--primary)\`, \`var(--space-4)\`,
\`var(--radius-md)\`. Never hardcode a colour that is not in this list.

### Colour — brand & semantic

${colourHead}
${brand}

### Colour — palette

Each family runs 100 (lightest) to 900 (darkest). 600–900 are safe for text on
a light background; 100–300 are surface tints.

${paletteSection}

### Colour — roles

Prefer a role token over a raw palette shade wherever one exists.

${roles}

### Typography

Inter for all UI text. JetBrains Mono for code and token values. Material
Symbols Outlined for icons.

| Token | CSS variable | Size | Weight |
| --- | --- | --- | --- |
${type}

### Spacing

Use the scale — no arbitrary pixel values.

| Token | CSS variable | Value |
| --- | --- | --- |
${space}

### Radius

Small-to-medium radii: \`sm\` for controls, \`md\` for inputs and alerts,
\`lg\` for cards and dialogs. Pills only for toggles, badges, radios, avatars.

| Token | CSS variable | Value |
| --- | --- | --- |
${rad}

### Depth / elevation

Flat by default. Prefer a border over a shadow for separation; use \`200\` for
cards and \`500\` for dialogs.

| Token | CSS variable | Value |
| --- | --- | --- |
${depth}
`
}

/** The small index — this is what a person pastes into a chat. */
function buildLlmsIndex(): string {
  const byCategory: Record<string, ComponentSpec[]> = {}
  for (const c of componentList) (byCategory[c.category] ??= []).push(c)

  const index = Object.entries(byCategory)
    .map(([cat, list]) =>
      `### ${cat}\n\n` +
      list.map((c) => `- [${c.name}](${url(`c/${c.slug}.md`)}) — ${c.purpose}`).join('\n'))
    .join('\n\n')

  return `# Inspera Design System — AI build guide

> Version ${VERSION}. Generate on-brand Inspera UI in any AI builder.
> This index is deliberately small. Fetch the linked file for each component
> you actually use, rather than loading the whole system.

If the project can install packages, prefer the real components — they enforce
this spec at runtime:

\`\`\`bash
npm i @inspera/components   # private registry
\`\`\`
\`\`\`tsx
import '@inspera/components/tokens.css'
import { Button, TextInput } from '@inspera/components'
\`\`\`

Otherwise follow the definitions in the linked files verbatim.

## Rules

${RULES}

${buildFoundations({ compact: true })}

## Components

${index}

## Machine-readable artifacts

| File | What it is |
| --- | --- |
| [llms-full.txt](${url('llms-full.txt')}) | The complete document — foundations plus every component inline |
| [foundations.md](${url('foundations.md')}) | Colour, typography, spacing, radius, depth on their own |
| [api.json](${url('api.json')}) | Prop API, derived from the TypeScript types |
| [tokens.css](${url('tokens.css')}) | Token custom properties + icon/keyframe runtime |
| [inspera.theme.css](${url('inspera.theme.css')}) | Tailwind v4 \`@theme\` block |
| [tokens.w3c.json](${url('tokens.w3c.json')}) | W3C Design Tokens format |
| [aliases.json](${url('aliases.json')}) | Deprecated name → canonical component |
`
}

/** One self-contained file per component, for agents that fetch on demand. */
function buildComponentFiles(): { path: string; content: string }[] {
  return componentList.map((c) => ({
    path: `public/c/${c.slug}.md`,
    content: `${provenance()}

# Inspera — ${c.name}

${RULES}

${componentMarkdown(c, '@inspera/components')}

---

Tokens: ${url('tokens.css')} · Full system: ${url('llms.txt')}
`,
  }))
}

/** Prop API as data, so tools can validate rather than infer. */
function buildApiJson() {
  return {
    $schema: 'https://inspera.design/schema/api.json',
    version: VERSION,
    generatedAt: new Date().toISOString().slice(0, 10),
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

/** Deprecated name → canonical component, so tools can auto-migrate. */
function buildAliasesJson() {
  const aliases: Record<string, string> = {}
  for (const c of componentList) {
    for (const a of c.deprecatedAliases) aliases[a] = exportNameFor(c)
  }
  return { version: VERSION, description: 'Deprecated Inspera name → canonical component export.', aliases }
}

/** Tailwind v4 @theme — most AI builders emit Tailwind, so meet them there. */
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
    push(`Palette — ${family}`, Object.entries(shades).map(([sh, v]) => [`--color-${family}-${sh}`, v]))
  }
  push('Radius', radius.map((r) => [`--radius-${r.token}`, `${r.value}px`]))
  push('Spacing', spacing.map((sp) => [`--spacing-${sp.token}`, `${sp.value}px`]))
  push('Elevation', shadows.map((sh) => [`--shadow-${sh.token}`, sh.value]))
  push('Typography', [
    ['--font-sans', "'Inter', system-ui, sans-serif"],
    ['--font-mono', "'JetBrains Mono', ui-monospace, monospace"],
    ...typeScale.map((t) => [`--text-${cssName(t.token)}`, `${t.size}px`] as [string, string]),
  ])

  return `/* Inspera Design System v${VERSION} — Tailwind v4 theme. GENERATED, do not edit.

   Most AI builders emit Tailwind utilities, so this exposes every Inspera token
   as a Tailwind theme value: bg-primary, text-gray-700, rounded-md, p-4, shadow-200.

   Usage — in your global stylesheet, after the Tailwind import:
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

## Reference

${where}

- \`llms.txt\` — component index. Read this first.
- \`c/<component>.md\` — full spec for one component. Fetch only what you use.
- \`api.json\` — every prop, type and default, machine-readable.
- \`tokens.css\` — import once at the app root.
- \`inspera.theme.css\` — Tailwind v4 \`@theme\` block, if this project uses Tailwind.

${buildFoundations({ compact: true })}

## Before you finish

Check every component you used against its \`c/<component>.md\`: prop names
camelCase, variant values Capitalised, no hardcoded colors, accessibility notes
implemented.
`

  return [
    { path: 'public/rules/AGENTS.md', content: body },
    { path: 'public/rules/CLAUDE.md', content: body },
    { path: 'public/rules/copilot-instructions.md', content: body },
    { path: 'public/rules/.windsurfrules', content: body },
    {
      path: 'public/rules/inspera.mdc',
      content: `---\ndescription: Inspera Design System — component and token rules\nglobs: ["**/*.tsx", "**/*.jsx", "**/*.css"]\nalwaysApply: true\n---\n\n${body}`,
    },
  ]
}

// ---------------------------------------------------------------------------
console.log('Generating distribution outputs from source of truth…')
const distributedCss = buildDistributedCss()
write(
  'src/data/component-docs.generated.ts',
  '// GENERATED by scripts/build-portable.ts. Do not edit.\n' +
    '// The exact per-component markdown published in inspera-llms.txt, so the\n' +
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
write('src/tokens.css', GENERATED_HEADER('src/data/tokens.ts') + buildRootCss())
write('public/llms.txt', buildLlmsIndex())
write('public/llms-full.txt', buildLlmsTxt())
write('public/foundations.md', buildFoundationsDoc())
for (const f of buildComponentFiles()) write(f.path, f.content)
write('public/api.json', JSON.stringify(buildApiJson(), null, 2) + '\n')
write('public/aliases.json', JSON.stringify(buildAliasesJson(), null, 2) + '\n')
write('public/inspera.theme.css', buildTailwindTheme())
write('public/tokens.w3c.json', JSON.stringify(buildW3CTokens(), null, 2) + '\n')
write('packages/components/tokens.css', distributedCss)
write('public/tokens.css', distributedCss)
write('kit/styles.css', distributedCss)
for (const f of toolRules()) write(f.path, f.content)
write('kit/guidelines/components.md', buildKitComponentsMd())
write('kit/guidelines/tokens.md', buildKitTokensMd())
write('kit/.figma/make/kit.json', JSON.stringify(buildKitManifest(), null, 2) + '\n')
console.log('Done.')
