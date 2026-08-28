# Inspera Design System — AI Ready Spec v4

> Purpose: This file is optimized for AI coding tools (Claude Code, Cursor, ChatGPT, etc.) that need to generate or review UI consistent with the Inspera Design System.
> It reflects the **current, implemented state** of the design system as built out in `docs-site/src/data/*.ts` — not just the original Figma audit. All placeholder `TODO_FROM_FIGMA` values from earlier versions have been resolved with real, shipped values.
> Source of truth: `docs-site/src/data/components.ts`, `tokens.ts`, `types.ts`, `navigation.ts`, and the rendered docs site.

---

## 1. How AI should use this file

1. Do not invent new visual styles, tokens, or components — use only what is defined here.
2. Use only the canonical component names, tokens, states, sizes, and variant names defined in this file.
3. If multiple legacy/deprecated names exist for a component, always use the canonical name.
4. Treat this file as the implementation source of truth for code generation in the target project.
5. Generate reusable components with a typed props API, not one-off screens.
6. Use semantic tokens (CSS custom properties / theme values), not raw hex values, except where this spec explicitly gives canonical brand colors.
7. Default state naming is always: `Default`, `Hover`, `Focused`, `Pressed`, `Disabled`, `Error`, `Selected`, `Active`.
8. Do not use deprecated or duplicate component/property names (see Section 7).
9. Every component must implement the accessibility notes listed for it — role, keyboard support, and ARIA attributes are not optional.
10. When a value here conflicts with something already in the target codebase, prefer this spec and flag the conflict instead of silently picking one.

---

## 2. Canonical naming standard

### 2.1 Component naming

Use Title Case for all components: `Button`, `Text Input`, `Checkbox`, `Radio Button`, `Select`, `Toggle`, `Card`, `Badge`, `Avatar`, `Alert`, `Dialog`, `Snackbar`, `Tooltip`, `Tabs`, `Breadcrumb`.

### 2.2 Variant property naming

Always use descriptive property names, e.g. `Intent`, `State`, `Size`, `Content`, `Theme`, `Checked`, `Selected`, `WithLabel`, `WithIcon`, `Placement`, `Layout`, `Style`.

Never use generic Figma-leftover names: `Property 1`, `Property 2`, `Variant2`, `Variant3`, `State8`, `Frame 87`.

### 2.3 State naming

Canonical states: `Default`, `Hover`, `Focused`, `Pressed`, `Disabled`, `Error`, `Selected`, `Active`.

Normalize legacy names:
* `Resting` / `Rest` / `Enabled` / `enabled` → `Default`
* `Focussed` → `Focused`
* `Hover light` → `Hover`
* `OnClick` → `Pressed`

---

## 3. Token system

AI must use tokens first. Raw values are fallback only, and only for the canonical brand colors below.

### 3.1 Brand colors

```yaml
color:
  primary:
    main: "#004080"
    hoverOverlay: "rgba(0,64,128,0.04)"
    focusRing: "rgba(0,64,128,0.30)"
  secondary:
    main: "#322060"
    hoverOverlay: "rgba(50,32,96,0.04)"
    focusRing: "rgba(50,32,96,0.30)"
```

### 3.2 Semantic color tokens

```yaml
color:
  text:
    primary:
      light: "rgba(0,0,0,0.87)"
      dark: "rgba(255,255,255,1)"

  semantic:
    error:   { main: "#D32F2F" }
    warning: { main: "#EF6C00" }
    info:    { main: "#0288D1" }
    success: { main: "#2E7D32" }

  action:
    active:   { light: "rgba(0,0,0,0.56)",  dark: "rgba(255,255,255,0.56)" }
    hover:    { light: "rgba(0,0,0,0.04)",  dark: "rgba(255,255,255,0.08)" }
    focus:    { light: "rgba(0,0,0,0.12)",  dark: "rgba(255,255,255,0.12)" }
    disabled: { light: "rgba(0,0,0,0.38)",  dark: "rgba(255,255,255,0.38)" }

  brand:
    zest:  "#FA5101"
    berry: "#89239A"
    algae: "#00A788"
```

### 3.3 Foundation color palette

Reusable palette shades that components and layouts (including intent maps below) draw from. These are not brand roles — brand roles are 3.1.

