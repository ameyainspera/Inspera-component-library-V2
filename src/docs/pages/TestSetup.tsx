import { type ReactNode, useState } from 'react'
import {
  Badge, Checkbox, RadioButton, TextInput, Textarea, Select,
} from '../../components/inspera'
import { AssessorNav } from '../../imports/pasted_text/global-nav'

/**
 * Test setup - the first step of Inspera's assessment authoring flow, rebuilt
 * from library components. It mirrors the real Deliver > Setup screen: a form
 * of test details, candidate / committee counts, and an Options accordion whose
 * General settings, Security and Exam Day sections start expanded. The top
 * global nav is Inspera's real AssessorNav component; the sticky step footer is
 * page chrome, not a library component, so it is built inline here.
 */

/* --- Small building blocks --------------------------------------------- */

// The real product's palette, reproduced verbatim from the reference screenshot.
// These CTAs and links are deliberately off the design-system tokens for now -
// the user wants an exact rebuild first, reconciliation with the system later.
const GREEN = '#2e9e5b' // "Add candidates to test" affordance
const LINK = '#1a6fd4' // inline "Learn more" links
const CTA = '#d9432c' // primary red action buttons (Manage / Add / Next)

/** Red primary action button matching the reference (Manage / Add / Next). */
function CtaButton({
  label,
  icon,
  size = 'Medium',
}: {
  label: string
  icon?: string
  size?: 'Small' | 'Medium'
}) {
  return (
    <button
      type="button"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        height: size === 'Small' ? 32 : 38, padding: '0 16px',
        background: CTA, color: '#fff', border: 'none',
        borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)',
        fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
      }}
    >
      {label}
      {icon && <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>{icon}</span>}
    </button>
  )
}

/** Radio control for the Invitation-mode row. Tints green when it is the
 *  selected "Add candidates" option; otherwise it shows a neutral grey ring. */
function InviteRadio({
  selected,
  accent,
  onChange,
}: {
  selected: boolean
  accent?: string
  onChange: () => void
}) {
  const color = accent ?? 'var(--primary)'
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={selected}
      style={{
        width: 18, height: 18, padding: 0, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
        background: 'transparent',
        border: `2px solid ${selected ? color : 'var(--border-strong)'}`,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {selected && <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />}
    </button>
  )
}

/** A checkbox that tints green when selected, matching the "recommended"
 *  toggles in the real product (Enable Sketches, Show Lost Connection Alert). */
function GreenCheck({
  label,
  defaultChecked = false,
  learnMore = false,
  hint,
}: {
  label: string
  defaultChecked?: boolean
  learnMore?: boolean
  hint?: string
}) {
  const [checked, setChecked] = useState(defaultChecked)
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
      <button
        type="button"
        onClick={() => setChecked((c) => !c)}
        aria-pressed={checked}
        style={{
          width: 16, height: 16, marginTop: 2, padding: 0, flexShrink: 0, cursor: 'pointer',
          borderRadius: 3, border: checked ? 'none' : '1.5px solid var(--border-strong)',
          background: checked ? GREEN : 'var(--white)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {checked && (
          <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#fff', fontWeight: 700 }} aria-hidden>check</span>
        )}
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14, color: checked ? GREEN : 'var(--text-primary)', fontWeight: checked ? 500 : 400 }}>{label}</span>
          {learnMore && <LearnMore />}
        </span>
        {hint && <span style={{ fontSize: 12, color: 'var(--muted-foreground)', lineHeight: 1.4 }}>{hint}</span>}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</span>
      {children}
    </div>
  )
}

function LearnMore() {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      style={{ fontSize: 13, color: LINK, textDecoration: 'none', fontWeight: 500 }}
    >
      Learn more
    </a>
  )
}

function SubHeading({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: '4px 0 2px' }}>
      {children}
    </div>
  )
}

/** Light rule that separates the sub-groups inside an accordion section. */
function SectionDivider() {
  return <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0' }} />
}

