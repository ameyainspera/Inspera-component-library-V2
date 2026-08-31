<!-- Inspera Design System v1.0.0 — generated file, do not edit. -->

# Inspera Design System — Composition & rules

Version 1.0.0. How to assemble the canonical components into screens.

## Rules

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

