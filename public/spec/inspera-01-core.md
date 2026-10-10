<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera Design System - Core

> Version 1.0.0. Part 1 of 7 of the AI spec: the rules, the setup (fonts,
> icon class, tokens), the foundations, composition patterns and the done
> checklist. Every other part builds on this one.

> **`@inspera/components` is NOT published.** The package builds from this repo, but the @inspera npm scope has not been claimed, so installing it fails with a 404.
> Do not tell anyone to install it, and do not assume it resolves.
>
> Until it is published, use the AI spec: llms.txt and the per-component files. Once published, the package will be the most reliable option, but it will need registry authentication, which most AI builders cannot provide.

Follow the definitions in this document verbatim. Import paths shown per
component (`import { Button } from '@inspera/components'`) are the
canonical names for when the package ships - today, implement the component
from its spec instead.

## Where each component is specified

Component specs are in the other parts, not in this one. If you need a component
and its part is not in your context, ask for that part. Do not build the
component from memory or substitute a lookalike.

- `inspera-02-input-controls-basic.md` - Button, Text Input, Checkbox, Radio Button, Select, Toggle, Textarea, Form Field, Radio Group, Checkbox Group
- `inspera-03-input-controls-advanced.md` - Slider, Segmented Control, Date Picker, File Upload, Rating, OTP Input, Number Input, Combobox, Date Range Picker
- `inspera-04-data-display-tables.md` - Table, Data Grid, List
- `inspera-05-data-display-content.md` - Card, Badge, Avatar, Accordion, Tag, Divider, Empty State, Avatar Group, Stat
- `inspera-06-feedback.md` - Alert, Dialog, Snackbar, Toast, Command Palette, Tooltip, Progress, Spinner, Skeleton, Popover, Drawer
- `inspera-07-navigation.md` - Tabs, Breadcrumb, Pagination, Menu, Stepper, Link

## Rules

1. Do not invent design decisions. Never invent a colour, spacing value, radius, shadow, font size, weight, icon library, focus style, breakpoint, or component variant that this document defines.
2. Use a canonical component before building a lookalike. If one exists for the job, use it.
3. Never rename a canonical component or prop. A deprecated alias may be understood as input, but output must use the canonical name.
4. Consume tokens, not literals. Raw values here define what a token resolves to; application code references `var(--token)`.
5. Do not introduce another design system. No Material UI, Bootstrap, Ant, Chakra, shadcn default styling, Tailwind default palette, or Radix Themes look. Headless behaviour libraries are fine if restyled entirely to this spec.
6. No arbitrary Tailwind values where a token exists. Never `bg-[#004080]` - use the token.
7. Inter for product UI. Noto Sans Mono only for code, identifiers and technical values; Noto Serif only for long-form content.
8. Material Symbols Outlined only. Do not mix in Lucide, Heroicons, or Font Awesome.
9. Accessibility is part of the component contract, not an enhancement. Keyboard operation, visible focus, labels, roles, names, and states are required.
10. Never use colour alone to carry meaning. Pair it with text, an icon, or shape.
11. Respect `prefers-reduced-motion: reduce` - drop non-essential motion.
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

## Working with DESIGN.md

- If you also have DESIGN.md (the Inspera design guide), read it first. It decides who the screen is for, whether new UI matches the existing product or uses this library (the plane rule), the information hierarchy, the layout and the UI text.
- This document decides the tokens and how each component is built: its props, HTML and CSS.
- Where the two disagree, this document wins for a component's internals and DESIGN.md wins for screen composition. Corner radius is the exception: there, DESIGN.md wins.
- With DESIGN.md present, its order for conflicting instructions replaces the one in this document. The start-here note in the AI spec download lists the known differences between the two, and which one to follow for each.

## Setup

Paste these three blocks once, at the root of the project, before using any
component below. Without them the components inherit the host tool's fonts and
every icon renders as its own name.

