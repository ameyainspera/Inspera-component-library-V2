# Components: choosing, index and patterns

> Reference file for `DESIGN.md` (Inspera Design System). Read it when you pick components for a screen or need a component's key props. `DESIGN.md` wins if the two disagree.

## Choosing a component

**Actions and navigation**

| Need | Use | Not |
| --- | --- | --- |
| Do something (save, delete, open a dialog) | `Button` | Link |
| Go somewhere (a real URL) | `Link` | Button |
| The page's main action | `Button intent="Primary"` (one per page) | a second Primary |
| A secondary action | `Button` Secondary / Outline / Text | another Primary |
| Destroy data | `Button intent="Destructive"`, usually inside a confirm Dialog | a red Secondary button |
| More than about 3 secondary actions, or row actions | `Menu` | a row of small buttons |
| Switch between sibling views of one object | `Tabs` (at most 6) | Stepper, SegmentedControl with 5+ items |
| Switch 2–4 views or modes in place | `SegmentedControl` | Tabs for a filter-like toggle |
| A sequence of steps | `Stepper` | Tabs |
| Show where the user is in a hierarchy | `Breadcrumb` (the last crumb is not a link) | — |
| Long, paged result sets | `Pagination` (or the DataGrid `footer`) | infinite list with no position |
| Power-user search across commands | `CommandPalette` (Cmd/Ctrl+K) | the only route to primary navigation |

**Choosing a value**

| Need | Use |
| --- | --- |
| A yes/no that applies **immediately** | `Toggle` |
| A yes/no that is saved with a form, or agreeing to terms | `Checkbox` |
| One of 2–6 visible options | `RadioGroup` |
| Several of a set of options | `CheckboxGroup` (a select-all row uses the indeterminate state) |
| One of 5 or more options, or space is tight | `Select` (turn on `search` for long lists) |
| One option from a long list where typing is the natural way to choose, or free text is allowed | `Combobox` (`allowCustomValue` only if free text is valid) |
| A number with steps or limits (minutes, points, attempts) | `NumberInput` with a `suffix` for units |
| A position in a continuous range where precision is not critical | `Slider` (always with min/max) |
| A date | `DatePicker` (ISO `YYYY-MM-DD`) |
| A start and end date | `DateRangePicker` |
| Files | `FileUpload` (state the types and size limit in `helpText`) |
| A one-time code | `OtpInput` |
| Single-line text | `TextInput` |
| Multi-line text | `Textarea` (`showCount` when `maxLength` applies) |
| Search | `TextInput` with `leadingIcon="search"` and a clear button named "Clear search" |
| A star score | `Rating` (`readOnly` to display an aggregate) |

Never use a Select for fewer than 3 options. Never use a Toggle in a form that has a Save button.

**Showing data**

| Need | Use |
| --- | --- |
| Comparable records with columns | `Table`. Use `DataGrid` for sorting, selection, row actions and paging |
| A simple vertical series (settings, results, activity) | `List` |
| A group of related content on one topic | `Card` (never nested) |
| A key metric with a trend | `Stat` |
| A status that is read, not acted on | `Badge` (always with a word) |
| A category or filter the user can remove or click | `Tag` |
| A person | `Avatar`. Use `AvatarGroup` with `max` and "+N" for sets |
| Long content the user can expand | `Accordion` (never hide critical content in it) |
| Separation where whitespace is not enough | `Divider` |
| No content to show | `EmptyState` (say why and offer the next step) |

**Feedback and overlays**

| Scope | Use |
| --- | --- |
| A single invalid field | Error text on the field (`FormField` / `errorText`) |
| A section or the whole form | `Alert` placed near the affected content (at most 2 stacked) |
| Confirming something that just happened | `Snackbar` in place, or `toast()` fired via `ToastProvider` (same look) |
| A decision that must block progress | `Dialog`, but only if it truly must block |
| A secondary task or a detail panel | `Drawer` |
| Interactive content anchored to a trigger | `Popover` |
| A short hint on hover or focus | `Tooltip` (never essential information, never interactive content) |
| Work of known duration | `Progress` (determinate) |
| Work of unknown duration, user-triggered | `Spinner` |
| First load of a page, table or card | `Skeleton` in the shape of the real content |

Never put something the user must keep or act on later in a Snackbar or Toast. They disappear.

## Component index

Key props per component. The full guide has the complete prop tables and HTML/CSS.

**Input controls**

