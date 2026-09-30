import { type CSSProperties, type KeyboardEvent, type ReactNode, type RefObject, Fragment, useEffect, useId, useRef, useState } from 'react'
import { Tabs } from '../../components/inspera'

/**
 * Author > Question Sets > Create new > New author: Inspera's question-set
 * editor. A navy tool rail; a header with the set's breadcrumb, status and
 * more menu; the Questions panel listing each section and its questions; the
 * rich-text editor for the open question; and that question's settings.
 *
 * Choose a question and the editor and its settings follow it. The question
 * text is edited in place, and the toolbar's formatting tools work on it.
 * Clicking the interaction under it (the choices, or the essay box) selects
 * it, and the settings panel switches to that interaction's settings until
 * Close. Changing a mark updates the question's total and its section's; any
 * change turns on Cancel and Save. The Resources tab has no resources yet:
 * "+ Add resource" opens the list of resource types, and the editor area
 * stays empty. Nearly everything here is product chrome with a look of its
 * own, so it is built inline; the Questions / Resources tabs are the library's.
 */

/* --- Palette ------------------------------------------------------------ */

// The product's colors, sampled from the reference screenshots. Like the other
// kits, the screen is copied exactly first and moved onto the design-system
// tokens later; grays that already match a token use the token.
const RAIL = '#1c435e'
const RAIL_ACTIVE = '#011c37'
const RAIL_ICON = '#89a7c8'
const INK = '#333333' // body text
const HEADING = '#2d3e50' // settings headings
const LINK = '#0359b2' // question titles
const LEARN_MORE = '#0088cc'
const HINT = '#7f8c8d'
const SELECTED = '#f7e5dd' // the open question's row
const SELECTED_MENU = '#fcbba4' // ...and its menu button
const ROW_RULE = '#cccccc'
const FRAME = '#bcc3c6' // editor frame, number fields, checkboxes
const OUTLINE = '#808080' // dotted outline while the pointer is over the editor
const TOOLBAR = '#ebedef'
const TOOL = '#484848'
const TOOL_OFF = '#bbbbbd'
const ANSWER_AREA = '#fafafc'
const DARK_SELECT = '#787878'
const STEPPER = '#555555'
const BUTTON_OFF = '#e1e1e1' // Cancel / Save while nothing has changed
const BUTTON_OFF_TEXT = '#a9a9a9'
const CANCEL_ON = '#dfe1e2'
const CANCEL_ON_TEXT = '#5a5a5a'
const MENU_INK = '#212121' // menu items
const MENU_RULE = '#e0e0e0'
const MENU_HOVER = '#ebebeb'
const RESOURCE_FRAME = '#dededf' // the list of resource types
const RESOURCE_HOVER = '#c5e3f9' // ...and its highlighted type
const FOCUS = '#0c98f0' // the editor while its text is edited; the selected interaction
const MUTED_STEM = '#999999' // the question text while its interaction is selected
const MUTED_BLOCK = '#858585' // the interaction while the question text is edited
const INSERT_OFF = '#a4a6a7'
const PRESSED = '#d4d7da' // a toolbar toggle that is on - not in the reference screenshots
const CLOSE = '#d93f22' // closes the interaction's settings

/* --- Content ------------------------------------------------------------ */

interface Question {
  id: string
  title: string
  /** The question type, as the product names it. */
  type: string
  /** How the answer area looks: one choice, several, or free text. */
  kind: 'single' | 'multiple' | 'essay'
  /** Heading of the answer area. */
  prompt: string
  alternatives?: string[]
  /** Correct alternatives; "Marks per correct answer" counts each one. Defaults to 1. */
  correctCount?: number
  /** Shown under the type when set. */
  weight?: number
}

interface Section {
  title: string
  questions: Question[]
}

const SECTIONS: Section[] = [
  {
    title: 'New Section',
    questions: [
      {
        id: 'mcq', title: 'MCQ', type: 'Multiple Choice', kind: 'single', prompt: 'Select one alternative',
        alternatives: ['Alternative 1', 'Alternative 2', 'Alternative 3', 'Alternative 4'],
      },
      {
        id: 'essay', title: 'Long Essay', type: 'Essay', kind: 'essay', weight: 1,
        prompt: 'Write your answer in the box below. Changes are saved automatically.',
      },
    ],
  },
  {
    title: 'Section 2',
    questions: [
      {
        id: 'mrq', title: 'MRQ', type: 'Multiple Response', kind: 'multiple', prompt: 'Select one or more alternatives',
        alternatives: ['Alternative 1', 'Alternative 2', 'Alternative 3', 'Alternative 4'], correctCount: 2,
      },
      {
        id: 'tf', title: 'T/F', type: 'True / False', kind: 'single', prompt: 'Select one alternative',
        alternatives: ['True', 'False'],
      },
    ],
  },
]

const QUESTIONS = SECTIONS.flatMap((s) => s.questions)

/** Questions are numbered through the whole set, not per section. */
const numberOf = (id: string) => QUESTIONS.findIndex((q) => q.id === id) + 1

/** A question's settings: the Marks number fields (null when empty) and its checkbox. */
interface Settings {
  marks: Record<string, number | null>
  /** "By alternative" on choice questions; "Enable AI-supported marking" on essays. */
  checked: boolean
}

const CHOICE_SETTINGS: Settings = {
  marks: { correct: 1, wrong: 0, unanswered: 0, allCorrect: null, minimum: null },
  checked: false,
}

const INITIAL_SETTINGS: Record<string, Settings> = {
  mcq: CHOICE_SETTINGS,
  essay: { marks: { max: 10 }, checked: false },
  mrq: CHOICE_SETTINGS,
  tf: CHOICE_SETTINGS,
}

const CHOICE_FIELDS = [
  { key: 'correct', label: 'Marks per correct answer' },
  { key: 'wrong', label: 'Marks per wrong answer' },
  { key: 'unanswered', label: 'Marks for unanswered' },
  { key: 'allCorrect', label: 'Marks for all correct' },
  { key: 'minimum', label: 'Minimum marks' },
]

const round = (n: number) => Math.round(n * 100) / 100

/** The most a question can score, as its row in the Questions panel shows it. */
function totalMarks(q: Question, s: Settings): number {
  const m = s.marks
  if (q.kind === 'essay') return round(m.max ?? 0)
  return round(m.allCorrect ?? (m.correct ?? 0) * (q.correctCount ?? 1))
}

const SETTINGS_SECTIONS = ['Marks', 'Feedback', 'Main illustration', 'PDF panel', 'Labels', 'Advanced', 'Drawing tool', 'Analytics']

/** Essays also take file uploads, listed after Labels. */
const settingsSectionsFor = (q: Question) =>
  q.kind === 'essay'
    ? [...SETTINGS_SECTIONS.slice(0, 5), 'File uploads', ...SETTINGS_SECTIONS.slice(5)]
    : SETTINGS_SECTIONS

/** The selected interaction's settings, which stand in for the question's. */
const interactionSectionsFor = (q: Question) =>
  q.kind === 'essay'
    ? ['Prompt', 'Size', 'Options', 'External identifier']
    : ['Prompt', 'Alternatives', 'Options', 'External identifier']

/** Everything the author can change, kept whole so Cancel can put it all back. */
interface Draft {
  settings: Record<string, Settings>
  /** The question text, as HTML. */
  stems: Record<string, string>
  /** Each interaction's prompt. */
  prompts: Record<string, string>
}

const INITIAL_DRAFT: Draft = {
  settings: INITIAL_SETTINGS,
  stems: Object.fromEntries(QUESTIONS.map((q) => [q.id, 'Your question here.'])),
  prompts: Object.fromEntries(QUESTIONS.map((q) => [q.id, q.prompt])),
}

