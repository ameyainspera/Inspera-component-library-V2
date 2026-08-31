import { useEffect, useState } from 'react'
import { componentList } from './data/components'
import Sidebar from './docs/Sidebar'
import FoundationsPage from './docs/FoundationsPage'
import ComponentPage from './docs/ComponentPage'
import IconsPage from './docs/IconsPage'
import IntegratePage from './docs/IntegratePage'

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

  const componentMatch = hash.match(/^#\/component\/(.+)$/)
  // #/foundations and #/foundations/<section>; the bare route shows colours.
  const foundationsMatch = hash.match(/^#\/foundations(?:\/(.+))?$/)
  const isIcons = hash === '#/icons'
  const isIntegrate = hash === '#/integrate'

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
        <button
          type="button"
          onClick={() => navigate('#/foundations')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <span
            style={{
              width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'var(--primary)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              fontWeight: 700, fontSize: 16, letterSpacing: -0.5,
            }}
          >
            I
          </span>
          <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1, textAlign: 'left' }}>
            <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--gray-900)' }}>Inspera</span>
            <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>Component Library</span>
          </span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* The complete document, not the index. llms.txt lists component
              names and links a file per component — useful to an agent that
              fetches, but it reads as a bare list of names to a person who
              clicks it expecting the spec. */}
          <a
            href="/llms-full.txt"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 12px',
              borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)',
              background: 'var(--surface)', color: 'var(--gray-800)', textDecoration: 'none',
              fontSize: 13, fontWeight: 500,
            }}
            title={`Complete AI build guide — foundations + all ${componentList.length} components`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>description</span>
            AI spec
          </a>
          <a
            href="/llms.txt"
            target="_blank"
            rel="noreferrer"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted-foreground)', textDecoration: 'none' }}
            title="Short index that links a spec per component — paste this into a chat"
          >
            llms.txt
          </a>
          <a
            href="/tokens.w3c.json"
            target="_blank"
            rel="noreferrer"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted-foreground)', textDecoration: 'none' }}
            title="W3C Design Tokens JSON"
          >
            tokens.json
          </a>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted-foreground)' }}>
            v4 · AI-ready
          </span>
        </div>
      </header>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar route={hash} onNavigate={navigate} />
        <main
          id="docs-scroll"
          style={{
            flex: 1, minWidth: 0,
            overflowY: isIcons ? 'hidden' : 'auto',
            padding: isIcons ? 0 : '32px 40px',
            display: 'flex', flexDirection: 'column',
            alignItems: isIcons ? 'stretch' : 'center',
          }}
        >
          {isIntegrate
            ? <IntegratePage />
            : isIcons
              ? <IconsPage />
              : componentMatch
                ? <ComponentPage key={componentMatch[1]} slug={componentMatch[1]} />
                : <FoundationsPage section={foundationsMatch?.[1] ?? 'colors'} />}
        </main>
      </div>
    </div>
  )
}
