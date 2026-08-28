// SOURCE OF TRUTH for every Inspera token.
//
// This file generates src/tokens.css, packages/components/tokens.css,
// kit/styles.css and public/tokens.w3c.json via scripts/build-portable.ts.
// Add a token here and it appears everywhere; never edit a generated file.

export const brandColors = [
  { name: 'primary.main', value: '#004080', note: 'Primary brand / interactive' },
  { name: 'secondary.main', value: '#322060', note: 'Secondary brand, used sparingly' },
]

export const semanticColors = [
  { name: 'error', value: '#D32F2F' },
  { name: 'warning', value: '#EF6C00' },
  { name: 'info', value: '#0288D1' },
  { name: 'success', value: '#2E7D32' },
]

export const brandAccents = [
  { name: 'zest', value: '#FA5101' },
  { name: 'berry', value: '#89239A' },
  { name: 'algae', value: '#00A788' },
]

export const palette: Record<string, Record<string, string>> = {
  gray: {
    100: '#F7F7F7', 200: '#EDEDED', 300: '#D9D9D9', 400: '#BCBCBC', 500: '#949494',
    600: '#7A7A7A', 700: '#595959', 800: '#404040', 900: '#272727',
  },
  blue: {
    100: '#F0F7FF', 200: '#DBEDFF', 300: '#B3D9FF', 400: '#7ABDFF', 500: '#3399FF',
    600: '#007BF5', 700: '#0059B3', 800: '#004080', 900: '#002E5C',
  },
  green: {
    100: '#F2FDF8', 200: '#E0FAEF', 300: '#BDF4DD', 400: '#8DECC5', 500: '#50E2A5',
    600: '#1BA76D', 700: '#147B50', 800: '#106542', 900: '#0D4F33',
  },
  red: {
    100: '#FEF1F1', 200: '#FCDEDE', 300: '#F9B8B8', 400: '#F58484', 500: '#F04242',
    600: '#E21212', 700: '#A50D0D', 800: '#760A0A', 900: '#550707',
  },
  yellow: {
    100: '#FFFCF0', 200: '#FFF8DC', 300: '#FEF0B3', 400: '#FEE67C', 500: '#FDD835',
    600: '#F2C602', 700: '#B19102', 800: '#7E6701', 900: '#5B4A01',
  },
  orange: {
    100: '#FFFAF0', 200: '#FFF3DC', 300: '#FEE5B3', 400: '#FED27C', 500: '#FDBA35',
    600: '#F2A202', 700: '#D99102', 800: '#7E5501', 900: '#5B3D01',
  },
  purple: {
    100: '#F6F4FB', 200: '#E9E4F6', 300: '#D0C6EC', 400: '#9F88D7', 500: '#8366CC',
    600: '#603DB8', 700: '#462D86', 800: '#322060', 900: '#241745',
  },
  pink: {
    100: '#FEF1F5', 200: '#FCDFE8', 300: '#F8B9CE', 400: '#F386AB', 500: '#ED457D',
    600: '#DF1659', 700: '#A21041', 800: '#740B2E', 900: '#540821',
  },
}

export const spacing = [
  { token: '0', value: 0 }, { token: '1', value: 4 }, { token: '2', value: 8 },
  { token: '3', value: 12 }, { token: '4', value: 16 }, { token: '5', value: 20 },
  { token: '6', value: 24 }, { token: '8', value: 32 }, { token: '10', value: 40 },
  { token: '12', value: 48 }, { token: '16', value: 64 },
]

export const radius = [
  { token: 'none', value: 0 }, { token: 'xs', value: 2 }, { token: 'sm', value: 4 },
  { token: 'md', value: 8 }, { token: 'lg', value: 12 }, { token: 'xl', value: 16 },
  { token: 'pill', value: 9999 },
]

export const shadows = [
  { token: '100', value: '0px 4px 4px rgba(39, 39, 39, 0.08), 0px 2px 4px rgba(39, 39, 39, 0.12)' },
  { token: '200', value: '0px 8px 8px rgba(39, 39, 39, 0.08), 0px 4px 6px rgba(39, 39, 39, 0.12)' },
  { token: '300', value: '0px 8px 16px rgba(39, 39, 39, 0.08), 0px 6px 8px rgba(39, 39, 39, 0.12)' },
  { token: '500', value: '0px 10px 32px rgba(39, 39, 39, 0.1), 0px 6px 14px rgba(39, 39, 39, 0.12)' },
]

/**
 * Type scale — transcribed from the Figma library.
 *
 * The rule the library states: Inter, 140% line-height for text, 120% for
 * headings. Line heights are stored unitless (1.4 / 1.2) so they scale with
 * font-size; `Label` is the one exception Figma fixes outright at 16/20.
 *
 * Tracking is read as px. Only three styles set it: H1 -0.2, H6 +1.6
 * (uppercase), Caption +0.1.
 */
