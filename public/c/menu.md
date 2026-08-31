<!-- Inspera Design System v1.0.0 — generated file, do not edit. -->

# Inspera — Menu

1. Do not invent design decisions. Never invent a colour, spacing value, radius, shadow, font size, weight, icon library, focus style, breakpoint, or component variant that this document defines.
2. Use a canonical component before building a lookalike. If one exists for the job, use it.
3. Never rename a canonical component or prop. A deprecated alias may be understood as input, but output must use the canonical name.
4. Consume tokens, not literals. Raw values here define what a token resolves to; application code references `var(--token)`.
5. Do not introduce another design system. No Material UI, Bootstrap, Ant, Chakra, shadcn default styling, Tailwind default palette, or Radix Themes look. Headless behaviour libraries are fine if restyled entirely to this spec.
6. No arbitrary Tailwind values where a token exists. Never `bg-[#004080]` — use the token.
7. Inter for product UI. Noto Sans Mono only for code, identifiers and technical values; Noto Serif only for long-form content.
8. Material Symbols Outlined only. Do not mix in Lucide, Heroicons, or Font Awesome.
9. Accessibility is part of the component contract, not an enhancement. Keyboard operation, visible focus, labels, roles, names, and states are required.
10. Never use colour alone to carry meaning. Pair it with text, an icon, or shape.
11. Respect `prefers-reduced-motion: reduce` — drop non-essential motion.
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

Present a list of actions in a dropdown. — category: `navigation`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library — build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Menu } from '@inspera/components'

<Menu
  label="Actions"
  placement="Bottom Start"
  items={[{ label: 'Edit', icon: 'edit' }, { label: 'Delete', icon: 'delete', danger: true }]}
  onSelect={handleSelect}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Actions'` | Trigger label. |
| `items` | `MenuItem[]` | `sampleItems` | Menu items. |
| `placement` | `'Bottom Start' \| 'Bottom End'` | `'Bottom Start'` | Alignment to trigger. |
| `open` | `boolean` | — | Controlled open state. Leave unset to let the menu manage itself. |
| `defaultOpen` | `boolean` | `false` | Open on mount. |
| `forceVisible` | `boolean` | `false` | Always render the open menu, for documentation. |
| `onSelect` | `(label: string) => void` | — | Fired with the label of the chosen item. |

```ts
export interface MenuItem {
  label: string
  icon?: string
  danger?: boolean
  disabled?: boolean
  divider?: boolean
}
```

**Accessibility** — role `menu`, keyboard operable. Trigger uses aria-haspopup="menu" and aria-expanded; Items use role="menuitem"; Arrow keys move, Enter selects, Escape closes; Outside click closes the menu.

**Do:** Use for grouped actions and overflow; Separate destructive actions with a divider; Keep item labels action-oriented.
**Don't:** Do not use for selecting a value — use Select; Do not nest menus more than one level.

**Deprecated aliases** (do not use): `Dropdown menu`, `Action menu`, `Context menu`, `Overflow menu`

#### Without the package — exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- The trigger takes `aria-haspopup="menu"`, `aria-expanded` and `aria-controls`; the panel is `role="menu"` with `role="menuitem"` buttons at `tabindex="-1"`.
- Focus stays on the trigger and the arrows move a highlight, so hover and the keyboard cursor must drive the same `--active` state.
- Separators are `role="separator"` and `aria-hidden`, 1px of `--border` with a 4px margin.
- Destructive items are `--error` text, never a red fill — a filled row reads as selected.
- Panel is `--radius-md` on `--surface` with `--shadow-200` and a 180px floor, anchored 4px under the trigger. Bottom End flips it to `right: 0` for menus near the viewport edge.
- Escape closes and returns focus to the trigger; an outside click closes without moving focus.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --error:               #D32F2F;
  --white:               #ffffff;
  --gray-200:            #EDEDED;
  --gray-300:            #D9D9D9;
  --primary-focus-ring:  rgba(0, 64, 128, 0.3);
  --action-hover:        rgba(0, 0, 0, 0.04);
  --action-disabled:     rgba(0, 0, 0, 0.38);
  --text-primary:        rgba(0, 0, 0, 0.87);
  --surface:             var(--white);
  --border:              var(--gray-200);
  --border-strong:       var(--gray-300);
  --radius-sm:           4px;
  --radius-md:           8px;
  --shadow-200:          0px 8px 8px rgba(39, 39, 39, 0.08), 0px 4px 6px rgba(39, 39, 39, 0.12);
  --z-dropdown:          300;
  --font-sans:           'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-menu {
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
```


---

Tokens: ./tokens.css · Full system: ./llms.txt