/* --- Small building blocks --------------------------------------------- */

const icon = (name: string, size = 20, style?: CSSProperties): ReactNode => (
  <span className="material-symbols-outlined" style={{ fontSize: size, ...style }} aria-hidden>{name}</span>
)

/**
 * Strips a <button> down to its content. No background here: buttons that use
 * the runtime `inspera-row` hover class must not set one inline, or it would
 * outrank the hover rule - the others add `background` themselves.
 */
const reset: CSSProperties = {
  padding: 0, margin: 0, border: 'none', font: 'inherit', color: 'inherit', cursor: 'pointer',
}

/** A round icon-only button with the runtime hover tint. */
function IconButton({
  label,
  children,
  onClick,
  size = 32,
  selected = false,
}: {
  label: string
  children: ReactNode
  onClick?: () => void
  size?: number
  /** Fills the circle, as the open question's menu button does. */
  selected?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(e) => {
        // Row buttons sit inside a clickable row; keep the click to themselves.
        e.stopPropagation()
        onClick?.()
      }}
      className={selected ? 'inspera-interactive' : 'inspera-interactive inspera-row'}
      style={{
        ...reset, width: size, height: size, flexShrink: 0, borderRadius: '50%',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        ...(selected ? { background: SELECTED_MENU } : null),
      }}
    >
      {children}
    </button>
  )
}

function LearnMore() {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      style={{ alignSelf: 'flex-start', fontSize: 12, color: LEARN_MORE, textDecoration: 'none' }}
    >
      Learn more
    </a>
  )
}

/** The circled "A" in the tool rail, drawn to match the product's glyph. */
function CircledA() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx={12} cy={12} r={9.25} />
      <path d="M8.75 16.5 12 7.5l3.25 9M9.9 13.25h4.2" />
    </svg>
  )
}

/** The section-settings glyph: a grid with a small cog on its corner. */
function GridCog() {
  return (
    <span aria-hidden style={{ position: 'relative', display: 'inline-flex' }}>
      {icon('grid_on', 20)}
      <span
        className="material-symbols-outlined"
        style={{ position: 'absolute', right: -4, bottom: -4, fontSize: 12, borderRadius: '50%', background: 'var(--white)' }}
      >
        settings
      </span>
    </span>
  )
}

/**
 * A button's drop-down menu: whether it is open, which item is highlighted,
 * and its keyboard. The arrows, Home and End move through the items, Escape
 * closes the menu and returns focus to the button, and a press anywhere
 * outside closes it. Spread `triggerProps` on the button and `itemProps(i)` on
 * each item; `wrap` and `onKeyDown` go on the element holding both.
 */
function useMenu(count: number) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const wrap = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const items = useRef<(HTMLButtonElement | null)[]>([])
  const menuId = useId()
  const last = count - 1

  // Focus follows the highlighted item, so a screen reader announces it.
  useEffect(() => {
    if (open && active >= 0) items.current[active]?.focus()
  }, [open, active])

  useEffect(() => {
    if (!open) return
    const onPress = (e: PointerEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) {
        setOpen(false)
        setActive(-1)
      }
    }
    document.addEventListener('pointerdown', onPress)
    return () => document.removeEventListener('pointerdown', onPress)
  }, [open])

  const openAt = (index: number) => {
    setOpen(true)
    setActive(index)
  }
  const close = (refocus = true) => {
    setOpen(false)
    setActive(-1)
    if (refocus) trigger.current?.focus()
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        openAt(0)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        openAt(last)
      }
      return
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (i >= last ? 0 : i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (i <= 0 ? last : i - 1))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActive(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setActive(last)
    } else if (e.key === 'Tab') {
      close(false)
    }
  }

  return {
    open,
    active,
    wrap,
    menuId,
    onKeyDown,
    triggerProps: {
      ref: trigger,
      'aria-haspopup': 'menu' as const,
      'aria-expanded': open,
      'aria-controls': open ? menuId : undefined,
      // A click opens the menu with nothing highlighted; the keyboard opens it on an item.
      onClick: () => (open ? close(false) : openAt(-1)),
    },
    itemProps: (i: number) => ({
      ref: (node: HTMLButtonElement | null) => {
        items.current[i] = node
      },
      role: 'menuitem',
      tabIndex: -1,
      // On a move, not on entering: a menu opened from the keyboard under a
      // resting pointer keeps the item the keyboard chose.
      onPointerMove: () => setActive(i),
      // Nothing behind the items yet: choosing one closes the menu.
      onClick: () => close(),
    }),
  }
}

/* --- Tool rail ---------------------------------------------------------- */

function ToolRail() {
  // The product draws each rule as a two-tone hairline.
  const rule = <div aria-hidden style={{ flexShrink: 0, borderTop: '1px solid #596d7d', borderBottom: '1px solid #7a8f9f' }} />
  const tool = (label: string, glyph: ReactNode, opts: { active?: boolean; bright?: boolean; height?: number } = {}) => (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-current={opts.active ? 'page' : undefined}
      className="inspera-interactive"
      style={{
        ...reset, width: '100%', height: opts.height ?? 64, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: opts.active ? RAIL_ACTIVE : 'none',
        color: opts.active || opts.bright ? 'var(--white)' : RAIL_ICON,
      }}
    >
      {glyph}
    </button>
  )
  return (
    <nav aria-label="Question set tools" style={{ width: 55, flexShrink: 0, display: 'flex', flexDirection: 'column', background: RAIL }}>
      {tool('Back to Question Sets', icon('arrow_back_ios_new', 20), { bright: true, height: 60 })}
      {rule}
      {/* Centred, sitting a little high, as the product's group does. */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 16 }}>
        {tool('Edit', icon('edit', 20), { active: true })}
        {tool('Preview', icon('visibility', 22))}
        {rule}
        {tool('Answer key', <CircledA />)}
      </div>
      {rule}
      {tool('Full screen', icon('zoom_out_map', 22), { height: 70 })}
      {tool('Account', icon('account_circle', 24), { height: 78 })}
    </nav>
  )
}

/* --- Header ------------------------------------------------------------- */

const MORE_ACTIONS = [
  { label: 'Rename Question Set', icon: 'edit' },
  { label: 'Share with users', icon: 'person_add' },
  { label: 'Share with access group', icon: 'domain_add' },
  { label: 'Print Manager', icon: 'print' },
  // The product sets this one apart with an empty band above it.
  { label: 'Save as template', icon: 'file_save', newGroup: true },
]

