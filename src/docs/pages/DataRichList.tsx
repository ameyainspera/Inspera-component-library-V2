import { type CSSProperties, type ReactNode, useId, useState } from 'react'
import {
  Badge, Breadcrumb, Button, Card, Checkbox, DataGrid, DatePicker, Dialog, EmptyState,
  NumberInput, Progress, SegmentedControl, Select, Tag, TextInput,
  type BadgeIntent, type DataGridColumn, type DataGridRow, type DataGridSort,
} from '../../components/inspera'

/**
 * Data-rich list - a starting point for any screen built around a large set of
 * records, not a copy of a live Inspera screen. Search and a status filter sit
 * in the toolbar; an Advanced search dialog builds AND-joined filters (pick
 * several values, a number threshold or a date); active filters show as
 * removable tags above the results. The grid sorts on every column and
 * switches between three sets of figures, and the same rows can show as cards.
 * Swap the sample data and the column sets for your own records.
 */

/* --- Sample data --------------------------------------------------------- */

type Status = 'Draft' | 'Scheduled' | 'Live' | 'Marking' | 'Completed'
type Focus = 'delivery' | 'marking' | 'quality'
type View = 'Table' | 'Cards'

interface Assessment {
  id: string
  owner: string
  labels: string[]
  name: string
  subject: string
  status: Status
  /** Test date, YYYY-MM-DD. */
  date: string
  /** Marking deadline, YYYY-MM-DD. */
  due: string
  reg: number
  sub: number
  marked: number
  items: number
  avg: number | null
  pass: number | null
  disc: number | null
  flagged: number | null
  /** Setup problems still open before the test can run. */
  issues: number
}

const DATA: Assessment[] = [
  { id: 'MAT1001', owner: 'Ingrid Solberg', labels: ['High stakes'], name: 'Calculus I', subject: 'Mathematics', status: 'Completed', date: '2026-09-14', due: '2026-10-05', reg: 248, sub: 241, marked: 241, items: 24, avg: 68, pass: 84, disc: 0.41, flagged: 1, issues: 0 },
  { id: 'BIO2010', owner: 'Jonas Berg', labels: ['Accommodations'], name: 'Cell biology', subject: 'Biology', status: 'Completed', date: '2026-09-18', due: '2026-10-09', reg: 132, sub: 128, marked: 128, items: 40, avg: 71, pass: 88, disc: 0.36, flagged: 2, issues: 0 },
  { id: 'HIS1500', owner: 'Amira Haddad', labels: ['Paper-based'], name: 'Modern European history', subject: 'History', status: 'Marking', date: '2026-09-25', due: '2026-10-16', reg: 186, sub: 179, marked: 112, items: 6, avg: 63, pass: 79, disc: 0.29, flagged: 0, issues: 0 },
  { id: 'CHE1100', owner: 'Ingrid Solberg', labels: ['High stakes', 'Accommodations'], name: 'General chemistry', subject: 'Chemistry', status: 'Marking', date: '2026-09-29', due: '2026-10-20', reg: 214, sub: 206, marked: 58, items: 32, avg: 52, pass: 66, disc: 0.17, flagged: 5, issues: 0 },
  { id: 'ECO2200', owner: 'Jonas Berg', labels: [], name: 'Microeconomics', subject: 'Economics', status: 'Marking', date: '2026-10-02', due: '2026-10-23', reg: 158, sub: 150, marked: 31, items: 28, avg: 66, pass: 81, disc: 0.33, flagged: 1, issues: 0 },
  { id: 'PSY1010', owner: 'Amira Haddad', labels: ['Shared exam', 'Accommodations'], name: 'Introduction to psychology', subject: 'Psychology', status: 'Live', date: '2026-10-06', due: '2026-10-27', reg: 302, sub: 187, marked: 0, items: 50, avg: null, pass: null, disc: null, flagged: null, issues: 0 },
  { id: 'LAW3100', owner: 'Amira Haddad', labels: ['Paper-based'], name: 'Contract law', subject: 'Law', status: 'Live', date: '2026-10-06', due: '2026-10-27', reg: 96, sub: 12, marked: 0, items: 4, avg: null, pass: null, disc: null, flagged: null, issues: 0 },
  { id: 'PHY1200', owner: 'Ingrid Solberg', labels: ['High stakes'], name: 'Mechanics', subject: 'Physics', status: 'Scheduled', date: '2026-10-13', due: '2026-11-03', reg: 176, sub: 0, marked: 0, items: 20, avg: null, pass: null, disc: null, flagged: null, issues: 0 },
  { id: 'INF1000', owner: 'Jonas Berg', labels: ['Resit', 'Shared exam'], name: 'Programming fundamentals', subject: 'Informatics', status: 'Scheduled', date: '2026-10-20', due: '2026-11-10', reg: 340, sub: 0, marked: 0, items: 18, avg: null, pass: null, disc: null, flagged: null, issues: 2 },
  { id: 'ENG2300', owner: 'Amira Haddad', labels: [], name: 'Academic writing', subject: 'English', status: 'Scheduled', date: '2026-10-27', due: '2026-11-17', reg: 120, sub: 0, marked: 0, items: 3, avg: null, pass: null, disc: null, flagged: null, issues: 1 },
  { id: 'STA2100', owner: 'Ingrid Solberg', labels: ['Resit'], name: 'Statistics II', subject: 'Statistics', status: 'Draft', date: '2026-11-09', due: '2026-11-30', reg: 88, sub: 0, marked: 0, items: 22, avg: null, pass: null, disc: null, flagged: null, issues: 3 },
  { id: 'NOR1100', owner: 'Jonas Berg', labels: [], name: 'Norwegian grammar', subject: 'Norwegian', status: 'Draft', date: '2026-11-16', due: '2026-12-07', reg: 0, sub: 0, marked: 0, items: 15, avg: null, pass: null, disc: null, flagged: null, issues: 4 },
]

