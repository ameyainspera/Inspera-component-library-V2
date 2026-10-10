/**
 * What DESIGN.md relies on the library for, claim by claim.
 *
 * Each claim quotes the design guide exactly. When the quote disappears, the
 * design team changed that passage, and the audit asks for the claim to be
 * re-read and re-mapped - so a claim can never silently check text that is
 * no longer there.
 *
 *   check     compares the claim with library data: null when they agree,
 *             otherwise what the library does instead.
 *   sections  the parts of the full guide the claim describes. When one of
 *             them changes, the claim is up for review (`--update` records it).
 *   known     the known difference in src/data/design-md.ts that acknowledges
 *             the claim's disagreement, and says which file to follow.
 *
 * Bulk checks - every token in the front matter, every row of the component
 * index - live in design-md-check.ts and need no claim. `acknowledged` below
 * ties their findings to known differences.
 */
import { contrastRatio, TEXT_CONTRAST, textSafeShades } from './contrast'
import {
  type Library, buttonPadding, describedNumbers, missingRadius, missingShadow, px, styleRadius, unionOf,
} from './design-md-library'

export interface Claim {
  id: string
  /** The design-md file it is in. */
  file: string
  /** Text that must still be in the file, exactly. */
  quote: string
  /** What the guide says, in a few words. */
  says: string
  check?: (lib: Library) => string | null
  sections?: string[]
  known?: string
}

const D = 'DESIGN.md'
const COMPONENTS = 'references/components.md'
const PALETTE = 'references/tokens-palette.md'

const missing = (list: string[], what: string) => (list.length ? `${list.join(', ')} ${list.length === 1 ? 'does' : 'do'} not use ${what}` : null)

/** For each family, the lightest shade with 4.5:1 on white and the gray-100 canvas. */
const safeShades = (lib: Library) => textSafeShades(lib.palette, ['#ffffff', lib.palette.gray['100']])