/** The header's "..." button and its menu of question-set actions. */
function MoreMenu() {
  const menu = useMenu(MORE_ACTIONS.length)
  return (
    <div ref={menu.wrap} onKeyDown={menu.onKeyDown} style={{ marginTop: 4 }}>
      <button
        {...menu.triggerProps}
        type="button"
        aria-label="More options"
        title="More options"
        className="inspera-interactive inspera-row"
        style={{
          ...reset, width: 32, height: 32, borderRadius: 'var(--radius-sm)', color: '#000',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {icon('more_horiz', 24, { fontVariationSettings: "'wght' 700" })}
      </button>
      {menu.open && (
        // Anchored to the header's bottom-right corner, overlapping its edge as in the product.
        <div
          id={menu.menuId}
          role="menu"
          aria-label="Question set actions"
          style={{
            position: 'absolute', top: 'calc(100% - 4px)', right: 2, zIndex: 'var(--z-dropdown)', width: 240,
            background: 'var(--white)', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.18)',
          }}
        >
          {MORE_ACTIONS.map((action, i) => (
            <Fragment key={action.label}>
              {action.newGroup && <div role="separator" style={{ height: 25, borderBottom: `1px solid ${MENU_RULE}` }} />}
              <button
                {...menu.itemProps(i)}
                type="button"
                className="inspera-interactive"
                style={{
                  ...reset, width: '100%', height: 46, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px',
                  borderBottom: `1px solid ${MENU_RULE}`, background: menu.active === i ? MENU_HOVER : 'var(--white)',
                  color: MENU_INK, fontSize: 15, textAlign: 'left',
                }}
              >
                {icon(action.icon, 20, { color: 'var(--gray-700)' })}
                {action.label}
              </button>
            </Fragment>
          ))}
        </div>
      )}
    </div>
  )
}

function Header() {
  return (
    <header
      style={{
        position: 'relative', flexShrink: 0, height: 68, boxSizing: 'border-box',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16,
        padding: '12px 29px 0 14px', borderBottom: '1px solid #e4e4e4',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, whiteSpace: 'nowrap' }}>
          <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 5, fontSize: 13, letterSpacing: 1, color: '#666666' }}>
            Unbanked / Question Sets /
            <h1 style={{ margin: 0, font: 'inherit' }}>Test Question Set</h1>
          </div>
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', height: 22, padding: '0 5px', borderRadius: 3,
              background: 'var(--yellow-300)', color: 'var(--gray-900)', fontSize: 13,
            }}
          >
            Draft
          </span>
          <span aria-hidden style={{ width: 8, height: 8, flexShrink: 0, borderRadius: '50%', background: 'var(--gray-300)' }} />
          <button
            type="button"
            aria-label="Language: English"
            className="inspera-interactive"
            style={{
              ...reset, background: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--gray-700)',
            }}
          >
            {icon('language', 16)}
            English
            {icon('chevron_right', 16)}
          </button>
        </div>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--gray-700)', whiteSpace: 'nowrap' }}>
          Last edited <strong style={{ fontWeight: 500, color: 'var(--gray-900)' }}>24/09/2026</strong> by{' '}
          <strong style={{ fontWeight: 500, color: 'var(--gray-900)' }}>Ameya Suryan</strong>
        </p>
      </div>
      <MoreMenu />
    </header>
  )
}

/* --- Questions panel ---------------------------------------------------- */

function QuestionRow({
  question,
  total,
  selected,
  onSelect,
}: {
  question: Question
  total: number
  selected: boolean
  onSelect: () => void
}) {
  return (
    // The whole row picks the question; its title is the keyboard way in.
    <div
      onClick={onSelect}
      className={selected ? undefined : 'inspera-row'}
      style={{
        display: 'flex', alignItems: 'center', minHeight: 65, boxSizing: 'border-box', padding: '11px 12px',
        borderBottom: `1px solid ${ROW_RULE}`, cursor: 'pointer',
        ...(selected ? { background: SELECTED } : null),
      }}
    >
      <span style={{ width: 40, flexShrink: 0, fontSize: 14, color: INK }}>{numberOf(question.id)}</span>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', lineHeight: '20px' }}>
        <button
          type="button"
          aria-current={selected || undefined}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
          className="inspera-interactive"
          style={{ ...reset, background: 'none', alignSelf: 'flex-start', fontSize: 15, fontWeight: 600, color: LINK, textAlign: 'left' }}
        >
          {question.title}
        </button>
        <span style={{ fontSize: 13, color: 'var(--gray-700)' }}>
          {question.type} <span style={{ color: INK }}>({total} marks)</span>
        </span>
        {question.weight !== undefined && <span style={{ fontSize: 13, color: INK }}>Weight: {question.weight}</span>}
      </div>
      <IconButton label={`More actions for ${question.title}`} selected={selected}>
        {icon('more_vert', 22, { color: 'var(--gray-900)', fontVariationSettings: "'wght' 600" })}
      </IconButton>
    </div>
  )
}

function SectionBlock({
  number,
  section,
  totals,
  selectedId,
  onSelect,
}: {
  number: number
  section: Section
  totals: Record<string, number>
  selectedId: string
  onSelect: (id: string) => void
}) {
  const total = round(section.questions.reduce((sum, q) => sum + totals[q.id], 0))
  return (
    <section aria-label={`Section ${number}: ${section.title}`} style={{ borderBottom: '5px solid var(--gray-300)' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '7px 12px 6px' }}>
        <span style={{ width: 28, flexShrink: 0, fontSize: 14, fontWeight: 600, color: '#000' }}>{number}</span>
        <div style={{ flex: 1, minWidth: 0, lineHeight: '20px' }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 500, lineHeight: 'inherit', color: INK }}>{section.title}</h2>
          <span style={{ display: 'block', fontSize: 13, color: 'var(--gray-700)' }}>
            Section <span style={{ color: INK }}>({total} marks)</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 8, color: 'var(--gray-700)' }}>
          <IconButton label={`Shuffle questions in ${section.title}`}>{icon('shuffle', 22)}</IconButton>
          <button
            type="button"
            aria-label={`${section.title} settings`}
            title="Section settings"
            className="inspera-interactive inspera-row"
            style={{
              ...reset, width: 36, height: 36, flexShrink: 0, borderRadius: 6, border: '1px solid var(--gray-300)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <GridCog />
          </button>
          <IconButton label={`More actions for ${section.title}`}>
            {icon('more_vert', 22, { color: 'var(--gray-900)', fontVariationSettings: "'wght' 600" })}
          </IconButton>
        </div>
      </div>
      {section.questions.map((q) => (
        <QuestionRow key={q.id} question={q} total={totals[q.id]} selected={q.id === selectedId} onSelect={() => onSelect(q.id)} />
      ))}
      <button
        type="button"
        className="inspera-interactive inspera-row"
        style={{
          ...reset, width: '100%', height: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 12px 0 36px', fontSize: 14, color: 'var(--primary)',
        }}
      >
        + Add content
        {/* The product's chevron sits a little above the label's centre line. */}
        {icon('chevron_right', 16, { position: 'relative', top: -5 })}
      </button>
    </section>
  )
}

