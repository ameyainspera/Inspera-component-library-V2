---
version: alpha
name: Inspera Design System
description: "Inspera product UI (assessment platform). Flat, dense-but-calm, accessible-by-contract. Tokens mirror the CSS custom properties in the Inspera Design System AI build guide v1.0.0; token name = CSS variable name without the leading --."
colors:
  primary: "#004080"
  error: "#D32F2F"
  warning: "#EF6C00"
  info: "#0288D1"
  success: "#2E7D32"
  accent-zest: "#FA5101"
  accent-berry: "#89239A"
  accent-algae: "#00A788"
  white: "#ffffff"
  text-primary: "rgba(0, 0, 0, 0.87)"
  text-secondary: "#7A7A7A"
  text-disabled: "rgba(0, 0, 0, 0.38)"
  text-on-primary: "#ffffff"
  text-placeholder: "#8C8C8C"
  muted-foreground: "#7A7A7A"
  background: "#F7F7F7"
  surface: "#ffffff"
  surface-sunken: "#F7F7F7"
  surface-readonly: "#F7F7F7"
  surface-disabled: "#F5F5F5"
  surface-neutral: "#F0F0F0"
  avatar-surface: "#E0E0E0"
  info-surface: "#E1F5FE"
  success-surface: "#E8F5E9"
  warning-surface: "#FFF3E0"
  error-surface: "#FFEBEE"
  border: "#EDEDED"
  border-strong: "#D9D9D9"
  border-interactive: "#949494"
  border-control: "#C4C4C4"
  border-control-strong: "#8C8C8C"
  primary-hover-overlay: "rgba(0, 64, 128, 0.04)"
  primary-focus-ring: "rgba(0, 64, 128, 0.3)"
  action-active: "rgba(0, 0, 0, 0.56)"
  action-hover: "rgba(0, 0, 0, 0.04)"
  action-focus: "rgba(0, 0, 0, 0.12)"
  action-disabled: "rgba(0, 0, 0, 0.38)"
  scrim: "rgba(39, 39, 39, 0.48)"
  gray-100: "#F7F7F7"
  gray-200: "#EDEDED"
  gray-300: "#D9D9D9"
  gray-700: "#595959"
  gray-900: "#272727"
  blue-100: "#F0F7FF"
typography:
  h1:
    fontFamily: Inter
    fontSize: 28.83px
    fontWeight: 600
    lineHeight: 1.12
  h2:
    fontFamily: Inter
    fontSize: 22.78px
    fontWeight: 500
    lineHeight: 1.12
  h3:
    fontFamily: Inter
    fontSize: 20.25px
    fontWeight: 500
    lineHeight: 1.12
  h4:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.12
  h5:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.12
  h6:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: 1.6px
  default-16-regular:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.25
  default-16-medium:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.25
  link-16:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.25
  semibold-16:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.25
  regular-14:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4
  medium-14:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
  regular-18:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.4
  medium-18:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.4
  regular-20:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.4
  medium-20:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.4
  regular-22:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: 400
    lineHeight: 1.4
  medium-22:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1.4
  regular-26:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: 400
    lineHeight: 1.4
  medium-26:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: 500
    lineHeight: 1.4
  paragraph-default:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  paragraph-content:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  paragraph-heading:
    fontFamily: Inter
    fontSize: 20.25px
    fontWeight: 500
    lineHeight: 1.12
  paragraph-captions:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.2
  allcaps-12:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: 1.6px
  mono-16:
    fontFamily: Noto Sans Mono
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  serif-16:
    fontFamily: Noto Serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  documentation:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 300
    lineHeight: 1.4
rounded:
  none: 0px
  xs: 2px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  pill: 9999px