const STATUSES: Status[] = ['Draft', 'Scheduled', 'Live', 'Marking', 'Completed']
const STATUS_INTENT: Record<Status, BadgeIntent> = {
  Draft: 'Neutral', Scheduled: 'Info', Live: 'Success', Marking: 'Info', Completed: 'Neutral',
}

/* --- Formatting ---------------------------------------------------------- */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const fmtDate = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${MONTHS[m - 1]} ${y}` }
const fmtShort = (iso: string) => { const [, m, d] = iso.split('-').map(Number); return `${d} ${MONTHS[m - 1]}` }
const fmtInt = (n: number) => n.toLocaleString('en-GB')
const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0)
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`
const preDelivery = (r: Assessment) => r.status === 'Draft' || r.status === 'Scheduled'
const markable = (r: Assessment) => r.status === 'Marking' || r.status === 'Completed'

/** Figures line up in columns. */
const NUM: CSSProperties = { fontVariantNumeric: 'tabular-nums' }
const MUTED = 'var(--muted-foreground)'

const txt = (text: string | number, muted = false): ReactNode => (
  <span style={{ ...NUM, color: muted ? MUTED : 'var(--text-primary)' }}>{text}</span>
)

/** A progress bar with its count beside it - Progress itself can only show a percentage. */
const meter = (done: number, total: number, what: string): ReactNode => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 200 }}>
    <Progress label={`${what} ${done} of ${total}`} value={pct(done, total)} intent={done === total ? 'Success' : 'Primary'} />
    <span style={{ ...NUM, fontSize: 14, minWidth: 88, textAlign: 'right' }}>
      {done === total ? `All ${fmtInt(total)}` : `${fmtInt(done)} of ${fmtInt(total)}`}
    </span>
  </div>
)

/** Wraps every match of `q` in a highlight. Weight as well as tint, so it is not colour alone. */
function highlight(text: string, q: string): ReactNode {
  if (!q) return text
  const out: ReactNode[] = []
  const low = text.toLowerCase()
  let i = 0
  for (let j = low.indexOf(q); j !== -1; j = low.indexOf(q, i)) {
    if (j > i) out.push(text.slice(i, j))
    out.push(
      <mark key={j} style={{ background: 'var(--yellow-300)', color: 'inherit', fontWeight: 600, borderRadius: 'var(--radius-xs)', padding: '0 1px' }}>
        {text.slice(j, j + q.length)}
      </mark>,
    )
    i = j + q.length
  }
  if (i < text.length) out.push(text.slice(i))
  return out
}

/* --- Columns ------------------------------------------------------------- */

interface Column {
  key: string
  header: string
  align?: 'left' | 'right'
  sort: (r: Assessment) => string | number
  cell: (r: Assessment) => ReactNode
}

const NAME_COL: Omit<Column, 'cell'> = { key: 'name', header: 'Assessment', sort: (r) => r.name.toLowerCase() }
const STATUS_COL: Omit<Column, 'cell'> = { key: 'status', header: 'Status', sort: (r) => STATUSES.indexOf(r.status) }

