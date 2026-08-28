import { useState, useMemo, useCallback, useEffect } from 'react'
import { iconsByCategory, allIcons, ICON_CATEGORIES, totalIconCount } from '../data/icons'
import type { IconCategory } from '../data/icons'
import type { IconStyle } from '../components/inspera/Icon'

type Fill = 0 | 1
type Weight = 100 | 200 | 300 | 400 | 500 | 600 | 700

const WEIGHTS: Weight[] = [100, 200, 300, 400, 500, 600, 700]

const styleClass: Record<IconStyle, string> = {
  outlined: 'material-symbols-outlined',
  rounded: 'material-symbols-rounded',
  sharp: 'material-symbols-sharp',
}

function CopyToast({ name }: { name: string }) {
  return (
    <div
      style={{
        position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        background: 'var(--gray-900)', color: '#fff', borderRadius: 'var(--radius-sm)',
        padding: '10px 16px', fontSize: 13, fontWeight: 500, zIndex: 9999,
        display: 'flex', alignItems: 'center', gap: 8, pointerEvents: 'none',
        boxShadow: 'var(--shadow-300)', whiteSpace: 'nowrap',
        animation: 'toast-in 0.15s ease',
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
      Copied <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, opacity: 0.8 }}>{name}</code>
    </div>
  )
}

interface IconCardProps {
  name: string
  iconClass: string
  fill: Fill
  weight: Weight
  grade: number
  opsz: number
  onCopy: (name: string) => void
}

function IconCard({ name, iconClass, fill, weight, grade, opsz, onCopy }: IconCardProps) {
  const [hovered, setHovered] = useState(false)

  const varSettings = `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opsz}`

  return (
    <button
      type="button"
      title={name}
      onClick={() => onCopy(name)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 8, padding: '14px 8px 12px', border: 'none', cursor: 'pointer',
        borderRadius: 'var(--radius-md)', textAlign: 'center',
        background: hovered ? 'var(--blue-100)' : 'transparent',
        transition: 'background 0.1s',
        minWidth: 0,
      }}
    >
      <span
        className={iconClass}
        style={{ fontSize: 28, color: hovered ? 'var(--primary)' : 'var(--gray-700)', fontVariationSettings: varSettings, transition: 'color 0.1s' }}
        aria-hidden
      >
        {name}
      </span>
      <span style={{
        fontSize: 10, color: hovered ? 'var(--primary)' : 'var(--muted-foreground)',
        fontFamily: 'var(--font-mono)', lineHeight: 1.3, wordBreak: 'break-all',
        maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        transition: 'color 0.1s',
      }}>
        {name}
      </span>
    </button>
  )
}