function QuestionsPanel({
  tab,
  onTabChange,
  totals,
  selectedId,
  onSelect,
  onCollapse,
}: {
  /** "questions" or "resources". */
  tab: string
  onTabChange: (tab: string) => void
  totals: Record<string, number>
  selectedId: string
  onSelect: (id: string) => void
  onCollapse: () => void
}) {
  return (
    <aside
      aria-label="Questions and resources"
      // A quarter of the width, as the product lays it out, within usable limits.
      style={{ width: 'clamp(340px, 25%, 640px)', flexShrink: 0, minHeight: 0, display: 'flex', flexDirection: 'column', background: 'var(--white)' }}
    >
      <div style={{ display: 'flex', flexShrink: 0 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Tabs
            label="Question set content"
            fullWidth
            value={tab}
            onChange={onTabChange}
            items={[
              { label: `Questions (${QUESTIONS.length})`, value: 'questions' },
              { label: 'Resources (0)', value: 'resources' },
            ]}
          />
        </div>
        {/* Carries the tab list's bottom rule on under the collapse button. */}
        <div style={{ width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--border-strong)' }}>
          <IconButton label="Collapse the questions panel" size={28} onClick={onCollapse}>
            {icon('chevron_left', 20, { color: 'var(--gray-700)' })}
          </IconButton>
        </div>
      </div>

      {/* Gray shows below the list, as in the product, which insets both by a pixel either side. */}
      <div
        style={{
          flex: 1, minHeight: 0, overflowY: 'auto', background: 'var(--gray-300)',
          borderLeft: '1px solid var(--white)', borderRight: '1px solid var(--white)',
        }}
      >
        {tab === 'questions' ? (
          <div style={{ paddingTop: 12, background: 'var(--white)' }}>
            {SECTIONS.map((section, i) => (
              <SectionBlock
                key={section.title}
                number={i + 1}
                section={section}
                totals={totals}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            ))}
            <button
              type="button"
              className="inspera-interactive inspera-row"
              style={{
                ...reset, width: '100%', height: 54, display: 'flex', alignItems: 'center', gap: 6,
                padding: '0 12px 0 29px', fontSize: 15, color: 'var(--primary)',
              }}
            >
              {icon('view_agenda', 18)}
              Add section
            </button>
          </div>
        ) : (
          <ResourcesList />
        )}
      </div>
      <div aria-hidden style={{ height: 28, flexShrink: 0 }} />
    </aside>
  )
}

/* --- Resources ---------------------------------------------------------- */

/**
 * A resource type's glyph, drawn to match the product's on a 16-unit grid:
 * Material Symbols has nothing close to these.
 */
function ResourceGlyph({ children }: { children: ReactNode }) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  )
}

const RESOURCE_TYPES: { label: string; glyph: ReactNode }[] = [
  {
    label: 'Background audio',
    // A page with headphones over its bottom corner.
    glyph: (
      <ResourceGlyph>
        <path d="M4.3 14.1H1.5a0.9 0.9 0 0 1-0.9-0.9V1.45a0.9 0.9 0 0 1 0.9-0.9H8.1l2.5 2.5V7" />
        <path d="M7 12.6a3.6 3.5 0 0 1 7.2 0" />
        <g fill="currentColor" stroke="none">
          <rect x={5.6} y={12.1} width={2.1} height={3.7} rx={0.7} />
          <rect x={13.5} y={12.1} width={2.1} height={3.7} rx={0.7} />
          <circle cx={10.6} cy={13.5} r={2.3} />
        </g>
      </ResourceGlyph>
    ),
  },
  {
    label: 'Audio script',
    // An open book with a speaker on its pages.
    glyph: (
      <ResourceGlyph>
        <path d="M7.95 4.4C6.5 2.9 4.6 2.2 2.9 2.2a0.85 0.85 0 0 0-0.85 0.85V11a0.85 0.85 0 0 0 0.85 0.85c1.7 0 3.6 0.6 5.05 2.1c1.45-1.5 3.35-2.1 5.05-2.1a0.85 0.85 0 0 0 0.85-0.85V3.05a0.85 0.85 0 0 0-0.85-0.85c-1.7 0-3.6 0.7-5.05 2.2Z" />
        <path d="M5.2 7.15H6L7.2 6.3V9.2L6 8.35H5.2Z" fill="currentColor" strokeWidth={0.6} />
        <path d="M8.6 6.6a1.6 1.6 0 0 1 0 2.3M8.9 5.6a2.05 2.05 0 0 1 0 4" strokeWidth={1} />
      </ResourceGlyph>
    ),
  },
  {
    label: 'PDF',
    // A page with its corner folded over, lettered PDF.
    glyph: (
      <ResourceGlyph>
        <path d="M10.5 1.4H3.55a0.85 0.85 0 0 0-0.85 0.85v11.5a0.85 0.85 0 0 0 0.85 0.85h9a0.85 0.85 0 0 0 0.85-0.85V4.3Z" />
        <path d="M10.5 1.4V4.3h2.9Z" fill="currentColor" />
        <path d="M4.75 8.5V6h1.1a0.6 0.6 0 0 1 0 1.2H4.75M7 8.5V6h0.7a1.25 1.25 0 0 1 0 2.5ZM9.9 8.5V6h1.4M9.9 7.2h1.1" strokeWidth={0.6} />
      </ResourceGlyph>
    ),
  },
  {
    label: 'Link',
    // Two links of a chain, hooked through each other.
    glyph: (
      <ResourceGlyph>
        <path d="M5 11.1h-0.35a3.3 3.3 0 0 1 0-6.6h1.15a3.3 3.3 0 0 1 3.3 3.3M11 4.5h0.6a3.3 3.3 0 0 1 0 6.6h-1.3a3.3 3.3 0 0 1-3.3-3.3" />
      </ResourceGlyph>
    ),
  },
  // The institution's own calculator and tool presets, which share one glyph.
  ...['Calculator Tool', 'Calculator New', 'New Preset', 'Testing'].map((label) => ({
    label,
    glyph: icon('gesture_select', 18, { fontVariationSettings: "'wght' 300" }),
  })),
]

/**
 * The Resources tab. The set has no resources yet, so there is only the
 * "+ Add resource" card, whose list offers the types, with the panel's gray
 * below it.
 */
function ResourcesList() {
  const menu = useMenu(RESOURCE_TYPES.length)
  return (
    // 13px above makes up for the library tab bar's thinner rule, so the card sits where the product's does.
    <div style={{ padding: '13px 0 10px', background: 'var(--white)' }}>
      <div ref={menu.wrap} onKeyDown={menu.onKeyDown} style={{ position: 'relative' }}>
        <button
          {...menu.triggerProps}
          type="button"
          className="inspera-interactive inspera-row"
          style={{
            ...reset, width: '100%', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 8px 0 12px', borderRadius: 3, boxShadow: '0 1px 4px rgba(0, 0, 0, 0.125)',
            fontSize: 14, color: 'var(--primary)', '--inspera-row-bg': 'var(--white)',
          } as CSSProperties}
        >
          + Add resource
          {icon('chevron_right', 19, { fontVariationSettings: "'wght' 200" })}
        </button>
        {menu.open && (
          // Hangs from the card over the gray, as wide as the card.
          <div
            id={menu.menuId}
            role="menu"
            aria-label="Resource types"
            style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 'var(--z-dropdown)',
              border: `1px solid ${RESOURCE_FRAME}`, borderRadius: '0 0 3px 3px',
              background: 'var(--white)', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.14)',
            }}
          >
            {RESOURCE_TYPES.map((type, i) => (
              <button
                key={type.label}
                {...menu.itemProps(i)}
                type="button"
                className="inspera-interactive"
                style={{
                  ...reset, width: '100%', height: 38, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px',
                  background: menu.active === i ? RESOURCE_HOVER : 'var(--white)', color: MENU_INK, fontSize: 16, textAlign: 'left',
                }}
              >
                <span
                  style={{
                    width: 16, height: 16, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--gray-900)',
                  }}
                >
                  {type.glyph}
                </span>
                {type.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* --- Editor ------------------------------------------------------------- */

interface Tool {
  label: string
  icon?: string
  /** A text glyph, for tools Material Symbols has no icon for. */
  glyph?: string
  /** The editing command it runs on the question text. Tools without one do nothing yet. */
  command?: string
  /** Shows as pressed while the caret is in text it applies to. */
  toggle?: boolean
  /** Off while the question text is not being edited, as the product shows it at rest. */
  off?: boolean
  fill?: boolean
  color?: string
}

const TOOL_GROUPS: Tool[][] = [
  [{ label: 'Undo', icon: 'undo', command: 'undo', off: true }, { label: 'Redo', icon: 'redo', command: 'redo', off: true }],
  [
    { label: 'Bold', icon: 'format_bold', command: 'bold', toggle: true },
    { label: 'Italic', icon: 'format_italic', command: 'italic', toggle: true },
    { label: 'Underline', icon: 'format_underlined', command: 'underline', toggle: true },
    { label: 'Subscript', icon: 'subscript', command: 'subscript', toggle: true },
    { label: 'Superscript', icon: 'superscript', command: 'superscript', toggle: true },
  ],
  [
    { label: 'Numbered list', icon: 'format_list_numbered', command: 'insertOrderedList', toggle: true },
    { label: 'Bulleted list', icon: 'format_list_bulleted', command: 'insertUnorderedList', toggle: true },
  ],
  [
    { label: 'Decrease indent', icon: 'format_indent_decrease', command: 'outdent', off: true },
    { label: 'Increase indent', icon: 'format_indent_increase', command: 'indent' },
    { label: 'Remove format', icon: 'format_clear', command: 'removeFormat' },
  ],
  [{ label: 'Code snippet', icon: 'data_object' }, { label: 'Math formula', icon: 'functions' }],
  // Omega, escaped so the file stays plain ASCII like the rest of the bundle.
  [{ label: 'Attachment', icon: 'attach_file' }, { label: 'Table', icon: 'table' }, { label: 'Special character', glyph: '\u03A9' }],
  [
    { label: 'Link', icon: 'link' },
    { label: 'Image', icon: 'image', fill: true },
    { label: 'PDF', icon: 'picture_as_pdf', color: '#c9302c' },
    { label: 'Audio', icon: 'headphones' },
    { label: 'Video', icon: 'videocam', fill: true },
  ],
]

/** What the caret's place in the question text allows, for the toolbar. */
interface FormatState {
  /** Toggle commands in effect at the caret. */
  on: Set<string>
  undo: boolean
  redo: boolean
  /** Indenting works inside a list, as in the product. */
  inList: boolean
}

const NO_FORMAT: FormatState = { on: new Set(), undo: false, redo: false, inList: false }

const TOGGLES = TOOL_GROUPS.flat().flatMap((t) => (t.toggle && t.command ? [t.command] : []))

/** Reads the formatting at the caret; nothing applies when the caret is outside `el`. */
function readFormat(el: HTMLElement | null): FormatState {
  const at = document.getSelection()?.anchorNode
  if (!el || !at || !el.contains(at)) return NO_FORMAT
  const item = (at instanceof Element ? at : at.parentElement)?.closest('li')
  return {
    on: new Set(TOGGLES.filter((command) => document.queryCommandState(command))),
    undo: document.queryCommandEnabled('undo'),
    redo: document.queryCommandEnabled('redo'),
    inList: Boolean(item && el.contains(item)),
  }
}

function Toolbar({
  locked,
  editing,
  format,
  onRun,
}: {
  /** An interaction is selected, so the text tools do not apply. */
  locked: boolean
  /** The question text has the caret. */
  editing: boolean
  format: FormatState
  onRun: (command: string) => void
}) {
  const isOff = (tool: Tool) => {
    if (locked) return true
    if (!editing || !tool.command) return Boolean(tool.off)
    if (tool.command === 'undo') return !format.undo
    if (tool.command === 'redo') return !format.redo
    if (tool.command === 'indent' || tool.command === 'outdent') return !format.inList
    return false
  }
  return (
    <div
      role="toolbar"
      aria-label="Question text"
      // Pressing a tool must not take the caret, or the selection, out of the question text.
      onMouseDown={(e) => e.preventDefault()}
      style={{ flexShrink: 0, display: 'flex', alignItems: 'flex-start', gap: 8, minHeight: 42, boxSizing: 'border-box', padding: '7px 10px 7px 4px', background: TOOLBAR }}
    >
      {/* Wraps onto more rows when the editor is narrow, as the product's does. */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexWrap: 'wrap', alignItems: 'center', rowGap: 4 }}>
        {TOOL_GROUPS.map((group, g) => (
          <div key={g} style={{ display: 'flex', alignItems: 'center' }}>
            {group.map((tool) => {
              const off = isOff(tool)
              const pressed = Boolean(tool.toggle && tool.command && format.on.has(tool.command))
              return (
                <button
                  key={tool.label}
                  type="button"
                  aria-label={tool.label}
                  title={tool.label}
                  aria-pressed={tool.toggle ? pressed : undefined}
                  disabled={off}
                  data-disabled={off || undefined}
                  onClick={() => tool.command && onRun(tool.command)}
                  className="inspera-interactive inspera-row"
                  style={{
                    ...reset, width: 28, height: 28, borderRadius: 3, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    color: off ? TOOL_OFF : tool.color ?? TOOL, cursor: off ? 'default' : 'pointer',
                    '--inspera-row-bg': pressed ? PRESSED : undefined,
                  } as CSSProperties}
                >
                  {tool.icon
                    ? icon(tool.icon, 18, tool.fill ? { fontVariationSettings: "'FILL' 1" } : undefined)
                    : <span aria-hidden style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 600 }}>{tool.glyph}</span>}
                </button>
              )
            })}
            <span aria-hidden style={{ width: 1, height: 20, margin: '0 2px', background: '#bcbcbc' }} />
          </div>
        ))}
      </div>
      <button
        type="button"
        disabled={locked}
        data-disabled={locked || undefined}
        className="inspera-interactive inspera-row"
        style={{
          ...reset, flexShrink: 0, height: 28, padding: '0 4px', borderRadius: 3, display: 'inline-flex', alignItems: 'center', gap: 2,
          fontSize: 15, color: locked ? INSERT_OFF : '#000', cursor: locked ? 'default' : 'pointer',
        }}
      >
        {icon('add', 18, { fontVariationSettings: "'wght' 700" })}
        Insert
      </button>
    </div>
  )
}

/** The candidate's answer box, shown greyed out as a preview inside an essay. */
function EssayAnswerBox() {
  const group = (glyphs: ReactNode[]) => (
    <span style={{ display: 'inline-flex', border: '1px solid #d6d6d6', borderRadius: 3, background: 'linear-gradient(#ffffff, #f2f2f2)' }}>
      {glyphs.map((g, i) => (
        <span key={i} style={{ width: 22, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#c3c3c3', fontSize: 14 }}>
          {g}
        </span>
      ))}
    </span>
  )
  return (
    <div style={{ maxWidth: 512, marginTop: 8, border: '1px solid #ededed', background: 'var(--white)' }}>
      <div
        aria-hidden
        style={{
          display: 'flex', gap: 6, padding: '4px 6px', background: 'linear-gradient(#ffffff, #f8f8f8)',
          borderBottom: '1px solid #e6e6e6', boxShadow: '0 4px 6px -4px rgba(0, 0, 0, 0.12)',
        }}
      >
        {group([<strong key="b" style={{ fontFamily: 'var(--font-serif)' }}>B</strong>, <em key="i" style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}>I</em>])}
        {group([icon('format_list_numbered', 15), icon('format_list_bulleted', 15)])}
        {group([icon('format_indent_decrease', 15), icon('format_indent_increase', 15)])}
        {group([icon('link', 15), icon('link_off', 15)])}
        {group([<strong key="help">?</strong>])}
      </div>
      <p style={{ margin: 0, minHeight: 139, padding: '14px 10px', fontSize: 14, color: 'var(--text-placeholder)' }}>
        Candidates will enter their answer here
      </p>
    </div>
  )
}

/**
 * The interaction under the question text - the choices, or the essay box - as
 * the candidate will see it. Clicking it selects it: a blue frame, and its
 * settings in the panel on the right.
 */
function AnswerArea({
  id,
  question,
  prompt,
  selected,
  muted,
  outlined,
  onSelect,
  onDeselect,
}: {
  id: string
  question: Question
  prompt: string
  selected: boolean
  /** Grayed while the question text is edited. */
  muted: boolean
  /** Dotted while the pointer is over the editor. */
  outlined: boolean
  onSelect: () => void
  onDeselect: () => void
}) {
  // The selected interaction shows its remove button while the pointer is over it.
  const [over, setOver] = useState(false)
  const essay = question.kind === 'essay'
  const ink = muted ? MUTED_BLOCK : INK
  return (
    <div onMouseEnter={() => setOver(true)} onMouseLeave={() => setOver(false)} style={{ position: 'relative', margin: '6px 4px 0' }}>
      <div
        id={id}
        role="button"
        tabIndex={0}
        aria-label={`${question.type} interaction`}
        aria-current={selected || undefined}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect()
          } else if (e.key === 'Escape' && selected) {
            e.preventDefault()
            onDeselect()
          }
        }}
        className="inspera-interactive"
        style={{
          padding: essay ? '11px 10px 10px' : '11px 10px 23px', background: ANSWER_AREA,
          // Left unset otherwise, so the keyboard focus ring still shows.
          outline: selected ? `2px solid ${FOCUS}` : outlined ? `2px dotted ${OUTLINE}` : undefined,
        }}
      >
        <p style={{ margin: 0, fontSize: 15, lineHeight: '20px', fontWeight: 600, color: ink }}>{prompt}</p>
        {essay ? (
          <EssayAnswerBox />
        ) : (
          <ul style={{ listStyle: 'none', margin: '7px 0 0', padding: 0 }}>
            {question.alternatives?.map((alt) => (
              <li key={alt} style={{ display: 'flex', alignItems: 'center', gap: 6, height: 26, fontSize: 15, color: ink }}>
                {/* A ring for one answer, a square for several. */}
                <span
                  aria-hidden
                  style={{
                    width: 11, height: 11, flexShrink: 0, boxSizing: 'border-box', border: `2px solid ${ink}`,
                    borderRadius: question.kind === 'multiple' ? 2 : '50%',
                  }}
                />
                {alt}
              </li>
            ))}
          </ul>
        )}
      </div>
      {selected && over && (
        <button
          type="button"
          aria-label="Remove interaction"
          title="Remove interaction"
          className="inspera-interactive"
          style={{ ...reset, background: 'none', position: 'absolute', top: 8, right: 6, display: 'inline-flex', color: HINT }}
        >
          {icon('close', 20, { fontVariationSettings: "'wght' 700" })}
        </button>
      )}
    </div>
  )
}