```yaml
palette:
  white:  { default: "#FFFFFF" }
  gray:   { 100: "#F7F7F7", 200: "#EDEDED", 300: "#D9D9D9", 400: "#BCBCBC", 500: "#949494", 600: "#7A7A7A", 700: "#595959", 800: "#404040", 900: "#272727" }
  blue:   { 100: "#F0F7FF", 200: "#DBEDFF", 300: "#B3D9FF", 400: "#7ABDFF", 500: "#3399FF", 600: "#007BF5", 700: "#0059B3", 800: "#004080", 900: "#002E5C" }
  green:  { 100: "#F2FDF8", 200: "#E0FAEF", 300: "#BDF4DD", 400: "#8DECC5", 500: "#50E2A5", 600: "#1BA76D", 700: "#147B50", 800: "#106542", 900: "#0D4F33" }
  red:    { 100: "#FEF1F1", 200: "#FCDEDE", 300: "#F9B8B8", 400: "#F58484", 500: "#F04242", 600: "#E21212", 700: "#A50D0D", 800: "#760A0A", 900: "#550707" }
  yellow: { 100: "#FFFCF0", 200: "#FFF8DC", 300: "#FEF0B3", 400: "#FEE67C", 500: "#FDD835", 600: "#F2C602", 700: "#B19102", 800: "#7E6701", 900: "#5B4A01" }
  orange: { 100: "#FFFAF0", 200: "#FFF3DC", 300: "#FEE5B3", 400: "#FED27C", 500: "#FDBA35", 600: "#F2A202", 700: "#D99102", 800: "#7E5501", 900: "#5B3D01" }
  purple: { 100: "#F6F4FB", 200: "#E9E4F6", 300: "#D0C6EC", 400: "#9F88D7", 500: "#8366CC", 600: "#603DB8", 700: "#462D86", 800: "#322060", 900: "#241745" }
  pink:   { 100: "#FEF1F5", 200: "#FCDFE8", 300: "#F8B9CE", 400: "#F386AB", 500: "#ED457D", 600: "#DF1659", 700: "#A21041", 800: "#740B2E", 900: "#540821" }
```

### 3.4 Spacing tokens

```yaml
spacing:
  0: 0
  1: 4
  2: 8
  3: 12
  4: 16
  5: 20
  6: 24
  8: 32
  10: 40
  12: 48
  16: 64
```

### 3.5 Radius tokens

```yaml
radius:
  none: 0
  xs: 2
  sm: 4
  md: 8
  lg: 12
  xl: 16
  pill: 9999
```

### 3.6 Elevation (shadow) tokens

```yaml
shadow:
  100: "0px 4px 4px rgba(39,39,39,0.08), 0px 2px 4px rgba(39,39,39,0.12)"
  200: "0px 8px 8px rgba(39,39,39,0.08), 0px 4px 6px rgba(39,39,39,0.12)"
  300: "0px 8px 16px rgba(39,39,39,0.08), 0px 6px 8px rgba(39,39,39,0.12)"
  400: "0px 8px 24px rgba(39,39,39,0.08), 0px 6px 12px rgba(39,39,39,0.12)"
  500: "0px 10px 32px rgba(39,39,39,0.10), 0px 6px 14px rgba(39,39,39,0.12)"
  600: "0px 12px 42px rgba(39,39,39,0.12), 0px 8px 18px rgba(39,39,39,0.12)"
```

### 3.7 Effect / interactive style tokens

```yaml
effects:
  invertHack: "inset 1000px 0px 0px rgba(255,255,255,1)"       # input autofill color override
  state.focus: "0px 0px 0px rgba(179,217,255,1)"                # standard input focus outline overlay
  state.focusStandalone: "0px 0px 0px rgba(0,123,245,1)"        # high-contrast standalone focus indicator
  state.error: "0px 0px 0px rgba(249,184,184,1)"                # error focus/status ring
  state.hoverLight: "0px 0px 0px rgba(148,148,148,1)"           # standard hover overlay outline
  state.focusDarkBackground: "0px 0px 0px rgba(189,244,221,1)"  # focus ring on dark containers
  button.shadow: "inset 0px -1px 0px rgba(0,0,0,0.2), 0px 1px 0px rgba(0,0,0,0.08)"  # standard button elevation highlight
  link.dark: "inset 0px -1px 0px rgba(89,89,89,1)"
  link.blue: "inset 0px -1px 0px rgba(0,64,128,1)"
  link.light: "inset 0px -1px 0px rgba(255,255,255,1)"
```

### 3.8 Breakpoint tokens

```yaml
breakpoint:
  sm: 320   # small mobile
  md: 768   # tablet
  lg: 1440  # desktop
  xl: 1920  # large desktop
```

### 3.9 Typography tokens

