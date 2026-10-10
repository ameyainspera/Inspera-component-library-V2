<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Radio Button

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

### Radio Button

Allow single selection. - category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { RadioButton } from '@inspera/components'

<RadioButton
  label="Standard delivery"
  name="delivery"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Text beside the control. Required: it is the accessible name even when hidden. |
| `selected` | `boolean` | - | Selected state. Controlled - pair with onChange. |
| `defaultSelected` | `boolean` | `false` | Starting selected state when uncontrolled. |
| `onChange` | `(selected: boolean) => void` | - | Fired when this option becomes selected. |
| `name` | `string` | - | Shared form name. Every radio in a group must use the same value. Left unset, each radio gets its own generated name and stands alone. |
| `withLabel` | `boolean` | `true` | Render the label text. When false, the label becomes `aria-label`. |
| `disabled` | `boolean` | `false` | Blocks interaction and dims the control. |
| `error` | `boolean` | `false` | Marks the control invalid: a red ring, selected or not, and `aria-invalid` on the input. |
| `description` | `ReactNode` | - | A line under the label: what the option means, or why it is unavailable. Shown with a visible label, and linked to the radio with `aria-describedby`. An error belongs to the group (Radio Group's `errorText`), not to one option. |

Also accepts any native `<input>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<input>`. `className` and `style` go on the outermost element.

**Accessibility** - role `radio`, keyboard operable. Use role="radiogroup" for the group container; Use aria-checked to indicate selected state; Arrow keys navigate between options in the group; The description under the label is linked with aria-describedby.

**Do:** Use for mutually exclusive options; Always group inside a radiogroup; Pre-select a sensible default; Give an option a description when it needs a line of its own, such as why it is unavailable.
**Don't:** Do not use when people can choose more than one option - use Checkbox instead; Do not use a single radio button on its own.

**Choosing a variant:**
- `withLabel`: Each option needs a description or content of its own under it, so the options are laid out one by one. Otherwise use Radio Group.
- `withLabel="false"`: The row next to it names the option, such as a template in a list. Keep the label for screen readers.
- `error`: No option is chosen and one is required. Mark every option in the set and say what to choose.
- `disabled`: One option can't be chosen here. Say why under it.

**Deprecated aliases** (do not use): `Radiobutton`, `Radiobuttons`, `Radio Button New-BonW`, `Radio Button New-BonY`, `Radio Button New-WonB`, `Radio Button New-YonB`

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

- Identical structure to Checkbox: a visually hidden native `<input type="radio">` plus a drawn circle, with the ring on the circle.
- The circle is 20px with a 2px border and `--radius-pill`; the selected dot is a 10px child element, not a background, so it stays centred while the circle scales on press.
- In error the ring is `--error`, selected or not; the dot stays `--primary`. The hover tint is `--error-surface`, and the focus ring stays `--primary`.
- Grouping is the `name` attribute. Every radio in one question shares it, and unrelated questions must not - two groups sharing a name become one.
- For a set of options prefer the Radio Group component, which owns the name and the group label for you.
- An option that needs a line of its own (what it means, or why it is unavailable) takes a description under its label in `.inspera-radio__message`, linked with `aria-describedby`, 28px in. The error belongs to the group, not to one option.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:            #004080;
  --error:              #D32F2F;
  --white:              #ffffff;
  --gray-600:           #7A7A7A;
  --gray-700:           #595959;
  --text-primary:       rgba(0, 0, 0, 0.87);
  --error-surface:      #FFEBEE;
  --border-control:     var(--gray-600);
  --muted-foreground:   var(--gray-700);
  --radius-pill:        9999px;
  --focus-ring-width:   2px;
  --focus-ring-offset:  2px;
  --focus-ring-color:   var(--primary);
  --font-sans:          'Inter', system-ui, -apple-system, sans-serif;
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
  border: 2px solid var(--border-control);
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

/* In error the ring is red whether or not the radio is selected, so a group
   in error reads as one. The dot stays blue. */
.inspera-radio--error .inspera-radio__circle,
.inspera-radio--error .inspera-radio__input:checked + .inspera-radio__circle { border-color: var(--error); }
.inspera-radio--error:hover .inspera-radio__circle { border-color: var(--error); background: var(--error-surface); }

.inspera-radio--disabled { cursor: not-allowed; opacity: 0.38; }

/* A description under the label, linked with aria-describedby. It starts
   where the label text starts (the 20px circle plus its 8px gap) and sits 4px
   under it, pulled up into the row's 8px padding. Not dimmed when disabled:
   it often says why the option is unavailable. */
.inspera-radio-field {
  display: inline-flex;
  flex-direction: column;
  font-family: var(--font-sans);
}
.inspera-radio__message {
  margin-top: -4px;
  padding-left: 28px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--muted-foreground);
}
```

```html
<!-- Every radio in one group shares a name. Radios with no name, or with
     a shared generic name across unrelated questions, will fight each other. -->
<label class="inspera-radio" for="standard">
  <input class="inspera-radio__input" id="standard" type="radio" name="delivery" />
  <span class="inspera-radio__circle" aria-hidden="true">
    <span class="inspera-radio__dot"></span>
  </span>
  <span>Standard delivery</span>
</label>

<label class="inspera-radio" for="express">
  <input class="inspera-radio__input" id="express" type="radio" name="delivery" />
  <span class="inspera-radio__circle" aria-hidden="true"></span>
  <span>Express delivery</span>
</label>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
