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
  options={['Norway', 'Sweden', 'Denmark', 'Finland', 'Iceland']}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Field label. Always required: it is the accessible name even when hidden. |
| `options` **(required)** | `(string \| SelectOption)[]` | - | The choices, in display order. Plain strings when value and label match. |
| `placeholder` | `string` | `'Select an option'` | Shown when nothing is selected. Not a substitute for the label. |
| `value` | `string` | - | Selected value. Controlled - pair with onChange. |
| `defaultValue` | `string` | - | Starting value when uncontrolled. |
| `onChange` | `(value: string) => void` | - | Fired with the selected value. |
| `widthMode` | `'Fixed' \| 'Hug'` | `'Fixed'` | `Fixed` is 220px wide; `Hug` fits the selected text. |
| `showLabel` | `boolean` | `true` | Render the visible label. When false, the label becomes `aria-label`. |
| `search` | `boolean` | `false` | Adds a filter box at the top of the list. |
| `helpText` | `string` | - | Guidance shown below the field. Replaced by errorText when `error` is set. |
| `errorText` | `string` | - | Validation message, shown while `error` is true. |
| `error` | `boolean` | `false` | Marks the field invalid: red border, `aria-invalid`, errorText shown. |
| `disabled` | `boolean` | `false` | Blocks interaction and dims the field. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

```ts
export interface SelectOption {
  value: string
  /** Shown text. Defaults to `value`. */
  label?: string
}
```

**Accessibility** - role `combobox`, keyboard operable. Use aria-expanded to indicate open state; Use aria-activedescendant for highlighted option; Support arrow key navigation through options.

**Do:** Use for 5+ options where space is limited; Always provide a label; Show a clear placeholder when no option is selected.
**Don't:** Do not use for fewer than 3 options - use Radio Button instead; Do not nest selects inside other selects.

**Deprecated aliases** (do not use): `Select / Fixed width`, `Select / Content adaptable`, `Dropdown`, `Dropdown with Label`

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
  --error:                  #D32F2F;
  --white:                  #ffffff;
  --gray-300:               #D9D9D9;
  --gray-600:               #7A7A7A;
  --blue-100:               #F0F7FF;
  --blue-300:               #B3D9FF;
  --red-300:                #F9B8B8;
  --text-primary:           rgba(0, 0, 0, 0.87);
  --border-control:         #C4C4C4;
  --border-control-strong:  #8C8C8C;
  --surface-disabled:       #F5F5F5;
  --border-strong:          var(--gray-300);
  --muted-foreground:       var(--gray-600);
  --radius-sm:              4px;
  --radius-md:              8px;
  --shadow-200:             0px 8px 8px rgba(39, 39, 39, 0.08), 0px 4px 6px rgba(39, 39, 39, 0.12);
  --effect-state-focus:     0px 0px 0px 3px var(--blue-300);
  --effect-state-error:     0px 0px 0px 3px var(--red-300);
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
  color: var(--text-primary);
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

/* Invalid outranks hover and focus - the error has to stay legible. */
.inspera-select__trigger[aria-invalid='true'],
.inspera-select__trigger[aria-invalid='true']:hover {
  border-color: var(--error);
  box-shadow: var(--effect-state-error);
}
/* A div cannot be :disabled, so the state is read from aria-disabled. */
.inspera-select__trigger[aria-disabled='true'] {
  background: var(--surface-disabled);
  opacity: 0.6;
  cursor: not-allowed;
}
.inspera-select__trigger[aria-disabled='true']:hover { border-color: var(--border-control); }

.inspera-select__error { font-size: 12px; color: var(--error); }

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
  <!-- A <label for> cannot name a div, so the trigger points at the label's id. -->
  <span class="inspera-select__label" id="country-label">Country</span>
  <div class="inspera-select__anchor">
    <div class="inspera-select__trigger" id="country" role="combobox" tabindex="0"
         aria-labelledby="country-label" aria-expanded="false" aria-haspopup="listbox">
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
