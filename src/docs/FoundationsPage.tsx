import { useState, useCallback } from 'react'
import {
  brandColors, semanticColors, brandAccents, palette,
  spacing, radius, shadows, typeScale, systemTokens,
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

/** Dark enough that white text sits on it legibly. */
function isDark(hex: string): boolean {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return false
  const n = parseInt(m[1], 16)
  // Rec. 601 luma.
  return 0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255) < 140
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

export default function FoundationsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', maxWidth: 960 }}>
      <header>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--primary)' }}>
          Foundations
        </div>
        <h1 style={{ margin: '6px 0 8px', fontSize: 32, fontWeight: 600, letterSpacing: -0.5 }}>Design tokens</h1>
        <p style={{ margin: 0, fontSize: 16, color: 'var(--muted-foreground)', maxWidth: 640 }}>
          The primitives every Inspera component is built from. Use these tokens, never raw values, when
          generating new UI. Source of truth: src/data/tokens.ts
        </p>
      </header>

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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
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


      </div>

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

    </div>
  )
}