/** Lists added to the question text keep their markers, which Tailwind's preflight removes. */
const QUESTION_TEXT_CSS =
  '.na-question-text ol { list-style: decimal; padding-left: 24px } .na-question-text ul { list-style: disc; padding-left: 24px }'

/**
 * The question's own text, edited in place. It is written into the page once,
 * when it mounts, and the browser owns it from then on - so React never resets
 * the caret while the author types.
 */
function QuestionText({
  html,
  muted,
  textRef,
  onChange,
  onFocus,
  onBlur,
}: {
  html: string
  /** Grayed while the interaction is selected. */
  muted: boolean
  textRef: RefObject<HTMLDivElement | null>
  onChange: (html: string) => void
  onFocus: () => void
  onBlur: () => void
}) {
  // One object for the life of the element: React 19 compares it by identity,
  // and a new one on each render rewrote the text after every keystroke.
  const [markup] = useState(() => ({ __html: html }))
  return (
    <div
      ref={textRef}
      className="na-question-text"
      contentEditable
      role="textbox"
      aria-multiline
      aria-label="Question text"
      onInput={(e) => onChange(e.currentTarget.innerHTML)}
      onFocus={onFocus}
      onBlur={onBlur}
      dangerouslySetInnerHTML={markup}
      style={{
        minHeight: 20, fontSize: 15, lineHeight: '20px', color: muted ? MUTED_STEM : INK,
        // The editor's frame turns blue instead, as in the product.
        outline: 'none', cursor: 'text', overflowWrap: 'anywhere',
      }}
    />
  )
}

