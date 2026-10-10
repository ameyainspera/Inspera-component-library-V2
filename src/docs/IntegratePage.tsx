import { type ReactNode, useState } from 'react'
import { componentList } from '../data/components'
import { componentsPackage, artifacts, artifactSize, publicPath, publicUrl, type Artifact } from '../data/distribution'
import { designGuideServed } from '../data/design-md'
import { Panel, SectionTitle, CodeBlock, CopyButton, SegmentedControl } from './primitives'

// ---------------------------------------------------------------------------
// A single "context" card: which workspace, when to reach for it, and the
// concrete steps to wire Inspera into it so AI output stays on-brand.
// ---------------------------------------------------------------------------
function ContextCard({
  icon, eyebrow, title, blurb, best, children,
}: {
  icon: string
  eyebrow: string
  title: string
  blurb: string
  best: string
  children: ReactNode
}) {
  return (
    <Panel style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <span
          style={{
            width: 44, height: 44, flexShrink: 0, borderRadius: 'var(--radius-md)',
            background: 'var(--blue-100)', color: 'var(--primary)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 24 }} aria-hidden>{icon}</span>
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--primary)' }}>
            {eyebrow}
          </div>
          <h3 style={{ margin: '2px 0 6px', fontSize: 18, fontWeight: 600, color: 'var(--gray-900)' }}>{title}</h3>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--muted-foreground)', lineHeight: 1.5 }}>{blurb}</p>
        </div>
      </div>

      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
          borderRadius: 'var(--radius-sm)', background: 'var(--gray-100)',
          fontSize: 13, color: 'var(--gray-700)',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--primary)' }} aria-hidden>bolt</span>
        <span><strong style={{ fontWeight: 600 }}>Best for:</strong> {best}</span>
      </div>

      {children}
    </Panel>
  )
}

// ---------------------------------------------------------------------------
// Numbered step used inside each context card.
// ---------------------------------------------------------------------------
function Step({ n, title, children }: { n: number; title: string; children?: ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <span
        style={{
          width: 22, height: 22, flexShrink: 0, borderRadius: 'var(--radius-pill)',
          background: 'var(--primary)', color: 'var(--white)', fontSize: 12, fontWeight: 600,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
        }}
      >
        {n}
      </span>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-900)' }}>{title}</div>
        {children}
      </div>
    </div>
  )
}

const COUNT = componentList.length

// Kept short on purpose. The old primer told people to paste a ~16k-token file
// into every session; the index at /llms.txt is a fraction of that and links
// the rest, so a model fetches only the components it actually uses.
const specUrl = (path: string) => publicUrl(path)

const primerPrompt = () => `You are building UI with the Inspera Design System.

Before designing a screen, read ${specUrl(`/${designGuideServed}/DESIGN.md`)} and follow it:
who the screen is for, existing versus new UI, hierarchy, layout and UI text.

Read ${specUrl('/llms.txt')} first when building components - it lists all ${COUNT}
components and links a short spec for each one. Fetch the spec for every
component you use.

Non-negotiable:
- Prop names are camelCase and case-sensitive (intent, not Intent). React
  silently ignores an unknown prop, so wrong case renders the default variant
  with no error.
- Variant values are Capitalised: intent="Primary", size="Medium".
- Style with Inspera tokens (var(--primary), var(--space-4)) - never hardcode
  an off-palette colour.

Now build: <describe the screen or flow you want>.`

interface ToolSetup {
  id: string
  label: string
  file: string
  where: string
  note: string
}

const TOOL_SETUPS: ToolSetup[] = [
  {
    id: 'Cursor',
    label: 'Cursor',
    file: '/rules/inspera.mdc',
    where: '.cursor/rules/inspera.mdc',
    note: 'Applies automatically to every .tsx, .jsx and .css file.',
  },
  {
    id: 'Claude Code',
    label: 'Claude Code',
    file: '/rules/CLAUDE.md',
    where: 'CLAUDE.md',
    note: 'Loaded into every session in that repo. Claude fetches per-component specs as it needs them.',
  },
  {
    id: 'Copilot',
    label: 'Copilot',
    file: '/rules/copilot-instructions.md',
    where: '.github/copilot-instructions.md',
    note: 'Picked up by Copilot Chat and the coding agent across the repo.',
  },
  {
    id: 'Windsurf',
    label: 'Windsurf',
    file: '/rules/.windsurfrules',
    where: '.windsurfrules',
    note: 'Rules file at the repo root, read on every request.',
  },
  {
    id: 'Other',
    label: 'v0 / Bolt / ChatGPT',
    file: '/rules/AGENTS.md',
    where: 'AGENTS.md (or paste it)',
    note: 'For chat-based tools with no rules file, paste this at the start of the session.',
  },
]


