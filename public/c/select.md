<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Select

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

### Select

Select one option from a list. - category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Select } from '@inspera/components'

<Select
  label="Country"
  widthMode="Fixed"
  search={false}
  options={['Norway', 'Sweden', 'Denmark']}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Country'` | Render the label. |
| `placeholder` | `string` | `'Select an option'` | Shown when nothing is selected. Not a substitute for the label. |
| `options` | `string[]` | `defaultOptions` | The selectable values, in the order they should appear. |
| `value` | `string` | - | Selected value. Controlled - pair with onChange. |
| `state` | `'Default' \| 'Hover' \| 'Focused' \| 'Disabled' \| 'Error' \| 'Open'` | `'Default'` | Freezes a visual state so documentation can show it without a pointer. `Hover`, `Focused` and `Open` are presentation-only - leave them unset in application code, where CSS and the component's own state drive them. `Error` and `Disabled` are real application state and belong in your code. |
| `widthMode` | `'Fixed' \| 'Content Adaptable'` | `'Fixed'` | Trigger sizing. |
| `showLabel` | `boolean` | `true` | Render the visible label. Hiding it still requires an accessible name. |
| `search` | `boolean` | `false` | Filterable option list. |
| `onChange` | `(value: string) => void` | - | Fired with the selected value. |

**Accessibility** - role `combobox`, keyboard operable. Use aria-expanded to indicate open state; Use aria-activedescendant for highlighted option; Support arrow key navigation through options.

**Do:** Use for 5+ options where space is limited; Always provide a label; Show a clear placeholder when no option is selected.
**Don't:** Do not use for fewer than 3 options - use Radio Button instead; Do not nest selects inside other selects.

**Deprecated aliases** (do not use): `Select / Fixed width`, `Select / Content adaptable`, `Dropdown`, `Dropdown with Label`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- The trigger is a `role="combobox"` element with `tabindex="0"`, `aria-expanded`, `aria-haspopup="listbox"` and `aria-controls` pointing at the list. None of that comes free - this is not a native `<select>`.
- The list is `role="listbox"` with `role="option"` children carrying `aria-selected`; it is positioned against the trigger, not appended to the body.
- Keep the keyboard cursor and the selected value as two different states. The highlighted option (`--active`, `--blue-100`) is where the arrows are; `aria-selected` is what has been chosen.
- The chevron rotates 180deg while open, driven off `aria-expanded` so the attribute and the visual cannot disagree.
- Keyboard: Down opens and moves, Up moves back, Enter commits, Escape closes.
- Fixed width is 220px; Content Adaptable drops to `auto` with a 120px floor.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --white:                  #ffffff;
  --gray-300:               #D9D9D9;
  --gray-600:               #7A7A7A;
  --blue-100:               #F0F7FF;
  --blue-300:               #B3D9FF;
  --text-primary:           rgba(0, 0, 0, 0.87);
  --border-control:         #C4C4C4;
  --border-control-strong:  #8C8C8C;
  --border-strong:          var(--gray-300);
  --muted-foreground:       var(--gray-600);
  --radius-sm:              4px;
  --radius-md:              8px;
  --shadow-200:             0px 8px 8px rgba(39, 39, 39, 0.08), 0px 4px 6px rgba(39, 39, 39, 0.12);
  --effect-state-focus:     0px 0px 0px 3px var(--blue-300);
  --border-width-default:   1px;
  --duration-fast:          100ms;
  --easing-standard:        cubic-bezier(0.2, 0, 0, 1);
  --z-dropdown:             300;
  --font-sans:              'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-select {
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
}
```

```html
<div class="inspera-select">
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
</div>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