function Editor({
  question,
  stem,
  prompt,
  revision,
  interactionId,
  selected,
  onStemChange,
  onSelect,
  onDeselect,
}: {
  question: Question
  /** The question text, as HTML. */
  stem: string
  /** The interaction's prompt. */
  prompt: string
  /** Bumped by Cancel, so the text starts again from the saved copy. */
  revision: number
  interactionId: string
  /** The interaction is selected, and the settings panel shows its settings. */
  selected: boolean
  onStemChange: (html: string) => void
  onSelect: () => void
  onDeselect: () => void
}) {
  // The product outlines the editor and its answer area with dots while the pointer is over it.
  const [hover, setHover] = useState(false)
  const [editing, setEditing] = useState(false)
  const [format, setFormat] = useState(NO_FORMAT)
  const textRef = useRef<HTMLDivElement>(null)

  // The toolbar follows the caret: what is bold there, what can be undone, whether it is in a list.
  useEffect(() => {
    const update = () => setFormat(readFormat(textRef.current))
    document.addEventListener('selectionchange', update)
    return () => document.removeEventListener('selectionchange', update)
  }, [])

  // Runs a toolbar command on the question text. The browser's own editing
  // commands do the work; they are deprecated but still supported everywhere.
  const run = (command: string) => {
    const el = textRef.current
    if (!el) return
    el.focus()
    const selection = document.getSelection()
    if (selection && !(selection.anchorNode && el.contains(selection.anchorNode))) {
      // Nothing chosen in the text yet: carry on from its end.
      const range = document.createRange()
      range.selectNodeContents(el)
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
    }
    document.execCommand(command)
    setFormat(readFormat(el))
  }

  return (
    <section
      aria-label="Question editor"
      style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', padding: '0 0 14px 1px' }}
    >
      <style href="na-question-text" precedence="default">{QUESTION_TEXT_CSS}</style>
      <div style={{ flexShrink: 0, height: 64, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <h2
          style={{
            margin: '5px 0 0', minWidth: 0, fontSize: 14, fontWeight: 400, lineHeight: '20px', color: INK,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}
        >
          <strong style={{ fontWeight: 600 }}>{numberOf(question.id)}</strong> {question.type}/{question.title}
        </h2>
        <div style={{ alignSelf: 'flex-end', flexShrink: 0, display: 'flex', alignItems: 'flex-end', gap: 10 }}>
          <button
            type="button"
            aria-label="Content language: English"
            className="inspera-interactive"
            style={{
              ...reset, height: 39, padding: '0 10px', border: '1px solid var(--gray-300)', borderRadius: '4px 4px 0 0',
              background: '#404040', color: 'var(--white)', fontSize: 14,
            }}
          >
            English
          </button>
          <button
            type="button"
            aria-label="Editor settings"
            title="Editor settings"
            className="inspera-interactive"
            style={{
              ...reset, width: 38, height: 38, marginBottom: 1, borderRadius: '50%', background: 'var(--gray-100)', color: '#000',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {icon('settings', 22)}
          </button>
        </div>
      </div>

      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
          border: editing ? `2px solid ${FOCUS}` : hover ? `2px dotted ${OUTLINE}` : `2px solid ${FRAME}`,
        }}
      >
        <Toolbar locked={selected} editing={editing} format={format} onRun={run} />
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '26px 38px 40px' }}>
          <QuestionText
            key={`${question.id}-${revision}`}
            html={stem}
            muted={selected}
            textRef={textRef}
            onChange={onStemChange}
            onFocus={() => {
              setEditing(true)
              // Editing the text puts the question's own settings back in the panel.
              onDeselect()
            }}
            onBlur={() => setEditing(false)}
          />
          <AnswerArea
            id={interactionId}
            question={question}
            prompt={prompt}
            selected={selected}
            muted={editing}
            outlined={hover && !editing}
            onSelect={onSelect}
            onDeselect={onDeselect}
          />
        </div>
      </div>
    </section>
  )
}

/* --- Settings panel ----------------------------------------------------- */

/** One of the settings panel's collapsible sections. */
function SettingsSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string
  open: boolean
  onToggle: () => void
  children: ReactNode
}) {
  const bodyId = useId()
  return (
    <div style={{ marginBottom: 12 }}>
      <h3 style={{ margin: 0 }}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={onToggle}
          className="inspera-interactive"
          style={{
            ...reset, background: 'none', width: 'calc(100% + 4px)', marginLeft: -4, padding: '9px 0',
            display: 'flex', alignItems: 'center', gap: 5, fontSize: 16, fontWeight: 500, lineHeight: '22px', color: HEADING, textAlign: 'left',
          }}
        >
          {icon(open ? 'expand_more' : 'chevron_right', 22, { fontVariationSettings: "'wght' 600" })}
          {title}
        </button>
      </h3>
      <div id={bodyId} hidden={!open} style={{ paddingBottom: 9 }}>
        {children}
      </div>
    </div>
  )
}

