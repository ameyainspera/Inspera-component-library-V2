<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera Design System - the AI spec in parts

Version 1.0.0. The complete AI spec (`inspera-design-system.md`, ~113k tokens) cut into
7 smaller files, for AI tools that cannot take it in one piece, with the
design guide that goes with it: `DESIGN.md` and its `references/` folder. The
specs are word for word the same; only the packaging differs.

## How to use it

1. **Give your AI `DESIGN.md` first, every time.** It says how to design an
   Inspera screen. Add a file from `references/` when DESIGN.md says to.
2. **Always give your AI `inspera-01-core.md`.** It holds the rules, the
   setup (fonts, icon class, tokens) and the foundations every component builds
   on. Without it, fonts, icons and colours come out wrong.
3. **Add the part for each component you use.** The table below says which
   part holds which component.
4. **Wherever DESIGN.md says "the full guide" or `inspera-design-system.md`,** it
   means `inspera-01-core.md` for the setup and tokens, plus the part that holds each
   component.
5. **If your tool takes large uploads** - Claude Projects, a custom GPT,
   Cursor's docs - the AI spec zip is simpler: DESIGN.md and the whole spec in
   one folder, nothing to choose.

Keep the `references/` folder beside DESIGN.md. DESIGN.md refers to its files
by those paths.

## The design guide

| File | Read it | Size |
| --- | --- | --- |
| `DESIGN.md` | Always, and first. How to design an Inspera screen: the user role, existing versus new UI (the plane rule), information hierarchy, layout and UI text. | ~13k tokens |
| `references/roles.md` | Once the primary user role is known. | ~2k tokens |
| `references/information-hierarchy.md` | Deciding what is visible and what is collapsed. | ~2k tokens |
| `references/components.md` | Choosing components and looking up their key props. | ~3k tokens |
| `references/ux-writing.md` | Writing or reviewing any UI text. | ~2k tokens |
| `references/tokens-palette.md` | Only for a raw palette shade that has no role token. | ~516 tokens |

## The parts

| File | Contents | Size |
| --- | --- | --- |
| `inspera-01-core.md` | Rules, setup (fonts, icon class, tokens), foundations, composition patterns and the done checklist. Every other part builds on it. | ~13k tokens |
| `inspera-02-input-controls-basic.md` | Buttons and everyday form fields: Button, Text Input, Checkbox, Radio Button, Select, Toggle, Textarea, Form Field, Radio Group, Checkbox Group | ~21k tokens |
| `inspera-03-input-controls-advanced.md` | Pickers and specialised inputs: Slider, Segmented Control, Date Picker, File Upload, Rating, OTP Input, Number Input, Combobox, Date Range Picker | ~19k tokens |
| `inspera-04-data-display-tables.md` | Rows of data: Table, Data Grid, List | ~13k tokens |
| `inspera-05-data-display-content.md` | Cards, labels, people and figures: Card, Badge, Avatar, Accordion, Tag, Divider, Empty State, Avatar Group, Stat | ~15k tokens |
| `inspera-06-feedback.md` | Messages, overlays and loading states: Alert, Dialog, Snackbar, Toast, Command Palette, Tooltip, Progress, Spinner, Skeleton, Popover, Drawer | ~21k tokens |
| `inspera-07-navigation.md` | Moving between pages, steps and sections: Tabs, Breadcrumb, Pagination, Menu, Stepper, Link | ~12k tokens |

Sizes are estimates, at about four characters per token.

## Which file wins

- DESIGN.md decides who the screen is for, whether new UI matches the existing product or uses this library (the plane rule), the information hierarchy, the layout and the UI text.
- The full guide (inspera-design-system.md) decides the tokens and how each component is built: its props, HTML and CSS.
- Where they disagree, the full guide wins for a component's internals and DESIGN.md wins for screen composition. Corner radius is the exception: there, DESIGN.md wins. DESIGN.md's order for conflicting instructions applies.
- The known differences are the disagreements found so far, each with the file to follow.

## Known differences

DESIGN.md and the full guide disagree on these today. Until each one is fixed,
do what the last column says.

