import {
  type CSSProperties, type MouseEvent, type ReactNode, Fragment, createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef,
  useState,
} from 'react'
import {
  Alert, Avatar, AvatarGroup, Badge, Breadcrumb, Button, Card, Checkbox, CheckboxGroup, CommandPalette, DatePicker,
  Dialog, Divider, Drawer, EmptyState, FormField, Link, List, Menu, NumberInput, Progress, RadioButton, RadioGroup, Rating,
  SegmentedControl, Select, Skeleton, Snackbar, Spinner, Stat, Table, Tag, TextInput, Textarea, Toggle, Tooltip,
  type BadgeIntent, type ButtonProps, type CommandPaletteProps, type DialogProps, type DividerProps, type DrawerProps,
  type DrawerSide, type DrawerSize, type SkeletonProps, type SnackbarProps, type SpinnerProps, type TooltipProps,
} from '../components/inspera'
import { labelStyle } from '../components/inspera/FormField'
import { OverlayBoundary } from '../components/inspera/overlay'
import { components } from '../data/components'
import { type Lock, locksFor, propsFor, registry, renderLive, renderStill } from './registry'

/**
 * The playground's "In context" view: the live component, with the current
 * control values, placed in a slice of a real Inspera screen - so a reader
 * sees where it belongs and which variant fits, not just what it looks like.
 *
 * A scene only places the component and gives it believable copy. Its variant
 * and state props are always exactly the playground's, so what the scene shows
 * is what the code below it builds. Why a variant belongs here is not written
 * in the scene: it comes from `usage.variants` in components.ts, which is also
 * what the AI spec says.
 *
 * Three rules keep a scene from looking staged:
 * - The component sits where its pattern lives. A page's action is at the
 *   right of its title, a form's in the footer, a card's in its header, a
 *   row's at the row's end, a bulk action in the selection bar, a filter in
 *   the filter bar. Never floating beside a paragraph.
 * - Nothing around it competes. One Primary per view, and the neighbours are
 *   the ones that explain the variant - Cancel and Next beside Save draft.
 * - Forms are one column, each field as wide as its content. A 220px Select
 *   beside a full-width input in a two-column grid reads as a mistake.
 *
 * The chrome - the global nav, the breadcrumb bar, the grey canvas, the
 * toolbar well, the step footer - copies the real screens rebuilt in the
 * Pages kits, so a scene reads as Inspera rather than as a wireframe.
 *
 * A scene is live. What people do in it works: a switch turns on the field it
 * guards, select-all ticks the rows, tabs and pages change what is under them,
 * Cancel closes the dialog. That state lives in `SceneState` and goes back to
 * the playground's values whenever a control changes.
 */
export interface Scene {
  /**
   * Where this is in the product: "Deliver › Tests › New test". The first
   * part lights up in the global nav; from three parts on, the rest becomes
   * the breadcrumb bar, as on the product's inner pages.
   */
  location: string
  /** The grey app canvas behind forms and dashboards; rosters sit on white. */
  canvas?: boolean
  /** The control values this scene is for; the first scene that matches wins. Omitted on the fallback. */
  when?: Record<string, string[]>
  /**
   * Values this scene is not for, even when `when` matches - a label "or" the
   * scene has no two ways for, say. Those values fall through to a later scene.
   */
  unless?: Record<string, string[]>
  /**
   * The controls whose caption lines this scene shows: what it was built to
   * explain. Defaults to its `when` keys, or, for the fallback, the controls at
   * their default values. A value the scene does not demonstrate - Small in a
   * read-only form - gets no line, rather than one about another screen.
   */
  demonstrates?: string[]
  /**
   * Controls this scene cannot show, held at a value with the reason - a mixed
   * state on a lone setting, say. The props rail greys them out in context, as
   * it does the registry's `locks`. Holding them must not change which scene
   * the values pick.
   */
  locks?: (v: Record<string, string>) => Record<string, Lock>
  /**
   * Display copy for the slot - labels, options, a value. Never a variant: a
   * state only as what people did in the scene (`s`), such as the switch that
   * enables the field.
   */
  copy?: (v: Record<string, string>, s: SceneState) => Record<string, unknown>
  /** Put the gallery's static form in the slot: an open panel or an embedded overlay. */
  still?: boolean
  /**
   * Draws the slot in this scene's own form, when neither the live nor the
   * gallery form fits: a drawer docked to the edge of the screen, a toast with
   * the scene's message. It gets the playground's props with `copy` over them
   * and must pass them on - it may add presentation, never change a variant
   * or a state.
   */
  slot?: (p: Record<string, unknown>, v: Record<string, string>, s: SceneState) => ReactNode
  /**
   * Opens the slot above the whole screen, nav included, where a Dialog,
   * Drawer, Command Palette or toast really appears. `render` then draws only
   * the page underneath, and gets no slot.
   */
  overlay?: (v: Record<string, string>) => Overlay
  /** A screen before sign-in, so no product nav. */
  bare?: boolean
  render: (slot: ReactNode, v: Record<string, string>, s: SceneState) => ReactNode
}

/**
 * What people have done in a scene, kept until a control changes - then the
 * scene starts again from the playground's values.
 */
export interface SceneState {
  /** A value the scene keeps while people use it: a tab, a ticked row, a switch. */
  get: <T>(key: string, initial: T) => T
  set: (key: string, value: unknown) => void
  /**
   * Closes what the scene is about: the dialog, drawer or palette (Cancel, the
   * close button, Escape, the scrim), or the alert, toast or snackbar. Show
   * again, beside Highlight, brings it back.
   */
  dismiss: () => void
}

/**
 * How far the scene's footer moves down to make room for a panel the
 * component opens past it. The footer takes the room above itself, so it
 * stays at the foot of the screen instead of floating over blank canvas.
 */
const FooterRoom = createContext(0)

/**
 * Where an overlay opens. A modal panel is centred (Dialog), near the top
 * (Command Palette) or docked to an edge (Drawer); a toast sits in a corner
 * or at the middle of the top or bottom edge.
 */
export type OverlayPlace =
  | 'Center' | 'Top' | 'Left' | 'Right' | 'Bottom'
  | 'TopLeft' | 'TopCenter' | 'TopRight' | 'BottomLeft' | 'BottomCenter' | 'BottomRight'

export interface Overlay {
  place: OverlayPlace
  /** Dim the page and block it, as a modal does. */
  scrim?: boolean
  /** For a toast along the top: how far below the nav it starts, to keep clear of the page title and its action. */
  below?: number
}

// ---------------------------------------------------------------------------
// Page building blocks - the product's own structure, around library components.
// ---------------------------------------------------------------------------

const caption: CSSProperties = {
  margin: 0,
  fontSize: 'var(--paragraph-captions-size)',
  lineHeight: 'var(--paragraph-captions-line-height)',
  color: 'var(--text-secondary)',
}
const body: CSSProperties = { margin: 0, fontSize: 14, lineHeight: '20px', color: 'var(--text-primary)' }
const column = (gap = 'var(--space-5)', maxWidth?: number): CSSProperties => ({ display: 'flex', flexDirection: 'column', gap, maxWidth, minWidth: 0 })
const row: CSSProperties = { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }
const hairline = 'var(--border-width-default) solid var(--border)'
/** Links in a scene look and behave like links, but must not move the docs' hash route. */
const stay = (e: MouseEvent<HTMLAnchorElement>) => e.preventDefault()
const noop = () => {}

/** The page title, with the item count the product's rosters show beside it. */
function PageTitle({ title, count, aside, actions, sub }: { title: string; count?: string; aside?: ReactNode; actions?: ReactNode; sub?: string }) {
  return (
    <div style={column('var(--space-1)')}>
      <div style={{ ...row, justifyContent: 'space-between', gap: 'var(--space-4)' }}>
        <div style={{ ...row, gap: 'var(--space-3)', minWidth: 0 }}>
          <h3 className="inspera-h2" style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h3>
          {aside}
        </div>
        {(count || actions) && (
          <div style={{ ...row, gap: 'var(--space-4)' }}>
            {count && <span style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-primary)' }}>{count}</span>}
            {actions}
          </div>
        )}
      </div>
      {sub && <p style={{ ...body, color: 'var(--text-secondary)' }}>{sub}</p>}
    </div>
  )
}

/** A white panel on the grey canvas, with an optional title bar and action. */
function Panel({ title, action, flush = false, children }: { title?: string; action?: ReactNode; flush?: boolean; children: ReactNode }) {
  return (
    <div style={{ background: 'var(--surface)', border: hairline, borderRadius: 'var(--radius-md)', minWidth: 0 }}>
      {title && (
        <div style={{ ...row, justifyContent: 'space-between', minHeight: 56, padding: 'var(--space-2) var(--space-5)', borderBottom: hairline }}>
          <h4 className="inspera-h4" style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h4>
          {action}
        </div>
      )}
      <div style={{ padding: flush ? 0 : 'var(--space-5)' }}>{children}</div>
    </div>
  )
}

/** A form: one column, fields stacked, each as wide as what goes in it. */
function FormColumn({ children }: { children: ReactNode }) {
  return <div style={column('var(--space-4)', 480)}>{children}</div>
}

/** A field for a short value - a code, an ID - kept short, so its width says so. */
function Short({ children }: { children: ReactNode }) {
  return <div style={{ width: 240, maxWidth: '100%' }}>{children}</div>
}

/**
 * The grey well above a roster, as on the real Deliver and Monitor pages:
 * search across the top with any action of the same height beside it, quick
 * filters on their own line below - so 40px fields and 32px chips never share
 * a row.
 */
