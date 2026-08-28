# Components

The Inspera kit ships 42 components. Import from `@inspera/kit`. Read the
component's entry before using it — prop names and variant casing are exact.

## input-controls

### Button

Trigger an action. — category: `input-controls`.

```tsx
import { Button } from '@inspera/kit'

<Button
  label="Button"
  intent="Primary"
  size="Medium"
  content="Text"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Button'` |  |
| `intent` | `'Primary' \| 'Secondary' \| 'Outline' \| 'Text' \| 'Success' \| 'Warning' \| 'Destructive'` | `'Primary'` | Visual role / semantic weight. Values: Primary \| Secondary \| Outline \| Text \| Success \| Warning \| Destructive. |
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Medium'` | Height 32 / 40 / 48. Values: Small \| Medium \| Large. |
| `state` | `'Default' \| 'Hover' \| 'Focused' \| 'Pressed' \| 'Disabled'` | `'Default'` | Forces a visual state for documentation. Omit for real interactivity. |
| `content` | `'Text' \| 'Icon + Text' \| 'Text + Icon' \| 'Text + Disclosure'` | `'Text'` | Label / icon composition. Values: Text \| Icon + Text \| Text + Icon \| Text + Disclosure. |
| `icon` | `string` | `'add'` |  |
| `onClick` | `() => void` | — |  |

**Accessibility** — role `button`, keyboard operable. Icon-only buttons must have an accessible label.

**Do:** Use Primary for main actions; Use Secondary for alternative actions; Use Destructive only for destructive flows.
**Don't:** Do not create separate component files per intent; Do not use deprecated alias names.

**Deprecated aliases** (do not use): `Primary button`, `Secondary button`, `Outline button`, `Text button`, `Success button`, `Warning button`


### Text Input

Collect single-line text input. — category: `input-controls`.

```tsx
import { TextInput } from '@inspera/kit'

<TextInput
  label="Email address"
  placeholder="jane@inspera.com"
  size="Medium"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Label'` | Show the field label. Values: true \| false. |
| `placeholder` | `string` | `'Placeholder text'` |  |
| `value` | `string` | — |  |
| `state` | `'Default' \| 'Hover' \| 'Focused' \| 'Disabled' \| 'Error' \| 'Filled' \| 'ReadOnly'` | `'Default'` | Forces a visual state for documentation. Omit for real interactivity. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Control height. Values: Small \| Medium. |
| `leadingIcon` | `string` | — | Show a leading icon. Values: true \| false. |
| `trailingIcon` | `string` | — | Show a trailing icon. Values: true \| false. |
| `showLabel` | `boolean` | `true` |  |
| `helpText` | `string` | — | Show helper text. Values: true \| false. |
| `errorText` | `string` | — | Show error message. Values: true \| false. |
| `onChange` | `(value: string) => void` | — |  |

**Accessibility** — role `textbox`, keyboard operable. Always associate label with input using htmlFor/id; Error text must be linked via aria-describedby; Required fields must use aria-required.

**Do:** Always include a visible label; Provide clear placeholder text as a hint; Show error messages below the input.
**Don't:** Do not use placeholder as the only label; Do not disable inputs without explanation.

**Deprecated aliases** (do not use): `Text inputs`, `Content`, `Content (small)`


### Checkbox

Allow multiple selection. — category: `input-controls`.

```tsx
import { Checkbox } from '@inspera/kit'

<Checkbox
  label="Send me product updates"
  checked={false}
  size="Medium"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Checkbox label'` |  |
| `checked` | `boolean` | — | Checked state. Values: true \| false. |
| `state` | `'Default' \| 'Hover' \| 'Focused' \| 'Pressed' \| 'Disabled' \| 'Error'` | `'Default'` | Forces a visual state for documentation. Omit for real interactivity. |
| `withLabel` | `boolean` | `true` | Render the label. Values: true \| false. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Indicator size. Values: Small \| Medium. |
| `onChange` | `(checked: boolean) => void` | — |  |

**Accessibility** — role `checkbox`, keyboard operable. Use aria-checked to reflect state; Group related checkboxes with fieldset and legend.

**Do:** Use for multi-select scenarios; Always provide a label for each checkbox; Group related options together.
**Don't:** Do not use for mutually exclusive options — use Radio Button instead; Do not use without a label.

**Deprecated aliases** (do not use): `Checkbox/Unchecked`, `Checkbox/Checked`, `Checkbox with label`, `Checkbox (fill width)`, `Checkbox (Cards)`


### Radio Button

Allow single selection. — category: `input-controls`.

```tsx
import { RadioButton } from '@inspera/kit'

<RadioButton
  label="Standard delivery"
  name="delivery"
  selected={false}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Radio option'` |  |
| `selected` | `boolean` | — | Selected state. Values: true \| false. |
| `name` | `string` | `'radio'` |  |
| `state` | `'Default' \| 'Hover' \| 'Focused' \| 'Pressed' \| 'Disabled' \| 'Error'` | `'Default'` | Forces a visual state for documentation. Omit for real interactivity. |
| `withLabel` | `boolean` | `true` | Render the label. Values: true \| false. |
| `onChange` | `(selected: boolean) => void` | — |  |

**Accessibility** — role `radio`, keyboard operable. Use role="radiogroup" for the group container; Use aria-checked to indicate selected state; Arrow keys navigate between options in the group.

**Do:** Use for mutually exclusive options; Always group inside a radiogroup; Pre-select a default when appropriate.
**Don't:** Do not use for multi-select — use Checkbox instead; Do not use a single radio button alone.

**Deprecated aliases** (do not use): `Radiobutton`, `Radiobuttons`, `Radio Button New-BonW`, `Radio Button New-BonY`, `Radio Button New-WonB`, `Radio Button New-YonB`


### Select

Select one option from a list. — category: `input-controls`.

```tsx
import { Select } from '@inspera/kit'

<Select
  label="Country"
  widthMode="Fixed"
  search={false}
  options={['Norway', 'Sweden', 'Denmark']}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Country'` | Render the label. Values: true \| false. |
| `placeholder` | `string` | `'Select an option'` |  |
| `options` | `string[]` | `defaultOptions` |  |
| `value` | `string` | — |  |
| `state` | `'Default' \| 'Hover' \| 'Focused' \| 'Disabled' \| 'Error' \| 'Open'` | `'Default'` | Forces a visual state for documentation. Omit for real interactivity. |
| `widthMode` | `'Fixed' \| 'Content Adaptable'` | `'Fixed'` | Trigger sizing. Values: Fixed \| Content Adaptable. |
| `showLabel` | `boolean` | `true` |  |
| `search` | `boolean` | `false` | Filterable option list. Values: true \| false. |
| `onChange` | `(value: string) => void` | — |  |

