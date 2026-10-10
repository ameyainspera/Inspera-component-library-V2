import { type CSSProperties, type ReactNode, useEffect, useState } from 'react'
import { Select } from '../components/inspera'
import { componentList } from '../data/components'
import { artifactSizes } from '../data/artifact-sizes.generated'
import {
  type Bundle, aiSpecBundle, aiSpecGuide, artifactSize, fileName, fullSpec, publicPath, specParts, specPartsBundle,
} from '../data/distribution'
import { designGuideFiles, designGuideServed } from '../data/design-md'
import { Panel, SectionTitle, CodeBlock } from './primitives'
import { downloadBundle } from './zip'

/**
 * The AI spec, shown inside the library rather than as a raw file.
 *
 * The header button used to link straight at /llms-full.txt with
 * target="_blank". That opens a fresh tab whose history is empty, so the
 * browser's Back button is greyed out, and a text/plain response cannot carry
 * a link of its own. Keeping it in-app fixes that by construction: the sidebar
 * and the top bar never go away. It also gives the files somewhere to explain
 * themselves - what they are for, which tools to feed them to, and how big
 * they are before someone pastes 97k tokens into a chat window.
 *
 * The spec is two documents: DESIGN.md, the design system team's guide to
 * designing a screen, and the full guide to building each component. They
 * download together, because DESIGN.md refers to the full guide and to its own
 * reference files by name. The design guide is not plain ASCII, so it is
 * viewed here, decoded as UTF-8, rather than opened raw.
 */

const primaryAction: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6, height: 40, padding: '0 16px',
  borderRadius: 'var(--radius-sm)', border: '1px solid transparent',
  background: 'var(--primary)', color: 'var(--white)', textDecoration: 'none',
  fontFamily: 'inherit', fontSize: 16, fontWeight: 600, cursor: 'pointer',
}

const secondaryAction: CSSProperties = {
  ...primaryAction,
  border: '1px solid var(--border-strong)',
  background: 'var(--surface)', color: 'var(--gray-800)',
}

const smallLink: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 500,
  color: 'var(--primary)', textDecoration: 'none',
}

const noteText: CSSProperties = { margin: 0, fontSize: 13, color: 'var(--muted-foreground)', lineHeight: 1.6 }

const nameOf = new Map(componentList.map((c) => [c.slug, c.name]))

const tokensOf = (files: string[]) => files.reduce((sum, f) => sum + (artifactSizes[f]?.tokens ?? 0), 0)
const kTokens = (tokens: number) => `~${Math.round(tokens / 1000)}k tokens`

const designGuidePaths = designGuideFiles.map((f) => `${designGuideServed}/${f.path}`)
const [designMdPath, ...referencePaths] = designGuidePaths

/** Fetches every file in a bundle and saves them as one zip, assembled in the browser (zip.ts says why). */
function ZipButton({ bundle, label, primary = false }: { bundle: Bundle; label: string; primary?: boolean }) {
  const [state, setState] = useState<'idle' | 'busy' | 'failed'>('idle')

  async function run() {
    setState('busy')
    try {
      await downloadBundle(bundle)
      setState('idle')
    } catch {
      setState('failed')
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <button
        type="button"
        onClick={run}
        disabled={state === 'busy'}
        style={{
          ...(primary ? primaryAction : secondaryAction),
          opacity: state === 'busy' ? 0.7 : 1,
          cursor: state === 'busy' ? 'progress' : 'pointer',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>folder_zip</span>
        {state === 'busy' ? 'Preparing zip...' : label}
      </button>
      <span role="status" style={{ fontSize: 13, color: state === 'failed' ? 'var(--error)' : 'var(--muted-foreground)' }}>
        {state === 'failed'
          ? 'Could not fetch the files. Run pnpm generate, then reload.'
          : `${bundle.zipName}, ${bundle.files.length} files, ${kTokens(tokensOf(bundle.files.map((f) => f.from)))}`}
      </span>
    </div>
  )
}

/** One of the two documents: what it is, its size, and a download of it on its own. */
function DocumentCard({ name, from, role, children, size }: { name: string; from: string; role: string; children: ReactNode; size: string }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--primary)' }}>{role}</div>
      <code style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 600, color: 'var(--gray-900)' }}>{name}</code>
      <p style={{ margin: 0, fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.5 }}>{children}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', marginTop: 'auto', paddingTop: 6 }}>
        <span style={{ fontSize: 12, color: 'var(--gray-700)' }}>{size}</span>
        <a href={publicPath(from)} download={name} style={smallLink} aria-label={`Download ${name} on its own`}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }} aria-hidden>download</span>
          {name} only
        </a>
      </div>
    </div>
  )
}

