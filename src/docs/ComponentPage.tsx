import { type CSSProperties, type ReactNode, useRef, useState } from 'react'
import { components } from '../data/components'
import { componentApi } from '../data/component-api.generated'
import { componentDocs } from '../data/component-docs.generated'
import { recipes } from '../data/recipes'
import { Select, Toggle } from '../components/inspera'
import {
  type ControlDef, type GalleryCell, registry, galleryFor, renderLive, renderStill, snippetFor,
} from './registry'
import {
  Panel, SectionTitle, SegmentedControl, PreviewCanvas, CodeBlock, CodeTabs,
} from './primitives'

/**
 * The spec, wrapped in the instructions that make a model follow it.
 *
 * The rules are deliberately about *substitution*, not about props. A model
 * that cannot resolve `@inspera/components` will rebuild the element by hand,
 * and left to itself it reaches for its own defaults - a 8px radius, a mid
 * blue, `font-medium`. Naming that failure and pointing at the CSS block is
 * what keeps the output on-brand across tools.
 */
function aiPrompt(name: string, doc: string): string {
  return `Build UI with the Inspera ${name} component, exactly as specified below.

Rules:
- Use the props exactly as named. Prop names are camelCase and case-sensitive;
  React silently ignores an unknown prop, so a wrong case renders the default
  variant with no error. Variant *values* are Capitalized.
- If you cannot install or import the package, do NOT substitute another UI
  library and do NOT style it yourself. Use the HTML and CSS under "Without the
  package" verbatim - that section is the component, not an approximation.
- Take every visual value from this spec: radius, fill, border, height,
  padding, font size and weight, shadow. If a value is not stated here, it is
  not yours to choose - ask rather than guess.
- Never translate the CSS into another design system's utilities. No
  \`rounded-lg\`, no \`bg-blue-600\`, no Tailwind default palette, no shadcn or
  Material defaults.
- Copy the token block into \`:root\` once, then reference \`var(--token)\`.
- Do not invent props, variants, or styles outside this spec.
- Implement the accessibility notes exactly (role, keyboard behavior, ARIA).

Canonical spec:
${doc}`
}

const CODE_FORMS = [
  { id: 'jsx', label: 'React' },
  { id: 'css', label: 'HTML + CSS' },
]

/**
 * The recipe's tokens and CSS as one pasteable block - the same content the
 * spec doc carries, so a reader who takes it from here and a model that takes
 * it from the spec get byte-identical CSS.
 */
function recipeCss(slug: string): string {
  const recipe = recipes[slug]
  const doc = componentDocs[slug] ?? ''
  const from = doc.indexOf('#### One-time setup')
  if (from === -1) return recipe.css
  // Both fences: the fonts and icon class first, then this component's tokens
  // and rules. Copying only the second produced correct colours with every
  // icon rendered as its own name.
  const fences = [...doc.slice(from).matchAll(/```css\n([\s\S]*?)```/g)].map((m) => m[1].trimEnd())
  return fences.length > 0 ? fences.join('\n\n') : recipe.css
}

/** Names a copy block and says plainly when to reach for it. */
function BlockLabel({ badge, title, detail }: { badge?: string; title: string; detail: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{title}</span>
        {badge && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 0.4,
              textTransform: 'uppercase',
              color: 'var(--white)',
              background: 'var(--primary)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-pill)',
            }}
          >
            {badge}
          </span>
        )}
      </div>
      <p style={{ margin: '4px 0 0', fontSize: 13, lineHeight: 1.5, color: 'var(--gray-600)', maxWidth: 720 }}>
        {detail}
      </p>
    </div>
  )
}

const isBool = (c: ControlDef) => c.options.length === 2 && c.options.includes('true') && c.options.includes('false')

const groupLabel: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: 0.8,
  textTransform: 'uppercase',
  color: 'var(--gray-600)',
}

/** One control, drawn to fit its type: a switch, a row of options, or a menu. */
function Control({ def, value, dflt, onChange }: { def: ControlDef; value: string; dflt: string; onChange: (v: string) => void }) {
  if (isBool(def)) {
    return (
      <Toggle
        label={def.label}
        size="Small"
        checked={value === 'true'}
        onChange={(on) => onChange(on ? 'true' : 'false')}
      />
    )
  }
  if (def.options.length > 5) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>
          {def.label}
        </span>
        <Select
          label={def.label}
          showLabel={false}
          options={def.options.map((o) => ({ value: o, label: o === dflt ? `${o} (default)` : o }))}
          value={value}
          onChange={onChange}
        />
      </div>
    )
  }
  return <SegmentedControl label={def.label} options={def.options} value={value} defaultValue={dflt} onChange={onChange} />
}

