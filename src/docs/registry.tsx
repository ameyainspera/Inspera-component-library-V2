import { type ComponentType, type ReactNode, createElement, useState } from 'react'
import * as Inspera from '../components/inspera'
import {
  Button, TextInput, FormField, Badge, Menu, Snackbar, Tooltip, Popover, Dialog, Drawer,
  CommandPalette, ToastProvider, toast, Checkbox, Divider, Spinner, Skeleton,
  type DialogProps, type DrawerProps, type DividerProps, type PopoverProps, type TooltipProps,
  type SpinnerProps, type SkeletonProps, type MenuProps,
} from '../components/inspera'
import { SEGMENT_LABELS } from '../data/recipes'
import { raw, resolve, toJsx } from './jsx'

// ---------------------------------------------------------------------------
// Shape
// ---------------------------------------------------------------------------

export interface ControlDef {
  label: string
  /** In natural order - Small before Medium before Large, 0 before 1. */
  options: string[]
  /**
   * `props` controls set real component props. `preview` controls simulate a
   * look - hover, focus, an open panel - that application code never sets.
   */
  group?: 'props' | 'preview'
}

export interface GalleryCell {
  label: string
  values: Record<string, string>
  /** A simulated look (hover, focus), tagged as such in the gallery. */
  simulated?: boolean
}

export interface GallerySection {
  title: string
  cells: GalleryCell[]
}

/** A grid: one row per option of `rows`, one column per state. */
export interface GalleryMatrix {
  rows: string
}

export interface EntryLayout {
  /** Playground width budget for the component. */
  width?: number
  /** Playground height to reserve - for panels that open downward. */
  minHeight?: number
  /** Pin the component to the top of the canvas instead of centring it. */
  align?: 'start' | 'center'
  /** Minimum gallery cell width. */
  cell?: number
  /** Minimum gallery cell height, for every cell - panels drawn open in all of them. */
  cellHeight?: number
  /** Height for the cell showing the "Open" preview only; the closed ones stay compact. */
  openHeight?: number
}

export interface RegistryEntry {
  /** The export whose props these are - names the snippet and its defaults. */
  component: string
  controls: Record<string, ControlDef>
  defaults: Record<string, string>
  /** The props for the current control values. `raw()` marks snippet-only code. */
  props: (v: Record<string, string>) => Record<string, unknown>
  /** Live render for the playground. Defaults to the component with `props`. */
  render?: (p: Record<string, unknown>, v: Record<string, string>) => ReactNode
  /** Static render for the gallery - an open panel instead of a trigger. Defaults to `render`. */
  still?: (p: Record<string, unknown>, v: Record<string, string>) => ReactNode
  /** Structural snippets that are not one element (a provider plus a call). */
  snippet?: (v: Record<string, string>) => string
  gallery?: {
    matrix?: GalleryMatrix
    /** Controls left out of the gallery. */
    omit?: string[]
    /**
     * Control values the States cells start from, on top of the defaults - for
     * looks that only exist in one mode, such as an interactive card's hover.
     */
    stateBase?: Record<string, string>
  }
  layout?: EntryLayout
  /**
   * Controls that cannot apply with the current values, beyond the shared
   * rules in `locksFor` - a close button that has to stay when a dialog has no
   * actions, say.
   */
  locks?: (v: Record<string, string>) => Record<string, Lock>
}

/** A control held at one value while another value rules it out, and why. */
export interface Lock {
  value: string
  reason: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const b = (v: string) => v === 'true'
/** Resolved props, typed as a component's props for a JSX spread. */
const as = <T,>(p: Record<string, unknown>) => p as unknown as T
const bool = (label: string): ControlDef => ({ label, options: ['false', 'true'] })
const preview = (...options: string[]): ControlDef => ({ label: 'Preview state', options: ['None', ...options], group: 'preview' })
/** The `forceState` for the current preview control, or nothing. */
const forced = (v: Record<string, string>) => (v.preview && v.preview !== 'None' ? v.preview : undefined)

/** A Checkbox, Radio Button or Toggle shows its description only under a visible label. */
const NO_LABEL_NO_DESCRIPTION: Lock = {
  value: 'false',
  reason: 'The description lines up under a visible label. With the label hidden, the row around the control describes it.',
}

/** Keys that describe state rather than variant, grouped under "States" in the gallery. */
export const STATE_KEYS = ['disabled', 'error', 'readOnly', 'showError']

/**
 * The controls held while another control rules them out: Error on a
 * disabled field, a hover look on one nobody can hover. Locked controls are
 * greyed out in the sheet with the reason, and the preview, the scene and the
 * code all use the locked value - so the playground never shows a state the
 * component cannot really be in. The shared rules cover every entry with
 * those controls; an entry adds its own with `locks`.
 */
export function locksFor(slug: string, v: Record<string, string>): Record<string, Lock> {
  const entry = registry[slug]
  const has = (key: string) => key in entry.controls
  const out: Record<string, Lock> = {}
  if (v.disabled === 'true') {
    if (has('error')) out.error = { value: 'false', reason: "A disabled control can't be in error: there is nothing anyone can do to fix it." }
    if (has('readOnly')) out.readOnly = { value: 'false', reason: 'Disabled already stops changes. Read only is for a value that still matters and can be selected.' }
    if (has('preview')) out.preview = { value: 'None', reason: "A disabled control doesn't react to the pointer or the keyboard, and never opens." }
  }
  if (v.readOnly === 'true' && has('error') && !out.error) {
    out.error = { value: 'false', reason: "A read-only value can't be fixed here, so it is never shown in error." }
  }
  if (v.readOnly === 'true' && !out.readOnly && has('withValue')) {
    out.withValue = { value: 'true', reason: 'A read-only field is there to show a value, so it always has one.' }
  }
  if (v.error === 'true' && !out.error && has('showHelp')) {
    out.showHelp = { value: v.showHelp, reason: "The error message takes the help text's place while the field is in error." }
  }
  // The entry's own rules see the values the shared rules leave, so an Error
  // held off by Disabled rules nothing out.
  const held = { ...v }
  for (const [key, lock] of Object.entries(out)) held[key] = lock.value
  return { ...out, ...entry.locks?.(held) }
}

/** The values the playground really shows: the chosen ones, with the locked controls held. */
export function effectiveValues(slug: string, v: Record<string, string>): Record<string, string> {
  const locks = locksFor(slug, v)
  const next = { ...v }
  for (const [key, lock] of Object.entries(locks)) next[key] = lock.value
  return next
}

const components = Inspera as unknown as Record<string, ComponentType<Record<string, unknown>>>

/**
 * The resolved props for a set of control values. `copy` swaps display text
 * (labels, options) for an in-context scene; an `undefined` in it drops the prop.
 */
export function propsFor(slug: string, v: Record<string, string>, copy?: Record<string, unknown>): Record<string, unknown> {
  return resolve({ ...registry[slug].props(v), ...copy }) as Record<string, unknown>
}

/** The playground element for a set of control values. */
export function renderLive(slug: string, v: Record<string, string>, copy?: Record<string, unknown>): ReactNode {
  const entry = registry[slug]
  const p = propsFor(slug, v, copy)
  return entry.render ? entry.render(p, v) : createElement(components[entry.component], p)
}

/** The gallery element: the static form of an overlay, otherwise the live one. */
export function renderStill(slug: string, v: Record<string, string>, copy?: Record<string, unknown>): ReactNode {
  const entry = registry[slug]
  const p = propsFor(slug, v, copy)
  if (entry.still) return entry.still(p, v)
  return entry.render ? entry.render(p, v) : createElement(components[entry.component], p)
}

/** The copyable JSX for a set of control values. */
export function snippetFor(slug: string, v: Record<string, string>): string {
  const entry = registry[slug]
  return entry.snippet ? entry.snippet(v) : toJsx(entry.component, entry.props(v))
}

const isBool = (c: ControlDef) => c.options.length === 2 && c.options.includes('true') && c.options.includes('false')

/**
 * The gallery, derived from the controls so it cannot leave any out: one
 * section per variant control, one for the on/off options, and one for states
 * (the simulated looks plus disabled / error / read-only). A matrix replaces
 * a variant section and the states with one grid.
 */
export function galleryFor(slug: string): { sections: GallerySection[]; matrix?: { rows: string; rowOptions: string[]; cols: GalleryCell[] } } {
  const entry = registry[slug]
  const d = entry.defaults
  const omit = new Set(entry.gallery?.omit ?? [])
  const sections: GallerySection[] = []
  const options: GalleryCell[] = []

  const sd = { ...d, ...entry.gallery?.stateBase }
  const states: GalleryCell[] = [{ label: 'Default', values: sd }]
  for (const [key, c] of Object.entries(entry.controls)) {
    if (omit.has(key)) continue
    if (c.group === 'preview') {
      for (const o of c.options) {
        if (o === sd[key] || o === 'None') continue
        states.push({ label: o, values: { ...sd, [key]: o }, simulated: true })
      }
    } else if (isBool(c) && STATE_KEYS.includes(key)) {
      states.push({ label: c.label, values: { ...sd, [key]: sd[key] === 'true' ? 'false' : 'true' } })
    }
  }

  const matrixRows = entry.gallery?.matrix?.rows
  for (const [key, c] of Object.entries(entry.controls)) {
    if (omit.has(key) || c.group === 'preview' || STATE_KEYS.includes(key) || key === matrixRows) continue
    if (isBool(c)) {
      const flipped = d[key] === 'true' ? 'false' : 'true'
      options.push({ label: d[key] === 'true' ? `Without ${c.label.toLowerCase()}` : c.label, values: { ...d, [key]: flipped } })
    } else {
      sections.push({ title: c.label, cells: c.options.map((o) => ({ label: o, values: { ...d, [key]: o } })) })
    }
  }
  if (options.length > 0) sections.push({ title: 'Options', cells: [{ label: 'Default', values: d }, ...options] })

  if (matrixRows) {
    return { sections, matrix: { rows: matrixRows, rowOptions: entry.controls[matrixRows].options, cols: states } }
  }
  if (states.length > 1) sections.push({ title: 'States', cells: states })
  // A component whose only controls are behaviour still gets its picture.
  if (sections.length === 0) sections.push({ title: 'Default', cells: [{ label: 'Default', values: d }] })
  return { sections }
}

// ---------------------------------------------------------------------------
// Demos - components whose live form needs state the docs have to hold.
// ---------------------------------------------------------------------------

function DialogDemo(p: Record<string, unknown>) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button label="Open dialog" intent="Primary" onClick={() => setOpen(true)} />
      <Dialog {...as<DialogProps>(p)} open={open} onClose={() => setOpen(false)} onConfirm={() => setOpen(false)} />
    </>
  )
}

