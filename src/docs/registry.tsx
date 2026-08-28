import { type ReactNode, useState } from 'react'
import { type DialogSize } from '../components/inspera/Dialog'
import {
  Button, TextInput, Checkbox, RadioButton, Select, Toggle,
  Card, Badge, Avatar, Alert, Dialog, Snackbar, Tooltip, Tabs, Breadcrumb,
  Textarea, FormField, Slider, SegmentedControl, DatePicker, FileUpload,
  RadioGroup, CheckboxGroup, Rating, OtpInput,
  Table, List, Accordion, Tag, AvatarGroup, Stat, Divider, EmptyState,
  Drawer, Popover, Progress, Spinner, Skeleton,
  Pagination, Menu, Stepper, Link,
} from '../components/inspera'

export interface ControlDef {
  label: string
  options: string[]
}

export interface RegistryEntry {
  /** Interactive playground controls: prop -> selectable values. */
  controls: Record<string, ControlDef>
  defaults: Record<string, string>
  /** Live render driven by the current control values. */
  render: (v: Record<string, string>) => ReactNode
  /** Static gallery showing every canonical state at once. */
  gallery: { label: string; node: ReactNode }[]
  /** Copyable JSX snippet reflecting current control values. */
  snippet: (v: Record<string, string>) => string
}

const b = (v: string) => v === 'true'

/** Full-width gallery wrapper that keeps a narrower component centred. */
const fill = { width: '100%', display: 'flex', justifyContent: 'center' } as const

/**
 * How each component's state gallery should be laid out.
 *
 * Components size to their container, so the gallery grid — not the component
 * — decides how much room each state gets. A Stepper or Table needs far more
 * than a Badge, and a single track width for all 42 either crams the wide ones
 * or strands the narrow ones in white space.
 *
 * `floating` marks a preview that renders an absolutely-positioned panel
 * (Popover, Menu, Tooltip). Those cells must not clip and must reserve height
 * for the panel, or it gets cut off at the cell edge.
 */
export interface GalleryLayout {
  minWidth?: number
  /**
   * `minHeight` reserves room for the panel. `align: 'start'` pins the trigger
   * to the top of the cell for panels that open downward — centred, the
   * trigger sits mid-cell and the panel hangs out of the bottom.
   */
  floating?: { minHeight: number; align?: 'start' | 'center' }
}

export const GALLERY_MIN_WIDTH_DEFAULT = 220

export const galleryLayout: Record<string, GalleryLayout> = {
  // Intrinsically small: many fit per row.
  button: { minWidth: 180 },
  badge: { minWidth: 160 },
  tag: { minWidth: 180 },
  avatar: { minWidth: 160 },
  'avatar-group': { minWidth: 180 },
  spinner: { minWidth: 160 },
  link: { minWidth: 200 },
  checkbox: { minWidth: 200 },
  'radio-button': { minWidth: 200 },
  toggle: { minWidth: 200 },
  rating: { minWidth: 200 },

  // Form controls and inline widgets.
  'text-input': { minWidth: 300 },
  textarea: { minWidth: 300 },
  select: { minWidth: 300 },
  slider: { minWidth: 280 },
  'date-picker': { minWidth: 300 },
  'otp-input': { minWidth: 300 },
  'form-field': { minWidth: 300 },
  'radio-group': { minWidth: 260 },
  'checkbox-group': { minWidth: 260 },
  'segmented-control': { minWidth: 300 },
  progress: { minWidth: 260 },
  skeleton: { minWidth: 300 },
  divider: { minWidth: 260 },
  stat: { minWidth: 280 },
  breadcrumb: { minWidth: 320 },
  tabs: { minWidth: 320 },
  'file-upload': { minWidth: 340 },
  pagination: { minWidth: 360 },

  // Floating panels: never clip, and reserve room below the trigger.
  tooltip: { minWidth: 300, floating: { minHeight: 150 } }, // opens either way — stay centred
  popover: { minWidth: 340, floating: { minHeight: 220, align: 'start' } },
  menu: { minWidth: 300, floating: { minHeight: 280, align: 'start' } },

  // Wide: full rows of content, or a scaled-down surface.
  card: { minWidth: 340 },
  alert: { minWidth: 380 },
  'empty-state': { minWidth: 340 },
  snackbar: { minWidth: 360 },
  list: { minWidth: 400 },
  accordion: { minWidth: 400 },
  table: { minWidth: 420 },
  stepper: { minWidth: 400 },
  dialog: { minWidth: 600 }, // one per row: 400/480/560 must render true size to differ
  drawer: { minWidth: 380 },
}