```yaml
typography:
  heading:
    h1: { fontFamily: "Inter", fontSize: 28.83, fontWeight: 600, lineHeight: "112%" }
    h2: { fontFamily: "Inter", fontSize: 22.78, fontWeight: 500, lineHeight: "112%" }
    h3: { fontFamily: "Inter", fontSize: 20.25, fontWeight: 500, lineHeight: "112%" }
    h4: { fontFamily: "Inter", fontSize: 18, fontWeight: 500, lineHeight: "112%" }
    h5: { fontFamily: "Inter", fontSize: 16, fontWeight: 500, lineHeight: "112%" }
    h6: { fontFamily: "Inter", fontSize: 12, fontWeight: 500, lineHeight: "112%", textTransform: "uppercase", letterSpacing: 1.6 }
    regular26: { fontFamily: "Inter", fontSize: 26, fontWeight: 400, lineHeight: "130%" }
    medium26:  { fontFamily: "Inter", fontSize: 26, fontWeight: 500, lineHeight: "130%" }
    regular22: { fontFamily: "Inter", fontSize: 22, fontWeight: 400, lineHeight: "130%" }
    medium22:  { fontFamily: "Inter", fontSize: 22, fontWeight: 500, lineHeight: "130%" }
    regular20: { fontFamily: "Inter", fontSize: 20, fontWeight: 400, lineHeight: "130%" }
    medium20:  { fontFamily: "Inter", fontSize: 20, fontWeight: 500, lineHeight: "130%" }
    regular18: { fontFamily: "Inter", fontSize: 18, fontWeight: 400, lineHeight: "130%" }
    medium18:  { fontFamily: "Inter", fontSize: 18, fontWeight: 500, lineHeight: "130%" }

  body:
    mdRegular: { fontFamily: "Inter", fontSize: 16, fontWeight: 400, lineHeight: 20 }
    mdMedium:  { fontFamily: "Inter", fontSize: 16, fontWeight: 500, lineHeight: 20 }
    caption:   { fontFamily: "Inter", fontSize: 12, fontWeight: 400, lineHeight: "120%" }
    regular16: { fontFamily: "Inter", fontSize: 16, fontWeight: 400, lineHeight: "140%" }
    medium16:  { fontFamily: "Inter", fontSize: 16, fontWeight: 500, lineHeight: "140%" }
    link16:    { fontFamily: "Inter", fontSize: 16, fontWeight: 500, lineHeight: "140%" }
    regular14: { fontFamily: "Inter", fontSize: 14, fontWeight: 400, lineHeight: "140%" }
    medium14:  { fontFamily: "Inter", fontSize: 14, fontWeight: 500, lineHeight: "140%" }
    semiBold16: { fontFamily: "Inter", fontSize: 16, fontWeight: 600, lineHeight: "140%" }
    semiBold12Caps: { fontFamily: "Inter", fontSize: 12, fontWeight: 600, lineHeight: "120%", textTransform: "uppercase" }
    documentation: { fontFamily: "Inter", fontSize: 14, fontWeight: 400, lineHeight: "150%" }

  paragraph:
    default:  { fontFamily: "Inter", fontSize: 16, fontWeight: 400, lineHeight: "150%" }
    content:  { fontFamily: "Inter", fontSize: 16, fontWeight: 400, lineHeight: "160%" }
    captions: { fontFamily: "Inter", fontSize: 12, fontWeight: 400, lineHeight: "140%" }
    heading:  { fontFamily: "Inter", fontSize: 20.25, fontWeight: 600, lineHeight: "140%" }

  special:
    serif: { fontFamily: "Noto Serif", fontSize: 16, fontWeight: 400, lineHeight: "150%" }
    mono:  { fontFamily: "Noto Sans Mono", fontSize: 16, fontWeight: 400, lineHeight: "150%" }
```

### 3.10 Icon library

* Library: **Google Material Symbols Outlined** (variable font), backed by a local dataset of icon names/categories/tags (`materialIcons.json`) sourced from the Material Design Icons repo.
* Variable font axes: `FILL` (0 = outline, 1 = filled), `wght` (100–700, default 400), `GRAD` (-25, 0, 200), `opsz` (20, 24, 40, 48 — default 24).
* Usage pattern:

```html
<span class="material-symbols-outlined"
  style="font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;">
  search
</span>
```

```css
.icon {
  font-family: 'Material Symbols Outlined';
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  font-size: 24px;
}
```

* Default icon size across components is 20px (inline indicators like Checkbox/Radio Button/Toggle thumb) or 24px (standalone icons); do not introduce other icon libraries.

---

## 4. Canonical component model

Every component generated must follow this shape:

```yaml
component:
  name: string
  purpose: string
  canonical: true
  deprecatedAliases: string[]
  category: "input-controls" | "data-display" | "feedback" | "navigation"
  variants: Record<PropName, (string|boolean)[]>
  defaults: Record<PropName, string|boolean>
  layout: { height, minWidth?, paddingX, paddingY, gap, radius, ...componentSpecific }
  typography: Record<slot, tokenName>
  styling: { background?, text?, border?, shadow?, intentMap? }
  behavior: { hover, focused, pressed, disabled }
  accessibility: { role, minTouchTarget: 44, keyboard: true, ariaNotes: string[] }
  usage: { do: string[], dont: string[] }
```

---

## 5. Canonical component definitions

There are **14 canonical components** across 4 categories. All layout values below are shipped, real values — none are placeholders.

### Input Controls

