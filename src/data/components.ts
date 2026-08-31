import type { ComponentSpec } from './types'

// SOURCE OF TRUTH for what each component *means*: purpose, accessibility
// contract, do/dont guidance, and legacy alias names.
//
// Prop APIs are NOT defined here — they are derived from the TypeScript
// interfaces in src/components/inspera/*.tsx by scripts/build-portable.ts.

export const components: Record<string, ComponentSpec> = {
  button: {
    slug: 'button',
    name: 'Button',
    category: 'input-controls',
    purpose: 'Trigger an action.',
    keywords: ['cta', 'action', 'submit', 'click', 'primary'],
    status: 'ready',
    deprecatedAliases: [
      'Primary button', 'Secondary button', 'Outline button', 'Text button',
      'Success button', 'Warning button',
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
  },

  'text-input': {
    slug: 'text-input',
    name: 'Text Input',
    category: 'input-controls',
    purpose: 'Collect single-line text input.',
    keywords: ['textbox', 'field', 'input', 'form', 'entry', 'single line'],
    status: 'ready',
    deprecatedAliases: ['Text inputs', 'Content', 'Content (small)'],
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
  },

  checkbox: {
    slug: 'checkbox',
    name: 'Checkbox',
    category: 'input-controls',
    purpose: 'Allow multiple selection.',
    keywords: ['tick', 'check', 'boolean', 'multi select', 'opt in'],
    status: 'ready',
    deprecatedAliases: ['Checkbox/Unchecked', 'Checkbox/Checked', 'Checkbox with label', 'Checkbox (fill width)', 'Checkbox (Cards)'],
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
  },

  'radio-button': {
    slug: 'radio-button',
    name: 'Radio Button',
    category: 'input-controls',
    purpose: 'Allow single selection.',
    keywords: ['option', 'single select', 'choice', 'radio'],
    status: 'ready',
    deprecatedAliases: ['Radiobutton', 'Radiobuttons', 'Radio Button New-BonW', 'Radio Button New-BonY', 'Radio Button New-WonB', 'Radio Button New-YonB'],
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
  },

  select: {
    slug: 'select',
    name: 'Select',
    category: 'input-controls',
    purpose: 'Select one option from a list.',
    keywords: ['dropdown', 'drop down', 'combobox', 'picker', 'listbox', 'choose', 'options'],
    status: 'ready',
    deprecatedAliases: ['Select / Fixed width', 'Select / Content adaptable', 'Dropdown', 'Dropdown with Label'],
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
  },

  toggle: {
    slug: 'toggle',
    name: 'Toggle',
    category: 'input-controls',
    purpose: 'Switch a setting on or off instantly.',
    keywords: ['switch', 'on off', 'boolean', 'flip', 'enable'],
    status: 'ready',
    deprecatedAliases: ['Switch', 'Toggle switch'],
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
  },

  card: {
    slug: 'card',
    name: 'Card',
    category: 'data-display',
    purpose: 'Group related content in a contained surface.',
    keywords: ['panel', 'tile', 'container', 'surface', 'box'],
    status: 'ready',
    deprecatedAliases: [],
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
  },

  badge: {
    slug: 'badge',
    name: 'Badge',
    category: 'data-display',
    purpose: 'Display a short status label or count.',
    keywords: ['chip', 'count', 'label', 'status', 'pill', 'indicator'],
    status: 'ready',
    deprecatedAliases: ['Status Badge', 'Tag', 'Chip'],
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
  },

  avatar: {
    slug: 'avatar',
    name: 'Avatar',
    category: 'data-display',
    purpose: 'Represent a user or entity with an image or initials.',
    keywords: ['profile', 'user', 'photo', 'initials', 'picture'],
    status: 'ready',
    deprecatedAliases: [],
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
  },

  alert: {
    slug: 'alert',
    name: 'Alert',
    category: 'feedback',
    purpose: 'Display semantic inline feedback.',
    keywords: ['banner', 'notification', 'message', 'callout', 'warning', 'inline message'],
    status: 'ready',
    deprecatedAliases: [],
    tokens: ['radius.md', 'body.mdMedium (title)', 'intentMap', 'spacing 12/16'],
    accessibility: {
      role: 'alert',
      keyboard: true,
      ariaNotes: ['Error and Warning announce as role="alert"; Info and Success as a polite role="status" — never both on one element, since role="alert" already implies assertive', 'Close button must have aria-label="Close alert"'],
    },
    usage: {
      do: ['Use for contextual inline messages', 'Match intent to message severity', 'Keep alert text concise'],
      dont: ['Do not stack more than 2 alerts in the same area', 'Do not use alerts for permanent content'],
    },
  },

  dialog: {
    slug: 'dialog',
    name: 'Dialog',
    category: 'feedback',
    purpose: 'Present content or actions that require user attention.',
    keywords: ['modal', 'popup', 'pop up', 'confirm', 'prompt', 'overlay', 'lightbox'],
    status: 'ready',
    deprecatedAliases: ['Modal', 'Popup'],
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
  },

  snackbar: {
    slug: 'snackbar',
    name: 'Snackbar',
    category: 'feedback',
    purpose: 'Show brief, non-blocking feedback at the bottom of the screen.',
    keywords: ['toast', 'notification', 'message', 'flash', 'transient'],
    status: 'ready',
    deprecatedAliases: ['Toast', 'Notification bar'],
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
  },

  tooltip: {
    slug: 'tooltip',
    name: 'Tooltip',
    category: 'feedback',
    purpose: 'Provide contextual help on hover or focus.',
    keywords: ['hint', 'help', 'title', 'popup', 'info bubble'],
    status: 'ready',
    deprecatedAliases: ['Tooltips', 'Walkthrough', 'a11y tooltips'],
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
  },

  tabs: {
    slug: 'tabs',
    name: 'Tabs',
    category: 'navigation',
    purpose: 'Organize content into switchable panels.',
    keywords: ['tabbed', 'sections', 'switcher', 'panels'],
    status: 'ready',
    deprecatedAliases: ['Tab bar', 'Tab navigation'],
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
  },

  breadcrumb: {
    slug: 'breadcrumb',
    name: 'Breadcrumb',
    category: 'navigation',
    purpose: "Show the user's current location in a hierarchy.",
    keywords: ['path', 'trail', 'navigation', 'hierarchy', 'you are here'],
    status: 'ready',
    deprecatedAliases: ['Breadcrumbs', 'Path navigation'],
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
  },

  textarea: {
    slug: 'textarea',
    name: 'Textarea',
    category: 'input-controls',
    purpose: 'Collect multi-line text input.',
    keywords: ['multiline', 'multi line', 'notes', 'comment', 'description', 'long text'],
    status: 'ready',
    deprecatedAliases: ['Text area', 'Multiline input', 'Comment box'],
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
  },

  'form-field': {
    slug: 'form-field',
    name: 'Form Field',
    category: 'input-controls',
    purpose: 'Standardize label, control, and help/error layout around any input.',
    keywords: ['label', 'wrapper', 'field', 'help text', 'form row'],
    status: 'ready',
    deprecatedAliases: ['Field wrapper', 'Input group'],
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
  },

  slider: {
    slug: 'slider',
    name: 'Slider',
    category: 'input-controls',
    purpose: 'Select a numeric value from a continuous range.',
    keywords: ['range', 'scrubber', 'volume', 'drag', 'value'],
    status: 'ready',
    deprecatedAliases: ['Range', 'Range slider'],
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
  },

  'segmented-control': {
    slug: 'segmented-control',
    name: 'Segmented Control',
    category: 'input-controls',
    purpose: 'Choose one option from a small set of mutually exclusive segments.',
    keywords: ['switcher', 'button group', 'toggle group', 'filter'],
    status: 'ready',
    deprecatedAliases: ['Segment control', 'Toggle group', 'Button group'],
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
  },

  'date-picker': {
    slug: 'date-picker',
    name: 'Date Picker',
    category: 'input-controls',
    purpose: 'Select a calendar date from a popover.',
    keywords: ['calendar', 'date', 'day', 'schedule', 'deadline', 'due'],
    status: 'ready',
    deprecatedAliases: ['Calendar input', 'Date field'],
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
  },

  'file-upload': {
    slug: 'file-upload',
    name: 'File Upload',
    category: 'input-controls',
    purpose: 'Upload files via drag-and-drop or browse.',
    keywords: ['dropzone', 'drop zone', 'attach', 'attachment', 'browse', 'file', 'import'],
    status: 'ready',
    deprecatedAliases: ['Dropzone', 'File dropzone', 'Uploader'],
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
  },

  'radio-group': {
    slug: 'radio-group',
    name: 'Radio Group',
    category: 'input-controls',
    purpose: 'Group mutually exclusive radio options.',
    keywords: ['options', 'single choice', 'radio buttons', 'either or'],
    status: 'ready',
    deprecatedAliases: ['Radio list', 'Option group'],
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
  },

  'checkbox-group': {
    slug: 'checkbox-group',
    name: 'Checkbox Group',
    category: 'input-controls',
    purpose: 'Group related multi-select checkboxes.',
    keywords: ['checklist', 'multi select', 'options', 'multiple choice'],
    status: 'ready',
    deprecatedAliases: ['Checkbox list', 'Multi-select group'],
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
  },

  rating: {
    slug: 'rating',
    name: 'Rating',
    category: 'input-controls',
    purpose: 'Capture or display a star rating.',
    keywords: ['stars', 'score', 'review', 'feedback', 'five star'],
    status: 'ready',
    deprecatedAliases: ['Star rating', 'Stars'],
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
  },

  'otp-input': {
    slug: 'otp-input',
    name: 'OTP Input',
    exportName: 'OtpInput',
    category: 'input-controls',
    purpose: 'Enter a one-time verification code.',
    keywords: [
      'pin', 'code', 'verification', 'two factor', '2fa', 'one time password', 'passcode',
    ],
    status: 'ready',
    deprecatedAliases: ['PIN input', 'Verification code', 'Code input'],
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
  },

  table: {
    slug: 'table',
    name: 'Table',
    category: 'data-display',
    purpose: 'Display structured data in rows and columns.',
    keywords: ['grid', 'data', 'rows', 'columns', 'datagrid', 'spreadsheet'],
    status: 'ready',
    deprecatedAliases: ['Data table', 'Grid', 'Datagrid'],
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
  },

  accordion: {
    slug: 'accordion',
    name: 'Accordion',
    category: 'data-display',
    purpose: 'Show and hide sections of related content.',
    keywords: ['collapse', 'expand', 'disclosure', 'faq', 'details', 'show hide'],
    status: 'ready',
    deprecatedAliases: ['Disclosure', 'Collapse', 'Expander'],
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
  },

  tag: {
    slug: 'tag',
    name: 'Tag',
    category: 'data-display',
    purpose: 'Label, categorize, or filter with a removable chip.',
    keywords: ['chip', 'label', 'pill', 'keyword', 'category', 'token'],
    status: 'ready',
    deprecatedAliases: ['Chip', 'Pill', 'Label'],
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
  },

  divider: {
    slug: 'divider',
    name: 'Divider',
    category: 'data-display',
    purpose: 'Separate content with a thin rule.',
    keywords: ['separator', 'rule', 'hr', 'line', 'split'],
    status: 'ready',
    deprecatedAliases: ['Separator', 'Rule', 'HR'],
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
  },

  'empty-state': {
    slug: 'empty-state',
    name: 'Empty State',
    category: 'data-display',
    purpose: 'Communicate the absence of content and offer a next step.',
    keywords: ['no results', 'blank', 'placeholder', 'zero state', 'nothing here'],
    status: 'ready',
    deprecatedAliases: ['Blank slate', 'Zero state', 'No data'],
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
  },

  'avatar-group': {
    slug: 'avatar-group',
    name: 'Avatar Group',
    category: 'data-display',
    purpose: 'Show a set of users as overlapping avatars with an overflow count.',
    keywords: ['users', 'people', 'stack', 'facepile', 'team'],
    status: 'ready',
    deprecatedAliases: ['Avatar stack', 'Facepile'],
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
  },

  stat: {
    slug: 'stat',
    name: 'Stat',
    category: 'data-display',
    purpose: 'Highlight a key metric with an optional trend.',
    keywords: ['metric', 'kpi', 'number', 'figure', 'statistic', 'trend'],
    status: 'ready',
    deprecatedAliases: ['Metric', 'KPI', 'Stat card'],
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
  },

  list: {
    slug: 'list',
    name: 'List',
    category: 'data-display',
    purpose: 'Present a vertical series of related items.',
    keywords: ['items', 'rows', 'stack', 'listing'],
    status: 'ready',
    deprecatedAliases: ['List view', 'Item list'],
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
  },

  progress: {
    slug: 'progress',
    name: 'Progress',
    category: 'feedback',
    purpose: 'Show completion of an ongoing task.',
    keywords: ['loading', 'bar', 'percent', 'meter', 'completion'],
    status: 'ready',
    deprecatedAliases: ['Progress bar', 'Loading bar', 'Meter'],
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
  },

  spinner: {
    slug: 'spinner',
    name: 'Spinner',
    category: 'feedback',
    purpose: 'Indicate an indeterminate loading state.',
    keywords: ['loader', 'loading', 'busy', 'throbber', 'activity'],
    status: 'ready',
    deprecatedAliases: ['Loader', 'Loading indicator', 'Activity indicator'],
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
  },

  skeleton: {
    slug: 'skeleton',
    name: 'Skeleton',
    category: 'feedback',
    purpose: 'Show placeholder shapes while content loads.',
    keywords: ['placeholder', 'loading', 'shimmer', 'ghost', 'pending'],
    status: 'ready',
    deprecatedAliases: ['Placeholder', 'Shimmer', 'Ghost'],
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
  },

  popover: {
    slug: 'popover',
    name: 'Popover',
    category: 'feedback',
    purpose: 'Show interactive content anchored to a trigger.',
    keywords: ['flyout', 'panel', 'bubble', 'dropdown panel', 'overlay'],
    status: 'ready',
    deprecatedAliases: ['Flyout', 'Overlay panel'],
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
  },

  drawer: {
    slug: 'drawer',
    name: 'Drawer',
    category: 'feedback',
    purpose: 'Slide a panel in from the edge of the screen.',
    keywords: ['sidebar', 'side panel', 'sheet', 'slide over', 'off canvas', 'flyout'],
    status: 'ready',
    deprecatedAliases: ['Sheet', 'Side panel', 'Off-canvas'],
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
  },

  pagination: {
    slug: 'pagination',
    name: 'Pagination',
    category: 'navigation',
    purpose: 'Navigate between pages of content.',
    keywords: ['pager', 'pages', 'paging', 'next previous'],
    status: 'ready',
    deprecatedAliases: ['Pager', 'Page navigation'],
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
  },

  menu: {
    slug: 'menu',
    name: 'Menu',
    category: 'navigation',
    purpose: 'Present a list of actions in a dropdown.',
    keywords: ['dropdown', 'context menu', 'actions', 'overflow', 'kebab', 'more'],
    status: 'ready',
    deprecatedAliases: ['Dropdown menu', 'Action menu', 'Context menu', 'Overflow menu'],
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
  },

  stepper: {
    slug: 'stepper',
    name: 'Stepper',
    category: 'navigation',
    purpose: 'Show progress through a sequence of steps.',
    keywords: ['wizard', 'steps', 'flow', 'onboarding', 'multi step', 'progress steps'],
    status: 'ready',
    deprecatedAliases: ['Wizard', 'Progress steps', 'Step indicator'],
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
  },

  link: {
    slug: 'link',
    name: 'Link',
    category: 'navigation',
    purpose: 'Navigate to another location or resource.',
    keywords: ['anchor', 'href', 'hyperlink', 'navigate', 'url'],
    status: 'ready',
    deprecatedAliases: ['Hyperlink', 'Text link', 'Anchor'],
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
  },
}

export const componentList = Object.values(components)
