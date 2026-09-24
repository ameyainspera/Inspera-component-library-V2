import { type ReactNode, useState } from 'react'
import { TextInput, Pagination } from '../../components/inspera'
import { AssessorNav } from '../../imports/pasted_text/global-nav'

/**
 * Monitor > Candidates screen. The live invigilation roster: a "Views" rail
 * with saved counts, a search toolbar, and a wide candidate grid (status icons,
 * last-seen dot, progress, connection warnings, timing and test columns). The
 * top bar is Inspera's real AssessorNav (Monitor active); the grid is bespoke
 * so the many columns and the status affordances match the product exactly.
 */

interface CandidateRow {
  id: string
  statusIcon: 'warning' | 'check'
  seen?: string
  seenState?: 'idle' | 'online'
  progress: string
  progressState: string
  warning?: string
  spent?: string
  remaining?: string
  type: string
  test: string
  start?: string
  submission?: string
  testType: string
}

const ROWS: CandidateRow[] = [
  { id: '0001', statusIcon: 'warning', seen: 'a month', seenState: 'idle', progress: '03.08.2026 6:45 PM', progressState: 'Inactive', warning: '03.08.2026 6:18 PM Connection restored (1)', spent: '39916', remaining: '0', type: 'Open-book', test: 'IOA test info', start: '01.08.2026 10:00 AM', testType: 'Standalone test' },
  { id: '0007', statusIcon: 'check', progress: '08.04.2026 1:21 PM', progressState: 'Submitted', spent: '0', remaining: '0', type: 'Open-book', test: 'Oral Exam V1', start: '01.04.2026 10:00 AM', testType: 'Standalone test' },
  { id: '0006', statusIcon: 'warning', seen: 'Online', seenState: 'online', progress: '08.04.2026 1:19 PM', progressState: 'Dashboard', warning: '08.04.2026 1:19 PM Connection restored (1)', remaining: '0', type: 'Open-book', test: 'Oral Exam V1', start: '01.04.2026 10:00 AM', testType: 'Standalone test' },
  { id: 'm1 mm1', statusIcon: 'warning', seen: '9 months', seenState: 'idle', progress: '15.12.2025 10:56 AM', progressState: 'Inactive', warning: '15.12.2025 10:55 AM Connection restored (6)', type: 'Open-book', test: 'Aarohi test temp', testType: 'Standalone test' },
  { id: 'm1 mm1', statusIcon: 'warning', seen: '9 months', seenState: 'idle', progress: '15.12.2025 10:56 AM', progressState: 'Inactive', warning: '15.12.2025 10:55 AM Connection restored (6)', remaining: '0', type: 'Open-book', test: 'Aarohi test temp', start: '06.08.2025 10:00 AM', testType: 'Standalone test' },
  { id: '0001', statusIcon: 'warning', seen: '9 months', seenState: 'idle', progress: '05.12.2025 6:43 PM', progressState: 'Inactive', warning: '05.12.2025 4:42 PM Connection restored (69)', spent: '38902', remaining: '0', type: 'Open-book', test: 'CSQ tst', start: '04.12.2025 10:00 AM', submission: '05.12.2025 1:40 PM', testType: 'Parent test' },
]

const COLS: { key: string; label: string; sortable?: boolean; align?: 'right'; width: number }[] = [
  { key: 'id', label: 'ID', width: 90 },
  { key: 'status', label: 'Status', width: 130 },
  { key: 'progress', label: 'Progress', sortable: true, width: 150 },
  { key: 'warnings', label: 'Warnings', width: 170 },
  { key: 'spent', label: 'Minutes spent', align: 'right', width: 110 },
  { key: 'remaining', label: 'Minutes remaining', align: 'right', width: 120 },
  { key: 'type', label: 'Type', width: 90 },
  { key: 'test', label: 'Test', width: 120 },
  { key: 'start', label: 'Test start time', width: 130 },
  { key: 'submission', label: 'Submission saved', width: 130 },
  { key: 'testType', label: 'Test Type', width: 120 },
  { key: 'final', label: 'Final grade', width: 90 },
  { key: 'atc', label: 'ATC Status', width: 110 },
  { key: 'comments', label: 'Comments', width: 120 },
]

