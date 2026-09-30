import {
  type CSSProperties, type KeyboardEvent, type ReactNode, Fragment, useEffect, useId, useRef, useState,
} from 'react'
import { Alert, Badge, Button } from '../components/inspera'
import { Portal, useEscapeLayer, useScrimDismiss } from '../components/inspera/overlay'
import { srOnly } from '../components/inspera/types'
import { useModalBehavior } from '../components/inspera/useModalBehavior'
import { CodeBlock, CopyButton } from './primitives'

/**
 * The guide behind "How to use & contribute" on the Prototyping Kits gallery: a
 * short presentation for anyone at Inspera who wants a starting point for an
 * idea: why the pages exist, how to turn one into a mockup, and how to add
 * to them.
 *
 * Built on the library's own overlay hooks, so focus, Escape, the scrim and
 * the scroll lock behave exactly as they do in Dialog.
 */

/** Who contributions go to. The contribute slides and every template name it. */
const CONTRIBUTE_TO = 'the Design System team'

// ---------------------------------------------------------------------------
// Shared styles and small pieces
// ---------------------------------------------------------------------------

/**
 * Secondary text. Not --muted-foreground: its gray-600 is 4.3:1 on white and
 * 4.0:1 on gray-100, short of AA for text this small. Gray-700 is 7:1.
 */
const SECONDARY = 'var(--gray-700)'

const TITLE: CSSProperties = {
  margin: 0, fontSize: 28, fontWeight: 600, lineHeight: 1.2, letterSpacing: -0.3, color: 'var(--gray-900)',
}
const LEDE: CSSProperties = {
  margin: '10px 0 0', fontSize: 16, lineHeight: 1.5, color: SECONDARY, maxWidth: 700,
}
const SUBHEAD: CSSProperties = {
  margin: '0 0 12px', fontSize: 12, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase',
  color: SECONDARY,
}
const CARD: CSSProperties = {
  display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, padding: 18,
  border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', background: 'var(--surface)',
}
const CARD_TITLE: CSSProperties = { margin: 0, fontSize: 15, fontWeight: 600, lineHeight: 1.3, color: 'var(--gray-900)' }
const CARD_TEXT: CSSProperties = { margin: 0, fontSize: 13, lineHeight: 1.5, color: SECONDARY }
const FIELD_LABEL: CSSProperties = {
  fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase', color: SECONDARY,
}

