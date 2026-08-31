/**
 * Framework-free visual contracts.
 *
 * The prop API in `components.ts` answers "how do I call this component".
 * It only helps someone who already *has* the component. In an AI builder
 * that cannot install `@inspera/components` — v0, Lovable, Bolt, a fresh
 * Figma Make file — the model hand-rolls the element instead, and every
 * visual fact the API doc leaves out (radius, fill, padding, weight, the
 * hover shade) gets filled in from that tool's defaults. That is the whole
 * reason a pasted spec produces an off-brand button.
 *
 * A recipe closes the gap: the same component expressed as plain HTML plus
 * plain CSS, with nothing left to infer. `scripts/audit-recipes.ts` renders
 * the real React component and the recipe side by side in Chrome and fails
 * if any computed value diverges, so this cannot quietly drift out of sync
 * with the implementation it describes.
 */
import { type ReactElement } from 'react'
import Alert from '../components/inspera/Alert'
import Avatar from '../components/inspera/Avatar'
import AvatarGroup from '../components/inspera/AvatarGroup'
import Breadcrumb from '../components/inspera/Breadcrumb'
import Progress from '../components/inspera/Progress'
import Badge from '../components/inspera/Badge'
import Card from '../components/inspera/Card'
import Checkbox from '../components/inspera/Checkbox'
import Accordion from '../components/inspera/Accordion'
import Dialog from '../components/inspera/Dialog'
import Drawer from '../components/inspera/Drawer'
import Popover from '../components/inspera/Popover'
import Tooltip from '../components/inspera/Tooltip'
import CheckboxGroup from '../components/inspera/CheckboxGroup'
import List from '../components/inspera/List'
import Menu from '../components/inspera/Menu'
import Pagination from '../components/inspera/Pagination'
import Stepper from '../components/inspera/Stepper'
import Table from '../components/inspera/Table'
import Tabs from '../components/inspera/Tabs'
import DatePicker from '../components/inspera/DatePicker'
import FileUpload from '../components/inspera/FileUpload'
import FormField from '../components/inspera/FormField'
import RadioGroup from '../components/inspera/RadioGroup'
import Select from '../components/inspera/Select'
import OtpInput from '../components/inspera/OtpInput'
import Rating from '../components/inspera/Rating'
import SegmentedControl from '../components/inspera/SegmentedControl'
import Slider from '../components/inspera/Slider'
import RadioButton from '../components/inspera/RadioButton'
import TextInput from '../components/inspera/TextInput'
import Textarea from '../components/inspera/Textarea'
import Toggle from '../components/inspera/Toggle'
import Link from '../components/inspera/Link'
import Snackbar from '../components/inspera/Snackbar'
import Button from '../components/inspera/Button'
import Divider from '../components/inspera/Divider'
import EmptyState from '../components/inspera/EmptyState'
import Skeleton from '../components/inspera/Skeleton'
import Spinner from '../components/inspera/Spinner'
import Stat from '../components/inspera/Stat'
import Tag from '../components/inspera/Tag'

export interface Recipe {
  /** Root class the recipe defines, e.g. `inspera-btn`. */
  className: string
  /** Self-contained CSS. Every `var(--…)` it uses is emitted alongside it. */
  css: string
  /** Canonical markup, one line per realistic usage. Goes in the spec doc. */
  html: string
  /**
   * Live markup for the playground, driven by the same control values as the
   * JSX snippet. Static example markup would go stale the moment someone moved
   * a control — the exact defect the JSX snippets were just fixed for.
   */
  markup: (v: Record<string, string>) => string
  /**
   * The real component, rendered from those same control values.
   *
   * This is what makes a recipe checkable rather than merely plausible:
   * `scripts/audit-recipes.ts` renders this and `markup` side by side in
   * Chrome and compares what the engine computes for both, element by element.
   * Without it a recipe is a description that drifts the first time someone
   * edits the component.
   */
  component: (v: Record<string, string>) => ReactElement
  /**
   * Computed properties to compare, on top of the shared set in the audit.
   * Add whatever decides whether *this* component looks right — `stroke-width`
   * for a ring, `grid-template-columns` for a calendar.
   */
  props?: string[]
  /**
   * Custom-property pairs whose resolved colours must match: `[label,
   * componentProperty, recipeProperty]`. Hover and pressed are pseudo-classes,
   * so the audit resolves the variables behind them rather than driving a
   * pointer.
   */
  vars?: [label: string, component: string, recipe: string][]
  /**
   * Compare the root element only. For a recipe whose DOM shape legitimately
   * differs from the component's — a wrapper the component needs and plain
   * HTML does not. Use sparingly: the parallel walk is the point.
   */
  rootOnly?: boolean
  /**
   * Slugs of recipes whose CSS this one builds on — an empty state that uses
   * the canonical button, say. The generator emits their CSS alongside this
   * one, so the published block is complete: a tool that copies it gets a real
   * button, not an unstyled one.
   */
  composes?: string[]
  /** Facts a model gets wrong when left to guess. */
  notes?: string[]
}

const button: Recipe = {
  className: 'inspera-btn',
  css: `.inspera-btn {
  /* Fill, text and border come from the intent modifier below. */
  --btn-bg: var(--primary);
  --btn-fg: var(--white);
  --btn-border: transparent;
  --btn-shadow: var(--effect-button-shadow);
  --btn-bg-hover: color-mix(in srgb, var(--btn-bg) 90%, black);
  --btn-bg-active: color-mix(in srgb, var(--btn-bg) 82%, black);
  --btn-shadow-hover: inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 2px 6px rgba(0, 64, 128, 0.24);
  --btn-shadow-active: inset 0 1px 2px rgba(0, 0, 0, 0.24);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  min-width: 80px;
  padding: 0 16px;
  border-radius: var(--radius-sm);
  border: var(--border-width-default) solid var(--btn-border);
  background: var(--btn-bg);
  color: var(--btn-fg);
  box-shadow: var(--btn-shadow);
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.25;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background var(--duration-fast) var(--easing-standard),
    border-color var(--duration-fast) var(--easing-standard),
    box-shadow var(--duration-fast) var(--easing-standard),
    transform var(--duration-fast) var(--easing-standard);
}

/* Sizes change height, padding and gap only — never the 16px type. */
.inspera-btn--small { height: 32px; padding: 0 12px; gap: 6px; }
.inspera-btn--large { height: 48px; padding: 0 24px; gap: 10px; }

/* Solid intents differ only in fill; hover and pressed derive from it. */
.inspera-btn--primary     { --btn-bg: var(--primary); }
.inspera-btn--success     { --btn-bg: var(--success); }
.inspera-btn--warning     { --btn-bg: var(--warning); }
.inspera-btn--destructive { --btn-bg: var(--error); }
.inspera-btn--secondary {
  --btn-bg: var(--gray-100);
  --btn-fg: var(--gray-900);
  --btn-border: var(--gray-700);
}

/* Outline and Text carry no fill and no shadow; they tint on interaction. */
.inspera-btn--outline,
.inspera-btn--text {
  --btn-bg: transparent;
  --btn-fg: var(--primary);
  --btn-shadow: none;
  --btn-shadow-hover: none;
  --btn-shadow-active: none;
  --btn-bg-hover: color-mix(in srgb, var(--primary) 8%, transparent);
  --btn-bg-active: color-mix(in srgb, var(--primary) 12%, transparent);
}
.inspera-btn--outline { --btn-border: var(--primary); }

.inspera-btn:hover:not(:disabled) {
  background: var(--btn-bg-hover);
  box-shadow: var(--btn-shadow-hover);
}
.inspera-btn:active:not(:disabled) {
  background: var(--btn-bg-active);
  box-shadow: var(--btn-shadow-active);
  transform: translateY(1px);
}
.inspera-btn:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}
.inspera-btn:disabled { opacity: 0.38; cursor: not-allowed; }

.inspera-btn .material-symbols-outlined { font-size: 20px; }`,
  html: `<button type="button" class="inspera-btn inspera-btn--primary">Save</button>

<button type="button" class="inspera-btn inspera-btn--secondary inspera-btn--small">Cancel</button>

<button type="button" class="inspera-btn inspera-btn--destructive">Delete test</button>

<!-- Icon + Text. The icon is Material Symbols Outlined, never another set. -->
<button type="button" class="inspera-btn inspera-btn--primary">
  <span class="material-symbols-outlined" aria-hidden="true">add</span>
  <span>Add question</span>
</button>

<!-- Icon-only still needs an accessible name. -->
<button type="button" class="inspera-btn inspera-btn--text" aria-label="More options">
  <span class="material-symbols-outlined" aria-hidden="true">more_vert</span>
</button>`,
  markup: (v) => {
    // The intent class is always written out. Primary happens to be the base
    // default, but relying on that teaches a class name that silently breaks
    // if the default ever moves. Medium has no size class by design.
    const size = v.size === 'Medium' ? '' : ` inspera-btn--${v.size.toLowerCase()}`
    const cls = `inspera-btn inspera-btn--${v.intent.toLowerCase()}${size}`
    const icon = (name: string) =>
      `  <span class="material-symbols-outlined" aria-hidden="true">${name}</span>\n`
    const label = '  <span>Button</span>\n'
    const body =
      v.content === 'Icon + Text' ? `\n${icon('add')}${label}`
        : v.content === 'Text + Icon' ? `\n${label}${icon('add')}`
        : v.content === 'Text + Disclosure' ? `\n${label}${icon('expand_more')}`
        : 'Button'
    return `<button type="button" class="${cls}">${body}</button>`
  },
  component: (v) => (
    <Button
      label="Button"
      intent={v.intent as never}
      size={v.size as never}
      content={v.content as never}
    />
  ),
  props: ['min-width'],
  vars: [
    ['hover fill', '--inspera-bg-hover', '--btn-bg-hover'],
    ['pressed fill', '--inspera-bg-active', '--btn-bg-active'],
  ],
  notes: [
    'Corner radius is 4px (`--radius-sm`). Not 6, not 8, not `rounded-lg`.',
    'Type is 16px/600 at every size — Small and Large change height, padding and gap only.',
    'Primary is `--primary` #004080, a deep navy. It is not a mid blue and never a gradient.',
    'Every solid intent carries the inset top-light button shadow; Outline and Text carry none.',
    'Hover darkens the fill to 90% and pressed to 82%, both mixed toward black — no separate hover token.',
    'Minimum width is 80px, so short labels still read as buttons.',
  ],
}

// ---------------------------------------------------------------------------
// Badge — a status pill. Small enough that every value matters: get the height
// or the radius wrong and it reads as a button.
// ---------------------------------------------------------------------------
const badge: Recipe = {
  className: 'inspera-badge',
  css: `.inspera-badge {
  /* Fill and text come from the intent modifier below. */
  --badge-bg: var(--surface-neutral);
  --badge-fg: var(--gray-900);

  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 24px;
  padding: 0 8px;
  border-radius: var(--radius-pill);
  background: var(--badge-bg);
  color: var(--badge-fg);
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
}

/* Small changes height and padding only — never the 12px type. */
.inspera-badge--small { height: 20px; padding: 0 6px; }

/* Neutral is written out even though it matches the base, so the class name
   stays correct if the default ever moves. */
.inspera-badge--neutral { --badge-bg: var(--surface-neutral); --badge-fg: var(--gray-900); }
.inspera-badge--info    { --badge-bg: var(--info-surface);    --badge-fg: var(--info); }
.inspera-badge--success { --badge-bg: var(--success-surface); --badge-fg: var(--success); }
.inspera-badge--warning { --badge-bg: var(--warning-surface); --badge-fg: var(--warning); }
.inspera-badge--error   { --badge-bg: var(--error-surface);   --badge-fg: var(--error); }

/* The icon is filled, not outlined, at 16px (14px in a small badge). */
.inspera-badge .material-symbols-outlined {
  font-size: 16px;
  font-variation-settings: 'FILL' 1;
}
.inspera-badge--small .material-symbols-outlined { font-size: 14px; }`,
  html: `<span class="inspera-badge inspera-badge--success" role="status">Live</span>

<span class="inspera-badge inspera-badge--neutral inspera-badge--small" role="status">Draft</span>

<!-- With an icon. Material Symbols Outlined, filled — never another set. -->
<span class="inspera-badge inspera-badge--error" role="status">
  <span class="material-symbols-outlined" aria-hidden="true">error</span>
  Failed
</span>`,
  markup: (v) => {
    const size = v.size === 'Medium' ? '' : ` inspera-badge--${v.size.toLowerCase()}`
    const cls = `inspera-badge inspera-badge--${v.intent.toLowerCase()}${size}`
    const icon = { Neutral: 'circle', Info: 'info', Success: 'check_circle', Warning: 'warning', Error: 'error' }[v.intent]
    const body = v.withIcon === 'true'
      ? `\n  <span class="material-symbols-outlined" aria-hidden="true">${icon}</span>\n  ${v.intent}\n`
      : v.intent
    return `<span class="${cls}" role="status">${body}</span>`
  },
  component: (v) => (
    <Badge label={v.intent} intent={v.intent as never} size={v.size as never} withIcon={v.withIcon === 'true'} />
  ),
  notes: [
    'Height is 24px (20px small) and the radius is a full pill — not `rounded-md`.',
    'Type is 12px/500 at both sizes; Small changes height and padding only.',
    'Neutral is `--surface-neutral` with `--gray-900` text, not a grey chip with white text.',
    'Every intent pairs a `*-surface` tint with the matching solid as the text colour.',
    'The icon is Material Symbols Outlined with `FILL 1`, at 16px (14px small).',
  ],
}

// ---------------------------------------------------------------------------
// Tag — same pill as Badge, but it can carry a leading icon and a remove
// button. The remove control is a real button, not a styled span.
// ---------------------------------------------------------------------------
const tag: Recipe = {
  className: 'inspera-tag',
  css: `.inspera-tag {
  --tag-bg: var(--surface-neutral);
  --tag-fg: var(--gray-900);

  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 24px;
  padding: 0 8px;
  border: none;
  border-radius: var(--radius-pill);
  background: var(--tag-bg);
  color: var(--tag-fg);
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  cursor: default;
}

.inspera-tag--small { height: 20px; padding: 0 6px; }

/* Neutral is written out even though it matches the base, so the class name
   stays correct if the default ever moves. */
.inspera-tag--neutral { --tag-bg: var(--surface-neutral); --tag-fg: var(--gray-900); }
.inspera-tag--info    { --tag-bg: var(--info-surface);    --tag-fg: var(--info); }
.inspera-tag--success { --tag-bg: var(--success-surface); --tag-fg: var(--success); }
.inspera-tag--warning { --tag-bg: var(--warning-surface); --tag-fg: var(--warning); }
.inspera-tag--error   { --tag-bg: var(--error-surface);   --tag-fg: var(--error); }

.inspera-tag .material-symbols-outlined {
  font-size: 16px;
  font-variation-settings: 'FILL' 1;
}
.inspera-tag--small .material-symbols-outlined { font-size: 14px; }

/* The remove control. Square, inherits the tag's colour, and keeps its own
   accessible name — "Remove <label>", not a bare "close". */
.inspera-tag__remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-left: 2px;
  margin-right: -2px;
  padding: 0;
  border: none;
  border-radius: var(--radius-pill);
  background: transparent;
  color: inherit;
  cursor: pointer;
}
.inspera-tag--small .inspera-tag__remove { width: 16px; height: 16px; }

.inspera-tag__remove .material-symbols-outlined {
  font-variation-settings: 'FILL' 0;
}`,
  html: `<span class="inspera-tag inspera-tag--neutral">Mathematics</span>

<!-- With a leading icon and a remove control. -->
<span class="inspera-tag inspera-tag--info">
  <span class="material-symbols-outlined" aria-hidden="true">label</span>
  Algebra
  <button type="button" class="inspera-tag__remove" aria-label="Remove Algebra">
    <span class="material-symbols-outlined" aria-hidden="true">close</span>
  </button>
</span>`,
  markup: (v) => {
    const size = v.size === 'Medium' ? '' : ` inspera-tag--${v.size.toLowerCase()}`
    const cls = `inspera-tag inspera-tag--${v.intent.toLowerCase()}${size}`
    const remove = v.removable === 'true'
      ? `  <button type="button" class="inspera-tag__remove" aria-label="Remove ${v.intent}">\n` +
        `    <span class="material-symbols-outlined" aria-hidden="true">close</span>\n` +
        `  </button>\n`
      : ''
    return `<span class="${cls}">\n` +
      `  <span class="material-symbols-outlined" aria-hidden="true">label</span>\n` +
      `  ${v.intent}\n${remove}</span>`
  },
  component: (v) => (
    <Tag
      label={v.intent}
      intent={v.intent as never}
      size={v.size as never}
      removable={v.removable === 'true'}
      leadingIcon="label"
    />
  ),
  notes: [
    'Identical geometry to Badge: 24px tall (20px small), full pill radius, 12px/500 type.',
    'The remove control is a `<button>` with `aria-label="Remove <label>"` — never a bare icon span, and never just "close".',
    'The leading icon is filled (`FILL 1`); the close icon is not.',
    'A tag with no `onClick` is a `<span>` and takes `cursor: default`. Only a clickable tag becomes a `<button>`.',
  ],
}

// ---------------------------------------------------------------------------
// Divider — three separate elements depending on orientation and label, and a
// model left to guess reaches for a bare <hr> with a browser default border.
// ---------------------------------------------------------------------------
const divider: Recipe = {
  className: 'inspera-divider',
  css: `/* Horizontal, unlabelled. The border reset matters: a bare <hr> keeps the
   browser's inset border and renders as a two-tone groove. */
.inspera-divider {
  border: none;
  height: 1px;
  width: 100%;
  background: var(--border);
  margin: 16px 0;
}

.inspera-divider--compact  { margin: 8px 0; }
.inspera-divider--spacious { margin: 24px 0; }

/* Vertical: a 1px column that stretches to its flex parent. */
.inspera-divider--vertical {
  display: inline-block;
  width: 1px;
  height: auto;
  align-self: stretch;
  min-height: 1em;
  background: var(--border);
  margin: 0 16px;
}
.inspera-divider--vertical.inspera-divider--compact  { margin: 0 8px; }
.inspera-divider--vertical.inspera-divider--spacious { margin: 0 24px; }

/* Labelled: a flex row whose rules grow to fill either side of the text. */
.inspera-divider--labelled {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: auto;
  background: none;
  margin: 16px 0;
  font-family: var(--font-sans);
}
.inspera-divider--labelled.inspera-divider--compact  { margin: 8px 0; }
.inspera-divider--labelled.inspera-divider--spacious { margin: 24px 0; }

.inspera-divider__rule {
  flex: 1;
  height: 1px;
  background: var(--border);
}

.inspera-divider__label {
  font-size: 13px;
  color: var(--muted-foreground);
  white-space: nowrap;
}`,
  html: `<hr class="inspera-divider" role="separator" aria-orientation="horizontal" />

<!-- Vertical, inside a flex row. -->
<span class="inspera-divider inspera-divider--vertical" role="separator" aria-orientation="vertical"></span>

<!-- Labelled: the label names the separator for assistive tech too. -->
<div class="inspera-divider inspera-divider--labelled" role="separator" aria-orientation="horizontal" aria-label="OR">
  <span class="inspera-divider__rule"></span>
  <span class="inspera-divider__label">OR</span>
  <span class="inspera-divider__rule"></span>
</div>`,
  markup: (v) => {
    const spacing = v.spacing === 'Default' ? '' : ` inspera-divider--${v.spacing.toLowerCase()}`
    if (v.orientation === 'Vertical') {
      return `<span class="inspera-divider inspera-divider--vertical${spacing}" role="separator" aria-orientation="vertical"></span>`
    }
    if (v.withLabel === 'true') {
      return `<div class="inspera-divider inspera-divider--labelled${spacing}" role="separator" aria-orientation="horizontal" aria-label="OR">\n` +
        `  <span class="inspera-divider__rule"></span>\n` +
        `  <span class="inspera-divider__label">OR</span>\n` +
        `  <span class="inspera-divider__rule"></span>\n</div>`
    }
    return `<hr class="inspera-divider${spacing}" role="separator" aria-orientation="horizontal" />`
  },
  component: (v) => (
    <Divider
      orientation={v.orientation as never}
      spacing={v.spacing as never}
      label={v.orientation !== 'Vertical' && v.withLabel === 'true' ? 'OR' : undefined}
    />
  ),
  notes: [
    'The rule is 1px of `--border` as a background, not a border. A bare `<hr>` keeps the browser default and renders as a grey groove.',
    'Spacing is margin on the divider itself: 16px default, 8px compact, 24px spacious — on the block axis horizontally, the inline axis vertically.',
    'A labelled divider is a flex row of rule / label / rule, with the label at 13px `--muted-foreground`. It is not text laid over a line.',
    'Always carry `role="separator"` and `aria-orientation`; a labelled one also needs `aria-label`.',
  ],
}

// ---------------------------------------------------------------------------
// Stat — a KPI tile. The uppercase micro-label above a large number is the
// whole shape; a model left to guess makes the label the same size as the body.
// ---------------------------------------------------------------------------
const stat: Recipe = {
  className: 'inspera-stat',
  css: `.inspera-stat {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 200px;
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--white);
  font-family: var(--font-sans);
  color: var(--text-primary);
}

/* Label row: the metric name, with an optional icon pushed to the far end. */
.inspera-stat__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.inspera-stat__label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--muted-foreground);
}

.inspera-stat__head .material-symbols-outlined {
  font-size: 20px;
  color: var(--muted-foreground);
}

.inspera-stat__value {
  font-size: 28px;
  font-weight: 600;
  line-height: 1.1;
}

/* The delta carries the trend colour; the arrow is not decorative repetition,
   it is the direction for anyone who cannot rely on the colour alone. */
.inspera-stat__delta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
}
.inspera-stat__delta .material-symbols-outlined { font-size: 18px; }

.inspera-stat__delta--up      { color: var(--success); }
.inspera-stat__delta--down    { color: var(--error); }
.inspera-stat__delta--neutral { color: var(--muted-foreground); }`,
  html: `<div class="inspera-stat">
  <div class="inspera-stat__head">
    <span class="inspera-stat__label">Active candidates</span>
    <span class="material-symbols-outlined" aria-hidden="true">group</span>
  </div>
  <span class="inspera-stat__value">12,480</span>
  <span class="inspera-stat__delta inspera-stat__delta--up">
    <span class="material-symbols-outlined" aria-hidden="true">trending_up</span>
    +8.2% vs last week
  </span>
</div>`,
  markup: (v) => {
    const trendIcon = { up: 'trending_up', down: 'trending_down', neutral: 'trending_flat' }[v.deltaIntent]
    const icon = v.withIcon === 'true'
      ? `\n    <span class="material-symbols-outlined" aria-hidden="true">group</span>`
      : ''
    return `<div class="inspera-stat">
  <div class="inspera-stat__head">
    <span class="inspera-stat__label">Active candidates</span>${icon}
  </div>
  <span class="inspera-stat__value">12,480</span>
  <span class="inspera-stat__delta inspera-stat__delta--${v.deltaIntent}">
    <span class="material-symbols-outlined" aria-hidden="true">${trendIcon}</span>
    +8.2% vs last week
  </span>
</div>`
  },
  component: (v) => (
    <Stat
      label="Active candidates"
      value="12,480"
      delta="+8.2% vs last week"
      deltaIntent={v.deltaIntent as never}
      icon={v.withIcon === 'true' ? 'group' : undefined}
    />
  ),
  notes: [
    'The label is 12px/600 uppercase with 0.04em tracking in `--muted-foreground` — not body text.',
    'The value is 28px/600 at line-height 1.1. It is the only large type in the tile.',
    'The tile uses `--radius-lg` and a 1px `--border`, with no shadow.',
    'Trend colour is `--success` up, `--error` down, `--muted-foreground` flat, and always ships with the matching arrow so the direction is not colour-only.',
  ],
}

