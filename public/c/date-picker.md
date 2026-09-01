<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Date Picker

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

### Date Picker

Select a calendar date from a popover. - category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { DatePicker } from '@inspera/components'

<DatePicker
  label="Due date"
  value="2026-08-19"
  onChange={setDate}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Date'` | Field label. |
| `value` | `string` | - | Selected date (YYYY-MM-DD). |
| `placeholder` | `string` | `'Select date'` | Trigger placeholder. |
| `state` | `'Default' \| 'Focused' \| 'Disabled' \| 'Error'` | `'Default'` | Freezes a visual state so documentation can show it without a pointer. `Focused` is presentation-only - leave it unset in application code, where CSS drives it from the real pointer and keyboard. `Error` and `Disabled` are real application state and belong in your code. |
| `showLabel` | `boolean` | `true` | Show the field label. |
| `defaultOpen` | `boolean` | `false` | Open the calendar initially. |
| `onChange` | `(iso: string) => void` | - | Fired with the selected date as an ISO string (YYYY-MM-DD). |

**Accessibility** - role `dialog`, keyboard operable. Trigger uses aria-haspopup="dialog" and aria-expanded; Popover uses role="dialog" with a label; Day cells are buttons with descriptive aria-labels; Escape closes the popover.

**Do:** Use for selecting a single calendar date; Highlight today and the selected day; Provide clear month navigation.
**Don't:** Do not use for free-form date typing without validation; Do not trap keyboard focus without an escape.

**Deprecated aliases** (do not use): `Calendar input`, `Date field`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- The grid is `repeat(7, 1fr)` and always padded to 42 cells with empty spans. A grid sized to the month makes the panel jump height as you page through it.
- Leading blanks come from the first of the month's weekday index - they are empty `<span>`s, not disabled buttons, so they are skipped by the keyboard.
- Every day button needs a full `aria-label` ("March 1, 2026"). A bare "1" tells a screen reader nothing.
- Today is outlined with a 1px `--primary` border; the selected day is filled with `--primary`. A day that is both shows only the fill.
- The panel is anchored under the trigger, `--radius-md` on `--surface` with `--shadow-200`, and closes on Escape and on an outside click.
- Store and emit ISO `YYYY-MM-DD`, never a locale-formatted string.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --white:                  #ffffff;
  --gray-200:               #EDEDED;
  --gray-600:               #7A7A7A;
  --blue-300:               #B3D9FF;
  --action-active:          rgba(0, 0, 0, 0.56);
  --text-primary:           rgba(0, 0, 0, 0.87);
  --border-control:         #C4C4C4;
  --border-control-strong:  #8C8C8C;
  --text-placeholder:       #8C8C8C;
  --surface:                var(--white);
  --border:                 var(--gray-200);
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

.inspera-datepicker {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  position: relative;
  font-family: var(--font-sans);
}

.inspera-datepicker__label {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.inspera-datepicker__trigger {
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
  transition:
    border-color var(--duration-fast) var(--easing-standard),
    box-shadow var(--duration-fast) var(--easing-standard);
}

.inspera-datepicker__trigger:hover { border-color: var(--border-control-strong); }

.inspera-datepicker__trigger:focus-visible,
.inspera-datepicker__trigger[aria-expanded='true'] {
  border-color: var(--primary);
  box-shadow: var(--effect-state-focus);
  outline: none;
}

.inspera-datepicker__value {
  flex: 1;
  font-size: 16px;
  color: var(--text-placeholder);
}
.inspera-datepicker__value--set { color: var(--text-primary); }

.inspera-datepicker__trigger .material-symbols-outlined {
  font-size: 20px;
  color: var(--action-active);
}

.inspera-datepicker__panel {
  position: absolute;
  top: 74px;
  left: 0;
  z-index: var(--z-dropdown, 20);
  width: 280px;
  padding: 12px;
  background: var(--surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-200);
  border: 1px solid var(--border);
}

.inspera-datepicker__nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.inspera-datepicker__nav-btn {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--text-primary);
}
.inspera-datepicker__nav-btn .material-symbols-outlined { font-size: 20px; }

.inspera-datepicker__month {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.inspera-datepicker__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.inspera-datepicker__weekday {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--muted-foreground);
  padding: 4px 0;
}

.inspera-datepicker__day {
  height: 32px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 14px;
  cursor: pointer;
}

/* Today is outlined; the selection is filled. Both at once would read as two
   selected days. */
.inspera-datepicker__day--today { border: 1px solid var(--primary); }

.inspera-datepicker__day--selected {
  background: var(--primary);
  color: var(--white);
  border: none;
}
```

```html
<div class="inspera-datepicker">
  <label class="inspera-datepicker__label" for="due">Due date</label>
  <button class="inspera-datepicker__trigger" id="due" type="button"
          aria-haspopup="dialog" aria-expanded="false">
    <span class="inspera-datepicker__value">Select date</span>
    <span class="material-symbols-outlined" aria-hidden="true">calendar_today</span>
  </button>

  <!-- Rendered only while open. -->
  <div class="inspera-datepicker__panel" role="dialog" aria-label="Choose date">
    <div class="inspera-datepicker__nav">
      <button class="inspera-datepicker__nav-btn" type="button" aria-label="Previous month">
        <span class="material-symbols-outlined" aria-hidden="true">chevron_left</span>
      </button>
      <span class="inspera-datepicker__month">March 2026</span>
      <button class="inspera-datepicker__nav-btn" type="button" aria-label="Next month">
        <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
      </button>
    </div>
    <div class="inspera-datepicker__grid">
      <span class="inspera-datepicker__weekday">Su</span>
      <!-- ...Mo through Sa... -->
      <span></span><!-- leading blanks to the first weekday -->
      <button class="inspera-datepicker__day" type="button" aria-label="March 1, 2026">1</button>
      <!-- ...padded to 42 cells so the panel height never changes... -->
    </div>
  </div>
</div>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