spacing:
  "0": 0px
  "1": 4px
  "2": 8px
  "3": 12px
  "4": 16px
  "5": 20px
  "6": 24px
  "8": 32px
  "10": 40px
  "12": 48px
  "16": 64px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-on-primary}"
    typography: "{typography.semibold-16}"
    rounded: "{rounded.sm}"
    height: 40px
    padding: 16px
  button-primary-hover:
    backgroundColor: "color-mix(in srgb, #004080 90%, black)"
  button-primary-active:
    backgroundColor: "color-mix(in srgb, #004080 82%, black)"
  button-secondary:
    backgroundColor: "{colors.gray-100}"
    textColor: "{colors.gray-900}"
    typography: "{typography.semibold-16}"
    rounded: "{rounded.sm}"
    height: 40px
    padding: 16px
  button-outline:
    textColor: "{colors.primary}"
    typography: "{typography.semibold-16}"
    rounded: "{rounded.sm}"
    height: 40px
    padding: 16px
  button-text:
    textColor: "{colors.primary}"
    typography: "{typography.semibold-16}"
    rounded: "{rounded.sm}"
    height: 40px
    padding: 16px
  button-destructive:
    backgroundColor: "{colors.error}"
    textColor: "{colors.white}"
    typography: "{typography.semibold-16}"
    rounded: "{rounded.sm}"
    height: 40px
    padding: 16px
  button-success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.white}"
  button-warning:
    backgroundColor: "{colors.warning}"
    textColor: "{colors.white}"
  button-small:
    height: 32px
    padding: 12px
  button-large:
    height: 44px
    padding: 20px
  field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    typography: "{typography.default-16-regular}"
    rounded: "{rounded.sm}"
    height: 40px
    padding: 12px
  field-small:
    height: 32px
  field-label:
    textColor: "{colors.text-primary}"
    typography: "{typography.default-16-medium}"
  field-help:
    textColor: "{colors.muted-foreground}"
    typography: "{typography.paragraph-captions}"
  field-error:
    textColor: "{colors.error}"
    typography: "{typography.paragraph-captions}"
  field-disabled:
    backgroundColor: "{colors.surface-disabled}"
    textColor: "{colors.text-disabled}"
  field-readonly:
    backgroundColor: "{colors.surface-readonly}"
  select:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    typography: "{typography.default-16-regular}"
    rounded: "{rounded.sm}"
    height: 40px
    width: 220px
  checkbox:
    size: 20px
    rounded: "{rounded.xs}"
  radio:
    size: 20px
    rounded: "{rounded.pill}"
  toggle-track:
    backgroundColor: "{colors.border-control}"
    rounded: "{rounded.pill}"
    width: 44px
    height: 24px
  toggle-track-on:
    backgroundColor: "{colors.primary}"
  segmented-control:
    backgroundColor: "{colors.gray-100}"
    rounded: "{rounded.sm}"
    height: 40px
  segmented-control-selected:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.xs}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: 16px
  card-compact:
    padding: 12px
  card-spacious:
    padding: 24px
  badge-neutral:
    backgroundColor: "{colors.surface-neutral}"
    textColor: "{colors.gray-900}"
    rounded: "{rounded.pill}"
    height: 24px
    padding: 8px
  badge-info:
    backgroundColor: "{colors.info-surface}"
    textColor: "{colors.info}"
  badge-success:
    backgroundColor: "{colors.success-surface}"
    textColor: "{colors.success}"
  badge-warning:
    backgroundColor: "{colors.warning-surface}"
    textColor: "{colors.warning}"
  badge-error:
    backgroundColor: "{colors.error-surface}"
    textColor: "{colors.error}"
  tag:
    backgroundColor: "{colors.surface-neutral}"
    textColor: "{colors.gray-900}"
    rounded: "{rounded.pill}"
    height: 24px
  alert-info:
    backgroundColor: "{colors.info-surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: 16px
  alert-success:
    backgroundColor: "{colors.success-surface}"
  alert-warning:
    backgroundColor: "{colors.warning-surface}"
  alert-error:
    backgroundColor: "{colors.error-surface}"
  table-header:
    backgroundColor: "{colors.gray-100}"
    textColor: "{colors.gray-700}"
    height: 52px
  table-row:
    backgroundColor: "{colors.surface}"
    typography: "{typography.regular-14}"
    height: 52px
    padding: 16px
  table-row-compact:
    height: 40px
  tabs-tab:
    textColor: "{colors.gray-700}"
    typography: "{typography.default-16-medium}"
    height: 48px
    padding: 16px
  tabs-tab-selected:
    textColor: "{colors.primary}"
  dialog:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    width: 480px
  dialog-small:
    width: 400px
  dialog-large:
    width: 560px
  dialog-title:
    typography: "{typography.h2}"
  drawer:
    backgroundColor: "{colors.surface}"
    width: 400px
  drawer-small:
    width: 320px
  drawer-large:
    width: 560px
  menu-panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: 4px
  popover:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: 16px
  tooltip-dark:
    backgroundColor: "{colors.gray-900}"
    textColor: "{colors.white}"
    typography: "{typography.paragraph-captions}"
    rounded: "{rounded.sm}"
  snackbar:
    backgroundColor: "{colors.gray-900}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    height: 48px
  stat:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
  empty-state-icon:
    backgroundColor: "{colors.gray-100}"
    rounded: "{rounded.pill}"
    size: 80px
  avatar:
    backgroundColor: "{colors.avatar-surface}"
    rounded: "{rounded.pill}"
    size: 40px
  pagination-item:
    rounded: "{rounded.sm}"
    size: 40px
  pagination-item-current:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
  stepper-indicator:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    size: 32px
  link:
    textColor: "{colors.primary}"
    typography: "{typography.link-16}"
---

# Inspera Design System — DESIGN.md

> Draft v1.4 (alpha). Core file: always read this. Detail lives in `references/` and is read only when the task needs it (see *Reference files*).
> This file says **what to use and how to put it together**. The full guide holds each component's exact HTML/CSS. Where the two disagree, the full guide wins for component internals and this file wins for screen composition. The one exception is corner radius, where this file wins (see *Shapes*).
> Items marked **(proposed)** are new composition decisions the full guide does not yet make. Follow them, but the design system team still needs to confirm them.

## Overview

Inspera makes digital assessment software. Staff use it to author, schedule, deliver and mark exams, and candidates use it to take them. The UI is a **work tool**: people come to complete tasks with care, often under time pressure, so the UI should feel calm, precise and trustworthy rather than expressive.

**Look and feel**