#### 5.1 Button
```yaml
purpose: "Trigger an action."
deprecatedAliases: [Primary button, Secondary button, Outline button, Text button, Success button, Warning button]
variants:
  Intent: [Primary, Secondary, Outline, Text, Success, Warning, Destructive]
  Size: [Small, Medium, Large]
  State: [Default, Hover, Focused, Pressed, Disabled]
  Content: [Text, "Icon + Text", "Text + Icon", "Text + Disclosure"]
  Theme: [Light]
defaults: { Intent: Primary, Size: Medium, State: Default, Content: Text, Theme: Light }
layout:
  height: { Small: 32, Medium: 40, Large: 48 }
  minWidth: 80
  paddingX: { Small: 12, Medium: 16, Large: 24 }
  paddingY: { Small: 6, Medium: 8, Large: 12 }
  gap: { Small: 6, Medium: 8, Large: 10 }
  radius: sm
typography: { label: "body.semiBold16" }
styling:
  intentMap:
    Primary:     { background: "#004080", text: "#FFFFFF", border: transparent }
    Secondary:   { background: "#F7F7F7", text: "#272727", border: "#595959" }
    Outline:     { background: transparent, text: "#004080", border: "#004080" }
    Text:        { background: transparent, text: "#004080", border: transparent }
    Success:     { background: "#2E7D32", text: "#FFFFFF", border: transparent }
    Warning:     { background: "#EF6C00", text: "#FFFFFF", border: transparent }
    Destructive: { background: "#D32F2F", text: "#FFFFFF", border: transparent }
behavior:
  hover: "Apply hover overlay consistent with intent color"
  focused: "Show 2px focus ring using primary focus token"
  pressed: "Darken background by 8% for solid intents"
  disabled: "Reduce opacity to 0.38 and remove pointer events"
accessibility: { role: button, minTouchTarget: 44, keyboard: true, ariaNotes: ["Icon-only buttons must have an accessible label"] }
usage:
  do: ["Use Primary for main actions", "Use Secondary for alternative actions", "Use Destructive only for destructive flows"]
  dont: ["Do not create separate component files per intent", "Do not use deprecated alias names"]
```

#### 5.2 Text Input
```yaml
purpose: "Collect single-line text input."
deprecatedAliases: [Text inputs, Content, "Content (small)"]
variants:
  State: [Default, Hover, Focused, Pressed, Disabled, Error, Filled, ReadOnly]
  Size: [Small, Medium]
  LeadingIcon: [true, false]
  TrailingIcon: [true, false]
  Label: [true, false]
  HelpText: [true, false]
  ErrorText: [true, false]
defaults: { State: Default, Size: Medium, LeadingIcon: false, TrailingIcon: false, Label: true, HelpText: false, ErrorText: false }
layout: { height: 40, paddingX: 12, paddingY: 8, gap: 8, radius: md }
typography: { label: "body.mdMedium", input: "body.mdRegular", help: "body.caption" }
styling: { background: "#FFFFFF", text: "rgba(0,0,0,0.87)", border: "#C4C4C4" }
behavior:
  hover: "Darken border color to #8C8C8C"
  focused: "Apply primary focus ring and set border to primary.main"
  pressed: "Same as focused state"
  disabled: "Set background to #F5F5F5, text to action.disabled, remove interaction"
accessibility:
  role: textbox
  minTouchTarget: 44
  keyboard: true
  ariaNotes: ["Always associate label with input using htmlFor/id", "Error text must be linked via aria-describedby", "Required fields must use aria-required"]
usage:
  do: ["Always include a visible label", "Provide clear placeholder text as a hint", "Show error messages below the input"]
  dont: ["Do not use placeholder as the only label", "Do not disable inputs without explanation"]
```

#### 5.3 Checkbox
```yaml
purpose: "Allow multiple selection."
deprecatedAliases: ["Checkbox/Unchecked", "Checkbox/Checked", "Checkbox with label", "Checkbox (fill width)", "Checkbox (Cards)"]
variants:
  State: [Default, Hover, Focused, Pressed, Disabled, Error]
  Checked: [true, false]
  WithLabel: [true, false]
  Size: [Small, Medium]
defaults: { State: Default, Checked: false, WithLabel: true, Size: Medium }
layout: { height: 40, paddingX: 0, paddingY: 8, gap: 8, radius: xs, indicatorSize: 20 }
typography: { label: "body.mdRegular" }
styling: { background: "#FFFFFF", text: "rgba(0,0,0,0.87)", border: "#8C8C8C" }
behavior:
  hover: "Show hover overlay on indicator"
  focused: "Show focus ring around indicator"
  pressed: "Depress indicator with slight scale"
  disabled: "Reduce opacity to 0.38"
accessibility:
  role: checkbox
  minTouchTarget: 44
  keyboard: true
  ariaNotes: ["Use aria-checked to reflect state", "Group related checkboxes with fieldset and legend"]
usage:
  do: ["Use for multi-select scenarios", "Always provide a label for each checkbox", "Group related options together"]
  dont: ["Do not use for mutually exclusive options — use Radio Button instead", "Do not use without a label"]
```