// ---------------------------------------------------------------------------
// Empty state — the icon sits in a filled circle. Skip the circle and it reads
// as a broken image; that is the detail models miss most often here.
// ---------------------------------------------------------------------------
const emptyState: Recipe = {
  className: 'inspera-empty',
  css: `.inspera-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  padding: 32px;
  font-family: var(--font-sans);
  color: var(--text-primary);
}

.inspera-empty--small { padding: 16px; }

/* The icon lives inside a filled circle, not on its own. */
.inspera-empty__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 9999px;
  background: var(--gray-100);
  margin-bottom: 4px;
}
.inspera-empty--small .inspera-empty__icon { width: 56px; height: 56px; }

.inspera-empty__icon .material-symbols-outlined {
  font-size: 40px;
  color: var(--muted-foreground);
}
.inspera-empty--small .inspera-empty__icon .material-symbols-outlined { font-size: 28px; }

.inspera-empty__title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}
.inspera-empty--small .inspera-empty__title { font-size: 16px; }

.inspera-empty__body {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  color: var(--muted-foreground);
  max-width: 320px;
}

/* The action is a normal Button, spaced away from the copy. */
.inspera-empty__action { margin-top: 8px; }`,
  html: `<div class="inspera-empty" role="status">
  <span class="inspera-empty__icon">
    <span class="material-symbols-outlined" aria-hidden="true">inbox</span>
  </span>
  <h3 class="inspera-empty__title">No assessments yet</h3>
  <p class="inspera-empty__body">Create your first assessment to get started.</p>
  <div class="inspera-empty__action">
    <button type="button" class="inspera-btn inspera-btn--primary">New assessment</button>
  </div>
</div>`,
  markup: (v) => {
    const small = v.size === 'Small'
    const cls = `inspera-empty${small ? ' inspera-empty--small' : ''}`
    const action = v.withAction === 'true'
      ? `\n  <div class="inspera-empty__action">\n` +
        `    <button type="button" class="inspera-btn inspera-btn--primary${small ? ' inspera-btn--small' : ''}">New assessment</button>\n` +
        `  </div>`
      : ''
    return `<div class="${cls}" role="status">
  <span class="inspera-empty__icon">
    <span class="material-symbols-outlined" aria-hidden="true">inbox</span>
  </span>
  <h3 class="inspera-empty__title">No assessments yet</h3>
  <p class="inspera-empty__body">Create your first assessment to get started.</p>${action}
</div>`
  },
  composes: ['button'],
  component: (v) => (
    <EmptyState
      icon="inbox"
      title="No assessments yet"
      description="Create your first assessment to get started."
      actionLabel={v.withAction === 'true' ? 'New assessment' : undefined}
      size={v.size as never}
    />
  ),
  notes: [
    'The icon sits in an 80px circle of `--gray-100` (56px when small). Without the circle it reads as a broken image.',
    'Title 18px/500, body 14px `--muted-foreground` capped at 320px so it wraps to two short lines rather than one long one.',
    'The action is the ordinary Button component, not a bespoke link.',
    'Carry `role="status"` so the empty result is announced when a filter clears the list.',
  ],
}

// ---------------------------------------------------------------------------
// Spinner — an SVG ring, not a spinning border trick. The dash offset is what
// makes it an arc rather than a full circle.
// ---------------------------------------------------------------------------
const spinner: Recipe = {
  className: 'inspera-spinner',
  css: `.inspera-spinner {
  display: inline-flex;
  width: 24px;
  height: 24px;
}

.inspera-spinner--small { width: 16px; height: 16px; }
.inspera-spinner--large { width: 40px; height: 40px; }

.inspera-spinner > svg {
  animation: inspera-spin 0.8s linear infinite;
}

/* The visually hidden label. A spinner with no accessible name announces
   nothing at all, so this is not optional. */
.inspera-spinner__label {
  font-family: var(--font-sans);
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

@keyframes inspera-spin {
  to { transform: rotate(360deg); }
}`,
  html: `<!-- Medium (24px). The track is --gray-200; the arc is the intent colour. -->
<span class="inspera-spinner" role="status" aria-label="Loading assessments">
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10.5" fill="none" stroke="var(--gray-200)" stroke-width="3"></circle>
    <circle cx="12" cy="12" r="10.5" fill="none" stroke="var(--primary)" stroke-width="3"
            stroke-linecap="round" stroke-dasharray="65.97344572538566" stroke-dashoffset="46.18141200776996"></circle>
  </svg>
  <span class="inspera-spinner__label">Loading assessments</span>
</span>`,
  markup: (v) => {
    const d = { Small: 16, Medium: 24, Large: 40 }[v.size]!
    const stroke = v.size === 'Small' ? 2 : v.size === 'Medium' ? 3 : 4
    const r = (d - stroke) / 2
    const circumference = 2 * Math.PI * r
    const color = { Primary: 'var(--primary)', Neutral: 'var(--gray-600)', Inverse: 'var(--white)' }[v.intent]
    const size = v.size === 'Medium' ? '' : ` inspera-spinner--${v.size.toLowerCase()}`
    return `<span class="inspera-spinner${size}" role="status" aria-label="Loading assessments">
  <svg width="${d}" height="${d}" viewBox="0 0 ${d} ${d}" aria-hidden="true">
    <circle cx="${d / 2}" cy="${d / 2}" r="${r}" fill="none" stroke="var(--gray-200)" stroke-width="${stroke}"></circle>
    <circle cx="${d / 2}" cy="${d / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}"
            stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference * 0.7}"></circle>
  </svg>
  <span class="inspera-spinner__label">Loading assessments</span>
</span>`
  },
  component: (v) => (
    <Spinner size={v.size as never} intent={v.intent as never} label="Loading assessments" />
  ),
  props: ['stroke-width', 'stroke-linecap'],
  notes: [
    'It is an SVG of two circles — a full `--gray-200` track and a coloured arc — not a bordered div with one transparent side.',
    'The arc is drawn by `stroke-dasharray` = circumference and `stroke-dashoffset` = 70% of it. Change the offset, not the geometry.',
    'Diameters are 16 / 24 / 40 with stroke widths 2 / 3 / 4.',
    'Rotation is 0.8s linear infinite on the `<svg>`, so the arc spins and the track does not.',
    'The visually hidden label is required — `role="status"` with no name announces nothing.',
  ],
}

// ---------------------------------------------------------------------------
// Skeleton — the shimmer is a moving gradient, and the last text line is short.
// ---------------------------------------------------------------------------
const skeleton: Recipe = {
  className: 'inspera-skeleton',
  css: `.inspera-skeleton {
  /* The shimmer: an oversized gradient panned across the element. A pulsing
     opacity is a different effect and reads as a flash, not a load. */
  background-image: linear-gradient(90deg, var(--gray-200) 25%, var(--gray-100) 37%, var(--gray-200) 63%);
  background-size: 400% 100%;
  animation: inspera-shimmer 1.4s ease infinite;
}

.inspera-skeleton--text {
  display: block;
  width: 100%;
  height: 12px;
  border-radius: var(--radius-sm);
}

.inspera-skeleton--rect {
  display: block;
  width: 100%;
  height: 120px;
  border-radius: var(--radius-md);
}

.inspera-skeleton--circle {
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-pill);
}

/* A stack of lines, with the last one short so it reads as a paragraph. */
.inspera-skeleton-lines {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  background: none;
  animation: none;
}
.inspera-skeleton-lines > .inspera-skeleton--text:last-child:not(:only-child) { width: 60%; }

@keyframes inspera-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`,
  html: `<!-- Three text lines. The wrapper is not itself a shimmering block. -->
<span class="inspera-skeleton-lines" role="presentation" aria-hidden="true">
  <span class="inspera-skeleton inspera-skeleton--text"></span>
  <span class="inspera-skeleton inspera-skeleton--text"></span>
  <span class="inspera-skeleton inspera-skeleton--text"></span>
</span>

<span class="inspera-skeleton inspera-skeleton--circle" role="presentation" aria-hidden="true"></span>

<span class="inspera-skeleton inspera-skeleton--rect" role="presentation" aria-hidden="true"></span>`,
  markup: (v) => {
    if (v.variant === 'Circle') {
      return `<span class="inspera-skeleton inspera-skeleton--circle" role="presentation" aria-hidden="true" style="width: 48px; height: 48px"></span>`
    }
    if (v.variant === 'Rect') {
      return `<span class="inspera-skeleton inspera-skeleton--rect" role="presentation" aria-hidden="true" style="height: 80px"></span>`
    }
    const lines = Number(v.lines)
    const rows = Array.from({ length: lines }, () =>
      '  <span class="inspera-skeleton inspera-skeleton--text"></span>').join('\n')
    return `<span class="inspera-skeleton-lines" role="presentation" aria-hidden="true">\n${rows}\n</span>`
  },
  component: (v) => (
    v.variant === 'Text' ? <Skeleton variant="Text" lines={Number(v.lines)} />
      : v.variant === 'Circle' ? <Skeleton variant="Circle" width={48} height={48} />
      : <Skeleton variant="Rect" height={80} />
  ),
  rootOnly: true,
  notes: [
    'The shimmer is a 400%-wide linear gradient panned by `background-position`, 1.4s ease infinite. It is not an opacity pulse.',
    'Text lines are 12px tall with `--radius-sm` and an 8px gap; the last of several is 60% wide so the block reads as a paragraph.',
    'Rect uses `--radius-md`, Circle uses `--radius-pill`. Match the radius to whatever the placeholder stands in for.',
    'Always `aria-hidden` — a skeleton is decoration, and announcing it interrupts the user with nothing.',
  ],
}

// ---------------------------------------------------------------------------
// Card — a contained surface. Three elevations that differ only in border and
// shadow, and an interactive card that is a real <button>.
// ---------------------------------------------------------------------------
const card: Recipe = {
  className: 'inspera-card',
  css: `.inspera-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 16px;
  border-radius: var(--radius-lg);
  background: var(--white);
  color: var(--text-primary);
  /* Stated, not inherited. An interactive card is a <button>, and a button
     falls back to the UA font rather than the page's. */
  font-family: var(--font-sans);
  /* A transparent border at rest, so switching to Outlined does not resize the
     card. Dropping it and adding a border only on the modifier shifts layout. */
  border: 1px solid transparent;
  box-shadow: none;
  text-align: left;
  cursor: default;
}

.inspera-card--compact  { padding: 12px; }
.inspera-card--spacious { padding: 24px; }

.inspera-card--raised   { box-shadow: var(--shadow-200); }
.inspera-card--outlined { border-color: var(--border-strong); }

/* Interactive cards are <button>, so they are focusable and operable by
   keyboard for free. A div with onclick is not. */
.inspera-card--interactive { cursor: pointer; }
.inspera-card--interactive:hover { box-shadow: var(--shadow-300); }
.inspera-card--interactive:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.inspera-card__title {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.inspera-card__body {
  margin: 0;
  font-size: 16px;
  line-height: 1.4;
  color: var(--gray-700);
}`,
  html: `<article class="inspera-card inspera-card--raised">
  <h3 class="inspera-card__title">Algebra Quiz</h3>
  <p class="inspera-card__body">24 questions · 45 minutes.</p>
</article>

<!-- Interactive: a real button, never a div with a click handler. -->
<button type="button" class="inspera-card inspera-card--outlined inspera-card--interactive">
  <h3 class="inspera-card__title">History Midterm</h3>
  <p class="inspera-card__body">Open the assessment.</p>
</button>`,
  markup: (v) => {
    const pad = v.padding === 'Default' ? '' : ` inspera-card--${v.padding.toLowerCase()}`
    const elev = v.elevation === 'Flat' ? '' : ` inspera-card--${v.elevation.toLowerCase()}`
    const interactive = v.interactive === 'true'
    const cls = `inspera-card${elev}${pad}${interactive ? ' inspera-card--interactive' : ''}`
    const inner = `  <h3 class="inspera-card__title">Algebra Quiz</h3>\n` +
      `  <p class="inspera-card__body">24 questions · 45 minutes. Group related content in a contained surface.</p>\n`
    return interactive
      ? `<button type="button" class="${cls}">\n${inner}</button>`
      : `<article class="${cls}">\n${inner}</article>`
  },
  component: (v) => (
    <Card
      title="Algebra Quiz"
      body="24 questions · 45 minutes. Group related content in a contained surface."
      elevation={v.elevation as never}
      padding={v.padding as never}
      interactive={v.interactive === 'true'}
    />
  ),
  notes: [
    'Radius is `--radius-lg`. Padding is 12 / 16 / 24 for Compact / Default / Spacious.',
    'Flat has neither border nor shadow, Raised adds `--shadow-200`, Outlined adds a 1px `--border-strong`. Never both a shadow and a strong border.',
    'The transparent 1px border at rest is deliberate: without it, Outlined would be 2px wider than Flat.',
    'An interactive card is a `<button>`. A `<div>` with a click handler is not keyboard operable and will fail review.',
    'Title 16px/500, body 16px/1.4 in `--gray-700` — the body is not smaller than the title.',
  ],
}

// ---------------------------------------------------------------------------
// Link — inline navigation. The trap here is the underline: it is a hover
// behaviour by default, and models tend to hardcode one or the other.
// ---------------------------------------------------------------------------
const link: Recipe = {
  className: 'inspera-link',
  css: `.inspera-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--primary);
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  text-underline-offset: 2px;
  border-radius: var(--radius-xs);
  cursor: pointer;
  transition: color var(--duration-fast) var(--easing-standard);
}

.inspera-link--small { font-size: 14px; }

.inspera-link--muted { color: var(--gray-600); }

/* Underline behaviour. Hover is the default; the other two are explicit. */
.inspera-link:hover { text-decoration: underline; }
.inspera-link--underline-always { text-decoration: underline; }
.inspera-link--underline-none:hover { text-decoration: none; }

.inspera-link:focus-visible {
  outline: 2px solid var(--primary-focus-ring);
  outline-offset: 2px;
}

/* Disabled: no href, announced with aria-disabled. A link with no href is not
   focusable, which is the behaviour you want. */
.inspera-link--disabled {
  color: var(--action-disabled);
  cursor: not-allowed;
  text-decoration: none;
}
.inspera-link--disabled:hover { text-decoration: none; }

.inspera-link .material-symbols-outlined { font-size: 18px; }
.inspera-link--small .material-symbols-outlined { font-size: 16px; }`,
  html: `<a class="inspera-link" href="/docs">Learn more</a>

<!-- External links open in a new tab and say so with an icon. -->
<a class="inspera-link" href="https://inspera.com" target="_blank" rel="noreferrer">
  Documentation
  <span class="material-symbols-outlined" aria-hidden="true">open_in_new</span>
</a>

<a class="inspera-link inspera-link--muted inspera-link--small" href="/skip">Skip for now</a>

<!-- Disabled: no href at all. -->
<a class="inspera-link inspera-link--disabled" aria-disabled="true">Unavailable</a>`,
  markup: (v) => {
    const cls = [
      'inspera-link',
      v.intent === 'Muted' ? 'inspera-link--muted' : '',
      v.size === 'Small' ? 'inspera-link--small' : '',
      v.underline === 'Always' ? 'inspera-link--underline-always' : '',
      v.underline === 'None' ? 'inspera-link--underline-none' : '',
      v.disabled === 'true' ? 'inspera-link--disabled' : '',
    ].filter(Boolean).join(' ')
    const attrs = v.disabled === 'true'
      ? ' aria-disabled="true"'
      : ` href="/docs"${v.external === 'true' ? ' target="_blank" rel="noreferrer"' : ''}`
    const lead = v.leadingIcon === 'true'
      ? `\n  <span class="material-symbols-outlined" aria-hidden="true">open_in_browser</span>`
      : ''
    const trail = v.external === 'true'
      ? `\n  <span class="material-symbols-outlined" aria-hidden="true">open_in_new</span>`
      : ''
    return `<a class="${cls}"${attrs}>${lead}\n  Learn more${trail}\n</a>`
  },
  component: (v) => (
    <Link
      label="Learn more"
      intent={v.intent as never}
      size={v.size as never}
      underline={v.underline as never}
      leadingIcon={v.leadingIcon === 'true' ? 'open_in_browser' : undefined}
      external={v.external === 'true'}
      disabled={v.disabled === 'true'}
    />
  ),
  notes: [
    'The default is underline **on hover only** — not always, and not never.',
    'Colour is `--primary` at 16px/500 (14px when small), with `text-underline-offset: 2px` so the rule clears the descenders.',
    'An external link gets `target="_blank"`, `rel="noreferrer"`, and the `open_in_new` icon. All three, not one.',
    'A disabled link carries no `href` and sets `aria-disabled="true"`. Do not leave the href and swallow the click.',
    'The focus ring is `--primary-focus-ring` at 2px with a 2px offset — different from the solid `--primary` ring buttons use.',
  ],
}

// ---------------------------------------------------------------------------
// Alert — inline feedback. Every intent pairs a tinted surface with the solid
// as icon and border, and the live-region role follows the severity.
// ---------------------------------------------------------------------------
const alert: Recipe = {
  className: 'inspera-alert',
  css: `.inspera-alert {
  --alert-bg: var(--info-surface);
  --alert-fg: var(--info);

  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  max-width: 100%;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  background: var(--alert-bg);
  border: 1px solid var(--alert-fg);
  color: var(--text-primary);
  font-family: var(--font-sans);
}

.inspera-alert--info    { --alert-bg: var(--info-surface);    --alert-fg: var(--info); }
.inspera-alert--success { --alert-bg: var(--success-surface); --alert-fg: var(--success); }
.inspera-alert--warning { --alert-bg: var(--warning-surface); --alert-fg: var(--warning); }
.inspera-alert--error   { --alert-bg: var(--error-surface);   --alert-fg: var(--error); }

/* No tint: the accent moves to a 4px left edge instead. */
.inspera-alert--plain {
  background: transparent;
  border-left-width: 4px;
}

.inspera-alert__icon {
  flex-shrink: 0;
  margin-top: 1px;
  font-size: 20px;
  color: var(--alert-fg);
  font-variation-settings: 'FILL' 1;
}

.inspera-alert__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.inspera-alert__title {
  font-size: 16px;
  font-weight: 500;
}

.inspera-alert__message {
  font-size: 16px;
  line-height: 1.4;
  color: var(--gray-700);
}

.inspera-alert__cta {
  align-self: flex-start;
  margin-top: 8px;
  padding: 0;
  border: none;
  background: none;
  color: var(--alert-fg);
  font-weight: 600;
  font-size: 14px;
  text-decoration: underline;
  cursor: pointer;
}

.inspera-alert__close {
  padding: 0;
  border: none;
  background: none;
  color: var(--action-active);
  display: inline-flex;
  cursor: pointer;
}
.inspera-alert__close .material-symbols-outlined { font-size: 20px; }`,
  html: `<!-- Error and Warning are urgent: role="alert" (already assertive). -->
<div class="inspera-alert inspera-alert--error" role="alert">
  <span class="material-symbols-outlined inspera-alert__icon" aria-hidden="true">error</span>
  <div class="inspera-alert__content">
    <span class="inspera-alert__title">Upload failed</span>
    <span class="inspera-alert__message">The file exceeds the 10MB limit.</span>
  </div>
</div>

<!-- Info and Success are not: a polite status region instead. Never both. -->
<div class="inspera-alert inspera-alert--success" role="status" aria-live="polite">
  <span class="material-symbols-outlined inspera-alert__icon" aria-hidden="true">check_circle</span>
  <div class="inspera-alert__content">
    <span class="inspera-alert__title">Saved</span>
    <span class="inspera-alert__message">Your changes are published.</span>
  </div>
  <button type="button" class="inspera-alert__close" aria-label="Close alert">
    <span class="material-symbols-outlined" aria-hidden="true">close</span>
  </button>
</div>`,
  markup: (v) => {
    const icon = { Info: 'info', Success: 'check_circle', Warning: 'warning', Error: 'error' }[v.intent]
    const urgent = v.intent === 'Error' || v.intent === 'Warning'
    const live = urgent ? ' role="alert"' : ' role="status" aria-live="polite"'
    const plain = v.background === 'true' ? '' : ' inspera-alert--plain'
    const hasCta = v.layout === 'With CTA' || v.layout === 'With CTA + Close'
    const hasClose = v.layout === 'With Close' || v.layout === 'With CTA + Close'
    const cta = hasCta ? `\n    <button type="button" class="inspera-alert__cta">View details</button>` : ''
    const close = hasClose
      ? `\n  <button type="button" class="inspera-alert__close" aria-label="Close alert">\n` +
        `    <span class="material-symbols-outlined" aria-hidden="true">close</span>\n  </button>`
      : ''
    return `<div class="inspera-alert inspera-alert--${v.intent.toLowerCase()}${plain}"${live}>
  <span class="material-symbols-outlined inspera-alert__icon" aria-hidden="true">${icon}</span>
  <div class="inspera-alert__content">
    <span class="inspera-alert__title">Heads up</span>
    <span class="inspera-alert__message">This is a contextual inline message that matches the intent severity.</span>${cta}
  </div>${close}
</div>`
  },
  component: (v) => (
    <Alert intent={v.intent as never} layout={v.layout as never} background={v.background === 'true'} />
  ),
  notes: [
    'Each intent pairs the `*-surface` tint as background with the solid colour as both border and icon.',
    'The live region follows severity: Error and Warning use `role="alert"`, Info and Success use `role="status"` with `aria-live="polite"`. Never put `role="alert"` and `aria-live="polite"` on the same element — alert already implies assertive.',
    'The icon is filled (`FILL 1`) at 20px, nudged 1px down so it sits on the title baseline.',
    'Without the tint, the accent becomes a 4px left border and the other three sides stay 1px.',
    'The close button needs `aria-label="Close alert"` — an unlabelled × announces as nothing.',
  ],
}