/** A checkbox with an optional inline "Learn more", an info dot, and sub-copy.
 *  The label column is nudged down so its first line lines up with the centre
 *  of the box (the DS Checkbox carries its own 8px vertical padding). */
function CheckRow({
  label,
  defaultChecked = false,
  learnMore = false,
  info = false,
  hint,
}: {
  label: string
  defaultChecked?: boolean
  learnMore?: boolean
  info?: boolean
  hint?: string
}) {
  const [checked, setChecked] = useState(defaultChecked)
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
      <Checkbox label={label} checked={checked} onChange={setChecked} withLabel={false} size="Small" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, paddingTop: 7 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>{label}</span>
          {learnMore && <LearnMore />}
          {info && (
            <span className="material-symbols-outlined" style={{ fontSize: 15, color: 'var(--muted-foreground)' }} aria-hidden>
              info
            </span>
          )}
        </span>
        {hint && <span style={{ fontSize: 12, color: 'var(--muted-foreground)', lineHeight: 1.4 }}>{hint}</span>}
      </div>
    </div>
  )
}

const stack = (gap: number): React.CSSProperties => ({ display: 'flex', flexDirection: 'column', gap })

/* --- Options section bodies -------------------------------------------- */

function GeneralSettings() {
  const [marking, setMarking] = useState(true)
  const [candidateReport, setCandidateReport] = useState(false)
  return (
    <div style={stack(20)}>
      <div style={stack(10)}>
        <SubHeading>Test options</SubHeading>
        <CheckRow label="Oral exam" />
        <CheckRow label="Enable pci based assessment delivery" />
        <CheckRow
          label="Enable auto submission (home exam)"
          learnMore
          info
          hint="Answers are automatically submitted upon test end time"
        />
        <CheckRow label="Grading Only - Disable candidates from taking this test online" />
        <CheckRow label="Distributed access" />
        <CheckRow
          label="Require all test assets to be downloaded before starting the test"
          learnMore
          hint="We recommend running a practice test ahead of exam day in order to check the suitability of all assets"
        />
        <CheckRow label="Enable automated test construction" />
        <CheckRow
          label="Enable Idle warning in Monitor"
          hint="Candidates will be flagged by a warning if idle for more than 1 minutes during the test"
        />
        <CheckRow label="Enable video-based oral exam" hint="Only visible to CA" />
        <CheckRow label="Grade in Feedback Studio" />
        <CheckRow label="Hide test from candidates" />
        <CheckRow label="Hide test and candidates from Deliver and Monitor tools for specified user roles" />
      </div>

      <div style={stack(8)}>
        <SubHeading>Marking 2.0 <LearnMore /></SubHeading>
        <Checkbox label="Enable Marking 2.0 on this test" checked={marking} onChange={setMarking} size="Small" />
      </div>

      <div style={stack(8)}>
        <SubHeading>Candidate report</SubHeading>
        <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
          Allow candidates to review the candidate report. <LearnMore />
        </span>
        <Checkbox label="Enable Candidate Report" checked={candidateReport} onChange={setCandidateReport} size="Small" />
      </div>

      <SectionDivider />

      <div style={stack(8)}>
        <SubHeading>Workspace scheme for Marking 2.0</SubHeading>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{
            height: 40, display: 'inline-flex', alignItems: 'center', padding: '0 12px',
            border: '1px solid var(--border-control)', borderRadius: 'var(--radius-md)',
            fontSize: 14, color: 'var(--text-primary)', background: 'var(--white)',
          }}>
            Standard Scheme (Default)
          </div>
          <CtaButton label="Manage" />
        </div>
      </div>
    </div>
  )
}

function twoCol(): React.CSSProperties {
  return { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }
}

