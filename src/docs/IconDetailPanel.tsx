import { useEffect, useState } from 'react'
import { fetchIconSvg, toJsx, extractPathData, SVG_SIZES, type IconAxes, type IconStyleName } from './iconSvg'

const WEIGHTS = [100, 200, 300, 400, 500, 600, 700]
const GRADES = [-25, 0, 200]
const PREVIEW_SIZES = [18, 24, 36, 48]

function Row({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-900)' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted-foreground)' }}>{value}</span>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>{children}</div>
    </div>
  )
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="inspera-interactive"
      style={{
        flex: '1 1 0', minWidth: 0, height: 38, padding: '0 4px',
        borderRadius: 'var(--radius-sm)',
        border: `var(--border-width-default) solid ${active ? 'var(--primary)' : 'var(--border-strong)'}`,
        background: active ? 'var(--primary)' : 'var(--surface)',
        color: active ? 'var(--white)' : 'var(--gray-800)',
        fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: active ? 600 : 400,
        whiteSpace: 'nowrap',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

/** Copy that reports what actually happened, including failure. */
function CopyRow({ label, icon, get }: { label: string; icon: string; get: () => Promise<string> }) {
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (status === 'idle') return
    const t = setTimeout(() => setStatus('idle'), 2600)
    return () => clearTimeout(t)
  }, [status])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <button
        type="button"
        className="inspera-interactive"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(await get())
            setStatus('ok')
          } catch (e) {
            setMessage(e instanceof Error ? e.message : 'Copy failed.')
            setStatus('error')
          }
        }}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          width: '100%', height: 40, borderRadius: 'var(--radius-sm)',
          border: `var(--border-width-default) solid ${status === 'error' ? 'var(--error)' : 'var(--primary)'}`,
          background: status === 'ok' ? 'var(--primary)' : 'var(--surface)',
          color: status === 'ok' ? 'var(--white)' : status === 'error' ? 'var(--error)' : 'var(--primary)',
          fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>
          {status === 'ok' ? 'check' : status === 'error' ? 'error' : icon}
        </span>
        {status === 'ok' ? 'Copied' : label}
      </button>
      {status === 'error' && (
        <p style={{ margin: 0, fontSize: 12, color: 'var(--error)', lineHeight: 1.4 }}>{message}</p>
      )}
    </div>
  )
}

export default function IconDetailPanel({
  name, iconStyle, category, onClose,
}: {
  name: string
  iconStyle: IconStyleName
  category: string
  onClose: () => void
}) {
  const [axes, setAxes] = useState<IconAxes>({ fill: 0, weight: 400, grade: 0, opticalSize: 24 })
  const set = <K extends keyof IconAxes>(k: K, v: IconAxes[K]) => setAxes((a) => ({ ...a, [k]: v }))

  // Reset the axes when a different icon is opened.
  useEffect(() => setAxes({ fill: 0, weight: 400, grade: 0, opticalSize: 24 }), [name])

  const varSettings = `'FILL' ${axes.fill}, 'wght' ${axes.weight}, 'GRAD' ${axes.grade}, 'opsz' ${axes.opticalSize}`
  const iconClass = `material-symbols-${iconStyle}`

  return (
    <aside
      aria-label={`${name} detail`}
      style={{
        width: 320, flexShrink: 0, height: '100%', overflowY: 'auto',
        borderLeft: '1px solid var(--border)', background: 'var(--surface)',
        padding: 20, boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', gap: 20,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close icon details"
          className="inspera-interactive"
          style={{
            display: 'inline-flex', border: 'none', background: 'none',
            padding: 4, cursor: 'pointer', color: 'var(--gray-700)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>close</span>
        </button>
      </div>

      {/* Live preview, reflecting every axis */}
      <div
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          padding: '28px 16px', borderRadius: 'var(--radius-md)', background: 'var(--gray-100)',
        }}
      >
        <span className={iconClass} style={{ fontSize: 64, fontVariationSettings: varSettings, color: 'var(--gray-900)' }} aria-hidden>
          {name}
        </span>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 600, marginTop: 10, wordBreak: 'break-all', textAlign: 'center' }}>
          {name}
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>{category}</div>
      </div>

      <Row label="Fill" value={String(axes.fill)}>
        <Choice active={axes.fill === 0} onClick={() => set('fill', 0)}>Off</Choice>
        <Choice active={axes.fill === 1} onClick={() => set('fill', 1)}>On</Choice>
      </Row>

      <Row label="Weight" value={String(axes.weight)}>
        {WEIGHTS.map((w) => (
          <Choice key={w} active={axes.weight === w} onClick={() => set('weight', w)}>{w}</Choice>
        ))}
      </Row>

      <Row label="Grade" value={String(axes.grade)}>
        {GRADES.map((g) => (
          <Choice key={g} active={axes.grade === g} onClick={() => set('grade', g)}>{g}</Choice>
        ))}
      </Row>

      <Row label="Optical size" value={`${axes.opticalSize}dp`}>
        {SVG_SIZES.map((s) => (
          <Choice key={s} active={axes.opticalSize === s} onClick={() => set('opticalSize', s)}>{s}</Choice>
        ))}
      </Row>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around' }}>
          {PREVIEW_SIZES.map((s) => (
            <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <span className={iconClass} style={{ fontSize: s, fontVariationSettings: varSettings }} aria-hidden>{name}</span>
              <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{s}px</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-900)' }}>Copy</div>
        <CopyRow label="Copy SVG" icon="download" get={() => fetchIconSvg(name, iconStyle, axes)} />
        <CopyRow
          label="Copy path data"
          icon="polyline"
          get={async () => extractPathData(await fetchIconSvg(name, iconStyle, axes))}
        />
        <CopyRow
          label="Copy as React component"
          icon="code"
          get={async () => toJsx(name, await fetchIconSvg(name, iconStyle, axes))}
        />
        <CopyRow
          label="Copy Inspera markup"
          icon="content_copy"
          get={async () =>
            `<span className="${iconClass}" style={{ fontVariationSettings: "${varSettings}" }} aria-hidden>${name}</span>`
          }
        />
      </div>

      <p style={{ margin: 0, fontSize: 12, color: 'var(--muted-foreground)', lineHeight: 1.5 }}>
        Material Symbols is a variable font, so there is no SVG on this page to copy. The SVG
        buttons fetch the matching file from Google&rsquo;s icon repository, which means they need
        a network connection — and not every axis combination is published.
      </p>
    </aside>
  )
}