// ---------------------------------------------------------------------------
// Snackbar — a transient dark bar. The intent tints only the icon and action,
// never the surface, which stays --gray-900 for every intent.
// ---------------------------------------------------------------------------
const snackbar: Recipe = {
  className: 'inspera-snackbar',
  css: `.inspera-snackbar {
  /* The accent tints the icon and the action, not the bar. */
  --snackbar-accent: var(--white);

  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: 300px;
  max-width: 480px;
  height: 48px;
  padding: 0 8px 0 16px;
  border-radius: var(--radius-md);
  background: var(--gray-900);
  color: var(--white);
  box-shadow: var(--shadow-300);
  font-family: var(--font-sans);
}

.inspera-snackbar--neutral { --snackbar-accent: var(--white); }
.inspera-snackbar--info    { --snackbar-accent: var(--blue-400); }
.inspera-snackbar--success { --snackbar-accent: var(--green-400); }
.inspera-snackbar--warning { --snackbar-accent: var(--orange-400); }
.inspera-snackbar--error   { --snackbar-accent: var(--red-400); }

.inspera-snackbar__icon {
  flex-shrink: 0;
  font-size: 20px;
  color: var(--snackbar-accent);
  font-variation-settings: 'FILL' 1;
}

.inspera-snackbar__message {
  flex: 1;
  font-size: 16px;
}

.inspera-snackbar__action {
  padding: 0 8px;
  border: none;
  background: none;
  color: var(--snackbar-accent);
  font-weight: 600;
  font-size: 16px;
  white-space: nowrap;
  cursor: pointer;
}

.inspera-snackbar__close {
  padding: 4px;
  border: none;
  background: none;
  color: rgba(255, 255, 255, 0.7);
  display: inline-flex;
  cursor: pointer;
}
.inspera-snackbar__close .material-symbols-outlined { font-size: 20px; }`,
  html: `<div class="inspera-snackbar inspera-snackbar--success" role="status" aria-live="polite">
  <span class="material-symbols-outlined inspera-snackbar__icon" aria-hidden="true">check_circle</span>
  <span class="inspera-snackbar__message">Assessment saved.</span>
  <button type="button" class="inspera-snackbar__action">Undo</button>
  <button type="button" class="inspera-snackbar__close" aria-label="Dismiss">
    <span class="material-symbols-outlined" aria-hidden="true">close</span>
  </button>
</div>`,
  markup: (v) => {
    const icon = { Neutral: 'notifications', Info: 'info', Success: 'check_circle', Warning: 'warning', Error: 'error' }[v.intent]
    const action = v.hasAction === 'true'
      ? `\n  <button type="button" class="inspera-snackbar__action">Undo</button>` : ''
    const close = v.hasClose === 'true'
      ? `\n  <button type="button" class="inspera-snackbar__close" aria-label="Dismiss">\n` +
        `    <span class="material-symbols-outlined" aria-hidden="true">close</span>\n  </button>` : ''
    return `<div class="inspera-snackbar inspera-snackbar--${v.intent.toLowerCase()}" role="status" aria-live="polite">
  <span class="material-symbols-outlined inspera-snackbar__icon" aria-hidden="true">${icon}</span>
  <span class="inspera-snackbar__message">Assessment saved successfully.</span>${action}${close}
</div>`
  },
  component: (v) => (
    <Snackbar intent={v.intent as never} hasAction={v.hasAction === 'true'} hasClose={v.hasClose === 'true'} />
  ),
  notes: [
    'The bar is always `--gray-900` with white text. The intent tints the icon and the action label only — a green snackbar is wrong.',
    'Fixed 48px height, `--radius-md`, `--shadow-300`, and asymmetric padding (16px leading, 8px trailing) because the close button carries its own.',
    'Accents are the 400 shade of each family, which reads on the dark bar; the 600 shades do not.',
    'Always `role="status"` with `aria-live="polite"` — a snackbar must never interrupt, which is also why nothing the user has to act on later belongs here.',
  ],
}

// ---------------------------------------------------------------------------
// Avatar — a round surface holding initials, a photo or an icon, with an
// optional status dot. Every dimension derives from the diameter.
// ---------------------------------------------------------------------------
const AVATAR_IMG = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=112&h=112&fit=crop&auto=format'

const avatar: Recipe = {
  className: 'inspera-avatar',
  css: `/* The wrapper exists so the status dot can be positioned against the
   avatar without being clipped by its overflow: hidden. */
.inspera-avatar {
  position: relative;
  display: inline-flex;
}

.inspera-avatar__surface {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-pill);
  background: var(--avatar-surface);
  color: var(--gray-900);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  font-family: var(--font-sans);
  font-weight: 500;
  /* Initials are 40% of the diameter, so they scale with the avatar. */
  font-size: 16px;
}

.inspera-avatar--small .inspera-avatar__surface  { width: 32px; height: 32px; font-size: 12.8px; }
.inspera-avatar--large .inspera-avatar__surface  { width: 56px; height: 56px; font-size: 22.4px; }

.inspera-avatar__surface img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* The icon variant is 55% of the diameter, larger than the initials. */
.inspera-avatar__surface .material-symbols-outlined {
  font-size: 22px;
  color: var(--gray-600);
}
.inspera-avatar--small .inspera-avatar__surface .material-symbols-outlined { font-size: 17.6px; }
.inspera-avatar--large .inspera-avatar__surface .material-symbols-outlined { font-size: 30.8px; }

/* The dot is 28% of the diameter, with a 2px white ring so it stays legible
   against a photo. */
.inspera-avatar__status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 11.2px;
  height: 11.2px;
  border-radius: 9999px;
  border: 2px solid var(--white);
}
.inspera-avatar--small .inspera-avatar__status { width: 8.96px; height: 8.96px; }
.inspera-avatar--large .inspera-avatar__status { width: 15.68px; height: 15.68px; }

.inspera-avatar__status--online  { background: var(--success); }
.inspera-avatar__status--offline { background: var(--gray-500); }
.inspera-avatar__status--busy    { background: var(--error); }`,
  html: `<!-- Initials. The accessible name carries them, since the text is decorative. -->
<span class="inspera-avatar">
  <span class="inspera-avatar__surface" role="img" aria-label="Jane Cooper (JC)">
    <span>JC</span>
  </span>
</span>

<!-- Photo, with a status dot. -->
<span class="inspera-avatar">
  <span class="inspera-avatar__surface" role="img" aria-label="Jane Cooper">
    <img src="/avatar.jpg" alt="Jane Cooper" />
  </span>
  <span class="inspera-avatar__status inspera-avatar__status--online" aria-label="Online"></span>
</span>`,
  markup: (v) => {
    const size = v.size === 'Medium' ? '' : ` inspera-avatar--${v.size.toLowerCase()}`
    const label = v.content === 'Initials' ? 'User avatar (JC)' : 'User avatar'
    const inner =
      v.content === 'Image' ? `    <img src="${AVATAR_IMG}" alt="User avatar" />\n`
        : v.content === 'Initials' ? `    <span>JC</span>\n`
        : `    <span class="material-symbols-outlined" aria-hidden="true">person</span>\n`
    const status = v.status === 'None'
      ? ''
      : `\n  <span class="inspera-avatar__status inspera-avatar__status--${v.status.toLowerCase()}" aria-label="${v.status}"></span>`
    return `<span class="inspera-avatar${size}">
  <span class="inspera-avatar__surface" role="img" aria-label="${label}">
${inner}  </span>${status}
</span>`
  },
  component: (v) => (
    <Avatar size={v.size as never} content={v.content as never} status={v.status as never} />
  ),
  props: ['object-fit'],
  notes: [
    'Diameters are 32 / 40 / 56. Initials are 40% of that, the icon 55%, the status dot 28% — never a fixed size.',
    'The surface uses `--avatar-surface`, not a random grey, and `--radius-pill`.',
    'The status dot needs its 2px `--white` ring, or it disappears against a photo.',
    'The accessible name lives on the surface (`role="img"`); the initials themselves are decorative text.',
    'The wrapper is separate from the surface because the surface clips its image with `overflow: hidden`, which would cut the dot in half.',
  ],
}

// ---------------------------------------------------------------------------
// Avatar group — overlapped avatars with a +N overflow chip. The white ring on
// each is what makes the overlap read as separate people.
// ---------------------------------------------------------------------------
const avatarGroup: Recipe = {
  className: 'inspera-avatar-group',
  css: `.inspera-avatar-group {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-sans);
}

/* Each avatar sits in a ring and pulls left over the one before it. The ring
   is a box-shadow, not a border, so it does not change the avatar's size. */
.inspera-avatar-group__item {
  display: inline-flex;
  border-radius: 9999px;
  box-shadow: 0 0 0 2px var(--white);
  margin-left: -12px;
}
.inspera-avatar-group--small .inspera-avatar-group__item { margin-left: -10px; }
.inspera-avatar-group--large .inspera-avatar-group__item { margin-left: -17px; }

/* Last, so it outranks the size modifiers above: nothing overlaps the first. */
.inspera-avatar-group__item:first-child { margin-left: 0; }

/* The overflow chip is the same circle, filled and labelled +N. */
.inspera-avatar-group__more {
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--gray-200);
  color: var(--gray-700);
  font-size: 13.6px;
  font-weight: 500;
}
.inspera-avatar-group--small .inspera-avatar-group__more { width: 32px; height: 32px; font-size: 10.88px; }
.inspera-avatar-group--large .inspera-avatar-group__more { width: 56px; height: 56px; font-size: 19.04px; }`,
  html: `<div class="inspera-avatar-group" role="group" aria-label="6 participants">
  <span class="inspera-avatar-group__item">
    <span class="inspera-avatar">
      <span class="inspera-avatar__surface" role="img" aria-label="Ada Lovelace (AL)"><span>AL</span></span>
    </span>
  </span>
  <span class="inspera-avatar-group__item">
    <span class="inspera-avatar">
      <span class="inspera-avatar__surface" role="img" aria-label="Grace Hopper (GH)"><span>GH</span></span>
    </span>
  </span>
  <span class="inspera-avatar-group__item inspera-avatar-group__more" aria-label="4 more">+4</span>
</div>`,
  composes: ['avatar'],
  markup: (v) => {
    const names = ['Ada Lovelace', 'Linus Torvalds', 'Grace Hopper', 'Alan Turing', 'Katherine Johnson', 'Edsger Dijkstra']
    const max = Number(v.max)
    const size = v.size === 'Medium' ? '' : ` inspera-avatar-group--${v.size.toLowerCase()}`
    const avatarSize = v.size === 'Medium' ? '' : ` inspera-avatar--${v.size.toLowerCase()}`
    const initials = (n: string) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    const shown = names.slice(0, max).map((n) => `  <span class="inspera-avatar-group__item">
    <span class="inspera-avatar${avatarSize}">
      <span class="inspera-avatar__surface" role="img" aria-label="${n} (${initials(n)})"><span>${initials(n)}</span></span>
    </span>
  </span>`).join('\n')
    const overflow = names.length - max
    const more = overflow > 0
      ? `\n  <span class="inspera-avatar-group__item inspera-avatar-group__more${size ? ' ' + size.trim() : ''}" aria-label="${overflow} more">+${overflow}</span>`
      : ''
    return `<div class="inspera-avatar-group${size}" role="group" aria-label="${names.length} participants">
${shown}${more}
</div>`
  },
  component: (v) => (
    <AvatarGroup
      size={v.size as never}
      max={Number(v.max)}
      avatars={[
        { name: 'Ada Lovelace' }, { name: 'Linus Torvalds' }, { name: 'Grace Hopper' },
        { name: 'Alan Turing' }, { name: 'Katherine Johnson' }, { name: 'Edsger Dijkstra' },
      ]}
    />
  ),
  notes: [
    'Overlap is 30% of the diameter as a negative left margin — 10 / 12 / 17px for small / medium / large — and the first item has none.',
    'The separating ring is a `box-shadow`, not a border: a border would grow each avatar and break the spacing.',
    'The overflow chip is `+N` on `--gray-200` at 34% of the diameter, sized identically to an avatar.',
    'The group carries `role="group"` and a count in its label; the chip carries "N more". Overlapping avatars are meaningless to a screen reader without both.',
  ],
}

// ---------------------------------------------------------------------------
// Progress — a bar or a ring. Both need explicit ARIA; a styled div announces
// nothing at all.
// ---------------------------------------------------------------------------
const progress: Recipe = {
  className: 'inspera-progress',
  css: `.inspera-progress {
  --progress-fill: var(--primary);

  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  font-family: var(--font-sans);
}

.inspera-progress--circular { width: auto; }

.inspera-progress--success { --progress-fill: var(--success); }
.inspera-progress--warning { --progress-fill: var(--warning); }
.inspera-progress--error   { --progress-fill: var(--error); }

/* Linear: a rounded track that clips the fill. */
.inspera-progress__track {
  position: relative;
  flex: 1;
  height: 8px;
  border-radius: var(--radius-pill);
  background: var(--gray-200);
  overflow: hidden;
}
.inspera-progress--small .inspera-progress__track { height: 4px; }
.inspera-progress--large .inspera-progress__track { height: 12px; }

.inspera-progress__fill {
  display: block;
  height: 100%;
  border-radius: var(--radius-pill);
  background: var(--progress-fill);
  transition: width 240ms ease;
}

/* Indeterminate: a 40% sliver that sweeps the track. Width is animated, so the
   fill is absolutely positioned rather than sized by a value. */
.inspera-progress__fill--indeterminate {
  position: absolute;
  top: 0;
  left: 0;
  width: 40%;
  transition: none;
  animation: inspera-indeterminate 1.4s ease infinite;
}

.inspera-progress__value {
  font-size: 14px;
  color: var(--text-primary);
  min-width: 36px;
  text-align: right;
}

/* Circular: the ring spins as a whole when indeterminate. */
.inspera-progress__ring {
  display: inline-flex;
  width: 40px;
  height: 40px;
}
.inspera-progress__ring--indeterminate { animation: inspera-spin 0.9s linear infinite; }
.inspera-progress__ring > svg { transform: rotate(-90deg); }

@keyframes inspera-indeterminate {
  0%   { left: -40%; width: 40%; }
  50%  { width: 55%; }
  100% { left: 100%; width: 40%; }
}

@keyframes inspera-spin {
  to { transform: rotate(360deg); }
}`,
  html: `<!-- Linear, 60%. The ARIA is the component: a styled div announces nothing. -->
<span class="inspera-progress">
  <span class="inspera-progress__track" role="progressbar"
        aria-valuemin="0" aria-valuemax="100" aria-valuenow="60" aria-label="Uploading attachments">
    <span class="inspera-progress__fill" style="width: 60%" aria-hidden="true"></span>
  </span>
  <span class="inspera-progress__value">60%</span>
</span>

<!-- Indeterminate: drop aria-valuenow entirely, do not send 0. -->
<span class="inspera-progress">
  <span class="inspera-progress__track" role="progressbar"
        aria-valuemin="0" aria-valuemax="100" aria-label="Loading">
    <span class="inspera-progress__fill inspera-progress__fill--indeterminate" aria-hidden="true"></span>
  </span>
</span>`,
  markup: (v) => {
    const intent = v.intent === 'Primary' ? '' : ` inspera-progress--${v.intent.toLowerCase()}`
    const size = v.size === 'Medium' ? '' : ` inspera-progress--${v.size.toLowerCase()}`
    const indeterminate = v.indeterminate === 'true'
    const showValue = v.showValue === 'true' && !indeterminate
    const valueAttr = indeterminate ? '' : ' aria-valuenow="60"'
    const value = showValue ? `\n  <span class="inspera-progress__value">60%</span>` : ''

    if (v.variant === 'Circular') {
      const d = { Small: 24, Medium: 40, Large: 56 }[v.size]!
      const stroke = v.size === 'Small' ? 3 : v.size === 'Medium' ? 4 : 5
      const r = (d - stroke) / 2
      const c = 2 * Math.PI * r
      const offset = indeterminate ? c * 0.7 : c * 0.4
      const color = { Primary: 'var(--primary)', Success: 'var(--success)', Warning: 'var(--warning)', Error: 'var(--error)' }[v.intent]
      return `<span class="inspera-progress inspera-progress--circular${intent}${size}">
  <span class="inspera-progress__ring${indeterminate ? ' inspera-progress__ring--indeterminate' : ''}" style="width: ${d}px; height: ${d}px" role="progressbar"
        aria-valuemin="0" aria-valuemax="100"${valueAttr} aria-label="Progress">
    <svg width="${d}" height="${d}" viewBox="0 0 ${d} ${d}" aria-hidden="true">
      <circle cx="${d / 2}" cy="${d / 2}" r="${r}" fill="none" stroke="var(--gray-200)" stroke-width="${stroke}"></circle>
      <circle cx="${d / 2}" cy="${d / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}"
              stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${offset}"></circle>
    </svg>
  </span>${value}
</span>`
    }
    const fill = indeterminate
      ? `    <span class="inspera-progress__fill inspera-progress__fill--indeterminate" aria-hidden="true"></span>`
      : `    <span class="inspera-progress__fill" style="width: 60%" aria-hidden="true"></span>`
    return `<span class="inspera-progress${intent}${size}">
  <span class="inspera-progress__track" role="progressbar"
        aria-valuemin="0" aria-valuemax="100"${valueAttr} aria-label="Progress">
${fill}
  </span>${value}
</span>`
  },
  component: (v) => (
    <Progress
      variant={v.variant as never}
      value={60}
      intent={v.intent as never}
      size={v.size as never}
      indeterminate={v.indeterminate === 'true'}
      showValue={v.showValue === 'true'}
    />
  ),
  props: ['stroke-width', 'stroke-linecap', 'transform'],
  notes: [
    'The bar heights are 4 / 8 / 12 and the ring diameters 24 / 40 / 56, with stroke widths 3 / 4 / 5.',
    '`role="progressbar"` with `aria-valuemin`, `aria-valuemax` and an `aria-label` is mandatory. A styled div announces nothing.',
    'When indeterminate, omit `aria-valuenow` entirely. Sending 0 tells the user it is stuck at zero.',
    'The indeterminate bar is a 40% sliver swept by keyframes across a clipped track — not a full-width bar that fades.',
    'The ring is rotated -90deg so the arc starts at twelve o\'clock, and the arc length is set by `stroke-dashoffset`.',
  ],
}

// ---------------------------------------------------------------------------
// Breadcrumb — an ordered list. The last crumb is the current page and is not
// a control; the separators are decorative and must be hidden.
// ---------------------------------------------------------------------------
const breadcrumb: Recipe = {
  className: 'inspera-breadcrumb',
  css: `.inspera-breadcrumb {
  font-family: var(--font-sans);
}

.inspera-breadcrumb__list {
  display: flex;
  align-items: center;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
}

/* A crumb. Rendered as <button> in the React component because navigation runs
   through a router callback; with real URLs, use <a href> and the same class. */
.inspera-breadcrumb__crumb {
  padding: 0;
  border: none;
  background: none;
  color: var(--primary);
  font-family: var(--font-sans);
  font-size: 16px;
  text-decoration: none;
  cursor: pointer;
}
.inspera-breadcrumb__crumb:hover { text-decoration: underline; }

.inspera-breadcrumb--small .inspera-breadcrumb__crumb { font-size: 14px; }

/* The last crumb is the current page: darker, heavier, and not interactive. */
.inspera-breadcrumb__current {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}
.inspera-breadcrumb--small .inspera-breadcrumb__current { font-size: 14px; }

/* The separator sizes its own glyph rather than setting a size on the <li>,
   so the chevron can run 2px larger than the text while the slash matches it. */
.inspera-breadcrumb__separator {
  color: var(--gray-400);
  display: inline-flex;
  align-items: center;
}

.inspera-breadcrumb__separator .material-symbols-outlined { font-size: 18px; }
.inspera-breadcrumb--small .inspera-breadcrumb__separator .material-symbols-outlined { font-size: 16px; }

.inspera-breadcrumb__slash { font-size: 16px; }
.inspera-breadcrumb--small .inspera-breadcrumb__slash { font-size: 14px; }`,
  html: `<nav class="inspera-breadcrumb" aria-label="Breadcrumb">
  <ol class="inspera-breadcrumb__list">
    <li><a class="inspera-breadcrumb__crumb" href="/">Home</a></li>
    <li class="inspera-breadcrumb__separator" aria-hidden="true">
      <span class="material-symbols-outlined">chevron_right</span>
    </li>
    <li><a class="inspera-breadcrumb__crumb" href="/assessments">Assessments</a></li>
    <li class="inspera-breadcrumb__separator" aria-hidden="true">
      <span class="material-symbols-outlined">chevron_right</span>
    </li>
    <li><span class="inspera-breadcrumb__current" aria-current="page">Algebra Quiz</span></li>
  </ol>
</nav>`,
  markup: (v) => {
    const items = ['Home', 'Assessments', 'Mathematics', 'Algebra Quiz']
    const small = v.size === 'Small' ? ' inspera-breadcrumb--small' : ''
    const sep = v.separator === 'Chevron'
      ? `    <li class="inspera-breadcrumb__separator" aria-hidden="true"><span class="material-symbols-outlined">chevron_right</span></li>`
      : `    <li class="inspera-breadcrumb__separator" aria-hidden="true"><span class="inspera-breadcrumb__slash">/</span></li>`
    const rows: string[] = []
    items.forEach((item, i) => {
      const last = i === items.length - 1
      rows.push(last
        ? `    <li><span class="inspera-breadcrumb__current" aria-current="page">${item}</span></li>`
        : `    <li><button type="button" class="inspera-breadcrumb__crumb">${item}</button></li>`)
      if (!last) rows.push(sep)
    })
    return `<nav class="inspera-breadcrumb${small}" aria-label="Breadcrumb">
  <ol class="inspera-breadcrumb__list">
${rows.join('\n')}
  </ol>
</nav>`
  },
  component: (v) => (
    <Breadcrumb separator={v.separator as never} size={v.size as never} />
  ),
  notes: [
    'It is a `<nav aria-label="Breadcrumb">` wrapping an `<ol>` — order is the meaning, so not a `<div>` of spans.',
    'The last crumb is the current page: `aria-current="page"`, `--text-primary` at 500 weight, and not a control.',
    'Separators live in their own `<li>` marked `aria-hidden="true"`. Left announced, a screen reader reads "chevron right" between every crumb.',
    'Crumbs are 16px (14px small) in `--primary`, underlined on hover only. The chevron runs 2px larger than the text.',
    'With real URLs use `<a href>` rather than `<button>`, keeping the same class — a breadcrumb should be openable in a new tab.',
  ],
}

