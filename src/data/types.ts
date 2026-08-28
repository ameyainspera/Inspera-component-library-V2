// Shared data shapes for the Inspera component library.
// Shared shapes for the component metadata in components.ts.

export type Category =
  | 'input-controls'
  | 'data-display'
  | 'feedback'
  | 'navigation'

export interface ComponentSpec {
  slug: string
  /** Human-readable display name, e.g. "OTP Input". */
  name: string
  /**
   * The React export name, when it differs from `name` with spaces removed
   * (e.g. "OTP Input" displays that way but exports as `OtpInput`). The
   * generator asserts this resolves to a real export.
   */
  exportName?: string
  category: Category
  purpose: string
  status: 'ready' | 'coming-soon'
  deprecatedAliases: string[]
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
}

export interface NavGroup {
  label: string
  category: Category
  items: { slug: string; name: string; status: 'ready' | 'coming-soon' }[]
}
