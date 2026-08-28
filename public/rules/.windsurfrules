# Inspera Design System

All UI in this project uses the Inspera Design System (v1.0.0).

1. Do not invent design decisions. Never invent a colour, spacing value, radius, shadow, font size, weight, icon library, focus style, breakpoint, or component variant that this document defines.
2. Use a canonical component before building a lookalike. If one exists for the job, use it.
3. Never rename a canonical component or prop. A deprecated alias may be understood as input, but output must use the canonical name.
4. Consume tokens, not literals. Raw values here define what a token resolves to; application code references `var(--token)`.
5. Do not introduce another design system. No Material UI, Bootstrap, Ant, Chakra, shadcn default styling, Tailwind default palette, or Radix Themes look. Headless behaviour libraries are fine if restyled entirely to this spec.
6. No arbitrary Tailwind values where a token exists. Never `bg-[#004080]` — use the token.
7. Inter for product UI. Noto Sans Mono only for code, identifiers and technical values; Noto Serif only for long-form content.
8. Material Symbols Outlined only. Do not mix in Lucide, Heroicons, or Font Awesome.
9. Accessibility is part of the component contract, not an enhancement. Keyboard operation, visible focus, labels, roles, names, and states are required.
10. Never use colour alone to carry meaning. Pair it with text, an icon, or shape.
11. Respect `prefers-reduced-motion: reduce` — drop non-essential motion.
12. Compose rather than invent. If a pattern is not a canonical component, build it from canonical components using the patterns below.
13. Do not silently add a component. If the system genuinely cannot express something, emit `DESIGN_SYSTEM_GAP` in your output and use the closest documented composition.
14. No decoration that competes with hierarchy: no gradients, glassmorphism, oversized radii, decorative shadows, or animated backgrounds.

**Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
silently ignores an unknown prop, so a capitalised name renders the default
variant with no error at all. Variant *values* are Capitalised
(`intent="Primary"`, `size="Medium"`).

**When two instructions conflict**, this order wins:

1. Accessibility and safety requirements
2. The rules above
3. Token definitions
4. Canonical component specifications
5. Composition patterns
6. Product requirements supplied with the task
7. Examples

**When the spec does not answer your question:**

- Reuse the nearest canonical component or composition.
- Reuse an existing token.
- Preserve the established density and hierarchy.
- Do not infer a brand colour or visual style from framework defaults.
- Mark a genuinely missing primitive `DESIGN_SYSTEM_GAP` rather than presenting it as canonical.

## Reference

They live in this repo's `public/` directory (set INSPERA_DS_BASE_URL and regenerate to emit absolute URLs)

- `llms.txt` — component index. Read this first.
- `c/<component>.md` — full spec for one component. Fetch only what you use.
- `api.json` — every prop, type and default, machine-readable.
- `tokens.css` — import once at the app root.
- `inspera.theme.css` — Tailwind v4 `@theme` block, if this project uses Tailwind.

## Foundations

Every value below is a CSS custom property. Import the stylesheet once at the
app root and reference tokens as `var(--primary)`, `var(--space-4)`,
`var(--radius-md)`. Never hardcode a colour that is not in this list.

### Colour — brand & semantic

| Token | CSS variable | Value | Use |
| --- | --- | --- | --- |
| `primary.main` | `var(--primary)` | #004080 | Primary brand / interactive |
| `secondary.main` | `var(--secondary)` | #322060 | Secondary brand, used sparingly |
| `error` | `var(--error)` | #D32F2F | Use only for its meaning (error) |
| `warning` | `var(--warning)` | #EF6C00 | Use only for its meaning (warning) |
| `info` | `var(--info)` | #0288D1 | Use only for its meaning (info) |
| `success` | `var(--success)` | #2E7D32 | Use only for its meaning (success) |
| `accent.zest` | `var(--accent-zest)` | #FA5101 | Sparingly, for accent moments |
| `accent.berry` | `var(--accent-berry)` | #89239A | Sparingly, for accent moments |
| `accent.algae` | `var(--accent-algae)` | #00A788 | Sparingly, for accent moments |

