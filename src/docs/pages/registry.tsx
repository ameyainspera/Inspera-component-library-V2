import { type ComponentType } from 'react'
import HomeDashboard from './HomeDashboard'
import TestSetup from './TestSetup'
import DeliverTests from './DeliverTests'
import QuestionSets from './QuestionSets'
import MonitorCandidates from './MonitorCandidates'

export interface ExamplePage {
  /** URL slug: #/pages/<slug> */
  slug: string
  /** Display name. */
  name: string
  /** One-line description shown in the gallery and page header. */
  description: string
  /** Material Symbols icon for the gallery card. */
  icon: string
  /** Components this page is assembled from - shown as its "recipe". */
  uses: string[]
  /** Status. "ready" pages render; "coming-soon" show as a placeholder card. */
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
    icon: 'dashboard',
    uses: ['TopNav', 'Stat', 'Card', 'List', 'Toast', 'Badge'],
    status: 'ready',
    component: HomeDashboard,
    entry: '/src/docs/pages/HomeDashboard.tsx',
    extras: ['/src/imports/pasted_text/home-screen.tsx'],
  },
  {
    slug: 'monitor-candidates',
    name: 'Monitor',
    description: 'Monitor > Candidates roster: the Views rail with saved counts, search toolbar, and the wide live candidate grid.',
    icon: 'monitor_heart',
    uses: ['TextInput', 'Table', 'Pagination', 'Badge'],
    status: 'ready',
    component: MonitorCandidates,
    entry: '/src/docs/pages/MonitorCandidates.tsx',
    extras: ['/src/imports/pasted_text/global-nav.tsx'],
  },
  {
    slug: 'question-sets',
    name: 'Question sets',
    description: 'Author > Question Sets roster: the Views rail, search and filter toolbar, the grid with per-row status, and pager.',
    icon: 'quiz',
    uses: ['TextInput', 'Table', 'Pagination', 'Select', 'Button'],
    status: 'ready',
    component: QuestionSets,
    entry: '/src/docs/pages/QuestionSets.tsx',
    extras: ['/src/imports/pasted_text/global-nav.tsx'],
  },
  {
    slug: 'deliver-tests',
    name: 'Deliver',
    description: 'Deliver > Tests roster: the Views rail, search and filter toolbar, the tests grid and pager.',
    icon: 'list_alt',
    uses: ['TextInput', 'Table', 'Pagination', 'Badge', 'Button', 'Select'],
    status: 'ready',
    component: DeliverTests,
    entry: '/src/docs/pages/DeliverTests.tsx',
    extras: ['/src/imports/pasted_text/global-nav.tsx'],
  },
  {
    slug: 'test-setup',
    name: 'Test setup',
    description: 'Deliver > Setup screen: test details, candidate and committee counts, and the Options accordion.',
    icon: 'edit_document',
    uses: ['TextInput', 'Select', 'Textarea', 'Checkbox', 'RadioButton', 'Accordion', 'Badge', 'Button'],
    status: 'ready',
    component: TestSetup,
    entry: '/src/docs/pages/TestSetup.tsx',
    extras: ['/src/imports/pasted_text/global-nav.tsx'],
  },
  {
    slug: 'candidate-list',
    name: 'Candidate list',
    description: 'Filterable roster of candidates with status, cohort and score columns.',
    icon: 'group',
    uses: ['Table', 'Tag', 'TextInput', 'Select', 'Pagination', 'Avatar'],
    status: 'coming-soon',
  },
]

export const examplePageBySlug = (slug: string): ExamplePage | undefined =>
  examplePages.find((p) => p.slug === slug)
