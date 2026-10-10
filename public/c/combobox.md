<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Combobox

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

### Combobox

Filter a list of options by typing to select one. - category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Combobox } from '@inspera/components'

<Combobox
  label="Assessment"
  options={[
    { value: 'algebra', label: 'Algebra Quiz', icon: 'quiz' },
    { value: 'biology', label: 'Biology Final', icon: 'science' },
    { value: 'history', label: 'History Midterm', icon: 'history_edu' },
    { value: 'physics', label: 'Physics Lab', icon: 'experiment' },
  ]}
  placeholder="Search assessments..."
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Field label. Always required: it is the accessible name even when hidden. |
| `options` **(required)** | `ComboboxOption[]` | - | The full option list. Filtered as the user types. |
| `placeholder` | `string` | `'Search...'` | Shown when nothing is typed or selected. |
| `value` | `string` | - | Selected value. Controlled - pair with onChange. |
| `defaultValue` | `string` | - | Starting value when uncontrolled. |
| `onChange` | `(value: string) => void` | - | Fired with the chosen value (or the free text, with allowCustomValue). |
| `showLabel` | `boolean` | `true` | Render the visible label. When false, the label becomes `aria-label`. |
| `allowCustomValue` | `boolean` | `false` | Allow a typed value that matches no option to be committed. |
| `emptyText` | `string` | `'No matches'` | Text shown when no option matches the query. |
| `helpText` | `string` | - | Guidance shown below the field. Replaced by errorText when `error` is set. |
| `errorText` | `string` | - | Validation message, shown while `error` is true. |
| `error` | `boolean` | `false` | Marks the field invalid: red border, `aria-invalid`, errorText shown. |
| `disabled` | `boolean` | `false` | Blocks interaction and dims the field. |

Also accepts any native `<input>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<input>`. `className` and `style` go on the outermost element.

```ts
export interface ComboboxOption {
  /** Value returned on select. */
  value: string
  /** Text shown in the list and field. Defaults to the value. */
  label?: string
  /** Optional Material Symbols icon shown before the label. */
  icon?: string
}
```

**Accessibility** - role `combobox`, keyboard operable. Input uses role="combobox" with aria-expanded and aria-controls; Options use role="option" with aria-selected; aria-activedescendant tracks the highlighted option; Up / Down / Enter navigate.

**Do:** Filter options as the user types; Allow custom values only when free text is valid; Show an empty state when nothing matches.
**Don't:** Do not use for a handful of fixed options - use Select; Do not commit a value the user has not confirmed.

**Choosing a variant:**
- `allowCustomValue="false"`: Picking one item out of hundreds by typing its name, such as a grader from all staff.
- `allowCustomValue`: Free text is a valid answer too, such as a new topic for a question.
- `error`: Nothing valid is chosen. Say what to choose.
- `disabled`: The field does not apply right now. Say why.

**Deprecated aliases** (do not use): `Autocomplete`, `Typeahead`, `Search select`

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

- The resting element is the closed field only - a search icon, an unstyled input, and a chevron. The listbox mounts on focus and unmounts on blur or Escape.
- The input is `role="combobox"` with `aria-expanded` and `aria-controls`; each option is `role="option"` with `aria-selected`, and `aria-activedescendant` tracks the highlighted one.
- Field chrome is identical to the text input: 40px, `--radius-sm`, `--border-control` to `--primary` on focus with `--effect-state-focus`.
- The active option is filled `--blue-100`. Up / Down move it, Enter commits, Escape closes.
- Only allow a typed value that matches no option when free text is genuinely valid; otherwise force a choice from the list.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --error:                  #D32F2F;
  --white:                  #ffffff;
  --gray-200:               #EDEDED;
  --gray-600:               #7A7A7A;
  --gray-700:               #595959;
  --gray-800:               #404040;
  --blue-100:               #F0F7FF;
  --blue-300:               #B3D9FF;
  --red-300:                #F9B8B8;
  --action-active:          rgba(0, 0, 0, 0.56);
  --text-primary:           rgba(0, 0, 0, 0.87);
  --border-control:         var(--gray-600);
  --border-control-strong:  var(--gray-800);
  --text-placeholder:       var(--gray-700);
  --surface-disabled:       #F5F5F5;
  --surface:                var(--white);
  --border:                 var(--gray-200);
  --radius-sm:              4px;
  --radius-md:              8px;
  --shadow-200:             0px 8px 8px rgba(39, 39, 39, 0.08), 0px 4px 6px rgba(39, 39, 39, 0.12);
  --effect-state-focus:     0px 0px 0px 3px var(--blue-300);
  --effect-state-error:     0px 0px 0px 3px var(--red-300);
  --border-width-default:   1px;
  --z-dropdown:             300;
  --font-sans:              'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-combobox {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  position: relative;
  font-family: var(--font-sans);
}