**1. Fonts.** `'Inter'` (all ui text), `'Noto Sans Mono'` (code, identifiers, token values), `'Noto Serif'` (long-form or editorial content).

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Noto+Sans+Mono:wght@400;500&family=Noto+Serif:wght@400;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');
```

**2. The icon class.** Every component that shows an icon writes
`<span class="material-symbols-outlined">icon_name</span>`. That class needs
this rule, or the span shows the literal text instead of the glyph. Icon names
are lowercase with underscores (`arrow_forward`, `more_vert`); the full set is
at fonts.google.com/icons, Outlined style only.

```css
.material-symbols-outlined {
  font-weight: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  direction: ltr;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  font-feature-settings: 'liga';
  -webkit-font-feature-settings: 'liga';
  -moz-font-feature-settings: 'liga';
  user-select: none;
  font-family: 'Material Symbols Outlined';
}
```

**3. The tokens.** Every value in this document resolves through one of these.
Each component section below repeats the tokens it needs. If you paste this full
block, you can skip those repeats; it also has the spacing and type scales, which
the component blocks leave out.

```css
:root {
  /* Brand */
  --primary: #004080; /* Primary brand / interactive */

  /* Semantic */
  --error: #D32F2F;
  --warning: #EF6C00;
  --info: #0288D1;
  --success: #2E7D32;

  /* Brand accents */
  --accent-zest: #FA5101;
  --accent-berry: #89239A;
  --accent-algae: #00A788;

  /* Base */
  --white: #ffffff;

  /* Palette - gray */
  --gray-100: #F7F7F7;
  --gray-200: #EDEDED;
  --gray-300: #D9D9D9;
  --gray-400: #BCBCBC;
  --gray-500: #949494;
  --gray-600: #7A7A7A;
  --gray-700: #595959;
  --gray-800: #404040;
  --gray-900: #272727;

  /* Palette - blue */
  --blue-100: #F0F7FF;
  --blue-200: #DBEDFF;
  --blue-300: #B3D9FF;
  --blue-400: #7ABDFF;
  --blue-500: #3399FF;
  --blue-600: #007AF5;
  --blue-700: #0059B3;
  --blue-800: #004080;
  --blue-900: #002E5C;

  /* Palette - green */
  --green-100: #F2FDF8;
  --green-200: #E0FAEF;
  --green-300: #BDF4DD;
  --green-400: #8DECC5;
  --green-500: #50E2A5;
  --green-600: #1BA76D;
  --green-700: #147B50;
  --green-800: #106542;
  --green-900: #0D4F33;

  /* Palette - red */
  --red-100: #FEF1F1;
  --red-200: #FCDEDE;
  --red-300: #F9B8B8;
  --red-400: #F58484;
  --red-500: #F04242;
  --red-600: #E21212;
  --red-700: #A50D0D;
  --red-800: #760A0A;
  --red-900: #550707;

  /* Palette - yellow */
  --yellow-100: #FFFCF0;
  --yellow-200: #FFF8DC;
  --yellow-300: #FEF0B3;
  --yellow-400: #FEE67C;
  --yellow-500: #FDD835;
  --yellow-600: #F2C602;
  --yellow-700: #B19102;
  --yellow-800: #7E6701;
  --yellow-900: #5B4A01;

  /* Palette - orange */
  --orange-100: #FFFAF0;
  --orange-200: #FFF3DC;
  --orange-300: #FEE5B3;
  --orange-400: #FED27C;
  --orange-500: #FDBA35;
  --orange-600: #F2A202;
  --orange-700: #D99102;
  --orange-800: #7E5501;
  --orange-900: #5B3D01;

  /* Palette - purple */
  --purple-100: #F6F4FB;
  --purple-200: #E9E4F6;
  --purple-300: #D0C6EC;
  --purple-400: #9F88D7;
  --purple-500: #8366CC;
  --purple-600: #603DB8;
  --purple-700: #462D86;
  --purple-800: #322060;
  --purple-900: #241745;

  /* Palette - pink */
  --pink-100: #FEF1F5;
  --pink-200: #FCDFE8;
  --pink-300: #F8B9CE;
  --pink-400: #F386AB;
  --pink-500: #ED457D;
  --pink-600: #DF1659;
  --pink-700: #A21041;
  --pink-800: #740B2E;
  --pink-900: #540821;

  /* Interaction */
  --primary-hover-overlay: rgba(0, 64, 128, 0.04); /* Primary tint on hover */
  --primary-focus-ring: rgba(0, 64, 128, 0.3); /* Focus ring on primary controls */
  --action-active: rgba(0, 0, 0, 0.56); /* Icon / control glyph */
  --action-hover: rgba(0, 0, 0, 0.04); /* Neutral hover wash */
  --action-focus: rgba(0, 0, 0, 0.12); /* Neutral focus wash */
  --action-disabled: rgba(0, 0, 0, 0.38); /* Disabled foreground */

  /* Text */
  --text-primary: rgba(0, 0, 0, 0.87); /* Body and heading text */
  --text-secondary: var(--gray-700); /* Supporting and helper text. gray-700, not 600: gray-600 is 4.29:1 on white */
  --text-disabled: var(--action-disabled); /* Disabled text */
  --text-on-primary: #ffffff; /* Text on a primary-filled surface */

  /* Status */
  --info-surface: #E1F5FE;  /* Info Alert/Badge/Tag fill. Pending Figma verification */
  --success-surface: #E8F5E9; /* Success fill. Pending Figma verification */
  --warning-surface: #FFF3E0; /* Warning fill. Pending Figma verification */
  --error-surface: #FFEBEE; /* Error fill. Pending Figma verification */
  --info-text: var(--blue-800); /* Text and icons on info-surface - 9.14:1 */
  --success-text: var(--green-800); /* Text and icons on success-surface - 6.30:1 */
  --warning-text: var(--orange-800); /* Text and icons on warning-surface - 6.01:1 */
  --error-text: var(--red-700); /* Text and icons on error-surface - 6.90:1 */

  /* Controls */
  --border-control: var(--gray-600); /* Resting outline of every control: fields, checkbox, radio, toggle track, empty rating star */
  --border-control-strong: var(--gray-800); /* Field border on hover */
  --text-placeholder: var(--gray-700); /* Placeholder text - 7.00:1 on white */
  --surface-disabled: #F5F5F5;    /* Disabled control fill. Pending Figma verification */
  --surface-readonly: var(--gray-100); /* Read-only control fill */
  --surface-neutral: #F0F0F0;     /* Neutral Badge/Tag fill. Pending Figma verification */
  --avatar-surface: #E0E0E0;      /* Avatar fallback fill. Pending Figma verification */

  /* Surface */
  --background: var(--gray-100); /* App canvas */
  --surface: var(--white);     /* Raised surface (cards, panels, inputs) */
  --surface-sunken: var(--gray-100); /* Recessed surface (wells, read-only fields) */
  --border: var(--gray-200);   /* Hairline separator */
  --border-strong: var(--gray-300); /* Control outline */
  --border-interactive: var(--gray-500); /* Control outline on hover */
  --muted-foreground: var(--gray-700); /* De-emphasised label text */
  --scrim: rgba(39, 39, 39, 0.48); /* Backdrop behind Dialog, Drawer and Command Palette */

  /* Spacing */
  --space-0: 0px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* Control height */
  --control-height-sm: 32px;  /* Small - dense toolbars, table rows, actions beside small inputs */
  --control-height-md: 40px;  /* Medium - the default */
  --control-height-lg: 44px;  /* Large - one prominent call to action, touch-first screens */

  /* Radius */
  --radius-none: 0px;
  --radius-xs: 2px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-pill: 9999px;

  /* Elevation */
  --shadow-100: 0px 4px 4px rgba(39, 39, 39, 0.08), 0px 2px 4px rgba(39, 39, 39, 0.12);
  --shadow-200: 0px 8px 8px rgba(39, 39, 39, 0.08), 0px 4px 6px rgba(39, 39, 39, 0.12);
  --shadow-300: 0px 8px 16px rgba(39, 39, 39, 0.08), 0px 6px 8px rgba(39, 39, 39, 0.12);
  --shadow-400: 0px 8px 24px rgba(39, 39, 39, 0.08), 0px 6px 12px rgba(39, 39, 39, 0.12);
  --shadow-500: 0px 10px 32px rgba(39, 39, 39, 0.1), 0px 6px 14px rgba(39, 39, 39, 0.12);
  --shadow-600: 0px 12px 42px rgba(39, 39, 39, 0.12), 0px 8px 18px rgba(39, 39, 39, 0.12);

  /* Effects */
  --effect-state-focus: 0px 0px 0px 3px var(--blue-300); /* Standard input focus ring */
  --effect-state-focus-standalone: 0px 0px 0px 3px var(--blue-600); /* High-contrast standalone focus */
  --effect-state-error: 0px 0px 0px 3px var(--red-300); /* Error ring */
  --effect-state-hover-light: 0px 0px 0px 3px var(--gray-500); /* Hover outline */
  --effect-state-focus-on-dark: 0px 0px 0px 3px var(--green-300); /* Focus ring on a dark container */
  --effect-button-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.2), 0px 1px 0px rgba(0, 0, 0, 0.08); /* Standard button elevation highlight */
  --effect-button-shadow-hover: inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 2px 6px rgba(0, 64, 128, 0.24); /* Solid button under the pointer */
  --effect-button-shadow-active: inset 0 1px 2px rgba(0, 0, 0, 0.24); /* Solid button while pressed */
  --effect-thumb-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); /* Slider and toggle thumb */
  --effect-link-underline-dark: inset 0px -1px 0px var(--gray-700); /* Link underline on light ground */
  --effect-link-underline-blue: inset 0px -1px 0px var(--blue-800); /* Primary link underline */
  --effect-link-underline-light: inset 0px -1px 0px var(--white); /* Link underline on dark ground */
  --effect-invert-hack: inset 1000px 0px 0px var(--white); /* Overrides the browser autofill background on inputs */

  /* Border width */
  --border-width-default: 1px;
  --border-width-strong: 2px;

  /* Focus ring */
  --focus-ring-width: 2px;
  --focus-ring-offset: 2px;
  --focus-ring-color: var(--primary);

  /* Motion - duration */
  --duration-instant: 0ms;   /* No transition */
  --duration-fast: 100ms;    /* Hover and focus */
  --duration-normal: 200ms;  /* Menus, popovers */
  --duration-slow: 300ms;    /* Dialogs, drawers */

  /* Motion - easing */
  --easing-standard: cubic-bezier(0.2, 0, 0, 1); /* Default */
  --easing-enter: cubic-bezier(0, 0, 0.2, 1); /* Entering the screen */
  --easing-exit: cubic-bezier(0.4, 0, 1, 1); /* Leaving the screen */

  /* Layering */
  --z-base: 0;
  --z-sticky: 100;     /* Sticky headers and toolbars */
  --z-dropdown: 300;   /* Select and Menu panels. Inside a Dialog or Drawer, put the panel in the modal's overlay element, or it opens under the scrim */
  --z-popover: 400;
  --z-overlay: 500;    /* Dialog and Drawer scrim */
  --z-modal: 600;      /* Dialog and Drawer surface */
  --z-toast: 700;      /* Snackbar */
  --z-tooltip: 800;

  /* Breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1440px;

  /* Typography - family */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif; /* All UI text */
  --font-mono: 'Noto Sans Mono', ui-monospace, SFMono-Regular, monospace; /* Code, identifiers, token values */
  --font-serif: 'Noto Serif', Georgia, serif; /* Long-form or editorial content */

  /* Typography - scale */
  --default-16-regular-size: 16px;
  --default-16-regular-weight: 400;
  --default-16-regular-line-height: 1.25;
  --default-16-medium-size: 16px;
  --default-16-medium-weight: 500;
  --default-16-medium-line-height: 1.25;
  --link-16-size: 16px;
  --link-16-weight: 500;
  --link-16-line-height: 1.25;
  --regular-14-size: 14px;
  --regular-14-weight: 400;
  --regular-14-line-height: 1.4;
  --regular-18-size: 18px;
  --regular-18-weight: 400;
  --regular-18-line-height: 1.4;
  --regular-20-size: 20px;
  --regular-20-weight: 400;
  --regular-20-line-height: 1.4;
  --regular-22-size: 22px;
  --regular-22-weight: 400;
  --regular-22-line-height: 1.4;
  --regular-26-size: 26px;
  --regular-26-weight: 400;
  --regular-26-line-height: 1.4;
  --medium-14-size: 14px;
  --medium-14-weight: 500;
  --medium-14-line-height: 1.4;
  --medium-18-size: 18px;
  --medium-18-weight: 500;
  --medium-18-line-height: 1.4;
  --medium-20-size: 20px;
  --medium-20-weight: 500;
  --medium-20-line-height: 1.4;
  --medium-22-size: 22px;
  --medium-22-weight: 500;
  --medium-22-line-height: 1.4;
  --medium-26-size: 26px;
  --medium-26-weight: 500;
  --medium-26-line-height: 1.4;
  --h1-size: 28.83px;
  --h1-weight: 600;
  --h1-line-height: 1.12;
  --h2-size: 22.78px;
  --h2-weight: 500;
  --h2-line-height: 1.12;
  --h3-size: 20.25px;
  --h3-weight: 500;
  --h3-line-height: 1.12;
  --h4-size: 18px;
  --h4-weight: 500;
  --h4-line-height: 1.12;
  --h5-size: 16px;
  --h5-weight: 500;
  --h5-line-height: 1.12;
  --h6-size: 12px;
  --h6-weight: 500;
  --h6-line-height: 1.12;
  --h6-tracking: 1.6px;
  --semibold-16-size: 16px;
  --semibold-16-weight: 600;
  --semibold-16-line-height: 1.25;
  --allcaps-12-size: 12px;
  --allcaps-12-weight: 600;
  --allcaps-12-line-height: 1.12;
  --allcaps-12-tracking: 1.6px;
  --paragraph-default-size: 16px;
  --paragraph-default-weight: 400;
  --paragraph-default-line-height: 1.5;
  --paragraph-content-size: 16px;
  --paragraph-content-weight: 400;
  --paragraph-content-line-height: 1.5;
  --paragraph-captions-size: 12px;
  --paragraph-captions-weight: 400;
  --paragraph-captions-line-height: 1.2;
  --paragraph-heading-size: 20.25px;
  --paragraph-heading-weight: 500;
  --paragraph-heading-line-height: 1.12;
  --mono-16-size: 16px;
  --mono-16-weight: 400;
  --mono-16-line-height: 1.5;
  --serif-16-size: 16px;
  --serif-16-weight: 400;
  --serif-16-line-height: 1.5;
  --documentation-size: 14px;
  --documentation-weight: 300;
  --documentation-line-height: 1.4;
}

