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

export const typeScale = [
  { token: 'heading.h1', size: 28.83, weight: 600, sample: 'Heading H1' },
  { token: 'heading.h2', size: 22.78, weight: 500, sample: 'Heading H2' },
  { token: 'heading.h3', size: 20.25, weight: 500, sample: 'Heading H3' },
  { token: 'heading.h4', size: 18, weight: 500, sample: 'Heading H4' },
  { token: 'heading.h5', size: 16, weight: 500, sample: 'Heading H5' },
  { token: 'body.mdRegular', size: 16, weight: 400, sample: 'Body medium regular' },
  { token: 'body.mdMedium', size: 16, weight: 500, sample: 'Body medium medium' },
  { token: 'body.semiBold16', size: 16, weight: 600, sample: 'Body semibold 16' },
  { token: 'body.caption', size: 12, weight: 400, sample: 'Caption text' },
]

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