export const registry: Record<string, RegistryEntry> = {
  button: {
    controls: {
      intent: { label: 'Intent', options: ['Primary', 'Secondary', 'Outline', 'Text', 'Success', 'Warning', 'Destructive'] },
      size: { label: 'Size', options: ['Small', 'Medium', 'Large'] },
      state: { label: 'State', options: ['Default', 'Hover', 'Focused', 'Pressed', 'Disabled'] },
      content: { label: 'Content', options: ['Text', 'Icon + Text', 'Text + Icon', 'Text + Disclosure'] },
    },
    defaults: { intent: 'Primary', size: 'Medium', state: 'Default', content: 'Text' },
    render: (v) => (
      <Button
        label="Button"
        intent={v.intent as never}
        size={v.size as never}
        state={v.state as never}
        content={v.content as never}
      />
    ),
    gallery: (['Default', 'Hover', 'Focused', 'Pressed', 'Disabled'] as const).map((s) => ({
      label: s,
      node: <Button label="Button" state={s} />,
    })),
    snippet: (v) =>
      `<Button\n  label="Button"\n  intent="${v.intent}"\n  size="${v.size}"\n  content="${v.content}"\n/>`,
  },

  'text-input': {
    controls: {
      state: { label: 'State', options: ['Default', 'Hover', 'Focused', 'Filled', 'Error', 'Disabled', 'ReadOnly'] },
      size: { label: 'Size', options: ['Small', 'Medium'] },
      leadingIcon: { label: 'Leading Icon', options: ['false', 'true'] },
      trailingIcon: { label: 'Trailing Icon', options: ['false', 'true'] },
    },
    defaults: { state: 'Default', size: 'Medium', leadingIcon: 'false', trailingIcon: 'false' },
    render: (v) => (
      <TextInput
        label="Email address"
        placeholder="jane@inspera.com"
        state={v.state as never}
        size={v.size as never}
        leadingIcon={b(v.leadingIcon) ? 'mail' : undefined}
        trailingIcon={b(v.trailingIcon) ? 'close' : undefined}
        helpText="We'll never share your email."
        errorText="Enter a valid email address."
      />
    ),
    gallery: (['Default', 'Focused', 'Filled', 'Error', 'Disabled', 'ReadOnly'] as const).map((s) => ({
      label: s,
      node: <TextInput label="Email address" placeholder="jane@inspera.com" state={s} showLabel={false} />,
    })),
    snippet: (v) =>
      `<TextInput\n  label="Email address"\n  placeholder="jane@inspera.com"\n  size="${v.size}"${b(v.leadingIcon) ? '\n  leadingIcon="mail"' : ''}${b(v.trailingIcon) ? '\n  trailingIcon="close"' : ''}\n/>`,
  },

  checkbox: {
    controls: {
      state: { label: 'State', options: ['Default', 'Hover', 'Focused', 'Pressed', 'Disabled', 'Error'] },
      checked: { label: 'Checked', options: ['false', 'true'] },
      size: { label: 'Size', options: ['Small', 'Medium'] },
      withLabel: { label: 'With Label', options: ['true', 'false'] },
    },
    defaults: { state: 'Default', checked: 'false', size: 'Medium', withLabel: 'true' },
    render: (v) => (
      <Checkbox
        label="Send me product updates"
        state={v.state as never}
        checked={b(v.checked)}
        size={v.size as never}
        withLabel={b(v.withLabel)}
      />
    ),
    gallery: [
      { label: 'Unchecked', node: <Checkbox label="Option" checked={false} /> },
      { label: 'Checked', node: <Checkbox label="Option" checked /> },
      { label: 'Hover', node: <Checkbox label="Option" state="Hover" /> },
      { label: 'Focused', node: <Checkbox label="Option" state="Focused" checked /> },
      { label: 'Error', node: <Checkbox label="Option" state="Error" /> },
      { label: 'Disabled', node: <Checkbox label="Option" state="Disabled" checked /> },
    ],
    snippet: (v) =>
      `<Checkbox\n  label="Send me product updates"\n  checked={${v.checked}}\n  size="${v.size}"\n/>`,
  },

  'radio-button': {
    controls: {
      state: { label: 'State', options: ['Default', 'Hover', 'Focused', 'Pressed', 'Disabled', 'Error'] },
      selected: { label: 'Selected', options: ['false', 'true'] },
      withLabel: { label: 'With Label', options: ['true', 'false'] },
    },
    defaults: { state: 'Default', selected: 'false', withLabel: 'true' },
    render: (v) => (
      <RadioButton
        label="Standard delivery"
        state={v.state as never}
        selected={b(v.selected)}
        withLabel={b(v.withLabel)}
      />
    ),
    gallery: [
      { label: 'Unselected', node: <RadioButton label="Option" selected={false} /> },
      { label: 'Selected', node: <RadioButton label="Option" selected /> },
      { label: 'Hover', node: <RadioButton label="Option" state="Hover" /> },
      { label: 'Focused', node: <RadioButton label="Option" state="Focused" selected /> },
      { label: 'Error', node: <RadioButton label="Option" state="Error" /> },
      { label: 'Disabled', node: <RadioButton label="Option" state="Disabled" selected /> },
    ],
    snippet: (v) =>
      `<RadioButton\n  label="Standard delivery"\n  name="delivery"\n  selected={${v.selected}}\n/>`,
  },

  select: {
    controls: {
      state: { label: 'State', options: ['Default', 'Hover', 'Focused', 'Open', 'Error', 'Disabled'] },
      widthMode: { label: 'Width Mode', options: ['Fixed', 'Content Adaptable'] },
      search: { label: 'Search', options: ['false', 'true'] },
    },
    defaults: { state: 'Default', widthMode: 'Fixed', search: 'false' },
    render: (v) => (
      <Select
        label="Country"
        state={v.state as never}
        widthMode={v.widthMode as never}
        search={b(v.search)}
      />
    ),
    gallery: [
      { label: 'Default', node: <Select label="Country" showLabel={false} /> },
      { label: 'Error', node: <Select label="Country" showLabel={false} state="Error" /> },
      { label: 'Disabled', node: <Select label="Country" showLabel={false} state="Disabled" /> },
    ],
    snippet: (v) =>
      `<Select\n  label="Country"\n  widthMode="${v.widthMode}"\n  search={${v.search}}\n  options={['Norway', 'Sweden', 'Denmark']}\n/>`,
  },

  toggle: {
    controls: {
      state: { label: 'State', options: ['Default', 'Hover', 'Focused', 'Disabled'] },
      checked: { label: 'Checked', options: ['false', 'true'] },
      size: { label: 'Size', options: ['Small', 'Medium'] },
      withLabel: { label: 'With Label', options: ['true', 'false'] },
    },
    defaults: { state: 'Default', checked: 'false', size: 'Medium', withLabel: 'true' },
    render: (v) => (
      <Toggle
        label="Enable notifications"
        state={v.state as never}
        checked={b(v.checked)}
        size={v.size as never}
        withLabel={b(v.withLabel)}
      />
    ),
    gallery: [
      { label: 'Off', node: <Toggle label="Setting" checked={false} /> },
      { label: 'On', node: <Toggle label="Setting" checked /> },
      { label: 'Focused', node: <Toggle label="Setting" state="Focused" checked /> },
      { label: 'Disabled (on)', node: <Toggle label="Setting" state="Disabled" checked /> },
    ],
    snippet: (v) =>
      `<Toggle\n  label="Enable notifications"\n  checked={${v.checked}}\n  size="${v.size}"\n/>`,
  },

  card: {
    controls: {
      elevation: { label: 'Elevation', options: ['Flat', 'Raised', 'Outlined'] },
      padding: { label: 'Padding', options: ['Compact', 'Default', 'Spacious'] },
      interactive: { label: 'Interactive', options: ['false', 'true'] },
    },
    defaults: { elevation: 'Raised', padding: 'Default', interactive: 'false' },
    render: (v) => (
      <Card
        title="Algebra Quiz"
        body="24 questions · 45 minutes. Group related content in a contained surface."
        elevation={v.elevation as never}
        padding={v.padding as never}
        interactive={b(v.interactive)}
      />
    ),
    gallery: (['Flat', 'Raised', 'Outlined'] as const).map((e) => ({
      label: e,
      node: <Card title={e} body="Elevation preview." elevation={e} />,
    })),
    snippet: (v) =>
      `<Card\n  title="Algebra Quiz"\n  elevation="${v.elevation}"\n  padding="${v.padding}"\n  interactive={${v.interactive}}\n/>`,
  },

  badge: {
    controls: {
      intent: { label: 'Intent', options: ['Neutral', 'Info', 'Success', 'Warning', 'Error'] },
      size: { label: 'Size', options: ['Small', 'Medium'] },
      withIcon: { label: 'With Icon', options: ['false', 'true'] },
    },
    defaults: { intent: 'Neutral', size: 'Medium', withIcon: 'false' },
    render: (v) => (
      <Badge label={v.intent} intent={v.intent as never} size={v.size as never} withIcon={b(v.withIcon)} />
    ),
    gallery: (['Neutral', 'Info', 'Success', 'Warning', 'Error'] as const).map((i) => ({
      label: i,
      node: <Badge label={i} intent={i} withIcon />,
    })),
    snippet: (v) =>
      `<Badge\n  label="${v.intent}"\n  intent="${v.intent}"\n  size="${v.size}"\n  withIcon={${v.withIcon}}\n/>`,
  },

  avatar: {
    controls: {
      size: { label: 'Size', options: ['Small', 'Medium', 'Large'] },
      content: { label: 'Content', options: ['Initials', 'Image', 'Icon'] },
      status: { label: 'Status', options: ['None', 'Online', 'Offline', 'Busy'] },
    },
    defaults: { size: 'Medium', content: 'Initials', status: 'None' },
    render: (v) => (
      <Avatar size={v.size as never} content={v.content as never} status={v.status as never} />
    ),
    gallery: [
      { label: 'Initials', node: <Avatar content="Initials" /> },
      { label: 'Image', node: <Avatar content="Image" /> },
      { label: 'Icon', node: <Avatar content="Icon" /> },
      { label: 'Online', node: <Avatar content="Image" status="Online" /> },
      { label: 'Busy', node: <Avatar content="Initials" status="Busy" /> },
    ],
    snippet: (v) =>
      `<Avatar\n  size="${v.size}"\n  content="${v.content}"\n  status="${v.status}"\n/>`,
  },

  alert: {
    controls: {
      intent: { label: 'Intent', options: ['Info', 'Success', 'Warning', 'Error'] },
      layout: { label: 'Layout', options: ['Simple', 'With CTA', 'With Close', 'With CTA + Close'] },
      background: { label: 'Background', options: ['true', 'false'] },
    },
    defaults: { intent: 'Info', layout: 'Simple', background: 'true' },
    render: (v) => (
      <Alert intent={v.intent as never} layout={v.layout as never} background={b(v.background)} />
    ),
    gallery: (['Info', 'Success', 'Warning', 'Error'] as const).map((i) => ({
      label: i,
      node: <Alert intent={i} title={i} message="Contextual inline feedback." layout="With Close" />,
    })),
    snippet: (v) =>
      `<Alert\n  intent="${v.intent}"\n  title="Heads up"\n  message="…"\n  layout="${v.layout}"\n  background={${v.background}}\n/>`,
  },

  dialog: {
    controls: {
      size: { label: 'Size', options: ['Small', 'Medium', 'Large'] },
      hasCloseButton: { label: 'Close Button', options: ['true', 'false'] },
      hasActions: { label: 'Actions', options: ['true', 'false'] },
    },
    defaults: { size: 'Medium', hasCloseButton: 'true', hasActions: 'true' },
    render: (v) => (
      <Dialog
        embedded
        size={v.size as DialogSize}
        hasCloseButton={b(v.hasCloseButton)}
        hasActions={b(v.hasActions)}
      />
    ),
    gallery: [
      { label: 'Medium (default)', node: <div style={fill}><Dialog embedded size="Medium" /></div> },
      { label: 'Small', node: <div style={fill}><Dialog embedded size="Small" /></div> },
      { label: 'Large', node: <div style={fill}><Dialog embedded size="Large" /></div> },
      { label: 'No close button', node: <div style={fill}><Dialog embedded hasCloseButton={false} /></div> },
      { label: 'No actions', node: <div style={fill}><Dialog embedded hasActions={false} /></div> },
      { label: 'No close & no actions', node: <div style={fill}><Dialog embedded hasCloseButton={false} hasActions={false} /></div> },
    ],
    snippet: (v) =>
      `<Dialog\n  open={open}\n  size="${v.size}"\n  title="Dialog title"\n  hasCloseButton={${v.hasCloseButton}}\n  hasActions={${v.hasActions}}\n  onClose={() => setOpen(false)}\n  onConfirm={handleConfirm}\n/>`,
  },

  snackbar: {
    controls: {
      intent: { label: 'Intent', options: ['Neutral', 'Info', 'Success', 'Warning', 'Error'] },
      hasAction: { label: 'Action', options: ['false', 'true'] },
      hasClose: { label: 'Close', options: ['true', 'false'] },
    },
    defaults: { intent: 'Neutral', hasAction: 'false', hasClose: 'true' },
    render: (v) => (
      <Snackbar intent={v.intent as never} hasAction={b(v.hasAction)} hasClose={b(v.hasClose)} />
    ),
    gallery: (['Neutral', 'Success', 'Error'] as const).map((i) => ({
      label: i,
      node: <div style={fill}><Snackbar intent={i} message={`${i} message.`} hasAction /></div>,
    })),
    snippet: (v) =>
      `<Snackbar\n  intent="${v.intent}"\n  message="Assessment saved."\n  hasAction={${v.hasAction}}\n  hasClose={${v.hasClose}}\n/>`,
  },

  tooltip: {
    controls: {
      placement: { label: 'Placement', options: ['Top', 'Bottom', 'Left', 'Right'] },
      theme: { label: 'Theme', options: ['Dark', 'Light'] },
      type: { label: 'Type', options: ['Default', 'Accessibility'] },
    },
    defaults: { placement: 'Top', theme: 'Dark', type: 'Default' },
    render: (v) => (
      <div style={{ padding: 40 }}>
        <Tooltip
          content="Supplementary help text shown on hover or focus."
          placement={v.placement as never}
          theme={v.theme as never}
          type={v.type as never}
          forceVisible
        />
      </div>
    ),
    gallery: (['Top', 'Bottom', 'Left', 'Right'] as const).map((p) => ({
      label: p,
      node: <div style={{ padding: 28 }}><Tooltip content={p} placement={p} forceVisible /></div>,
    })),
    snippet: (v) =>
      `<Tooltip\n  content="Supplementary help text"\n  placement="${v.placement}"\n  theme="${v.theme}"\n  type="${v.type}"\n>\n  <IconButton icon="help" />\n</Tooltip>`,
  },

  tabs: {
    controls: {
      style: { label: 'Style', options: ['Underline', 'Contained'] },
      size: { label: 'Size', options: ['Small', 'Medium'] },
      fullWidth: { label: 'Full Width', options: ['false', 'true'] },
    },
    defaults: { style: 'Underline', size: 'Medium', fullWidth: 'false' },
    render: (v) => (
      <Tabs style={v.style as never} size={v.size as never} fullWidth={b(v.fullWidth)} />
    ),
    gallery: [
      { label: 'Underline', node: <Tabs style="Underline" items={[{ label: 'Overview' }, { label: 'Results' }]} /> },
      { label: 'Contained', node: <Tabs style="Contained" items={[{ label: 'Overview' }, { label: 'Results' }]} /> },
    ],
    snippet: (v) =>
      `<Tabs\n  items={[{ label: 'Overview' }, { label: 'Questions' }]}\n  style="${v.style}"\n  size="${v.size}"\n  fullWidth={${v.fullWidth}}\n/>`,
  },

  breadcrumb: {
    controls: {
      separator: { label: 'Separator', options: ['Chevron', 'Slash'] },
      size: { label: 'Size', options: ['Small', 'Medium'] },
    },
    defaults: { separator: 'Chevron', size: 'Medium' },
    render: (v) => (
      <Breadcrumb separator={v.separator as never} size={v.size as never} />
    ),
    gallery: [
      { label: 'Chevron', node: <Breadcrumb separator="Chevron" items={['Home', 'Assessments', 'Quiz']} /> },
      { label: 'Slash', node: <Breadcrumb separator="Slash" items={['Home', 'Assessments', 'Quiz']} /> },
    ],
    snippet: (v) =>
      `<Breadcrumb\n  items={['Home', 'Assessments', 'Algebra Quiz']}\n  separator="${v.separator}"\n  size="${v.size}"\n/>`,
  },

  textarea: {
    controls: {
      state: { label: 'State', options: ['Default', 'Hover', 'Focused', 'Filled', 'Error', 'Disabled', 'ReadOnly'] },
      size: { label: 'Size', options: ['Medium', 'Small'] },
      showCount: { label: 'Char Count', options: ['false', 'true'] },
      showHelp: { label: 'Help Text', options: ['true', 'false'] },
    },
    defaults: { state: 'Default', size: 'Medium', showCount: 'false', showHelp: 'true' },
    render: (v) => (
      <Textarea
        label="Feedback"
        placeholder="Share your thoughts…"
        state={v.state as never}
        size={v.size as never}
        showCount={b(v.showCount)}
        maxLength={280}
        helpText={b(v.showHelp) ? 'Keep it constructive.' : undefined}
        errorText="This field is required."
      />
    ),
    gallery: (['Default', 'Focused', 'Filled', 'Error', 'Disabled', 'ReadOnly'] as const).map((s) => ({
      label: s,
      node: <Textarea label="Feedback" placeholder="Share your thoughts…" state={s} showLabel={false} rows={3} />,
    })),
    snippet: (v) =>
      `<Textarea\n  label="Feedback"\n  placeholder="Share your thoughts…"\n  size="${v.size}"\n  showCount={${v.showCount}}\n  maxLength={280}\n/>`,
  },

  'form-field': {
    controls: {
      required: { label: 'Required', options: ['false', 'true'] },
      showError: { label: 'Error', options: ['false', 'true'] },
    },
    defaults: { required: 'false', showError: 'false' },
    render: (v) => (
      <FormField
        label="Email address"
        htmlFor="ff-demo"
        required={b(v.required)}
        helpText="We'll never share your email."
        errorText={b(v.showError) ? 'Enter a valid email address.' : undefined}
      >
        <TextInput label="Email" showLabel={false} placeholder="jane@inspera.com" state={b(v.showError) ? 'Error' : 'Default'} />
      </FormField>
    ),
    gallery: [
      { label: 'With help', node: <FormField label="Email" htmlFor="ff-g1" helpText="We'll never share it."><TextInput label="Email" showLabel={false} placeholder="jane@inspera.com" /></FormField> },
      { label: 'Required + error', node: <FormField label="Email" htmlFor="ff-g2" required errorText="Required field."><TextInput label="Email" showLabel={false} state="Error" /></FormField> },
    ],
    snippet: (v) =>
      `<FormField\n  label="Email address"\n  htmlFor="email"\n  required={${v.required}}\n  helpText="We'll never share your email."\n>\n  <TextInput id="email" showLabel={false} />\n</FormField>`,
  },

  slider: {
    controls: {
      state: { label: 'State', options: ['Default', 'Focused', 'Disabled'] },
      showValue: { label: 'Show Value', options: ['true', 'false'] },
    },
    defaults: { state: 'Default', showValue: 'true' },
    render: (v) => (
      <Slider label="Volume" value={40} min={0} max={100} state={v.state as never} showValue={b(v.showValue)} />
    ),
    gallery: [
      { label: 'Default', node: <Slider label="Volume" value={40} showLabel={false} /> },
      { label: 'Focused', node: <Slider label="Volume" value={65} state="Focused" showLabel={false} /> },
      { label: 'Disabled', node: <Slider label="Volume" value={25} state="Disabled" showLabel={false} /> },
    ],
    snippet: (v) =>
      `<Slider\n  label="Volume"\n  min={0}\n  max={100}\n  value={40}\n  showValue={${v.showValue}}\n/>`,
  },

  'segmented-control': {
    controls: {
      size: { label: 'Size', options: ['Medium', 'Small'] },
      fullWidth: { label: 'Full Width', options: ['false', 'true'] },
    },
    defaults: { size: 'Medium', fullWidth: 'false' },
    render: (v) => (
      <SegmentedControl items={['Day', 'Week', 'Month']} value={1} size={v.size as never} fullWidth={b(v.fullWidth)} />
    ),
    gallery: [
      { label: 'Three', node: <SegmentedControl items={['Day', 'Week', 'Month']} value={0} /> },
      { label: 'Two', node: <SegmentedControl items={['List', 'Grid']} value={1} /> },
    ],
    snippet: (v) =>
      `<SegmentedControl\n  items={['Day', 'Week', 'Month']}\n  value={1}\n  size="${v.size}"\n  fullWidth={${v.fullWidth}}\n/>`,
  },

  'date-picker': {
    controls: {
      state: { label: 'State', options: ['Default', 'Focused', 'Disabled', 'Error'] },
      defaultOpen: { label: 'Open', options: ['false', 'true'] },
    },
    defaults: { state: 'Default', defaultOpen: 'false' },
    render: (v) => (
      <DatePicker label="Due date" state={v.state as never} defaultOpen={b(v.defaultOpen)} />
    ),
    gallery: [
      { label: 'Default', node: <DatePicker label="Due date" showLabel={false} /> },
      { label: 'Error', node: <DatePicker label="Due date" showLabel={false} state="Error" /> },
      { label: 'Disabled', node: <DatePicker label="Due date" showLabel={false} state="Disabled" /> },
    ],
    snippet: (v) =>
      `<DatePicker\n  label="Due date"\n  value="2026-08-19"\n  onChange={setDate}\n/>`,
  },

  'file-upload': {
    controls: {
      state: { label: 'State', options: ['Default', 'Dragging', 'Disabled', 'Error'] },
      multiple: { label: 'Multiple', options: ['false', 'true'] },
    },
    defaults: { state: 'Default', multiple: 'false' },
    render: (v) => (
      <FileUpload label="Attachments" state={v.state as never} multiple={b(v.multiple)} />
    ),
    gallery: [
      { label: 'Default', node: <FileUpload label="Attachments" /> },
      { label: 'Dragging', node: <FileUpload label="Attachments" state="Dragging" /> },
      { label: 'Error', node: <FileUpload label="Attachments" state="Error" /> },
    ],
    snippet: (v) =>
      `<FileUpload\n  label="Attachments"\n  accept="image/*,.pdf"\n  multiple={${v.multiple}}\n  onFiles={handleFiles}\n/>`,
  },

  'radio-group': {
    controls: {
      state: { label: 'State', options: ['Default', 'Disabled', 'Error'] },
      orientation: { label: 'Orientation', options: ['Vertical', 'Horizontal'] },
    },
    defaults: { state: 'Default', orientation: 'Vertical' },
    render: (v) => (
      <RadioGroup
        label="Delivery speed"
        name="delivery-demo"
        value="standard"
        state={v.state as never}
        orientation={v.orientation as never}
        options={[
          { label: 'Standard', value: 'standard' },
          { label: 'Express', value: 'express' },
          { label: 'Overnight', value: 'overnight' },
        ]}
      />
    ),
    gallery: [
      { label: 'Vertical', node: <RadioGroup label="Speed" name="rg-g1" value="a" options={[{ label: 'Standard', value: 'a' }, { label: 'Express', value: 'b' }]} /> },
      { label: 'Error', node: <RadioGroup label="Speed" name="rg-g2" state="Error" options={[{ label: 'Standard', value: 'a' }, { label: 'Express', value: 'b' }]} /> },
    ],
    snippet: (v) =>
      `<RadioGroup\n  label="Delivery speed"\n  name="delivery"\n  value="standard"\n  orientation="${v.orientation}"\n  options={[{ label: 'Standard', value: 'standard' }]}\n/>`,
  },

  'checkbox-group': {
    controls: {
      state: { label: 'State', options: ['Default', 'Disabled', 'Error'] },
      orientation: { label: 'Orientation', options: ['Vertical', 'Horizontal'] },
    },
    defaults: { state: 'Default', orientation: 'Vertical' },
    render: (v) => (
      <CheckboxGroup
        label="Notifications"
        value={['email']}
        state={v.state as never}
        orientation={v.orientation as never}
        options={[
          { label: 'Email', value: 'email' },
          { label: 'SMS', value: 'sms' },
          { label: 'Push', value: 'push' },
        ]}
      />
    ),
    gallery: [
      { label: 'Vertical', node: <CheckboxGroup label="Notify" value={['a']} options={[{ label: 'Email', value: 'a' }, { label: 'SMS', value: 'b' }]} /> },
      { label: 'Error', node: <CheckboxGroup label="Notify" state="Error" options={[{ label: 'Email', value: 'a' }, { label: 'SMS', value: 'b' }]} /> },
    ],
    snippet: (v) =>
      `<CheckboxGroup\n  label="Notifications"\n  value={['email']}\n  orientation="${v.orientation}"\n  options={[{ label: 'Email', value: 'email' }]}\n/>`,
  },

  rating: {
    controls: {
      size: { label: 'Size', options: ['Medium', 'Small'] },
      readOnly: { label: 'Read Only', options: ['false', 'true'] },
      showValue: { label: 'Show Value', options: ['false', 'true'] },
    },
    defaults: { size: 'Medium', readOnly: 'false', showValue: 'false' },
    render: (v) => (
      <Rating value={3} max={5} size={v.size as never} readOnly={b(v.readOnly)} showValue={b(v.showValue)} />
    ),
    gallery: [
      { label: '0 of 5', node: <Rating value={0} /> },
      { label: '3 of 5', node: <Rating value={3} /> },
      { label: '5 of 5', node: <Rating value={5} showValue /> },
    ],
    snippet: (v) =>
      `<Rating\n  value={3}\n  max={5}\n  size="${v.size}"\n  readOnly={${v.readOnly}}\n/>`,
  },

  'otp-input': {
    controls: {
      state: { label: 'State', options: ['Default', 'Focused', 'Error', 'Disabled'] },
      length: { label: 'Length', options: ['6', '4'] },
    },
    defaults: { state: 'Default', length: '6' },
    render: (v) => (
      <OtpInput value="123" length={Number(v.length)} state={v.state as never} />
    ),
    gallery: [
      { label: 'Default', node: <OtpInput value="12" length={6} /> },
      { label: 'Error', node: <OtpInput value="1234" length={6} state="Error" /> },
      { label: 'Disabled', node: <OtpInput value="123456" length={6} state="Disabled" /> },
    ],
    snippet: (v) =>
      `<OtpInput\n  length={${v.length}}\n  value={code}\n  onChange={setCode}\n/>`,
  },

  table: {
    controls: {
      size: { label: 'Size', options: ['Default', 'Compact'] },
      striped: { label: 'Striped', options: ['false', 'true'] },
      hoverable: { label: 'Hoverable', options: ['true', 'false'] },
    },
    defaults: { size: 'Default', striped: 'false', hoverable: 'true' },
    render: (v) => (
      <Table
        size={v.size as never}
        striped={b(v.striped)}
        hoverable={b(v.hoverable)}
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
    ),
    gallery: [
      { label: 'Default', node: <Table columns={[{ key: 'a', header: 'Name' }, { key: 'b', header: 'Score', align: 'right' }]} rows={[{ a: 'Ada', b: 92 }, { a: 'Linus', b: 88 }]} /> },
      { label: 'Striped', node: <Table striped columns={[{ key: 'a', header: 'Name' }, { key: 'b', header: 'Score', align: 'right' }]} rows={[{ a: 'Ada', b: 92 }, { a: 'Linus', b: 88 }]} /> },
    ],
    snippet: (v) =>
      `<Table\n  size="${v.size}"\n  striped={${v.striped}}\n  columns={[{ key: 'name', header: 'Assessment' }]}\n  rows={[{ name: 'Algebra Quiz' }]}\n/>`,
  },

  accordion: {
    controls: {
      type: { label: 'Type', options: ['Single', 'Multiple'] },
      iconPosition: { label: 'Icon', options: ['Right', 'Left'] },
    },
    defaults: { type: 'Single', iconPosition: 'Right' },
    render: (v) => (
      <Accordion
        type={v.type as never}
        iconPosition={v.iconPosition as never}
        items={[
          { title: 'What is Inspera?', content: 'A digital assessment platform for education and certification.' },
          { title: 'How are results scored?', content: 'Automatically for objective items, with manual grading for essays.' },
          { title: 'Is it accessible?', content: 'Yes — components follow WCAG 2.1 AA guidance.' },
        ]}
      />
    ),
    gallery: [
      { label: 'Single', node: <Accordion items={[{ title: 'Section one', content: 'Body copy.' }, { title: 'Section two', content: 'Body copy.' }]} /> },
    ],
    snippet: (v) =>
      `<Accordion\n  type="${v.type}"\n  iconPosition="${v.iconPosition}"\n  items={[{ title: 'What is Inspera?', content: '…' }]}\n/>`,
  },

  tag: {
    controls: {
      intent: { label: 'Intent', options: ['Neutral', 'Info', 'Success', 'Warning', 'Error'] },
      size: { label: 'Size', options: ['Medium', 'Small'] },
      removable: { label: 'Removable', options: ['false', 'true'] },
    },
    defaults: { intent: 'Neutral', size: 'Medium', removable: 'false' },
    render: (v) => (
      <Tag label={v.intent} intent={v.intent as never} size={v.size as never} removable={b(v.removable)} leadingIcon="label" />
    ),
    gallery: (['Neutral', 'Info', 'Success', 'Warning', 'Error'] as const).map((i) => ({
      label: i,
      node: <Tag label={i} intent={i} removable />,
    })),
    snippet: (v) =>
      `<Tag\n  label="${v.intent}"\n  intent="${v.intent}"\n  size="${v.size}"\n  removable={${v.removable}}\n/>`,
  },

  divider: {
    controls: {
      orientation: { label: 'Orientation', options: ['Horizontal', 'Vertical'] },
      spacing: { label: 'Spacing', options: ['Default', 'Compact', 'Spacious'] },
      withLabel: { label: 'With Label', options: ['false', 'true'] },
    },
    defaults: { orientation: 'Horizontal', spacing: 'Default', withLabel: 'false' },
    render: (v) =>
      v.orientation === 'Vertical' ? (
        <div style={{ display: 'flex', alignItems: 'center', height: 60 }}>
          <span>Left</span>
          <Divider orientation="Vertical" spacing={v.spacing as never} />
          <span>Right</span>
        </div>
      ) : (
        <div style={fill}>
          <span>Above</span>
          <Divider orientation="Horizontal" spacing={v.spacing as never} label={b(v.withLabel) ? 'OR' : undefined} />
          <span>Below</span>
        </div>
      ),
    gallery: [
      { label: 'Plain', node: <div style={{ width: 200 }}><Divider /></div> },
      { label: 'Labeled', node: <div style={{ width: 200 }}><Divider label="OR" /></div> },
    ],
    snippet: (v) =>
      `<Divider\n  orientation="${v.orientation}"\n  spacing="${v.spacing}"${b(v.withLabel) ? '\n  label="OR"' : ''}\n/>`,
  },

  'empty-state': {
    controls: {
      size: { label: 'Size', options: ['Medium', 'Small'] },
      withAction: { label: 'With Action', options: ['true', 'false'] },
    },
    defaults: { size: 'Medium', withAction: 'true' },
    render: (v) => (
      <EmptyState
        icon="inbox"
        title="No assessments yet"
        description="Create your first assessment to get started."
        actionLabel={b(v.withAction) ? 'New assessment' : undefined}
        size={v.size as never}
      />
    ),
    gallery: [
      { label: 'With action', node: <EmptyState icon="search_off" title="No results" description="Try a different search." actionLabel="Clear filters" size="Small" /> },
      { label: 'No action', node: <EmptyState icon="folder_open" title="Empty folder" size="Small" /> },
    ],
    snippet: (v) =>
      `<EmptyState\n  icon="inbox"\n  title="No assessments yet"\n  description="Create your first assessment."${b(v.withAction) ? '\n  actionLabel="New assessment"' : ''}\n  size="${v.size}"\n/>`,
  },

  'avatar-group': {
    controls: {
      size: { label: 'Size', options: ['Medium', 'Small', 'Large'] },
      max: { label: 'Max', options: ['4', '3', '5'] },
    },
    defaults: { size: 'Medium', max: '4' },
    render: (v) => (
      <AvatarGroup
        size={v.size as never}
        max={Number(v.max)}
        avatars={[
          { name: 'Ada Lovelace' },
          { name: 'Linus Torvalds' },
          { name: 'Grace Hopper' },
          { name: 'Alan Turing' },
          { name: 'Katherine Johnson' },
          { name: 'Edsger Dijkstra' },
        ]}
      />
    ),
    gallery: [
      { label: 'Max 3', node: <AvatarGroup max={3} avatars={[{ name: 'A B' }, { name: 'C D' }, { name: 'E F' }, { name: 'G H' }, { name: 'I J' }]} /> },
      { label: 'Max 5', node: <AvatarGroup max={5} avatars={[{ name: 'A B' }, { name: 'C D' }, { name: 'E F' }, { name: 'G H' }, { name: 'I J' }]} /> },
    ],
    snippet: (v) =>
      `<AvatarGroup\n  size="${v.size}"\n  max={${v.max}}\n  avatars={[{ name: 'Ada Lovelace' }, { name: 'Linus Torvalds' }]}\n/>`,
  },

  stat: {
    controls: {
      deltaIntent: { label: 'Trend', options: ['up', 'down', 'neutral'] },
      withIcon: { label: 'With Icon', options: ['true', 'false'] },
    },
    defaults: { deltaIntent: 'up', withIcon: 'true' },
    render: (v) => (
      <Stat
        label="Active candidates"
        value="12,480"
        delta="+8.2% vs last week"
        deltaIntent={v.deltaIntent as never}
        icon={b(v.withIcon) ? 'group' : undefined}
      />
    ),
    gallery: [
      { label: 'Up', node: <Stat label="Completion rate" value="94%" delta="+2.1%" deltaIntent="up" icon="trending_up" /> },
      { label: 'Down', node: <Stat label="Avg. time" value="38m" delta="-4m" deltaIntent="down" icon="schedule" /> },
    ],
    snippet: (v) =>
      `<Stat\n  label="Active candidates"\n  value="12,480"\n  delta="+8.2% vs last week"\n  deltaIntent="${v.deltaIntent}"${b(v.withIcon) ? '\n  icon="group"' : ''}\n/>`,
  },

  list: {
    controls: {
      size: { label: 'Size', options: ['Default', 'Compact'] },
      divided: { label: 'Divided', options: ['true', 'false'] },
      interactive: { label: 'Interactive', options: ['false', 'true'] },
    },
    defaults: { size: 'Default', divided: 'true', interactive: 'false' },
    render: (v) => (
      <List
        size={v.size as never}
        divided={b(v.divided)}
        interactive={b(v.interactive)}
        items={[
          { primary: 'General settings', secondary: 'Language, timezone, theme', leading: 'settings', trailing: 'chevron_right' },
          { primary: 'Notifications', secondary: 'Email and push preferences', leading: 'notifications', trailing: 'chevron_right' },
          { primary: 'Security', secondary: 'Password and two-factor auth', leading: 'lock', trailing: 'chevron_right' },
        ]}
      />
    ),
    gallery: [
      { label: 'Divided', node: <List items={[{ primary: 'Item one', secondary: 'Detail' }, { primary: 'Item two', secondary: 'Detail' }]} /> },
      { label: 'Interactive', node: <List interactive items={[{ primary: 'Item one', trailing: 'chevron_right' }, { primary: 'Item two', trailing: 'chevron_right' }]} /> },
    ],
    snippet: (v) =>
      `<List\n  size="${v.size}"\n  divided={${v.divided}}\n  interactive={${v.interactive}}\n  items={[{ primary: 'General settings', secondary: '…', leading: 'settings' }]}\n/>`,
  },

  progress: {
    controls: {
      variant: { label: 'Variant', options: ['Linear', 'Circular'] },
      intent: { label: 'Intent', options: ['Primary', 'Success', 'Warning', 'Error'] },
      size: { label: 'Size', options: ['Medium', 'Small', 'Large'] },
      indeterminate: { label: 'Indeterminate', options: ['false', 'true'] },
      showValue: { label: 'Show Value', options: ['false', 'true'] },
    },
    defaults: { variant: 'Linear', intent: 'Primary', size: 'Medium', indeterminate: 'false', showValue: 'false' },
    render: (v) => (
      <div style={{ width: v.variant === 'Linear' ? '100%' : 'auto' }}>
        <Progress
          variant={v.variant as never}
          value={60}
          intent={v.intent as never}
          size={v.size as never}
          indeterminate={b(v.indeterminate)}
          showValue={b(v.showValue)}
        />
      </div>
    ),
    gallery: [
      { label: 'Linear', node: <div style={{ width: 180 }}><Progress value={60} showValue /></div> },
      { label: 'Indeterminate', node: <div style={{ width: 180 }}><Progress indeterminate /></div> },
      { label: 'Circular', node: <Progress variant="Circular" value={72} showValue /> },
    ],
    snippet: (v) =>
      `<Progress\n  variant="${v.variant}"\n  value={60}\n  intent="${v.intent}"\n  size="${v.size}"\n  indeterminate={${v.indeterminate}}\n  showValue={${v.showValue}}\n/>`,
  },

  spinner: {
    controls: {
      size: { label: 'Size', options: ['Medium', 'Small', 'Large'] },
      intent: { label: 'Intent', options: ['Primary', 'Neutral', 'Inverse'] },
    },
    defaults: { size: 'Medium', intent: 'Primary' },
    render: (v) =>
      v.intent === 'Inverse' ? (
        <div style={{ background: 'var(--gray-900)', padding: 24, borderRadius: 'var(--radius-md)' }}>
          <Spinner size={v.size as never} intent="Inverse" />
        </div>
      ) : (
        <Spinner size={v.size as never} intent={v.intent as never} />
      ),
    gallery: (['Small', 'Medium', 'Large'] as const).map((s) => ({
      label: s,
      node: <Spinner size={s} />,
    })),
    snippet: (v) =>
      `<Spinner\n  size="${v.size}"\n  intent="${v.intent}"\n  label="Loading assessments"\n/>`,
  },

  skeleton: {
    controls: {
      variant: { label: 'Variant', options: ['Text', 'Rect', 'Circle'] },
      lines: { label: 'Lines', options: ['3', '1', '5'] },
    },
    defaults: { variant: 'Text', lines: '3' },
    render: (v) => (
      <div style={{ width: 260 }}>
        {v.variant === 'Text' ? (
          <Skeleton variant="Text" lines={Number(v.lines)} />
        ) : v.variant === 'Circle' ? (
          <Skeleton variant="Circle" width={48} height={48} />
        ) : (
          <Skeleton variant="Rect" height={80} />
        )}
      </div>
    ),
    gallery: [
      { label: 'Card', node: (
        <div style={{ display: 'flex', gap: 12, width: 240, alignItems: 'center' }}>
          <Skeleton variant="Circle" width={40} height={40} />
          <div style={{ flex: 1 }}><Skeleton variant="Text" lines={2} /></div>
        </div>
      ) },
      { label: 'Block', node: <div style={{ width: 200 }}><Skeleton variant="Rect" height={64} /></div> },
    ],
    snippet: (v) =>
      `<Skeleton\n  variant="${v.variant}"${v.variant === 'Text' ? `\n  lines={${v.lines}}` : '\n  width={48}\n  height={48}'}\n/>`,
  },

  popover: {
    controls: {
      placement: { label: 'Placement', options: ['Bottom', 'Top', 'Left', 'Right'] },
    },
    defaults: { placement: 'Bottom' },
    render: (v) => <PopoverDemo placement={v.placement} />,
    gallery: [
      { label: 'Panel', node: (
        <div style={{ padding: 12 }}>
          <Popover
            forceVisible
            placement="Bottom"
            title="Filter results"
            trigger={<Button label="Filters" intent="Outline" />}
            content={<span style={{ fontSize: 14 }}>Interactive content lives inside the popover.</span>}
          />
        </div>
      ) },
    ],
    snippet: (v) =>
      `<Popover\n  placement="${v.placement}"\n  title="Filter results"\n  trigger={<Button label="Filters" />}\n  content={<FilterForm />}\n/>`,
  },

  drawer: {
    controls: {
      side: { label: 'Side', options: ['Right', 'Left', 'Bottom'] },
      size: { label: 'Size', options: ['Medium', 'Small', 'Large'] },
      hasCloseButton: { label: 'Close Button', options: ['true', 'false'] },
    },
    defaults: { side: 'Right', size: 'Medium', hasCloseButton: 'true' },
    render: (v) => (
      <DrawerDemo side={v.side} size={v.size} hasCloseButton={b(v.hasCloseButton)} />
    ),
    gallery: [
      { label: 'Right', node: <div style={fill}><Drawer embedded side="Right" size="Small" title="Details">Drawer body content.</Drawer></div> },
      { label: 'Left', node: <div style={fill}><Drawer embedded side="Left" size="Small" title="Filters">Drawer body content.</Drawer></div> },
      { label: 'Bottom', node: <div style={fill}><Drawer embedded side="Bottom" size="Small" title="Actions">Drawer body content.</Drawer></div> },
    ],
    snippet: (v) =>
      `<Drawer\n  open={open}\n  side="${v.side}"\n  size="${v.size}"\n  title="Assessment details"\n  hasCloseButton={${v.hasCloseButton}}\n  onClose={() => setOpen(false)}\n>\n  {children}\n</Drawer>`,
  },

  pagination: {
    controls: {
      size: { label: 'Size', options: ['Medium', 'Small'] },
      showEdges: { label: 'Edge Buttons', options: ['true', 'false'] },
    },
    defaults: { size: 'Medium', showEdges: 'true' },
    render: (v) => (
      <Pagination page={4} pageCount={12} size={v.size as never} showEdges={b(v.showEdges)} />
    ),
    gallery: [
      { label: 'Start', node: <Pagination page={1} pageCount={8} /> },
      { label: 'Middle', node: <Pagination page={5} pageCount={12} /> },
    ],
    snippet: (v) =>
      `<Pagination\n  page={page}\n  pageCount={12}\n  size="${v.size}"\n  showEdges={${v.showEdges}}\n  onChange={setPage}\n/>`,
  },

  menu: {
    controls: {
      placement: { label: 'Placement', options: ['Bottom Start', 'Bottom End'] },
    },
    defaults: { placement: 'Bottom Start' },
    render: (v) => (
      <Menu
        label="Actions"
        forceVisible
        placement={v.placement as never}
        items={[
          { label: 'Edit', icon: 'edit' },
          { label: 'Duplicate', icon: 'content_copy' },
          { label: 'Share', icon: 'share' },
          { label: 'x', divider: true },
          { label: 'Delete', icon: 'delete', danger: true },
        ]}
      />
    ),
    gallery: [
      { label: 'Open menu', node: (
        <Menu
          label="Actions"
          forceVisible
          items={[
            { label: 'Edit', icon: 'edit' },
            { label: 'Duplicate', icon: 'content_copy' },
            { label: 'x', divider: true },
            { label: 'Delete', icon: 'delete', danger: true },
          ]}
        />
      ) },
    ],
    snippet: (v) =>
      `<Menu\n  label="Actions"\n  placement="${v.placement}"\n  items={[{ label: 'Edit', icon: 'edit' }, { label: 'Delete', icon: 'delete', danger: true }]}\n  onSelect={handleSelect}\n/>`,
  },

  stepper: {
    controls: {
      orientation: { label: 'Orientation', options: ['Horizontal', 'Vertical'] },
      size: { label: 'Size', options: ['Medium', 'Small'] },
      activeStep: { label: 'Active Step', options: ['1', '0', '2', '3'] },
    },
    defaults: { orientation: 'Horizontal', size: 'Medium', activeStep: '1' },
    render: (v) => (
      <Stepper orientation={v.orientation as never} size={v.size as never} activeStep={Number(v.activeStep)} />
    ),
    gallery: [
      { label: 'Horizontal', node: <div style={fill}><Stepper activeStep={1} /></div> },
      { label: 'Vertical', node: <Stepper orientation="Vertical" activeStep={2} /> },
    ],
    snippet: (v) =>
      `<Stepper\n  steps={[{ label: 'Details' }, { label: 'Questions' }, { label: 'Review' }]}\n  activeStep={${v.activeStep}}\n  orientation="${v.orientation}"\n/>`,
  },

  link: {
    controls: {
      intent: { label: 'Intent', options: ['Default', 'Muted'] },
      underline: { label: 'Underline', options: ['Hover', 'Always', 'None'] },
      external: { label: 'External', options: ['false', 'true'] },
      disabled: { label: 'Disabled', options: ['false', 'true'] },
    },
    defaults: { intent: 'Default', underline: 'Hover', external: 'false', disabled: 'false' },
    render: (v) => (
      <Link
        label="Learn more"
        intent={v.intent as never}
        underline={v.underline as never}
        external={b(v.external)}
        disabled={b(v.disabled)}
      />
    ),
    gallery: [
      { label: 'Default', node: <Link label="Learn more" /> },
      { label: 'External', node: <Link label="Documentation" external /> },
      { label: 'Muted', node: <Link label="Skip for now" intent="Muted" /> },
    ],
    snippet: (v) =>
      `<Link\n  href="/docs"\n  label="Learn more"\n  intent="${v.intent}"\n  underline="${v.underline}"\n  external={${v.external}}\n/>`,
  },
}

