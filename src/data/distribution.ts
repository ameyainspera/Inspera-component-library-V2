/**
 * SOURCE OF TRUTH for how the library is distributed, and — importantly —
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
  /** Registry URL once published — npm, GitHub Packages, Artifactory. */
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
    'Use the portable spec below — llms.txt and the per-component files. Once a ' +
    'registry is chosen the package becomes the strictest option, but it will need ' +
    'authentication, which most AI builders cannot do.',
}

/** The install line, only when it would actually work. */
export const installCommand = (p: PackageStatus): string | null =>
  p.published ? `npm i ${p.name}` : null