function ArtifactLink({ file, saveAs, note, advice, view }: Artifact) {
  // A file that is not plain ASCII opens on its in-app page, which decodes it
  // correctly; opened raw, a browser can garble it.
  const open = view ? { href: view } : { href: publicPath(file), target: '_blank', rel: 'noreferrer' }
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
      <a
        {...open}
        style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--primary)', textDecoration: 'none', flexShrink: 0, minWidth: 168 }}
      >
        {file}
      </a>
      <span style={{ fontSize: 13, color: 'var(--muted-foreground)', flex: 1, minWidth: 0 }}>
        {note}
        <span style={{ display: 'block', fontSize: 12, color: 'var(--gray-700)' }}>{artifactSize(file, advice)}</span>
      </span>
      {/* Every row was view-only, so getting one of these into another tool's
          context meant Save-As and living with the served name. */}
      <a
        href={publicPath(file)}
        download={saveAs}
        title={`Download as ${saveAs}`}
        aria-label={`Download ${file} as ${saveAs}`}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 28, height: 28, flexShrink: 0, alignSelf: 'center',
          borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', textDecoration: 'none',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>download</span>
      </a>
    </div>
  )
}

// ---------------------------------------------------------------------------
// "Set up for <tool>" - hands over the exact rules file and where it goes.
// A rules file beats a pasted primer: it is loaded on every request in that
// repo, so nobody has to remember to prime the session.
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// The package is real and builds from this repo, but it has never been
// published. Saying so plainly beats letting someone run the install and get a
// 404 with no explanation.
// ---------------------------------------------------------------------------
function NotPublishedNotice() {
  return (
    <div
      role="note"
      style={{
        display: 'flex', gap: 12, alignItems: 'flex-start',
        padding: '12px 14px', borderRadius: 'var(--radius-md)',
        background: 'var(--warning-surface)',
        border: '1px solid var(--warning)',
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--warning)', flexShrink: 0 }} aria-hidden>
        info
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 4 }}>
          Not published yet
        </div>
        <p style={{ margin: '0 0 6px', fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.5 }}>
          {componentsPackage.status}
        </p>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.5 }}>
          {componentsPackage.insteadUse}
        </p>
      </div>
    </div>
  )
}

function ToolSetupCard() {
  const [toolId, setToolId] = useState(TOOL_SETUPS[0].id)
  const tool = TOOL_SETUPS.find((t) => t.id === toolId) ?? TOOL_SETUPS[0]

  return (
    <ContextCard
      icon="smart_toy"
      eyebrow="Cursor | Claude Code | Copilot | Windsurf | v0 | Bolt | ChatGPT"
      title="AI coding tools"
      blurb="Add one rules file to the project and the tool follows the system on every request, without pasting the spec into each chat."
      best="Prototypes, and any project that cannot install the package."
    >
      <Step n={1} title="Pick your tool">
        <SegmentedControl
          label="Tool"
          options={TOOL_SETUPS.map((t) => t.label)}
          value={tool.label}
          onChange={(label) => setToolId(TOOL_SETUPS.find((t) => t.label === label)?.id ?? TOOL_SETUPS[0].id)}
        />
      </Step>

      <Step n={2} title={`Save it as ${tool.where}`}>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--muted-foreground)', lineHeight: 1.5 }}>{tool.note}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <a
            href={publicPath(tool.file)}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 12px',
              borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)',
              background: 'var(--surface)', color: 'var(--gray-800)', textDecoration: 'none',
              fontSize: 13, fontWeight: 500,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }} aria-hidden>open_in_new</span>
            Open {tool.where.split('/').pop()}
          </a>
          <CopyButton text={specUrl(tool.file)} label="Copy link" />
        </div>
        <CodeBlock
          language="bash"
          copyLabel="Copy"
          code={`curl -o ${tool.where} ${specUrl(tool.file)}`}
        />
      </Step>

      <Step n={3} title="Or start a one-off chat">
        <p style={{ margin: 0, fontSize: 13, color: 'var(--muted-foreground)', lineHeight: 1.5 }}>
          For a tool with no rules file, paste this at the start of the chat. It links to the index
          instead of including the whole spec, which leaves more room for your work.
        </p>
        <CodeBlock code={primerPrompt()} language="prompt" copyLabel="Copy primer" />
      </Step>

      <div>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, color: 'var(--gray-900)' }}>
          Everything the library publishes
        </div>
        {artifacts.map((a) => <ArtifactLink key={a.file} {...a} />)}
      </div>
    </ContextCard>
  )
}