function Security() {
  return (
    <div style={twoCol()}>
      <div style={stack(14)}>
        <div style={stack(10)}>
          <SubHeading>Require Locked Browser</SubHeading>
          <CheckRow label="Safe Exam Browser for PC and Mac" />
          <CheckRow label="Inspera Locked browser for Chromebooks" />
        </div>
        <div style={stack(10)}>
          <SubHeading>Open Browser</SubHeading>
          <CheckRow label="Require Invigilator Password" />
        </div>
        <SectionDivider />
        <div style={stack(8)}>
          <SubHeading>Readiness check</SubHeading>
          <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
            Readiness check is a mandatory form before taking the test.
          </span>
          <CheckRow label="Enable Readiness check" />
        </div>
      </div>

      <div style={stack(14)}>
        <div style={stack(10)}>
          <CheckRow label="Request Originality Report" info />
          <CheckRow label="ID check." learnMore />
          <CheckRow label="Require Day Password" learnMore />
          <CheckRow label="Enable Open Live Session (For testing only)" />
          <CheckRow
            label="Start test manually"
            hint="This will require invigilators to manually start tests via Monitor"
          />
        </div>
        <div style={stack(8)}>
          <SubHeading>Invigilator instructions PDF</SubHeading>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>upload_file</span>
            Upload
          </a>
        </div>
      </div>
    </div>
  )
}

function ExamDay() {
  const [messageMode, setMessageMode] = useState<'default' | 'custom'>('default')
  return (
    <div style={twoCol()}>
      <div style={stack(14)}>
        <div style={stack(10)}>
          <SubHeading>Candidate tools and aids</SubHeading>
          <CheckRow label="Enable Text to Speech reading aid" learnMore />
          <CheckRow label="Enable Spell Checker" learnMore />
        </div>
        <div style={stack(8)}>
          <SubHeading>Candidate Dashboard</SubHeading>
          <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
            Access to active tests, archive and demo tests
          </span>
          <CheckRow
            label="Disable Dashboard on exam day"
            hint="Upon successful login, candidates will be sent directly to the test ticket."
          />
        </div>
        <div style={stack(10)}>
          <SubHeading>Chat</SubHeading>
          <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
            Offer support with chat. <LearnMore />
          </span>
          <CheckRow
            label="Before test"
            hint="This will allow candidates to start chat after login, before the test has been started"
          />
          <CheckRow
            label="During test"
            hint="This will allow candidates to start chats during the test window"
          />
        </div>
      </div>

      <div style={stack(14)}>
        <div style={stack(10)}>
          <SubHeading>Hand drawing on paper</SubHeading>
          <GreenCheck label="Enable Sketches (Inspera Docs/Scan)" defaultChecked />
          <CheckRow
            label="Lock submissions when grading starts"
            hint="This prevents submissions in this test to be affected by future failed imports to other tests"
          />
        </div>
        <div style={stack(8)}>
          <SubHeading>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Virtual Desktop Environment <Badge label="New" intent="Success" size="Small" />
            </span>
          </SubHeading>
          <span style={{ fontSize: 13, color: 'var(--muted-foreground)', lineHeight: 1.4 }}>
            Allows secure use of third party applications by carrying out test in VMware, Citrix, Amazon AppStream or other VDI.
          </span>
          <CheckRow label="Enable VDI" />
        </div>
        <div style={stack(8)}>
          <SubHeading>Lost Connection Alert</SubHeading>
          <GreenCheck label="Show Lost Connection Alert (Recommended)" defaultChecked />
          <span style={{ fontSize: 12, color: 'var(--muted-foreground)', lineHeight: 1.4 }}>
            The Lost Connection Alert is a notification that is displayed when internet connection has been lost for more than one minute. <LearnMore />
          </span>
          <div style={{ display: 'flex', gap: 20, marginTop: 2 }}>
            <RadioButton
              label="Default message"
              name="lca-message"
              selected={messageMode === 'default'}
              onChange={() => setMessageMode('default')}
            />
            <RadioButton
              label="Custom message"
              name="lca-message"
              selected={messageMode === 'custom'}
              onChange={() => setMessageMode('custom')}
            />
          </div>
          <Textarea
            label="Message shown to the candidate"
            showLabel={false}
            rows={2}
            defaultValue="Local network issues. This might be permanent. Please contact an invigilator to download submission."
            disabled={messageMode === 'default'}
          />
        </div>
      </div>
    </div>
  )
}

