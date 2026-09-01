/**
 * SOURCE OF TRUTH for system-level guidance: the rules an agent must follow,
 * and how to assemble canonical components into screens.
 *
 * This is the layer the component specs cannot supply. We document 42
 * components well; without this, nothing says how to build a *page* out of
 * them - which is where generated UI drifts apart between tools.
 *
 * Hand-written, but emitted by scripts/build-portable.ts into every published
 * artifact and covered by the CI drift check, so it cannot become a second
 * document that quietly disagrees with the first.
 */

/** Rules that override an agent's own judgement. Ordered by how often they are broken. */
export const contract: string[] = [
  'Do not invent design decisions. Never invent a colour, spacing value, radius, shadow, font size, weight, icon library, focus style, breakpoint, or component variant that this document defines.',
  'Use a canonical component before building a lookalike. If one exists for the job, use it.',
  'Never rename a canonical component or prop. A deprecated alias may be understood as input, but output must use the canonical name.',
  'Consume tokens, not literals. Raw values here define what a token resolves to; application code references `var(--token)`.',
  'Do not introduce another design system. No Material UI, Bootstrap, Ant, Chakra, shadcn default styling, Tailwind default palette, or Radix Themes look. Headless behaviour libraries are fine if restyled entirely to this spec.',
  'No arbitrary Tailwind values where a token exists. Never `bg-[#004080]` - use the token.',
  'Inter for product UI. Noto Sans Mono only for code, identifiers and technical values; Noto Serif only for long-form content.',
  'Material Symbols Outlined only. Do not mix in Lucide, Heroicons, or Font Awesome.',
  'Accessibility is part of the component contract, not an enhancement. Keyboard operation, visible focus, labels, roles, names, and states are required.',
  'Never use colour alone to carry meaning. Pair it with text, an icon, or shape.',
  'Respect `prefers-reduced-motion: reduce` - drop non-essential motion.',
  'Compose rather than invent. If a pattern is not a canonical component, build it from canonical components using the patterns below.',
  'Do not silently add a component. If the system genuinely cannot express something, emit `DESIGN_SYSTEM_GAP` in your output and use the closest documented composition.',
  'No decoration that competes with hierarchy: no gradients, glassmorphism, oversized radii, decorative shadows, or animated backgrounds.',
]

/** What wins when two instructions conflict. */
export const precedence: string[] = [
  'Accessibility and safety requirements',
  'The rules above',
  'Token definitions',
  'Canonical component specifications',
  'Composition patterns',
  'Product requirements supplied with the task',
  'Examples',
]

export const whenUnsure: string[] = [
  'Reuse the nearest canonical component or composition.',
  'Reuse an existing token.',
  'Preserve the established density and hierarchy.',
  'Do not infer a brand colour or visual style from framework defaults.',
  'Mark a genuinely missing primitive `DESIGN_SYSTEM_GAP` rather than presenting it as canonical.',
]

export interface Pattern {
  name: string
  /** Which canonical components it is built from. */
  from: string[]
  guidance: string[]
}

/**
 * Compositions, NOT new component names. These do not authorise a new export;
 * they say how to arrange existing ones.
 */