#### 5.4 Radio Button
```yaml
purpose: "Allow single selection."
deprecatedAliases: [Radiobutton, Radiobuttons, "Radio Button New-BonW", "Radio Button New-BonY", "Radio Button New-WonB", "Radio Button New-YonB"]
variants:
  State: [Default, Hover, Focused, Pressed, Disabled, Error]
  Selected: [true, false]
  WithLabel: [true, false]
  Theme: [Default]
defaults: { State: Default, Selected: false, WithLabel: true, Theme: Default }
layout: { height: 40, paddingX: 0, paddingY: 8, gap: 8, radius: pill, indicatorSize: 20 }
typography: { label: "body.mdRegular" }
styling: { background: "#FFFFFF", text: "rgba(0,0,0,0.87)", border: "#8C8C8C" }
behavior:
  hover: "Show hover overlay on indicator"
  focused: "Show focus ring around indicator"
  pressed: "Depress indicator with slight scale"
  disabled: "Reduce opacity to 0.38"
accessibility:
  role: radio
  minTouchTarget: 44
  keyboard: true
  ariaNotes: ['Use role="radiogroup" for the group container', "Use aria-checked to indicate selected state", "Arrow keys navigate between options in the group"]
usage:
  do: ["Use for mutually exclusive options", "Always group inside a radiogroup", "Pre-select a default when appropriate"]
  dont: ["Do not use for multi-select — use Checkbox instead", "Do not use a single radio button alone"]
```

#### 5.5 Select
```yaml
purpose: "Select one option from a list."
deprecatedAliases: ["Select / Fixed width", "Select / Content adaptable", Dropdown, "Dropdown with Label"]
variants:
  State: [Default, Hover, Focused, Pressed, Disabled, Error, Open]
  WidthMode: [Fixed, "Content Adaptable"]
  Label: [true, false]
  Search: [true, false]
defaults: { State: Default, WidthMode: Fixed, Label: true, Search: false }
layout: { height: 40, minWidth: 120, paddingX: 12, paddingY: 8, gap: 8, radius: md }
typography: { label: "body.mdMedium", option: "body.mdRegular" }
styling: { background: "#FFFFFF", text: "rgba(0,0,0,0.87)", border: "#C4C4C4" }
behavior:
  hover: "Darken border to #8C8C8C"
  focused: "Show primary focus ring, highlight border"
  pressed: "Open the option list"
  disabled: "Disable interaction, reduce opacity to 0.38"
accessibility:
  role: combobox
  minTouchTarget: 44
  keyboard: true
  ariaNotes: ["Use aria-expanded to indicate open state", "Use aria-activedescendant for highlighted option", "Support arrow key navigation through options"]
usage:
  do: ["Use for 5+ options where space is limited", "Always provide a label", "Show a clear placeholder when no option is selected"]
  dont: ["Do not use for fewer than 3 options — use Radio Button instead", "Do not nest selects inside other selects"]
```

#### 5.6 Toggle
```yaml
purpose: "Switch a setting on or off instantly."
deprecatedAliases: [Switch, "Toggle switch"]
variants:
  State: [Default, Hover, Focused, Disabled]
  Checked: [true, false]
  Size: [Small, Medium]
  WithLabel: [true, false]
defaults: { State: Default, Checked: false, Size: Medium, WithLabel: true }
layout: { height: 24, paddingX: 2, paddingY: 2, gap: 8, radius: pill, trackWidth: 44, thumbSize: 20 }
typography: { label: "body.mdRegular" }
styling: { background: "#C4C4C4", text: "rgba(0,0,0,0.87)", border: transparent }
behavior:
  hover: "Slight shadow on thumb"
  focused: "Show focus ring around track"
  pressed: "Slide thumb to opposite position"
  disabled: "Reduce opacity to 0.38, remove interaction"
accessibility:
  role: switch
  minTouchTarget: 44
  keyboard: true
  ariaNotes: ['Use role="switch" for the toggle', "Use aria-checked to reflect on/off state", "Space key toggles the switch"]
usage:
  do: ["Use for immediate on/off settings", "Provide a clear label describing the setting", "Show the current state visually"]
  dont: ["Do not use for form submissions — use Checkbox instead", "Do not use without a visible label"]
```

### Data Display

#### 5.7 Card
```yaml
purpose: "Group related content in a contained surface."
deprecatedAliases: []
variants:
  Elevation: [Flat, Raised, Outlined]
  Padding: [Compact, Default, Spacious]
  Interactive: [true, false]
defaults: { Elevation: Raised, Padding: Default, Interactive: false }
layout: { height: auto, paddingX: 16, paddingY: 16, gap: 12, radius: lg }
typography: { title: "heading.h5", body: "body.mdRegular" }
styling: { background: "#FFFFFF", text: "rgba(0,0,0,0.87)", border: "#E5E7EB", shadow: "shadow.200" }
behavior:
  hover: "Elevate shadow when interactive"
  focused: "Show focus ring when interactive"
  pressed: "Depress slightly when interactive"
  disabled: "Reduce opacity to 0.38 when interactive"
accessibility:
  role: article
  minTouchTarget: 44
  keyboard: true
  ariaNotes: ['Interactive cards should use role="button" or be wrapped in an anchor', 'Non-interactive cards use role="article" or a semantic section']
usage:
  do: ["Use to group related content", "Maintain consistent padding within a view", "Use raised elevation for primary content cards"]
  dont: ["Do not nest cards inside other cards", "Do not use cards for layout-only purposes without content"]
```

