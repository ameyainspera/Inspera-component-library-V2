/**
 * SOURCE OF TRUTH for how the library is distributed, and - importantly -
 * whether each channel actually works yet.
 *
 * The Integrate page and every generated spec used to print
 * `npm i @inspera/components` as a plain instruction. The package builds and
 * is real, but it has never been published: the @inspera scope is unclaimed,
 * so that command returns E404 for everyone who runs it.
 *
 * Publishing is one edit here. Set `published: true` and fill in `registry`;
 * the page and all generated docs follow.
 */
export interface PackageStatus {
  name: string
  published: boolean
  /** Registry URL once published - npm, GitHub Packages, Artifactory. */
  registry: string | null
  /** Shown wherever the install instruction appears. */
  status: string
  /** What to do in the meantime. */
  insteadUse: string
}

export const componentsPackage: PackageStatus = {
  name: '@inspera/components',
  published: false,
  registry: null,
  status:
    'The package builds from this repo, but the @inspera npm scope has not been claimed, ' +
    'so installing it fails with a 404.',
  insteadUse:
    'Until it is published, use the AI spec: llms.txt and the per-component files. Once ' +
    'published, the package will be the most reliable option, but it will need registry ' +
    'authentication, which most AI builders cannot provide.',
}

/** The install line, only when it would actually work. */
export const installCommand = (p: PackageStatus): string | null =>
  p.published ? `npm i ${p.name}` : null

import { artifactSizes, artifactVersion } from './artifact-sizes.generated'
import { designGuideFiles, designGuideServed } from './design-md'

/**
 * What each published artifact should be called once it lands on someone's
 * disk, and how it is meant to be used.
 *
 * The served names follow conventions - `llms.txt` and `llms-full.txt` are the
 * llms.txt spec, `tokens.w3c.json` names its format - which is right for a
 * fetching agent and useless to a person. A file called `llms-full.txt` in a
 * Downloads folder three weeks later says nothing about what it is or which
 * design system it belongs to. The `download` attribute renames on save, so
 * this costs no extra generated file.
 *
 * The extension matters too: Claude Projects, ChatGPT and Cursor all treat
 * `.md` as a document and `.txt` as an unknown blob.
 */
export interface Artifact {
  /** Path under the site root, as generated. */
  file: string
  /** Filename offered to the browser on download. */
  saveAs: string
  /** What it is. */
  note: string
  /** How to feed it to a tool. The size itself is measured, not typed. */
  advice?: string
  /**
   * An in-app page to view it on, instead of opening the raw file. For files
   * that are not plain ASCII: opened raw, a browser can decode them wrongly.
   */
  view?: string
}

export const artifacts: Artifact[] = [
  {
    file: 'llms-full.txt',
    saveAs: 'inspera-design-system.md',
    note: 'The full AI spec: foundations, and every component with its HTML and CSS.',
    advice: 'upload as a context file, too large to paste',
  },
  {
    file: `${designGuideServed}/DESIGN.md`,
    saveAs: 'DESIGN.md',
    note: 'The design guide: user roles, existing versus new UI, information hierarchy, layout and UI text. Its reference files are in the AI spec zip.',
    view: '#/spec',
  },
  {
    file: 'llms.txt',
    saveAs: 'inspera-design-system-index.md',
    note: "Short index with a link to each component's spec.",
    advice: 'paste this into a one-off chat',
  },
  {
    file: 'foundations.md',
    saveAs: 'inspera-foundations.md',
    note: 'Colour, typography, spacing, radius and depth only.',
  },
  {
    file: 'guidance.md',
    saveAs: 'inspera-guidance.md',
    note: 'Composition patterns, form and table rules, and a final checklist.',
  },
  { file: 'api.json', saveAs: 'inspera-api.json', note: 'Every prop, generated from the TypeScript types.' },
  { file: 'tokens.css', saveAs: 'inspera-tokens.css', note: 'Tokens as CSS custom properties, plus the icon and animation rules.' },
  { file: 'inspera.theme.css', saveAs: 'inspera.theme.css', note: 'Tailwind v4 @theme block.' },
  { file: 'tokens.w3c.json', saveAs: 'inspera-tokens.w3c.json', note: 'W3C Design Tokens format.' },
  { file: 'aliases.json', saveAs: 'inspera-aliases.json', note: 'Old component names mapped to the current ones.' },
]

/** The one file to hand someone who asks for "the spec". */
export const fullSpec = artifacts[0]

/**
 * The same spec, cut into parts.
 *
 * The full guide is fine uploaded as a project file and far too big for a tool
 * that only takes what fits in a message. So it also ships as a core that every
 * component depends on - rules, setup, foundations - plus small groups of
 * components. A designer gives their AI the core and the groups they use.
 *
 * The groups follow the site's categories, split where one category alone
 * would still be too big: input controls is a third of the whole guide. Every
 * component belongs to exactly one part, and `pnpm generate` fails on one that
 * is missing, listed twice or misspelled, or on a part that outgrows its
 * budget. The parts are built from the same source as the full guide, never
 * cut out of it, so the two cannot disagree.
 */
export interface SpecPart {
  /** Path under the site root: spec/inspera-<NN>-<id>.md, numbered by position. */
  file: string
  title: string
  /** One line on what the part is for. */
  summary: string
  /** Component slugs, in reading order. Empty only for the core, which comes first. */
  components: string[]
}