const written: Claim[] = [
  // -- How DESIGN.md and the full guide share the work. The library repeats
  //    this split (designGuideNote, the start-here note), so a change here
  //    means updating both.
  {
    id: 'precedence',
    file: D,
    quote: 'the full guide wins for component internals and this file wins for screen composition',
    says: 'The full guide wins on component internals; DESIGN.md on screen composition.',
  },
  {
    id: 'radius-exception',
    file: D,
    quote: 'The one exception is corner radius, where this file wins',
    says: 'DESIGN.md wins on corner radius.',
  },

  // -- What it expects of the full guide and the package.
  {
    id: 'full-guide-name',
    file: D,
    quote: 'Full guide (`inspera-design-system.md`)',
    says: 'The full guide is called inspera-design-system.md.',
    check: (lib) => (lib.fullGuideName === 'inspera-design-system.md' ? null : `it downloads as ${lib.fullGuideName}`),
  },
  {
    id: 'setup-section',
    file: D,
    quote: 'paste the `:root` token block from the full guide (Setup section)',
    says: 'The full guide has a Setup section with the :root token block.',
    check: (lib) => (lib.sections.get('Setup')?.includes(':root {') ? null : 'the full guide has no Setup section with a :root block'),
    sections: ['Setup'],
  },
  {
    id: 'without-the-package',
    file: D,
    quote: 'Build markup from the full guide\'s "Without the package" HTML/CSS',
    says: 'Each component in the full guide has "Without the package" HTML and CSS.',
    check: (lib) => (lib.fullGuide.includes('#### Without the package') ? null : 'the full guide has no "Without the package" sections'),
  },
  {
    id: 'screen-templates',
    file: D,
    quote: 'use the **Screen templates** section of the full guide',
    says: 'The full guide has a Screen templates section.',
    check: (lib) => ([...lib.sections.keys()].some((s) => /screen templates/i.test(s)) ? null : 'the full guide has no Screen templates section'),
  },
  {
    id: 'package-unpublished',
    file: D,
    quote: 'The npm package is not published.',
    says: '@inspera/components is not published.',
    check: (lib) => (lib.packagePublished ? 'the package is published now' : null),
  },
  {
    id: 'guide-version',
    file: D,
    quote: 'AI build guide v1.0.0',
    says: 'Its tokens mirror the full guide v1.0.0.',
    check: (lib) => (lib.version === '1.0.0' ? null : `the full guide is v${lib.version}`),
  },
  {
    id: 'component-count',
    file: D,
    quote: 'The system has 48 canonical components',
    says: 'There are 48 components.',
    check: (lib) => (Object.keys(lib.api).length === 48 ? null : `there are ${Object.keys(lib.api).length}`),
  },
  {
    id: 'aliases',
    file: D,
    quote: '(`Modal`, `Dropdown`, `Chip`, `Switch`',
    says: 'Modal, Dropdown, Chip and Switch are deprecated aliases.',
    check: (lib) => {
      const gone = ['Modal', 'Dropdown', 'Chip', 'Switch'].filter((a) => !lib.aliases[a])
      return gone.length ? `${gone.join(', ')} ${gone.length === 1 ? 'is' : 'are'} not deprecated aliases` : null
    },
  },
  {
    id: 'hidden-labels',
    file: D,
    quote: '(`showLabel={false}` or `withLabel={false}`)',
    says: 'Controls hide their label with showLabel or withLabel.',
    check: (lib) => {
      const names = new Set(Object.values(lib.api).flat().map((p) => p.name))
      const gone = ['showLabel', 'withLabel'].filter((n) => !names.has(n))
      return gone.length ? `no component has ${gone.join(' or ')}` : null
    },
  },

  // -- Foundations.
  {
    id: 'fonts',
    file: D,
    quote: 'Load Inter (300/400/500/600)',
    says: 'Inter weights 300, 400, 500 and 600.',
    check: (lib) => (lib.fullGuide.includes('Inter:wght@300;400;500;600') ? null : 'the font import loads other Inter weights'),
    sections: ['Setup'],
  },
  {
    id: 'text-shades',
    file: D,
    quote: 'use **700 or darker** in gray, blue, green and pink, **800 or darker** in yellow and orange, and **600 or darker** in red and purple',
    says: 'Text-safe shades: gray, blue, green and pink 700; yellow and orange 800; red and purple 600.',
    check: (lib) => {
      const said: Record<string, string> = { gray: '700', blue: '700', green: '700', pink: '700', yellow: '800', orange: '800', red: '600', purple: '600' }
      const actual = safeShades(lib)
      const wrong = Object.keys(said).filter((f) => actual[f] !== said[f])
      // The ratio of the shade DESIGN.md names, when it is the one that fails.
      const why = (f: string) => {
        const r = contrastRatio(lib.palette[f][said[f]], '#ffffff')
        return r < TEXT_CONTRAST ? ` (${f}-${said[f]} is ${r.toFixed(2)}:1)` : ''
      }
      return wrong.length ? wrong.map((f) => `${f} ${actual[f] ?? 'none'}${why(f)}`).join(', ') : null
    },
  },
  {
    id: 'palette-text-shades',
    file: PALETTE,
    quote: 'gray, blue, green and pink **700**; yellow and orange **800**; red and purple **600**',
    says: 'Lightest text-safe shades: gray, blue, green, pink 700; yellow, orange 800; red, purple 600.',
    check: (lib) => {
      const said: Record<string, string> = { gray: '700', blue: '700', green: '700', pink: '700', yellow: '800', orange: '800', red: '600', purple: '600' }
      const actual = safeShades(lib)
      const wrong = Object.keys(said).filter((f) => actual[f] !== said[f])
      return wrong.length ? wrong.map((f) => `${f} ${actual[f] ?? 'none'}`).join(', ') : null
    },
  },
  {
    id: 'layering',
    file: D,
    quote: 'base 0, sticky 100, dropdown 300, popover 400, overlay (scrim) 500, modal 600, toast 700, tooltip 800',
    says: 'The z-index scale.',
    check: (lib) => {
      const said: Record<string, string> = { base: '0', sticky: '100', dropdown: '300', popover: '400', overlay: '500', modal: '600', toast: '700', tooltip: '800' }
      const wrong = Object.keys(said).filter((k) => lib.vars.get(`z-${k}`) !== said[k])
      return wrong.length ? wrong.map((k) => `z-${k} is ${lib.vars.get(`z-${k}`) ?? 'missing'}`).join(', ') : null
    },
  },
  {
    id: 'motion',
    file: D,
    quote: 'Hover and focus take 100ms, menus and popovers 200ms, and dialogs and drawers 300ms',
    says: 'Durations 100 / 200 / 300ms.',
    check: (lib) => {
      const said: Record<string, string> = { fast: '100ms', normal: '200ms', slow: '300ms' }
      const wrong = Object.keys(said).filter((k) => lib.vars.get(`duration-${k}`) !== said[k])
      return wrong.length ? wrong.map((k) => `duration-${k} is ${lib.vars.get(`duration-${k}`) ?? 'missing'}`).join(', ') : null
    },
  },
  {
    id: 'breakpoints',
    file: D,
    quote: '`sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1440',
    says: 'Breakpoints 640 / 768 / 1024 / 1280 / 1440.',
    check: (lib) => {
      const said: Record<string, number> = { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1440 }
      const wrong = Object.keys(said).filter((k) => px(lib.vars.get(`breakpoint-${k}`)) !== said[k])
      return wrong.length ? wrong.map((k) => `breakpoint-${k} is ${lib.vars.get(`breakpoint-${k}`) ?? 'missing'}`).join(', ') : null
    },
  },
  {
    id: 'field-focus',
    file: D,
    quote: 'ring the wrapper with `--effect-state-focus`',
    says: 'Fields show focus as the --effect-state-focus ring.',
    check: (lib) => (lib.vars.has('effect-state-focus') ? null : 'there is no --effect-state-focus token'),
    sections: ['Text Input', 'Select', 'Combobox'],
  },

  // -- Corner radius, which DESIGN.md decides.
  {
    id: 'radius-controls',
    file: D,
    quote: 'Pagination cells, Segmented Control and contained-Tabs tracks',
    says: 'Controls, Pagination cells and the Segmented Control and contained-Tabs tracks are 4px (sm).',
    check: (lib) => missing(missingRadius(lib, 'sm', [
      'Button', 'TextInput', 'Textarea', 'Select', 'Combobox', 'DatePicker', 'DateRangePicker', 'NumberInput',
      'OtpInput', 'Menu', 'Pagination', 'SegmentedControl', 'Tabs', 'List', 'Tooltip',
    ]), '--radius-sm'),
  },
  {
    id: 'radius-triggers',
    file: D,
    quote: 'Date Picker and Date Range Picker triggers, Number Input, OTP boxes, Menu trigger',
    says: 'The Select, Combobox, Date Picker, Date Range Picker and Menu triggers are 4px (sm), like the controls beside them.',
    // radius-controls only asks whether a component uses --radius-sm anywhere.
    // These five also draw an 8px panel, and Menu's options are 4px, so its
    // 8px trigger passed unseen. This reads each trigger's own style.
    check: (lib) => {
      const triggers = [['Select', 'box'], ['Combobox', 'fieldBox'], ['DatePicker', 'box'], ['DateRangePicker', 'box'], ['Menu', 'triggerStyle']]
      const off = triggers.map(([c, style]) => [c, styleRadius(lib, c, style)]).filter(([, r]) => r !== 'sm')
      return off.length ? off.map(([c, r]) => `the ${c} trigger ${r ? `is --radius-${r}` : 'style was not found'}`).join(', ') : null
    },
  },
  {
    id: 'radius-nested',
    file: D,
    quote: 'the selected segment, contained-tab item, Number Input steppers',
    says: 'Checkbox, Rating, Link focus, and what sits inside a 4px control are 2px (xs).',
    // SegmentedControl has no segment nested in a track now: see segmented-control.
    // NumberInput has no stepper nested in its field now: see number-input-steppers.
    check: (lib) => missing(missingRadius(lib, 'xs', ['Checkbox', 'Rating', 'Link', 'Tabs']), '--radius-xs'),
  },
  {
    id: 'radius-panels',
    file: D,
    quote: '**Panels and messages:** Menu, Select and Combobox lists',
    says: 'Panels and messages are 8px (md).',
    check: (lib) => missing(missingRadius(lib, 'md', [
      'Menu', 'Select', 'Combobox', 'DatePicker', 'Popover', 'Alert', 'Snackbar', 'Table', 'DataGrid', 'Accordion', 'List', 'FileUpload',
    ]), '--radius-md'),
  },
  {
    id: 'radius-containers',
    file: D,
    quote: '**Containers:** Card, Dialog, Stat tile, Command Palette',
    says: 'Containers are 12px (lg).',
    check: (lib) => missing(missingRadius(lib, 'lg', ['Card', 'Dialog', 'Stat', 'CommandPalette']), '--radius-lg'),
  },
  {
    id: 'radius-round',
    file: D,
    quote: 'Only conceptually round shapes: Toggle, Radio, Badge, Tag, Avatar, Progress, Stepper indicator',
    says: 'Round shapes use pill.',
    check: (lib) => missing(missingRadius(lib, 'pill', ['Toggle', 'RadioButton', 'Badge', 'Tag', 'Avatar', 'Progress', 'Stepper']), '--radius-pill'),
  },

  // -- Elevation.
  {
    id: 'shadow-100',
    file: D,
    quote: 'Selected segment in SegmentedControl and Contained Tabs',
    says: 'shadow-100: the selected segment and contained tab.',
    // SegmentedControl's selected segment is not raised now: see segmented-control.
    check: (lib) => missing(missingShadow(lib, '100', ['Tabs']), '--shadow-100'),
  },
  {
    id: 'shadow-200',
    file: D,
    quote: 'Raised Card, Menu panel, Date picker popover',
    says: 'shadow-200: Card, Menu, Date Picker.',
    check: (lib) => missing(missingShadow(lib, '200', ['Card', 'Menu', 'DatePicker']), '--shadow-200'),
  },
  {
    id: 'shadow-300',
    file: D,
    quote: 'Popover, Snackbar and Toast, Command Palette',
    says: 'shadow-300: Popover, Snackbar, Command Palette.',
    check: (lib) => missing(missingShadow(lib, '300', ['Popover', 'Snackbar', 'CommandPalette']), '--shadow-300'),
  },
  {
    id: 'shadow-500',
    file: D,
    quote: '| 500 | `shadow-500` | Dialog |',
    says: 'shadow-500: Dialog.',
    check: (lib) => missing(missingShadow(lib, '500', ['Dialog']), '--shadow-500'),
  },

  // -- Component internals DESIGN.md describes in prose.
  {
    id: 'button-type',
    file: D,
    quote: 'It is **16px/600** at Medium and Large; only a Small button uses **14px/600**, with a 16px icon.',
    says: 'Button text is 16px/600 at Medium and Large, and 14px/600 with a 16px icon at Small.',
    check: (lib) => {
      const src = lib.source('Button')
      const size = (s: string) => src.match(new RegExp(`${s}:\\s*\\{[^}]*?type: '([\\w-]+)'[^}]*?icon: (\\d+)`))
      const textOf = (m: RegExpMatchArray | null) => (m ? px(lib.classes.get(m[1])?.['font-size']) : null)
      const [small, medium, large] = [size('Small'), size('Medium'), size('Large')]
      const said = textOf(small) === 14 && small?.[2] === '16' && textOf(medium) === 16 && textOf(large) === 16
      if (said && /fontWeight: 600/.test(src)) return null
      return `Small ${textOf(small) ?? '?'}px with a ${small?.[2] ?? '?'}px icon, Medium ${textOf(medium) ?? '?'}px, Large ${textOf(large) ?? '?'}px`
    },
    sections: ['Button'],
  },
  {
    id: 'icon-sizes',
    file: D,
    quote: 'Icons are 20px in buttons, fields, menus and alerts (16px in a Small button)',
    says: 'Icons are 20px in buttons, fields, menus and alerts, and 16px in a Small button.',
    sections: ['Button', 'Text Input', 'Menu', 'Alert'],
  },
  {
    id: 'button-hover',
    file: D,
    quote: 'solid buttons darken toward black (to 90%)',
    says: 'Solid buttons darken to 90% on hover; Outline and Text get an 8% primary tint.',
    sections: ['Button'],
  },
  {
    id: 'button-pressed',
    file: D,
    quote: 'solid buttons darken to 82% and shift 1px down',
    says: 'Solid buttons darken to 82% and move 1px down when pressed.',
    sections: ['Button'],
  },
  {
    id: 'snackbar-colour',
    file: D,
    quote: 'A coloured Snackbar. It is always `gray-900`',
    says: 'The Snackbar is always gray-900.',
    check: (lib) => (lib.source('Snackbar').includes("background: 'var(--gray-900)'") ? null : 'the Snackbar background is not gray-900'),
    sections: ['Snackbar', 'Toast'],
  },
  {
    id: 'form-field-gap',
    file: D,
    quote: "Team decision (the full guide's FormField uses an off-scale 6px)",
    says: '4px between label, control and help text (a team decision over the 6px in FormField).',
    check: (lib) => {
      const m = lib.source('FormField').match(/flexDirection: 'column', gap: (?:(\d+)|'var\(--([\w-]+)\)')/)
      const gap = m?.[1] ? Number(m[1]) : m?.[2] ? px(lib.vars.get(m[2])) : null
      return gap === 4 ? null : `FormField uses ${gap ?? 'an unknown'}px`
    },
  },
  {
    id: 'dialog-destructive',
    file: COMPONENTS,
    quote: 'the footer `Cancel` (Text) + `Delete` (Destructive)',
    says: 'A destructive confirmation has a Destructive button in the Dialog footer.',
    check: (lib) => ((lib.api.Dialog ?? []).some((p) => /intent|destructive|variant/i.test(p.name)) ? null : "Dialog's confirm button is always Primary; no prop changes it"),
  },

  // -- Contrast. The library moved these to pass WCAG AA (2026-10-09).
  {
    id: 'supporting-text',
    file: D,
    quote: '| Supporting text | `text-secondary`, `muted-foreground` (gray-600) | Help text and metadata |',
    says: 'Supporting text is gray-600.',
    check: (lib) => {
      const v = lib.vars.get('text-secondary')
      return v?.toUpperCase() === lib.palette.gray['600'].toUpperCase() ? null : `--text-secondary is ${v}`
    },
    known: 'secondary-text',
  },
  {
    id: 'status-on-tint',
    file: D,
    quote: 'The solid colour is used for the text, icon or border on top of its tint.',
    says: 'Text and icons on a status tint use the solid status colour.',
    check: (lib) => (lib.source('Badge').includes("fg: 'var(--info-text)'") ? 'Badge, Tag and Alert text and icons use --info-text, --success-text, --warning-text and --error-text' : null),
    known: 'status-text',
  },
  {
    id: 'badge-text',
    file: D,
    quote: '  badge-info:\n    backgroundColor: "{colors.info-surface}"\n    textColor: "{colors.info}"\n',
    says: 'badge-info, -success, -warning and -error take the solid status colour as text.',
    check: (lib) => (lib.source('Badge').includes("fg: 'var(--info)'") ? null : 'Badge text is --info-text, --success-text, --warning-text and --error-text'),
    known: 'status-text',
  },
  {
    id: 'warning-button',
    file: D,
    quote: '  button-warning:\n    backgroundColor: "{colors.warning}"\n    textColor: "{colors.white}"\n',
    says: 'The Warning button is white on warning.',
    check: (lib) => (lib.source('Button').includes("Warning: { bg: 'var(--warning)', fg: 'var(--white)'") ? null : 'the Warning button is gray-900 on orange-600'),
    known: 'warning-button',
  },

  // -- Segmented Control takes the product's outlined look (2026-10-09).
  {
    id: 'segmented-control',
    file: D,
    quote: '  segmented-control-selected:\n    backgroundColor: "{colors.surface}"\n    textColor: "{colors.primary}"\n',
    says: 'The selected segment is a raised white surface with primary text, on a gray-100 track.',
    check: (lib) => (lib.source('SegmentedControl').includes("'var(--shadow-100)'") ? null : 'SegmentedControl is joined, outlined segments; the selected one is blue-100 with primary text and a blue-700 border'),
    known: 'segmented-control',
  },

  // -- Number Input takes the product's layout: steppers beside the field (2026-10-10).
  {
    id: 'number-input-steppers',
    file: D,
    quote: 'contained-tab item, Number Input steppers',
    says: 'Number Input steppers sit inside the 4px field, at 2px (xs).',
    check: (lib) => (lib.source('NumberInput').includes("'var(--radius-xs)'") ? null : 'the steppers are icon-only Primary Buttons beside the value box, at --radius-sm like every button'),
    known: 'number-input-steppers',
  },
]