**Accessibility** — role `combobox`, keyboard operable. Use aria-expanded to indicate open state; Use aria-activedescendant for highlighted option; Support arrow key navigation through options.

**Do:** Use for 5+ options where space is limited; Always provide a label; Show a clear placeholder when no option is selected.
**Don't:** Do not use for fewer than 3 options — use Radio Button instead; Do not nest selects inside other selects.

**Deprecated aliases** (do not use): `Select / Fixed width`, `Select / Content adaptable`, `Dropdown`, `Dropdown with Label`


### Toggle

Switch a setting on or off instantly. — category: `input-controls`.

```tsx
import { Toggle } from '@inspera/kit'

<Toggle
  label="Enable notifications"
  checked={false}
  size="Medium"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Toggle setting'` |  |
| `checked` | `boolean` | — | On / off state. Values: true \| false. |
| `state` | `'Default' \| 'Hover' \| 'Focused' \| 'Disabled'` | `'Default'` | Forces a visual state for documentation. Omit for real interactivity. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Track / thumb size. Values: Small \| Medium. |
| `withLabel` | `boolean` | `true` | Render the label. Values: true \| false. |
| `onChange` | `(checked: boolean) => void` | — |  |

**Accessibility** — role `switch`, keyboard operable. Use role="switch" for the toggle; Use aria-checked to reflect on/off state; Space key toggles the switch.

**Do:** Use for immediate on/off settings; Provide a clear label describing the setting; Show the current state visually.
**Don't:** Do not use for form submissions — use Checkbox instead; Do not use without a visible label.

**Deprecated aliases** (do not use): `Switch`, `Toggle switch`


### Textarea

Collect multi-line text input. — category: `input-controls`.

```tsx
import { Textarea } from '@inspera/kit'

<Textarea
  label="Feedback"
  placeholder="Share your thoughts…"
  size="Medium"
  showCount={false}
  maxLength={280}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Description'` |  |
| `placeholder` | `string` | `'Placeholder text'` |  |
| `value` | `string` | — |  |
| `rows` | `number` | `4` | Visible text rows. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Vertical padding density. Values: Small \| Medium. |
| `state` | `'Default' \| 'Hover' \| 'Focused' \| 'Filled' \| 'Error' \| 'Disabled' \| 'ReadOnly'` | `'Default'` | Forces a visual state for documentation. Omit for real interactivity. |
| `showLabel` | `boolean` | `true` | Show the field label. Values: true \| false. |
| `helpText` | `string` | — |  |
| `errorText` | `string` | — |  |
| `maxLength` | `number` | — | Maximum character length. |
| `showCount` | `boolean` | `false` | Show character counter. Values: true \| false. |
| `onChange` | `(value: string) => void` | — |  |

**Accessibility** — role `textbox`, keyboard operable. Always associate label with textarea using htmlFor/id; Error text must be linked via aria-describedby; aria-invalid reflects the error state.

**Do:** Always include a visible label; Use rows to hint expected length; Show a character counter when a max length applies.
**Don't:** Do not use for single-line input — use Text Input instead; Do not disable resize without reason.

**Deprecated aliases** (do not use): `Text area`, `Multiline input`, `Comment box`


### Form Field

Standardize label, control, and help/error layout around any input. — category: `input-controls`.

```tsx
import { FormField } from '@inspera/kit'

<FormField
  label="Email address"
  htmlFor="email"
  required={false}
  helpText="We'll never share your email."
>
  <TextInput id="email" showLabel={false} />
</FormField>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Field label text. |
| `htmlFor` | `string` | — | id of the wrapped control for label association. |
| `required` | `boolean` | `false` | Show a required asterisk. Values: true \| false. |
| `helpText` | `string` | — | Helper text shown below the control. |
| `errorText` | `string` | — | Error message; replaces help text when present. |
| `children` **(required)** | `ReactNode` | — |  |

**Accessibility** — role `group`, keyboard operable. Associate the label with the control via htmlFor/id; Link error and help text with aria-describedby on the control; Required fields should set aria-required on the control.

**Do:** Wrap any single control for consistent spacing; Use htmlFor to link the label to the control; Show only one of help or error at a time.
**Don't:** Do not wrap multiple unrelated controls; Do not omit the label for accessibility.

**Deprecated aliases** (do not use): `Field wrapper`, `Input group`


### Slider

Select a numeric value from a continuous range. — category: `input-controls`.

```tsx
import { Slider } from '@inspera/kit'

<Slider
  label="Volume"
  min={0}
  max={100}
  value={40}
  showValue={true}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Value'` |  |
| `min` | `number` | `0` | Minimum value. |
| `max` | `number` | `100` | Maximum value. |
| `value` | `number` | — |  |
| `step` | `number` | `1` | Increment granularity. |
| `state` | `'Default' \| 'Focused' \| 'Disabled'` | `'Default'` | Forces a visual state for documentation. Omit for real interactivity. |
| `showValue` | `boolean` | `true` | Show the current value. Values: true \| false. |
| `showLabel` | `boolean` | `true` | Show the field label. Values: true \| false. |
| `onChange` | `(value: number) => void` | — |  |

**Accessibility** — role `slider`, keyboard operable. Use role="slider" with aria-valuemin / aria-valuemax / aria-valuenow; Provide an accessible label via aria-label; Arrow keys adjust the value.

**Do:** Use for adjustable numeric ranges; Show the current value for precision; Provide a clear label.
**Don't:** Do not use for exact numeric entry — use Text Input instead; Do not use without min/max bounds.

**Deprecated aliases** (do not use): `Range`, `Range slider`


### Segmented Control

Choose one option from a small set of mutually exclusive segments. — category: `input-controls`.

```tsx
import { SegmentedControl } from '@inspera/kit'

<SegmentedControl
  items={['Day', 'Week', 'Month']}
  value={1}
  size="Medium"
  fullWidth={false}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `string[]` | `['Day', 'Week', 'Month']` | Segment labels. |
| `value` | `number` | — | Active segment index. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Segment height. Values: Small \| Medium. |
| `fullWidth` | `boolean` | `false` | Stretch to fill the row. Values: true \| false. |
| `onChange` | `(index: number) => void` | — |  |

**Accessibility** — role `radiogroup`, keyboard operable. Container uses role="radiogroup"; Each segment uses role="radio" with aria-checked; Arrow keys move between segments.

**Do:** Use for 2–4 mutually exclusive views; Keep labels short and parallel; Show the active segment clearly.
**Don't:** Do not use for more than 4 options — use Tabs or Select; Do not use for multi-select.

**Deprecated aliases** (do not use): `Segment control`, `Toggle group`, `Button group`


### Date Picker

Select a calendar date from a popover. — category: `input-controls`.

```tsx
import { DatePicker } from '@inspera/kit'