// ---------------------------------------------------------------------------
// Text input — label, field, help text. The field is a flex row wrapping the
// <input>, because the icons sit inside the border, not beside it.
// ---------------------------------------------------------------------------
const textInput: Recipe = {
  className: 'inspera-input',
  css: `.inspera-input {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  font-family: var(--font-sans);
}

.inspera-input__label {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

/* The bordered box is the wrapper, not the <input>. That is what lets a
   leading or trailing icon sit inside the border. */
.inspera-input__field {
  height: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border-radius: var(--radius-md);
  border: var(--border-width-default) solid var(--border-control);
  background: var(--white);
  transition:
    border-color var(--duration-fast) var(--easing-standard),
    box-shadow var(--duration-fast) var(--easing-standard);
}

.inspera-input--small .inspera-input__field { height: 32px; }

.inspera-input__field:hover { border-color: var(--border-control-strong); }

/* :focus-within, not :focus — the focusable element is the <input> inside. */
.inspera-input__field:focus-within {
  border-color: var(--primary);
  box-shadow: var(--effect-state-focus);
}

/* The control itself is unstyled: no border, no outline, no background. All of
   that belongs to the wrapper, or you get a box inside a box. */
.inspera-input__control {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-sans);
  font-size: 16px;
  color: var(--text-primary);
}

.inspera-input__field .material-symbols-outlined {
  font-size: 20px;
  color: var(--action-active);
}

.inspera-input__help {
  font-size: 12px;
  color: var(--muted-foreground);
}

.inspera-input__error {
  font-size: 12px;
  color: var(--error);
}

/* Invalid outranks hover and focus — the error has to stay legible. */
.inspera-input__field[data-invalid='true'],
.inspera-input__field[data-invalid='true']:hover,
.inspera-input__field[data-invalid='true']:focus-within {
  border-color: var(--error);
  box-shadow: var(--effect-state-error);
}

.inspera-input__field[data-disabled='true'] {
  background: var(--surface-disabled);
  opacity: 0.6;
}

.inspera-input__field[data-readonly='true'] {
  background: var(--gray-100);
}
.inspera-input__field[data-readonly='true']:hover { border-color: var(--border-control); }`,
  html: `<div class="inspera-input">
  <label class="inspera-input__label" for="email">Email address</label>
  <div class="inspera-input__field">
    <input class="inspera-input__control" id="email" type="email"
           placeholder="jane@inspera.com" aria-describedby="email-help" />
  </div>
  <span class="inspera-input__help" id="email-help">We'll never share your email.</span>
</div>

<!-- Invalid. aria-invalid and aria-describedby both point at the message. -->
<div class="inspera-input">
  <label class="inspera-input__label" for="email2">Email address</label>
  <div class="inspera-input__field" data-invalid="true">
    <span class="material-symbols-outlined" aria-hidden="true">mail</span>
    <input class="inspera-input__control" id="email2" type="email"
           aria-invalid="true" aria-describedby="email2-err" />
  </div>
  <span class="inspera-input__error" id="email2-err">Enter a valid email address.</span>
</div>`,
  markup: (v) => {
    const small = v.size === 'Small' ? ' inspera-input--small' : ''
    const lead = v.leadingIcon === 'true'
      ? `\n    <span class="material-symbols-outlined" aria-hidden="true">mail</span>` : ''
    const trail = v.trailingIcon === 'true'
      ? `\n    <span class="material-symbols-outlined" aria-hidden="true">close</span>` : ''
    return `<div class="inspera-input${small}">
  <label class="inspera-input__label" for="email">Email address</label>
  <div class="inspera-input__field">${lead}
    <input class="inspera-input__control" id="email" placeholder="jane@inspera.com" aria-describedby="email-help" />${trail}
  </div>
  <span class="inspera-input__help" id="email-help">We'll never share your email.</span>
</div>`
  },
  component: (v) => (
    <TextInput
      label="Email address"
      placeholder="jane@inspera.com"
      size={v.size as never}
      leadingIcon={v.leadingIcon === 'true' ? 'mail' : undefined}
      trailingIcon={v.trailingIcon === 'true' ? 'close' : undefined}
      helpText="We'll never share your email."
      errorText="Enter a valid email address."
    />
  ),
  notes: [
    'The border belongs to the wrapper, not the `<input>`. The input itself has no border, no outline and no background — otherwise icons cannot sit inside the field.',
    'Focus is `:focus-within` on the wrapper, drawn as `--effect-state-focus` (a 3px box-shadow) plus a `--primary` border. Fields ring with a shadow; buttons ring with an outline.',
    'Height is 40px (32px small), radius `--radius-md`, resting border `--border-control` #C4C4C4 going to `--border-control-strong` on hover.',
    'Help and error text are 12px. Only one shows at a time, and `aria-describedby` points at whichever it is.',
    'A visible `<label>` with `for` is required. A placeholder is not a label.',
  ],
}

// ---------------------------------------------------------------------------
// Textarea — the same field, stacked, with an optional character counter that
// lives inside the border.
// ---------------------------------------------------------------------------
const textarea: Recipe = {
  className: 'inspera-textarea',
  css: `.inspera-textarea {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  font-family: var(--font-sans);
}

.inspera-textarea__label {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

/* Column, not row: the counter sits under the text, inside the border. */
.inspera-textarea__field {
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  border: var(--border-width-default) solid var(--border-control);
  background: var(--white);
  transition:
    border-color var(--duration-fast) var(--easing-standard),
    box-shadow var(--duration-fast) var(--easing-standard);
}

.inspera-textarea--small .inspera-textarea__field { padding: 6px 12px; }

.inspera-textarea__field:hover { border-color: var(--border-control-strong); }

.inspera-textarea__field:focus-within {
  border-color: var(--primary);
  box-shadow: var(--effect-state-focus);
}

.inspera-textarea__control {
  width: 100%;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  /* Vertical only. Free resize lets the user drag it out of the layout. */
  resize: vertical;
  font-family: var(--font-sans);
  font-size: 16px;
  color: var(--text-primary);
}

.inspera-textarea__count {
  align-self: flex-end;
  margin-top: 4px;
  font-size: 12px;
  color: var(--muted-foreground);
}

.inspera-textarea__help  { font-size: 12px; color: var(--muted-foreground); }
.inspera-textarea__error { font-size: 12px; color: var(--error); }

.inspera-textarea__field[data-invalid='true'],
.inspera-textarea__field[data-invalid='true']:hover,
.inspera-textarea__field[data-invalid='true']:focus-within {
  border-color: var(--error);
  box-shadow: var(--effect-state-error);
}

.inspera-textarea__field[data-disabled='true'] {
  background: var(--surface-disabled);
  opacity: 0.6;
}`,
  html: `<div class="inspera-textarea">
  <label class="inspera-textarea__label" for="feedback">Feedback</label>
  <div class="inspera-textarea__field">
    <textarea class="inspera-textarea__control" id="feedback" rows="4"
              maxlength="280" placeholder="Share your thoughts…"
              aria-describedby="feedback-help"></textarea>
    <span class="inspera-textarea__count">0/280</span>
  </div>
  <span class="inspera-textarea__help" id="feedback-help">Keep it constructive.</span>
</div>`,
  markup: (v) => {
    const small = v.size === 'Small' ? ' inspera-textarea--small' : ''
    const count = v.showCount === 'true'
      ? `\n    <span class="inspera-textarea__count">0/280</span>` : ''
    const help = v.showHelp === 'true'
      ? `\n  <span class="inspera-textarea__help" id="feedback-help">Keep it constructive.</span>` : ''
    const describedBy = v.showHelp === 'true' ? ' aria-describedby="feedback-help"' : ''
    return `<div class="inspera-textarea${small}">
  <label class="inspera-textarea__label" for="feedback">Feedback</label>
  <div class="inspera-textarea__field">
    <textarea class="inspera-textarea__control" id="feedback" rows="4" maxlength="280" placeholder="Share your thoughts…"${describedBy}></textarea>${count}
  </div>${help}
</div>`
  },
  component: (v) => (
    <Textarea
      label="Feedback"
      placeholder="Share your thoughts…"
      size={v.size as never}
      showCount={v.showCount === 'true'}
      maxLength={280}
      helpText={v.showHelp === 'true' ? 'Keep it constructive.' : undefined}
      errorText="This field is required."
    />
  ),
  notes: [
    'Same field treatment as Text Input, but the wrapper is a column so the counter sits inside the border, under the text.',
    'Vertical padding is 8px (6px small); horizontal stays 12px at both sizes.',
    '`resize: vertical` only. Free resize lets the user drag the field out of the layout.',
    'The counter is presentational — pair `maxlength` on the control with it, and do not rely on the counter to enforce the limit.',
  ],
}

// ---------------------------------------------------------------------------
// Checkbox — a visually hidden native input plus a drawn box. The input has to
// stay in the DOM and stay focusable; hiding it with display:none breaks both
// keyboard access and form submission.
// ---------------------------------------------------------------------------
const checkbox: Recipe = {
  className: 'inspera-checkbox',
  css: `.inspera-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  cursor: pointer;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
}

/* Hidden, but still in the DOM, still focusable, still submitted with the
   form. "display: none" or "visibility: hidden" would break all three. */
.inspera-checkbox__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.inspera-checkbox__box {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-xs);
  border: 2px solid var(--border-control-strong);
  background: var(--white);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  flex-shrink: 0;
  transition: all 120ms ease;
}

.inspera-checkbox--small .inspera-checkbox__box { width: 16px; height: 16px; }

/* The tick is a Material Symbol at the box size minus 4. */
.inspera-checkbox__box .material-symbols-outlined {
  font-size: 16px;
  font-variation-settings: 'wght' 600;
}
.inspera-checkbox--small .inspera-checkbox__box .material-symbols-outlined { font-size: 12px; }

.inspera-checkbox__input:checked + .inspera-checkbox__box,
.inspera-checkbox__input:indeterminate + .inspera-checkbox__box,
/* "indeterminate" is a DOM property with no HTML attribute, so static markup
   cannot trigger :indeterminate. The modifier lets server-rendered markup show
   the state; script that sets el.indeterminate gets the pseudo-class. */
.inspera-checkbox--mixed .inspera-checkbox__box {
  border-color: var(--primary);
  background: var(--primary);
}

.inspera-checkbox:hover .inspera-checkbox__box { border-color: var(--primary); background: rgba(0, 64, 128, 0.04); }
.inspera-checkbox:hover .inspera-checkbox__input:checked + .inspera-checkbox__box,
.inspera-checkbox:hover .inspera-checkbox__input:indeterminate + .inspera-checkbox__box,
.inspera-checkbox--mixed:hover .inspera-checkbox__box {
  border-color: var(--primary);
  background: var(--primary);
}

/* The ring goes on the drawn box: the real input is 0×0, so a ring on it is
   invisible. This is the single most-missed detail in a custom checkbox. */
.inspera-checkbox__input:focus-visible + .inspera-checkbox__box {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.inspera-checkbox:active .inspera-checkbox__box { transform: scale(0.92); }

.inspera-checkbox--error .inspera-checkbox__box { border-color: var(--error); }
.inspera-checkbox--error:hover .inspera-checkbox__box { border-color: var(--error); }

.inspera-checkbox--disabled {
  cursor: not-allowed;
  opacity: 0.38;
}
.inspera-checkbox--disabled:hover .inspera-checkbox__box {
  border-color: var(--border-control-strong);
  background: var(--white);
}`,
  html: `<label class="inspera-checkbox" for="updates">
  <input class="inspera-checkbox__input" id="updates" type="checkbox" />
  <span class="inspera-checkbox__box" aria-hidden="true">
    <span class="material-symbols-outlined">check</span>
  </span>
  <span>Send me product updates</span>
</label>

<!-- Indeterminate is a DOM property, not an attribute. Set it in script:
     document.getElementById('all').indeterminate = true -->
<label class="inspera-checkbox" for="all">
  <input class="inspera-checkbox__input" id="all" type="checkbox" aria-checked="mixed" />
  <span class="inspera-checkbox__box" aria-hidden="true">
    <span class="material-symbols-outlined">remove</span>
  </span>
  <span>Select all</span>
</label>`,
  markup: (v) => {
    const small = v.size === 'Small' ? ' inspera-checkbox--small' : ''
    const mixed = v.indeterminate === 'true'
    const mixedClass = mixed ? ' inspera-checkbox--mixed' : ''
    const glyph = mixed ? 'remove' : 'check'
    const label = v.withLabel === 'true'
      ? `\n  <span>Send me product updates</span>` : ''
    const aria = mixed ? ' aria-checked="mixed"' : ''
    return `<label class="inspera-checkbox${small}${mixedClass}" for="updates">
  <input class="inspera-checkbox__input" id="updates" type="checkbox"${aria} />
  <span class="inspera-checkbox__box" aria-hidden="true">${mixed ? `\n    <span class="material-symbols-outlined">${glyph}</span>\n  ` : ''}</span>${label}
</label>`
  },
  component: (v) => (
    <Checkbox
      label="Send me product updates"
      size={v.size as never}
      indeterminate={v.indeterminate === 'true'}
      withLabel={v.withLabel === 'true'}
    />
  ),
  notes: [
    'Keep the native `<input type="checkbox">` in the DOM, visually hidden with `position: absolute; opacity: 0; width: 0; height: 0`. `display: none` removes it from the tab order and from form submission.',
    'Draw the focus ring on the box via `:focus-visible + .box`. A ring on a 0×0 input is invisible — this is the detail custom checkboxes miss most often.',
    'The box is 20px (16px small) with a 2px border and `--radius-xs`. Unchecked is `--border-control-strong`; checked fills with `--primary`.',
    'Indeterminate is a DOM property (`el.indeterminate = true`), not an HTML attribute, and it announces as `aria-checked="mixed"`. Its glyph is `remove`, not a tick. Static markup that cannot run script uses the `inspera-checkbox--mixed` class instead.',
    'The whole row is the `<label>`, so the text is part of the hit target.',
  ],
}

// ---------------------------------------------------------------------------
// Radio — the same pattern as Checkbox, with a dot instead of a tick, and the
// `name` attribute doing the grouping.
// ---------------------------------------------------------------------------
const radioButton: Recipe = {
  className: 'inspera-radio',
  css: `.inspera-radio {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  cursor: pointer;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
}

.inspera-radio__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.inspera-radio__circle {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-pill);
  border: 2px solid var(--border-control-strong);
  background: var(--white);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 120ms ease;
}

/* The dot is a child element, not a background — it has to stay centred as the
   circle scales on press. */
.inspera-radio__dot {
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  background: var(--primary);
}

.inspera-radio__input:checked + .inspera-radio__circle { border-color: var(--primary); }

.inspera-radio:hover .inspera-radio__circle { border-color: var(--primary); background: rgba(0, 64, 128, 0.04); }

.inspera-radio__input:focus-visible + .inspera-radio__circle {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.inspera-radio:active .inspera-radio__circle { transform: scale(0.92); }

.inspera-radio--error .inspera-radio__circle { border-color: var(--error); }
.inspera-radio--error:hover .inspera-radio__circle { border-color: var(--error); }

.inspera-radio--disabled { cursor: not-allowed; opacity: 0.38; }`,
  html: `<!-- Every radio in one group shares a name. Radios with no name, or with
     a shared generic name across unrelated questions, will fight each other. -->
<label class="inspera-radio" for="standard">
  <input class="inspera-radio__input" id="standard" type="radio" name="delivery" />
  <span class="inspera-radio__circle" aria-hidden="true">
    <span class="inspera-radio__dot"></span>
  </span>
  <span>Standard delivery</span>
</label>

<label class="inspera-radio" for="express">
  <input class="inspera-radio__input" id="express" type="radio" name="delivery" />
  <span class="inspera-radio__circle" aria-hidden="true"></span>
  <span>Express delivery</span>
</label>`,
  markup: (v) => {
    const label = v.withLabel === 'true' ? `\n  <span>Standard delivery</span>` : ''
    return `<label class="inspera-radio" for="standard">
  <input class="inspera-radio__input" id="standard" type="radio" name="delivery" />
  <span class="inspera-radio__circle" aria-hidden="true"></span>${label}
</label>`
  },
  component: (v) => (
    <RadioButton label="Standard delivery" name="delivery" withLabel={v.withLabel === 'true'} />
  ),
  notes: [
    'Identical structure to Checkbox: a visually hidden native `<input type="radio">` plus a drawn circle, with the ring on the circle.',
    'The circle is 20px with a 2px border and `--radius-pill`; the selected dot is a 10px child element, not a background, so it stays centred while the circle scales on press.',
    'Grouping is the `name` attribute. Every radio in one question shares it, and unrelated questions must not — two groups sharing a name become one.',
    'For a set of options prefer the Radio Group component, which owns the name and the group label for you.',
  ],
}

// ---------------------------------------------------------------------------
// Toggle — an immediate on/off switch. It needs role="switch"; a bare checkbox
// announces as a checkbox, which is a different promise.
// ---------------------------------------------------------------------------
const toggle: Recipe = {
  className: 'inspera-toggle',
  css: `.inspera-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
}

.inspera-toggle__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.inspera-toggle__track {
  width: 44px;
  height: 24px;
  border-radius: var(--radius-pill);
  background: var(--border-control);
  padding: 2px;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  transition: background 140ms ease;
}

.inspera-toggle--small .inspera-toggle__track { width: 36px; height: 20px; }

.inspera-toggle__thumb {
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  background: var(--white);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  transform: translateX(0);
  transition: transform 160ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 120ms ease;
}

.inspera-toggle--small .inspera-toggle__thumb { width: 16px; height: 16px; }

.inspera-toggle__input:checked + .inspera-toggle__track { background: var(--primary); }

/* Travel is track − thumb − (2 × padding). */
.inspera-toggle__input:checked + .inspera-toggle__track .inspera-toggle__thumb {
  transform: translateX(20px);
}
.inspera-toggle--small .inspera-toggle__input:checked + .inspera-toggle__track .inspera-toggle__thumb {
  transform: translateX(16px);
}

.inspera-toggle:hover .inspera-toggle__thumb { box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); }

.inspera-toggle__input:focus-visible + .inspera-toggle__track {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.inspera-toggle--disabled { cursor: not-allowed; opacity: 0.38; }`,
  html: `<label class="inspera-toggle" for="notify">
  <input class="inspera-toggle__input" id="notify" type="checkbox" role="switch" />
  <span class="inspera-toggle__track" aria-hidden="true">
    <span class="inspera-toggle__thumb"></span>
  </span>
  <span>Enable notifications</span>
</label>`,
  markup: (v) => {
    const small = v.size === 'Small' ? ' inspera-toggle--small' : ''
    const label = v.withLabel === 'true' ? `\n  <span>Enable notifications</span>` : ''
    return `<label class="inspera-toggle${small}" for="notify">
  <input class="inspera-toggle__input" id="notify" type="checkbox" role="switch" />
  <span class="inspera-toggle__track" aria-hidden="true">
    <span class="inspera-toggle__thumb"></span>
  </span>${label}
</label>`
  },
  component: (v) => (
    <Toggle label="Enable notifications" size={v.size as never} withLabel={v.withLabel === 'true'} />
  ),
  notes: [
    'The input carries `role="switch"`. Without it the control announces as a checkbox, which promises a form value rather than an immediate change.',
    'Track 44×24 (36×20 small), thumb 20px (16px), 2px padding. Thumb travel is track − thumb − 2×padding: 20px, or 16px when small.',
    'The track fill is `--border-control` off and `--primary` on. It does not tint on hover — only the thumb shadow deepens.',
    'The focus ring goes on the track, since the real input is 0×0.',
    'A toggle applies immediately. If the change needs a Save button, use a Checkbox instead.',
  ],
}

// ---------------------------------------------------------------------------
// Segmented control — a radiogroup of buttons on a tinted track. The selected
// segment is a raised white card, not just a colour change.
// ---------------------------------------------------------------------------
const segmentedControl: Recipe = {
  className: 'inspera-segmented',
  css: `.inspera-segmented {
  display: inline-flex;
  gap: 2px;
  padding: 4px;
  background: var(--gray-100);
  border-radius: var(--radius-md);
}

.inspera-segmented--full { width: 100%; }

.inspera-segmented__item {
  height: 40px;
  padding: 0 16px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  box-shadow: none;
  color: var(--muted-foreground);
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 120ms ease;
}

.inspera-segmented--small .inspera-segmented__item { height: 32px; }
.inspera-segmented--full .inspera-segmented__item { flex: 1; }

/* Selected: a raised white card on the tinted track. Colour alone is not
   enough separation at 14px. */
.inspera-segmented__item[aria-checked='true'] {
  background: var(--surface);
  box-shadow: var(--shadow-100);
  color: var(--primary);
  font-weight: 600;
}`,
  html: `<!-- Roving tabindex: the group is one tab stop and the arrows move inside it. -->
<div class="inspera-segmented" role="radiogroup" aria-label="Date range">
  <button type="button" class="inspera-segmented__item" role="radio" aria-checked="true" tabindex="0">Day</button>
  <button type="button" class="inspera-segmented__item" role="radio" aria-checked="false" tabindex="-1">Week</button>
  <button type="button" class="inspera-segmented__item" role="radio" aria-checked="false" tabindex="-1">Month</button>
</div>`,
  markup: (v) => {
    const size = v.size === 'Small' ? ' inspera-segmented--small' : ''
    const full = v.fullWidth === 'true' ? ' inspera-segmented--full' : ''
    const items = ['Day', 'Week', 'Month'].map((label, i) =>
      `  <button type="button" class="inspera-segmented__item" role="radio" aria-checked="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${label}</button>`)
    return `<div class="inspera-segmented${size}${full}" role="radiogroup">\n${items.join('\n')}\n</div>`
  },
  component: (v) => (
    <SegmentedControl items={['Day', 'Week', 'Month']} size={v.size as never} fullWidth={v.fullWidth === 'true'} />
  ),
  notes: [
    'The track is `--gray-100` with 4px padding and `--radius-md`; segments are `--radius-sm` inside it.',
    'The selected segment becomes a white `--surface` card with `--shadow-100` and `--primary` text at 600 weight. Colour alone is not enough at 14px.',
    'Segment height is 40px (32px small) and the type stays 14px at both.',
    'Use `role="radiogroup"` with `role="radio"` children and a roving tabindex: the selected item is the only tab stop, and arrows move between them.',
    'For more than about four options, or for anything not mutually exclusive, use Tabs or a Select instead.',
  ],
}