| Component | Purpose | Key props and variants |
| --- | --- | --- |
| `Button` | Trigger an action | `label`* (start with a verb) · `intent` Primary/Secondary/Outline/Text/Success/Warning/Destructive · `size` Small 32/Medium 40/Large 44 · `leadingIcon` `trailingIcon` `iconOnly` · `type` defaults to `button` |
| `TextInput` | Single-line text | `label`* · `size` Small/Medium · `leadingIcon` `trailingIcon` · `helpText` `error` `errorText` · `readOnly` `disabled` |
| `Textarea` | Multi-line text | `label`* · `rows` (4) · `maxLength` `showCount` · `helpText` `error` `errorText` |
| `NumberInput` | A number with steppers | `label`* · `min` `max` `step` · `suffix` · `helpText` `error` `errorText` |
| `Select` | One of a list | `label`* `options`* · `widthMode` Fixed 220px/Hug · `search` · `helpText` `error` `errorText` |
| `Combobox` | Type to filter and pick | `label`* `options`* · `allowCustomValue` · `emptyText` |
| `Checkbox` | A single multi-select or agreement | `label`* · `checked` · `indeterminate` · `size` · `error` |
| `CheckboxGroup` | Multi-select set | `label`* `options`* · `value: string[]` · `orientation` Vertical/Horizontal |
| `RadioButton` | One radio option | `label`* · `selected` · `name`. Prefer RadioGroup |
| `RadioGroup` | One of 2–6 | `label`* `options`* · `orientation` · `helpText` `error` `errorText` |
| `Toggle` | An immediate on/off | `label`* · `checked` · `size` |
| `SegmentedControl` | 2–4 exclusive views | `label`* (not shown) `items`* · `size` · `fullWidth` |
| `Slider` | A value in a range | `label`* · `min` `max` `step` · `formatValue` · `showValue` |
| `DatePicker` | A date | `label`* · `value` (YYYY-MM-DD) · `helpText` `error` `errorText` |
| `DateRangePicker` | A date range | `label`* · `value: DateRange` · two-month calendar |
| `FileUpload` | Files by drop or browse | `label`* · `accept` `multiple` · `helpText` (constraints) · `onFiles` |
| `FormField` | Label, help and error wrapper | `label`* · `required` · `helpText` · `errorText` · exactly one child control |
| `Rating` | A star score | `label`* · `max` (5) · `readOnly` · `showValue` |
| `OtpInput` | A one-time code | `label`* · `length` (6) · `error` |

**Data display**

| Component | Purpose | Key props and variants |
| --- | --- | --- |
| `Card` | Contained group | `title` `body` or `children` · `elevation` Flat/Raised/Outlined · `padding` Compact 12/Default 16/Spacious 24 · `interactive` |
| `Table` | Structured rows | `columns`* `rows`* · `size` Compact/Default · `striped` · `selectable` · `caption` · `onRowClick` · column `align: 'right'` for numbers |
| `DataGrid` | Large datasets | Table props + `sort` · `rowActions` · `footer` `page` `pageCount` `pageSize` `total` |
| `List` | Vertical series | `items`* · `divided` · `interactive` · `size` |
| `Badge` | Read-only status | `label`* (1–2 words) · `intent` Neutral/Info/Success/Warning/Error · `size` · `withIcon` + `icon` |
| `Tag` | Removable or clickable label | `label`* · `intent` · `removable` + `onRemove` · `leadingIcon` · `onClick` |
| `Stat` | A metric | `label`* `value`* · `delta` + `deltaIntent` Up/Down/Neutral · `helpText` |
| `Avatar` | A person | `name`* · `src` · `size` 32/40/56 · `status` |
| `AvatarGroup` | A set of people | `avatars`* · `max` (4) |
| `Accordion` | Disclosure sections | `items`* · `selection` Single/Multiple · `headingLevel` (fit to the outline) |
| `Divider` | A rule | `orientation` · `label` · `spacing` Compact 8/Default 16/Spacious 24 |
| `EmptyState` | Nothing to show | `title`* · `description` · `icon` · `actionLabel` + `onAction` |

**Feedback**

