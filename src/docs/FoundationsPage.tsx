import {
  brandColors, semanticColors, brandAccents, palette,
  spacing, radius, shadows, typeScale, systemTokens,
  effects, motion, zIndex, breakpoints, borderWidths, focusRing,
} from '../data/tokens'
import { radiusUsage } from '../data/radius-usage.generated'
import { Panel, SectionTitle, CopyButton } from './primitives'

/** #RRGGBB -> "rgb(r, g, b)". Designers read hex; developers often need rgb. */
function toRgb(hex: string): string | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return null
  const n = parseInt(m[1], 16)
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`
}

/** The whole family end to end, so the progression reads at a glance. */
function RampStrip({ shades }: { shades: Record<string, string> }) {
  return (
    <div style={{ display: 'flex', height: 56, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
      {Object.entries(shades).map(([shade, hex]) => (
        <div key={shade} title={`${shade} · ${hex}`} style={{ flex: 1, background: hex }} />
      ))}
    </div>
  )
}

/** One shade: swatch, name, hex, rgb, and a copy control. */
function ShadeCard({ label, hex }: { label: string; hex: string }) {
  const rgb = toRgb(hex)
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--surface)' }}>
      <div style={{ height: 64, background: hex, borderBottom: '1px solid var(--border)' }} />
      <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-900)' }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted-foreground)' }}>{hex.toUpperCase()}</div>
        {rgb && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted-foreground)' }}>{rgb}</div>}
        <div style={{ marginTop: 4 }}><CopyButton text={hex.toUpperCase()} label="Copy" /></div>
      </div>
    </div>
  )
}

/** A named role: swatch, token, resolved value, and the variable to reference. */
function TokenRow({ name, value, cssVar, note }: { name: string; value: string; cssVar: string; note?: string }) {
  const rgb = value.startsWith('#') ? toRgb(value) : null
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <div
        style={{
          width: 44, height: 44, flexShrink: 0, borderRadius: 'var(--radius-sm)',
          background: value, border: '1px solid var(--border)',
        }}
        aria-hidden
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)' }}>{name}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted-foreground)' }}>
          {value}{rgb ? ` · ${rgb}` : ''}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--primary)' }}>{cssVar}</div>
        {note && <div style={{ fontSize: 12, color: 'var(--gray-700)', marginTop: 2 }}>{note}</div>}
      </div>
      <div style={{ flexShrink: 0 }}><CopyButton text={cssVar} label="Copy" /></div>
    </div>
  )
}

function TokenGroup({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h3 style={{ margin: '0 0 2px', fontSize: 16, fontWeight: 600, color: 'var(--gray-900)' }}>{title}</h3>
      <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--muted-foreground)' }}>{description}</p>
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sections that were documented in the generated spec but never had a page.
// ---------------------------------------------------------------------------

function EffectsSection() {
  return (
    <Panel>
      <SectionTitle sub="Focus rings, validation rings, the button highlight and link underlines. Apply as box-shadow; the colours resolve to palette tokens.">
        Effects
      </SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {effects.map((e) => (
          <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
            <div
              style={{
                width: 92, height: 44, flexShrink: 0, borderRadius: 'var(--radius-sm)',
                background: 'var(--surface)', border: '1px solid var(--border)',
                boxShadow: `var(--effect-${e.name})`,
              }}
              aria-hidden
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>{e.name}</div>
              {e.note && <div style={{ fontSize: 13, color: 'var(--gray-700)' }}>{e.note}</div>}
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted-foreground)', wordBreak: 'break-all' }}>{e.value}</div>
              {e.pending?.length ? (
                <div style={{ fontSize: 12, color: 'var(--warning)' }}>
                  Unconfirmed: {e.pending.join(', ')} — Figma&rsquo;s CSS export drops the spread radius.
                </div>
              ) : null}
            </div>
            <CopyButton text={`var(--effect-${e.name})`} label="Copy" />
          </div>
        ))}
      </div>
    </Panel>
  )
}

function MotionSection() {
  return (
    <Panel>
      <SectionTitle sub="Motion explains a state change; it does not decorate. Under prefers-reduced-motion, non-essential transitions are dropped.">
        Motion
      </SectionTitle>
      <h3 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 600 }}>Duration</h3>
      {motion.duration.map((d) => (
        <div key={d.token} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13, width: 80 }}>{d.token}</code>
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--primary)', width: 170 }}>var(--duration-{d.token})</code>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted-foreground)', width: 60 }}>{d.value}</span>
          <span style={{ fontSize: 13, color: 'var(--gray-700)' }}>{d.note}</span>
        </div>
      ))}
      <h3 style={{ margin: '20px 0 8px', fontSize: 15, fontWeight: 600 }}>Easing</h3>
      {motion.easing.map((e) => (
        <div key={e.token} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13, width: 80 }}>{e.token}</code>
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--primary)', width: 170 }}>var(--easing-{e.token})</code>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted-foreground)', flex: 1, minWidth: 0 }}>{e.value}</span>
          <span style={{ fontSize: 13, color: 'var(--gray-700)' }}>{e.note}</span>
        </div>
      ))}
    </Panel>
  )
}

function LayeringSection() {
  const max = Math.max(...zIndex.map((z) => z.value))
  return (
    <Panel>
      <SectionTitle sub="Which layer sits above which. Use the scale — never an arbitrary value such as 99999.">
        Layering
      </SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {[...zIndex].reverse().map((z) => (
          <div key={z.token} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, width: 90 }}>{z.token}</code>
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--primary)', width: 150 }}>var(--z-{z.token})</code>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted-foreground)', width: 44, textAlign: 'right' }}>{z.value}</span>
            {/* Bar length shows the stacking order at a glance. */}
            <span style={{ height: 8, flex: `0 0 ${Math.max(4, (z.value / max) * 180)}px`, background: 'var(--primary)', borderRadius: 'var(--radius-pill)', opacity: 0.25 + (z.value / max) * 0.75 }} />
            <span style={{ fontSize: 13, color: 'var(--gray-700)' }}>{z.note}</span>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function BreakpointsSection() {
  const max = Math.max(...breakpoints.map((b) => b.value))
  return (
    <Panel>
      <SectionTitle sub="Shared layout thresholds, not device names. Components should respond to the space they are given rather than to a user-agent guess.">
        Breakpoints
      </SectionTitle>
      {breakpoints.map((b) => (
        <div key={b.token} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, width: 44 }}>{b.token}</code>
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--primary)', width: 190 }}>var(--breakpoint-{b.token})</code>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted-foreground)', width: 70 }}>{b.value}px</span>
          <span style={{ height: 10, flex: `0 0 ${(b.value / max) * 260}px`, background: 'var(--blue-300)', borderRadius: 'var(--radius-xs)' }} />
        </div>
      ))}

      <h3 style={{ margin: '24px 0 8px', fontSize: 15, fontWeight: 600 }}>Borders &amp; focus</h3>
      {[...borderWidths.map((b) => ({ name: `border-width-${b.token}`, value: b.value })), ...focusRing].map((t) => (
        <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--primary)', width: 230 }}>var(--{t.name})</code>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted-foreground)' }}>{t.value}</span>
        </div>
      ))}
      <p style={{ margin: '14px 0 0', fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.5 }}>
        Focus is never removed, only replaced by something at least as visible. Every interactive
        component draws its ring from these tokens.
      </p>
    </Panel>
  )
}


export interface FoundationSection {
  slug: string
  label: string
  /** Shown under the page title, and used by sidebar search. */
  description: string
  render: () => React.ReactNode
}

/**
 * Foundations used to be one page carrying every token — roughly 8,500px of
 * scrolling, and five of the twelve documented categories had no page at all.
 * Each category is now its own route under #/foundations/<slug>.
 */
export const FOUNDATION_SECTIONS: FoundationSection[] = [
  {
    slug: 'colors',
    label: 'Palette',
    description: 'The reusable colour shades every component draws from.',
    render: () => (

      <Panel>
        <SectionTitle sub="The reusable palette every component draws from. These carry no meaning on their own — they are the full range of shades each family offers.">
          Foundation colour shades
        </SectionTitle>

        {[{ family: 'white', shades: { default: '#FFFFFF' } }, ...Object.entries(palette).map(([family, shades]) => ({ family, shades }))].map(({ family, shades }) => (
          <div key={family} style={{ marginBottom: 28 }}>
            <h3 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 600, textTransform: 'capitalize', color: 'var(--gray-900)' }}>
              {family}
            </h3>
            {Object.keys(shades).length > 1 && (
              <div style={{ marginBottom: 12 }}><RampStrip shades={shades} /></div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(132px, 1fr))', gap: 10 }}>
              {Object.entries(shades).map(([shade, hex]) => (
                <ShadeCard key={shade} label={shade} hex={hex} />
              ))}
            </div>
          </div>
        ))}
      </Panel>
    ),
  },
  {
    slug: 'semantic-colors',
    label: 'Semantic colours',
    description: 'Purpose-driven tokens for brand, status and interaction.',
    render: () => (
      <Panel>
        <SectionTitle sub="Purpose-driven tokens for brand, status feedback and interaction. Separate from the foundation shades — these carry meaning, so use them for that meaning and nothing else.">
          Semantic &amp; brand tokens
        </SectionTitle>

        <TokenGroup title="Brand" description="Core brand colours for primary actions and emphasis.">
          {brandColors.map((c) => (
            <TokenRow key={c.name} name={c.name} value={c.value} cssVar={`var(--${c.name.replace('.main', '')})`} note={c.note} />
          ))}
        </TokenGroup>

        <TokenGroup title="Semantic" description="Status and feedback. Use each only for the meaning it carries.">
          {semanticColors.map((c) => (
            <TokenRow key={c.name} name={c.name} value={c.value} cssVar={`var(--${c.name})`} />
          ))}
        </TokenGroup>

        <TokenGroup title="Brand accent" description="Used sparingly, only where product design calls for it.">
          {brandAccents.map((c) => (
            <TokenRow key={c.name} name={`accent.${c.name}`} value={c.value} cssVar={`var(--accent-${c.name})`} />
          ))}
        </TokenGroup>

        {Object.entries(systemTokens).map(([group, tokens]) => (
          <TokenGroup
            key={group}
            title={group}
            description={
              group === 'Status' ? 'Tinted surfaces behind status messages.'
                : group === 'Controls' ? 'Borders and fills specific to form controls.'
                : group === 'Surface' ? 'Backgrounds, separators and de-emphasised text.'
                : group === 'Text' ? 'Foreground colours by emphasis.'
                : 'Hover, focus and disabled treatments.'
            }
          >
            {tokens.map((t) => (
              <TokenRow key={t.name} name={t.name} value={t.value} cssVar={`var(--${t.name})`} note={t.note} />
            ))}
          </TokenGroup>
        ))}
      </Panel>
    ),
  },
  {
    slug: 'typography',
    label: 'Typography',
    description: 'The 28 Figma text styles, their metrics and ready-made classes.',
    render: () => (
      <Panel>
        <SectionTitle sub="The 28 Figma text styles. Sizes are exact; Figma exports font-size only, so rows marked ° have a line height or weight inferred rather than measured.">
          Typography
        </SectionTitle>
        {[
          ...(['Default', 'Regular', 'Medium', 'Heading', 'Extended', 'Paragraph', 'Extra', 'Documentation'] as const)
            .map((g) => ({ label: g, rows: typeScale.filter((t) => t.group === g) }))
            .filter((g) => g.rows.length > 0),
        ].map((group) => (
          <div key={group.label} style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--gray-500)', marginBottom: 10 }}>
              {group.label}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {group.rows.map((t) => (
                <div
                  key={t.token}
                  style={{
                    display: 'flex', alignItems: 'baseline', gap: 16,
                    borderBottom: '1px solid var(--border)', padding: '10px 0',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted-foreground)', width: 150, flexShrink: 0 }}>
                    {t.token}
                  </span>
                  <span
                    style={{
                      flex: 1, minWidth: 0, color: 'var(--gray-900)',
                      fontFamily: t.fontFamily,
                      fontSize: t.size,
                      fontWeight: t.weight,
                      lineHeight: t.lineHeight,
                      letterSpacing: t.tracking !== undefined ? t.tracking : undefined,
                      textTransform: t.transform,
                      textDecoration: t.decoration,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}
                  >
                    The quick brown fox jumps over the lazy dog
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted-foreground)', flexShrink: 0, textAlign: 'right', width: 190 }}>
                    {t.size}/{Math.round(t.lineHeight * 100)}% · {t.weight}
                    {t.tracking !== undefined && ` · ${t.tracking > 0 ? '+' : ''}${t.tracking}`}
                    {t.pending?.length ? <span title={`Inferred, not from Figma: ${t.pending.join(', ')}`} style={{ color: 'var(--warning)' }}> °</span> : null}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Panel>
    ),
  },
  {
    slug: 'spacing',
    label: 'Spacing',
    description: 'The spacing scale every gap and padding comes from.',
    render: () => (
      <Panel>
        <SectionTitle>Spacing</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {spacing.map((s) => (
            <div key={s.token} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, width: 28, color: 'var(--muted-foreground)' }}>{s.token}</span>
              <span style={{ height: 12, width: s.value, background: 'var(--primary)', borderRadius: 2 }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted-foreground)' }}>{s.value}px</span>
            </div>
          ))}
        </div>
      </Panel>
    ),
  },
  {
    slug: 'radius',
    label: 'Radius',
    description: 'Corner rounding, what each value is for, and which components use it.',
    render: () => (
      <Panel>
        <SectionTitle sub="Corner rounding. Each row shows the shape at true size, the value, the variable to reference, and which components actually use it — read from the component source, not asserted here.">
          Radius
        </SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {radius.map((r) => {
            const users = radiusUsage[r.token] ?? []
            return (
              <div
                key={r.token}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 16,
                  padding: '14px 0', borderBottom: '1px solid var(--border)',
                }}
              >
                {/* True size — not clamped, so `pill` reads as a pill and `xs` as a hairline curve. */}
                <div
                  style={{
                    width: 56, height: 56, flexShrink: 0,
                    background: 'var(--blue-100)',
                    border: '2px solid var(--primary)',
                    borderRadius: r.value,
                  }}
                  aria-hidden
                />
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--gray-900)' }}>
                      {r.token}
                    </code>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--primary)' }}>
                      var(--radius-{r.token})
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted-foreground)' }}>
                      {r.value === 9999 ? '9999px · fully round' : `${r.value}px`}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.45 }}>{r.usage}</p>
                  <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>
                    {users.length > 0 ? (
                      <>
                        <span style={{ fontWeight: 500 }}>Used by </span>
                        {users.join(', ')}
                      </>
                    ) : (
                      <em>Not currently used by any component.</em>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Panel>
    ),
  },
  {
    slug: 'elevation',
    label: 'Elevation',
    description: 'Shadow tokens for raised and floating surfaces.',
    render: () => (
      <Panel>
        <SectionTitle>Elevation</SectionTitle>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          {shadows.map((s) => (
            <div key={s.token} style={{ textAlign: 'center' }}>
              <div style={{ width: 96, height: 64, background: '#fff', borderRadius: 'var(--radius-md)', boxShadow: s.value }} />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, marginTop: 10 }}>shadow.{s.token}</div>
            </div>
          ))}
        </div>
      </Panel>
    ),
  },
  { slug: 'effects', label: 'Effects', description: 'Focus rings, validation rings, button highlight and link underlines.', render: () => <EffectsSection /> },
  { slug: 'motion', label: 'Motion', description: 'Duration and easing tokens, and the reduced-motion rule.', render: () => <MotionSection /> },
  { slug: 'layering', label: 'Layering', description: 'The z-index scale — which layer sits above which.', render: () => <LayeringSection /> },
  { slug: 'breakpoints', label: 'Breakpoints', description: 'Layout thresholds, border widths and the focus ring.', render: () => <BreakpointsSection /> },
]

export default function FoundationsPage({ section = 'colors' }: { section?: string }) {
  const current = FOUNDATION_SECTIONS.find((s) => s.slug === section) ?? FOUNDATION_SECTIONS[0]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', maxWidth: 960 }}>
      <header>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--primary)' }}>
          Foundations
        </div>
        <h1 style={{ margin: '6px 0 8px', fontSize: 32, fontWeight: 600, letterSpacing: -0.5 }}>{current.label}</h1>
        <p style={{ margin: 0, fontSize: 16, color: 'var(--muted-foreground)', maxWidth: 640 }}>
          {current.description} Source of truth: src/data/tokens.ts
        </p>
      </header>
      {current.render()}
    </div>
  )
}