#### 5.8 Badge
```yaml
purpose: "Display a short status label or count."
deprecatedAliases: ["Status Badge", Tag, Chip]
variants:
  Intent: [Neutral, Info, Success, Warning, Error]
  Size: [Small, Medium]
  WithIcon: [true, false]
defaults: { Intent: Neutral, Size: Medium, WithIcon: false }
layout: { height: 24, paddingX: 8, paddingY: 4, gap: 4, radius: pill }
typography: { label: "body.caption" }
styling:
  intentMap:
    Neutral: { background: "#F0F0F0", text: "#272727", border: transparent }
    Info:    { background: "#E1F5FE", text: "#0288D1", border: transparent }
    Success: { background: "#E8F5E9", text: "#2E7D32", border: transparent }
    Warning: { background: "#FFF3E0", text: "#EF6C00", border: transparent }
    Error:   { background: "#FFEBEE", text: "#D32F2F", border: transparent }
behavior:
  hover: "No hover change for non-interactive badges"
  focused: "Not focusable by default"
  pressed: "Not pressable by default"
  disabled: "Reduce opacity to 0.38"
accessibility:
  role: status
  minTouchTarget: 44
  keyboard: false
  ariaNotes: ["Use aria-label for icon-only badges", 'Use role="status" for dynamic count badges']
usage:
  do: ["Use for status indicators and counts", "Keep labels short — 1 to 2 words", "Use intent colors consistently"]
  dont: ["Do not use for long text content", "Do not make badges interactive without clear affordance"]
```

#### 5.9 Avatar
```yaml
purpose: "Represent a user or entity with an image or initials."
deprecatedAliases: []
variants:
  Size: [Small, Medium, Large]
  Content: [Image, Initials, Icon]
  Status: [None, Online, Offline, Busy]
defaults: { Size: Medium, Content: Initials, Status: None }
layout: { height: 40, paddingX: 0, paddingY: 0, gap: 0, radius: pill }
typography: { initials: "body.mdMedium" }
styling: { background: "#E0E0E0", text: "#272727", border: transparent }
behavior:
  hover: "Slight brightness increase when interactive"
  focused: "Show focus ring when interactive"
  pressed: "No press effect by default"
  disabled: "Reduce opacity to 0.38"
accessibility:
  role: img
  minTouchTarget: 44
  keyboard: false
  ariaNotes: ["Provide alt text for image avatars", "Use aria-label for initials and icon variants"]
usage:
  do: ["Use for user profiles and participant lists", "Provide meaningful alt text", "Use consistent sizing within a context"]
  dont: ["Do not stretch or distort avatar images", "Do not use random colors — use a deterministic palette"]
```

### Feedback

#### 5.10 Alert
```yaml
purpose: "Display semantic inline feedback."
deprecatedAliases: []
variants:
  Intent: [Info, Success, Warning, Error]
  Layout: [Simple, "With CTA", "With Close", "With CTA + Close"]
  Background: [true, false]
defaults: { Intent: Info, Layout: Simple, Background: true }
layout: { height: auto, paddingX: 16, paddingY: 12, gap: 12, radius: md }
typography: { title: "body.mdMedium", body: "body.mdRegular" }
styling:
  intentMap:
    Info:    { background: "#E1F5FE", text: "#0288D1", border: "#0288D1" }
    Success: { background: "#E8F5E9", text: "#2E7D32", border: "#2E7D32" }
    Warning: { background: "#FFF3E0", text: "#EF6C00", border: "#EF6C00" }
    Error:   { background: "#FFEBEE", text: "#D32F2F", border: "#D32F2F" }
behavior:
  hover: "No hover effect for static alerts"
  focused: "Focus ring on close button and CTA when present"
  pressed: "Standard press for close button and CTA"
  disabled: "Alerts are not disableable"
accessibility:
  role: alert
  minTouchTarget: 44
  keyboard: true
  ariaNotes: ['Use role="alert" for important messages', 'Use aria-live="polite" for non-critical alerts', 'Close button must have aria-label="Close alert"']
usage:
  do: ["Use for contextual inline messages", "Match intent to message severity", "Keep alert text concise"]
  dont: ["Do not stack more than 2 alerts in the same area", "Do not use alerts for permanent content"]
```

#### 5.11 Dialog
```yaml
purpose: "Present content or actions that require user attention."
deprecatedAliases: [Modal, Popup]
variants:
  Size: [Small, Medium, Large]
  HasCloseButton: [true, false]
  HasActions: [true, false]
defaults: { Size: Medium, HasCloseButton: true, HasActions: true }
layout: { height: auto, minWidth: 400, maxWidth: 560, paddingX: 24, paddingY: 24, gap: 16, radius: lg }
typography: { title: "heading.h4", body: "body.mdRegular" }
styling: { background: "#FFFFFF", text: "rgba(0,0,0,0.87)", border: transparent, shadow: "shadow.500" }
behavior:
  hover: "No hover on dialog surface"
  focused: "Trap focus inside dialog"
  pressed: "Standard press on action buttons"
  disabled: "Actions can be disabled individually"
accessibility:
  role: dialog
  minTouchTarget: 44
  keyboard: true
  ariaNotes: ['Use role="dialog" with aria-modal="true"', "Set aria-labelledby to the dialog title", "Trap focus inside the dialog when open", "Return focus to trigger element on close", "Escape key closes the dialog"]
usage:
  do: ["Use for confirmations and critical decisions", "Always provide a way to close the dialog", "Keep dialog content focused and concise"]
  dont: ["Do not open dialogs from other dialogs", "Do not use for non-blocking information — use Alert instead"]
```