/** The figures each "Show figures for" choice adds after the name and status. */
const FIGURES: Record<Focus, Column[]> = {
  delivery: [
    { key: 'date', header: 'Date', sort: (r) => r.date, cell: (r) => txt(fmtDate(r.date)) },
    { key: 'reg', header: 'Registered', align: 'right', sort: (r) => r.reg, cell: (r) => (r.reg ? txt(fmtInt(r.reg)) : txt('None yet', true)) },
    {
      key: 'sub', header: 'Submitted', align: 'right',
      sort: (r) => (r.reg && !preDelivery(r) ? r.sub / r.reg : -1),
      cell: (r) => (preDelivery(r) ? txt('Not open', true) : txt(`${fmtInt(r.sub)} (${pct(r.sub, r.reg)}%)`)),
    },
    {
      key: 'setup', header: 'Setup',
      sort: (r) => (preDelivery(r) ? r.issues : -1),
      cell: (r) => {
        if (!preDelivery(r)) return txt('Delivered', true)
        return r.issues ? <Badge label={plural(r.issues, 'issue')} intent="Warning" /> : <Badge label="Ready" intent="Success" />
      },
    },
  ],
  marking: [
    { key: 'sub', header: 'Submitted', align: 'right', sort: (r) => (preDelivery(r) ? -1 : r.sub), cell: (r) => (preDelivery(r) ? txt('-', true) : txt(fmtInt(r.sub))) },
    {
      key: 'progress', header: 'Marking progress',
      sort: (r) => (r.sub && markable(r) ? r.marked / r.sub : -1),
      cell: (r) => (markable(r) ? meter(r.marked, r.sub, 'Marked') : txt(r.status === 'Live' ? 'Opens after the test' : '-', true)),
    },
    { key: 'avg', header: 'Average score', align: 'right', sort: (r) => r.avg ?? -1, cell: (r) => (r.avg == null ? txt('-', true) : txt(`${r.avg}%`)) },
    {
      key: 'due', header: 'Marking due',
      sort: (r) => (r.status === 'Completed' ? '9999' : r.due),
      cell: (r) => (r.status === 'Completed' ? txt('Done', true) : txt(fmtDate(r.due), preDelivery(r))),
    },
  ],
  quality: [
    { key: 'items', header: 'Items', align: 'right', sort: (r) => r.items, cell: (r) => txt(r.items) },
    { key: 'avg', header: 'Average score', align: 'right', sort: (r) => r.avg ?? -1, cell: (r) => (r.avg == null ? txt('No results yet', true) : txt(`${r.avg}%`)) },
    { key: 'pass', header: 'Pass rate', align: 'right', sort: (r) => r.pass ?? -1, cell: (r) => (r.pass == null ? txt('-', true) : txt(`${r.pass}%`)) },
    {
      key: 'disc', header: 'Discrimination', align: 'right',
      sort: (r) => r.disc ?? -1,
      cell: (r) => {
        if (r.disc == null) return txt('-', true)
        return r.disc < 0.2 ? <Badge label={`${r.disc.toFixed(2)} low`} intent="Warning" /> : txt(r.disc.toFixed(2))
      },
    },
    {
      key: 'flagged', header: 'Items to review',
      sort: (r) => r.flagged ?? -1,
      cell: (r) => {
        if (r.flagged == null) return txt('-', true)
        return r.flagged ? <Badge label={`${r.flagged} to review`} intent="Warning" /> : txt('None', true)
      },
    },
  ],
}

const CAPTIONS: Record<Focus, string | undefined> = {
  delivery: undefined,
  marking: 'Marking progress. Average score covers marked scripts only.',
  quality: 'Item quality from marked scripts. Discrimination: how well a test separates stronger from weaker candidates (0.20 or higher is good).',
}

const FOCUS_OPTIONS = [
  { value: 'delivery', label: 'Delivery and setup' },
  { value: 'marking', label: 'Marking progress' },
  { value: 'quality', label: 'Item quality' },
]

/* --- Advanced search ----------------------------------------------------- */

type FieldKey = 'owner' | 'subject' | 'status' | 'labels' | 'reg' | 'avg' | 'date'
type Op = 'is' | 'isnot' | 'gte' | 'lte' | 'after' | 'before'

interface FieldDef {
  label: string
  type: 'enum' | 'num' | 'date'
  /** Enum fields: the record can hold several values, so "All" is meaningful. */
  multi?: boolean
  options?: string[]
  suffix?: string
  get: (r: Assessment) => string | string[] | number | null
}

