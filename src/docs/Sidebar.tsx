import { navigation } from '../data/navigation'

interface SidebarProps {
  route: string
  onNavigate: (hash: string) => void
}

export default function Sidebar({ route, onNavigate }: SidebarProps) {
  const linkStyle = (active: boolean, disabled: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    padding: '7px 12px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 14,
    fontWeight: active ? 600 : 400,
    color: disabled ? 'var(--gray-400)' : active ? 'var(--primary)' : 'var(--gray-700)',
    background: active ? 'var(--blue-100)' : 'transparent',
    cursor: disabled ? 'default' : 'pointer',
    textDecoration: 'none',
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
        padding: '20px 16px',
        boxSizing: 'border-box',
      }}
    >
      <button
        type="button"
        onClick={() => onNavigate('#/foundations')}
        style={linkStyle(route === '#/foundations', false)}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>palette</span>
          Foundations
        </span>
      </button>

      <button
        type="button"
        onClick={() => onNavigate('#/icons')}
        style={{ ...linkStyle(route === '#/icons', false), marginTop: 4 }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>interests</span>
          Icons
        </span>
        <span style={{
          fontSize: 10, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase',
          color: route === '#/icons' ? 'var(--primary)' : 'var(--gray-400)',
          background: route === '#/icons' ? 'var(--blue-100)' : 'var(--gray-100)',
          borderRadius: 'var(--radius-xs)', padding: '1px 5px',
        }}>
          3k+
        </span>
      </button>

      <button
        type="button"
        onClick={() => onNavigate('#/integrate')}
        style={{ ...linkStyle(route === '#/integrate', false), marginTop: 4 }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>rocket_launch</span>
          Integrate
        </span>
      </button>

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
    </nav>
  )
}
