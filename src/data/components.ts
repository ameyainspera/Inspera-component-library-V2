import type { ComponentSpec } from './types'

// Canonical component metadata transcribed from DESIGN_SYSTEM_AI_READY_V4.md §5.
// `specYaml` is the verbatim canonical block, exposed in the AI copy panel so
// AI tools consuming this library get the exact source-of-truth definition.

export const components: Record<string, ComponentSpec> = {
  button: {
    slug: 'button',
    name: 'Button',
    category: 'input-controls',
    purpose: 'Trigger an action.',
    status: 'ready',
    deprecatedAliases: [
      'Primary button', 'Secondary button', 'Outline button', 'Text button',
      'Success button', 'Warning button',
    ],
    props: [
      { name: 'Intent', values: 'Primary | Secondary | Outline | Text | Success | Warning | Destructive', default: 'Primary', description: 'Visual role / semantic weight.' },
      { name: 'Size', values: 'Small | Medium | Large', default: 'Medium', description: 'Height 32 / 40 / 48.' },
      { name: 'State', values: 'Default | Hover | Focused | Pressed | Disabled', default: 'Default', description: 'Interaction state.' },
      { name: 'Content', values: 'Text | Icon + Text | Text + Icon | Text + Disclosure', default: 'Text', description: 'Label / icon composition.' },
    ],
    tokens: ['primary.main #004080', 'body.semiBold16', 'radius.sm', 'spacing 12/16/24', 'primary.focusRing'],
    accessibility: {
      role: 'button',
      keyboard: true,
      ariaNotes: ['Icon-only buttons must have an accessible label'],
    },
    usage: {
      do: ['Use Primary for main actions', 'Use Secondary for alternative actions', 'Use Destructive only for destructive flows'],
      dont: ['Do not create separate component files per intent', 'Do not use deprecated alias names'],
    },
    specYaml: `component: Button
purpose: "Trigger an action."
variants:
  Intent: [Primary, Secondary, Outline, Text, Success, Warning, Destructive]
  Size: [Small, Medium, Large]
  State: [Default, Hover, Focused, Pressed, Disabled]
  Content: [Text, "Icon + Text", "Text + Icon", "Text + Disclosure"]
defaults: { Intent: Primary, Size: Medium, State: Default, Content: Text }
layout:
  height: { Small: 32, Medium: 40, Large: 48 }
  paddingX: { Small: 12, Medium: 16, Large: 24 }
  gap: { Small: 6, Medium: 8, Large: 10 }
  radius: sm
typography: { label: "body.semiBold16" }
intentMap:
  Primary:     { background: "#004080", text: "#FFFFFF" }
  Secondary:   { background: "#F7F7F7", text: "#272727", border: "#595959" }
  Outline:     { background: transparent, text: "#004080", border: "#004080" }
  Text:        { background: transparent, text: "#004080" }
  Success:     { background: "#2E7D32", text: "#FFFFFF" }
  Warning:     { background: "#EF6C00", text: "#FFFFFF" }
  Destructive: { background: "#D32F2F", text: "#FFFFFF" }
accessibility: { role: button, keyboard: true }`,
  },

  'text-input': {
    slug: 'text-input',
    name: 'Text Input',
    category: 'input-controls',
    purpose: 'Collect single-line text input.',
    status: 'ready',
    deprecatedAliases: ['Text inputs', 'Content', 'Content (small)'],
    props: [
      { name: 'State', values: 'Default | Hover | Focused | Disabled | Error | Filled | ReadOnly', default: 'Default', description: 'Interaction / validation state.' },
      { name: 'Size', values: 'Small | Medium', default: 'Medium', description: 'Control height.' },
      { name: 'LeadingIcon', values: 'true | false', default: 'false', description: 'Show a leading icon.' },
      { name: 'TrailingIcon', values: 'true | false', default: 'false', description: 'Show a trailing icon.' },
      { name: 'Label', values: 'true | false', default: 'true', description: 'Show the field label.' },
      { name: 'HelpText', values: 'true | false', default: 'false', description: 'Show helper text.' },
      { name: 'ErrorText', values: 'true | false', default: 'false', description: 'Show error message.' },
    ],
    tokens: ['border #C4C4C4', 'body.mdRegular', 'radius.md', 'primary focus ring', 'body.caption (help)'],
    accessibility: {
      role: 'textbox',
      keyboard: true,
      ariaNotes: ['Always associate label with input using htmlFor/id', 'Error text must be linked via aria-describedby', 'Required fields must use aria-required'],
    },
    usage: {
      do: ['Always include a visible label', 'Provide clear placeholder text as a hint', 'Show error messages below the input'],
      dont: ['Do not use placeholder as the only label', 'Do not disable inputs without explanation'],
    },
    specYaml: `component: Text Input
purpose: "Collect single-line text input."
variants:
  State: [Default, Hover, Focused, Disabled, Error, Filled, ReadOnly]
  Size: [Small, Medium]
  LeadingIcon: [true, false]
  TrailingIcon: [true, false]
  Label: [true, false]
  HelpText: [true, false]
  ErrorText: [true, false]
defaults: { State: Default, Size: Medium, Label: true }
layout: { height: 40, paddingX: 12, paddingY: 8, gap: 8, radius: md }
typography: { label: "body.mdMedium", input: "body.mdRegular", help: "body.caption" }
styling: { background: "#FFFFFF", text: "rgba(0,0,0,0.87)", border: "#C4C4C4" }
accessibility: { role: textbox, keyboard: true }`,
  },

  checkbox: {
    slug: 'checkbox',
    name: 'Checkbox',
    category: 'input-controls',
    purpose: 'Allow multiple selection.',
    status: 'ready',
    deprecatedAliases: ['Checkbox/Unchecked', 'Checkbox/Checked', 'Checkbox with label', 'Checkbox (fill width)', 'Checkbox (Cards)'],
    props: [
      { name: 'State', values: 'Default | Hover | Focused | Pressed | Disabled | Error', default: 'Default', description: 'Interaction / validation state.' },
      { name: 'Checked', values: 'true | false', default: 'false', description: 'Checked state.' },
      { name: 'WithLabel', values: 'true | false', default: 'true', description: 'Render the label.' },
      { name: 'Size', values: 'Small | Medium', default: 'Medium', description: 'Indicator size.' },
    ],
    tokens: ['border #8C8C8C', 'primary.main (checked)', 'radius.xs', 'body.mdRegular', 'indicator 20'],
    accessibility: {
      role: 'checkbox',
      keyboard: true,
      ariaNotes: ['Use aria-checked to reflect state', 'Group related checkboxes with fieldset and legend'],
    },
    usage: {
      do: ['Use for multi-select scenarios', 'Always provide a label for each checkbox', 'Group related options together'],
      dont: ['Do not use for mutually exclusive options — use Radio Button instead', 'Do not use without a label'],
    },
    specYaml: `component: Checkbox
purpose: "Allow multiple selection."
variants:
  State: [Default, Hover, Focused, Pressed, Disabled, Error]
  Checked: [true, false]
  WithLabel: [true, false]
  Size: [Small, Medium]
defaults: { State: Default, Checked: false, WithLabel: true, Size: Medium }
layout: { paddingY: 8, gap: 8, radius: xs, indicatorSize: 20 }
styling: { border: "#8C8C8C", checkedBackground: "#004080" }
accessibility: { role: checkbox, keyboard: true }`,
  },

  'radio-button': {
    slug: 'radio-button',
    name: 'Radio Button',
    category: 'input-controls',
    purpose: 'Allow single selection.',
    status: 'ready',
    deprecatedAliases: ['Radiobutton', 'Radiobuttons', 'Radio Button New-BonW', 'Radio Button New-BonY', 'Radio Button New-WonB', 'Radio Button New-YonB'],
    props: [
      { name: 'State', values: 'Default | Hover | Focused | Pressed | Disabled | Error', default: 'Default', description: 'Interaction / validation state.' },
      { name: 'Selected', values: 'true | false', default: 'false', description: 'Selected state.' },
      { name: 'WithLabel', values: 'true | false', default: 'true', description: 'Render the label.' },
    ],
    tokens: ['border #8C8C8C', 'primary.main (selected)', 'radius.pill', 'body.mdRegular', 'indicator 20'],
    accessibility: {
      role: 'radio',
      keyboard: true,
      ariaNotes: ['Use role="radiogroup" for the group container', 'Use aria-checked to indicate selected state', 'Arrow keys navigate between options in the group'],
    },
    usage: {
      do: ['Use for mutually exclusive options', 'Always group inside a radiogroup', 'Pre-select a default when appropriate'],
      dont: ['Do not use for multi-select — use Checkbox instead', 'Do not use a single radio button alone'],
    },
    specYaml: `component: Radio Button
purpose: "Allow single selection."
variants:
  State: [Default, Hover, Focused, Pressed, Disabled, Error]
  Selected: [true, false]
  WithLabel: [true, false]
defaults: { State: Default, Selected: false, WithLabel: true }
layout: { paddingY: 8, gap: 8, radius: pill, indicatorSize: 20 }
styling: { border: "#8C8C8C", selectedColor: "#004080" }
accessibility: { role: radio, keyboard: true }`,
  },

  select: {
    slug: 'select',
    name: 'Select',
    category: 'input-controls',
    purpose: 'Select one option from a list.',
    status: 'ready',
    deprecatedAliases: ['Select / Fixed width', 'Select / Content adaptable', 'Dropdown', 'Dropdown with Label'],
    props: [
      { name: 'State', values: 'Default | Hover | Focused | Disabled | Error | Open', default: 'Default', description: 'Interaction / validation state.' },
      { name: 'WidthMode', values: 'Fixed | Content Adaptable', default: 'Fixed', description: 'Trigger sizing.' },
      { name: 'Label', values: 'true | false', default: 'true', description: 'Render the label.' },
      { name: 'Search', values: 'true | false', default: 'false', description: 'Filterable option list.' },
    ],
    tokens: ['border #C4C4C4', 'body.mdRegular', 'radius.md', 'shadow.200 (menu)', 'primary focus ring'],
    accessibility: {
      role: 'combobox',
      keyboard: true,
      ariaNotes: ['Use aria-expanded to indicate open state', 'Use aria-activedescendant for highlighted option', 'Support arrow key navigation through options'],
    },
    usage: {
      do: ['Use for 5+ options where space is limited', 'Always provide a label', 'Show a clear placeholder when no option is selected'],
      dont: ['Do not use for fewer than 3 options — use Radio Button instead', 'Do not nest selects inside other selects'],
    },
    specYaml: `component: Select
purpose: "Select one option from a list."
variants:
  State: [Default, Hover, Focused, Disabled, Error, Open]
  WidthMode: [Fixed, "Content Adaptable"]
  Label: [true, false]
  Search: [true, false]
defaults: { State: Default, WidthMode: Fixed, Label: true, Search: false }
layout: { height: 40, minWidth: 120, paddingX: 12, paddingY: 8, gap: 8, radius: md }
styling: { background: "#FFFFFF", border: "#C4C4C4" }
accessibility: { role: combobox, keyboard: true }`,
  },

  toggle: {
    slug: 'toggle',
    name: 'Toggle',
    category: 'input-controls',
    purpose: 'Switch a setting on or off instantly.',
    status: 'ready',
    deprecatedAliases: ['Switch', 'Toggle switch'],
    props: [
      { name: 'State', values: 'Default | Hover | Focused | Disabled', default: 'Default', description: 'Interaction state.' },
      { name: 'Checked', values: 'true | false', default: 'false', description: 'On / off state.' },
      { name: 'Size', values: 'Small | Medium', default: 'Medium', description: 'Track / thumb size.' },
      { name: 'WithLabel', values: 'true | false', default: 'true', description: 'Render the label.' },
    ],
    tokens: ['track #C4C4C4', 'primary.main (on)', 'radius.pill', 'track 44 / thumb 20', 'body.mdRegular'],
    accessibility: {
      role: 'switch',
      keyboard: true,
      ariaNotes: ['Use role="switch" for the toggle', 'Use aria-checked to reflect on/off state', 'Space key toggles the switch'],
    },
    usage: {
      do: ['Use for immediate on/off settings', 'Provide a clear label describing the setting', 'Show the current state visually'],
      dont: ['Do not use for form submissions — use Checkbox instead', 'Do not use without a visible label'],
    },
    specYaml: `component: Toggle
purpose: "Switch a setting on or off instantly."
variants:
  State: [Default, Hover, Focused, Disabled]
  Checked: [true, false]
  Size: [Small, Medium]
  WithLabel: [true, false]
defaults: { State: Default, Checked: false, Size: Medium, WithLabel: true }
layout: { height: 24, gap: 8, radius: pill, trackWidth: 44, thumbSize: 20 }
styling: { offTrack: "#C4C4C4", onTrack: "#004080" }
accessibility: { role: switch, keyboard: true }`,
  },

  card: {
    slug: 'card',
    name: 'Card',
    category: 'data-display',
    purpose: 'Group related content in a contained surface.',
    status: 'ready',
    deprecatedAliases: [],
    props: [
      { name: 'Elevation', values: 'Flat | Raised | Outlined', default: 'Raised', description: 'Surface treatment.' },
      { name: 'Padding', values: 'Compact | Default | Spacious', default: 'Default', description: 'Internal padding (12 / 16 / 24).' },
      { name: 'Interactive', values: 'true | false', default: 'false', description: 'Renders as a focusable button with hover elevation.' },
    ],
    tokens: ['radius.lg', 'shadow.200', 'border #E5E7EB', 'spacing 12/16/24', 'heading.h5 (title)'],
    accessibility: {
      role: 'article',
      keyboard: true,
      ariaNotes: ['Interactive cards should use role="button" or be wrapped in an anchor', 'Non-interactive cards use role="article" or a semantic section'],
    },
    usage: {
      do: ['Use to group related content', 'Maintain consistent padding within a view', 'Use raised elevation for primary content cards'],
      dont: ['Do not nest cards inside other cards', 'Do not use cards for layout-only purposes without content'],
    },
    specYaml: `component: Card
purpose: "Group related content in a contained surface."
variants:
  Elevation: [Flat, Raised, Outlined]
  Padding: [Compact, Default, Spacious]
  Interactive: [true, false]
defaults: { Elevation: Raised, Padding: Default, Interactive: false }
layout: { paddingX: 16, paddingY: 16, gap: 12, radius: lg }
styling: { background: "#FFFFFF", border: "#E5E7EB", shadow: "shadow.200" }
accessibility: { role: article, keyboard: true }`,
  },

  badge: {
    slug: 'badge',
    name: 'Badge',
    category: 'data-display',
    purpose: 'Display a short status label or count.',
    status: 'ready',
    deprecatedAliases: ['Status Badge', 'Tag', 'Chip'],
    props: [
      { name: 'Intent', values: 'Neutral | Info | Success | Warning | Error', default: 'Neutral', description: 'Semantic color.' },
      { name: 'Size', values: 'Small | Medium', default: 'Medium', description: 'Height 20 / 24.' },
      { name: 'WithIcon', values: 'true | false', default: 'false', description: 'Show a leading status icon.' },
    ],
    tokens: ['radius.pill', 'body.caption', 'intentMap backgrounds', 'spacing 4/8'],
    accessibility: {
      role: 'status',
      keyboard: false,
      ariaNotes: ['Use aria-label for icon-only badges', 'Use role="status" for dynamic count badges'],
    },
    usage: {
      do: ['Use for status indicators and counts', 'Keep labels short — 1 to 2 words', 'Use intent colors consistently'],
      dont: ['Do not use for long text content', 'Do not make badges interactive without clear affordance'],
    },
    specYaml: `component: Badge
purpose: "Display a short status label or count."
variants:
  Intent: [Neutral, Info, Success, Warning, Error]
  Size: [Small, Medium]
  WithIcon: [true, false]
defaults: { Intent: Neutral, Size: Medium, WithIcon: false }
layout: { height: 24, paddingX: 8, paddingY: 4, gap: 4, radius: pill }
intentMap:
  Neutral: { background: "#F0F0F0", text: "#272727" }
  Info:    { background: "#E1F5FE", text: "#0288D1" }
  Success: { background: "#E8F5E9", text: "#2E7D32" }
  Warning: { background: "#FFF3E0", text: "#EF6C00" }
  Error:   { background: "#FFEBEE", text: "#D32F2F" }
accessibility: { role: status }`,
  },

  avatar: {
    slug: 'avatar',
    name: 'Avatar',
    category: 'data-display',
    purpose: 'Represent a user or entity with an image or initials.',
    status: 'ready',
    deprecatedAliases: [],
    props: [
      { name: 'Size', values: 'Small | Medium | Large', default: 'Medium', description: 'Diameter 32 / 40 / 56.' },
      { name: 'Content', values: 'Image | Initials | Icon', default: 'Initials', description: 'What fills the avatar.' },
      { name: 'Status', values: 'None | Online | Offline | Busy', default: 'None', description: 'Presence indicator dot.' },
    ],
    tokens: ['radius.pill', 'body.mdMedium (initials)', 'background #E0E0E0', 'status colors'],
    accessibility: {
      role: 'img',
      keyboard: false,
      ariaNotes: ['Provide alt text for image avatars', 'Use aria-label for initials and icon variants'],
    },
    usage: {
      do: ['Use for user profiles and participant lists', 'Provide meaningful alt text', 'Use consistent sizing within a context'],
      dont: ['Do not stretch or distort avatar images', 'Do not use random colors — use a deterministic palette'],
    },
    specYaml: `component: Avatar
purpose: "Represent a user or entity with an image or initials."
variants:
  Size: [Small, Medium, Large]
  Content: [Image, Initials, Icon]
  Status: [None, Online, Offline, Busy]
defaults: { Size: Medium, Content: Initials, Status: None }
layout: { radius: pill }
styling: { background: "#E0E0E0", text: "#272727" }
accessibility: { role: img }`,
  },

  alert: {
    slug: 'alert',
    name: 'Alert',
    category: 'feedback',
    purpose: 'Display semantic inline feedback.',
    status: 'ready',
    deprecatedAliases: [],
    props: [
      { name: 'Intent', values: 'Info | Success | Warning | Error', default: 'Info', description: 'Severity / color.' },
      { name: 'Layout', values: 'Simple | With CTA | With Close | With CTA + Close', default: 'Simple', description: 'Action affordances.' },
      { name: 'Background', values: 'true | false', default: 'true', description: 'Tinted fill vs. left-accent only.' },
    ],
    tokens: ['radius.md', 'body.mdMedium (title)', 'intentMap', 'spacing 12/16'],
    accessibility: {
      role: 'alert',
      keyboard: true,
      ariaNotes: ['Use role="alert" for important messages', 'Use aria-live="polite" for non-critical alerts', 'Close button must have aria-label="Close alert"'],
    },
    usage: {
      do: ['Use for contextual inline messages', 'Match intent to message severity', 'Keep alert text concise'],
      dont: ['Do not stack more than 2 alerts in the same area', 'Do not use alerts for permanent content'],
    },
    specYaml: `component: Alert
purpose: "Display semantic inline feedback."
variants:
  Intent: [Info, Success, Warning, Error]
  Layout: [Simple, "With CTA", "With Close", "With CTA + Close"]
  Background: [true, false]
defaults: { Intent: Info, Layout: Simple, Background: true }
layout: { paddingX: 16, paddingY: 12, gap: 12, radius: md }
intentMap:
  Info:    { background: "#E1F5FE", text: "#0288D1", border: "#0288D1" }
  Success: { background: "#E8F5E9", text: "#2E7D32", border: "#2E7D32" }
  Warning: { background: "#FFF3E0", text: "#EF6C00", border: "#EF6C00" }
  Error:   { background: "#FFEBEE", text: "#D32F2F", border: "#D32F2F" }
accessibility: { role: alert, keyboard: true }`,
  },

  dialog: {
    slug: 'dialog',
    name: 'Dialog',
    category: 'feedback',
    purpose: 'Present content or actions that require user attention.',
    status: 'ready',
    deprecatedAliases: ['Modal', 'Popup'],
    props: [
      { name: 'Size', values: 'Small | Medium | Large', default: 'Medium', description: 'Panel width 400 / 480 / 560.' },
      { name: 'HasCloseButton', values: 'true | false', default: 'true', description: 'Show the header close affordance.' },
      { name: 'HasActions', values: 'true | false', default: 'true', description: 'Show the footer action buttons.' },
    ],
    tokens: ['radius.lg', 'shadow.500', 'heading.h4 (title)', 'spacing 16/24', 'scrim rgba(39,39,39,0.48)'],
    accessibility: {
      role: 'dialog',
      keyboard: true,
      ariaNotes: ['Use role="dialog" with aria-modal="true"', 'Set aria-labelledby to the dialog title', 'Trap focus inside the dialog when open', 'Return focus to trigger element on close', 'Escape key closes the dialog'],
    },
    usage: {
      do: ['Use for confirmations and critical decisions', 'Always provide a way to close the dialog', 'Keep dialog content focused and concise'],
      dont: ['Do not open dialogs from other dialogs', 'Do not use for non-blocking information — use Alert instead'],
    },
    specYaml: `component: Dialog
purpose: "Present content or actions that require user attention."
variants:
  Size: [Small, Medium, Large]
  HasCloseButton: [true, false]
  HasActions: [true, false]
defaults: { Size: Medium, HasCloseButton: true, HasActions: true }
layout: { minWidth: 400, maxWidth: 560, paddingX: 24, paddingY: 24, gap: 16, radius: lg }
styling: { background: "#FFFFFF", shadow: "shadow.500" }
accessibility: { role: dialog, ariaModal: true, keyboard: true }`,
  },

  snackbar: {
    slug: 'snackbar',
    name: 'Snackbar',
    category: 'feedback',
    purpose: 'Show brief, non-blocking feedback at the bottom of the screen.',
    status: 'ready',
    deprecatedAliases: ['Toast', 'Notification bar'],
    props: [
      { name: 'Intent', values: 'Neutral | Info | Success | Warning | Error', default: 'Neutral', description: 'Accent icon color.' },
      { name: 'HasAction', values: 'true | false', default: 'false', description: 'Show an inline action (e.g. Undo).' },
      { name: 'HasClose', values: 'true | false', default: 'true', description: 'Show the dismiss button.' },
    ],
    tokens: ['radius.md', 'shadow.300', 'background #272727', 'body.mdRegular', 'spacing 8/16'],
    accessibility: {
      role: 'status',
      keyboard: true,
      ariaNotes: ['Use role="status" with aria-live="polite"', 'Action button must be focusable', 'Auto-dismiss timing must be generous (5s minimum)'],
    },
    usage: {
      do: ['Use for brief confirmation messages', 'Include an undo action when appropriate', 'Limit to one snackbar at a time'],
      dont: ['Do not use for critical errors — use Alert or Dialog instead', 'Do not stack multiple snackbars'],
    },
    specYaml: `component: Snackbar
purpose: "Show brief, non-blocking feedback at the bottom of the screen."
variants:
  Intent: [Neutral, Info, Success, Warning, Error]
  HasAction: [true, false]
  HasClose: [true, false]
defaults: { Intent: Neutral, HasAction: false, HasClose: true }
layout: { height: 48, minWidth: 300, paddingX: 16, paddingY: 12, gap: 8, radius: md }
styling: { background: "#272727", text: "#FFFFFF", shadow: "shadow.300" }
accessibility: { role: status, keyboard: true }`,
  },

  tooltip: {
    slug: 'tooltip',
    name: 'Tooltip',
    category: 'feedback',
    purpose: 'Provide contextual help on hover or focus.',
    status: 'ready',
    deprecatedAliases: ['Tooltips', 'Walkthrough', 'a11y tooltips'],
    props: [
      { name: 'Placement', values: 'Top | Bottom | Left | Right', default: 'Top', description: 'Position relative to the trigger.' },
      { name: 'Theme', values: 'Light | Dark', default: 'Dark', description: 'Surface color.' },
      { name: 'Type', values: 'Default | Accessibility', default: 'Default', description: 'Accessibility type uses larger text.' },
    ],
    tokens: ['radius.sm', 'shadow.100', 'background #272727', 'body.caption', 'maxWidth 240'],
    accessibility: {
      role: 'tooltip',
      keyboard: true,
      ariaNotes: ['Use role="tooltip" on the tooltip element', 'Link trigger and tooltip with aria-describedby', 'Escape key dismisses the tooltip', 'Tooltip must not contain interactive content'],
    },
    usage: {
      do: ['Use for supplementary information', 'Keep tooltip text short and scannable', 'Position to avoid clipping viewport edges'],
      dont: ['Do not put critical information only in tooltips', 'Do not use for interactive content — use Popover instead'],
    },
    specYaml: `component: Tooltip
purpose: "Provide contextual help on hover or focus."
variants:
  Placement: [Top, Bottom, Left, Right]
  Theme: [Light, Dark]
  Type: [Default, Accessibility]
defaults: { Placement: Top, Theme: Dark, Type: Default }
layout: { maxWidth: 240, paddingX: 12, paddingY: 8, radius: sm }
styling: { background: "#272727", text: "#FFFFFF", shadow: "shadow.100" }
accessibility: { role: tooltip, keyboard: true }`,
  },

  tabs: {
    slug: 'tabs',
    name: 'Tabs',
    category: 'navigation',
    purpose: 'Organize content into switchable panels.',
    status: 'ready',
    deprecatedAliases: ['Tab bar', 'Tab navigation'],
    props: [
      { name: 'Style', values: 'Underline | Contained', default: 'Underline', description: 'Visual treatment.' },
      { name: 'Size', values: 'Small | Medium', default: 'Medium', description: 'Tab height 40 / 48.' },
      { name: 'FullWidth', values: 'true | false', default: 'false', description: 'Stretch tabs to fill the row.' },
    ],
    tokens: ['body.mdMedium', 'border #E5E7EB', 'primary.main (active)', 'shadow.100 (contained)'],
    accessibility: {
      role: 'tablist',
      keyboard: true,
      ariaNotes: ['Use role="tablist" on the tab container', 'Each tab uses role="tab" with aria-selected', 'Tab panels use role="tabpanel" linked by aria-labelledby', 'Arrow keys navigate between tabs'],
    },
    usage: {
      do: ['Use to organize related content sections', 'Label tabs clearly and concisely', 'Use a maximum of 6 tabs per set'],
      dont: ['Do not use tabs for sequential steps — use a stepper instead', 'Do not nest tab sets inside other tab sets'],
    },
    specYaml: `component: Tabs
purpose: "Organize content into switchable panels."
variants:
  Style: [Underline, Contained]
  Size: [Small, Medium]
  FullWidth: [true, false]
defaults: { Style: Underline, Size: Medium, FullWidth: false }
layout: { height: 48, paddingX: 16, radius: none }
styling: { text: "rgba(0,0,0,0.87)", border: "#E5E7EB", active: "#004080" }
accessibility: { role: tablist, keyboard: true }`,
  },

  breadcrumb: {
    slug: 'breadcrumb',
    name: 'Breadcrumb',
    category: 'navigation',
    purpose: "Show the user's current location in a hierarchy.",
    status: 'ready',
    deprecatedAliases: ['Breadcrumbs', 'Path navigation'],
    props: [
      { name: 'Separator', values: 'Slash | Chevron', default: 'Chevron', description: 'Divider glyph between items.' },
      { name: 'Size', values: 'Small | Medium', default: 'Medium', description: 'Text size 14 / 16.' },
    ],
    tokens: ['body.mdRegular (link)', 'body.mdMedium (current)', 'primary.main (link)', 'spacing 8'],
    accessibility: {
      role: 'navigation',
      keyboard: true,
      ariaNotes: ['Wrap in nav with aria-label="Breadcrumb"', 'Use an ordered list for semantic structure', 'Mark current page with aria-current="page"'],
    },
    usage: {
      do: ['Use for hierarchical navigation structures', 'Always include the current page as the last item', 'Keep breadcrumb labels concise'],
      dont: ['Do not use for flat navigation', 'Do not make the current page breadcrumb a link'],
    },
    specYaml: `component: Breadcrumb
purpose: "Show the user's current location in a hierarchy."
variants:
  Separator: [Slash, Chevron]
  Size: [Small, Medium]
defaults: { Separator: Chevron, Size: Medium }
layout: { height: 32, paddingY: 4, gap: 8, radius: none }
styling: { text: "#004080", current: "rgba(0,0,0,0.87)" }
accessibility: { role: navigation, keyboard: true }`,
  },

  textarea: {
    slug: 'textarea',
    name: 'Textarea',
    category: 'input-controls',
    purpose: 'Collect multi-line text input.',
    status: 'ready',
    deprecatedAliases: ['Text area', 'Multiline input', 'Comment box'],
    props: [
      { name: 'State', values: 'Default | Hover | Focused | Filled | Error | Disabled | ReadOnly', default: 'Default', description: 'Interaction / validation state.' },
      { name: 'Size', values: 'Small | Medium', default: 'Medium', description: 'Vertical padding density.' },
      { name: 'Rows', values: 'number', default: '4', description: 'Visible text rows.' },
      { name: 'ShowLabel', values: 'true | false', default: 'true', description: 'Show the field label.' },
      { name: 'ShowCount', values: 'true | false', default: 'false', description: 'Show character counter.' },
      { name: 'MaxLength', values: 'number', description: 'Maximum character length.' },
    ],
    tokens: ['border #C4C4C4', 'body.mdRegular', 'radius.md', 'primary focus ring', 'body.caption (help/count)'],
    accessibility: {
      role: 'textbox',
      keyboard: true,
      ariaNotes: ['Always associate label with textarea using htmlFor/id', 'Error text must be linked via aria-describedby', 'aria-invalid reflects the error state'],
    },
    usage: {
      do: ['Always include a visible label', 'Use rows to hint expected length', 'Show a character counter when a max length applies'],
      dont: ['Do not use for single-line input — use Text Input instead', 'Do not disable resize without reason'],
    },
    specYaml: `component: Textarea
purpose: "Collect multi-line text input."
variants:
  State: [Default, Hover, Focused, Filled, Error, Disabled, ReadOnly]
  Size: [Small, Medium]
defaults: { State: Default, Size: Medium, Rows: 4 }
layout: { paddingX: 12, paddingY: 8, gap: 6, radius: md }
typography: { input: "body.mdRegular", help: "body.caption" }
styling: { background: "#FFFFFF", border: "#C4C4C4" }
accessibility: { role: textbox, keyboard: true }`,
  },

  'form-field': {
    slug: 'form-field',
    name: 'Form Field',
    category: 'input-controls',
    purpose: 'Standardize label, control, and help/error layout around any input.',
    status: 'ready',
    deprecatedAliases: ['Field wrapper', 'Input group'],
    props: [
      { name: 'label', values: 'string', description: 'Field label text.' },
      { name: 'htmlFor', values: 'string', description: 'id of the wrapped control for label association.' },
      { name: 'required', values: 'true | false', default: 'false', description: 'Show a required asterisk.' },
      { name: 'helpText', values: 'string', description: 'Helper text shown below the control.' },
      { name: 'errorText', values: 'string', description: 'Error message; replaces help text when present.' },
    ],
    tokens: ['body.mdMedium (label)', 'error.main (asterisk)', 'body.caption (help)', 'spacing 6'],
    accessibility: {
      role: 'group',
      keyboard: true,
      ariaNotes: ['Associate the label with the control via htmlFor/id', 'Link error and help text with aria-describedby on the control', 'Required fields should set aria-required on the control'],
    },
    usage: {
      do: ['Wrap any single control for consistent spacing', 'Use htmlFor to link the label to the control', 'Show only one of help or error at a time'],
      dont: ['Do not wrap multiple unrelated controls', 'Do not omit the label for accessibility'],
    },
    specYaml: `component: Form Field
purpose: "Standardize label, control, and help/error layout around any input."
variants:
  required: [true, false]
defaults: { required: false }
layout: { gap: 6 }
typography: { label: "body.mdMedium", help: "body.caption" }
styling: { asterisk: "#D32F2F", help: "#595959", error: "#D32F2F" }
accessibility: { role: group, keyboard: true }`,
  },

  slider: {
    slug: 'slider',
    name: 'Slider',
    category: 'input-controls',
    purpose: 'Select a numeric value from a continuous range.',
    status: 'ready',
    deprecatedAliases: ['Range', 'Range slider'],
    props: [
      { name: 'State', values: 'Default | Focused | Disabled', default: 'Default', description: 'Interaction state.' },
      { name: 'Min', values: 'number', default: '0', description: 'Minimum value.' },
      { name: 'Max', values: 'number', default: '100', description: 'Maximum value.' },
      { name: 'Step', values: 'number', default: '1', description: 'Increment granularity.' },
      { name: 'ShowValue', values: 'true | false', default: 'true', description: 'Show the current value.' },
      { name: 'ShowLabel', values: 'true | false', default: 'true', description: 'Show the field label.' },
    ],
    tokens: ['track var(--gray-300)', 'primary.main (fill)', 'thumb #FFFFFF + primary border', 'radius.pill', 'primary.focusRing'],
    accessibility: {
      role: 'slider',
      keyboard: true,
      ariaNotes: ['Use role="slider" with aria-valuemin / aria-valuemax / aria-valuenow', 'Provide an accessible label via aria-label', 'Arrow keys adjust the value'],
    },
    usage: {
      do: ['Use for adjustable numeric ranges', 'Show the current value for precision', 'Provide a clear label'],
      dont: ['Do not use for exact numeric entry — use Text Input instead', 'Do not use without min/max bounds'],
    },
    specYaml: `component: Slider
purpose: "Select a numeric value from a continuous range."
variants:
  State: [Default, Focused, Disabled]
defaults: { State: Default, Min: 0, Max: 100, Step: 1, ShowValue: true }
layout: { trackHeight: 4, thumbSize: 20, gap: 8, radius: pill }
styling: { track: "var(--gray-300)", fill: "#004080", thumb: "#FFFFFF" }
accessibility: { role: slider, keyboard: true }`,
  },

  'segmented-control': {
    slug: 'segmented-control',
    name: 'Segmented Control',
    category: 'input-controls',
    purpose: 'Choose one option from a small set of mutually exclusive segments.',
    status: 'ready',
    deprecatedAliases: ['Segment control', 'Toggle group', 'Button group'],
    props: [
      { name: 'Items', values: 'string[]', default: "['Day','Week','Month']", description: 'Segment labels.' },
      { name: 'Value', values: 'number', default: '0', description: 'Active segment index.' },
      { name: 'Size', values: 'Small | Medium', default: 'Medium', description: 'Segment height.' },
      { name: 'FullWidth', values: 'true | false', default: 'false', description: 'Stretch to fill the row.' },
    ],
    tokens: ['track var(--gray-100)', 'active var(--surface)', 'shadow.100 (active)', 'radius.md / radius.sm', 'primary.main (active text)'],
    accessibility: {
      role: 'radiogroup',
      keyboard: true,
      ariaNotes: ['Container uses role="radiogroup"', 'Each segment uses role="radio" with aria-checked', 'Arrow keys move between segments'],
    },
    usage: {
      do: ['Use for 2–4 mutually exclusive views', 'Keep labels short and parallel', 'Show the active segment clearly'],
      dont: ['Do not use for more than 4 options — use Tabs or Select', 'Do not use for multi-select'],
    },
    specYaml: `component: Segmented Control
purpose: "Choose one option from a small set of mutually exclusive segments."
variants:
  Size: [Small, Medium]
  FullWidth: [true, false]
defaults: { Size: Medium, FullWidth: false, Value: 0 }
layout: { height: 40, padding: 4, gap: 2, radius: md, segmentRadius: sm }
styling: { track: "var(--gray-100)", active: "var(--surface)", shadow: "shadow.100" }
accessibility: { role: radiogroup, keyboard: true }`,
  },

  'date-picker': {
    slug: 'date-picker',
    name: 'Date Picker',
    category: 'input-controls',
    purpose: 'Select a calendar date from a popover.',
    status: 'ready',
    deprecatedAliases: ['Calendar input', 'Date field'],
    props: [
      { name: 'State', values: 'Default | Focused | Disabled | Error', default: 'Default', description: 'Interaction / validation state.' },
      { name: 'Value', values: 'ISO date string', description: 'Selected date (YYYY-MM-DD).' },
      { name: 'Placeholder', values: 'string', default: 'Select date', description: 'Trigger placeholder.' },
      { name: 'ShowLabel', values: 'true | false', default: 'true', description: 'Show the field label.' },
      { name: 'DefaultOpen', values: 'true | false', default: 'false', description: 'Open the calendar initially.' },
    ],
    tokens: ['border #C4C4C4', 'radius.md', 'surface (popover)', 'shadow.200 (popover)', 'primary.main (selected day)'],
    accessibility: {
      role: 'dialog',
      keyboard: true,
      ariaNotes: ['Trigger uses aria-haspopup="dialog" and aria-expanded', 'Popover uses role="dialog" with a label', 'Day cells are buttons with descriptive aria-labels', 'Escape closes the popover'],
    },
    usage: {
      do: ['Use for selecting a single calendar date', 'Highlight today and the selected day', 'Provide clear month navigation'],
      dont: ['Do not use for free-form date typing without validation', 'Do not trap keyboard focus without an escape'],
    },
    specYaml: `component: Date Picker
purpose: "Select a calendar date from a popover."
variants:
  State: [Default, Focused, Disabled, Error]
defaults: { State: Default, DefaultOpen: false }
layout: { triggerHeight: 40, paddingX: 12, popoverPadding: 12, radius: md }
styling: { border: "#C4C4C4", popover: "var(--surface)", shadow: "shadow.200", selected: "#004080" }
accessibility: { role: dialog, keyboard: true }`,
  },

  'file-upload': {
    slug: 'file-upload',
    name: 'File Upload',
    category: 'input-controls',
    purpose: 'Upload files via drag-and-drop or browse.',
    status: 'ready',
    deprecatedAliases: ['Dropzone', 'File dropzone', 'Uploader'],
    props: [
      { name: 'State', values: 'Default | Dragging | Disabled | Error', default: 'Default', description: 'Interaction / validation state.' },
      { name: 'Accept', values: 'string', description: 'Accepted MIME types / extensions.' },
      { name: 'Multiple', values: 'true | false', default: 'false', description: 'Allow multiple files.' },
      { name: 'HelpText', values: 'string', default: 'PNG, JPG or PDF up to 10MB', description: 'Constraint hint text.' },
    ],
    tokens: ['dashed border var(--gray-400)', 'primary.main + var(--blue-100) (dragging)', 'error.main (error)', 'radius.md', 'surface'],
    accessibility: {
      role: 'button',
      keyboard: true,
      ariaNotes: ['Dropzone uses role="button" and is keyboard focusable', 'Enter / Space open the file browser', 'Provide an accessible label describing the action'],
    },
    usage: {
      do: ['Support both drag-and-drop and click-to-browse', 'State accepted file types and size limits', 'Give visible drag feedback'],
      dont: ['Do not hide the browse affordance', 'Do not omit constraint help text'],
    },
    specYaml: `component: File Upload
purpose: "Upload files via drag-and-drop or browse."
variants:
  State: [Default, Dragging, Disabled, Error]
  Multiple: [true, false]
defaults: { State: Default, Multiple: false }
layout: { paddingX: 24, paddingY: 32, gap: 8, radius: md, borderStyle: dashed }
styling: { border: "var(--gray-400)", dragging: "var(--blue-100)", error: "#D32F2F" }
accessibility: { role: button, keyboard: true }`,
  },

  'radio-group': {
    slug: 'radio-group',
    name: 'Radio Group',
    category: 'input-controls',
    purpose: 'Group mutually exclusive radio options.',
    status: 'ready',
    deprecatedAliases: ['Radio list', 'Option group'],
    props: [
      { name: 'State', values: 'Default | Disabled | Error', default: 'Default', description: 'Group interaction / validation state.' },
      { name: 'Options', values: '{ label, value }[]', description: 'Radio options.' },
      { name: 'Orientation', values: 'Vertical | Horizontal', default: 'Vertical', description: 'Layout direction.' },
      { name: 'Value', values: 'string', description: 'Selected option value.' },
      { name: 'Name', values: 'string', description: 'Shared input name for the group.' },
    ],
    tokens: ['border #8C8C8C', 'primary.main (selected)', 'radius.pill', 'body.mdRegular', 'spacing 24 (horizontal)'],
    accessibility: {
      role: 'radiogroup',
      keyboard: true,
      ariaNotes: ['Container uses role="radiogroup" with an accessible label', 'Each option is a radio with aria-checked', 'Arrow keys navigate between options'],
    },
    usage: {
      do: ['Use for single selection among 2–6 options', 'Provide a group label', 'Pre-select a sensible default'],
      dont: ['Do not use for multi-select — use Checkbox Group', 'Do not use a single radio alone'],
    },
    specYaml: `component: Radio Group
purpose: "Group mutually exclusive radio options."
variants:
  State: [Default, Disabled, Error]
  Orientation: [Vertical, Horizontal]
defaults: { State: Default, Orientation: Vertical }
layout: { gap: 24, radius: pill }
styling: { border: "#8C8C8C", selectedColor: "#004080" }
accessibility: { role: radiogroup, keyboard: true }`,
  },

  'checkbox-group': {
    slug: 'checkbox-group',
    name: 'Checkbox Group',
    category: 'input-controls',
    purpose: 'Group related multi-select checkboxes.',
    status: 'ready',
    deprecatedAliases: ['Checkbox list', 'Multi-select group'],
    props: [
      { name: 'State', values: 'Default | Disabled | Error', default: 'Default', description: 'Group interaction / validation state.' },
      { name: 'Options', values: '{ label, value }[]', description: 'Checkbox options.' },
      { name: 'Orientation', values: 'Vertical | Horizontal', default: 'Vertical', description: 'Layout direction.' },
      { name: 'Value', values: 'string[]', description: 'Selected option values.' },
    ],
    tokens: ['border #8C8C8C', 'primary.main (checked)', 'radius.xs', 'body.mdRegular', 'spacing 24 (horizontal)'],
    accessibility: {
      role: 'group',
      keyboard: true,
      ariaNotes: ['Container uses role="group" with aria-labelledby', 'Each option is a checkbox with aria-checked', 'Group related options under a shared legend/label'],
    },
    usage: {
      do: ['Use for selecting multiple related options', 'Provide a group label', 'Keep options parallel and concise'],
      dont: ['Do not use for mutually exclusive options — use Radio Group', 'Do not omit the group label'],
    },
    specYaml: `component: Checkbox Group
purpose: "Group related multi-select checkboxes."
variants:
  State: [Default, Disabled, Error]
  Orientation: [Vertical, Horizontal]
defaults: { State: Default, Orientation: Vertical }
layout: { gap: 24, radius: xs }
styling: { border: "#8C8C8C", checkedBackground: "#004080" }
accessibility: { role: group, keyboard: true }`,
  },

  rating: {
    slug: 'rating',
    name: 'Rating',
    category: 'input-controls',
    purpose: 'Capture or display a star rating.',
    status: 'ready',
    deprecatedAliases: ['Star rating', 'Stars'],
    props: [
      { name: 'Value', values: 'number', default: '0', description: 'Current rating.' },
      { name: 'Max', values: 'number', default: '5', description: 'Number of stars.' },
      { name: 'Size', values: 'Small | Medium', default: 'Medium', description: 'Star size.' },
      { name: 'ReadOnly', values: 'true | false', default: 'false', description: 'Display-only mode.' },
      { name: 'ShowValue', values: 'true | false', default: 'false', description: 'Show numeric value.' },
    ],
    tokens: ['warning.main #EF6C00 (filled)', 'var(--gray-400) (empty)', 'material star FILL 1 / 0', 'spacing 2/8'],
    accessibility: {
      role: 'radiogroup',
      keyboard: true,
      ariaNotes: ['Container uses role="radiogroup" with an accessible label', 'Each star is a radio with aria-checked and an aria-label', 'Arrow keys adjust the rating'],
    },
    usage: {
      do: ['Use for feedback and review scores', 'Show hover preview when interactive', 'Use read-only mode to display aggregate scores'],
      dont: ['Do not use for precise numeric input', 'Do not omit accessible labels on stars'],
    },
    specYaml: `component: Rating
purpose: "Capture or display a star rating."
variants:
  Size: [Small, Medium]
  ReadOnly: [true, false]
defaults: { Value: 0, Max: 5, Size: Medium, ReadOnly: false, ShowValue: false }
layout: { gap: 2 }
styling: { filled: "#EF6C00", empty: "var(--gray-400)" }
accessibility: { role: radiogroup, keyboard: true }`,
  },

  'otp-input': {
    slug: 'otp-input',
    name: 'OTP Input',
    category: 'input-controls',
    purpose: 'Enter a one-time verification code.',
    status: 'ready',
    deprecatedAliases: ['PIN input', 'Verification code', 'Code input'],
    props: [
      { name: 'State', values: 'Default | Focused | Error | Disabled', default: 'Default', description: 'Interaction / validation state.' },
      { name: 'Length', values: 'number', default: '6', description: 'Number of digit boxes.' },
      { name: 'Value', values: 'string', description: 'Current code value.' },
    ],
    tokens: ['border #C4C4C4', 'error.main (error)', 'radius.md', 'box 44x48', 'font-mono'],
    accessibility: {
      role: 'textbox',
      keyboard: true,
      ariaNotes: ['Each box has an aria-label "Digit N"', 'aria-invalid reflects the error state', 'Backspace moves focus to the previous box; paste distributes digits'],
    },
    usage: {
      do: ['Auto-advance focus as digits are entered', 'Support paste of the full code', 'Use a monospace font for even alignment'],
      dont: ['Do not require manual box-by-box focus', 'Do not allow non-numeric characters'],
    },
    specYaml: `component: OTP Input
purpose: "Enter a one-time verification code."
variants:
  State: [Default, Focused, Error, Disabled]
defaults: { State: Default, Length: 6 }
layout: { boxWidth: 44, boxHeight: 48, gap: 8, radius: md }
styling: { border: "#C4C4C4", error: "#D32F2F", font: "var(--font-mono)" }
accessibility: { role: textbox, keyboard: true }`,
  },

  table: {
    slug: 'table',
    name: 'Table',
    category: 'data-display',
    purpose: 'Display structured data in rows and columns.',
    status: 'ready',
    deprecatedAliases: ['Data table', 'Grid', 'Datagrid'],
    props: [
      { name: 'columns', values: '{ key, header, align?, width? }[]', description: 'Column definitions.' },
      { name: 'rows', values: 'Record<string, ReactNode>[]', description: 'Row data keyed by column.' },
      { name: 'size', values: 'Compact | Default', default: 'Default', description: 'Row height density.' },
      { name: 'striped', values: 'true | false', default: 'false', description: 'Zebra-stripe rows.' },
      { name: 'hoverable', values: 'true | false', default: 'true', description: 'Highlight rows on hover.' },
      { name: 'selectable', values: 'true | false', default: 'false', description: 'Add a row selection column.' },
    ],
    tokens: ['header var(--gray-100)', 'border var(--border)', 'body.mdRegular', 'gray-700 (header text)', 'action-hover (row hover)'],
    accessibility: {
      role: 'table',
      keyboard: true,
      ariaNotes: ['Use semantic table / thead / tbody markup', 'Header cells use scope="col"', 'Provide a caption or aria-label describing the table'],
    },
    usage: {
      do: ['Use for comparable, structured records', 'Right-align numeric columns', 'Keep headers concise'],
      dont: ['Do not use tables for page layout', 'Do not overload rows with unrelated actions'],
    },
    specYaml: `component: Table
purpose: "Display structured data in rows and columns."
variants:
  size: [Compact, Default]
  striped: [true, false]
  hoverable: [true, false]
  selectable: [true, false]
defaults: { size: Default, striped: false, hoverable: true, selectable: false }
layout: { rowHeight: { Compact: 40, Default: 52 }, paddingX: 12 }
styling: { header: "var(--gray-100)", border: "var(--border)", rowHover: "var(--action-hover)" }
accessibility: { role: table, keyboard: true }`,
  },

  accordion: {
    slug: 'accordion',
    name: 'Accordion',
    category: 'data-display',
    purpose: 'Show and hide sections of related content.',
    status: 'ready',
    deprecatedAliases: ['Disclosure', 'Collapse', 'Expander'],
    props: [
      { name: 'items', values: '{ title, content }[]', description: 'Accordion sections.' },
      { name: 'type', values: 'Single | Multiple', default: 'Single', description: 'Allow one or many open at once.' },
      { name: 'defaultOpenIndex', values: 'number', default: '0', description: 'Initially open section.' },
      { name: 'iconPosition', values: 'Left | Right', default: 'Right', description: 'Chevron placement.' },
    ],
    tokens: ['border var(--border)', 'body.mdMedium (title)', 'radius.md', 'action-hover (header hover)', 'chevron expand_more'],
    accessibility: {
      role: 'region',
      keyboard: true,
      ariaNotes: ['Header is a button with aria-expanded and aria-controls', 'Panel uses role="region" linked via aria-labelledby', 'Enter / Space toggle the section'],
    },
    usage: {
      do: ['Use to progressively disclose content', 'Keep section titles scannable', 'Use Single mode when only one section is relevant at a time'],
      dont: ['Do not nest accordions deeply', 'Do not hide critical content behind collapsed sections'],
    },
    specYaml: `component: Accordion
purpose: "Show and hide sections of related content."
variants:
  type: [Single, Multiple]
  iconPosition: [Left, Right]
defaults: { type: Single, defaultOpenIndex: 0, iconPosition: Right }
layout: { paddingX: 16, paddingY: 14, radius: md }
styling: { border: "var(--border)", headerHover: "var(--action-hover)" }
accessibility: { role: region, keyboard: true }`,
  },

  tag: {
    slug: 'tag',
    name: 'Tag',
    category: 'data-display',
    purpose: 'Label, categorize, or filter with a removable chip.',
    status: 'ready',
    deprecatedAliases: ['Chip', 'Pill', 'Label'],
    props: [
      { name: 'label', values: 'string', description: 'Tag text.' },
      { name: 'intent', values: 'Neutral | Info | Success | Warning | Error', default: 'Neutral', description: 'Semantic color.' },
      { name: 'size', values: 'Small | Medium', default: 'Medium', description: 'Tag height.' },
      { name: 'removable', values: 'true | false', default: 'false', description: 'Show a remove affordance.' },
      { name: 'leadingIcon', values: 'string', description: 'Optional leading icon.' },
    ],
    tokens: ['radius.pill', 'body.caption', 'intentMap backgrounds', 'spacing 4/8', 'close icon'],
    accessibility: {
      role: 'status',
      keyboard: true,
      ariaNotes: ['Removable tags expose a button with aria-label "Remove {label}"', 'Interactive tags must be keyboard focusable', 'Use aria-label for icon-only tags'],
    },
    usage: {
      do: ['Use for filters, categories, and selections', 'Keep labels to 1–2 words', 'Provide a remove control when tags are dismissible'],
      dont: ['Do not use for status that never changes — use Badge', 'Do not pack long text into a tag'],
    },
    specYaml: `component: Tag
purpose: "Label, categorize, or filter with a removable chip."
variants:
  intent: [Neutral, Info, Success, Warning, Error]
  size: [Small, Medium]
  removable: [true, false]
defaults: { intent: Neutral, size: Medium, removable: false }
layout: { height: 24, paddingX: 8, paddingY: 4, gap: 4, radius: pill }
intentMap:
  Neutral: { background: "#F0F0F0", text: "#272727" }
  Info:    { background: "#E1F5FE", text: "#0288D1" }
  Success: { background: "#E8F5E9", text: "#2E7D32" }
  Warning: { background: "#FFF3E0", text: "#EF6C00" }
  Error:   { background: "#FFEBEE", text: "#D32F2F" }
accessibility: { role: status, keyboard: true }`,
  },

  divider: {
    slug: 'divider',
    name: 'Divider',
    category: 'data-display',
    purpose: 'Separate content with a thin rule.',
    status: 'ready',
    deprecatedAliases: ['Separator', 'Rule', 'HR'],
    props: [
      { name: 'orientation', values: 'Horizontal | Vertical', default: 'Horizontal', description: 'Divider direction.' },
      { name: 'label', values: 'string', description: 'Optional centered label (horizontal only).' },
      { name: 'spacing', values: 'Compact | Default | Spacious', default: 'Default', description: 'Surrounding margin.' },
    ],
    tokens: ['border var(--border)', 'body.caption (label)', 'muted-foreground (label)', 'spacing 8/16/24'],
    accessibility: {
      role: 'separator',
      keyboard: false,
      ariaNotes: ['Use role="separator" with aria-orientation', 'Purely decorative dividers may be aria-hidden'],
    },
    usage: {
      do: ['Use to group and separate related content', 'Use a labeled divider to introduce a section', 'Keep dividers hairline-thin'],
      dont: ['Do not overuse dividers where whitespace suffices', 'Do not use heavy rules'],
    },
    specYaml: `component: Divider
purpose: "Separate content with a thin rule."
variants:
  orientation: [Horizontal, Vertical]
  spacing: [Compact, Default, Spacious]
defaults: { orientation: Horizontal, spacing: Default }
layout: { thickness: 1, spacing: { Compact: 8, Default: 16, Spacious: 24 } }
styling: { line: "var(--border)", label: "var(--muted-foreground)" }
accessibility: { role: separator }`,
  },

  'empty-state': {
    slug: 'empty-state',
    name: 'Empty State',
    category: 'data-display',
    purpose: 'Communicate the absence of content and offer a next step.',
    status: 'ready',
    deprecatedAliases: ['Blank slate', 'Zero state', 'No data'],
    props: [
      { name: 'icon', values: 'string', default: 'inbox', description: 'Material Symbols icon name.' },
      { name: 'title', values: 'string', default: 'No results found', description: 'Primary message.' },
      { name: 'description', values: 'string', description: 'Supporting explanation.' },
      { name: 'actionLabel', values: 'string', description: 'Optional primary action label.' },
      { name: 'size', values: 'Small | Medium', default: 'Medium', description: 'Overall scale.' },
    ],
    tokens: ['gray-100 (icon circle)', 'muted-foreground', 'heading.h5 (title)', 'body.mdRegular (description)', 'spacing 12/16'],
    accessibility: {
      role: 'status',
      keyboard: true,
      ariaNotes: ['Announce dynamically-appearing empty states with role="status"', 'The action must be a real focusable button', 'The illustration/icon is decorative (aria-hidden)'],
    },
    usage: {
      do: ['Explain why the area is empty', 'Offer a clear next action when possible', 'Keep the tone helpful'],
      dont: ['Do not leave empty areas blank with no guidance', 'Do not use for transient loading — use Skeleton'],
    },
    specYaml: `component: Empty State
purpose: "Communicate the absence of content and offer a next step."
variants:
  size: [Small, Medium]
defaults: { icon: inbox, title: "No results found", size: Medium }
layout: { gap: 12, align: center }
styling: { iconCircle: "var(--gray-100)", title: "var(--text-primary)", description: "var(--muted-foreground)" }
accessibility: { role: status, keyboard: true }`,
  },

  'avatar-group': {
    slug: 'avatar-group',
    name: 'Avatar Group',
    category: 'data-display',
    purpose: 'Show a set of users as overlapping avatars with an overflow count.',
    status: 'ready',
    deprecatedAliases: ['Avatar stack', 'Facepile'],
    props: [
      { name: 'avatars', values: '{ content?, name? }[]', description: 'Avatars to display.' },
      { name: 'max', values: 'number', default: '4', description: 'Maximum shown before overflow.' },
      { name: 'size', values: 'Small | Medium | Large', default: 'Medium', description: 'Avatar diameter.' },
    ],
    tokens: ['radius.pill', 'white ring border', 'gray-200 (overflow bg)', 'gray-700 (overflow text)', 'negative margin overlap'],
    accessibility: {
      role: 'group',
      keyboard: false,
      ariaNotes: ['Wrap in a group with an aria-label describing the set', 'Each avatar keeps its own accessible label', 'The overflow chip states the hidden count'],
    },
    usage: {
      do: ['Use for participant and collaborator lists', 'Cap visible avatars and show a +N overflow', 'Keep sizing consistent within a context'],
      dont: ['Do not show dozens of avatars inline', 'Do not omit the overflow count'],
    },
    specYaml: `component: Avatar Group
purpose: "Show a set of users as overlapping avatars with an overflow count."
variants:
  size: [Small, Medium, Large]
defaults: { max: 4, size: Medium }
layout: { overlap: -8, ring: 2 }
styling: { ring: "#FFFFFF", overflowBg: "var(--gray-200)", overflowText: "var(--gray-700)" }
accessibility: { role: group }`,
  },

  stat: {
    slug: 'stat',
    name: 'Stat',
    category: 'data-display',
    purpose: 'Highlight a key metric with an optional trend.',
    status: 'ready',
    deprecatedAliases: ['Metric', 'KPI', 'Stat card'],
    props: [
      { name: 'label', values: 'string', description: 'Metric name.' },
      { name: 'value', values: 'string | number', description: 'Metric value.' },
      { name: 'delta', values: 'string', description: 'Change indicator text.' },
      { name: 'deltaIntent', values: 'up | down | neutral', default: 'neutral', description: 'Trend direction / color.' },
      { name: 'icon', values: 'string', description: 'Optional leading icon.' },
    ],
    tokens: ['border var(--border)', 'radius.lg', 'heading.h2 (value)', 'body.caption (label)', 'success/error (delta)'],
    accessibility: {
      role: 'group',
      keyboard: false,
      ariaNotes: ['Associate the value with its label for screen readers', 'Convey trend with text, not color alone', 'Use aria-label to summarize the metric and change'],
    },
    usage: {
      do: ['Use for dashboard summaries', 'Pair a value with a clear label', 'Indicate trend direction with an icon and text'],
      dont: ['Do not rely on color alone for the delta', 'Do not crowd many stats without spacing'],
    },
    specYaml: `component: Stat
purpose: "Highlight a key metric with an optional trend."
variants:
  deltaIntent: [up, down, neutral]
defaults: { deltaIntent: neutral }
layout: { padding: 20, gap: 8, radius: lg }
styling: { border: "var(--border)", up: "#2E7D32", down: "#D32F2F", neutral: "var(--muted-foreground)" }
accessibility: { role: group }`,
  },

  list: {
    slug: 'list',
    name: 'List',
    category: 'data-display',
    purpose: 'Present a vertical series of related items.',
    status: 'ready',
    deprecatedAliases: ['List view', 'Item list'],
    props: [
      { name: 'items', values: '{ primary, secondary?, leading?, trailing? }[]', description: 'List rows.' },
      { name: 'divided', values: 'true | false', default: 'true', description: 'Show dividers between rows.' },
      { name: 'interactive', values: 'true | false', default: 'false', description: 'Make rows clickable.' },
      { name: 'size', values: 'Compact | Default', default: 'Default', description: 'Row density.' },
    ],
    tokens: ['border var(--border)', 'body.mdMedium (primary)', 'body.caption (secondary)', 'action-hover (interactive)', 'spacing 12'],
    accessibility: {
      role: 'list',
      keyboard: true,
      ariaNotes: ['Use semantic list markup (ul / li)', 'Interactive rows are buttons and keyboard focusable', 'Provide meaningful text for each item'],
    },
    usage: {
      do: ['Use for settings, results, and simple records', 'Keep primary text scannable', 'Use secondary text for supporting detail'],
      dont: ['Do not use for comparable tabular data — use Table', 'Do not make only part of a row clickable'],
    },
    specYaml: `component: List
purpose: "Present a vertical series of related items."
variants:
  divided: [true, false]
  interactive: [true, false]
  size: [Compact, Default]
defaults: { divided: true, interactive: false, size: Default }
layout: { paddingX: 12, gap: 2 }
styling: { border: "var(--border)", rowHover: "var(--action-hover)" }
accessibility: { role: list, keyboard: true }`,
  },

  progress: {
    slug: 'progress',
    name: 'Progress',
    category: 'feedback',
    purpose: 'Show completion of an ongoing task.',
    status: 'ready',
    deprecatedAliases: ['Progress bar', 'Loading bar', 'Meter'],
    props: [
      { name: 'variant', values: 'Linear | Circular', default: 'Linear', description: 'Bar or ring.' },
      { name: 'value', values: 'number (0–100)', default: '60', description: 'Completion percentage.' },
      { name: 'indeterminate', values: 'true | false', default: 'false', description: 'Unknown-duration animation.' },
      { name: 'size', values: 'Small | Medium | Large', default: 'Medium', description: 'Bar height / ring diameter.' },
      { name: 'intent', values: 'Primary | Success | Warning | Error', default: 'Primary', description: 'Fill color.' },
      { name: 'showValue', values: 'true | false', default: 'false', description: 'Render the percentage.' },
    ],
    tokens: ['track var(--gray-200)', 'primary/success/warning/error (fill)', 'radius.pill', 'keyframes inspera-indeterminate/spin'],
    accessibility: {
      role: 'progressbar',
      keyboard: false,
      ariaNotes: ['Use role="progressbar" with aria-valuenow / min / max', 'Omit aria-valuenow when indeterminate', 'Provide an accessible label for the task'],
    },
    usage: {
      do: ['Use determinate progress when completion is known', 'Use indeterminate for unknown-duration waits', 'Match intent color to context'],
      dont: ['Do not use for very short operations', 'Do not fake progress values'],
    },
    specYaml: `component: Progress
purpose: "Show completion of an ongoing task."
variants:
  variant: [Linear, Circular]
  size: [Small, Medium, Large]
  intent: [Primary, Success, Warning, Error]
  indeterminate: [true, false]
defaults: { variant: Linear, value: 60, indeterminate: false, size: Medium, intent: Primary }
layout: { linearHeight: { Small: 4, Medium: 8, Large: 12 }, circularSize: { Small: 24, Medium: 40, Large: 56 } }
styling: { track: "var(--gray-200)", fill: "#004080" }
accessibility: { role: progressbar }`,
  },

  spinner: {
    slug: 'spinner',
    name: 'Spinner',
    category: 'feedback',
    purpose: 'Indicate an indeterminate loading state.',
    status: 'ready',
    deprecatedAliases: ['Loader', 'Loading indicator', 'Activity indicator'],
    props: [
      { name: 'size', values: 'Small | Medium | Large', default: 'Medium', description: 'Diameter 16 / 24 / 40.' },
      { name: 'intent', values: 'Primary | Neutral | Inverse', default: 'Primary', description: 'Arc color.' },
      { name: 'label', values: 'string', default: 'Loading', description: 'Accessible label.' },
    ],
    tokens: ['primary.main (arc)', 'var(--gray-300) (track)', 'keyframes inspera-spin', 'inverse #FFFFFF'],
    accessibility: {
      role: 'status',
      keyboard: false,
      ariaNotes: ['Use role="status" with aria-live="polite"', 'Provide an accessible label via aria-label', 'Include visually-hidden loading text'],
    },
    usage: {
      do: ['Use for short, indeterminate waits', 'Use Inverse on dark surfaces', 'Pair with context describing what is loading'],
      dont: ['Do not use where determinate Progress is possible', 'Do not show multiple competing spinners'],
    },
    specYaml: `component: Spinner
purpose: "Indicate an indeterminate loading state."
variants:
  size: [Small, Medium, Large]
  intent: [Primary, Neutral, Inverse]
defaults: { size: Medium, intent: Primary, label: Loading }
layout: { diameter: { Small: 16, Medium: 24, Large: 40 } }
styling: { arc: "#004080", track: "var(--gray-300)", inverse: "#FFFFFF" }
accessibility: { role: status }`,
  },

  skeleton: {
    slug: 'skeleton',
    name: 'Skeleton',
    category: 'feedback',
    purpose: 'Show placeholder shapes while content loads.',
    status: 'ready',
    deprecatedAliases: ['Placeholder', 'Shimmer', 'Ghost'],
    props: [
      { name: 'variant', values: 'Text | Rect | Circle', default: 'Text', description: 'Placeholder shape.' },
      { name: 'width', values: 'string | number', description: 'Explicit width.' },
      { name: 'height', values: 'string | number', description: 'Explicit height.' },
      { name: 'lines', values: 'number', default: '1', description: 'Text lines (Text variant).' },
    ],
    tokens: ['gradient var(--gray-200)→var(--gray-100)', 'keyframes inspera-shimmer', 'radius.sm / radius.pill'],
    accessibility: {
      role: 'presentation',
      keyboard: false,
      ariaNotes: ['Skeletons are decorative and aria-hidden', 'Announce the real content once loaded', 'Mirror the layout of the content being loaded'],
    },
    usage: {
      do: ['Match skeleton shapes to real content', 'Use for perceived performance on initial load', 'Replace with content as soon as it arrives'],
      dont: ['Do not animate skeletons indefinitely', 'Do not use for user-triggered actions — use Spinner'],
    },
    specYaml: `component: Skeleton
purpose: "Show placeholder shapes while content loads."
variants:
  variant: [Text, Rect, Circle]
defaults: { variant: Text, lines: 1 }
layout: { lastLineWidth: "60%" }
styling: { gradient: "var(--gray-200) → var(--gray-100)", animation: "inspera-shimmer 1.4s ease infinite" }
accessibility: { role: presentation, ariaHidden: true }`,
  },

  popover: {
    slug: 'popover',
    name: 'Popover',
    category: 'feedback',
    purpose: 'Show interactive content anchored to a trigger.',
    status: 'ready',
    deprecatedAliases: ['Flyout', 'Overlay panel'],
    props: [
      { name: 'trigger', values: 'ReactNode', description: 'Element that toggles the popover.' },
      { name: 'title', values: 'string', description: 'Optional panel heading.' },
      { name: 'content', values: 'ReactNode', description: 'Popover body content.' },
      { name: 'placement', values: 'Top | Bottom | Left | Right', default: 'Bottom', description: 'Position relative to the trigger.' },
      { name: 'defaultOpen', values: 'true | false', default: 'false', description: 'Open on mount.' },
    ],
    tokens: ['surface', 'shadow.300', 'border var(--border)', 'radius.md', 'maxWidth 280'],
    accessibility: {
      role: 'dialog',
      keyboard: true,
      ariaNotes: ['Trigger uses aria-haspopup and aria-expanded', 'Panel uses role="dialog"', 'Escape and outside-click close the popover', 'May contain interactive content (unlike Tooltip)'],
    },
    usage: {
      do: ['Use for rich, interactive overflow content', 'Anchor to the triggering element', 'Allow dismissal via Escape and outside click'],
      dont: ['Do not use for simple hover hints — use Tooltip', 'Do not stack popovers'],
    },
    specYaml: `component: Popover
purpose: "Show interactive content anchored to a trigger."
variants:
  placement: [Top, Bottom, Left, Right]
defaults: { placement: Bottom, defaultOpen: false }
layout: { padding: 16, maxWidth: 280, radius: md }
styling: { surface: "var(--surface)", shadow: "shadow.300", border: "var(--border)" }
accessibility: { role: dialog, keyboard: true }`,
  },

  drawer: {
    slug: 'drawer',
    name: 'Drawer',
    category: 'feedback',
    purpose: 'Slide a panel in from the edge of the screen.',
    status: 'ready',
    deprecatedAliases: ['Sheet', 'Side panel', 'Off-canvas'],
    props: [
      { name: 'open', values: 'true | false', default: 'false', description: 'Visibility.' },
      { name: 'side', values: 'Right | Left | Bottom', default: 'Right', description: 'Edge it slides from.' },
      { name: 'size', values: 'Small | Medium | Large', default: 'Medium', description: 'Panel width / height.' },
      { name: 'title', values: 'string', default: 'Panel', description: 'Header title.' },
      { name: 'hasCloseButton', values: 'true | false', default: 'true', description: 'Show the close affordance.' },
    ],
    tokens: ['surface', 'shadow.500', 'scrim rgba(39,39,39,0.48)', 'heading.h4 (title)', 'spacing 16/24'],
    accessibility: {
      role: 'dialog',
      keyboard: true,
      ariaNotes: ['Use role="dialog" with aria-modal="true"', 'Set aria-labelledby to the drawer title', 'Trap focus while open and restore it on close', 'Escape closes the drawer'],
    },
    usage: {
      do: ['Use for secondary tasks and detail panels', 'Provide a clear close control', 'Return focus to the trigger on close'],
      dont: ['Do not use for critical confirmations — use Dialog', 'Do not open multiple drawers at once'],
    },
    specYaml: `component: Drawer
purpose: "Slide a panel in from the edge of the screen."
variants:
  side: [Right, Left, Bottom]
  size: [Small, Medium, Large]
  hasCloseButton: [true, false]
defaults: { open: false, side: Right, size: Medium, hasCloseButton: true }
layout: { width: { Small: 320, Medium: 400, Large: 560 }, paddingX: 24, paddingY: 20 }
styling: { surface: "var(--surface)", shadow: "shadow.500", scrim: "rgba(39,39,39,0.48)" }
accessibility: { role: dialog, ariaModal: true, keyboard: true }`,
  },

  pagination: {
    slug: 'pagination',
    name: 'Pagination',
    category: 'navigation',
    purpose: 'Navigate between pages of content.',
    status: 'ready',
    deprecatedAliases: ['Pager', 'Page navigation'],
    props: [
      { name: 'page', values: 'number', default: '1', description: 'Current page (1-based).' },
      { name: 'pageCount', values: 'number', default: '10', description: 'Total number of pages.' },
      { name: 'siblingCount', values: 'number', default: '1', description: 'Pages shown either side of current.' },
      { name: 'size', values: 'Small | Medium', default: 'Medium', description: 'Control height.' },
      { name: 'showEdges', values: 'true | false', default: 'true', description: 'Show first / last controls.' },
    ],
    tokens: ['primary.main (current)', 'action-hover', 'radius.sm', 'body.mdMedium', 'chevron_left / chevron_right'],
    accessibility: {
      role: 'navigation',
      keyboard: true,
      ariaNotes: ['Wrap in nav with aria-label="Pagination"', 'Mark the current page with aria-current="page"', 'Disable and aria-disable prev/next at the bounds'],
    },
    usage: {
      do: ['Use for long, paged result sets', 'Show current, first, and last pages', 'Collapse large gaps with an ellipsis'],
      dont: ['Do not use for a handful of items', 'Do not hide the current page indicator'],
    },
    specYaml: `component: Pagination
purpose: "Navigate between pages of content."
variants:
  size: [Small, Medium]
  showEdges: [true, false]
defaults: { page: 1, pageCount: 10, siblingCount: 1, size: Medium, showEdges: true }
layout: { itemSize: { Small: 32, Medium: 40 }, gap: 4, radius: sm }
styling: { current: "#004080", hover: "var(--action-hover)" }
accessibility: { role: navigation, keyboard: true }`,
  },

  menu: {
    slug: 'menu',
    name: 'Menu',
    category: 'navigation',
    purpose: 'Present a list of actions in a dropdown.',
    status: 'ready',
    deprecatedAliases: ['Dropdown menu', 'Action menu', 'Context menu', 'Overflow menu'],
    props: [
      { name: 'label', values: 'string', default: 'Actions', description: 'Trigger label.' },
      { name: 'items', values: '{ label, icon?, danger?, disabled?, divider? }[]', description: 'Menu items.' },
      { name: 'placement', values: 'Bottom Start | Bottom End', default: 'Bottom Start', description: 'Alignment to trigger.' },
      { name: 'defaultOpen', values: 'true | false', default: 'false', description: 'Open on mount.' },
    ],
    tokens: ['surface', 'shadow.200', 'border var(--border)', 'radius.md', 'error.main (danger item)', 'action-hover'],
    accessibility: {
      role: 'menu',
      keyboard: true,
      ariaNotes: ['Trigger uses aria-haspopup="menu" and aria-expanded', 'Items use role="menuitem"', 'Arrow keys move, Enter selects, Escape closes', 'Outside click closes the menu'],
    },
    usage: {
      do: ['Use for grouped actions and overflow', 'Separate destructive actions with a divider', 'Keep item labels action-oriented'],
      dont: ['Do not use for selecting a value — use Select', 'Do not nest menus more than one level'],
    },
    specYaml: `component: Menu
purpose: "Present a list of actions in a dropdown."
variants:
  placement: ["Bottom Start", "Bottom End"]
defaults: { label: Actions, placement: "Bottom Start", defaultOpen: false }
layout: { minWidth: 180, paddingY: 4, itemHeight: 40, radius: md }
styling: { surface: "var(--surface)", shadow: "shadow.200", danger: "#D32F2F", hover: "var(--action-hover)" }
accessibility: { role: menu, keyboard: true }`,
  },

  stepper: {
    slug: 'stepper',
    name: 'Stepper',
    category: 'navigation',
    purpose: 'Show progress through a sequence of steps.',
    status: 'ready',
    deprecatedAliases: ['Wizard', 'Progress steps', 'Step indicator'],
    props: [
      { name: 'steps', values: '{ label, description? }[]', description: 'Ordered steps.' },
      { name: 'activeStep', values: 'number', default: '1', description: 'Zero-based current step.' },
      { name: 'orientation', values: 'Horizontal | Vertical', default: 'Horizontal', description: 'Layout direction.' },
      { name: 'size', values: 'Small | Medium', default: 'Medium', description: 'Indicator size.' },
    ],
    tokens: ['primary.main (active/complete)', 'border-strong (upcoming)', 'connector var(--border)', 'check icon', 'primary.focusRing'],
    accessibility: {
      role: 'list',
      keyboard: false,
      ariaNotes: ['Use an ordered list for step semantics', 'Mark the current step with aria-current="step"', 'Convey completion with an icon, not color alone'],
    },
    usage: {
      do: ['Use for multi-step flows and wizards', 'Show completed, current, and upcoming states', 'Keep step labels short'],
      dont: ['Do not use for non-sequential navigation — use Tabs', 'Do not exceed a handful of steps'],
    },
    specYaml: `component: Stepper
purpose: "Show progress through a sequence of steps."
variants:
  orientation: [Horizontal, Vertical]
  size: [Small, Medium]
defaults: { activeStep: 1, orientation: Horizontal, size: Medium }
layout: { circle: { Small: 24, Medium: 32 }, connector: 2 }
styling: { active: "#004080", upcoming: "var(--border-strong)", connector: "var(--border)" }
accessibility: { role: list }`,
  },

  link: {
    slug: 'link',
    name: 'Link',
    category: 'navigation',
    purpose: 'Navigate to another location or resource.',
    status: 'ready',
    deprecatedAliases: ['Hyperlink', 'Text link', 'Anchor'],
    props: [
      { name: 'intent', values: 'Default | Muted', default: 'Default', description: 'Color emphasis.' },
      { name: 'size', values: 'Small | Medium', default: 'Medium', description: 'Text size.' },
      { name: 'underline', values: 'Always | Hover | None', default: 'Hover', description: 'Underline behavior.' },
      { name: 'external', values: 'true | false', default: 'false', description: 'Open in a new tab with an icon.' },
      { name: 'disabled', values: 'true | false', default: 'false', description: 'Non-interactive state.' },
    ],
    tokens: ['primary.main (default)', 'gray-600 (muted)', 'action-disabled', 'primary.focusRing', 'open_in_new (external)'],
    accessibility: {
      role: 'link',
      keyboard: true,
      ariaNotes: ['Use a real anchor with a valid href', 'External links set target="_blank" and rel="noreferrer"', 'Disabled links set aria-disabled and prevent navigation', 'Focus ring is visible on keyboard focus'],
    },
    usage: {
      do: ['Use for navigation, not actions', 'Signal external links with an icon', 'Keep link text descriptive'],
      dont: ['Do not use links to trigger actions — use Button', 'Do not use "click here" as link text'],
    },
    specYaml: `component: Link
purpose: "Navigate to another location or resource."
variants:
  intent: [Default, Muted]
  size: [Small, Medium]
  underline: [Always, Hover, None]
  external: [true, false]
  disabled: [true, false]
defaults: { intent: Default, size: Medium, underline: Hover, external: false, disabled: false }
styling: { default: "#004080", muted: "var(--gray-600)", disabled: "var(--action-disabled)" }
accessibility: { role: link, keyboard: true }`,
  },
}

export const componentList = Object.values(components)
