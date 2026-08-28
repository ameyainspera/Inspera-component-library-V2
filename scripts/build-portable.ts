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

function componentMarkdown(c: ComponentSpec, importPath: string): string {
  const exportName = exportNameFor(c)
  const props = componentApi[exportName]
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

**Accessibility** — role \`${c.accessibility.role}\`${c.accessibility.keyboard ? ', keyboard operable' : ''}. ${c.accessibility.ariaNotes.join('; ')}.

**Do:** ${c.usage.do.join('; ')}.
**Don't:** ${c.usage.dont.join('; ')}.
${aliases}`
}

// ---------------------------------------------------------------------------
// Portable spec — public/inspera-llms.txt (AGENTS/llms.txt style)
// ---------------------------------------------------------------------------
function buildLlmsTxt(): string {
  const tokenLines = [
    ...brandColors.map((c) => `- ${c.name}: ${c.value} — ${c.note}`),
    ...semanticColors.map((c) => `- ${c.name}: ${c.value}`),
    ...brandAccents.map((c) => `- accent.${c.name}: ${c.value}`),
    `- radius: ${radius.map((r) => `${r.token} ${r.value}px`).join(', ')}`,
    `- spacing scale (px): ${spacing.map((s) => s.value).join(', ')}`,
    `- fonts: Inter (UI/body), JetBrains Mono (code), Material Symbols Outlined (icons)`,
  ].join('\n')

  const byCategory: Record<string, ComponentSpec[]> = {}
  for (const c of componentList) (byCategory[c.category] ??= []).push(c)

  const sections = Object.entries(byCategory)
    .map(([cat, list]) =>
      `## ${cat}\n\n${list.map((c) => componentMarkdown(c, '@inspera/components')).join('\n\n')}`)
    .join('\n\n')

  return `# Inspera Design System — AI build guide

> Portable reference for generating on-brand Inspera UI in ANY AI builder
> (Cursor, v0, Lovable, Bolt, Claude, ChatGPT, etc.). Paste or link this file.
> If the project can install packages, prefer \`npm i @inspera/components\` and
> \`import '@inspera/components/tokens.css'\` — the real components enforce this
> spec. Otherwise, follow the definitions below verbatim.

## Rules

- Use ONLY the ${componentList.length} components below. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (\`intent\`, not \`Intent\`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error. Copy prop names exactly as the tables give them.
- **Variant *values* are Capitalised** (\`intent="Primary"\`, \`size="Medium"\`).
- Never use a deprecated alias name; map it to the canonical component.
- Style everything with the tokens below — never hardcode off-palette colors.
- Honor the accessibility notes (roles, aria, keyboard) for every component.

## Tokens

${tokenLines}

Full machine-readable tokens: tokens.w3c.json (W3C Design Tokens format).

${sections}
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
    "import type { PropDoc } from '../../scripts/extract-props'\n\n" +
    'export type { PropDoc }\n\n' +
    'export const componentApi: Record<string, PropDoc[]> = ' +
    JSON.stringify(componentApi, null, 2) +
    '\n',
)
write('src/tokens.css', GENERATED_HEADER('src/data/tokens.ts') + buildRootCss())
write('public/inspera-llms.txt', buildLlmsTxt())
write('public/tokens.w3c.json', JSON.stringify(buildW3CTokens(), null, 2) + '\n')
write('packages/components/tokens.css', distributedCss)
write('kit/styles.css', distributedCss)
write('kit/guidelines/components.md', buildKitComponentsMd())
write('kit/guidelines/tokens.md', buildKitTokensMd())
write('kit/.figma/make/kit.json', JSON.stringify(buildKitManifest(), null, 2) + '\n')
console.log('Done.')