/** The dark dropdown at the head of Marks. */
function DarkSelect({ label, value }: { label: string; value: string }) {
  return (
    <span style={{ position: 'relative', display: 'block' }}>
      <select
        aria-label={label}
        defaultValue={value}
        className="inspera-interactive"
        style={{
          appearance: 'none', WebkitAppearance: 'none', width: '100%', height: 36, padding: '0 34px 0 10px',
          border: 'none', borderRadius: 3, background: DARK_SELECT, color: 'var(--white)',
          fontFamily: 'var(--font-sans)', fontSize: 15, cursor: 'pointer',
        }}
      >
        <option>{value}</option>
      </select>
      {icon('expand_more', 18, { position: 'absolute', right: 10, top: 9, color: 'var(--white)', pointerEvents: 'none' })}
    </span>
  )
}

/** The product's checkbox: a gray square that fills dark when ticked. */
function MarksCheckbox({
  label,
  hint,
  muted = false,
  checked,
  onChange,
}: {
  label: string
  hint: ReactNode
  /** Lighter, looser hint text, as under the AI-marking option. */
  muted?: boolean
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  const hintId = useId()
  return (
    <div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: INK, cursor: 'pointer' }}>
        <span style={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            aria-describedby={hintId}
            className="inspera-interactive"
            style={{
              appearance: 'none', WebkitAppearance: 'none', margin: 0, width: 20, height: 20, borderRadius: 4,
              background: checked ? STEPPER : FRAME, cursor: 'pointer',
            }}
          />
          {checked && icon('check', 16, { position: 'absolute', inset: 0, margin: 'auto', width: 16, height: 16, color: 'var(--white)', pointerEvents: 'none' })}
        </span>
        {label}
      </label>
      <p
        id={hintId}
        style={{ margin: muted ? '3px 0 0 26px' : '4px 0 0 26px', fontSize: 12, lineHeight: muted ? '19px' : '14px', color: muted ? HINT : INK }}
      >
        {hint}
      </p>
    </div>
  )
}

/**
 * A marks field: dark arrow buttons either side of a number box. The arrows
 * step by one; typed values may be negative and carry up to two decimals, and
 * the box may be left empty.
 */