const SPEC_PARTS: (Omit<SpecPart, 'file'> & { id: string })[] = [
  {
    id: 'core',
    title: 'Core',
    summary:
      'Rules, setup (fonts, icon class, tokens), foundations, composition patterns and the done checklist. Every other part builds on it.',
    components: [],
  },
  {
    id: 'input-controls-basic',
    title: 'Input controls - basic',
    summary: 'Buttons and everyday form fields',
    components: [
      'button', 'text-input', 'checkbox', 'radio-button', 'select', 'toggle', 'textarea',
      'form-field', 'radio-group', 'checkbox-group',
    ],
  },
  {
    id: 'input-controls-advanced',
    title: 'Input controls - advanced',
    summary: 'Pickers and specialised inputs',
    components: [
      'slider', 'segmented-control', 'date-picker', 'file-upload', 'rating', 'otp-input',
      'number-input', 'combobox', 'date-range-picker',
    ],
  },
  {
    id: 'data-display-tables',
    title: 'Data display - tables and lists',
    summary: 'Rows of data',
    components: ['table', 'data-grid', 'list'],
  },
  {
    id: 'data-display-content',
    title: 'Data display - content',
    summary: 'Cards, labels, people and figures',
    components: ['card', 'badge', 'avatar', 'accordion', 'tag', 'divider', 'empty-state', 'avatar-group', 'stat'],
  },
  {
    id: 'feedback',
    title: 'Feedback',
    summary: 'Messages, overlays and loading states',
    components: [
      'alert', 'dialog', 'snackbar', 'toast', 'command-palette', 'tooltip', 'progress', 'spinner',
      'skeleton', 'popover', 'drawer',
    ],
  },
  {
    id: 'navigation',
    title: 'Navigation',
    summary: 'Moving between pages, steps and sections',
    components: ['tabs', 'breadcrumb', 'pagination', 'menu', 'stepper', 'link'],
  },
]

export const specParts: SpecPart[] = SPEC_PARTS.map(({ id, ...part }, i) => ({
  ...part,
  file: `spec/inspera-${String(i + 1).padStart(2, '0')}-${id}.md`,
}))

/**
 * Travels first in the zip: which files to give an AI and what each holds, for
 * whoever opens the folder without having seen the AI spec page.
 */
export const specGuide = 'spec/inspera-00-start-here.md'

/**
 * The zip's folder, versioned, so a copy found in Downloads a month later
 * still says which release it came from.
 */
export const specFolder = `inspera-design-system-${artifactVersion}`

/** The name a path is saved under: its last segment. */
export const fileName = (path: string): string => path.slice(path.lastIndexOf('/') + 1)

/** Travels first in the AI spec zip: what each file is for, the read order, and the known differences. */
export const aiSpecGuide = 'inspera-00-start-here.md'

/** One file in a zip: where it is served, and where it goes in the zip's folder. */
export interface BundleFile {
  /** Path under the site root. */
  from: string
  /** Path inside the zip's folder. */
  to: string
  /**
   * How a generated file begins. A host that serves index.html for a missing
   * path still answers 200, so this is how a missing file is told apart from
   * a web page. Files that arrive from elsewhere (the design guide) have no
   * fixed opening; for those, anything but HTML passes.
   */
  startsWith?: string
}

export interface Bundle {
  /** The folder the zip unpacks to, versioned. */
  folder: string
  zipName: string
  files: BundleFile[]
}

/**
 * The design guide in the layout DESIGN.md depends on: DESIGN.md at the top,
 * its references in references/. Every bundle that carries it keeps that
 * layout, or the references DESIGN.md cites go missing.
 */
const designGuideBundleFiles: BundleFile[] = designGuideFiles.map((f) => ({
  from: `${designGuideServed}/${f.path}`,
  to: f.path,
}))

const generated = '<!-- Inspera Design System'

/**
 * The AI spec as one download: the design guide and the full guide, side by
 * side. DESIGN.md calls the full guide `inspera-design-system.md`, so it must
 * travel under exactly that name.
 */
const aiSpecFolder = `inspera-ai-spec-${artifactVersion}`
export const aiSpecBundle: Bundle = {
  folder: aiSpecFolder,
  zipName: `${aiSpecFolder}.zip`,
  files: [
    { from: aiSpecGuide, to: aiSpecGuide, startsWith: generated },
    ...designGuideBundleFiles,
    { from: fullSpec.file, to: fullSpec.saveAs, startsWith: '# Inspera Design System' },
  ],
}

/** The same, with the full guide in parts, for tools that cannot take it whole. */
export const specPartsBundle: Bundle = {
  folder: specFolder,
  zipName: `${specFolder}-parts.zip`,
  files: [
    { from: specGuide, to: fileName(specGuide), startsWith: generated },
    ...designGuideBundleFiles,
    ...specParts.map((p) => ({ from: p.file, to: fileName(p.file), startsWith: generated })),
  ],
}

/**
 * "~72k tokens, upload as a context file" - the measured size plus the advice.
 * Both pages that show a size use this, so they cannot describe the same file
 * two different ways.
 */
export function artifactSize(file: string, advice?: string): string {
  const m = artifactSizes[file]
  if (!m) return advice ?? ''
  const tokens = m.tokens >= 1000 ? `~${Math.round(m.tokens / 1000)}k tokens` : `~${m.tokens} tokens`
  return advice ? `${tokens}, ${advice}` : tokens
}

/**
 * A file in public/ as a link that works wherever the site is hosted. Links
 * were written as `/llms.txt`, which breaks as soon as the site is served
 * from a sub-path (Vite's `base`, set from FIGMA_PUBLIC_URL).
 */
export function publicPath(file: string): string {
  const base = (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? '/'
  return `${base.endsWith('/') ? base : `${base}/`}${file.replace(/^\/+/, '')}`
}

/** The same file as an absolute URL, for pasting into another tool. */
export function publicUrl(file: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return `${origin}${publicPath(file)}`
}
