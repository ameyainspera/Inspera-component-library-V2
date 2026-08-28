import { type CSSProperties, type ReactNode, useState } from 'react'

// ---------------------------------------------------------------------------
// Section heading used across doc panels.
// ---------------------------------------------------------------------------
export function SectionTitle({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: 'var(--gray-900)' }}>{children}</h2>
      {sub && <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--muted-foreground)' }}>{sub}</p>}
    </div>
  )
}

export function Panel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <section
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 24,
        ...style,
      }}
    >
      {children}
    </section>
  )
}

// ---------------------------------------------------------------------------
// Copy-to-clipboard button with a transient "Copied" acknowledgement.
// ---------------------------------------------------------------------------
export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 1600)
        } catch {
          /* clipboard unavailable */
        }
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 32,
        padding: '0 12px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-strong)',
        background: copied ? 'var(--primary)' : '#FFFFFF',
        color: copied ? '#FFFFFF' : 'var(--gray-800)',
        fontFamily: 'var(--font-sans)',
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 120ms ease',
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 16 }} aria-hidden>
        {copied ? 'check' : 'content_copy'}
      </span>
      {copied ? 'Copied' : label}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Monospace code / spec block with an integrated copy affordance.
// ---------------------------------------------------------------------------
export function CodeBlock({ code, language, copyLabel }: { code: string; language?: string; copyLabel?: string }) {
  return (
    <div
      style={{
        position: 'relative',
        background: 'var(--gray-900)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--gray-500)' }}>
          {language ?? 'code'}
        </span>
        <CopyButton text={code} label={copyLabel ?? 'Copy'} />
      </div>
      <pre
        style={{
          margin: 0,
          padding: 16,
          overflowX: 'auto',
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          lineHeight: 1.6,
          color: '#E8EDF2',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Segmented control used to drive the interactive playground.
// ---------------------------------------------------------------------------
export function SegmentedControl({
  label, options, value, onChange,
}: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>
        {label}
      </span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {options.map((opt) => {
          const active = opt === value
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              style={{
                height: 32,
                padding: '0 12px',
                borderRadius: 'var(--radius-sm)',
                border: `1px solid ${active ? 'var(--primary)' : 'var(--border-strong)'}`,
                background: active ? 'var(--primary)' : '#FFFFFF',
                color: active ? '#FFFFFF' : 'var(--gray-700)',
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 120ms ease',
              }}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Preview surface with the signature Inspera dot-grid backdrop.
// ---------------------------------------------------------------------------
export function PreviewCanvas({
  children,
  minHeight = 220,
  contentWidth = 480,
}: {
  children: ReactNode
  minHeight?: number
  /**
   * Width budget for the previewed component. Components size to their
   * container rather than carrying a fixed width, so the *canvas* decides how
   * wide a preview should be — the component never does.
   */
  contentWidth?: number
}) {
  return (
    <div
      style={{
        position: 'relative',
        minHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        backgroundColor: '#f8fbff',
        backgroundImage: 'radial-gradient(circle at center, rgba(157, 200, 255, 0.45) 1.2px, transparent 1.4px)',
        backgroundSize: '18px 18px',
        overflow: 'visible',
      }}
    >
      <div style={{ width: '100%', maxWidth: contentWidth, display: 'flex', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  )
}