#### 5.12 Snackbar
```yaml
purpose: "Show brief, non-blocking feedback at the bottom of the screen."
deprecatedAliases: [Toast, "Notification bar"]
variants:
  Intent: [Neutral, Info, Success, Warning, Error]
  HasAction: [true, false]
  HasClose: [true, false]
defaults: { Intent: Neutral, HasAction: false, HasClose: true }
layout: { height: 48, minWidth: 300, paddingX: 16, paddingY: 12, gap: 8, radius: md }
typography: { message: "body.mdRegular", action: "body.mdMedium" }
styling: { background: "#272727", text: "#FFFFFF", border: transparent, shadow: "shadow.300" }
behavior:
  hover: "No hover on snackbar surface"
  focused: "Focus ring on action button and close"
  pressed: "Standard press on action button"
  disabled: "Snackbars auto-dismiss and are not disableable"
accessibility:
  role: status
  minTouchTarget: 44
  keyboard: true
  ariaNotes: ['Use role="status" with aria-live="polite"', "Action button must be focusable", "Auto-dismiss timing must be generous (5s minimum)"]
usage:
  do: ["Use for brief confirmation messages", "Include an undo action when appropriate", "Limit to one snackbar at a time"]
  dont: ["Do not use for critical errors — use Alert or Dialog instead", "Do not stack multiple snackbars"]
```

#### 5.13 Tooltip
```yaml
purpose: "Provide contextual help on hover or focus."
deprecatedAliases: [Tooltips, Walkthrough, "a11y tooltips"]
variants:
  Placement: [Top, Bottom, Left, Right]
  Theme: [Light, Dark]
  Type: [Default, Accessibility]
defaults: { Placement: Top, Theme: Dark, Type: Default }
layout: { height: auto, maxWidth: 240, paddingX: 12, paddingY: 8, gap: 0, radius: sm }
typography: { content: "body.caption" }
styling: { background: "#272727", text: "#FFFFFF", border: transparent, shadow: "shadow.100" }
behavior:
  hover: "Appears on trigger hover after 200ms delay"
  focused: "Appears when trigger receives keyboard focus"
  pressed: "Remains visible while trigger is pressed"
  disabled: "Does not appear when trigger is disabled"
accessibility:
  role: tooltip
  minTouchTarget: 44
  keyboard: true
  ariaNotes: ['Use role="tooltip" on the tooltip element', "Link trigger and tooltip with aria-describedby", "Escape key dismisses the tooltip", "Tooltip must not contain interactive content"]
usage:
  do: ["Use for supplementary information", "Keep tooltip text short and scannable", "Position to avoid clipping viewport edges"]
  dont: ["Do not put critical information only in tooltips", "Do not use for interactive content — use Popover instead"]
```

### Navigation

#### 5.14 Tabs
```yaml
purpose: "Organize content into switchable panels."
deprecatedAliases: ["Tab bar", "Tab navigation"]
variants:
  Style: [Underline, Contained]
  Size: [Small, Medium]
  FullWidth: [true, false]
defaults: { Style: Underline, Size: Medium, FullWidth: false }
layout: { height: 48, paddingX: 16, paddingY: 0, gap: 0, radius: none }
typography: { tab: "body.mdMedium" }
styling: { background: transparent, text: "rgba(0,0,0,0.87)", border: "#E5E7EB" }
behavior:
  hover: "Show hover overlay on tab"
  focused: "Show focus ring on active tab"
  pressed: "Switch to pressed tab panel"
  disabled: "Reduce opacity to 0.38 and skip in keyboard navigation"
accessibility:
  role: tablist
  minTouchTarget: 44
  keyboard: true
  ariaNotes: ['Use role="tablist" on the tab container', 'Each tab uses role="tab" with aria-selected', 'Tab panels use role="tabpanel" linked by aria-labelledby', "Arrow keys navigate between tabs"]
usage:
  do: ["Use to organize related content sections", "Label tabs clearly and concisely", "Use a maximum of 6 tabs per set"]
  dont: ["Do not use tabs for sequential steps — use a stepper instead", "Do not nest tab sets inside other tab sets"]
```

#### 5.15 Breadcrumb
```yaml
purpose: "Show the user's current location in a hierarchy."
deprecatedAliases: [Breadcrumbs, "Path navigation"]
variants:
  Separator: [Slash, Chevron]
  Size: [Small, Medium]
defaults: { Separator: Chevron, Size: Medium }
layout: { height: 32, paddingX: 0, paddingY: 4, gap: 8, radius: none }
typography: { link: "body.mdRegular", current: "body.mdMedium" }
styling: { background: transparent, text: "#004080", border: transparent }
behavior:
  hover: "Underline breadcrumb link on hover"
  focused: "Show focus ring on breadcrumb link"
  pressed: "Navigate to breadcrumb target"
  disabled: "Current page item is not interactive"
accessibility:
  role: navigation
  minTouchTarget: 44
  keyboard: true
  ariaNotes: ['Wrap in nav with aria-label="Breadcrumb"', "Use an ordered list for semantic structure", 'Mark current page with aria-current="page"']
usage:
  do: ["Use for hierarchical navigation structures", "Always include the current page as the last item", "Keep breadcrumb labels concise"]
  dont: ["Do not use for flat navigation", "Do not make the current page breadcrumb a link"]
```

