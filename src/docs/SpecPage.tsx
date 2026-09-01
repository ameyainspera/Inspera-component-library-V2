import { useEffect, useState } from 'react'
import { componentList } from '../data/components'
import { artifacts, artifactSize, fullSpec } from '../data/distribution'
import { Panel, SectionTitle, CodeBlock } from './primitives'

/**
 * The AI spec, shown inside the library rather than as a raw file.
 *
 * The header button used to link straight at /llms-full.txt with
 * target="_blank". That opens a fresh tab whose history is empty, so the
 * browser's Back button is greyed out, and a text/plain response cannot carry
 * a link of its own - there is no way to put one there. The result was seven
 * thousand lines of raw text and no route back to the library except closing
 * the tab.
 *
 * Keeping it in-app fixes that by construction: the sidebar and the top bar
 * never go away. It also gives the file somewhere to explain itself, which a
 * raw dump cannot do - what it is for, which tools to feed it to, and how big
 * it is before someone pastes 71k tokens into a chat window.
 */
export default function SpecPage() {
  const [text, setText] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    // Fetched rather than bundled: 281KB has no business in the app bundle,
    // and this way the page always shows exactly what the download contains.
    fetch(`/${fullSpec.file}`)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then(setText)
      .catch(() => setFailed(true))
  }, [])

  const meta = artifacts.find((a) => a.file === fullSpec.file)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', maxWidth: 960 }}>
      <header>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--primary)' }}>
          For AI tools
        </div>
        <h1 style={{ margin: '6px 0 8px', fontSize: 32, fontWeight: 600, letterSpacing: -0.5 }}>AI spec</h1>
        <p style={{ margin: 0, fontSize: 16, color: 'var(--muted-foreground)', maxWidth: 640, lineHeight: 1.5 }}>
          One file describing the whole system: the rules, the setup, the foundations, and all{' '}
          {componentList.length} components with their prop APIs and their exact HTML and CSS.
          Download it and add it to your project's context.
        </p>
      </header>

      <Panel>
        <SectionTitle sub="Pick the form that matches how your tool takes context.">Use it</SectionTitle>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
          <a
            href={`/${fullSpec.file}`}
            download={fullSpec.saveAs}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, height: 40, padding: '0 16px',
              borderRadius: 'var(--radius-sm)', border: '1px solid transparent',
              background: 'var(--primary)', color: 'var(--white)', textDecoration: 'none',
              fontSize: 16, fontWeight: 600,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>download</span>
            Download {fullSpec.saveAs}
          </a>
          <a
            href={`/${fullSpec.file}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, height: 40, padding: '0 16px',
              borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)',
              background: 'var(--surface)', color: 'var(--gray-800)', textDecoration: 'none',
              fontSize: 16, fontWeight: 600,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>open_in_new</span>
            Open raw
          </a>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
          {artifactSize(fullSpec.file, meta?.advice)}. Upload it once as a project or context file - Claude Projects,
          a custom GPT, Cursor's docs - rather than pasting it into a message. For a tool that
          re-sends its context every turn, use{' '}
          <a href="/llms.txt" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>llms.txt</a>{' '}
          instead, which links a spec per component.
        </p>
      </Panel>

      <Panel>
        <SectionTitle sub="Exactly what the download contains.">Contents</SectionTitle>
        {failed ? (
          <p style={{ margin: 0, fontSize: 14, color: 'var(--error)' }}>
            Could not load /{fullSpec.file}. Run <code>pnpm generate</code>, then reload.
          </p>
        ) : text === null ? (
          <p style={{ margin: 0, fontSize: 14, color: 'var(--muted-foreground)' }}>Loading...</p>
        ) : (
          <CodeBlock code={text} language="markdown" copyLabel="Copy all" maxHeight={560} />
        )}
      </Panel>
    </div>
  )
}