function AfterTest() {
  const [shareComments, setShareComments] = useState<'private' | 'shared'>('private')
  return (
    <div style={twoCol()}>
      <div style={stack(14)}>
        <div style={stack(10)}>
          <SubHeading>Post-submission review</SubHeading>
          <CheckRow label="Allow candidate post-submission review" />
        </div>
        <div style={stack(10)}>
          <SubHeading>Results page (when submitting)</SubHeading>
          <CheckRow label="Enable Results Page" info />
        </div>
        <div style={stack(10)}>
          <SubHeading>Final Results</SubHeading>
          <CheckRow label="Show Final Marks or Grades on Candidate Dashboard" />
          <CheckRow label="Send e-mail notifications to students" />
        </div>
      </div>

      <div style={stack(14)}>
        <div style={stack(10)}>
          <SubHeading>Share comments with candidate. <LearnMore /></SubHeading>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <InviteRadio selected={shareComments === 'private'} accent={GREEN} onChange={() => setShareComments('private')} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: shareComments === 'private' ? GREEN : 'var(--text-primary)' }}>Not shared.</span>
              <span style={{ fontSize: 13, color: shareComments === 'private' ? GREEN : 'var(--muted-foreground)' }}>Comments are private to each grader.</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <InviteRadio selected={shareComments === 'shared'} accent={GREEN} onChange={() => setShareComments('shared')} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: shareComments === 'shared' ? GREEN : 'var(--text-primary)' }}>Shared with candidate.</span>
              <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Available for candidates with status <em>Graded</em>.</span>
            </div>
          </div>
        </div>

        <div style={stack(8)}>
          <SubHeading>Comment settings</SubHeading>
          <span style={{ fontSize: 13, color: 'var(--muted-foreground)', lineHeight: 1.5 }}>
            Allow graders to post annotations and page notes of the following types:
          </span>
          <CheckRow
            label="Allow graders to post comments to each other"
            hint="The Co-grader channel is only available if multiple graders are assigned"
          />
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{ fontSize: 13, color: LINK, textDecoration: 'none', fontWeight: 500 }}
          >
            Show all commenting permissions
          </a>
        </div>

        <div style={stack(8)}>
          <SubHeading>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Convert submitted files to PDF <Badge label="New" intent="Success" size="Small" />
            </span>
          </SubHeading>
          <span style={{ fontSize: 13, color: 'var(--muted-foreground)', lineHeight: 1.5 }}>
            Enables annotation and page notes on candidates' submissions directly in Marking.
          </span>
          <CheckRow label="Convert files to PDF" />
        </div>
      </div>
    </div>
  )
}

/** Light-blue informational callout used in the grading workflow sections. */
function InfoBox({ children }: { children: ReactNode }) {
  return (
    <div style={{
      background: '#e8f1fb', borderRadius: 'var(--radius-sm)', padding: '12px 14px',
      fontSize: 13, lineHeight: 1.5, color: 'var(--text-primary)', fontWeight: 600,
    }}>
      {children}
    </div>
  )
}

/** A green-tinted radio option with a bold title and supporting copy. */
function GreenRadio({
  selected,
  title,
  description,
  onChange,
  disabled = false,
  children,
}: {
  selected: boolean
  title: string
  description?: string
  onChange: () => void
  disabled?: boolean
  children?: ReactNode
}) {
  const titleColor = disabled ? 'var(--muted-foreground)' : selected ? GREEN : 'var(--text-primary)'
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', opacity: disabled ? 0.6 : 1 }}>
      <InviteRadio selected={selected} accent={GREEN} onChange={disabled ? () => {} : onChange} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: titleColor }}>{title}</span>
        {description && <span style={{ fontSize: 13, color: 'var(--muted-foreground)', lineHeight: 1.4 }}>{description}</span>}
        {children}
      </div>
    </div>
  )
}