### Colour — palette

Each family runs 100 (lightest) to 900 (darkest). 600–900 are safe for text on
a light background; 100–300 are surface tints.

- **gray** — 100 `#F7F7F7` · 200 `#EDEDED` · 300 `#D9D9D9` · 400 `#BCBCBC` · 500 `#949494` · 600 `#7A7A7A` · 700 `#595959` · 800 `#404040` · 900 `#272727`
- **blue** — 100 `#F0F7FF` · 200 `#DBEDFF` · 300 `#B3D9FF` · 400 `#7ABDFF` · 500 `#3399FF` · 600 `#007AF5` · 700 `#0059B3` · 800 `#004080` · 900 `#002E5C`
- **green** — 100 `#F2FDF8` · 200 `#E0FAEF` · 300 `#BDF4DD` · 400 `#8DECC5` · 500 `#50E2A5` · 600 `#1BA76D` · 700 `#147B50` · 800 `#106542` · 900 `#0D4F33`
- **red** — 100 `#FEF1F1` · 200 `#FCDEDE` · 300 `#F9B8B8` · 400 `#F58484` · 500 `#F04242` · 600 `#E21212` · 700 `#A50D0D` · 800 `#760A0A` · 900 `#550707`
- **yellow** — 100 `#FFFCF0` · 200 `#FFF8DC` · 300 `#FEF0B3` · 400 `#FEE67C` · 500 `#FDD835` · 600 `#F2C602` · 700 `#B19102` · 800 `#7E6701` · 900 `#5B4A01`
- **orange** — 100 `#FFFAF0` · 200 `#FFF3DC` · 300 `#FEE5B3` · 400 `#FED27C` · 500 `#FDBA35` · 600 `#F2A202` · 700 `#D99102` · 800 `#7E5501` · 900 `#5B3D01`
- **purple** — 100 `#F6F4FB` · 200 `#E9E4F6` · 300 `#D0C6EC` · 400 `#9F88D7` · 500 `#8366CC` · 600 `#603DB8` · 700 `#462D86` · 800 `#322060` · 900 `#241745`
- **pink** — 100 `#FEF1F5` · 200 `#FCDFE8` · 300 `#F8B9CE` · 400 `#F386AB` · 500 `#ED457D` · 600 `#DF1659` · 700 `#A21041` · 800 `#740B2E` · 900 `#540821`

### Colour — roles

Prefer a role token over a raw palette shade wherever one exists.

**Interaction** — `var(--primary-hover-overlay)` rgba(0, 64, 128, 0.04), `var(--primary-focus-ring)` rgba(0, 64, 128, 0.3), `var(--action-active)` rgba(0, 0, 0, 0.56), `var(--action-hover)` rgba(0, 0, 0, 0.04), `var(--action-focus)` rgba(0, 0, 0, 0.12), `var(--action-disabled)` rgba(0, 0, 0, 0.38)

**Text** — `var(--text-primary)` rgba(0, 0, 0, 0.87), `var(--text-secondary)` var(--gray-600), `var(--text-disabled)` var(--action-disabled), `var(--text-on-primary)` #ffffff

**Status** — `var(--info-surface)` #E1F5FE, `var(--success-surface)` #E8F5E9, `var(--warning-surface)` #FFF3E0, `var(--error-surface)` #FFEBEE

**Controls** — `var(--border-control)` #C4C4C4, `var(--border-control-strong)` #8C8C8C, `var(--text-placeholder)` #8C8C8C, `var(--surface-disabled)` #F5F5F5, `var(--surface-readonly)` var(--gray-100), `var(--surface-neutral)` #F0F0F0, `var(--avatar-surface)` #E0E0E0

