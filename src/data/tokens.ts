// Token data transcribed from DESIGN_SYSTEM_AI_READY_V4.md §3.
// Used to render the Foundations page and token-usage references.

export const brandColors = [
  { name: 'primary.main', value: '#004080', note: 'Primary brand / interactive' },
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
  { token: '100', value: 'var(--shadow-100)' },
  { token: '200', value: 'var(--shadow-200)' },
  { token: '300', value: 'var(--shadow-300)' },
  { token: '500', value: 'var(--shadow-500)' },
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