```


## Foundations

Every value below is a CSS custom property, declared in the `:root` block under
Setup. Paste that block once, then reference tokens as `var(--primary)`,
`var(--space-4)`, `var(--radius-md)`. Never hardcode a colour that is not in
this list.

### Colour - brand & semantic

| Token | CSS variable | Value | Use |
| --- | --- | --- | --- |
| `primary.main` | `var(--primary)` | #004080 | Primary brand / interactive |
| `error` | `var(--error)` | #D32F2F | Use only for its meaning (error) |
| `warning` | `var(--warning)` | #EF6C00 | Use only for its meaning (warning) |
| `info` | `var(--info)` | #0288D1 | Use only for its meaning (info) |
| `success` | `var(--success)` | #2E7D32 | Use only for its meaning (success) |
| `accent.zest` | `var(--accent-zest)` | #FA5101 | Sparingly, for accent moments |
| `accent.berry` | `var(--accent-berry)` | #89239A | Sparingly, for accent moments |
| `accent.algae` | `var(--accent-algae)` | #00A788 | Sparingly, for accent moments |

### Colour - palette

Each family runs 100 (lightest) to 900 (darkest); 100-300 are surface tints.
For text, use this shade or a darker one - the lightest that reaches 4.5:1 on
both white and the gray-100 canvas: gray 700, blue 700, green 700, red 600, yellow 800, orange 800, purple 600, pink 700.

#### gray

| Shade | CSS variable | Value |
| --- | --- | --- |
| 100 | `var(--gray-100)` | #F7F7F7 |
| 200 | `var(--gray-200)` | #EDEDED |
| 300 | `var(--gray-300)` | #D9D9D9 |
| 400 | `var(--gray-400)` | #BCBCBC |
| 500 | `var(--gray-500)` | #949494 |
| 600 | `var(--gray-600)` | #7A7A7A |
| 700 | `var(--gray-700)` | #595959 |
| 800 | `var(--gray-800)` | #404040 |
| 900 | `var(--gray-900)` | #272727 |

#### blue

| Shade | CSS variable | Value |
| --- | --- | --- |
| 100 | `var(--blue-100)` | #F0F7FF |
| 200 | `var(--blue-200)` | #DBEDFF |
| 300 | `var(--blue-300)` | #B3D9FF |
| 400 | `var(--blue-400)` | #7ABDFF |
| 500 | `var(--blue-500)` | #3399FF |
| 600 | `var(--blue-600)` | #007AF5 |
| 700 | `var(--blue-700)` | #0059B3 |
| 800 | `var(--blue-800)` | #004080 |
| 900 | `var(--blue-900)` | #002E5C |

#### green

| Shade | CSS variable | Value |
| --- | --- | --- |
| 100 | `var(--green-100)` | #F2FDF8 |
| 200 | `var(--green-200)` | #E0FAEF |
| 300 | `var(--green-300)` | #BDF4DD |
| 400 | `var(--green-400)` | #8DECC5 |
| 500 | `var(--green-500)` | #50E2A5 |
| 600 | `var(--green-600)` | #1BA76D |
| 700 | `var(--green-700)` | #147B50 |
| 800 | `var(--green-800)` | #106542 |
| 900 | `var(--green-900)` | #0D4F33 |

#### red

| Shade | CSS variable | Value |
| --- | --- | --- |
| 100 | `var(--red-100)` | #FEF1F1 |
| 200 | `var(--red-200)` | #FCDEDE |
| 300 | `var(--red-300)` | #F9B8B8 |
| 400 | `var(--red-400)` | #F58484 |
| 500 | `var(--red-500)` | #F04242 |
| 600 | `var(--red-600)` | #E21212 |
| 700 | `var(--red-700)` | #A50D0D |
| 800 | `var(--red-800)` | #760A0A |
| 900 | `var(--red-900)` | #550707 |

#### yellow

| Shade | CSS variable | Value |
| --- | --- | --- |
| 100 | `var(--yellow-100)` | #FFFCF0 |
| 200 | `var(--yellow-200)` | #FFF8DC |
| 300 | `var(--yellow-300)` | #FEF0B3 |
| 400 | `var(--yellow-400)` | #FEE67C |
| 500 | `var(--yellow-500)` | #FDD835 |
| 600 | `var(--yellow-600)` | #F2C602 |
| 700 | `var(--yellow-700)` | #B19102 |
| 800 | `var(--yellow-800)` | #7E6701 |
| 900 | `var(--yellow-900)` | #5B4A01 |

#### orange

| Shade | CSS variable | Value |
| --- | --- | --- |
| 100 | `var(--orange-100)` | #FFFAF0 |
| 200 | `var(--orange-200)` | #FFF3DC |
| 300 | `var(--orange-300)` | #FEE5B3 |
| 400 | `var(--orange-400)` | #FED27C |
| 500 | `var(--orange-500)` | #FDBA35 |
| 600 | `var(--orange-600)` | #F2A202 |
| 700 | `var(--orange-700)` | #D99102 |
| 800 | `var(--orange-800)` | #7E5501 |
| 900 | `var(--orange-900)` | #5B3D01 |

#### purple

| Shade | CSS variable | Value |
| --- | --- | --- |
| 100 | `var(--purple-100)` | #F6F4FB |
| 200 | `var(--purple-200)` | #E9E4F6 |
| 300 | `var(--purple-300)` | #D0C6EC |
| 400 | `var(--purple-400)` | #9F88D7 |
| 500 | `var(--purple-500)` | #8366CC |
| 600 | `var(--purple-600)` | #603DB8 |
| 700 | `var(--purple-700)` | #462D86 |
| 800 | `var(--purple-800)` | #322060 |
| 900 | `var(--purple-900)` | #241745 |

#### pink

| Shade | CSS variable | Value |
| --- | --- | --- |
| 100 | `var(--pink-100)` | #FEF1F5 |
| 200 | `var(--pink-200)` | #FCDFE8 |
| 300 | `var(--pink-300)` | #F8B9CE |
| 400 | `var(--pink-400)` | #F386AB |
| 500 | `var(--pink-500)` | #ED457D |
| 600 | `var(--pink-600)` | #DF1659 |
| 700 | `var(--pink-700)` | #A21041 |
| 800 | `var(--pink-800)` | #740B2E |
| 900 | `var(--pink-900)` | #540821 |

### Colour - roles

Prefer a role token over a raw palette shade wherever one exists.

**Interaction** - `var(--primary-hover-overlay)` rgba(0, 64, 128, 0.04), `var(--primary-focus-ring)` rgba(0, 64, 128, 0.3), `var(--action-active)` rgba(0, 0, 0, 0.56), `var(--action-hover)` rgba(0, 0, 0, 0.04), `var(--action-focus)` rgba(0, 0, 0, 0.12), `var(--action-disabled)` rgba(0, 0, 0, 0.38)

**Text** - `var(--text-primary)` rgba(0, 0, 0, 0.87), `var(--text-secondary)` var(--gray-700), `var(--text-disabled)` var(--action-disabled), `var(--text-on-primary)` #ffffff

**Status** - `var(--info-surface)` #E1F5FE, `var(--success-surface)` #E8F5E9, `var(--warning-surface)` #FFF3E0, `var(--error-surface)` #FFEBEE, `var(--info-text)` var(--blue-800), `var(--success-text)` var(--green-800), `var(--warning-text)` var(--orange-800), `var(--error-text)` var(--red-700)

**Controls** - `var(--border-control)` var(--gray-600), `var(--border-control-strong)` var(--gray-800), `var(--text-placeholder)` var(--gray-700), `var(--surface-disabled)` #F5F5F5, `var(--surface-readonly)` var(--gray-100), `var(--surface-neutral)` #F0F0F0, `var(--avatar-surface)` #E0E0E0

**Surface** - `var(--background)` var(--gray-100), `var(--surface)` var(--white), `var(--surface-sunken)` var(--gray-100), `var(--border)` var(--gray-200), `var(--border-strong)` var(--gray-300), `var(--border-interactive)` var(--gray-500), `var(--muted-foreground)` var(--gray-700), `var(--scrim)` rgba(39, 39, 39, 0.48)

### Typography

Inter for all UI text (weights 300, 400, 500, 600). Noto Sans Mono for
code, identifiers and token values. Noto Serif for long-form content. Material
Symbols Outlined for icons.

Every style below has a ready-made class - prefer `class="inspera-h1"` over
setting four properties by hand.

Sizes are exact, exported from Figma. Figma exports font-size only for text
styles, so a row marked *unconfirmed* has a line height or weight inferred from
the V3 spec rather than measured.

#### Default

| Style | Class | Size | Weight | Line height | Notes |
| --- | --- | --- | --- | --- | --- |
| `Default/Default 16 px/Regular` | `.inspera-default-16-regular` | 16px | 400 | 1.25 | V3 body.mdRegular - line height fixed at 20px |
| `Default/16 px/Medium` | `.inspera-default-16-medium` | 16px | 500 | 1.25 | V3 body.mdMedium - line height fixed at 20px |
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
| `Paragraph/Default` | `.inspera-paragraph-default` | 16px | 400 | 1.5 | V3 body.paragraph - 150% |
| `Paragraph/Content` | `.inspera-paragraph-content` | 16px | 400 | 1.5 | unconfirmed: lineHeight |
| `Paragraph/Captions` | `.inspera-paragraph-captions` | 12px | 400 | 1.2 | V3 body.caption - 120% |
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

Use the scale - no arbitrary pixel values.

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

### Control height

The height of a sized control. Small, Medium and Large mean these heights
wherever a control offers them.

| Token | CSS variable | Value | Use |
| --- | --- | --- | --- |
| `sm` | `var(--control-height-sm)` | 32px | Small - dense toolbars, table rows, actions beside small inputs |
| `md` | `var(--control-height-md)` | 40px | Medium - the default |
| `lg` | `var(--control-height-lg)` | 44px | Large - one prominent call to action, touch-first screens |

### Radius

Small-to-medium radii: `sm` for controls, including inputs, selects and
pickers; `md` for panels and alerts; `lg` for cards and dialogs. Pills only
for shapes that are conceptually round.

"Used by" lists the components that use each radius, read from their source.

| Token | CSS variable | Value | When to use | Used by |
| --- | --- | --- | --- | --- |
| `none` | `var(--radius-none)` | 0px | Flush edges - table cells, full-bleed surfaces, anything that meets another edge. | - |
| `xs` | `var(--radius-xs)` | 2px | The smallest indicators, where 4px would read as a visible curve. | Checkbox, CommandPalette, Link, Rating, Tabs |
| `sm` | `var(--radius-sm)` | 4px | Controls: buttons, input fields, tags, segments, menu items. | Button, Combobox, CommandPalette, DatePicker, DateRangePicker, List, Menu, NumberInput, OtpInput, Pagination, SegmentedControl, Select, Skeleton, Tabs, TextInput, Textarea, Tooltip, calendar |
| `md` | `var(--radius-md)` | 8px | Alerts and floating panels - the system default. | Accordion, Alert, Combobox, DataGrid, DatePicker, DateRangePicker, Drawer, FileUpload, List, Menu, Popover, Select, Skeleton, Snackbar, Table |
| `lg` | `var(--radius-lg)` | 12px | Large surfaces that contain other components: cards, dialogs, drawers. | Card, CommandPalette, Dialog, Stat |
| `xl` | `var(--radius-xl)` | 16px | Reserved for oversized surfaces. Nothing uses it today; prefer lg. | - |
| `pill` | `var(--radius-pill)` | fully round | Only for shapes that are conceptually round: toggles, badges, radios, avatars. | Avatar, AvatarGroup, Badge, Dialog, EmptyState, Progress, RadioButton, Skeleton, Slider, Stepper, Tag, Toggle |

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
| `state-focus` | `var(--effect-state-focus)` | `0px 0px 0px 3px var(--blue-300)` | Standard input focus ring | unconfirmed: spread |
| `state-focus-standalone` | `var(--effect-state-focus-standalone)` | `0px 0px 0px 3px var(--blue-600)` | High-contrast standalone focus | unconfirmed: spread |
| `state-error` | `var(--effect-state-error)` | `0px 0px 0px 3px var(--red-300)` | Error ring | unconfirmed: spread |
| `state-hover-light` | `var(--effect-state-hover-light)` | `0px 0px 0px 3px var(--gray-500)` | Hover outline | unconfirmed: spread |
| `state-focus-on-dark` | `var(--effect-state-focus-on-dark)` | `0px 0px 0px 3px var(--green-300)` | Focus ring on a dark container | unconfirmed: spread |
| `button-shadow` | `var(--effect-button-shadow)` | `inset 0px -1px 0px rgba(0, 0, 0, 0.2), 0px 1px 0px rgba(0, 0, 0, 0.08)` | Standard button elevation highlight |
| `button-shadow-hover` | `var(--effect-button-shadow-hover)` | `inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 2px 6px rgba(0, 64, 128, 0.24)` | Solid button under the pointer |
| `button-shadow-active` | `var(--effect-button-shadow-active)` | `inset 0 1px 2px rgba(0, 0, 0, 0.24)` | Solid button while pressed |
| `thumb-shadow` | `var(--effect-thumb-shadow)` | `0 1px 2px rgba(0, 0, 0, 0.2)` | Slider and toggle thumb |
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
| `z.dropdown` | `var(--z-dropdown)` | 300 | Select and Menu panels. Inside a Dialog or Drawer, put the panel in the modal's overlay element, or it opens under the scrim |
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
export - they say how to arrange the canonical ones. If a requested pattern is
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

- The selected item must be distinguished by more than colour - weight, a rule, or a background.
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
- Do not place the control between title and description - it breaks reading order.
- The control's accessible name must map to the setting title.
- Use a Divider only where it genuinely improves grouping.

#### Status indicator

Build from: `Badge`, `Tag`.

- Always pair the colour with a label or icon. A bare coloured dot is not a status.
- Use `Badge` for state that is read, `Tag` for something the user can remove or filter by.

#### Empty results

Build from: `EmptyState`, `Button`.

- Use `EmptyState` when a search or filter legitimately returns nothing.
- Say what happened and offer the next step - usually clearing the filters.
- A zero-result query is not an error. Do not show a failure state for it.

## Forms

- Wrap each control in `FormField` for consistent label, help, and error layout.
- One visible label per field. A placeholder is not a label.
- Show help text or an error, not both; when invalid, the error must be programmatically associated with the control.
- Use `RadioGroup` for mutually exclusive choices and `CheckboxGroup` for multi-select.
- Use `Select` for a compact choice; enable its search mode for long lists.
- Use `FileUpload` for files - never a text input styled to look like one.
- Keep required/optional wording consistent within a form.
- Never clear user input when validation fails.
- Do not make a disabled submit button the only signal that something is wrong.

## Data tables

- Right-align numeric columns; keep headers short.
- Expose sort direction programmatically, not just with an arrow glyph.
- Use `Checkbox` for row selection and show a selected count.
- Use `Skeleton` for initial load and `Spinner` for a user-triggered refresh.
- An empty dataset and a no-results-for-this-filter state are different - say which.
- Page long tables with `Pagination`.
- Do not shrink text or targets to fit more columns; prioritise columns or scroll the table.

## Which feedback component

| Scope | Use |
| --- | --- |
| A single invalid field | Error text on the field itself, via FormField |
| A section or the whole form | Alert, placed near the affected content |
| Confirming something just happened | Snackbar |
| A decision that must block progress | Dialog - only when it genuinely must block |
| A secondary task or detail panel | Drawer |
| Known-duration work | Progress |
| Unknown-duration work | Spinner |
| Initial page or table load | Skeleton |
| Nothing to show | EmptyState |

Never put something the user must retain or act on later in a Snackbar.

## A complete screen

A page header, a filter bar, a table with status badges, and pagination. Built from Breadcrumb, Button, Select, DatePicker, Tag, Table, Badge and Pagination - no new components.

- The page owns exactly one Primary button. Everything else is Secondary, Outline or Text.
- Active filters appear as removable Tags, so the current state is readable as text and not only as colour.
- Status is a Badge with a word in it. A bare coloured dot is not a status.
- The numeric column is right-aligned; the header stays short.
- Spacing is the scale: 24px page padding, 16px between regions, 8px inside a control cluster.

```tsx
import {
  Breadcrumb, Button, Select, DatePicker, Tag, Table, Badge, Pagination,
} from '@inspera/components'