export const patterns: Pattern[] = [
  {
    name: 'Search field',
    from: ['TextInput'],
    guidance: [
      'A `TextInput` with a leading `search` icon, plus a trailing clear action when there is a value.',
      'Keep a visible label unless surrounding UI makes the purpose unambiguous and provides a programmatic label.',
      'The clear control needs an accessible name such as "Clear search".',
      'Do not give it a different border, radius, or focus treatment from a normal TextInput.',
    ],
  },
  {
    name: 'Page header',
    from: ['Breadcrumb', 'Button', 'Menu', 'Tabs'],
    guidance: [
      'Order: breadcrumb (if a hierarchy exists), H1 title, optional supporting description or status, then actions.',
      'Exactly one primary action. Everything else is Secondary, Outline, Text, or inside a Menu.',
      'Tabs belong below the title region, and only when they switch sibling views of the same object.',
      'Collapse actions beneath the title when width is constrained rather than shrinking them.',
    ],
  },
  {
    name: 'Side navigation',
    from: ['Link', 'Badge', 'Tooltip'],
    guidance: [
      'The selected item must be distinguished by more than colour - weight, a rule, or a background.',
      'Collapsed icon-only items require accessible names and a Tooltip.',
      'Preserve DOM and keyboard order when collapsing.',
    ],
  },
  {
    name: 'Toolbar / action bar',
    from: ['Button', 'Menu', 'Select', 'TextInput', 'Divider'],
    guidance: [
      'Order by frequency and importance; keep one local primary action.',
      'Push low-frequency actions into a Menu rather than shrinking targets to fit.',
    ],
  },
  {
    name: 'Filter bar',
    from: ['Select', 'DatePicker', 'TextInput', 'Tag', 'Button'],
    guidance: [
      'Show active criteria as removable `Tag`s, so the current filter state is readable as text and not only as colour.',
      'Show a reset action only when at least one non-default filter is active.',
    ],
  },
  {
    name: 'Table toolbar',
    from: ['TextInput', 'Select', 'Button', 'Table', 'Pagination'],
    guidance: [
      'Search and filter controls come before table actions.',
      'Keep table context visible while filtering; never swap the table for a bare spinner.',
    ],
  },
  {
    name: 'Settings row',
    from: ['Toggle', 'Checkbox', 'Select', 'Divider'],
    guidance: [
      'Order: setting title, supporting description, then the control.',
      'Do not place the control between title and description - it breaks reading order.',
      "The control's accessible name must map to the setting title.",
      'Use a Divider only where it genuinely improves grouping.',
    ],
  },
  {
    name: 'Status indicator',
    from: ['Badge', 'Tag'],
    guidance: [
      'Always pair the colour with a label or icon. A bare coloured dot is not a status.',
      'Use `Badge` for state that is read, `Tag` for something the user can remove or filter by.',
    ],
  },
  {
    name: 'Empty results',
    from: ['EmptyState', 'Button'],
    guidance: [
      'Use `EmptyState` when a search or filter legitimately returns nothing.',
      'Say what happened and offer the next step - usually clearing the filters.',
      'A zero-result query is not an error. Do not show a failure state for it.',
    ],
  },
]

export const formRules: string[] = [
  'Wrap each control in `FormField` for consistent label, help, and error layout.',
  'One visible label per field. A placeholder is not a label.',
  'Show help text or an error, not both; when invalid, the error must be programmatically associated with the control.',
  'Use `RadioGroup` for mutually exclusive choices and `CheckboxGroup` for multi-select.',
  'Use `Select` for a compact choice; enable its search mode for long lists.',
  'Use `FileUpload` for files - never a text input styled to look like one.',
  'Keep required/optional wording consistent within a form.',
  'Never clear user input when validation fails.',
  'Do not make a disabled submit button the only signal that something is wrong.',
]

export const tableRules: string[] = [
  'Right-align numeric columns; keep headers short.',
  'Expose sort direction programmatically, not just with an arrow glyph.',
  'Use `Checkbox` for row selection and show a selected count.',
  'Use `Skeleton` for initial load and `Spinner` for a user-triggered refresh.',
  'An empty dataset and a no-results-for-this-filter state are different - say which.',
  'Page long tables with `Pagination`.',
  'Do not shrink text or targets to fit more columns; prioritise columns or scroll the table.',
]

/** Which feedback component to reach for, by scope. */
export const feedbackHierarchy: { scope: string; use: string }[] = [
  { scope: 'A single invalid field', use: 'Error text on the field itself, via FormField' },
  { scope: 'A section or the whole form', use: 'Alert, placed near the affected content' },
  { scope: 'Confirming something just happened', use: 'Snackbar' },
  { scope: 'A decision that must block progress', use: 'Dialog - only when it genuinely must block' },
  { scope: 'A secondary task or detail panel', use: 'Drawer' },
  { scope: 'Known-duration work', use: 'Progress' },
  { scope: 'Unknown-duration work', use: 'Spinner' },
  { scope: 'Initial page or table load', use: 'Skeleton' },
  { scope: 'Nothing to show', use: 'EmptyState' },
]

/** Run before calling generated UI finished. */
export const checklist: { group: string; items: string[] }[] = [
  {
    group: 'Visual system',
    items: [
      'Every colour resolves to a token - no hex literals in application code.',
      'Spacing, radius and shadow values come from the scales.',
      'Typography uses Inter and the documented type scale.',
      'Icons are Material Symbols Outlined.',
      'No framework default styling leaked through.',
    ],
  },
  {
    group: 'Components',
    items: [
      'Canonical components were used where one exists.',
      'No component or prop was renamed; prop names are camelCase, variant values Capitalised.',
      'No undocumented variant was invented.',
      'Any genuine gap is marked DESIGN_SYSTEM_GAP.',
    ],
  },
  {
    group: 'Accessibility',
    items: [
      'Every interactive element is reachable and operable by keyboard.',
      'Focus is always visible, and focus order follows reading order.',
      'Labels, roles, names and states are programmatically available.',
      'Errors are associated with their field and announced.',
      'Overlays move focus in, keep it inside while modal, and restore it on close.',
      'No status is conveyed by colour alone.',
      'prefers-reduced-motion is respected.',
    ],
  },
  {
    group: 'Responsive',
    items: [
      'No horizontal page scroll at standard zoom.',
      'Action areas wrap or collapse rather than shrink.',
      'Forms stay readable on a narrow viewport.',
      'Tables have a deliberate small-screen strategy.',
      'Reading and focus order still make sense after reflow.',
    ],
  },
]

