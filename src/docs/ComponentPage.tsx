import { type CSSProperties, type ReactNode, useRef, useState } from 'react'
import { components } from '../data/components'
import { componentApi } from '../data/component-api.generated'
import { componentDocs } from '../data/component-docs.generated'
import { recipes } from '../data/recipes'
import { componentsPackage } from '../data/distribution'
import { Select, Toggle, SegmentedControl as ViewSwitch } from '../components/inspera'
import { srOnly } from '../components/inspera/types'
import {
  type ControlDef, type GalleryCell, type Lock, STATE_KEYS, effectiveValues, galleryFor, locksFor, registry, renderLive,
  renderStill, snippetFor,
} from './registry'
import { contexts, SceneFrame, sceneFor, sceneLocks, variantNotes } from './contexts'
import {
  Panel, SectionTitle, SegmentedControl, PreviewCanvas, CodeBlock, CodeTabs, CollapsibleSection, InfoTip,
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
  variant with no error. Variant *values* are Capitalised.
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

/** Who each code form is for, shown at the foot of its code block. */
const REACT_NOTE = componentsPackage.published
  ? 'For React projects that use the package.'
  : 'For React projects, once the package is published.'
const HTML_NOTE = 'For projects that cannot use the package: another framework, an AI builder or a plain HTML page.'

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

/** Prop descriptions are written in Markdown; show their `code` spans as code. */
function withCode(text: string): ReactNode {
  return text.split('`').map((part, i) => (i % 2 ? <code key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{part}</code> : part))
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
      <p style={{ margin: '4px 0 0', fontSize: 13, lineHeight: 1.5, color: 'var(--text-secondary)', maxWidth: 720 }}>
        {detail}
      </p>
    </div>
  )
}


/** A playground tool - Reset, Highlight. Docs chrome, so it stays quieter than the component under test. */
function ToolButton({ icon, label, title, disabled = false, onClick }: { icon: string; label: string; title?: string; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 32, padding: '0 10px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', color: 'var(--gray-800)', fontSize: 13, cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1, flexShrink: 0 }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 16 }} aria-hidden>{icon}</span>
      {label}
    </button>
  )
}

const VIEWS = [
  { value: 'component', label: 'Component' },
  { value: 'context', label: 'In context' },
]

/**
 * Why the chosen variant fits the scene, from `usage.variants`. With no line
 * for the values shown, the component's purpose stands in, in the same form.
 */
function SceneNotes({ slug, values, name, purpose, action }: {
  slug: string
  values: Record<string, string>
  name: string
  purpose: string
  action: ReactNode
}) {
  const matched = variantNotes(slug, values)
  const notes = matched.length > 0 ? matched : [{ label: name, when: purpose }]
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: '1 1 320px', minWidth: 0 }}>
        {notes.map((n) => (
          <p key={n.label} style={{ display: 'flex', gap: 8, margin: 0, fontSize: 14, lineHeight: 1.5, color: 'var(--gray-800)', maxWidth: 720 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary)', marginTop: 1 }} aria-hidden>lightbulb</span>
            <span><strong style={{ fontWeight: 600 }}>{n.label}</strong> - {n.when}</span>
          </p>
        ))}
      </div>
      {action}
    </div>
  )
}

const isBool = (c: ControlDef) => c.options.length === 2 && c.options.includes('true') && c.options.includes('false')

const groupLabel: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: 0.8,
  textTransform: 'uppercase',
  color: 'var(--text-secondary)',
}

/**
 * One control, drawn to fit its type: a switch, a row of options, or a menu.
 * It carries no visible name of its own - the property sheet row does.
 */