export function AssessmentList({ clearStatus, clearDate, loadPage }: {
  clearStatus: () => void
  clearDate: () => void
  loadPage: (page: number) => void
}) {
  return (
    <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Assessments' }]} />

      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
        <h1 className="inspera-h1" style={{ margin: 0 }}>Assessments</h1>
        <Button label="New assessment" intent="Primary" leadingIcon="add" />
      </header>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <Select label="Status" options={['All', 'Live', 'Draft', 'Scheduled']} defaultValue="All" widthMode="Hug" />
        <DatePicker label="Created after" defaultValue="2026-01-01" />
        <Button label="Reset" intent="Text" />
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <Tag label="Status: Live" removable onRemove={clearStatus} />
        <Tag label="Created after 1 Jan" removable onRemove={clearDate} />
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

      <Pagination pageCount={8} onChange={loadPage} />
    </div>
  )
}
```

Same screen without the package:

```html
<!-- Requires the one-time setup block and the tokens from Setup. -->
<div class="page">
  <nav class="inspera-breadcrumb" aria-label="Breadcrumb">
    <ol class="inspera-breadcrumb__list">
      <li><a class="inspera-breadcrumb__crumb" href="/">Home</a></li>
      <li class="inspera-breadcrumb__separator" aria-hidden="true">
        <span class="material-symbols-outlined">chevron_right</span>
      </li>
      <li><span class="inspera-breadcrumb__current" aria-current="page">Assessments</span></li>
    </ol>
  </nav>

  <header class="page__header">
    <h1 class="inspera-h1">Assessments</h1>
    <button type="button" class="inspera-btn inspera-btn--primary">
      <span class="material-symbols-outlined" aria-hidden="true">add</span>
      <span>New assessment</span>
    </button>
  </header>

  <div class="page__filters">
    <!-- Select and DatePicker markup: see their own sections. -->
    <button type="button" class="inspera-btn inspera-btn--text">Reset</button>
  </div>

  <div class="page__tags">
    <span class="inspera-tag inspera-tag--neutral">Status: Live
      <button type="button" class="inspera-tag__remove" aria-label="Remove status filter">
        <span class="material-symbols-outlined" aria-hidden="true">close</span>
      </button>
    </span>
  </div>

  <table class="inspera-table">
    <caption>Assessments</caption>
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
  </table>
