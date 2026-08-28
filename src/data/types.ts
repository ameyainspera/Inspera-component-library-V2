// Shared data shapes for the Inspera component library.
// Shared shapes for the component metadata in components.ts.

export type Category =
  | 'input-controls'
  | 'data-display'
  | 'feedback'
  | 'navigation'

export interface PropSpec {
  name: string
  values: string
  default?: string
  description: string
}

export interface ComponentSpec {
  slug: string
  name: string
  category: Category
  purpose: string
  status: 'ready' | 'coming-soon'
  deprecatedAliases: string[]
  props: PropSpec[]
  tokens: string[]
  accessibility: {
    role: string
    keyboard: boolean
    ariaNotes: string[]
  }
  usage: {
    do: string[]
    dont: string[]
  }
  /** Raw canonical spec block, shown verbatim in the AI copy panel. */
  specYaml: string
}

export interface NavGroup {
  label: string
  category: Category
  items: { slug: string; name: string; status: 'ready' | 'coming-soon' }[]
}