/**
 * One complete screen, in both forms.
 *
 * Everything else in this file tells a model what to do. This shows it. The
 * composition patterns above describe a page header, a filter bar and a table
 * toolbar in prose, and prose is the weakest way to convey layout - a model
 * asked for "an assessment list" has to reassemble three separate descriptions
 * and guess how they nest. A worked example is the thing it can copy, and
 * models copy far more reliably than they follow instructions.
 *
 * Deliberately one screen, not three. It is built only from components
 * documented below, so it doubles as proof that the system composes.
 */
export const workedScreen = {
  name: 'Assessment list',
  summary:
    'A page header, a filter bar, a table with status badges, and pagination. ' +
    'Built from Breadcrumb, Button, Select, DatePicker, Tag, Table, Badge and ' +
    'Pagination - no new components.',
  notes: [
    'The page owns exactly one Primary button. Everything else is Secondary, Outline or Text.',
    'Active filters appear as removable Tags, so the current state is readable as text and not only as colour.',
    'Status is a Badge with a word in it. A bare coloured dot is not a status.',
    'The numeric column is right-aligned; the header stays short.',
    'Spacing is the scale: 24px page padding, 16px between regions, 8px inside a control cluster.',
  ],
  tsx: `import {
  Breadcrumb, Button, Select, DatePicker, Tag, Table, Badge, Pagination,
} from '@inspera/components'

export function AssessmentList() {
  return (
    <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Assessments' }]} />

      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
        <h1 className="inspera-h1" style={{ margin: 0 }}>Assessments</h1>
        <Button label="New assessment" intent="Primary" content="Icon + Text" icon="add" />
      </header>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <Select label="Status" options={['All', 'Live', 'Draft', 'Scheduled']} value="All" />
        <DatePicker label="Created after" value="2026-01-01" />
        <Button label="Reset" intent="Text" />
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <Tag label="Status: Live" removable />
        <Tag label="Created after 1 Jan" removable />
      </div>

      <Table
        columns={[
          { key: 'name', header: 'Assessment' },
          { key: 'items', header: 'Items', align: 'right' },
          { key: 'status', header: 'Status' },
        ]}
        rows={[
          { name: 'Algebra Quiz', items: 24, status: <Badge label="Live" intent="Success" /> },
          { name: 'History Midterm', items: 40, status: <Badge label="Draft" intent="Neutral" /> },
          { name: 'Biology Final', items: 60, status: <Badge label="Scheduled" intent="Info" /> },
        ]}
      />

      <Pagination page={1} totalPages={8} />
    </div>
  )
}`,
  html: `<!-- Requires the one-time setup block and the tokens from Setup. -->
<div class="page">
  <nav class="inspera-breadcrumb" aria-label="Breadcrumb">
    <ol>
      <li><a class="inspera-breadcrumb__link" href="/">Home</a></li>
      <li aria-current="page">Assessments</li>
    </ol>
  </nav>

  <header class="page__header">
    <h1 class="inspera-h1">Assessments</h1>
    <button type="button" class="inspera-btn inspera-btn--primary">
      <span class="material-symbols-outlined" aria-hidden="true">add</span>
      <span>New assessment</span>
    </button>
  </header>

  <div class="page__filters">
    <!-- Select and DatePicker markup: see their own sections. -->
    <button type="button" class="inspera-btn inspera-btn--text">Reset</button>
  </div>

  <div class="page__tags">
    <span class="inspera-tag">Status: Live
      <button type="button" class="inspera-tag__remove" aria-label="Remove status filter">
        <span class="material-symbols-outlined" aria-hidden="true">close</span>
      </button>
    </span>
  </div>

  <table class="inspera-table">
    <thead>
      <tr>
        <th scope="col">Assessment</th>
        <th scope="col" class="inspera-table__num">Items</th>
        <th scope="col">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Algebra Quiz</td>
        <td class="inspera-table__num">24</td>
        <td><span class="inspera-badge inspera-badge--success">Live</span></td>
      </tr>
    </tbody>
  </table>
</div>

<style>
  .page          { padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-4); }
  .page__header  { display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); }
  .page__filters { display: flex; align-items: flex-end; gap: var(--space-2); flex-wrap: wrap; }
  .page__tags    { display: flex; gap: var(--space-2); flex-wrap: wrap; }
</style>`,
}