/** Cards that wrap to fit. `min()` keeps one column from overflowing a narrow panel. */
const grid = (min: number, gap = 14): CSSProperties => ({
  display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(min(${min}px, 100%), 1fr))`, gap,
})

const glyph = (name: string, size = 20, color?: string): ReactNode => (
  <span className="material-symbols-outlined" style={{ fontSize: size, color }} aria-hidden>{name}</span>
)

/** An icon on a tinted square - the same mark the gallery cards carry. */
function IconTile({ name, size = 40 }: { name: string; size?: number }) {
  return (
    <span
      style={{
        width: size, height: size, flexShrink: 0, borderRadius: 'var(--radius-md)',
        background: 'var(--blue-100)', color: 'var(--primary)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {glyph(name, Math.round(size * 0.55))}
    </span>
  )
}

function Num({ n, size = 28 }: { n: number; size?: number }) {
  return (
    <span
      aria-hidden
      style={{
        width: size, height: size, flexShrink: 0, borderRadius: 'var(--radius-pill)',
        background: 'var(--primary)', color: 'var(--text-on-primary)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: Math.round(size * 0.46), fontWeight: 600, letterSpacing: 0,
      }}
    >
      {n}
    </span>
  )
}

/** Flow connector. Blue-600, not a paler step: it has to clear 3:1 on white. */
function FlowArrow({ style }: { style?: CSSProperties }) {
  return (
    <span
      aria-hidden
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue-600)', ...style }}
    >
      {glyph('arrow_forward', 22)}
    </span>
  )
}

/**
 * Lets a wide diagram scroll sideways on a narrow panel. It is a tab stop only
 * while it actually scrolls - the rule CodeBlock follows - so the keyboard can
 * reach the hidden part without meeting an empty stop the rest of the time.
 */
function ScrollX({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [scrolls, setScrolls] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setScrolls(el.scrollWidth - el.clientWidth > 1)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      tabIndex={scrolls ? 0 : undefined}
      role={scrolls ? 'region' : undefined}
      aria-label={scrolls ? `${label} (scrolls sideways)` : undefined}
      // Hidden, not auto: a stray sub-pixel of height made it a vertical scroller too.
      style={{ overflowX: 'auto', overflowY: 'hidden' }}
    >
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sketches. Wireframes, not screenshots: they show the shape of the problem
// and stay legible at any size. All aria-hidden - the captions carry the point.
// ---------------------------------------------------------------------------

function Bar({ w, h, bg, r = 2 }: { w: number | string; h: number; bg: string; r?: number }) {
  return <span style={{ display: 'block', width: w, height: h, background: bg, borderRadius: r, flexShrink: 0 }} />
}

const SKETCH: CSSProperties = {
  height: 136, overflow: 'hidden', borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-strong)', background: 'var(--surface)', boxShadow: 'var(--shadow-100)',
}

/** Monday: a purple top bar and a card layout. */
function SketchCards() {
  return (
    <div aria-hidden style={SKETCH}>
      <div style={{ height: 20, background: 'var(--purple-500)', display: 'flex', alignItems: 'center', padding: '0 8px' }}>
        <Bar w={28} h={6} bg="var(--purple-200)" />
        <span style={{ flex: 1 }} />
        <Bar w={10} h={10} bg="var(--purple-200)" r={999} />
      </div>
      <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 9 }}>
        <Bar w={70} h={7} bg="var(--gray-400)" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{ height: 42, borderRadius: 10, background: 'var(--purple-100)', border: '1px solid var(--purple-200)' }}
            />
          ))}
        </div>
        <Bar w={52} h={14} bg="var(--purple-500)" r={999} />
      </div>
    </div>
  )
}

/** Tuesday: a dark sidebar and a green table. */
function SketchSidebar() {
  return (
    <div aria-hidden style={{ ...SKETCH, display: 'flex' }}>
      <div style={{ width: 38, background: 'var(--gray-800)', padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[0, 1, 2, 3].map((i) => <Bar key={i} w="100%" h={5} bg={i === 1 ? 'var(--green-500)' : 'var(--gray-600)'} />)}
      </div>
      <div style={{ flex: 1, minWidth: 0, padding: 10, display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Bar w={56} h={7} bg="var(--gray-400)" />
          <Bar w={30} h={14} bg="var(--green-600)" r={0} />
        </div>
        <Bar w="100%" h={12} bg="var(--green-600)" r={0} />
        {[0, 1, 2, 3].map((i) => <Bar key={i} w="100%" h={7} bg="var(--gray-200)" r={0} />)}
      </div>
    </div>
  )
}

/** A colleague: an orange header and a list instead of a grid. */
function SketchList() {
  return (
    <div aria-hidden style={SKETCH}>
      <div style={{ height: 30, background: 'var(--orange-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Bar w={64} h={7} bg="var(--orange-200)" />
      </div>
      <div style={{ padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 11 }}>
        {[62, 48, 56].map((w) => (
          <div key={w} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bar w={16} h={16} bg="var(--orange-300)" r={999} />
            <Bar w={`${w}%`} h={6} bg="var(--gray-300)" />
            <span style={{ flex: 1 }} />
            <span style={{ width: 26, height: 12, borderRadius: 3, border: '1.5px solid var(--orange-500)', flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * The real Monitor > Candidates screen as a sketch - nav, Views rail, toolbar,
 * grid - with the one new column called out. The column names are the page's.
 */
function MonitorSketch() {
  const cell: CSSProperties = {
    height: 24, display: 'flex', alignItems: 'center', padding: '0 7px',
    borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap', overflow: 'hidden',
  }
  const column = (label: string, flex: string, widths: number[], added?: string[]) => (
    <div
      key={label}
      style={{
        flex, minWidth: 0, display: 'flex', flexDirection: 'column',
        ...(added && {
          background: 'var(--blue-100)', borderRadius: 'var(--radius-xs)',
          outline: '2px dashed var(--primary)', outlineOffset: -2,
        }),
      }}
    >
      <span style={{ ...cell, fontSize: 10, fontWeight: 600, color: added ? 'var(--primary)' : 'var(--gray-700)' }}>{label}</span>
      {widths.map((w, i) => (
        <span key={i} style={{ ...cell, fontSize: 10, fontWeight: 600, color: 'var(--primary)' }}>
          {added ? added[i] : <Bar w={`${w}%`} h={5} bg="var(--gray-300)" />}
        </span>
      ))}
    </div>
  )

  return (
    <div
      aria-hidden
      style={{
        overflow: 'hidden', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-strong)',
        background: 'var(--surface)', boxShadow: 'var(--shadow-200)',
      }}
    >
      <div style={{ height: 26, background: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 10px' }}>
        <span style={{ width: 9, height: 9, borderRadius: 2, border: '1.5px solid var(--blue-300)' }} />
        {['Author', 'Deliver', 'Monitor', 'Grade', 'Report'].map((l) => (
          <span
            key={l}
            style={{ fontSize: 10, color: l === 'Monitor' ? 'var(--white)' : 'var(--blue-300)', fontWeight: l === 'Monitor' ? 600 : 400 }}
          >
            {l}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        <div
          style={{
            width: 78, flexShrink: 0, padding: 9, display: 'flex', flexDirection: 'column', gap: 9,
            background: 'var(--gray-100)', borderRight: '1px solid var(--border)',
          }}
        >
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-700)' }}>Views</span>
          {[40, 32, 44, 28, 36].map((w, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
              <Bar w={w} h={5} bg={i === 0 ? 'var(--blue-400)' : 'var(--gray-300)'} />
              <Bar w={8} h={5} bg="var(--gray-300)" />
            </span>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 0, padding: 9, display: 'flex', flexDirection: 'column', gap: 9 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 96, height: 18, border: '1px solid var(--border-strong)', borderRadius: 3 }} />
            <span style={{ flex: 1 }} />
            {[0, 1, 2].map((i) => <Bar key={i} w={12} h={12} bg="var(--gray-300)" r={3} />)}
          </div>
          <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 3 }}>
            {column('ID', '0 0 34px', [70, 70, 70, 70, 70])}
            {column('Status', '1 1 0', [60, 45, 70, 50, 60])}
            {column('Progress', '1 1 0', [80, 65, 75, 55, 70])}
            {column('Extra time', '1.1 1 0', [0, 0, 0, 0, 0], ['+15 min', '', '+30 min', '', '+15 min'])}
            {column('Remaining', '1 1 0', [40, 50, 35, 45, 40])}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Where the effort goes, with and without a starting screen. Illustrative, not
 * measured - and labelled so. Emphasis form: the idea in the accent colour and
 * all overhead in grey, because the story is one share growing, not several
 * categories to tell apart. No axis or values, since there are no real ones.
 */
const EFFORT: { label: string; parts: { share: number; idea: boolean; label?: string }[] }[] = [
  {
    label: 'From a blank prompt',
    parts: [
      { share: 75, idea: false, label: 'Rebuilding the screen, fixing drift' },
      { share: 25, idea: true, label: 'Your idea' },
    ],
  },
  {
    label: 'From a prototyping kit',
    parts: [
      { share: 10, idea: false },
      { share: 90, idea: true, label: 'Your idea' },
    ],
  },
]

function EffortChart() {
  const swatch = (bg: string) => <span style={{ width: 12, height: 12, borderRadius: 3, background: bg }} />
  return (
    <figure style={{ ...CARD, margin: 0, alignItems: 'stretch', gap: 22, padding: 24 }}>
      <figcaption style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '6px 16px' }}>
        <span style={CARD_TITLE}>Where your effort goes</span>
        <span style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', fontSize: 12, color: 'var(--gray-700)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>{swatch('var(--primary)')}Your idea</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>{swatch('var(--gray-400)')}Overhead</span>
        </span>
      </figcaption>
      {EFFORT.map((bar) => (
        <div key={bar.label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-900)' }}>{bar.label}</span>
          {/* 2px gaps separate the segments; only the outer ends are rounded. */}
          <div style={{ display: 'flex', gap: 2, height: 32 }}>
            {bar.parts.map((p, i) => (
              <span
                key={i}
                title={p.idea ? 'Your idea' : 'Overhead'}
                style={{
                  flex: p.share, minWidth: 0, display: 'flex', alignItems: 'center', padding: '0 10px',
                  background: p.idea ? 'var(--primary)' : 'var(--gray-400)',
                  color: p.idea ? 'var(--text-on-primary)' : 'var(--gray-900)',
                  fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  borderRadius: i === 0 ? '4px 0 0 4px' : i === bar.parts.length - 1 ? '0 4px 4px 0' : 0,
                }}
              >
                {p.label}
              </span>
            ))}
          </div>
        </div>
      ))}
    </figure>
  )
}

// ---------------------------------------------------------------------------
// Slides
// ---------------------------------------------------------------------------

type Chapter = 'start' | 'why' | 'use' | 'contribute'

const CHAPTERS: { id: Exclude<Chapter, 'start'>; n: number; label: string; blurb: string }[] = [
  { id: 'why', n: 1, label: 'Why', blurb: 'AI mockups drift. Real screens do not.' },
  { id: 'use', n: 2, label: 'How to use it', blurb: 'Pick a screen, download it, prompt, share.' },
  { id: 'contribute', n: 3, label: 'How to contribute', blurb: 'Add screens, variants and your own mockups.' },
]

interface SlideProps {
  goTo: (index: number) => void
  /** Leave the guide for an in-app route. */
  openPage: (hash: string) => void
}

function Cover({ goTo }: SlideProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
      <section>
        <h4 style={SUBHEAD}>In this guide</h4>
        <ol style={{ ...grid(220, 12), margin: 0, padding: 0, listStyle: 'none' }}>
          {CHAPTERS.map((c) => (
            <li key={c.id} style={{ display: 'flex' }}>
              <button
                type="button"
                className="docs-guide-card"
                onClick={() => goTo(SLIDES.findIndex((s) => s.chapter === c.id))}
                style={{ ...CARD, flex: 1, textAlign: 'left', cursor: 'pointer', color: 'inherit' }}
              >
                <span style={{ alignSelf: 'stretch', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Num n={c.n} />
                  {glyph('arrow_forward', 20, 'var(--primary)')}
                </span>
                <span style={CARD_TITLE}>{c.label}</span>
                <span style={CARD_TEXT}>{c.blurb}</span>
              </button>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}

const ATTEMPTS = [
  { when: "Monday's prompt", what: 'Purple nav and a card layout', Sketch: SketchCards },
  { when: "Tuesday's retry", what: 'A dark sidebar and a green table', Sketch: SketchSidebar },
  { when: "A colleague's try", what: 'An orange header and a list', Sketch: SketchList },
]

const PAINS = [
  { icon: 'palette', title: 'Off-brand', text: 'Reviewers debate colours and layout instead of your idea.' },
  { icon: 'sync_problem', title: 'Not repeatable', text: 'The same prompt gives a different screen every time.' },
  { icon: 'link_off', title: 'Not reusable', text: 'Nobody can build on your mockup, so each idea starts from zero.' },
  { icon: 'hourglass_top', title: 'Slow to do properly', text: 'Designing every exploration from scratch takes time you rarely have.' },
]

function Problem() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
      <div style={grid(200, 16)}>
        {ATTEMPTS.map(({ when, what, Sketch }) => (
          <figure key={when} style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Sketch />
            <figcaption style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)' }}>{when}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--gray-700)' }}>
                {glyph('error', 16, 'var(--error)')}
                {what}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <section>
        <h4 style={SUBHEAD}>Why that hurts</h4>
        <ul style={{ ...grid(190, 12), margin: 0, padding: 0, listStyle: 'none' }}>
          {PAINS.map((p) => (
            <li key={p.title} style={{ ...CARD, padding: 16, border: 'none', background: 'var(--gray-100)' }}>
              {glyph(p.icon, 22, 'var(--gray-700)')}
              <span style={CARD_TITLE}>{p.title}</span>
              <span style={CARD_TEXT}>{p.text}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

const WINS = [
  'The same starting screen, every time',
  'On brand by default: real components and tokens',
  'Anyone can pick up where you left off',
]

function Fix() {
  const legend: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6 }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div style={{ ...grid(320, 32), alignItems: 'stretch' }}>
        <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <MonitorSketch />
          <figcaption style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px', fontSize: 12, color: 'var(--gray-700)' }}>
            <span style={legend}>
              <span style={{ width: 14, height: 10, borderRadius: 2, background: 'var(--gray-300)' }} />
              Given: the real Monitor screen
            </span>
            <span style={legend}>
              <span
                style={{
                  width: 14, height: 10, borderRadius: 2, background: 'var(--blue-100)',
                  outline: '1.5px dashed var(--primary)', outlineOffset: -1.5,
                }}
              />
              You describe: the new column
            </span>
          </figcaption>
        </figure>
        <EffortChart />
      </div>
      <ul style={{ ...grid(240, 16), margin: 0, padding: 0, listStyle: 'none' }}>
        {WINS.map((w) => (
          <li
            key={w}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
              borderRadius: 'var(--radius-lg)', background: 'var(--gray-100)',
              fontSize: 14, fontWeight: 500, lineHeight: 1.4, color: 'var(--gray-900)',
            }}
          >
            {glyph('check_circle', 22, 'var(--success)')}
            {w}
          </li>
        ))}
      </ul>
    </div>
  )
}

const STEPS = [
  { icon: 'grid_view', title: 'Pick the closest screen', text: 'Open the prototyping kit your feature would live on.' },
  { icon: 'download', title: 'Download its file', text: 'One .md file: the page, its components and the Inspera styles.' },
  { icon: 'auto_awesome', title: 'Have your AI build it', text: 'Attach the file and ask for the page exactly as it is. No changes yet.' },
  { icon: 'edit_note', title: 'Describe your change', text: 'Once the copy matches the original, ask for one change.' },
  { icon: 'forum', title: 'Share and refine', text: 'Show the result, gather feedback, adjust.' },
]

const AI_TOOLS = ['Figma Make', 'Claude', 'ChatGPT', 'Cursor', 'Gemini']

/** Two rows of steps: the first gets the screen built, the second makes it yours. */
const PHASES = [
  { label: 'Get the screen', steps: STEPS.slice(0, 3), first: 1 },
  { label: 'Make it yours', steps: STEPS.slice(3), first: 4 },
]

/** Cards and arrows share one grid so both rows line up: steps in the odd columns, arrows in the even. */
const FLOW_COLUMNS = '1fr 32px 1fr 32px 1fr'

function Steps() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Scrolls sideways rather than crushing the cards on a narrow panel. */}
      <ScrollX label="The five steps">
        <div style={{ minWidth: 560, display: 'flex', flexDirection: 'column', gap: 28 }}>
          {PHASES.map((phase) => (
            <section key={phase.label} aria-label={phase.label} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h4 style={{ ...SUBHEAD, margin: 0 }}>{phase.label}</h4>
              <div role="list" style={{ display: 'grid', gridTemplateColumns: FLOW_COLUMNS }}>
                {phase.steps.map((s, i) => (
                  <Fragment key={s.title}>
                    {i > 0 && <FlowArrow />}
                    <div role="listitem" style={{ ...CARD, alignItems: 'stretch', boxShadow: 'var(--shadow-100)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Num n={phase.first + i} />
                        {glyph(s.icon, 22, 'var(--primary)')}
                      </span>
                      <span style={CARD_TITLE}>{s.title}</span>
                      <span style={CARD_TEXT}>{s.text}</span>
                    </div>
                  </Fragment>
                ))}
              </div>
              {phase.first === 4 && (
                <div style={{ display: 'grid', gridTemplateColumns: FLOW_COLUMNS }}>
                  <>
                    {/* Steps 4 and 5 repeat: a bracket from the bottom of 5 back up into
                        4. The inner grid halves each step's column, so both ends land on
                        the centre of their card at any width. */}
                    <div aria-hidden style={{ gridColumn: '1 / 4', display: 'grid', gridTemplateColumns: '1fr 1fr 32px 1fr 1fr' }}>
                      <span
                        style={{
                          gridColumn: '2 / 5', position: 'relative', height: 22,
                          border: '2px solid var(--blue-600)', borderTop: 'none', borderRadius: '0 0 12px 12px',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute', left: -7, top: 0, width: 0, height: 0,
                            borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
                            borderBottom: '8px solid var(--blue-600)',
                          }}
                        />
                      </span>
                    </div>
                    <p
                      style={{
                        gridColumn: '1 / 4', margin: '8px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: 6, fontSize: 13, fontWeight: 500, color: 'var(--gray-800)',
                      }}
                    >
                      {glyph('autorenew', 18, 'var(--blue-600)')}
                      Refine: one change per prompt
                    </p>
                  </>
                </div>
              )}
            </section>
          ))}
        </div>
      </ScrollX>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 16 }}>
        <div
          style={{
            flex: '1 1 260px', display: 'flex', gap: 12, padding: 16,
            borderRadius: 'var(--radius-lg)', background: 'var(--gray-100)',
          }}
        >
          {glyph('lightbulb', 22, 'var(--primary)')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)' }}>Where is Download?</span>
            <p style={{ ...CARD_TEXT, color: 'var(--gray-800)', fontSize: 14 }}>
              On every card in the gallery, and at the top of every page.
            </p>
          </div>
        </div>
        {/* Wide enough to keep the tool names on one line. */}
        <div style={{ flex: '1 1 440px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={FIELD_LABEL}>Works with any AI assistant that builds React</span>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {AI_TOOLS.map((t) => (
              <li
                key={t}
                style={{
                  padding: '3px 10px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-strong)',
                  fontSize: 13, color: 'var(--gray-800)',
                }}
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/** The bundle's sections in file order (bundle.ts). */
const BUNDLE = [
  { title: 'Read this first', text: 'Setup rules, so the page renders correctly in any tool.' },
  { title: 'Inspera styles', text: 'Fonts, colours and spacing - the design tokens.' },
  { title: 'Library components', text: 'The building blocks the page uses, plus shared parts like the top navigation.' },
  { title: 'The page', text: 'The complete code for the screen itself.' },
]

const GAINS = [
  { icon: 'content_copy', title: 'The same screen in every tool', text: 'Figma Make, Claude or Cursor all start from identical code.' },
  { icon: 'block', title: 'No invented parts', text: 'Buttons, fields and colours come from the library, not from the AI.' },
  { icon: 'handshake', title: 'An easy hand-off', text: 'Designers and developers can see exactly what you changed.' },
]

function Bundle() {
  return (
    <div style={{ ...grid(320, 36), alignItems: 'start' }}>
      <figure style={{ margin: 0 }}>
        <div
          style={{
            overflow: 'hidden', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-strong)',
            background: 'var(--surface)', boxShadow: 'var(--shadow-200)',
          }}
        >
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
              background: 'var(--gray-100)', borderBottom: '1px solid var(--border)',
              fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--gray-800)',
            }}
          >
            {glyph('description', 18, 'var(--primary)')}
            monitor-candidates.md
          </div>
          <ol style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {BUNDLE.map((b, i) => (
              <li
                key={b.title}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 18px',
                  borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                }}
              >
                <Num n={i + 1} size={24} />
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4, color: 'var(--gray-900)' }}>{b.title}</span>
                  <span style={CARD_TEXT}>{b.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <figcaption style={{ ...CARD_TEXT, marginTop: 10 }}>One download, top to bottom.</figcaption>
      </figure>
      <section>
        <h4 style={SUBHEAD}>What that gets you</h4>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {GAINS.map((g) => (
            <li key={g.title} style={{ display: 'flex', gap: 14 }}>
              <IconTile name={g.icon} />
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={CARD_TITLE}>{g.title}</span>
                <span style={CARD_TEXT}>{g.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

// Plain ASCII: it gets pasted into chat windows that guess encodings. Lines
// stay under 55 characters so the block shows them whole, without scrolling.
const PROMPT_BUILD = `I'm attaching an Inspera prototyping kit: <file name>.md

Rebuild the page exactly as the file describes.
Use only the components, icons and design tokens
in the file. Do not add or change anything.`

const PROMPT_CHANGE = `Now make this one change:
<your change - e.g. add an "Extra time" column
after "Minutes remaining" showing +15 min,
+30 min or nothing>

Rules:
- Keep everything else on the page exactly as it is.
- Use only the components, icons and design tokens
  in the file. No new colours, fonts or icon sets.
- If you need something the file does not have,
  tell me instead of inventing it.`

const PROMPT_TIPS = [
  { good: 'Build the screen first, then change it', bad: 'Asking for both in one prompt' },
  { good: 'Describe only the change', bad: 'Re-describing the whole screen' },
  { good: 'One change per prompt, then refine', bad: 'Five features in one go' },
  { good: 'Say "use only what is in the file"', bad: 'Letting it pick colours or icons' },
]

function Prompt() {
  const th: CSSProperties = { ...FIELD_LABEL, textAlign: 'left', padding: '0 12px 10px 0' }
  const td: CSSProperties = { padding: '12px 12px 12px 0', borderTop: '1px solid var(--border)', verticalAlign: 'top' }
  const head = (name: string, color: string, label: string) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>{glyph(name, 18, color)}{label}</span>
  )
  // Flex, not the even card grid: the prompt needs the wider share to show
  // its lines whole, and wraps above the table when the panel is narrow.
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 32 }}>
      <div style={{ flex: '1 1 480px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <CodeBlock code={PROMPT_BUILD} language="Prompt 1 - build the screen" copyLabel="Copy prompt 1" maxHeight={0} />
        <CodeBlock code={PROMPT_CHANGE} language="Prompt 2 - make your change" copyLabel="Copy prompt 2" maxHeight={0} />
      </div>
      <div style={{ flex: '1 1 300px', minWidth: 0 }}>
        <table style={{ width: '100%', fontSize: 14, lineHeight: 1.4, color: 'var(--gray-900)' }}>
          <thead>
            <tr>
              <th scope="col" style={th}>{head('check', 'var(--success)', 'Do')}</th>
              <th scope="col" style={th}>{head('close', 'var(--error)', 'Avoid')}</th>
            </tr>
          </thead>
          <tbody>
            {PROMPT_TIPS.map((t) => (
              <tr key={t.good}>
                <td style={{ ...td, fontWeight: 500 }}>{t.good}</td>
                <td style={{ ...td, color: 'var(--gray-700)' }}>{t.bad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Paste-ready requests. Plain text, so they survive Slack, Jira and email.
const SCREENSHOT_LINE = 'Screenshot: <attached - real names, IDs and grades replaced>'

const CONTRIBUTIONS: {
  icon: string
  title: string
  when: string
  send: string[]
  outcome: string
  /** The outcome depends on the Community section, which is not live yet. */
  soon?: boolean
  template: string
}[] = [
  {
    icon: 'add_photo_alternate',
    title: 'Request a screen',
    when: 'A screen you need is not in the gallery yet.',
    send: ['A screenshot of the live screen', 'Where it lives, e.g. Grade > Marking'],
    outcome: 'We rebuild it from library components and add it to the gallery.',
    template: [
      'Prototyping Kits - new screen request',
      'Screen: <name, e.g. Marking>',
      'Where it lives: <menu path, e.g. Grade > Marking>',
      'Why I need it: <the feature or customer question>',
      SCREENSHOT_LINE,
    ].join('\n'),
  },
  {
    icon: 'layers',
    title: 'Request a variant',
    when: 'The page is here, but you need another state of it.',
    send: ['A screenshot of that state', 'What differs: empty, error, filled in or another role'],
    outcome: 'We add the variant to that page.',
    template: [
      'Prototyping Kits - new variant request',
      'Page: <prototyping kit, e.g. Monitor>',
      'Variant: <empty / error / filled in / another role - describe it>',
      'Why I need it: <the feature or customer question>',
      SCREENSHOT_LINE,
    ].join('\n'),
  },
  {
    icon: 'upload_file',
    title: 'Share your mockup',
    when: 'You built something others could start from.',
    send: ['Your updated .md file', 'Two lines on what changed and why'],
    outcome: 'It goes into the Community section, credited to you.',
    soon: true,
    template: [
      'Prototyping Kits - community mockup',
      'Title: <e.g. Extra time column in Monitor>',
      'Based on: <prototyping kit>',
      'What changed: <one or two lines>',
      'Why: <the problem it explores>',
      'Status: <idea / in discovery / planned / shipped>',
      'Author: <your name>',
      'File: <your updated .md, attached>',
    ].join('\n'),
  },
  {
    icon: 'lightbulb',
    title: 'Share what you learned',
    when: 'A prompt worked well, or a page no longer matches the product.',
    send: ['The prompt, or a screenshot of the difference'],
    outcome: 'We add it to this guide, or fix the page.',
    template: [
      'Prototyping Kits - feedback',
      'Type: <a prompt that worked / a page that is out of date>',
      'Page: <prototyping kit>',
      'Details: <the prompt, or what differs from the live product>',
      'Screenshot: <optional - real names, IDs and grades replaced>',
    ].join('\n'),
  },
]

function Contribute() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={grid(330, 16)}>
        {CONTRIBUTIONS.map((c) => (
          <article key={c.title} style={{ ...CARD, alignItems: 'stretch', gap: 14 }}>
            {/* The action sits top right, where Download sits on a gallery card. */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <IconTile name={c.icon} />
              <CopyButton text={c.template} label="Copy template" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <h4 style={CARD_TITLE}>{c.title}</h4>
              <p style={CARD_TEXT}>{c.when}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={FIELD_LABEL}>Send</span>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {c.send.map((s) => (
                  <li key={s} style={{ display: 'flex', alignItems: 'baseline', gap: 8, fontSize: 13, lineHeight: 1.5, color: 'var(--gray-900)' }}>
                    <span aria-hidden style={{ width: 4, height: 4, flexShrink: 0, borderRadius: 999, background: 'var(--gray-500)', transform: 'translateY(-3px)' }} />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <p style={{ margin: 0, display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 13, lineHeight: 1.5, color: 'var(--gray-900)' }}>
              {glyph('arrow_forward', 16, 'var(--primary)')}
              <span>
                {c.outcome}
                {c.soon && (
                  <>
                    {' '}
                    <Badge label="Opening soon" intent="Neutral" size="Small" />
                  </>
                )}
              </span>
            </p>
          </article>
        ))}
      </div>
      {/* A static note, not an announcement: role="note" replaces the alert
          role Warning would otherwise put on it. */}
      <Alert
        intent="Warning"
        role="note"
        title="Using a screenshot from a live system?"
        message="Replace real candidate names, IDs, grades and customer names before you send it. Prototyping kits only ever show made-up data."
      />
    </div>
  )
}

function FlowNode({
  icon, title, text, eyebrow, badge, accent, style,
}: {
  icon: string
  title: string
  text: string
  eyebrow?: string
  badge?: string
  accent?: boolean
  style?: CSSProperties
}) {
  return (
    <div
      style={{
        ...CARD, gap: 8, padding: 16,
        ...(accent && { borderColor: 'var(--primary)', background: 'var(--blue-100)' }),
        ...style,
      }}
    >
      <IconTile name={icon} size={36} />
      {eyebrow && <span style={FIELD_LABEL}>{eyebrow}</span>}
      <span style={CARD_TITLE}>{title}</span>
      {badge && <Badge label={badge} intent="Neutral" size="Small" />}
      <span style={{ ...CARD_TEXT, color: 'var(--gray-700)' }}>{text}</span>
    </div>
  )
}

/** What happens next depends on what was sent, so each kind of contribution gets its own row. */
const LANES: {
  label: string
  steps: { icon: string; title: string; text: string; badge?: string; accent?: boolean }[]
}[] = [
  {
    label: 'Need a new screen or a variant?',
    steps: [
      { icon: 'send', title: 'You request it', text: 'Tell us which screen, or what to change.' },
      { icon: 'construction', title: 'The team builds it', text: 'From library components.' },
      { icon: 'verified', title: 'It joins Prototyping Kits', text: 'Everyone can use it.', accent: true },
    ],
  },
  {
    label: 'Built your own mockup?',
    steps: [
      { icon: 'send', title: 'You share it', text: 'Send it with a short note.' },
      { icon: 'fact_check', title: 'Design review', text: 'Checked for library components and made-up data.' },
      { icon: 'groups', title: 'Community', badge: 'Opening soon', text: 'Anyone can download it and build on it.' },
      { icon: 'verified', title: 'It can become official', text: 'The most reused ones are rebuilt as kits.', accent: true },
    ],
  },
]

function Lifecycle() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <ScrollX label="What happens to a contribution">
        <div style={{ minWidth: 640, display: 'flex', flexDirection: 'column', gap: 28 }}>
          {LANES.map((lane) => (
            <section key={lane.label} aria-label={lane.label} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h4 style={{ ...SUBHEAD, margin: 0 }}>{lane.label}</h4>
              <div role="list" style={{ display: 'grid', gridTemplateColumns: '1fr 36px 1fr 36px 1fr 36px 1fr' }}>
                {lane.steps.map((step, i) => (
                  <Fragment key={step.title}>
                    {i > 0 && <FlowArrow />}
                    <div role="listitem" style={{ display: 'flex' }}>
                      <FlowNode style={{ flex: 1 }} {...step} />
                    </div>
                  </Fragment>
                ))}
              </div>
            </section>
          ))}
        </div>
      </ScrollX>
    </div>
  )
}

interface Slide {
  chapter: Chapter
  /** Short name, for the rail and the Next button. */
  nav: string
  title: string
  lede?: string
  Body: (props: SlideProps) => ReactNode
}

const SLIDES: Slide[] = [
  {
    chapter: 'start',
    nav: 'Overview',
    title: 'Mock up new features on real Inspera screens, not a blank canvas',
    lede: 'A short guide for anyone at Inspera who wants a real starting point to show an idea before it is built.',
    Body: Cover,
  },
  {
    chapter: 'why',
    nav: 'The problem',
    title: 'Ask an AI for the same screen three times, get three different products',
    lede: 'Say you want to show an "Extra time" column in Monitor. Without a real starting point, every prompt invents its own version of Inspera.',
    Body: Problem,
  },
  {
    chapter: 'why',
    nav: 'The fix',
    title: 'Start from the real screen. Describe only what is new.',
    lede: 'Each prototyping kit is a working copy of a real Inspera screen. Give it to your AI and everything that already exists stays as it is - you only describe the change.',
    Body: Fix,
  },
  {
    chapter: 'use',
    nav: 'Five steps',
    title: 'From idea to mockup in five steps',
    lede: 'No design tools and no setup. Get the screen built first, then change it.',
    Body: Steps,
  },
  {
    chapter: 'use',
    nav: "What's in the file",
    title: 'Why it works: the AI copies instead of guessing',
    lede: 'The download is one self-contained file. Everything an AI would otherwise invent is already written down in it.',
    Body: Bundle,
  },
  {
    chapter: 'use',
    nav: 'Two prompts that work',
    title: 'Two prompts that work',
    lede: 'Send the first with the file attached. When the page matches the original, send the second with your change.',
    Body: Prompt,
  },
  {
    chapter: 'contribute',
    nav: 'Ways to contribute',
    title: 'Four ways to contribute',
    lede: `Each takes a few minutes. Copy a template, fill it in and send it to ${CONTRIBUTE_TO}.`,
    Body: Contribute,
  },
  {
    chapter: 'contribute',
    nav: 'What happens next',
    title: 'What happens after you send it',
    lede: 'It depends on what you send. Requests are built by the team. Mockups go through review first.',
    Body: Lifecycle,
  },
]

/** The rail's groups: the overview on its own, then one group per chapter. */
const RAIL = (['start', 'why', 'use', 'contribute'] as const).map((id) => ({
  id,
  chapter: CHAPTERS.find((c) => c.id === id),
  slides: SLIDES.flatMap((slide, i) => (slide.chapter === id ? [{ slide, i }] : [])),
}))

// ---------------------------------------------------------------------------
// The modal
// ---------------------------------------------------------------------------

interface PagesGuideProps {
  onClose: () => void
  /** App routing, for the links to prototyping kits. The guide closes first. */
  onNavigate: (hash: string) => void
}

export default function PagesGuide({ onClose, onNavigate }: PagesGuideProps) {
  const [index, setIndex] = useState(0)
  // The furthest slide reached, so the rail can tick off what has been seen.
  const [reached, setReached] = useState(0)
  const [announcement, setAnnouncement] = useState('')
  const dialogTitle = useId()
  const slideTitle = useId()
  const railLabel = useId()
  const panel = useModalBehavior(true)
  const scrim = useScrimDismiss(onClose)
  useEscapeLayer(true, onClose)
  const scroller = useRef<HTMLDivElement>(null)
  const primary = useRef<HTMLButtonElement>(null)

  const slide = SLIDES[index]
  const last = index === SLIDES.length - 1

  const goTo = (i: number) => {
    const next = Math.max(0, Math.min(SLIDES.length - 1, i))
    if (next === index) return
    setIndex(next)
    setReached((r) => Math.max(r, next))
    setAnnouncement(`Slide ${next + 1} of ${SLIDES.length}: ${SLIDES[next].title}`)
  }

  const openPage = (hash: string) => {
    onClose()
    onNavigate(hash)
  }

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
    // Back unmounts on the first slide. If it had focus, focus would drop to
    // <body>; hand it to the primary button instead.
    if (!panel.current?.contains(document.activeElement)) primary.current?.focus()
  }, [index, panel])

  // Left and right arrows page through the slides, except where they already
  // mean something (text fields, a scrolling code block).
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
    if ((e.target as HTMLElement).closest('input, textarea, select, pre, [contenteditable="true"]')) return
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      goTo(index + 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      goTo(index - 1)
    }
  }

  const Body = slide.Body
  const chapter = CHAPTERS.find((c) => c.id === slide.chapter)
  const cover = slide.chapter === 'start'

  return (
    <Portal>
      <div
        {...scrim}
        className="docs-guide-scrim"
        style={{
          position: 'fixed', inset: 0, zIndex: 'var(--z-modal)', background: 'var(--scrim)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(8px, 3vw, 24px)',
        }}
      >
        <div
          ref={panel}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby={dialogTitle}
          onKeyDown={onKeyDown}
          className="docs-guide-panel"
          style={{
            width: 'min(1180px, 100%)', height: 'min(800px, 100%)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            borderRadius: 'var(--radius-xl)', background: 'var(--surface)', boxShadow: 'var(--shadow-600)',
            fontFamily: 'var(--font-sans)', color: 'var(--text-primary)',
          }}
        >
          <header
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexShrink: 0,
              padding: '12px 16px 12px 24px', borderBottom: '1px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <IconTile name="co_present" size={36} />
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <h2 id={dialogTitle} style={{ margin: 0, fontSize: 17, fontWeight: 600, color: 'var(--gray-900)' }}>
                  Prototyping Kits guide
                </h2>
                <span
                  style={{
                    fontSize: 13, color: SECONDARY,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}
                >
                  Why they exist, how to use them and how to contribute
                </span>
              </div>
            </div>
            <Button label="Close guide" iconOnly leadingIcon="close" intent="Text" onClick={onClose} />
          </header>

          <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
            <nav
              aria-labelledby={railLabel}
              className="docs-guide-rail"
              style={{
                width: 248, flexShrink: 0, overflowY: 'auto', padding: '16px 12px 24px',
                background: 'var(--gray-100)', borderRight: '1px solid var(--border)',
              }}
            >
              <span id={railLabel} style={srOnly}>Guide slides</span>
              {RAIL.map((group) => (
                <div key={group.id} style={{ marginBottom: 14 }}>
                  {group.chapter && (
                    <div
                      id={`${railLabel}-${group.id}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8, margin: '6px 0 4px', padding: '0 10px',
                        fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase',
                        color: SECONDARY,
                      }}
                    >
                      <Num n={group.chapter.n} size={18} />
                      {group.chapter.label}
                    </div>
                  )}
                  <ol
                    aria-labelledby={group.chapter ? `${railLabel}-${group.id}` : undefined}
                    style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 2 }}
                  >
                    {group.slides.map(({ slide: s, i }) => {
                      const current = i === index
                      const seen = !current && i <= reached
                      return (
                        <li key={i}>
                          <button
                            type="button"
                            className="docs-guide-rail-item"
                            aria-current={current ? 'step' : undefined}
                            onClick={() => goTo(i)}
                            style={{
                              width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px',
                              border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', textAlign: 'left',
                              // Left unset when not current, so the class's hover can show.
                              background: current ? 'var(--surface)' : undefined,
                              boxShadow: current ? 'var(--shadow-100)' : 'none',
                              color: current ? 'var(--primary)' : 'var(--gray-800)',
                              fontSize: 14, fontWeight: current ? 600 : 400,
                            }}
                          >
                            <span aria-hidden style={{ width: 16, display: 'inline-flex', justifyContent: 'center', flexShrink: 0 }}>
                              {seen ? (
                                glyph('check', 16, 'var(--primary)')
                              ) : (
                                <span
                                  style={{
                                    width: 7, height: 7, borderRadius: 999,
                                    background: current ? 'var(--primary)' : 'transparent',
                                    border: current ? 'none' : '1.5px solid var(--gray-500)',
                                  }}
                                />
                              )}
                            </span>
                            {s.nav}
                          </button>
                        </li>
                      )
                    })}
                  </ol>
                </div>
              ))}
            </nav>

            {/* Focusable, so the keyboard can scroll a slide with no controls. */}
            <div
              ref={scroller}
              tabIndex={0}
              role="region"
              aria-labelledby={slideTitle}
              className="docs-guide-scroll"
              style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}
            >
              <div key={index} className="docs-guide-slide" style={{ maxWidth: 1000, padding: '32px clamp(20px, 4vw, 48px) 48px' }}>
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
                    fontSize: 12, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--primary)',
                  }}
                >
                  {chapter ? (
                    <>
                      <Num n={chapter.n} size={20} />
                      {chapter.label}
                    </>
                  ) : (
                    <>
                      {glyph('schedule', 18)}
                      About 3 minutes
                    </>
                  )}
                </div>
                <h3 id={slideTitle} style={cover ? { ...TITLE, fontSize: 34, maxWidth: 760 } : TITLE}>{slide.title}</h3>
                {slide.lede && <p style={LEDE}>{slide.lede}</p>}
                <div style={{ marginTop: 28 }}>
                  <Body goTo={goTo} openPage={openPage} />
                </div>
              </div>
            </div>
          </div>

          <footer
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexShrink: 0,
              padding: '12px 24px', borderTop: '1px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <span style={{ fontSize: 13, color: SECONDARY, whiteSpace: 'nowrap' }}>
                {index + 1} of {SLIDES.length}
              </span>
              {/* Progress, grouped by chapter. The rail says the same thing,
                  but it gives way to this on a narrow screen. */}
              <span aria-hidden style={{ display: 'flex', alignItems: 'center' }}>
                {SLIDES.map((s, i) => (
                  <span
                    key={i}
                    style={{
                      width: 18, height: 4, borderRadius: 2,
                      marginLeft: i === 0 ? 0 : SLIDES[i - 1].chapter === s.chapter ? 3 : 9,
                      background: i <= index ? 'var(--primary)' : 'var(--gray-300)',
                    }}
                  />
                ))}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {index > 0 && <Button label="Back" intent="Text" leadingIcon="arrow_back" onClick={() => goTo(index - 1)} />}
              {last ? (
                <Button ref={primary} label="Done" onClick={onClose} />
              ) : (
                <Button
                  ref={primary}
                  label={cover ? 'Start the guide' : `Next: ${SLIDES[index + 1].nav}`}
                  trailingIcon="arrow_forward"
                  onClick={() => goTo(index + 1)}
                />
              )}
            </div>
          </footer>

          <div aria-live="polite" style={srOnly}>{announcement}</div>
        </div>
      </div>
    </Portal>
  )
}