/**
 * The components the front matter describes: which source file each is, its
 * section of the full guide, and how to read its sizes from the library where
 * the library holds them as data. Anything without a measure is covered by
 * the section trigger instead.
 */
export const frontMatterComponents: Record<
  string,
  { component: string; section: string; measures?: Record<string, (lib: Library, name: string) => number | null> }
> = (() => {
  const heights: Record<string, string> = { Small: 'sm', Medium: 'md', Large: 'lg' }
  const button = (size: 'Small' | 'Medium' | 'Large') => ({
    component: 'Button',
    section: 'Button',
    measures: {
      height: (lib: Library) => px(lib.vars.get(`control-height-${heights[size]}`)),
      padding: (lib: Library) => buttonPadding(lib)[size] ?? null,
    },
  })
  const sized = (component: string, section: string, prop: string, index: number, field: string) => ({
    component,
    section,
    measures: { [field]: (lib: Library) => describedNumbers(lib, component, prop)[index] ?? null },
  })
  return {
    'button-primary': button('Medium'),
    'button-secondary': button('Medium'),
    'button-outline': button('Medium'),
    'button-text': button('Medium'),
    'button-destructive': button('Medium'),
    'button-success': button('Medium'),
    'button-warning': button('Medium'),
    'button-small': button('Small'),
    'button-large': button('Large'),
    field: { component: 'TextInput', section: 'Text Input' },
    'field-small': { component: 'TextInput', section: 'Text Input' },
    'field-label': { component: 'FormField', section: 'Form Field' },
    'field-help': { component: 'FormField', section: 'Form Field' },
    'field-error': { component: 'FormField', section: 'Form Field' },
    'field-disabled': { component: 'TextInput', section: 'Text Input' },
    'field-readonly': { component: 'TextInput', section: 'Text Input' },
    select: {
      component: 'Select',
      section: 'Select',
      measures: { width: (lib: Library) => (unionOf(lib, 'Select', 'widthMode')[0] === 'Fixed' ? describedNumbers(lib, 'Select', 'widthMode')[0] ?? null : null) },
    },
    checkbox: {
      component: 'Checkbox',
      section: 'Checkbox',
      measures: { size: (lib: Library) => px(lib.source('Checkbox').match(/const BOX = (\d+)/)?.[1]) },
    },
    radio: { component: 'RadioButton', section: 'Radio Button' },
    'toggle-track': { component: 'Toggle', section: 'Toggle' },
    'toggle-track-on': { component: 'Toggle', section: 'Toggle' },
    'segmented-control': { component: 'SegmentedControl', section: 'Segmented Control' },
    'segmented-control-selected': { component: 'SegmentedControl', section: 'Segmented Control' },
    card: sized('Card', 'Card', 'padding', 1, 'padding'),
    'card-compact': sized('Card', 'Card', 'padding', 0, 'padding'),
    'card-spacious': sized('Card', 'Card', 'padding', 2, 'padding'),
    'badge-neutral': sized('Badge', 'Badge', 'size', 1, 'height'),
    'badge-info': { component: 'Badge', section: 'Badge' },
    'badge-success': { component: 'Badge', section: 'Badge' },
    'badge-warning': { component: 'Badge', section: 'Badge' },
    'badge-error': { component: 'Badge', section: 'Badge' },
    tag: { component: 'Tag', section: 'Tag' },
    'alert-info': { component: 'Alert', section: 'Alert' },
    'alert-success': { component: 'Alert', section: 'Alert' },
    'alert-warning': { component: 'Alert', section: 'Alert' },
    'alert-error': { component: 'Alert', section: 'Alert' },
    'table-header': { component: 'Table', section: 'Table' },
    'table-row': { component: 'Table', section: 'Table' },
    'table-row-compact': { component: 'Table', section: 'Table' },
    'tabs-tab': sized('Tabs', 'Tabs', 'size', 1, 'height'),
    'tabs-tab-selected': { component: 'Tabs', section: 'Tabs' },
    dialog: sized('Dialog', 'Dialog', 'size', 0, 'width'),
    // No Small since 2026-10-10 (known difference dialog-sizes): the narrowest dialog is Medium.
    'dialog-small': sized('Dialog', 'Dialog', 'size', 0, 'width'),
    'dialog-large': sized('Dialog', 'Dialog', 'size', 1, 'width'),
    'dialog-title': { component: 'Dialog', section: 'Dialog' },
    drawer: sized('Drawer', 'Drawer', 'size', 1, 'width'),
    'drawer-small': sized('Drawer', 'Drawer', 'size', 0, 'width'),
    'drawer-large': sized('Drawer', 'Drawer', 'size', 2, 'width'),
    'menu-panel': { component: 'Menu', section: 'Menu' },
    popover: { component: 'Popover', section: 'Popover' },
    'tooltip-dark': { component: 'Tooltip', section: 'Tooltip' },
    snackbar: { component: 'Snackbar', section: 'Snackbar' },
    stat: { component: 'Stat', section: 'Stat' },
    'empty-state-icon': { component: 'EmptyState', section: 'Empty State' },
    avatar: sized('Avatar', 'Avatar', 'size', 1, 'size'),
    'pagination-item': { component: 'Pagination', section: 'Pagination' },
    'pagination-item-current': { component: 'Pagination', section: 'Pagination' },
    'stepper-indicator': { component: 'Stepper', section: 'Stepper' },
    link: { component: 'Link', section: 'Link' },
  }
})()