**Surface** — `var(--background)` var(--gray-100), `var(--surface)` var(--white), `var(--surface-sunken)` var(--gray-100), `var(--border)` var(--gray-200), `var(--border-strong)` var(--gray-300), `var(--border-interactive)` var(--gray-500), `var(--muted-foreground)` var(--gray-600)

### Typography

Inter for all UI text (weights 300, 400, 500, 600). Noto Sans Mono for
code, identifiers and token values. Noto Serif for long-form content. Material
Symbols Outlined for icons.

Every style below has a ready-made class — prefer `class="inspera-h1"` over
setting four properties by hand.

Sizes are exact, exported from Figma. Figma exports font-size only for text
styles, so a row marked *unconfirmed* has a line height or weight inferred from
the V3 spec rather than measured.

#### Default

| Style | Class | Size | Weight | Line height | Notes |
| --- | --- | --- | --- | --- | --- |
| `Default/Default 16 px/Regular` | `.inspera-default-16-regular` | 16px | 400 | 1.25 | V3 body.mdRegular — line height fixed at 20px |
| `Default/16 px/Medium` | `.inspera-default-16-medium` | 16px | 500 | 1.25 | V3 body.mdMedium — line height fixed at 20px |
| `Default/Link 16 px` | `.inspera-link-16` | 16px | 500 | 1.25 | underline, unconfirmed: weight, lineHeight |

#### Regular

| Style | Class | Size | Weight | Line height | Notes |
| --- | --- | --- | --- | --- | --- |
| `Regular/14 px/Regular` | `.inspera-regular-14` | 14px | 400 | 1.4 | unconfirmed: lineHeight |
| `Regular/18 px/Regular` | `.inspera-regular-18` | 18px | 400 | 1.4 | unconfirmed: lineHeight |
| `Regular/20 px/Regular` | `.inspera-regular-20` | 20px | 400 | 1.4 | unconfirmed: lineHeight |
| `Regular/22 px/Regular` | `.inspera-regular-22` | 22px | 400 | 1.4 | unconfirmed: lineHeight |
| `Regular/26 px/Regular` | `.inspera-regular-26` | 26px | 400 | 1.4 | unconfirmed: lineHeight |

#### Medium

| Style | Class | Size | Weight | Line height | Notes |
| --- | --- | --- | --- | --- | --- |
| `Medium/14 px/Medium` | `.inspera-medium-14` | 14px | 500 | 1.4 | unconfirmed: lineHeight |
| `Medium/18 px/Medium` | `.inspera-medium-18` | 18px | 500 | 1.4 | unconfirmed: lineHeight |
| `Medium/20 px/Medium` | `.inspera-medium-20` | 20px | 500 | 1.4 | unconfirmed: lineHeight |
| `Medium/22 px/Medium` | `.inspera-medium-22` | 22px | 500 | 1.4 | unconfirmed: lineHeight |
| `Medium/26 px/Medium` | `.inspera-medium-26` | 26px | 500 | 1.4 | unconfirmed: lineHeight |

#### Heading

| Style | Class | Size | Weight | Line height | Notes |
| --- | --- | --- | --- | --- | --- |
| `Heading/H1` | `.inspera-h1` | 28.83px | 600 | 1.12 |  |
| `Heading/H2` | `.inspera-h2` | 22.78px | 500 | 1.12 |  |
| `Heading/H3` | `.inspera-h3` | 20.25px | 500 | 1.12 |  |
| `Heading/H4` | `.inspera-h4` | 18px | 500 | 1.12 |  |
| `Heading/H5` | `.inspera-h5` | 16px | 500 | 1.12 |  |
| `Heading/H6` | `.inspera-h6` | 12px | 500 | 1.12 | +1.6px tracking, uppercase |

#### Extended

| Style | Class | Size | Weight | Line height | Notes |
| --- | --- | --- | --- | --- | --- |
| `Extended/Semi Bold 16 px` | `.inspera-semibold-16` | 16px | 600 | 1.25 | unconfirmed: lineHeight |
| `Extended/Inter Semi Bold 12 px/ALL CAPS` | `.inspera-allcaps-12` | 12px | 600 | 1.12 | +1.6px tracking, uppercase, unconfirmed: lineHeight, tracking |

