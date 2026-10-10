import { type CSSProperties, type ReactNode, useEffect, useId, useRef, useState } from 'react'
import { Tooltip } from '../components/inspera'

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

/** An info icon beside a row name; its explanation shows on hover or focus. */
export function InfoTip({ label, text }: { label: string; text: string }) {
  return (
    <Tooltip content={text}>
      <button
        type="button"
        aria-label={`About ${label}`}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, padding: 0, border: 'none', borderRadius: 'var(--radius-pill)', background: 'transparent', color: 'var(--gray-600)', cursor: 'help' }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }} aria-hidden>info</span>
      </button>
    </Tooltip>
  )
}

/**
 * A long reference panel that starts closed, so the page leads with what most
 * readers came for. The title is the button: its accessible name stays the
 * section title, and aria-expanded says whether it is open. The rest of the
 * header row toggles too, for the pointer only, so an info icon can sit beside
 * the title without nesting one button in another. The content is not
 * rendered until it is opened.
 */
export function CollapsibleSection({ title, summary, info, children }: { title: string; summary?: ReactNode; info?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const toggle = () => setOpen((o) => !o)
  return (
    <Panel>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <h2 style={{ margin: 0 }}>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={id}
            onClick={toggle}
            style={{ padding: 0, border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', fontSize: 18, fontWeight: 600, color: 'var(--gray-900)' }}
          >
            {title}
          </button>
        </h2>
        {info && <InfoTip label={title} text={info} />}
        <div
          aria-hidden
          onClick={toggle}
          style={{ flex: 1, alignSelf: 'stretch', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2, minWidth: 0, cursor: 'pointer', fontSize: 13, fontWeight: 500, color: 'var(--primary)' }}
        >
          {open ? 'Hide' : 'Show'}
          <span className="material-symbols-outlined" style={{ fontSize: 20, transform: open ? 'rotate(180deg)' : undefined }}>expand_more</span>
        </div>
      </div>
      {summary && <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--muted-foreground)', maxWidth: 720 }}>{summary}</p>}
      <div id={id} hidden={!open} style={{ marginTop: 16 }}>
        {open && children}
      </div>
    </Panel>
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
      className="inspera-interactive"
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
        background: copied ? 'var(--primary)' : 'var(--surface)',
        color: copied ? 'var(--white)' : 'var(--gray-800)',
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
//
// Capped by default. A spec block runs to 200+ lines and nobody reads it in a
// browser - they press Copy - so letting it set the page height just buries
// every panel underneath it. The cap lands just past the rules, which is the
// part worth skimming, and the rest scrolls. Copy always takes the whole
// thing regardless of what is visible.
// ---------------------------------------------------------------------------
const CODE_MAX_HEIGHT = 440

export function CodeBlock({
  code, language, copyLabel, maxHeight = CODE_MAX_HEIGHT, headerLeft, footer,
}: {
  code: string
  language?: string
  copyLabel?: string
  /** Visible height before scrolling. Pass `0` to let the block run full length. */
  maxHeight?: number
  /**
   * Replaces the language label in the block's own header bar. Controls that
   * decide *what code is shown* belong inside the panel they act on - put them
   * outside and they read as more component variants, which is what the
   * playground's controls directly above already look like.
   */
  headerLeft?: ReactNode
  /** A short note in a bar under the code, aligned right. */
  footer?: ReactNode
}) {
  const pre = useRef<HTMLPreElement>(null)
  const [overflowing, setOverflowing] = useState(false)
  const [atEnd, setAtEnd] = useState(false)
  const [scrolls, setScrolls] = useState(false)

  useEffect(() => {
    const el = pre.current
    if (!el) return
    // Re-measure when the code changes: the playground rewrites its snippet on
    // every control change, and a stale measurement leaves the fade stranded.
    const measure = () => {
      const scrollable = el.scrollHeight - el.clientHeight
      setOverflowing(scrollable > 1)
      setAtEnd(el.scrollTop >= scrollable - 1)
      // Long lines scroll sideways too; either way the block has to be
      // reachable by keyboard, or its hidden part is mouse-only.
      setScrolls(scrollable > 1 || el.scrollWidth - el.clientWidth > 1)
    }
    measure()
    el.addEventListener('scroll', measure, { passive: true })
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', measure)
      ro.disconnect()
    }
  }, [code, maxHeight])

  const lines = code.split('\n').length

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
        {headerLeft ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            {headerLeft}
            {overflowing && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--gray-400)' }}>
                {lines} lines
              </span>
            )}
          </div>
        ) : (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--gray-400)' }}>
            {language ?? 'code'}
            {overflowing && ` | ${lines} lines`}
          </span>
        )}
        <CopyButton text={code} label={copyLabel ?? 'Copy'} />
      </div>
      {/* The fade is positioned against this wrapper, so it never covers the footer. */}
      <div style={{ position: 'relative' }}>
      <pre
        ref={pre}
        tabIndex={scrolls ? 0 : undefined}
        aria-label={scrolls ? `${language ?? 'Code'} (scrollable)` : undefined}
        style={{
          margin: 0,
          padding: 16,
          // Both axes: a long spec line still scrolls sideways as before.
          overflow: 'auto',
          maxHeight: maxHeight || undefined,
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          lineHeight: 1.6,
          color: '#E8EDF2',
        }}
      >
        <code>{code}</code>
      </pre>
      {/* Fades the cut edge so a capped block reads as "there is more" rather
          than as a block that happens to end mid-sentence. */}
      {overflowing && !atEnd && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            insetInline: 0,
            bottom: 0,
            height: 44,
            pointerEvents: 'none',
            background: 'linear-gradient(to bottom, rgba(39,39,39,0), var(--gray-900))',
          }}
        />
      )}
      </div>
      {footer && (
        <div
          style={{
            padding: '8px 12px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            textAlign: 'right',
            fontSize: 12,
            lineHeight: 1.5,
            color: 'var(--gray-400)',
          }}
        >
          {footer}
        </div>
      )}
    </div>
  )
}