export default function IntegratePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', maxWidth: 960 }}>
      <header>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--primary)' }}>
          Integrate
        </div>
        <h1 style={{ margin: '6px 0 8px', fontSize: 32, fontWeight: 600, letterSpacing: -0.5 }}>
          Use Inspera anywhere
        </h1>
        <p style={{ margin: 0, fontSize: 16, color: 'var(--muted-foreground)', maxWidth: 660, lineHeight: 1.55 }}>
          The library comes in three formats: a kit for Figma Make, rules files for AI coding tools,
          and a React package. Pick the one that matches where you build.
        </p>
      </header>

      {/* At-a-glance chooser */}
      <Panel>
        <SectionTitle>What ships with the library</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          {[
            { icon: 'inventory_2', title: 'npm package', mono: '@inspera/components', note: 'The React components and their stylesheet. Not published to a registry yet.' },
            { icon: 'description', title: 'Portable spec', mono: 'llms.txt', note: "An index for AI tools, with a link to each component's spec." },
            { icon: 'widgets', title: 'Figma Make kit', mono: 'kit/', note: 'Makes the Figma Make agent build with Inspera components and tokens.' },
          ].map((f) => (
            <div key={f.title} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--primary)' }} aria-hidden>{f.icon}</span>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)' }}>{f.title}</div>
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--primary)' }}>{f.mono}</code>
              <div style={{ fontSize: 13, color: 'var(--muted-foreground)', lineHeight: 1.45 }}>{f.note}</div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Figma Make */}
      <ContextCard
        icon="widgets"
        eyebrow="Inside Figma"
        title="Figma Make"
        blurb="Attach the Inspera kit to a Make project, and the Make agent builds every screen with Inspera components, tokens and guidance."
        best="Generating screens and flows from prompts in Figma."
      >
        <Step n={1} title="Publish or attach the Inspera kit">
          <p style={{ margin: 0, fontSize: 13, color: 'var(--muted-foreground)', lineHeight: 1.5 }}>
            In Figma Make, open <strong>Kits &gt; Create / Publish kit</strong> and point it at the
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, margin: '0 4px' }}>kit/</code>
            directory. New projects can then attach it.
          </p>
        </Step>
        <Step n={2} title="Prompt as normal">
          <p style={{ margin: 0, fontSize: 13, color: 'var(--muted-foreground)', lineHeight: 1.5 }}>
            Describe the screen or flow you want. The kit already tells the agent to use Inspera
            components and tokens, so you don't need extra instructions.
          </p>
        </Step>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--gray-700)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--accent-algae)' }} aria-hidden>info</span>
          The kit only works in Figma Make. For other tools, use the rules files or the package below.
        </div>
      </ContextCard>

      {/* Any AI builder */}
      <ToolSetupCard />

      {/* Code project */}
      <ContextCard
        icon="code"
        eyebrow="React codebase"
        title={`Code projects - ${componentsPackage.name}`}
        blurb="The React components as a package. Once it's published, this is the most reliable option: the components follow the spec themselves, instead of an AI interpreting it."
        best="Production apps, once the package is published."
      >
        {!componentsPackage.published && <NotPublishedNotice />}
        <Step n={1} title={componentsPackage.published ? 'Install the package' : 'Install - once published'}>
          <CodeBlock
            code={
              componentsPackage.published
                ? `npm i ${componentsPackage.name}`
                : `# Not available yet - this returns 404 today.\n# npm i ${componentsPackage.name}`
            }
            language="bash"
            copyLabel="Copy"
          />
        </Step>
        <Step n={2} title="Import the stylesheet once, then use the components">
          <CodeBlock
            language="tsx"
            copyLabel="Copy"
            code={`import '@inspera/components/styles.css'
import { List } from '@inspera/components'

export function SettingsScreen() {
  return (
    <List
      interactive
      items={[
        { primary: 'General settings', secondary: 'Language, timezone, theme', leadingIcon: 'settings', trailingIcon: 'chevron_right' },
        { primary: 'Notifications', secondary: 'Email and push preferences', leadingIcon: 'notifications', trailingIcon: 'chevron_right' },
        { primary: 'Security', secondary: 'Password and two-factor auth', leadingIcon: 'lock', trailingIcon: 'chevron_right' },
      ]}
    />
  )
}`}
          />
        </Step>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--gray-700)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--primary)' }} aria-hidden>lightbulb</span>
          {componentsPackage.published
            ? 'Point your AI assistant (Cursor, Copilot, Claude Code) at this package and it will scaffold with the real components.'
            : "Until then, give your AI assistant the rules file above. It links to each component's spec."}
        </div>
      </ContextCard>

      {/* Consistency footer */}
      <Panel style={{ background: 'var(--blue-100)', border: '1px solid var(--primary)' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 24, color: 'var(--primary)' }} aria-hidden>verified</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 4 }}>
              Why it stays consistent
            </div>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.55 }}>
              Every format is generated from the same source, so each one has the same {COUNT} components,
              tokens, fonts and accessibility rules. A mockup built in Figma Make and a screen built in code
              look and behave the same.
            </p>
          </div>
        </div>
      </Panel>
    </div>
  )
}