function ToolbarWell({ label = 'Search tests', query, action, children }: { label?: string; query?: string; action?: ReactNode; children?: ReactNode }) {
  return (
    <div style={{ ...column('var(--space-2)'), padding: 'var(--space-2)', background: 'var(--gray-100)', border: hairline, borderRadius: 'var(--radius-md)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <TextInput label={label} showLabel={false} placeholder="Search" leadingIcon="search" defaultValue={query} />
        </div>
        {action}
      </div>
      {children && <div style={row}>{children}</div>}
    </div>
  )
}

/** A roster quick filter. A picture of one, so it adds no stops to the tab order. */
function Chip({ label, icon }: { label: string; icon?: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 var(--space-3)', fontSize: 13, fontWeight: 500, color: 'var(--gray-800)', background: 'var(--surface)', border: 'var(--border-width-default) solid var(--border-strong)', borderRadius: 'var(--radius-sm)', whiteSpace: 'nowrap' }}>
      {icon && <span className="material-symbols-outlined" style={{ fontSize: 17 }} aria-hidden>{icon}</span>}
      {label}
    </span>
  )
}

const QUICK_FILTERS = (
  <>
    <Chip label="Starts today" />
    <Chip label="Starts tomorrow" />
    <Chip label="Created by me" />
    <Chip label="Filters" icon="filter_list" />
  </>
)

/**
 * The documented filter bar: labelled filters in a row, top-aligned so an
 * error message under one field never pushes the others down. An action in
 * the bar goes in `FieldAction`, which lines it up with the fields.
 */
function FilterBar({ children }: { children: ReactNode }) {
  return <div style={{ ...row, alignItems: 'flex-start', gap: 'var(--space-3)' }}>{children}</div>
}

/**
 * An action beside labelled fields, lined up with the fields rather than their
 * labels: an invisible label of the same size sits above it, so it stays put
 * when a field below shows an error.
 */
function FieldAction({ children }: { children: ReactNode }) {
  return (
    <div style={column('var(--space-1)')}>
      <span aria-hidden style={{ ...labelStyle, visibility: 'hidden' }}>.</span>
      <div style={row}>{children}</div>
    </div>
  )
}

/**
 * Why a control is unavailable, said next to it - a disabled button cannot
 * show a tooltip, and its reason must not depend on one.
 */
function Reason({ children }: { children: ReactNode }) {
  return (
    <span style={{ ...caption, display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)' }}>
      <span className="material-symbols-outlined" style={{ fontSize: 16 }} aria-hidden>info</span>
      {children}
    </span>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div style={column('var(--space-1)')}>
      <span style={caption}>{label}</span>
      <span style={{ ...body, fontWeight: 500 }}>{value}</span>
    </div>
  )
}

function Tiles({ children }: { children: ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 'var(--space-4)' }}>{children}</div>
}

const STEPS = ['Setup', 'Design', 'Settings', 'Confirm']

/** The bar along the foot of the test editor: where you are in setup, and the way on. */
function StepFooter({ children }: { children: ReactNode }) {
  const room = useContext(FooterRoom)
  return (
    <div
      data-scene-footer
      style={{
        ...row,
        justifyContent: 'space-between',
        gap: 'var(--space-4)',
        // Flush with the frame, like the product's sticky footer. Room for an
        // open panel goes above it, so it stays at the foot of the screen.
        margin: `calc(var(--space-2) + ${room}px) calc(-1 * var(--scene-pad)) calc(-1 * var(--scene-pad))`,
        padding: 'var(--space-3) var(--scene-pad)',
        background: 'var(--surface)',
        borderTop: hairline,
        borderRadius: '0 0 calc(var(--radius-lg) - 1px) calc(var(--radius-lg) - 1px)',
      }}
    >
      <span style={{ ...row, gap: 'var(--space-1)', fontSize: 13 }}>
        {STEPS.map((s, i) => (
          <Fragment key={s}>
            {i > 0 && <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--gray-500)' }} aria-hidden>chevron_right</span>}
            <span style={{ fontWeight: i === 0 ? 600 : 400, color: i === 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{s}</span>
          </Fragment>
        ))}
      </span>
      <div style={row}>{children}</div>
    </div>
  )
}

const TESTS: { title: string; status: [string, BadgeIntent]; edited: string; starts: string }[] = [
  { title: 'Algebra Quiz', status: ['Live', 'Success'], edited: '18 Sep, 11:43', starts: '19 Sep, 09:00' },
  { title: 'History Midterm', status: ['Scheduled', 'Info'], edited: '17 Sep, 15:25', starts: '2 Oct, 10:00' },
  { title: 'Biology Final', status: ['Draft', 'Neutral'], edited: '17 Sep, 13:55', starts: 'Not set' },
]

/**
 * The Deliver tests roster: selectable, striped, titles as links - the real
 * screen's table, drawn with the library Table. `status` replaces a row's
 * badge and `title` its title link, to put the slot in the table.
 */
function TestsTable({ status, title }: { status?: (index: number) => ReactNode | undefined; title?: (index: number) => ReactNode | undefined }) {
  return (
    // The table clips its own overflow; this lets a narrow frame scroll it instead.
    <div style={{ overflowX: 'auto' }}>
      <Table
        size="Compact"
        selectable
        striped
        hoverable={false}
        // The product's roster runs edge to edge, with no box of its own.
        style={{ border: 'none', borderRadius: 0 }}
        columns={[
          { key: 'title', header: 'Title' },
          { key: 'status', header: 'Status' },
          { key: 'edited', header: 'Last edited' },
          { key: 'starts', header: 'Start time' },
        ]}
        rows={TESTS.map((t, i) => ({
          title: title?.(i) ?? <Link href="#" size="Small" onClick={stay}>{t.title}</Link>,
          status: status?.(i) ?? <Badge label={t.status[0]} intent={t.status[1]} size="Small" />,
          edited: t.edited,
          starts: t.starts,
        }))}
      />
    </div>
  )
}

/**
 * Deliver > Tests, top to bottom: title and main action, the toolbar well
 * (or a filter bar in its place), the table.
 */
function TestsRoster({ actions, toolbarAction, filters, status, note, query, empty }: {
  actions?: ReactNode
  toolbarAction?: ReactNode
  filters?: ReactNode
  status?: (i: number) => ReactNode | undefined
  /** A line under the title, such as why its action is unavailable. */
  note?: ReactNode
  /** What the search box holds. */
  query?: string
  /** Shown in the table's place when the search finds nothing. */
  empty?: ReactNode
}) {
  return (
    <div style={column('var(--space-4)')}>
      <div style={column('var(--space-2)')}>
        <PageTitle title="Tests" count="242" actions={actions} />
        {note && <div style={{ ...row, justifyContent: 'flex-end' }}>{note}</div>}
      </div>
      {filters ?? <ToolbarWell query={query} action={toolbarAction}>{QUICK_FILTERS}</ToolbarWell>}
      {empty ?? <TestsTable status={status} />}
    </div>
  )
}

const CREATE_TEST = <Button label="Create new test" intent="Primary" leadingIcon="add" />

/**
 * A Large button is the one prominent action of a candidate's screen. What it
 * says by intent, the line above it, and its icons.
 */
const LARGE_CTA: Record<string, { label: string; icon: string; trailing: string; say: string }> = {
  Primary: { label: 'Start test', icon: 'play_arrow', trailing: 'arrow_forward', say: 'The test is open. Your 45 minutes start when you press Start test.' },
  Secondary: { label: 'Try a practice question', icon: 'quiz', trailing: 'arrow_forward', say: 'The test opens at 09:00. While you wait, try a practice question.' },
  Outline: { label: 'Check my equipment', icon: 'videocam', trailing: 'arrow_forward', say: 'Check that your camera and microphone work before the test opens.' },
  Text: { label: 'Read the instructions', icon: 'menu_book', trailing: 'arrow_forward', say: 'The instructions are always one tap away, in the test toolbar.' },
  Success: { label: "I'm ready", icon: 'check', trailing: 'arrow_forward', say: 'Tell your invigilator you are ready. The test starts when everyone is.' },
  Warning: { label: 'Take a break', icon: 'coffee', trailing: 'arrow_forward', say: 'Your time stops while you are away. You have one break of 10 minutes.' },
  Destructive: { label: 'Hand in now', icon: 'send', trailing: 'arrow_forward', say: "You have 12 minutes left. Once you hand in, you can't change your answers." },
}

/** A Small button acts on the rows of a dense table, from its toolbar. What it does by intent. */
const SMALL_ACTION: Record<string, { label: string; icon: string; trailing: string; menu?: string }> = {
  Primary: { label: 'Assign scripts', icon: 'person_add', trailing: 'arrow_forward', menu: 'Assign' },
  Secondary: { label: 'Download', icon: 'download', trailing: 'download', menu: 'Download' },
  Outline: { label: 'Export', icon: 'download', trailing: 'download', menu: 'Export' },
  Text: { label: 'Clear filters', icon: 'filter_alt_off', trailing: 'close' },
  Success: { label: 'Confirm marks', icon: 'check', trailing: 'arrow_forward', menu: 'Confirm' },
  Warning: { label: 'Reopen marking', icon: 'lock_open', trailing: 'arrow_forward', menu: 'Reopen' },
  Destructive: { label: 'Delete scripts', icon: 'delete', trailing: 'arrow_forward', menu: 'Delete' },
}

/** Setting rows inside a Card: the rows bring their own vertical rhythm. */
function SettingsList({ children }: { children: ReactNode }) {
  return <div style={{ padding: '0 var(--space-5)' }}>{children}</div>
}

/**
 * One setting in a settings list. With a visible label the toggle carries its
 * own description (`description`), lined up under its label. With a `title`,
 * for a toggle that hides its label, the row names the setting instead: the
 * title and description on the left, the switch at the row's end, as in a
 * settings list. `dimmed` fades the title with a disabled switch, as its label
 * would.
 */
function SettingRow({ control, description, title, dimmed = false, last = false }: {
  control: ReactNode
  /** Only with a `title`; a labelled toggle takes its description itself. */
  description?: ReactNode
  title?: string
  dimmed?: boolean
  last?: boolean
}) {
  const rule: CSSProperties = { padding: 'var(--space-3) 0', borderBottom: last ? 'none' : hairline }
  if (title) {
    return (
      <div style={{ ...rule, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
        <div style={{ ...column('var(--space-1)'), minWidth: 0 }}>
          <span style={{ fontSize: 16, color: 'var(--text-primary)', opacity: dimmed ? 0.38 : 1 }}>{title}</span>
          <div style={caption}>{description}</div>
        </div>
        {control}
      </div>
    )
  }
  return <div style={rule}>{control}</div>
}

/**
 * A setting beside the slot in a Toggle scene. It follows the playground's
 * Visible label and Description, so every row in the list is laid out the
 * same way. With the label hidden, the row names and describes the setting.
 */
function ToggleSetting({ v, label, description, size = 'Medium', defaultChecked, last }: {
  v: Record<string, string>
  label: string
  description: ReactNode
  size?: 'Small' | 'Medium'
  defaultChecked?: boolean
  last?: boolean
}) {
  const labelled = on(v, 'withLabel')
  return (
    <SettingRow
      last={last}
      title={labelled ? undefined : label}
      description={labelled ? undefined : description}
      control={
        <Toggle
          label={label}
          size={size}
          withLabel={labelled}
          defaultChecked={defaultChecked}
          description={labelled && on(v, 'showDescription') ? description : undefined}
        />
      }
    />
  )
}

/** The slot's own description in a Toggle scene: under its label, when Description is on. */
const toggleLine = (v: Record<string, string>, line: ReactNode) => (on(v, 'withLabel') && on(v, 'showDescription') ? line : undefined)

/** A disabled field's help text is its reason, so the scenes built for Disabled keep it. */
const KEEPS_REASON: Lock = { value: 'true', reason: 'A disabled field says nearby what makes it available, so this scene keeps its help text.' }

/** The reason the locked Toggle gives, where its description goes. */
const LOCKED_BY_POLICY = (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)' }}>
    <span className="material-symbols-outlined" style={{ fontSize: 16 }} aria-hidden>lock</span>
    Locked by your institution's exam policy.
  </span>
)
const LATE_SUBMISSIONS = 'Candidates can submit up to 10 minutes after the end time.'
const MULTIPLE_ATTEMPTS = 'Candidates can start again until the end time. The best attempt counts.'

/** The slot row's title: the setting's name, shown by the row when the toggle hides its label. */
const rowTitle = (v: Record<string, string>, label: string) => (on(v, 'withLabel') ? undefined : label)

const on = (v: Record<string, string>, key: string) => v[key] === 'true'

/**
 * A Button's copy in a scene: its label and the icons the playground's Icon
 * control asks for, chosen for what this button does. Disclosure opens a menu,
 * so it may take a label that reads as one; an icon-only button keeps the
 * label as its name.
 */
function buttonCopy(v: Record<string, string>, c: { label: string; icon: string; trailing: string; menu?: string }): Record<string, unknown> {
  return {
    label: v.icon === 'Disclosure' && c.menu ? c.menu : c.label,
    leadingIcon: v.icon === 'Leading' || v.icon === 'Only' ? c.icon : undefined,
    trailingIcon: v.icon === 'Trailing' ? c.trailing : v.icon === 'Disclosure' ? 'expand_more' : undefined,
  }
}

/** A Button in a scene. An icon-only one shows its name in a tooltip, as it must in the product. */
const buttonSlot = (p: Record<string, unknown>) =>
  p.iconOnly ? (
    <Tooltip content={String(p.label)}>
      <Button {...(p as unknown as ButtonProps)} />
    </Tooltip>
  ) : (
    <Button {...(p as unknown as ButtonProps)} />
  )

const BADGE_STATUS: Record<string, string> = {
  Neutral: 'Draft', Info: 'Scheduled', Success: 'Live', Warning: 'Needs grading', Error: 'Overdue',
}
/** The page's main action for a test in each status: a draft is published, a test being graded opens in Grade. */
const STATUS_ACTION: Record<string, string> = {
  Neutral: 'Publish', Info: 'Open in Monitor', Success: 'Open in Monitor', Warning: 'Open in Grade', Error: 'Open in Grade',
}

const SUBJECTS = [
  'Biology', 'Chemistry', 'Economics', 'English', 'French', 'Geography',
  'History', 'Mathematics', 'Music', 'Philosophy', 'Physics', 'Religious studies',
]
// Short enough to sit on one line in a 220px Select: a longer value wraps
// inside the trigger rather than truncating.
const QUESTION_SETS = ['Linear equations', 'Quadratic equations', 'Angles and shapes']
const TIME_ZONES = ['Europe/Oslo', 'Europe/London', 'Europe/Stockholm', 'America/New_York']
const CLASSES = ['10A', '10B', '10C', '11A']

/** The first fields of Deliver > Setup, around whichever one the scene puts in the slot. */
const setupFields = {
  name: <TextInput label="Test name" defaultValue="Algebra midterm" />,
  questionSet: <Select label="Question set" placeholder="Select a question set" options={QUESTION_SETS} />,
  session: <Short><TextInput label="Session ID" placeholder="e.g. 2026-AUT-01" /></Short>,
}

function SetupTitle() {
  return <PageTitle title="Setup" />
}

const NEXT = <Button label="Next" intent="Primary" trailingIcon="chevron_right" />

const CANDIDATES = [
  { candidate: 'Jane Cooper', status: <Badge label="Connection unstable" intent="Warning" size="Small" withIcon />, progress: '18 of 24' },
  { candidate: 'Omar Haddad', status: <Badge label="In progress" intent="Info" size="Small" />, progress: '12 of 24' },
  { candidate: 'Li Wei', status: <Badge label="Submitted" intent="Neutral" size="Small" />, progress: '24 of 24' },
]

/** Where each of CANDIDATES is in the test, as the Status filter names it. */
const CANDIDATE_STATE = ['in-progress', 'in-progress', 'submitted']

function CandidatesTable({ selected, rows = CANDIDATES }: { selected?: string[]; rows?: typeof CANDIDATES }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <Table
        size="Compact"
        selectable
        striped
        hoverable={false}
        defaultSelectedIds={selected}
        style={{ border: 'none', borderRadius: 0 }}
        columns={[
          { key: 'candidate', header: 'Candidate' },
          { key: 'status', header: 'Status' },
          { key: 'progress', header: 'Answered', align: 'right' },
        ]}
        rows={rows}
      />
    </div>
  )
}

/** The bar a roster shows once rows are selected: how many, then what to do with them. */
function SelectionBar({ count: selected = 1, children }: { count?: number; children: ReactNode }) {
  return (
    <div style={{ ...row, justifyContent: 'space-between', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-2) var(--space-2) var(--space-4)', background: 'var(--blue-100)', borderRadius: 'var(--radius-md)' }}>
      <span style={{ ...body, fontWeight: 500 }}>{selected} candidate{selected === 1 ? '' : 's'} selected</span>
      <div style={row}>{children}</div>
    </div>
  )
}

/** One pending request, as an actionable list row: who and what on the left, the decision at the row's end. */
function RequestRow({ actions, avatar }: { actions: ReactNode; avatar?: ReactNode }) {
  return (
    <div style={{ ...row, justifyContent: 'space-between', gap: 'var(--space-4)', padding: 'var(--space-4) var(--space-5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: '1 1 260px', minWidth: 0 }}>
        {avatar ?? <Avatar name="Jane Cooper" />}
        <div style={column('2px')}>
          <span style={{ ...body, fontWeight: 500 }}>Jane Cooper asked for 10 more minutes</span>
          <span style={caption}>Lost connection for 6 minutes · 2 minutes ago</span>
        </div>
      </div>
      <div style={row}>{actions}</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// More screens, for the scenes past the pilot. Each one copies a place in the
// product a role really works in: a planner in Deliver, an invigilator in
// Monitor, a grader in Grade, an author in Author.
// ---------------------------------------------------------------------------

// --- Input controls ----------------------------------------------------------

/** Long-form reading content - a candidate's answer - is Noto Serif. */
const serif: CSSProperties = { margin: 0, fontFamily: 'var(--font-serif)', fontSize: 16, lineHeight: 1.5, color: 'var(--text-primary)' }
/** Codes, IDs and figures that line up. */
const mono: CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-primary)' }
const fieldWidth = (width: number, children: ReactNode) => <div style={{ width, maxWidth: '100%' }}>{children}</div>

/**
 * Grade: the answer on the left, the marking panel beside it. Marking is
 * anonymous unless a test is set up otherwise, so Grade shows a candidate
 * number and never a name.
 */
function MarkingLayout({ panel, status, actions, answer }: { panel: ReactNode; status?: ReactNode; actions?: ReactNode; answer?: ReactNode }) {
  return (
    <div style={column('var(--space-4)')}>
      <PageTitle
        title="Candidate 0142"
        aside={status ?? <Badge label="Marking" intent="Info" size="Small" />}
        actions={actions}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
        <div style={{ flex: '3 1 300px', minWidth: 0 }}>
          {answer ?? <Panel title="Question 4 · Essay">
            <div style={column('var(--space-3)')}>
              <p style={{ ...body, fontWeight: 500 }}>Explain two causes of the First World War. (20 marks)</p>
              <p style={serif}>
                The alliance system turned a regional crisis into a European war. When Austria-Hungary declared war on
                Serbia, Russia mobilised to defend it, and Germany's treaty with Austria-Hungary drew it in.
              </p>
              <p style={serif}>
                Militarism made the crisis harder to stop. Each power had plans for a fast war, and once mobilisation
                began, the timetables left little room for talks.
              </p>
            </div>
          </Panel>}
        </div>
        <div style={{ flex: '2 1 260px', minWidth: 0 }}>{panel}</div>
      </div>
    </div>
  )
}

/** The marking panel's score line: the mark, out of how many. */
function MarkLine({ mark = '14', of = '20' }: { mark?: string; of?: string }) {
  return (
    <div style={{ ...row, gap: 'var(--space-8)' }}>
      <Fact label="Mark" value={`${mark} of ${of}`} />
      <Fact label="Marked by" value="You" />
    </div>
  )
}

/** A heading for a group of settings inside a panel. */
function GroupTitle({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <div style={column('2px')}>
      <h4 className="inspera-h5" style={{ margin: 0, fontWeight: 600 }}>{children}</h4>
      {sub && <p style={caption}>{sub}</p>}
    </div>
  )
}

/** A label above a control that draws no visible label of its own, such as File Upload. */
function Label({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <div style={column('2px')}>
      <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)' }}>{children}</span>
      {sub && <span style={caption}>{sub}</span>}
    </div>
  )
}

/** A dependent setting, indented under the option that turns it on, so the dependency reads at a glance. */
function Indented({ children, by = 28 }: { children: ReactNode; by?: number }) {
  return <div style={{ ...column('var(--space-2)'), paddingLeft: by }}>{children}</div>
}

/**
 * Rows to pick from, as in a selection list: a checkbox per row, its name
 * beside it, and a header that can select all. `header` and `first` let a
 * scene put the slot in the header or in the first row. With `onCheck` the
 * rows are live: ticking one reports it, and the scene keeps the state.
 */
function PickList({ title, rows, header, first, checked, onCheck, action }: {
  title: ReactNode
  rows: { name: string; meta: string; trailing?: ReactNode }[]
  header?: ReactNode
  first?: ReactNode
  /** Which rows are ticked. */
  checked: boolean[]
  onCheck?: (index: number, on: boolean) => void
  action?: ReactNode
}) {
  const box = (i: number) =>
    i === 0 && first ? first : (
      <Checkbox label={`Select ${rows[i].name}`} withLabel={false} checked={checked[i] ?? false} onChange={(c) => onCheck?.(i, c)} />
    )
  return (
    <div style={{ background: 'var(--surface)', border: hairline, borderRadius: 'var(--radius-md)', minWidth: 0 }}>
      <div style={{ ...row, justifyContent: 'space-between', gap: 'var(--space-3)', minHeight: 52, padding: 'var(--space-1) var(--space-4)', borderBottom: hairline, background: 'var(--gray-100)', borderRadius: 'calc(var(--radius-md) - 1px) calc(var(--radius-md) - 1px) 0 0' }}>
        <div style={{ ...row, gap: 'var(--space-3)' }}>
          {header}
          {title && <span style={{ ...body, fontWeight: 600 }}>{title}</span>}
        </div>
        {action}
      </div>
      {rows.map((r, i) => (
        <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-1) var(--space-4)', borderBottom: i < rows.length - 1 ? hairline : 'none' }}>
          {box(i)}
          <div style={{ ...column('2px'), flex: 1, minWidth: 0 }}>
            <span style={{ ...body, fontWeight: 500 }}>{r.name}</span>
            <span style={caption}>{r.meta}</span>
          </div>
          {r.trailing}
        </div>
      ))}
    </div>
  )
}

/** "Add 2 questions": the action of a pick list, counting what is ticked. */
const addQuestions = (n: number) => (
  <Button label={n === 0 ? 'Add questions' : `Add ${n} question${n === 1 ? '' : 's'}`} intent="Primary" size="Small" disabled={n === 0} />
)
const count = (rows: boolean[]) => rows.filter(Boolean).length

/** Which Confirming marks option starts chosen: the slot when Selected, none in error, else a set number. */
const confirmChoice = (v: Record<string, string>) => (on(v, 'error') ? '' : on(v, 'selected') ? 'all' : 'count')

/** Why Shared marking can't be chosen, or, chosen and disabled, that it is locked in. */
const sharedReason = (v: Record<string, string>) =>
  on(v, 'selected') ? 'Locked while marking is under way.' : 'Needs 2 or more graders. This test has 1.'

/** Why Allow late submissions is off, or that it is on for everyone. */
const lateReason = (v: Record<string, string>, ready: boolean) =>
  on(v, 'checked')
    ? 'On for every test this term, set by your exam office.'
    : ready
      ? 'Candidates can submit up to 10 minutes after the end time.'
      : 'Set an end time to allow late submissions.'

/**
 * Options as the rows of a list, each named by its row: the control, then
 * the option's name and a line about it. What a Checkbox or Radio Button
 * scene shows when the control hides its label. `dimmed` fades a disabled
 * option's name, as its own label would fade; the line under it stays
 * readable, because it says why.
 */
function OptionList({ rows }: { rows: { control: ReactNode; name: string; meta: string; dimmed?: boolean }[] }) {
  return (
    <div style={{ background: 'var(--surface)', border: hairline, borderRadius: 'var(--radius-md)', minWidth: 0 }}>
      {rows.map((r, i) => (
        <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-1) var(--space-4)', borderBottom: i < rows.length - 1 ? hairline : 'none' }}>
          {r.control}
          <div style={{ ...column('2px'), flex: 1, minWidth: 0 }}>
            <span style={{ ...body, fontWeight: 500, opacity: r.dimmed ? 0.38 : 1 }}>{r.name}</span>
            <span style={caption}>{r.meta}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

const BANK_QUESTIONS = [
  { name: 'Solve 2x + 6 = 14', meta: 'Numeric · 2 marks · Linear equations' },
  { name: 'Factorise x² + 5x + 6', meta: 'Multiple choice · 2 marks · Quadratic equations' },
  { name: 'Find the gradient of y = 3x - 4', meta: 'Numeric · 1 mark · Linear equations' },
]

/** Deliver > New test: the timing fields of Setup, with the checkbox options under them. */
function TimingFields({ end, onEnd, options }: { end?: string; onEnd?: (value: string) => void; options: ReactNode }) {
  return (
    <div style={column()}>
      <SetupTitle />
      <FormColumn>
        {setupFields.name}
        <div style={{ ...row, alignItems: 'flex-start', gap: 'var(--space-4)' }}>
          {fieldWidth(220, <TextInput label="Start time" defaultValue="19 Sep 2026, 09:00" />)}
          {fieldWidth(220, <TextInput label="End time" defaultValue={end} placeholder="Not set" onChange={onEnd} />)}
        </div>
        <div style={column('var(--space-1)')}>{options}</div>
      </FormColumn>
      <StepFooter>{NEXT}</StepFooter>
    </div>
  )
}

/**
 * An existing test's settings, edited as a form and saved with Save changes.
 * A form like this is where Checkboxes, radios and pickers belong - its
 * choices apply when saved, not as they are made.
 */
function SettingsForm({ children, title = 'Settings' }: { children: ReactNode; title?: string }) {
  return (
    <div style={column()}>
      <PageTitle title={title} />
      {children}
      <SaveBar />
    </div>
  )
}

/** The foot of a settings form: dismiss first, commit last. In a flow past its first step, Back sits before them. */
function SaveBar({ label = 'Save changes', back = false }: { label?: string; back?: boolean }) {
  const room = useContext(FooterRoom)
  return (
    <div
      data-scene-footer
      style={{
        ...row,
        justifyContent: 'flex-end',
        // Room for an open panel goes above the bar, as for StepFooter.
        margin: `calc(var(--space-2) + ${room}px) calc(-1 * var(--scene-pad)) calc(-1 * var(--scene-pad))`,
        padding: 'var(--space-3) var(--scene-pad)',
        background: 'var(--surface)',
        borderTop: hairline,
        borderRadius: '0 0 calc(var(--radius-lg) - 1px) calc(var(--radius-lg) - 1px)',
      }}
    >
      {back && <Button label="Back" intent="Outline" leadingIcon="chevron_left" style={{ marginRight: 'auto' }} />}
      <Button label="Cancel" intent="Text" />
      <Button label={label} intent="Primary" />
    </div>
  )
}

/** The product's own rich-text editor: not a library control, which is exactly what FormField wraps. */
function RichTextEditor({ id, text, invalid = false }: { id: string; text?: string; invalid?: boolean }) {
  const tool = (icon: string) => (
    <span key={icon} className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--gray-700)', padding: 2 }} aria-hidden>{icon}</span>
  )
  return (
    // In error the editor draws its own red edge: FormField lays out the message, the control shows the state.
    <div style={{ border: `var(--border-width-default) solid ${invalid ? 'var(--error)' : 'var(--border-control)'}`, borderRadius: 'var(--radius-sm)', background: 'var(--surface)' }}>
      <div aria-hidden style={{ ...row, gap: 'var(--space-1)', padding: 'var(--space-1) var(--space-2)', borderBottom: hairline, background: 'var(--gray-100)', borderRadius: 'calc(var(--radius-sm) - 1px) calc(var(--radius-sm) - 1px) 0 0' }}>
        {['format_bold', 'format_italic', 'format_underlined', 'format_list_bulleted', 'link'].map(tool)}
      </div>
      <div
        id={id}
        role="textbox"
        aria-multiline="true"
        aria-labelledby={`${id}-label`}
        aria-invalid={invalid || undefined}
        contentEditable
        suppressContentEditableWarning
        style={{ minHeight: 72, padding: 'var(--space-2) var(--space-3)', fontSize: 16, lineHeight: 1.5, color: 'var(--text-primary)', outline: 'none' }}
      >
        {text}
      </div>
    </div>
  )
}

const percent = (n: number) => `${n}%`

/** The files already added to a question set's resources. */
const RESOURCE_FILES = [
  { icon: 'image', name: 'triangle-diagram.png', size: '84 KB' },
  { icon: 'picture_as_pdf', name: 'formula-sheet.pdf', size: '312 KB' },
]

/** The question being edited, and a panel of its own beside it. */
function QuestionWithPanel({ title = 'Question settings', children }: { title?: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
      <div style={{ flex: '2 1 280px', minWidth: 0 }}>
        <Panel title="Question 3">
          <div style={column('var(--space-3)')}>
            <p style={body}>Which value of x satisfies 2x + 6 = 14?</p>
            <p style={caption}>Multiple choice · 2 marks</p>
          </div>
        </Panel>
      </div>
      <div style={{ flex: '1 1 240px', minWidth: 0 }}>
        <Panel title={title}>
          <div style={column('var(--space-4)')}>{children}</div>
        </Panel>
      </div>
    </div>
  )
}

const RESULTS_BY = ['Candidate', 'Question', 'Section', 'Class']
const PREVIEW_AS = ['Desktop', 'Tablet', 'Phone', 'Paper']
const PERIODS = ['Day', 'Week', 'Month', 'Year']
/** Tests started, hand-ins and scripts marked, by period. */
const ACTIVITY_BY_PERIOD: Record<string, [string, string, string]> = {
  Day: ['6', '18', '14'], Week: ['42', '128', '96'], Month: ['168', '512', '431'], Year: ['1,920', '6,204', '5,877'],
}

/** Report > a test's results: how they are broken down, then the breakdown. */
function ResultsPage({ control, note, by = 'Candidate' }: { control: ReactNode; note?: string; by?: string }) {
  const table = RESULTS_BY_TABLE[by] ?? RESULTS_BY_TABLE.Candidate
  return (
    <div style={column('var(--space-4)')}>
      <PageTitle
        title="Results"
        aside={<Badge label="Marking" intent="Info" size="Small" />}
        actions={<Button label="Export" intent="Outline" leadingIcon="download" />}
      />
      <div style={column('var(--space-2)')}>
        <div style={{ ...row, gap: 'var(--space-3)' }}>
          <span style={{ ...body, color: 'var(--text-secondary)' }}>Results by</span>
          {control}
        </div>
        {note && <p style={caption}>{note}</p>}
      </div>
      <div style={{ overflowX: 'auto' }}>
        <Table
          size="Compact"
          hoverable={false}
          aria-label={`Results by ${by.toLowerCase()}`}
          style={{ border: 'none', borderRadius: 0 }}
          columns={table.columns}
          rows={table.rows}
        />
      </div>
    </div>
  )
}

/** What Results by shows for each breakdown. */
const RESULTS_BY_TABLE: Record<string, { columns: { key: string; header: string; align?: 'right' }[]; rows: Record<string, string>[] }> = {
  Candidate: {
    columns: [{ key: 'a', header: 'Candidate' }, { key: 'b', header: 'Mark', align: 'right' }, { key: 'c', header: 'Grade' }],
    rows: [{ a: '0142', b: '14 of 20', c: 'B' }, { a: '0157', b: '17 of 20', c: 'A' }, { a: '0163', b: 'Not marked', c: '-' }],
  },
  Question: {
    columns: [{ key: 'a', header: 'Question' }, { key: 'b', header: 'Average', align: 'right' }, { key: 'c', header: 'Marked', align: 'right' }],
    rows: [{ a: '1 · Linear equations', b: '1.6 of 2', c: '179 of 179' }, { a: '2 · Factorising', b: '1.2 of 2', c: '179 of 179' }, { a: '4 · Causes of war', b: '13.5 of 20', c: '112 of 179' }],
  },
  Section: {
    columns: [{ key: 'a', header: 'Section' }, { key: 'b', header: 'Questions', align: 'right' }, { key: 'c', header: 'Average', align: 'right' }],
    rows: [{ a: 'Short answers', b: '6', c: '71%' }, { a: 'Source analysis', b: '2', c: '64%' }, { a: 'Essay', b: '1', c: '58%' }],
  },
  Class: {
    columns: [{ key: 'a', header: 'Class' }, { key: 'b', header: 'Candidates', align: 'right' }, { key: 'c', header: 'Average', align: 'right' }],
    rows: [{ a: '10A', b: '24', c: '66%' }, { a: '10B', b: '26', c: '61%' }, { a: '10C', b: '22', c: '63%' }],
  },
}

/** Report: recent tests and how they went. */
function ResultsTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <Table
        size="Compact"
        striped
        hoverable={false}
        aria-label="Results"
        style={{ border: 'none', borderRadius: 0 }}
        columns={[
          { key: 'test', header: 'Test' },
          { key: 'date', header: 'Test date' },
          { key: 'candidates', header: 'Candidates', align: 'right' },
          { key: 'average', header: 'Average score', align: 'right' },
        ]}
        rows={[
          { test: 'History Midterm', date: '25 Sep 2026', candidates: 179, average: '63%' },
          { test: 'Cell biology', date: '18 Sep 2026', candidates: 128, average: '71%' },
          { test: 'Calculus I', date: '14 Sep 2026', candidates: 241, average: '68%' },
        ]}
      />
    </div>
  )
}

/** Questions with a difficulty rating at the end of each row. The first row's rating is the slot. */
function RatedQuestions({ first, size, readOnly = false, showValue = false }: { first: ReactNode; size: string; readOnly?: boolean; showValue?: boolean }) {
  const averages = [3, 2, 4]
  return (
    <div style={{ background: 'var(--surface)', border: hairline, borderRadius: 'var(--radius-md)' }}>
      <div style={{ ...row, justifyContent: 'space-between', padding: 'var(--space-2) var(--space-4)', borderBottom: hairline, background: 'var(--gray-100)', borderRadius: 'calc(var(--radius-md) - 1px) calc(var(--radius-md) - 1px) 0 0', fontSize: 14, fontWeight: 600, color: 'var(--gray-700)' }}>
        <span>Question</span>
        <span>{readOnly ? 'Difficulty, average of reviews' : 'Your rating'}</span>
      </div>
      {BANK_QUESTIONS.map((q, i) => (
        <div key={q.name} style={{ ...row, justifyContent: 'space-between', gap: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)', borderBottom: i < BANK_QUESTIONS.length - 1 ? hairline : 'none' }}>
          <div style={{ ...column('2px'), flex: '1 1 220px', minWidth: 0 }}>
            <span style={{ ...body, fontWeight: 500 }}>{q.name}</span>
            <span style={caption}>{q.meta}</span>
          </div>
          {i === 0
            ? first
            : <Rating label={`Difficulty of ${q.name}`} size={size as 'Small' | 'Medium'} readOnly={readOnly} showValue={showValue} defaultValue={readOnly ? averages[i] : 0} />}
        </div>
      ))}
    </div>
  )
}

/** Deliver > New test > Setup: when the test opens and closes, each date beside its time. */
function TestWindow({ start, end }: { start?: ReactNode; end?: ReactNode }) {
  return (
    <div style={column()}>
      <SetupTitle />
      <FormColumn>
        {setupFields.name}
        <div style={{ ...row, alignItems: 'flex-start', gap: 'var(--space-4)' }}>
          {fieldWidth(220, start ?? <DatePicker label="Start date" defaultValue="2026-09-19" />)}
          {fieldWidth(120, <TextInput label="Start time" defaultValue="09:00" />)}
        </div>
        <div style={{ ...row, alignItems: 'flex-start', gap: 'var(--space-4)' }}>
          {fieldWidth(220, end ?? <DatePicker label="End date" placeholder="Not set" />)}
          {fieldWidth(120, <TextInput label="End time" placeholder="hh:mm" />)}
        </div>
      </FormColumn>
      <StepFooter>{NEXT}</StepFooter>
    </div>
  )
}

/** The three numbers of a test's settings. The scene picks one by the playground's unit; the others sit beside it. */
const NUMBER_FIELDS: Record<'min' | '%' | 'None', { label: string; value: number; min: number; max: number; step: number; help: string; error: string; off: string }> = {
  min: { label: 'Duration', value: 90, min: 10, max: 240, step: 5, help: 'Between 10 and 240 minutes.', error: 'Enter a duration between 10 and 240 minutes.', off: 'Worked out from the start and end times.' },
  '%': { label: 'Pass mark', value: 50, min: 0, max: 100, step: 5, help: 'A share of the total marks.', error: 'Enter a pass mark between 0 and 100%.', off: 'Turn on automatic grading to set a pass mark.' },
  None: { label: 'Attempts allowed', value: 1, min: 1, max: 5, step: 1, help: 'Up to 5 attempts.', error: 'Enter between 1 and 5 attempts.', off: 'Turn on multiple attempts to change this.' },
}
const UNITS = ['min', '%', 'None'] as const
const unitOf = (v: Record<string, string>) => (UNITS.includes(v.suffix as never) ? v.suffix : 'min') as (typeof UNITS)[number]

function numberCopy(v: Record<string, string>): Record<string, unknown> {
  const f = NUMBER_FIELDS[unitOf(v)]
  return {
    label: f.label,
    // In error the field is empty, as its message asks for a number.
    defaultValue: on(v, 'error') ? undefined : f.value,
    min: f.min,
    max: f.max,
    step: f.step,
    helpText: on(v, 'disabled') ? f.off : f.help,
    errorText: on(v, 'error') ? f.error : undefined,
  }
}

const TOPICS = [
  { value: 'linear', label: 'Linear equations', icon: 'functions' },
  { value: 'quadratic', label: 'Quadratic equations', icon: 'functions' },
  { value: 'geometry', label: 'Angles and shapes', icon: 'change_history' },
  { value: 'probability', label: 'Probability', icon: 'casino' },
]

const STAFF = [
  { value: 'mia', label: 'Mia Lund', icon: 'person' },
  { value: 'jonas', label: 'Jonas Berg', icon: 'person' },
  { value: 'amira', label: 'Amira Haddad', icon: 'person' },
  { value: 'ingrid', label: 'Ingrid Solberg', icon: 'person' },
]


// --- Data display ------------------------------------------------------------

/** A grid of equal tiles or cards that wraps to one column on a narrow screen. */
function CardGrid({ min = 220, children }: { min?: number; children: ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${min}px), 1fr))`, gap: 'var(--space-4)' }}>{children}</div>
}

/** Neighbours of a library Card slot take its look, so a view keeps one elevation and one padding. */
const cardLook = (v: Record<string, string>) => ({
  elevation: v.elevation as 'Flat' | 'Raised' | 'Outlined',
  padding: v.padding as 'Compact' | 'Default' | 'Spacious',
  interactive: on(v, 'interactive'),
})

/** The status of each test, by the meaning its badge carries everywhere else. */
const TEST_CARDS = [
  { title: 'Algebra Quiz', body: '19 Sep, 09:00 · 24 candidates', status: ['Live', 'Success'] as const },
  { title: 'History Midterm', body: '2 Oct, 10:00 · 179 candidates', status: ['Scheduled', 'Info'] as const },
  { title: 'Biology Final', body: 'Not scheduled · 0 candidates', status: ['Draft', 'Neutral'] as const },
]

/** A test card's content: its title, when and who, and the status the table shows. */
function TestCardContent({ card }: { card: (typeof TEST_CARDS)[number] }) {
  return (
    <div style={column('var(--space-2)')}>
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>{card.title}</h3>
      <p style={{ margin: 0, fontSize: 16, lineHeight: 1.4, color: 'var(--gray-700)' }}>{card.body}</p>
      <div><Badge label={card.status[0]} intent={card.status[1]} size="Small" /></div>
    </div>
  )
}

/** Which question types are picked: the slot's from the playground, then Essay off and Numeric on. */
const pickedTypes = (v: Record<string, string>, s: SceneState) => s.get('picked', [on(v, 'selected'), false, true])

/** Grade: the scripts of one test, as the grader's list. */
const SCRIPTS: Record<string, unknown>[] = [
  { id: '0142', script: 'Candidate 0142', status: <Badge label="Marking" intent="Info" size="Small" />, grader: 'You', mark: '14' },
  { id: '0157', script: 'Candidate 0157', status: <Badge label="Marked" intent="Success" size="Small" />, grader: 'Arne Hansen', mark: '17' },
  { id: '0163', script: 'Candidate 0163', status: <Badge label="Not started" intent="Neutral" size="Small" />, grader: 'Not assigned', mark: '-' },
]

/** A row's actions, in a menu at its end - a row of small buttons would compete with the data. */
const scriptActions = (row: Record<string, unknown>) => (
  <Menu
    iconOnly
    size="Small"
    label={`Actions for ${String(row.script)}`}
    placement="BottomEnd"
    items={[{ label: 'Open', icon: 'open_in_new' }, { label: 'Reassign', icon: 'swap_horiz' }]}
  />
)

const QUESTION_ROWS = [
  { question: '1 · Linear equations', type: 'Numeric', marked: '179 of 179', average: '1.6 of 2' },
  { question: '2 · Factorising', type: 'Multiple choice', marked: '179 of 179', average: '1.2 of 2' },
  { question: '4 · Causes of war', type: 'Essay', marked: '112 of 179', average: '13.5 of 20' },
]

/** Author's question list, with the metadata tags each question carries. */
function TaggedQuestions({ first, size }: { first: ReactNode; size: string }) {
  const tags: [string, BadgeIntent][][] = [
    [['Linear equations', 'Neutral']],
    [['Quadratic equations', 'Neutral'], ['Needs review', 'Warning']],
    [['Linear equations', 'Neutral'], ['Reviewed', 'Success']],
  ]
  return (
    <div style={{ background: 'var(--surface)', border: hairline, borderRadius: 'var(--radius-md)' }}>
      {BANK_QUESTIONS.map((q, i) => (
        <div key={q.name} style={{ ...row, justifyContent: 'space-between', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', borderBottom: i < BANK_QUESTIONS.length - 1 ? hairline : 'none' }}>
          <div style={{ ...column('2px'), flex: '1 1 220px', minWidth: 0 }}>
            <span style={{ ...body, fontWeight: 500 }}>{q.name}</span>
            <span style={caption}>{q.meta.split(' · ').slice(0, 2).join(' · ')}</span>
          </div>
          <div style={{ ...row, gap: 'var(--space-1)' }}>
            {i === 0 && first}
            {tags[i].slice(i === 0 ? 1 : 0).map(([label, intent]) => (
              <Tag key={label} label={label} intent={intent} size={size as 'Small' | 'Medium'} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/** Questions that match a label filter, each showing that label and its topic. */
function FilteredQuestions({ label, intent }: { label: string; intent: BadgeIntent }) {
  return (
    <div style={{ background: 'var(--surface)', border: hairline, borderRadius: 'var(--radius-md)' }}>
      {BANK_QUESTIONS.slice(0, 2).map((q, i) => (
        <div key={q.name} style={{ ...row, justifyContent: 'space-between', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', borderBottom: i === 0 ? hairline : 'none' }}>
          <div style={{ ...column('2px'), flex: '1 1 220px', minWidth: 0 }}>
            <span style={{ ...body, fontWeight: 500 }}>{q.name}</span>
            <span style={caption}>{q.meta}</span>
          </div>
          <div style={{ ...row, gap: 'var(--space-1)' }}>
            {intent !== 'Neutral' && <Tag label={q.meta.split(' · ')[2]} size="Small" />}
            <Tag label={intent === 'Neutral' ? q.meta.split(' · ')[2] : label} intent={intent} size="Small" />
          </div>
        </div>
      ))}
    </div>
  )
}

/** Tag copy: a label of the same meaning as its intent. */
const TAG_LABEL: Record<string, string> = {
  Neutral: 'Linear equations', Info: 'Calculator allowed', Success: 'Reviewed', Warning: 'Needs review', Error: 'No answer key',
}
const TAG_ICON: Record<string, string> = {
  Neutral: 'sell', Info: 'calculate', Success: 'check_circle', Warning: 'flag', Error: 'error',
}

const GRADERS = [
  { name: 'Arne Hansen', status: 'Online', note: 'Online' },
  { name: 'Mia Lund', status: 'Busy', note: 'Busy · marking Candidate 0157' },
  { name: 'Jonas Berg', status: 'Offline', note: 'Offline · last seen 14:02' },
]
const PRESENCE: Record<string, string> = {
  None: 'Grader', Online: 'Online', Busy: 'Busy · marking Candidate 0142', Offline: 'Offline · last seen 14:02',
}

/** Delta copy per trend: what rose, what fell, what held. */
const STAT_TREND: Record<string, { label: string; value: string; delta: string; icon: string }> = {
  Up: { label: 'Pass rate', value: '84%', delta: '+6 points on last sitting', icon: 'trending_up' },
  Down: { label: 'Submitted on time', value: '91%', delta: '-4 points on last sitting', icon: 'schedule' },
  Neutral: { label: 'Average score', value: '68%', delta: 'Same as last sitting', icon: 'functions' },
}

/** A small bar chart: the picture a tab of a score card shows. */
function Bars({ heights, labels }: { heights: number[]; labels?: string[] }) {
  return (
    <div aria-hidden style={column('var(--space-1)')}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-2)', height: 100, paddingTop: 'var(--space-4)' }}>
        {heights.map((h, i) => (
          <span key={i} style={{ flex: 1, height: `${h}%`, background: 'var(--blue-300)', borderRadius: 'var(--radius-xs) var(--radius-xs) 0 0' }} />
        ))}
      </div>
      {labels && (
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {labels.map((l) => <span key={l} style={{ ...caption, flex: 1, textAlign: 'center' }}>{l}</span>)}
        </div>
      )}
    </div>
  )
}

/** The questions inside one section of a question set, as links to open each. */
function SectionQuestions({ names }: { names: string[] }) {
  return (
    <div style={column('var(--space-1)')}>
      {names.map((n, i) => (
        <span key={n} style={{ ...row, gap: 'var(--space-2)', fontSize: 14 }}>
          <span style={{ ...mono, fontSize: 13, color: 'var(--text-secondary)' }}>{i + 1}</span>
          <Link href="#" size="Small" onClick={stay}>{n}</Link>
        </span>
      ))}
    </div>
  )
}


// --- Feedback ----------------------------------------------------------------

/** The page a dialog opened from, kept tall enough for the dialog over it. */
function Beneath({ children, minHeight = 380 }: { children: ReactNode; minHeight?: number }) {
  return <div style={{ minHeight }}>{children}</div>
}

/**
 * A drawer as it opens on the real screen: docked to its edge, the screen's
 * full height (or width, from the bottom), with no rounding of its own.
 */
function dockedDrawer(p: Record<string, unknown>, _v: Record<string, string>, s: SceneState) {
  const side = p.side as DrawerSide
  const extent = { Small: 320, Medium: 400, Large: 560 }[p.size as DrawerSize]
  return (
    <EscapeCloses onEscape={s.dismiss}>
      <Drawer
        {...(p as unknown as DrawerProps)}
        open
        embedded
        onClose={s.dismiss}
        style={side === 'Bottom'
          ? { width: '100%', height: extent, maxHeight: '90%', borderRadius: 0, border: 'none' }
          : { height: '100%', borderRadius: 0, border: 'none' }}
      />
    </EscapeCloses>
  )
}

/** Without its close button, a drawer brings its own way out: Close, beside its actions. */
const drawerWayOut = (v: Record<string, string>, s: SceneState, size?: 'Large') =>
  on(v, 'hasCloseButton') ? null : <Button label="Close" intent="Text" size={size} onClick={s.dismiss} />

/** A keyboard key, as written in a list of shortcuts. */
function Key({ children }: { children: ReactNode }) {
  return (
    <kbd style={{ ...mono, fontSize: 12, padding: '2px 6px', border: 'var(--border-width-default) solid var(--border-strong)', borderRadius: 'var(--radius-xs)', background: 'var(--gray-100)' }}>{children}</kbd>
  )
}

/** A toast's text for each intent, per scene: what just happened, and the one thing to do about it. */
interface ToastCopy { message: string; action: string }
const toastFor = (table: Record<string, ToastCopy>, v: Record<string, string>) => table[v.intent] ?? table.Neutral

/** A toast, drawn as it shows on screen: the Snackbar look, always with its close button. */
function toastSlot(table: Record<string, ToastCopy>) {
  return (_p: Record<string, unknown>, v: Record<string, string>, s: SceneState) => {
    const t = toastFor(table, v)
    return (
      <Snackbar
        message={t.message}
        intent={v.intent as SnackbarProps['intent']}
        actionLabel={on(v, 'withAction') ? t.action : undefined}
        onAction={s.dismiss}
        dismissible
        onClose={s.dismiss}
      />
    )
  }
}

/** Author's question editor: the question, its settings on the right. Toasts and snackbars report on it. */
function QuestionEditor({ footer }: { footer?: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 'var(--space-4)', minHeight: 300 }}>
      <div style={{ flex: '2 1 300px', minWidth: 0 }}>
        <Panel title="Question 3">
          <div style={column('var(--space-3)')}>
            <p style={body}>Which value of x satisfies 2x + 6 = 14?</p>
            <RadioGroup
              label="Correct answer"
              name="scene-editor-answer"
              options={[{ label: 'x = 3', value: '3' }, { label: 'x = 4', value: '4' }, { label: 'x = 10', value: '10' }]}
              defaultValue="4"
            />
          </div>
        </Panel>
        {footer}
      </div>
      <div style={{ flex: '1 1 220px', minWidth: 0 }}>
        <Panel title="Question settings">
          <div style={column('var(--space-3)')}>
            <Toggle label="Required" size="Small" defaultChecked />
            <Toggle label="Shuffle answer options" size="Small" />
            {fieldWidth(160, <NumberInput label="Marks" size="Small" defaultValue={2} min={0} max={10} />)}
          </div>
        </Panel>
      </div>
    </div>
  )
}

/** Icon-only buttons in a toolbar: each one needs its name, and a tooltip to show it. */
const iconButton = (icon: string, label: string) => <Button label={label} intent="Outline" size="Small" leadingIcon={icon} iconOnly />

/** The navy tool rail of the question set editor, with the editor beside it. */
function ToolRail({ first }: { first: ReactNode }) {
  const tool = (icon: string, label: string, current = false) => (
    <button
      type="button"
      aria-label={label}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, padding: 0, border: 'none', borderRadius: 'var(--radius-sm)', background: current ? 'color-mix(in srgb, var(--white) 14%, transparent)' : 'transparent', color: 'var(--white)', cursor: 'pointer' }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 22 }} aria-hidden>{icon}</span>
    </button>
  )
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', minHeight: 260, border: hairline, borderRadius: 'var(--radius-md)', overflow: 'visible', background: 'var(--surface)' }}>
      <div style={{ ...column('var(--space-2)'), alignItems: 'center', padding: 'var(--space-2)', background: 'var(--blue-900)', borderRadius: 'calc(var(--radius-md) - 1px) 0 0 calc(var(--radius-md) - 1px)' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--white)', opacity: 0.6, padding: 'var(--space-2) 0 var(--space-10)' }} aria-hidden>edit_note</span>
        {first}
        {tool('perm_media', 'Resources')}
        {tool('settings', 'Question set settings')}
      </div>
      <div style={{ ...column('var(--space-3)'), flex: 1, minWidth: 0, padding: 'var(--space-5)' }}>
        <h4 className="inspera-h4" style={{ margin: 0, fontWeight: 600 }}>Algebra Quiz</h4>
        <p style={body}>Section 1 · Linear equations · 3 questions</p>
      </div>
    </div>
  )
}

/** A rail button for the tooltip's trigger: white on navy, so it needs a light tooltip to stand out. */
const railButton = (
  <button
    type="button"
    aria-label="Questions"
    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, padding: 0, border: 'none', borderRadius: 'var(--radius-sm)', background: 'color-mix(in srgb, var(--white) 14%, transparent)', color: 'var(--white)', cursor: 'pointer' }}
  >
    <span className="material-symbols-outlined" style={{ fontSize: 22 }} aria-hidden>quiz</span>
  </button>
)

/** Progress copy for Grade: the same work at each intent - under way, done, behind, overdue. */
const MARKING: Record<string, { value: number; note: string }> = {
  Primary: { value: 30, note: '12 of 40 marked · Due 24 October' },
  Success: { value: 100, note: 'All 40 marked' },
  Warning: { value: 30, note: '12 of 40 marked · Due tomorrow' },
  Error: { value: 30, note: '12 of 40 marked · Overdue since 20 October' },
}

/** One row of the marking list: the test, its bar, and the count in words beside it. */
function MarkingRow({ test, bar, note }: { test: string; bar: ReactNode; note: string }) {
  return (
    <div style={{ ...column('var(--space-2)'), padding: 'var(--space-3) 0', borderBottom: hairline }}>
      <div style={{ ...row, justifyContent: 'space-between' }}>
        <span style={{ ...body, fontWeight: 500 }}>{test}</span>
        <span style={{ ...caption, fontSize: 13 }}>{note}</span>
      </div>
      {bar}
    </div>
  )
}

/** Escape closes an overlay drawn in a scene, as it does on the real screen. */
function EscapeCloses({ onEscape, children }: { onEscape: () => void; children: ReactNode }) {
  return (
    <div
      style={{ display: 'contents' }}
      onKeyDown={(e) => {
        if (e.key !== 'Escape') return
        e.stopPropagation()
        onEscape()
      }}
    >
      {children}
    </div>
  )
}

/** A dialog as it opens: the panel alone, centred on the scrim by the frame. Cancel, confirm, close and Escape close it. */
const dialogSlot = (p: Record<string, unknown>, _v: Record<string, string>, s: SceneState) => (
  <EscapeCloses onEscape={s.dismiss}>
    <Dialog {...(p as unknown as DialogProps)} open embedded onClose={s.dismiss} onConfirm={s.dismiss} />
  </EscapeCloses>
)

/** What a snackbar says in the question editor, by intent. */
const SNACKBAR_COPY: Record<string, ToastCopy> = {
  Neutral: { message: 'Draft saved.', action: 'Undo' },
  Info: { message: 'A newer version of this question set exists.', action: 'Reload' },
  Success: { message: 'Question 3 moved to Quadratic equations.', action: 'Undo' },
  Warning: { message: "You're offline. Changes are kept on this device.", action: 'Retry' },
  Error: { message: "Couldn't save Question 3.", action: 'Try again' },
}

/** The palette as it opens. Escape, or running a command, closes it. */
const paletteSlot = (p: Record<string, unknown>, _v: Record<string, string>, s: SceneState) => (
  <EscapeCloses onEscape={s.dismiss}>
    <CommandPalette {...(p as unknown as CommandPaletteProps)} embedded onOpenChange={(o) => { if (!o) s.dismiss() }} />
  </EscapeCloses>
)

/** The palette's commands while editing a question set. */
const AUTHOR_COMMANDS = [
  { id: 'add-question', label: 'Add a question', icon: 'add_circle', group: 'Actions' },
  { id: 'preview', label: 'Preview as a candidate', icon: 'visibility', group: 'Actions' },
  { id: 'add-section', label: 'Add a section', icon: 'playlist_add', group: 'Actions' },
  { id: 'resources', label: 'Go to Resources', icon: 'perm_media', group: 'Navigate' },
  { id: 'settings', label: 'Go to question set settings', icon: 'settings', group: 'Navigate' },
]

// --- Navigation --------------------------------------------------------------

/** What New test shows under its stepper, step by step. */
const NEW_TEST_STEP: ReactNode[] = [
  <>{setupFields.name}{setupFields.questionSet}</>,
  <>
    <GroupTitle sub="3 sections, 24 questions, 50 marks">Algebra Quiz</GroupTitle>
    <List size="Compact" items={[{ primary: 'Linear equations', secondary: '12 questions' }, { primary: 'Quadratic equations', secondary: '8 questions' }, { primary: 'Graphs', secondary: '4 questions' }]} />
  </>,
  <>
    <Checkbox label="Allow late submissions" defaultChecked />
    <Checkbox label="Require a locked browser" defaultChecked />
  </>,
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 'var(--space-4)' }}>
    <Fact label="Starts" value="19 September, 09:00" />
    <Fact label="Candidates" value="24" />
    <Fact label="Duration" value="1 hour 30 minutes" />
    <Fact label="Security" value="Locked browser" />
  </div>,
]

/** What an import shows at each of its steps. */
const IMPORT_STEP: ReactNode[] = [
  <Label key="upload" sub="A CSV file, one candidate per row.">Choose the file to import</Label>,
  <div key="match" style={column('var(--space-2)')}>
    <span style={{ ...body, fontWeight: 500 }}>Match the columns in your file</span>
    <div style={{ ...row, gap: 'var(--space-4)' }}>
      <Select label="Candidate ID" widthMode="Hug" options={['Column A: ID', 'Column B: Name']} defaultValue="Column A: ID" />
      <Select label="Email" widthMode="Hug" options={['Column C: Email', 'Column B: Name']} defaultValue="Column C: Email" />
    </div>
  </div>,
  <Alert key="check" intent="Warning" message="3 rows have no email address. Those candidates get no invitation." />,
  <Label key="import" sub="340 candidates will be added to Algebra Quiz.">Ready to import</Label>,
]

// ---------------------------------------------------------------------------
// Scenes, per component slug. Order matters: the first scene whose `when`
// matches is shown, and the one without `when` is the fallback.
// ---------------------------------------------------------------------------

export const contexts: Partial<Record<string, Scene[]>> = {
  button: [
    {
      // Large: the one prominent action of a candidate's touch-first screen, before the test starts.
      location: 'Sign in',
      bare: true,
      when: { size: ['Large'] },
      demonstrates: ['size'],
      slot: buttonSlot,
      copy: (v) => buttonCopy(v, LARGE_CTA[v.intent] ?? LARGE_CTA.Primary),
      render: (slot, v) => {
        const cta = LARGE_CTA[v.intent] ?? LARGE_CTA.Primary
        return (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8) 0' }}>
            <div style={{ ...column('var(--space-4)'), width: 440, maxWidth: '100%', alignItems: 'center', textAlign: 'center' }}>
              <span style={{ ...row, gap: 'var(--space-2)', fontWeight: 600, color: 'var(--primary)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 22 }} aria-hidden>verified_user</span>
                Inspera Assessment
              </span>
              <div style={column('var(--space-1)')}>
                <h3 className="inspera-h3" style={{ margin: 0, fontWeight: 500 }}>Algebra Quiz</h3>
                <p style={{ ...body, color: 'var(--text-secondary)' }}>24 questions · 45 minutes · Calculator allowed</p>
              </div>
              <p style={{ ...body, fontSize: 16, lineHeight: 1.5 }}>{cta.say}</p>
              {slot}
              {on(v, 'disabled') && <Reason>The test opens at 09:00.</Reason>}
            </div>
          </div>
        )
      },
    },
    {
      // Small: an action in a dense toolbar above a table, beside Small inputs.
      location: 'Grade › History Midterm',
      when: { size: ['Small'] },
      demonstrates: ['size'],
      slot: buttonSlot,
      copy: (v) => buttonCopy(v, SMALL_ACTION[v.intent] ?? SMALL_ACTION.Primary),
      render: (slot, v) => (
        <div style={column('var(--space-3)')}>
          <PageTitle title="Scripts" count="179" />
          <div style={{ ...row, justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'nowrap' }}>
            <div style={{ ...row, flexWrap: 'nowrap', gap: 'var(--space-2)', minWidth: 0 }}>
              {fieldWidth(220, <TextInput label="Search scripts" showLabel={false} placeholder="Candidate number" leadingIcon="search" size="Small" />)}
              <Chip label="Not marked" />
            </div>
            <div style={{ ...row, flexWrap: 'nowrap' }}>
              {on(v, 'disabled') && <Reason>Select scripts first.</Reason>}
              {slot}
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <Table
              size="Compact"
              selectable
              hoverable={false}
              aria-label="Scripts"
              style={{ border: 'none', borderRadius: 0 }}
              columns={[
                { key: 'script', header: 'Script' },
                { key: 'status', header: 'Status' },
                { key: 'grader', header: 'Grader' },
              ]}
              rows={SCRIPTS as never}
            />
          </div>
        </div>
      ),
    },
    {
      // Secondary: the alternative, beside the main action it is the alternative to.
      location: 'Deliver › Tests › New test',
      canvas: true,
      when: { intent: ['Secondary'] },
      slot: buttonSlot,
      copy: (v) => buttonCopy(v, { label: 'Save draft', icon: 'save', trailing: 'save', menu: 'Save' }),
      render: (slot, v) => (
        <div style={column()}>
          <SetupTitle />
          <FormColumn>
            {setupFields.name}
            {setupFields.questionSet}
          </FormColumn>
          <StepFooter>
            {on(v, 'disabled') && <Reason>No changes since the last save.</Reason>}
            <Button label="Cancel" intent="Text" />
            {slot}
            {NEXT}
          </StepFooter>
        </div>
      ),
    },
    {
      // Outline: an action on the table, at the end of its search row.
      location: 'Deliver › Tests',
      when: { intent: ['Outline'] },
      slot: buttonSlot,
      copy: (v) => buttonCopy(v, { label: 'Export', icon: 'download', trailing: 'download', menu: 'Export' }),
      // Disabled: the search finds nothing, so there is nothing to export - said beside the button.
      render: (slot, v) =>
        on(v, 'disabled') ? (
          <TestsRoster
            actions={CREATE_TEST}
            query="Chemistry"
            toolbarAction={<span style={{ ...row, flexWrap: 'nowrap' }}><Reason>No tests to export.</Reason>{slot}</span>}
            empty={<EmptyState size="Small" icon="search_off" title="No tests match Chemistry" description="Check the spelling, or clear the search to see every test." />}
          />
        ) : (
          <TestsRoster actions={CREATE_TEST} toolbarAction={slot} />
        ),
    },
    {
      // Text: the low-key way into more, in a card's header - as on the real home dashboard.
      location: 'Home',
      canvas: true,
      when: { intent: ['Text'] },
      slot: buttonSlot,
      copy: (v) => buttonCopy(v, { label: 'View all', icon: 'list', trailing: 'arrow_forward', menu: 'Today' }),
      render: (slot, v) => (
        <div style={column()}>
          <Tiles>
            <Stat label="All activities this week" value={428} helpText="Last change today at 14:43" />
            <Stat label="New hand-ins today" value={4} helpText="Last change today at 15:41" />
            <Stat label="In progress right now" value={0} helpText="Last change today at 15:41" />
          </Tiles>
          <Panel title="Recent events" action={<span style={row}>{on(v, 'disabled') && <Reason>Loading events</Reason>}{slot}</span>} flush>
            <List
              size="Compact"
              // Inside a card the list is the card's body, not a second box;
              // its foot follows the card's rounded corners.
              style={{ border: 'none', borderRadius: '0 0 calc(var(--radius-md) - 1px) calc(var(--radius-md) - 1px)' }}
              items={[
                { leadingIcon: 'person', primary: 'Ines Planner published Algebra Quiz', secondary: 'Today at 14:43' },
                { leadingIcon: 'person', primary: 'Ines Planner changed the start time of History Midterm', secondary: 'Today at 14:21' },
                { leadingIcon: 'person', primary: 'Arne Hansen marked 12 submissions in Biology Final', secondary: 'Today at 12:05' },
              ]}
            />
          </Panel>
        </div>
      ),
    },
    {
      // Success: the positive half of a decision, at the end of the request it decides.
      location: 'Monitor › Algebra Quiz › Candidates',
      when: { intent: ['Success'] },
      slot: buttonSlot,
      copy: (v) => buttonCopy(v, { label: 'Approve', icon: 'check', trailing: 'more_time', menu: 'Approve' }),
      render: (slot, v) => (
        <div style={column('var(--space-4)')}>
          <PageTitle title="Candidates" count="24" />
          <Panel title="Requests" action={<Badge label="1 pending" intent="Info" size="Small" />} flush>
            <RequestRow
              actions={<>{on(v, 'disabled') && <Reason>Only the chief invigilator can approve.</Reason>}<Button label="Decline" intent="Text" />{slot}</>}
            />
          </Panel>
          <CandidatesTable />
        </div>
      ),
    },
    {
      // Warning: a consequential bulk action, in the bar that appears once rows are selected.
      location: 'Monitor › Algebra Quiz › Candidates',
      when: { intent: ['Warning'] },
      slot: buttonSlot,
      copy: (v) => buttonCopy(v, { label: 'Pause test', icon: 'pause', trailing: 'timer', menu: 'Pause' }),
      render: (slot, v) => (
        <div style={column('var(--space-4)')}>
          <PageTitle title="Candidates" count="24" />
          <SelectionBar>
            {on(v, 'disabled') && <Reason>Li Wei has already submitted.</Reason>}
            <Button label="Message" intent="Text" leadingIcon="chat" />
            {slot}
          </SelectionBar>
          {/* Disabled: the selected candidate is the one who has submitted, as the reason says. */}
          <CandidatesTable selected={on(v, 'disabled') ? ['2'] : ['0']} />
        </div>
      ),
    },
    {
      // Destructive: set apart at the foot of the settings, with what it deletes beside it.
      location: 'Deliver › Tests › Algebra Quiz › Settings',
      canvas: true,
      when: { intent: ['Destructive'] },
      slot: buttonSlot,
      copy: (v) => buttonCopy(v, { label: 'Delete test', icon: 'delete', trailing: 'arrow_forward', menu: 'Delete' }),
      render: (slot, v) => (
        <div style={column()}>
          <PageTitle title="Settings" />
          <Panel title="General">
            <div style={{ ...row, gap: 'var(--space-8)' }}>
              <Fact label="Test code" value="ALG-2026-114" />
              <Fact label="Created" value="12 Aug 2026" />
              <Fact label="Owner" value="Ines Planner" />
            </div>
          </Panel>
          <Panel>
            <div style={{ ...row, justifyContent: 'space-between', gap: 'var(--space-4)' }}>
              <div style={{ ...column('var(--space-1)'), flex: '1 1 260px' }}>
                <h4 className="inspera-h5" style={{ margin: 0, fontWeight: 600 }}>Delete this test</h4>
                <p style={caption}>
                  {on(v, 'disabled')
                    ? 'Algebra Quiz has candidate responses, so it can no longer be deleted. Archive it instead.'
                    : 'Deletes Algebra Quiz and all 24 candidate responses. This cannot be undone.'}
                </p>
              </div>
              {slot}
            </div>
          </Panel>
        </div>
      ),
    },
    {
      // Primary: the page's one main action, at the right of its title.
      location: 'Deliver › Tests',
      slot: buttonSlot,
      copy: (v) => buttonCopy(v, { label: 'Create new test', icon: 'add', trailing: 'arrow_forward', menu: 'Create new' }),
      render: (slot, v) => (
        <TestsRoster
          actions={slot}
          note={on(v, 'disabled') ? <Reason>Your role can't create tests. Ask a planner to set one up.</Reason> : undefined}
        />
      ),
    },
  ],

  'text-input': [
    {
      // Read only: a field that exists in this form but is locked now, among ones that are not.
      location: 'Deliver › Tests › Algebra Quiz › Setup',
      canvas: true,
      when: { readOnly: ['true'] },
      copy: (v) => ({
        label: 'Test code',
        placeholder: undefined,
        defaultValue: 'ALG-2026-114',
        helpText: on(v, 'showHelp') ? 'Candidates enter this code to start.' : undefined,
        leadingIcon: on(v, 'leadingIcon') ? 'tag' : undefined,
        trailingIcon: on(v, 'trailingIcon') ? 'lock' : undefined,
      }),
      render: (slot, v) => (
        <div style={column()}>
          <PageTitle title="Setup" sub="Live since 19 Sep. Settings candidates already rely on are locked." />
          <FormColumn>
            {/* The form's other fields take the same size as the one in the slot. */}
            <TextInput label="Test name" defaultValue="Algebra Quiz" size={v.size as 'Small' | 'Medium'} />
            <Short>{slot}</Short>
            <Short><TextInput label="Room" defaultValue="B2.14" size={v.size as 'Small' | 'Medium'} /></Short>
          </FormColumn>
        </div>
      ),
    },
    {
      // Disabled: a field that waits on a switch - indented under it, so the dependency shows.
      // Turning the switch on enables the field, as it does in the product.
      location: 'Deliver › Tests › New test › Security',
      canvas: true,
      when: { disabled: ['true'] },
      locks: () => ({ showHelp: KEEPS_REASON }),
      copy: (v, s) => {
        const enabled = s.get('requireCode', false)
        return {
          label: 'Access code',
          placeholder: 'e.g. 4821',
          disabled: on(v, 'disabled') && !enabled,
          defaultValue: on(v, 'withValue') ? '4821' : undefined,
          helpText: on(v, 'showHelp') ? (enabled ? 'Candidates enter it before they start.' : 'Turn on Require access code to set one.') : undefined,
          leadingIcon: on(v, 'leadingIcon') ? 'key' : undefined,
          trailingIcon: on(v, 'trailingIcon') ? 'visibility' : undefined,
        }
      },
      render: (slot, v, s) => {
        const size = v.size === 'Small' ? 'Small' : 'Medium'
        return (
          <div style={column()}>
            <PageTitle title="Security" />
            <Panel flush>
              <SettingsList>
                <SettingRow control={<Toggle label="Lock the browser" size={size} defaultChecked description="Candidates cannot open other apps or tabs." />} />
                <div style={{ ...column('var(--space-3)'), padding: 'var(--space-3) 0' }}>
                  <Toggle label="Require access code" size={size} checked={s.get('requireCode', false)} onChange={(c) => s.set('requireCode', c)} />
                  {/* Track width plus the toggle's gap: the field sits under the switch's label. */}
                  <div style={{ paddingLeft: size === 'Small' ? 44 : 52, maxWidth: (size === 'Small' ? 44 : 52) + 240 }}>{slot}</div>
                </div>
              </SettingsList>
            </Panel>
          </div>
        )
      },
    },
    {
      // Small: a dense filter panel beside the roster it filters. Live: the
      // Candidate field and the Status boxes filter the table, and Clear resets both.
      location: 'Monitor › Algebra Quiz › Candidates',
      when: { size: ['Small'] },
      demonstrates: ['size', 'error'],
      copy: (v, s) => ({
        label: 'Candidate',
        placeholder: 'Name or ID',
        value: s.get('q', on(v, 'withValue') ? 'Jane' : ''),
        onChange: (q: string) => s.set('q', q),
        helpText: on(v, 'showHelp') ? 'Matches any part of a name or ID.' : undefined,
        leadingIcon: on(v, 'leadingIcon') ? 'search' : undefined,
        trailingIcon: on(v, 'trailingIcon') ? 'close' : undefined,
        errorText: on(v, 'error') ? 'Use at least 2 characters.' : undefined,
      }),
      render: (slot, v, s) => {
        // In error the search is too short to apply, so it filters nothing yet.
        const q = on(v, 'error') ? '' : s.get('q', on(v, 'withValue') ? 'Jane' : '').trim().toLowerCase()
        const states = s.get<string[]>('status', ['in-progress'])
        const rows = CANDIDATES.filter(
          (c, i) => c.candidate.toLowerCase().includes(q) && (states.length === 0 || states.includes(CANDIDATE_STATE[i])),
        )
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 'var(--space-6)' }}>
            <div style={{ ...column('var(--space-4)'), flex: '0 1 220px', minWidth: 180, paddingRight: 'var(--space-5)', borderRight: hairline }}>
              {/* Clear sits with the panel's title, so every field keeps the same left edge. */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
                <h4 className="inspera-h5" style={{ margin: 0, fontWeight: 600 }}>Filters</h4>
                <Button label="Clear" intent="Text" size="Small" onClick={() => { s.set('q', ''); s.set('status', []) }} />
              </div>
              {slot}
              <TextInput label="Room" placeholder="e.g. B2.14" size="Small" />
              <CheckboxGroup
                label="Status"
                options={[
                  { label: 'Not started', value: 'not-started' },
                  { label: 'In progress', value: 'in-progress' },
                  { label: 'Submitted', value: 'submitted' },
                ]}
                value={states}
                onChange={(next) => s.set('status', next)}
              />
            </div>
            <div style={{ ...column('var(--space-4)'), flex: '1 1 340px' }}>
              <PageTitle title="Candidates" count="24" />
              {rows.length > 0 ? <CandidatesTable rows={rows} /> : <p style={caption}>No candidates match these filters.</p>}
            </div>
          </div>
        )
      },
    },
    {
      // Medium, and Error: a field in the setup form.
      location: 'Deliver › Tests › New test',
      canvas: true,
      demonstrates: ['size', 'error'],
      copy: (v) => ({
        label: 'Test name',
        placeholder: 'e.g. Algebra midterm',
        defaultValue: on(v, 'withValue') ? 'Algebra midterm' : undefined,
        helpText: on(v, 'showHelp') ? 'Candidates see this name when they start.' : undefined,
        leadingIcon: on(v, 'leadingIcon') ? 'title' : undefined,
        errorText: on(v, 'error') ? 'Enter a name for the test.' : undefined,
      }),
      render: (slot) => (
        <div style={column()}>
          <SetupTitle />
          <FormColumn>
            {slot}
            {setupFields.questionSet}
            {setupFields.session}
            <Textarea label="Test information" placeholder="What candidates should know before they start." rows={2} />
          </FormColumn>
          <StepFooter>{NEXT}</StepFooter>
        </div>
      ),
    },
  ],

  select: [
    {
      // Hug: one filter among others in the filter bar above the roster. A
      // required filter - results need a class - is where an error belongs.
      location: 'Deliver › Tests',
      when: { widthMode: ['Hug'] },
      demonstrates: ['widthMode', 'search', 'error'],
      copy: (v) =>
        on(v, 'error')
          ? { label: 'Class', options: CLASSES, placeholder: 'Choose a class', defaultValue: undefined, errorText: 'Choose a class to see its results.' }
          : on(v, 'search')
            ? {
                label: 'Subject',
                options: SUBJECTS,
                placeholder: 'Any subject',
                defaultValue: on(v, 'withValue') ? 'Mathematics' : undefined,
                helpText: on(v, 'disabled') ? 'Set by the subject you teach.' : undefined,
              }
            : {
                label: 'Status',
                options: ['Live', 'Scheduled', 'Draft', 'Closed'],
                placeholder: 'Any status',
                defaultValue: on(v, 'withValue') ? 'Live' : undefined,
                helpText: on(v, 'disabled') ? 'Archived tests have no status.' : undefined,
              },
      render: (slot, v) =>
        on(v, 'error') ? (
          <div style={column('var(--space-4)')}>
            <PageTitle title="Results" aside={<Badge label="Marking" intent="Info" size="Small" />} />
            <FilterBar>
              {slot}
              <Select label="Question" widthMode="Hug" placeholder="All questions" options={['1 · Linear equations', '2 · Factorising', '4 · Causes of war']} />
            </FilterBar>
            <div style={{ padding: 'var(--space-6) 0', border: hairline, borderRadius: 'var(--radius-md)', background: 'var(--surface)' }}>
              <EmptyState size="Small" icon="groups" title="No class chosen" description="Results are shown one class at a time." />
            </div>
          </div>
        ) : (
          <TestsRoster
            actions={CREATE_TEST}
            filters={
              <div style={column('var(--space-3)')}>
                <FilterBar>
                  <div style={{ width: 240, maxWidth: '100%' }}>
                    <TextInput label="Search" placeholder="Title or code" leadingIcon="search" />
                  </div>
                  {slot}
                  {/* The other filter is whichever one the slot is not. */}
                  {on(v, 'search')
                    ? <Select label="Status" widthMode="Hug" placeholder="Any status" options={['Live', 'Scheduled', 'Draft', 'Closed']} />
                    : <Select label="Subject" widthMode="Hug" placeholder="Any subject" options={SUBJECTS} search />}
                  {/* Reset, and the active filter as a Tag, only once a filter is set. */}
                  {on(v, 'withValue') && <FieldAction><Button label="Reset" intent="Text" /></FieldAction>}
                </FilterBar>
                {on(v, 'withValue') && (
                  <div style={row}>
                    <Tag label={on(v, 'search') ? 'Subject: Mathematics' : 'Status: Live'} size="Small" removable onRemove={noop} />
                  </div>
                )}
              </div>
            }
          />
        ),
    },
    {
      // Fixed: fields of one width in a row, which stays even whatever is chosen.
      location: 'Deliver › Tests › New test',
      canvas: true,
      demonstrates: ['widthMode', 'search', 'error'],
      copy: (v) =>
        on(v, 'search')
          ? {
              label: 'Subject',
              options: SUBJECTS,
              placeholder: 'Select a subject',
              defaultValue: on(v, 'withValue') ? 'Mathematics' : undefined,
              helpText: on(v, 'disabled') ? 'Set by the question set.' : undefined,
              errorText: on(v, 'error') ? 'Choose a subject.' : undefined,
            }
          : {
              label: 'Language',
              options: ['English', 'Norwegian', 'Swedish', 'Danish', 'Finnish'],
              placeholder: 'Select a language',
              defaultValue: on(v, 'withValue') ? 'English' : undefined,
              helpText: on(v, 'disabled') ? 'Set by your institution for every test.' : undefined,
              errorText: on(v, 'error') ? 'Choose a language.' : undefined,
            },
      render: (slot) => (
        <div style={column()}>
          <SetupTitle />
          <FormColumn>
            {setupFields.name}
            <div style={{ ...row, alignItems: 'flex-start', gap: 'var(--space-6)' }}>
              {slot}
              <Select label="Time zone" options={TIME_ZONES} defaultValue={TIME_ZONES[0]} />
            </div>
          </FormColumn>
          <StepFooter>{NEXT}</StepFooter>
        </div>
      ),
    },
  ],

  badge: [
    {
      // Small: the status column of a roster, one status among others - all with or without icons.
      location: 'Deliver › Tests',
      when: { size: ['Small'] },
      demonstrates: ['size', 'intent'],
      copy: (v) => ({ label: BADGE_STATUS[v.intent] }),
      render: (slot, v) => {
        const others = Object.keys(BADGE_STATUS).filter((i) => i !== v.intent).slice(0, 2) as BadgeIntent[]
        return (
          <TestsRoster
            actions={CREATE_TEST}
            status={(i) => (i === 0 ? slot : <Badge label={BADGE_STATUS[others[i - 1]]} intent={others[i - 1]} size="Small" withIcon={on(v, 'withIcon')} />)}
          />
        )
      },
    },
    {
      // Medium: the status of the thing the page is about, beside its title.
      location: 'Deliver › Tests › Algebra Quiz',
      canvas: true,
      demonstrates: ['size', 'intent'],
      copy: (v) => ({ label: BADGE_STATUS[v.intent] }),
      render: (slot, v) => (
        <div style={column()}>
          <PageTitle
            title="Algebra Quiz"
            aside={slot}
            actions={<><Button label="Edit" intent="Secondary" /><Button label={STATUS_ACTION[v.intent] ?? STATUS_ACTION.Neutral} intent="Primary" /></>}
          />
          <Panel title="Test details">
            <div style={{ ...row, gap: 'var(--space-8)' }}>
              <Fact label="Questions" value="24" />
              <Fact label="Duration" value="1 h 30 min" />
              <Fact label="Starts" value="19 Sep 2026, 09:00" />
              <Fact label="Candidates" value="24" />
            </div>
          </Panel>
        </div>
      ),
    },
  ],

  alert: [
    {
      // Success: the outcome, under the title of the thing it happened to.
      location: 'Deliver › Tests › Algebra Quiz',
      canvas: true,
      when: { intent: ['Success'] },
      copy: (v, s) => ({
        onClose: s.dismiss,
        title: on(v, 'withTitle') ? 'Test published' : undefined,
        message: 'Candidates can start Algebra Quiz on 19 Sep at 09:00.',
        actionLabel: on(v, 'withAction') ? 'View test' : undefined,
      }),
      render: (slot) => (
        <div style={column()}>
          <PageTitle title="Algebra Quiz" aside={<Badge label="Live" intent="Success" size="Small" />} actions={<Button label="Open in Monitor" intent="Secondary" />} />
          {slot}
          <Panel title="Test details">
            <div style={{ ...row, gap: 'var(--space-8)' }}>
              <Fact label="Starts" value="19 Sep 2026, 09:00" />
              <Fact label="Duration" value="1 h 30 min" />
              <Fact label="Candidates" value="24" />
            </div>
          </Panel>
        </div>
      ),
    },
    {
      // Warning: above the roster it is about, before the tools to act on it.
      location: 'Monitor › Algebra Quiz › Candidates',
      when: { intent: ['Warning'] },
      copy: (v, s) => ({
        onClose: s.dismiss,
        title: on(v, 'withTitle') ? '4 candidates have not started' : undefined,
        message: 'The test closes in 15 minutes.',
        actionLabel: on(v, 'withAction') ? 'Message candidates' : undefined,
      }),
      render: (slot) => (
        <div style={column('var(--space-4)')}>
          <PageTitle title="Candidates" count="24" />
          {slot}
          <ToolbarWell label="Search candidates">
            <Chip label="Not started" />
            <Chip label="Warnings" />
            <Chip label="Filters" icon="filter_list" />
          </ToolbarWell>
          <CandidatesTable />
        </div>
      ),
    },
    {
      // Error: at the top of the form it blocks, above the fields that need fixing.
      location: 'Deliver › Tests › New test',
      canvas: true,
      when: { intent: ['Error'] },
      copy: (v, s) => ({
        onClose: s.dismiss,
        title: on(v, 'withTitle') ? 'Fix 2 fields before you continue' : undefined,
        message: 'Add a test name and choose a question set.',
        actionLabel: on(v, 'withAction') ? 'Go to first field' : undefined,
      }),
      render: (slot) => (
        <div style={column()}>
          <SetupTitle />
          {/* As wide as the form it is about, not the page. */}
          <FormColumn>
            {slot}
            <TextInput label="Test name" error errorText="Enter a name for the test." />
            <Select label="Question set" placeholder="Select a question set" options={QUESTION_SETS} error errorText="Choose a question set." />
          </FormColumn>
          <StepFooter>{NEXT}</StepFooter>
        </div>
      ),
    },
    {
      // Info: context under the title, before the list it explains.
      location: 'Grade › Algebra Quiz',
      copy: (v, s) => ({ actionLabel: on(v, 'withAction') ? 'View progress' : undefined, onClose: s.dismiss }),
      render: (slot) => (
        <div style={column('var(--space-4)')}>
          <PageTitle title="Algebra Quiz" aside={<Badge label="Grading" intent="Info" size="Small" />} />
          {slot}
          <div style={{ overflowX: 'auto' }}>
            <Table
              size="Compact"
              striped
              hoverable={false}
              style={{ border: 'none', borderRadius: 0 }}
              columns={[
                { key: 'candidate', header: 'Candidate' },
                { key: 'marker', header: 'Marked by' },
                { key: 'status', header: 'Status' },
              ]}
              rows={[
                { candidate: 'Jane Cooper', marker: 'Arne Hansen', status: <Badge label="Marked" intent="Success" size="Small" /> },
                { candidate: 'Omar Haddad', marker: 'Not assigned', status: <Badge label="Needs grading" intent="Warning" size="Small" /> },
                { candidate: 'Li Wei', marker: 'Arne Hansen', status: <Badge label="Marked" intent="Success" size="Small" /> },
              ]}
            />
          </div>
        </div>
      ),
    },
  ],

  // Every Toggle scene works with the label hidden too: the list then names
  // each setting in its rows and puts the switches at the end.
  toggle: [
    {
      // Disabled: a locked setting, with the reason where the description goes -
      // shown whatever Description says, because it says why.
      location: 'Deliver › Tests › New test › Security',
      canvas: true,
      when: { disabled: ['true'] },
      demonstrates: ['disabled', 'withLabel'],
      copy: (v) => ({ label: 'Allow leaving fullscreen', description: on(v, 'withLabel') ? LOCKED_BY_POLICY : undefined }),
      render: (slot, v) => (
        <div style={column()}>
          <PageTitle title="Security" />
          <Panel flush>
            <SettingsList>
              <ToggleSetting
                v={v}
                size={v.size as 'Small' | 'Medium'}
                label="Lock the browser"
                defaultChecked
                description="Candidates cannot open other apps or tabs."
              />
              <SettingRow last title={rowTitle(v, 'Allow leaving fullscreen')} dimmed control={slot} description={LOCKED_BY_POLICY} />
            </SettingsList>
          </Panel>
        </div>
      ),
    },
    {
      // Small: the dense settings panel beside the question being edited.
      location: 'Author › Question sets › Algebra Quiz',
      canvas: true,
      when: { size: ['Small'] },
      demonstrates: ['size', 'withLabel'],
      copy: (v) => ({ label: 'Shuffle answer options', description: toggleLine(v, 'A new order for each candidate.') }),
      render: (slot, v) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
          <div style={{ flex: '2 1 280px', minWidth: 0 }}>
            <Panel title="Question 3">
              <div style={column('var(--space-4)')}>
                <p style={body}>Which value of x satisfies 2x + 6 = 14?</p>
                <RadioGroup
                  label="Correct answer"
                  name="scene-correct-answer"
                  options={[
                    { label: 'x = 3', value: '3' },
                    { label: 'x = 4', value: '4' },
                    { label: 'x = 10', value: '10' },
                  ]}
                  defaultValue="4"
                />
              </div>
            </Panel>
          </div>
          <div style={{ flex: '1 1 220px', minWidth: 0 }}>
            <Panel title="Question settings" flush>
              <SettingsList>
                <ToggleSetting v={v} size="Small" label="Required" defaultChecked description="Candidates must answer it." />
                <SettingRow title={rowTitle(v, 'Shuffle answer options')} control={slot} description="A new order for each candidate." />
                <ToggleSetting v={v} last size="Small" label="Partial credit" description="Score each correct option." />
              </SettingsList>
            </Panel>
          </div>
        </div>
      ),
    },
    {
      // Medium: one setting per row on a settings page.
      location: 'Deliver › Tests › New test › Options',
      canvas: true,
      demonstrates: ['size', 'withLabel'],
      copy: (v) => ({ label: 'Allow late submissions', description: toggleLine(v, LATE_SUBMISSIONS) }),
      render: (slot, v) => (
        <div style={column()}>
          <PageTitle title="Options" />
          <Panel title="General settings" flush>
            <SettingsList>
              <SettingRow title={rowTitle(v, 'Allow late submissions')} control={slot} description={LATE_SUBMISSIONS} />
              <ToggleSetting v={v} label="Shuffle question order" defaultChecked description="Each candidate gets the questions in a different order." />
              <ToggleSetting v={v} last label="Show results right away" description="Candidates see their score as soon as they submit." />
            </SettingsList>
          </Panel>
        </div>
      ),
    },
  ],

  // --- Input controls, past the pilot ----------------------------------------

  textarea: [
    {
      // Read only: the grader's own feedback once marks are confirmed - still there to read and copy.
      location: 'Grade › History Midterm › Candidate 0142',
      canvas: true,
      when: { readOnly: ['true'] },
      copy: (v) => ({
        label: 'Your feedback',
        placeholder: undefined,
        rows: 4,
        defaultValue: 'Two clear causes, each backed by evidence. Weigh them against each other in the conclusion instead of repeating the introduction.',
        helpText: on(v, 'showHelp') ? 'Candidates see this feedback with their mark.' : undefined,
        errorText: on(v, 'error') ? 'Feedback is longer than candidates can be shown.' : undefined,
      }),
      render: (slot) => (
        <MarkingLayout
          status={<Badge label="Confirmed" intent="Success" size="Small" />}
          panel={
            <Panel title="Marking">
              <div style={column('var(--space-4)')}>
                {/* Why the panel is locked leads it, apart from the field's own help under the field. */}
                <Reason>Confirmed on 2 October. Ask the test owner to reopen marking to change it.</Reason>
                <MarkLine />
                {slot}
              </div>
            </Panel>
          }
        />
      ),
    },
    {
      // Disabled: the custom message only applies once Custom message is chosen above it.
      location: 'Deliver › Tests › Algebra Quiz › Settings',
      canvas: true,
      when: { disabled: ['true'] },
      locks: () => ({ showHelp: KEEPS_REASON }),
      // Choosing Custom message enables the field, as it does in the product.
      copy: (v, s) => {
        const custom = s.get<string>('message', 'default') === 'custom'
        return {
          label: 'Custom message',
          placeholder: 'Tell candidates what to do if they lose connection.',
          disabled: on(v, 'disabled') && !custom,
          defaultValue: on(v, 'withValue') ? 'Stay in your seat and raise your hand. Your answers are saved.' : undefined,
          helpText: on(v, 'showHelp') ? (custom ? 'Candidates see it the moment they lose connection.' : 'Choose Custom message to write your own.') : undefined,
          rows: 3,
        }
      },
      render: (slot, _v, s) => (
        <SettingsForm>
          <Panel title="Lost connection alert">
            <div style={column('var(--space-3)')}>
              <RadioGroup
                label="Message shown to candidates"
                name="scene-lost-connection"
                options={[{ label: 'Default message', value: 'default' }, { label: 'Custom message', value: 'custom' }]}
                value={s.get('message', 'default')}
                onChange={(m) => s.set('message', m)}
              />
              <Indented>{fieldWidth(480, slot)}</Indented>
            </div>
          </Panel>
        </SettingsForm>
      ),
    },
    {
      // Error: AI-supported marking needs a marking guide, so the guide becomes required.
      // With a guide written, it is too short. Turning AI-supported marking off clears the error.
      location: 'Author › Question sets › History Midterm',
      canvas: true,
      when: { error: ['true'] },
      copy: (v, s) => {
        const ai = s.get('ai', true)
        return {
          label: 'Marking guide',
          placeholder: 'What a full-mark answer includes.',
          defaultValue: on(v, 'withValue') ? 'Two causes, each explained with evidence.' : undefined,
          helpText: on(v, 'showHelp') ? (ai ? 'AI-supported marking suggests marks from this guide.' : 'Graders see this guide while they mark.') : undefined,
          error: on(v, 'error') && ai,
          errorText: on(v, 'withValue')
            ? 'Add more detail. AI-supported marking needs at least 80 characters.'
            : 'Add a marking guide. AI-supported marking needs one.',
          rows: 4,
        }
      },
      render: (slot, _v, s) => {
        const ai = s.get('ai', true)
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
            <div style={{ flex: '2 1 280px', minWidth: 0 }}>
              <Panel title="Question 4">
                <div style={column('var(--space-3)')}>
                  <p style={{ ...body, fontWeight: 500 }}>Explain two causes of the First World War.</p>
                  <p style={caption}>Essay · 20 marks · {ai ? 'AI-supported marking' : 'Marked by hand'}</p>
                </div>
              </Panel>
            </div>
            <div style={{ flex: '1 1 260px', minWidth: 0 }}>
              <Panel title="Marking">
                <div style={column('var(--space-4)')}>
                  <Checkbox label="Enable AI-supported marking" checked={ai} onChange={(c) => s.set('ai', c)} />
                  {slot}
                </div>
              </Panel>
            </div>
          </div>
        )
      },
    },
    {
      // Character count: a message to candidates' screens has a hard limit, so the count stays in view.
      location: 'Monitor › Algebra Quiz › Candidates',
      when: { showCount: ['true'] },
      copy: (v) => ({
        label: 'Message',
        placeholder: 'Write a short message.',
        defaultValue: on(v, 'withValue') ? 'The test closes at 10:30. Hand in what you have by then.' : undefined,
        helpText: on(v, 'showHelp') ? 'Shows on their screens straight away.' : undefined,
        rows: 3,
      }),
      render: (slot) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 'var(--space-6)' }}>
          <div style={{ ...column('var(--space-4)'), flex: '2 1 320px' }}>
            <PageTitle title="Candidates" count="24" />
            <SelectionBar>
              <Button label="Pause test" intent="Text" leadingIcon="pause" />
            </SelectionBar>
            <CandidatesTable selected={['0']} />
          </div>
          <div style={{ flex: '1 1 240px', minWidth: 0 }}>
            <Panel title="Send a message">
              <div style={column('var(--space-4)')}>
                <Fact label="To" value="Jane Cooper" />
                {slot}
                <div style={{ ...row, justifyContent: 'flex-end' }}>
                  <Button label="Send message" intent="Primary" leadingIcon="send" />
                </div>
              </div>
            </Panel>
          </div>
        </div>
      ),
    },
    {
      // Small: a comment under each criterion, in the dense marking panel.
      location: 'Grade › History Midterm › Candidate 0142',
      canvas: true,
      when: { size: ['Small'] },
      copy: (v) => ({
        label: 'Comment on Use of evidence',
        placeholder: 'Optional',
        defaultValue: on(v, 'withValue') ? 'Good use of the alliance treaties.' : undefined,
        helpText: on(v, 'showHelp') ? 'Shown to the candidate.' : undefined,
        rows: 2,
      }),
      render: (slot) => (
        <MarkingLayout
          panel={
            <Panel title="Rubric">
              <div style={column('var(--space-4)')}>
                <div style={column('var(--space-2)')}>
                  <GroupTitle sub="6 of 8 marks">Argument</GroupTitle>
                  <Textarea label="Comment on Argument" size="Small" rows={2} defaultValue="Clear line of argument throughout." />
                </div>
                <div style={column('var(--space-2)')}>
                  <GroupTitle sub="8 of 12 marks">Use of evidence</GroupTitle>
                  {slot}
                </div>
              </div>
            </Panel>
          }
        />
      ),
    },
    {
      // Medium: a plain-text field in the setup form.
      location: 'Deliver › Tests › New test',
      canvas: true,
      copy: (v) => ({
        label: 'Notes for invigilators',
        placeholder: 'Anything invigilators should know on the day.',
        defaultValue: on(v, 'withValue') ? 'Calculators are allowed. Collect scrap paper at the end.' : undefined,
        helpText: on(v, 'showHelp') ? 'Invigilators see these notes in Monitor.' : undefined,
        rows: 3,
      }),
      render: (slot) => (
        <div style={column()}>
          <SetupTitle />
          <FormColumn>
            {setupFields.name}
            {setupFields.questionSet}
            {slot}
          </FormColumn>
          <StepFooter>{NEXT}</StepFooter>
        </div>
      ),
    },
  ],

  // The Disabled and Error scenes work with the label hidden too: their
  // options become rows of a list, each named by its row.
  checkbox: [
    {
      // Disabled: late submissions need an end time first - and the reason sits right under the option.
      // Typing an end time enables it. Ticked and disabled, the exam office has turned it on for everyone.
      location: 'Deliver › Tests › New test',
      canvas: true,
      when: { disabled: ['true'] },
      demonstrates: ['disabled', 'withLabel'],
      locks: () => ({
        indeterminate: { value: 'false', reason: 'This option stands alone, so it has no mixed state. Turn off Disabled to see Indeterminate on a select-all box.' },
      }),
      copy: (v, s) => {
        const ready = !on(v, 'checked') && s.get('end', '') !== ''
        return {
          label: 'Allow late submissions',
          disabled: on(v, 'disabled') && !ready,
          description: on(v, 'withLabel') ? lateReason(v, ready) : undefined,
        }
      },
      render: (slot, v, s) => {
        const ready = !on(v, 'checked') && s.get('end', '') !== ''
        return (
          <TimingFields
            onEnd={(end) => s.set('end', end)}
            options={
              on(v, 'withLabel') ? (
                <>
                  {slot}
                  <Checkbox label="Allow multiple attempts" description={on(v, 'showDescription') ? MULTIPLE_ATTEMPTS : undefined} />
                </>
              ) : (
                <OptionList
                  rows={[
                    { control: slot, name: 'Allow late submissions', meta: lateReason(v, ready), dimmed: !ready },
                    {
                      control: <Checkbox label="Allow multiple attempts" withLabel={false} />,
                      name: 'Allow multiple attempts',
                      meta: MULTIPLE_ATTEMPTS,
                    },
                  ]}
                />
              )
            }
          />
        )
      },
    },
    {
      // Error: a declaration that has to be ticked before marks can be submitted.
      // Ticking it clears the error. With the label hidden, it is ticked for each question in a list.
      location: 'Grade › History Midterm',
      canvas: true,
      when: { error: ['true'] },
      demonstrates: ['error', 'withLabel'],
      copy: (v, s) => ({
        label: on(v, 'withLabel') ? 'I confirm these marks are final' : 'Confirm the marks for question 1',
        error: on(v, 'error') && !s.get('q1', false),
        errorText: 'Confirm that the marks are final to submit them.',
        // Ticked, the error gives way to the description, as it would in the product.
        description: on(v, 'showDescription') ? 'Submitted marks can only change if marking is reopened.' : undefined,
        onChange: (c: boolean) => s.set('q1', c),
      }),
      render: (slot, v, s) => {
        const done = s.get('q1', false) && (on(v, 'withLabel') || s.get('q2', false))
        return (
          <div style={column()}>
            <PageTitle title="Submit marks" />
            <Panel>
              <div style={column('var(--space-4)')}>
                <div style={{ ...row, gap: 'var(--space-8)' }}>
                  <Fact label="Responses marked" value="40 of 40" />
                  <Fact label="Average mark" value="13.5 of 20" />
                </div>
                {on(v, 'withLabel') ? (
                  <div>{slot}</div>
                ) : (
                  <div style={column('var(--space-1)')}>
                    <OptionList
                      rows={[
                        { control: slot, name: 'Question 1 · Essay', meta: '40 of 40 marked · Average 7.2 of 10' },
                        {
                          control: (
                            <Checkbox
                              label="Confirm the marks for question 2"
                              withLabel={false}
                              error={!s.get('q2', false)}
                              checked={s.get('q2', false)}
                              onChange={(c) => s.set('q2', c)}
                            />
                          ),
                          name: 'Question 2 · Short answer',
                          meta: '40 of 40 marked · Average 6.3 of 10',
                        },
                      ]}
                    />
                    {!done && <p style={{ ...caption, color: 'var(--error)' }}>Confirm the marks for every question to submit them.</p>}
                  </div>
                )}
                <div style={row}>
                  <Button label="Submit marks" intent="Primary" />
                </div>
              </div>
            </Panel>
          </div>
        )
      },
    },
    {
      // Indeterminate: select all, when only some of the rows are selected. Live:
      // select-all ticks every row, and the rows decide what select-all shows.
      location: 'Author › Question sets › Algebra Quiz',
      canvas: true,
      when: { indeterminate: ['true'] },
      demonstrates: ['indeterminate', 'withLabel'],
      locks: (v) => ({
        checked: { value: v.checked, reason: 'Here the rows decide: select-all is ticked once every row is. Tick the rows in the scene.' },
        showDescription: { value: 'false', reason: 'A select-all box needs no description: the list under it says what it selects.' },
      }),
      copy: (_v, s) => {
        const rows = s.get('rows', [true, false, false])
        const n = count(rows)
        return {
          label: 'Select all questions',
          checked: n === rows.length,
          indeterminate: n > 0 && n < rows.length,
          onChange: (c: boolean) => s.set('rows', rows.map(() => c)),
        }
      },
      render: (slot, v, s) => {
        const rows = s.get('rows', [true, false, false])
        return (
          <div style={column('var(--space-4)')}>
            <PageTitle title="Add from question bank" sub="Linear and quadratic equations · 3 questions" />
            <PickList
              // The box names itself when its label shows; the count stays beside the action.
              title={on(v, 'withLabel') ? undefined : `${count(rows)} of ${rows.length} selected`}
              header={slot}
              rows={BANK_QUESTIONS}
              checked={rows}
              onCheck={(i, c) => s.set('rows', rows.map((x, j) => (j === i ? c : x)))}
              action={
                <span style={{ ...row, gap: 'var(--space-3)' }}>
                  {on(v, 'withLabel') && <span style={caption}>{count(rows)} of {rows.length} selected</span>}
                  {addQuestions(count(rows))}
                </span>
              }
            />
          </div>
        )
      },
    },
    {
      // No visible label: the row names it, so the box needs only its label for screen readers.
      location: 'Author › Question sets › Algebra Quiz',
      canvas: true,
      when: { withLabel: ['false'] },
      copy: (v, s) => {
        const rows = s.get('rows', [on(v, 'checked'), true, false])
        return {
          label: `Select ${BANK_QUESTIONS[0].name}`,
          checked: rows[0],
          onChange: (c: boolean) => s.set('rows', rows.map((x, j) => (j === 0 ? c : x))),
        }
      },
      render: (slot, v, s) => {
        const rows = s.get('rows', [on(v, 'checked'), true, false])
        return (
          <div style={column('var(--space-4)')}>
            <PageTitle title="Add from question bank" sub="Linear and quadratic equations · 3 questions" />
            <PickList
              title="Questions"
              first={slot}
              rows={BANK_QUESTIONS}
              checked={rows}
              onCheck={(i, c) => s.set('rows', rows.map((x, j) => (j === i ? c : x)))}
              action={addQuestions(count(rows))}
            />
          </div>
        )
      },
    },
    {
      // An option saved with the form, under the fields it belongs to. With
      // Description on, each option says what it does under its label.
      location: 'Deliver › Tests › New test',
      canvas: true,
      copy: (v) => ({
        label: 'Allow multiple attempts',
        description: on(v, 'showDescription') ? MULTIPLE_ATTEMPTS : undefined,
      }),
      render: (slot, v) => (
        <TimingFields
          end="19 Sep 2026, 10:30"
          options={
            <>
              <Checkbox label="Allow late submissions" defaultChecked description={on(v, 'showDescription') ? LATE_SUBMISSIONS : undefined} />
              {slot}
            </>
          }
        />
      ),
    },
  ],

  'checkbox-group': [
    {
      // Disabled: when to open chat only matters once chat is on - indented under the option that turns it on.
      location: 'Deliver › Tests › Algebra Quiz › Settings',
      canvas: true,
      when: { disabled: ['true'] },
      demonstrates: ['disabled', 'orientation'],
      // Ticking Allow chat enables the group, as it does in the product.
      copy: (v, s) => {
        const chat = s.get('chat', false)
        return {
          label: 'Open chat',
          options: [{ label: 'Before the test', value: 'before' }, { label: 'During the test', value: 'during' }],
          defaultValue: ['during'],
          disabled: on(v, 'disabled') && !chat,
          helpText: chat ? 'Invigilators can answer from Monitor.' : 'Turn on Allow chat to choose when.',
        }
      },
      render: (slot, _v, s) => (
        <SettingsForm>
          <Panel title="Chat">
            <div style={column('var(--space-2)')}>
              <Checkbox label="Allow chat between candidates and invigilators" checked={s.get('chat', false)} onChange={(c) => s.set('chat', c)} />
              <Indented>{slot}</Indented>
            </div>
          </Panel>
        </SettingsForm>
      ),
    },
    {
      // Error: at least one way to send the invitation is needed.
      location: 'Deliver › Tests › Algebra Quiz › Candidates',
      canvas: true,
      when: { error: ['true'] },
      demonstrates: ['error', 'orientation'],
      copy: () => ({
        label: 'Send the invitation by',
        options: [{ label: 'Email', value: 'email' }, { label: 'Text message', value: 'sms' }],
        defaultValue: [],
        errorText: 'Choose at least one way to send the invitation.',
      }),
      render: (slot) => (
        <div style={column()}>
          <PageTitle title="Invite candidates" sub="24 candidates who have not been invited yet." />
          <Panel>
            <div style={column('var(--space-4)')}>
              {slot}
              <div style={row}>
                <Button label="Send invitations" intent="Primary" />
              </div>
            </div>
          </Panel>
        </div>
      ),
    },
    {
      // Horizontal: three short, parallel options that read as one line.
      location: 'Deliver › Tests › Algebra Quiz › Settings',
      canvas: true,
      when: { orientation: ['Horizontal'] },
      copy: () => ({
        label: 'Release to candidates',
        options: [{ label: 'Marks', value: 'marks' }, { label: 'Grades', value: 'grades' }, { label: 'Comments', value: 'comments' }],
        defaultValue: ['marks', 'grades'],
      }),
      render: (slot) => (
        <SettingsForm>
          <Panel title="Results">
            <div style={column('var(--space-4)')}>
              <Checkbox label="Show candidates a results page" defaultChecked />
              {slot}
            </div>
          </Panel>
        </SettingsForm>
      ),
    },
    {
      // Vertical: one option per line, easy to scan in a settings form.
      location: 'Deliver › Tests › Algebra Quiz › Settings',
      canvas: true,
      copy: () => ({
        label: 'Tools candidates can use',
        options: [{ label: 'Text to speech', value: 'tts' }, { label: 'Spell checker', value: 'spell' }, { label: 'Calculator', value: 'calc' }],
        defaultValue: ['tts', 'calc'],
        helpText: 'Candidates find them in the test toolbar.',
      }),
      render: (slot) => (
        <SettingsForm>
          <Panel title="Candidate tools and aids">{slot}</Panel>
        </SettingsForm>
      ),
    },
  ],

  'radio-button': [
    {
      // Disabled: one option cannot be chosen on this test, and its description says why.
      // Selected and disabled, the choice is locked in. With the label hidden, the
      // options become rows of a list, each named by its row.
      location: 'Deliver › Tests › Algebra Quiz › Settings',
      canvas: true,
      when: { disabled: ['true'] },
      demonstrates: ['disabled', 'withLabel'],
      copy: (v) => ({
        label: 'Shared marking',
        name: 'scene-workflow',
        description: on(v, 'withLabel') ? sharedReason(v) : undefined,
      }),
      render: (slot, v) => {
        // One choice per group: the other option is chosen only when the slot is not.
        const other = !on(v, 'selected')
        return (
          <SettingsForm>
            <Panel title="Marking workflow">
              {on(v, 'withLabel') ? (
                <div role="radiogroup" aria-label="Marking workflow" style={column('var(--space-2)')}>
                  <RadioButton
                    label="Private marking"
                    name="scene-workflow"
                    defaultSelected={other}
                    error={on(v, 'error')}
                    description={on(v, 'showDescription') ? 'Each grader marks alone. Marks are aligned afterwards.' : undefined}
                  />
                  {slot}
                </div>
              ) : (
                <div role="radiogroup" aria-label="Marking workflow">
                  <OptionList
                    rows={[
                      {
                        control: <RadioButton label="Private marking" withLabel={false} name="scene-workflow" defaultSelected={other} error={on(v, 'error')} />,
                        name: 'Private marking',
                        meta: 'Each grader marks alone. Marks are aligned afterwards.',
                      },
                      { control: slot, name: 'Shared marking', meta: sharedReason(v), dimmed: true },
                    ]}
                  />
                </div>
              )}
            </Panel>
          </SettingsForm>
        )
      },
    },
    {
      // No visible label: picking one row of a table, where the row names the option.
      location: 'Deliver › Tests › New test',
      canvas: true,
      when: { withLabel: ['false'] },
      demonstrates: ['withLabel', 'error'],
      copy: () => ({ label: 'Standard exam', name: 'scene-template' }),
      render: (slot, v) => {
        const templates = [
          { name: 'Standard exam', meta: 'Fixed start time · Locked browser' },
          { name: 'Open-book home exam', meta: 'Test window · Any browser' },
          { name: 'Oral exam', meta: 'Video · One candidate at a time' },
        ]
        return (
          <div style={column()}>
            <PageTitle title="Choose a template" sub="Templates fill in the settings. You can change them later." />
            <div style={column('var(--space-1)')}>
              <div role="radiogroup" aria-label="Template" style={{ background: 'var(--surface)', border: hairline, borderRadius: 'var(--radius-md)' }}>
                {templates.map((t, i) => (
                  <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-4)', borderBottom: i < templates.length - 1 ? hairline : 'none' }}>
                    {i === 0 ? slot : <RadioButton label={t.name} withLabel={false} name="scene-template" error={on(v, 'error')} />}
                    <div style={{ ...column('2px'), flex: 1, minWidth: 0 }}>
                      <span style={{ ...body, fontWeight: 500 }}>{t.name}</span>
                      <span style={caption}>{t.meta}</span>
                    </div>
                  </div>
                ))}
              </div>
              {on(v, 'error') && <p style={{ ...caption, color: 'var(--error)' }}>Choose a template.</p>}
            </div>
            <StepFooter>{NEXT}</StepFooter>
          </div>
        )
      },
    },
    {
      // One option has a field of its own under it - and with Description on, each
      // has a line too - so the radios are laid out one by one rather than as a
      // Radio Group. A saved setting always has a choice: another option is chosen
      // while the slot is not. Live: choosing an option clears the error, and
      // choosing A set number of graders turns its field on.
      location: 'Deliver › Tests › Algebra Quiz › Settings',
      canvas: true,
      demonstrates: ['withLabel', 'error'],
      copy: (v, s) => {
        const choice = s.get('confirm', confirmChoice(v))
        return {
          label: 'All graders must confirm',
          name: 'scene-confirm',
          selected: choice === 'all',
          onChange: (c: boolean) => c && s.set('confirm', 'all'),
          error: on(v, 'error') && choice === '',
          description: on(v, 'showDescription') ? 'Marks are final once every grader on the script has confirmed.' : undefined,
        }
      },
      render: (slot, v, s) => {
        const choice = s.get('confirm', confirmChoice(v))
        // In error the question has no answer yet, so nothing is chosen.
        const missing = on(v, 'error') && choice === ''
        const option = (value: string, label: string, line: string) => (
          <RadioButton
            label={label}
            name="scene-confirm"
            selected={choice === value}
            onChange={(c) => c && s.set('confirm', value)}
            error={missing}
            description={on(v, 'showDescription') ? line : undefined}
          />
        )
        return (
          <SettingsForm>
            <Panel title="Confirming marks">
              <div role="radiogroup" aria-label="Confirming marks" style={column('var(--space-2)')}>
                {slot}
                {option('count', 'A set number of graders', 'Marks are final once this many graders have confirmed.')}
                <Indented>
                  {fieldWidth(
                    200,
                    <NumberInput
                      label="Graders who must confirm"
                      showLabel={false}
                      size="Small"
                      defaultValue={2}
                      min={2}
                      max={4}
                      suffix="graders"
                      disabled={choice !== 'count'}
                    />,
                  )}
                </Indented>
                {option('one', 'One grader can confirm', 'The first grader to confirm makes the marks final.')}
                {missing && <p style={{ ...caption, color: 'var(--error)' }}>Choose how marks are confirmed.</p>}
              </div>
            </Panel>
          </SettingsForm>
        )
      },
    },
  ],

  'radio-group': [
    {
      // Disabled: the choice is locked once candidates have started.
      location: 'Deliver › Tests › Algebra Quiz › Settings',
      canvas: true,
      when: { disabled: ['true'] },
      demonstrates: ['disabled', 'orientation'],
      copy: (v) => ({
        label: 'Question order',
        name: 'scene-order',
        options: [{ label: 'Same for everyone', value: 'fixed' }, { label: 'Shuffled for each candidate', value: 'shuffled' }],
        defaultValue: 'shuffled',
        helpText: 'Locked while the test is live.',
        errorText: on(v, 'error') ? 'Choose a question order.' : undefined,
      }),
      render: (slot) => (
        <SettingsForm>
          <Alert intent="Info" message="Algebra Quiz is live. Settings that candidates rely on are locked." />
          <Panel title="General settings">{slot}</Panel>
        </SettingsForm>
      ),
    },
    {
      // Error: a required choice in the setup form, said where it is missing.
      location: 'Deliver › Tests › New test',
      canvas: true,
      when: { error: ['true'] },
      demonstrates: ['error', 'orientation'],
      copy: () => ({
        label: 'Test type',
        name: 'scene-test-type',
        options: [{ label: 'Standalone test', value: 'standalone' }, { label: 'Parent test, with sittings under it', value: 'parent' }],
        defaultValue: undefined,
        errorText: 'Choose a test type.',
      }),
      render: (slot) => (
        <div style={column()}>
          <SetupTitle />
          <FormColumn>
            {setupFields.name}
            {slot}
          </FormColumn>
          <StepFooter>{NEXT}</StepFooter>
        </div>
      ),
    },
    {
      // Horizontal: three short options that fit on one line, beside the action they set up.
      location: 'Report › History Midterm',
      canvas: true,
      when: { orientation: ['Horizontal'] },
      copy: () => ({
        label: 'File format',
        name: 'scene-format',
        options: [{ label: 'PDF', value: 'pdf' }, { label: 'CSV', value: 'csv' }, { label: 'Excel', value: 'xlsx' }],
        defaultValue: 'csv',
      }),
      render: (slot) => (
        <div style={column()}>
          <PageTitle title="Export results" sub="186 candidates · marks, grades and comments" />
          <Panel>
            <div style={column('var(--space-4)')}>
              {slot}
              <div style={row}>
                <Button label="Export" intent="Primary" leadingIcon="download" />
              </div>
            </div>
          </Panel>
        </div>
      ),
    },
    {
      // Vertical: a setting with a few options, one per line.
      location: 'Deliver › Tests › Algebra Quiz › Settings',
      canvas: true,
      copy: () => ({
        label: 'Share comments with candidates',
        name: 'scene-share',
        options: [{ label: 'Not shared - comments stay with the graders', value: 'private' }, { label: 'Shared once the result is graded', value: 'shared' }],
        defaultValue: 'private',
      }),
      render: (slot) => (
        <SettingsForm>
          <Panel title="Comments">{slot}</Panel>
        </SettingsForm>
      ),
    },
  ],

  'segmented-control': [
    {
      // Disabled: the breakdowns wait for marking to finish - and the page says so.
      location: 'Report › History Midterm',
      canvas: true,
      when: { disabled: ['true'] },
      // A full-width control belongs in a narrow panel: the next scene.
      unless: { fullWidth: ['true'] },
      copy: (v) => ({ label: 'Results by', items: RESULTS_BY.slice(0, Number(v.segments)), defaultValue: RESULTS_BY[0] }),
      render: (slot) => <ResultsPage control={slot} note="Breakdowns open once marking is complete. 112 of 179 marked." />,
    },
    {
      // Full width: a narrow preview panel, where the segments share its width. The preview follows the device.
      location: 'Author › Question sets › Algebra Quiz',
      canvas: true,
      when: { fullWidth: ['true'] },
      demonstrates: ['fullWidth', 'disabled'],
      copy: (v, s) => ({
        label: 'Preview as',
        items: PREVIEW_AS.slice(0, Number(v.segments)),
        defaultValue: PREVIEW_AS[0],
        onChange: (d: string) => s.set('device', d),
      }),
      render: (slot, v, s) => {
        const device = s.get('device', PREVIEW_AS[0])
        const width = { Desktop: '100%', Tablet: '76%', Phone: '52%', Paper: '86%' }[device] ?? '100%'
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
            <div style={{ flex: '2 1 300px', minWidth: 0 }}>
              <Panel title="Question 3">
                <div style={column('var(--space-3)')}>
                  <p style={body}>Which value of x satisfies 2x + 6 = 14?</p>
                  <p style={caption}>Multiple choice · 2 marks</p>
                </div>
              </Panel>
            </div>
            <div style={{ flex: '1 1 240px', minWidth: 0 }}>
              <Panel title="Preview">
                <div style={column('var(--space-4)')}>
                  {slot}
                  {on(v, 'disabled') && <Reason>Add the answer options to preview the question.</Reason>}
                  <div aria-hidden style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--gray-100)' }}>
                    <div
                      style={{
                        ...column('var(--space-2)'),
                        width,
                        padding: 'var(--space-4)',
                        background: 'var(--surface)',
                        border: hairline,
                        borderRadius: device === 'Paper' ? 0 : 'var(--radius-md)',
                        boxShadow: device === 'Paper' ? 'var(--shadow-100)' : undefined,
                        fontFamily: device === 'Paper' ? 'var(--font-serif)' : undefined,
                        transition: 'width var(--duration-normal) var(--easing-standard)',
                      }}
                    >
                      <span style={{ ...body, fontWeight: 500, fontFamily: 'inherit' }}>Which value of x satisfies 2x + 6 = 14?</span>
                      {['x = 3', 'x = 4', 'x = 10'].map((a) => (
                        <span key={a} style={{ ...row, gap: 'var(--space-2)', fontSize: 14, fontFamily: 'inherit' }}>
                          <span style={{ width: 14, height: 14, borderRadius: 'var(--radius-pill)', border: '2px solid var(--border-control)' }} />
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Panel>
            </div>
          </div>
        )
      },
    },
    {
      // Small: the period of a dashboard card, in the card's header. The figures follow the period.
      location: 'Home',
      canvas: true,
      when: { size: ['Small'] },
      copy: (v, s) => ({
        label: 'Period',
        items: PERIODS.slice(0, Number(v.segments)),
        defaultValue: PERIODS[1],
        onChange: (p: string) => s.set('period', p),
      }),
      render: (slot, _v, s) => {
        const figures = ACTIVITY_BY_PERIOD[s.get('period', PERIODS[1])] ?? ACTIVITY_BY_PERIOD.Week
        return (
          <div style={column()}>
            <Panel title="Activity" action={slot}>
              <div style={{ ...row, gap: 'var(--space-8)' }}>
                <Fact label="Tests started" value={figures[0]} />
                <Fact label="Hand-ins" value={figures[1]} />
                <Fact label="Marked" value={figures[2]} />
              </div>
            </Panel>
          </div>
        )
      },
    },
    {
      // Medium: switches how the table below it is broken down - and the table follows.
      location: 'Report › History Midterm',
      canvas: true,
      copy: (v, s) => ({
        label: 'Results by',
        items: RESULTS_BY.slice(0, Number(v.segments)),
        defaultValue: RESULTS_BY[0],
        onChange: (by: string) => s.set('by', by),
      }),
      render: (slot, _v, s) => <ResultsPage control={slot} by={s.get('by', RESULTS_BY[0])} />,
    },
  ],

  slider: [
    {
      // Disabled: the threshold depends on an option that is off, and the reason sits under it.
      // Ticking the option enables the slider, as it does in the product.
      location: 'Deliver › Tests › Algebra Quiz › Settings',
      canvas: true,
      when: { disabled: ['true'] },
      locks: () => ({
        showLabel: { value: 'true', reason: 'Nothing else in this setting says what the slider sets, so it keeps its label. Turn off Disabled to see a slider named by an icon beside it.' },
      }),
      copy: (v, s) => ({ label: 'Flag answers with a similarity above', formatValue: percent, disabled: on(v, 'disabled') && !s.get('report', false) }),
      render: (slot, _v, s) => (
        <SettingsForm>
          <Panel title="Originality">
            <div style={column('var(--space-3)')}>
              <Checkbox label="Request an originality report" checked={s.get('report', false)} onChange={(c) => s.set('report', c)} />
              <Indented>
                {fieldWidth(360, slot)}
                <p style={caption}>{s.get('report', false) ? 'Flagged answers are marked for a second look in Grade.' : 'Turn on originality reports to set a threshold.'}</p>
              </Indented>
            </div>
          </Panel>
        </SettingsForm>
      ),
    },
    {
      // No visible label: a zoom control in the viewer's toolbar, where the icon beside it says what it is.
      location: 'Grade › Calculus I › Candidate 0142',
      canvas: true,
      when: { showLabel: ['false'] },
      copy: () => ({ label: 'Zoom', min: 50, max: 200, step: 10, defaultValue: 100, formatValue: percent }),
      render: (slot) => (
        <MarkingLayout
          answer={
            <Panel title="Question 2 · Handwritten answer" flush>
              <div style={{ ...row, justifyContent: 'space-between', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-4)', borderBottom: hairline, background: 'var(--gray-100)' }}>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Page 1 of 3</span>
                <div style={{ ...row, flexWrap: 'nowrap', gap: 'var(--space-2)', width: 220 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--gray-700)' }} aria-hidden>zoom_in</span>
                  {slot}
                </div>
              </div>
              <div aria-hidden style={{ padding: 'var(--space-4)' }}>
                <div style={{ ...column('var(--space-3)'), padding: 'var(--space-5)', background: 'var(--surface)', border: hairline, boxShadow: 'var(--shadow-100)' }}>
                  {[88, 72, 94, 64, 80].map((w, i) => (
                    <span key={i} style={{ display: 'block', width: `${w}%`, height: 2, borderRadius: 1, background: 'var(--gray-400)' }} />
                  ))}
                </div>
              </div>
            </Panel>
          }
          panel={
            <Panel title="Marking">
              <div style={column('var(--space-4)')}>
                {fieldWidth(200, <NumberInput label="Mark" defaultValue={6} min={0} max={8} suffix="of 8" />)}
                <Button label="Save and next" intent="Primary" trailingIcon="chevron_right" />
              </div>
            </Panel>
          }
        />
      ),
    },
    {
      // No value: playback volume, where only the position matters.
      location: 'Grade › Spanish oral exam › Candidate 0142',
      canvas: true,
      when: { showValue: ['false'] },
      copy: () => ({ label: 'Volume', defaultValue: 70 }),
      render: (slot) => (
        <div style={column('var(--space-4)')}>
          <PageTitle title="Candidate 0142" aside={<Badge label="Marking" intent="Info" size="Small" />} />
          <Panel title="Recording" flush>
            <div aria-hidden style={{ height: 160, background: 'var(--gray-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-400)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 48 }}>graphic_eq</span>
            </div>
            <div style={{ ...row, justifyContent: 'space-between', gap: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)' }}>
              <div style={row}>
                <Button label="Play" intent="Text" leadingIcon="play_arrow" iconOnly />
                <span style={{ ...mono, color: 'var(--text-secondary)' }}>04:12 / 12:30</span>
              </div>
              {fieldWidth(200, slot)}
            </div>
          </Panel>
        </div>
      ),
    },
    {
      // Label and value: setting a threshold, where the number people chose matters.
      location: 'Deliver › Tests › Algebra Quiz › Settings',
      canvas: true,
      copy: () => ({ label: 'Flag answers with a similarity above', formatValue: percent }),
      render: (slot) => (
        <SettingsForm>
          <Panel title="Originality">
            <div style={column('var(--space-3)')}>
              <Checkbox label="Request an originality report" defaultChecked />
              <Indented>
                {fieldWidth(360, slot)}
                <p style={caption}>Flagged answers are marked for a second look in Grade.</p>
              </Indented>
            </div>
          </Panel>
        </SettingsForm>
      ),
    },
  ],

  rating: [
    {
      // Read only: the average of the reviewers' ratings, beside each question in the bank.
      location: 'Author › Question bank',
      canvas: true,
      when: { readOnly: ['true'] },
      demonstrates: ['readOnly', 'showValue'],
      copy: () => ({ label: 'Difficulty, average of 4 reviews', defaultValue: 3 }),
      render: (slot, v) => (
        <div style={column('var(--space-4)')}>
          <PageTitle title="Question bank" count="1,284" />
          <RatedQuestions first={slot} size={v.size} readOnly showValue={on(v, 'showValue')} />
        </div>
      ),
    },
    {
      // Small: rating each question in turn, in a dense review list.
      location: 'Author › Question sets › Algebra Quiz › Review',
      canvas: true,
      when: { size: ['Small'] },
      demonstrates: ['size', 'showValue'],
      copy: () => ({ label: `Difficulty of ${BANK_QUESTIONS[0].name}`, defaultValue: 0 }),
      render: (slot, v) => (
        <div style={column('var(--space-4)')}>
          <PageTitle title="Review" sub="Rate how hard each question is for Year 10." />
          <RatedQuestions first={slot} size="Small" showValue={on(v, 'showValue')} />
          <div style={{ ...row, justifyContent: 'flex-end' }}>
            <Button label="Submit review" intent="Primary" />
          </div>
        </div>
      ),
    },
    {
      // Medium: one rating, given in a review form.
      location: 'Author › Question sets › Algebra Quiz › Review',
      canvas: true,
      copy: () => ({ label: 'How difficult is this question for Year 10?', defaultValue: 0 }),
      render: (slot) => (
        <div style={column()}>
          <PageTitle title="Review Question 3" />
          <Panel>
            <div style={column('var(--space-4)')}>
              <p style={body}>Which value of x satisfies 2x + 6 = 14?</p>
              <div style={column('var(--space-1)')}>
                <span style={{ fontSize: 16, fontWeight: 500 }}>How difficult is this question for Year 10?</span>
                {slot}
              </div>
              {fieldWidth(480, <Textarea label="Comment" placeholder="Optional" rows={2} />)}
              <div style={row}>
                <Button label="Submit review" intent="Primary" />
              </div>
            </div>
          </Panel>
        </div>
      ),
    },
  ],

  'date-picker': [
    {
      // Disabled: the release date only applies when results go out on a date.
      // Choosing On a date enables it, as it does in the product.
      location: 'Deliver › Tests › Algebra Quiz › Settings',
      canvas: true,
      when: { disabled: ['true'] },
      copy: (v, s) => {
        const onDate = s.get<string>('release', 'manual') === 'date'
        return {
          label: 'Release date',
          disabled: on(v, 'disabled') && !onDate,
          defaultValue: on(v, 'withValue') ? '2026-10-12' : undefined,
          helpText: onDate ? 'Candidates see their results from this date.' : 'Choose On a date to set one.',
        }
      },
      render: (slot, _v, s) => (
        <SettingsForm>
          <Panel title="Results">
            <div style={column('var(--space-3)')}>
              <RadioGroup
                label="Release results"
                name="scene-release"
                options={[{ label: 'Manually, when I choose', value: 'manual' }, { label: 'On a date', value: 'date' }]}
                value={s.get('release', 'manual')}
                onChange={(r) => s.set('release', r)}
              />
              <Indented>{fieldWidth(240, slot)}</Indented>
            </div>
          </Panel>
        </SettingsForm>
      ),
    },
    {
      // Error: the end date has to come after the start date, and the message says exactly that.
      location: 'Deliver › Tests › New test',
      canvas: true,
      when: { error: ['true'] },
      copy: (v) => ({
        label: 'End date',
        defaultValue: on(v, 'withValue') ? '2026-09-18' : undefined,
        errorText: on(v, 'withValue') ? 'Choose an end date after the start date.' : 'Choose an end date.',
      }),
      render: (slot) => <TestWindow end={slot} />,
    },
    {
      // A date in the setup form, beside the time it goes with.
      location: 'Deliver › Tests › New test',
      canvas: true,
      copy: (v) => ({ label: 'Start date', defaultValue: on(v, 'withValue') ? '2026-09-19' : undefined }),
      render: (slot) => <TestWindow start={slot} />,
    },
  ],

  'date-range-picker': [
    {
      // Disabled: the marking period is set for every test by the exam office.
      location: 'Grade › History Midterm › Settings',
      canvas: true,
      when: { disabled: ['true'] },
      copy: (v) => ({
        label: 'Marking period',
        defaultValue: on(v, 'withValue') ? { start: '2026-10-05', end: '2026-10-23' } : undefined,
        helpText: 'Set by the exam office for every test this term.',
        errorText: on(v, 'error') ? 'End the marking period after it starts.' : undefined,
      }),
      render: (slot) => (
        <div style={column()}>
          <PageTitle title="Settings" />
          <Panel title="Marking">
            <div style={column('var(--space-4)')}>
              {fieldWidth(320, slot)}
              {fieldWidth(240, <NumberInput label="Graders per script" defaultValue={2} min={1} max={4} />)}
            </div>
          </Panel>
        </div>
      ),
    },
    {
      // Error: a home exam's window that ends before it starts.
      location: 'Deliver › Tests › New test',
      canvas: true,
      when: { error: ['true'] },
      copy: (v) => ({
        label: 'Test window',
        defaultValue: on(v, 'withValue') ? { start: '2026-10-12', end: '2026-10-12' } : undefined,
        helpText: 'Candidates can start any time in the window.',
        errorText: on(v, 'withValue') ? 'End the window at least one day after it starts.' : 'Choose when the window opens and closes.',
      }),
      render: (slot) => (
        <div style={column()}>
          <SetupTitle />
          <FormColumn>
            <TextInput label="Test name" defaultValue="Contract law home exam" />
            {fieldWidth(320, slot)}
            {fieldWidth(240, <NumberInput label="Time per candidate" defaultValue={240} suffix="min" step={30} />)}
          </FormColumn>
          <StepFooter>{NEXT}</StepFooter>
        </div>
      ),
    },
    {
      // A filter for a period, in the filter bar above the results it narrows.
      location: 'Report',
      copy: (v) => ({
        label: 'Test date',
        defaultValue: on(v, 'withValue') ? { start: '2026-09-01', end: '2026-09-30' } : undefined,
        helpText: on(v, 'disabled') ? 'Fixed to this term while marking is under way.' : undefined,
      }),
      render: (slot, v) => (
        <div style={column('var(--space-4)')}>
          <PageTitle title="Results" count="38" />
          <FilterBar>
            {fieldWidth(300, slot)}
            <Select label="Subject" widthMode="Hug" placeholder="Any subject" options={SUBJECTS} search />
            {on(v, 'withValue') && <FieldAction><Button label="Reset" intent="Text" /></FieldAction>}
          </FilterBar>
          <ResultsTable />
        </div>
      ),
    },
  ],

  'file-upload': [
    {
      // Disabled: only the test's owner can add files here - say so where the upload would be.
      location: 'Deliver › Tests › Algebra Quiz › Settings',
      canvas: true,
      when: { disabled: ['true'] },
      copy: () => ({
        label: 'Invigilator instructions',
        accept: '.pdf',
        helpText: 'Only the test owner, Ines Planner, can add files.',
      }),
      render: (slot) => (
        <SettingsForm>
          <Panel title="Exam day">
            <div style={column('var(--space-2)')}>
              <Label>Invigilator instructions</Label>
              {fieldWidth(480, slot)}
            </div>
          </Panel>
        </SettingsForm>
      ),
    },
    {
      // Error: the file can't be used - name it, say why and what to upload instead.
      location: 'Deliver › Tests › Algebra Quiz › Candidates',
      canvas: true,
      when: { error: ['true'] },
      copy: () => ({
        label: 'Candidate list',
        accept: '.csv',
        helpText: 'A CSV file, one candidate per row, with their ID and email.',
        errorText: 'candidates.xlsx is not a CSV file. Save the list as CSV and try again.',
      }),
      render: (slot, v) => (
        <div style={column()}>
          <PageTitle title="Import candidates" sub="Add candidates from a list exported from your student system." />
          <Panel>
            <div style={column('var(--space-3)')}>
              <Label>Candidate list</Label>
              {fieldWidth(480, slot)}
              <div style={row}>
                {/* Nothing to import until a file is accepted. */}
                <Button label="Import" intent="Primary" disabled={on(v, 'error')} />
              </div>
            </div>
          </Panel>
        </div>
      ),
    },
    {
      // Multiple: resources that go together, listed under the drop zone as they arrive.
      location: 'Author › Question sets › Algebra Quiz › Resources',
      canvas: true,
      when: { multiple: ['true'] },
      copy: () => ({ label: 'Resources', accept: 'image/*,.pdf', helpText: 'Images or PDFs, up to 10MB each.' }),
      render: (slot, _v, s) => {
        const files = s.get('files', RESOURCE_FILES)
        return (
          <div style={column()}>
            <PageTitle title="Resources" sub="Files candidates can open during the test." />
            <Panel>
              <div style={column('var(--space-3)')}>
                {fieldWidth(560, slot)}
                {files.length > 0 && fieldWidth(560, (
                  <List
                    size="Compact"
                    items={files.map((f) => ({
                      leadingIcon: f.icon,
                      primary: f.name,
                      secondary: f.size,
                      trailing: (
                        <Button
                          label={`Remove ${f.name}`}
                          intent="Text"
                          size="Small"
                          leadingIcon="close"
                          iconOnly
                          onClick={() => s.set('files', files.filter((x) => x.name !== f.name))}
                        />
                      ),
                    }))}
                  />
                ))}
              </div>
            </Panel>
          </div>
        )
      },
    },
    {
      // One file: a single document that a new upload replaces.
      location: 'Deliver › Tests › Algebra Quiz › Settings',
      canvas: true,
      copy: () => ({ label: 'Invigilator instructions', accept: '.pdf', helpText: 'One PDF, up to 10MB. Invigilators open it in Monitor.' }),
      render: (slot) => (
        <SettingsForm>
          <Panel title="Exam day">
            <div style={column('var(--space-4)')}>
              <Checkbox label="Require a day password" defaultChecked />
              <div style={column('var(--space-2)')}>
                <Label>Invigilator instructions</Label>
                {fieldWidth(480, slot)}
              </div>
            </div>
          </Panel>
        </SettingsForm>
      ),
    },
  ],

  'number-input': [
    {
      // Read only: a live test's settings - the number still matters, but can't change now.
      location: 'Deliver › Tests › Algebra Quiz › Setup',
      canvas: true,
      when: { readOnly: ['true'] },
      copy: (v) => ({ ...numberCopy(v), helpText: 'Locked while the test is live.' }),
      render: (slot, v) => (
        <div style={column()}>
          <PageTitle title="Setup" sub="Live since 19 Sep. Settings candidates already rely on are locked." />
          <FormColumn>
            {/* The form's other field takes the same size as the one in the slot. */}
            <TextInput label="Test name" defaultValue="Algebra Quiz" size={v.size as 'Small' | 'Medium'} />
            {fieldWidth(240, slot)}
          </FormColumn>
        </div>
      ),
    },
    {
      // Small: adding time for one candidate, inside the request it answers.
      location: 'Monitor › Algebra Quiz › Candidates',
      when: { size: ['Small'] },
      demonstrates: ['size', 'error'],
      copy: (v) => ({
        label: v.suffix === '%' ? 'Extra time, % of test' : v.suffix === 'min' ? 'Extra time' : 'Extra minutes',
        // In error the field is empty, as its message asks for a number.
        defaultValue: on(v, 'error') ? undefined : v.suffix === '%' ? 25 : 10,
        min: 0,
        max: v.suffix === '%' ? 100 : 60,
        step: 5,
        helpText: on(v, 'disabled') ? 'Only the chief invigilator can add time.' : undefined,
        errorText: on(v, 'error') ? (v.suffix === '%' ? 'Enter a share of the test time, up to 100%.' : 'Enter the minutes to add, up to 60.') : undefined,
      }),
      render: (slot, v) => (
        <div style={column('var(--space-4)')}>
          <PageTitle title="Candidates" count="24" />
          <Panel title="Requests" action={<Badge label="1 pending" intent="Info" size="Small" />} flush>
            <RequestRow
              actions={
                // Top-aligned, with the button lined up with the field: an error
                // under the field must not push the button down. Disabled, the
                // button goes with the field, and the field says why.
                <div style={{ ...row, alignItems: 'flex-start' }}>
                  {fieldWidth(160, slot)}
                  <FieldAction><Button label="Add time" intent="Primary" size="Small" disabled={on(v, 'disabled')} /></FieldAction>
                </div>
              }
            />
          </Panel>
          <CandidatesTable />
        </div>
      ),
    },
    {
      // Medium: a number with limits in a settings form, its unit inside the field.
      location: 'Deliver › Tests › New test › Settings',
      canvas: true,
      demonstrates: ['size', 'error', 'disabled'],
      copy: (v) => numberCopy(v),
      render: (slot, v) => (
        <div style={column()}>
          <PageTitle title="Settings" />
          <FormColumn>
            {UNITS.map((u) => {
              const f = NUMBER_FIELDS[u]
              return (
                <Fragment key={u}>
                  {fieldWidth(240, u === unitOf(v) ? slot : (
                    <NumberInput label={f.label} defaultValue={f.value} min={f.min} max={f.max} step={f.step} suffix={u === 'None' ? undefined : u} helpText={f.help} />
                  ))}
                </Fragment>
              )
            })}
          </FormColumn>
          <StepFooter>{NEXT}</StepFooter>
        </div>
      ),
    },
  ],

  combobox: [
    {
      // Custom value: a topic can be one already in use or a new one typed in.
      location: 'Author › Question sets › Algebra Quiz',
      canvas: true,
      when: { allowCustomValue: ['true'] },
      demonstrates: ['allowCustomValue', 'error', 'disabled'],
      copy: (v) => ({
        label: 'Topic',
        options: TOPICS,
        placeholder: 'Search or add a topic',
        defaultValue: on(v, 'withValue') ? 'linear' : undefined,
        helpText: on(v, 'disabled') ? 'Topics are locked once a question is in a live test.' : 'Choose a topic, or type a new one.',
        errorText: on(v, 'error') ? 'Add a topic so the question can be found later.' : undefined,
        emptyText: 'No topic yet. Press Enter to add it.',
      }),
      render: (slot) => (
        <QuestionWithPanel>
          {slot}
          <Toggle label="Required" size="Small" defaultChecked />
        </QuestionWithPanel>
      ),
    },
    {
      // Typing a name is the quickest way to pick one person out of hundreds.
      location: 'Grade › History Midterm › Candidate 0142',
      canvas: true,
      demonstrates: ['allowCustomValue', 'error', 'disabled'],
      copy: (v) => ({
        label: 'Second marker',
        options: STAFF,
        placeholder: 'Type a name',
        defaultValue: on(v, 'withValue') ? 'mia' : undefined,
        helpText: on(v, 'disabled') ? 'Marking has started. Ask the test owner to change markers.' : '312 people can mark at your institution.',
        errorText: on(v, 'error') ? 'Choose a second marker from the list.' : undefined,
        emptyText: 'No one by that name',
      }),
      render: (slot) => (
        <div style={column()}>
          <PageTitle title="Candidate 0142" sub="History Midterm · shared marking: two markers per script" />
          <Panel title="Markers">
            <div style={column('var(--space-4)')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <Avatar name="Arne Hansen" size="Small" />
                <div style={column('2px')}>
                  <span style={{ ...body, fontWeight: 500 }}>First marker: Arne Hansen</span>
                  <span style={caption}>Marked 14 of 20</span>
                </div>
              </div>
              {fieldWidth(320, slot)}
            </div>
          </Panel>
        </div>
      ),
    },
  ],

  'otp-input': [
    {
      // Signing in with two-step verification: the code is the one thing on the screen.
      location: 'Sign in',
      bare: true,
      demonstrates: ['error', 'disabled'],
      locks: (v): Record<string, Lock> =>
        on(v, 'error')
          ? { withValue: { value: 'true', reason: 'A code is checked once every box is filled, so in error the boxes hold the whole code.' } }
          : {},
      // In error the whole code is there: it was entered and turned out to be wrong.
      copy: (v) => ({
        label: 'Verification code',
        showLabel: true,
        ...(on(v, 'error') ? { defaultValue: '482913'.slice(0, Number(v.length)) } : {}),
      }),
      render: (slot, v) => {
        const length = Number(v.length)
        return (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8) 0' }}>
            <div style={{ ...column('var(--space-4)'), width: 400, maxWidth: '100%' }}>
              <span style={{ ...row, gap: 'var(--space-2)', fontWeight: 600, color: 'var(--primary)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 22 }} aria-hidden>verified_user</span>
                Inspera Assessment
              </span>
              <div style={column('var(--space-1)')}>
                <h3 className="inspera-h3" style={{ margin: 0, fontWeight: 500 }}>Check your phone</h3>
                <p style={{ ...body, color: 'var(--text-secondary)' }}>
                  {length === 4
                    ? 'Enter the 4-digit code we sent to +47-123-4567.'
                    : 'Enter the 6-digit code from your authenticator app.'}
                </p>
              </div>
              {slot}
              {on(v, 'error') && !on(v, 'disabled') && (
                <p style={{ ...caption, color: 'var(--error)' }}>That code is not right, or it has expired. Check it and try again.</p>
              )}
              {on(v, 'disabled') && <p style={caption}>Too many tries. You can try again in 5 minutes.</p>}
              <Button label="Verify" intent="Primary" disabled={on(v, 'disabled')} />
              <Link href="#" size="Small" onClick={stay}>Send a new code</Link>
            </div>
          </div>
        )
      },
    },
  ],

  'form-field': [
    {
      // Required: in a form where most fields are optional, mark the few that are not - and say once what the mark means.
      location: 'Deliver › Tests › Algebra Quiz › Candidates',
      canvas: true,
      when: { required: ['true'] },
      copy: (v) => ({
        label: 'Candidate ID',
        helpText: 'From your student system.',
        errorText: on(v, 'showError') ? 'Enter the candidate ID.' : undefined,
        children: <TextInput label="Candidate ID" placeholder="e.g. 204517" />,
      }),
      render: (slot) => (
        <div style={column()}>
          <PageTitle title="Add a candidate" sub="Fields marked * are required." />
          <FormColumn>
            {fieldWidth(240, slot)}
            <FormField label="Name">
              <TextInput label="Name" />
            </FormField>
            <FormField label="Email" helpText="Used to send the invitation.">
              <TextInput label="Email" placeholder="name@school.no" />
            </FormField>
            <div style={row}>
              <Button label="Add candidate" intent="Primary" />
            </div>
          </FormColumn>
        </div>
      ),
    },
    {
      // Wrapping a control that is not from the library - here, the product's rich-text editor.
      location: 'Deliver › Tests › New test',
      canvas: true,
      copy: (v) => ({
        label: 'Information for candidates',
        htmlFor: 'scene-candidate-info',
        helpText: 'Candidates read this before the test starts.',
        errorText: on(v, 'showError') ? 'Add information for candidates.' : undefined,
        // In error the editor is empty, as the message says.
        children: on(v, 'showError')
          ? <RichTextEditor id="scene-candidate-info" invalid />
          : <RichTextEditor id="scene-candidate-info" text="Bring a calculator. Phones stay in your bag for the whole test." />,
      }),
      render: (slot) => (
        <div style={column()}>
          <SetupTitle />
          <FormColumn>
            {setupFields.name}
            {slot}
          </FormColumn>
          <StepFooter>{NEXT}</StepFooter>
        </div>
      ),
    },
  ],

  // --- Data display, past the pilot ------------------------------------------

  card: [
    {
      // Selected: each card is a toggle - pick the question types to add, then add them all.
      location: 'Author › Question sets › Algebra Quiz › Add questions',
      canvas: true,
      when: { selected: ['true'] },
      demonstrates: ['selected', 'elevation', 'padding'],
      copy: (v, s) => ({
        title: 'Multiple choice',
        body: 'One or more correct options. Marked automatically.',
        onSelectedChange: (sel: boolean) => s.set('picked', pickedTypes(v, s).map((x, i) => (i === 0 ? sel : x))),
      }),
      render: (slot, v, s) => {
        const picked = pickedTypes(v, s)
        const set = (i: number) => (sel: boolean) => s.set('picked', picked.map((x, j) => (j === i ? sel : x)))
        const n = count(picked)
        return (
          <div style={column('var(--space-4)')}>
            <PageTitle title="Add questions" sub="Choose the question types to add. You can edit each question afterwards." />
            <CardGrid min={200}>
              {slot}
              <Card {...cardLook(v)} title="Essay" body="A written answer. Marked by hand or with AI support." selected={picked[1]} onSelectedChange={set(1)} />
              <Card {...cardLook(v)} title="Numeric" body="A number, checked against a range. Marked automatically." selected={picked[2]} onSelectedChange={set(2)} />
            </CardGrid>
            <div style={row}>
              <Button label={n === 0 ? 'Add question types' : `Add ${n} question type${n === 1 ? '' : 's'}`} intent="Primary" disabled={n === 0} />
            </div>
          </div>
        )
      },
    },
    {
      // Interactive: each card is one way to start, and the whole card is the target.
      location: 'Author › Question sets › Algebra Quiz › New question',
      canvas: true,
      when: { interactive: ['true'] },
      demonstrates: ['interactive', 'elevation', 'padding'],
      copy: () => ({ title: 'Multiple choice', body: 'One or more correct options. Marked automatically.' }),
      render: (slot, v) => (
        <div style={column('var(--space-4)')}>
          <PageTitle title="Choose a question type" />
          <CardGrid min={200}>
            {slot}
            <Card {...cardLook(v)} title="Essay" body="A written answer. Marked by hand or with AI support." />
            <Card {...cardLook(v)} title="Numeric" body="A number, checked against a range. Marked automatically." />
          </CardGrid>
        </div>
      ),
    },
    {
      // Outlined: cards on a white page, where a shadow would be heavy - the roster's Cards view.
      // Each card keeps the status the table shows; the view switch changes the view.
      location: 'Deliver › Tests',
      when: { elevation: ['Outlined'] },
      demonstrates: ['elevation', 'padding'],
      copy: () => ({ title: TEST_CARDS[0].title, children: <TestCardContent card={TEST_CARDS[0]} /> }),
      render: (slot, v, s) => {
        const view = s.get('view', 'Cards')
        return (
          <div style={column('var(--space-4)')}>
            <PageTitle title="Tests" count="242" actions={CREATE_TEST} />
            <div style={{ ...row, justifyContent: 'space-between', gap: 'var(--space-3)' }}>
              {fieldWidth(320, <TextInput label="Search tests" showLabel={false} placeholder="Search" leadingIcon="search" />)}
              <SegmentedControl label="View" items={['Table', 'Cards']} value={view} onChange={(x) => s.set('view', x)} />
            </div>
            {view === 'Cards' ? (
              <CardGrid>
                {slot}
                {TEST_CARDS.slice(1).map((t) => (
                  <Card key={t.title} {...cardLook(v)} title={t.title}><TestCardContent card={t} /></Card>
                ))}
              </CardGrid>
            ) : (
              <TestsTable />
            )}
          </div>
        )
      },
    },
    {
      // Flat: page content on the grey canvas - white panels that need no shadow to stand apart.
      location: 'Deliver › Tests › Algebra Quiz',
      canvas: true,
      when: { elevation: ['Flat'] },
      demonstrates: ['elevation', 'padding'],
      copy: () => ({ title: 'Schedule', body: 'Starts 19 September at 09:00. Runs for 1 hour 30 minutes.' }),
      render: (slot, v) => (
        <div style={column()}>
          <PageTitle title="Algebra Quiz" aside={<Badge label="Scheduled" intent="Info" size="Small" />} actions={<Button label="Publish" intent="Primary" />} />
          <CardGrid min={200}>
            {slot}
            <Card {...cardLook(v)} title="Candidates" body="24 registered, 2 with extra time." />
            <Card {...cardLook(v)} title="Questions" body="24 questions in 3 sections, 50 marks." />
          </CardGrid>
        </div>
      ),
    },
    {
      // Raised: the summaries that lead the home page, lifted off the grey canvas. Facts to
      // read, not places to go - a card people can open is Interactive.
      location: 'Home',
      canvas: true,
      demonstrates: ['elevation', 'padding'],
      copy: () => ({ title: 'Live now', body: 'Algebra Quiz. 18 of 24 candidates have started.' }),
      render: (slot, v) => (
        <div style={column('var(--space-4)')}>
          <PageTitle title="This week" />
          <CardGrid>
            {slot}
            <Card {...cardLook(v)} title="To mark" body="History Midterm. 67 of 179 scripts left." />
            <Card {...cardLook(v)} title="Coming up" body="Biology Final on 2 October, 179 candidates." />
          </CardGrid>
        </div>
      ),
    },
  ],

  table: [
    {
      // Selectable: pick candidates, then act on all of them from the bar that appears.
      location: 'Monitor › Algebra Quiz › Candidates',
      when: { selectable: ['true'] },
      copy: (_v, s) => ({
        caption: undefined,
        'aria-label': 'Candidates',
        columns: [
          { key: 'candidate', header: 'Candidate' },
          { key: 'status', header: 'Status' },
          { key: 'progress', header: 'Answered', align: 'right' },
        ],
        rows: CANDIDATES,
        defaultSelectedIds: ['0'],
        onSelectionChange: (ids: string[]) => s.set('ids', ids),
      }),
      render: (slot, _v, s) => {
        const selected = s.get<string[]>('ids', ['0']).length
        return (
          <div style={column('var(--space-4)')}>
            <PageTitle title="Candidates" count="24" />
            {selected > 0 ? (
              <SelectionBar count={selected}>
                <Button label="Message" intent="Text" leadingIcon="chat" />
                <Button label="Add time" intent="Secondary" leadingIcon="more_time" />
              </SelectionBar>
            ) : (
              <p style={{ ...caption, minHeight: 48, display: 'flex', alignItems: 'center' }}>Select candidates to message them or add time.</p>
            )}
            <div style={{ overflowX: 'auto' }}>{slot}</div>
          </div>
        )
      },
    },
    {
      // No hover: a summary inside a card, whose rows open nothing.
      location: 'Report › History Midterm',
      canvas: true,
      when: { hoverable: ['false'] },
      copy: () => ({
        caption: undefined,
        'aria-label': 'Results by section',
        columns: [
          { key: 'section', header: 'Section' },
          { key: 'questions', header: 'Questions', align: 'right' },
          { key: 'average', header: 'Average', align: 'right' },
        ],
        rows: [
          { section: 'Short answers', questions: 6, average: '71%' },
          { section: 'Source analysis', questions: 2, average: '64%' },
          { section: 'Essay', questions: 1, average: '58%' },
        ],
      }),
      render: (slot) => (
        <div style={column()}>
          <PageTitle title="Overview" sub="History Midterm · 179 candidates" />
          <div style={column('var(--space-2)')}>
            <h4 className="inspera-h5" style={{ margin: 0, fontWeight: 600 }}>Results by section</h4>
            <div style={{ overflowX: 'auto' }}>{slot}</div>
          </div>
        </div>
      ),
    },
    {
      // Compact: a long roster people scan, under its search and filters.
      location: 'Deliver › Tests',
      when: { size: ['Compact'] },
      demonstrates: ['size', 'striped'],
      copy: () => ({
        caption: undefined,
        'aria-label': 'Tests',
        columns: [
          { key: 'title', header: 'Title' },
          { key: 'status', header: 'Status' },
          { key: 'edited', header: 'Last edited' },
          { key: 'starts', header: 'Start time' },
        ],
        rows: TESTS.map((t) => ({
          title: <Link href="#" size="Small" onClick={stay}>{t.title}</Link>,
          status: <Badge label={t.status[0]} intent={t.status[1]} size="Small" />,
          edited: t.edited,
          starts: t.starts,
        })),
      }),
      render: (slot) => (
        <div style={column('var(--space-4)')}>
          <PageTitle title="Tests" count="242" actions={CREATE_TEST} />
          <ToolbarWell>{QUICK_FILTERS}</ToolbarWell>
          <div style={{ overflowX: 'auto' }}>{slot}</div>
        </div>
      ),
    },
    {
      // Default: a short table people read row by row.
      location: 'Grade › History Midterm',
      canvas: true,
      copy: () => ({
        caption: undefined,
        'aria-label': 'Questions',
        columns: [
          { key: 'question', header: 'Question' },
          { key: 'type', header: 'Type' },
          { key: 'marked', header: 'Marked', align: 'right' },
          { key: 'average', header: 'Average mark', align: 'right' },
        ],
        rows: QUESTION_ROWS,
      }),
      render: (slot) => (
        <div style={column()}>
          <PageTitle title="History Midterm" aside={<Badge label="Marking" intent="Info" size="Small" />} />
          <div style={column('var(--space-2)')}>
            <h4 className="inspera-h5" style={{ margin: 0, fontWeight: 600 }}>Questions</h4>
            <div style={{ overflowX: 'auto' }}>{slot}</div>
          </div>
        </div>
      ),
    },
  ],

  'data-grid': [
    {
      // No footer: a short set that fits on one page.
      location: 'Grade › History Midterm › Graders',
      canvas: true,
      when: { footer: ['false'] },
      copy: (v) => ({
        caption: undefined,
        'aria-label': 'Graders',
        columns: [
          { key: 'grader', header: 'Grader', sortable: true },
          { key: 'assigned', header: 'Assigned', align: 'right', sortable: true },
          { key: 'marked', header: 'Marked', align: 'right', sortable: true },
        ],
        rows: [
          { id: 'arne', grader: 'Arne Hansen', assigned: 90, marked: 72 },
          { id: 'ines', grader: 'Ines Planner', assigned: 89, marked: 40 },
        ],
        rowActions: on(v, 'rowActions')
          ? (row: Record<string, unknown>) => (
              <Menu iconOnly size="Small" label={`Actions for ${String(row.grader)}`} placement="BottomEnd" items={[{ label: 'Reassign scripts', icon: 'swap_horiz' }, { label: 'Remove', icon: 'person_remove', danger: true }]} />
            )
          : undefined,
      }),
      render: (slot) => (
        <div style={column()}>
          <PageTitle title="Graders" sub="History Midterm · 179 scripts" />
          <div style={{ overflowX: 'auto' }}>{slot}</div>
        </div>
      ),
    },
    {
      // Compact: every test, densely, with paging below.
      location: 'Deliver › Tests',
      when: { size: ['Compact'] },
      demonstrates: ['size', 'striped', 'selectable'],
      copy: () => ({
        caption: undefined,
        'aria-label': 'Tests',
        total: 242,
        pageCount: 13,
      }),
      render: (slot) => (
        <div style={column('var(--space-4)')}>
          <PageTitle title="Tests" count="242" actions={CREATE_TEST} />
          <ToolbarWell>{QUICK_FILTERS}</ToolbarWell>
          <div style={{ overflowX: 'auto' }}>{slot}</div>
        </div>
      ),
    },
    {
      // Default: a grader's scripts - sortable, selectable to assign, with a menu per row and paging.
      location: 'Grade › History Midterm',
      copy: (v) => ({
        caption: undefined,
        'aria-label': 'Scripts',
        columns: [
          { key: 'script', header: 'Script', sortable: true },
          { key: 'status', header: 'Status' },
          { key: 'grader', header: 'Grader', sortable: true },
          { key: 'mark', header: 'Mark', align: 'right', sortable: true },
        ],
        rows: SCRIPTS,
        getRowId: (row: Record<string, unknown>) => String(row.id),
        total: 179,
        pageCount: 9,
        rowActions: on(v, 'rowActions') ? scriptActions : undefined,
      }),
      render: (slot) => (
        <div style={column('var(--space-4)')}>
          <PageTitle title="History Midterm" aside={<Badge label="Marking" intent="Info" size="Small" />} actions={<Button label="Assign scripts" intent="Primary" />} />
          <div style={{ overflowX: 'auto' }}>{slot}</div>
        </div>
      ),
    },
  ],

  list: [
    {
      // Interactive: each row opens a page of settings.
      location: 'Deliver › Tests › Algebra Quiz',
      canvas: true,
      when: { interactive: ['true'] },
      copy: () => ({
        items: [
          { primary: 'General settings', secondary: 'Timing, attempts, question order', leadingIcon: 'settings', trailingIcon: 'chevron_right' },
          { primary: 'Security', secondary: 'Locked browser, access code', leadingIcon: 'lock', trailingIcon: 'chevron_right' },
          { primary: 'Results', secondary: 'Release, results page, comments', leadingIcon: 'grading', trailingIcon: 'chevron_right' },
        ],
      }),
      render: (slot) => (
        <div style={column()}>
          <PageTitle title="Algebra Quiz" aside={<Badge label="Scheduled" intent="Info" size="Small" />} />
          {fieldWidth(560, (
            <div style={column('var(--space-2)')}>
              <h4 className="inspera-h5" style={{ margin: 0, fontWeight: 600 }}>Settings</h4>
              {slot}
            </div>
          ))}
        </div>
      ),
    },
    {
      // Compact: a side panel of candidates who need help, beside the roster.
      location: 'Monitor › Algebra Quiz › Candidates',
      when: { size: ['Compact'] },
      copy: () => ({
        items: [
          { leading: <Avatar name="Jane Cooper" size="Small" />, primary: 'Jane Cooper', secondary: 'Asked for more time', trailing: '2 min' },
          { leading: <Avatar name="Omar Haddad" size="Small" />, primary: 'Omar Haddad', secondary: 'Lost connection', trailing: '5 min' },
          { leading: <Avatar name="Li Wei" size="Small" />, primary: 'Li Wei', secondary: 'Raised a hand', trailing: '9 min' },
        ],
      }),
      render: (slot) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 'var(--space-6)' }}>
          <div style={{ ...column('var(--space-4)'), flex: '2 1 320px' }}>
            <PageTitle title="Candidates" count="24" />
            <CandidatesTable />
          </div>
          <div style={{ ...column('var(--space-2)'), flex: '1 1 240px', minWidth: 0 }}>
            <h4 className="inspera-h5" style={{ margin: 0, fontWeight: 600 }}>Needs help (3)</h4>
            {slot}
          </div>
        </div>
      ),
    },
    {
      // Default: a list read item by item - what has happened on this test.
      location: 'Deliver › Tests › Algebra Quiz',
      canvas: true,
      demonstrates: ['size', 'divided'],
      copy: () => ({
        items: [
          { leadingIcon: 'publish', primary: 'Ines Planner published the test', secondary: 'Today at 14:43' },
          { leadingIcon: 'schedule', primary: 'Ines Planner moved the start to 09:00', secondary: 'Today at 14:21' },
          { leadingIcon: 'group_add', primary: 'Arne Hansen added 24 candidates', secondary: 'Yesterday at 12:05' },
        ],
      }),
      render: (slot) => (
        <div style={column()}>
          <PageTitle title="Algebra Quiz" aside={<Badge label="Scheduled" intent="Info" size="Small" />} />
          {fieldWidth(560, (
            <div style={column('var(--space-2)')}>
              <h4 className="inspera-h5" style={{ margin: 0, fontWeight: 600 }}>Activity</h4>
              {slot}
            </div>
          ))}
        </div>
      ),
    },
  ],

  accordion: [
    {
      // Chevron on the left: the sections of a question set read like a tree.
      location: 'Author › Question sets › Algebra Quiz',
      canvas: true,
      when: { iconPosition: ['Left'] },
      demonstrates: ['iconPosition', 'selection'],
      copy: () => ({
        items: [
          { title: 'Linear equations · 3 questions', content: <SectionQuestions names={['Solve 2x + 6 = 14', 'Find the gradient of y = 3x - 4', 'Solve 5 - x = 2']} /> },
          { title: 'Quadratic equations · 2 questions', content: <SectionQuestions names={['Factorise x² + 5x + 6', 'Solve x² = 49']} /> },
        ],
        headingLevel: 4,
      }),
      render: (slot) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
          <div style={{ ...column('var(--space-2)'), flex: '1 1 260px', minWidth: 0 }}>
            <h4 className="inspera-h5" style={{ margin: 0, fontWeight: 600 }}>Questions (5)</h4>
            {slot}
          </div>
          <div style={{ flex: '2 1 300px', minWidth: 0 }}>
            <Panel title="Question 1">
              <div style={column('var(--space-3)')}>
                <p style={body}>Solve 2x + 6 = 14.</p>
                <p style={caption}>Numeric · 2 marks</p>
              </div>
            </Panel>
          </div>
        </div>
      ),
    },
    {
      // Multiple: groups of settings people work across, several open at once.
      location: 'Deliver › Tests › Algebra Quiz › Settings',
      canvas: true,
      when: { selection: ['Multiple'] },
      demonstrates: ['selection', 'iconPosition'],
      copy: () => ({
        items: [
          { title: 'General settings', content: <Checkbox label="Allow late submissions" defaultChecked /> },
          { title: 'Security', content: <Checkbox label="Require a locked browser" defaultChecked /> },
          { title: 'Exam day', content: <Checkbox label="Require a day password" /> },
        ],
        defaultValue: [0, 1],
        headingLevel: 4,
      }),
      render: (slot) => <SettingsForm>{fieldWidth(640, slot)}</SettingsForm>,
    },
    {
      // Single: reference an invigilator looks up one part at a time.
      location: 'Monitor › Algebra Quiz › Instructions',
      canvas: true,
      copy: () => ({
        items: [
          { title: 'A candidate loses connection', content: 'Ask them to stay seated. Their answers are saved, and the test reopens where they left off when the connection returns.' },
          { title: 'A candidate needs more time', content: 'Check the request in Candidates, then add time from the request. Extra time is logged.' },
          { title: 'The fire alarm sounds', content: 'Pause the test for everyone from Candidates, then leave the room. No time is lost while the test is paused.' },
        ],
        headingLevel: 4,
      }),
      render: (slot) => (
        <div style={column()}>
          <PageTitle title="Instructions" sub="What to do on exam day" />
          {fieldWidth(640, slot)}
        </div>
      ),
    },
  ],

  tag: [
    {
      // Removable: the filters in use, each one taken off with its own button. Removing
      // one takes it off; the Topic filter above follows the topic tag.
      location: 'Author › Question bank',
      canvas: true,
      when: { removable: ['true'] },
      demonstrates: ['removable', 'intent'],
      copy: (v, s) => ({ label: TAG_LABEL[v.intent], leadingIcon: TAG_ICON[v.intent], onRemove: s.dismiss }),
      render: (slot, v, s) => {
        // The topic filter is set while its tag shows.
        const topic = slot !== null && v.intent === 'Neutral' ? TAG_LABEL.Neutral : undefined
        return (
          <div style={column('var(--space-4)')}>
            <PageTitle title="Question bank" count="1,284" />
            <FilterBar>
              {fieldWidth(260, <TextInput label="Search" placeholder="Question text" leadingIcon="search" />)}
              <Select key={topic ?? 'any'} label="Topic" widthMode="Hug" placeholder="Any topic" options={TOPICS.map((t) => t.label)} defaultValue={topic} />
              <FieldAction><Button label="Reset" intent="Text" /></FieldAction>
            </FilterBar>
            <div style={row}>
              {slot}
              {s.get('year', true) && <Tag label="Year 10" leadingIcon="school" removable onRemove={() => s.set('year', false)} />}
            </div>
            {/* The results all carry the label the filter asks for. */}
            <FilteredQuestions label={TAG_LABEL[v.intent]} intent={v.intent as BadgeIntent} />
          </div>
        )
      },
    },
    {
      // Small: the labels on each question, in a dense list.
      location: 'Author › Question sets › Algebra Quiz',
      canvas: true,
      when: { size: ['Small'] },
      demonstrates: ['size', 'intent'],
      copy: (v) => ({ label: TAG_LABEL[v.intent], leadingIcon: TAG_ICON[v.intent] }),
      render: (slot) => (
        <div style={column('var(--space-4)')}>
          <PageTitle title="Questions" count="3" />
          <TaggedQuestions first={slot} size="Small" />
        </div>
      ),
    },
    {
      // Medium: the labels on one question, in its settings.
      location: 'Author › Question sets › Algebra Quiz',
      canvas: true,
      demonstrates: ['intent', 'size'],
      copy: (v) => ({ label: TAG_LABEL[v.intent], leadingIcon: TAG_ICON[v.intent] }),
      render: (slot, v) => (
        <QuestionWithPanel>
          <div style={column('var(--space-2)')}>
            <span style={{ fontSize: 16, fontWeight: 500 }}>Labels</span>
            <div style={row}>
              {slot}
              {v.intent !== 'Neutral' && <Tag label="Linear equations" leadingIcon="sell" />}
              <Tag label="Year 10" leadingIcon="school" />
            </div>
          </div>
          <Toggle label="Required" size="Small" defaultChecked />
        </QuestionWithPanel>
      ),
    },
  ],

  avatar: [
    {
      // Presence: which graders are available right now - said in words beside each one.
      location: 'Grade › History Midterm › Graders',
      canvas: true,
      when: { status: ['Online', 'Offline', 'Busy'] },
      copy: (v) => ({ name: v.content === 'Icon' ? 'Guest grader' : 'Ines Planner' }),
      render: (slot, v) => (
        <div style={column()}>
          <PageTitle title="Graders" sub="Shared marking · History Midterm" />
          {fieldWidth(560, (
            <div style={{ background: 'var(--surface)', border: hairline, borderRadius: 'var(--radius-md)' }}>
              {[{ name: v.content === 'Icon' ? 'Guest grader' : 'Ines Planner', note: PRESENCE[v.status], slot: true }, ...GRADERS.filter((g) => g.status !== v.status)].map((g, i, all) => (
                <div key={g.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', borderBottom: i < all.length - 1 ? hairline : 'none' }}>
                  {'slot' in g ? slot : <Avatar name={g.name} size={v.size as 'Small' | 'Medium' | 'Large'} status={(g as (typeof GRADERS)[number]).status as 'Online'} />}
                  <div style={column('2px')}>
                    <span style={{ ...body, fontWeight: 500 }}>{g.name}</span>
                    <span style={caption}>{g.note}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ),
    },
    {
      // Large: the header of a page about one person.
      location: 'Monitor › Algebra Quiz › Candidates › Jane Cooper',
      canvas: true,
      when: { size: ['Large'] },
      copy: () => ({ name: 'Jane Cooper' }),
      render: (slot) => (
        <div style={column()}>
          <div style={{ ...row, gap: 'var(--space-4)' }}>
            {slot}
            <div style={column('var(--space-1)')}>
              <div style={{ ...row, gap: 'var(--space-3)' }}>
                <h3 className="inspera-h2" style={{ margin: 0, fontWeight: 600 }}>Jane Cooper</h3>
                <Badge label="Connection unstable" intent="Warning" size="Small" withIcon />
              </div>
              <span style={{ ...caption, fontSize: 14 }}>Candidate 204517 · Room B2.14 · Extra time +25%</span>
            </div>
          </div>
          <Tiles>
            <Stat label="Answered" value="18 of 24" />
            <Stat label="Time left" value="32 min" />
            <Stat label="Warnings" value={1} />
          </Tiles>
        </div>
      ),
    },
    {
      // Small: who wrote each comment, in a dense thread.
      location: 'Grade › History Midterm › Candidate 0142',
      canvas: true,
      when: { size: ['Small'] },
      copy: () => ({ name: 'Arne Hansen' }),
      render: (slot) => (
        <MarkingLayout
          panel={
            <Panel title="Comments between graders">
              <div style={column('var(--space-4)')}>
                {[
                  { who: slot, name: 'Arne Hansen', when: 'Yesterday at 16:10', text: 'I gave 14. The second cause is thin on evidence.' },
                  { who: <Avatar name="Mia Lund" size="Small" />, name: 'Mia Lund', when: 'Today at 09:02', text: 'Agreed. I would keep 14.' },
                ].map((c) => (
                  <div key={c.name} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                    {c.who}
                    <div style={column('2px')}>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{c.name} <span style={{ ...caption, fontWeight: 400 }}>{c.when}</span></span>
                      <p style={{ ...body, fontSize: 14 }}>{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          }
        />
      ),
    },
    {
      // Medium: the person behind a request, at the start of the row.
      location: 'Monitor › Algebra Quiz › Candidates',
      copy: () => ({ name: 'Jane Cooper' }),
      render: (slot) => (
        <div style={column('var(--space-4)')}>
          <PageTitle title="Candidates" count="24" />
          <Panel title="Requests" action={<Badge label="1 pending" intent="Info" size="Small" />} flush>
            <RequestRow avatar={slot} actions={<><Button label="Decline" intent="Text" /><Button label="Add 10 minutes" intent="Success" /></>} />
          </Panel>
          <CandidatesTable />
        </div>
      ),
    },
  ],

  'avatar-group': [
    {
      // Small: who marks each test, in a column of a table.
      location: 'Grade',
      when: { size: ['Small'] },
      copy: () => ({ avatars: [{ name: 'Arne Hansen' }, { name: 'Mia Lund' }, { name: 'Jonas Berg' }, { name: 'Ines Planner' }, { name: 'Amira Haddad' }, { name: 'Ingrid Solberg' }] }),
      render: (slot, v) => (
        <div style={column('var(--space-4)')}>
          <PageTitle title="Tests to mark" count="3" />
          <div style={{ overflowX: 'auto' }}>
            <Table
              size="Compact"
              hoverable={false}
              aria-label="Tests to mark"
              style={{ border: 'none', borderRadius: 0 }}
              columns={[
                { key: 'test', header: 'Test' },
                { key: 'graders', header: 'Graders' },
                { key: 'marked', header: 'Marked', align: 'right' },
              ]}
              rows={[
                { test: 'History Midterm', graders: slot, marked: '112 of 179' },
                { test: 'Cell biology', graders: <AvatarGroup size="Small" max={Number(v.max)} avatars={[{ name: 'Jonas Berg' }, { name: 'Amira Haddad' }]} />, marked: '128 of 128' },
                { test: 'Calculus I', graders: <AvatarGroup size="Small" max={Number(v.max)} avatars={[{ name: 'Ingrid Solberg' }, { name: 'Arne Hansen' }, { name: 'Mia Lund' }]} />, marked: '58 of 241' },
              ]}
            />
          </div>
        </div>
      ),
    },
    {
      // Large: the header of a page about one team - a marking committee, whose
      // members are what the page is about - under its name, beside the way to change them.
      location: 'Grade › Committees › History',
      canvas: true,
      when: { size: ['Large'] },
      demonstrates: ['size'],
      copy: () => ({ avatars: [{ name: 'Arne Hansen' }, { name: 'Mia Lund' }, { name: 'Jonas Berg' }, { name: 'Ines Planner' }, { name: 'Amira Haddad' }, { name: 'Ingrid Solberg' }] }),
      render: (slot) => (
        <div style={column()}>
          <div style={{ ...row, justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
            <div style={column('var(--space-3)')}>
              <PageTitle title="History marking committee" sub="Marks every History test this term · Chair: Arne Hansen" />
              <div style={{ ...row, gap: 'var(--space-3)' }}>
                {slot}
                <span style={caption}>6 members</span>
              </div>
            </div>
            <Button label="Manage members" intent="Outline" leadingIcon="group" />
          </div>
          <Panel title="Tests this term" flush>
            <div style={{ overflowX: 'auto' }}>
              <Table
                size="Compact"
                hoverable={false}
                aria-label="Tests this term"
                style={{ border: 'none', borderRadius: '0 0 calc(var(--radius-md) - 1px) calc(var(--radius-md) - 1px)' }}
                columns={[
                  { key: 'test', header: 'Test' },
                  { key: 'date', header: 'Test date' },
                  { key: 'marked', header: 'Marked', align: 'right' },
                ]}
                rows={[
                  { test: 'History Midterm', date: '25 Sep 2026', marked: '112 of 179' },
                  { test: 'History Final', date: '4 Dec 2026', marked: 'Not started' },
                ]}
              />
            </div>
          </Panel>
        </div>
      ),
    },
    {
      // Medium: the people on a test, in its overview, beside the way to change them.
      location: 'Deliver › Tests › Algebra Quiz',
      canvas: true,
      copy: () => ({ avatars: [{ name: 'Arne Hansen' }, { name: 'Mia Lund' }, { name: 'Jonas Berg' }, { name: 'Ines Planner' }, { name: 'Amira Haddad' }, { name: 'Ingrid Solberg' }] }),
      render: (slot) => (
        <div style={column()}>
          <PageTitle title="Algebra Quiz" aside={<Badge label="Scheduled" intent="Info" size="Small" />} />
          <Tiles>
            <Panel title="Graders" action={<Link href="#" size="Small" onClick={stay}>Manage</Link>}>
              <div style={column('var(--space-2)')}>
                {slot}
                <span style={caption}>6 graders · 2 per script</span>
              </div>
            </Panel>
            <Panel title="Candidates">
              <div style={column('var(--space-2)')}>
                <span style={{ fontSize: 28, fontWeight: 600 }}>24</span>
                <span style={caption}>2 with extra time</span>
              </div>
            </Panel>
          </Tiles>
        </div>
      ),
    },
  ],

  stat: [
    {
      // The headline figures of a report, each with how it moved since the last sitting.
      location: 'Report › History Midterm',
      canvas: true,
      demonstrates: ['deltaIntent'],
      copy: (v) => {
        const t = STAT_TREND[v.deltaIntent] ?? STAT_TREND.Neutral
        return { label: t.label, value: t.value, delta: t.delta, icon: v.withIcon === 'true' ? t.icon : undefined }
      },
      render: (slot, v) => (
        <div style={column()}>
          <PageTitle title="Overview" sub="History Midterm · 179 candidates · compared with the autumn 2025 sitting" />
          <Tiles>
            {slot}
            <Stat label="Candidates" value={179} delta="+12 on last sitting" deltaIntent="Neutral" icon={v.withIcon === 'true' ? 'group' : undefined} />
            <Stat label="Marked" value="112" helpText="Of 179 scripts" icon={v.withIcon === 'true' ? 'task_alt' : undefined} />
          </Tiles>
        </div>
      ),
    },
  ],

  divider: [
    {
      // Vertical: between groups of tools in a row.
      slot: (p) => <Divider {...(p as DividerProps)} />,
      location: 'Author › Question sets › Algebra Quiz',
      canvas: true,
      when: { orientation: ['Vertical'] },
      render: (slot, v) => (
        <Panel title="Question 3" flush>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', padding: 'var(--space-1) var(--space-3)', borderBottom: hairline, background: 'var(--gray-100)' }}>
            {[
              ['format_bold', 'Bold'], ['format_italic', 'Italic'], ['format_underlined', 'Underline'],
            ].map(([icon, label]) => <Button key={icon} label={label} intent="Text" size="Small" leadingIcon={icon} iconOnly />)}
            {slot}
            {[['format_list_bulleted', 'Bulleted list'], ['format_list_numbered', 'Numbered list']].map(([icon, label]) => <Button key={icon} label={label} intent="Text" size="Small" leadingIcon={icon} iconOnly />)}
            <Divider orientation="Vertical" spacing={v.spacing as 'Compact' | 'Default' | 'Spacious'} />
            {[['image', 'Insert image'], ['functions', 'Insert formula']].map(([icon, label]) => <Button key={icon} label={label} intent="Text" size="Small" leadingIcon={icon} iconOnly />)}
          </div>
          <div style={{ padding: 'var(--space-4) var(--space-5)' }}>
            <p style={body}>Which value of x satisfies 2x + 6 = 14?</p>
          </div>
        </Panel>
      ),
    },
    {
      // Spacious: between the major sections of a long form.
      slot: (p) => <Divider {...(p as DividerProps)} />,
      location: 'Deliver › Tests › Algebra Quiz › Settings',
      canvas: true,
      when: { spacing: ['Spacious'] },
      // An "or" between two settings groups would not mean anything: a labelled divider goes to the last scene.
      unless: { withLabel: ['true'] },
      render: (slot) => (
        <SettingsForm>
          <Panel>
            <div style={column('var(--space-3)')}>
              <GroupTitle sub="Timing and attempts">General</GroupTitle>
              <Checkbox label="Allow late submissions" defaultChecked />
              <Checkbox label="Allow multiple attempts" />
            </div>
            {slot}
            <div style={column('var(--space-3)')}>
              <GroupTitle sub="How candidates take the test">Security</GroupTitle>
              <Checkbox label="Require a locked browser" defaultChecked />
            </div>
          </Panel>
        </SettingsForm>
      ),
    },
    {
      // Compact: between groups in a dense side panel.
      slot: (p) => <Divider {...(p as DividerProps)} />,
      location: 'Author › Question sets › Algebra Quiz',
      canvas: true,
      when: { spacing: ['Compact'] },
      unless: { withLabel: ['true'] },
      render: (slot) => (
        <QuestionWithPanel>
          {/* One block, no gap: the divider's own spacing is the space between the groups. */}
          <div>
            <div style={column('var(--space-2)')}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Scoring</span>
              <Toggle label="Partial credit" size="Small" />
              {fieldWidth(160, <NumberInput label="Marks" size="Small" defaultValue={2} min={0} max={10} />)}
            </div>
            {slot}
            <div style={column('var(--space-2)')}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Display</span>
              <Toggle label="Shuffle answer options" size="Small" defaultChecked />
            </div>
          </div>
        </QuestionWithPanel>
      ),
    },
    {
      // Between two ways to do the same thing - labelled "or" when the label is on.
      slot: (p) => <Divider {...(p as DividerProps)} />,
      location: 'Deliver › Tests › Algebra Quiz › Candidates',
      canvas: true,
      demonstrates: ['orientation', 'spacing'],
      copy: (v) => ({ label: on(v, 'withLabel') && v.orientation === 'Horizontal' ? 'or' : undefined }),
      render: (slot) => (
        <div style={column()}>
          <PageTitle title="Add candidates" />
          <Panel>
            {fieldWidth(480, (
              <div style={column('0px')}>
                <div style={column('var(--space-2)')}>
                  <GroupTitle sub="A CSV file exported from your student system.">Import a list</GroupTitle>
                  <div style={row}><Button label="Choose file" intent="Secondary" leadingIcon="upload_file" /></div>
                </div>
                {slot}
                <div style={column('var(--space-2)')}>
                  <GroupTitle sub="For a few candidates at a time.">Add one at a time</GroupTitle>
                  <div style={{ ...row, alignItems: 'flex-end' }}>
                    {fieldWidth(240, <TextInput label="Candidate ID" placeholder="e.g. 204517" />)}
                    <Button label="Add" intent="Secondary" />
                  </div>
                </div>
              </div>
            ))}
          </Panel>
        </div>
      ),
    },
  ],

  'empty-state': [
    {
      // Small, Secondary: a side panel with nothing in it - good news, said calmly. The page
      // has its own main action, so the panel's is Secondary.
      location: 'Monitor › Algebra Quiz › Candidates',
      when: { size: ['Small'], actionIntent: ['Secondary'] },
      demonstrates: ['size', 'actionIntent'],
      copy: (v) => ({
        icon: 'check_circle',
        title: 'No one needs help',
        description: 'Requests from candidates appear here.',
        actionLabel: on(v, 'withAction') ? 'View request history' : undefined,
        onAction: on(v, 'withAction') ? noop : undefined,
      }),
      render: (slot) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 'var(--space-6)' }}>
          <div style={{ ...column('var(--space-4)'), flex: '2 1 320px' }}>
            <PageTitle title="Candidates" count="24" actions={<Button label="Message all" intent="Primary" leadingIcon="chat" />} />
            <CandidatesTable />
          </div>
          <div style={{ ...column('var(--space-2)'), flex: '1 1 220px', minWidth: 0 }}>
            <h4 className="inspera-h5" style={{ margin: 0, fontWeight: 600 }}>Needs help</h4>
            <div style={{ border: hairline, borderRadius: 'var(--radius-md)' }}>{slot}</div>
          </div>
        </div>
      ),
    },
    {
      // Small, Primary: a dashboard card with nothing in it, whose action is the thing to do next.
      location: 'Home',
      canvas: true,
      when: { size: ['Small'] },
      demonstrates: ['size', 'actionIntent'],
      copy: (v) => ({
        icon: 'task_alt',
        title: 'Nothing to mark',
        description: 'Scripts assigned to you appear here.',
        actionLabel: on(v, 'withAction') ? 'Browse tests to mark' : undefined,
        onAction: on(v, 'withAction') ? noop : undefined,
      }),
      render: (slot) => (
        <div style={column('var(--space-4)')}>
          <PageTitle title="Today" />
          <Tiles>
            <Stat label="Hand-ins today" value={4} helpText="Last change at 15:41" />
            <Panel title="Your marking" flush>{slot}</Panel>
            <Stat label="In progress now" value={18} helpText="Algebra Quiz" />
          </Tiles>
        </div>
      ),
    },
    {
      // Medium: a whole page with nothing in it yet, and the way to start. Secondary when
      // the page title already holds the main action.
      location: 'Author › Question sets',
      demonstrates: ['size', 'actionIntent'],
      copy: (v) => ({
        icon: 'quiz',
        title: 'No question sets yet',
        description: !on(v, 'withAction')
          ? 'Question sets that authors share with you appear here.'
          : v.actionIntent === 'Secondary'
            ? 'Create one, or bring in question sets from another system.'
            : 'Create a question set to start adding questions.',
        actionLabel: !on(v, 'withAction') ? undefined : v.actionIntent === 'Secondary' ? 'Import question sets' : 'Create question set',
        onAction: on(v, 'withAction') ? noop : undefined,
      }),
      render: (slot, v) => (
        <div style={column('var(--space-4)')}>
          <PageTitle
            title="Question sets"
            count="0"
            actions={on(v, 'withAction') && v.actionIntent === 'Secondary' ? <Button label="Create question set" intent="Primary" leadingIcon="add" /> : undefined}
          />
          <div style={{ padding: 'var(--space-6) 0', border: hairline, borderRadius: 'var(--radius-md)' }}>{slot}</div>
        </div>
      ),
    },
  ],

  // --- Feedback, past the pilot ----------------------------------------------

  dialog: [
    {
      // Destructive: deleting a test, over the roster it is deleted from - the object and what is lost, named.
      location: 'Deliver › Tests',
      slot: dialogSlot,
      overlay: () => ({ place: 'Center', scrim: true }),
      when: { confirmIntent: ['Destructive'] },
      copy: (v) => ({
        title: 'Delete Algebra Quiz?',
        children: "The test and its 24 candidate responses will be deleted. You can't undo this.",
        confirmLabel: 'Delete test',
        footerStart: on(v, 'footerStart') ? '24 responses' : undefined,
      }),
      render: () => <Beneath><TestsRoster actions={CREATE_TEST} /></Beneath>,
    },
    {
      // No actions: a dialog that only shows information - the close button is the way out.
      location: 'Grade › History Midterm › Candidate 0142',
      canvas: true,
      slot: dialogSlot,
      overlay: () => ({ place: 'Center', scrim: true }),
      when: { hasActions: ['false'] },
      copy: () => ({
        title: 'Keyboard shortcuts',
        children: (
          <div style={column('var(--space-3)')}>
            {[
              ['Next response', 'J'], ['Previous response', 'K'], ['Focus the mark', 'M'], ['Save and go to next', 'Ctrl Enter'],
            ].map(([what, key]) => (
              <div key={what} style={{ ...row, justifyContent: 'space-between', gap: 'var(--space-6)' }}>
                <span style={body}>{what}</span>
                <Key>{key}</Key>
              </div>
            ))}
          </div>
        ),
        footerStart: undefined,
      }),
      render: () => <Beneath><MarkingLayout panel={<Panel title="Marking"><MarkLine /></Panel>} /></Beneath>,
    },
    {
      // Large: a confirmation with a summary to check first.
      location: 'Deliver › Tests › Algebra Quiz',
      canvas: true,
      slot: dialogSlot,
      overlay: () => ({ place: 'Center', scrim: true }),
      when: { size: ['Large'] },
      demonstrates: ['size', 'confirmIntent'],
      copy: (v) => ({
        title: 'Publish Algebra Quiz?',
        children: (
          <div style={column('var(--space-4)')}>
            <p style={body}>Check the settings. Candidates can start at the time below.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 'var(--space-4)' }}>
              <Fact label="Starts" value="19 September, 09:00" />
              <Fact label="Duration" value="1 hour 30 minutes" />
              <Fact label="Security" value="Locked browser" />
              <Fact label="Results" value="Released by hand" />
            </div>
          </div>
        ),
        confirmLabel: 'Publish',
        footerStart: on(v, 'footerStart') ? '24 candidates' : undefined,
      }),
      render: () => (
        <Beneath minHeight={440}>
          <div style={column()}>
            <PageTitle title="Algebra Quiz" aside={<Badge label="Draft" intent="Neutral" size="Small" />} actions={<Button label="Publish" intent="Primary" />} />
            <Panel title="Test details">
              <div style={{ ...row, gap: 'var(--space-8)' }}>
                <Fact label="Questions" value="24" />
                <Fact label="Candidates" value="24" />
              </div>
            </Panel>
          </div>
        </Beneath>
      ),
    },
    {
      // Medium: a decision that affects many candidates, with the count where the footer has room for it.
      location: 'Grade › History Midterm',
      canvas: true,
      slot: dialogSlot,
      overlay: () => ({ place: 'Center', scrim: true }),
      copy: (v) => ({
        title: 'Release results?',
        children: 'Candidates will see their marks and comments on their dashboard.',
        confirmLabel: 'Release results',
        footerStart: on(v, 'footerStart') ? '179 candidates' : undefined,
      }),
      render: () => (
        <Beneath>
          <div style={column()}>
            <PageTitle title="History Midterm" aside={<Badge label="Marked" intent="Success" size="Small" />} actions={<Button label="Release results" intent="Primary" />} />
            <div style={{ overflowX: 'auto' }}>
              <Table
                size="Compact"
                hoverable={false}
                aria-label="Questions"
                columns={[
                  { key: 'question', header: 'Question' },
                  { key: 'type', header: 'Type' },
                  { key: 'marked', header: 'Marked', align: 'right' },
                ]}
                rows={QUESTION_ROWS.map((r) => ({ ...r, marked: '179 of 179' }))}
              />
            </div>
          </div>
        </Beneath>
      ),
    },
  ],

  drawer: [
    {
      // Bottom: an invigilator on an iPad acts on one candidate - big targets, within reach.
      location: 'Monitor › Algebra Quiz › Candidates',
      overlay: () => ({ place: 'Bottom', scrim: true }),
      slot: dockedDrawer,
      when: { side: ['Bottom'] },
      demonstrates: ['side', 'hasCloseButton'],
      copy: (v, s) => ({
        title: 'Jane Cooper',
        children: (
          <div style={column('var(--space-4)')}>
            <div style={{ ...row, gap: 'var(--space-3)' }}>
              <Badge label="Connection unstable" intent="Warning" withIcon />
              <span style={body}>18 of 24 answered · 32 min left</span>
            </div>
            <div style={{ ...row, gap: 'var(--space-3)' }}>
              <Button label="Add time" intent="Primary" size="Large" leadingIcon="more_time" onClick={s.dismiss} />
              <Button label="Message" intent="Secondary" size="Large" leadingIcon="chat" onClick={s.dismiss} />
              <Button label="Pause test" intent="Secondary" size="Large" leadingIcon="pause" onClick={s.dismiss} />
              {drawerWayOut(v, s, 'Large')}
            </div>
            <div style={column('var(--space-2)')}>
              <span style={{ ...body, fontWeight: 600 }}>Today</span>
              <List
                size="Compact"
                items={[
                  { leadingIcon: 'wifi_off', primary: 'Lost connection for 6 minutes', secondary: '09:42' },
                  { leadingIcon: 'more_time', primary: 'Asked for 10 more minutes', secondary: '09:49' },
                  { leadingIcon: 'login', primary: 'Started the test', secondary: '09:02' },
                ]}
              />
            </div>
          </div>
        ),
      }),
      render: () => (
        <Beneath minHeight={560}>
          <div style={column('var(--space-4)')}>
            <PageTitle title="Candidates" count="24" />
            <CandidatesTable selected={['0']} />
          </div>
        </Beneath>
      ),
    },
    {
      // Left: the roster's saved views, opened from the left on a narrow screen.
      location: 'Monitor › Algebra Quiz › Candidates',
      overlay: () => ({ place: 'Left', scrim: true }),
      slot: dockedDrawer,
      when: { side: ['Left'] },
      // Choosing a view closes it, so it needs no close button of its own.
      demonstrates: ['side', 'hasCloseButton'],
      copy: (_v, s) => ({
        title: 'Views',
        children: (
          <List
            interactive
            // Choosing a view closes the drawer on it.
            onItemClick={s.dismiss}
            size="Compact"
            divided={false}
            style={{ border: 'none' }}
            items={[
              { primary: 'All candidates', trailing: '24' },
              { primary: 'Need help', trailing: '3' },
              { primary: 'Not started', trailing: '4' },
              { primary: 'Submitted', trailing: '11' },
            ]}
          />
        ),
      }),
      render: () => (
        <Beneath>
          <div style={column('var(--space-4)')}>
            <PageTitle title="Candidates" count="24" />
            <ToolbarWell label="Search candidates" />
            <CandidatesTable />
          </div>
        </Beneath>
      ),
    },
    {
      // Right: one question's details, with the bank still in view behind it.
      location: 'Author › Question bank',
      canvas: true,
      overlay: () => ({ place: 'Right', scrim: true }),
      slot: dockedDrawer,
      demonstrates: ['side', 'size', 'hasCloseButton'],
      copy: (v, s) => ({
        title: 'Solve 2x + 6 = 14',
        children: (
          <div style={column('var(--space-4)')}>
            <div style={{ ...column('var(--space-2)'), padding: 'var(--space-4)', border: hairline, borderRadius: 'var(--radius-md)', background: 'var(--gray-100)' }}>
              <span style={{ ...body, fontWeight: 500 }}>Solve 2x + 6 = 14.</span>
              <span style={caption}>Answer: a number. Correct: 4.</span>
            </div>
            <div style={{ ...row, gap: 'var(--space-6)' }}>
              <Fact label="Type" value="Numeric" />
              <Fact label="Marks" value="2" />
              <Fact label="Used in" value="3 tests" />
            </div>
            <div style={row}>
              <Tag label="Linear equations" size="Small" />
              <Tag label="Reviewed" intent="Success" size="Small" />
            </div>
            <div style={row}>
              <Button label="Add to question set" intent="Primary" onClick={s.dismiss} />
              {drawerWayOut(v, s)}
            </div>
          </div>
        ),
      }),
      render: () => (
        <Beneath>
          <div style={column('var(--space-4)')}>
            <PageTitle title="Question bank" count="1,284" />
            <TaggedQuestions first={<Tag label="Linear equations" size="Small" />} size="Small" />
          </div>
        </Beneath>
      ),
    },
  ],

  popover: [
    {
      // Top: the trigger sits in the bar at the foot of the screen, so the panel opens upward.
      location: 'Grade › History Midterm › Candidate 0142',
      canvas: true,
      when: { placement: ['Top'] },
      copy: () => ({
        trigger: <Button label="Flag" intent="Outline" leadingIcon="flag" />,
        title: 'Flag this response',
        content: (
          <div style={column('var(--space-1)')}>
            <Checkbox label="Hard to read" />
            <Checkbox label="Possible plagiarism" />
            <div style={{ ...row, marginTop: 'var(--space-2)' }}><Button label="Flag response" intent="Primary" size="Small" /></div>
          </div>
        ),
      }),
      render: (slot) => (
        <div style={column('var(--space-4)')}>
          <MarkingLayout panel={<Panel title="Marking"><MarkLine /></Panel>} />
          <div style={{ ...row, justifyContent: 'space-between', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', background: 'var(--surface)', border: hairline, borderRadius: 'var(--radius-md)' }}>
            <div style={{ ...row, gap: 'var(--space-4)' }}>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Response 12 of 40</span>
              {slot}
            </div>
            <div style={row}>
              <Button label="Previous" intent="Text" leadingIcon="chevron_left" />
              <Button label="Save and next" intent="Primary" trailingIcon="chevron_right" />
            </div>
          </div>
        </div>
      ),
    },
    {
      // Right: beside a question in the list on the left, so the list stays in view.
      location: 'Author › Question sets › Algebra Quiz',
      canvas: true,
      when: { placement: ['Right'] },
      copy: () => ({
        trigger: <Button label="Move Solve 2x + 6 = 14" intent="Text" size="Small" leadingIcon="drive_file_move" iconOnly />,
        title: 'Move to section',
        content: (
          <div style={column('var(--space-3)')}>
            <Select label="Section" showLabel={false} options={['Linear equations', 'Quadratic equations']} defaultValue="Quadratic equations" />
            <div style={row}><Button label="Move" intent="Primary" size="Small" /></div>
          </div>
        ),
      }),
      render: (slot) => (
        <div style={{ ...column('var(--space-2)'), maxWidth: 300 }}>
          <h4 className="inspera-h5" style={{ margin: 0, fontWeight: 600 }}>Questions (3)</h4>
          <div style={{ background: 'var(--surface)', border: hairline, borderRadius: 'var(--radius-md)' }}>
            {BANK_QUESTIONS.map((q, i) => (
              <div key={q.name} style={{ ...row, justifyContent: 'space-between', flexWrap: 'nowrap', padding: 'var(--space-2) var(--space-3)', borderBottom: i < BANK_QUESTIONS.length - 1 ? hairline : 'none' }}>
                <span style={{ fontSize: 14 }}>{q.name}</span>
                {i === 0 ? slot : <Button label={`Move ${q.name}`} intent="Text" size="Small" leadingIcon="drive_file_move" iconOnly />}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      // Left: the trigger is at the end of a row, so the panel opens back across it.
      location: 'Monitor › Algebra Quiz › Candidates',
      when: { placement: ['Left'] },
      copy: () => ({
        trigger: <Button label="Add time for Jane Cooper" intent="Text" size="Small" leadingIcon="more_time" iconOnly />,
        title: 'Add time',
        content: (
          <div style={{ ...row, alignItems: 'flex-end', flexWrap: 'nowrap' }}>
            <NumberInput label="Minutes" size="Small" defaultValue={10} min={0} max={60} step={5} suffix="min" />
            <Button label="Add" intent="Primary" size="Small" />
          </div>
        ),
      }),
      render: (slot) => (
        <div style={column('var(--space-4)')}>
          <PageTitle title="Candidates" count="24" />
          <div style={{ background: 'var(--surface)', border: hairline, borderRadius: 'var(--radius-md)' }}>
            {CANDIDATES.map((c, i) => (
              <div key={c.candidate} style={{ ...row, justifyContent: 'space-between', flexWrap: 'nowrap', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-4)', borderBottom: i < CANDIDATES.length - 1 ? hairline : 'none' }}>
                <span style={{ ...body, flex: '1 1 140px', minWidth: 0 }}>{c.candidate}</span>
                <span style={{ flex: '1 1 160px', minWidth: 0, overflow: 'hidden' }}>{c.status}</span>
                <span style={{ fontSize: 14, minWidth: 64, textAlign: 'right' }}>{c.progress}</span>
                {i === 1 ? slot : <Button label={`Add time for ${c.candidate}`} intent="Text" size="Small" leadingIcon="more_time" iconOnly />}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      // Bottom: under the toolbar button that opens it.
      location: 'Deliver › Tests',
      copy: () => ({
        trigger: <Button label="Filters" intent="Outline" leadingIcon="filter_list" trailingIcon="expand_more" />,
        title: 'Show only',
        content: (
          <div style={column('0px')}>
            <Checkbox label="Starts this week" defaultChecked />
            <Checkbox label="Created by me" />
            <Checkbox label="With setup problems" />
          </div>
        ),
      }),
      render: (slot) => (
        <div style={column('var(--space-4)')}>
          <PageTitle title="Tests" count="242" actions={CREATE_TEST} />
          <div style={{ ...row, gap: 'var(--space-2)' }}>
            {fieldWidth(280, <TextInput label="Search tests" showLabel={false} placeholder="Search" leadingIcon="search" />)}
            {slot}
          </div>
          <TestsTable />
        </div>
      ),
    },
  ],

  snackbar: [
    {
      // In place: the page that did the work shows the snackbar, at the foot of what changed.
      location: 'Author › Question sets › Algebra Quiz',
      canvas: true,
      demonstrates: ['intent'],
      locks: (v): Record<string, Lock> =>
        v.intent === 'Error'
          ? { withAction: { value: 'true', reason: 'A failed save carries Try again, so people can retry right from the message.' } }
          : {},
      copy: (v, s) => {
        const t = SNACKBAR_COPY[v.intent] ?? SNACKBAR_COPY.Neutral
        return { message: t.message, actionLabel: on(v, 'withAction') ? t.action : undefined, onAction: s.dismiss, onClose: s.dismiss }
      },
      render: (slot) => (
        <QuestionEditor footer={<div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-4)' }}>{slot}</div>} />
      ),
    },
  ],

  toast: [
    {
      // Top centre: the step footer holds the way forward at the bottom, so the toast keeps clear of it.
      location: 'Deliver › Tests › New test',
      canvas: true,
      overlay: () => ({ place: 'TopCenter' }),
      slot: toastSlot({
        Neutral: { message: 'Draft saved.', action: 'Undo' },
        Info: { message: 'Another planner is editing this test.', action: 'View' },
        Success: { message: 'Question set added to the test.', action: 'Undo' },
        Warning: { message: 'Saved, but the start time is in the past.', action: 'Fix' },
        Error: { message: "Couldn't save the draft.", action: 'Try again' },
      }),
      when: { position: ['TopCenter'] },
      render: () => (
        <div style={column()}>
          <SetupTitle />
          <FormColumn>
            {setupFields.name}
            {setupFields.questionSet}
          </FormColumn>
          <StepFooter>{NEXT}</StepFooter>
        </div>
      ),
    },
    {
      // Bottom left: the question settings take the right of the screen, so the toast keeps clear of them.
      location: 'Author › Question sets › Algebra Quiz',
      canvas: true,
      overlay: () => ({ place: 'BottomLeft' }),
      slot: toastSlot({
        Neutral: { message: 'Question 3 saved.', action: 'Undo' },
        Info: { message: 'A newer version of this question set exists.', action: 'Reload' },
        Success: { message: 'Question 3 moved to Quadratic equations.', action: 'Undo' },
        Warning: { message: "You're offline. Changes are kept on this device.", action: 'Retry' },
        Error: { message: "Couldn't save Question 3.", action: 'Try again' },
      }),
      when: { position: ['BottomLeft'] },
      render: () => <QuestionEditor />,
    },
    {
      // Bottom centre: a touch screen, where the middle of the bottom edge is in view and in reach.
      location: 'Monitor › Algebra Quiz › Candidates',
      overlay: () => ({ place: 'BottomCenter' }),
      slot: toastSlot({
        Neutral: { message: 'Note saved for Jane Cooper.', action: 'Undo' },
        Info: { message: 'Omar Haddad is back online.', action: 'View' },
        Success: { message: 'Added 10 minutes for Jane Cooper.', action: 'Undo' },
        Warning: { message: 'Message sent, but 1 candidate is offline.', action: 'View' },
        Error: { message: "Couldn't add time for Jane Cooper.", action: 'Try again' },
      }),
      when: { position: ['BottomCenter'] },
      render: () => (
        <Beneath minHeight={320}>
          <div style={column('var(--space-4)')}>
            <PageTitle title="Candidates" count="24" />
            <CandidatesTable />
          </div>
        </Beneath>
      ),
    },
    {
      // Bottom right, and any corner without a scene of its own: clear of the title and its main action.
      location: 'Deliver › Tests',
      overlay: (v) => ({ place: v.position as OverlayPlace, below: 64 }),
      slot: toastSlot({
        Neutral: { message: 'Algebra Quiz saved as a draft.', action: 'Undo' },
        Info: { message: "Export started. We'll email you when it's ready.", action: 'View' },
        Success: { message: 'Algebra Quiz published.', action: 'Undo' },
        Warning: { message: 'Published, but 2 candidates have no email address.', action: 'View' },
        Error: { message: "Couldn't publish Algebra Quiz.", action: 'Try again' },
      }),
      render: () => (
        <Beneath minHeight={340}>
          <TestsRoster actions={CREATE_TEST} />
        </Beneath>
      ),
    },
  ],

  'command-palette': [
    {
      // No hotkey: in the question editor, Ctrl K already inserts a link - so the palette opens from a button.
      location: 'Author › Question sets › Algebra Quiz',
      canvas: true,
      overlay: () => ({ place: 'Top', scrim: true }),
      slot: paletteSlot,
      when: { hotkey: ['false'] },
      copy: () => ({ commands: AUTHOR_COMMANDS }),
      render: () => (
        <Beneath minHeight={400}>
          <div style={column('var(--space-4)')}>
            <PageTitle title="Algebra Quiz" actions={<Button label="Commands" intent="Outline" leadingIcon="terminal" />} />
            <QuestionEditor />
          </div>
        </Beneath>
      ),
    },
    {
      // With the hotkey: Ctrl K, from anywhere, to jump or act without hunting through menus.
      location: 'Deliver › Tests',
      overlay: () => ({ place: 'Top', scrim: true }),
      slot: paletteSlot,
      render: () => (
        <Beneath minHeight={420}>
          <TestsRoster actions={CREATE_TEST} />
        </Beneath>
      ),
    },
  ],

  tooltip: [
    {
      // Accessibility: a longer explanation of a term, in larger text.
      location: 'Report › History Midterm › Questions',
      slot: (p) => <Tooltip {...(p as unknown as TooltipProps)} />,
      when: { variant: ['Accessibility'] },
      copy: () => ({
        content: 'How well a question separates stronger from weaker candidates. 0.20 or higher is good.',
        children: <Button label="What discrimination means" intent="Text" size="Small" leadingIcon="info" iconOnly />,
      }),
      render: (slot) => (
        <div style={column('var(--space-4)')}>
          <PageTitle title="Questions" sub="Item analysis from 179 marked scripts" />
          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }} aria-label="Item analysis">
              <thead>
                <tr style={{ background: 'var(--gray-100)', textAlign: 'left', color: 'var(--gray-700)' }}>
                  <th scope="col" style={{ padding: 'var(--space-2) var(--space-4)', fontWeight: 600 }}>Question</th>
                  <th scope="col" style={{ padding: 'var(--space-2) var(--space-4)', fontWeight: 600, textAlign: 'right' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>Discrimination {slot}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[['1 · Linear equations', '0.41'], ['2 · Factorising', '0.17'], ['4 · Causes of war', '0.33']].map(([q, d]) => (
                  <tr key={q} style={{ borderBottom: hairline }}>
                    <td style={{ padding: 'var(--space-2) var(--space-4)' }}>{q}</td>
                    <td style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'right' }}>{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      // Light: the trigger sits on the navy tool rail, where a dark bubble would disappear.
      location: 'Author › Question sets › Algebra Quiz',
      canvas: true,
      slot: (p) => <Tooltip {...(p as unknown as TooltipProps)} />,
      when: { theme: ['Light'] },
      copy: () => ({ content: 'Questions', children: railButton }),
      render: (slot) => <ToolRail first={slot} />,
    },
    {
      // Bottom: icon buttons near the top of the screen - the bubble opens down, onto the page.
      location: 'Grade › History Midterm › Candidate 0142',
      canvas: true,
      slot: (p) => <Tooltip {...(p as unknown as TooltipProps)} />,
      when: { placement: ['Bottom'] },
      copy: () => ({ content: 'Full screen', children: iconButton('fullscreen', 'Full screen') }),
      render: (slot) => (
        <MarkingLayout
          actions={<>{iconButton('keyboard', 'Keyboard shortcuts')}{slot}</>}
          panel={<Panel title="Marking"><MarkLine /></Panel>}
        />
      ),
    },
    {
      // Right: a flag at the end of a row in a narrow list on the left - the bubble opens out into the page.
      location: 'Grade › History Midterm',
      canvas: true,
      slot: (p) => <Tooltip {...(p as unknown as TooltipProps)} />,
      when: { placement: ['Right'] },
      copy: () => ({ content: 'Flagged: possible plagiarism', children: <Button label="Flagged" intent="Text" size="Small" leadingIcon="flag" iconOnly /> }),
      render: (slot) => (
        <div style={{ ...column('var(--space-2)'), maxWidth: 260 }}>
          <h4 className="inspera-h5" style={{ margin: 0, fontWeight: 600 }}>Scripts</h4>
          <div style={{ background: 'var(--surface)', border: hairline, borderRadius: 'var(--radius-md)' }}>
            {['Candidate 0142', 'Candidate 0157', 'Candidate 0163'].map((name, i) => (
              <div key={name} style={{ ...row, justifyContent: 'space-between', flexWrap: 'nowrap', gap: 'var(--space-2)', minHeight: 44, padding: '0 var(--space-3)', borderBottom: i < 2 ? hairline : 'none' }}>
                <span style={{ fontSize: 14 }}>{name}</span>
                {i === 0 && slot}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      // Left: the last icon on a row, at the right edge - the bubble opens back across the row.
      location: 'Deliver › Tests › Algebra Quiz › Candidates',
      slot: (p) => <Tooltip {...(p as unknown as TooltipProps)} />,
      when: { placement: ['Left'] },
      copy: () => ({ content: 'Remove from test', children: <Button label="Remove Omar Haddad" intent="Text" size="Small" leadingIcon="person_remove" iconOnly /> }),
      render: (slot) => (
        <div style={column('var(--space-4)')}>
          <PageTitle title="Candidates" count="24" actions={<Button label="Add candidates" intent="Primary" leadingIcon="group_add" />} />
          <div style={{ background: 'var(--surface)', border: hairline, borderRadius: 'var(--radius-md)' }}>
            {['Jane Cooper', 'Omar Haddad', 'Li Wei'].map((name, i) => (
              <div key={name} style={{ ...row, justifyContent: 'space-between', flexWrap: 'nowrap', minHeight: 48, padding: '0 var(--space-4)', borderBottom: i < 2 ? hairline : 'none' }}>
                <span style={body}>{name}</span>
                {i === 1 ? slot : <Button label={`Remove ${name}`} intent="Text" size="Small" leadingIcon="person_remove" iconOnly />}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      // Top: an icon-only button in a toolbar, which needs its name shown on hover and focus.
      location: 'Deliver › Tests',
      slot: (p) => <Tooltip {...(p as unknown as TooltipProps)} />,
      copy: () => ({ content: 'Column layout', children: iconButton('view_column', 'Column layout') }),
      render: (slot) => (
        // A little more room above the toolbar than the roster has, so the bubble stays clear of Create new test.
        <div style={column('var(--space-8)')}>
          <PageTitle title="Tests" count="242" actions={CREATE_TEST} />
          <ToolbarWell
            action={
              <div style={row}>
                {iconButton('restart_alt', 'Reset filters')}
                {slot}
                {iconButton('menu', 'View options')}
              </div>
            }
          />
          <TestsTable />
        </div>
      ),
    },
  ],

  progress: [
    {
      // Indeterminate: how long it will take is not known yet.
      location: 'Report › History Midterm › Export',
      canvas: true,
      when: { indeterminate: ['true'] },
      copy: () => ({ label: 'Preparing the export' }),
      render: (slot) => (
        <div style={column()}>
          <PageTitle title="Export results" />
          <Panel>
            <div style={column('var(--space-3)')}>
              <span style={{ ...body, fontWeight: 500 }}>Preparing PDFs for 179 candidates</span>
              {slot}
              <p style={caption}>You can leave this page. We'll email you a link when the export is ready.</p>
            </div>
          </Panel>
        </div>
      ),
    },
    {
      // Circular: a compact tile on the home page, where a bar would not fit beside the figure.
      location: 'Home',
      canvas: true,
      when: { variant: ['Circular'] },
      demonstrates: ['variant', 'intent'],
      copy: (v) => ({ label: 'Your marking', value: (MARKING[v.intent] ?? MARKING.Primary).value }),
      render: (slot, v) => (
        <div style={column('var(--space-4)')}>
          <PageTitle title="Today" />
          <Tiles>
            <div style={{ ...row, flexWrap: 'nowrap', gap: 'var(--space-4)', padding: 'var(--space-4)', background: 'var(--surface)', border: hairline, borderRadius: 'var(--radius-lg)' }}>
              {slot}
              <div style={column('2px')}>
                <span style={{ ...body, fontWeight: 600 }}>Your marking</span>
                <span style={caption}>{(MARKING[v.intent] ?? MARKING.Primary).note}</span>
              </div>
            </div>
            <Stat label="Hand-ins today" value={4} helpText="Last change at 15:41" />
            <Stat label="In progress now" value={18} helpText="Algebra Quiz" />
          </Tiles>
        </div>
      ),
    },
    {
      // Small: a thin bar inside a table row, with the count in words beside it.
      location: 'Grade',
      when: { size: ['Small'] },
      demonstrates: ['size', 'intent', 'showValue'],
      copy: (v) => ({ label: 'History Midterm, marked', value: (MARKING[v.intent] ?? MARKING.Primary).value }),
      render: (slot, v) => {
        const meter = (bar: ReactNode, text: string) => (
          <div style={{ ...row, flexWrap: 'nowrap', gap: 'var(--space-3)', minWidth: 220 }}>
            <div style={{ flex: 1 }}>{bar}</div>
            <span style={{ fontSize: 14, minWidth: 88, textAlign: 'right' }}>{text}</span>
          </div>
        )
        return (
          <div style={column('var(--space-4)')}>
            <PageTitle title="Tests to mark" count="3" />
            <div style={{ overflowX: 'auto' }}>
              <Table
                size="Compact"
                hoverable={false}
                aria-label="Tests to mark"
                columns={[{ key: 'test', header: 'Test' }, { key: 'progress', header: 'Marked' }, { key: 'due', header: 'Due' }]}
                rows={[
                  { test: 'History Midterm', progress: meter(slot, v.intent === 'Success' ? 'All 40' : '12 of 40'), due: v.intent === 'Error' ? 'Overdue' : v.intent === 'Warning' ? 'Tomorrow' : '24 Oct' },
                  { test: 'Cell biology', progress: meter(<Progress label="Cell biology, marked" value={100} intent="Success" size="Small" />, 'All 128'), due: 'Done' },
                  { test: 'Calculus I', progress: meter(<Progress label="Calculus I, marked" value={24} size="Small" />, '58 of 241'), due: '5 Nov' },
                ]}
              />
            </div>
          </div>
        )
      },
    },
    {
      // Large: one task that is the whole point of the screen right now.
      location: 'Deliver › Tests › Algebra Quiz › Candidates',
      canvas: true,
      when: { size: ['Large'] },
      demonstrates: ['size', 'intent', 'showValue'],
      copy: (v) => ({ label: 'Importing candidates', value: v.intent === 'Success' ? 100 : 60 }),
      render: (slot, v) => (
        <div style={column()}>
          <PageTitle title="Import candidates" />
          <Panel>
            <div style={column('var(--space-3)')}>
              <div style={{ ...row, justifyContent: 'space-between' }}>
                <span style={{ ...body, fontWeight: 500 }}>{v.intent === 'Success' ? 'Imported 340 candidates' : v.intent === 'Error' ? 'Import stopped at row 204' : 'Importing 340 candidates'}</span>
                <span style={caption}>{v.intent === 'Success' ? 'Done' : '204 of 340'}</span>
              </div>
              {slot}
              <p style={caption}>
                {v.intent === 'Error'
                  ? 'Row 204 has no candidate ID. Fix the file and import it again.'
                  : v.intent === 'Warning'
                    ? '3 rows have no email address. Those candidates get no invitation.'
                    : 'You can keep working. The list updates as candidates are added.'}
              </p>
            </div>
          </Panel>
        </div>
      ),
    },
    {
      // Medium: how far the marking has come, with the count in words.
      location: 'Grade',
      canvas: true,
      demonstrates: ['size', 'intent', 'showValue'],
      copy: (v) => ({ label: 'History Midterm, marked', value: (MARKING[v.intent] ?? MARKING.Primary).value }),
      render: (slot, v) => (
        <div style={column()}>
          <PageTitle title="Your marking" />
          <Panel>
            <MarkingRow test="History Midterm" bar={slot} note={(MARKING[v.intent] ?? MARKING.Primary).note} />
            <MarkingRow test="Cell biology" bar={<Progress label="Cell biology, marked" value={100} intent="Success" />} note="All 128 marked" />
          </Panel>
        </div>
      ),
    },
  ],

  spinner: [
    {
      // Inverse: on the dark of a video player, waiting for the recording to load.
      location: 'Grade › Spanish oral exam › Candidate 0142',
      canvas: true,
      slot: (p) => <Spinner {...(p as SpinnerProps)} />,
      when: { intent: ['Inverse'] },
      copy: () => ({ label: 'Loading the recording' }),
      render: (slot) => (
        <div style={column('var(--space-4)')}>
          <PageTitle title="Candidate 0142" aside={<Badge label="Marking" intent="Info" size="Small" />} />
          <Panel title="Recording" flush>
            <div style={{ ...column('var(--space-3)'), alignItems: 'center', justifyContent: 'center', height: 180, background: 'var(--gray-900)', color: 'var(--white)', borderRadius: '0 0 calc(var(--radius-md) - 1px) calc(var(--radius-md) - 1px)' }}>
              {slot}
              <span style={{ fontSize: 14 }}>Loading the recording</span>
            </div>
          </Panel>
        </div>
      ),
    },
    {
      // Neutral: more of a list loading at its end - quiet, so it does not pull the eye.
      location: 'Deliver › Tests › Algebra Quiz',
      canvas: true,
      slot: (p) => <Spinner {...(p as SpinnerProps)} />,
      when: { intent: ['Neutral'] },
      copy: () => ({ label: 'Loading earlier events' }),
      render: (slot) => (
        <div style={column()}>
          <PageTitle title="Activity" />
          {fieldWidth(560, (
            <div style={column('var(--space-3)')}>
              <List
                items={[
                  { leadingIcon: 'publish', primary: 'Ines Planner published the test', secondary: 'Today at 14:43' },
                  { leadingIcon: 'schedule', primary: 'Ines Planner moved the start to 09:00', secondary: 'Today at 14:21' },
                ]}
              />
              <div style={{ ...row, justifyContent: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
                {slot}
                Loading earlier events
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      // Small: beside the count it is updating - the roster stays in view while it refreshes.
      location: 'Deliver › Tests',
      slot: (p) => <Spinner {...(p as SpinnerProps)} />,
      when: { size: ['Small'] },
      copy: () => ({ label: 'Updating the list' }),
      render: (slot) => (
        <div style={column('var(--space-4)')}>
          <PageTitle
            title="Tests"
            aside={<span style={{ ...row, gap: 'var(--space-2)', fontSize: 14, color: 'var(--text-secondary)' }}>{slot}Updating</span>}
            count="242"
            actions={CREATE_TEST}
          />
          <ToolbarWell>{QUICK_FILTERS}</ToolbarWell>
          <TestsTable />
        </div>
      ),
    },
    {
      // Large: a whole panel people wait on - here, the preview being built.
      location: 'Author › Question sets › Algebra Quiz › Preview',
      canvas: true,
      slot: (p) => <Spinner {...(p as SpinnerProps)} />,
      when: { size: ['Large'] },
      copy: () => ({ label: 'Building the preview' }),
      render: (slot) => (
        <div style={column()}>
          <PageTitle title="Preview" actions={<SegmentedControl label="Preview as" items={['Desktop', 'Tablet', 'Phone']} size="Small" />} />
          <div style={{ ...column('var(--space-3)'), alignItems: 'center', justifyContent: 'center', minHeight: 220, background: 'var(--surface)', border: hairline, borderRadius: 'var(--radius-md)' }}>
            {slot}
            <span style={{ ...body, color: 'var(--text-secondary)' }}>Building the preview</span>
          </div>
        </div>
      ),
    },
    {
      // Medium: a card updating after a change, while the rest of the page stays as it was.
      location: 'Report › History Midterm',
      canvas: true,
      slot: (p) => <Spinner {...(p as SpinnerProps)} />,
      copy: () => ({ label: 'Recalculating' }),
      render: (slot) => (
        <div style={column()}>
          <PageTitle
            title="Overview"
            actions={
              <span style={{ ...row, gap: 'var(--space-2)' }}>
                <span style={{ ...body, color: 'var(--text-secondary)' }}>Class</span>
                <Select label="Class" showLabel={false} widthMode="Hug" options={['All classes', '10A', '10B']} defaultValue="10A" />
              </span>
            }
          />
          <Tiles>
            <Stat label="Candidates" value={24} helpText="Class 10A" />
            <Panel title="Score distribution">
              <div style={{ ...column('var(--space-2)'), alignItems: 'center', justifyContent: 'center', minHeight: 96 }}>
                {slot}
                <span style={caption}>Recalculating for 10A</span>
              </div>
            </Panel>
          </Tiles>
        </div>
      ),
    },
  ],

  skeleton: [
    {
      // The home page on its first load: each skeleton in the shape of what will arrive there.
      location: 'Home',
      canvas: true,
      demonstrates: ['variant'],
      slot: (p) => <Skeleton {...(p as SkeletonProps)} />,
      copy: (v) => (v.variant === 'Rect' ? { width: '100%', height: 92, radius: 'var(--radius-lg)' } : v.variant === 'Circle' ? { width: 32, height: 32 } : {}),
      render: (slot, v) => (
        <div style={column('var(--space-4)')} aria-busy="true">
          <Tiles>
            {[0, 1, 2].map((i) => (
              <div key={i}>{i === 0 && v.variant === 'Rect' ? slot : <Skeleton variant="Rect" width="100%" height={92} radius="var(--radius-lg)" />}</div>
            ))}
          </Tiles>
          <Panel title="Recent events" flush>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-5)', borderBottom: i < 2 ? hairline : 'none' }}>
                {i === 0 && v.variant === 'Circle' ? slot : <Skeleton variant="Circle" width={32} height={32} />}
                <div style={{ flex: 1, maxWidth: 360 }}>
                  {i === 0 && v.variant === 'Text' ? slot : <Skeleton variant="Text" lines={2} />}
                </div>
              </div>
            ))}
          </Panel>
        </div>
      ),
    },
  ],

  // --- Navigation ------------------------------------------------------------

  tabs: [
    {
      // Full width: a narrow panel, where the two tabs share its width. Each tab has its own panel.
      location: 'Author › Question sets › Algebra Quiz',
      canvas: true,
      when: { fullWidth: ['true'] },
      copy: () => ({
        label: 'Question set content',
        items: [
          {
            label: 'Questions (3)',
            value: 'questions',
            content: (
              <div style={{ ...column('var(--space-1)'), padding: 'var(--space-3) var(--space-4)' }}>
                <SectionQuestions names={BANK_QUESTIONS.map((q) => q.name)} />
              </div>
            ),
          },
          {
            label: 'Resources (0)',
            value: 'resources',
            content: (
              <div style={{ padding: 'var(--space-3) var(--space-4)' }}>
                <p style={caption}>No resources yet. Add images or PDFs candidates can open during the test.</p>
              </div>
            ),
          },
        ],
      }),
      render: (slot) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
          <div style={{ flex: '1 1 260px', minWidth: 0, maxWidth: 320, background: 'var(--surface)', border: hairline, borderRadius: 'var(--radius-md)' }}>
            {slot}
          </div>
          <div style={{ flex: '2 1 300px', minWidth: 0 }}>
            <Panel title="Question 1">
              <p style={body}>Solve 2x + 6 = 14.</p>
            </Panel>
          </div>
        </div>
      ),
    },
    {
      // Contained: a compact switch inside the marking panel, between things about the same response.
      location: 'Grade › History Midterm › Candidate 0142',
      canvas: true,
      when: { variant: ['Contained'] },
      copy: () => ({
        label: 'Marking panel',
        items: [
          {
            label: 'Rubric',
            content: (
              <div style={{ ...column('var(--space-3)'), paddingTop: 'var(--space-4)' }}>
                <GroupTitle sub="6 of 8 marks">Argument</GroupTitle>
                <GroupTitle sub="8 of 12 marks">Use of evidence</GroupTitle>
              </div>
            ),
          },
          {
            label: 'Guide',
            content: (
              <div style={{ ...column('var(--space-2)'), paddingTop: 'var(--space-4)' }}>
                <p style={body}>A full-mark answer explains two causes, each backed by evidence, and weighs them against each other.</p>
                <p style={caption}>Written by Arne Hansen</p>
              </div>
            ),
          },
          {
            label: 'History',
            content: (
              <div style={{ paddingTop: 'var(--space-4)' }}>
                <List
                  size="Compact"
                  items={[
                    { primary: 'Marked 14 of 20', secondary: 'You · Today at 10:12' },
                    { primary: 'Opened for marking', secondary: 'Arne Hansen · Yesterday at 16:10' },
                  ]}
                />
              </div>
            ),
          },
        ],
      }),
      render: (slot) => (
        <MarkingLayout
          panel={
            <div style={{ padding: 'var(--space-4)', background: 'var(--surface)', border: hairline, borderRadius: 'var(--radius-md)' }}>
              {slot}
            </div>
          }
        />
      ),
    },
    {
      // Small: the views of one card's data, inside the card. Each view draws its own chart.
      location: 'Report › History Midterm',
      canvas: true,
      when: { size: ['Small'] },
      copy: () => ({
        label: 'Score views',
        items: [
          { label: 'Distribution', content: <Bars heights={[18, 34, 56, 80, 64, 40, 22]} /> },
          { label: 'By question', content: <Bars heights={[80, 60, 68]} labels={['Q1', 'Q2', 'Q4']} /> },
          { label: 'By class', content: <Bars heights={[66, 61, 63]} labels={['10A', '10B', '10C']} /> },
        ],
      }),
      render: (slot) => (
        <div style={column()}>
          <PageTitle title="Overview" />
          <div style={{ background: 'var(--surface)', border: hairline, borderRadius: 'var(--radius-md)', padding: 'var(--space-3) var(--space-5) var(--space-4)' }}>
            <h4 className="inspera-h4" style={{ margin: '0 0 var(--space-2)', fontWeight: 600 }}>Scores</h4>
            <div style={{ overflowX: 'auto' }}>{slot}</div>
          </div>
        </div>
      ),
    },
    {
      // Underline: sibling views of one test, right under its title. Each tab is its own view.
      location: 'Deliver › Tests › Algebra Quiz',
      copy: () => ({
        label: 'Test sections',
        items: [
          {
            label: 'Overview',
            content: (
              <div style={{ ...row, gap: 'var(--space-8)', paddingTop: 'var(--space-4)' }}>
                <Fact label="Starts" value="19 Sep 2026, 09:00" />
                <Fact label="Duration" value="1 h 30 min" />
                <Fact label="Candidates" value="24" />
              </div>
            ),
          },
          {
            label: 'Candidates',
            content: (
              <div style={{ paddingTop: 'var(--space-4)', overflowX: 'auto' }}>
                <Table
                  size="Compact"
                  hoverable={false}
                  aria-label="Candidates"
                  style={{ border: 'none', borderRadius: 0 }}
                  columns={[{ key: 'name', header: 'Candidate' }, { key: 'time', header: 'Extra time' }, { key: 'invite', header: 'Invitation' }]}
                  rows={[
                    { name: 'Jane Cooper', time: '+25%', invite: <Badge label="Sent" intent="Success" size="Small" /> },
                    { name: 'Omar Haddad', time: '-', invite: <Badge label="Sent" intent="Success" size="Small" /> },
                    { name: 'Li Wei', time: '-', invite: <Badge label="Not sent" intent="Neutral" size="Small" /> },
                  ]}
                />
              </div>
            ),
          },
          {
            label: 'Settings',
            content: (
              <div style={{ ...column('var(--space-1)'), paddingTop: 'var(--space-3)' }}>
                <Checkbox label="Allow late submissions" defaultChecked />
                <Checkbox label="Require a locked browser" defaultChecked />
              </div>
            ),
          },
          {
            label: 'Activity',
            content: (
              <div style={{ paddingTop: 'var(--space-4)' }}>
                <List
                  size="Compact"
                  items={[
                    { leadingIcon: 'schedule', primary: 'Ines Planner moved the start to 09:00', secondary: 'Today at 14:21' },
                    { leadingIcon: 'group_add', primary: 'Arne Hansen added 24 candidates', secondary: 'Yesterday at 12:05' },
                  ]}
                />
              </div>
            ),
          },
        ],
      }),
      render: (slot) => (
        <div style={column('var(--space-2)')}>
          <PageTitle title="Algebra Quiz" aside={<Badge label="Scheduled" intent="Info" size="Small" />} actions={<Button label="Publish" intent="Primary" />} />
          <div style={{ overflowX: 'auto' }}>{slot}</div>
        </div>
      ),
    },
  ],

  breadcrumb: [
    {
      // Slash: where a question is filed, read as a path of folders.
      location: 'Author › Question bank',
      canvas: true,
      when: { separator: ['Slash'] },
      copy: () => ({ items: [{ label: 'Question bank', href: '#' }, { label: 'Mathematics', href: '#' }, { label: 'Algebra', href: '#' }, 'Linear equations'], label: 'Folder' }),
      render: (slot) => (
        <QuestionWithPanel title="Details">
          <div style={column('var(--space-1)')}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>Saved in</span>
            {slot}
          </div>
          <div style={{ ...row, gap: 'var(--space-6)' }}>
            <Fact label="Type" value="Multiple choice" />
            <Fact label="Marks" value="2" />
          </div>
        </QuestionWithPanel>
      ),
    },
    {
      // Small: the location bar under the top bar, as on every inner page.
      location: 'Deliver',
      canvas: true,
      when: { size: ['Small'] },
      copy: () => ({ items: [{ label: 'Tests', href: '#' }, { label: 'Algebra Quiz', href: '#' }, 'Settings'], label: 'Location' }),
      render: (slot) => (
        <div style={column()}>
          {/* The bar runs the width of the screen, flush under the top bar. */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minHeight: 40, margin: 'calc(-1 * var(--scene-pad)) calc(-1 * var(--scene-pad)) 0', padding: '0 var(--scene-pad)', background: 'var(--surface)', borderBottom: hairline }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--gray-700)' }} aria-hidden>home</span>
            {slot}
          </div>
          <SettingsForm>
            <Panel title="General settings">
              <Checkbox label="Allow late submissions" defaultChecked />
            </Panel>
          </SettingsForm>
        </div>
      ),
    },
    {
      // Medium: above the title, inside the page, where the hierarchy leads to the page.
      location: 'Author',
      canvas: true,
      copy: () => ({ items: [{ label: 'Question sets', href: '#' }, { label: 'Algebra Quiz', href: '#' }, 'Question 3'] }),
      render: (slot) => (
        <div style={column()}>
          <div style={column('var(--space-2)')}>
            {slot}
            <PageTitle title="Question 3" actions={<Button label="Save" intent="Primary" />} />
          </div>
          <Panel>
            <p style={body}>Which value of x satisfies 2x + 6 = 14?</p>
          </Panel>
        </div>
      ),
    },
  ],

  pagination: [
    {
      // Small: stepping through responses while marking, in the dense header of the marking view.
      location: 'Grade › History Midterm › Candidate 0142',
      canvas: true,
      when: { size: ['Small'] },
      demonstrates: ['size', 'showEdges'],
      copy: () => ({ pageCount: 40, defaultPage: 12, label: 'Responses' }),
      render: (slot) => <MarkingLayout actions={slot} panel={<Panel title="Marking"><MarkLine /></Panel>} />,
    },
    {
      // No first and last: few enough pages that every number already shows.
      location: 'Report › History Midterm',
      canvas: true,
      when: { showEdges: ['false'] },
      copy: () => ({ pageCount: 5, defaultPage: 2, label: 'Comments' }),
      render: (slot) => (
        <div style={column()}>
          <PageTitle title="Candidate comments" sub="48 comments, 10 per page" />
          {fieldWidth(640, (
            <div style={column('var(--space-3)')}>
              <List
                items={[
                  { primary: 'Question 4 was clearer than last year.', secondary: 'Candidate 0157' },
                  { primary: 'I ran out of time on the essay.', secondary: 'Candidate 0163' },
                ]}
              />
              <div style={{ display: 'flex', justifyContent: 'center' }}>{slot}</div>
            </div>
          ))}
        </div>
      ),
    },
    {
      // Medium: under a long roster that fills the page, with where you are beside it - which follows the page.
      location: 'Deliver › Tests',
      copy: (_v, s) => ({ pageCount: 13, defaultPage: 1, label: 'Tests pages', onChange: (page: number) => s.set('page', page) }),
      render: (slot, _v, s) => {
        const page = s.get('page', 1)
        return (
          <div style={column('var(--space-4)')}>
            <PageTitle title="Tests" count="242" actions={CREATE_TEST} />
            <TestsTable />
            <div style={{ ...row, justifyContent: 'space-between', gap: 'var(--space-4)' }}>
              {/* The range reads like the Data Grid's footer. */}
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{(page - 1) * 20 + 1} - {Math.min(page * 20, 242)} of 242</span>
              {slot}
            </div>
          </div>
        )
      },
    },
  ],

  menu: [
    {
      // Bottom end: a trigger at the right edge of the page header - the menu opens inward.
      location: 'Deliver › Tests › Algebra Quiz',
      canvas: true,
      when: { placement: ['BottomEnd'] },
      copy: () => ({
        label: 'More',
        'aria-label': 'More actions for Algebra Quiz',
        items: [
          { label: 'Duplicate', icon: 'content_copy' },
          { label: 'Export settings', icon: 'download' },
          { label: '', divider: true },
          { label: 'Delete test', icon: 'delete', danger: true },
        ],
      }),
      render: (slot) => (
        <div style={{ ...column(), minHeight: 300 }}>
          <PageTitle title="Algebra Quiz" aside={<Badge label="Scheduled" intent="Info" size="Small" />} actions={<><Button label="Publish" intent="Primary" />{slot}</>} />
          <Panel title="Test details">
            <div style={{ ...row, gap: 'var(--space-8)' }}>
              <Fact label="Starts" value="19 Sep 2026, 09:00" />
              <Fact label="Candidates" value="24" />
            </div>
          </Panel>
        </div>
      ),
    },
    {
      // Bottom start: at the left of a toolbar, for what to do with the rows selected.
      location: 'Monitor › Algebra Quiz › Candidates',
      demonstrates: ['placement', 'size'],
      copy: () => ({
        label: 'Actions',
        'aria-label': 'Actions for 1 selected candidate',
        items: [
          { label: 'Message', icon: 'chat' },
          { label: 'Add time', icon: 'more_time' },
          { label: 'Pause test', icon: 'pause' },
          { label: '', divider: true },
          { label: 'End test', icon: 'stop_circle', danger: true },
        ],
      }),
      render: (slot) => (
        <div style={{ ...column('var(--space-4)'), minHeight: 320 }}>
          <PageTitle title="Candidates" count="24" />
          <div style={{ ...row, gap: 'var(--space-3)' }}>
            {slot}
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>1 candidate selected</span>
          </div>
          <CandidatesTable selected={['0']} />
        </div>
      ),
    },
  ],

  stepper: [
    {
      // Vertical: what is left before a test can go live, each step with a line of detail.
      location: 'Deliver › Tests › Algebra Quiz',
      canvas: true,
      when: { orientation: ['Vertical'] },
      copy: () => ({
        steps: [
          { label: 'Add questions', description: '24 questions from Algebra Quiz' },
          { label: 'Add candidates', description: '24 candidates, 2 with extra time' },
          { label: 'Set the schedule', description: 'Start time and duration' },
          { label: 'Publish', description: 'Candidates can see the test' },
        ],
      }),
      render: (slot) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
          <div style={{ ...column(), flex: '2 1 300px', minWidth: 0 }}>
            <PageTitle title="Algebra Quiz" aside={<Badge label="Draft" intent="Neutral" size="Small" />} />
            <Panel title="Test details">
              <div style={{ ...row, gap: 'var(--space-8)' }}>
                <Fact label="Questions" value="24" />
                <Fact label="Candidates" value="24" />
              </div>
            </Panel>
          </div>
          <div style={{ flex: '1 1 240px', minWidth: 0 }}>
            <Panel title="Get ready">{slot}</Panel>
          </div>
        </div>
      ),
    },
    {
      // Small: the steps of an import, inside the panel that runs it.
      location: 'Deliver › Tests › Algebra Quiz › Candidates',
      canvas: true,
      when: { size: ['Small'] },
      copy: () => ({ steps: [{ label: 'Upload' }, { label: 'Match columns' }, { label: 'Check' }, { label: 'Import' }] }),
      render: (slot, v) => (
        <div style={column()}>
          <PageTitle title="Import candidates" />
          {fieldWidth(640, (
            <Panel>
              <div style={column('var(--space-5)')}>
                {slot}
                {IMPORT_STEP[Number(v.activeStep)] ?? IMPORT_STEP[0]}
              </div>
            </Panel>
          ))}
        </div>
      ),
    },
    {
      // Horizontal: across the top of the New test flow, over the step it is on.
      location: 'Deliver › Tests › New test',
      canvas: true,
      copy: () => ({ steps: [{ label: 'Setup' }, { label: 'Design' }, { label: 'Settings' }, { label: 'Confirm' }] }),
      render: (slot, v) => (
        <div style={column()}>
          {slot}
          <FormColumn>{NEW_TEST_STEP[Number(v.activeStep)] ?? NEW_TEST_STEP[0]}</FormColumn>
          <SaveBar label={v.activeStep === '3' ? 'Publish' : 'Next'} back={v.activeStep !== '0'} />
        </div>
      ),
    },
  ],

  link: [
    {
      // Disabled: the report opens once marking is complete - and the page says when.
      location: 'Report › History Midterm',
      canvas: true,
      when: { disabled: ['true'] },
      copy: () => ({ label: 'Open the results report', href: '#' }),
      render: (slot) => (
        <div style={column()}>
          <PageTitle title="Reports" />
          <Panel>
            <div style={column('var(--space-2)')}>
              {slot}
              <p style={caption}>Available when marking is complete. 112 of 179 marked.</p>
            </div>
          </Panel>
        </div>
      ),
    },
    {
      // External: a download from the browser's own site, opened in a new tab.
      location: 'Deliver › Tests › Algebra Quiz › Settings',
      canvas: true,
      when: { external: ['true'] },
      copy: () => ({ label: 'Download Safe Exam Browser', href: 'https://safeexambrowser.org' }),
      render: (slot) => (
        <SettingsForm>
          <Panel title="Security">
            <div style={column('var(--space-2)')}>
              <Checkbox label="Require Safe Exam Browser" defaultChecked />
              <Indented>
                <p style={caption}>Candidates install it before the test.</p>
                <div>{slot}</div>
              </Indented>
            </div>
          </Panel>
        </SettingsForm>
      ),
    },
    {
      // Muted: secondary links at the foot of the page, which should not compete with it.
      location: 'Home',
      canvas: true,
      when: { intent: ['Muted'] },
      demonstrates: ['intent'],
      copy: () => ({ label: 'Accessibility statement', href: '#' }),
      render: (slot, v) => (
        <div style={column()}>
          <PageTitle title="Continue where you left off" />
          <CardGrid>
            <Card title="Algebra Quiz" body="Live now. 18 of 24 candidates have started." />
            <Card title="History Midterm" body="Marking. 112 of 179 scripts marked." />
          </CardGrid>
          <div style={{ ...row, gap: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: hairline }}>
            <Link href="#" intent="Muted" size={v.size as 'Small' | 'Medium'} underline={v.underline as 'Hover'} onClick={stay}>Help centre</Link>
            {slot}
            <Link href="#" intent="Muted" size={v.size as 'Small' | 'Medium'} underline={v.underline as 'Hover'} onClick={stay}>Privacy</Link>
          </div>
        </div>
      ),
    },
    {
      // Always underlined: a link inside a sentence, where colour alone would not set it apart.
      location: 'Grade › History Midterm › Candidate 0142',
      canvas: true,
      when: { underline: ['Always'] },
      copy: () => ({ label: 'how anonymous marking works', href: '#' }),
      render: (slot, v) => (
        <MarkingLayout
          panel={
            <Panel title="Marking">
              <div style={column('var(--space-4)')}>
                <MarkLine />
                {/* The sentence is the link's size, so the link reads as part of it. */}
                <p style={{ ...body, fontSize: v.size === 'Small' ? 14 : 16, lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                  Names are hidden on this test. Read {slot} before you contact the exam office.
                </p>
              </div>
            </Panel>
          }
        />
      ),
    },
    {
      // Small: a title in a roster, at the table's 14px.
      location: 'Deliver › Tests',
      when: { size: ['Small'] },
      copy: () => ({ label: 'Algebra Quiz', href: '#' }),
      render: (slot) => (
        <div style={column('var(--space-4)')}>
          <PageTitle title="Tests" count="242" actions={CREATE_TEST} />
          <ToolbarWell>{QUICK_FILTERS}</ToolbarWell>
          <TestsTable title={(i) => (i === 0 ? slot : undefined)} />
        </div>
      ),
    },
    {
      // No underline: the items of a side navigation - a test's settings pages -
      // where the layout already says they are links. The page you are on is
      // plain text, marked as the current one.
      location: 'Deliver › Tests › Algebra Quiz › Settings',
      canvas: true,
      when: { underline: ['None'] },
      copy: () => ({ label: 'Security', href: '#' }),
      render: (slot, v) => {
        // The other items follow the playground's intent and size, as a list would.
        const item = (label: string) => (
          <Link href="#" onClick={stay} underline="None" intent={v.intent as 'Default' | 'Muted'} size={v.size as 'Small' | 'Medium'}>{label}</Link>
        )
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 'var(--space-8)' }}>
            <nav aria-label="Settings" style={{ ...column('var(--space-3)'), flex: '0 0 160px', paddingTop: 'var(--space-2)' }}>
              <span aria-current="page" style={{ ...body, fontSize: v.size === 'Small' ? 14 : 16, fontWeight: 600 }}>General</span>
              {slot}
              {item('Results')}
              {item('Exam day')}
            </nav>
            <div style={{ ...column(), flex: '1 1 320px', minWidth: 0 }}>
              <PageTitle title="General" />
              <Panel>
                <div style={column('var(--space-4)')}>
                  {fieldWidth(320, <TextInput label="Test name" defaultValue="Algebra Quiz" />)}
                  <Checkbox label="Allow late submissions" defaultChecked />
                </div>
              </Panel>
            </div>
          </div>
        )
      },
    },
    {
      // A link on its own line, under what it leads to more of.
      location: 'Deliver › Tests › Algebra Quiz',
      canvas: true,
      copy: () => ({ label: 'Manage candidates', href: '#' }),
      render: (slot) => (
        <div style={column()}>
          <PageTitle title="Algebra Quiz" aside={<Badge label="Scheduled" intent="Info" size="Small" />} actions={<Button label="Publish" intent="Primary" />} />
          <Tiles>
            <Panel title="Candidates">
              <div style={column('var(--space-3)')}>
                <span style={body}>24 registered, 2 with extra time.</span>
                <div>{slot}</div>
              </div>
            </Panel>
            <Panel title="Schedule">
              <span style={body}>Starts 19 Sep 2026 at 09:00.</span>
            </Panel>
          </Tiles>
        </div>
      ),
    },
  ],
}

// ---------------------------------------------------------------------------
// Product chrome
// ---------------------------------------------------------------------------

const AREAS = ['Author', 'Deliver', 'Monitor', 'Grade', 'Report']
const MENUS = new Set(['Author', 'Deliver', 'Monitor'])
const navIcon = (name: string) => (
  <span className="material-symbols-outlined" style={{ fontSize: 20, opacity: 0.8 }}>{name}</span>
)

/**
 * Inspera's global nav, scaled to the frame: home, the New test split
 * button, the areas with the current one underlined, and the utilities. A
 * picture of the chrome, not the chrome - hidden from assistive tech and out
 * of the tab order, so the only live controls in a scene are the scene's.
 */
function ProductNav({ area }: { area?: string }) {
  return (
    <div
      aria-hidden
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        height: 44,
        padding: '0 var(--space-3)',
        background: 'var(--blue-900)',
        color: 'var(--white)',
        fontSize: 13,
        fontWeight: 500,
        borderRadius: 'calc(var(--radius-lg) - 1px) calc(var(--radius-lg) - 1px) 0 0',
        overflow: 'hidden',
      }}
    >
      {navIcon('home')}
      <span style={{ display: 'inline-flex', height: 28, borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0, background: 'var(--primary)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0 var(--space-3)', borderRight: '1px solid color-mix(in srgb, var(--white) 20%, transparent)' }}>New test</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0 var(--space-1)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>expand_more</span>
        </span>
      </span>
      {/* Areas clip rather than wrap on a narrow frame, as the real bar does.
          `safe` keeps the first areas in view when they no longer fit. */}
      <div style={{ flex: 1, minWidth: 0, alignSelf: 'stretch', display: 'flex', justifyContent: 'safe center', overflow: 'hidden' }}>
        {AREAS.map((a) => {
          const current = a === area
          return (
            <span
              key={a}
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2,
                padding: '0 var(--space-3)',
                flexShrink: 0,
                color: current ? 'var(--white)' : 'color-mix(in srgb, var(--white) 72%, transparent)',
                background: current ? 'color-mix(in srgb, var(--white) 10%, transparent)' : undefined,
              }}
            >
              {a}
              {MENUS.has(a) && <span className="material-symbols-outlined" style={{ fontSize: 16, opacity: 0.7 }}>expand_more</span>}
              {current && <span style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, background: 'var(--white)', borderRadius: '2px 2px 0 0' }} />}
            </span>
          )
        })}
      </div>
      <span style={{ display: 'inline-flex', gap: 'var(--space-3)', flexShrink: 0 }}>
        {navIcon('search')}
        {navIcon('notifications')}
        {navIcon('help')}
        {navIcon('account_circle')}
      </span>
    </div>
  )
}

/** The inner pages' location bar: home, then the path below the area. */
function CrumbBar({ crumbs }: { crumbs: string[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minHeight: 40, padding: '0 var(--scene-pad)', background: 'var(--surface)', borderBottom: hairline }}>
      <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--gray-700)' }} aria-hidden>home</span>
      <Breadcrumb items={crumbs} size="Small" label="Location" />
    </div>
  )
}

/** Splits a location into the nav area that lights up and the breadcrumb below it. */
function placeOf(location: string): { area?: string; crumbs: string[] } {
  const [first, ...rest] = location.split(' › ')
  return { area: AREAS.includes(first) ? first : undefined, crumbs: rest.length >= 2 ? rest : [] }
}

/** The scene for the current control values: the first match, else the fallback. */
export function sceneFor(slug: string, v: Record<string, string>): Scene | undefined {
  const scenes = contexts[slug]
  if (!scenes) return undefined
  const excluded = (s: Scene) => Object.entries(s.unless ?? {}).some(([k, values]) => values.includes(v[k]))
  return (
    scenes.find((s) => s.when && Object.entries(s.when).every(([k, values]) => values.includes(v[k])) && !excluded(s)) ??
    scenes.find((s) => !s.when)
  )
}

/** What the current scene rules out (`Scene.locks`), for the props rail in context. */
export function sceneLocks(slug: string, v: Record<string, string>): Record<string, Lock> {
  return sceneFor(slug, v)?.locks?.(v) ?? {}
}

/**
 * Why the current values fit: the `usage.variants` lines they match, in the
 * order components.ts gives them, for the controls the scene demonstrates.
 * Booleans are named by their control label: "Read only" when on, "Visible
 * label off" when off.
 */
export function variantNotes(slug: string, v: Record<string, string>): { label: string; when: string }[] {
  const controls = registry[slug]?.controls ?? {}
  const shows = demonstrated(slug, v)
  // A control held by a lock is not a choice here - an action's intent with no
  // action - so it gets no line.
  const held = { ...locksFor(slug, v), ...sceneLocks(slug, v) }
  const name = (prop: string, value: string) =>
    value === 'true' ? controls[prop].label : value === 'false' ? `${controls[prop].label} off` : value
  return (components[slug]?.usage.variants ?? [])
    .filter((g) => controls[g.prop] && v[g.prop] === g.value && shows.has(g.prop) && !held[g.prop])
    .map((g) => ({ label: name(g.prop, g.value), when: g.when }))
}

/** The controls the current scene was built to show - see `Scene.demonstrates`. */
function demonstrated(slug: string, v: Record<string, string>): Set<string> {
  const scene = sceneFor(slug, v)
  if (!scene) return new Set()
  if (scene.demonstrates) return new Set(scene.demonstrates)
  if (scene.when) return new Set(Object.keys(scene.when))
  const defaults = registry[slug]?.defaults ?? {}
  return new Set(Object.keys(defaults).filter((k) => v[k] === defaults[k]))
}

// ---------------------------------------------------------------------------
// The frame
// ---------------------------------------------------------------------------

interface Box { x: number; y: number; w: number; h: number }

/**
 * The slot's painted extent: its elements and anything they spill, such as an
 * open panel. It stops descending at an element that clips its overflow - the
 * options of a scrolled list lie outside what is visible.
 */
function measure(target: HTMLElement, origin: DOMRect): Box | null {
  let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity
  const visit = (el: Element) => {
    const box = el.getBoundingClientRect()
    if (box.width > 0 && box.height > 0) {
      l = Math.min(l, box.left); t = Math.min(t, box.top)
      r = Math.max(r, box.right); b = Math.max(b, box.bottom)
    }
    const cs = getComputedStyle(el)
    if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') return
    for (const child of el.children) visit(child)
  }
  for (const child of target.children) visit(child)
  if (l === Infinity) return null
  return { x: l - origin.left, y: t - origin.top, w: r - l, h: b - t }
}

/** How long a highlight lasts: two gentle breaths, under two seconds, fading out at the end. */
const BREATH_MS = 900
const BREATHS = 2
const HIGHLIGHT_MS = BREATH_MS * BREATHS

/** The product nav's height, and the breadcrumb bar's under it. */
const NAV_H = 44
const CRUMBS_H = 40

/**
 * Where an overlay's box sits inside the screen. Toasts along the top start
 * below the product nav and breadcrumb bar (`top`), as in the product, so they
 * never cover the navigation.
 */
const placeStyle = (place: OverlayPlace, top: number): CSSProperties => {
  switch (place) {
    // `safe` keeps a panel taller than the screen pinned to the top, not cut off at both ends.
    case 'Center': return { inset: 0, display: 'flex', alignItems: 'safe center', justifyContent: 'center', padding: 'var(--scene-pad)' }
    case 'Top': return { inset: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '72px var(--scene-pad) var(--scene-pad)' }
    case 'Left': return { top: 0, bottom: 0, left: 0, display: 'flex', maxWidth: '100%' }
    case 'Right': return { top: 0, bottom: 0, right: 0, display: 'flex', maxWidth: '100%' }
    case 'Bottom': return { inset: 0, display: 'flex', alignItems: 'flex-end' }
    case 'TopLeft': return { top: top + 16, left: 24, right: 24, display: 'flex', justifyContent: 'flex-start' }
    case 'TopCenter': return { top: top + 16, left: 24, right: 24, display: 'flex', justifyContent: 'center' }
    case 'TopRight': return { top: top + 16, left: 24, right: 24, display: 'flex', justifyContent: 'flex-end' }
    case 'BottomLeft': return { bottom: 24, left: 24, right: 24, display: 'flex', justifyContent: 'flex-start' }
    case 'BottomCenter': return { bottom: 24, left: 24, right: 24, display: 'flex', justifyContent: 'center' }
    case 'BottomRight': return { bottom: 24, left: 24, right: 24, display: 'flex', justifyContent: 'flex-end' }
  }
}
/** Panels docked to an edge take the screen's height (or width) - there is nothing to grow for. */
const DOCKED = new Set<OverlayPlace>(['Left', 'Right', 'Bottom'])

/**
 * A slice of a screen with the component in it.
 *
 * The component is highlighted for under two seconds only when `pulse` changes
 * (the Highlight button): the rest of the scene washes back and two boxes breathe
 * around the component, then everything fades and the scene is left as it was.
 * The highlight is an overlay measured from the slot, so it never moves the
 * scene's layout; the screen only grows to hold a panel the component opens
 * past it, or a dialog taller than the page beneath it.
 */
export function SceneFrame({
  slug, name, values, pulse, dismissed, onDismiss,
}: {
  slug: string
  name: string
  values: Record<string, string>
  /** Bumped by the Highlight button; 0 means it has not been pressed. */
  pulse: number
  /** The dialog, drawer, toast or alert was closed in the scene; Show again brings it back. */
  dismissed: boolean
  onDismiss: () => void
}) {
  const scene = sceneFor(slug, values)
  // The scene remounts per combination, so starting values (defaultValue)
  // apply every time a control moves. The frame itself stays mounted, so a
  // highlight runs once per press, not again on every control change.
  const combination = JSON.stringify(values)
  const overlay = scene?.overlay?.(values)
  const docked = overlay ? DOCKED.has(overlay.place) : false
  const screen = useRef<HTMLDivElement>(null)
  // The screen bounds the floating panels inside it (OverlayBoundary): a menu
  // or a pinned tooltip near its edge flips and shifts to stay inside.
  const [screenEl, setScreenEl] = useState<HTMLDivElement | null>(null)
  // Stable, so React hands it the element once rather than on every render.
  const screenRef = useCallback((node: HTMLDivElement | null) => {
    screen.current = node
    setScreenEl(node)
  }, [])
  const slotRef = useRef<HTMLSpanElement>(null)
  const [box, setBox] = useState<Box | null>(null)
  // Extra room under the scene for whatever the component spills past it, such
  // as an open panel - so the panel stays inside the frame, highlight and all.
  const [spill, setSpill] = useState(0)
  const spillRef = useRef(0)
  // Whether the scene has a footer to take that room above itself.
  const [footer, setFooter] = useState(false)
  const [active, setActive] = useState(false)
  // Below 640px the page padding drops from 24px to 16px, as DESIGN.md has it for small screens.
  const [narrow, setNarrow] = useState(false)
  const wash = useRef<HTMLDivElement>(null)
  const breath = useRef<HTMLDivElement>(null)
  const ripple = useRef<HTMLDivElement>(null)

  // What people did in the scene. It belongs to one combination: read under
  // another, it starts again from the playground's values.
  const [kept, setKept] = useState<{ combination: string; data: Record<string, unknown> }>({ combination, data: {} })
  const data = kept.combination === combination ? kept.data : {}
  const state: SceneState = {
    get: <T,>(key: string, initial: T) => (key in data ? (data[key] as T) : initial),
    set: (key, value) =>
      setKept((prev) => ({ combination, data: { ...(prev.combination === combination ? prev.data : {}), [key]: value } })),
    dismiss: onDismiss,
  }

  useLayoutEffect(() => {
    const el = screen.current
    const target = slotRef.current
    if (!el) return
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const origin = el.getBoundingClientRect()
        setNarrow(origin.width < 640)
        const footerEl = el.querySelector('[data-scene-footer]')
        setFooter(Boolean(footerEl))
        const next = target ? measure(target, origin) : null
        // A component inside the footer gets no room: the room goes above the
        // footer and would move it down with it, asking for more every time.
        const inFooter = Boolean(footerEl && target && footerEl.contains(target))
        // An open panel has to clear the footer when there is one, else the
        // screen's foot - each measured without the room already added, so
        // adding it cannot feed back into the next measurement.
        const limit = footerEl && !inFooter
          ? footerEl.getBoundingClientRect().top - origin.top - spillRef.current
          : origin.height - spillRef.current
        const room = next && !docked && !inFooter ? Math.max(0, Math.ceil(next.y + next.h + 16 - limit)) : 0
        if (room !== spillRef.current) {
          spillRef.current = room
          setSpill(room)
        }
        setBox((prev) =>
          prev && next && Math.abs(prev.x - next.x) < 0.5 && Math.abs(prev.y - next.y) < 0.5 &&
          Math.abs(prev.w - next.w) < 0.5 && Math.abs(prev.h - next.h) < 0.5 ? prev : next)
      })
    }
    update()
    // Size changes and panels opening or closing inside the component.
    const ro = new ResizeObserver(update)
    ro.observe(el)
    const mo = new MutationObserver(update)
    mo.observe(target ?? el, { subtree: true, childList: true, attributes: true })
    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      mo.disconnect()
    }
  }, [scene, combination, docked, dismissed])

  // The only thing that starts a highlight is the Highlight button. Each press
  // restarts it; it ends on its own.
  const [run, setRun] = useState(0)
  useEffect(() => {
    if (pulse) setRun((n) => n + 1)
  }, [pulse])
  useEffect(() => {
    if (!run) return
    setActive(true)
    const done = setTimeout(() => setActive(false), HIGHLIGHT_MS)
    return () => clearTimeout(done)
  }, [run])
  // The first measurement can land after the highlight starts; the motion waits for it.
  const ready = box !== null

  // The motion. Web Animations rather than CSS keyframes, so the effect lives
  // here with the frame and needs no stylesheet. Reduced motion keeps the
  // wash and a still ring - the cue - and drops the breathing.
  useEffect(() => {
    if (!active || !ready) return
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const running = [
      wash.current?.animate(
        [{ opacity: 0 }, { opacity: 1, offset: 0.1 }, { opacity: 1, offset: 0.6 }, { opacity: 0 }],
        { duration: HIGHLIGHT_MS, easing: 'ease', fill: 'forwards' },
      ),
      ...(still
        ? []
        : [
            breath.current?.animate(
              [{ outlineOffset: '0px' }, { outlineOffset: '3px' }, { outlineOffset: '0px' }],
              { duration: BREATH_MS, iterations: BREATHS, easing: 'ease-in-out' },
            ),
            ripple.current?.animate(
              [{ outlineOffset: '0px', opacity: 0.3 }, { outlineOffset: '12px', opacity: 0 }],
              { duration: BREATH_MS, iterations: BREATHS, easing: 'ease-out' },
            ),
          ]),
    ]
    return () => running.forEach((a) => a?.cancel())
  }, [active, run, ready])

  if (!scene) return null
  const copy = scene.copy?.(values, state)
  const live = dismissed
    ? null
    : scene.slot
      ? scene.slot(propsFor(slug, values, copy), values, state)
      : scene.still ? renderStill(slug, values, copy) : renderLive(slug, values, copy)
  const slot = live === null ? null : <span ref={slotRef} data-scene-slot style={{ display: 'contents' }}>{live}</span>
  const RING = 6
  const place = placeOf(scene.location)
  const chromeTop = scene.bare ? 0 : NAV_H + (place.crumbs.length > 0 ? CRUMBS_H : 0)
  const ring: CSSProperties = { position: 'absolute', inset: 0, borderRadius: 'inherit', outline: '1.5px solid color-mix(in srgb, var(--primary) 65%, transparent)', outlineOffset: 0 }
  const inner = 'calc(var(--radius-lg) - 1px)'
  // The room for an open panel: above the footer when the scene has one, else under the page.
  const footerRoom = footer ? spill : 0

  return (
    <OverlayBoundary.Provider value={screenEl}>
      <div
        ref={screenRef}
        role="group"
        aria-label={`${name} in context: ${scene.location}`}
        style={{
          '--scene-pad': narrow ? 'var(--space-4)' : 'var(--space-6)',
          position: 'relative',
          // The overlay and the highlight stack inside the screen, never over the docs around it.
          isolation: 'isolate',
          // A panel that opens sideways past a narrow screen is cut at its edge rather than
          // scrolling the docs page; one that opens downward still spills, and the screen grows.
          overflowX: 'clip',
          width: '100%',
          background: 'var(--surface)',
          border: 'var(--border-width-default) solid var(--border-strong)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-200)',
          textAlign: 'left',
        } as CSSProperties}
      >
        {!scene.bare && <ProductNav area={place.area} />}
        {!scene.bare && place.crumbs.length > 0 && <CrumbBar crumbs={place.crumbs} />}
        <div
          style={{
            position: 'relative',
            isolation: 'isolate',
            padding: 'var(--scene-pad)',
            paddingBottom: `calc(var(--scene-pad) + ${spill - footerRoom}px)`,
            background: scene.canvas ? 'var(--gray-100)' : 'var(--surface)',
            borderRadius: scene.bare ? inner : `0 0 ${inner} ${inner}`,
          }}
        >
          <FooterRoom.Provider value={footerRoom}>
            <Fragment key={combination}>{scene.render(overlay ? null : slot, values, state)}</Fragment>
          </FooterRoom.Provider>
        </div>
        {overlay && slot && (
          <div
            // A click on the scrim itself closes a modal, as in the product.
            onClick={overlay.scrim ? (e) => { if (e.target === e.currentTarget) onDismiss() } : undefined}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              overflow: 'hidden',
              borderRadius: inner,
              background: overlay.scrim ? 'var(--scrim)' : undefined,
              // A toast leaves the page under it working; a modal blocks it.
              pointerEvents: overlay.scrim ? 'auto' : 'none',
            }}
          >
            <div
              onClick={overlay.scrim ? (e) => { if (e.target === e.currentTarget) onDismiss() } : undefined}
              style={{ position: 'absolute', ...placeStyle(overlay.place, chromeTop + (overlay.below ?? 0)), pointerEvents: 'auto' }}
            >
              <Fragment key={combination}>{slot}</Fragment>
            </div>
          </div>
        )}
        {active && box && slot && (
          <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 2, borderRadius: inner }}>
            <div
              ref={wash}
              style={{
                position: 'absolute',
                left: box.x - RING,
                top: box.y - RING,
                width: box.w + RING * 2,
                height: box.h + RING * 2,
                borderRadius: 'var(--radius-md)',
                opacity: 0,
                // Washes back everything outside the box.
                boxShadow: '0 0 0 100vmax color-mix(in srgb, var(--surface) 20%, transparent)',
              }}
            >
              <div ref={breath} style={ring} />
              <div ref={ripple} style={{ ...ring, opacity: 0 }} />
            </div>
          </div>
        )}
      </div>
    </OverlayBoundary.Provider>
  )
}
