<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Date Range Picker

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

### Date Range Picker

Select a start and end date from a calendar. - category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { DateRangePicker } from '@inspera/components'

<DateRangePicker
  label="Test window"
  value={range}
  onChange={setRange}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Date range'` | Field label. |
| `value` | `DateRange` | - | Selected range. Controlled - pair with onChange. |
| `placeholder` | `string` | `'Select a range'` | Trigger placeholder. |
| `state` | `'Default' \| 'Focused' \| 'Disabled' \| 'Error'` | `'Default'` | Freezes a visual state so documentation can show it without a pointer. `Focused` is presentation-only. `Error` and `Disabled` are real state. |
| `showLabel` | `boolean` | `true` | Show the field label. |
| `defaultOpen` | `boolean` | `false` | Open the calendar initially. |
| `onChange` | `(range: DateRange) => void` | - | Fired with the range once both ends are chosen. |

```ts
export interface DateRange {
  /** Range start (YYYY-MM-DD) or null. */
  start: string | null
  /** Range end (YYYY-MM-DD) or null. */
  end: string | null
}
```

**Accessibility** - role `dialog`, keyboard operable. Trigger uses aria-haspopup and aria-expanded; Calendar opens in a role="dialog" popover; Day cells use aria-pressed to mark the selected range.

**Do:** Show two months for cross-month ranges; Highlight the full span between endpoints; Confirm the range only once both ends are chosen.
**Don't:** Do not use for a single date - use Date Picker; Do not allow an end date before the start date.

**Deprecated aliases** (do not use): `Range calendar`, `Date range`, `Period picker`

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

- The reusable surface is the closed trigger; the calendar it opens is a `role="dialog"` popover on `--surface` with `--shadow-200`, anchored under the trigger.
- The popover shows two months side by side (each a `repeat(7, 1fr)` grid) so a range that crosses a month boundary is visible without paging.
- The two endpoints are filled `--primary` with white text; every day between them is filled `--blue-100`. First click sets the start, second click sets the end and closes.
- The trigger shows "start - end" once both are chosen (`__value--set`), placeholder text otherwise. Store and emit ISO `YYYY-MM-DD`.
- Trigger chrome matches the other fields: 40px, `--radius-md`, `--border-control` to `--primary` with `--effect-state-focus`.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --white:                  #ffffff;
  --blue-300:               #B3D9FF;
  --action-active:          rgba(0, 0, 0, 0.56);
  --text-primary:           rgba(0, 0, 0, 0.87);
  --border-control:         #C4C4C4;
  --border-control-strong:  #8C8C8C;
  --text-placeholder:       #8C8C8C;
  --radius-md:              8px;
  --effect-state-focus:     0px 0px 0px 3px var(--blue-300);
  --border-width-default:   1px;
  --font-sans:              'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-daterange {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  position: relative;
  font-family: var(--font-sans);
}

.inspera-daterange__label {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.inspera-daterange__trigger {
  height: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border-radius: var(--radius-md);
  border: var(--border-width-default) solid var(--border-control);
  background: var(--white);
  cursor: pointer;
  text-align: left;
  font: inherit;
}

.inspera-daterange__trigger:hover { border-color: var(--border-control-strong); }
.inspera-daterange__trigger:focus-visible,
.inspera-daterange__trigger[aria-expanded='true'] {
  border-color: var(--primary);
  box-shadow: var(--effect-state-focus);
  outline: none;
}

.inspera-daterange__value {
  flex: 1;
  font-size: 16px;
  color: var(--text-placeholder);
}
.inspera-daterange__value--set { color: var(--text-primary); }

.inspera-daterange__trigger .material-symbols-outlined {
  font-size: 20px;
  color: var(--action-active);
}
```

```html
<div class="inspera-daterange">
  <label class="inspera-daterange__label" for="period">Reporting period</label>
  <button class="inspera-daterange__trigger" id="period" type="button"
          aria-haspopup="dialog" aria-expanded="false">
    <span class="inspera-daterange__value">Select date range</span>
    <span class="material-symbols-outlined" aria-hidden="true">date_range</span>
  </button>
</div>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
