import { type ReactNode, useState } from 'react'
import { TextInput, Pagination } from '../../components/inspera'
import { AssessorNav } from '../../imports/pasted_text/global-nav'

/**
 * Author > Question Sets screen. Same roster family as Deliver > Tests: a
 * "Views" rail, a searchable/filterable toolbar, the grid and the pager. The
 * top bar is Inspera's real AssessorNav (Author active). The grid is bespoke so
 * it matches the product exactly - select-all header, sortable "Last edited",
 * blue title links, a per-row Status dropdown and hover-revealed row actions.
 */

// The product's CTA orange, shared with the other screen templates. 4% darker
// than the product's #d9432c, which is 4.38:1 under white text.
const CTA = '#d0402a'

interface QSRow {
  title: string
  createdBy: string
  lastEdited: string
  editedBy: string
  created: string
}

const ROWS: QSRow[] = [
  { title: 'Manually marked QS', createdBy: 'Mridula TM', lastEdited: '21.08.2026 12:13 PM', editedBy: 'Ameya Suryan', created: '19.10.2023 3:32 PM' },
  { title: 'New Question Set', createdBy: 'Ameya Suryan', lastEdited: '20.08.2026 1:37 PM', editedBy: 'Ameya Suryan', created: '20.08.2026 1:37 PM' },
  { title: 'New Question Set', createdBy: 'Ameya Suryan', lastEdited: '14.08.2026 1:15 PM', editedBy: 'Ameya Suryan', created: '14.08.2026 1:15 PM' },
  { title: 'New Question Set', createdBy: 'Ameya Suryan', lastEdited: '23.07.2026 3:56 PM', editedBy: 'Ameya Suryan', created: '21.07.2026 11:04 AM' },
  { title: 'Test IOA', createdBy: 'Ameya Suryan', lastEdited: '21.07.2026 11:04 AM', editedBy: 'Ameya Suryan', created: '20.07.2026 12:31 PM' },
  { title: 'New Question Set', createdBy: 'Ameya Suryan', lastEdited: '20.07.2026 12:37 PM', editedBy: 'Ameya Suryan', created: '20.07.2026 12:37 PM' },
  { title: 'New Question Set', createdBy: 'Ameya Suryan', lastEdited: '08.07.2026 11:40 AM', editedBy: 'Ameya Suryan', created: '04.06.2026 11:02 AM' },
  { title: 'New Question Set', createdBy: 'Ameya Suryan', lastEdited: '22.06.2026 6:39 PM', editedBy: 'Ameya Suryan', created: '22.06.2026 6:39 PM' },
  { title: 'IOA test', createdBy: 'Ameya Suryan', lastEdited: '22.06.2026 6:38 PM', editedBy: 'Ameya Suryan', created: '09.06.2026 12:00 PM' },
  { title: 'Oral Exam', createdBy: 'Mohan Kumar', lastEdited: '16.04.2026 12:42 PM', editedBy: 'Ameya Suryan', created: '08.04.2026 1:08 PM' },
  { title: 'New Question Set', createdBy: 'Ameya Suryan', lastEdited: '02.04.2026 12:16 PM', editedBy: 'Ameya Suryan', created: '02.04.2026 12:16 PM' },
  { title: 'New Question Set', createdBy: 'Ameya Suryan', lastEdited: '17.02.2026 12:43 PM', editedBy: 'Ameya Suryan', created: '17.02.2026 12:36 PM' },
  { title: 'New Question Set', createdBy: 'Ameya Suryan', lastEdited: '11.02.2026 6:53 PM', editedBy: 'Ameya Suryan', created: '11.02.2026 10:33 AM' },
  { title: 'New Question Set', createdBy: 'Ameya Suryan', lastEdited: '10.02.2026 5:55 PM', editedBy: 'Ameya Suryan', created: '10.02.2026 5:26 PM' },
]

