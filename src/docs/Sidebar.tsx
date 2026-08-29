import { useEffect, useMemo, useRef, useState } from 'react'
import { navigation } from '../data/navigation'
import { components } from '../data/components'
import { totalIconCount } from '../data/icons'
import { FOUNDATION_SECTIONS } from './FoundationsPage'
import { search, type Searchable } from './search'

interface SidebarProps {
  route: string
  onNavigate: (hash: string) => void
}

const TOP_LEVEL = [
  // Counted, not guessed — the badge used to claim "3k+" against ~1.2k icons.
  { hash: '#/icons', label: 'Icons', icon: 'interests', detail: 'Material Symbols icon set', badge: String(totalIconCount) },
  { hash: '#/integrate', label: 'Integrate', icon: 'rocket_launch', detail: 'Use Inspera in any AI builder or codebase' },
]

export default function Sidebar({ route, onNavigate }: SidebarProps) {
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Everything reachable from the sidebar is searchable, not just components.
  const index = useMemo<Searchable[]>(() => {
    const foundations: Searchable[] = FOUNDATION_SECTIONS.map((f) => ({
      id: `#/foundations/${f.slug}`,
      name: f.label,
      detail: f.description,
      group: 'Foundations',
      terms: ['foundations', 'tokens', 'design tokens'],
      href: `#/foundations/${f.slug}`,
    }))
    const pages: Searchable[] = TOP_LEVEL.map((p) => ({
      id: p.hash,
      name: p.label,
      detail: p.detail,
      group: 'Pages',
      terms: ['tokens', 'design tokens', 'colour', 'color', 'guide', 'setup'],
      href: p.hash,
    }))
    const comps: Searchable[] = Object.values(components).map((c) => ({
      id: c.slug,
      name: c.name,
      detail: c.purpose,
      group: navigation.find((g) => g.category === c.category)?.label ?? c.category,
      // Legacy Figma names are searchable too: someone with an old file in
      // front of them can type what it says there and land on the real one.
      terms: [...(c.keywords ?? []), ...c.deprecatedAliases],
      href: `#/component/${c.slug}`,
    }))
    return [...comps, ...foundations, ...pages]
  }, [])

  const hits = useMemo(() => search(query, index), [query, index])
  const searching = query.trim().length > 0

  useEffect(() => setCursor(0), [query])

  // ⌘K / Ctrl-K from anywhere focuses the box; Escape gets you out.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const go = (href: string) => {
    onNavigate(href)
    setQuery('')
    inputRef.current?.blur()
  }

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      if (query) setQuery('')
      else inputRef.current?.blur()
      return
    }
    if (!searching || hits.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((c) => (c + 1) % hits.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((c) => (c - 1 + hits.length) % hits.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const hit = hits[cursor]
      if (hit) go(hit.item.href)
    }
  }

  // Keep the highlighted result in view while arrowing through a long list.
  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [cursor])

  const linkStyle = (active: boolean, disabled: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    width: '100%',
    padding: '7px 12px',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    fontFamily: 'var(--font-sans)',
    fontSize: 14,
    fontWeight: active ? 600 : 400,
    color: disabled ? 'var(--gray-400)' : active ? 'var(--primary)' : 'var(--gray-700)',
    background: active ? 'var(--blue-100)' : 'transparent',
    cursor: disabled ? 'default' : 'pointer',
    textAlign: 'left' as const,
    userSelect: 'none' as const,
  })

  return (
    <nav
      aria-label="Component navigation"
      style={{
        width: 260,
        flexShrink: 0,
        borderRight: '1px solid var(--border)',
        background: 'var(--surface)',
        height: '100%',
        overflowY: 'auto',
        padding: '16px 16px 20px',
        boxSizing: 'border-box',
      }}
    >
      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <span
          className="material-symbols-outlined"
          aria-hidden
          style={{
            position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)',
            fontSize: 18, color: 'var(--muted-foreground)', pointerEvents: 'none',
          }}
        >
          search
        </span>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onInputKey}
          placeholder="Search components…"
          aria-label="Search components"
          role="combobox"
          aria-expanded={searching}
          aria-controls="sidebar-search-results"
          aria-autocomplete="list"
          style={{
            width: '100%',
            height: 34,
            boxSizing: 'border-box',
            padding: '0 34px 0 32px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-strong)',
            background: 'var(--surface)',
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            color: 'var(--text-primary)',
            outline: 'none',
          }}
        />
        {!query && (
          <kbd
            aria-hidden
            style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted-foreground)',
              border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-xs)',
              padding: '1px 4px', pointerEvents: 'none', background: 'var(--gray-100)',
            }}
          >
            ⌘K
          </kbd>
        )}
      </div>

      {searching ? (
        <div id="sidebar-search-results" role="listbox" aria-label="Search results" ref={listRef}>
          {hits.length === 0 ? (
            <p style={{ margin: '12px 4px', fontSize: 13, color: 'var(--muted-foreground)', lineHeight: 1.5 }}>
              Nothing matches “{query}”. Try a related word — “modal”, “dropdown”, “toast”.
            </p>
          ) : (
            <>
              <div style={{ padding: '0 4px 8px', fontSize: 11, color: 'var(--gray-500)' }}>
                {hits.length} result{hits.length === 1 ? '' : 's'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {hits.map((hit, i) => (
                  <button
                    key={hit.item.id}
                    type="button"
                    role="option"
                    aria-selected={i === cursor}
                    data-active={i === cursor}
                    onClick={() => go(hit.item.href)}
                    onMouseEnter={() => setCursor(i)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2,
                      width: '100%', padding: '7px 10px', border: 'none', textAlign: 'left',
                      borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                      fontFamily: 'var(--font-sans)',
                      background: i === cursor ? 'var(--blue-100)' : 'transparent',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'baseline', gap: 6, width: '100%' }}>
                      <span style={{ fontSize: 14, fontWeight: 500, color: i === cursor ? 'var(--primary)' : 'var(--gray-800)' }}>
                        {hit.item.name}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--gray-500)', marginLeft: 'auto', whiteSpace: 'nowrap' }}>
                        {hit.item.group}
                      </span>
                    </span>
                    {/* Say *why* this matched when it wasn't the name — otherwise
                        "toast → Snackbar" looks like the search misfired. */}
                    {hit.via ? (
                      <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>
                        matches “{hit.via}”
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: 11, color: 'var(--muted-foreground)', lineHeight: 1.35,
                          display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}
                      >
                        {hit.item.detail}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 4 }}>
            <div style={{ padding: '0 12px 8px', fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--gray-500)' }}>
              Foundations
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {FOUNDATION_SECTIONS.map((f) => {
                const hash = `#/foundations/${f.slug}`
                const active = route === hash || (f.slug === 'colors' && route === '#/foundations')
                return (
                  <button key={f.slug} type="button" onClick={() => onNavigate(hash)} style={linkStyle(active, false)}>
                    <span>{f.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {TOP_LEVEL.map((p, i) => (
            <button
              key={p.hash}
              type="button"
              onClick={() => onNavigate(p.hash)}
              style={{ ...linkStyle(route === p.hash, false), marginTop: i === 0 ? 0 : 4 }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>{p.icon}</span>
                {p.label}
              </span>
              {p.badge && (
                <span style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase',
                  color: route === p.hash ? 'var(--primary)' : 'var(--gray-400)',
                  background: route === p.hash ? 'var(--blue-100)' : 'var(--gray-100)',
                  borderRadius: 'var(--radius-xs)', padding: '1px 5px',
                }}>
                  {p.badge}
                </span>
              )}
            </button>
          ))}

          {navigation.map((group) => (
            <div key={group.category} style={{ marginTop: 20 }}>
              <div style={{ padding: '0 12px 8px', fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--gray-500)' }}>
                {group.label}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {group.items.map((item) => {
                  const hash = `#/component/${item.slug}`
                  const active = route === hash
                  const disabled = item.status === 'coming-soon'
                  return (
                    <button
                      key={item.slug}
                      type="button"
                      disabled={disabled}
                      onClick={() => !disabled && onNavigate(hash)}
                      style={linkStyle(active, disabled)}
                    >
                      <span>{item.name}</span>
                      {disabled && (
                        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', color: 'var(--gray-400)' }}>
                          Soon
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </>
      )}
    </nav>
  )
}