#### Paragraph

| Style | Class | Size | Weight | Line height | Notes |
| --- | --- | --- | --- | --- | --- |
| `Paragraph/Default` | `.inspera-paragraph-default` | 16px | 400 | 1.5 | V3 body.paragraph — 150% |
| `Paragraph/Content` | `.inspera-paragraph-content` | 16px | 400 | 1.5 | unconfirmed: lineHeight |
| `Paragraph/Captions` | `.inspera-paragraph-captions` | 12px | 400 | 1.2 | V3 body.caption — 120% |
| `Paragraph/Heading` | `.inspera-paragraph-heading` | 20.25px | 500 | 1.12 | unconfirmed: weight, lineHeight |

#### Extra

| Style | Class | Size | Weight | Line height | Notes |
| --- | --- | --- | --- | --- | --- |
| `Extra/Noto Sans Mono` | `.inspera-mono-16` | 16px | 400 | 1.5 | unconfirmed: lineHeight |
| `Extra/Noto Serif` | `.inspera-serif-16` | 16px | 400 | 1.5 | unconfirmed: lineHeight |

#### Documentation

| Style | Class | Size | Weight | Line height | Notes |
| --- | --- | --- | --- | --- | --- |
| `Documentation` | `.inspera-documentation` | 14px | 300 | 1.4 | Inter Light per the specimen sheet, unconfirmed: weight, lineHeight |

### Spacing

Use the scale — no arbitrary pixel values.

| Token | CSS variable | Value |
| --- | --- | --- |
| `0` | `var(--space-0)` | 0px |
| `1` | `var(--space-1)` | 4px |
| `2` | `var(--space-2)` | 8px |
| `3` | `var(--space-3)` | 12px |
| `4` | `var(--space-4)` | 16px |
| `5` | `var(--space-5)` | 20px |
| `6` | `var(--space-6)` | 24px |
| `8` | `var(--space-8)` | 32px |
| `10` | `var(--space-10)` | 40px |
| `12` | `var(--space-12)` | 48px |
| `16` | `var(--space-16)` | 64px |

### Radius

Small-to-medium radii: `sm` for controls, `md` for inputs and alerts,
`lg` for cards and dialogs. Pills only for shapes that are conceptually round.

"Used by" is read from the component source, so it reflects what the library
actually does rather than what this document claims.

| Token | CSS variable | Value | When to use | Used by |
| --- | --- | --- | --- | --- |
| `none` | `var(--radius-none)` | 0px | Flush edges — table cells, full-bleed surfaces, anything that meets another edge. | — |
| `xs` | `var(--radius-xs)` | 2px | The smallest indicators, where 4px would read as a visible curve. | Checkbox, Link |
| `sm` | `var(--radius-sm)` | 4px | Controls: buttons, tags, segments, menu items. | Button, DatePicker, Dialog, List, Menu, Popover, SegmentedControl, Select, Skeleton, Tabs, Tooltip |
| `md` | `var(--radius-md)` | 8px | Inputs, alerts and floating panels — the system default. | Accordion, Alert, DatePicker, Drawer, FileUpload, List, Menu, OtpInput, Pagination, Popover, SegmentedControl, Select, Skeleton, Snackbar, Table, Tabs, TextInput, Textarea |
| `lg` | `var(--radius-lg)` | 12px | Large surfaces that contain other components: cards, dialogs, drawers. | Card, Dialog, Stat |
| `xl` | `var(--radius-xl)` | 16px | Reserved for oversized surfaces. Nothing uses it today; prefer lg. | — |
| `pill` | `var(--radius-pill)` | fully round | Only for shapes that are conceptually round: toggles, badges, radios, avatars. | Avatar, Badge, Dialog, Progress, RadioButton, Skeleton, Slider, Stepper, Tag, Toggle, Tooltip |