// ---------------------------------------------------------------------------
// Slider — a native range input made invisible, with the track and thumb drawn
// underneath it. Keeps every keyboard and touch behaviour for free.
// ---------------------------------------------------------------------------
const slider: Recipe = {
  className: 'inspera-slider',
  css: `.inspera-slider {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  font-family: var(--font-sans);
}

.inspera-slider__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.inspera-slider__label {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.inspera-slider__value {
  font-size: 14px;
  color: var(--muted-foreground);
  font-family: var(--font-mono);
}

.inspera-slider__control {
  position: relative;
  height: 20px;
  display: flex;
  align-items: center;
}

.inspera-slider__track {
  position: absolute;
  left: 0;
  right: 0;
  height: 4px;
  border-radius: var(--radius-pill);
  background: var(--gray-300);
}

.inspera-slider__fill {
  position: absolute;
  left: 0;
  height: 4px;
  border-radius: var(--radius-pill);
  background: var(--primary);
}

/* Drawn, and deliberately not hit-testable — the real input above it takes
   every pointer event, so drag, click-to-seek and touch all still work. */
.inspera-slider__thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  background: var(--white);
  border: 2px solid var(--primary);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  pointer-events: none;
}

/* The native input, invisible but fully functional: arrows, Home/End, Page
   Up/Down and touch drag all come free. Rebuilding this with a div loses them. */
.inspera-slider__input {
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 20px;
  margin: 0;
  opacity: 0;
  cursor: pointer;
}

.inspera-slider__input:focus-visible + .inspera-slider__thumb,
.inspera-slider__control:has(:focus-visible) .inspera-slider__thumb {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.inspera-slider--disabled { opacity: 0.5; }
.inspera-slider--disabled .inspera-slider__input { cursor: not-allowed; }`,
  html: `<div class="inspera-slider">
  <div class="inspera-slider__head">
    <label class="inspera-slider__label" for="volume">Volume</label>
    <span class="inspera-slider__value">50</span>
  </div>
  <div class="inspera-slider__control">
    <div class="inspera-slider__track"></div>
    <div class="inspera-slider__fill" style="width: 50%"></div>
    <span class="inspera-slider__thumb" style="left: 50%"></span>
    <input class="inspera-slider__input" id="volume" type="range"
           min="0" max="100" value="50" aria-label="Volume" />
  </div>
</div>`,
  markup: (v) => {
    const value = v.showValue === 'true'
      ? `\n    <span class="inspera-slider__value">50</span>` : ''
    return `<div class="inspera-slider">
  <div class="inspera-slider__head">
    <label class="inspera-slider__label" for="volume">Volume</label>${value}
  </div>
  <div class="inspera-slider__control">
    <div class="inspera-slider__track"></div>
    <div class="inspera-slider__fill" style="width: 50%"></div>
    <span class="inspera-slider__thumb" style="left: 50%"></span>
    <input class="inspera-slider__input" id="volume" type="range" min="0" max="100" value="50" aria-label="Volume" />
  </div>
</div>`
  },
  component: (v) => (
    <Slider label="Volume" min={0} max={100} showValue={v.showValue === 'true'} />
  ),
  notes: [
    'Keep a real `<input type="range">`, made invisible with `opacity: 0` over the drawn track. Arrows, Home/End, Page Up/Down and touch drag all come free; a div rebuild loses every one of them.',
    'The thumb takes `pointer-events: none` so the input underneath receives the drag.',
    'Track is 4px `--gray-300`, fill is `--primary`, thumb is 20px white with a 2px `--primary` border.',
    'Position the thumb with `left: <pct>%` and `transform: translate(-50%, -50%)`, so it centres on the value rather than hanging off the end.',
    'The focus ring goes on the drawn thumb, since the real input is invisible.',
  ],
}

// ---------------------------------------------------------------------------
// Rating — a radiogroup of stars. The fill axis of the variable font does the
// work; two different glyphs would jump.
// ---------------------------------------------------------------------------
const rating: Recipe = {
  className: 'inspera-rating',
  css: `.inspera-rating {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.inspera-rating__stars {
  display: inline-flex;
  gap: 2px;
}

.inspera-rating__star {
  font-size: 28px;
  line-height: 1;
  color: var(--gray-400);
  /* Same glyph, different fill axis. Swapping to a "star_outline" glyph shifts
     the shape and makes the row jump as you hover across it. */
  font-variation-settings: 'FILL' 0;
  border-radius: var(--radius-xs);
  cursor: pointer;
}

.inspera-rating--small .inspera-rating__star { font-size: 20px; }

.inspera-rating__star--filled {
  color: var(--warning);
  font-variation-settings: 'FILL' 1;
}

.inspera-rating__star:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.inspera-rating--readonly .inspera-rating__star { cursor: default; }

.inspera-rating__value {
  font-size: 14px;
  color: var(--muted-foreground);
  font-family: var(--font-mono);
}`,
  html: `<!-- Roving tabindex again: one tab stop, arrows move and set the value. -->
<div class="inspera-rating" role="radiogroup" aria-label="Rating">
  <div class="inspera-rating__stars">
    <span class="material-symbols-outlined inspera-rating__star inspera-rating__star--filled"
          role="radio" aria-checked="false" aria-label="1 star" tabindex="-1">star</span>
    <span class="material-symbols-outlined inspera-rating__star inspera-rating__star--filled"
          role="radio" aria-checked="false" aria-label="2 stars" tabindex="-1">star</span>
    <span class="material-symbols-outlined inspera-rating__star inspera-rating__star--filled"
          role="radio" aria-checked="true" aria-label="3 stars" tabindex="0">star</span>
    <span class="material-symbols-outlined inspera-rating__star"
          role="radio" aria-checked="false" aria-label="4 stars" tabindex="-1">star</span>
    <span class="material-symbols-outlined inspera-rating__star"
          role="radio" aria-checked="false" aria-label="5 stars" tabindex="-1">star</span>
  </div>
</div>`,
  markup: (v) => {
    const small = v.size === 'Small' ? ' inspera-rating--small' : ''
    const readonly = v.readOnly === 'true' ? ' inspera-rating--readonly' : ''
    const interactive = v.readOnly !== 'true'
    const stars = [1, 2, 3, 4, 5].map((n) =>
      `    <span class="material-symbols-outlined inspera-rating__star" role="radio" aria-checked="false" aria-label="${n} star${n > 1 ? 's' : ''}" tabindex="${interactive && n === 1 ? 0 : -1}">star</span>`)
    const value = v.showValue === 'true'
      ? `\n  <span class="inspera-rating__value">0/5</span>` : ''
    return `<div class="inspera-rating${small}${readonly}" role="radiogroup" aria-label="Rating">
  <div class="inspera-rating__stars">
${stars.join('\n')}
  </div>${value}
</div>`
  },
  component: (v) => (
    <Rating max={5} size={v.size as never} readOnly={v.readOnly === 'true'} showValue={v.showValue === 'true'} />
  ),
  props: ['font-variation-settings'],
  notes: [
    'One glyph — `star` — with the variable font’s FILL axis at 0 or 1. Swapping to a different outline glyph changes the shape and makes the row jump on hover.',
    'Filled stars are `--warning` #EF6C00; empty ones `--gray-400`. Stars are 28px (20px small) with a 2px gap.',
    '`role="radiogroup"` with `role="radio"` stars, a roving tabindex, and arrow keys that both move focus and set the value.',
    'Every star needs its own label ("3 stars"), or the control announces as five unlabelled radios.',
    'Hovering previews the rating up to the pointer; leaving restores the committed value.',
  ],
}

// ---------------------------------------------------------------------------
// OTP input — one input per digit, wired so typing advances, backspace
// retreats, and a paste of the whole code fills every box.
// ---------------------------------------------------------------------------
const otpInput: Recipe = {
  className: 'inspera-otp',
  css: `.inspera-otp {
  display: inline-flex;
  gap: 8px;
}

.inspera-otp__box {
  width: 44px;
  height: 48px;
  text-align: center;
  border: var(--border-width-default) solid var(--border-control);
  border-radius: var(--radius-md);
  background: var(--white);
  /* Monospace so the digits do not shift as they are typed. */
  font-family: var(--font-mono);
  font-size: 20px;
  color: var(--text-primary);
  outline: none;
  transition:
    border-color var(--duration-fast) var(--easing-standard),
    box-shadow var(--duration-fast) var(--easing-standard);
}

.inspera-otp__box:hover { border-color: var(--border-control-strong); }

.inspera-otp__box:focus {
  border-color: var(--primary);
  box-shadow: var(--effect-state-focus);
}

.inspera-otp__box[data-invalid='true'] {
  border-color: var(--error);
  box-shadow: var(--effect-state-error);
}

.inspera-otp__box[data-disabled='true'] {
  background: var(--surface-disabled);
  opacity: 0.6;
}`,
  html: `<!-- autocomplete="one-time-code" on the FIRST box only, so the platform
     offers the SMS code once rather than once per digit. -->
<div class="inspera-otp">
  <input class="inspera-otp__box" type="text" inputmode="numeric" maxlength="1"
         autocomplete="one-time-code" aria-label="Digit 1" />
  <input class="inspera-otp__box" type="text" inputmode="numeric" maxlength="1"
         autocomplete="off" aria-label="Digit 2" />
  <input class="inspera-otp__box" type="text" inputmode="numeric" maxlength="1"
         autocomplete="off" aria-label="Digit 3" />
</div>`,
  markup: (v) => {
    const len = Number(v.length)
    const filled = '123'
    const boxes = Array.from({ length: len }, (_, i) =>
      `  <input class="inspera-otp__box" type="text" inputmode="numeric" maxlength="1"` +
      ` autocomplete="${i === 0 ? 'one-time-code' : 'off'}" aria-label="Digit ${i + 1}"` +
      ` value="${filled[i] ?? ''}" />`)
    return `<div class="inspera-otp">\n${boxes.join('\n')}\n</div>`
  },
  component: (v) => (
    <OtpInput value="123" length={Number(v.length)} />
  ),
  notes: [
    'One `<input>` per digit, 44×48, `--radius-md`, in `--font-mono` at 20px so the digits do not shift as they are typed.',
    '`autocomplete="one-time-code"` goes on the first box only, and `off` on the rest. On every box the platform offers the code once per field.',
    'Each box needs `aria-label="Digit N"` and `inputmode="numeric"`, plus `maxlength="1"`.',
    'Wire the behaviour: typing advances focus, Backspace on an empty box moves back and clears, arrows move between boxes, and a paste on any box fills the rest.',
    'Focus is per box — do not ring the whole row.',
  ],
}

// ---------------------------------------------------------------------------
// Form field — the label / control / message wrapper. It owns the association
// between them, which is the part hand-rolled forms get wrong.
// ---------------------------------------------------------------------------
const formField: Recipe = {
  className: 'inspera-field-group',
  css: `.inspera-field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  font-family: var(--font-sans);
}

.inspera-field-group__label {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

/* The asterisk is decorative: requiredness is carried by the control's own
   "required" attribute, which is what a screen reader announces. */
.inspera-field-group__required {
  color: var(--error);
  margin-left: 2px;
}

.inspera-field-group__help  { font-size: 12px; color: var(--muted-foreground); }
.inspera-field-group__error { font-size: 12px; color: var(--error); }`,
  composes: ['text-input'],
  html: `<div class="inspera-field-group">
  <label class="inspera-field-group__label" for="email">
    Email address<span class="inspera-field-group__required" aria-hidden="true">*</span>
  </label>
  <div class="inspera-input">
    <div class="inspera-input__field">
      <input class="inspera-input__control" id="email" type="email" required
             aria-describedby="email-msg" />
    </div>
  </div>
  <span class="inspera-field-group__help" id="email-msg">We'll never share your email.</span>
</div>`,
  markup: (v) => {
    const required = v.required === 'true'
      ? `<span class="inspera-field-group__required" aria-hidden="true">*</span>` : ''
    const error = v.showError === 'true'
    const invalid = error ? ' data-invalid="true"' : ''
    const message = error
      ? `  <span class="inspera-field-group__error" id="email-msg">Enter a valid email address.</span>`
      : `  <span class="inspera-field-group__help" id="email-msg">We'll never share your email.</span>`
    return `<div class="inspera-field-group">
  <label class="inspera-field-group__label" for="email">Email address${required}</label>
  <div class="inspera-input">
    <div class="inspera-input__field"${invalid}>
      <input class="inspera-input__control" id="email" placeholder="jane@inspera.com"${error ? ' aria-invalid="true"' : ''} aria-describedby="email-msg" />
    </div>
  </div>
${message}
</div>`
  },
  component: (v) => (
    <FormField
      label="Email address"
      htmlFor="email"
      required={v.required === 'true'}
      helpText="We'll never share your email."
      errorText={v.showError === 'true' ? 'Enter a valid email address.' : undefined}
    >
      <TextInput label="Email" showLabel={false} placeholder="jane@inspera.com" state={v.showError === 'true' ? 'Error' : 'Default'} />
    </FormField>
  ),
  notes: [
    'The wrapper owns three links the control cannot make for itself: `for` → the control id, `aria-describedby` → the message id, and `aria-invalid` when the message is an error.',
    'Only one message shows at a time. When there is an error it replaces the help text; it does not stack under it.',
    'The red asterisk is `aria-hidden` decoration. Requiredness is announced from the control’s own `required` attribute — the asterisk alone tells a screen reader nothing.',
    'Gap between label, control and message is 6px; message text is 12px.',
    'The nested control keeps its own label markup off (there is already one here) but still needs an accessible name via the outer `for`.',
  ],
}

// ---------------------------------------------------------------------------
// Select — a combobox trigger plus a listbox. The trigger is not a <select>,
// so every ARIA relationship has to be stated.
// ---------------------------------------------------------------------------
const select: Recipe = {
  className: 'inspera-select',
  css: `.inspera-select {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 220px;
  font-family: var(--font-sans);
}

/* Content-adaptable: the trigger grows with the longest value instead of
   holding a fixed 220px. */
.inspera-select--auto { width: auto; }

.inspera-select__label {
  font-size: 16px;
  font-weight: 500;
}

.inspera-select__anchor { position: relative; }

.inspera-select__trigger {
  height: 40px;
  width: 220px;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 12px;
  border-radius: var(--radius-md);
  border: var(--border-width-default) solid var(--border-control);
  background: var(--white);
  /* Muted while showing the placeholder; --text-primary once a value is set. */
  color: var(--muted-foreground);
  font-family: var(--font-sans);
  font-size: 16px;
  cursor: pointer;
  transition:
    border-color var(--duration-fast) var(--easing-standard),
    box-shadow var(--duration-fast) var(--easing-standard);
}

.inspera-select--auto .inspera-select__trigger { width: auto; }

.inspera-select__trigger--filled { color: var(--text-primary); }

.inspera-select__trigger:hover { border-color: var(--border-control-strong); }

.inspera-select__trigger:focus-visible,
.inspera-select__trigger[aria-expanded='true'] {
  border-color: var(--primary);
  box-shadow: var(--effect-state-focus);
  outline: none;
}

.inspera-select__trigger .material-symbols-outlined {
  font-size: 20px;
  transition: transform 140ms ease;
}
.inspera-select__trigger[aria-expanded='true'] .material-symbols-outlined { transform: rotate(180deg); }

/* The list is anchored to the trigger, not appended to the body. */
.inspera-select__list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  margin: 0;
  padding: 4px;
  list-style: none;
  background: var(--white);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-200);
  z-index: var(--z-dropdown, 20);
  max-height: 240px;
  overflow-y: auto;
}

.inspera-select__option {
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: 16px;
  cursor: pointer;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Two different things: --active is the keyboard cursor, [aria-selected] is
   the committed value. Collapsing them loses the arrow-key position. */
.inspera-select__option--active { background: var(--blue-100); }
.inspera-select__option[aria-selected='true'] { color: var(--primary); font-weight: 500; }

.inspera-select__empty {
  padding: 8px 12px;
  color: var(--muted-foreground);
  font-size: 14px;
}`,
  html: `<div class="inspera-select">
  <label class="inspera-select__label" for="country">Country</label>
  <div class="inspera-select__anchor">
    <div class="inspera-select__trigger" id="country" role="combobox" tabindex="0"
         aria-expanded="false" aria-haspopup="listbox" aria-controls="country-list">
      <span>Select an option</span>
      <span class="material-symbols-outlined" aria-hidden="true">expand_more</span>
    </div>
    <!-- Rendered only while open. -->
    <ul class="inspera-select__list" id="country-list" role="listbox">
      <li class="inspera-select__option inspera-select__option--active" role="option" aria-selected="false">Norway</li>
      <li class="inspera-select__option" role="option" aria-selected="false">Sweden</li>
    </ul>
  </div>
</div>`,
  markup: (v) => {
    const auto = v.widthMode === 'Fixed' ? '' : ' inspera-select--auto'
    return `<div class="inspera-select${auto}">
  <label class="inspera-select__label" for="country">Country</label>
  <div class="inspera-select__anchor">
    <div class="inspera-select__trigger" id="country" role="combobox" tabindex="0" aria-expanded="false" aria-haspopup="listbox" aria-controls="country-list">
      <span>Select an option</span>
      <span class="material-symbols-outlined" aria-hidden="true">expand_more</span>
    </div>
  </div>
</div>`
  },
  component: (v) => (
    <Select label="Country" widthMode={v.widthMode as never} search={v.search === 'true'} />
  ),
  notes: [
    'The trigger is a `role="combobox"` element with `tabindex="0"`, `aria-expanded`, `aria-haspopup="listbox"` and `aria-controls` pointing at the list. None of that comes free — this is not a native `<select>`.',
    'The list is `role="listbox"` with `role="option"` children carrying `aria-selected`; it is positioned against the trigger, not appended to the body.',
    'Keep the keyboard cursor and the selected value as two different states. The highlighted option (`--active`, `--blue-100`) is where the arrows are; `aria-selected` is what has been chosen.',
    'The chevron rotates 180° while open, driven off `aria-expanded` so the attribute and the visual cannot disagree.',
    'Keyboard: Down opens and moves, Up moves back, Enter commits, Escape closes.',
    'Fixed width is 220px; Content Adaptable drops to `auto` with a 120px floor.',
  ],
}

