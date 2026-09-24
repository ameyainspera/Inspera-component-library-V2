import { type ReactNode } from 'react'
import { examplePages, examplePageBySlug, type ExamplePage } from './pages/registry'
import { followLink } from './links'

interface PagesPageProps {
  /** When set, render that page full-bleed; otherwise show the gallery. */
  slug?: string
  onNavigate: (hash: string) => void
}

const chip = (label: string): ReactNode => (
  <span
    key={label}
    style={{
      fontSize: 11,
      fontWeight: 500,
      color: 'var(--gray-700)',
      background: 'var(--gray-100)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-pill)',
      padding: '2px 8px',
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </span>
)

/** Says so plainly when a page is a reference screen, not library-built. */
const usesLabel = (page: ExamplePage) =>
  page.uses.length === 0
    ? 'Reference screen - no library components yet'
    : `${page.uses.length} library component${page.uses.length === 1 ? '' : 's'}`

/** Full-bleed page view: a thin toolbar naming the page, then the page itself. */
function PageView({ slug, onNavigate }: { slug: string; onNavigate: (hash: string) => void }) {
  const page = examplePageBySlug(slug)

  if (!page || !page.component) {
    return (
      <div style={{ padding: 40, fontFamily: 'var(--font-sans)', color: 'var(--muted-foreground)' }}>
        <p style={{ marginBottom: 16 }}>That page does not exist yet.</p>
        <a href="#/pages" onClick={followLink(onNavigate, '#/pages')} style={{ color: 'var(--primary)', fontSize: 14 }}>
          Back to example pages
        </a>
      </div>
    )
  }

  const Page = page.component

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexShrink: 0,
          padding: '12px 24px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <a
            href="#/pages"
            onClick={followLink(onNavigate, '#/pages')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4, height: 30, padding: '0 10px',
              border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)',
              background: 'var(--surface)', color: 'var(--gray-800)', textDecoration: 'none',
              fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>arrow_back</span>
            Pages
          </a>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)' }}>{page.name}</span>
            <span
              style={{
                fontSize: 12, color: 'var(--muted-foreground)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}
            >
              {page.description}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted-foreground)' }}>
            {usesLabel(page)}
          </span>
          <DownloadButton page={page} />
        </div>
      </div>
      {/* The page canvas scrolls on its own so its own header can stay put. */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', background: 'var(--background)' }}>
        <Page />
      </div>
    </div>
  )
}

/** Small "Download bundle" button - copies the whole page + tokens as a file. */
function DownloadButton({ page }: { page: ExamplePage }) {
  return (
    <button
      type="button"
      title="Download this page's code + design tokens as a single file for any AI assistant"
      // The bundle builder carries the raw sources, so it loads on first use.
      onClick={() => void import('./pages/download').then((m) => m.downloadPageBundle(page))}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--gray-100)'
        e.currentTarget.style.borderColor = 'var(--border-strong)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--surface)'
        e.currentTarget.style.borderColor = 'var(--border)'
      }}
      style={{
        // Above the card's stretched link, so it stays its own control.
        position: 'relative', zIndex: 1,
        display: 'inline-flex', alignItems: 'center', gap: 5,
        height: 30, padding: '0 12px',
        border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)',
        background: 'var(--surface)', color: 'var(--gray-700)', cursor: 'pointer',
        fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500,
        transition: 'background 120ms ease, border-color 120ms ease',
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 17 }} aria-hidden>download</span>
      Download
    </button>
  )
}

/**
 * One example-page tile. The title is the link and stretches over the whole
 * card (index.css), so the card is still one big target - but the Download
 * button is a sibling, not a control nested inside another control. Enter on
 * Download used to open the page as well.
 */
function GalleryCard({ page, onNavigate }: { page: ExamplePage; onNavigate: (hash: string) => void }) {
  const ready = page.status === 'ready'
  const hash = `#/pages/${page.slug}`
  return (
    <article
      className={ready ? 'docs-page-card' : undefined}
      style={{
        position: 'relative',
        display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 14,
        textAlign: 'left', padding: 20,
        border: ready ? '1px solid var(--border)' : '1px dashed var(--border-strong)', borderRadius: 'var(--radius-lg)',
        background: 'var(--surface)',
        boxShadow: ready ? 'var(--shadow-100)' : 'none',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <span
          style={{
            width: 44, height: 44, borderRadius: 'var(--radius-md)',
            background: ready ? 'var(--blue-100)' : 'var(--gray-200)', color: ready ? 'var(--primary)' : 'var(--gray-700)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 24 }} aria-hidden>{page.icon}</span>
        </span>
        {ready ? (
          <DownloadButton page={page} />
        ) : (
          // Dimming the whole card took this label to about 2:1 contrast.
          <span
            style={{
              fontSize: 11, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase',
              color: 'var(--gray-800)', background: 'var(--gray-200)',
              borderRadius: 'var(--radius-pill)', padding: '2px 8px',
            }}
          >
            Coming soon
          </span>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: 'var(--text-primary)' }}>
          {ready ? (
            <a href={hash} onClick={followLink(onNavigate, hash)} className="docs-page-card-link" style={{ color: 'inherit', textDecoration: 'none' }}>
              {page.name}
            </a>
          ) : page.name}
        </h2>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.45, color: 'var(--muted-foreground)' }}>{page.description}</p>
      </div>
      {page.uses.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {page.uses.slice(0, 6).map(chip)}
          {page.uses.length > 6 && chip(`+${page.uses.length - 6}`)}
        </div>
      ) : (
        <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{usesLabel(page)}</span>
      )}
    </article>
  )
}

/** Gallery: one card per example page. */
function Gallery({ onNavigate }: { onNavigate: (hash: string) => void }) {
  return (
    <div style={{ width: '100%', maxWidth: 1080, fontFamily: 'var(--font-sans)' }}>
      <header style={{ marginBottom: 28 }}>
        <h1 style={{ margin: '0 0 8px', fontSize: 28, fontWeight: 600, color: 'var(--text-primary)' }}>Example pages</h1>
        <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, color: 'var(--muted-foreground)', maxWidth: 640 }}>
          Full Inspera screens assembled from library components. Start a design change or a new
          feature from a real page instead of a blank canvas. Copy one, swap the data, and the
          tokens and components keep it on system.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {examplePages.map((page) => (
          <GalleryCard key={page.slug} page={page} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  )
}

export default function PagesPage({ slug, onNavigate }: PagesPageProps) {
  return slug ? <PageView slug={slug} onNavigate={onNavigate} /> : <Gallery onNavigate={onNavigate} />
}
