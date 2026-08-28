import { type ReactNode } from 'react'
import { Panel, SectionTitle, CodeBlock, CopyButton } from './primitives'

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
          background: 'var(--primary)', color: '#fff', fontSize: 12, fontWeight: 700,
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

const PRIMER_PROMPT = `You are building UI with the Inspera Design System.

Rules:
- Use ONLY the 42 Inspera components (Button, TextInput, Select, Card,
  Table, List, Dialog, Tabs, etc.). Do not invent variants or rename props.
- Style everything with Inspera tokens — never hardcode off-palette colors.
  Primary brand: #004080. Fonts: Inter (UI), JetBrains Mono (code),
  Material Symbols Outlined (icons).
- Follow the accessibility notes (roles, aria, keyboard) for every component.

Full spec: <paste the contents of inspera-llms.txt, or link to it>.

Now build: <describe the screen / flow / mockup you want>.`

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
          This library ships from a single source in three portable formats, so whatever workspace
          you design or build in — Figma Make, an AI app builder, or a real codebase — your screens,
          flows, and mockups come out on-brand and consistent. Pick the path that matches your tool.
        </p>
      </header>

      {/* At-a-glance chooser */}
      <Panel>
        <SectionTitle sub="Three outputs, one source of truth. Regenerated together via `pnpm generate`.">
          What ships with the library
        </SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          {[
            { icon: 'inventory_2', title: 'npm package', mono: '@inspera/components', note: 'Real React components + tokens.css for code projects.' },
            { icon: 'description', title: 'Portable spec', mono: 'inspera-llms.txt', note: 'A single file any AI builder can read to stay on-brand.' },
            { icon: 'widgets', title: 'Figma Make Kit', mono: 'kit/', note: 'Constrains the Make agent to Inspera components & tokens.' },
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
        eyebrow="Design-to-build in Figma"
        title="Figma Make"
        blurb="Attach the Inspera Kit to a Make project. The Make agent is then constrained to Inspera components, tokens, and guidance — every generated screen inherits the system automatically."
        best="Generating screens, flows, and mockups conversationally inside Figma."
      >
        <Step n={1} title="Publish or attach the Inspera Kit">
          <p style={{ margin: 0, fontSize: 13, color: 'var(--muted-foreground)', lineHeight: 1.5 }}>
            In Figma Make, open <strong>Kits → Create / Publish kit</strong> and point it at the
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, margin: '0 4px' }}>kit/</code>
            directory (or the published <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>@inspera/kit</code>). New projects can attach it.
          </p>
        </Step>
        <Step n={2} title="Prompt as normal">
          <p style={{ margin: 0, fontSize: 13, color: 'var(--muted-foreground)', lineHeight: 1.5 }}>
            Describe the screen or flow you want. With the kit attached, the agent must build with
            Inspera components and tokens — no extra instructions needed.
          </p>
        </Step>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--gray-700)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--accent-algae, #00A788)' }} aria-hidden>info</span>
          Kit enforcement is Figma-Make-only. In other tools, use the npm package or portable spec below.
        </div>
      </ContextCard>

      {/* Any AI builder */}
      <ContextCard
        icon="smart_toy"
        eyebrow="Cursor · v0 · Lovable · Bolt · Claude · ChatGPT"
        title="Any AI builder"
        blurb="Give the AI the portable spec so it knows the exact components, props, tokens, and accessibility rules. It then generates UI that matches Inspera even without the package installed."
        best="Vibe-coding, prototypes, and chats where you can't install packages."
      >
        <Step n={1} title="Grab the portable spec">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <a
              href="/inspera-llms.txt"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 12px',
                borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)',
                background: '#fff', color: 'var(--gray-800)', textDecoration: 'none', fontSize: 13, fontWeight: 500,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }} aria-hidden>open_in_new</span>
              Open inspera-llms.txt
            </a>
            <CopyButton text={`${typeof window !== 'undefined' ? window.location.origin : ''}/inspera-llms.txt`} label="Copy link" />
          </div>
        </Step>
        <Step n={2} title="Prime the model, then describe your screen">
          <p style={{ margin: 0, fontSize: 13, color: 'var(--muted-foreground)', lineHeight: 1.5 }}>
            Paste the spec (or link it) at the start of your session, then ask for what you need.
            Copy this primer to get going:
          </p>
          <CodeBlock code={PRIMER_PROMPT} language="prompt" copyLabel="Copy primer" />
        </Step>
      </ContextCard>

      {/* Code project */}
      <ContextCard
        icon="code"
        eyebrow="React codebase"
        title="Code projects"
        blurb="Install the real components and import the token stylesheet. This is the strictest path — the components enforce the spec at runtime, so consistency is guaranteed."
        best="Production apps and anywhere the AI can install dependencies."
      >
        <Step n={1} title="Install the package">
          <CodeBlock code={`npm i @inspera/components`} language="bash" copyLabel="Copy" />
        </Step>
        <Step n={2} title="Import tokens once, then use components">
          <CodeBlock
            language="tsx"
            copyLabel="Copy"
            code={`import '@inspera/components/tokens.css'
import { Button, List } from '@inspera/components'

export function SettingsScreen() {
  return (
    <List
      interactive
      items={[
        { primary: 'General settings', secondary: 'Language, timezone, theme', leading: 'settings', trailing: 'chevron_right' },
        { primary: 'Notifications', secondary: 'Email and push preferences', leading: 'notifications', trailing: 'chevron_right' },
        { primary: 'Security', secondary: 'Password and two-factor auth', leading: 'lock', trailing: 'chevron_right' },
      ]}
    />
  )
}`}
          />
        </Step>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--gray-700)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--primary)' }} aria-hidden>lightbulb</span>
          Point your AI assistant (Cursor, Copilot, Claude Code) at this package and it will scaffold with the real components.
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
              All three formats are generated from the same source in <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>src/</code>.
              Whichever path you take, you get the same 42 components, the same tokens (Inter, JetBrains Mono, Material Symbols,
              the <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>#004080</code> navy palette), and the same accessibility rules —
              so a mockup built in Figma Make and a production screen built in code look and behave the same.
            </p>
          </div>
        </div>
      </Panel>
    </div>
  )
}
