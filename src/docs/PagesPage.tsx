import { type ReactNode, type RefObject, Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Button } from '../components/inspera'
import { examplePages, examplePageBySlug, type ExamplePage } from './pages/registry'
import { followLink } from './links'
import { srOnly } from '../components/inspera/types'

// The guide is only needed once someone opens it, so it loads on first use.
const PagesGuide = lazy(() => import('./PagesGuide'))

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
const usesLabel = (page: ExamplePage) => {
  // A ready page with none is a pasted reference screen; a coming-soon page with none has no plan yet.
  if (page.uses.length === 0) return page.status === 'ready' ? 'Reference screen' : 'Components to be decided'
  return `${page.uses.length} library component${page.uses.length === 1 ? '' : 's'}`
}

/** Full-bleed page view: a thin toolbar naming the page, then the page itself. */
function PageView({ slug, onNavigate }: { slug: string; onNavigate: (hash: string) => void }) {
  const canvas = useRef<HTMLDivElement>(null)
  const page = examplePageBySlug(slug)

  if (!page || !page.component) {
    return (
      <div style={{ padding: 40, fontFamily: 'var(--font-sans)', color: 'var(--muted-foreground)' }}>
        <p style={{ marginBottom: 16 }}>That page does not exist yet.</p>
        <a href="#/pages" onClick={followLink(onNavigate, '#/pages')} style={{ color: 'var(--primary)', fontSize: 14 }}>
          Back to Screen templates
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
            Screen templates
          </a>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)' }}>{page.name}</span>
            {page.location && (
            <span
              style={{
                fontSize: 12, color: 'var(--muted-foreground)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}
            >
              {page.location}
            </span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <CopyPngButton target={canvas} name={page.slug} />
          <DownloadButton page={page} />
        </div>
      </div>
      {/* The page canvas scrolls on its own so its own header can stay put. */}
      <div ref={canvas} style={{ flex: 1, minHeight: 0, overflowY: 'auto', background: 'var(--background)' }}>
        <Page />
      </div>
    </div>
  )
}

/** Shared look of the toolbar's pill buttons. */
const pillButton: React.CSSProperties = {
  // Above the card's stretched link, so it stays its own control.
  position: 'relative', zIndex: 1,
  display: 'inline-flex', alignItems: 'center', gap: 5,
  height: 30, padding: '0 12px',
  border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)',
  background: 'var(--surface)', color: 'var(--gray-700)', cursor: 'pointer',
  fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500,
  transition: 'background 120ms ease, border-color 120ms ease',
}

const hoverPill = {
  onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = 'var(--gray-100)'
    e.currentTarget.style.borderColor = 'var(--border-strong)'
  },
  onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = 'var(--surface)'
    e.currentTarget.style.borderColor = 'var(--border)'
  },
}

/**
 * Copies the page, exactly as it looks (full height, not just what is scrolled
 * into view), to the clipboard as a PNG. Falls back to a file download where the
 * browser cannot write images to the clipboard.
 */
function CopyPngButton({ target, name }: { target: RefObject<HTMLElement | null>; name: string }) {
  const [state, setState] = useState<'idle' | 'busy' | 'copied' | 'saved' | 'failed'>('idle')
  const timer = useRef<number>(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const render = async (): Promise<Blob> => {
    const el = target.current
    if (!el) throw new Error('Nothing to capture')
    const { toBlob } = await import('html-to-image')
    // Scrollers inside the page (a wide table) keep their box but lose the
    // scrollbar, so the picture is the screen as it looks, without scrollbars.
    const scrollers = Array.from(el.querySelectorAll<HTMLElement>('*')).filter((n) => {
      const { overflowX, overflowY } = getComputedStyle(n)
      return /auto|scroll/.test(overflowX + overflowY)
    })
    const saved = scrollers.map((n) => n.style.overflow)
    scrollers.forEach((n) => { n.style.overflow = 'hidden' })
    // A page that fills the canvas and scrolls inside itself is let grow to its
    // full height, so the picture holds everything, not the visible part.
    const root = el.firstElementChild as HTMLElement | null
    const savedHeight = root?.style.height ?? ''
    if (root) root.style.height = 'auto'
    let blob: Blob | null
    try {
      // The outer scroll container clips to its own height; capture its full content instead.
      const width = el.scrollWidth
      const height = el.scrollHeight
      blob = await toBlob(el, {
        pixelRatio: 2,
        width,
        height,
        backgroundColor: getComputedStyle(el).backgroundColor,
        style: { width: `${width}px`, height: `${height}px`, overflow: 'visible', flex: 'none' },
      })
    } finally {
      scrollers.forEach((n, i) => { n.style.overflow = saved[i] })
      if (root) root.style.height = savedHeight
    }
    if (!blob) throw new Error('Could not render the page')
    return blob
  }

  const copy = async () => {
    if (state === 'busy') return
    setState('busy')
    try {
      const blob = render()
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
        // Handing the clipboard a promise keeps the click's permission while the page renders.
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        setState('copied')
      } else {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(await blob)
        a.download = `${name}.png`
        a.click()
        URL.revokeObjectURL(a.href)
        setState('saved')
      }
    } catch {
      setState('failed')
    }
    timer.current = window.setTimeout(() => setState('idle'), 2400)
  }

  const label = { idle: 'Copy PNG', busy: 'Copying...', copied: 'Copied', saved: 'Saved PNG', failed: 'Copy failed' }[state]
  const icon = { idle: 'content_copy', busy: 'hourglass_top', copied: 'check', saved: 'download', failed: 'error' }[state]
  return (
    <>
      <button
        type="button"
        title="Copy this screen as a PNG image"
        onClick={() => void copy()}
        aria-disabled={state === 'busy'}
        {...hoverPill}
        style={pillButton}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 17 }} aria-hidden>{icon}</span>
        {label}
      </button>
      <span role="status" style={srOnly}>{state === 'idle' || state === 'busy' ? '' : label}</span>
    </>
  )
}