function DrawerDemo(p: Record<string, unknown>) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button label="Open drawer" intent="Primary" onClick={() => setOpen(true)} />
      <Drawer {...as<DrawerProps>(p)} open={open} onClose={() => setOpen(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
          <p style={{ margin: 0 }}>Changes apply the next time a candidate opens the test.</p>
          <FormField label="Title">
            <TextInput label="Title" placeholder="Algebra Quiz" />
          </FormField>
          <Button label="Save changes" intent="Primary" onClick={() => setOpen(false)} />
        </div>
      </Drawer>
    </>
  )
}

function ToastDemo({ intent, position, withAction }: { intent: string; position: string; withAction: boolean }) {
  return (
    <div>
      <Button
        label="Show toast"
        intent="Primary"
        onClick={() =>
          toast('Assessment saved.', {
            intent: intent as never,
            actionLabel: withAction ? 'Undo' : undefined,
            onAction: () => {},
          })
        }
      />
      <ToastProvider position={position as never} />
    </div>
  )
}

function CommandPaletteDemo({ hotkey }: { hotkey: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <Button label={hotkey ? 'Open (Ctrl/Cmd K)' : 'Open palette'} intent="Outline" leadingIcon="search" onClick={() => setOpen(true)} />
      <CommandPalette commands={PALETTE_COMMANDS} hotkey={hotkey} open={open} onOpenChange={setOpen} />
    </div>
  )
}

const PALETTE_COMMANDS = [
  { id: 'new-test', label: 'Create new test', icon: 'add_circle', group: 'Actions', hint: 'C then T' },
  { id: 'new-qset', label: 'Create question set', icon: 'quiz', group: 'Actions' },
  { id: 'invite', label: 'Invite candidates', icon: 'group_add', group: 'Actions' },
  { id: 'go-deliver', label: 'Go to Deliver', icon: 'send', group: 'Navigate' },
  { id: 'go-monitor', label: 'Go to Monitor', icon: 'monitor_heart', group: 'Navigate' },
  { id: 'settings', label: 'Open settings', icon: 'settings', group: 'Navigate', hint: 'G then S' },
]

const badge = (label: string, intent: string) =>
  raw(`<Badge label="${label}" intent="${intent}" />`, <Badge label={label} intent={intent as never} />)

const MENU_ITEMS = [
  { label: 'Edit', icon: 'edit' },
  { label: 'Duplicate', icon: 'content_copy' },
  { label: 'Share', icon: 'share' },
  { label: '', divider: true },
  { label: 'Delete', icon: 'delete', danger: true },
]

// ---------------------------------------------------------------------------
// Entries
// ---------------------------------------------------------------------------