/**
 * One review claim per component the front matter describes: its sizes,
 * colours and radii are only partly checkable as data, so a change to that
 * component's section of the full guide puts the entry up for review.
 */
const frontMatterClaims: Claim[] = Object.entries(
  Object.entries(frontMatterComponents).reduce<Record<string, string[]>>((acc, [key, { section }]) => {
    ;(acc[section] ??= []).push(key)
    return acc
  }, {}),
).map(([section, keys]) => ({
  id: `front-matter:${section}`,
  file: D,
  quote: `  ${keys[0]}:\n`,
  says: `The front matter's ${keys.join(', ')}.`,
  sections: [section],
}))

export const claims: Claim[] = [...written, ...frontMatterClaims]

/**
 * Findings from the bulk checks that a known difference covers, by finding
 * key. Claims carry their own `known`.
 */
export const acknowledged: Record<string, string> = {
  'front-matter:colors.text-secondary': 'secondary-text',
  'front-matter:colors.muted-foreground': 'secondary-text',
  'front-matter:colors.text-placeholder': 'secondary-text',
  'front-matter:colors.border-control': 'control-outline',
  'front-matter:colors.border-control-strong': 'control-outline',
  'front-matter:components.segmented-control-selected.rounded': 'segmented-control',
  'front-matter:components.checkbox.size': 'checkbox-size',
  'components.md:Checkbox.size': 'checkbox-size',
  'front-matter:components.dialog-small.width': 'dialog-sizes',
  'components.md:Dialog.size': 'dialog-sizes',
  'front-matter:components.dialog-large.width': 'dialog-sizes',
}