### Depth / elevation

Flat by default. Prefer a border over a shadow for separation; use `200` for
cards and `500` for dialogs.

| Token | CSS variable | Value |
| --- | --- | --- |
| `shadow.100` | `var(--shadow-100)` | `0px 4px 4px rgba(39, 39, 39, 0.08), 0px 2px 4px rgba(39, 39, 39, 0.12)` |
| `shadow.200` | `var(--shadow-200)` | `0px 8px 8px rgba(39, 39, 39, 0.08), 0px 4px 6px rgba(39, 39, 39, 0.12)` |
| `shadow.300` | `var(--shadow-300)` | `0px 8px 16px rgba(39, 39, 39, 0.08), 0px 6px 8px rgba(39, 39, 39, 0.12)` |
| `shadow.400` | `var(--shadow-400)` | `0px 8px 24px rgba(39, 39, 39, 0.08), 0px 6px 12px rgba(39, 39, 39, 0.12)` |
| `shadow.500` | `var(--shadow-500)` | `0px 10px 32px rgba(39, 39, 39, 0.1), 0px 6px 14px rgba(39, 39, 39, 0.12)` |
| `shadow.600` | `var(--shadow-600)` | `0px 12px 42px rgba(39, 39, 39, 0.12), 0px 8px 18px rgba(39, 39, 39, 0.12)` |

### Effects

Focus rings, validation rings, the button highlight and link underlines. Apply
as `box-shadow`. Their colours are palette colours.

| Token | CSS variable | Value | Use |
| --- | --- | --- | --- |
| `state-focus` | `var(--effect-state-focus)` | `0px 0px 0px 3px var(--blue-300)` | Standard input focus ring · unconfirmed: spread |
| `state-focus-standalone` | `var(--effect-state-focus-standalone)` | `0px 0px 0px 3px var(--blue-600)` | High-contrast standalone focus · unconfirmed: spread |
| `state-error` | `var(--effect-state-error)` | `0px 0px 0px 3px var(--red-300)` | Error ring · unconfirmed: spread |
| `state-hover-light` | `var(--effect-state-hover-light)` | `0px 0px 0px 3px var(--gray-500)` | Hover outline · unconfirmed: spread |
| `state-focus-on-dark` | `var(--effect-state-focus-on-dark)` | `0px 0px 0px 3px var(--green-300)` | Focus ring on a dark container · unconfirmed: spread |
| `button-shadow` | `var(--effect-button-shadow)` | `inset 0px -1px 0px rgba(0, 0, 0, 0.2), 0px 1px 0px rgba(0, 0, 0, 0.08)` | Standard button elevation highlight |
| `link-underline-dark` | `var(--effect-link-underline-dark)` | `inset 0px -1px 0px var(--gray-700)` | Link underline on light ground |
| `link-underline-blue` | `var(--effect-link-underline-blue)` | `inset 0px -1px 0px var(--blue-800)` | Primary link underline |
| `link-underline-light` | `var(--effect-link-underline-light)` | `inset 0px -1px 0px var(--white)` | Link underline on dark ground |
| `invert-hack` | `var(--effect-invert-hack)` | `inset 1000px 0px 0px var(--white)` | Overrides the browser autofill background on inputs |

### Motion

Motion explains a state change; it does not decorate. Under
`prefers-reduced-motion: reduce`, drop non-essential transitions.

| Token | CSS variable | Value | Use |
| --- | --- | --- | --- |
| `duration.instant` | `var(--duration-instant)` | 0ms | No transition |
| `duration.fast` | `var(--duration-fast)` | 100ms | Hover and focus |
| `duration.normal` | `var(--duration-normal)` | 200ms | Menus, popovers |
| `duration.slow` | `var(--duration-slow)` | 300ms | Dialogs, drawers |
| `easing.standard` | `var(--easing-standard)` | `cubic-bezier(0.2, 0, 0, 1)` | Default |
| `easing.enter` | `var(--easing-enter)` | `cubic-bezier(0, 0, 0.2, 1)` | Entering the screen |
| `easing.exit` | `var(--easing-exit)` | `cubic-bezier(0.4, 0, 1, 1)` | Leaving the screen |