/** A gallery cell: the component, its label, and a way to open it in the playground. */
function Cell({
  slug, cell, minHeight, align, floating, onLoad, bare = false,
}: {
  slug: string
  cell: GalleryCell
  minHeight: number
  align: 'start' | 'center'
  /** Opens a panel (menu, list, calendar) that must not be clipped at the cell edge. */
  floating: boolean
  onLoad: (values: Record<string, string>) => void
  bare?: boolean
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
      <div
        data-gallery-cell={cell.label}
        style={{
          minHeight,
          display: 'flex',
          alignItems: align === 'start' ? 'flex-start' : 'center',
          justifyContent: 'center',
          padding: 16,
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--surface)',
          // A non-visible overflow on one axis forces the other to auto, which
          // cut open panels off at the cell edge; those cells stay visible.
          ...(floating ? { overflow: 'visible' } : { overflowX: 'auto' }),
        }}
      >
        {renderStill(slug, cell.values)}
      </div>
      {!bare && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 24 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted-foreground)' }}>{cell.label}</span>
          {cell.simulated && <SimulatedTag />}
          <LoadButton label={cell.label} onClick={() => onLoad(cell.values)} />
        </div>
      )}
    </div>
  )
}

function SimulatedTag() {
  return (
    <span
      title="Frozen for display. In a real app this look comes from the pointer or keyboard; it is not a prop."
      style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', color: 'var(--gray-600)', background: 'var(--gray-100)', borderRadius: 'var(--radius-xs)', padding: '1px 5px' }}
    >
      Simulated
    </span>
  )
}

function LoadButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open ${label} in the playground`}
      title="Open in the playground"
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, padding: 0, border: 'none', borderRadius: 'var(--radius-sm)', background: 'transparent', color: 'var(--primary)', cursor: 'pointer' }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 16 }} aria-hidden>tune</span>
    </button>
  )
}

function SubHeading({ children }: { children: ReactNode }) {
  return <h3 style={{ margin: '0 0 12px', ...groupLabel }}>{children}</h3>
}

export default function ComponentPage({ slug }: { slug: string }) {
  const spec = components[slug]
  const entry = registry[slug]
  const api = componentApi[spec?.exportName ?? spec?.name.replace(/\s+/g, '') ?? '']
  const props = api?.props ?? []
  const doc = componentDocs[slug] ?? ''
  const recipe = recipes[slug]
  const [values, setValues] = useState<Record<string, string>>(entry?.defaults ?? {})
  const [form, setForm] = useState<'jsx' | 'css'>('jsx')
  const playgroundRef = useRef<HTMLDivElement>(null)

  if (!spec || !entry) {
    return <div style={{ padding: 32 }}>Component not found.</div>
  }

  const layout = entry.layout ?? {}
  const set = (k: string, v: string) => setValues((prev) => ({ ...prev, [k]: v }))
  const changed = Object.keys(entry.defaults).some((k) => values[k] !== entry.defaults[k])
  const load = (next: Record<string, string>) => {
    setValues(next)
    playgroundRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const controls = Object.entries(entry.controls)
  const choices = controls.filter(([, c]) => c.group !== 'preview' && !isBool(c))
  const switches = controls.filter(([, c]) => c.group !== 'preview' && isBool(c))
  const previews = controls.filter(([, c]) => c.group === 'preview')

  const gallery = galleryFor(slug)
  const matrix = gallery.matrix
  const cellWidth = layout.cell ?? 220
  const cellHeight = layout.cellHeight ?? 80
  // Entries that reserve height do so for a panel that opens inside the cell.
  const floating = Boolean(layout.cellHeight || layout.openHeight)
  const cellAlign = floating ? 'start' : 'center'
  /** Room for an open panel only where one is drawn. */
  const heightFor = (cell: GalleryCell) =>
    cell.values.preview === 'Open' && layout.openHeight ? layout.openHeight : cellHeight
  const grid: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${cellWidth}px), 1fr))`,
    gap: 16,
  }

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

      {/* Playground: live preview + controls */}
      <div ref={playgroundRef} style={{ scrollMarginTop: 16 }}>
        <Panel>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <SectionTitle sub="Change the props, then use the live component. The code below always builds exactly what is shown.">Playground</SectionTitle>
            {changed && (
              <button
                type="button"
                onClick={() => setValues(entry.defaults)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 32, padding: '0 10px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', color: 'var(--gray-800)', fontSize: 13, cursor: 'pointer', flexShrink: 0 }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }} aria-hidden>restart_alt</span>
                Reset
              </button>
            )}
          </div>
          <PreviewCanvas contentWidth={layout.width} minHeight={layout.minHeight} align={layout.align} floating={Boolean(layout.minHeight)}>
            {/* Remounted per combination, so starting values (defaultValue,
                defaultOpen) apply every time a control moves. */}
            <div key={JSON.stringify(values)} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              {renderLive(slug, values)}
            </div>
          </PreviewCanvas>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 20 }}>
            {(choices.length > 0 || switches.length > 0) && (
              <div>
                <div style={{ ...groupLabel, marginBottom: 12 }}>Props</div>
                {choices.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
                    {choices.map(([key, def]) => (
                      <Control key={key} def={def} value={values[key]} dflt={entry.defaults[key]} onChange={(v) => set(key, v)} />
                    ))}
                  </div>
                )}
                {switches.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: 24, marginTop: choices.length > 0 ? 12 : 0 }}>
                    {switches.map(([key, def]) => (
                      <Control key={key} def={def} value={values[key]} dflt={entry.defaults[key]} onChange={(v) => set(key, v)} />
                    ))}
                  </div>
                )}
              </div>
            )}
            {previews.length > 0 && (
              <div style={{ paddingTop: 16, borderTop: '1px dashed var(--border-strong)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={groupLabel}>Preview only</span>
                  <SimulatedTag />
                </div>
                <p style={{ margin: '0 0 12px', fontSize: 13, color: 'var(--muted-foreground)', maxWidth: 640 }}>
                  Freezes a look that normally comes from the pointer or keyboard, so it can be inspected. It is not a prop and never appears in the code.
                </p>
                {previews.map(([key, def]) => (
                  <Control key={key} def={{ ...def, label: 'State' }} value={values[key]} dflt={entry.defaults[key]} onChange={(v) => set(key, v)} />
                ))}
              </div>
            )}
          </div>

          <div style={{ marginTop: 20 }}>
            {recipe ? (
              <>
                <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--muted-foreground)' }}>
                  {form === 'jsx'
                    ? 'For the product codebase, once the package is available.'
                    : 'For anywhere you cannot install the package - another stack, an AI builder, a plain HTML page.'}
                </p>
                {form === 'jsx' ? (
                  <CodeBlock
                    code={snippetFor(slug, values)}
                    language="tsx"
                    copyLabel="Copy JSX"
                    headerLeft={<CodeTabs value={form} onChange={(v) => setForm(v as 'jsx' | 'css')} options={CODE_FORMS} />}
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <CodeBlock
                      code={recipe.markup(values)}
                      language="html"
                      copyLabel="Copy HTML"
                      maxHeight={0}
                      headerLeft={<CodeTabs value={form} onChange={(v) => setForm(v as 'jsx' | 'css')} options={CODE_FORMS} />}
                    />
                    <CodeBlock code={recipeCss(slug)} language="css" copyLabel="Copy CSS" />
                  </div>
                )}
              </>
            ) : (
              <CodeBlock code={snippetFor(slug, values)} language="tsx" copyLabel="Copy JSX" />
            )}
          </div>
        </Panel>
      </div>

      {/* Variants & states */}
      <Panel>
        <SectionTitle sub="Every variant and state, derived from the playground's controls. Open any of them in the playground to try it.">
          Variants &amp; states
        </SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {matrix && (
            <div>
              <SubHeading>{entry.controls[matrix.rows].label} &times; state</SubHeading>
              <div style={{ overflowX: 'auto' }}>
                <div
                  role="table"
                  aria-label={`${entry.controls[matrix.rows].label} by state`}
                  style={{ display: 'grid', gridTemplateColumns: `max-content repeat(${matrix.cols.length}, minmax(${cellWidth}px, 1fr))`, gap: 12, alignItems: 'center' }}
                >
                  <div role="row" style={{ display: 'contents' }}>
                    <span role="columnheader" />
                    {matrix.cols.map((c) => (
                      <span role="columnheader" key={c.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--gray-700)' }}>
                        {c.label}
                        {c.simulated && <SimulatedTag />}
                      </span>
                    ))}
                  </div>
                  {matrix.rowOptions.map((row) => (
                    <div role="row" key={row} style={{ display: 'contents' }}>
                      <span role="rowheader" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: 'var(--gray-700)' }}>
                        {row}
                        <LoadButton label={row} onClick={() => load({ ...entry.defaults, [matrix.rows]: row })} />
                      </span>
                      {matrix.cols.map((col) => (
                        <div role="cell" key={col.label}>
                          <Cell
                            bare
                            floating={floating}
                            slug={slug}
                            cell={{ ...col, values: { ...col.values, [matrix.rows]: row } }}
                            minHeight={heightFor(col)}
                            align={cellAlign}
                            onLoad={load}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {gallery.sections.map((section) => (
            <div key={section.title}>
              <SubHeading>{section.title}</SubHeading>
              <div style={grid}>
                {section.cells.map((cell) => (
                  <Cell key={cell.label} slug={slug} cell={cell} minHeight={heightFor(cell)} align={cellAlign} floating={floating} onLoad={load} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Props / API */}
      <Panel>
        <SectionTitle sub="Derived from the component's TypeScript interface - this is the real API, not a transcription.">Props API</SectionTitle>
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
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{p.default ?? '-'}</td>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', color: 'var(--gray-700)' }}>{p.description ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {api?.native && (
          <p style={{ margin: '12px 0 0', fontSize: 13, color: 'var(--muted-foreground)', maxWidth: 720 }}>
            Also accepts any native <code style={{ fontFamily: 'var(--font-mono)' }}>&lt;{api.native}&gt;</code> attribute - <code style={{ fontFamily: 'var(--font-mono)' }}>id</code>, <code style={{ fontFamily: 'var(--font-mono)' }}>name</code>, <code style={{ fontFamily: 'var(--font-mono)' }}>aria-*</code>, event handlers, <code style={{ fontFamily: 'var(--font-mono)' }}>ref</code> - forwarded to it. <code style={{ fontFamily: 'var(--font-mono)' }}>className</code> and <code style={{ fontFamily: 'var(--font-mono)' }}>style</code> go on the outermost element.
          </p>
        )}
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, background: 'var(--blue-100)', color: 'var(--primary)', padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}>role: {spec.accessibility.role}</span>
            <span style={{ fontSize: 12, fontWeight: 500, background: spec.accessibility.keyboard ? 'var(--success-surface)' : 'var(--gray-100)', color: spec.accessibility.keyboard ? 'var(--success)' : 'var(--gray-700)', padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}>
              {spec.accessibility.keyboard ? 'Keyboard operable' : 'Not interactive'}
            </span>
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, color: 'var(--gray-700)' }}>
            {spec.accessibility.ariaNotes.map((n) => <li key={n}>{n}</li>)}
          </ul>
        </Panel>
      </div>

      {/* Do / Don't */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        <Panel style={{ borderColor: 'color-mix(in srgb, var(--success) 40%, transparent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: 'var(--success)', fontWeight: 600 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>check_circle</span> Do
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, color: 'var(--gray-700)' }}>
            {spec.usage.do.map((d) => <li key={d}>{d}</li>)}
          </ul>
        </Panel>
        <Panel style={{ borderColor: 'color-mix(in srgb, var(--error) 35%, transparent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: 'var(--error)', fontWeight: 600 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden>cancel</span> Don't
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, color: 'var(--gray-700)' }}>
            {spec.usage.dont.map((d) => <li key={d}>{d}</li>)}
          </ul>
        </Panel>
      </div>

      {/* AI copy panel. Each block's copy affordance lives in the CodeBlock header. */}
      <Panel style={{ background: 'linear-gradient(180deg, var(--canvas-bg), var(--surface))', borderColor: 'color-mix(in srgb, var(--primary) 25%, transparent)' }}>
        <SectionTitle sub="Two forms of the same content. If you are unsure, copy the first one.">AI copy blocks</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <BlockLabel
              badge="Start here"
              title="Generation prompt"
              detail="Paste into a chat - Claude, ChatGPT, Cursor, v0, Lovable, Bolt - then describe what you want. Contains the full spec below plus the rules that stop the model substituting its own styling."
            />
            <CodeBlock code={aiPrompt(spec.name, doc)} language="prompt" copyLabel="Copy prompt" />
          </div>
          <div>
            <BlockLabel
              title="Canonical spec"
              detail="The same spec without the instructions. Use it when the rules are already in place - a rules file, a system prompt, or the project-wide spec from Integrate."
            />
            <CodeBlock code={doc} language="markdown" copyLabel="Copy spec" />
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
