/**
 * DESIGN.md - the design guide that ships beside the AI spec.
 *
 * The files in design-md/ are written by the design system team in Google
 * Labs' DESIGN.md format. This repo never edits them: `pnpm generate` copies
 * them byte for byte to public/design/, and `pnpm audit:design-md` checks every
 * value and name they take from the library. What lives here is what the
 * library says *about* them: the file list, the markers DESIGN.md asks an AI
 * to write, the project instructions, and the known differences between
 * DESIGN.md and the library. The known differences ship as errata in the
 * start-here note, so an AI knows which file to follow until each is resolved.
 *
 * ASCII only: all of it is printed into generated files.
 */

/** The folder the design team's files arrive in. Replace it wholesale; never edit it. */
export const designGuideSource = 'design-md'

/**
 * Where the copies are served, under public/. Not `design-md`: Vite serves the
 * project root too, and two folders of that name would answer the same URL.
 */
export const designGuideServed = 'design'

export interface DesignGuideFile {
  /** Path under design-md/, which is also its path in the zip and under public/design/. */
  path: string
  /** When to read it, following DESIGN.md's own table of reference files. */
  readWhen: string
}

/** Every file in the folder, in reading order. The audit fails if the folder holds anything else. */
export const designGuideFiles: DesignGuideFile[] = [
  {
    path: 'DESIGN.md',
    readWhen:
      'Always, and first. How to design an Inspera screen: the user role, existing versus new UI (the plane rule), information hierarchy, layout and UI text.',
  },
  { path: 'references/roles.md', readWhen: 'Once the primary user role is known.' },
  { path: 'references/information-hierarchy.md', readWhen: 'Deciding what is visible and what is collapsed.' },
  { path: 'references/components.md', readWhen: 'Choosing components and looking up their key props.' },
  { path: 'references/ux-writing.md', readWhen: 'Writing or reviewing any UI text.' },
  { path: 'references/tokens-palette.md', readWhen: 'Only for a raw palette shade that has no role token.' },
]

export interface DesignGuideMarker {
  name: string
  /** What the AI is telling you when it writes this. */
  means: string
  /** What to do about it. */
  action: string
}

/** The markers DESIGN.md asks an AI to write in its answer. The audit fails if one disappears from DESIGN.md. */
export const designGuideMarkers: DesignGuideMarker[] = [
  {
    name: 'USER_ROLE_ASSUMED',
    means: 'It did not know who the screen is for, so it chose a user role.',
    action: 'Check the role. If it is wrong, name the primary user and ask again.',
  },
  {
    name: 'ROLE_SETUP_ASSUMED',
    means: 'It assumed the strictest setup for that role, such as anonymous marking or an iPad in portrait.',
    action: 'Confirm the setup, or give the real one.',
  },
  {
    name: 'PLANE_ASSUMED',
    means: 'It could not tell whether a surface already exists in the product, so it chose whether to match the existing styling or use the library.',
    action: 'Say whether the surface is new or already exists.',
  },
  {
    name: 'AS_IS_REFERENCE_MISSING',
    means: 'It changed an existing screen without a screenshot, code or URL of it.',
    action: 'Share a reference of the existing screen.',
  },
  {
    name: 'AS_IS_DEVIATION',
    means: 'It changed the existing styling, for accessibility only.',
    action: 'Review the change it describes.',
  },
  {
    name: 'DESIGN_SYSTEM_GAP',
    means: 'The system has no component or template for something, so it used the nearest documented composition.',
    action: 'Review the composition. If the gap keeps coming up, raise it with the design system team.',
  },
]

/**
 * How DESIGN.md and the full guide share the work, from the reader's side. It
 * repeats the split DESIGN.md states for itself; the audit fails if that
 * sentence in DESIGN.md changes, so this gets revisited with it. The spec's
 * own wording of the same split is `designGuideNote` in guidance.ts.
 */
export const whichFileWins: string[] = [
  'DESIGN.md decides who the screen is for, whether new UI matches the existing product or uses this library (the plane rule), the information hierarchy, the layout and the UI text.',
  'The full guide (inspera-design-system.md) decides the tokens and how each component is built: its props, HTML and CSS.',
  "Where they disagree, the full guide wins for a component's internals and DESIGN.md wins for screen composition. Corner radius is the exception: there, DESIGN.md wins. DESIGN.md's order for conflicting instructions applies.",
  'The known differences are the disagreements found so far, each with the file to follow.',
]

/** What DESIGN.md has an AI ask before it designs, so a person can have it ready. */
export const aiWillAsk: { what: string; detail: string }[] = [
  { what: 'Who the screen is for', detail: 'the primary user role, one of the six DESIGN.md names.' },
  { what: "That role's setup", detail: 'for example, whether marking is anonymous, or which device an invigilator uses.' },
  { what: 'The existing screen, when you are changing one', detail: 'a screenshot, its code, a URL or a Figma frame.' },
  { what: 'Screenshots of the current test player', detail: 'for a candidate screen.' },
]

/** What a person tells their AI tool once, as the project or custom instructions. */
export const projectInstructions = `You are building UI for Inspera, a digital assessment platform, with the Inspera Design System.

The project files are DESIGN.md, its references folder and inspera-design-system.md. inspera-00-start-here.md explains how they fit together.

- Read DESIGN.md first and follow it for every screen: the user role, existing versus new UI, information hierarchy, layout and UI text.
- Build every component exactly as inspera-design-system.md specifies: setup, tokens, props, HTML and CSS.
- Where the two disagree, follow the known differences in inspera-00-start-here.md.
- If I have not said who the primary user is, ask before you start.

Now build: <describe the screen or flow>.`