export default function IconsPage() {
  const [iconStyle, setIconStyle] = useState<IconStyle>('outlined')
  const [fill, setFill] = useState<Fill>(0)
  const [weight, setWeight] = useState<Weight>(400)
  const [grade] = useState(0)
  const [opsz, setOpsz] = useState(24)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<IconCategory>('All')
  const [toast, setToast] = useState<string | null>(null)
  const [toastKey, setToastKey] = useState(0)

  const copyIcon = useCallback((name: string) => {
    try {
      const ta = document.createElement('textarea')
      ta.value = name
      ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    } catch {}
    setToast(name)
    setToastKey((k) => k + 1)
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2000)
    return () => clearTimeout(t)
  }, [toast, toastKey])

  const filtered = useMemo(() => {
    const pool = category === 'All' ? allIcons : iconsByCategory[category as Exclude<IconCategory, 'All'>] ?? []
    if (!search.trim()) return pool
    const q = search.trim().toLowerCase().replace(/[\s-]+/g, '_')
    return pool.filter((n) => n.includes(q))
  }, [category, search])

  const iconClass = styleClass[iconStyle]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <style>{`
        @keyframes toast-in { from { opacity: 0; transform: translateX(-50%) translateY(8px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
      `}</style>

      {/* ── Static header ── */}
      <div style={{ flexShrink: 0, padding: '32px 40px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--primary)', marginBottom: 6 }}>
            Icons
          </div>
          <h1 style={{ margin: '0 0 8px', fontSize: 32, fontWeight: 600, letterSpacing: -0.5 }}>
            Material Symbols
          </h1>
          <p style={{ margin: 0, fontSize: 15, color: 'var(--muted-foreground)', maxWidth: 640 }}>
            {totalIconCount.toLocaleString()} icons across {ICON_CATEGORIES.length - 1} categories — three styles, variable weight, fill, grade, and optical size. Click any icon to copy its name.
          </p>
        </div>
      </div>

      {/* ── Static controls (no sticky — sits above its own scroll zone) ── */}
      <div style={{ flexShrink: 0, background: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '12px 40px 16px' }}>
        <div
        style={{
          display: 'flex', flexDirection: 'column', gap: 12,
        }}
      >
        {/* Row 1: search + style switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 180, maxWidth: 340 }}>
            <span
              className="material-symbols-outlined"
              style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: 'var(--gray-500)', pointerEvents: 'none' }}
              aria-hidden
            >search</span>
            <input
              type="search"
              placeholder="Search icons…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%', height: 36, padding: '0 12px 0 36px', boxSizing: 'border-box',
                border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)',
                fontSize: 14, fontFamily: 'var(--font-sans)', background: 'var(--surface)',
                color: 'var(--text-primary)', outline: 'none',
              }}
            />
          </div>

          {/* Style switcher */}
          <div style={{ display: 'flex', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
            {(['outlined', 'rounded', 'sharp'] as IconStyle[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setIconStyle(s)}
                style={{
                  height: 36, padding: '0 14px', border: 'none', cursor: 'pointer', fontSize: 13,
                  fontWeight: 500, fontFamily: 'var(--font-sans)', textTransform: 'capitalize',
                  background: iconStyle === s ? 'var(--primary)' : 'var(--surface)',
                  color: iconStyle === s ? '#fff' : 'var(--gray-700)',
                  borderRight: s !== 'sharp' ? '1px solid var(--border-strong)' : 'none',
                  transition: 'background 0.1s, color 0.1s',
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* FILL toggle */}
          <button
            type="button"
            onClick={() => setFill(fill === 0 ? 1 : 0)}
            style={{
              height: 36, padding: '0 14px', border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 13, fontWeight: 500,
              fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: 6,
              background: fill === 1 ? 'var(--blue-100)' : 'var(--surface)',
              color: fill === 1 ? 'var(--primary)' : 'var(--gray-700)',
              transition: 'background 0.1s, color 0.1s', flexShrink: 0,
            }}
          >
            <span
              className={iconClass}
              style={{ fontSize: 18, fontVariationSettings: `'FILL' ${fill}, 'wght' 400, 'GRAD' 0, 'opsz' 24` }}
              aria-hidden
            >
              favorite
            </span>
            Fill {fill === 1 ? 'on' : 'off'}
          </button>

          {/* Weight selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 12, color: 'var(--muted-foreground)', fontWeight: 500 }}>wght</span>
            <div style={{ display: 'flex', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              {WEIGHTS.map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWeight(w)}
                  style={{
                    height: 28, padding: '0 8px', border: 'none', cursor: 'pointer',
                    fontSize: 11, fontWeight: 500, fontFamily: 'var(--font-sans)',
                    borderRight: w !== 700 ? '1px solid var(--border)' : 'none',
                    background: weight === w ? 'var(--primary)' : 'var(--surface)',
                    color: weight === w ? '#fff' : 'var(--gray-600)',
                    transition: 'background 0.1s, color 0.1s',
                  }}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Optical size */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 12, color: 'var(--muted-foreground)', fontWeight: 500 }}>opsz</span>
            <div style={{ display: 'flex', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              {([20, 24, 40, 48] as const).map((o, i, arr) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => setOpsz(o)}
                  style={{
                    height: 28, padding: '0 10px', border: 'none', cursor: 'pointer',
                    fontSize: 11, fontWeight: 500, fontFamily: 'var(--font-sans)',
                    borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                    background: opsz === o ? 'var(--primary)' : 'var(--surface)',
                    color: opsz === o ? '#fff' : 'var(--gray-600)',
                    transition: 'background 0.1s, color 0.1s',
                  }}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: category chips */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
          {ICON_CATEGORIES.map((cat) => {
            const count = cat === 'All'
              ? allIcons.length
              : (iconsByCategory[cat as Exclude<IconCategory, 'All'>] ?? []).length
            const active = category === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                style={{
                  height: 28, padding: '0 12px', border: '1px solid', cursor: 'pointer',
                  borderRadius: 'var(--radius-pill)', fontSize: 12, fontWeight: 500,
                  fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap', flexShrink: 0,
                  borderColor: active ? 'var(--primary)' : 'var(--border-strong)',
                  background: active ? 'var(--primary)' : 'var(--surface)',
                  color: active ? '#fff' : 'var(--gray-700)',
                  transition: 'background 0.1s, color 0.1s, border-color 0.1s',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                {cat}
                <span style={{
                  background: active ? 'rgba(255,255,255,0.25)' : 'var(--gray-200)',
                  color: active ? '#fff' : 'var(--gray-600)',
                  borderRadius: 'var(--radius-pill)', padding: '0 5px', fontSize: 10, fontWeight: 600,
                  lineHeight: '16px', display: 'inline-block', minWidth: 20, textAlign: 'center',
                }}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
        </div>{/* end inner maxWidth wrapper */}
        </div>{/* end controls panel */}
      </div>{/* end static controls zone */}

      {/* ── Scrollable content ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 40px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

      {/* Results count */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 20, fontWeight: 600, color: 'var(--gray-900)' }}>
          {filtered.length.toLocaleString()}
        </span>
        <span style={{ fontSize: 14, color: 'var(--muted-foreground)' }}>
          icon{filtered.length !== 1 ? 's' : ''}
          {search.trim() ? ` matching "${search.trim()}"` : ''}
          {category !== 'All' ? ` in ${category}` : ''}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
          {iconStyle} · fill={fill} · wght={weight} · opsz={opsz}
        </span>
      </div>

      {/* Icon grid */}
      {filtered.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '64px 0', color: 'var(--muted-foreground)' }}>
          <span className={iconClass} style={{ fontSize: 48, marginBottom: 12, opacity: 0.4 }} aria-hidden>search_off</span>
          <div style={{ fontSize: 16, fontWeight: 500 }}>No icons found</div>
          <div style={{ fontSize: 14, marginTop: 4 }}>Try a different search term or category</div>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))',
            gap: 4,
          }}
        >
          {filtered.map((name) => (
            <IconCard
              key={name}
              name={name}
              iconClass={iconClass}
              fill={fill}
              weight={weight}
              grade={grade}
              opsz={opsz}
              onCopy={copyIcon}
            />
          ))}
        </div>
      )}

      {/* Usage reference */}
      <div
        style={{
          marginTop: 40, padding: '24px 28px', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)', background: 'var(--surface)',
          display: 'flex', flexDirection: 'column', gap: 16,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-800)' }}>Usage reference</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--muted-foreground)', marginBottom: 8 }}>HTML / JSX</div>
            <pre style={{
              margin: 0, padding: '10px 12px', background: 'var(--gray-100)', borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gray-800)', overflowX: 'auto',
            }}>{`<span class="material-symbols-${iconStyle}"\n  style="font-variation-settings:\n    'FILL' ${fill},'wght' ${weight},\n    'GRAD' 0,'opsz' ${opsz}">\n  icon_name\n</span>`}</pre>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--muted-foreground)', marginBottom: 8 }}>Inspera Icon component</div>
            <pre style={{
              margin: 0, padding: '10px 12px', background: 'var(--gray-100)', borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gray-800)', overflowX: 'auto',
            }}>{`import Icon from '@/components/inspera/Icon'\n\n<Icon\n  name="icon_name"\n  style="${iconStyle}"\n  fill={${fill}}\n  weight={${weight}}\n  opticalSize={${opsz}}\n/>`}</pre>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--muted-foreground)', marginBottom: 8 }}>CSS import</div>
            <pre style={{
              margin: 0, padding: '10px 12px', background: 'var(--gray-100)', borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gray-800)', overflowX: 'auto',
            }}>{`/* Google Fonts CSS2 — all 3 styles */\n@import url(\n  'fonts.googleapis.com/css2?\n  family=Material+Symbols+Outlined:\n  opsz,wght,FILL,GRAD\n  @20..48,100..700,0..1,-25..200'\n);`}</pre>
          </div>
        </div>

        {/* Live preview strip */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--muted-foreground)', marginBottom: 10 }}>
            Live preview — current settings across all three styles
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {(['outlined', 'rounded', 'sharp'] as IconStyle[]).map((s) => (
              <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['home', 'settings', 'favorite', 'star', 'person', 'notifications', 'search', 'add'].map((n) => (
                    <span
                      key={n}
                      className={styleClass[s]}
                      aria-hidden
                      style={{
                        fontSize: 24,
                        fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opsz}`,
                        color: s === iconStyle ? 'var(--primary)' : 'var(--gray-500)',
                      }}
                    >
                      {n}
                    </span>
                  ))}
                </div>
                <span style={{ fontSize: 11, color: s === iconStyle ? 'var(--primary)' : 'var(--muted-foreground)', fontWeight: s === iconStyle ? 600 : 400 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

        </div>{/* end inner maxWidth wrapper */}
      </div>{/* end scrollable zone */}

      {toast && <CopyToast key={toastKey} name={toast} />}
    </div>
  )
}