function Control({ def, value, dflt, lock, onChange }: { def: ControlDef; value: string; dflt: string; lock?: Lock; onChange: (v: string) => void }) {
  // A locked control shows the value it is held at, greyed out; its reason is
  // an info tip, beside the switch or beside the row name.
  const shownValue = lock ? lock.value : value
  if (isBool(def)) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
        <Toggle
          label={def.label}
          size="Small"
          checked={shownValue === 'true'}
          disabled={Boolean(lock)}
          onChange={(on) => onChange(on ? 'true' : 'false')}
          // The library's 16px label outweighed every other control in the
          // sheet; 14px and a 32px line match the option buttons beside it.
          style={{ fontSize: 14, minHeight: 32 }}
        />
        {lock && <InfoTip label={def.label} text={lock.reason} />}
      </span>
    )
  }
  // A menu only for long lists. Each row has the panel's full width, so up to
  // eight options fit as buttons - every choice visible and one click away.
  if (def.options.length > 8) {
    return (
      <div style={{ width: 240, maxWidth: '100%' }}>
        <Select
          label={def.label}
          showLabel={false}
          options={def.options.map((o) => ({ value: o, label: o === dflt ? `${o} (default)` : o }))}
          value={shownValue}
          disabled={Boolean(lock)}
          onChange={onChange}
        />
      </div>
    )
  }
  return <SegmentedControl label={def.label} showLabel={false} options={def.options} value={shownValue} defaultValue={dflt} disabled={Boolean(lock)} onChange={onChange} />
}

/**
 * A line of the property sheet: the name on the left, its controls on the
 * right, as in Figma's properties panel. Every row shares the name column, so
 * controls line up down the sheet; on a narrow panel the controls wrap below.
 */
function PropRow({ label, info, height = 32, children }: { label: string; info?: string; height?: number; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', columnGap: 16, rowGap: 4 }}>
      <span style={{ flex: '0 0 112px', display: 'flex', alignItems: 'center', gap: 2, minHeight: height, fontSize: 13, fontWeight: 600, color: 'var(--gray-700)' }}>
        {label}
        {info && <InfoTip label={label} text={info} />}
      </span>
      <div style={{ flex: '1 1 320px', minWidth: 0 }}>{children}</div>
    </div>
  )
}