export interface KnownDifference {
  id: string
  topic: string
  /** What DESIGN.md says. */
  designMd: string
  /** What the library does now. */
  library: string
  /** What an AI should do until it is resolved. */
  follow: string
  /** Where the fix belongs. */
  fixIn: 'DESIGN.md' | 'library' | 'DESIGN.md or library'
  /** When it was found, YYYY-MM-DD. */
  since: string
}

/**
 * Where DESIGN.md and the library disagree today, each acknowledged by the
 * audit (scripts/design-md-claims.ts says which findings each one covers).
 * The audit fails on a difference that is not listed here, and on one listed
 * here that no longer reproduces - so this list, which ships, stays true.
 */
export const knownDifferences: KnownDifference[] = [
  {
    id: 'secondary-text',
    topic: 'Secondary and placeholder text',
    designMd: 'text-secondary and muted-foreground are gray-600 (#7A7A7A); text-placeholder is #8C8C8C.',
    library:
      'All three are gray-700 (#595959), 7.00:1 on white. gray-600 is 4.29:1 on white and 4.01:1 on the gray-100 canvas, and #8C8C8C is 3.36:1 - all under the 4.5:1 WCAG AA minimum for text. DESIGN.md\'s own palette rule asks for gray 700 or darker.',
    follow: 'The library: gray-700 for secondary and placeholder text.',
    fixIn: 'DESIGN.md',
    since: '2026-10-09',
  },
  {
    id: 'control-outline',
    topic: 'Control outlines',
    designMd: 'border-control is #C4C4C4 and border-control-strong is #8C8C8C.',
    library:
      'border-control is gray-600 (#7A7A7A) and outlines every control: fields, checkbox, radio, the toggle track and the empty rating star. border-control-strong is gray-800 (#404040), the field border on hover. #C4C4C4 is 1.74:1 on white, under the 3:1 WCAG 1.4.11 asks of a control boundary; gray-600 is 4.29:1 on white and 4.01:1 on gray-100.',
    follow: 'The library: gray-600 control outlines, gray-800 on hover.',
    fixIn: 'DESIGN.md',
    since: '2026-10-09',
  },
  {
    id: 'status-text',
    topic: 'Text and icons on status tints',
    designMd: 'Badge, Tag and Alert put the solid status colour (info, success, warning, error) on its tint for text and icons.',
    library:
      'They use --info-text (blue-800), --success-text (green-800), --warning-text (orange-800) and --error-text (red-700): 9.14, 6.30, 6.01 and 6.90:1 on the tints. The solid colours are 3.43, 4.56, 2.81 and 4.36:1 there. The solid colours stay for borders, fills and accents.',
    follow: 'The library: the -text tokens for text and icons on a status tint.',
    fixIn: 'DESIGN.md',
    since: '2026-10-09',
  },
  {
    id: 'warning-button',
    topic: 'Warning button colours',
    designMd: 'button-warning is white text on warning (#EF6C00).',
    library:
      'gray-900 text on orange-600 (#F2A202): 7.07:1 at rest, 5.76:1 on hover and 4.81:1 pressed. White on #EF6C00 is 3.08:1, and no white-text fill in the orange family reads as orange.',
    follow: 'The library: gray-900 on orange-600.',
    fixIn: 'DESIGN.md',
    since: '2026-10-09',
  },
  {
    id: 'segmented-control',
    topic: 'Segmented Control look',
    designMd:
      'Segments sit on a gray-100 track; the selected one is a raised white surface (shadow-100, 2px corners) with primary text.',
    library:
      "Joined, outlined segments, the look of the product's own switches. Unselected: white, gray-800 text, a gray-600 (border-control) border. Selected: blue-100 fill, primary (blue-800) text at 9.51:1, a blue-700 border, 600 weight. Only the outer corners are rounded, at 4px. 40px tall with 16px text, or 32px with 14px when small, as Button.",
    follow: 'The library.',
    fixIn: 'DESIGN.md',
    since: '2026-10-09',
  },
  {
    id: 'checkbox-size',
    topic: 'Checkbox size',
    designMd: 'The checkbox is 20px, and components.md lists a size prop for it.',
    library:
      'One size: an 18px box with a 2px border, as in Material 3, and no size prop. The Small size shrank only the box, to 16px beside the same 16px label, so it saved no space. Radio Button stays 20px: a circle needs the extra size to look as large as a square.',
    follow: 'The library: an 18px checkbox, one size.',
    fixIn: 'DESIGN.md',
    since: '2026-10-09',
  },
  {
    id: 'number-input-steppers',
    topic: 'Number Input steppers',
    designMd: 'The steppers sit inside the 4px field, at 2px (xs) as elements nested in a control.',
    library:
      "The product's layout: a decrease button, the value box and an increase button side by side, 8px apart. The steppers are icon-only Primary Buttons at the field height (40px, or 32px for Small), so they are 4px (sm) like every button. The value box is at least 80px wide, with the number and its unit centred together.",
    follow: 'The library.',
    fixIn: 'DESIGN.md',
    since: '2026-10-10',
  },
  {
    id: 'dialog-sizes',
    topic: 'Dialog sizes',
    designMd: 'Three widths: dialog-small 400px, dialog 480px and dialog-large 560px.',
    library:
      'Two widths: Medium 480px, the default, and Large 640px. At 80px apart the three sizes looked alike, and at 400px most confirmation titles wrapped onto two lines. Medium takes a question or a confirmation; Large takes a summary or a short form to check first.',
    follow: 'The library: Medium 480px and Large 640px, with no Small.',
    fixIn: 'DESIGN.md',
    since: '2026-10-10',
  },
]