- **Flat and quiet.** White surfaces on a light-grey canvas (`background` #F7F7F7). Hairline borders separate content; shadows only lift things that float (menus, popovers, dialogs).
- **One brand colour.** Deep navy `primary` (#004080) marks interaction and the single most important action. It is never a gradient and never a mid blue.
- **Colour means something.** Red, orange, light blue and green are reserved for error, warning, info and success. The three brand accents (zest, berry, algae) are for rare accent moments, never for UI state.
- **Dense but readable.** 16px Inter for body and controls, 14px in tables, 40px controls. Hierarchy comes from weight, size and spacing, not decoration.
- **Accessible by contract: WCAG 2.2 AA.** Keyboard operation, visible focus, labels, roles and states are part of every component. They are not an enhancement.

### Before you build: the primary user role

Inspera serves six roles, and they need very different things from the same data. Before designing anything, know **who the primary user of this solution is**.

- **If the task doesn't say, ask before you start:** "Who is the primary user role for this solution: Author, Planner/admin, Invigilator, Grader/marker, Moderator, or Test taker/candidate?" Ask once, up front, before any layout or component decisions. Don't infer the role from the screen alone, because one screen can serve several roles.
- **If you can't ask** (for example, an unattended run), state the role you assumed at the top of your output as `USER_ROLE_ASSUMED: <role> because <reason>`, and design for that role.
- **Then ask the role's setup questions**, because these change the design and vary between customers and tests:
  - *Grader/marker:* is marking anonymous or named for this test?
  - *Moderator:* can the moderator see candidate identity? Other markers' marks and comments? The whole cohort, or only sample scripts?
  - *Invigilator:* laptop, iPad, or both?
  - *Test taker/candidate:* screenshots of the current test player.
  
  If you can't ask, design for the most restrictive answer (anonymous marking, no access to other markers' comments, sample scripts only, iPad portrait) and mark it `ROLE_SETUP_ASSUMED`.
- **Secondary roles:** if other roles also use the screen, name them. Design for the primary role, and make sure secondary roles are not blocked, for example by giving a moderator a read-only view of a grader's screen.
- In your output, name the role you designed for, for example: "Primary user: Planner/admin."

#### The six roles

| Role | Core job | Where in the product |
| --- | --- | --- |
| **Author** | Writes questions and assembles tests | Author |
| **Planner/admin** | Sets up, schedules and configures tests; manages candidates, committees and settings | Deliver, admin settings |
| **Invigilator** | Supervises tests while they run: who is in, who has a problem, who needs help | Monitor |
| **Grader/marker** | Marks candidate responses against a rubric or marking scheme | Grade |
| **Moderator** | Checks marking quality and consistency, resolves disagreements between markers, and handles appeals | Grade (moderation/committee views) |
| **Test taker/candidate** | Takes the test | Candidate test player |

#### How the role changes design decisions

The role decides density, wording, which analytics are shown, technical detail, privacy (for example anonymous marking), the environment (Invigilators on laptop or iPad), accessibility emphasis and which states to design. **Read `references/roles.md`** once the role is known and apply that role's column.

#### Candidate screens

Test taker/candidate screens run in the test player, a separate surface. Always ask for **screenshots of the current test player** first, then apply the plane rule. The library is used there only if the team confirms it is in scope. Live roles (Invigilator, and the candidate mid-test) never get a blocking modal without warning.

### How an agent should use this file

0. **Know the primary user role.** If the task doesn't state it, ask (see above) before anything else, then apply that role's row in the table above.
1. **Decide the plane.** If you are changing an existing (as-is) screen, apply *The plane rule* below before anything else. It decides whether a piece of UI is styled like the existing product or with this library.
2. **Set up once.** Load Inter (300/400/500/600), Noto Sans Mono, Noto Serif and **Material Symbols Outlined** from Google Fonts. Add the `.material-symbols-outlined` class rule and paste the `:root` token block from the full guide (Setup section). Without that rule, icons render as their literal names.
3. **The npm package is not published.** `@inspera/components` will not resolve, so never tell anyone to install it. Use the component names and props in this file as the API. Build markup from the full guide's "Without the package" HTML/CSS. Never substitute another UI kit.
4. **Classify the screen** and pick the matching template from the *Screen templates* section of the full guide (see *Layout → Screen templates*). Then **rank the content into tiers** (*Layout → Information hierarchy*; detail in `references/information-hierarchy.md`) before choosing components.
5. **Choose components** with `references/components.md` (decision tables and the 48-component index).
6. **Lay out** with the spacing rhythm (*Layout → Spacing rhythm*), using tokens only.
7. **Design every state:** loading, empty, error, disabled, read-only, and narrow viewport.
8. **Run the checklist** in *Do's and Don'ts* before you call it done.
9. **Mark gaps honestly.** If the system cannot express something, write `DESIGN_SYSTEM_GAP: <what and why>` in your output and use the nearest documented composition. Never present an invented component as canonical.

### Reference files

Read `DESIGN.md` (this file) every time. Read a reference file only when the task needs it.

| File | Read it when |
| --- | --- |
| `references/roles.md` | The primary role is known: density, wording, analytics, privacy, environment and states per role |
| `references/information-hierarchy.md` | Deciding what is visible vs collapsed: tiers, worked example, disclosure mechanisms and rules |
| `references/components.md` | Choosing components, looking up key props, composition patterns and the reference screen |
| `references/ux-writing.md` | Writing or reviewing any UI text (Inspera writing guidelines) |
| `references/tokens-palette.md` | You need a raw palette shade that has no role token |
| Full guide (`inspera-design-system.md`) | Building a component's exact HTML/CSS |
| Full guide → *Screen templates* section | Building a whole screen or large region (see *Layout → Screen templates*) |

### Precedence when instructions conflict

1. Accessibility (WCAG 2.2 AA) and safety requirements
2. The plane rule: which styling source applies, the as-is product or this library
3. The rules in *Do's and Don'ts*
4. Token definitions (front matter)
5. Canonical component specifications
6. Composition patterns and the full guide's screen templates
7. Product requirements supplied with the task
8. Examples

When the spec is silent, reuse the nearest canonical component or composition, reuse an existing token, and keep the established density and hierarchy. Never infer a brand colour or style from framework defaults.

### The plane rule: adding to an existing (as-is) product

Many tasks change a screen that already exists, and that screen may not use this library yet. The rule:

> **Same plane → match the as-is styling. New plane → use this library.**

**Planes.** A *plane* is a surface the user sees as one continuous layer.

- **Same plane:** the new content appears inside the existing view and sits next to existing UI with no boundary between them, such as a new field, column, button, row or inline message.
- **New plane:** the new content appears on its own surface with a clear boundary, such as a Dialog, a Drawer or side panel, a new page or route, a full-screen flow, or the Command Palette.

**Test:** is there a visible boundary between the new content and the existing view (a scrim, a panel edge or a page change)? If yes, it is a new plane. If no, it is the same plane.

| Change | Plane | Style source |
| --- | --- | --- |
| Add a field to an existing form | Same | As-is |
| Add a column, row action or bulk action to an existing table | Same | As-is |
| Add a button to an existing toolbar or page header | Same | As-is. This includes a button that *opens* a new plane |
| Add an inline message, banner or empty state to an existing page | Same | As-is |
| Dropdown, menu, tooltip or popover anchored to an existing control | Same. An anchored overlay follows the plane of its trigger | As-is |
| A notification (snackbar or toast) fired from an existing page | Same | As-is if the product has one. Otherwise use this library |
| Add content inside an existing as-is dialog or panel | Same as that dialog or panel | As-is |
| Open a new Dialog or confirmation | New | **Library**: scrim, panel, header, body, footer and every control inside |
| Open a new Drawer or side panel | New | **Library** |
| Add a new page or route | New | **Library** for the page content. The global app shell (top bar, side navigation) stays as-is |
| Start a new multi-step flow or full-screen takeover | New | **Library** |
| Open something from inside a library plane | Already library | **Library** |

**On an as-is plane**

- Match what is there: component look, colours, type, spacing, radius, icon set and density. Reuse the product's own components, classes and variables. Copy values from the existing code or a screenshot rather than approximating them.
- Do not restyle the neighbours. Never put a library-styled control next to legacy controls of the same kind, such as a navy 4px library button in a row of legacy buttons.
- Library *tokens and visual rules* do not apply here. Rules 1–7 and 11 in *Do's and Don'ts* (tokens, canonical components, fonts, icons, no other design system) are suspended on an as-is plane, because the as-is product is the reference.
- Library *behaviour and composition* rules still apply: accessibility (rule 8), no colour-only meaning (9), reduced motion (10), one primary action, real labels, all states designed, and the UX-writing rules.
- If matching the as-is look would break accessibility (for example a failing contrast pair or a missing focus style), keep the as-is look as close as possible, fix only what is needed, and write `AS_IS_DEVIATION: <what changed and why>` in your output.

**On a new plane**

- Use this library completely: tokens, components, templates and the checklist. Nothing from the as-is styling leaks in, not even the colours of the trigger.
- The boundary belongs to the new plane: the scrim, panel, shadow and radius are library styles.
- **A new plane always sits above the existing page.** Its scrim and panel stack above every as-is element, including fixed headers, sticky toolbars and footers. The as-is product may use z-index values outside the library's layering scale (0–800). If so, don't renumber the as-is page. Wrap the whole library layer in one container that creates its own stacking context and sits above the highest as-is value. Inside it, use the library scale unchanged. Scrim → `z-overlay`, panel → `z-modal`, snackbar → `z-toast`, tooltip → `z-tooltip`.
- Keep the content consistent with the as-is product: the same nouns, data and terminology as the screen that opened it.

**Before you start**

- You need a reference for the as-is styling: the code, a URL, a screenshot or a Figma frame. If the task changes an existing screen and none is given, ask for one. If you cannot ask, say what you assumed and mark the as-is parts `AS_IS_REFERENCE_MISSING`.
- If you can't tell whether a surface already exists in the product (for example, "is the Test details drawer new, or are we adding a tab to an existing one?"), ask. Don't decide on your own. If you can't ask, state your assumption and mark it `PLANE_ASSUMED: <surface> treated as <same|new> plane`.
- With no existing screen (a greenfield task), everything is a new plane, so use this library throughout.
- In your output, state the plane decision for each part you added, for example: "Filter button: same plane, as-is. Filter panel: new plane (Drawer), library."

## Colors

All colour tokens are in the front matter, and each token name equals its CSS custom property: `primary` → `var(--primary)`. **Application code always references the variable, never the hex value.** Prefer a role token (text, surface, border, status) over a raw palette shade.

**Brand and semantic**

- **Primary – Inspera Navy (#004080):** interactive elements, the primary action, selected states, links and focus rings. Hover and pressed states darken it to 90% and 82% toward black.
- **Error (#D32F2F), Warning (#EF6C00), Info (#0288D1), Success (#2E7D32):** use each one only for its meaning. Each has a matching tint (`error-surface`, `warning-surface`, `info-surface`, `success-surface`) for Alert, Badge and Tag fills. The solid colour is used for the text, icon or border on top of its tint.
- **Accents – Zest (#FA5101), Berry (#89239A), Algae (#00A788):** use sparingly for illustration or highlight moments. Never use them for state, status or actions.

**Neutrals and roles**

| Role | Token | Use |
| --- | --- | --- |
| App canvas | `background` (gray-100) | Page background behind content |
| Raised surface | `surface` (white) | Cards, panels, inputs, dialogs, menus |
| Sunken surface | `surface-sunken`, `surface-readonly` (gray-100) | Wells and read-only fields |
| Body text | `text-primary` (black 87%) | Headings and body |
| Supporting text | `text-secondary`, `muted-foreground` (gray-600) | Help text and metadata |
| Disabled | `text-disabled`, `surface-disabled` | Disabled controls only |
| Hairline | `border` (gray-200) | Dividers and table rules |
| Control outline | `border-control` → `border-control-strong` on hover | Inputs, select, toggle track |
| Card outline | `border-strong` (gray-300) | Outlined card, tab rail |
| Overlay backdrop | `scrim` | Behind Dialog, Drawer and Command Palette |
| Hover / focus wash | `action-hover`, `action-focus`, `primary-hover-overlay` | Row and item hover |

**Palette.** Eight families (gray, blue, green, red, yellow, orange, purple, pink) run from 100 (lightest) to 900 (darkest). 100–300 are surface tints. For text on white or the `background` canvas, use **700 or darker** in gray, blue, green and pink, **800 or darker** in yellow and orange, and **600 or darker** in red and purple. Lighter shades fall below 4.5:1 contrast.

**Rules**

- Never use colour alone to carry meaning. Pair it with a word, an icon or a shape.
- Never introduce a colour that is not a token. No Tailwind default palette, and no `bg-[#…]` arbitrary values.
- Primary is for interaction. Do not use it for decorative headings or large background areas.

## Typography

**Inter** for all product UI. **Noto Sans Mono** only for code, identifiers, IDs and technical values. **Noto Serif** only for long-form reading content (for example, passages inside an assessment item). Every style has a ready-made class (`.inspera-h1`, `.inspera-regular-14` …). Prefer the class over setting properties by hand.

| Role | Token / class | Spec | Use |
| --- | --- | --- | --- |
| Page title | `h1` | 28.83px / 600 / 1.12 | Exactly one per page |
| Section title | `h2` | 22.78px / 500 | Page sections and the Dialog title |
| Sub-section | `h3` | 20.25px / 500 | Groups inside a section |
| Group title | `h4` | 18px / 500 | Card-group and settings-group titles |
| Minor heading | `h5` | 16px / 500 | Small headings inside cards |
| Overline | `h6`, `allcaps-12` | 12px / 500–600, uppercase, +1.6px | Eyebrows and grouped-list headings |
| Body / controls | `default-16-regular` | 16px / 400 / 1.25 | Control text, short UI copy |
| Label | `default-16-medium` | 16px / 500 | Field labels, card titles, tabs |
| Emphasis | `semibold-16` | 16px / 600 | Button labels, inline emphasis |
| Paragraph | `paragraph-default` | 16px / 400 / 1.5 | Running text, descriptions |
| Table / dense | `regular-14`, `medium-14` | 14px / 400–500 | Table cells, secondary list text |
| Caption | `paragraph-captions` | 12px / 400 / 1.2 | Help text, error text, timestamps |
| Link | `link-16` | 16px / 500 | Inline links (underline on hover) |
| Code / IDs | `mono-16` | Noto Sans Mono 16px | Candidate IDs, codes, token values |
| Reading content | `serif-16` | Noto Serif 16px / 1.5 | Long-form content |

**Rules**

- Heading levels follow the document outline: one `h1`, then `h2` → `h3` in order, with no skipped levels. Pick the heading element for structure. Never pick a level just because of its size.
- Body text is never smaller than 14px. 12px is only for captions, help and error text, badges and tags.
- Use at most three weights on a screen: 400, 500 and 600. Weight 300 is for documentation only.
- Write UI text in **sentence case** ("New assessment", "Delete assessment?"). See *Do's and Don'ts → UX writing*.
- Keep running text to about 70 characters per line **(proposed)**.

## Layout

The layout is built from flexbox/grid stacks on a **4px base scale**. Every gap, padding and margin comes from the `spacing` tokens (`var(--space-N)`). There are no arbitrary pixel values.

### Spacing rhythm

Use spacing to show relationships: the closer two things are, the more they belong together.

| Relationship | Token | Value | Source |
| --- | --- | --- | --- |
| Icon ↔ its label, inline items | `space-2` | 8px | Button gap |
| Controls in one cluster (toolbar, filter bar, button group, tag list) | `space-2` | 8px | Full guide |
| Label ↔ control ↔ help text (inside `FormField`) | `space-1` | 4px | Team decision (the full guide's FormField uses an off-scale 6px) |
| Between regions of a page (header, filters, table, pager) | `space-4` | 16px | Full guide |
| Page padding | `space-6` | 24px | Full guide |
| Between fields in a form | `space-6` | 24px | **(proposed)** |
| Between form sections, or between Cards in a stack | `space-6` | 24px | **(proposed)** |
| Between major page sections | `space-8` | 32px | **(proposed)** |
| Page padding below `sm` (640px) | `space-4` | 16px | **(proposed)** |

Inside a component, never change its built-in padding. Components own their insides, and you own the space between them.





### Page header pattern

Order: **Breadcrumb** (only if a hierarchy exists) → **H1 title** → optional description or status `Badge` → **actions**, right-aligned on the title row.

- Exactly **one Primary** button per page. Other actions use Secondary, Outline or Text, or go into a `Menu` (a Text button with `trailingIcon="expand_more"`, or `more_vert` for overflow).
- `Tabs` go below the title region, and only to switch between sibling views of the same object.
- When width is tight, actions wrap below the title. Never shrink them.

### Information hierarchy (proposed)

Before choosing components, rank everything the screen could show into four tiers for the **primary role**, and state the tier map in your output:

| Tier | Answers | Where |
| --- | --- | --- |
| 1. Act now | What is this, what state is it in, what do I do next? | Always visible, at the top |
| 2. Check and understand | Is it right? What is it made of? | Lower on the screen, or one Tab away |
| 3. Investigate | Why? What exactly? | Behind a disclosure: Accordion, Drawer, detail page, Tooltip |
| 4. Technical | What does the system hold? | Collapsed "Technical details", or not shown to this role |

- **Never hide tier 1,** errors, required fields, the current state, or anything that changes the outcome for candidates.
- One focal point per surface (the title and one Primary action). At most three emphasised items compete in a viewport.
- Collapsed regions are named after their content and flag non-default values. Use at most two disclosure levels.
- Full method, worked example and the mechanism table: `references/information-hierarchy.md`.

### Screen templates

Screen templates live in the component library file, not here: use the **Screen templates** section of the full guide (`inspera-design-system.md`). That section is maintained by the design system team and is being added in the next library version.

- **Read it when** you build a whole screen or a large region. Pick the template whose purpose matches the task, then follow its layout, regions and component choices as written.
- **Where they disagree,** this file's rules (plane rule, role, hierarchy, Do's and Don'ts) win over a template; the template wins over your own layout ideas.
- **If the section is missing, or no template fits,** compose the screen from canonical components: page header, then content ranked by tier (*Information hierarchy*), with the spacing rhythm above. Keep forms and settings single-column and at most 640px wide; let tables and dashboards use the full width **(proposed)**. Then write `DESIGN_SYSTEM_GAP: no screen template for <task>` in your output.
- **Never invent a named template** or present your own composition as a library template.
- **The global app shell** (top bar, navigation) is not a template. It always stays as-is (see *The plane rule*).

### Responsive behaviour

Breakpoints are minimum widths: `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1440. Respond to the space that is available, not to device names.

- No horizontal page scroll at standard zoom. Action areas wrap or collapse into a `Menu`. Never shrink targets or text.
- Forms stay single-column and readable on narrow screens.
- Tables need a deliberate strategy. Prioritise columns, and below `md` scroll horizontally inside the table container while keeping the first column readable **(proposed)**.
- Dialog panels keep `max-width: 100%`.
- Reading order and focus order must still make sense after reflow.

## Elevation & Depth

The UI is **flat by default**. Hierarchy comes from tonal layers: content sits on white `surface` over the grey `background` canvas and is separated by hairline `border`s. Shadows are only for things that genuinely sit above the page.

| Level | Token | Used by |
| --- | --- | --- |
| Flat | none, use `border` | Page content, tables, Stat tiles, Flat and Outlined cards |
| 100 | `shadow-100` | Selected segment in SegmentedControl and Contained Tabs |
| 200 | `shadow-200` | Raised Card, Menu panel, Date picker popover |
| 300 | `shadow-300` | Popover, Snackbar and Toast, Command Palette |
| 500 | `shadow-500` | Dialog |

- Prefer a border over a shadow for separation. Never give one element both a shadow and a strong border.
- Modal surfaces (Dialog, Drawer, Command Palette) sit on the `scrim` backdrop, which blocks the page behind them.
- Z-order uses the layering scale: base 0, sticky 100, dropdown 300, popover 400, overlay (scrim) 500, modal 600, toast 700, tooltip 800.
- A new plane always sits above an existing as-is page, whatever z-index values that page uses. See *Overview → The plane rule → On a new plane*.
- Motion explains a change of state and does not decorate. Hover and focus take 100ms, menus and popovers 200ms, and dialogs and drawers 300ms, using `easing-standard`, `easing-enter` and `easing-exit`. A Drawer slides in from its own edge. Honour `prefers-reduced-motion: reduce`.

## Shapes

Corners are **small to medium**, so the UI feels precise rather than soft. Radius follows the **role of the shape**, in three steps: controls → panels → containers.

> **Team decision (v0.9): every control uses `sm` (4px).** The full guide now agrees: inputs, selects and pickers are 4px, like every other control. DESIGN.md still wins for radius. The CSS changes are listed in *full-guide-additions.md*.

| Token | Value | Use |
| --- | --- | --- |
| `none` | 0 | Table cells, the inner corners of attached controls, and anything that meets another edge |
| `xs` | 2px | Checkbox, Rating star, Link focus outline, and **elements nested inside a 4px control**: the selected segment, contained-tab item, Number Input steppers |
| `sm` | 4px | **Controls:** Button, Text Input, Textarea, Select, Combobox, Date Picker and Date Range Picker triggers, Number Input, OTP boxes, Menu trigger, Pagination cells, Segmented Control and contained-Tabs tracks, plus menu/list options, calendar days and Tooltip |
| `md` | 8px | **Panels and messages:** Menu, Select and Combobox lists, the date-picker panel, Popover, Alert, Snackbar/Toast, Table and Data Grid frame, Accordion, List, File Upload drop zone |
| `lg` | 12px | **Containers:** Card, Dialog, Stat tile, Command Palette |
| `xl` | 16px | Reserved. Nothing uses it today, so prefer `lg` |
| `pill` | full | Only conceptually round shapes: Toggle, Radio, Badge, Tag, Avatar, Progress, Stepper indicator |

**Radius rules**

1. **Same-height controls in one row share one radius:** 4px. A field, a select and a button side by side must have matching corners. Mixed radii next to each other read as misaligned.
2. **Nested shapes step down.** An element inside another uses a smaller radius than its parent: Card 12 → Table 8 → Button 4, and Segmented track 4 → selected segment 2. Never put a larger radius inside a smaller one.
3. **Attached controls become one shape.** When controls touch with no gap (a search field with its button, a split button, a field with a unit addon), the outer corners take 4px and the inner corners where they meet are 0. They share one border, and the focus ring wraps the whole group.

   ```css
   .inspera-input-group { display: inline-flex; }
   .inspera-input-group > :first-child { border-top-right-radius: 0; border-bottom-right-radius: 0; }
   .inspera-input-group > :last-child  { border-top-left-radius: 0;  border-bottom-left-radius: 0; margin-left: -1px; }
   .inspera-input-group > :not(:first-child):not(:last-child) { border-radius: 0; margin-left: -1px; }
   ```

   There is no Input Group component in the library yet. Mark it `DESIGN_SYSTEM_GAP` and use the CSS above.
4. **On an as-is plane, match the as-is radius** (see *The plane rule*). These rules apply to library planes.

**Icons.** Use **Material Symbols Outlined** only. Never mix in Lucide, Heroicons or Font Awesome. Icon names are lowercase with underscores (`arrow_forward`, `more_vert`). Icons are 20px in buttons, fields, menus and alerts (16px in a Small button). Status icons in Badge, Tag and Alert use `FILL 1`, and all other icons are unfilled. A decorative icon gets `aria-hidden="true"`. An icon that is the only content of a control requires an accessible name on that control.

**Focus.** Focus is never removed, only replaced by something at least as visible.

- Buttons, links, tabs and standalone controls show a **2px `primary` outline with a 2px offset** (`:focus-visible`).
- Text fields, selects and comboboxes ring the wrapper with `--effect-state-focus` plus a `primary` border (`:focus-within`).
- Fields in an error state ring with `--effect-state-error`. On a dark container, use `--effect-state-focus-on-dark`.

## Components

The system has 48 canonical components. Use a canonical component before building a lookalike. Never rename a component or prop, and never invent a variant.

**API conventions**

- Prop names are camelCase and case-sensitive (`intent`, not `Intent`). React silently ignores an unknown prop, so a misspelt prop renders the default with no error.
- Variant values are Capitalised: `intent="Primary"`, `size="Medium"`, `orientation="Vertical"`.
- Every form control requires `label`, even when it is hidden (`showLabel={false}` or `withLabel={false}`), because the label becomes the accessible name.
- State is controlled with `value` + `onChange` (or `checked` / `open` / `page` …) or uncontrolled with `defaultValue`.
- Icons are passed as Material Symbols names: `leadingIcon="add"`.
- Validation uses `error` (boolean) + `errorText`. Help text uses `helpText`. Only one of them shows at a time.
- Do not use deprecated aliases (`Modal`, `Dropdown`, `Chip`, `Switch` …) in output. Accept them as input and map them to the canonical name.





### Choosing components

Use `references/components.md` for the full decision tables and key props. The most common choices:

- **Action → Button. Navigation → Link.** One Primary per page or surface. More than about three secondary actions go in a Menu.
- **Immediate on/off → Toggle. Saved with a form → Checkbox.** One of 2–6 → RadioGroup. One of 5+ → Select. Typing to find → Combobox.
- **Comparable records → Table** (DataGrid for sort, selection and paging). **Read-only status → Badge** with a word. **Removable label → Tag.**
- **Field error → errorText. Section error → Alert. Confirmation → Snackbar. Blocking decision → Dialog. Side task → Drawer.**
- **First load → Skeleton. User-triggered refresh → Spinner. Known duration → Progress. Nothing to show → EmptyState.**

### States every component must handle

- **Hover:** solid buttons darken toward black (to 90%), and Outline and Text buttons get an 8% primary tint. Fields move to `border-control-strong`, and rows and menu items take `action-hover`.
- **Focus:** see *Shapes → Focus*. It is always visible.
- **Pressed:** solid buttons darken to 82% and shift 1px down.
- **Disabled:** dimmed (`opacity 0.38` or `text-disabled` / `surface-disabled`) with `not-allowed`. Tell the user why when it is not obvious.
- **Read-only:** a `surface-readonly` fill. The value stays selectable and readable.
- **Error:** an `error` border or ring plus `errorText` linked with `aria-describedby` and `aria-invalid`.
- **Loading:** Skeleton for the first load, Spinner for a refresh, Progress when the duration is known.
- **Empty:** EmptyState, never a blank area.





## Do's and Don'ts

### Rules

These rules apply in full on library planes. On an as-is plane, see *Overview → The plane rule* for which rules are suspended.

1. **Don't invent design decisions.** Never invent a colour, spacing value, radius, shadow, font size, weight, icon set, focus style, breakpoint or component variant.
2. **Do use a canonical component** before building a lookalike, and **do compose** missing patterns from canonical components.
3. **Don't rename** components or props. Output uses canonical names only.
4. **Do consume tokens, not literals:** `var(--space-4)`, never `16px`; `var(--primary)`, never `#004080`. No arbitrary Tailwind values where a token exists.
5. **Don't introduce another design system.** No Material UI, Bootstrap, Ant, Chakra, shadcn default styling, Tailwind default palette or Radix Themes look. Headless behaviour libraries are fine if they are fully restyled to this spec.
6. **Do use Inter** for UI, Noto Sans Mono only for code and IDs, and Noto Serif only for long-form content.
7. **Do use Material Symbols Outlined** only.
8. **Do treat accessibility as part of the contract:** keyboard operation, visible focus, labels, roles, names and states.
9. **Don't use colour alone to carry meaning.**
10. **Do respect `prefers-reduced-motion`.**
11. **Don't add decoration that competes with hierarchy:** no gradients, glassmorphism, oversized radii, decorative shadows or animated backgrounds.
12. **Do mark real gaps** with `DESIGN_SYSTEM_GAP` instead of silently adding a component.
13. **Do apply the plane rule** when changing an existing product. Match the as-is styling on the same plane and use this library on a new plane (dialog, drawer or side panel, page, flow). Never mix the two styles within one plane.
14. **Do design for a named primary user role.** If it isn't given, ask before you start; if you can't ask, mark it `USER_ROLE_ASSUMED`.

### Composition do's and don'ts

- **Do** have exactly one Primary button per page, and one per Dialog or Drawer. **Don't** make two Primaries compete.
- **Do** name buttons with a verb for what they do ("Save changes", "Delete assessment"). **Don't** use "OK", "Yes" or "Submit".
- **Do** put dismiss first and commit last in button pairs, right-aligned. **Don't** put the Destructive button where Primary normally sits without a confirm step.
- **Do** show status as a Badge with a word. **Don't** use a bare coloured dot.
- **Do** keep one label per field and show help *or* error text. **Don't** use a placeholder as the label.
- **Do** right-align numeric table columns. **Don't** right-align text.
- **Do** keep the table visible while it loads or filters. **Don't** replace content with a full-page spinner.
- **Do** tell "empty" apart from "no results". **Don't** show an error state for a zero-result search.
- **Do** use whitespace first to separate content. **Don't** stack Dividers, borders and shadows on the same element.
- **Don't** nest Cards, nest Tabs, open a Dialog from a Dialog, or open two Drawers at once.
- **Don't** put essential information only in a Tooltip, Snackbar or collapsed Accordion.
- **Don't** shrink text or touch targets to fit more in. Prioritise, wrap, collapse into a Menu, or scroll the table.

### UX writing

Follow Inspera's writing guidelines in `references/ux-writing.md` for all UI text. The essentials:

- **Goals:** clear, calm and confident, neutral, efficient and precise, accessible and inclusive. No jargon, urgency, emotional language, blame, hedging, idioms or filler.
- **Structure:** goal before action ("To submit your exam, click Submit."). State facts and recovery calmly ("Connection lost. Reconnecting…"). One action per sentence.
- **Mechanics:** sentence case, active voice, contractions, numerals (1,000), dates spelled out ("Monday, 24 August"), 24-hour time (14:00), "75%", ranges with a hyphen (20-30), "€20", "22°C", "+47-123-4567". Spell out an acronym the first time.
- **UI text:** buttons are a verb plus an object ("Save changes"); errors say what's wrong and how to fix it; empty states say what's missing and what to do next; destructive confirmations name the object and the consequence.

### Technical content

Separate **analytics** from **raw technical data**. They follow different rules.

**Analytics and data insight** (item statistics, score distributions, marker agreement, progress) are core content for several roles: Author (item analysis), Grader/marker (own progress and distributions), Moderator (agreement and discrepancies) and Planner/admin (readiness). For these roles, show analytics as first-class content:

- Lead with the number and what it means ("Marker agreement 92%, 3 scripts differ by more than 2 marks"), then the detail.
- Use Stat for headline figures, Table/DataGrid for breakdowns, and Badge with a word for flags. Never rely on colour alone.
- Explain statistical terms in plain words the first time (helper text or a Tooltip), for example "Discrimination: how well this item separates stronger from weaker candidates".
- Respect the role's privacy setup. With anonymous marking, analytics must not reveal candidate identity, for example through small groups or sortable name columns.

**Raw technical data** (API endpoints, raw JSON, internal IDs and payload errors) is useful for technical and support work, but it's noise for every role above.

- **Don't show them by default.** If the primary role isn't technical, leave them out, or put them in a collapsed Accordion named "Technical details" at the end of the panel.
- **Never as primary content.** A human-readable summary comes first, and the raw data is the fallback.
- **When shown:** use `--font-mono` for IDs, endpoints and code, give each block a Copy button, and use a plain label ("Raw configuration (JSON)", not the endpoint path).
- **Errors in technical data:** say what that means for the user in plain words ("We couldn't read this configuration"). Show the raw payload only to roles who can act on it.
- There is no code-block component yet, so any code block must be marked `DESIGN_SYSTEM_GAP`. A proposal is in the full-guide additions.

### Pitfalls generated UI most often gets wrong

- Controls with an 8px radius or `rounded-lg`. **Every control is 4px** (`sm`): buttons, fields, selects and pickers alike. Panels and messages are 8px, and cards and dialogs 12px.
- A field and a button side by side with different corner radii.
- Primary rendered as a mid blue (#3B82F6-style). It is **deep navy #004080**.
- Button text that shrinks or grows with the button. It is **16px/600** at Medium and Large; only a Small button uses **14px/600**, with a 16px icon.
- Custom checkboxes or toggles with `display: none` on the input. Keep the native input visually hidden but present, and put the focus ring on the drawn box or track.
- A coloured Snackbar. It is always `gray-900`, and the intent tints only the icon and action.
- Field focus drawn as an outline. Fields ring with `--effect-state-focus` plus a primary border, while buttons use an outline.
- Missing accessible names on icon-only buttons, per-row action menus ("Actions for Ada Lovelace"), pagination arrows and Tag remove buttons ("Remove Status: Live").
- Restyling existing UI to match the library while adding to it, or styling a new dialog to look like the legacy page that opened it. Both break the plane rule.
- Dialogs without the scrim, focus trap, Escape to close or focus return.

### Before you call it done

**Role**

- [ ] The primary user role is named, either asked for or marked `USER_ROLE_ASSUMED`.
- [ ] The role's setup questions are answered or marked `ROLE_SETUP_ASSUMED` (anonymity, moderation scope, Invigilator device, test-player screenshots).
- [ ] Usage pattern, density, wording, technical detail, privacy and states follow that role's column in *How the role changes design decisions*.

**Shape**

- [ ] All controls are 4px, panels 8px and containers 12px. Same-height controls in a row match, and nested shapes step down.

**Writing**

- [ ] Text follows the writing goals: clear, calm, neutral, efficient and accessible. No jargon, urgency, emotional language, blame or filler.
- [ ] Sentence case, active voice, goal before action, and numbers, dates (24-hour time) and units as in `references/ux-writing.md`.

**Hierarchy**

- [ ] The tier map (1 act now, 2 check, 3 investigate, 4 technical) is stated, and tier 1 is visible without a click.
- [ ] One focal point per surface passes the squint test, and no more than three emphasised items compete in a viewport.
- [ ] Collapsed regions are labelled by content and flag non-default values; there are at most two disclosure levels.

**Plane**

- [ ] Every added part has a stated plane decision: same plane → as-is, new plane → library.
- [ ] No plane mixes the two styles. Triggers match the as-is, and what they open is fully library.
- [ ] Any `AS_IS_DEVIATION`, `AS_IS_REFERENCE_MISSING` or `PLANE_ASSUMED` is called out.
- [ ] New planes stack above everything on the as-is page, including its fixed header and footer.

**Visual system** (library planes)

- [ ] Every colour, space, radius and shadow resolves to a token, with no hex or px literals in app code.
- [ ] Inter and the documented type scale only. Icons are Material Symbols Outlined.
- [ ] No framework default styling leaked through.

**Composition**

- [ ] The screen follows a library screen template, or the output flags `DESIGN_SYSTEM_GAP: no screen template`. Every region uses canonical components.
- [ ] There is one Primary action per page or surface, and action labels are verbs.
- [ ] Spacing follows the rhythm: 8 inside clusters, 16 between regions and 24 page padding.
- [ ] Loading, empty, no-results, error, disabled and read-only states are designed.

**Components**

- [ ] No component or prop is renamed. Props are camelCase and values Capitalised.
- [ ] No undocumented variant. Any real gap is marked `DESIGN_SYSTEM_GAP`.

**Accessibility**

- [ ] Every interactive element works by keyboard, and focus is visible and follows reading order.
- [ ] Labels, roles, names and states are programmatic. Errors are linked to their field and announced.
- [ ] Overlays move focus in, trap it while modal, and restore it on close.
- [ ] No status is conveyed by colour alone, and `prefers-reduced-motion` is respected.

**Responsive**

- [ ] No horizontal page scroll. Actions wrap or collapse, and forms stay readable on narrow screens.
- [ ] Tables have a deliberate small-screen strategy, and reading and focus order survive reflow.
