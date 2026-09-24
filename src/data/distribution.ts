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
    'The package builds from this repo, but the @inspera scope is unclaimed, so ' +
    '`npm i @inspera/components` currently fails with a 404.',
  insteadUse:
    'Use the portable spec below - llms.txt and the per-component files. Once a ' +
    'registry is chosen the package becomes the strictest option, but it will need ' +
    'authentication, which most AI builders cannot do.',
}

/** The install line, only when it would actually work. */
export const installCommand = (p: PackageStatus): string | null =>
  p.published ? `npm i ${p.name}` : null

import { artifactSizes } from './artifact-sizes.generated'

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
}

export const artifacts: Artifact[] = [
  {
    file: 'llms-full.txt',
    saveAs: 'inspera-design-system.md',
    note: 'The complete guide - foundations, and every component with its HTML and CSS.',
    advice: 'upload as a context file, too large to paste',
  },
  {
    file: 'llms.txt',
    saveAs: 'inspera-design-system-index.md',
    note: 'Short index linking a spec per component.',
    advice: 'paste this into a one-off chat',
  },
  {
    file: 'foundations.md',
    saveAs: 'inspera-foundations.md',
    note: 'Colour, typography, spacing, radius, depth on their own.',
  },
  {
    file: 'guidance.md',
    saveAs: 'inspera-guidance.md',
    note: 'Composition patterns, form/table rules, the done checklist.',
  },
  { file: 'api.json', saveAs: 'inspera-api.json', note: 'Prop API, derived from the TypeScript types.' },
  { file: 'tokens.css', saveAs: 'inspera-tokens.css', note: 'Token custom properties + icon/keyframe runtime.' },
  { file: 'inspera.theme.css', saveAs: 'inspera.theme.css', note: 'Tailwind v4 @theme block.' },
  { file: 'tokens.w3c.json', saveAs: 'inspera-tokens.w3c.json', note: 'W3C Design Tokens format.' },
  { file: 'aliases.json', saveAs: 'inspera-aliases.json', note: 'Deprecated name -> canonical component.' },
]

/** The one file to hand someone who asks for "the spec". */
export const fullSpec = artifacts[0]

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