/**
 * Switches which code a panel is showing. Lives inside the dark header bar so
 * it cannot be mistaken for the playground's variant controls: those change
 * the component, this changes the view of it, and identical styling made the
 * two read as one row of switches.
 */
export function CodeTabs({
  value, onChange, options,
}: {
  value: string
  onChange: (v: string) => void
  options: { id: string; label: string }[]
}) {
  return (
    <div
      // Not role="tablist": these sit *inside* the panel they switch, so the
      // tabs pattern would promise a tab/tabpanel relationship the DOM does
      // not have. Toggle buttons describe what this actually is.
      aria-label="Code format"
      style={{
        display: 'inline-flex',
        gap: 2,
        padding: 2,
        background: 'rgba(255,255,255,0.08)',
        borderRadius: 'var(--radius-sm)',
      }}
    >
      {options.map((o) => {
        const active = o.id === value
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.id)}
            style={{
              height: 22,
              padding: '0 10px',
              border: 'none',
              borderRadius: 3,
              background: active ? 'var(--white)' : 'transparent',
              color: active ? 'var(--gray-900)' : 'var(--gray-400)',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 0.6,
              textTransform: 'uppercase',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Segmented control used to drive the interactive playground.
// ---------------------------------------------------------------------------
export function SegmentedControl({
  label, options, value, onChange, defaultValue, showLabel = true, disabled = false,
}: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
  /** Marked with a dot, so the default is visible without reordering options. */
  defaultValue?: string
  /** Off when a surrounding row already shows the name; it stays the group's accessible name. */
  showLabel?: boolean
  /** Held at its value while another control rules the others out. */
  disabled?: boolean
}) {
  return (
    <div role="group" aria-label={label} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {showLabel && (
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>
          {label}
        </span>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {options.map((opt) => {
          const active = opt === value
          return (
            <button
              key={opt}
              type="button"
              className="inspera-interactive"
              aria-pressed={active}
              disabled={disabled}
              onClick={() => onChange(opt)}
              title={opt === defaultValue ? 'Default' : undefined}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                height: 32,
                padding: '0 12px',
                borderRadius: 'var(--radius-sm)',
                border: `1px solid ${active ? 'var(--primary)' : 'var(--border-strong)'}`,
                background: active ? 'var(--primary)' : 'var(--surface)',
                color: active ? 'var(--white)' : 'var(--gray-700)',
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.45 : 1,
              }}
            >
              {opt}
              {opt === defaultValue && (
                <span
                  aria-label="(default)"
                  style={{ width: 5, height: 5, borderRadius: 'var(--radius-pill)', background: active ? 'var(--white)' : 'var(--gray-500)' }}
                />
              )}
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
  align = 'center',
  floating = false,
}: {
  children: ReactNode
  minHeight?: number
  /** Holds an open panel that must not be clipped; the canvas does not scroll. */
  floating?: boolean
  /**
   * Width budget for the previewed component. Components size to their
   * container rather than carrying a fixed width, so the *canvas* decides how
   * wide a preview should be - the component never does.
   */
  contentWidth?: number
  /** `start` pins the component to the top, for panels that open downward. */
  align?: 'start' | 'center'
}) {
  return (
    <div
      style={{
        position: 'relative',
        minHeight,
        display: 'flex',
        alignItems: align === 'start' ? 'flex-start' : 'center',
        justifyContent: 'center',
        padding: 32,
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        backgroundColor: 'var(--canvas-bg)',
        backgroundImage: 'radial-gradient(circle at center, var(--canvas-dot) 1.2px, transparent 1.4px)',
        backgroundSize: '18px 18px',
        // Scrolls sideways rather than spilling out when a wide component meets
        // a narrow window - except around an open panel, which must stay whole.
        ...(floating ? { overflow: 'visible' } : { overflowX: 'auto' }),
      }}
    >
      <div style={{ width: '100%', maxWidth: contentWidth, display: 'flex', justifyContent: 'center', minWidth: 0 }}>
        {children}
      </div>
    </div>
  )
}