function GradingWorkflowNew() {
  return (
    <div style={{ maxWidth: 380, ...stack(14) }}>
      <Field label="Select grading workflow">
        <TextInput label="Select grading workflow" showLabel={false} placeholder="Select grading workfl..." trailingIcon="account_tree" />
      </Field>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
        <a href="#" onClick={(e) => e.preventDefault()} style={{ color: LINK, textDecoration: 'none', fontWeight: 500 }}>View details</a>
        <span style={{ color: 'var(--border-strong)' }}>|</span>
        <a href="#" onClick={(e) => e.preventDefault()} style={{ color: LINK, textDecoration: 'none', fontWeight: 500 }}>Open grader and group assignment</a>
      </span>
    </div>
  )
}

function LegacyGradingWorkflow() {
  const [alignMarks, setAlignMarks] = useState<'private' | 'shared'>('private')
  const [ownGrades, setOwnGrades] = useState<'own' | 'across'>('own')
  const [confirmation, setConfirmation] = useState<'all' | 'one'>('all')
  return (
    <div style={stack(20)}>
      {/* General workflow */}
      <div style={twoCol()}>
        <div style={stack(8)}>
          <SubHeading>General workflow</SubHeading>
          <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
            How should the grading process be completed? <LearnMore />
          </span>
          <div style={{ width: '100%', maxWidth: 480 }}>
            <Select
              label="General workflow"
              showLabel={false}
              widthMode="Hug"
              options={['Confirm all candidates at once (Default)', 'Confirm one candidate at a time']}
              defaultValue="Confirm all candidates at once (Default)"
            />
          </div>
        </div>
        <div style={{ ...stack(8), paddingTop: 26 }}>
          <CheckRow
            label="Auto Confirm Grading"
            hint="Marks will be confirmed automatically post submission"
          />
        </div>
      </div>

      <SectionDivider />

      {/* Collaboration settings */}
      <SubHeading>Collaboration settings</SubHeading>
      <div style={twoCol()}>
        <div style={stack(14)}>
          <div style={stack(10)}>
            <SubHeading>Setting marks and grades <LearnMore /></SubHeading>
            <GreenRadio
              selected={alignMarks === 'private'}
              title="Private marking and results alignment"
              onChange={() => setAlignMarks('private')}
            >
              <span style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                Graders set marks and/or grades privately. Then they must share and align results before they can be confirmed.
              </span>
              <div style={{ marginTop: 8 }}>
                <CheckRow
                  label="Require graders to align marks"
                  hint="When selected, graders are required to set the same mark on each response to be able to confirm final grading."
                />
              </div>
            </GreenRadio>
            <GreenRadio
              selected={alignMarks === 'shared'}
              title="Shared marking"
              description="Collaborative marking and grading."
              onChange={() => setAlignMarks('shared')}
            />
          </div>

          <SectionDivider />

          <div style={stack(8)}>
            <SubHeading>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                AI-supported marking <Badge label="New" intent="Success" size="Small" /> <LearnMore />
              </span>
            </SubHeading>
            <CheckRow
              label="Enable AI-supported marking"
              hint="Answers are automatically submitted for AI evaluation upon test end time"
            />
            <InfoBox>AI-supported marking is not compatible with Sketches/Inspera Docs.</InfoBox>
          </div>
        </div>

        <div style={stack(14)}>
          <div style={stack(10)}>
            <SubHeading>Sharing marks and grades with committee <LearnMore /></SubHeading>
            <GreenRadio
              selected={ownGrades === 'own'}
              title="Allow completing Own Grades by committee"
              description="Recommended for committees with separate deadlines"
              onChange={() => setOwnGrades('own')}
            />
            <GreenRadio
              selected={ownGrades === 'across'}
              title="Require Own Grades to be confirmed across all committees"
              description="Recommended for committees with coinciding deadlines"
              onChange={() => setOwnGrades('across')}
              disabled
            />
            <InfoBox>Sharing and confirming across committees not supported in Marking 2.0. <LearnMore /></InfoBox>
          </div>

          <SectionDivider />

          <div style={stack(10)}>
            <SubHeading>Confirmation of marks and grades <LearnMore /></SubHeading>
            <GreenRadio
              selected={confirmation === 'all'}
              title="All graders must confirm"
              description="Require all graders to confirm Final Grades."
              onChange={() => setConfirmation('all')}
            />
            <GreenRadio
              selected={confirmation === 'one'}
              title="One grader can confirm"
              description="Allow one grader to confirm Final Grades on behalf of all graders."
              onChange={() => setConfirmation('one')}
            />
          </div>

          <SectionDivider />

          <div style={stack(8)}>
            <SubHeading>Question assignment <LearnMore /></SubHeading>
            <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Marking 2.0 and Shared marking required.</span>
            <CheckRow label="Enable question assignment" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ExplanationOfGrades() {
  return (
    <div style={stack(10)}>
      <SubHeading>Explanations of grades</SubHeading>
      <CheckRow label="Enable administration of Explanations" />
    </div>
  )
}

const optionsItems = [
  { title: 'General settings', content: <GeneralSettings /> },
  { title: 'Security', content: <Security /> },
  { title: 'Exam Day', content: <ExamDay /> },
  { title: 'After test', content: <AfterTest /> },
  { title: 'Grading workflow (New)', content: <GradingWorkflowNew /> },
  { title: 'Legacy Grading Workflow', content: <LegacyGradingWorkflow /> },
  { title: 'Explanation of Grades', content: <ExplanationOfGrades /> },
]

/**
 * The Options accordion as it appears in the real product: each section is its
 * own white card with a light border, a slightly darker bottom edge, and a
 * left-aligned chevron that points right when collapsed and down when open.
 * Deliberately page-local - this styling differs from the library Accordion.
 */
function OptionsAccordion({
  items,
  defaultOpen = [],
}: {
  items: { title: string; content: ReactNode }[]
  defaultOpen?: number[]
}) {
  const [open, setOpen] = useState<Set<number>>(() => new Set(defaultOpen))
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((item, i) => {
        const isOpen = open.has(i)
        return (
          <div
            key={item.title}
            style={{
              background: 'var(--white)',
              border: '1px solid var(--border)',
              borderBottom: '2px solid var(--border-strong)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
            }}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => toggle(i)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '13px 16px', background: 'transparent', border: 'none',
                cursor: 'pointer', font: 'inherit', fontFamily: 'var(--font-sans)', textAlign: 'left',
              }}
            >
              <span
                className="material-symbols-outlined"
                aria-hidden
                style={{
                  fontSize: 22, color: 'var(--text-primary)',
                  transition: 'transform 160ms ease',
                  transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                }}
              >
                chevron_right
              </span>
              <span style={{ fontSize: 16, color: 'var(--text-primary)' }}>{item.title}</span>
            </button>
            {isOpen && (
              <div style={{ padding: '4px 16px 20px 44px', fontSize: 14, lineHeight: 1.5, color: 'var(--gray-700)' }}>
                {item.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* --- Count blocks (candidates / committees / child tests) -------------- */

function CountCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      flex: '1 1 220px', minWidth: 200, maxWidth: 260, padding: '18px 18px 22px',
      border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--white)',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Label sits top-left, the count top-right, then a hairline rule with a
          little breathing room below it - matching the real cards. */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontSize: 26, fontWeight: 400, lineHeight: 1, color: 'var(--muted-foreground)' }}>{value}</span>
      </div>
      <div style={{ marginTop: 20, borderTop: '1px solid var(--border)' }} />
    </div>
  )
}

/** A "N candidates / N Committees" block: heading + red action, a row of count
 *  cards, and a closing full-width divider that separates it from the next. */
function CountBlock({ title, action, cards }: { title: string; action: string; cards: [string, string][] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 28, borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h2>
        <CtaButton label={action} />
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {cards.map(([l, v]) => <CountCard key={l} label={l} value={v} />)}
      </div>
    </div>
  )
}

/* --- Page chrome ------------------------------------------------------- */

const steps = [
  { label: 'Setup', icon: 'settings', active: true },
  { label: 'Design', icon: 'desktop_windows' },
  { label: 'Assessment settings', icon: 'view_list' },
  { label: 'Confirm', icon: 'check' },
]

function Footer() {
  return (
    <footer style={{
      position: 'sticky', bottom: 0, flexShrink: 0, zIndex: 5,
      background: 'var(--gray-200)', borderTop: '1px solid var(--border)', fontFamily: 'var(--font-sans)',
      display: 'flex', alignItems: 'stretch', gap: 20, padding: '0 20px', height: 56,
    }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 14, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
        Standard mode
        <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>expand_more</span>
      </span>
      <div style={{ display: 'flex', alignItems: 'stretch', flex: 1, justifyContent: 'center', gap: 6, overflow: 'hidden' }}>
        {steps.map((s) =>
          s.active ? (
            <span
              key={s.label}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, alignSelf: 'stretch',
                padding: '0 34px 0 22px', fontSize: 15, fontWeight: 600,
                background: '#2b2b2b', color: '#fff', whiteSpace: 'nowrap',
                // Flat left edge, arrow point on the right - the full-height ribbon.
                clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>{s.icon}</span>
              {s.label}
            </span>
          ) : (
            <span
              key={s.label}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '0 18px', fontSize: 15, whiteSpace: 'nowrap',
                color: 'var(--text-primary)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--text-secondary)' }} aria-hidden>{s.icon}</span>
              {s.label}
            </span>
          ),
        )}
      </div>
      <span style={{ display: 'inline-flex', alignItems: 'center' }}>
        <CtaButton label="Next" icon="chevron_right" />
      </span>
    </footer>
  )
}

/* --- Page -------------------------------------------------------------- */

export default function TestSetup() {
  const [testName, setTestName] = useState('New Test')
  const [sessionId, setSessionId] = useState('')
  const [testInfo, setTestInfo] = useState('')
  const [lateSubmissions, setLateSubmissions] = useState(false)
  const [multipleAttempts, setMultipleAttempts] = useState(false)
  const [invitation, setInvitation] = useState<'add' | 'code'>('add')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', background: 'var(--background)' }}>
      <AssessorNav activeId="deliver" onHome={() => {}} onNavigate={() => {}} />

      {/* Breadcrumb bar */}
      <div style={{
        flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        padding: '10px 24px', background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        fontFamily: 'var(--font-sans)',
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--text-secondary)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>home</span>
          Tests
          <span className="material-symbols-outlined" style={{ fontSize: 16 }} aria-hidden>chevron_right</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>New Test</span>
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--muted-foreground)' }} aria-hidden>edit</span>
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
          1 contributors
          <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>history</span>
        </span>
      </div>

      {/* Form body - centered column. */}
      <main style={{ flex: 1 }}>
        <div style={{
          maxWidth: 1000, padding: '24px 40px 56px',
          marginLeft: 'auto', marginRight: 'auto',
          display: 'flex', flexDirection: 'column', gap: 28, fontFamily: 'var(--font-sans)',
        }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 600, color: 'var(--text-primary)' }}>Setup</h1>

          {/* Details. The right-hand fields are pickers (Question Set opens a
              bank browser, Template a template list), so they read as plain
              white fields with a trailing action icon - not dropdowns. */}
          <div style={stack(18)}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', columnGap: 48, rowGap: 20 }}>
              <Field label="Test name">
                <TextInput label="Test name" showLabel={false} value={testName} onChange={setTestName} trailingIcon="edit" />
              </Field>
              <Field label="Question Set">
                <TextInput label="Question set" showLabel={false} placeholder="-Select question set-" trailingIcon="folder_open" />
              </Field>
              <Field label="Session ID">
                <TextInput label="Session ID" showLabel={false} placeholder="Enter Session ID" value={sessionId} onChange={setSessionId} />
              </Field>
              <Field label="Access Group">
                <TextInput label="Access group" showLabel={false} placeholder="-Select Access Group-" />
              </Field>
            </div>

            <div style={{ maxWidth: 360 }}>
              <Field label="Template">
                <TextInput label="Template" showLabel={false} placeholder="-Select template-" trailingIcon="segment" />
              </Field>
            </div>

            {/* Times - each field is a date box plus a time box; the wrapping
                divs give them stable widths so the time box never collapses. */}
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              <Field label="Test start time">
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ width: 150 }}><TextInput label="Start date" showLabel={false} leadingIcon="calendar_today" placeholder="Not set" /></div>
                  <div style={{ width: 130 }}><TextInput label="Start time" showLabel={false} leadingIcon="schedule" defaultValue="10:00 AM" /></div>
                </div>
              </Field>
              <Field label="Test end time">
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ width: 150 }}><TextInput label="End date" showLabel={false} leadingIcon="calendar_today" placeholder="Not set" /></div>
                  <div style={{ width: 130 }}><TextInput label="End time" showLabel={false} leadingIcon="schedule" defaultValue="12:00 PM" /></div>
                </div>
              </Field>
              <Field label="Duration (hh:mm)">
                <div style={{ width: 170 }}><TextInput label="Duration" showLabel={false} leadingIcon="schedule" defaultValue="No limit" /></div>
              </Field>
            </div>

            <div style={stack(10)}>
              <Checkbox label="Enable late submissions" checked={lateSubmissions} onChange={setLateSubmissions} size="Small" />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Checkbox label="Enable Multiple Attempts" checked={multipleAttempts} onChange={setMultipleAttempts} size="Small" />
                <LearnMore />
                <span className="material-symbols-outlined" style={{ fontSize: 15, color: 'var(--muted-foreground)' }} aria-hidden>info</span>
              </span>
            </div>

            <Field label="Test information">
              <Textarea label="Test information" showLabel={false} rows={2} placeholder="Replace this text." value={testInfo} onChange={setTestInfo} />
            </Field>
          </div>

          {/* Invitation mode - both options share one row, framed by the light
              section dividers seen in the real screen. The selected "Add
              candidates" affordance is a green radio + green label (no check). */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap',
            padding: '18px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
          }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>Invitation mode:</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
              <InviteRadio selected={invitation === 'add'} accent={GREEN} onChange={() => setInvitation('add')} />
              <span style={{ fontSize: 14, color: GREEN, fontWeight: 500 }}>Add candidates to test</span>
              <LearnMore />
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
              <InviteRadio selected={invitation === 'code'} onChange={() => setInvitation('code')} />
              <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>Invite by sharing Test Code</span>
              <LearnMore />
            </span>
          </div>

          {/* Counts */}
          <CountBlock title="0 candidates" action="Manage" cards={[['View all', '0'], ['Extra time', '0']]} />
          <CountBlock title="0 Committees" action="Manage" cards={[['View all', '0'], ['Primary round', '0'], ['Appeals', '0']]} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 28, borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 600, color: 'var(--text-primary)' }}>0 Child tests</h2>
            <CtaButton label="Add" />
          </div>

          {/* Options */}
          <div style={stack(12)}>
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 600, color: 'var(--text-primary)' }}>Options</h2>
            <OptionsAccordion items={optionsItems} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