// ---------------------------------------------------------------------------
// Date picker — a trigger and an anchored calendar. The grid is fixed at six
// rows so the panel does not resize as you page through months.
// ---------------------------------------------------------------------------
const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const datePicker: Recipe = {
  className: 'inspera-datepicker',
  css: `.inspera-datepicker {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  position: relative;
  font-family: var(--font-sans);
}

.inspera-datepicker__label {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.inspera-datepicker__trigger {
  height: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border-radius: var(--radius-md);
  border: var(--border-width-default) solid var(--border-control);
  background: var(--white);
  cursor: pointer;
  text-align: left;
  font: inherit;
  transition:
    border-color var(--duration-fast) var(--easing-standard),
    box-shadow var(--duration-fast) var(--easing-standard);
}

.inspera-datepicker__trigger:hover { border-color: var(--border-control-strong); }

.inspera-datepicker__trigger:focus-visible,
.inspera-datepicker__trigger[aria-expanded='true'] {
  border-color: var(--primary);
  box-shadow: var(--effect-state-focus);
  outline: none;
}

.inspera-datepicker__value {
  flex: 1;
  font-size: 16px;
  color: var(--text-placeholder);
}
.inspera-datepicker__value--set { color: var(--text-primary); }

.inspera-datepicker__trigger .material-symbols-outlined {
  font-size: 20px;
  color: var(--action-active);
}

.inspera-datepicker__panel {
  position: absolute;
  top: 74px;
  left: 0;
  z-index: var(--z-dropdown, 20);
  width: 280px;
  padding: 12px;
  background: var(--surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-200);
  border: 1px solid var(--border);
}

.inspera-datepicker__nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.inspera-datepicker__nav-btn {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--text-primary);
}
.inspera-datepicker__nav-btn .material-symbols-outlined { font-size: 20px; }

.inspera-datepicker__month {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.inspera-datepicker__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.inspera-datepicker__weekday {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--muted-foreground);
  padding: 4px 0;
}

.inspera-datepicker__day {
  height: 32px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 14px;
  cursor: pointer;
}

/* Today is outlined; the selection is filled. Both at once would read as two
   selected days. */
.inspera-datepicker__day--today { border: 1px solid var(--primary); }

.inspera-datepicker__day--selected {
  background: var(--primary);
  color: var(--white);
  border: none;
}`,
  html: `<div class="inspera-datepicker">
  <label class="inspera-datepicker__label" for="due">Due date</label>
  <button class="inspera-datepicker__trigger" id="due" type="button"
          aria-haspopup="dialog" aria-expanded="false">
    <span class="inspera-datepicker__value">Select date</span>
    <span class="material-symbols-outlined" aria-hidden="true">calendar_today</span>
  </button>

  <!-- Rendered only while open. -->
  <div class="inspera-datepicker__panel" role="dialog" aria-label="Choose date">
    <div class="inspera-datepicker__nav">
      <button class="inspera-datepicker__nav-btn" type="button" aria-label="Previous month">
        <span class="material-symbols-outlined" aria-hidden="true">chevron_left</span>
      </button>
      <span class="inspera-datepicker__month">March 2026</span>
      <button class="inspera-datepicker__nav-btn" type="button" aria-label="Next month">
        <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
      </button>
    </div>
    <div class="inspera-datepicker__grid">
      <span class="inspera-datepicker__weekday">Su</span>
      <!-- …Mo through Sa… -->
      <span></span><!-- leading blanks to the first weekday -->
      <button class="inspera-datepicker__day" type="button" aria-label="March 1, 2026">1</button>
      <!-- …padded to 42 cells so the panel height never changes… -->
    </div>
  </div>
</div>`,
  markup: (v) => {
    if (v.defaultOpen !== 'true') {
      return `<div class="inspera-datepicker">
  <label class="inspera-datepicker__label" for="due">Due date</label>
  <button class="inspera-datepicker__trigger" id="due" type="button" aria-haspopup="dialog" aria-expanded="false">
    <span class="inspera-datepicker__value">Select date</span>
    <span class="material-symbols-outlined" aria-hidden="true">calendar_today</span>
  </button>
</div>`
    }
    // Same arithmetic the component uses, so the two grids agree cell for cell.
    const today = new Date()
    const viewY = today.getFullYear()
    const viewM = today.getMonth()
    const firstDay = new Date(viewY, viewM, 1).getDay()
    const daysInMonth = new Date(viewY, viewM + 1, 0).getDate()
    const cells: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    while (cells.length < 42) cells.push(null)

    const weekdays = WEEKDAY_LABELS.map((w) => `      <span class="inspera-datepicker__weekday">${w}</span>`)
    const days = cells.map((d) => d === null
      ? '      <span></span>'
      : `      <button class="inspera-datepicker__day${d === today.getDate() ? ' inspera-datepicker__day--today' : ''}" type="button" aria-label="${MONTH_LABELS[viewM]} ${d}, ${viewY}" aria-pressed="false">${d}</button>`)

    return `<div class="inspera-datepicker">
  <label class="inspera-datepicker__label" for="due">Due date</label>
  <button class="inspera-datepicker__trigger" id="due" type="button" aria-haspopup="dialog" aria-expanded="true">
    <span class="inspera-datepicker__value">Select date</span>
    <span class="material-symbols-outlined" aria-hidden="true">calendar_today</span>
  </button>
  <div class="inspera-datepicker__panel" role="dialog" aria-label="Choose date">
    <div class="inspera-datepicker__nav">
      <button class="inspera-datepicker__nav-btn" type="button" aria-label="Previous month">
        <span class="material-symbols-outlined" aria-hidden="true">chevron_left</span>
      </button>
      <span class="inspera-datepicker__month">${MONTH_LABELS[viewM]} ${viewY}</span>
      <button class="inspera-datepicker__nav-btn" type="button" aria-label="Next month">
        <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
      </button>
    </div>
    <div class="inspera-datepicker__grid">
${weekdays.join('\n')}
${days.join('\n')}
    </div>
  </div>
</div>`
  },
  component: (v) => (
    <DatePicker label="Due date" defaultOpen={v.defaultOpen === 'true'} />
  ),
  props: ['grid-template-columns'],
  notes: [
    'The grid is `repeat(7, 1fr)` and always padded to 42 cells with empty spans. A grid sized to the month makes the panel jump height as you page through it.',
    'Leading blanks come from the first of the month’s weekday index — they are empty `<span>`s, not disabled buttons, so they are skipped by the keyboard.',
    'Every day button needs a full `aria-label` ("March 1, 2026"). A bare "1" tells a screen reader nothing.',
    'Today is outlined with a 1px `--primary` border; the selected day is filled with `--primary`. A day that is both shows only the fill.',
    'The panel is anchored under the trigger, `--radius-md` on `--surface` with `--shadow-200`, and closes on Escape and on an outside click.',
    'Store and emit ISO `YYYY-MM-DD`, never a locale-formatted string.',
  ],
}

// ---------------------------------------------------------------------------
// File upload — a drop zone that is also a keyboard-operable button, wrapping
// a hidden native file input.
// ---------------------------------------------------------------------------
const fileUpload: Recipe = {
  className: 'inspera-upload',
  css: `.inspera-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 32px 24px;
  /* Dashed, and 2px — a 1px dashed border reads as a table rule at this size. */
  border: 2px dashed var(--gray-400);
  border-radius: var(--radius-md);
  background: var(--surface);
  cursor: pointer;
  text-align: center;
  font-family: var(--font-sans);
  transition: all 120ms ease;
}

/* Both the real drag state and the pointer share one look. */
.inspera-upload:hover,
.inspera-upload--dragging {
  border-color: var(--primary);
  background: var(--blue-100);
}

.inspera-upload:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.inspera-upload__icon {
  font-size: 40px;
  color: var(--primary);
}

.inspera-upload__prompt {
  font-size: 16px;
  color: var(--text-primary);
}

.inspera-upload__browse {
  color: var(--primary);
  font-weight: 600;
}

.inspera-upload__help {
  font-size: 12px;
  color: var(--muted-foreground);
}

/* The native input stays in the DOM so the zone can click() it. */
.inspera-upload__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.inspera-upload--error {
  border-color: var(--error);
}
.inspera-upload--error .inspera-upload__icon,
.inspera-upload--error .inspera-upload__help { color: var(--error); }

.inspera-upload--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}`,
  html: `<!-- role="button" + tabindex + a key handler, because a div is not focusable
     and Enter/Space do not activate it on their own. -->
<div class="inspera-upload" role="button" tabindex="0" aria-label="Attachments">
  <span class="material-symbols-outlined inspera-upload__icon" aria-hidden="true">upload_file</span>
  <div class="inspera-upload__prompt">
    Drag &amp; drop or <span class="inspera-upload__browse">browse</span>
  </div>
  <span class="inspera-upload__help">PNG, JPG or PDF up to 10MB</span>
  <input class="inspera-upload__input" type="file" accept="image/*,.pdf" multiple />
</div>`,
  markup: (v) => {
    const multiple = v.multiple === 'true' ? ' multiple' : ''
    return `<div class="inspera-upload" role="button" tabindex="0" aria-label="Attachments">
  <span class="material-symbols-outlined inspera-upload__icon" aria-hidden="true">upload_file</span>
  <div class="inspera-upload__prompt">
    Drag &amp; drop or <span class="inspera-upload__browse">browse</span>
  </div>
  <span class="inspera-upload__help">PNG, JPG or PDF up to 10MB</span>
  <input class="inspera-upload__input" type="file"${multiple} />
</div>`
  },
  component: (v) => (
    <FileUpload label="Attachments" multiple={v.multiple === 'true'} />
  ),
  notes: [
    'The zone carries `role="button"`, `tabindex="0"` and an Enter/Space handler that clicks the hidden input. Drag and drop alone is not an accessible way to upload.',
    'Keep the native `<input type="file">` in the DOM, visually hidden — the zone triggers it with `.click()`.',
    'Border is 2px dashed `--gray-400`; a 1px dash reads as a table rule at this size.',
    'The drag state and hover share one look: `--primary` border on a `--blue-100` wash. Handle `dragover`, `dragleave` and `drop`, and `preventDefault` on dragover or the browser opens the file instead.',
    'Always state the constraint ("PNG, JPG or PDF up to 10MB") — a bare drop zone gives no way to know what will be rejected.',
  ],
}

// ---------------------------------------------------------------------------
// Radio group — the wrapper that makes a set of radios one question: a shared
// name, a group role, and a label pointing at it.
// ---------------------------------------------------------------------------
const radioGroup: Recipe = {
  className: 'inspera-radio-group',
  css: `.inspera-radio-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-family: var(--font-sans);
}

.inspera-radio-group__label {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.inspera-radio-group__options {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Horizontal needs real separation; the vertical stack relies on each row's
   own 8px padding instead. */
.inspera-radio-group--horizontal .inspera-radio-group__options {
  flex-direction: row;
  gap: 24px;
}`,
  composes: ['radio-button'],
  html: `<div class="inspera-radio-group">
  <span class="inspera-radio-group__label" id="delivery-label">Delivery speed</span>
  <div class="inspera-radio-group__options" role="radiogroup" aria-labelledby="delivery-label">
    <label class="inspera-radio" for="d-standard">
      <input class="inspera-radio__input" id="d-standard" type="radio" name="delivery" />
      <span class="inspera-radio__circle" aria-hidden="true"></span>
      <span>Standard</span>
    </label>
    <label class="inspera-radio" for="d-express">
      <input class="inspera-radio__input" id="d-express" type="radio" name="delivery" />
      <span class="inspera-radio__circle" aria-hidden="true"></span>
      <span>Express</span>
    </label>
  </div>
</div>`,
  markup: (v) => {
    const horizontal = v.orientation === 'Horizontal' ? ' inspera-radio-group--horizontal' : ''
    const options = ['Standard', 'Express', 'Overnight'].map((label) => {
      const id = `d-${label.toLowerCase()}`
      return `    <label class="inspera-radio" for="${id}">
      <input class="inspera-radio__input" id="${id}" type="radio" name="delivery" />
      <span class="inspera-radio__circle" aria-hidden="true"></span>
      <span>${label}</span>
    </label>`
    })
    return `<div class="inspera-radio-group${horizontal}">
  <span class="inspera-radio-group__label" id="delivery-label">Delivery speed</span>
  <div class="inspera-radio-group__options" role="radiogroup" aria-labelledby="delivery-label">
${options.join('\n')}
  </div>
</div>`
  },
  component: (v) => (
    <RadioGroup
      label="Delivery speed"
      name="delivery"
      orientation={v.orientation as never}
      options={[
        { label: 'Standard', value: 'standard' },
        { label: 'Express', value: 'express' },
        { label: 'Overnight', value: 'overnight' },
      ]}
    />
  ),
  notes: [
    'The group label is a `<span>` with an id, linked by `aria-labelledby` on the `role="radiogroup"` element. A bare `<label>` cannot name a group.',
    'Every option shares one `name`, and no other question on the page may reuse it.',
    'Vertical options have no gap — each row carries its own 8px vertical padding. Horizontal adds a 24px gap.',
    'Group-level state (error, disabled) is applied to each option, not drawn once on the wrapper.',
  ],
}

// ---------------------------------------------------------------------------
// Checkbox group — the same wrapper for a multi-select question. Unlike radios
// there is no shared name; the group role is what ties them together.
// ---------------------------------------------------------------------------
const checkboxGroup: Recipe = {
  className: 'inspera-checkbox-group',
  css: `.inspera-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-family: var(--font-sans);
}

.inspera-checkbox-group__label {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.inspera-checkbox-group__options {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.inspera-checkbox-group--horizontal .inspera-checkbox-group__options {
  flex-direction: row;
  gap: 24px;
}`,
  composes: ['checkbox'],
  html: `<div class="inspera-checkbox-group">
  <span class="inspera-checkbox-group__label" id="notify-label">Notifications</span>
  <div class="inspera-checkbox-group__options" role="group" aria-labelledby="notify-label">
    <label class="inspera-checkbox" for="n-email">
      <input class="inspera-checkbox__input" id="n-email" type="checkbox" />
      <span class="inspera-checkbox__box" aria-hidden="true"></span>
      <span>Email</span>
    </label>
    <label class="inspera-checkbox" for="n-sms">
      <input class="inspera-checkbox__input" id="n-sms" type="checkbox" />
      <span class="inspera-checkbox__box" aria-hidden="true"></span>
      <span>SMS</span>
    </label>
  </div>
</div>`,
  markup: (v) => {
    const horizontal = v.orientation === 'Horizontal' ? ' inspera-checkbox-group--horizontal' : ''
    const options = ['Email', 'SMS', 'Push'].map((label) => {
      const id = `n-${label.toLowerCase()}`
      return `    <label class="inspera-checkbox" for="${id}">
      <input class="inspera-checkbox__input" id="${id}" type="checkbox" />
      <span class="inspera-checkbox__box" aria-hidden="true"></span>
      <span>${label}</span>
    </label>`
    })
    return `<div class="inspera-checkbox-group${horizontal}">
  <span class="inspera-checkbox-group__label" id="notify-label">Notifications</span>
  <div class="inspera-checkbox-group__options" role="group" aria-labelledby="notify-label">
${options.join('\n')}
  </div>
</div>`
  },
  component: (v) => (
    <CheckboxGroup
      label="Notifications"
      orientation={v.orientation as never}
      options={[
        { label: 'Email', value: 'email' },
        { label: 'SMS', value: 'sms' },
        { label: 'Push', value: 'push' },
      ]}
    />
  ),
  notes: [
    'Checkboxes take `role="group"`, not `radiogroup`, and they do **not** share a `name` — each carries its own value.',
    'The group label is a `<span>` with an id, linked by `aria-labelledby`.',
    'Same spacing as Radio Group: no gap vertically (rows carry their own padding), 24px horizontally.',
    'A "select all" control on top of a group is the natural place for the indeterminate checkbox state.',
  ],
}