const FIELDS: Record<FieldKey, FieldDef> = {
  owner: { label: 'Created by', type: 'enum', options: ['Amira Haddad', 'Ingrid Solberg', 'Jonas Berg'], get: (r) => r.owner },
  subject: { label: 'Subject', type: 'enum', options: [...new Set(DATA.map((r) => r.subject))].sort(), get: (r) => r.subject },
  status: { label: 'Status', type: 'enum', options: STATUSES, get: (r) => r.status },
  labels: { label: 'Label', type: 'enum', multi: true, options: ['Accommodations', 'High stakes', 'Paper-based', 'Resit', 'Shared exam'], get: (r) => r.labels },
  reg: { label: 'Registered candidates', type: 'num', suffix: 'candidates', get: (r) => r.reg },
  avg: { label: 'Average score', type: 'num', suffix: '%', get: (r) => r.avg },
  date: { label: 'Date', type: 'date', get: (r) => r.date },
}
const FIELD_OPTIONS = (Object.keys(FIELDS) as FieldKey[]).map((k) => ({ value: k, label: FIELDS[k].label }))

const OP_LABEL: Record<Op, string> = { is: 'is', isnot: 'is not', gte: 'is at least', lte: 'is at most', after: 'is on or after', before: 'is on or before' }
const OPS: Record<FieldDef['type'], Op[]> = { enum: ['is', 'isnot'], num: ['gte', 'lte'], date: ['after', 'before'] }
const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

interface Condition {
  id: string
  field: FieldKey
  op: Op
  match: 'any' | 'all'
  values: string[]
  num?: number
  date: string
}

let seq = 0
const newCondition = (field: FieldKey = 'subject'): Condition => ({
  id: `c${++seq}`, field, op: OPS[FIELDS[field].type][0], match: 'any', values: [], date: '',
})

function isComplete(c: Condition): boolean {
  const f = FIELDS[c.field]
  if (f.type === 'num') return c.num !== undefined
  if (f.type === 'date') return c.date !== ''
  return c.values.length > 0
}

function matches(r: Assessment, c: Condition): boolean {
  const f = FIELDS[c.field]
  const v = f.get(r)
  if (f.type === 'num') {
    if (v == null) return false
    return c.op === 'gte' ? (v as number) >= c.num! : (v as number) <= c.num!
  }
  if (f.type === 'date') return c.op === 'after' ? (v as string) >= c.date : (v as string) <= c.date
  const vals = Array.isArray(v) ? v : [v as string]
  const hit = f.multi && c.match === 'all'
    ? c.values.every((x) => vals.includes(x))
    : c.values.some((x) => vals.includes(x))
  return c.op === 'is' ? hit : !hit
}

function describe(c: Condition): string {
  const f = FIELDS[c.field]
  if (f.type === 'num') return `${f.label} ${OP_LABEL[c.op]} ${c.num}${f.suffix === '%' ? '%' : ''}`
  if (f.type === 'date') return `${f.label} ${OP_LABEL[c.op]} ${fmtDate(c.date)}`
  return `${f.label} ${OP_LABEL[c.op]} ${c.values.join(f.multi && c.match === 'all' ? ' and ' : ' or ')}`
}

/**
 * Several values for one filter: the chosen ones as removable tags, and a
 * disclosure of checkboxes to add more. The library has no multi-select, so
 * this is composed from Tag and Checkbox inside a field-styled box.
 */