### Layering

Use the scale. Never an arbitrary value such as `99999`.

| Token | CSS variable | Value | Use |
| --- | --- | --- | --- |
| `z.base` | `var(--z-base)` | 0 |  |
| `z.sticky` | `var(--z-sticky)` | 100 | Sticky headers and toolbars |
| `z.dropdown` | `var(--z-dropdown)` | 300 | Select and Menu panels |
| `z.popover` | `var(--z-popover)` | 400 |  |
| `z.overlay` | `var(--z-overlay)` | 500 | Dialog and Drawer scrim |
| `z.modal` | `var(--z-modal)` | 600 | Dialog and Drawer surface |
| `z.toast` | `var(--z-toast)` | 700 | Snackbar |
| `z.tooltip` | `var(--z-tooltip)` | 800 |  |

### Breakpoints

Shared layout thresholds, not device names. Prefer responding to available
space over user-agent detection.

| Token | CSS variable | Min width |
| --- | --- | --- |
| `sm` | `var(--breakpoint-sm)` | 640px |
| `md` | `var(--breakpoint-md)` | 768px |
| `lg` | `var(--breakpoint-lg)` | 1024px |
| `xl` | `var(--breakpoint-xl)` | 1280px |
| `2xl` | `var(--breakpoint-2xl)` | 1440px |

### Borders & focus

| Token | CSS variable | Value |
| --- | --- | --- |
| `border-width.default` | `var(--border-width-default)` | 1px |
| `border-width.strong` | `var(--border-width-strong)` | 2px |
| `focus-ring-width` | `var(--focus-ring-width)` | 2px |
| `focus-ring-offset` | `var(--focus-ring-offset)` | 2px |
| `focus-ring-color` | `var(--focus-ring-color)` | var(--primary) |

Focus is never removed, only replaced by something at least as visible:

```css
:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}
```


## Composition patterns

These are **compositions, not new components**. They do not authorise a new
export — they say how to arrange the canonical ones. If a requested pattern is
not here and not a canonical component, build it from canonical components and
say so; do not invent a new one.

#### Search field

Build from: `TextInput`.

- A `TextInput` with a leading `search` icon, plus a trailing clear action when there is a value.
- Keep a visible label unless surrounding UI makes the purpose unambiguous and provides a programmatic label.
- The clear control needs an accessible name such as "Clear search".
- Do not give it a different border, radius, or focus treatment from a normal TextInput.

#### Page header

Build from: `Breadcrumb`, `Button`, `Menu`, `Tabs`.

- Order: breadcrumb (if a hierarchy exists), H1 title, optional supporting description or status, then actions.
- Exactly one primary action. Everything else is Secondary, Outline, Text, or inside a Menu.
- Tabs belong below the title region, and only when they switch sibling views of the same object.
- Collapse actions beneath the title when width is constrained rather than shrinking them.

#### Side navigation

Build from: `Link`, `Badge`, `Tooltip`.

- The selected item must be distinguished by more than colour — weight, a rule, or a background.
- Collapsed icon-only items require accessible names and a Tooltip.
- Preserve DOM and keyboard order when collapsing.

#### Toolbar / action bar

Build from: `Button`, `Menu`, `Select`, `TextInput`, `Divider`.

- Order by frequency and importance; keep one local primary action.
- Push low-frequency actions into a Menu rather than shrinking targets to fit.

#### Filter bar

Build from: `Select`, `DatePicker`, `TextInput`, `Tag`, `Button`.

- Show active criteria as removable `Tag`s, so the current filter state is readable as text and not only as colour.
- Show a reset action only when at least one non-default filter is active.

