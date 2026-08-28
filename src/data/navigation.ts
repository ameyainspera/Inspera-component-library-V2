import type { NavGroup } from './types'

// Sidebar grouping for the reference site. The four canonical categories
// hold every component in the library.
export const navigation: NavGroup[] = [
  {
    label: 'Input Controls',
    category: 'input-controls',
    items: [
      { slug: 'button', name: 'Button', status: 'ready' },
      { slug: 'text-input', name: 'Text Input', status: 'ready' },
      { slug: 'textarea', name: 'Textarea', status: 'ready' },
      { slug: 'checkbox', name: 'Checkbox', status: 'ready' },
      { slug: 'checkbox-group', name: 'Checkbox Group', status: 'ready' },
      { slug: 'radio-button', name: 'Radio Button', status: 'ready' },
      { slug: 'radio-group', name: 'Radio Group', status: 'ready' },
      { slug: 'select', name: 'Select', status: 'ready' },
      { slug: 'toggle', name: 'Toggle', status: 'ready' },
      { slug: 'segmented-control', name: 'Segmented Control', status: 'ready' },
      { slug: 'slider', name: 'Slider', status: 'ready' },
      { slug: 'rating', name: 'Rating', status: 'ready' },
      { slug: 'date-picker', name: 'Date Picker', status: 'ready' },
      { slug: 'file-upload', name: 'File Upload', status: 'ready' },
      { slug: 'otp-input', name: 'OTP Input', status: 'ready' },
      { slug: 'form-field', name: 'Form Field', status: 'ready' },
    ],
  },
  {
    label: 'Data Display',
    category: 'data-display',
    items: [
      { slug: 'card', name: 'Card', status: 'ready' },
      { slug: 'table', name: 'Table', status: 'ready' },
      { slug: 'list', name: 'List', status: 'ready' },
      { slug: 'accordion', name: 'Accordion', status: 'ready' },
      { slug: 'badge', name: 'Badge', status: 'ready' },
      { slug: 'tag', name: 'Tag', status: 'ready' },
      { slug: 'avatar', name: 'Avatar', status: 'ready' },
      { slug: 'avatar-group', name: 'Avatar Group', status: 'ready' },
      { slug: 'stat', name: 'Stat', status: 'ready' },
      { slug: 'divider', name: 'Divider', status: 'ready' },
      { slug: 'empty-state', name: 'Empty State', status: 'ready' },
    ],
  },
  {
    label: 'Feedback',
    category: 'feedback',
    items: [
      { slug: 'alert', name: 'Alert', status: 'ready' },
      { slug: 'dialog', name: 'Dialog', status: 'ready' },
      { slug: 'drawer', name: 'Drawer', status: 'ready' },
      { slug: 'popover', name: 'Popover', status: 'ready' },
      { slug: 'snackbar', name: 'Snackbar', status: 'ready' },
      { slug: 'tooltip', name: 'Tooltip', status: 'ready' },
      { slug: 'progress', name: 'Progress', status: 'ready' },
      { slug: 'spinner', name: 'Spinner', status: 'ready' },
      { slug: 'skeleton', name: 'Skeleton', status: 'ready' },
    ],
  },
  {
    label: 'Navigation',
    category: 'navigation',
    items: [
      { slug: 'tabs', name: 'Tabs', status: 'ready' },
      { slug: 'breadcrumb', name: 'Breadcrumb', status: 'ready' },
      { slug: 'pagination', name: 'Pagination', status: 'ready' },
      { slug: 'menu', name: 'Menu', status: 'ready' },
      { slug: 'stepper', name: 'Stepper', status: 'ready' },
      { slug: 'link', name: 'Link', status: 'ready' },
    ],
  },
]