// ---------------------------------------------------------------------------
// Table — a real <table>. The semantics are the component: a grid of divs
// loses row/column association entirely for a screen reader.
// ---------------------------------------------------------------------------
const table: Recipe = {
  className: 'inspera-table',
  css: `.inspera-table {
  border-collapse: collapse;
  width: 100%;
  font-family: var(--font-sans);
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.inspera-table caption {
  caption-side: top;
  text-align: left;
  padding: 0 0 8px;
  font-size: 13px;
  color: var(--muted-foreground);
}

.inspera-table th,
.inspera-table td {
  padding: 0 16px;
  font-size: 14px;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
  text-align: left;
}

.inspera-table th {
  font-weight: 600;
  color: var(--gray-700);
}

.inspera-table thead tr {
  background: var(--gray-100);
  height: 52px;
}

.inspera-table tbody tr {
  height: 52px;
  cursor: default;
  /* The stripe is the row's resting fill, passed as a variable. Setting it as
     a plain background would outrank the hover rule below. */
  background: var(--inspera-row-bg, var(--white));
  transition: background var(--duration-fast) var(--easing-standard);
}

.inspera-table--compact thead tr,
.inspera-table--compact tbody tr { height: 40px; }

.inspera-table--striped tbody tr:nth-child(even) { --inspera-row-bg: var(--gray-100); }

.inspera-table--hoverable tbody tr:hover { background: var(--action-hover); }

/* Numbers right-align so the digits line up; text never does. Scoped through
   the table so it outranks the "th, td" rule above, which is more specific
   than a bare class on its own. */
.inspera-table th.inspera-table__cell--right,
.inspera-table td.inspera-table__cell--right { text-align: right; }

.inspera-table th.inspera-table__select,
.inspera-table td.inspera-table__select {
  width: 44px;
  text-align: center;
}
.inspera-table__select input {
  width: 16px;
  height: 16px;
  accent-color: var(--primary);
  cursor: pointer;
}`,
  html: `<table class="inspera-table inspera-table--hoverable">
  <caption>Candidate results, March 2026</caption>
  <thead>
    <tr>
      <th scope="col">Assessment</th>
      <th scope="col" class="inspera-table__cell--right">Items</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Algebra Quiz</td>
      <td class="inspera-table__cell--right">24</td>
      <td><span class="inspera-badge inspera-badge--success" role="status">Live</span></td>
    </tr>
  </tbody>
</table>`,
  composes: ['badge'],
  markup: (v) => {
    const compact = v.size === 'Compact' ? ' inspera-table--compact' : ''
    const striped = v.striped === 'true' ? ' inspera-table--striped' : ''
    const hoverable = v.hoverable === 'true' ? ' inspera-table--hoverable' : ''
    const selectable = v.selectable === 'true'
    const selectHead = selectable ? `\n      <th scope="col" class="inspera-table__select"></th>` : ''
    const rows = [
      ['Algebra Quiz', '24', 'Live', 'success'],
      ['History Midterm', '40', 'Draft', 'neutral'],
      ['Biology Final', '60', 'Scheduled', 'info'],
    ].map(([name, items, status, intent], i) => {
      const cell = selectable
        ? `\n      <td class="inspera-table__select"><input type="checkbox" aria-label="Select row ${i + 1}" /></td>`
        : ''
      return `    <tr>${cell}
      <td>${name}</td>
      <td class="inspera-table__cell--right">${items}</td>
      <td><span class="inspera-badge inspera-badge--${intent}" role="status">${status}</span></td>
    </tr>`
    })
    return `<table class="inspera-table${compact}${striped}${hoverable}">
  <thead>
    <tr>${selectHead}
      <th scope="col">Assessment</th>
      <th scope="col" class="inspera-table__cell--right">Items</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
  <tbody>
${rows.join('\n')}
  </tbody>
</table>`
  },
  component: (v) => (
    <Table
      size={v.size as never}
      striped={v.striped === 'true'}
      selectable={v.selectable === 'true'}
      hoverable={v.hoverable === 'true'}
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
  notes: [
    'Use a real `<table>` with `<thead>`, `<tbody>` and `scope="col"` on every header. A grid of divs loses row and column association completely.',
    'Row height is 52px (40px compact) and the header sits on `--gray-100`. Cells are 14px with 16px horizontal padding.',
    'Right-align numeric columns only, so digits line up. Never right-align text.',
    'The stripe is passed as the row’s resting fill (`--inspera-row-bg`) rather than a plain background, so the hover rule can still win on striped rows.',
    'Selection checkboxes need a per-row `aria-label` ("Select row 3") and `accent-color: var(--primary)`.',
    'Give the table a `<caption>` unless a heading immediately above already names it.',
  ],
}

// ---------------------------------------------------------------------------
// List — rows of primary/secondary text with optional leading and trailing
// slots. Interactive rows are buttons; static rows are not.
// ---------------------------------------------------------------------------
const list: Recipe = {
  className: 'inspera-list',
  css: `.inspera-list {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  font-family: var(--font-sans);
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.inspera-list__row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  /* Longhands, not the "border" shorthand: a shorthand here wipes the divider
     that the row below sets on its bottom edge. */
  border-top: none;
  border-right: none;
  border-left: none;
  border-bottom: none;
  font: inherit;
  cursor: default;
  background: transparent;
}

.inspera-list--compact .inspera-list__row { padding: 8px 16px; }

.inspera-list--divided li:not(:last-child) > .inspera-list__row {
  border-bottom: 1px solid var(--border);
}

/* Interactive rows are real buttons, so they focus and activate for free. */
.inspera-list__row--interactive {
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background var(--duration-fast) var(--easing-standard);
}
.inspera-list__row--interactive:hover { background: var(--action-hover); }
.inspera-list__row--interactive:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: -2px;
}

.inspera-list__slot {
  display: inline-flex;
  flex-shrink: 0;
}

.inspera-list__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
  text-align: left;
}

.inspera-list__primary {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.inspera-list__secondary {
  font-size: 13px;
  color: var(--muted-foreground);
}`,
  html: `<ul class="inspera-list inspera-list--divided" role="list">
  <li>
    <div class="inspera-list__row">
      <span class="inspera-list__slot">
        <span class="material-symbols-outlined" aria-hidden="true">settings</span>
      </span>
      <span class="inspera-list__text">
        <span class="inspera-list__primary">General settings</span>
        <span class="inspera-list__secondary">Language, timezone, theme</span>
      </span>
    </div>
  </li>
</ul>

<!-- Interactive rows are <button>, not a div with onclick. -->
<ul class="inspera-list inspera-list--divided" role="list">
  <li>
    <button type="button" class="inspera-list__row inspera-list__row--interactive">
      <span class="inspera-list__text">
        <span class="inspera-list__primary">Notifications</span>
      </span>
      <span class="inspera-list__slot">
        <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
      </span>
    </button>
  </li>
</ul>`,
  markup: (v) => {
    const compact = v.size === 'Compact' ? ' inspera-list--compact' : ''
    const divided = v.divided === 'true' ? ' inspera-list--divided' : ''
    const interactive = v.interactive === 'true'
    const rowCls = `inspera-list__row${interactive ? ' inspera-list__row--interactive' : ''}`
    const icon = (name: string, size: number, color: string) =>
      `<span class="material-symbols-outlined" style="font-size: ${size}px; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; color: ${color}; line-height: 1; user-select: none" aria-hidden="true">${name}</span>`
    const iconSize = v.size === 'Compact' ? 18 : 20
    const rows = [
      ['General settings', 'Language, timezone, theme', 'settings'],
      ['Notifications', 'Email and push preferences', 'notifications'],
      ['Security', 'Password and two-factor auth', 'lock'],
    ].map(([primary, secondary, lead]) => {
      const inner = `      <span class="inspera-list__slot">${icon(lead, iconSize, 'var(--text-secondary, var(--gray-600))')}</span>
      <span class="inspera-list__text">
        <span class="inspera-list__primary">${primary}</span>
        <span class="inspera-list__secondary">${secondary}</span>
      </span>
      <span class="inspera-list__slot">${icon('chevron_right', iconSize, 'var(--muted-foreground)')}</span>`
      return interactive
        ? `  <li>\n    <button type="button" class="${rowCls}">\n${inner}\n    </button>\n  </li>`
        : `  <li>\n    <div class="${rowCls}">\n${inner}\n    </div>\n  </li>`
    })
    return `<ul class="inspera-list${compact}${divided}" role="list">\n${rows.join('\n')}\n</ul>`
  },
  component: (v) => (
    <List
      size={v.size as never}
      divided={v.divided === 'true'}
      interactive={v.interactive === 'true'}
      items={[
        { primary: 'General settings', secondary: 'Language, timezone, theme', leading: 'settings', trailing: 'chevron_right' },
        { primary: 'Notifications', secondary: 'Email and push preferences', leading: 'notifications', trailing: 'chevron_right' },
        { primary: 'Security', secondary: 'Password and two-factor auth', leading: 'lock', trailing: 'chevron_right' },
      ]}
    />
  ),
  notes: [
    'Set the four border longhands, never the `border` shorthand. A shorthand on the row wipes the bottom border that draws the divider — the exact bug this component shipped with.',
    'Interactive rows are `<button>` inside the `<li>`, so focus and Enter/Space work without a keydown handler.',
    'Row padding is 12px (8px compact) vertical, 16px horizontal; primary text 14px/500, secondary 13px `--muted-foreground`.',
    'The divider is on every row but the last, drawn by `li:not(:last-child)` rather than by counting in script.',
    'Leading and trailing icons are 20px (18px compact) and always `aria-hidden` — the row’s text is the label.',
  ],
}

// ---------------------------------------------------------------------------
// Accordion — headers are buttons inside headings, panels are regions. The
// aria-expanded / aria-controls pair is what makes it operable.
// ---------------------------------------------------------------------------
const accordion: Recipe = {
  className: 'inspera-accordion',
  css: `.inspera-accordion {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  font-family: var(--font-sans);
  background: var(--white);
}

/* Rules between items, not around them — the wrapper already has a border. */
.inspera-accordion__item + .inspera-accordion__item {
  border-top: 1px solid var(--border);
}

.inspera-accordion__heading { margin: 0; }

.inspera-accordion__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 14px 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  font: inherit;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

/* Icon on the left: reverse the row rather than reordering the markup, so the
   reading order still starts with the title. */
.inspera-accordion--icon-left .inspera-accordion__trigger { flex-direction: row-reverse; }

.inspera-accordion__title { flex: 1; text-align: left; }

.inspera-accordion__chevron {
  font-size: 24px;
  color: var(--muted-foreground);
  transition: transform 160ms ease;
  transform: rotate(0deg);
}

.inspera-accordion__trigger[aria-expanded='true'] .inspera-accordion__chevron {
  transform: rotate(180deg);
}

.inspera-accordion__panel {
  padding: 0 16px 16px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--gray-700);
}

/* Collapsed panels use the "hidden" attribute, so they leave the tab order and
   the accessibility tree. display:none via a class does the first but is
   easier to get wrong. */
.inspera-accordion__panel[hidden] { padding: 0 16px; }`,
  html: `<div class="inspera-accordion">
  <div class="inspera-accordion__item">
    <h3 class="inspera-accordion__heading">
      <button type="button" class="inspera-accordion__trigger"
              id="acc-h1" aria-expanded="true" aria-controls="acc-p1">
        <span class="inspera-accordion__title">How is my exam graded?</span>
        <span class="material-symbols-outlined inspera-accordion__chevron" aria-hidden="true">expand_more</span>
      </button>
    </h3>
    <div class="inspera-accordion__panel" id="acc-p1" role="region" aria-labelledby="acc-h1">
      Responses are marked against the rubric configured for each question.
    </div>
  </div>
  <div class="inspera-accordion__item">
    <h3 class="inspera-accordion__heading">
      <button type="button" class="inspera-accordion__trigger"
              id="acc-h2" aria-expanded="false" aria-controls="acc-p2">
        <span class="inspera-accordion__title">Can I review my answers?</span>
        <span class="material-symbols-outlined inspera-accordion__chevron" aria-hidden="true">expand_more</span>
      </button>
    </h3>
    <div class="inspera-accordion__panel" id="acc-p2" role="region" aria-labelledby="acc-h2" hidden>
      You can revisit any answered question before submitting.
    </div>
  </div>
</div>`,
  markup: (v) => {
    const left = v.iconPosition === 'Left' ? ' inspera-accordion--icon-left' : ''
    const items = [
      ['What is Inspera?', 'A digital assessment platform for education and certification.'],
      ['How are results scored?', 'Automatically for objective items, with manual grading for essays.'],
      ['Is it accessible?', 'Yes — components follow WCAG 2.1 AA guidance.'],
    ].map(([title, body], i) => {
      const open = i === 0
      return `  <div class="inspera-accordion__item">
    <h3 class="inspera-accordion__heading">
      <button type="button" class="inspera-accordion__trigger" id="acc-h${i}" aria-expanded="${open}" aria-controls="acc-p${i}">
        <span class="inspera-accordion__title">${title}</span>
        <span class="material-symbols-outlined inspera-accordion__chevron" aria-hidden="true">expand_more</span>
      </button>
    </h3>
    <div class="inspera-accordion__panel" id="acc-p${i}" role="region" aria-labelledby="acc-h${i}"${open ? '' : ' hidden'}>${body}</div>
  </div>`
    })
    return `<div class="inspera-accordion${left}">\n${items.join('\n')}\n</div>`
  },
  component: (v) => (
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
  notes: [
    'Each header is a `<button>` inside an `<h3>`. The heading gives the section its place in the document outline; the button makes it operable.',
    '`aria-expanded` on the trigger and `aria-controls` pointing at the panel, with the panel as `role="region"` labelled back by the trigger id. All four, or the pattern does not work.',
    'Collapse with the `hidden` attribute so the panel leaves both the tab order and the accessibility tree.',
    'The chevron rotates 180° driven off `[aria-expanded="true"]`, so the attribute and the arrow cannot disagree.',
    'Icon-left reverses the flex row rather than reordering the markup, so the title is still read first.',
    'Single mode closes the open panel when another opens; multiple leaves them independent. Neither changes the markup.',
  ],
}

// ---------------------------------------------------------------------------
// Tabs — a tablist of buttons. Two treatments: an underline rail, and a
// contained pill group.
// ---------------------------------------------------------------------------
const tabs: Recipe = {
  className: 'inspera-tabs',
  css: `.inspera-tabs {
  display: flex;
  gap: 0;
  padding: 0;
  border-bottom: 1px solid var(--border-strong);
  background: transparent;
  border-radius: 0;
  width: auto;
}

.inspera-tabs--full { width: 100%; }

/* Contained: a pill group on a tinted track, with no rail underneath. */
.inspera-tabs--contained {
  gap: 4px;
  padding: 4px;
  border-bottom: none;
  background: var(--gray-100);
  border-radius: var(--radius-md);
}

.inspera-tabs__tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 48px;
  padding: 0 16px;
  flex: none;
  border-top: none;
  border-right: none;
  border-left: none;
  /* A transparent 2px rail at rest, so selecting a tab does not shift the row. */
  border-bottom: 2px solid transparent;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  color: var(--gray-700);
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: -1px;
  transition: color 120ms ease, border-color 120ms ease;
}

.inspera-tabs--small .inspera-tabs__tab { height: 40px; }
.inspera-tabs--full .inspera-tabs__tab { flex: 1; }

.inspera-tabs__tab[aria-selected='true'] {
  border-bottom-color: var(--primary);
  color: var(--primary);
}

/* Contained tabs sit inside the track: no rail, a raised white card instead. */
.inspera-tabs--contained .inspera-tabs__tab {
  height: 40px;
  border-bottom: none;
  border-radius: var(--radius-sm);
  margin-bottom: 0;
}
.inspera-tabs--contained.inspera-tabs--small .inspera-tabs__tab { height: 32px; }

.inspera-tabs--contained .inspera-tabs__tab[aria-selected='true'] {
  background: var(--white);
  box-shadow: var(--shadow-100);
  color: var(--primary);
}

.inspera-tabs__tab .material-symbols-outlined { font-size: 20px; }`,
  html: `<div class="inspera-tabs" role="tablist" aria-label="Section tabs">
  <button type="button" class="inspera-tabs__tab" role="tab" aria-selected="true"
          id="tab-overview" aria-controls="panel-overview" tabindex="0">Overview</button>
  <button type="button" class="inspera-tabs__tab" role="tab" aria-selected="false"
          id="tab-questions" aria-controls="panel-questions" tabindex="-1">Questions</button>
</div>

<div id="panel-overview" role="tabpanel" aria-labelledby="tab-overview" tabindex="0">…</div>
<div id="panel-questions" role="tabpanel" aria-labelledby="tab-questions" tabindex="0" hidden>…</div>`,
  markup: (v) => {
    const contained = v.style === 'Contained' ? ' inspera-tabs--contained' : ''
    const small = v.size === 'Small' ? ' inspera-tabs--small' : ''
    const full = v.fullWidth === 'true' ? ' inspera-tabs--full' : ''
    const items = ['Overview', 'Questions', 'Settings', 'Results'].map((label, i) =>
      `  <button type="button" class="inspera-tabs__tab" role="tab" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${label}</button>`)
    return `<div class="inspera-tabs${contained}${small}${full}" role="tablist" aria-label="Section tabs">\n${items.join('\n')}\n</div>`
  },
  component: (v) => (
    <Tabs style={v.style as never} size={v.size as never} fullWidth={v.fullWidth === 'true'} />
  ),
  notes: [
    'Underline tabs are 48px tall (40px small) on a 1px `--border-strong` rail, with `margin-bottom: -1px` so the selected 2px `--primary` underline covers the rail.',
    'The resting bottom border is a transparent 2px, not none — otherwise selecting a tab shifts the whole row by two pixels.',
    'Contained tabs drop the rail entirely and become a pill group on `--gray-100`, with the selected tab a white `--shadow-100` card.',
    '`role="tablist"` / `role="tab"` / `role="tabpanel"`, each tab pointing at its panel with `aria-controls` and each panel back with `aria-labelledby`.',
    'Roving tabindex: only the selected tab is a tab stop; Left/Right move between them.',
  ],
}

// ---------------------------------------------------------------------------
// Stepper — progress through an ordered flow. The connector has to run through
// the circles, which is what makes the flex sizing here fiddly.
// ---------------------------------------------------------------------------
const stepper: Recipe = {
  className: 'inspera-stepper',
  css: `.inspera-stepper {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 0;
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
  font-family: var(--font-sans);
}

.inspera-stepper--vertical {
  flex-direction: column;
  align-items: stretch;
  width: auto;
}

/* The step lays out body-then-connector along the stepper's own axis, so a
   horizontal stepper puts them in a row and a vertical one stacks them. Note
   this is the opposite of the body inside it, which stacks the circle over the
   label horizontally and sits them side by side vertically. */
.inspera-stepper__step {
  display: flex;
  flex-direction: row;
  /* Always top-aligned. Centring makes the horizontal connector sit against the
     full step height and render down at label level instead of through the
     circles. */
  align-items: flex-start;
  /* "1 1 auto", not "1": a zero basis gives every step the same total width, so
     a long label leaves a stub of a connector while a short one gets a long
     run. Growing from the content width shares the free space evenly. */
  flex: 1 1 auto;
  min-width: 0;
}

.inspera-stepper__step:last-child { flex: none; }
.inspera-stepper--vertical .inspera-stepper__step { flex-direction: column; flex: none; }

.inspera-stepper__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.inspera-stepper--vertical .inspera-stepper__body {
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
}

.inspera-stepper__indicator {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: var(--radius-pill);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  background: transparent;
  color: var(--gray-600);
  border: 2px solid var(--border-strong);
  box-shadow: none;
  transition: background 140ms ease, box-shadow 140ms ease;
}

.inspera-stepper--small .inspera-stepper__indicator { width: 24px; height: 24px; }

/* Done and current share the fill; only the current one gets the halo. */
.inspera-stepper__indicator--done,
.inspera-stepper__indicator--active {
  background: var(--primary);
  color: var(--white);
  border: none;
}

.inspera-stepper__indicator--active { box-shadow: 0 0 0 4px var(--primary-focus-ring); }

.inspera-stepper__indicator .material-symbols-outlined { font-size: 18px; }

.inspera-stepper__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: center;
}
.inspera-stepper--vertical .inspera-stepper__text { text-align: left; }

.inspera-stepper__label {
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-600);
}
.inspera-stepper--small .inspera-stepper__label { font-size: 13px; }

.inspera-stepper__step--done .inspera-stepper__label,
.inspera-stepper__step--active .inspera-stepper__label {
  font-weight: 600;
  color: var(--text-primary);
}

.inspera-stepper__description {
  font-size: 12px;
  color: var(--muted-foreground);
}

/* The connector is nudged by half the circle so it runs through the centres
   rather than under the labels. */
.inspera-stepper__connector {
  height: 2px;
  flex: 1;
  margin: 0 8px;
  margin-top: 15px;
  background: var(--border);
}

.inspera-stepper--small .inspera-stepper__connector { margin-top: 11px; }

.inspera-stepper__connector--done { background: var(--primary); }

.inspera-stepper--vertical .inspera-stepper__connector {
  width: 2px;
  height: auto;
  flex: 1;
  min-height: 20px;
  margin: 4px 0;
  margin-left: 15px;
}
.inspera-stepper--vertical.inspera-stepper--small .inspera-stepper__connector { margin-left: 11px; }`,
  html: `<ol class="inspera-stepper" role="list">
  <li class="inspera-stepper__step inspera-stepper__step--done">
    <div class="inspera-stepper__body">
      <span class="inspera-stepper__indicator inspera-stepper__indicator--done" aria-hidden="true">
        <span class="material-symbols-outlined">check</span>
      </span>
      <span class="inspera-stepper__text">
        <span class="inspera-stepper__label">Details</span>
        <span class="inspera-stepper__description">Assessment info</span>
      </span>
    </div>
    <span class="inspera-stepper__connector inspera-stepper__connector--done" aria-hidden="true"></span>
  </li>
  <li class="inspera-stepper__step inspera-stepper__step--active" aria-current="step">
    <div class="inspera-stepper__body">
      <span class="inspera-stepper__indicator inspera-stepper__indicator--active" aria-hidden="true">2</span>
      <span class="inspera-stepper__text">
        <span class="inspera-stepper__label">Questions</span>
      </span>
    </div>
  </li>
</ol>`,
  markup: (v) => {
    const vertical = v.orientation === 'Vertical'
    const small = v.size === 'Small'
    const activeStep = Number(v.activeStep)
    const cls = `inspera-stepper${vertical ? ' inspera-stepper--vertical' : ''}${small ? ' inspera-stepper--small' : ''}`
    const steps = [
      ['Details', 'Assessment info'], ['Questions', 'Add content'],
      ['Settings', 'Rules & timing'], ['Review', 'Publish'],
    ]
    const items = steps.map(([label, description], i) => {
      const done = i < activeStep
      const active = i === activeStep
      const isLast = i === steps.length - 1
      const stepMod = done ? ' inspera-stepper__step--done' : active ? ' inspera-stepper__step--active' : ''
      const indMod = done ? ' inspera-stepper__indicator--done' : active ? ' inspera-stepper__indicator--active' : ''
      const glyph = done
        ? `\n        <span class="material-symbols-outlined">check</span>\n      `
        : String(i + 1)
      const connector = isLast ? '' :
        `\n    <span class="inspera-stepper__connector${done ? ' inspera-stepper__connector--done' : ''}" aria-hidden="true"></span>`
      return `  <li class="inspera-stepper__step${stepMod}"${active ? ' aria-current="step"' : ''}>
    <div class="inspera-stepper__body">
      <span class="inspera-stepper__indicator${indMod}" aria-hidden="true">${glyph}</span>
      <span class="inspera-stepper__text">
        <span class="inspera-stepper__label">${label}</span>
        <span class="inspera-stepper__description">${description}</span>
      </span>
    </div>${connector}
  </li>`
    })
    return `<ol class="${cls}" role="list">\n${items.join('\n')}\n</ol>`
  },
  component: (v) => (
    <Stepper
      orientation={v.orientation as never}
      size={v.size as never}
      activeStep={Number(v.activeStep)}
    />
  ),
  notes: [
    'It is an `<ol>`: the order is the meaning. The current step carries `aria-current="step"`.',
    'Steps take `flex: 1 1 auto`, never `flex: 1`. A zero basis gives every step the same total width, so a long label ends up with a stub connector while a short one gets a long run.',
    'Keep steps top-aligned. Centring makes the connector sit against the full step height and render down at label level instead of through the circles.',
    'The connector is offset by half the circle (`margin-top: 15px`, or 11px small) so it passes through the centres.',
    'Completed and current share the `--primary` fill; only the current one gets the 4px `--primary-focus-ring` halo. Completed shows a tick, upcoming shows its number.',
    'Indicators are 32px (24px small) and the connector is 2px, filled `--primary` behind completed steps and `--border` ahead of them.',
  ],
}

// ---------------------------------------------------------------------------
// Pagination — a nav of page buttons. The ellipsis is decorative; the current
// page is announced with aria-current.
// ---------------------------------------------------------------------------
const pagination: Recipe = {
  className: 'inspera-pagination',
  css: `.inspera-pagination__list {
  display: flex;
  align-items: center;
  /* Wrap rather than overflow: a long pager has to degrade in a narrow column,
     not spill out of it. */
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.inspera-pagination__item {
  min-width: 40px;
  height: 40px;
  padding: 0 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease;
}

.inspera-pagination--small .inspera-pagination__item {
  min-width: 32px;
  height: 32px;
  font-size: 14px;
}

.inspera-pagination__item:hover:not(:disabled):not([aria-current='page']) {
  background: var(--action-hover);
}

.inspera-pagination__item[aria-current='page'] {
  background: var(--primary);
  color: var(--white);
}

.inspera-pagination__item:disabled {
  color: var(--action-disabled);
  cursor: not-allowed;
}

.inspera-pagination__item .material-symbols-outlined { font-size: 20px; }
.inspera-pagination--small .inspera-pagination__item .material-symbols-outlined { font-size: 18px; }

/* The gap marker is not a control: a span, hidden from assistive tech. */
.inspera-pagination__ellipsis {
  cursor: default;
  color: var(--muted-foreground);
}`,
  html: `<nav class="inspera-pagination" aria-label="Pagination">
  <ul class="inspera-pagination__list">
    <li><button type="button" class="inspera-pagination__item" aria-label="Previous page">
      <span class="material-symbols-outlined" aria-hidden="true">chevron_left</span>
    </button></li>
    <li><button type="button" class="inspera-pagination__item" aria-label="Page 1">1</button></li>
    <li><span class="inspera-pagination__item inspera-pagination__ellipsis" aria-hidden="true">…</span></li>
    <li><button type="button" class="inspera-pagination__item" aria-label="Page 4" aria-current="page">4</button></li>
    <li><button type="button" class="inspera-pagination__item" aria-label="Next page">
      <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
    </button></li>
  </ul>
</nav>`,
  markup: (v) => {
    const small = v.size === 'Small' ? ' inspera-pagination--small' : ''
    const page = 4
    const items: (number | string)[] = [1, '…', 3, 4, 5, '…', 12]
    const arrow = (icon: string, label: string, disabled: boolean) =>
      `    <li><button type="button" class="inspera-pagination__item" aria-label="${label}"${disabled ? ' disabled' : ''}>` +
      `<span class="material-symbols-outlined" aria-hidden="true">${icon}</span></button></li>`
    const rows: string[] = []
    if (v.showEdges === 'true') rows.push(arrow('first_page', 'First page', false))
    rows.push(arrow('chevron_left', 'Previous page', false))
    for (const it of items) {
      rows.push(typeof it === 'string'
        ? `    <li><span class="inspera-pagination__item inspera-pagination__ellipsis" aria-hidden="true">${it}</span></li>`
        : `    <li><button type="button" class="inspera-pagination__item" aria-label="Page ${it}"${it === page ? ' aria-current="page"' : ''}>${it}</button></li>`)
    }
    rows.push(arrow('chevron_right', 'Next page', false))
    if (v.showEdges === 'true') rows.push(arrow('last_page', 'Last page', false))
    return `<nav class="inspera-pagination${small}" aria-label="Pagination">\n  <ul class="inspera-pagination__list">\n${rows.join('\n')}\n  </ul>\n</nav>`
  },
  component: (v) => (
    <Pagination page={4} pageCount={12} size={v.size as never} showEdges={v.showEdges === 'true'} />
  ),
  notes: [
    'A `<nav aria-label="Pagination">` around a `<ul>`; the current page is a button with `aria-current="page"`, filled `--primary`.',
    'Every page button needs a real label ("Page 4"), and the arrows need "Previous page" / "Next page". A bare chevron announces as nothing.',
    'The ellipsis is a `<span>` marked `aria-hidden`, not a disabled button — it is a gap marker, not a control.',
    'Cells are 40px (32px small) with `--radius-md` and a 4px gap, and the list wraps rather than overflowing in a narrow column.',
    'Disable the arrows at the ends rather than hiding them, so the control does not change width as you page.',
  ],
}

// ---------------------------------------------------------------------------
// Menu — a trigger and an anchored action list. Items are buttons with
// role="menuitem" and a roving focus the trigger drives.
// ---------------------------------------------------------------------------
const menu: Recipe = {
  className: 'inspera-menu',
  css: `.inspera-menu {
  position: relative;
  display: inline-block;
  font-family: var(--font-sans);
}

.inspera-menu__trigger {
  height: 40px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-strong);
  background: var(--white);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: none;
  transition: box-shadow 120ms ease;
}

.inspera-menu__trigger[aria-expanded='true'] {
  box-shadow: 0 0 0 3px var(--primary-focus-ring);
}

.inspera-menu__trigger .material-symbols-outlined {
  font-size: 20px;
  transition: transform 140ms ease;
}
.inspera-menu__trigger[aria-expanded='true'] .material-symbols-outlined { transform: rotate(180deg); }

.inspera-menu__list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: auto;
  min-width: 180px;
  padding: 4px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-200);
  z-index: var(--z-dropdown, 20);
}

/* Bottom End aligns the panel's right edge to the trigger's, for a menu near
   the right edge of the viewport. */
.inspera-menu__list--end { left: auto; right: 0; }

.inspera-menu__item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
  text-align: left;
  cursor: pointer;
  opacity: 1;
  transition: background 120ms ease;
}

/* The highlight follows the keyboard cursor, so hover and arrow keys have to
   drive the same state. */
.inspera-menu__item--active,
.inspera-menu__item:hover:not(:disabled) { background: var(--action-hover); }

.inspera-menu__item--danger { color: var(--error); }

.inspera-menu__item:disabled {
  color: var(--action-disabled);
  cursor: not-allowed;
  opacity: 0.6;
}

.inspera-menu__item .material-symbols-outlined { font-size: 20px; }

.inspera-menu__separator {
  height: 1px;
  background: var(--border);
  margin: 4px 0;
}`,
  html: `<div class="inspera-menu">
  <button type="button" class="inspera-menu__trigger"
          aria-haspopup="menu" aria-expanded="true" aria-controls="actions-menu">
    Actions
    <span class="material-symbols-outlined" aria-hidden="true">expand_more</span>
  </button>
  <div class="inspera-menu__list" id="actions-menu" role="menu" aria-label="Actions">
    <button type="button" class="inspera-menu__item inspera-menu__item--active" role="menuitem" tabindex="-1">
      <span class="material-symbols-outlined" aria-hidden="true">edit</span>Edit
    </button>
    <div class="inspera-menu__separator" role="separator" aria-hidden="true"></div>
    <button type="button" class="inspera-menu__item inspera-menu__item--danger" role="menuitem" tabindex="-1">
      <span class="material-symbols-outlined" aria-hidden="true">delete</span>Delete
    </button>
  </div>
</div>`,
  markup: (v) => {
    const end = v.placement === 'Bottom End' ? ' inspera-menu__list--end' : ''
    const items = [
      { label: 'Edit', icon: 'edit' },
      { label: 'Duplicate', icon: 'content_copy' },
      { label: 'Share', icon: 'share' },
      { divider: true },
      { label: 'Delete', icon: 'delete', danger: true },
    ]
    const rows = items.map((item, i) => item.divider
      ? `    <div class="inspera-menu__separator" role="separator" aria-hidden="true"></div>`
      : `    <button type="button" class="inspera-menu__item${i === 0 ? ' inspera-menu__item--active' : ''}${item.danger ? ' inspera-menu__item--danger' : ''}" role="menuitem" tabindex="-1">` +
        `<span class="material-symbols-outlined" aria-hidden="true">${item.icon}</span>${item.label}</button>`)
    return `<div class="inspera-menu">
  <button type="button" class="inspera-menu__trigger" aria-haspopup="menu" aria-expanded="true" aria-controls="actions-menu">
    Actions
    <span class="material-symbols-outlined" aria-hidden="true">expand_more</span>
  </button>
  <div class="inspera-menu__list${end}" id="actions-menu" role="menu" aria-label="Actions">
${rows.join('\n')}
  </div>
</div>`
  },
  component: (v) => (
    <Menu
      label="Actions"
      forceVisible
      placement={v.placement as never}
      items={[
        { label: 'Edit', icon: 'edit' },
        { label: 'Duplicate', icon: 'content_copy' },
        { label: 'Share', icon: 'share' },
        { label: '', divider: true },
        { label: 'Delete', icon: 'delete', danger: true },
      ]}
    />
  ),
  notes: [
    'The trigger takes `aria-haspopup="menu"`, `aria-expanded` and `aria-controls`; the panel is `role="menu"` with `role="menuitem"` buttons at `tabindex="-1"`.',
    'Focus stays on the trigger and the arrows move a highlight, so hover and the keyboard cursor must drive the same `--active` state.',
    'Separators are `role="separator"` and `aria-hidden`, 1px of `--border` with a 4px margin.',
    'Destructive items are `--error` text, never a red fill — a filled row reads as selected.',
    'Panel is `--radius-md` on `--surface` with `--shadow-200` and a 180px floor, anchored 4px under the trigger. Bottom End flips it to `right: 0` for menus near the viewport edge.',
    'Escape closes and returns focus to the trigger; an outside click closes without moving focus.',
  ],
}

// ---------------------------------------------------------------------------
// Dialog — the panel plus the scrim that makes it modal. The overlay is not
// decoration: it is what stops the page behind being reachable.
// ---------------------------------------------------------------------------
const dialog: Recipe = {
  className: 'inspera-dialog',
  css: `/* The scrim. Fixed, full-viewport, and it closes the dialog when clicked. */
.inspera-dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(39, 39, 39, 0.48);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: var(--z-modal, 1000);
}

.inspera-dialog {
  width: 480px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  background: var(--white);
  color: var(--text-primary);
  box-shadow: var(--shadow-500);
  font-family: var(--font-sans);
}

.inspera-dialog--small { width: 400px; }
.inspera-dialog--large { width: 560px; }

.inspera-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 24px;
  border-bottom: 1px solid var(--border);
  min-height: 64px;
}

.inspera-dialog__title {
  margin: 0;
  font-size: 22.78px;
  font-weight: 500;
  line-height: 1.12;
  color: var(--gray-900);
  letter-spacing: -0.2px;
}

.inspera-dialog__close {
  flex-shrink: 0;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--gray-900);
  display: inline-flex;
  border-radius: var(--radius-pill);
  line-height: 0;
}
.inspera-dialog__close .material-symbols-outlined { font-size: 24px; }

.inspera-dialog__body {
  padding: 32px;
  font-size: 16px;
  line-height: 20px;
  color: var(--gray-900);
}

.inspera-dialog__footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid var(--border);
  flex-wrap: wrap;
}

.inspera-dialog__action {
  padding: 12px;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  color: var(--primary);
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  cursor: pointer;
}

.inspera-dialog__action--confirm {
  background: var(--primary);
  color: var(--white);
  box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.08), inset 0px -1px 0px 0px rgba(0, 0, 0, 0.2);
}`,
  html: `<!-- The scrim is required. Without it the page behind stays clickable and
     the "modal" is a floating card. -->
<div class="inspera-dialog-overlay">
  <div class="inspera-dialog" role="dialog" aria-modal="true"
       aria-labelledby="dlg-title" tabindex="-1">
    <div class="inspera-dialog__header">
      <h2 class="inspera-dialog__title" id="dlg-title">Delete assessment?</h2>
      <button type="button" class="inspera-dialog__close" aria-label="Close dialog">
        <span class="material-symbols-outlined" aria-hidden="true">close</span>
      </button>
    </div>
    <div class="inspera-dialog__body">This cannot be undone.</div>
    <div class="inspera-dialog__footer">
      <button type="button" class="inspera-dialog__action">Cancel</button>
      <button type="button" class="inspera-dialog__action inspera-dialog__action--confirm">Delete</button>
    </div>
  </div>
</div>`,
  markup: (v) => {
    const size = v.size === 'Medium' ? '' : ` inspera-dialog--${v.size.toLowerCase()}`
    const close = v.hasCloseButton === 'true'
      ? `\n    <button type="button" class="inspera-dialog__close" aria-label="Close dialog">\n` +
        `      <span class="material-symbols-outlined" aria-hidden="true">close</span>\n    </button>`
      : ''
    const footer = v.hasActions === 'true'
      ? `\n  <div class="inspera-dialog__footer">
    <button type="button" class="inspera-dialog__action">Cancel</button>
    <button type="button" class="inspera-dialog__action inspera-dialog__action--confirm">Continue</button>
  </div>`
      : ''
    return `<div class="inspera-dialog${size}" role="dialog" aria-modal="true" aria-labelledby="dlg-title" tabindex="-1">
  <div class="inspera-dialog__header">
    <h2 class="inspera-dialog__title" id="dlg-title">Dialog title</h2>${close}
  </div>
  <div class="inspera-dialog__body">This is the dialog body. Provide context or a clear description of the action the user is about to take.</div>${footer}
</div>`
  },
  component: (v) => (
    <Dialog
      embedded
      size={v.size as never}
      hasCloseButton={v.hasCloseButton === 'true'}
      hasActions={v.hasActions === 'true'}
    />
  ),
  notes: [
    'Widths are exactly 400 / 480 / 560 with `max-width: 100%`, `--radius-lg` and `--shadow-500`.',
    'Wrap the panel in the scrim. `rgba(39,39,39,0.48)`, fixed, full-viewport, at `--z-modal`. Without it the page behind stays clickable and this is a floating card, not a modal.',
    '`role="dialog"` with `aria-modal="true"` and `aria-labelledby` pointing at the title id. Generate a unique id — a hardcoded one collides the moment two dialogs exist on a page.',
    'Behaviour the markup cannot express, and that you must add: move focus into the panel on open, trap Tab inside it, return focus to the trigger on close, close on Escape and on a scrim click, and lock body scroll while open.',
    'The title is 22.78px/500 — an exact export from Figma, not a rounded 24.',
    'Name the confirming action for what it does ("Delete"), never "OK".',
  ],
}

// ---------------------------------------------------------------------------
// Drawer — a panel pinned to an edge. Same modal obligations as Dialog.
// ---------------------------------------------------------------------------
const drawer: Recipe = {
  className: 'inspera-drawer',
  css: `.inspera-drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(39, 39, 39, 0.48);
  z-index: var(--z-modal, 1000);
}

.inspera-drawer {
  display: flex;
  flex-direction: column;
  background: var(--surface);
  color: var(--text-primary);
  box-shadow: var(--shadow-500);
  font-family: var(--font-sans);
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 400px;
  max-width: 100%;
}

.inspera-drawer--left  { left: 0; right: auto; }
.inspera-drawer--small { width: 320px; }
.inspera-drawer--large { width: 560px; }

/* Bottom pins to the full width and takes its size as height instead. */
.inspera-drawer--bottom {
  top: auto;
  left: 0;
  right: 0;
  width: auto;
  height: 400px;
  max-height: 90%;
}
.inspera-drawer--bottom.inspera-drawer--small { width: auto; height: 320px; }
.inspera-drawer--bottom.inspera-drawer--large { width: auto; height: 560px; }

.inspera-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.inspera-drawer__title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.inspera-drawer__close {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--action-active);
  display: inline-flex;
}
.inspera-drawer__close .material-symbols-outlined { font-size: 22px; }

/* The body scrolls, not the panel — the header stays put. */
.inspera-drawer__body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  font-size: 16px;
  line-height: 1.5;
  color: var(--gray-700);
}`,
  html: `<div class="inspera-drawer-overlay">
  <div class="inspera-drawer" role="dialog" aria-modal="true"
       aria-labelledby="drawer-title" tabindex="-1">
    <div class="inspera-drawer__header">
      <h2 class="inspera-drawer__title" id="drawer-title">Assessment details</h2>
      <button type="button" class="inspera-drawer__close" aria-label="Close">
        <span class="material-symbols-outlined" aria-hidden="true">close</span>
      </button>
    </div>
    <div class="inspera-drawer__body">Panel content.</div>
  </div>
</div>`,
  markup: (v) => {
    // Inline sizing mirrors the component's own inline `embedded` layout, which
    // is a documentation affordance rather than part of the modal itself.
    const extent = { Small: 320, Medium: 400, Large: 560 }[v.size]!
    const bottom = v.side === 'Bottom'
    const box = bottom
      ? `width: 100%; max-width: 100%; height: ${extent}px`
      : `width: ${extent}px; max-width: 100%; height: 320px`
    const close = v.hasCloseButton === 'true'
      ? `\n    <button type="button" class="inspera-drawer__close" aria-label="Close">\n` +
        `      <span class="material-symbols-outlined" aria-hidden="true">close</span>\n    </button>`
      : ''
    return `<div class="inspera-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title" tabindex="-1" style="position: static; ${box}; border-radius: var(--radius-md); border: 1px solid var(--border); overflow: hidden">
  <div class="inspera-drawer__header">
    <h2 class="inspera-drawer__title" id="drawer-title">Assessment details</h2>${close}
  </div>
  <div class="inspera-drawer__body">Drawer body content.</div>
</div>`
  },
  component: (v) => (
    <Drawer
      embedded
      side={v.side as never}
      size={v.size as never}
      hasCloseButton={v.hasCloseButton === 'true'}
      title="Assessment details"
    />
  ),
  notes: [
    'Side panels are 320 / 400 / 560 wide and pinned top-to-bottom; a bottom drawer takes that number as its height, spans the full width, and caps at 90% of the viewport.',
    'Same scrim and the same modal obligations as Dialog: focus in, Tab trapped, focus restored, Escape and scrim click close, body scroll locked.',
    'The body scrolls (`flex: 1; overflow-y: auto`), not the panel — the header has to stay put.',
    'The header is 16px/20px padding with an 18px/500 title, smaller than a Dialog’s because a drawer is a secondary surface.',
    'Slide it in from its own edge. A drawer that fades in reads as a dialog in the wrong place.',
  ],
}

// ---------------------------------------------------------------------------
// Popover — a panel anchored to a trigger, holding interactive content. Unlike
// a tooltip it can be focused and clicked into.
// ---------------------------------------------------------------------------
const popover: Recipe = {
  className: 'inspera-popover',
  css: `.inspera-popover {
  position: relative;
  display: inline-flex;
}

.inspera-popover__trigger { display: inline-flex; }

.inspera-popover__panel {
  position: absolute;
  z-index: var(--z-popover, 40);
  max-width: 280px;
  width: max-content;
  padding: 16px;
  border-radius: var(--radius-md);
  background: var(--surface);
  color: var(--text-primary);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-300);
  text-align: left;
  font-family: var(--font-sans);
}

/* Placement sets the offset and the centring transform together — a 10px gap
   leaves room for the arrow without it touching the trigger. */
.inspera-popover__panel--bottom { top: calc(100% + 10px); left: 50%; transform: translateX(-50%); }
.inspera-popover__panel--top    { bottom: calc(100% + 10px); left: 50%; transform: translateX(-50%); }
.inspera-popover__panel--left   { right: calc(100% + 10px); top: 50%; transform: translateY(-50%); }
.inspera-popover__panel--right  { left: calc(100% + 10px); top: 50%; transform: translateY(-50%); }

/* The arrow is a rotated square that borrows two of the panel's borders. */
.inspera-popover__arrow {
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--surface);
  transform: rotate(45deg);
}

.inspera-popover__panel--bottom .inspera-popover__arrow {
  top: -5px; left: 50%; margin-left: -5px;
  border-left: 1px solid var(--border);
  border-top: 1px solid var(--border);
}
.inspera-popover__panel--top .inspera-popover__arrow {
  bottom: -5px; left: 50%; margin-left: -5px;
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.inspera-popover__panel--left .inspera-popover__arrow {
  right: -5px; top: 50%; margin-top: -5px;
  border-right: 1px solid var(--border);
  border-top: 1px solid var(--border);
}
.inspera-popover__panel--right .inspera-popover__arrow {
  left: -5px; top: 50%; margin-top: -5px;
  border-left: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.inspera-popover__title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
}

.inspera-popover__body {
  font-size: 14px;
  line-height: 1.5;
  color: var(--muted-foreground);
}

.inspera-popover__default-trigger {
  height: 40px;
  padding: 0 16px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-strong);
  background: var(--white);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
}`,
  html: `<span class="inspera-popover">
  <span class="inspera-popover__trigger" aria-expanded="true"
        aria-haspopup="dialog" aria-controls="filters-popover">
    <button type="button" class="inspera-popover__default-trigger">Filters</button>
  </span>
  <div class="inspera-popover__panel inspera-popover__panel--bottom" id="filters-popover"
       role="dialog" aria-labelledby="filters-title">
    <span class="inspera-popover__arrow" aria-hidden="true"></span>
    <h3 class="inspera-popover__title" id="filters-title">Filter results</h3>
    <div class="inspera-popover__body">Popovers can hold interactive content.</div>
  </div>
</span>`,
  markup: (v) => {
    const place = v.placement.toLowerCase()
    return `<span class="inspera-popover">
  <span class="inspera-popover__trigger" aria-expanded="true" aria-haspopup="dialog" aria-controls="pop-panel">
    <button type="button" class="inspera-popover__default-trigger">Open</button>
  </span>
  <div class="inspera-popover__panel inspera-popover__panel--${place}" id="pop-panel" role="dialog" aria-labelledby="pop-title">
    <span class="inspera-popover__arrow" aria-hidden="true"></span>
    <h3 class="inspera-popover__title" id="pop-title">Popover title</h3>
    <div class="inspera-popover__body">Popover content with interactive elements.</div>
  </div>
</span>`
  },
  component: (v) => (
    <Popover forceVisible placement={v.placement as never} />
  ),
  notes: [
    'A popover holds interactive content, so it is `role="dialog"` (not `tooltip`), it is reachable by keyboard, and it does not disappear on mouseout.',
    'The panel is `--radius-md` on `--surface` with a 1px `--border` and `--shadow-300`, 16px padding, capped at 280px with `width: max-content`.',
    'Placement sets the offset and the centring transform together; the 10px gap leaves room for the arrow without it touching the trigger.',
    'The arrow is a 10px square rotated 45° that borrows exactly two of the panel’s borders — the two facing the trigger.',
    'Close on Escape and on an outside click, and return focus to the trigger.',
    'For plain text with no controls, use a Tooltip. For anything that must be acted on, this.',
  ],
}

// ---------------------------------------------------------------------------
// Tooltip — a hint on hover or focus. Non-interactive by construction, which
// is the whole difference from a popover.
// ---------------------------------------------------------------------------
const tooltip: Recipe = {
  className: 'inspera-tooltip',
  css: `.inspera-tooltip {
  position: relative;
  display: inline-flex;
}

.inspera-tooltip__bubble {
  position: absolute;
  max-width: 240px;
  width: max-content;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  background: var(--gray-900);
  color: var(--white);
  border: none;
  font-family: var(--font-sans);
  font-size: 12px;
  line-height: 1.4;
  box-shadow: var(--shadow-100);
  z-index: var(--z-tooltip, 30);
  /* Never a pointer target: hovering the hint must not keep it open, and it
     must never sit between the pointer and the thing it describes. */
  pointer-events: none;
  opacity: 0;
  transition: opacity 140ms ease;
}

/* Shown on hover and on keyboard focus. Focus is not optional — a hint only
   available to a mouse is unreachable for half the people who need it. */
.inspera-tooltip:hover .inspera-tooltip__bubble,
.inspera-tooltip:focus-within .inspera-tooltip__bubble { opacity: 1; }

/* The accessibility type is larger, for hints that carry real instruction. */
.inspera-tooltip__bubble--accessibility { padding: 10px 12px; font-size: 14px; }

.inspera-tooltip__bubble--light {
  background: var(--white);
  color: var(--text-primary);
  border: 1px solid var(--border-strong);
}

.inspera-tooltip__bubble--top    { bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); }
.inspera-tooltip__bubble--bottom { top: calc(100% + 8px); left: 50%; transform: translateX(-50%); }
.inspera-tooltip__bubble--left   { right: calc(100% + 8px); top: 50%; transform: translateY(-50%); }
.inspera-tooltip__bubble--right  { left: calc(100% + 8px); top: 50%; transform: translateY(-50%); }

.inspera-tooltip__arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--gray-900);
  transform: rotate(45deg);
  z-index: 31;
}

.inspera-tooltip__bubble--light .inspera-tooltip__arrow { background: var(--white); }

.inspera-tooltip__bubble--top .inspera-tooltip__arrow {
  bottom: -4px; left: 50%; margin-left: -4px;
  border-right: 1px solid transparent; border-bottom: 1px solid transparent;
}
.inspera-tooltip__bubble--bottom .inspera-tooltip__arrow {
  top: -4px; left: 50%; margin-left: -4px;
  border-left: 1px solid transparent; border-top: 1px solid transparent;
}
.inspera-tooltip__bubble--left .inspera-tooltip__arrow {
  right: -4px; top: 50%; margin-top: -4px;
  border-right: 1px solid transparent; border-top: 1px solid transparent;
}
.inspera-tooltip__bubble--right .inspera-tooltip__arrow {
  left: -4px; top: 50%; margin-top: -4px;
  border-left: 1px solid transparent; border-bottom: 1px solid transparent;
}

.inspera-tooltip__bubble--light.inspera-tooltip__bubble--top .inspera-tooltip__arrow {
  border-right-color: var(--border-strong); border-bottom-color: var(--border-strong);
}
.inspera-tooltip__bubble--light.inspera-tooltip__bubble--bottom .inspera-tooltip__arrow {
  border-left-color: var(--border-strong); border-top-color: var(--border-strong);
}
.inspera-tooltip__bubble--light.inspera-tooltip__bubble--left .inspera-tooltip__arrow {
  border-right-color: var(--border-strong); border-top-color: var(--border-strong);
}
.inspera-tooltip__bubble--light.inspera-tooltip__bubble--right .inspera-tooltip__arrow {
  border-left-color: var(--border-strong); border-bottom-color: var(--border-strong);
}

.inspera-tooltip__default-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-strong);
  background: var(--white);
  font-family: var(--font-sans);
  cursor: help;
}
.inspera-tooltip__default-trigger .material-symbols-outlined {
  font-size: 20px;
  color: var(--action-active);
}`,
  html: `<span class="inspera-tooltip">
  <button type="button" class="inspera-tooltip__default-trigger" aria-describedby="tip-1">
    <span class="material-symbols-outlined" aria-hidden="true">help</span>
  </button>
  <span class="inspera-tooltip__bubble inspera-tooltip__bubble--top" id="tip-1" role="tooltip">
    Supplementary help text
    <span class="inspera-tooltip__arrow" aria-hidden="true"></span>
  </span>
</span>`,
  markup: (v) => {
    const place = v.placement.toLowerCase()
    const theme = v.theme === 'Light' ? ' inspera-tooltip__bubble--light' : ''
    const type = v.type === 'Accessibility' ? ' inspera-tooltip__bubble--accessibility' : ''
    return `<span class="inspera-tooltip">
  <button type="button" class="inspera-tooltip__default-trigger" aria-describedby="tip-1">
    <span class="material-symbols-outlined" aria-hidden="true">help</span>
  </button>
  <span class="inspera-tooltip__bubble inspera-tooltip__bubble--${place}${theme}${type}" id="tip-1" role="tooltip" style="opacity: 1">
    Supplementary help text shown on hover or focus.
    <span class="inspera-tooltip__arrow" aria-hidden="true"></span>
  </span>
</span>`
  },
  component: (v) => (
    <Tooltip
      content="Supplementary help text shown on hover or focus."
      placement={v.placement as never}
      theme={v.theme as never}
      type={v.type as never}
      forceVisible
    />
  ),
  notes: [
    'The trigger points at the bubble with `aria-describedby`, and the bubble is `role="tooltip"`. A custom trigger needs that attribute too — the tooltip is not announced without it.',
    'Show on `:hover` **and** `:focus-within`. A hint only a mouse can reach is unreachable for anyone navigating by keyboard.',
    'The bubble takes `pointer-events: none` so it can never sit between the pointer and what it describes.',
    'Dark is `--gray-900` with white text and no border; Light is white with a 1px `--border-strong`, and the arrow has to pick up that border on its two trigger-facing edges.',
    'Default type is 12px; the accessibility type is 14px with more padding, for hints that carry real instruction.',
    'Escape must dismiss it (WCAG 1.4.13), and nothing essential may live only here — a tooltip is supplementary by definition.',
  ],
}

// Keyed by component slug — this is what ComponentPage and the generator look
// up, so a camelCase key would silently mean "no recipe".
export const recipes: Record<string, Recipe> = {
  button,
  badge,
  tag,
  divider,
  stat,
  'empty-state': emptyState,
  spinner,
  skeleton,
  card,
  link,
  alert,
  snackbar,
  avatar,
  'avatar-group': avatarGroup,
  progress,
  breadcrumb,
  'text-input': textInput,
  textarea,
  checkbox,
  'radio-button': radioButton,
  toggle,
  'segmented-control': segmentedControl,
  slider,
  rating,
  'otp-input': otpInput,
  'form-field': formField,
  select,
  'date-picker': datePicker,
  'file-upload': fileUpload,
  'radio-group': radioGroup,
  'checkbox-group': checkboxGroup,
  table,
  list,
  accordion,
  tabs,
  stepper,
  pagination,
  menu,
  dialog,
  drawer,
  popover,
  tooltip,
}