| Component | Purpose | Key props and variants |
| --- | --- | --- |
| `Alert` | Inline message | `message`* · `title` · `intent` Info/Success/Warning/Error · `background` · `actionLabel` · `dismissible` |
| `Dialog` | Blocking decision | `open`* `title`* · `size` 400/480/560 · `confirmLabel` (name the action) · `cancelLabel` · `onConfirm` `onClose` |
| `Drawer` | Side task or panel | `open`* `title`* · `side` Right/Left/Bottom · `size` 320/400/560 |
| `Snackbar` | Brief confirmation | `message`* · `intent` (tints the icon only) · `actionLabel` ("Undo") |
| `Toast` | Fire-and-forget notices | `ToastProvider` once at the root · `toast(message, { intent, actionLabel, onAction })` · `position` |
| `Popover` | Anchored interactive panel | `trigger`* `content`* · `title` · `placement` |
| `Tooltip` | A hint | `content`* · one focusable child · `placement` · `theme` Dark/Light · `variant` Accessibility |
| `Progress` | Known progress | `label`* · `variant` Linear/Circular · `value` · `indeterminate` · `intent` |
| `Spinner` | Unknown wait | `size` 16/24/40 · `intent` Primary/Neutral/Inverse · `label` |
| `Skeleton` | Loading placeholder | `variant` Text/Rect/Circle · `lines` · `width` `height` |
| `CommandPalette` | Keyboard command search | `commands`* · `hotkey` (Cmd/Ctrl+K) · `onSelect` |

**Navigation**

| Component | Purpose | Key props and variants |
| --- | --- | --- |
| `Tabs` | Sibling views | `items`* · `variant` Underline/Contained · `size` 40/48 · `label` |
| `Breadcrumb` | Hierarchy trail | `items`* (last = current page) · `separator` Chevron/Slash |
| `Pagination` | Page through results | `pageCount`* · `page` · `siblingCount` · `showEdges` |
| `Menu` | Action list | `label`* (trigger) `items`* · `placement` BottomStart/BottomEnd · `onSelect` |
| `Stepper` | Sequential progress | `steps`* · `activeStep` (0-based) · `orientation` |
| `Link` | Navigate | `href`* · `intent` Default/Muted · `underline` Hover/Always/None · `external` |

`*` = required.

## Composition patterns

These are arrangements of canonical components, not new exports.

- **Search field:** a `TextInput` with `leadingIcon="search"`, plus a trailing clear button named "Clear search" when it has a value. Keep a visible label unless the context makes the purpose unambiguous and it has a programmatic label. Use the same border, radius and focus as any TextInput.
- **Toolbar / action bar:** `Button`, `Menu`, `Select`, `TextInput`, `Divider`. Order by frequency and importance, keep one local primary action, and move low-frequency actions into a Menu.
- **Filter bar:** `Select`, `DatePicker`, `TextInput`, `Tag`, `Button`. Show active criteria as removable Tags. Show Reset only when a filter is active.
- **Table toolbar:** search and filters come first, then table actions, then the selected count and bulk actions when rows are selected.
- **Settings row:** title → description → control. The control's name matches the title.
- **Status indicator:** a `Badge` with a word, or a `Tag` if it is removable or filterable. A bare coloured dot is not a status.
- **Label / value pairs (proposed):** a two-column grid. The label is `regular-14` in `text-secondary` and the value is `default-16-regular` in `text-primary`. Use `space-4` between rows, and stack the columns below `sm`.
- **Destructive confirm:** a `Dialog` titled with a question, a body stating the consequence and naming the object, and the footer `Cancel` (Text) + `Delete` (Destructive).

## Reference screen

A list page built only from canonical components:

```tsx
import { Breadcrumb, Button, Select, DatePicker, Tag, Table, Badge, Pagination } from '@inspera/components'

export function AssessmentList() {
  return (
    <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Assessments' }]} />

      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <h1 className="inspera-h1" style={{ margin: 0 }}>Assessments</h1>
        <Button label="New assessment" intent="Primary" leadingIcon="add" />
      </header>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <Select label="Status" options={['All', 'Live', 'Draft', 'Scheduled']} value="Live" />
        <DatePicker label="Created after" value="2026-01-01" />
        <Button label="Reset filters" intent="Text" />
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <Tag label="Status: Live" removable onRemove={() => {}} />
        <Tag label="Created after 1 January" removable onRemove={() => {}} />
      </div>

      <Table
        caption="Assessments"
        columns={[
          { key: 'name', header: 'Assessment' },
          { key: 'items', header: 'Items', align: 'right' },
          { key: 'status', header: 'Status' },
        ]}
        rows={[
          { name: 'Algebra Quiz', items: 24, status: <Badge label="Live" intent="Success" /> },
          { name: 'History Midterm', items: 40, status: <Badge label="Draft" intent="Neutral" /> },
          { name: 'Biology Final', items: 60, status: <Badge label="Scheduled" intent="Info" /> },
        ]}
      />

      <Pagination pageCount={8} page={1} />
    </div>
  )
}
```

