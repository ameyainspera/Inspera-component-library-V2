import { type ReactNode, useState } from 'react'
import { TextInput, Pagination } from '../../components/inspera'
import { AssessorNav } from '../../imports/pasted_text/global-nav'

/**
 * Deliver > Tests screen. The real Inspera test roster: a "Views" rail, a
 * searchable/filterable toolbar, the tests grid, and the pager. The top bar is
 * Inspera's real AssessorNav; the roster is a bespoke data grid so it matches
 * the product exactly (select-all header, sortable "Last edited", blue title
 * links, flat full-width rows).
 */

// The product's CTA orange, matching the Test setup page. Kept as a page-local
// constant until the design system ships a canonical CTA token. 4% darker
// than the product's #d9432c, which is 4.38:1 under white text.
const CTA = '#d0402a'

interface TestRow {
  title: string
  variant?: string
  timeframe?: string
  status: 'Created' | 'Finished'
  lastEdited: string
  start?: string
  end?: string
  template?: string
}

const ROWS: TestRow[] = [
  { title: 'New Test', status: 'Created', lastEdited: '18.09.2026 11:43 AM' },
  { title: 'New Test', status: 'Created', lastEdited: '17.09.2026 3:25 PM', start: '17.09.2026 12:00 AM' },
  { title: 'New Test', status: 'Created', lastEdited: '17.09.2026 1:55 PM' },
  { title: 'New Test', status: 'Created', lastEdited: '20.08.2026 1:36 PM' },
  { title: 'New Test', status: 'Finished', lastEdited: '12.08.2026 3:58 PM', start: '04.08.2026 10:00 AM', end: '28.08.2026 12:00 PM' },
  { title: 'IOA test info', status: 'Finished', lastEdited: '03.08.2026 6:17 PM', start: '01.08.2026 10:00 AM', end: '31.08.2026 12:00 PM' },
  { title: 'New Test', status: 'Created', lastEdited: '28.07.2026 4:05 PM' },
  { title: 'New Test', status: 'Created', lastEdited: '24.07.2026 11:09 PM', start: '15.07.2026 10:00 AM', end: '31.07.2026 12:00 PM' },
  { title: 'New Test', status: 'Created', lastEdited: '08.07.2026 1:46 PM', start: '08.07.2026 10:00 AM', end: '28.02.2027 12:00 PM' },
  { title: 'New Test', status: 'Created', lastEdited: '08.07.2026 1:44 PM' },
  { title: 'New Test', status: 'Created', lastEdited: '07.07.2026 4:04 PM' },
  { title: 'New Test', status: 'Finished', lastEdited: '18.06.2026 4:03 PM', start: '17.06.2026 2:30 PM', end: '23.06.2026 12:00 PM', template: 'New Test' },
  { title: 'Test Sri', status: 'Created', lastEdited: '18.06.2026 3:36 PM', start: '06.05.2025 10:00 AM', end: '07.05.2025 12:00 PM', template: 'newtestkkk' },
  { title: 'New Test', status: 'Created', lastEdited: '17.06.2026 2:11 PM' },
]

const COLS: { key: keyof TestRow | 'sel'; label: string; sortable?: boolean; width?: number }[] = [
  { key: 'title', label: 'Title' },
  { key: 'variant', label: 'Variant', width: 90 },
  { key: 'timeframe', label: 'Timeframe code', width: 150 },
  { key: 'status', label: 'Status', width: 110 },
  { key: 'lastEdited', label: 'Last edited', sortable: true, width: 220 },
  { key: 'start', label: 'Start Time', width: 200 },
  { key: 'end', label: 'End Time', width: 200 },
  { key: 'template', label: 'From Template', width: 160 },
]

/** A row of quick-filter chips + the filter/reset/view controls. */
function Toolbar() {
  const chips = ['Starts today', 'Starts tomorrow', 'Created by me', 'Edited today']
  const [active, setActive] = useState<string | null>(null)
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        padding: 8, background: 'var(--gray-100)', borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
      }}
    >
      <div style={{ flex: 1, minWidth: 240 }}>
        <TextInput label="Search tests" showLabel={false} placeholder="Search" leadingIcon="search" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {chips.map((c) => {
          const on = active === c
          return (
            <button
              key={c}
              type="button"
              onClick={() => setActive(on ? null : c)}
              style={{
                height: 32, padding: '0 12px', fontSize: 13, fontWeight: 500,
                cursor: 'pointer', borderRadius: 'var(--radius-sm)',
                border: `1px solid ${on ? 'var(--primary)' : 'var(--border-strong)'}`,
                background: on ? 'var(--blue-100)' : 'var(--surface)',
                color: on ? 'var(--primary)' : 'var(--gray-800)',
                fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap',
              }}
            >
              {c}
            </button>
          )
        })}
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