</div>

<style>
  .page          { padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-4); }
  .page__header  { display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); }
  .page__filters { display: flex; align-items: flex-end; gap: var(--space-2); flex-wrap: wrap; }
  .page__tags    { display: flex; gap: var(--space-2); flex-wrap: wrap; }
</style>
```

## Screen templates

Working copies of real Inspera screens, built at least in part from library
components. When you build a whole screen or a large region, pick the template
whose purpose matches the task and follow its layout, regions and component
choices.

- The global app shell in a template - the top bar and navigation - is the
  existing product's. It stays as it is.
- The parts of a template not yet rebuilt from library components keep the
  existing product's styling. Treat them as the as-is reference, not as library
  styling.
- Each template's full source - its tokens, components and page - is one
  download on the library's Screen templates page.

| Template | Where in the product | What it shows | Library components |
| --- | --- | --- | --- |
| [Monitor](./#/pages/monitor-candidates) | Landing | Monitor > Candidates roster: the Views rail with saved counts, search toolbar, and the wide live candidate grid. | `TextInput`, `Pagination` |
| [Question sets](./#/pages/question-sets) | Author > Question Sets | Author > Question Sets roster: the Views rail, search and filter toolbar, the grid with per-row status, and pager. | `TextInput`, `Pagination` |
| [New author - Edit](./#/pages/new-author-edit) | Author > Question Sets > Create new > New author | Question-set editor: the tool rail, the sections and questions panel, the rich-text question editor, and the settings for the open question. | `Tabs` |
| [Deliver](./#/pages/deliver-tests) | Deliver > Tests | Deliver > Tests roster: the Views rail, search and filter toolbar, the tests grid and pager. | `TextInput`, `Pagination` |
| [Test setup](./#/pages/test-setup) | Deliver > Tests > Create new > IA | Deliver > Setup screen: test details, candidate and committee counts, and the Options accordion. | `TextInput`, `Textarea`, `Select`, `Checkbox`, `RadioButton`, `Badge` |
| [Data-rich list](./#/pages/data-rich-list) | - | A starting point for any list of records, not a product screen: search, a status filter, an advanced search dialog, a sortable data grid with three sets of figures, and a card view. | `Badge`, `Breadcrumb`, `Button`, `Card`, `Checkbox`, `DataGrid`, `DatePicker`, `Dialog`, `EmptyState`, `NumberInput`, `Progress`, `SegmentedControl`, `Select`, `Tag`, `TextInput` |

## Before you call it done

**Visual system**

- [ ] Every colour resolves to a token - no hex literals in application code.
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