function MarkStepper({ label, value, onChange }: { label: string; value: number | null; onChange: (value: number | null) => void }) {
  const inputId = useId()
  const shown = value === null ? '' : String(value)
  // What is typed, kept apart from the value so "-" or "1." can be entered on the way to a number.
  const [draft, setDraft] = useState(shown)
  useEffect(() => setDraft(shown), [shown])

  const arrow = (dir: -1 | 1) => (
    <button
      type="button"
      aria-label={`${dir < 0 ? 'Decrease' : 'Increase'} ${label.toLowerCase()}`}
      onClick={() => onChange(round((value ?? 0) + dir))}
      className="inspera-interactive"
      style={{
        ...reset, width: 31, height: 36, flexShrink: 0, borderRadius: 3, background: STEPPER, color: 'var(--white)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {icon(dir < 0 ? 'arrow_left' : 'arrow_right', 24)}
    </button>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label htmlFor={inputId} style={{ fontSize: 14, fontWeight: 500, lineHeight: '16px', color: INK }}>{label}</label>
      {/* The product insets the arrows a few pixels from the fields above. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 5 }}>
        {arrow(-1)}
        <input
          id={inputId}
          type="text"
          inputMode="decimal"
          value={draft}
          onChange={(e) => {
            const text = e.target.value.trim()
            setDraft(e.target.value)
            if (text === '') onChange(null)
            else if (/^-?\d+(\.\d{1,2})?$/.test(text)) onChange(Number(text))
          }}
          onBlur={() => setDraft(shown)}
          className="inspera-interactive"
          style={{
            width: 72, height: 36, boxSizing: 'border-box', padding: '0 8px', border: `2px solid ${FRAME}`, borderRadius: 3,
            background: 'var(--white)', color: '#34495e', fontFamily: 'var(--font-sans)', fontSize: 16, textAlign: 'right',
          }}
        />
        {arrow(1)}
      </div>
    </div>
  )
}

function MarksSettings({ question, settings, onChange }: { question: Question; settings: Settings; onChange: (next: Settings) => void }) {
  const setMark = (key: string, value: number | null) => onChange({ ...settings, marks: { ...settings.marks, [key]: value } })
  const setChecked = (checked: boolean) => onChange({ ...settings, checked })
  const help = (
    <p style={{ margin: '10px 0 0', fontSize: 12, lineHeight: '14px', color: INK }}>
      Positive and negative numbers allowed.
      <br />
      Maximum 2 decimals.
    </p>
  )

  if (question.kind === 'essay') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginTop: 4 }}>
          <MarksCheckbox
            label="Enable AI-supported marking"
            hint={<>Add rubrics to enable AI suggestion during marking. <LearnMore /></>}
            muted
            checked={settings.checked}
            onChange={setChecked}
          />
        </div>
        <div style={{ marginTop: 12 }}><DarkSelect label="Marking scheme" value="Maximum marks" /></div>
        {help}
        <div style={{ marginTop: 16 }}>
          <MarkStepper label="Maximum marks" value={settings.marks.max ?? null} onChange={(v) => setMark('max', v)} />
        </div>
        <div style={{ display: 'flex', margin: '2px 0 7px' }}><LearnMore /></div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginTop: 5 }}><DarkSelect label="Marking scheme" value="Default" /></div>
      {help}
      <div style={{ marginTop: 14 }}>
        <MarksCheckbox label="By alternative" hint="Set individual marks per alternative" checked={settings.checked} onChange={setChecked} />
      </div>
      {CHOICE_FIELDS.map((field, i) => (
        <div key={field.key} style={{ marginTop: i === 0 ? 14 : 12 }}>
          <MarkStepper label={field.label} value={settings.marks[field.key] ?? null} onChange={(v) => setMark(field.key, v)} />
        </div>
      ))}
      <div style={{ display: 'flex', marginTop: 11 }}><LearnMore /></div>
    </div>
  )
}

/** The selected interaction's prompt, edited here as plain text. */
function PromptSettings({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const fieldId = useId()
  // Inline styles cannot say :focus, so the field tracks it to turn its border blue.
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 5 }}>
      <label htmlFor={fieldId} style={{ fontSize: 13, lineHeight: '16px', color: HEADING }}>Prompt</label>
      <textarea
        id={fieldId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: 250, maxWidth: '100%', height: 100, marginTop: 9, boxSizing: 'border-box', padding: '6px 8px',
          border: `2px solid ${focused ? FOCUS : FRAME}`, borderRadius: 3, outline: 'none', resize: 'vertical',
          background: 'var(--white)', color: INK, fontFamily: 'var(--font-sans)', fontSize: 14, lineHeight: '19px',
        }}
      />
      <button
        type="button"
        className="inspera-interactive"
        style={{
          ...reset, background: 'none', alignSelf: 'flex-start', marginTop: 10,
          display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 13, lineHeight: '18px', color: HINT,
        }}
      >
        Rich text
        {icon('edit', 13)}
      </button>
    </div>
  )
}

/** Cancel / Save: gray and inert until something changes, when Save turns blue. */
function PanelButton({ label, enabled, primary = false, onClick }: { label: string; enabled: boolean; primary?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      disabled={!enabled}
      onClick={onClick}
      className="inspera-interactive"
      style={{
        ...reset, height: 45, padding: '0 25px', borderRadius: 3, fontSize: 16, fontWeight: enabled && primary ? 600 : 500,
        background: !enabled ? BUTTON_OFF : primary ? 'var(--blue-700)' : CANCEL_ON,
        color: !enabled ? BUTTON_OFF_TEXT : primary ? 'var(--white)' : CANCEL_ON_TEXT,
        cursor: enabled ? 'pointer' : 'default',
      }}
    >
      {label}
    </button>
  )
}

function SettingsPanel({
  question,
  settings,
  onChange,
  interaction,
  prompt,
  onPromptChange,
  onCloseInteraction,
  open,
  onToggle,
  dirty,
  onCancel,
  onSave,
}: {
  question: Question
  settings: Settings
  onChange: (next: Settings) => void
  /** The interaction is selected: show its settings in place of the question's. */
  interaction: boolean
  prompt: string
  onPromptChange: (prompt: string) => void
  onCloseInteraction: () => void
  open: Set<string>
  onToggle: (title: string) => void
  dirty: boolean
  onCancel: () => void
  onSave: () => void
}) {
  const sections = interaction ? interactionSectionsFor(question) : settingsSectionsFor(question)
  return (
    <aside
      aria-label={interaction ? 'Interaction settings' : 'Question settings'}
      style={{ width: 318, flexShrink: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ flexShrink: 0, height: 64, boxSizing: 'border-box', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', gap: 4, padding: '4px 16px 0 0' }}>
        <PanelButton label="Cancel" enabled={dirty} onClick={onCancel} />
        <PanelButton label="Save" enabled={dirty} primary onClick={onSave} />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '7px 37px 24px 16px' }}>
        {sections.map((title) => (
          <SettingsSection key={title} title={title} open={open.has(title)} onToggle={() => onToggle(title)}>
            {title === 'Marks' ? (
              // Keyed by question, so each question's fields start from its own values.
              <MarksSettings key={question.id} question={question} settings={settings} onChange={onChange} />
            ) : title === 'Prompt' ? (
              <PromptSettings value={prompt} onChange={onPromptChange} />
            ) : (
              <p style={{ margin: '2px 0 0', fontSize: 13, color: HINT }}>This section is not in the kit yet.</p>
            )}
          </SettingsSection>
        ))}
        {interaction && (
          <button
            type="button"
            onClick={onCloseInteraction}
            className="inspera-interactive"
            style={{ ...reset, marginTop: 5, height: 36, padding: '0 13px', borderRadius: 3, background: CLOSE, color: 'var(--white)', fontSize: 15 }}
          >
            Close
          </button>
        )}
      </div>
    </aside>
  )
}

/* --- Page --------------------------------------------------------------- */

export default function NewAuthor() {
  const [tab, setTab] = useState('questions')
  const [selectedId, setSelectedId] = useState('mcq')
  const [saved, setSaved] = useState(INITIAL_DRAFT)
  const [draft, setDraft] = useState(INITIAL_DRAFT)
  // Bumped by Cancel, so the question text is written afresh from the saved copy.
  const [revision, setRevision] = useState(0)
  const [interactionSelected, setInteractionSelected] = useState(false)
  // Every section starts collapsed. Kept per section title, so a section
  // stays open from one question to the next.
  const [open, setOpen] = useState<Set<string>>(() => new Set())
  const [collapsed, setCollapsed] = useState(false)
  const interactionId = useId()

  const question = QUESTIONS.find((q) => q.id === selectedId) ?? QUESTIONS[0]
  const totals = Object.fromEntries(QUESTIONS.map((q) => [q.id, totalMarks(q, draft.settings[q.id])]))
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved)

  const selectQuestion = (id: string) => {
    setSelectedId(id)
    setInteractionSelected(false)
  }
  const changeTab = (next: string) => {
    setTab(next)
    // The editor closes while Resources shows; back on Questions, the question's own settings return.
    setInteractionSelected(false)
  }
  const closeInteraction = () => {
    setInteractionSelected(false)
    // Back to the interaction the settings belonged to, for keyboard users.
    document.getElementById(interactionId)?.focus()
  }
  const toggleSection = (title: string) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(title)) next.delete(title)
      else next.add(title)
      return next
    })

  return (
    <div
      style={{
        display: 'flex', height: '100%', minHeight: 'max(100%, 720px)',
        background: 'var(--white)', fontFamily: 'var(--font-sans)', color: INK,
      }}
    >
      <ToolRail />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
          {collapsed ? (
            <div style={{ width: 40, flexShrink: 0, display: 'flex', justifyContent: 'center', paddingTop: 10 }}>
              <IconButton label="Expand the questions panel" size={28} onClick={() => setCollapsed(false)}>
                {icon('chevron_right', 20, { color: 'var(--gray-700)' })}
              </IconButton>
            </div>
          ) : (
            <QuestionsPanel
              tab={tab}
              onTabChange={changeTab}
              totals={totals}
              selectedId={question.id}
              onSelect={selectQuestion}
              onCollapse={() => setCollapsed(true)}
            />
          )}
          {/* The divider between the panel and the editor: a light line between two gray ones. */}
          <div aria-hidden style={{ width: 3, flexShrink: 0, boxSizing: 'border-box', borderLeft: '1px solid #c6c6c6', borderRight: '1px solid #c6c6c6', background: '#eeeeee' }} />
          {tab === 'resources' ? (
            // No resource is open, so the editor's place stays empty, as in the product.
            <div style={{ flex: 1 }} />
          ) : (
            <>
              <Editor
                question={question}
                stem={draft.stems[question.id]}
                prompt={draft.prompts[question.id]}
                revision={revision}
                interactionId={interactionId}
                selected={interactionSelected}
                onStemChange={(html) => setDraft((d) => ({ ...d, stems: { ...d.stems, [question.id]: html } }))}
                onSelect={() => setInteractionSelected(true)}
                onDeselect={() => setInteractionSelected(false)}
              />
              <SettingsPanel
                question={question}
                settings={draft.settings[question.id]}
                onChange={(next) => setDraft((d) => ({ ...d, settings: { ...d.settings, [question.id]: next } }))}
                interaction={interactionSelected}
                prompt={draft.prompts[question.id]}
                onPromptChange={(text) => setDraft((d) => ({ ...d, prompts: { ...d.prompts, [question.id]: text } }))}
                onCloseInteraction={closeInteraction}
                open={open}
                onToggle={toggleSection}
                dirty={dirty}
                onCancel={() => {
                  setDraft(saved)
                  setRevision((r) => r + 1)
                }}
                onSave={() => setSaved(draft)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