export const registry: Record<string, RegistryEntry> = {
  button: {
    component: 'Button',
    controls: {
      intent: { label: 'Intent', options: ['Primary', 'Secondary', 'Outline', 'Text', 'Success', 'Warning', 'Destructive'] },
      size: { label: 'Size', options: ['Small', 'Medium', 'Large'] },
      icon: { label: 'Icon', options: ['None', 'Leading', 'Trailing', 'Disclosure', 'Only'] },
      disabled: bool('Disabled'),
      preview: preview('Hover', 'Focused', 'Pressed'),
    },
    defaults: { intent: 'Primary', size: 'Medium', icon: 'None', disabled: 'false', preview: 'None' },
    props: (v) => ({
      label: v.icon === 'Only' ? 'Add question' : 'Button',
      intent: v.intent,
      size: v.size,
      leadingIcon: v.icon === 'Leading' || v.icon === 'Only' ? 'add' : undefined,
      trailingIcon: v.icon === 'Trailing' ? 'arrow_forward' : v.icon === 'Disclosure' ? 'expand_more' : undefined,
      iconOnly: v.icon === 'Only' || undefined,
      disabled: b(v.disabled),
      forceState: forced(v),
    }),
    gallery: { matrix: { rows: 'intent' } },
    layout: { cell: 150 },
  },

  'text-input': {
    component: 'TextInput',
    controls: {
      size: { label: 'Size', options: ['Small', 'Medium'] },
      leadingIcon: bool('Leading icon'),
      trailingIcon: bool('Trailing icon'),
      showHelp: { label: 'Help text', options: ['false', 'true'] },
      withValue: bool('With value'),
      disabled: bool('Disabled'),
      readOnly: bool('Read only'),
      error: bool('Error'),
      preview: preview('Hover', 'Focused'),
    },
    defaults: { size: 'Medium', leadingIcon: 'false', trailingIcon: 'false', showHelp: 'true', withValue: 'false', disabled: 'false', readOnly: 'false', error: 'false', preview: 'None' },
    props: (v) => ({
      label: 'Email address',
      placeholder: 'jane@inspera.com',
      defaultValue: b(v.withValue) ? 'jane.cooper@inspera.com' : undefined,
      size: v.size,
      leadingIcon: b(v.leadingIcon) ? 'mail' : undefined,
      trailingIcon: b(v.trailingIcon) ? 'close' : undefined,
      helpText: b(v.showHelp) ? "We'll never share your email." : undefined,
      errorText: b(v.error) ? 'Enter a valid email address.' : undefined,
      error: b(v.error),
      disabled: b(v.disabled),
      readOnly: b(v.readOnly),
      forceState: forced(v),
    }),
    layout: { width: 360, cell: 280 },
  },

  textarea: {
    component: 'Textarea',
    controls: {
      size: { label: 'Size', options: ['Small', 'Medium'] },
      showCount: bool('Character count'),
      showHelp: { label: 'Help text', options: ['false', 'true'] },
      withValue: bool('With value'),
      disabled: bool('Disabled'),
      readOnly: bool('Read only'),
      error: bool('Error'),
      preview: preview('Hover', 'Focused'),
    },
    defaults: { size: 'Medium', showCount: 'false', showHelp: 'true', withValue: 'false', disabled: 'false', readOnly: 'false', error: 'false', preview: 'None' },
    props: (v) => ({
      label: 'Feedback',
      placeholder: 'Share your thoughts...',
      defaultValue: b(v.withValue) ? 'The reading passage was clear, but question 4 was ambiguous.' : undefined,
      size: v.size,
      rows: 3,
      showCount: b(v.showCount),
      maxLength: b(v.showCount) ? 280 : undefined,
      helpText: b(v.showHelp) ? 'Keep it constructive.' : undefined,
      errorText: b(v.error) ? 'This field is required.' : undefined,
      error: b(v.error),
      disabled: b(v.disabled),
      readOnly: b(v.readOnly),
      forceState: forced(v),
    }),
    layout: { width: 400, cell: 300 },
  },

  checkbox: {
    component: 'Checkbox',
    controls: {
      checked: bool('Checked'),
      indeterminate: bool('Indeterminate'),
      withLabel: { label: 'Visible label', options: ['false', 'true'] },
      showDescription: bool('Description'),
      disabled: bool('Disabled'),
      error: bool('Error'),
      preview: preview('Hover', 'Focused', 'Pressed'),
    },
    defaults: { checked: 'false', indeterminate: 'false', withLabel: 'true', showDescription: 'false', disabled: 'false', error: 'false', preview: 'None' },
    props: (v) => ({
      label: 'Send me product updates',
      defaultChecked: b(v.checked),
      indeterminate: b(v.indeterminate),
      withLabel: b(v.withLabel),
      description: b(v.showDescription) ? 'One email a month. Unsubscribe at any time.' : undefined,
      disabled: b(v.disabled),
      error: b(v.error),
      errorText: b(v.error) ? 'Tick this box to continue.' : undefined,
      forceState: forced(v),
    }),
    locks: (v): Record<string, Lock> => ({
      ...(b(v.withLabel) ? {} : { showDescription: NO_LABEL_NO_DESCRIPTION }),
      ...(b(v.error)
        ? {
            checked: { value: 'false', reason: 'The error asks people to tick the box, so it shows unticked.' },
            indeterminate: { value: 'false', reason: 'The error asks people to tick the box, so it shows unticked.' },
            showDescription: { value: v.showDescription, reason: "The error message takes the description's place until the box is ticked." },
          }
        : {}),
    }),
    layout: { cell: 200 },
  },

  'checkbox-group': {
    component: 'CheckboxGroup',
    controls: {
      orientation: { label: 'Orientation', options: ['Vertical', 'Horizontal'] },
      disabled: bool('Disabled'),
      error: bool('Error'),
    },
    defaults: { orientation: 'Vertical', disabled: 'false', error: 'false' },
    props: (v) => ({
      label: 'Notifications',
      options: [
        { label: 'Email', value: 'email' },
        { label: 'SMS', value: 'sms' },
        { label: 'Push', value: 'push' },
      ],
      // Nothing chosen in error, so the boxes and the message agree.
      defaultValue: b(v.error) ? undefined : ['email'],
      orientation: v.orientation,
      errorText: b(v.error) ? 'Choose at least one channel.' : undefined,
      error: b(v.error),
      disabled: b(v.disabled),
    }),
    layout: { cell: 260 },
  },

  'radio-button': {
    component: 'RadioButton',
    controls: {
      selected: bool('Selected'),
      withLabel: { label: 'Visible label', options: ['false', 'true'] },
      showDescription: bool('Description'),
      disabled: bool('Disabled'),
      error: bool('Error'),
      preview: preview('Hover', 'Focused', 'Pressed'),
    },
    defaults: { selected: 'false', withLabel: 'true', showDescription: 'false', disabled: 'false', error: 'false', preview: 'None' },
    props: (v) => ({
      label: 'Standard delivery',
      name: 'delivery',
      defaultSelected: b(v.selected),
      withLabel: b(v.withLabel),
      description: b(v.showDescription) ? 'Arrives in 3 to 5 working days.' : undefined,
      disabled: b(v.disabled),
      error: b(v.error),
      forceState: forced(v),
    }),
    locks: (v): Record<string, Lock> => (b(v.withLabel) ? {} : { showDescription: NO_LABEL_NO_DESCRIPTION }),
    layout: { cell: 200 },
  },

  'radio-group': {
    component: 'RadioGroup',
    controls: {
      orientation: { label: 'Orientation', options: ['Vertical', 'Horizontal'] },
      disabled: bool('Disabled'),
      error: bool('Error'),
    },
    defaults: { orientation: 'Vertical', disabled: 'false', error: 'false' },
    props: (v) => ({
      label: 'Delivery speed',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Express', value: 'express' },
        { label: 'Overnight', value: 'overnight' },
      ],
      // Nothing chosen in error, so the radios and the message agree.
      defaultValue: b(v.error) ? undefined : 'standard',
      orientation: v.orientation,
      errorText: b(v.error) ? 'Choose a delivery speed.' : undefined,
      error: b(v.error),
      disabled: b(v.disabled),
    }),
    layout: { cell: 260 },
  },

  select: {
    component: 'Select',
    controls: {
      widthMode: { label: 'Width', options: ['Fixed', 'Hug'] },
      search: bool('Search'),
      withValue: bool('With value'),
      disabled: bool('Disabled'),
      error: bool('Error'),
      preview: preview('Hover', 'Focused', 'Open'),
    },
    defaults: { widthMode: 'Fixed', search: 'false', withValue: 'false', disabled: 'false', error: 'false', preview: 'None' },
    props: (v) => ({
      label: 'Country',
      options: ['Norway', 'Sweden', 'Denmark', 'Finland', 'Iceland'],
      defaultValue: b(v.withValue) ? 'Norway' : undefined,
      widthMode: v.widthMode,
      search: b(v.search),
      errorText: b(v.error) ? 'Choose a country.' : undefined,
      error: b(v.error),
      disabled: b(v.disabled),
      forceState: forced(v),
    }),
    layout: { minHeight: 380, align: 'start', cell: 260, openHeight: 330 },
  },

  toggle: {
    component: 'Toggle',
    controls: {
      size: { label: 'Size', options: ['Small', 'Medium'] },
      checked: bool('On'),
      withLabel: { label: 'Visible label', options: ['false', 'true'] },
      showDescription: bool('Description'),
      disabled: bool('Disabled'),
      preview: preview('Hover', 'Focused'),
    },
    defaults: { size: 'Medium', checked: 'false', withLabel: 'true', showDescription: 'false', disabled: 'false', preview: 'None' },
    props: (v) => ({
      label: 'Enable notifications',
      defaultChecked: b(v.checked),
      size: v.size,
      withLabel: b(v.withLabel),
      description: b(v.showDescription) ? 'Email and push, as soon as something changes.' : undefined,
      disabled: b(v.disabled),
      forceState: forced(v),
    }),
    locks: (v): Record<string, Lock> => (b(v.withLabel) ? {} : { showDescription: NO_LABEL_NO_DESCRIPTION }),
    layout: { cell: 220 },
  },

  'segmented-control': {
    component: 'SegmentedControl',
    controls: {
      size: { label: 'Size', options: ['Small', 'Medium'] },
      // 2-4: the range DESIGN.md allows. Beyond four, Tabs or a Select.
      segments: { label: 'Segments', options: ['2', '3', '4'] },
      fullWidth: bool('Full width'),
      disabled: bool('Disabled'),
    },
    defaults: { size: 'Medium', segments: '3', fullWidth: 'false', disabled: 'false' },
    props: (v) => ({
      label: 'Date range',
      items: SEGMENT_LABELS.slice(0, Number(v.segments)),
      defaultValue: 'Week',
      size: v.size,
      fullWidth: b(v.fullWidth),
      disabled: b(v.disabled),
    }),
    layout: { cell: 280 },
  },

  slider: {
    component: 'Slider',
    controls: {
      showValue: { label: 'Show value', options: ['false', 'true'] },
      showLabel: { label: 'Visible label', options: ['false', 'true'] },
      disabled: bool('Disabled'),
      preview: preview('Focused'),
    },
    defaults: { showValue: 'true', showLabel: 'true', disabled: 'false', preview: 'None' },
    props: (v) => ({
      label: 'Volume',
      min: 0,
      max: 100,
      defaultValue: 40,
      showValue: b(v.showValue),
      showLabel: b(v.showLabel),
      disabled: b(v.disabled),
      forceState: forced(v),
    }),
    layout: { width: 360, cell: 280 },
  },

  rating: {
    component: 'Rating',
    controls: {
      size: { label: 'Size', options: ['Small', 'Medium'] },
      readOnly: bool('Read only'),
      showValue: bool('Show value'),
    },
    defaults: { size: 'Medium', readOnly: 'false', showValue: 'false' },
    props: (v) => ({
      label: 'Question difficulty',
      defaultValue: 3,
      size: v.size,
      readOnly: b(v.readOnly),
      showValue: b(v.showValue),
    }),
    layout: { cell: 220 },
  },

  'date-picker': {
    component: 'DatePicker',
    controls: {
      withValue: bool('With value'),
      disabled: bool('Disabled'),
      error: bool('Error'),
      preview: preview('Hover', 'Focused', 'Open'),
    },
    defaults: { withValue: 'false', disabled: 'false', error: 'false', preview: 'None' },
    props: (v) => ({
      label: 'Due date',
      defaultValue: b(v.withValue) ? '2026-08-19' : undefined,
      errorText: b(v.error) ? 'Choose a date after today.' : undefined,
      error: b(v.error),
      disabled: b(v.disabled),
      forceState: forced(v),
    }),
    layout: { width: 320, minHeight: 440, align: 'start', cell: 320, openHeight: 420 },
  },

  'date-range-picker': {
    component: 'DateRangePicker',
    controls: {
      withValue: bool('With value'),
      disabled: bool('Disabled'),
      error: bool('Error'),
      preview: preview('Hover', 'Focused', 'Open'),
    },
    defaults: { withValue: 'false', disabled: 'false', error: 'false', preview: 'None' },
    props: (v) => ({
      label: 'Test window',
      defaultValue: b(v.withValue) ? { start: '2026-08-10', end: '2026-08-21' } : undefined,
      errorText: b(v.error) ? 'The window must be at least one day.' : undefined,
      error: b(v.error),
      disabled: b(v.disabled),
      forceState: forced(v),
    }),
    layout: { width: 560, minHeight: 440, align: 'start', cell: 560, openHeight: 420 },
  },

  'file-upload': {
    component: 'FileUpload',
    controls: {
      multiple: bool('Multiple'),
      disabled: bool('Disabled'),
      error: bool('Error'),
      preview: preview('Dragging'),
    },
    defaults: { multiple: 'false', disabled: 'false', error: 'false', preview: 'None' },
    props: (v) => ({
      label: 'Attachments',
      accept: 'image/*,.pdf',
      multiple: b(v.multiple),
      helpText: 'PNG, JPG or PDF up to 10MB',
      errorText: b(v.error) ? 'That file is larger than 10MB.' : undefined,
      error: b(v.error),
      disabled: b(v.disabled),
      onFiles: raw('handleFiles'),
      forceDragging: v.preview === 'Dragging' || undefined,
    }),
    layout: { width: 420, cell: 340 },
  },

  'number-input': {
    component: 'NumberInput',
    controls: {
      size: { label: 'Size', options: ['Small', 'Medium'] },
      suffix: { label: 'Suffix', options: ['None', 'min', '%'] },
      disabled: bool('Disabled'),
      readOnly: bool('Read only'),
      error: bool('Error'),
      preview: preview('Hover', 'Focused'),
    },
    defaults: { size: 'Medium', suffix: 'min', disabled: 'false', readOnly: 'false', error: 'false', preview: 'None' },
    props: (v) => ({
      label: 'Duration',
      defaultValue: 45,
      min: 0,
      max: 240,
      step: 5,
      size: v.size,
      suffix: v.suffix === 'None' ? undefined : v.suffix,
      helpText: 'Between 0 and 240.',
      errorText: b(v.error) ? 'Enter a valid duration.' : undefined,
      error: b(v.error),
      disabled: b(v.disabled),
      readOnly: b(v.readOnly),
      forceState: forced(v),
    }),
    layout: { width: 320, cell: 280 },
  },

  combobox: {
    component: 'Combobox',
    controls: {
      allowCustomValue: bool('Custom value'),
      withValue: bool('With value'),
      disabled: bool('Disabled'),
      error: bool('Error'),
      preview: preview('Hover', 'Focused', 'Open'),
    },
    defaults: { allowCustomValue: 'false', withValue: 'false', disabled: 'false', error: 'false', preview: 'None' },
    props: (v) => ({
      label: 'Assessment',
      options: [
        { value: 'algebra', label: 'Algebra Quiz', icon: 'quiz' },
        { value: 'biology', label: 'Biology Final', icon: 'science' },
        { value: 'history', label: 'History Midterm', icon: 'history_edu' },
        { value: 'physics', label: 'Physics Lab', icon: 'experiment' },
      ],
      placeholder: 'Search assessments...',
      defaultValue: b(v.withValue) ? 'biology' : undefined,
      allowCustomValue: b(v.allowCustomValue),
      errorText: b(v.error) ? 'Choose an assessment.' : undefined,
      error: b(v.error),
      disabled: b(v.disabled),
      forceState: forced(v),
    }),
    layout: { width: 360, minHeight: 360, align: 'start', cell: 320, openHeight: 330 },
  },

  'otp-input': {
    component: 'OtpInput',
    controls: {
      length: { label: 'Length', options: ['4', '6'] },
      withValue: bool('With value'),
      disabled: bool('Disabled'),
      error: bool('Error'),
      preview: preview('Focused'),
    },
    defaults: { length: '6', withValue: 'true', disabled: 'false', error: 'false', preview: 'None' },
    props: (v) => ({
      label: 'Verification code',
      length: Number(v.length),
      defaultValue: b(v.withValue) ? '123' : undefined,
      error: b(v.error),
      disabled: b(v.disabled),
      forceState: forced(v),
    }),
    layout: { cell: 380 },
  },

  'form-field': {
    component: 'FormField',
    controls: {
      required: bool('Required'),
      showError: bool('Error'),
    },
    defaults: { required: 'false', showError: 'false' },
    props: (v) => ({
      label: 'Email address',
      required: b(v.required),
      helpText: "We'll never share your email.",
      errorText: b(v.showError) ? 'Enter a valid email address.' : undefined,
      children: raw(
        '<TextInput label="Email address" placeholder="jane@inspera.com" />',
        <TextInput label="Email address" placeholder="jane@inspera.com" />,
      ),
    }),
    layout: { width: 360, cell: 300 },
  },

  // --- Data display ----------------------------------------------------------

  card: {
    component: 'Card',
    controls: {
      elevation: { label: 'Elevation', options: ['Flat', 'Raised', 'Outlined'] },
      padding: { label: 'Padding', options: ['Compact', 'Default', 'Spacious'] },
      interactive: bool('Interactive'),
      selected: bool('Selected'),
      preview: preview('Hover', 'Focused', 'Pressed'),
    },
    defaults: { elevation: 'Raised', padding: 'Default', interactive: 'false', selected: 'false', preview: 'None' },
    props: (v) => ({
      title: 'Algebra Quiz',
      body: '24 questions, 45 minutes. Covers linear equations and inequalities.',
      elevation: v.elevation,
      padding: v.padding,
      interactive: b(v.interactive),
      // A selected card is a toggle, which makes it interactive on its own.
      defaultSelected: b(v.selected) || undefined,
      onClick: b(v.interactive) ? raw('openQuiz') : undefined,
      forceState: forced(v),
    }),
    // Hover, focus and pressed exist only on an interactive card.
    gallery: { stateBase: { interactive: 'true' } },
    locks: (v): Record<string, Lock> =>
      !b(v.interactive) && !b(v.selected)
        ? { preview: { value: 'None', reason: 'Hover, focus and pressed exist only on a card people can click: turn on Interactive or Selected.' } }
        : {},
    layout: { width: 360, cell: 300 },
  },

  table: {
    component: 'Table',
    controls: {
      size: { label: 'Size', options: ['Compact', 'Default'] },
      striped: bool('Striped'),
      selectable: bool('Selectable'),
      hoverable: { label: 'Hover rows', options: ['false', 'true'] },
    },
    defaults: { size: 'Default', striped: 'false', selectable: 'false', hoverable: 'true' },
    props: (v) => ({
      caption: 'Assessments',
      columns: [
        { key: 'name', header: 'Assessment' },
        { key: 'items', header: 'Items', align: 'right' },
        { key: 'status', header: 'Status' },
      ],
      rows: [
        { name: 'Algebra Quiz', items: 24, status: badge('Live', 'Success') },
        { name: 'History Midterm', items: 40, status: badge('Draft', 'Neutral') },
        { name: 'Biology Final', items: 60, status: badge('Scheduled', 'Info') },
      ],
      size: v.size,
      striped: b(v.striped),
      selectable: b(v.selectable),
      hoverable: b(v.hoverable),
    }),
    layout: { width: 640, cell: 480 },
  },

  'data-grid': {
    component: 'DataGrid',
    controls: {
      size: { label: 'Size', options: ['Compact', 'Default'] },
      striped: bool('Striped'),
      selectable: { label: 'Selectable', options: ['false', 'true'] },
      rowActions: { label: 'Row actions', options: ['false', 'true'] },
      footer: { label: 'Footer', options: ['false', 'true'] },
    },
    defaults: { size: 'Default', striped: 'false', selectable: 'true', rowActions: 'true', footer: 'true' },
    props: (v) => ({
      caption: 'Tests',
      columns: [
        { key: 'name', header: 'Test', sortable: true },
        { key: 'candidates', header: 'Candidates', align: 'right', sortable: true },
        { key: 'status', header: 'Status' },
        { key: 'edited', header: 'Last edited', align: 'right', sortable: true },
      ],
      rows: [
        { id: 'algebra', name: 'Algebra Quiz', candidates: 128, status: badge('Live', 'Success'), edited: '12 Mar 2026' },
        { id: 'history', name: 'History Midterm', candidates: 96, status: badge('Draft', 'Neutral'), edited: '11 Mar 2026' },
        { id: 'biology', name: 'Biology Final', candidates: 210, status: badge('Scheduled', 'Info'), edited: '09 Mar 2026' },
      ],
      getRowId: raw('(row) => row.id', (row: Record<string, unknown>) => String(row.id)),
      size: v.size,
      striped: b(v.striped),
      selectable: b(v.selectable),
      rowActions: b(v.rowActions)
        ? raw(
            "(row) => (\n    <Menu\n      iconOnly\n      size=\"Small\"\n      label={`Actions for ${row.name}`}\n      placement=\"BottomEnd\"\n      items={[{ label: 'Edit', icon: 'edit' }, { label: 'Duplicate', icon: 'content_copy' }, { label: '', divider: true }, { label: 'Delete', icon: 'delete', danger: true }]}\n    />\n  )",
            (row: Record<string, unknown>) => (
              <Menu
                iconOnly
                size="Small"
                label={`Actions for ${String(row.name)}`}
                placement="BottomEnd"
                items={[{ label: 'Edit', icon: 'edit' }, { label: 'Duplicate', icon: 'content_copy' }, { label: '', divider: true }, { label: 'Delete', icon: 'delete', danger: true }]}
              />
            ),
          )
        : undefined,
      footer: b(v.footer),
      total: b(v.footer) ? 242 : undefined,
      pageCount: b(v.footer) ? 13 : undefined,
    }),
    layout: { width: 820, cell: 640 },
  },

  list: {
    component: 'List',
    controls: {
      size: { label: 'Size', options: ['Compact', 'Default'] },
      divided: { label: 'Dividers', options: ['false', 'true'] },
      interactive: bool('Interactive'),
    },
    defaults: { size: 'Default', divided: 'true', interactive: 'false' },
    props: (v) => ({
      items: [
        { primary: 'General settings', secondary: 'Language, timezone, theme', leadingIcon: 'settings', trailingIcon: 'chevron_right' },
        { primary: 'Notifications', secondary: 'Email and push preferences', leadingIcon: 'notifications', trailingIcon: 'chevron_right' },
        { primary: 'Security', secondary: 'Password and two-factor auth', leadingIcon: 'lock', trailingIcon: 'chevron_right' },
      ],
      size: v.size,
      divided: b(v.divided),
      interactive: b(v.interactive),
      onItemClick: b(v.interactive) ? raw('openSettings') : undefined,
    }),
    layout: { width: 440, cell: 400 },
  },

  accordion: {
    component: 'Accordion',
    controls: {
      selection: { label: 'Selection', options: ['Single', 'Multiple'] },
      iconPosition: { label: 'Chevron', options: ['Left', 'Right'] },
    },
    defaults: { selection: 'Single', iconPosition: 'Right' },
    props: (v) => ({
      items: [
        { title: 'What is Inspera?', content: 'A digital assessment platform for education and certification.' },
        { title: 'How are results scored?', content: 'Automatically for objective items, with manual grading for essays.' },
        { title: 'Is it accessible?', content: 'Yes - components follow WCAG 2.1 AA guidance.' },
      ],
      defaultValue: [0],
      selection: v.selection,
      iconPosition: v.iconPosition,
    }),
    layout: { width: 480, cell: 400 },
  },

  badge: {
    component: 'Badge',
    controls: {
      intent: { label: 'Intent', options: ['Neutral', 'Info', 'Success', 'Warning', 'Error'] },
      size: { label: 'Size', options: ['Small', 'Medium'] },
      withIcon: bool('Icon'),
    },
    defaults: { intent: 'Neutral', size: 'Medium', withIcon: 'false' },
    props: (v) => ({ label: v.intent, intent: v.intent, size: v.size, withIcon: b(v.withIcon) }),
    layout: { cell: 140 },
  },

  tag: {
    component: 'Tag',
    controls: {
      intent: { label: 'Intent', options: ['Neutral', 'Info', 'Success', 'Warning', 'Error'] },
      size: { label: 'Size', options: ['Small', 'Medium'] },
      removable: bool('Removable'),
    },
    defaults: { intent: 'Neutral', size: 'Medium', removable: 'false' },
    props: (v) => ({
      label: v.intent,
      intent: v.intent,
      size: v.size,
      leadingIcon: 'label',
      removable: b(v.removable),
      onRemove: b(v.removable) ? raw('handleRemove') : undefined,
    }),
    layout: { cell: 150 },
  },

  avatar: {
    component: 'Avatar',
    controls: {
      size: { label: 'Size', options: ['Small', 'Medium', 'Large'] },
      content: { label: 'Content', options: ['Initials', 'Image', 'Icon'] },
      status: { label: 'Status', options: ['None', 'Online', 'Offline', 'Busy'] },
    },
    defaults: { size: 'Medium', content: 'Initials', status: 'None' },
    props: (v) => ({
      name: v.content === 'Icon' ? 'Guest user' : 'Jane Cooper',
      src: v.content === 'Image' ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=112&h=112&fit=crop&auto=format' : undefined,
      icon: v.content === 'Icon' ? 'person' : undefined,
      size: v.size,
      status: v.status,
    }),
    layout: { cell: 120 },
  },

  'avatar-group': {
    component: 'AvatarGroup',
    controls: {
      size: { label: 'Size', options: ['Small', 'Medium', 'Large'] },
      max: { label: 'Max shown', options: ['3', '4', '5'] },
    },
    defaults: { size: 'Medium', max: '4' },
    props: (v) => ({
      avatars: [
        { name: 'Ada Lovelace' },
        { name: 'Linus Torvalds' },
        { name: 'Grace Hopper' },
        { name: 'Alan Turing' },
        { name: 'Katherine Johnson' },
        { name: 'Edsger Dijkstra' },
      ],
      max: Number(v.max),
      size: v.size,
    }),
    layout: { cell: 240 },
  },

  stat: {
    component: 'Stat',
    controls: {
      deltaIntent: { label: 'Trend', options: ['Up', 'Down', 'Neutral'] },
      withIcon: { label: 'Icon', options: ['false', 'true'] },
    },
    defaults: { deltaIntent: 'Up', withIcon: 'true' },
    props: (v) => ({
      label: 'Active candidates',
      value: '12,480',
      delta: '+8.2% vs last week',
      deltaIntent: v.deltaIntent,
      icon: b(v.withIcon) ? 'group' : undefined,
    }),
    layout: { cell: 260 },
  },

  divider: {
    component: 'Divider',
    controls: {
      orientation: { label: 'Orientation', options: ['Horizontal', 'Vertical'] },
      spacing: { label: 'Spacing', options: ['Compact', 'Default', 'Spacious'] },
      withLabel: bool('Label'),
    },
    defaults: { orientation: 'Horizontal', spacing: 'Default', withLabel: 'false' },
    props: (v) => ({
      orientation: v.orientation,
      spacing: v.spacing,
      label: b(v.withLabel) && v.orientation === 'Horizontal' ? 'OR' : undefined,
    }),
    locks: (v): Record<string, Lock> =>
      v.orientation === 'Vertical' ? { withLabel: { value: 'false', reason: 'A vertical divider has no room for a label. Labels go on horizontal dividers.' } } : {},
    // Shown between content so the rule has something to separate. The
    // horizontal one used to sit in a flex *row*, so "Above" and "Below"
    // rendered beside it on one line.
    render: (p) =>
      p.orientation === 'Vertical' ? (
        <div style={{ display: 'flex', alignItems: 'center', height: 48, fontSize: 14 }}>
          <span>Left</span>
          <Divider {...as<DividerProps>(p)} />
          <span>Right</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', fontSize: 14 }}>
          <span>Above</span>
          <Divider {...as<DividerProps>(p)} />
          <span>Below</span>
        </div>
      ),
    layout: { width: 320, cell: 240 },
  },

  'empty-state': {
    component: 'EmptyState',
    controls: {
      size: { label: 'Size', options: ['Small', 'Medium'] },
      actionIntent: { label: 'Action intent', options: ['Primary', 'Secondary'] },
      withAction: { label: 'Action', options: ['false', 'true'] },
    },
    defaults: { size: 'Medium', actionIntent: 'Primary', withAction: 'true' },
    props: (v) => ({
      icon: 'inbox',
      title: 'No assessments yet',
      description: 'Create your first assessment to get started.',
      actionLabel: b(v.withAction) ? 'New assessment' : undefined,
      onAction: b(v.withAction) ? raw('createAssessment') : undefined,
      actionIntent: b(v.withAction) ? v.actionIntent : undefined,
      size: v.size,
    }),
    locks: (v): Record<string, Lock> => (b(v.withAction) ? {} : { actionIntent: { value: 'Primary', reason: 'Turn on Action to choose how it looks.' } }),
    layout: { cell: 320 },
  },

  // --- Feedback --------------------------------------------------------------

  alert: {
    component: 'Alert',
    controls: {
      intent: { label: 'Intent', options: ['Info', 'Success', 'Warning', 'Error'] },
      background: { label: 'Tinted', options: ['false', 'true'] },
      withTitle: { label: 'Title', options: ['false', 'true'] },
      withAction: bool('Action'),
      dismissible: bool('Dismissible'),
    },
    defaults: { intent: 'Info', background: 'true', withTitle: 'true', withAction: 'false', dismissible: 'false' },
    props: (v) => ({
      title: b(v.withTitle) ? 'Grading in progress' : undefined,
      message: 'Results will be released once every essay is marked.',
      intent: v.intent,
      background: b(v.background),
      actionLabel: b(v.withAction) ? 'View details' : undefined,
      onAction: b(v.withAction) ? raw('openDetails') : undefined,
      dismissible: b(v.dismissible),
      onClose: b(v.dismissible) ? raw('handleClose') : undefined,
    }),
    layout: { width: 520, cell: 400 },
  },

  dialog: {
    component: 'Dialog',
    controls: {
      size: { label: 'Size', options: ['Medium', 'Large'] },
      hasCloseButton: { label: 'Close button', options: ['false', 'true'] },
      hasActions: { label: 'Actions', options: ['false', 'true'] },
      confirmIntent: { label: 'Confirm intent', options: ['Primary', 'Destructive'] },
      footerStart: bool('Footer status'),
    },
    defaults: { size: 'Medium', hasCloseButton: 'true', hasActions: 'true', confirmIntent: 'Primary', footerStart: 'false' },
    // A destructive confirmation is a different message, not a red Publish.
    props: (v) => v.confirmIntent === 'Destructive'
      ? {
          open: raw('open'),
          title: 'Delete assessment?',
          size: v.size,
          hasCloseButton: b(v.hasCloseButton),
          hasActions: b(v.hasActions),
          confirmLabel: 'Delete assessment',
          confirmIntent: v.confirmIntent,
          footerStart: b(v.footerStart) ? '248 responses' : undefined,
          onClose: raw('() => setOpen(false)'),
          onConfirm: raw('handleDelete'),
          children: "Candidates' responses will be deleted. You can't undo this.",
        }
      : {
          open: raw('open'),
          title: 'Publish assessment?',
          size: v.size,
          hasCloseButton: b(v.hasCloseButton),
          hasActions: b(v.hasActions),
          confirmLabel: 'Publish',
          confirmIntent: v.confirmIntent,
          footerStart: b(v.footerStart) ? 'Starts 14 Oct 2026, 09:00' : undefined,
          onClose: raw('() => setOpen(false)'),
          onConfirm: raw('handlePublish'),
          children: 'Candidates will be able to start it at the scheduled time.',
        },
    // The real overlay: the snippet teaches `open` / `onClose`, so the preview
    // has to be the thing that opens and closes. The gallery shows the panel.
    locks: (v): Record<string, Lock> =>
      v.hasActions === 'false'
        ? {
            hasCloseButton: { value: 'true', reason: 'Without actions, the close button is the only way out of the dialog.' },
            confirmIntent: { value: 'Primary', reason: 'Without actions there is nothing to confirm.' },
            footerStart: { value: 'false', reason: 'Without actions there is no footer for the status to sit in.' },
          }
        : {},
    render: (p) => <DialogDemo {...p} />,
    still: (p) => <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}><Dialog {...as<DialogProps>(p)} open embedded /></div>,
    layout: { cell: 600 },
  },

  drawer: {
    component: 'Drawer',
    controls: {
      side: { label: 'Side', options: ['Left', 'Right', 'Bottom'] },
      size: { label: 'Size', options: ['Small', 'Medium', 'Large'] },
      hasCloseButton: { label: 'Close button', options: ['false', 'true'] },
    },
    defaults: { side: 'Right', size: 'Medium', hasCloseButton: 'true' },
    props: (v) => ({
      open: raw('open'),
      title: 'Assessment details',
      side: v.side,
      size: v.size,
      hasCloseButton: b(v.hasCloseButton),
      onClose: raw('() => setOpen(false)'),
      children: raw('{children}'),
    }),
    render: (p) => <DrawerDemo {...p} />,
    // Each cell at its own size, so the Size cells show the three widths -
    // 320, 400 and 560 - side by side in a cell wide enough for the largest.
    // Every preview is cut to one height: a bottom sheet's size is a height,
    // which the Side cells do not compare.
    still: (p) => (
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Drawer {...as<DrawerProps>(p)} open embedded style={{ height: 200 }}>
          Algebra Quiz, 24 questions. Created by Jane Cooper.
        </Drawer>
      </div>
    ),
    layout: { cell: 600 },
  },

  popover: {
    component: 'Popover',
    controls: {
      placement: { label: 'Placement', options: ['Top', 'Bottom', 'Left', 'Right'] },
    },
    defaults: { placement: 'Bottom' },
    props: (v) => ({
      trigger: raw(
        '<Button label="Filters" intent="Outline" trailingIcon="expand_more" />',
        <Button label="Filters" intent="Outline" trailingIcon="expand_more" />,
      ),
      title: 'Filter results',
      content: raw(
        '<FilterForm />',
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 14 }}>
          <span>Show only:</span>
          <Checkbox label="Only published" />
          <Checkbox label="Assigned to me" />
        </div>,
      ),
      placement: v.placement,
    }),
    // Live and closable, opened on arrival so there is something to see.
    render: (p) => <Popover {...as<PopoverProps>(p)} defaultOpen />,
    still: (p) => <Popover {...as<PopoverProps>(p)} forceVisible />,
    // Left and Right panels sit beside the trigger, so each cell takes a row.
    layout: { minHeight: 320, cell: 720, cellHeight: 300 },
  },

  snackbar: {
    component: 'Snackbar',
    controls: {
      intent: { label: 'Intent', options: ['Neutral', 'Info', 'Success', 'Warning', 'Error'] },
      withAction: bool('Action'),
      dismissible: { label: 'Dismissible', options: ['false', 'true'] },
    },
    defaults: { intent: 'Neutral', withAction: 'false', dismissible: 'true' },
    props: (v) => ({
      message: 'Assessment saved.',
      intent: v.intent,
      actionLabel: b(v.withAction) ? 'Undo' : undefined,
      onAction: b(v.withAction) ? raw('handleUndo') : undefined,
      dismissible: b(v.dismissible),
      onClose: b(v.dismissible) ? raw('handleClose') : undefined,
    }),
    layout: { width: 520, cell: 380 },
  },

  toast: {
    component: 'ToastProvider',
    controls: {
      intent: { label: 'Intent', options: ['Neutral', 'Info', 'Success', 'Warning', 'Error'] },
      position: { label: 'Position', options: ['TopLeft', 'TopCenter', 'TopRight', 'BottomLeft', 'BottomCenter', 'BottomRight'] },
      withAction: bool('Action'),
    },
    defaults: { intent: 'Success', position: 'BottomRight', withAction: 'false' },
    props: (v) => ({ position: v.position }),
    render: (_p, v) => <ToastDemo intent={v.intent} position={v.position} withAction={b(v.withAction)} />,
    // What a toast looks like on screen: a dismissible Snackbar.
    still: (_p, v) => (
      <Snackbar
        message="Assessment saved."
        intent={v.intent as never}
        actionLabel={b(v.withAction) ? 'Undo' : undefined}
        dismissible
      />
    ),
    snippet: (v) =>
      `// Mount once near your app root:\n<ToastProvider${v.position === 'BottomRight' ? '' : ` position="${v.position}"`} />\n\n// Then call from anywhere:\ntoast('Assessment saved.', {\n  intent: '${v.intent}',${b(v.withAction) ? "\n  actionLabel: 'Undo',\n  onAction: handleUndo," : ''}\n})`,
    gallery: { omit: ['position'] },
    layout: { cell: 380 },
  },

  'command-palette': {
    component: 'CommandPalette',
    controls: {
      hotkey: { label: 'Ctrl/Cmd K', options: ['false', 'true'] },
    },
    defaults: { hotkey: 'true' },
    props: (v) => ({
      open: raw('open'),
      onOpenChange: raw('setOpen'),
      hotkey: b(v.hotkey),
      commands: raw(
        "[\n    { id: 'new-test', label: 'Create new test', icon: 'add_circle', group: 'Actions', onSelect: createTest },\n    { id: 'go-monitor', label: 'Go to Monitor', icon: 'monitor_heart', group: 'Navigate', onSelect: () => navigate('/monitor') },\n  ]",
        PALETTE_COMMANDS,
      ),
    }),
    render: (_p, v) => <CommandPaletteDemo hotkey={b(v.hotkey)} />,
    still: () => <CommandPalette commands={PALETTE_COMMANDS} embedded hotkey={false} />,
    gallery: { omit: ['hotkey'] },
    layout: { cell: 580 },
  },

  tooltip: {
    component: 'Tooltip',
    controls: {
      placement: { label: 'Placement', options: ['Top', 'Bottom', 'Left', 'Right'] },
      theme: { label: 'Theme', options: ['Dark', 'Light'] },
      variant: { label: 'Variant', options: ['Default', 'Accessibility'] },
      preview: { label: 'Preview state', options: ['None', 'Pinned open'], group: 'preview' },
    },
    defaults: { placement: 'Top', theme: 'Dark', variant: 'Default', preview: 'Pinned open' },
    props: (v) => ({
      content: 'Get help with this page',
      placement: v.placement,
      theme: v.theme,
      variant: v.variant,
      forceVisible: v.preview === 'Pinned open' || undefined,
      children: raw(
        '<Button label="Help" intent="Outline" leadingIcon="help" iconOnly />',
        <Button label="Help" intent="Outline" leadingIcon="help" iconOnly />,
      ),
    }),
    still: (p) => (
      <div style={{ padding: 36 }}>
        <Tooltip {...as<TooltipProps>(p)} forceVisible />
      </div>
    ),
    render: (p) => (
      <div style={{ padding: 56 }}>
        <Tooltip {...as<TooltipProps>(p)} />
      </div>
    ),
    gallery: { omit: ['preview'] },
    layout: { minHeight: 240, cell: 560, cellHeight: 170 },
  },

  progress: {
    component: 'Progress',
    controls: {
      variant: { label: 'Variant', options: ['Linear', 'Circular'] },
      intent: { label: 'Intent', options: ['Primary', 'Success', 'Warning', 'Error'] },
      size: { label: 'Size', options: ['Small', 'Medium', 'Large'] },
      indeterminate: bool('Indeterminate'),
      showValue: bool('Show value'),
    },
    defaults: { variant: 'Linear', intent: 'Primary', size: 'Medium', indeterminate: 'false', showValue: 'false' },
    props: (v) => ({
      label: 'Uploading attachments',
      value: b(v.indeterminate) ? undefined : 60,
      variant: v.variant,
      intent: v.intent,
      size: v.size,
      indeterminate: b(v.indeterminate),
      showValue: b(v.showValue),
    }),
    locks: (v): Record<string, Lock> =>
      b(v.indeterminate)
        ? {
            showValue: { value: 'false', reason: 'An indeterminate bar has no value to show.' },
            intent: { value: 'Primary', reason: 'Indeterminate means the work is still going. Success, Warning and Error describe how it went.' },
          }
        : {},
    render: (p) => <div style={{ width: p.variant === 'Linear' ? '100%' : 'auto' }}>{createElement(Inspera.Progress, p as never)}</div>,
    layout: { width: 360, cell: 240 },
  },

  spinner: {
    component: 'Spinner',
    controls: {
      size: { label: 'Size', options: ['Small', 'Medium', 'Large'] },
      intent: { label: 'Intent', options: ['Primary', 'Neutral', 'Inverse'] },
    },
    defaults: { size: 'Medium', intent: 'Primary' },
    props: (v) => ({ size: v.size, intent: v.intent, label: 'Loading assessments' }),
    // Inverse is for dark surfaces, so it is shown on one.
    render: (p) =>
      p.intent === 'Inverse' ? (
        <div style={{ background: 'var(--gray-900)', padding: 24, borderRadius: 'var(--radius-md)', display: 'inline-flex' }}>
          <Spinner {...as<SpinnerProps>(p)} />
        </div>
      ) : (
        <Spinner {...as<SpinnerProps>(p)} />
      ),
    layout: { cell: 140 },
  },

  skeleton: {
    component: 'Skeleton',
    controls: {
      variant: { label: 'Variant', options: ['Text', 'Rect', 'Circle'] },
      lines: { label: 'Lines', options: ['1', '3', '5'] },
    },
    defaults: { variant: 'Text', lines: '3' },
    props: (v) => ({
      variant: v.variant,
      lines: v.variant === 'Text' ? Number(v.lines) : undefined,
      width: v.variant === 'Circle' ? 48 : undefined,
      height: v.variant === 'Circle' ? 48 : v.variant === 'Rect' ? 80 : undefined,
    }),
    render: (p) => <div style={{ width: 260 }}><Skeleton {...as<SkeletonProps>(p)} /></div>,
    layout: { cell: 280 },
  },

  // --- Navigation --------------------------------------------------------------

  tabs: {
    component: 'Tabs',
    controls: {
      variant: { label: 'Variant', options: ['Underline', 'Contained'] },
      size: { label: 'Size', options: ['Small', 'Medium'] },
      fullWidth: bool('Full width'),
    },
    defaults: { variant: 'Underline', size: 'Medium', fullWidth: 'false' },
    props: (v) => ({
      items: [{ label: 'Overview' }, { label: 'Questions' }, { label: 'Settings' }, { label: 'Results' }],
      label: 'Assessment sections',
      variant: v.variant,
      size: v.size,
      fullWidth: b(v.fullWidth),
    }),
    layout: { width: 520, cell: 480 },
  },

  breadcrumb: {
    component: 'Breadcrumb',
    controls: {
      separator: { label: 'Separator', options: ['Chevron', 'Slash'] },
      size: { label: 'Size', options: ['Small', 'Medium'] },
    },
    defaults: { separator: 'Chevron', size: 'Medium' },
    props: (v) => ({
      items: [
        { label: 'Home', href: '/' },
        { label: 'Assessments', href: '/assessments' },
        { label: 'Mathematics', href: '/assessments/mathematics' },
        'Algebra Quiz',
      ],
      separator: v.separator,
      size: v.size,
    }),
    // The docs are one page, so the links here should not navigate away.
    render: (p) => <div onClickCapture={(e) => e.preventDefault()}>{createElement(Inspera.Breadcrumb, p as never)}</div>,
    layout: { width: 480, cell: 400 },
  },

  pagination: {
    component: 'Pagination',
    controls: {
      size: { label: 'Size', options: ['Small', 'Medium'] },
      showEdges: { label: 'First / last', options: ['false', 'true'] },
    },
    defaults: { size: 'Medium', showEdges: 'true' },
    props: (v) => ({
      pageCount: 12,
      defaultPage: 4,
      size: v.size,
      showEdges: b(v.showEdges),
      onChange: raw('loadPage'),
    }),
    layout: { width: 520, cell: 440 },
  },

  menu: {
    component: 'Menu',
    controls: {
      placement: { label: 'Placement', options: ['BottomStart', 'BottomEnd'] },
      size: { label: 'Size', options: ['Small', 'Medium'] },
      iconOnly: bool('Icon only'),
    },
    defaults: { placement: 'BottomStart', size: 'Medium', iconOnly: 'false' },
    props: (v) => ({
      // An icon-only trigger shows no text, so its name has to carry the context.
      label: b(v.iconOnly) ? 'Actions for Algebra Quiz' : 'Actions',
      items: MENU_ITEMS,
      placement: v.placement,
      size: v.size,
      iconOnly: b(v.iconOnly),
      onSelect: raw('handleSelect'),
    }),
    render: (p) => <Menu {...as<MenuProps>(p)} defaultOpen />,
    still: (p) => <Menu {...as<MenuProps>(p)} forceVisible />,
    layout: { minHeight: 300, align: 'start', cell: 300, cellHeight: 280 },
  },

  stepper: {
    component: 'Stepper',
    controls: {
      orientation: { label: 'Orientation', options: ['Horizontal', 'Vertical'] },
      size: { label: 'Size', options: ['Small', 'Medium'] },
      activeStep: { label: 'Active step', options: ['0', '1', '2', '3'] },
    },
    defaults: { orientation: 'Horizontal', size: 'Medium', activeStep: '1' },
    props: (v) => ({
      steps: [
        { label: 'Details', description: 'Assessment info' },
        { label: 'Questions', description: 'Add content' },
        { label: 'Settings', description: 'Rules & timing' },
        { label: 'Review', description: 'Publish' },
      ],
      activeStep: Number(v.activeStep),
      orientation: v.orientation,
      size: v.size,
    }),
    layout: { width: 640, cell: 520 },
  },

  link: {
    component: 'Link',
    controls: {
      intent: { label: 'Intent', options: ['Default', 'Muted'] },
      size: { label: 'Size', options: ['Small', 'Medium'] },
      underline: { label: 'Underline', options: ['Hover', 'Always', 'None'] },
      leadingIcon: bool('Leading icon'),
      external: bool('External'),
      disabled: bool('Disabled'),
    },
    defaults: { intent: 'Default', size: 'Medium', underline: 'Hover', leadingIcon: 'false', external: 'false', disabled: 'false' },
    props: (v) => ({
      href: '/docs',
      label: 'Learn more',
      intent: v.intent,
      size: v.size,
      underline: v.underline,
      leadingIcon: b(v.leadingIcon) ? 'open_in_browser' : undefined,
      external: b(v.external),
      disabled: b(v.disabled),
    }),
    locks: (v): Record<string, Lock> =>
      b(v.disabled) ? { intent: { value: v.intent, reason: 'A disabled link is greyed out, whatever its intent.' } } : {},
    render: (p) => <span onClickCapture={(e) => e.preventDefault()}>{createElement(Inspera.Link, p as never)}</span>,
    layout: { cell: 180 },
  },
}