/** The tests data grid. */
function TestsTable() {
  const [checked, setChecked] = useState<Set<number>>(new Set())
  const allOn = checked.size === ROWS.length
  const toggleAll = () =>
    setChecked(allOn ? new Set() : new Set(ROWS.map((_, i) => i)))
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
    padding: '10px 16px', textAlign: 'left', fontSize: 14, fontWeight: 600,
    color: 'var(--gray-900)', borderBottom: '2px solid var(--border-strong)', whiteSpace: 'nowrap',
  }
  const td: React.CSSProperties = {
    padding: '0 16px', height: 54, fontSize: 14, color: 'var(--text-primary)',
    borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap', verticalAlign: 'middle',
  }

  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', fontFamily: 'var(--font-sans)' }}>
      <thead>
        <tr>
          <th style={{ ...th, width: 44, paddingRight: 0 }}>{box(allOn, toggleAll, 'Select all tests')}</th>
          {COLS.map((c) => (
            <th key={c.key} style={{ ...th, width: c.width }}>
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
            style={{ '--inspera-row-bg': i % 2 === 1 ? 'var(--gray-100)' : 'var(--white)' } as React.CSSProperties}
          >
            <td style={{ ...td, paddingRight: 0 }}>{box(checked.has(i), () => toggle(i), `Select ${row.title}`)}</td>
            <td style={td}>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 400 }}
              >
                {row.title}
              </a>
            </td>
            <td style={td}>{row.variant ?? ''}</td>
            <td style={td}>{row.timeframe ?? ''}</td>
            <td style={td}>{row.status}</td>
            <td style={td}>{row.lastEdited}</td>
            <td style={td}>{row.start ?? ''}</td>
            <td style={td}>{row.end ?? ''}</td>
            <td style={td}>
              {row.template ? (
                <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                  {row.template}
                </a>
              ) : (
                ''
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function DeliverTests() {
  const [page, setPage] = useState(1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', background: 'var(--surface)' }}>
      <AssessorNav activeId="deliver" onHome={() => {}} onNavigate={() => {}} />

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
          <div
            style={{
              padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--gray-100)',
              fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 20,
            }}
          >
            All Tests
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
          <p style={{ margin: 0, fontSize: 14, color: 'var(--muted-foreground)' }}>You have not saved any views yet</p>

          <div
            style={{
              marginTop: 'auto', paddingTop: 20, display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 14, color: 'var(--text-secondary)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>inventory_2</span>
            Archived Tests
          </div>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, minWidth: 0, padding: '24px 28px 32px', fontFamily: 'var(--font-sans)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 600, color: 'var(--text-primary)' }}>Tests</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 26, fontWeight: 600, color: 'var(--text-primary)' }}>242</span>
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
              {/* CTA split button */}
              <div style={{ display: 'inline-flex', alignItems: 'stretch', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <button
                  type="button"
                  style={{
                    display: 'inline-flex', alignItems: 'center', height: 44, padding: '0 18px', fontSize: 15, fontWeight: 600,
                    cursor: 'pointer', border: 'none', background: CTA, color: 'var(--white)', fontFamily: 'var(--font-sans)',
                  }}
                >
                  Create new test
                </button>
                <span style={{ width: 1, background: 'rgba(255,255,255,0.35)' }} />
                <button
                  type="button"
                  aria-label="More create options"
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 44,
                    cursor: 'pointer', border: 'none', background: CTA, color: 'var(--white)',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>expand_more</span>
                </button>
              </div>
            </div>
          </div>

          <Toolbar />

          <div style={{ overflowX: 'auto' }}>
            <TestsTable />
          </div>

          {/* Footer: count + pager */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              1 - 14 <span style={{ color: 'var(--muted-foreground)' }}>of</span> <strong style={{ fontWeight: 600, color: 'var(--text-primary)' }}>242</strong>
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
