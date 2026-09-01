<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Radio Group

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

### Radio Group

Group mutually exclusive radio options. - category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { RadioGroup } from '@inspera/components'

<RadioGroup
  label="Delivery speed"
  name="delivery"
  value="standard"
  orientation="Vertical"
  options={[{ label: 'Standard', value: 'standard' }]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | - | Group label, announced as the radiogroup name. |
| `name` | `string` | - | Shared input name for the group. |
| `options` | `RadioOption[]` | `DEFAULT_OPTIONS` | Radio options. |
| `value` | `string` | - | Selected option value. |
| `orientation` | `'Vertical' \| 'Horizontal'` | `'Vertical'` | Layout direction. |
| `state` | `'Default' \| 'Disabled' \| 'Error'` | `'Default'` | Forces a visual state for documentation. Omit for real interactivity. |
| `onChange` | `(value: string) => void` | - | Fired with the newly selected value. |

```ts
export interface RadioOption {
  label: string
  value: string
}
```

**Accessibility** - role `radiogroup`, keyboard operable. Container uses role="radiogroup" with an accessible label; Each option is a radio with aria-checked; Arrow keys navigate between options.

**Do:** Use for single selection among 2-6 options; Provide a group label; Pre-select a sensible default.
**Don't:** Do not use for multi-select - use Checkbox Group; Do not use a single radio alone.

**Deprecated aliases** (do not use): `Radio list`, `Option group`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- The group label is a `<span>` with an id, linked by `aria-labelledby` on the `role="radiogroup"` element. A bare `<label>` cannot name a group.
- Every option shares one `name`, and no other question on the page may reuse it.
- Vertical options have no gap - each row carries its own 8px vertical padding. Horizontal adds a 24px gap.
- Group-level state (error, disabled) is applied to each option, not drawn once on the wrapper.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --error:                  #D32F2F;
  --white:                  #ffffff;
  --text-primary:           rgba(0, 0, 0, 0.87);
  --border-control-strong:  #8C8C8C;
  --radius-pill:            9999px;
  --focus-ring-width:       2px;
  --focus-ring-offset:      2px;
  --focus-ring-color:       var(--primary);
  --font-sans:              'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-radio {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  cursor: pointer;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
}

.inspera-radio__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.inspera-radio__circle {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-pill);
  border: 2px solid var(--border-control-strong);
  background: var(--white);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 120ms ease;
}

/* The dot is a child element, not a background - it has to stay centred as the
   circle scales on press. */
.inspera-radio__dot {
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  background: var(--primary);
}

.inspera-radio__input:checked + .inspera-radio__circle { border-color: var(--primary); }

.inspera-radio:hover .inspera-radio__circle { border-color: var(--primary); background: rgba(0, 64, 128, 0.04); }

.inspera-radio__input:focus-visible + .inspera-radio__circle {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.inspera-radio:active .inspera-radio__circle { transform: scale(0.92); }

.inspera-radio--error .inspera-radio__circle { border-color: var(--error); }
.inspera-radio--error:hover .inspera-radio__circle { border-color: var(--error); }

.inspera-radio--disabled { cursor: not-allowed; opacity: 0.38; }

.inspera-radio-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-family: var(--font-sans);
}

.inspera-radio-group__label {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.inspera-radio-group__options {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Horizontal needs real separation; the vertical stack relies on each row's
   own 8px padding instead. */
.inspera-radio-group--horizontal .inspera-radio-group__options {
  flex-direction: row;
  gap: 24px;
}
```

```html
<div class="inspera-radio-group">
  <span class="inspera-radio-group__label" id="delivery-label">Delivery speed</span>
  <div class="inspera-radio-group__options" role="radiogroup" aria-labelledby="delivery-label">
    <label class="inspera-radio" for="d-standard">
      <input class="inspera-radio__input" id="d-standard" type="radio" name="delivery" />
      <span class="inspera-radio__circle" aria-hidden="true"></span>
      <span>Standard</span>
    </label>
    <label class="inspera-radio" for="d-express">
      <input class="inspera-radio__input" id="d-express" type="radio" name="delivery" />
      <span class="inspera-radio__circle" aria-hidden="true"></span>
      <span>Express</span>
    </label>
  </div>
</div>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