<DatePicker
  label="Due date"
  value="2026-08-19"
  onChange={setDate}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Date'` |  |
| `value` | `string` | — | Selected date (YYYY-MM-DD). |
| `placeholder` | `string` | `'Select date'` | Trigger placeholder. |
| `state` | `'Default' \| 'Focused' \| 'Disabled' \| 'Error'` | `'Default'` | Forces a visual state for documentation. Omit for real interactivity. |
| `showLabel` | `boolean` | `true` | Show the field label. Values: true \| false. |
| `defaultOpen` | `boolean` | `false` | Open the calendar initially. Values: true \| false. |
| `onChange` | `(iso: string) => void` | — |  |

**Accessibility** — role `dialog`, keyboard operable. Trigger uses aria-haspopup="dialog" and aria-expanded; Popover uses role="dialog" with a label; Day cells are buttons with descriptive aria-labels; Escape closes the popover.

**Do:** Use for selecting a single calendar date; Highlight today and the selected day; Provide clear month navigation.
**Don't:** Do not use for free-form date typing without validation; Do not trap keyboard focus without an escape.

**Deprecated aliases** (do not use): `Calendar input`, `Date field`


### File Upload

Upload files via drag-and-drop or browse. — category: `input-controls`.

```tsx
import { FileUpload } from '@inspera/kit'

<FileUpload
  label="Attachments"
  accept="image/*,.pdf"
  multiple={false}
  onFiles={handleFiles}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Upload files'` |  |
| `accept` | `string` | — | Accepted MIME types / extensions. |
| `multiple` | `boolean` | `false` | Allow multiple files. Values: true \| false. |
| `state` | `'Default' \| 'Dragging' \| 'Disabled' \| 'Error'` | `'Default'` | Forces a visual state for documentation. Omit for real interactivity. |
| `helpText` | `string` | `'PNG, JPG or PDF up to 10MB'` | Constraint hint text. |
| `onFiles` | `(files: File[]) => void` | — |  |

**Accessibility** — role `button`, keyboard operable. Dropzone uses role="button" and is keyboard focusable; Enter / Space open the file browser; Provide an accessible label describing the action.

**Do:** Support both drag-and-drop and click-to-browse; State accepted file types and size limits; Give visible drag feedback.
**Don't:** Do not hide the browse affordance; Do not omit constraint help text.

**Deprecated aliases** (do not use): `Dropzone`, `File dropzone`, `Uploader`


### Radio Group

Group mutually exclusive radio options. — category: `input-controls`.

```tsx
import { RadioGroup } from '@inspera/kit'

<RadioGroup
  label="Delivery speed"
  name="delivery"
  value="standard"
  orientation="Vertical"
  options={[{ label: 'Standard', value: 'standard' }]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — |  |
| `name` | `string` | — | Shared input name for the group. |
| `options` | `RadioOption[]` | `DEFAULT_OPTIONS` | Radio options. |
| `value` | `string` | — | Selected option value. |
| `orientation` | `'Vertical' \| 'Horizontal'` | `'Vertical'` | Layout direction. Values: Vertical \| Horizontal. |
| `state` | `'Default' \| 'Disabled' \| 'Error'` | `'Default'` | Forces a visual state for documentation. Omit for real interactivity. |
| `onChange` | `(value: string) => void` | — |  |

```ts
export interface RadioOption {
  label: string
  value: string
}
```

**Accessibility** — role `radiogroup`, keyboard operable. Container uses role="radiogroup" with an accessible label; Each option is a radio with aria-checked; Arrow keys navigate between options.

**Do:** Use for single selection among 2–6 options; Provide a group label; Pre-select a sensible default.
**Don't:** Do not use for multi-select — use Checkbox Group; Do not use a single radio alone.

**Deprecated aliases** (do not use): `Radio list`, `Option group`


### Checkbox Group

Group related multi-select checkboxes. — category: `input-controls`.

```tsx
import { CheckboxGroup } from '@inspera/kit'