/** Search toolbar with the filter/reset/view controls (no quick chips here). */
function Toolbar() {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        padding: 8, background: 'var(--gray-100)', borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
      }}
    >
      <div style={{ flex: 1, minWidth: 240 }}>
        <TextInput showLabel={false} placeholder="Search candidates" leadingIcon="search" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          type="button"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 12px',
            fontSize: 13, fontWeight: 500, cursor: 'pointer', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-strong)', background: 'var(--surface)',
            color: 'var(--gray-800)', fontFamily: 'var(--font-sans)',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 17 }} aria-hidden>filter_list</span>
          Filters
          <span style={{ color: 'var(--muted-foreground)' }}>0</span>
        </button>
        {[
          { icon: 'restart_alt', label: 'Reset filters' },
          { icon: 'view_column', label: 'Column layout' },
          { icon: 'menu', label: 'View options' },
        ].map((b) => (
          <button
            key={b.icon}
            type="button"
            aria-label={b.label}
            title={b.label}
            style={{
              width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)',
              background: 'var(--surface)', color: 'var(--gray-700)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>{b.icon}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

const AMBER = '#d9822b'

/** The candidates data grid. */
function CandidatesTable() {
  const [checked, setChecked] = useState<Set<number>>(new Set())
  const allOn = checked.size === ROWS.length
  const toggleAll = () => setChecked(allOn ? new Set() : new Set(ROWS.map((_, i) => i)))
  const toggle = (i: number) =>
    setChecked((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })

  const box = (on: boolean, onChange: () => void, label: string): ReactNode => (
    <input
      type="checkbox"
      checked={on}
      aria-label={label}
      onClick={(e) => e.stopPropagation()}
      onChange={onChange}
      style={{ width: 16, height: 16, accentColor: 'var(--primary)', cursor: 'pointer' }}
    />
  )

  const th: React.CSSProperties = {
    padding: '10px 14px', textAlign: 'left', fontSize: 14, fontWeight: 600, verticalAlign: 'bottom',
    color: 'var(--gray-900)', borderBottom: '2px solid var(--border-strong)',
  }
  const td: React.CSSProperties = {
    padding: '12px 14px', fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.4,
    borderBottom: '1px solid var(--border)', verticalAlign: 'top',
  }
  const link: React.CSSProperties = { color: 'var(--primary)', textDecoration: 'none' }

  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 1600, fontFamily: 'var(--font-sans)' }}>
      <thead>
        <tr>
          <th style={{ ...th, width: 44, paddingRight: 0 }}>{box(allOn, toggleAll, 'Select all candidates')}</th>
          {COLS.map((c) => (
            <th key={c.key} style={{ ...th, width: c.width, textAlign: c.align ?? 'left' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                {c.label}
                {c.sortable && (
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--gray-700)' }} aria-hidden>
                    arrow_downward
                  </span>
                )}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {ROWS.map((row, i) => (
          <tr
            key={i}
            className="inspera-interactive inspera-row"
            style={{ '--inspera-row-bg': 'var(--white)' } as React.CSSProperties}
          >
            <td style={{ ...td, paddingRight: 0 }}>{box(checked.has(i), () => toggle(i), `Select ${row.id}`)}</td>
            <td style={td}>{row.id}</td>
            <td style={td}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 20, color: row.statusIcon === 'check' ? 'var(--success)' : AMBER }}
                  aria-hidden
                >
                  {row.statusIcon === 'check' ? 'check' : 'warning'}
                </span>
                {row.seen && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: row.seenState === 'online' ? 'var(--primary)' : 'var(--muted-foreground)' }}>
                    {row.seen}
                    <span
                      style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: row.seenState === 'online' ? 'var(--success)' : 'var(--gray-400)',
                      }}
                    />
                  </span>
                )}
              </span>
            </td>
            <td style={td}>
              {row.progress} <span>{row.progressState}</span>
            </td>
            <td style={td}>
              {row.warning ? (
                <a href="#" onClick={(e) => e.preventDefault()} style={link}>{row.warning}</a>
              ) : (
                ''
              )}
            </td>
            <td style={{ ...td, textAlign: 'right' }}>{row.spent ?? ''}</td>
            <td style={{ ...td, textAlign: 'right' }}>{row.remaining ?? ''}</td>
            <td style={td}>{row.type}</td>
            <td style={td}>
              <a href="#" onClick={(e) => e.preventDefault()} style={link}>{row.test}</a>
            </td>
            <td style={td}>{row.start ?? ''}</td>
            <td style={td}>{row.submission ?? ''}</td>
            <td style={td}>{row.testType}</td>
            <td style={td} />
            <td style={td} />
            <td style={td} />
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function MonitorCandidates() {
  const [page, setPage] = useState(1)

  const railItem = (label: string, count?: number, active = false): ReactNode => (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        padding: '10px 12px', borderRadius: 'var(--radius-sm)',
        background: active ? 'var(--gray-100)' : 'transparent',
        fontSize: 14, fontWeight: active ? 500 : 400,
        color: active ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer',
      }}
    >
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      {count !== undefined && <span style={{ color: 'var(--muted-foreground)', flexShrink: 0 }}>{count}</span>}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', background: 'var(--surface)' }}>
      <AssessorNav activeId="monitor" onHome={() => {}} onNavigate={() => {}} />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Views rail */}
        <aside
          style={{
            width: 240, flexShrink: 0, padding: '24px 20px',
            borderRight: '1px solid var(--border)', background: 'var(--surface)',
            display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-sans)',
          }}
        >
          <h2 style={{ margin: '0 0 20px', fontSize: 22, fontWeight: 600, color: 'var(--text-primary)' }}>Views</h2>

          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--muted-foreground)', marginBottom: 8 }}>
            Default views
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 20 }}>
            {railItem('All Candidates', undefined, true)}
            {railItem('Appeals')}
          </div>

          <button
            type="button"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              padding: 0, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 8,
              fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--muted-foreground)',
            }}
          >
            My views
            <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>expand_less</span>
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {railItem('Candidates with potential p...', 0)}
            {railItem('In progress right now', 0)}
            {railItem('New hand-ins today', 0)}
            {railItem('test', 12)}
          </div>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, minWidth: 0, padding: '24px 28px 32px', fontFamily: 'var(--font-sans)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 600, color: 'var(--text-primary)' }}>Candidates</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 26, fontWeight: 600, color: 'var(--text-primary)' }}>228</span>
              <button
                type="button"
                aria-label="Count options"
                style={{
                  width: 40, height: 40, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)',
                  background: 'var(--surface)', color: 'var(--gray-700)',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>expand_more</span>
              </button>
            </div>
          </div>

          <Toolbar />

          <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
            <CandidatesTable />
          </div>

          {/* Footer: count + pager */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              1 - 14 <span style={{ color: 'var(--muted-foreground)' }}>of</span> <strong style={{ fontWeight: 600, color: 'var(--text-primary)' }}>228</strong>
            </span>
            <Pagination page={page} pageCount={17} onChange={setPage} />
          </div>

          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-secondary)' }}>
            Hits per page:
            <select
              defaultValue="Auto"
              style={{
                height: 32, padding: '0 8px', fontSize: 14, borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-strong)', background: 'var(--surface)',
                color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', cursor: 'pointer',
              }}
            >
              <option>Auto</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
          </label>
        </main>
      </div>
    </div>
  )
}