function MultiValueField({ label, options, values, tone, onChange }: {
  label: string
  options: string[]
  values: string[]
  tone: 'Info' | 'Warning'
  onChange: (values: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
      {/* inspera-field gives the box the library's resting, hover and focus borders. */}
      <div
        className="inspera-interactive inspera-field"
        data-force-state={open ? 'Open' : undefined}
        // 3px + a 32px Small button + 3px, inside the border, makes the 40px field height.
        style={{
          minHeight: 40, display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', padding: '3px 3px 3px 8px',
          borderRadius: 'var(--radius-sm)', borderWidth: 'var(--border-width-default)', borderStyle: 'solid',
          background: 'var(--white)', cursor: 'pointer',
        }}
        onClick={(e) => { if (e.target === e.currentTarget) setOpen(!open) }}
      >
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', padding: '4px 0' }}>
          {values.length === 0 && (
            <span style={{ fontSize: 16, lineHeight: '24px', paddingLeft: 4, color: 'var(--text-placeholder)' }}>Choose values</span>
          )}
          {values.map((v) => (
            <Tag key={v} label={v} intent={tone} removable onRemove={() => onChange(values.filter((x) => x !== v))} />
          ))}
        </div>
        <Button
          label={label}
          intent="Text"
          size="Small"
          iconOnly
          leadingIcon={open ? 'expand_less' : 'expand_more'}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen(!open)}
        />
      </div>
      {open && (
        <div
          id={panelId}
          role="group"
          aria-label={label}
          style={{
            display: 'flex', flexDirection: 'column', padding: '4px 12px',
            border: 'var(--border-width-default) solid var(--border)', borderRadius: 'var(--radius-md)',
            maxHeight: 248, overflowY: 'auto',
          }}
        >
          {options.map((o) => (
            <Checkbox
              key={o}
              label={o}
              checked={values.includes(o)}
              onChange={(on) => onChange(on ? [...values, o] : values.filter((x) => x !== o))}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/** One filter row: Where/And, field, condition, any/all, and the value control. */
function ConditionRow({ c, index, onChange, onRemove }: {
  c: Condition
  index: number
  onChange: (next: Condition) => void
  onRemove: () => void
}) {
  const f = FIELDS[c.field]
  const n = index + 1
  const full: CSSProperties = { width: '100%' }
  const hint = f.type === 'enum' ? 'Choose at least one value.' : f.type === 'num' ? 'Enter a number.' : 'Choose a date.'

  return (
    <div role="group" aria-label={`Filter ${n}: ${f.label}`} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
      <Button label={`Remove filter ${n}: ${f.label}`} intent="Text" iconOnly leadingIcon="indeterminate_check_box" onClick={onRemove} />
      <span style={{ flex: '0 0 56px', height: 40, display: 'flex', alignItems: 'center', fontSize: 16, color: 'var(--text-secondary)' }}>
        {index === 0 ? 'Where' : 'And'}
      </span>
      <div style={{ flex: '2 1 170px', minWidth: 0 }}>
        {/* Hug plus a 100% width makes Select fill its column; Fixed is always 220px. */}
        <Select
          label={`Field, filter ${n}`}
          showLabel={false}
          widthMode="Hug"
          style={full}
          options={FIELD_OPTIONS}
          value={c.field}
          onChange={(v) => onChange({ ...newCondition(v as FieldKey), id: c.id })}
        />
      </div>
      <div style={{ flex: '1.5 1 140px', minWidth: 0 }}>
        <Select
          label={`Condition, filter ${n}`}
          showLabel={false}
          widthMode="Hug"
          style={full}
          options={OPS[f.type].map((op) => ({ value: op, label: capitalise(OP_LABEL[op]) }))}
          value={c.op}
          onChange={(v) => onChange({ ...c, op: v as Op })}
        />
      </div>
      {/* 120px, not less: Select's trigger never narrows below that, and a
          narrower column let it spill over the value field. */}
      <div style={{ flex: '1 1 120px', minWidth: 0 }}>
        {f.type === 'enum' && (
          <Select
            label={f.multi ? `Match any or all values, filter ${n}` : `Match, filter ${n} (an assessment has one ${f.label.toLowerCase()}, so any value matches)`}
            showLabel={false}
            widthMode="Hug"
            style={full}
            options={[{ value: 'any', label: 'Any' }, { value: 'all', label: 'All' }]}
            value={f.multi ? c.match : 'any'}
            disabled={!f.multi}
            onChange={(v) => onChange({ ...c, match: v as Condition['match'] })}
          />
        )}
      </div>
      <div style={{ flex: '4 1 300px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        {f.type === 'enum' && (
          <MultiValueField
            label={`Values for ${f.label}, filter ${n}`}
            options={f.options!}
            values={c.values}
            tone={c.op === 'is' ? 'Info' : 'Warning'}
            onChange={(values) => onChange({ ...c, values })}
          />
        )}
        {f.type === 'num' && (
          <NumberInput
            key={c.id + c.field}
            label={`${f.label}, filter ${n}`}
            showLabel={false}
            min={0}
            suffix={f.suffix}
            value={c.num}
            onChange={(num) => onChange({ ...c, num })}
          />
        )}
        {f.type === 'date' && (
          <DatePicker
            key={c.id + c.field}
            label={`${f.label}, filter ${n}`}
            showLabel={false}
            value={c.date || undefined}
            onChange={(date) => onChange({ ...c, date })}
          />
        )}
        {!isComplete(c) && (
          <span style={{ fontSize: 12, lineHeight: 1.2, color: 'var(--muted-foreground)' }}>{hint} Unfinished filters are ignored.</span>
        )}
      </div>
    </div>
  )
}

/* --- The page ------------------------------------------------------------ */

const h2: CSSProperties = { margin: 0, fontSize: 'var(--h4-size)', fontWeight: 500, lineHeight: 1.12 }

export default function DataRichList() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'All' | Status>('All')
  const [adv, setAdv] = useState<Condition[]>([])
  const [draft, setDraft] = useState<Condition[] | null>(null)
  const [focus, setFocus] = useState<Focus>('delivery')
  const [view, setView] = useState<View>('Table')
  const [sort, setSort] = useState<DataGridSort>({ key: 'date', direction: 'Ascending' })
  const descId = useId()
  const titleId = useId()

  const query = q.trim().toLowerCase()
  const passesBasic = (r: Assessment) =>
    (!query || `${r.name} ${r.id} ${r.subject}`.toLowerCase().includes(query)) && (status === 'All' || r.status === status)
  const passesAll = (r: Assessment, conds: Condition[]) => conds.every((c) => matches(r, c))
  const list = DATA.filter((r) => passesBasic(r) && passesAll(r, adv))

  // Sorted here, not in the grid, so ties fall back to the test date and the
  // card view shares the order.
  const figures = FIGURES[focus]
  const active = [...[NAME_COL, STATUS_COL], ...figures].find((c) => c.key === sort.key)
  const getter = active?.sort ?? ((r: Assessment) => r.date)
  const dir = active && sort.direction === 'Descending' ? -1 : 1
  const sorted = [...list].sort((a, b) => {
    const x = getter(a)
    const y = getter(b)
    if (x < y) return -dir
    if (x > y) return dir
    return a.date < b.date ? -1 : 1
  })

  const columns: DataGridColumn[] = [
    { key: 'name', header: 'Assessment', sortable: true },
    { key: 'status', header: 'Status', sortable: true },
    ...figures.map((c) => ({ key: c.key, header: c.header, align: c.align, sortable: true })),
  ]
  const rows: DataGridRow[] = sorted.map((r) => ({
    name: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontWeight: 500 }}>{highlight(r.name, query)}</span>
        <span style={{ fontSize: 12, color: MUTED }}>
          <span style={{ fontFamily: 'var(--font-mono)' }}>{highlight(r.id, query)}</span> · {highlight(r.subject, query)}
        </span>
      </div>
    ),
    status: <Badge label={r.status} intent={STATUS_INTENT[r.status]} />,
    ...Object.fromEntries(figures.map((c) => [c.key, c.cell(r)])),
  }))

  // Every active filter, as a removable tag above the results.
  const tags: { label: string; icon: string; intent: 'Neutral' | 'Info'; remove: () => void }[] = []
  if (query) tags.push({ label: `Search: “${q.trim()}”`, icon: 'search', intent: 'Neutral', remove: () => setQ('') })
  if (status !== 'All') tags.push({ label: `Status: ${status}`, icon: 'filter_list', intent: 'Neutral', remove: () => setStatus('All') })
  for (const c of adv) tags.push({ label: describe(c), icon: 'tune', intent: 'Info', remove: () => setAdv(adv.filter((x) => x.id !== c.id)) })
  const reset = () => { setQ(''); setStatus('All'); setAdv([]) }

  const resultsTitle = list.length === 0
    ? (query ? `No results for “${q.trim()}”` : 'No results')
    : `${plural(list.length, 'result')}${query ? ` for “${q.trim()}”` : ''}`

  // Advanced search works on a draft, so Cancel throws the edits away.
  const openAdvanced = () => setDraft(adv.length ? adv.map((c) => ({ ...c, values: [...c.values] })) : [newCondition()])
  const ready = (draft ?? []).filter(isComplete)
  const draftCount = DATA.filter((r) => passesBasic(r) && passesAll(r, ready)).length
  const editDraft = (fn: (d: Condition[]) => Condition[]) => setDraft((d) => fn(d ?? []))
  const apply = () => { setAdv(ready); setDraft(null) }

  return (
    <div style={{ minHeight: '100%', background: 'var(--surface)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
      <main style={{ maxWidth: 1600, margin: '0 auto', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Breadcrumb items={['Home', 'Assessments']} size="Small" onNavigate={() => {}} />

        <header style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <h1 style={{ margin: 0, fontSize: 'var(--h1-size)', fontWeight: 600, lineHeight: 1.12 }}>Assessments</h1>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, color: 'var(--text-secondary)' }}>Autumn 2026 exam period</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <Button label="Export" intent="Secondary" leadingIcon="download" />
            <Button label="New assessment" leadingIcon="add" />
          </div>
        </header>

        {/* Toolbar: filters on the left, how to show the results on the right. */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 'var(--space-2)' }}>
            <TextInput
              label="Search"
              type="search"
              placeholder="Name or course code"
              leadingIcon="search"
              value={q}
              onChange={setQ}
              style={{ width: 280, maxWidth: '100%' }}
            />
            <Select
              label="Status"
              options={[{ value: 'All', label: 'All statuses' }, ...STATUSES]}
              value={status}
              onChange={(v) => setStatus(v as 'All' | Status)}
            />
            <Button
              label={adv.length ? `Advanced search (${adv.length})` : 'Advanced search'}
              intent="Outline"
              leadingIcon="tune"
              aria-haspopup="dialog"
              onClick={openAdvanced}
            />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 'var(--space-4)' }}>
            <Select
              label="Show figures for"
              options={FOCUS_OPTIONS}
              value={focus}
              onChange={(v) => { setFocus(v as Focus); setSort({ key: 'date', direction: 'Ascending' }) }}
            />
            <SegmentedControl label="View" items={['Table', 'Cards']} value={view} onChange={(v) => setView(v as View)} />
          </div>
        </div>

        {/* Results header: a count, or the active filters as removable tags. */}
        {tags.length === 0 ? (
          <p role="status" style={{ margin: 0, minHeight: 20, fontSize: 14, color: 'var(--text-secondary)' }}>
            Showing all {plural(DATA.length, 'assessment')}
          </p>
        ) : (
          <section
            aria-labelledby={titleId}
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', paddingTop: 'var(--space-2)', borderTop: 'var(--border-width-default) solid var(--border)' }}
          >
            <div role="status"><h2 id={titleId} style={h2}>{resultsTitle}</h2></div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2)' }}>
              {tags.map((t) => (
                <Tag key={t.label} label={t.label} leadingIcon={t.icon} intent={t.intent} removable onRemove={t.remove} />
              ))}
              {adv.length > 0 && <Button label="Edit advanced search" intent="Text" size="Small" leadingIcon="edit" onClick={openAdvanced} />}
              <Button label="Clear all" intent="Text" size="Small" onClick={reset} />
            </div>
          </section>
        )}

        {list.length === 0 && (
          <div style={{ padding: 'var(--space-8) var(--space-6)', background: 'var(--surface)', border: 'var(--border-width-default) solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
            <EmptyState
              icon="search_off"
              title="No assessments match your filters"
              description="Try another name, course code or status, or clear the filters to see all assessments in this period."
              actionLabel="Clear filters"
              onAction={reset}
            />
          </div>
        )}

        {list.length > 0 && view === 'Table' && (
          <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)' }}>
            <DataGrid
              columns={columns}
              rows={rows}
              getRowId={(_, i) => sorted[i].id}
              caption={CAPTIONS[focus]}
              sort={sort}
              onSortChange={setSort}
              manualSorting
            />
          </div>
        )}

        {list.length > 0 && view === 'Cards' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
            {sorted.map((r) => <AssessmentCard key={r.id} r={r} focus={focus} query={query} />)}
          </div>
        )}
      </main>

      <Dialog
        open={draft !== null}
        title="Advanced search"
        size="Large"
        // Wider than Large (640px): the filter rows need the room. The library has no wider size.
        style={{ width: 960 }}
        aria-describedby={descId}
        confirmLabel={`Show ${plural(draftCount, 'result')}`}
        footerStart={
          <span role="status">
            {ready.length
              ? `${plural(ready.length, 'filter')} set${query || status !== 'All' ? ', plus your search and status filter' : ''}`
              : 'No filters set'}
          </span>
        }
        onConfirm={apply}
        onClose={() => setDraft(null)}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <p id={descId} style={{ margin: 0, fontSize: 14, lineHeight: 1.4, color: 'var(--text-secondary)' }}>
            Show assessments that match every filter below. Your search text and status filter still apply.
          </p>
          {(draft ?? []).map((c, i) => (
            <ConditionRow
              key={c.id}
              c={c}
              index={i}
              onChange={(next) => editDraft((d) => d.map((x) => (x.id === c.id ? next : x)))}
              onRemove={() => editDraft((d) => d.filter((x) => x.id !== c.id))}
            />
          ))}
          {draft?.length === 0 && (
            <p style={{ margin: 0, padding: 'var(--space-4) 0', fontSize: 16, color: 'var(--text-secondary)' }}>
              No filters yet. Add one to narrow the results.
            </p>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
            <Button label="Add filter" intent="Text" leadingIcon="add" onClick={() => editDraft((d) => [...d, newCondition()])} />
            {(draft?.length ?? 0) > 0 && (
              <Button label="Clear all filters" intent="Text" leadingIcon="filter_alt_off" onClick={() => setDraft([])} />
            )}
          </div>
        </div>
      </Dialog>
    </div>
  )
}

/** Card view: the same record, with the figures for the chosen focus. */
function AssessmentCard({ r, focus, query }: { r: Assessment; focus: Focus; query: string }) {
  const metric = (label: string, value: string | number, muted = false) => ({ label, value: String(value), muted })
  let metrics: ReturnType<typeof metric>[]
  let bar: ReactNode = null
  let extra: ReactNode = null
  let note: string | null = null

  if (focus === 'delivery') {
    const open = !preDelivery(r)
    metrics = [
      metric('Registered', r.reg ? fmtInt(r.reg) : 'None', !r.reg),
      metric('Submitted', open ? `${pct(r.sub, r.reg)}%` : 'Not open', !open),
      metric('Items', r.items),
    ]
    if (open) bar = cardMeter('Submitted', r.sub, r.reg)
    if (!open) extra = r.issues ? <Badge label={plural(r.issues, 'setup issue')} intent="Warning" /> : <Badge label="Ready to run" intent="Success" />
  } else if (focus === 'marking') {
    metrics = [
      metric('Submitted', preDelivery(r) ? '-' : fmtInt(r.sub), preDelivery(r)),
      metric('Avg score', r.avg == null ? '-' : `${r.avg}%`, r.avg == null),
      metric('Due', r.status === 'Completed' ? 'Done' : fmtShort(r.due), r.status === 'Completed'),
    ]
    if (markable(r)) bar = cardMeter('Marked', r.marked, r.sub)
    else note = r.status === 'Live' ? 'Marking opens when the test closes.' : 'Nothing to mark yet.'
  } else {
    metrics = [
      metric('Items', r.items),
      metric('Avg score', r.avg == null ? '-' : `${r.avg}%`, r.avg == null),
      metric('Discrim.', r.disc == null ? '-' : r.disc.toFixed(2), r.disc == null),
    ]
    if (r.flagged) extra = <Badge label={`${r.flagged} items to review`} intent="Warning" />
    else if (r.disc != null && r.disc < 0.2) extra = <Badge label="Low discrimination" intent="Warning" />
    if (r.disc == null) note = 'No results yet. Figures appear once scripts are marked.'
  }

  return (
    <Card elevation="Outlined">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: MUTED }}>{highlight(r.id, query)}</span>
        <Badge label={r.status} intent={STATUS_INTENT[r.status]} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 500, lineHeight: 1.25 }}>{highlight(r.name, query)}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 14, color: 'var(--text-secondary)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }} aria-hidden>event</span>
          <span>{fmtDate(r.date)} · {highlight(r.subject, query)}</span>
        </div>
      </div>
      <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'var(--space-3)', margin: 0, paddingTop: 'var(--space-3)', borderTop: 'var(--border-width-default) solid var(--border)' }}>
        {metrics.map((m) => (
          <div key={m.label} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', minWidth: 0 }}>
            <dt style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{m.label}</dt>
            <dd style={{ ...NUM, margin: 0, fontSize: m.muted ? 16 : 18, fontWeight: 500, color: m.muted ? MUTED : 'var(--text-primary)' }}>{m.value}</dd>
          </div>
        ))}
      </dl>
      {bar}
      {extra && <div>{extra}</div>}
      {note && <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)' }}>{note}</p>}
    </Card>
  )
}

/** A labelled bar for a card: the label and count above, the bar below. */
function cardMeter(label: string, done: number, total: number): ReactNode {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span style={NUM}>{done === total ? `All ${fmtInt(total)}` : `${fmtInt(done)} of ${fmtInt(total)}`}</span>
      </div>
      <Progress label={`${label} ${done} of ${total}`} value={pct(done, total)} intent={done === total ? 'Success' : 'Primary'} />
    </div>
  )
}