<CheckboxGroup
  label="Notifications"
  value={['email']}
  orientation="Vertical"
  options={[{ label: 'Email', value: 'email' }]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — |  |
| `options` | `CheckboxOption[]` | `DEFAULT_OPTIONS` | Checkbox options. |
| `value` | `string[]` | — | Selected option values. |
| `orientation` | `'Vertical' \| 'Horizontal'` | `'Vertical'` | Layout direction. Values: Vertical \| Horizontal. |
| `state` | `'Default' \| 'Disabled' \| 'Error'` | `'Default'` | Forces a visual state for documentation. Omit for real interactivity. |
| `onChange` | `(value: string[]) => void` | — |  |

```ts
export interface CheckboxOption {
  label: string
  value: string
}
```

**Accessibility** — role `group`, keyboard operable. Container uses role="group" with aria-labelledby; Each option is a checkbox with aria-checked; Group related options under a shared legend/label.

**Do:** Use for selecting multiple related options; Provide a group label; Keep options parallel and concise.
**Don't:** Do not use for mutually exclusive options — use Radio Group; Do not omit the group label.

**Deprecated aliases** (do not use): `Checkbox list`, `Multi-select group`


### Rating

Capture or display a star rating. — category: `input-controls`.

```tsx
import { Rating } from '@inspera/kit'

<Rating
  value={3}
  max={5}
  size="Medium"
  readOnly={false}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | `0` | Current rating. |
| `max` | `number` | `5` | Number of stars. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Star size. Values: Small \| Medium. |
| `readOnly` | `boolean` | `false` | Display-only mode. Values: true \| false. |
| `showValue` | `boolean` | `false` | Show numeric value. Values: true \| false. |
| `onChange` | `(value: number) => void` | — |  |

**Accessibility** — role `radiogroup`, keyboard operable. Container uses role="radiogroup" with an accessible label; Each star is a radio with aria-checked and an aria-label; Arrow keys adjust the rating.

**Do:** Use for feedback and review scores; Show hover preview when interactive; Use read-only mode to display aggregate scores.
**Don't:** Do not use for precise numeric input; Do not omit accessible labels on stars.

**Deprecated aliases** (do not use): `Star rating`, `Stars`


### OTP Input

Enter a one-time verification code. — category: `input-controls`.

```tsx
import { OtpInput } from '@inspera/kit'

<OtpInput
  length={6}
  value={code}
  onChange={setCode}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `length` | `number` | `6` | Number of digit boxes. |
| `value` | `string` | — | Current code value. |
| `state` | `'Default' \| 'Focused' \| 'Error' \| 'Disabled'` | `'Default'` | Forces a visual state for documentation. Omit for real interactivity. |
| `onChange` | `(value: string) => void` | — |  |

**Accessibility** — role `textbox`, keyboard operable. Each box has an aria-label "Digit N"; aria-invalid reflects the error state; Backspace moves focus to the previous box; paste distributes digits.

**Do:** Auto-advance focus as digits are entered; Support paste of the full code; Use a monospace font for even alignment.
**Don't:** Do not require manual box-by-box focus; Do not allow non-numeric characters.

**Deprecated aliases** (do not use): `PIN input`, `Verification code`, `Code input`


## data-display

### Card

Group related content in a contained surface. — category: `data-display`.

```tsx
import { Card } from '@inspera/kit'

<Card
  title="Algebra Quiz"
  elevation="Raised"
  padding="Default"
  interactive={false}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `'Card title'` |  |
| `body` | `string` | `'Group related content in a contained surface using consistent padding and elevation.'` |  |
| `elevation` | `'Flat' \| 'Raised' \| 'Outlined'` | `'Raised'` | Surface treatment. Values: Flat \| Raised \| Outlined. |
| `padding` | `'Compact' \| 'Default' \| 'Spacious'` | `'Default'` | Internal padding (12 / 16 / 24). Values: Compact \| Default \| Spacious. |
| `interactive` | `boolean` | `false` | Renders as a focusable button with hover elevation. Values: true \| false. |
| `children` | `ReactNode` | — |  |
| `onClick` | `() => void` | — |  |

**Accessibility** — role `article`, keyboard operable. Interactive cards should use role="button" or be wrapped in an anchor; Non-interactive cards use role="article" or a semantic section.

**Do:** Use to group related content; Maintain consistent padding within a view; Use raised elevation for primary content cards.
**Don't:** Do not nest cards inside other cards; Do not use cards for layout-only purposes without content.


### Badge

Display a short status label or count. — category: `data-display`.

```tsx
import { Badge } from '@inspera/kit'

<Badge
  label="Neutral"
  intent="Neutral"
  size="Medium"
  withIcon={false}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Badge'` |  |
| `intent` | `'Neutral' \| 'Info' \| 'Success' \| 'Warning' \| 'Error'` | `'Neutral'` | Semantic color. Values: Neutral \| Info \| Success \| Warning \| Error. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Height 20 / 24. Values: Small \| Medium. |
| `withIcon` | `boolean` | `false` | Show a leading status icon. Values: true \| false. |
| `icon` | `string` | — |  |

**Accessibility** — role `status`. Use aria-label for icon-only badges; Use role="status" for dynamic count badges.

**Do:** Use for status indicators and counts; Keep labels short — 1 to 2 words; Use intent colors consistently.
**Don't:** Do not use for long text content; Do not make badges interactive without clear affordance.

**Deprecated aliases** (do not use): `Status Badge`, `Tag`, `Chip`


### Avatar

Represent a user or entity with an image or initials. — category: `data-display`.

```tsx
import { Avatar } from '@inspera/kit'

<Avatar
  size="Medium"
  content="Initials"
  status="None"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Medium'` | Diameter 32 / 40 / 56. Values: Small \| Medium \| Large. |
| `content` | `'Image' \| 'Initials' \| 'Icon'` | `'Initials'` | What fills the avatar. Values: Image \| Initials \| Icon. |
| `status` | `'None' \| 'Online' \| 'Offline' \| 'Busy'` | `'None'` | Presence indicator dot. Values: None \| Online \| Offline \| Busy. |
| `initials` | `string` | `'JC'` |  |
| `imageSrc` | `string` | `'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=112&h=112&fit=crop&auto=format'` |  |
| `alt` | `string` | `'User avatar'` |  |
| `icon` | `string` | `'person'` |  |

**Accessibility** — role `img`. Provide alt text for image avatars; Use aria-label for initials and icon variants.

**Do:** Use for user profiles and participant lists; Provide meaningful alt text; Use consistent sizing within a context.
**Don't:** Do not stretch or distort avatar images; Do not use random colors — use a deterministic palette.


### Table

Display structured data in rows and columns. — category: `data-display`.

```tsx
import { Table } from '@inspera/kit'

<Table
  size="Default"
  striped={false}
  columns={[{ key: 'name', header: 'Assessment' }]}
  rows={[{ name: 'Algebra Quiz' }]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `TableColumn[]` | `defaultColumns` | Column definitions. |
| `rows` | `Record<string, ReactNode>[]` | `defaultRows` | Row data keyed by column. |
| `size` | `'Compact' \| 'Default'` | `'Default'` | Row height density. Values: Compact \| Default. |
| `striped` | `boolean` | `false` | Zebra-stripe rows. Values: true \| false. |
| `hoverable` | `boolean` | `true` | Highlight rows on hover. Values: true \| false. |
| `selectable` | `boolean` | `false` | Add a row selection column. Values: true \| false. |
| `caption` | `string` | — |  |
| `onRowClick` | `(row: Record<string, ReactNode>, index: number) => void` | — |  |

```ts
export interface TableColumn {
  key: string
  header: string
  align?: 'left' | 'right' | 'center'
  width?: string | number
}
```

**Accessibility** — role `table`, keyboard operable. Use semantic table / thead / tbody markup; Header cells use scope="col"; Provide a caption or aria-label describing the table.

**Do:** Use for comparable, structured records; Right-align numeric columns; Keep headers concise.
**Don't:** Do not use tables for page layout; Do not overload rows with unrelated actions.

**Deprecated aliases** (do not use): `Data table`, `Grid`, `Datagrid`


### Accordion

Show and hide sections of related content. — category: `data-display`.

```tsx
import { Accordion } from '@inspera/kit'

<Accordion
  type="Single"
  iconPosition="Right"
  items={[{ title: 'What is Inspera?', content: '…' }]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `AccordionItem[]` | `defaultItems` | Accordion sections. |
| `type` | `'Single' \| 'Multiple'` | `'Single'` | Allow one or many open at once. Values: Single \| Multiple. |
| `defaultOpenIndex` | `number` | `0` | Initially open section. |
| `iconPosition` | `'Left' \| 'Right'` | `'Right'` | Chevron placement. Values: Left \| Right. |

```ts
export interface AccordionItem {
  title: string
  content: ReactNode
}
```

**Accessibility** — role `region`, keyboard operable. Header is a button with aria-expanded and aria-controls; Panel uses role="region" linked via aria-labelledby; Enter / Space toggle the section.

**Do:** Use to progressively disclose content; Keep section titles scannable; Use Single mode when only one section is relevant at a time.
**Don't:** Do not nest accordions deeply; Do not hide critical content behind collapsed sections.

**Deprecated aliases** (do not use): `Disclosure`, `Collapse`, `Expander`


### Tag

Label, categorize, or filter with a removable chip. — category: `data-display`.

```tsx
import { Tag } from '@inspera/kit'

<Tag
  label="Neutral"
  intent="Neutral"
  size="Medium"
  removable={false}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | — | Tag text. |
| `intent` | `'Neutral' \| 'Info' \| 'Success' \| 'Warning' \| 'Error'` | `'Neutral'` | Semantic color. Values: Neutral \| Info \| Success \| Warning \| Error. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Tag height. Values: Small \| Medium. |
| `removable` | `boolean` | `false` | Show a remove affordance. Values: true \| false. |
| `leadingIcon` | `string` | — | Optional leading icon. |
| `onRemove` | `() => void` | — |  |
| `onClick` | `() => void` | — |  |

**Accessibility** — role `status`, keyboard operable. Removable tags expose a button with aria-label "Remove {label}"; Interactive tags must be keyboard focusable; Use aria-label for icon-only tags.

**Do:** Use for filters, categories, and selections; Keep labels to 1–2 words; Provide a remove control when tags are dismissible.
**Don't:** Do not use for status that never changes — use Badge; Do not pack long text into a tag.

**Deprecated aliases** (do not use): `Chip`, `Pill`, `Label`


### Divider

Separate content with a thin rule. — category: `data-display`.

```tsx
import { Divider } from '@inspera/kit'

<Divider
  orientation="Horizontal"
  spacing="Default"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'Horizontal' \| 'Vertical'` | `'Horizontal'` | Divider direction. Values: Horizontal \| Vertical. |
| `label` | `string` | — | Optional centered label (horizontal only). |
| `spacing` | `'Compact' \| 'Default' \| 'Spacious'` | `'Default'` | Surrounding margin. Values: Compact \| Default \| Spacious. |

**Accessibility** — role `separator`. Use role="separator" with aria-orientation; Purely decorative dividers may be aria-hidden.

**Do:** Use to group and separate related content; Use a labeled divider to introduce a section; Keep dividers hairline-thin.
**Don't:** Do not overuse dividers where whitespace suffices; Do not use heavy rules.

**Deprecated aliases** (do not use): `Separator`, `Rule`, `HR`


### Empty State

Communicate the absence of content and offer a next step. — category: `data-display`.

```tsx
import { EmptyState } from '@inspera/kit'

<EmptyState
  icon="inbox"
  title="No assessments yet"
  description="Create your first assessment."
  actionLabel="New assessment"
  size="Medium"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | `string` | `'inbox'` | Material Symbols icon name. |
| `title` | `string` | `'No results found'` | Primary message. |
| `description` | `string` | `'Try adjusting your filters or search terms.'` | Supporting explanation. |
| `actionLabel` | `string` | — | Optional primary action label. |
| `onAction` | `() => void` | — |  |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Overall scale. Values: Small \| Medium. |

**Accessibility** — role `status`, keyboard operable. Announce dynamically-appearing empty states with role="status"; The action must be a real focusable button; The illustration/icon is decorative (aria-hidden).

**Do:** Explain why the area is empty; Offer a clear next action when possible; Keep the tone helpful.
**Don't:** Do not leave empty areas blank with no guidance; Do not use for transient loading — use Skeleton.

**Deprecated aliases** (do not use): `Blank slate`, `Zero state`, `No data`


### Avatar Group

Show a set of users as overlapping avatars with an overflow count. — category: `data-display`.

```tsx
import { AvatarGroup } from '@inspera/kit'

<AvatarGroup
  size="Medium"
  max={4}
  avatars={[{ name: 'Ada Lovelace' }, { name: 'Linus Torvalds' }]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `avatars` | `AvatarGroupItem[]` | `defaultAvatars` | Avatars to display. |
| `max` | `number` | `4` | Maximum shown before overflow. |
| `size` | `AvatarSize` | `'Medium'` | Avatar diameter. Values: Small \| Medium \| Large. |

```ts
export interface AvatarGroupItem {
  content?: AvatarContent
  name?: string
}
```

**Accessibility** — role `group`. Wrap in a group with an aria-label describing the set; Each avatar keeps its own accessible label; The overflow chip states the hidden count.

**Do:** Use for participant and collaborator lists; Cap visible avatars and show a +N overflow; Keep sizing consistent within a context.
**Don't:** Do not show dozens of avatars inline; Do not omit the overflow count.

**Deprecated aliases** (do not use): `Avatar stack`, `Facepile`


### Stat

Highlight a key metric with an optional trend. — category: `data-display`.

```tsx
import { Stat } from '@inspera/kit'

<Stat
  label="Active candidates"
  value="12,480"
  delta="+8.2% vs last week"
  deltaIntent="up"
  icon="group"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | `'Average score'` | Metric name. |
| `value` **(required)** | `string \| number` | `'84%'` | Metric value. Values: string \| number. |
| `delta` | `string` | `'+4.2%'` | Change indicator text. |
| `deltaIntent` | `'up' \| 'down' \| 'neutral'` | `'up'` | Trend direction / color. Values: up \| down \| neutral. |
| `icon` | `string` | — | Optional leading icon. |
| `helpText` | `string` | — |  |

**Accessibility** — role `group`. Associate the value with its label for screen readers; Convey trend with text, not color alone; Use aria-label to summarize the metric and change.

**Do:** Use for dashboard summaries; Pair a value with a clear label; Indicate trend direction with an icon and text.
**Don't:** Do not rely on color alone for the delta; Do not crowd many stats without spacing.

**Deprecated aliases** (do not use): `Metric`, `KPI`, `Stat card`


### List

Present a vertical series of related items. — category: `data-display`.

```tsx
import { List } from '@inspera/kit'

<List
  size="Default"
  divided={true}
  interactive={false}
  items={[{ primary: 'General settings', secondary: '…', leading: 'settings' }]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `ListItem[]` | `defaultItems` | List rows. |
| `divided` | `boolean` | `true` | Show dividers between rows. Values: true \| false. |
| `interactive` | `boolean` | `false` | Make rows clickable. Values: true \| false. |
| `size` | `'Compact' \| 'Default'` | `'Default'` | Row density. Values: Compact \| Default. |
| `onItemClick` | `(item: ListItem, index: number) => void` | — |  |

```ts
export interface ListItem {
  primary: string
  secondary?: string
  leading?: ReactNode
  trailing?: ReactNode
}
```

**Accessibility** — role `list`, keyboard operable. Use semantic list markup (ul / li); Interactive rows are buttons and keyboard focusable; Provide meaningful text for each item.

**Do:** Use for settings, results, and simple records; Keep primary text scannable; Use secondary text for supporting detail.
**Don't:** Do not use for comparable tabular data — use Table; Do not make only part of a row clickable.

**Deprecated aliases** (do not use): `List view`, `Item list`


## feedback

### Alert

Display semantic inline feedback. — category: `feedback`.

```tsx
import { Alert } from '@inspera/kit'

<Alert
  intent="Info"
  title="Heads up"
  message="…"
  layout="Simple"
  background={true}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `'Heads up'` |  |
| `message` | `string` | `'This is a contextual inline message that matches the intent severity.'` |  |
| `intent` | `'Info' \| 'Success' \| 'Warning' \| 'Error'` | `'Info'` | Severity / color. Values: Info \| Success \| Warning \| Error. |
| `layout` | `'Simple' \| 'With CTA' \| 'With Close' \| 'With CTA + Close'` | `'Simple'` | Action affordances. Values: Simple \| With CTA \| With Close \| With CTA + Close. |
| `background` | `boolean` | `true` | Tinted fill vs. left-accent only. Values: true \| false. |
| `ctaLabel` | `string` | `'View details'` |  |
| `onCta` | `() => void` | — |  |
| `onClose` | `() => void` | — |  |

**Accessibility** — role `alert`, keyboard operable. Use role="alert" for important messages; Use aria-live="polite" for non-critical alerts; Close button must have aria-label="Close alert".

**Do:** Use for contextual inline messages; Match intent to message severity; Keep alert text concise.
**Don't:** Do not stack more than 2 alerts in the same area; Do not use alerts for permanent content.


### Dialog

Present content or actions that require user attention. — category: `feedback`.

```tsx
import { Dialog } from '@inspera/kit'

<Dialog
  open={open}
  size="Medium"
  title="Dialog title"
  hasCloseButton={true}
  hasActions={true}
  onClose={() => setOpen(false)}
  onConfirm={handleConfirm}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `'Dialog title'` |  |
| `body` | `ReactNode` | `'This is the dialog body. Provide context or a clear description of the action the user is about to take.'` |  |
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Medium'` | Panel width 400 / 480 / 560. Values: Small \| Medium \| Large. |
| `hasCloseButton` | `boolean` | `true` | Show the header close affordance. Values: true \| false. |
| `hasActions` | `boolean` | `true` | Show the footer action buttons. Values: true \| false. |
| `confirmLabel` | `string` | `'Continue'` |  |
| `cancelLabel` | `string` | `'Cancel'` |  |
| `open` | `boolean` | `true` |  |
| `embedded` | `boolean` | `false` | Render just the panel (no overlay) — used for documentation previews. |
| `onClose` | `() => void` | — |  |
| `onConfirm` | `() => void` | — |  |

**Accessibility** — role `dialog`, keyboard operable. Use role="dialog" with aria-modal="true"; Set aria-labelledby to the dialog title; Trap focus inside the dialog when open; Return focus to trigger element on close; Escape key closes the dialog.

**Do:** Use for confirmations and critical decisions; Always provide a way to close the dialog; Keep dialog content focused and concise.
**Don't:** Do not open dialogs from other dialogs; Do not use for non-blocking information — use Alert instead.

**Deprecated aliases** (do not use): `Modal`, `Popup`


### Snackbar

Show brief, non-blocking feedback at the bottom of the screen. — category: `feedback`.

```tsx
import { Snackbar } from '@inspera/kit'

<Snackbar
  intent="Neutral"
  message="Assessment saved."
  hasAction={false}
  hasClose={true}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `message` | `string` | `'Assessment saved successfully.'` |  |
| `intent` | `'Neutral' \| 'Info' \| 'Success' \| 'Warning' \| 'Error'` | `'Neutral'` | Accent icon color. Values: Neutral \| Info \| Success \| Warning \| Error. |
| `hasAction` | `boolean` | `false` | Show an inline action (e.g. Undo). Values: true \| false. |
| `hasClose` | `boolean` | `true` | Show the dismiss button. Values: true \| false. |
| `actionLabel` | `string` | `'Undo'` |  |
| `onAction` | `() => void` | — |  |
| `onClose` | `() => void` | — |  |

**Accessibility** — role `status`, keyboard operable. Use role="status" with aria-live="polite"; Action button must be focusable; Auto-dismiss timing must be generous (5s minimum).

**Do:** Use for brief confirmation messages; Include an undo action when appropriate; Limit to one snackbar at a time.
**Don't:** Do not use for critical errors — use Alert or Dialog instead; Do not stack multiple snackbars.

**Deprecated aliases** (do not use): `Toast`, `Notification bar`


### Tooltip

Provide contextual help on hover or focus. — category: `feedback`.

```tsx
import { Tooltip } from '@inspera/kit'

<Tooltip
  content="Supplementary help text"
  placement="Top"
  theme="Dark"
  type="Default"
>
  <IconButton icon="help" />
</Tooltip>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | `string` | `'Supplementary help text'` |  |
| `placement` | `'Top' \| 'Bottom' \| 'Left' \| 'Right'` | `'Top'` | Position relative to the trigger. Values: Top \| Bottom \| Left \| Right. |
| `theme` | `'Light' \| 'Dark'` | `'Dark'` | Surface color. Values: Light \| Dark. |
| `type` | `'Default' \| 'Accessibility'` | `'Default'` | Accessibility type uses larger text. Values: Default \| Accessibility. |
| `children` | `ReactNode` | — |  |
| `forceVisible` | `boolean` | `false` | Keep the tooltip visible regardless of hover — used for documentation. |

**Accessibility** — role `tooltip`, keyboard operable. Use role="tooltip" on the tooltip element; Link trigger and tooltip with aria-describedby; Escape key dismisses the tooltip; Tooltip must not contain interactive content.

**Do:** Use for supplementary information; Keep tooltip text short and scannable; Position to avoid clipping viewport edges.
**Don't:** Do not put critical information only in tooltips; Do not use for interactive content — use Popover instead.

**Deprecated aliases** (do not use): `Tooltips`, `Walkthrough`, `a11y tooltips`


### Progress

Show completion of an ongoing task. — category: `feedback`.

```tsx
import { Progress } from '@inspera/kit'

<Progress
  variant="Linear"
  value={60}
  intent="Primary"
  size="Medium"
  indeterminate={false}
  showValue={false}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'Linear' \| 'Circular'` | `'Linear'` | Bar or ring. Values: Linear \| Circular. |
| `value` | `number` | `60` | Completion percentage 0–100. Ignored when indeterminate. |
| `indeterminate` | `boolean` | `false` | Unknown-duration animation. Values: true \| false. |
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Medium'` | Bar height / ring diameter. Values: Small \| Medium \| Large. |
| `intent` | `'Primary' \| 'Success' \| 'Warning' \| 'Error'` | `'Primary'` | Fill color. Values: Primary \| Success \| Warning \| Error. |
| `showValue` | `boolean` | `false` | Render the percentage. Values: true \| false. |

**Accessibility** — role `progressbar`. Use role="progressbar" with aria-valuenow / min / max; Omit aria-valuenow when indeterminate; Provide an accessible label for the task.

**Do:** Use determinate progress when completion is known; Use indeterminate for unknown-duration waits; Match intent color to context.
**Don't:** Do not use for very short operations; Do not fake progress values.

**Deprecated aliases** (do not use): `Progress bar`, `Loading bar`, `Meter`


### Spinner

Indicate an indeterminate loading state. — category: `feedback`.

```tsx
import { Spinner } from '@inspera/kit'

<Spinner
  size="Medium"
  intent="Primary"
  label="Loading assessments"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Medium'` | Diameter 16 / 24 / 40. Values: Small \| Medium \| Large. |
| `intent` | `'Primary' \| 'Neutral' \| 'Inverse'` | `'Primary'` | Arc color. Values: Primary \| Neutral \| Inverse. |
| `label` | `string` | `'Loading'` | Accessible label. |

**Accessibility** — role `status`. Use role="status" with aria-live="polite"; Provide an accessible label via aria-label; Include visually-hidden loading text.

**Do:** Use for short, indeterminate waits; Use Inverse on dark surfaces; Pair with context describing what is loading.
**Don't:** Do not use where determinate Progress is possible; Do not show multiple competing spinners.

**Deprecated aliases** (do not use): `Loader`, `Loading indicator`, `Activity indicator`


### Skeleton

Show placeholder shapes while content loads. — category: `feedback`.

```tsx
import { Skeleton } from '@inspera/kit'

<Skeleton
  variant="Text"
  lines={3}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'Text' \| 'Rect' \| 'Circle'` | `'Text'` | Placeholder shape. Values: Text \| Rect \| Circle. |
| `width` | `string \| number` | — | Explicit width. Values: string \| number. |
| `height` | `string \| number` | — | Explicit height. Values: string \| number. |
| `lines` | `number` | `1` | Number of text lines. Only applies to the Text variant. |
| `radius` | `string \| number` | — |  |

**Accessibility** — role `presentation`. Skeletons are decorative and aria-hidden; Announce the real content once loaded; Mirror the layout of the content being loaded.

**Do:** Match skeleton shapes to real content; Use for perceived performance on initial load; Replace with content as soon as it arrives.
**Don't:** Do not animate skeletons indefinitely; Do not use for user-triggered actions — use Spinner.

**Deprecated aliases** (do not use): `Placeholder`, `Shimmer`, `Ghost`


### Popover

Show interactive content anchored to a trigger. — category: `feedback`.

```tsx
import { Popover } from '@inspera/kit'

<Popover
  placement="Bottom"
  title="Filter results"
  trigger={<Button label="Filters" />}
  content={<FilterForm />}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `trigger` | `ReactNode` | — | Element that toggles the popover. |
| `title` | `string` | `'Popover title'` | Optional panel heading. |
| `content` | `ReactNode` | `'Popover content with interactive elements.'` | Popover body content. |
| `placement` | `'Top' \| 'Bottom' \| 'Left' \| 'Right'` | `'Bottom'` | Position relative to the trigger. Values: Top \| Bottom \| Left \| Right. |
| `open` | `boolean` | — |  |
| `defaultOpen` | `boolean` | `false` | Open on mount. Values: true \| false. |
| `forceVisible` | `boolean` | `false` | Keep the panel visible regardless of state — used for documentation. |
| `onOpenChange` | `(open: boolean) => void` | — |  |

**Accessibility** — role `dialog`, keyboard operable. Trigger uses aria-haspopup and aria-expanded; Panel uses role="dialog"; Escape and outside-click close the popover; May contain interactive content (unlike Tooltip).

**Do:** Use for rich, interactive overflow content; Anchor to the triggering element; Allow dismissal via Escape and outside click.
**Don't:** Do not use for simple hover hints — use Tooltip; Do not stack popovers.

**Deprecated aliases** (do not use): `Flyout`, `Overlay panel`


### Drawer

Slide a panel in from the edge of the screen. — category: `feedback`.

```tsx
import { Drawer } from '@inspera/kit'

<Drawer
  open={open}
  side="Right"
  size="Medium"
  title="Assessment details"
  hasCloseButton={true}
  onClose={() => setOpen(false)}
>
  {children}
</Drawer>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | `false` | Visibility. Values: true \| false. |
| `side` | `'Right' \| 'Left' \| 'Bottom'` | `'Right'` | Edge it slides from. Values: Right \| Left \| Bottom. |
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Medium'` | Panel width / height. Values: Small \| Medium \| Large. |
| `title` | `string` | `'Panel'` | Header title. |
| `hasCloseButton` | `boolean` | `true` | Show the close affordance. Values: true \| false. |
| `children` | `ReactNode` | — |  |
| `embedded` | `boolean` | `false` | Render just the panel inline (no overlay/scrim) — used for documentation previews. |
| `onClose` | `() => void` | — |  |

**Accessibility** — role `dialog`, keyboard operable. Use role="dialog" with aria-modal="true"; Set aria-labelledby to the drawer title; Trap focus while open and restore it on close; Escape closes the drawer.

**Do:** Use for secondary tasks and detail panels; Provide a clear close control; Return focus to the trigger on close.
**Don't:** Do not use for critical confirmations — use Dialog; Do not open multiple drawers at once.

**Deprecated aliases** (do not use): `Sheet`, `Side panel`, `Off-canvas`


## navigation

### Tabs

Organize content into switchable panels. — category: `navigation`.

```tsx
import { Tabs } from '@inspera/kit'

<Tabs
  items={[{ label: 'Overview' }, { label: 'Questions' }]}
  style="Underline"
  size="Medium"
  fullWidth={false}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `TabItem[]` | `defaultItems` |  |
| `style` | `'Underline' \| 'Contained'` | `'Underline'` | Visual treatment. Values: Underline \| Contained. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Tab height 40 / 48. Values: Small \| Medium. |
| `fullWidth` | `boolean` | `false` | Stretch tabs to fill the row. Values: true \| false. |
| `value` | `number` | — |  |
| `onChange` | `(index: number) => void` | — |  |

```ts
export interface TabItem {
  label: string
  icon?: string
}
```

**Accessibility** — role `tablist`, keyboard operable. Use role="tablist" on the tab container; Each tab uses role="tab" with aria-selected; Tab panels use role="tabpanel" linked by aria-labelledby; Arrow keys navigate between tabs.

**Do:** Use to organize related content sections; Label tabs clearly and concisely; Use a maximum of 6 tabs per set.
**Don't:** Do not use tabs for sequential steps — use a stepper instead; Do not nest tab sets inside other tab sets.

**Deprecated aliases** (do not use): `Tab bar`, `Tab navigation`


### Breadcrumb

Show the user's current location in a hierarchy. — category: `navigation`.

```tsx
import { Breadcrumb } from '@inspera/kit'

<Breadcrumb
  items={['Home', 'Assessments', 'Algebra Quiz']}
  separator="Chevron"
  size="Medium"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `string[]` | `defaultItems` |  |
| `separator` | `'Slash' \| 'Chevron'` | `'Chevron'` | Divider glyph between items. Values: Slash \| Chevron. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Text size 14 / 16. Values: Small \| Medium. |
| `onNavigate` | `(index: number) => void` | — |  |

**Accessibility** — role `navigation`, keyboard operable. Wrap in nav with aria-label="Breadcrumb"; Use an ordered list for semantic structure; Mark current page with aria-current="page".

**Do:** Use for hierarchical navigation structures; Always include the current page as the last item; Keep breadcrumb labels concise.
**Don't:** Do not use for flat navigation; Do not make the current page breadcrumb a link.

**Deprecated aliases** (do not use): `Breadcrumbs`, `Path navigation`


### Pagination

Navigate between pages of content. — category: `navigation`.

```tsx
import { Pagination } from '@inspera/kit'

<Pagination
  page={page}
  pageCount={12}
  size="Medium"
  showEdges={true}
  onChange={setPage}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | `number` | `1` | Current page (1-based). |
| `pageCount` | `number` | `10` | Total number of pages. |
| `siblingCount` | `number` | `1` | Pages shown either side of current. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Control height. Values: Small \| Medium. |
| `showEdges` | `boolean` | `true` | Show first / last controls. Values: true \| false. |
| `onChange` | `(page: number) => void` | — |  |

**Accessibility** — role `navigation`, keyboard operable. Wrap in nav with aria-label="Pagination"; Mark the current page with aria-current="page"; Disable and aria-disable prev/next at the bounds.

**Do:** Use for long, paged result sets; Show current, first, and last pages; Collapse large gaps with an ellipsis.
**Don't:** Do not use for a handful of items; Do not hide the current page indicator.

**Deprecated aliases** (do not use): `Pager`, `Page navigation`


### Menu

Present a list of actions in a dropdown. — category: `navigation`.

```tsx
import { Menu } from '@inspera/kit'

<Menu
  label="Actions"
  placement="Bottom Start"
  items={[{ label: 'Edit', icon: 'edit' }, { label: 'Delete', icon: 'delete', danger: true }]}
  onSelect={handleSelect}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Actions'` | Trigger label. |
| `items` | `MenuItem[]` | `sampleItems` | Menu items. |
| `placement` | `'Bottom Start' \| 'Bottom End'` | `'Bottom Start'` | Alignment to trigger. Values: Bottom Start \| Bottom End. |
| `open` | `boolean` | — |  |
| `defaultOpen` | `boolean` | `false` | Open on mount. Values: true \| false. |
| `forceVisible` | `boolean` | `false` | Always render the open menu, for documentation. |
| `onSelect` | `(label: string) => void` | — |  |

```ts
export interface MenuItem {
  label: string
  icon?: string
  danger?: boolean
  disabled?: boolean
  divider?: boolean
}
```

**Accessibility** — role `menu`, keyboard operable. Trigger uses aria-haspopup="menu" and aria-expanded; Items use role="menuitem"; Arrow keys move, Enter selects, Escape closes; Outside click closes the menu.

**Do:** Use for grouped actions and overflow; Separate destructive actions with a divider; Keep item labels action-oriented.
**Don't:** Do not use for selecting a value — use Select; Do not nest menus more than one level.

**Deprecated aliases** (do not use): `Dropdown menu`, `Action menu`, `Context menu`, `Overflow menu`


### Stepper

Show progress through a sequence of steps. — category: `navigation`.

```tsx
import { Stepper } from '@inspera/kit'

<Stepper
  steps={[{ label: 'Details' }, { label: 'Questions' }, { label: 'Review' }]}
  activeStep={1}
  orientation="Horizontal"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `steps` | `Step[]` | `defaultSteps` | Ordered steps. |
| `activeStep` | `number` | `1` | Zero-based index of the current step. |
| `orientation` | `'Horizontal' \| 'Vertical'` | `'Horizontal'` | Layout direction. Values: Horizontal \| Vertical. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Indicator size. Values: Small \| Medium. |

```ts
export interface Step {
  label: string
  description?: string
}
```

**Accessibility** — role `list`. Use an ordered list for step semantics; Mark the current step with aria-current="step"; Convey completion with an icon, not color alone.

**Do:** Use for multi-step flows and wizards; Show completed, current, and upcoming states; Keep step labels short.
**Don't:** Do not use for non-sequential navigation — use Tabs; Do not exceed a handful of steps.

**Deprecated aliases** (do not use): `Wizard`, `Progress steps`, `Step indicator`


### Link

Navigate to another location or resource. — category: `navigation`.

```tsx
import { Link } from '@inspera/kit'

<Link
  href="/docs"
  label="Learn more"
  intent="Default"
  underline="Hover"
  external={false}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — |  |
| `label` | `string` | `'Learn more'` |  |
| `href` | `string` | `'#'` |  |
| `intent` | `'Default' \| 'Muted'` | `'Default'` | Color emphasis. Values: Default \| Muted. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Text size. Values: Small \| Medium. |
| `underline` | `'Always' \| 'Hover' \| 'None'` | `'Hover'` | Underline behavior. Values: Always \| Hover \| None. |
| `external` | `boolean` | `false` | Open in a new tab with an icon. Values: true \| false. |
| `disabled` | `boolean` | `false` | Non-interactive state. Values: true \| false. |
| `leadingIcon` | `string` | — |  |
| `trailingIcon` | `string` | — |  |
| `onClick` | `(e: React.MouseEvent) => void` | — |  |

**Accessibility** — role `link`, keyboard operable. Use a real anchor with a valid href; External links set target="_blank" and rel="noreferrer"; Disabled links set aria-disabled and prevent navigation; Focus ring is visible on keyboard focus.

**Do:** Use for navigation, not actions; Signal external links with an icon; Keep link text descriptive.
**Don't:** Do not use links to trigger actions — use Button; Do not use "click here" as link text.

**Deprecated aliases** (do not use): `Hyperlink`, `Text link`, `Anchor`