/** Small "Download bundle" button - copies the whole page + tokens as a file. */
function DownloadButton({ page }: { page: ExamplePage }) {
  return (
    <button
      type="button"
      title="Download this screen's code and design tokens as one file for an AI tool"
      // The bundle builder carries the raw sources, so it loads on first use.
      onClick={() => void import('./pages/download').then((m) => m.downloadPageBundle(page))}
      {...hoverPill}
      style={pillButton}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 17 }} aria-hidden>download</span>
      Download
    </button>
  )
}

/** The width the page is laid out at before it is scaled down into a card. */
const THUMB_WIDTH = 1440
const THUMB_HEIGHT = 900

/**
 * A live, shrunken picture of the page: the real component, laid out at
 * desktop width and scaled to the card. It is not interactive and hidden from
 * assistive tech (the card's title and description already name the page), and
 * it only mounts once the card scrolls near the viewport.
 */
function Thumbnail({ page }: { page: ExamplePage }) {
  const frame = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.25)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = frame.current
    if (!el) return
    const measure = () => setScale(el.clientWidth / THUMB_WIDTH)
    measure()
    const resize = new ResizeObserver(measure)
    resize.observe(el)
    const seen = new IntersectionObserver(([entry]) => entry.isIntersecting && setNear(true), { rootMargin: '200px' })
    seen.observe(el)
    return () => { resize.disconnect(); seen.disconnect() }
  }, [])
  const Page = page.component
  return (
    <div
      ref={frame}
      aria-hidden
      style={{
        position: 'relative', width: '100%', aspectRatio: `${THUMB_WIDTH} / ${THUMB_HEIGHT}`, overflow: 'hidden',
        border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--background)',
      }}
    >
      {near && Page && (
        <div
          inert
          style={{
            position: 'absolute', top: 0, left: 0, width: THUMB_WIDTH, height: THUMB_HEIGHT, overflow: 'hidden',
            transform: `scale(${scale})`, transformOrigin: 'top left', pointerEvents: 'none',
          }}
        >
          <Suspense fallback={null}><Page /></Suspense>
        </div>
      )}
    </div>
  )
}

const CHIP_GAP = 6

/**
 * The components a page uses, kept to one row. What does not fit collapses into
 * a "+N" chip; hovering or focusing it lists them all. Sizes are measured from a
 * hidden copy of the full row so the cut is exact at any card width.
 */