---

## 6. Component index by category

* **Input Controls**: Button, Text Input, Checkbox, Radio Button, Select, Toggle
* **Data Display**: Card, Badge, Avatar
* **Feedback**: Alert, Dialog, Snackbar, Tooltip
* **Navigation**: Tabs, Breadcrumb

---

## 7. Deprecated and ignored names

AI must never use these as canonical implementation names:

* `Destructive button`, `Property 1`, `Property 2`, `Variant2`, `Variant3`, `Variant4`, `Variant5`, `State8`, `Frame 87`
* Any of the per-component `deprecatedAliases` listed in Section 5
* Duplicate `-dark` M3-style component clones as a separate source of truth — theme via tokens/CSS variables instead of duplicated dark components

---

## 8. AI generation prompts

### 8.1 Prompt for a single component

```text
Read the attached DESIGN_SYSTEM_AI_READY_V4.md and generate the Inspera [COMPONENT NAME] as a reusable, production-ready component for this codebase.

Rules:
- Follow only the canonical component names, variants, tokens, and states from the spec — Section 5 has the exact values.
- Do not invent styles, spacing, or colors outside the token system in Section 3.
- Normalize any legacy/deprecated names in this codebase to the canonical names from the spec.
- Support all listed variants and states as typed props.
- Implement the accessibility notes exactly (role, keyboard behavior, ARIA attributes).
- Match this project's existing component conventions (framework, styling approach, file structure) while keeping visual output identical to the spec.
- Output component code, a typed props API, and a small usage example.
```

### 8.2 Prompt for auditing/aligning an existing project against this spec

```text
Read the attached DESIGN_SYSTEM_AI_READY_V4.md. Audit this project's UI components against it and report, then fix:

1. Which canonical components (Section 5) already exist in this project vs. are missing.
2. Any component using deprecated names/aliases (Section 7) that should be renamed.
3. Any hardcoded colors, spacing, radius, or shadow values that should be replaced with the tokens in Section 3.
4. Any state naming that doesn't match the canonical set in Section 2.3.
5. Any accessibility gaps versus the ariaNotes/role/keyboard requirements per component.

Apply fixes incrementally, one component at a time, preserving existing behavior and only changing visual/structural details to match this spec.
```

### 8.3 Prompt for a full component library / documentation site

```text
Read the attached DESIGN_SYSTEM_AI_READY_V4.md and build a design system documentation site for engineers.

Requirements:
- Show the component list grouped by category (Section 6) in a sidebar.
- Each component page shows preview, variants, states, props/API, token usage, and code snippet.
- Include an AI Prompt panel per component (see 8.1 pattern) so engineers can copy a prompt to regenerate that component.
- Use canonical Inspera components only, never deprecated aliases.
- Use the token definitions in Section 3 as the sole styling source of truth.
- Use responsive, accessible markup throughout.
```

---

## 9. What this file is and is not

This file is:
* The current, implemented AI-ready spec for the Inspera Design System — derived directly from the shipped `docs-site/src/data/*.ts` source, not just the original Figma audit.
* A normalized, unambiguous naming/token/component layer for feeding to AI coding tools.
* Meant to be dropped into another project (e.g. via Claude Code) so that new UI is generated consistent with this system.

This file is not:
* A pixel-perfect export of every Figma frame.
* Permission for AI to invent missing design decisions — if something isn't defined here, ask rather than guess.
* A replacement for `DESIGN_SYSTEM.md` (full audit) if deeper historical/rationale context is needed.

---

## 10. Source notes

Derived directly from the live docs site implementation:
* `docs-site/src/data/components.ts` — 14 canonical components, variants, layout, styling, behavior, accessibility, usage
* `docs-site/src/data/tokens.ts` — colors, palette, spacing, radius, shadows, effects, breakpoints, typography
* `docs-site/src/data/types.ts` — canonical data shapes
* `docs-site/src/data/navigation.ts` — component categorization
* `docs-site/src/pages/FoundationPage.tsx` — Material Symbols icon system details
* `docs-site/src/data/materialIcons.json` — icon name/category/tag dataset

Supersedes `DESIGN_SYSTEM_AI_READY_V2.md` and `DESIGN_SYSTEM_AI_READY_V3.md`: all `TODO_FROM_FIGMA` placeholders have been resolved with real shipped values, several components were added beyond the original 7 (Select, Toggle, Card, Badge, Avatar, Dialog, Snackbar, Breadcrumb), and the typography/effects/breakpoint token sets were substantially expanded.
