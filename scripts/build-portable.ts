/**
 * build-portable.ts — the single generator that keeps every distribution
 * output in sync with the source of truth.
 *
 * Source of truth:
 *   - src/data/tokens.ts      (token values)
 *   - src/data/components.ts  (component specs)
 *   - src/index.css           (:root custom properties + icon helper)
 *
 * Generated outputs (never hand-edited):
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
import type { ComponentSpec } from '../src/data/types'
import {
  brandColors, semanticColors, brandAccents, palette,
  spacing, radius, shadows, typeScale,
} from '../src/data/tokens'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const write = (rel: string, content: string) => {
  const abs = join(root, rel)
  mkdirSync(dirname(abs), { recursive: true })
  writeFileSync(abs, content)
  console.log('  ✓', rel)
}

// ---------------------------------------------------------------------------
// Extract the :root token block + icon helper from the canonical stylesheet so
// the package/kit CSS never drifts from what the docs site actually renders.
// ---------------------------------------------------------------------------
function extractTokenCss(): string {
  const css = readFileSync(join(root, 'src/index.css'), 'utf8')
  const rootMatch = css.match(/:root\s*\{[\s\S]*?\n\}/)
  const iconMatch = css.match(/\.material-symbols-outlined\s*\{[\s\S]*?\n\}/)
  const header =
    '/* Inspera Design System — token custom properties.\n' +
    '   Generated from src/index.css by scripts/build-portable.ts — do not edit. */\n\n'
  return header + [rootMatch?.[0], iconMatch?.[0]].filter(Boolean).join('\n\n') + '\n'
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
// Per-component markdown block (shared by llms.txt and kit components.md)
// ---------------------------------------------------------------------------
function componentMarkdown(c: ComponentSpec, importPath: string): string {
  const propRows = c.props
    .map((p) => `| \`${p.name}\` | ${p.values} | ${p.default ?? '—'} | ${p.description} |`)
    .join('\n')
  const aliases = c.deprecatedAliases.length
    ? `\n**Deprecated aliases** (do not use): ${c.deprecatedAliases.map((a) => `\`${a}\``).join(', ')}\n`
    : ''
  return `### ${c.name}

${c.purpose} — category: \`${c.category}\`.

\`\`\`tsx
import { ${c.name.replace(/\s+/g, '')} } from '${importPath}'
\`\`\`

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
${propRows}

**Accessibility** — role \`${c.accessibility.role}\`${c.accessibility.keyboard ? ', keyboard operable' : ''}. ${c.accessibility.ariaNotes.join('; ')}.

**Do:** ${c.usage.do.join('; ')}.
**Don't:** ${c.usage.dont.join('; ')}.
${aliases}
<details><summary>Canonical spec</summary>

\`\`\`yaml
${c.specYaml}
\`\`\`
</details>`
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
const tokenCss = extractTokenCss()
write('public/inspera-llms.txt', buildLlmsTxt())
write('public/tokens.w3c.json', JSON.stringify(buildW3CTokens(), null, 2) + '\n')
write('packages/components/tokens.css', tokenCss)
write('kit/styles.css', tokenCss)
write('kit/guidelines/components.md', buildKitComponentsMd())
write('kit/guidelines/tokens.md', buildKitTokensMd())
write('kit/.figma/make/kit.json', JSON.stringify(buildKitManifest(), null, 2) + '\n')
console.log('Done.')