export interface TypeToken {
  /** Figma style name, e.g. "Text/Regular/16". */
  token: string
  /** CSS custom-property and utility-class suffix. */
  name: string
  size: number
  weight: number
  /** Unitless line-height. */
  lineHeight: number
  /** Letter spacing in px. */
  tracking?: number
  transform?: 'uppercase'
  decoration?: 'underline'
  note?: string
}

const TEXT_SIZES = [12, 14, 16, 18, 20, 22, 26]
const TEXT_LH = 1.4
const HEADING_LH = 1.2

const textRamp = (label: string, slug: string, weight: number, sizes: number[] = TEXT_SIZES): TypeToken[] =>
  sizes.map((size) => ({
    token: `Text/${label}/${size}`,
    name: `text-${slug}-${size}`,
    size,
    weight,
    lineHeight: TEXT_LH,
  }))

export const typeScale: TypeToken[] = [
  ...textRamp('Regular', 'regular', 400),
  ...textRamp('Medium', 'medium', 500),
  ...textRamp('Semi Bold', 'semibold', 600),
  // Bold ships only these four sizes in the library.
  ...textRamp('Bold', 'bold', 700, [16, 18, 20, 22]),

  { token: 'Heading/H1', name: 'h1', size: 28, weight: 600, lineHeight: HEADING_LH, tracking: -0.2 },
  { token: 'Heading/H2', name: 'h2', size: 22, weight: 600, lineHeight: HEADING_LH },
  { token: 'Heading/H3', name: 'h3', size: 20, weight: 500, lineHeight: HEADING_LH },
  { token: 'Heading/H4', name: 'h4', size: 18, weight: 500, lineHeight: HEADING_LH },
  { token: 'Heading/H5', name: 'h5', size: 16, weight: 500, lineHeight: HEADING_LH },
  { token: 'Heading/H6', name: 'h6', size: 12, weight: 500, lineHeight: HEADING_LH, tracking: 1.6, transform: 'uppercase' },

  { token: 'Link', name: 'link', size: 16, weight: 500, lineHeight: TEXT_LH, decoration: 'underline' },
  { token: 'Caption', name: 'caption', size: 12, weight: 400, lineHeight: TEXT_LH, tracking: 0.1 },
  { token: 'Documentation', name: 'documentation', size: 14, weight: 300, lineHeight: TEXT_LH, note: 'Inter Light' },
  { token: 'Label', name: 'label', size: 16, weight: 500, lineHeight: 20 / 16, note: 'Fixed 16/20 — buttons and controls' },
]

/** Weights the stylesheet must load. 300 is required by Documentation. */
export const fontWeights = [300, 400, 500, 600, 700]

// ---------------------------------------------------------------------------
// System tokens — the derived / semantic layer. These are not part of the raw
// palette; they name a *role* and point at a palette value. Components should
// prefer these over raw palette shades wherever a role exists.
// ---------------------------------------------------------------------------
export interface SystemToken {
  /** CSS custom property name, without the leading `--`. */
  name: string
  value: string
  note?: string
}

// ---------------------------------------------------------------------------
// Control & status tokens.
//
// These values are rendered by the components today but were never defined as
// tokens, so the spec told AI "never hardcode an off-palette colour" while the
// reference components used ten of them. They are a second neutral ramp,
// distinct from palette.gray — #C4C4C4 borders, not #BCBCBC.
//
// VALUES ARE AS-SHIPPED, NOT YET CONFIRMED AGAINST FIGMA. They are named and
// centralised so that confirming them is a one-line edit here rather than a
// hunt through 23 component files.
// ---------------------------------------------------------------------------
const PENDING = 'Pending Figma verification'

export const statusSurfaces: SystemToken[] = [
  { name: 'info-surface', value: '#E1F5FE', note: `Info Alert/Badge/Tag fill. ${PENDING}` },
  { name: 'success-surface', value: '#E8F5E9', note: `Success fill. ${PENDING}` },
  { name: 'warning-surface', value: '#FFF3E0', note: `Warning fill. ${PENDING}` },
  { name: 'error-surface', value: '#FFEBEE', note: `Error fill. ${PENDING}` },
]

export const controlTokens: SystemToken[] = [
  { name: 'border-control', value: '#C4C4C4', note: `Resting border on inputs, select, toggle track. ${PENDING}` },
  { name: 'border-control-strong', value: '#8C8C8C', note: `Hover border; checkbox and radio resting border. ${PENDING}` },
  { name: 'text-placeholder', value: '#8C8C8C', note: `Placeholder text. ${PENDING}` },
  { name: 'surface-disabled', value: '#F5F5F5', note: `Disabled control fill. ${PENDING}` },
  { name: 'surface-readonly', value: 'var(--gray-100)', note: 'Read-only control fill' },
  { name: 'surface-neutral', value: '#F0F0F0', note: `Neutral Badge/Tag fill. ${PENDING}` },
  { name: 'avatar-surface', value: '#E0E0E0', note: `Avatar fallback fill. ${PENDING}` },
]

