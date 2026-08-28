import { useEffect, useState } from 'react'
import { components } from '../data/components'
import { componentApi } from '../data/component-api.generated'
import { componentDocs } from '../data/component-docs.generated'
import { registry, galleryMinWidth, GALLERY_MIN_WIDTH_DEFAULT } from './registry'
import {
  Panel, SectionTitle, SegmentedControl, PreviewCanvas, CodeBlock, CopyButton,
} from './primitives'

function aiPrompt(name: string, doc: string): string {
  return `Build UI with the Inspera ${name} component, exactly as specified below.

Rules:
- Use the props exactly as named. Prop names are camelCase and case-sensitive;
  React silently ignores an unknown prop, so a wrong case renders the default
  variant with no error. Variant *values* are Capitalized.
- Do not invent props, variants, or styles outside this spec.
- Style with Inspera tokens (var(--primary), var(--radius-md), …) — never
  hardcode off-palette colors.
- Implement the accessibility notes exactly (role, keyboard behavior, ARIA).

Canonical spec:
${doc}`
}

export default function ComponentPage({ slug }: { slug: string }) {
  const spec = components[slug]
  const entry = registry[slug]
  const props = componentApi[spec?.exportName ?? spec?.name.replace(/\s+/g, '') ?? '']?.props ?? []
  const doc = componentDocs[slug] ?? ''
  const [values, setValues] = useState<Record<string, string>>(entry?.defaults ?? {})

  useEffect(() => {
    setValues(entry?.defaults ?? {})
  }, [slug, entry])

  if (!spec || !entry) {
    return <div style={{ padding: 32 }}>Component not found.</div>
  }

  const set = (k: string, v: string) => setValues((prev) => ({ ...prev, [k]: v }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', maxWidth: 960 }}>
      {/* Header */}
      <header>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--primary)' }}>
          {spec.category.replace('-', ' ')}
        </div>
        <h1 style={{ margin: '6px 0 8px', fontSize: 32, fontWeight: 600, letterSpacing: -0.5 }}>{spec.name}</h1>
        <p style={{ margin: 0, fontSize: 16, color: 'var(--muted-foreground)', maxWidth: 640 }}>{spec.purpose}</p>
      </header>

      {/* Playground: live preview + variant controls */}
      <Panel>
        <SectionTitle sub="Switch variants and states, then interact with the live component.">Playground</SectionTitle>
        <PreviewCanvas>{entry.render(values)}</PreviewCanvas>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginTop: 20 }}>
          {Object.entries(entry.controls).map(([key, def]) => (
            <SegmentedControl
              key={key}
              label={def.label}
              options={def.options}
              value={values[key]}
              onChange={(v) => set(key, v)}
            />
          ))}
        </div>
        <div style={{ marginTop: 20 }}>
          <CodeBlock code={entry.snippet(values)} language="tsx" copyLabel="Copy JSX" />
        </div>
      </Panel>

      {/* State gallery */}
      <Panel>
        <SectionTitle sub="Every canonical state at a glance.">States</SectionTitle>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${galleryMinWidth[slug] ?? GALLERY_MIN_WIDTH_DEFAULT}px), 1fr))`,
            gap: 16,
          }}
        >
          {entry.gallery.map((g) => (
            <div key={g.label} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div
                style={{
                  minHeight: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  // Wide previews scroll rather than being cut off.
                  overflowX: 'auto',
                  minWidth: 0,
                  padding: 16,
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  background: '#fff',
                }}
              >
                {g.node}
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, textAlign: 'center', color: 'var(--muted-foreground)' }}>{g.label}</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* Props / API */}
      <Panel>
        <SectionTitle sub="Derived from the component's TypeScript interface — this is the real API, not a transcription.">Props API</SectionTitle>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--muted-foreground)' }}>
                <th style={{ padding: '8px 12px', borderBottom: '2px solid var(--border)', fontWeight: 600 }}>Prop</th>
                <th style={{ padding: '8px 12px', borderBottom: '2px solid var(--border)', fontWeight: 600 }}>Type</th>
                <th style={{ padding: '8px 12px', borderBottom: '2px solid var(--border)', fontWeight: 600 }}>Default</th>
                <th style={{ padding: '8px 12px', borderBottom: '2px solid var(--border)', fontWeight: 600 }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {props.map((p) => (
                <tr key={p.name} style={{ verticalAlign: 'top' }}>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                    {p.name}
                    {p.required && <span style={{ color: 'var(--error)', marginLeft: 2 }} title="Required">*</span>}
                  </td>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gray-700)' }}>{p.type}</td>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{p.default ?? '—'}</td>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', color: 'var(--gray-700)' }}>{p.description ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Tokens + Accessibility side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        <Panel>
          <SectionTitle>Token usage</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {spec.tokens.map((t) => (
              <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--gray-700)', background: 'var(--gray-100)', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}>{t}</span>
            ))}
          </div>
        </Panel>

        <Panel>
          <SectionTitle>Accessibility</SectionTitle>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, background: 'var(--blue-100)', color: 'var(--primary)', padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}>role: {spec.accessibility.role}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, background: 'var(--blue-100)', color: 'var(--primary)', padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}>keyboard: {String(spec.accessibility.keyboard)}</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, color: 'var(--gray-700)' }}>
            {spec.accessibility.ariaNotes.map((n) => <li key={n}>{n}</li>)}
          </ul>
        </Panel>
      </div>

      {/* Do / Don't */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        <Panel style={{ borderColor: 'rgba(46,125,50,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: 'var(--success)', fontWeight: 600 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>check_circle</span> Do
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, color: 'var(--gray-700)' }}>
            {spec.usage.do.map((d) => <li key={d}>{d}</li>)}
          </ul>
        </Panel>
        <Panel style={{ borderColor: 'rgba(211,47,47,0.35)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: 'var(--error)', fontWeight: 600 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>cancel</span> Don't
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, color: 'var(--gray-700)' }}>
            {spec.usage.dont.map((d) => <li key={d}>{d}</li>)}
          </ul>
        </Panel>
      </div>

      {/* AI copy panel */}
      <Panel style={{ background: 'linear-gradient(180deg, #f8fbff, #ffffff)', borderColor: 'rgba(0,64,128,0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <SectionTitle sub="Paste these into any AI tool to generate an on-spec version of this component.">AI copy blocks</SectionTitle>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Canonical spec</span>
              <CopyButton text={doc} label="Copy spec" />
            </div>
            <CodeBlock code={doc} language="markdown" copyLabel="Copy spec" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Generation prompt</span>
              <CopyButton text={aiPrompt(spec.name, doc)} label="Copy prompt" />
            </div>
            <CodeBlock code={aiPrompt(spec.name, doc)} language="prompt" copyLabel="Copy prompt" />
          </div>
        </div>
      </Panel>

      {/* Deprecated aliases */}
      {spec.deprecatedAliases.length > 0 && (
        <Panel>
          <SectionTitle sub="These legacy names map to this canonical component. Never use them in new work.">Deprecated aliases</SectionTitle>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {spec.deprecatedAliases.map((a) => (
              <span key={a} style={{ fontSize: 13, color: 'var(--gray-600)', background: 'var(--gray-100)', padding: '4px 10px', borderRadius: 'var(--radius-pill)', textDecoration: 'line-through' }}>{a}</span>
            ))}
          </div>
        </Panel>
      )}
    </div>
  )
}