#### Table toolbar

Build from: `TextInput`, `Select`, `Button`, `Table`, `Pagination`.

- Search and filter controls come before table actions.
- Keep table context visible while filtering; never swap the table for a bare spinner.

#### Settings row

Build from: `Toggle`, `Checkbox`, `Select`, `Divider`.

- Order: setting title, supporting description, then the control.
- Do not place the control between title and description — it breaks reading order.
- The control's accessible name must map to the setting title.
- Use a Divider only where it genuinely improves grouping.

#### Status indicator

Build from: `Badge`, `Tag`.

- Always pair the colour with a label or icon. A bare coloured dot is not a status.
- Use `Badge` for state that is read, `Tag` for something the user can remove or filter by.

#### Empty results

Build from: `EmptyState`, `Button`.

- Use `EmptyState` when a search or filter legitimately returns nothing.
- Say what happened and offer the next step — usually clearing the filters.
- A zero-result query is not an error. Do not show a failure state for it.

## Forms

- Wrap each control in `FormField` for consistent label, help, and error layout.
- One visible label per field. A placeholder is not a label.
- Show help text or an error, not both; when invalid, the error must be programmatically associated with the control.
- Use `RadioGroup` for mutually exclusive choices and `CheckboxGroup` for multi-select.
- Use `Select` for a compact choice; enable its search mode for long lists.
- Use `FileUpload` for files — never a text input styled to look like one.
- Keep required/optional wording consistent within a form.
- Never clear user input when validation fails.
- Do not make a disabled submit button the only signal that something is wrong.

## Data tables

- Right-align numeric columns; keep headers short.
- Expose sort direction programmatically, not just with an arrow glyph.
- Use `Checkbox` for row selection and show a selected count.
- Use `Skeleton` for initial load and `Spinner` for a user-triggered refresh.
- An empty dataset and a no-results-for-this-filter state are different — say which.
- Page long tables with `Pagination`.
- Do not shrink text or targets to fit more columns; prioritise columns or scroll the table.

## Which feedback component

| Scope | Use |
| --- | --- |
| A single invalid field | Error text on the field itself, via FormField |
| A section or the whole form | Alert, placed near the affected content |
| Confirming something just happened | Snackbar |
| A decision that must block progress | Dialog — only when it genuinely must block |
| A secondary task or detail panel | Drawer |
| Known-duration work | Progress |
| Unknown-duration work | Spinner |
| Initial page or table load | Skeleton |
| Nothing to show | EmptyState |

Never put something the user must retain or act on later in a Snackbar.

## Before you call it done

**Visual system**

- [ ] Every colour resolves to a token — no hex literals in application code.
- [ ] Spacing, radius and shadow values come from the scales.
- [ ] Typography uses Inter and the documented type scale.
- [ ] Icons are Material Symbols Outlined.
- [ ] No framework default styling leaked through.

**Components**

- [ ] Canonical components were used where one exists.
- [ ] No component or prop was renamed; prop names are camelCase, variant values Capitalised.
- [ ] No undocumented variant was invented.
- [ ] Any genuine gap is marked DESIGN_SYSTEM_GAP.

**Accessibility**

- [ ] Every interactive element is reachable and operable by keyboard.
- [ ] Focus is always visible, and focus order follows reading order.
- [ ] Labels, roles, names and states are programmatically available.
- [ ] Errors are associated with their field and announced.
- [ ] Overlays move focus in, keep it inside while modal, and restore it on close.
- [ ] No status is conveyed by colour alone.
- [ ] prefers-reduced-motion is respected.

**Responsive**

- [ ] No horizontal page scroll at standard zoom.
- [ ] Action areas wrap or collapse rather than shrink.
- [ ] Forms stay readable on a narrow viewport.
- [ ] Tables have a deliberate small-screen strategy.
- [ ] Reading and focus order still make sense after reflow.

