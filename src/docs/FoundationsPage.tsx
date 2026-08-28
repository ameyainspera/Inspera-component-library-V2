import { useState, useCallback } from 'react'
import {
  brandColors, semanticColors, brandAccents, palette,
  spacing, radius, shadows, typeScale,
} from '../data/tokens'
import { Panel, SectionTitle } from './primitives'

function PaletteShade({ shade, hex, family }: { shade: string; hex: string; family: string }) {
  const [copied, setCopied] = useState(false)
  const [hovered, setHovered] = useState(false)

  const handleClick = useCallback(() => {
    try {
      const ta = document.createElement('textarea')
      ta.value = hex
      ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {}
  }, [hex])

  return (
    <div key={shade} style={{ flex: 1, cursor: 'pointer' }} onClick={handleClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{
        height: 40,
        background: hex,
        borderRadius: 'var(--radius-sm)',
        border: hovered ? '2px solid rgba(0,0,0,0.25)' : '1px solid rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'border 0.1s',
        position: 'relative',
        overflow: 'hidden',
      }}
        title={`${family} ${shade} · ${hex}`}
      >
        {hovered && (
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            fontWeight: 600,
            color: parseInt(shade, 10) >= 500 ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.75)',
            letterSpacing: 0,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}>
            {copied ? '✓ copied' : hex}
          </span>
        )}
      </div>
      <div style={{ fontSize: 10, textAlign: 'center', color: 'var(--muted-foreground)', marginTop: 4 }}>{shade}</div>
    </div>
  )
}

function Swatch({ name, value, note }: { name: string; value: string; note?: string }) {
  const dark = ['#004080', '#322060', '#D32F2F', '#EF6C00', '#0288D1', '#2E7D32', '#FA5101', '#89239A', '#00A788'].includes(value)
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      <div style={{ height: 64, background: value, display: 'flex', alignItems: 'flex-end', padding: 8 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: dark ? '#fff' : 'rgba(0,0,0,0.7)' }}>{value}</span>
      </div>
      <div style={{ padding: '8px 10px' }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{name}</div>
        {note && <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{note}</div>}
      </div>
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
        <SectionTitle sub="Primary brand & interactive color.">Brand & semantic color</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
          {brandColors.map((c) => <Swatch key={c.name} {...c} />)}
          {semanticColors.map((c) => <Swatch key={c.name} name={c.name} value={c.value} />)}
          {brandAccents.map((c) => <Swatch key={c.name} name={`brand.${c.name}`} value={c.value} />)}
        </div>
      </Panel>

      <Panel>
        <SectionTitle sub="Reusable palette shades that components draw from.">Palette</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Object.entries(palette).map(([family, shades]) => (
            <div key={family}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, textTransform: 'capitalize' }}>{family}</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {Object.entries(shades).map(([shade, hex]) => (
                  <PaletteShade key={shade} shade={shade} hex={hex} family={family} />
                ))}
              </div>
            </div>
          ))}
        </div>
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

        <Panel>
          <SectionTitle>Radius</SectionTitle>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {radius.map((r) => (
              <div key={r.token} style={{ textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, background: 'var(--blue-100)', border: '2px solid var(--primary)', borderRadius: Math.min(r.value, 28) }} />
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, marginTop: 6 }}>{r.token}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

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