// ---------------------------------------------------------------------------
// Non-colour tokens. Without these an AI invents its own — z-index 99999,
// a one-off 350ms transition, a breakpoint nobody else uses.
// ---------------------------------------------------------------------------
export const borderWidths = [
  { token: 'default', value: '1px' },
  { token: 'strong', value: '2px' },
]

export const focusRing = [
  { name: 'focus-ring-width', value: '2px' },
  { name: 'focus-ring-offset', value: '2px' },
  { name: 'focus-ring-color', value: 'var(--primary)' },
]

export const motion = {
  duration: [
    { token: 'instant', value: '0ms', note: 'No transition' },
    { token: 'fast', value: '100ms', note: 'Hover and focus' },
    { token: 'normal', value: '200ms', note: 'Menus, popovers' },
    { token: 'slow', value: '300ms', note: 'Dialogs, drawers' },
  ],
  easing: [
    { token: 'standard', value: 'cubic-bezier(0.2, 0, 0, 1)', note: 'Default' },
    { token: 'enter', value: 'cubic-bezier(0, 0, 0.2, 1)', note: 'Entering the screen' },
    { token: 'exit', value: 'cubic-bezier(0.4, 0, 1, 1)', note: 'Leaving the screen' },
  ],
}

/** Layering scale. Never use an arbitrary value such as 99999. */
export const zIndex = [
  { token: 'base', value: 0 },
  { token: 'sticky', value: 100, note: 'Sticky headers and toolbars' },
  { token: 'dropdown', value: 300, note: 'Select and Menu panels' },
  { token: 'popover', value: 400 },
  { token: 'overlay', value: 500, note: 'Dialog and Drawer scrim' },
  { token: 'modal', value: 600, note: 'Dialog and Drawer surface' },
  { token: 'toast', value: 700, note: 'Snackbar' },
  { token: 'tooltip', value: 800 },
]

/**
 * Shared layout thresholds, not device names. Components should respond to the
 * space they are given rather than to a user-agent guess.
 */
export const breakpoints = [
  { token: 'sm', value: 640 },
  { token: 'md', value: 768 },
  { token: 'lg', value: 1024 },
  { token: 'xl', value: 1280 },
  { token: '2xl', value: 1440 },
]

export const systemTokens: Record<string, SystemToken[]> = {
  Interaction: [
    { name: 'primary-hover-overlay', value: 'rgba(0, 64, 128, 0.04)', note: 'Primary tint on hover' },
    { name: 'primary-focus-ring', value: 'rgba(0, 64, 128, 0.3)', note: 'Focus ring on primary controls' },
    { name: 'action-active', value: 'rgba(0, 0, 0, 0.56)', note: 'Icon / control glyph' },
    { name: 'action-hover', value: 'rgba(0, 0, 0, 0.04)', note: 'Neutral hover wash' },
    { name: 'action-focus', value: 'rgba(0, 0, 0, 0.12)', note: 'Neutral focus wash' },
    { name: 'action-disabled', value: 'rgba(0, 0, 0, 0.38)', note: 'Disabled foreground' },
  ],
  Text: [
    { name: 'text-primary', value: 'rgba(0, 0, 0, 0.87)', note: 'Body and heading text' },
    { name: 'text-secondary', value: 'var(--gray-600)', note: 'Supporting and helper text' },
    { name: 'text-disabled', value: 'var(--action-disabled)', note: 'Disabled text' },
    { name: 'text-on-primary', value: '#ffffff', note: 'Text on a primary-filled surface' },
  ],
  Status: statusSurfaces,
  Controls: controlTokens,
  Surface: [
    { name: 'background', value: 'var(--gray-100)', note: 'App canvas' },
    { name: 'surface', value: 'var(--white)', note: 'Raised surface (cards, panels, inputs)' },
    { name: 'surface-sunken', value: 'var(--gray-100)', note: 'Recessed surface (wells, read-only fields)' },
    { name: 'border', value: 'var(--gray-200)', note: 'Hairline separator' },
    { name: 'border-strong', value: 'var(--gray-300)', note: 'Control outline' },
    { name: 'border-interactive', value: 'var(--gray-500)', note: 'Control outline on hover' },
    { name: 'muted-foreground', value: 'var(--gray-600)', note: 'De-emphasised label text' },
  ],
}

export const fonts = [
  { name: 'font-sans', value: "'Inter', system-ui, -apple-system, sans-serif", note: 'All UI text' },
  { name: 'font-mono', value: "'JetBrains Mono', ui-monospace, monospace", note: 'Code, token values' },
]

/** Base white, kept alongside the palette so `var(--white)` always resolves. */
export const baseColors = [{ name: 'white', value: '#ffffff' }]