// Interactive modal demo: a trigger that opens the real Dialog overlay.
function DialogDemo({ size, hasCloseButton, hasActions }: { size: string; hasCloseButton: boolean; hasActions: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button label="Open dialog" intent="Primary" onClick={() => setOpen(true)} />
      <Dialog
        open={open}
        size={size as never}
        hasCloseButton={hasCloseButton}
        hasActions={hasActions}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
      />
    </>
  )
}

// Interactive popover demo: a trigger that toggles the anchored panel.
function PopoverDemo({ placement }: { placement: string }) {
  return (
    <div style={{ padding: 24 }}>
      <Popover
        placement={placement as never}
        title="Filter results"
        trigger={<Button label="Filters" intent="Outline" content="Text + Disclosure" />}
        content={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
            <span>Popovers can hold interactive content.</span>
            <Checkbox label="Only published" />
            <Checkbox label="Assigned to me" />
          </div>
        }
      />
    </div>
  )
}

// Interactive drawer demo: a trigger that opens the real sliding panel.
function DrawerDemo({ side, size, hasCloseButton }: { side: string; size: string; hasCloseButton: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button label="Open drawer" intent="Primary" onClick={() => setOpen(true)} />
      <Drawer
        open={open}
        side={side as never}
        size={size as never}
        title="Assessment details"
        hasCloseButton={hasCloseButton}
        onClose={() => setOpen(false)}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
          <p style={{ margin: 0 }}>Drawers slide in from the edge for secondary tasks and detail views.</p>
          <FormField label="Title" htmlFor="dw-title">
            <TextInput label="Title" showLabel={false} placeholder="Algebra Quiz" />
          </FormField>
          <Button label="Save changes" intent="Primary" onClick={() => setOpen(false)} />
        </div>
      </Drawer>
    </>
  )
}
