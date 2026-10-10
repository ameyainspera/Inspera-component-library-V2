import { Suspense, lazy, useEffect, useState } from 'react'
import { componentList } from './data/components'
import { aiSpecBundle, fullSpec, publicPath } from './data/distribution'
import Sidebar from './docs/Sidebar'
import { downloadBundle } from './docs/zip'
import FoundationsPage from './docs/FoundationsPage'
import ComponentPage from './docs/ComponentPage'
import IconsPage from './docs/IconsPage'
import IntegratePage from './docs/IntegratePage'
import SpecPage from './docs/SpecPage'
import { followLink } from './docs/links'

// The screen templates are full screens of their own; load them when visited.
const PagesPage = lazy(() => import('./docs/PagesPage'))

// Lightweight hash routing keeps the docs shareable (deep links to a component)
// without pulling in a router dependency.
function useHash() {
  const [hash, setHash] = useState(() => window.location.hash || '#/foundations')
  useEffect(() => {
    const onChange = () => setHash(window.location.hash || '#/foundations')
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash
}

export default function App() {
  const hash = useHash()
  const navigate = (h: string) => {
    window.location.hash = h
    document.getElementById('docs-scroll')?.scrollTo({ top: 0 })
  }

  // The AI spec is DESIGN.md and the full guide together; one without the
  // other leaves DESIGN.md's references dangling. If the files cannot be
  // fetched, the AI spec page is where that is explained.
  const [zipping, setZipping] = useState(false)
  async function downloadSpec() {
    setZipping(true)
    try {
      await downloadBundle(aiSpecBundle)
    } catch {
      navigate('#/spec')
    } finally {
      setZipping(false)
    }
  }

  const componentMatch = hash.match(/^#\/component\/(.+)$/)
  // #/foundations and #/foundations/<section>; the bare route shows colours.
  const foundationsMatch = hash.match(/^#\/foundations(?:\/(.+))?$/)
  const isIcons = hash === '#/icons'
  const isIntegrate = hash === '#/integrate'
  const isSpec = hash === '#/spec'
  // #/pages (gallery) and #/pages/<slug> (a single full-bleed page).
  const pagesMatch = hash.match(/^#\/pages(?:\/(.+))?$/)
  const isPageView = Boolean(pagesMatch?.[1])
  // A single page renders full-bleed, like Icons; the gallery keeps the padding.
  const fullBleed = isIcons || isPageView

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--background)' }}>
      {/* Top bar */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 60,
          flexShrink: 0,
          padding: '0 24px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
        }}
      >
        <a
          href="#/foundations"
          onClick={followLink(navigate, '#/foundations')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
        >
          {/* The Inspera mark - the same file the site uses as its favicon.
              Decorative: the name beside it is the link's accessible text. */}
          <img
            src={`${import.meta.env.BASE_URL}favicon.png`}
            alt=""
            width={36}
            height={36}
            style={{ display: 'block', flexShrink: 0 }}
          />
          <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1, textAlign: 'left' }}>
            <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--gray-900)' }}>Inspera</span>
            <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>Component Library</span>
          </span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* The complete document, not the index. llms.txt lists component
              names and links a file per component - useful to an agent that
              fetches, but it reads as a bare list of names to a person who
              clicks it expecting the spec. */}
          {/* View and download are different intents, so they stay separate
              buttons. Opening it in a tab is how you check something; the
              download is how you get it into another tool's context, and a
              single control cannot do both without one of them being a
              surprise. Joined into one group so they still read as a pair. */}
          <div style={{ display: 'inline-flex' }}>
            <a
              href="#/spec"
              onClick={followLink(navigate, '#/spec')}
              aria-current={isSpec ? 'page' : undefined}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 12px',
                borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)',
                border: '1px solid var(--border-strong)', borderRight: 'none',
                background: isSpec ? 'var(--blue-100)' : 'var(--surface)',
                color: 'var(--gray-800)', fontFamily: 'var(--font-sans)',
                fontSize: 13, fontWeight: 500, textDecoration: 'none',
              }}
              title={`The AI spec: DESIGN.md and the full guide to all ${componentList.length} components`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>description</span>
              AI spec
            </a>
            <button
              type="button"
              onClick={downloadSpec}
              disabled={zipping}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 32, height: 32, padding: 0,
                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                border: '1px solid var(--border-strong)',
                background: 'var(--surface)', color: 'var(--gray-800)',
                cursor: zipping ? 'progress' : 'pointer',
              }}
              title={`Download the AI spec - DESIGN.md and ${fullSpec.saveAs} - as ${aiSpecBundle.zipName}`}
              aria-label={`Download the AI spec as ${aiSpecBundle.zipName}`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>download</span>
            </button>
          </div>
          <a
            href={publicPath('llms.txt')}
            target="_blank"
            rel="noreferrer"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted-foreground)', textDecoration: 'none' }}
            title="A short index with a link to each component's spec"
          >
            llms.txt
          </a>
          <a
            href={publicPath('tokens.w3c.json')}
            target="_blank"
            rel="noreferrer"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted-foreground)', textDecoration: 'none' }}
            title="W3C Design Tokens JSON"
          >
            tokens.json
          </a>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted-foreground)' }}>
            v4 | AI-ready
          </span>
        </div>
      </header>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar route={hash} onNavigate={navigate} />
        {/* Focusable, so the keyboard can scroll pages that hold no controls
            (Typography, Breakpoints). */}
        <main
          id="docs-scroll"
          tabIndex={0}
          style={{
            flex: 1, minWidth: 0,
            overflowY: fullBleed ? 'hidden' : 'auto',
            padding: fullBleed ? 0 : '32px 40px',
            display: 'flex', flexDirection: 'column',
            alignItems: fullBleed ? 'stretch' : 'center',
          }}
        >
          {isSpec
            ? <SpecPage />
            : isIntegrate
            ? <IntegratePage />
            : isIcons
              ? <IconsPage />
              : pagesMatch
                ? <Suspense fallback={null}><PagesPage slug={pagesMatch[1]} onNavigate={navigate} /></Suspense>
                : componentMatch
                  ? <ComponentPage key={componentMatch[1]} slug={componentMatch[1]} />
                  : <FoundationsPage section={foundationsMatch?.[1] ?? 'colors'} />}
        </main>
      </div>
    </div>
  )
}