function ChipRow({ names }: { names: string[] }) {
  const row = useRef<HTMLDivElement>(null)
  const ruler = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(names.length)
  const [open, setOpen] = useState(false)

  useLayoutEffect(() => {
    const el = row.current
    const measurer = ruler.current
    if (!el || !measurer) return
    const fit = () => {
      const widths = Array.from(measurer.children).map((c) => (c as HTMLElement).offsetWidth)
      const more = widths[widths.length - 1]
      const room = el.clientWidth
      let used = 0
      let n = 0
      for (let i = 0; i < names.length; i++) {
        used += widths[i] + (i > 0 ? CHIP_GAP : 0)
        const rest = names.length - (i + 1)
        if (used + (rest > 0 ? CHIP_GAP + more : 0) > room) break
        n = i + 1
      }
      setVisible(n)
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [names])

  const hidden = names.slice(visible)
  return (
    <div style={{ position: 'relative' }}>
      {/* Hidden ruler: every chip plus a "+N" chip, on one line. */}
      <div ref={ruler} aria-hidden style={{ position: 'absolute', visibility: 'hidden', display: 'flex', gap: CHIP_GAP, whiteSpace: 'nowrap', pointerEvents: 'none' }}>
        {names.map(chip)}
        {chip(`+${names.length}`)}
      </div>
      <div ref={row} style={{ display: 'flex', alignItems: 'center', gap: CHIP_GAP, whiteSpace: 'nowrap' }}>
        {names.slice(0, visible).map(chip)}
        {hidden.length > 0 && (
          <div
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            style={{ position: 'relative', zIndex: 2, flexShrink: 0 }}
          >
            <button
              type="button"
              aria-label={`${hidden.length} more: ${hidden.join(', ')}`}
              style={{
                font: 'inherit', fontSize: 11, fontWeight: 500, lineHeight: 'inherit', margin: 0, cursor: 'default', whiteSpace: 'nowrap',
                color: 'var(--gray-700)', background: 'var(--gray-100)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-pill)', padding: '2px 8px',
              }}
            >
              +{hidden.length}
            </button>
            {open && (
              <div
                aria-hidden
                style={{
                  position: 'absolute', right: 0, bottom: 'calc(100% + 8px)', width: 260,
                  display: 'flex', flexWrap: 'wrap', gap: CHIP_GAP, padding: 10,
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-300)',
                }}
              >
                {names.map(chip)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/** The one mark every coming-soon card carries: the screen is a work in progress. */
const WORK_IN_PROGRESS_ICON = 'design_services'

/** Stands where a thumbnail will be, so a coming-soon card keeps the grid's rhythm. */
function ThumbnailPlaceholder() {
  return (
    <div
      aria-hidden
      style={{
        width: '100%', aspectRatio: `${THUMB_WIDTH} / ${THUMB_HEIGHT}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-md)',
        background: 'var(--gray-100)', color: 'var(--text-secondary)',
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 40 }}>{WORK_IN_PROGRESS_ICON}</span>
    </div>
  )
}

/**
 * One screen-template tile. The title is the link and stretches over the whole
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
      {ready ? <Thumbnail page={page} /> : <ThumbnailPlaceholder />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, minHeight: 30 }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: 'var(--text-primary)' }}>
            {ready ? (
              <a href={hash} onClick={followLink(onNavigate, hash)} className="docs-page-card-link" style={{ color: 'inherit', textDecoration: 'none' }}>
                {page.name}
              </a>
            ) : page.name}
          </h2>
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
        {page.location && <p style={{ margin: 0, fontSize: 13, color: 'var(--muted-foreground)' }}>{page.location}</p>}
      </div>
      {/* Pinned to the card's foot so every card in a row ends on the same line. */}
      <div style={{ marginTop: 'auto', minHeight: 24, display: 'flex', alignItems: 'center' }}>
        {page.uses.length > 0 ? (
          <div style={{ flex: 1, minWidth: 0 }}><ChipRow names={page.uses} /></div>
        ) : (
          <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{usesLabel(page)}</span>
        )}
      </div>
    </article>
  )
}

/** The ready kits in registry order, then every coming-soon card, so none sits between ready ones. */
const galleryOrder = [
  ...examplePages.filter((page) => page.status === 'ready'),
  ...examplePages.filter((page) => page.status === 'coming-soon'),
]

/** Gallery: one card per screen template. */
function Gallery({ onNavigate }: { onNavigate: (hash: string) => void }) {
  const [guideOpen, setGuideOpen] = useState(false)
  return (
    <div style={{ width: '100%', maxWidth: 1080, fontFamily: 'var(--font-sans)' }}>
      <header style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: '0 0 8px', fontSize: 28, fontWeight: 600, color: 'var(--text-primary)' }}>Screen templates</h1>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, color: 'var(--muted-foreground)', maxWidth: 640 }}>
            Ready-made Inspera screens you can use as a starting point. Pick the one closest to
            your idea, then change it to show what you have in mind.
          </p>
        </div>
        <div style={{ flexShrink: 0 }}>
          <Button
            label="Guide"
            leadingIcon="help"
            aria-haspopup="dialog"
            onClick={() => setGuideOpen(true)}
          />
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {galleryOrder.map((page) => (
          <GalleryCard key={page.slug} page={page} onNavigate={onNavigate} />
        ))}
      </div>

      {guideOpen && (
        <Suspense fallback={null}>
          <PagesGuide onClose={() => setGuideOpen(false)} onNavigate={onNavigate} />
        </Suspense>
      )}
    </div>
  )
}

export default function PagesPage({ slug, onNavigate }: PagesPageProps) {
  return slug ? <PageView slug={slug} onNavigate={onNavigate} /> : <Gallery onNavigate={onNavigate} />
}