.inspera-combobox__label {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.inspera-combobox__field {
  /* Anchors the option list, which opens directly below the field. */
  position: relative;
  height: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border-radius: var(--radius-sm);
  border: var(--border-width-default) solid var(--border-control);
  background: var(--white);
}

.inspera-combobox__field:hover { border-color: var(--border-control-strong); }
.inspera-combobox__field:focus-within {
  border-color: var(--primary);
  box-shadow: var(--effect-state-focus);
}

.inspera-combobox__control {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-sans);
  font-size: 16px;
  color: var(--text-primary);
}
.inspera-combobox__control::placeholder { color: var(--text-placeholder); opacity: 1; }

.inspera-combobox__icon {
  font-size: 20px;
  color: var(--action-active);
}
/* The chevron rotates when the listbox is open. */
.inspera-combobox__chevron { cursor: pointer; transition: transform 140ms ease; }
.inspera-combobox__field[aria-expanded='true'] .inspera-combobox__chevron { transform: rotate(180deg); }

/* Rendered only while open, anchored under the field. */
.inspera-combobox__list {
  /* Inside the field, so it lines up with the field's outer border. */
  position: absolute;
  top: calc(100% + 4px);
  left: -1px;
  right: -1px;
  z-index: var(--z-dropdown, 20);
  margin: 0;
  padding: 6px;
  list-style: none;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-200);
}

.inspera-combobox__option {
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  font-size: 16px;
  color: var(--text-primary);
  cursor: pointer;
}
.inspera-combobox__option[aria-selected='true'] { background: var(--blue-100); }

.inspera-combobox__field[data-invalid='true'],
.inspera-combobox__field[data-invalid='true']:hover,
.inspera-combobox__field[data-invalid='true']:focus-within {
  border-color: var(--error);
  box-shadow: var(--effect-state-error);
}
.inspera-combobox__field[data-disabled='true'] {
  background: var(--surface-disabled);
  opacity: 0.6;
}
.inspera-combobox__field[data-disabled='true'] .inspera-combobox__chevron { cursor: not-allowed; }
.inspera-combobox__error { font-size: 12px; color: var(--error); }
```

```html
<div class="inspera-combobox">
  <label class="inspera-combobox__label" for="country">Country</label>
  <div class="inspera-combobox__field">
    <span class="material-symbols-outlined inspera-combobox__icon" aria-hidden="true">search</span>
    <input class="inspera-combobox__control" id="country" role="combobox"
           aria-expanded="false" aria-controls="country-list" aria-autocomplete="list"
           placeholder="Search countries" />
    <span class="material-symbols-outlined inspera-combobox__icon inspera-combobox__chevron" aria-hidden="true">expand_more</span>
    <!-- Rendered only while open, inside the field so it sits right under it. -->
    <ul class="inspera-combobox__list" id="country-list" role="listbox">
      <li class="inspera-combobox__option" role="option" aria-selected="true">Norway</li>
      <li class="inspera-combobox__option" role="option" aria-selected="false">Sweden</li>
    </ul>
  </div>
</div>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