| Topic | DESIGN.md says | The library does | Follow |
| --- | --- | --- | --- |
| Secondary and placeholder text | text-secondary and muted-foreground are gray-600 (#7A7A7A); text-placeholder is #8C8C8C. | All three are gray-700 (#595959), 7.00:1 on white. gray-600 is 4.29:1 on white and 4.01:1 on the gray-100 canvas, and #8C8C8C is 3.36:1 - all under the 4.5:1 WCAG AA minimum for text. DESIGN.md's own palette rule asks for gray 700 or darker. | The library: gray-700 for secondary and placeholder text. |
| Control outlines | border-control is #C4C4C4 and border-control-strong is #8C8C8C. | border-control is gray-600 (#7A7A7A) and outlines every control: fields, checkbox, radio, the toggle track and the empty rating star. border-control-strong is gray-800 (#404040), the field border on hover. #C4C4C4 is 1.74:1 on white, under the 3:1 WCAG 1.4.11 asks of a control boundary; gray-600 is 4.29:1 on white and 4.01:1 on gray-100. | The library: gray-600 control outlines, gray-800 on hover. |
| Text and icons on status tints | Badge, Tag and Alert put the solid status colour (info, success, warning, error) on its tint for text and icons. | They use --info-text (blue-800), --success-text (green-800), --warning-text (orange-800) and --error-text (red-700): 9.14, 6.30, 6.01 and 6.90:1 on the tints. The solid colours are 3.43, 4.56, 2.81 and 4.36:1 there. The solid colours stay for borders, fills and accents. | The library: the -text tokens for text and icons on a status tint. |
| Warning button colours | button-warning is white text on warning (#EF6C00). | gray-900 text on orange-600 (#F2A202): 7.07:1 at rest, 5.76:1 on hover and 4.81:1 pressed. White on #EF6C00 is 3.08:1, and no white-text fill in the orange family reads as orange. | The library: gray-900 on orange-600. |
| Segmented Control look | Segments sit on a gray-100 track; the selected one is a raised white surface (shadow-100, 2px corners) with primary text. | Joined, outlined segments, the look of the product's own switches. Unselected: white, gray-800 text, a gray-600 (border-control) border. Selected: blue-100 fill, primary (blue-800) text at 9.51:1, a blue-700 border, 600 weight. Only the outer corners are rounded, at 4px. 40px tall with 16px text, or 32px with 14px when small, as Button. | The library. |
| Checkbox size | The checkbox is 20px, and components.md lists a size prop for it. | One size: an 18px box with a 2px border, as in Material 3, and no size prop. The Small size shrank only the box, to 16px beside the same 16px label, so it saved no space. Radio Button stays 20px: a circle needs the extra size to look as large as a square. | The library: an 18px checkbox, one size. |
| Number Input steppers | The steppers sit inside the 4px field, at 2px (xs) as elements nested in a control. | The product's layout: a decrease button, the value box and an increase button side by side, 8px apart. The steppers are icon-only Primary Buttons at the field height (40px, or 32px for Small), so they are 4px (sm) like every button. The value box is at least 80px wide, with the number and its unit centred together. | The library. |
| Dialog sizes | Three widths: dialog-small 400px, dialog 480px and dialog-large 560px. | Two widths: Medium 480px, the default, and Large 640px. At 80px apart the three sizes looked alike, and at 400px most confirmation titles wrapped onto two lines. Medium takes a question or a confirmation; Large takes a summary or a short form to check first. | The library: Medium 480px and Large 640px, with no Small. |

## What your AI will ask you

DESIGN.md tells the AI to ask before it designs, so have these ready:

- **Who the screen is for** - the primary user role, one of the six DESIGN.md names.
- **That role's setup** - for example, whether marking is anonymous, or which device an invigilator uses.
- **The existing screen, when you are changing one** - a screenshot, its code, a URL or a Figma frame.
- **Screenshots of the current test player** - for a candidate screen.

When it cannot ask, it states what it assumed, using the markers below.

## Markers in the AI's answer

| Marker | What it means | What to do |
| --- | --- | --- |
| `USER_ROLE_ASSUMED` | It did not know who the screen is for, so it chose a user role. | Check the role. If it is wrong, name the primary user and ask again. |
| `ROLE_SETUP_ASSUMED` | It assumed the strictest setup for that role, such as anonymous marking or an iPad in portrait. | Confirm the setup, or give the real one. |
| `PLANE_ASSUMED` | It could not tell whether a surface already exists in the product, so it chose whether to match the existing styling or use the library. | Say whether the surface is new or already exists. |
| `AS_IS_REFERENCE_MISSING` | It changed an existing screen without a screenshot, code or URL of it. | Share a reference of the existing screen. |
| `AS_IS_DEVIATION` | It changed the existing styling, for accessibility only. | Review the change it describes. |
| `DESIGN_SYSTEM_GAP` | The system has no component or template for something, so it used the nearest documented composition. | Review the composition. If the gap keeps coming up, raise it with the design system team. |