/** On/off props in fixed columns, so the Options and States rows align with each other. */
function SwitchGrid({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', columnGap: 16 }}>
      {children}
    </div>
  )
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
        {renderStill(slug, effectiveValues(slug, cell.values))}
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
      title="Preview only. In use, this state comes from the mouse or keyboard."
      style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', color: 'var(--text-secondary)', background: 'var(--gray-100)', borderRadius: 'var(--radius-xs)', padding: '1px 5px' }}
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
  // Every component opens on the component itself. In context is a step you
  // take from there, so it lasts while you stay on the page and is not carried
  // to the next component.
  const [view, setView] = useState('component')
  const [pulse, setPulse] = useState(0)
  // The combination whose overlay (or dismissible component) was closed in the
  // scene. Any control change brings it back, as does Show again.
  const [dismissedFor, setDismissedFor] = useState<string | null>(null)
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

  // What the preview, the scene and the code show: the chosen values, with any
  // control that another one rules out held at its locked value. In context,
  // the scene may rule out a control it cannot show too, with its reason.
  const hasScenes = Boolean(contexts[slug])
  const inContext = hasScenes && view === 'context'
  const held = effectiveValues(slug, values)
  const heldByScene = inContext ? sceneLocks(slug, held) : {}
  const locks = { ...locksFor(slug, values), ...heldByScene }
  const shown = { ...held, ...Object.fromEntries(Object.entries(heldByScene).map(([key, lock]) => [key, lock.value])) }
  const combination = JSON.stringify(shown)
  const dismissed = dismissedFor === combination

  const scene = inContext ? sceneFor(slug, shown) : undefined

  const controls = Object.entries(entry.controls)
  // The sheet groups switches the way the gallery below does: what the
  // component shows (Options), then the state it is in (States).
  const choices = controls.filter(([, c]) => c.group !== 'preview' && !isBool(c))
  const options = controls.filter(([key, c]) => c.group !== 'preview' && isBool(c) && !STATE_KEYS.includes(key))
  const states = controls.filter(([key, c]) => c.group !== 'preview' && isBool(c) && STATE_KEYS.includes(key))
  const previews = controls.filter(([, c]) => c.group === 'preview')
  const control = ([key, def]: [string, ControlDef]) => (
    <Control key={key} def={def} value={values[key]} dflt={entry.defaults[key]} lock={locks[key]} onChange={(v) => set(key, v)} />
  )

  const gallery = galleryFor(slug)
  const matrix = gallery.matrix
  const previewCount = (matrix ? matrix.rowOptions.length * matrix.cols.length : 0)
    + gallery.sections.reduce((n, section) => n + section.cells.length, 0)
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

  const sheet = (choices.length > 0 || options.length > 0 || states.length > 0 || previews.length > 0) && (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(choices.length > 0 || options.length > 0 || states.length > 0) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--gray-900)' }}>Props</h3>
            <ToolButton
              icon="restart_alt"
              label="Reset"
              title={changed ? 'Reset to the default props' : 'The props are at their defaults'}
              disabled={!changed}
              onClick={() => setValues(entry.defaults)}
            />
          </div>
          {choices.map(([key, def]) => (
            <PropRow key={key} label={def.label} info={locks[key]?.reason} height={def.options.length > 8 ? 40 : 32}>
              {control([key, def])}
            </PropRow>
          ))}
          {options.length > 0 && (
            <PropRow label="Options">
              <SwitchGrid label="Options">{options.map(control)}</SwitchGrid>
            </PropRow>
          )}
          {states.length > 0 && (
            <PropRow label="States">
              <SwitchGrid label="States">{states.map(control)}</SwitchGrid>
            </PropRow>
          )}
        </div>
      )}
      {previews.length > 0 && (
        <div style={{ paddingTop: 16, borderTop: '1px dashed var(--border-strong)' }}>
          {previews.map(([key, def]) => (
            <PropRow
              key={key}
              label="Interaction"
              info={locks[key]?.reason ?? 'Shows a state that normally needs the mouse or keyboard, such as hover or focus. Preview only: it does not change the code.'}
            >
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                {control([key, { ...def, label: 'Interaction' }])}
                <SimulatedTag />
              </div>
            </PropRow>
          ))}
        </div>
      )}
    </div>
  )

  const notes = scene && (
    <SceneNotes
      slug={slug}
      values={shown}
      name={spec.name}
      purpose={spec.purpose}
      action={
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {dismissed && (
            <ToolButton
              icon="replay"
              label="Show again"
              title="Bring back what you closed in the scene"
              onClick={() => {
                setDismissedFor(null)
              }}
            />
          )}
          <ToolButton
            icon="center_focus_strong"
            label="Highlight"
            title="Briefly highlight the component in the scene"
            onClick={() => setPulse((n) => n + 1)}
          />
        </div>
      }
    />
  )

  // Full width and never clipped: a scene is a slice of a page, and an open
  // panel inside it must stay whole. It has its own frame, so it sits on the
  // panel without the preview canvas around it.
  const frame = scene && (
    <SceneFrame
      slug={slug}
      name={spec.name}
      values={shown}
      pulse={pulse}
      dismissed={dismissed}
      onDismiss={() => setDismissedFor(combination)}
    />
  )

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

      {/* Playground: live preview + controls. Both views keep the page
          column's width, so switching between them never shifts the page. */}
      <div ref={playgroundRef} style={{ scrollMarginTop: 16 }}>
        <Panel>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            {/* The header holds only what the whole panel is about: its name and
                which view it shows. Tools sit next to what they act on - Highlight
                under the scene, Reset on the props. */}
            <div style={{ flex: '1 1 320px', minWidth: 0 }}>
              <SectionTitle
                sub={inContext
                  ? 'Each variant where it is used in Inspera.'
                  : 'Change the props to update the preview and the code below.'}
              >
                Playground
              </SectionTitle>
            </div>
            {hasScenes && (
              <ViewSwitch
                label="Preview"
                size="Small"
                items={VIEWS}
                value={view}
                onChange={setView}
              />
            )}
          </div>
          {scene ? (
            <>
              {frame}
              {notes}
              <div style={{ marginTop: 24 }}>{sheet}</div>
            </>
          ) : (
            <>
              <PreviewCanvas contentWidth={layout.width} minHeight={layout.minHeight} align={layout.align} floating={Boolean(layout.minHeight)}>
                {/* Remounted per combination, so starting values (defaultValue,
                    defaultOpen) apply every time a control moves. */}
                <div key={combination} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  {renderLive(slug, shown)}
                </div>
              </PreviewCanvas>
              <div style={{ marginTop: 24 }}>{sheet}</div>
            </>
          )}

          <div style={{ marginTop: 20 }}>
            {recipe ? (
              <>
                {form === 'jsx' ? (
                  <CodeBlock
                    code={snippetFor(slug, shown)}
                    language="tsx"
                    copyLabel="Copy JSX"
                    headerLeft={<CodeTabs value={form} onChange={(v) => setForm(v as 'jsx' | 'css')} options={CODE_FORMS} />}
                    footer={REACT_NOTE}
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <CodeBlock
                      code={recipe.markup(shown)}
                      language="html"
                      copyLabel="Copy HTML"
                      maxHeight={0}
                      headerLeft={<CodeTabs value={form} onChange={(v) => setForm(v as 'jsx' | 'css')} options={CODE_FORMS} />}
                    />
                    <CodeBlock code={recipeCss(slug)} language="css" copyLabel="Copy CSS" footer={HTML_NOTE} />
                  </div>
                )}
              </>
            ) : (
              <CodeBlock code={snippetFor(slug, shown)} language="tsx" copyLabel="Copy JSX" footer={REACT_NOTE} />
            )}
          </div>
        </Panel>
      </div>

      {/* Variants & states */}
      <CollapsibleSection
        title="Variants & states"
        summary={`${previewCount} previews of every variant and state. Open one in the playground to try it.`}
      >
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
      </CollapsibleSection>

      {/* Props / API */}
      <CollapsibleSection
        title="Props API"
        info={`Props are the configurable properties of a component. This table lists all ${props.length} props ${spec.name} accepts, with each one's type, default value and description.`}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--muted-foreground)' }}>
                <th style={{ padding: '8px 12px', borderBottom: '2px solid var(--border)', fontWeight: 600 }}>
                  {props.some((p) => p.required) ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                      Prop
                      <InfoTip label="required props" text="Props marked * are required. The component needs them to work." />
                    </span>
                  ) : 'Prop'}
                </th>
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
                    {p.required && (
                      <>
                        <span aria-hidden style={{ color: 'var(--error)', marginLeft: 2 }}>*</span>
                        <span style={srOnly}> (required)</span>
                      </>
                    )}
                  </td>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gray-700)' }}>{p.type}</td>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{p.default ?? '-'}</td>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', color: 'var(--gray-700)' }}>{withCode(p.description ?? '')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {api?.native && (
          <p style={{ margin: '12px 0 0', fontSize: 13, color: 'var(--muted-foreground)', maxWidth: 720 }}>
            Also accepts any native <code style={{ fontFamily: 'var(--font-mono)' }}>&lt;{api.native}&gt;</code> attribute, such as <code style={{ fontFamily: 'var(--font-mono)' }}>id</code>, <code style={{ fontFamily: 'var(--font-mono)' }}>name</code>, <code style={{ fontFamily: 'var(--font-mono)' }}>aria-*</code>, event handlers, <code style={{ fontFamily: 'var(--font-mono)' }}>ref</code>. <code style={{ fontFamily: 'var(--font-mono)' }}>className</code> and <code style={{ fontFamily: 'var(--font-mono)' }}>style</code> apply to the outermost element.
          </p>
        )}
      </CollapsibleSection>

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
        <SectionTitle sub="The same spec in two forms. If you are not sure which you need, copy the prompt.">AI copy blocks</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <BlockLabel
              badge="Start here"
              title="Generation prompt"
              detail="Paste it into an AI tool such as Claude, ChatGPT, Cursor, v0, Lovable or Bolt, then describe what you want. It holds the full spec plus rules that stop the model using its own styling."
            />
            <CodeBlock code={aiPrompt(spec.name, doc)} language="prompt" copyLabel="Copy prompt" />
          </div>
          <div>
            <BlockLabel
              title="Canonical spec"
              detail="The spec without the rules. Use it when your tool already has them, for example from a rules file, a system prompt or the full AI spec."
            />
            <CodeBlock code={doc} language="markdown" copyLabel="Copy spec" />
          </div>
        </div>
      </Panel>

      {/* Deprecated aliases */}
      {spec.deprecatedAliases.length > 0 && (
        <Panel>
          <SectionTitle sub="Old names for this component. Do not use them in new work.">Deprecated aliases</SectionTitle>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {spec.deprecatedAliases.map((a) => (
              <span key={a} style={{ fontSize: 13, color: 'var(--text-secondary)', background: 'var(--gray-100)', padding: '4px 10px', borderRadius: 'var(--radius-pill)', textDecoration: 'line-through' }}>{a}</span>
            ))}
          </div>
        </Panel>
      )}
    </div>
  )
}
