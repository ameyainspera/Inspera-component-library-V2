<!-- Inspera Design System v1.0.0 — generated file, do not edit. -->

# Inspera — Checkbox Group

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

### Checkbox Group

Group related multi-select checkboxes. — category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library — build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { CheckboxGroup } from '@inspera/components'

<CheckboxGroup
  label="Notifications"
  value={['email']}
  orientation="Vertical"
  options={[{ label: 'Email', value: 'email' }]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Group label, announced as the fieldset legend. |
| `options` | `CheckboxOption[]` | `DEFAULT_OPTIONS` | Checkbox options. |
| `value` | `string[]` | — | Selected option values. |
| `orientation` | `'Vertical' \| 'Horizontal'` | `'Vertical'` | Layout direction. |
| `state` | `'Default' \| 'Disabled' \| 'Error'` | `'Default'` | Forces a visual state for documentation. Omit for real interactivity. |
| `onChange` | `(value: string[]) => void` | — | Fired with the full array of selected values. |

```ts
export interface CheckboxOption {
  label: string
  value: string
}
```

**Accessibility** — role `group`, keyboard operable. Container uses role="group" with aria-labelledby; Each option is a checkbox with aria-checked; Group related options under a shared legend/label.

**Do:** Use for selecting multiple related options; Provide a group label; Keep options parallel and concise.
**Don't:** Do not use for mutually exclusive options — use Radio Group; Do not omit the group label.

**Deprecated aliases** (do not use): `Checkbox list`, `Multi-select group`

#### Without the package — exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- Checkboxes take `role="group"`, not `radiogroup`, and they do **not** share a `name` — each carries its own value.
- The group label is a `<span>` with an id, linked by `aria-labelledby`.
- Same spacing as Radio Group: no gap vertically (rows carry their own padding), 24px horizontally.
- A "select all" control on top of a group is the natural place for the indeterminate checkbox state.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --error:                  #D32F2F;
  --white:                  #ffffff;
  --text-primary:           rgba(0, 0, 0, 0.87);
  --border-control-strong:  #8C8C8C;
  --radius-xs:              2px;
  --focus-ring-width:       2px;
  --focus-ring-offset:      2px;
  --focus-ring-color:       var(--primary);
  --font-sans:              'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  cursor: pointer;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
}

/* Hidden, but still in the DOM, still focusable, still submitted with the
   form. "display: none" or "visibility: hidden" would break all three. */
.inspera-checkbox__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.inspera-checkbox__box {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-xs);
  border: 2px solid var(--border-control-strong);
  background: var(--white);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  flex-shrink: 0;
  transition: all 120ms ease;
}

.inspera-checkbox--small .inspera-checkbox__box { width: 16px; height: 16px; }

/* The tick is a Material Symbol at the box size minus 4. */
.inspera-checkbox__box .material-symbols-outlined {
  font-size: 16px;
  font-variation-settings: 'wght' 600;
}
.inspera-checkbox--small .inspera-checkbox__box .material-symbols-outlined { font-size: 12px; }

.inspera-checkbox__input:checked + .inspera-checkbox__box,
.inspera-checkbox__input:indeterminate + .inspera-checkbox__box,
/* "indeterminate" is a DOM property with no HTML attribute, so static markup
   cannot trigger :indeterminate. The modifier lets server-rendered markup show
   the state; script that sets el.indeterminate gets the pseudo-class. */
.inspera-checkbox--mixed .inspera-checkbox__box {
  border-color: var(--primary);
  background: var(--primary);
}

.inspera-checkbox:hover .inspera-checkbox__box { border-color: var(--primary); background: rgba(0, 64, 128, 0.04); }
.inspera-checkbox:hover .inspera-checkbox__input:checked + .inspera-checkbox__box,
.inspera-checkbox:hover .inspera-checkbox__input:indeterminate + .inspera-checkbox__box,
.inspera-checkbox--mixed:hover .inspera-checkbox__box {
  border-color: var(--primary);
  background: var(--primary);
}

/* The ring goes on the drawn box: the real input is 0×0, so a ring on it is
   invisible. This is the single most-missed detail in a custom checkbox. */
.inspera-checkbox__input:focus-visible + .inspera-checkbox__box {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.inspera-checkbox:active .inspera-checkbox__box { transform: scale(0.92); }

.inspera-checkbox--error .inspera-checkbox__box { border-color: var(--error); }
.inspera-checkbox--error:hover .inspera-checkbox__box { border-color: var(--error); }

.inspera-checkbox--disabled {
  cursor: not-allowed;
  opacity: 0.38;
}
.inspera-checkbox--disabled:hover .inspera-checkbox__box {
  border-color: var(--border-control-strong);
  background: var(--white);
}

.inspera-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-family: var(--font-sans);
}

.inspera-checkbox-group__label {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.inspera-checkbox-group__options {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.inspera-checkbox-group--horizontal .inspera-checkbox-group__options {
  flex-direction: row;
  gap: 24px;
}
```

```html
<div class="inspera-checkbox-group">
  <span class="inspera-checkbox-group__label" id="notify-label">Notifications</span>
  <div class="inspera-checkbox-group__options" role="group" aria-labelledby="notify-label">
    <label class="inspera-checkbox" for="n-email">
      <input class="inspera-checkbox__input" id="n-email" type="checkbox" />
      <span class="inspera-checkbox__box" aria-hidden="true"></span>
      <span>Email</span>
    </label>
    <label class="inspera-checkbox" for="n-sms">
      <input class="inspera-checkbox__input" id="n-sms" type="checkbox" />
      <span class="inspera-checkbox__box" aria-hidden="true"></span>
      <span>SMS</span>
    </label>
  </div>
</div>
```


---

Tokens: ./tokens.css · Full system: ./llms.txt