/** The spec cut into parts, with the design guide, for tools that cannot take the full guide whole. */
function SpecParts() {
  return (
    <Panel>
      <SectionTitle sub={`The same spec as ${specParts.length} smaller files, with DESIGN.md, for AI tools that can't take it in one piece.`}>
        Download in parts
      </SectionTitle>
      <p style={noteText}>
        Always give your AI tool DESIGN.md and the core, then the part for each component you use. The core says
        which part holds each component and tells the AI to ask for a missing part instead of guessing.
      </p>
      <div style={{ margin: '16px 0 12px' }}>
        <ZipButton bundle={specPartsBundle} label="Download all as .zip" />
      </div>
      {/* role="list" because Safari drops list semantics from a list with no markers. */}
      <ol role="list" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {specParts.map((part, i) => (
          <li
            key={part.file}
            style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderTop: '1px solid var(--border)' }}
          >
            <span
              aria-hidden
              style={{ width: 24, flexShrink: 0, paddingTop: 1, fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)' }}>{part.title}</span>
                <span style={{ fontSize: 12, color: 'var(--gray-700)' }}>{artifactSize(part.file)}</span>
              </div>
              <div style={{ marginTop: 2, fontSize: 13, color: 'var(--muted-foreground)', lineHeight: 1.5 }}>
                {part.components.length ? part.components.map((slug) => nameOf.get(slug) ?? slug).join(', ') : part.summary}
              </div>
            </div>
            <a
              href={publicPath(part.file)}
              download={fileName(part.file)}
              title={`Download ${fileName(part.file)}`}
              aria-label={`Download part ${i + 1}, ${part.title}`}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 32, height: 32, flexShrink: 0, borderRadius: 'var(--radius-sm)',
                color: 'var(--gray-700)', textDecoration: 'none',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>download</span>
            </a>
          </li>
        ))}
      </ol>
    </Panel>
  )
}

/** Every file in the AI spec zip, in the order an AI should read them. */
const VIEWABLE = [
  ...designGuideFiles.map((f) => ({ value: `${designGuideServed}/${f.path}`, label: f.path })),
  { value: fullSpec.file, label: fullSpec.saveAs },
  { value: aiSpecGuide, label: aiSpecGuide },
]

/**
 * Shows any file in the download. Fetched rather than bundled: 390KB has no
 * business in the app bundle, and this way the page shows exactly what the
 * download contains.
 */
function Contents() {
  const [file, setFile] = useState(VIEWABLE[0].value)
  // undefined: loading; null: could not be fetched.
  const [texts, setTexts] = useState<Record<string, string | null>>({})

  // Keyed on the file alone: a file already fetched stays in `texts` for next time.
  useEffect(() => {
    if (file in texts) return
    let live = true
    fetch(publicPath(file))
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then((t) => live && setTexts((m) => ({ ...m, [file]: t })))
      .catch(() => live && setTexts((m) => ({ ...m, [file]: null })))
    return () => {
      live = false
    }
  }, [file])

  const text = texts[file]

  return (
    <Panel>
      <SectionTitle sub="Exactly what the download contains.">Contents</SectionTitle>
      <div style={{ marginBottom: 12 }}>
        <Select label="File" options={VIEWABLE} value={file} onChange={setFile} widthMode="Hug" />
      </div>
      {text === null ? (
        <p style={{ margin: 0, fontSize: 14, color: 'var(--error)' }}>
          Could not load /{file}. Run <code>pnpm generate</code>, then reload.
        </p>
      ) : text === undefined ? (
        <p style={{ margin: 0, fontSize: 14, color: 'var(--muted-foreground)' }}>Loading...</p>
      ) : (
        <CodeBlock code={text} language="markdown" copyLabel="Copy all" maxHeight={560} />
      )}
    </Panel>
  )
}

export default function SpecPage() {
  const referenceTokens = tokensOf(referencePaths)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', maxWidth: 960 }}>
      <header>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--primary)' }}>
          For AI tools
        </div>
        <h1 style={{ margin: '6px 0 8px', fontSize: 32, fontWeight: 600, letterSpacing: -0.5 }}>AI spec</h1>
        <p style={{ margin: 0, fontSize: 16, color: 'var(--muted-foreground)', maxWidth: 680, lineHeight: 1.5 }}>
          Two documents that work together, for any AI tool that builds Inspera UI. DESIGN.md says how to design
          an Inspera screen; the full guide says how to build each of the {componentList.length} components.
        </p>
      </header>

      <Panel>
        <SectionTitle>Download</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, marginBottom: 20 }}>
          <DocumentCard
            role="Design guide - read first"
            name="DESIGN.md"
            from={designMdPath}
            size={`${artifactSize(designMdPath)}, with ${referencePaths.length} reference files (${kTokens(referenceTokens)})`}
          >
            From the design system team. Who the screen is for, existing versus new UI, information hierarchy,
            layout and UI text.
          </DocumentCard>
          <DocumentCard role="Full guide" name={fullSpec.saveAs} from={fullSpec.file} size={artifactSize(fullSpec.file)}>
            Setup, tokens, and every component's props, HTML and CSS.
          </DocumentCard>
        </div>
        <ZipButton bundle={aiSpecBundle} label="Download AI spec (.zip)" primary />
        <p style={{ ...noteText, marginTop: 12 }}>
          Upload every file as project files (Claude Projects, a custom GPT, Cursor docs), and keep the folder as it
          is: DESIGN.md refers to its reference files and to the full guide by name. If your tool can't take large
          files, use the parts below.
        </p>
      </Panel>

      <SpecParts />

      <Contents />
    </div>
  )
}