/** Quick-filter chips + the filter/reset/view controls. */
function Toolbar() {
  const chips = ['Created by me', 'Edited today', 'Shared with me']
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
        <TextInput label="Search question sets" showLabel={false} placeholder="Search" leadingIcon="search" />
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

/** Room at the row's end for More + Preview + Edit. */
const ACTIONS_WIDTH = 180

const COLS: { key: string; label: string; sortable?: boolean; width?: number }[] = [
  { key: 'title', label: 'Title', width: 200 },
  { key: 'createdBy', label: 'Created by', width: 150 },
  { key: 'lastEdited', label: 'Last edited', sortable: true, width: 180 },
  { key: 'editedBy', label: 'Edited by', width: 150 },
  { key: 'created', label: 'Created', width: 170 },
  { key: 'status', label: 'Status', width: 180 },
]

/** The question-sets data grid. */
function QuestionSetsTable() {
  const [checked, setChecked] = useState<Set<number>>(new Set())
  const [hovered, setHovered] = useState<number | null>(null)
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
    padding: '10px 16px', textAlign: 'left', fontSize: 14, fontWeight: 600,
    color: 'var(--gray-900)', borderBottom: '2px solid var(--border-strong)', whiteSpace: 'nowrap',
  }
  const td: React.CSSProperties = {
    padding: '0 16px', height: 56, fontSize: 14, color: 'var(--text-primary)',
    borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap', verticalAlign: 'middle',
  }

  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', fontFamily: 'var(--font-sans)' }}>
      <thead>
        <tr>
          <th style={{ ...th, width: 44, paddingRight: 0 }}>{box(allOn, toggleAll, 'Select all question sets')}</th>
          {COLS.map((c) => (
            <th key={c.key} style={{ ...th, width: c.width, minWidth: c.width }}>
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
          {/* Empty column that holds the hover actions, so they never push the grid wider. */}
          <th aria-label="Row actions" style={{ ...th, width: ACTIONS_WIDTH, minWidth: ACTIONS_WIDTH }} />
        </tr>
      </thead>
      <tbody>
        {ROWS.map((row, i) => (
          <tr
            key={i}
            className="inspera-interactive inspera-row"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
            style={{ '--inspera-row-bg': i % 2 === 1 ? 'var(--gray-100)' : 'var(--white)', position: 'relative' } as React.CSSProperties}
          >
            <td style={{ ...td, paddingRight: 0 }}>{box(checked.has(i), () => toggle(i), `Select ${row.title}`)}</td>
            <td style={td}>
              <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                {row.title}
              </a>
            </td>
            <td style={td}>{row.createdBy}</td>
            <td style={td}>{row.lastEdited}</td>
            <td style={td}>{row.editedBy}</td>
            <td style={td}>{row.created}</td>
            <td style={td}>
              <select
                defaultValue="Draft"
                aria-label={`Status of ${row.title}`}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '100%', height: 36, padding: '0 10px', fontSize: 14, borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-strong)', background: 'var(--surface)',
                  color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', cursor: 'pointer',
                }}
              >
                <option>Draft</option>
                <option>Ready</option>
                <option>Archived</option>
              </select>
            </td>
            <td style={{ ...td, paddingLeft: 8 }}>
              {/* Row actions, revealed on hover in the empty column at the row's end. */}
              {hovered === i && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <button
                    type="button"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4, height: 32, padding: '0 10px',
                      fontSize: 13, fontWeight: 500, cursor: 'pointer', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-strong)', background: 'var(--surface)', color: 'var(--gray-800)',
                      fontFamily: 'var(--font-sans)', boxShadow: 'var(--shadow-100)',
                    }}
                  >
                    More
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }} aria-hidden>expand_more</span>
                  </button>
                  {['visibility', 'edit'].map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      aria-label={icon === 'visibility' ? 'Preview' : 'Edit'}
                      style={{
                        width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)',
                        background: 'var(--surface)', color: 'var(--gray-700)', boxShadow: 'var(--shadow-100)',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>{icon}</span>
                    </button>
                  ))}
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function QuestionSets() {
  const [page, setPage] = useState(1)

  const railItem = (label: string, active = false): ReactNode => (
    <div
      style={{
        padding: '10px 12px', borderRadius: 'var(--radius-sm)',
        background: active ? 'var(--gray-100)' : 'transparent',
        fontSize: 14, fontWeight: active ? 500 : 400,
        color: active ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer',
      }}
    >
      {label}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface)' }}>
      <AssessorNav activeId="author" onHome={() => {}} onNavigate={() => {}} />

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
            {railItem('All Question Sets', true)}
            {railItem('Analytics - Basic')}
            {railItem('Analytics - Advanced')}
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
            <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>delete</span>
            Trashed Question Sets
          </div>
        </aside>

        {/* Main content: the only part that scrolls, so the Views rail stays put. */}
        <main style={{ flex: 1, minWidth: 0, minHeight: 0, overflowY: 'auto', padding: '24px 28px 32px', fontFamily: 'var(--font-sans)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 600, color: 'var(--text-primary)' }}>Question Sets</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 26, fontWeight: 600, color: 'var(--text-primary)' }}>118</span>
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
                  Create New
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

          <div style={{ overflowX: 'auto', flexShrink: 0 }}>
            <QuestionSetsTable />
          </div>

          {/* Footer: count + pager */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              1 - 14 <span style={{ color: 'var(--muted-foreground)' }}>of</span> <strong style={{ fontWeight: 600, color: 'var(--text-primary)' }}>118</strong>
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
