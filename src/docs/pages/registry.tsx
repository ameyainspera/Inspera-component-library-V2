import { type ComponentType } from 'react'
import HomeDashboard from './HomeDashboard'
import TestSetup from './TestSetup'
import DeliverTests from './DeliverTests'
import QuestionSets from './QuestionSets'
import NewAuthor from './NewAuthor'
import MonitorCandidates from './MonitorCandidates'
import DataRichList from './DataRichList'

export interface ExamplePage {
  /** URL slug: #/pages/<slug> */
  slug: string
  /** Display name. */
  name: string
  /** One-line description shown in the gallery and page header. */
  description: string
  /** Where the screen lives in the product, shown under the name in the gallery and the preview toolbar. */
  location?: string
  /**
   * Library components the page imports - shown as its "recipe". For a ready
   * page `pnpm audit:pages` checks this against the source; for a coming-soon
   * page it is the plan.
   */
  uses: string[]
  /** Status. "ready" pages render; "coming-soon" show as a placeholder card with the work-in-progress icon. */
  status: 'ready' | 'coming-soon'
  /** The page itself. Omitted for coming-soon entries. */
  component?: ComponentType
  /** Absolute /src path of the page's source file, for the downloadable bundle. */
  entry?: string
  /** Absolute /src paths of non-library modules the page imports (nav, etc). */
  extras?: string[]
}

/**
 * Full example screens assembled from library components. They exist so a design
 * change or a new feature starts from a real Inspera page instead of a blank
 * canvas - copy a page, swap the data, and the tokens and components keep it on
 * system automatically.
 */
export const examplePages: ExamplePage[] = [
  {
    slug: 'home-dashboard',
    name: 'Home dashboard',
    description: 'Institution home screen: global nav, the metrics band and the recent events feed.',
    // A pasted reference screen: not yet rebuilt from library components.
    uses: [],
    status: 'ready',
    component: HomeDashboard,
    entry: '/src/docs/pages/HomeDashboard.tsx',
    extras: ['/src/imports/pasted_text/home-screen.tsx'],
  },
  {
    slug: 'monitor-candidates',
    name: 'Monitor',
    description: 'Monitor > Candidates roster: the Views rail with saved counts, search toolbar, and the wide live candidate grid.',
    location: 'Landing',
    uses: ['TextInput', 'Pagination'],
    status: 'ready',
    component: MonitorCandidates,
    entry: '/src/docs/pages/MonitorCandidates.tsx',
    extras: ['/src/imports/pasted_text/global-nav.tsx'],
  },
  {
    slug: 'question-sets',
    name: 'Question sets',
    description: 'Author > Question Sets roster: the Views rail, search and filter toolbar, the grid with per-row status, and pager.',
    location: 'Author > Question Sets',
    uses: ['TextInput', 'Pagination'],
    status: 'ready',
    component: QuestionSets,
    entry: '/src/docs/pages/QuestionSets.tsx',
    extras: ['/src/imports/pasted_text/global-nav.tsx'],
  },
  {
    slug: 'new-author-edit',
    name: 'New author - Edit',
    description: 'Question-set editor: the tool rail, the sections and questions panel, the rich-text question editor, and the settings for the open question.',
    location: 'Author > Question Sets > Create new > New author',
    uses: ['Tabs'],
    status: 'ready',
    component: NewAuthor,
    entry: '/src/docs/pages/NewAuthor.tsx',
  },
  {
    slug: 'deliver-tests',
    name: 'Deliver',
    description: 'Deliver > Tests roster: the Views rail, search and filter toolbar, the tests grid and pager.',
    location: 'Deliver > Tests',
    uses: ['TextInput', 'Pagination'],
    status: 'ready',
    component: DeliverTests,
    entry: '/src/docs/pages/DeliverTests.tsx',
    extras: ['/src/imports/pasted_text/global-nav.tsx'],
  },
  {
    slug: 'test-setup',
    name: 'Test setup',
    description: 'Deliver > Setup screen: test details, candidate and committee counts, and the Options accordion.',
    location: 'Deliver > Tests > Create new > IA',
    uses: ['TextInput', 'Textarea', 'Select', 'Checkbox', 'RadioButton', 'Badge'],
    status: 'ready',
    component: TestSetup,
    entry: '/src/docs/pages/TestSetup.tsx',
    extras: ['/src/imports/pasted_text/global-nav.tsx'],
  },
  {
    slug: 'data-rich-list',
    name: 'Data-rich list',
    description: 'A starting point for any list of records, not a product screen: search, a status filter, an advanced search dialog, a sortable data grid with three sets of figures, and a card view.',
    // No location: it is a starting point, not a screen in the product.
    uses: [
      'Badge', 'Breadcrumb', 'Button', 'Card', 'Checkbox', 'DataGrid', 'DatePicker', 'Dialog',
      'EmptyState', 'NumberInput', 'Progress', 'SegmentedControl', 'Select', 'Tag', 'TextInput',
    ],
    status: 'ready',
    component: DataRichList,
    entry: '/src/docs/pages/DataRichList.tsx',
  },
  // Coming-soon kits go last; the gallery lists them after the ready ones wherever they sit here.
  {
    slug: 'new-author-design',
    name: 'New author - Design',
    description: 'Question-set editor in its Design view.',
    location: 'Author > Question Sets > Create new > New author',
    // No plan yet: the components are picked once the screen's references are in.
    uses: [],
    status: 'coming-soon',
  },
  {
    slug: 'candidate-dashboard',
    name: 'Candidate dashboard',
    description: "The candidates' dashboard.",
    // No plan yet, as above.
    uses: [],
    status: 'coming-soon',
  },
]

export const examplePageBySlug = (slug: string): ExamplePage | undefined =>
  examplePages.find((p) => p.slug === slug)
