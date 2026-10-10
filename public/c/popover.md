<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Popover

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

### Popover

Show interactive content anchored to a trigger. - category: `feedback`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Popover } from '@inspera/components'

<Popover
  trigger={<Button label="Filters" intent="Outline" trailingIcon="expand_more" />}
  title="Filter results"
  content={<FilterForm />}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `trigger` **(required)** | `ReactElement` | - | The element that toggles the popover - usually a Button. |
| `content` **(required)** | `ReactNode` | - | Popover body. May hold interactive content. |
| `title` | `string` | - | Optional panel heading; also the panel's accessible name. |
| `placement` | `'Top' \| 'Bottom' \| 'Left' \| 'Right'` | `'Bottom'` | Preferred side. It flips when there is no room. |
| `open` | `boolean` | - | Open state. Controlled - pair with onOpenChange. |
| `defaultOpen` | `boolean` | `false` | Open on mount, when uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | - | Fired when the popover opens or closes. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

**Accessibility** - role `dialog`, keyboard operable. Trigger uses aria-haspopup and aria-expanded; Panel uses role="dialog"; Escape and outside-click close the popover; May contain interactive content (unlike Tooltip).

**Do:** Use for interactive content that does not fit inline; Anchor it to the element that opens it; Close it on Escape and on a click outside.
**Don't:** Do not use for simple hover hints - use Tooltip; Do not stack popovers.

**Choosing a variant:**
- `placement="Bottom"`: Under the button that opens it, such as Filters in a toolbar. The default.
- `placement="Top"`: Above a trigger low on the screen, such as in the bar at the foot of the marking view.
- `placement="Right"`: Beside an item in a list on the left, so the list stays in view.
- `placement="Left"`: Beside a trigger at the right edge, such as an action at the end of a table row.

**Deprecated aliases** (do not use): `Flyout`, `Overlay panel`

#### One-time setup

Paste this once, at the root of the project. Without it the component inherits
the host tool's fonts and any icon renders as its own name instead of a glyph.

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Noto+Sans+Mono:wght@400;500&family=Noto+Serif:wght@400;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');

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

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- A popover holds interactive content, so it is `role="dialog"` (not `tooltip`), it is reachable by keyboard, and it does not disappear on mouseout.
- The panel is `--radius-md` on `--surface` with a 1px `--border` and `--shadow-300`, 16px padding, capped at 280px with `width: max-content`.
- Placement sets the offset and the centring transform together; the 10px gap leaves room for the arrow without it touching the trigger.
- The arrow is a 10px square rotated 45deg that borrows exactly two of the panel's borders - the two facing the trigger.
- Close on Escape and on an outside click, and return focus to the trigger.
- For plain text with no controls, use a Tooltip. For anything that must be acted on, this.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --error:                  #D32F2F;
  --success:                #2E7D32;
  --white:                  #ffffff;
  --gray-100:               #F7F7F7;
  --gray-200:               #EDEDED;
  --gray-700:               #595959;
  --gray-900:               #272727;
  --orange-600:             #F2A202;
  --text-primary:           rgba(0, 0, 0, 0.87);
  --surface:                var(--white);
  --border:                 var(--gray-200);
  --muted-foreground:       var(--gray-700);
  --control-height-sm:      32px;
  --control-height-md:      40px;
  --control-height-lg:      44px;
  --radius-sm:              4px;
  --radius-md:              8px;
  --shadow-300:             0px 8px 16px rgba(39, 39, 39, 0.08), 0px 6px 8px rgba(39, 39, 39, 0.12);
  --effect-button-shadow:   inset 0px -1px 0px rgba(0, 0, 0, 0.2), 0px 1px 0px rgba(0, 0, 0, 0.08);
  --border-width-default:   1px;
  --focus-ring-width:       2px;
  --focus-ring-offset:      2px;
  --focus-ring-color:       var(--primary);
  --duration-fast:          100ms;
  --easing-standard:        cubic-bezier(0.2, 0, 0, 1);
  --z-popover:              400;
  --font-sans:              'Inter', system-ui, -apple-system, sans-serif;
  --medium-14-size:         14px;
  --medium-14-line-height:  1.4;
}

.inspera-btn {
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
  height: var(--control-height-md);
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

/* Sizes change height and padding. Small also steps down to 14px type and a
   16px icon (see the end of this block). */
.inspera-btn--small {
  height: var(--control-height-sm);
  padding: 0 12px;
  gap: 4px;
  font-size: var(--medium-14-size);
  line-height: var(--medium-14-line-height);
}
.inspera-btn--large { height: var(--control-height-lg); padding: 0 20px; }

/* Icon only: a square the height of the button. It still needs aria-label. */
.inspera-btn--icon-only { width: var(--control-height-md); min-width: 0; padding: 0; }
.inspera-btn--small.inspera-btn--icon-only { width: var(--control-height-sm); }
.inspera-btn--large.inspera-btn--icon-only { width: var(--control-height-lg); }

/* Solid intents differ only in fill; hover and pressed derive from it. */
.inspera-btn--primary     { --btn-bg: var(--primary); }
.inspera-btn--success     { --btn-bg: var(--success); }
/* Warning takes dark text on orange-600: white on --warning is 3.08:1. */
.inspera-btn--warning     { --btn-bg: var(--orange-600); --btn-fg: var(--gray-900); }
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
/* A button that opens a menu keeps its hover fill while the menu is open. */
.inspera-btn[aria-expanded='true'] { background: var(--btn-bg-hover); }
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

.inspera-btn .material-symbols-outlined { font-size: 20px; }
.inspera-btn--small .material-symbols-outlined { font-size: 16px; }

.inspera-popover {
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

/* Placement sets the offset and the centring transform together - a 10px gap
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


```

```html
<span class="inspera-popover">
  <!-- The trigger is the canonical Button, and the ARIA state sits on it -
       not on a wrapper, which is not focusable and announces nothing. -->
  <button type="button" class="inspera-btn inspera-btn--outline"
          aria-expanded="true" aria-haspopup="dialog" aria-controls="filters-popover">Filters</button>
  <div class="inspera-popover__panel inspera-popover__panel--bottom" id="filters-popover"
       role="dialog" aria-labelledby="filters-title">
    <span class="inspera-popover__arrow" aria-hidden="true"></span>
    <h3 class="inspera-popover__title" id="filters-title">Filter results</h3>
    <div class="inspera-popover__body">Show only published assessments.</div>
  </div>
</span>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
