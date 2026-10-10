<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Menu

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

### Menu

Present a list of actions in a dropdown. - category: `navigation`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Menu } from '@inspera/components'

<Menu
  label="Actions"
  items={[
    { label: 'Edit', icon: 'edit' },
    { label: 'Duplicate', icon: 'content_copy' },
    { label: 'Share', icon: 'share' },
    { label: '', divider: true },
    { label: 'Delete', icon: 'delete', danger: true },
  ]}
  onSelect={handleSelect}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Trigger text. With `iconOnly` it is not shown but names the trigger and the menu, so make it specific: "Actions for Algebra Quiz", not "Actions". |
| `items` **(required)** | `MenuItem[]` | - | Menu items, in order. |
| `placement` | `'BottomStart' \| 'BottomEnd'` | `'BottomStart'` | Aligns the menu to the trigger's start or end edge. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Trigger height 32 / 40 (`--control-height-sm/md`). Small also steps down to 14px text and a 16px icon. |
| `iconOnly` | `boolean` | `false` | Show only an icon - a Text icon-only Button. The overflow trigger for table rows, card headers and toolbars. |
| `icon` | `string` | `'more_vert'` | Material Symbols name for the icon-only trigger. |
| `open` | `boolean` | - | Open state. Controlled - pair with onOpenChange. |
| `defaultOpen` | `boolean` | `false` | Open on mount, when uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | - | Fired when the menu opens or closes. |
| `onSelect` | `(value: string, item: MenuItem) => void` | - | Fired with the chosen item's value (its label, unless set). |

Also accepts any native `<button>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<button>`. `className` and `style` go on the outermost element.

```ts
export interface MenuItem {
  label: string
  /** Passed to onSelect. Defaults to the label. */
  value?: string
  icon?: string
  /** Red text, for destructive actions. Put these last, after a divider. */
  danger?: boolean
  disabled?: boolean
  /** A separator line instead of an item; `label` is ignored. */
  divider?: boolean
  /** Fired when this item is chosen, before the menu-level onSelect. */
  onSelect?: () => void
}
```

**Accessibility** - role `menu`, keyboard operable. Trigger uses aria-haspopup="menu" and aria-expanded; An icon-only trigger is named by label, which says what it acts on: "Actions for Ada Lovelace"; Items use role="menuitem"; Arrow keys move, Enter selects, Escape closes; Outside click closes the menu.

**Do:** Use for grouped actions and overflow; Separate destructive actions with a divider; Start item labels with a verb.
**Don't:** Do not use for selecting a value - use Select; Do not nest menus more than one level.

**Choosing a variant:**
- `placement="BottomStart"`: A trigger at the left of a toolbar, such as the actions for selected candidates. The menu lines up with its left edge.
- `placement="BottomEnd"`: A trigger at the right edge, such as More in a page header or the actions on a table row, so the menu opens inward.
- `iconOnly`: The actions for one table row or one card, where a labelled trigger repeated on every row would crowd it. Name it for its row.
- `size="Small"`: Table rows and dense toolbars, beside Small buttons and inputs.

**Deprecated aliases** (do not use): `Dropdown menu`, `Action menu`, `Context menu`, `Overflow menu`

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

- The trigger takes `aria-haspopup="menu"`, `aria-expanded` and `aria-controls`; the panel is `role="menu"` with `role="menuitem"` buttons at `tabindex="-1"`.
- Focus stays on the trigger and the arrows move a highlight, so hover and the keyboard cursor must drive the same `--active` state.
- Separators are `role="separator"` and `aria-hidden`, 1px of `--border` with a 4px margin.
- Destructive items are `--error` text, never a red fill - a filled row reads as selected.
- The trigger is `--radius-sm`, like the buttons and fields beside it: 40px, or 32px with 14px text for Small. The panel is `--radius-md` on `--surface` with `--shadow-200` and a 180px floor, anchored 4px under the trigger. Bottom End flips it to `right: 0` for menus near the viewport edge.
- For row and card actions, use the icon-only trigger: a Text icon-only button with `more_vert`, keeping its hover fill while open. It shows no text, so its `aria-label` names the thing it acts on ("Actions for Ada Lovelace").
- Escape closes and returns focus to the trigger; an outside click closes without moving focus.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --error:                  #D32F2F;
  --success:                #2E7D32;
  --white:                  #ffffff;
  --gray-100:               #F7F7F7;
  --gray-200:               #EDEDED;
  --gray-300:               #D9D9D9;
  --gray-700:               #595959;
  --gray-900:               #272727;
  --orange-600:             #F2A202;
  --primary-focus-ring:     rgba(0, 64, 128, 0.3);
  --action-hover:           rgba(0, 0, 0, 0.04);
  --action-disabled:        rgba(0, 0, 0, 0.38);
  --text-primary:           rgba(0, 0, 0, 0.87);
  --surface:                var(--white);
  --border:                 var(--gray-200);
  --border-strong:          var(--gray-300);
  --control-height-sm:      32px;
  --control-height-md:      40px;
  --control-height-lg:      44px;
  --radius-sm:              4px;
  --radius-md:              8px;
  --shadow-200:             0px 8px 8px rgba(39, 39, 39, 0.08), 0px 4px 6px rgba(39, 39, 39, 0.12);
  --effect-button-shadow:   inset 0px -1px 0px rgba(0, 0, 0, 0.2), 0px 1px 0px rgba(0, 0, 0, 0.08);
  --border-width-default:   1px;
  --focus-ring-width:       2px;
  --focus-ring-offset:      2px;
  --focus-ring-color:       var(--primary);
  --duration-fast:          100ms;
  --easing-standard:        cubic-bezier(0.2, 0, 0, 1);
  --z-dropdown:             300;
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

.inspera-menu {
  position: relative;
  display: inline-block;
  font-family: var(--font-sans);
}

.inspera-menu__trigger {
  height: var(--control-height-md);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  border-radius: var(--radius-sm);
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

/* Small: 32px, with 14px text and a 16px chevron, as a Small button. */
.inspera-menu__trigger--small {
  height: var(--control-height-sm);
  gap: 4px;
  padding: 0 8px;
  font-size: 14px;
}
.inspera-menu__trigger--small .material-symbols-outlined { font-size: 16px; }

/* Icon only (table rows, card headers, toolbars): the trigger is the canonical
   Text icon-only button with more_vert, and the menu sits beside it as usual. */

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
}
```

```html
<div class="inspera-menu">
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
</div>

<!-- Icon only, for a table row or a card: the trigger is named for what it acts on. -->
<div class="inspera-menu">
  <button type="button" class="inspera-btn inspera-btn--text inspera-btn--small inspera-btn--icon-only"
          aria-haspopup="menu" aria-expanded="false" aria-label="Actions for Ada Lovelace">
    <span class="material-symbols-outlined" aria-hidden="true">more_vert</span>
  </button>
</div>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
