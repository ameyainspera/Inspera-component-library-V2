<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera Design System - Input controls - advanced

> Version 1.0.0. Part 3 of 7 of the AI spec: Slider, Segmented Control, Date Picker, File Upload, Rating, OTP Input, Number Input, Combobox, Date Range Picker.
>
> These specs build on `inspera-01-core.md` - its rules, its setup
> (fonts, icon class, tokens) and its foundations. If that file is not in your
> context, ask for it before building. Without it, fonts, icons and colours
> come out wrong.

## Components - input-controls

### Slider

Select a numeric value from a continuous range. - category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Slider } from '@inspera/components'

<Slider
  label="Volume"
  defaultValue={40}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | What is being adjusted. Required: it is the accessible name even when hidden. |
| `min` | `number` | `0` | Minimum value. |
| `max` | `number` | `100` | Maximum value. |
| `step` | `number` | `1` | Increment granularity. |
| `value` | `number` | - | Current value. Controlled - pair with onChange. |
| `defaultValue` | `number` | - | Starting value when uncontrolled. Defaults to the midpoint. |
| `onChange` | `(value: number) => void` | - | Fired as the value changes, by drag or arrow key. |
| `formatValue` | `(value: number) => string` | - | Formats the shown value and what assistive tech announces, e.g. `(v) => v + '%'`. |
| `showValue` | `boolean` | `true` | Show the current value. |
| `showLabel` | `boolean` | `true` | Render the visible label. When false, the label becomes `aria-label`. |
| `disabled` | `boolean` | `false` | Blocks interaction and dims the control. |

Also accepts any native `<input>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<input>`. `className` and `style` go on the outermost element.

**Accessibility** - role `slider`, keyboard operable. Use role="slider" with aria-valuemin / aria-valuemax / aria-valuenow; Provide an accessible label via aria-label; Arrow keys adjust the value.

**Do:** Use for adjustable numeric ranges; Show the current value for precision; Provide a clear label.
**Don't:** Do not use for exact numeric entry - use Number Input instead; Do not use without min/max bounds.

**Choosing a variant:**
- `showValue`: People set a level they need to know exactly, such as a similarity threshold.
- `showValue="false"`: Only the position matters, such as playback volume.
- `showLabel="false"`: Something next to it already says what it is, such as a zoom icon in a viewer toolbar. The label still names it for screen readers.
- `disabled`: The setting depends on another one that is off. Say which under it.

**Deprecated aliases** (do not use): `Range`, `Range slider`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- Keep a real `<input type="range">`, made invisible with `opacity: 0` over the drawn track. Arrows, Home/End, Page Up/Down and touch drag all come free; a div rebuild loses every one of them.
- The thumb takes `pointer-events: none` so the input underneath receives the drag.
- Track is 4px `--gray-300`, fill is `--primary`, thumb is 20px white with a 2px `--primary` border.
- Position the thumb with `left: <pct>%` and `transform: translate(-50%, -50%)`, so it centres on the value rather than hanging off the end.
- The focus ring goes on the drawn thumb, since the real input is invisible.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:            #004080;
  --white:              #ffffff;
  --gray-300:           #D9D9D9;
  --gray-700:           #595959;
  --text-primary:       rgba(0, 0, 0, 0.87);
  --muted-foreground:   var(--gray-700);
  --radius-pill:        9999px;
  --focus-ring-width:   2px;
  --focus-ring-offset:  2px;
  --focus-ring-color:   var(--primary);
  --font-sans:          'Inter', system-ui, -apple-system, sans-serif;
  --font-mono:          'Noto Sans Mono', ui-monospace, SFMono-Regular, monospace;
}

.inspera-slider {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  font-family: var(--font-sans);
}

.inspera-slider__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.inspera-slider__label {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.inspera-slider__value {
  font-size: 14px;
  color: var(--muted-foreground);
  font-family: var(--font-mono);
}

.inspera-slider__control {
  position: relative;
  height: 20px;
  display: flex;
  align-items: center;
}

.inspera-slider__track {
  position: absolute;
  left: 0;
  right: 0;
  height: 4px;
  border-radius: var(--radius-pill);
  background: var(--gray-300);
}

.inspera-slider__fill {
  position: absolute;
  left: 0;
  height: 4px;
  border-radius: var(--radius-pill);
  background: var(--primary);
}

/* Drawn, and deliberately not hit-testable - the real input above it takes
   every pointer event, so drag, click-to-seek and touch all still work. */
.inspera-slider__thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  background: var(--white);
  border: 2px solid var(--primary);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  pointer-events: none;
}

/* The native input, invisible but fully functional: arrows, Home/End, Page
   Up/Down and touch drag all come free. Rebuilding this with a div loses them. */
.inspera-slider__input {
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 20px;
  margin: 0;
  opacity: 0;
  cursor: pointer;
}

.inspera-slider__input:focus-visible + .inspera-slider__thumb,
.inspera-slider__control:has(:focus-visible) .inspera-slider__thumb {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.inspera-slider--disabled { opacity: 0.5; }
.inspera-slider--disabled .inspera-slider__input { cursor: not-allowed; }
```

```html
<div class="inspera-slider">
  <div class="inspera-slider__head">
    <label class="inspera-slider__label" for="volume">Volume</label>
    <span class="inspera-slider__value">50</span>
  </div>
  <div class="inspera-slider__control">
    <div class="inspera-slider__track"></div>
    <div class="inspera-slider__fill" style="width: 50%"></div>
    <span class="inspera-slider__thumb" style="left: 50%"></span>
    <input class="inspera-slider__input" id="volume" type="range"
           min="0" max="100" value="50" aria-label="Volume" />
  </div>
</div>
```


### Segmented Control

Choose one option from a small set of mutually exclusive segments. - category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { SegmentedControl } from '@inspera/components'

<SegmentedControl
  label="Date range"
  items={['Day', 'Week', 'Month']}
  defaultValue="Week"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Names the group for assistive tech, e.g. "Date range". Not shown. |
| `items` **(required)** | `(string \| SegmentedControlItem)[]` | - | Segments, in order. Plain strings when value and label match. |
| `value` | `string` | - | Selected segment value. Controlled - pair with onChange. |
| `defaultValue` | `string` | - | Starting segment when uncontrolled. Defaults to the first. |
| `onChange` | `(value: string) => void` | - | Fired with the chosen segment's value. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Segment height. |
| `fullWidth` | `boolean` | `false` | Stretch to fill the row. |
| `disabled` | `boolean` | `false` | Blocks interaction and dims the control. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

```ts
export interface SegmentedControlItem {
  value: string
  /** Shown text. Defaults to `value`. */
  label?: string
}
```

**Accessibility** - role `radiogroup`, keyboard operable. Container uses role="radiogroup"; Each segment uses role="radio" with aria-checked; Arrow keys move between segments.

**Do:** Use for 2-4 mutually exclusive views; Keep labels short and parallel; Show the active segment clearly.
**Don't:** Do not use for more than 4 options - use Tabs or Select; Do not use for multi-select.

**Choosing a variant:**
- `size="Medium"`: A switch above the content it changes, such as how results are broken down. The default size.
- `size="Small"`: Card headers and dense toolbars, such as the period of a dashboard card.
- `fullWidth`: A narrow panel, where the segments share its width, such as the device in a preview panel.
- `disabled`: The views are not available yet. Say why next to it.

**Deprecated aliases** (do not use): `Segment control`, `Toggle group`, `Button group`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- Segments are joined and outlined: white `--surface`, `--gray-800` text and a `--border-control` border, overlapping by one border so each join is a single line. Only the outer corners take `--radius-sm`.
- The selected segment is `--blue-100` with `--primary` (blue-800) text and a `--blue-700` border, at 600 weight. It sits above its neighbours so the blue border shows on all four sides, and the weight marks it as well as the colour.
- Heights and type match Button: 40px with 16px text, or 32px with 14px text when small - the same heights as Text Input, so they line up in a toolbar.
- A hidden bold copy of the label (`::after` from `data-label`) holds the bold width, so selecting a segment does not shift the others.
- Use `role="radiogroup"` with `role="radio"` children and a roving tabindex: the selected item is the only tab stop, and arrows move between them.
- For more than about four options, or for anything not mutually exclusive, use Tabs or a Select instead.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                         #004080;
  --white:                           #ffffff;
  --gray-600:                        #7A7A7A;
  --gray-800:                        #404040;
  --blue-100:                        #F0F7FF;
  --blue-700:                        #0059B3;
  --border-control:                  var(--gray-600);
  --surface:                         var(--white);
  --control-height-sm:               32px;
  --control-height-md:               40px;
  --radius-sm:                       4px;
  --border-width-default:            1px;
  --focus-ring-width:                2px;
  --focus-ring-offset:               2px;
  --focus-ring-color:                var(--primary);
  --duration-fast:                   100ms;
  --easing-standard:                 cubic-bezier(0.2, 0, 0, 1);
  --font-sans:                       'Inter', system-ui, -apple-system, sans-serif;
  --default-16-regular-size:         16px;
  --default-16-regular-line-height:  1.25;
  --medium-14-size:                  14px;
  --medium-14-line-height:           1.4;
}

.inspera-segmented { display: inline-flex; }
.inspera-segmented--full { width: 100%; }

.inspera-segmented__item {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: var(--control-height-md);
  padding: 0 12px;
  border: var(--border-width-default) solid var(--border-control);
  border-radius: 0;
  background: var(--surface);
  color: var(--gray-800);
  font-family: var(--font-sans);
  font-size: var(--default-16-regular-size);
  line-height: var(--default-16-regular-line-height);
  font-weight: 400;
  white-space: nowrap;
  cursor: pointer;
  transition: background var(--duration-fast) var(--easing-standard);
}

/* Neighbours overlap by one border, so each join is a single line. Only the
   outer corners are rounded. */
.inspera-segmented__item + .inspera-segmented__item { margin-left: calc(var(--border-width-default) * -1); }
.inspera-segmented__item:first-child { border-radius: var(--radius-sm) 0 0 var(--radius-sm); }
.inspera-segmented__item:last-child { border-radius: 0 var(--radius-sm) var(--radius-sm) 0; }
.inspera-segmented__item:only-child { border-radius: var(--radius-sm); }

.inspera-segmented--small .inspera-segmented__item {
  height: var(--control-height-sm);
  font-size: var(--medium-14-size);
  line-height: var(--medium-14-line-height);
}
.inspera-segmented--full .inspera-segmented__item { flex: 1; }

.inspera-segmented__item[aria-checked='false']:hover:not(:disabled) {
  background: color-mix(in srgb, var(--surface) 96%, black);
}

.inspera-segmented__item:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.inspera-segmented--disabled { opacity: 0.38; }
.inspera-segmented--disabled .inspera-segmented__item { cursor: not-allowed; }

/* Selected: raised above its neighbours so the blue border shows on all four
   sides, and bold as well as blue - blue against gray text alone would leave
   the choice to colour. */
.inspera-segmented__item[aria-checked='true'] {
  z-index: 1;
  background: var(--blue-100);
  color: var(--primary);
  border-color: var(--blue-700);
  font-weight: 600;
}

/* A hidden bold copy of the label holds the bold width, so selecting a
   segment does not shift the ones after it. */
.inspera-segmented__label {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}
.inspera-segmented__label::after {
  content: attr(data-label);
  content: attr(data-label) / '';
  height: 0;
  overflow: hidden;
  visibility: hidden;
  font-weight: 600;
  pointer-events: none;
  user-select: none;
}
```

```html
<!-- Roving tabindex: the group is one tab stop and the arrows move inside it. -->
<div class="inspera-segmented" role="radiogroup" aria-label="Date range">
  <button type="button" class="inspera-segmented__item" role="radio" aria-checked="true" tabindex="0"><span class="inspera-segmented__label" data-label="Day">Day</span></button>
  <button type="button" class="inspera-segmented__item" role="radio" aria-checked="false" tabindex="-1"><span class="inspera-segmented__label" data-label="Week">Week</span></button>
  <button type="button" class="inspera-segmented__item" role="radio" aria-checked="false" tabindex="-1"><span class="inspera-segmented__label" data-label="Month">Month</span></button>
</div>
```


### Date Picker

Select a calendar date from a popover. - category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { DatePicker } from '@inspera/components'

<DatePicker
  label="Due date"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Field label. Always required: it is the accessible name even when hidden. |
| `value` | `string` | - | Selected date (YYYY-MM-DD). Controlled - pair with onChange. |
| `defaultValue` | `string` | - | Starting date when uncontrolled (YYYY-MM-DD). |
| `onChange` | `(iso: string) => void` | - | Fired with the selected date as an ISO string (YYYY-MM-DD). |
| `open` | `boolean` | - | Calendar open state. Controlled - pair with onOpenChange. |
| `defaultOpen` | `boolean` | `false` | Open the calendar initially, when uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | - | Fired when the calendar opens or closes. |
| `placeholder` | `string` | `'Select date'` | Trigger text when no date is chosen. |
| `showLabel` | `boolean` | `true` | Render the visible label. When false, the label becomes `aria-label`. |
| `helpText` | `string` | - | Guidance shown below the field. Replaced by errorText when `error` is set. |
| `errorText` | `string` | - | Validation message, shown while `error` is true. |
| `error` | `boolean` | `false` | Marks the field invalid: red border and errorText shown. |
| `disabled` | `boolean` | `false` | Blocks interaction and dims the field. |

Also accepts any native `<button>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<button>`. `className` and `style` go on the outermost element.

**Accessibility** - role `dialog`, keyboard operable. Trigger uses aria-haspopup="dialog" and aria-expanded; Popover uses role="dialog" with a label; Day cells are buttons with descriptive aria-labels; Escape closes the popover.

**Do:** Use for selecting a single calendar date; Highlight today and the selected day; Provide clear month navigation.
**Don't:** Do not use for free-form date typing without validation; Do not trap keyboard focus without an escape.

**Choosing a variant:**
- `error`: The date is missing or out of range. Say which date is allowed, such as an end date after the start date.
- `disabled`: The date does not apply with the current settings. Say what makes it available.

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
- Store and emit ISO `YYYY-MM-DD`, never a locale-formatted string. Show it as people read a date: "19 Aug 2026", as Date Range Picker does.

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
  --muted-foreground:       var(--gray-700);
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

.inspera-datepicker {
  display: flex;
  flex-direction: column;
  gap: 4px;
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
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border-radius: var(--radius-sm);
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

/* The trigger and its panel share an anchor, so the calendar opens directly
   under the field whether or not a label sits above it. */
.inspera-datepicker__anchor { position: relative; }

.inspera-datepicker__trigger[data-invalid='true'],
.inspera-datepicker__trigger[data-invalid='true']:hover {
  border-color: var(--error);
  box-shadow: var(--effect-state-error);
}
.inspera-datepicker__trigger:disabled {
  background: var(--surface-disabled);
  opacity: 0.6;
  cursor: not-allowed;
}
.inspera-datepicker__trigger:disabled:hover { border-color: var(--border-control); }

.inspera-datepicker__error { font-size: 12px; color: var(--error); }

.inspera-datepicker__trigger .material-symbols-outlined {
  font-size: 20px;
  color: var(--action-active);
}

.inspera-datepicker__panel {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: var(--z-dropdown);
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


### File Upload

Upload files via drag-and-drop or browse. - category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { FileUpload } from '@inspera/components'

<FileUpload
  label="Attachments"
  accept="image/*,.pdf"
  helpText="PNG, JPG or PDF up to 10MB"
  onFiles={handleFiles}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | What to upload, e.g. "Attachments". The file input's accessible name. |
| `accept` | `string` | - | Accepted MIME types / extensions, e.g. "image/*,.pdf". Applies to drops too. |
| `multiple` | `boolean` | `false` | Allow more than one file. A drop of several is cut to the first when false. |
| `helpText` | `string` | - | Constraint hint, e.g. "PNG, JPG or PDF up to 10MB". Replaced by errorText when `error` is set. |
| `errorText` | `string` | - | Validation message, shown while `error` is true. |
| `error` | `boolean` | `false` | Marks the zone invalid: red border and `aria-invalid`. |
| `disabled` | `boolean` | `false` | Blocks interaction and dims the zone. |
| `onFiles` | `(files: File[]) => void` | - | Fired with the selected files, from both drop and browse. |

Also accepts any native `<input>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<input>`. `className` and `style` go on the outermost element.

**Accessibility** - role `button`, keyboard operable. Dropzone uses role="button" and is keyboard focusable; Enter / Space open the file browser; Provide an accessible label describing the action.

**Do:** Support both drag-and-drop and click-to-browse; State accepted file types and size limits; Give visible drag feedback.
**Don't:** Do not hide the option to browse; Do not leave out the accepted file types and size limit.

**Choosing a variant:**
- `multiple="false"`: One file, which a new upload replaces, such as invigilator instructions.
- `multiple`: Several files that go together, such as resources for a question set. List the files under the drop zone.
- `error`: The file can't be used. Say why and what to upload instead.
- `disabled`: Uploading isn't possible here, such as for someone who doesn't own the test. Say why.

**Deprecated aliases** (do not use): `Dropzone`, `File dropzone`, `Uploader`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- The zone is a `<label>` around a visually hidden `<input type="file">`. Clicking the zone opens the picker natively, and the input is the one focusable control, named by `aria-label` and described by the help text. Do not use a `<div role="button">` with the input inside it - that nests one control in another.
- Filter dropped files by the same `accept` and `multiple` rules as the picker, and reset the input value after each choice so picking the same file twice still fires.
- Border is 2px dashed `--border-control`; a 1px dash reads as a table rule at this size.
- The drag state and hover share one look: `--primary` border on a `--blue-100` wash. A drag shows it even in error, because the zone is about to take a new file; hover keeps the error red. Handle `dragover`, `dragleave` and `drop`, and `preventDefault` on dragover or the browser opens the file instead.
- Always state the constraint ("PNG, JPG or PDF up to 10MB") - a bare drop zone gives no way to know what will be rejected.
- Disabled dims the icon and the prompt to 0.6 and drops the link look from "browse", but not the help text: say there why uploading is not possible, and keep it readable.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:            #004080;
  --error:              #D32F2F;
  --white:              #ffffff;
  --gray-600:           #7A7A7A;
  --gray-700:           #595959;
  --blue-100:           #F0F7FF;
  --text-primary:       rgba(0, 0, 0, 0.87);
  --border-control:     var(--gray-600);
  --surface:            var(--white);
  --muted-foreground:   var(--gray-700);
  --radius-md:          8px;
  --focus-ring-width:   2px;
  --focus-ring-offset:  2px;
  --focus-ring-color:   var(--primary);
  --duration-fast:      100ms;
  --easing-standard:    cubic-bezier(0.2, 0, 0, 1);
  --font-sans:          'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-upload {
  /* Anchors the visually hidden input, so focusing it never scrolls the page. */
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 32px 24px;
  /* Dashed, and 2px - a 1px dashed border reads as a table rule at this size. */
  border: 2px dashed var(--border-control);
  border-radius: var(--radius-md);
  background: var(--surface);
  cursor: pointer;
  text-align: center;
  font-family: var(--font-sans);
  transition: all var(--duration-fast) var(--easing-standard);
}

/* The input inside has the focus; the zone draws the ring for it. */
.inspera-upload:has(.inspera-upload__input:focus-visible) {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.inspera-upload__icon {
  font-size: 40px;
  color: var(--primary);
}

.inspera-upload__prompt {
  font-size: 16px;
  color: var(--text-primary);
}

.inspera-upload__browse {
  color: var(--primary);
  font-weight: 600;
}

.inspera-upload__help {
  font-size: 12px;
  color: var(--muted-foreground);
}

/* The native input is the real control: visually hidden but focusable, and
   named by aria-label. A 0x0 input is skipped by some browsers' Tab order. */
.inspera-upload__input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.inspera-upload--error {
  border-color: var(--error);
}
.inspera-upload--error .inspera-upload__icon,
.inspera-upload--error .inspera-upload__help { color: var(--error); }

/* The pointer and a drag share one look. A drag shows even in error - the
   zone is about to take a new file - while hover keeps an error's red. */
.inspera-upload:not(.inspera-upload--disabled):not(.inspera-upload--error):hover,
.inspera-upload--dragging {
  border-color: var(--primary);
  background: var(--blue-100);
}
.inspera-upload--dragging .inspera-upload__icon { color: var(--primary); }

.inspera-upload--disabled {
  cursor: not-allowed;
}
/* Disabled dims the icon and the prompt, not the help text: it usually says
   why uploading is not possible, so it stays readable. "browse" stops looking
   like a link. */
.inspera-upload--disabled .inspera-upload__icon,
.inspera-upload--disabled .inspera-upload__prompt { opacity: 0.6; }
.inspera-upload--disabled .inspera-upload__browse { color: inherit; font-weight: inherit; }
```

```html
<!-- A <label> around the file input: clicking anywhere opens the picker
     natively, and the input stays the one focusable, named control. -->
<label class="inspera-upload" for="attachments">
  <span class="material-symbols-outlined inspera-upload__icon" aria-hidden="true">upload_file</span>
  <span class="inspera-upload__prompt" aria-hidden="true">
    Drag &amp; drop or <span class="inspera-upload__browse">browse</span>
  </span>
  <span class="inspera-upload__help" id="attachments-help">PNG, JPG or PDF up to 10MB</span>
  <input class="inspera-upload__input" id="attachments" type="file" accept="image/*,.pdf" multiple
         aria-label="Attachments" aria-describedby="attachments-help" />
</label>
```


### Rating

Capture or display a star rating. - category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Rating } from '@inspera/components'

<Rating
  label="Question difficulty"
  defaultValue={3}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | What is being rated, e.g. "Question difficulty". The accessible name; not shown. |
| `value` | `number` | - | Current rating. Controlled - pair with onChange. |
| `defaultValue` | `number` | `0` | Starting rating when uncontrolled. |
| `onChange` | `(value: number) => void` | - | Fired with the chosen rating; 0 when cleared. Not fired when readOnly. |
| `max` | `number` | `5` | Number of stars. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Star size. |
| `readOnly` | `boolean` | `false` | Display-only: announced as "4 of 5 stars", not as a set of choices. |
| `showValue` | `boolean` | `false` | Show the numeric value beside the stars. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

**Accessibility** - role `radiogroup`, keyboard operable. Container uses role="radiogroup" with an accessible label; Each star is a radio with aria-checked and an aria-label; Arrow keys adjust the rating.

**Do:** Use for feedback and review scores; Preview the rating on hover when interactive; Use read-only mode to show an average score.
**Don't:** Do not use for precise numeric input; Do not omit accessible labels on stars.

**Choosing a variant:**
- `size="Medium"`: A single rating people give in a form. The default size.
- `size="Small"`: Dense lists, such as rating each question in a review.
- `readOnly`: A rating people read but cannot change, such as the average of several reviews.
- `showValue`: The exact score matters, such as when people compare ratings down a list.

**Deprecated aliases** (do not use): `Star rating`, `Stars`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- One glyph - `star` - with the variable font's FILL axis at 0 or 1. Swapping to a different outline glyph changes the shape and makes the row jump on hover.
- Filled stars are `--warning` #EF6C00; empty ones `--border-control`. Stars are 28px (20px small) with a 2px gap.
- `role="radiogroup"` with `role="radio"` stars, a roving tabindex, and arrow keys that both move focus and set the value.
- Every star needs its own label ("3 stars"), or the control announces as five unlabelled radios.
- Hovering previews the rating up to the pointer; leaving restores the committed value.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:            #004080;
  --warning:            #EF6C00;
  --gray-600:           #7A7A7A;
  --gray-700:           #595959;
  --border-control:     var(--gray-600);
  --muted-foreground:   var(--gray-700);
  --radius-xs:          2px;
  --focus-ring-width:   2px;
  --focus-ring-offset:  2px;
  --focus-ring-color:   var(--primary);
  --font-mono:          'Noto Sans Mono', ui-monospace, SFMono-Regular, monospace;
}

.inspera-rating {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.inspera-rating__stars {
  display: inline-flex;
  gap: 2px;
}

.inspera-rating__star {
  font-size: 28px;
  line-height: 1;
  color: var(--border-control);
  /* Same glyph, different fill axis. Swapping to a "star_outline" glyph shifts
     the shape and makes the row jump as you hover across it. */
  font-variation-settings: 'FILL' 0;
  border-radius: var(--radius-xs);
  cursor: pointer;
}

.inspera-rating--small .inspera-rating__star { font-size: 20px; }

.inspera-rating__star--filled {
  color: var(--warning);
  font-variation-settings: 'FILL' 1;
}

.inspera-rating__star:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.inspera-rating--readonly .inspera-rating__star { cursor: default; }

.inspera-rating__value {
  font-size: 14px;
  color: var(--muted-foreground);
  font-family: var(--font-mono);
}
```

```html
<!-- Roving tabindex again: one tab stop, arrows move and set the value. -->
<div class="inspera-rating" role="radiogroup" aria-label="Rating">
  <div class="inspera-rating__stars">
    <span class="material-symbols-outlined inspera-rating__star inspera-rating__star--filled"
          role="radio" aria-checked="false" aria-label="1 star" tabindex="-1">star</span>
    <span class="material-symbols-outlined inspera-rating__star inspera-rating__star--filled"
          role="radio" aria-checked="false" aria-label="2 stars" tabindex="-1">star</span>
    <span class="material-symbols-outlined inspera-rating__star inspera-rating__star--filled"
          role="radio" aria-checked="true" aria-label="3 stars" tabindex="0">star</span>
    <span class="material-symbols-outlined inspera-rating__star"
          role="radio" aria-checked="false" aria-label="4 stars" tabindex="-1">star</span>
    <span class="material-symbols-outlined inspera-rating__star"
          role="radio" aria-checked="false" aria-label="5 stars" tabindex="-1">star</span>
  </div>
</div>
```


### OTP Input

Enter a one-time verification code. - category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { OtpInput } from '@inspera/components'

<OtpInput
  label="Verification code"
  defaultValue="123"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Names the code, e.g. "Verification code". Required: it labels the group. |
| `length` | `number` | `6` | Number of digit boxes. |
| `value` | `string` | - | Current code. Controlled - pair with onChange. |
| `defaultValue` | `string` | `''` | Starting code when uncontrolled. |
| `onChange` | `(value: string) => void` | - | Fired with the digits entered so far; complete when its length equals `length`. |
| `showLabel` | `boolean` | `false` | Render the visible label above the boxes. |
| `error` | `boolean` | `false` | Marks every box invalid: red border and `aria-invalid`. |
| `disabled` | `boolean` | `false` | Blocks input and dims the boxes. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

**Accessibility** - role `textbox`, keyboard operable. Each box has an aria-label "Digit N"; aria-invalid reflects the error state; Backspace moves focus to the previous box; paste distributes digits.

**Do:** Auto-advance focus as digits are entered; Support paste of the full code; Use a monospace font for even alignment.
**Don't:** Do not make people move between boxes by hand; Do not allow non-numeric characters.

**Choosing a variant:**
- `error`: The code is wrong or has expired. Say what to do next, such as check the code or send a new one.
- `disabled`: Entry is paused, such as after too many tries. Say when people can try again.

**Deprecated aliases** (do not use): `PIN input`, `Verification code`, `Code input`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- One `<input>` per digit, 44x48, `--radius-sm`, in `--font-mono` at 20px so the digits do not shift as they are typed.
- `autocomplete="one-time-code"` goes on the first box only, and `off` on the rest. On every box the platform offers the code once per field.
- Wrap the boxes in `role="group"` named for the code ("Verification code"); each box is `aria-label="Digit N of 6"` with `inputmode="numeric"`.
- Keep one slot per box: a digit typed into box 3 stays in box 3, and Backspace clears only its own box. Storing the code as one string collapses the gaps.
- Wire the behaviour: typing advances focus, Backspace on an empty box moves back and clears, arrows move between boxes, and a paste on any box fills the rest.
- Focus is per box - do not ring the whole row.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --error:                  #D32F2F;
  --white:                  #ffffff;
  --gray-600:               #7A7A7A;
  --gray-800:               #404040;
  --blue-300:               #B3D9FF;
  --red-300:                #F9B8B8;
  --text-primary:           rgba(0, 0, 0, 0.87);
  --border-control:         var(--gray-600);
  --border-control-strong:  var(--gray-800);
  --surface-disabled:       #F5F5F5;
  --radius-sm:              4px;
  --effect-state-focus:     0px 0px 0px 3px var(--blue-300);
  --effect-state-error:     0px 0px 0px 3px var(--red-300);
  --border-width-default:   1px;
  --duration-fast:          100ms;
  --easing-standard:        cubic-bezier(0.2, 0, 0, 1);
  --font-mono:              'Noto Sans Mono', ui-monospace, SFMono-Regular, monospace;
}

.inspera-otp {
  display: inline-flex;
  gap: 8px;
}

.inspera-otp__box {
  width: 44px;
  height: 48px;
  text-align: center;
  border: var(--border-width-default) solid var(--border-control);
  border-radius: var(--radius-sm);
  background: var(--white);
  /* Monospace so the digits do not shift as they are typed. */
  font-family: var(--font-mono);
  font-size: 20px;
  color: var(--text-primary);
  outline: none;
  transition:
    border-color var(--duration-fast) var(--easing-standard),
    box-shadow var(--duration-fast) var(--easing-standard);
}

.inspera-otp__box:hover { border-color: var(--border-control-strong); }

.inspera-otp__box:focus {
  border-color: var(--primary);
  box-shadow: var(--effect-state-focus);
}

.inspera-otp__box[data-invalid='true'] {
  border-color: var(--error);
  box-shadow: var(--effect-state-error);
}

.inspera-otp__box[data-disabled='true'] {
  background: var(--surface-disabled);
  opacity: 0.6;
}
```

```html
<!-- autocomplete="one-time-code" on the FIRST box only, so the platform
     offers the SMS code once rather than once per digit. -->
<div class="inspera-otp">
  <input class="inspera-otp__box" type="text" inputmode="numeric" maxlength="1"
         autocomplete="one-time-code" aria-label="Digit 1" />
  <input class="inspera-otp__box" type="text" inputmode="numeric" maxlength="1"
         autocomplete="off" aria-label="Digit 2" />
  <input class="inspera-otp__box" type="text" inputmode="numeric" maxlength="1"
         autocomplete="off" aria-label="Digit 3" />
</div>
```


### Number Input

Enter and adjust a numeric value with steppers. - category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { NumberInput } from '@inspera/components'

<NumberInput
  label="Duration"
  defaultValue={45}
  min={0}
  max={240}
  step={5}
  suffix="min"
  helpText="Between 0 and 240."
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Field label. Always required: it is the accessible name even when hidden. |
| `placeholder` | `string` | - | Hint shown when empty. |
| `value` | `number` | - | Current value. Controlled - pair with onChange. |
| `defaultValue` | `number` | - | Starting value when uncontrolled. |
| `onChange` | `(value: number) => void` | - | Fired with each committed value - valid, and within min/max. |
| `min` | `number` | - | Minimum allowed value. The decrease button turns off at it. |
| `max` | `number` | - | Maximum allowed value. The increase button turns off at it. |
| `step` | `number` | `1` | Increment applied by the steppers and arrow keys. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Height 32 / 40 (`--control-height-sm/md`), for the value box and both steppers. |
| `showLabel` | `boolean` | `true` | Render the visible label. When false, the label becomes `aria-label`. |
| `suffix` | `string` | - | Unit shown after the number inside the value box, e.g. "min" or "%". |
| `helpText` | `string` | - | Guidance shown below the field. Replaced by errorText when `error` is set. |
| `errorText` | `string` | - | Validation message, shown while `error` is true. |
| `error` | `boolean` | `false` | Marks the field invalid: red border, `aria-invalid`, errorText shown. |
| `disabled` | `boolean` | `false` | Blocks editing and dims the field and both steppers. |
| `readOnly` | `boolean` | `false` | Shows the value without allowing edits. The steppers turn off. |

Also accepts any native `<input>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<input>`. `className` and `style` go on the outermost element.

**Accessibility** - role `spinbutton`, keyboard operable. Input carries aria-invalid in the error state; Up / Down arrows increment and decrement by step; Stepper buttons are named "Decrease <label>" and "Increase <label>" and are disabled at min / max.

**Do:** Clamp values between min and max; Show the unit as an inline suffix; Use a sensible step for the quantity.
**Don't:** Do not use for codes or IDs - use Text Input; Do not hide the steppers when precise adjustment matters.

**Choosing a variant:**
- `size="Medium"`: Forms and settings. The default size.
- `size="Small"`: Dense rows, such as adding time for one candidate in Monitor.
- `readOnly`: The number matters but can't change now, such as the duration of a live test.
- `disabled`: The number is worked out from other settings, or does not apply. Say why in helpText.
- `error`: The number is outside its limits. Say which range is allowed.

**Deprecated aliases** (do not use): `Stepper`, `Spinner input`, `Quantity picker`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- Three separate controls in a row, 8px apart: a decrease button, the value box, an increase button. The steppers sit outside the box, not inside its border.
- The steppers are icon-only Primary buttons (`remove` and `add`), square at the field height: 40px, or 32px for Small. Each is named "Decrease <label>" / "Increase <label>" and is disabled at min / max, or when the field is disabled or read-only.
- The value box is at least 80px wide, with the number and its unit centred together ("45 min"). Size the `<input>` to its characters (`width: calc(<n>ch + 2px)`) with tabular figures, and give the unit the same 16px `--text-primary` as the number.
- Hide the native spinner (`appearance: textfield` plus the `-webkit` pseudo-elements): it doubles up with the steppers, and in Chrome it keeps a 14px slot that clips the number.
- Resting border is `--border-control`, going `--border-control-strong` on hover and `--primary` with `--effect-state-focus` on `:focus-within`.
- Clamp to min / max and emit a real `number`, not a string. Up / Down arrows step like the buttons.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --error:                  #D32F2F;
  --success:                #2E7D32;
  --white:                  #ffffff;
  --gray-100:               #F7F7F7;
  --gray-600:               #7A7A7A;
  --gray-700:               #595959;
  --gray-800:               #404040;
  --gray-900:               #272727;
  --blue-300:               #B3D9FF;
  --red-300:                #F9B8B8;
  --orange-600:             #F2A202;
  --text-primary:           rgba(0, 0, 0, 0.87);
  --border-control:         var(--gray-600);
  --border-control-strong:  var(--gray-800);
  --text-placeholder:       var(--gray-700);
  --surface-disabled:       #F5F5F5;
  --muted-foreground:       var(--gray-700);
  --control-height-sm:      32px;
  --control-height-md:      40px;
  --control-height-lg:      44px;
  --radius-sm:              4px;
  --effect-state-focus:     0px 0px 0px 3px var(--blue-300);
  --effect-state-error:     0px 0px 0px 3px var(--red-300);
  --effect-button-shadow:   inset 0px -1px 0px rgba(0, 0, 0, 0.2), 0px 1px 0px rgba(0, 0, 0, 0.08);
  --border-width-default:   1px;
  --focus-ring-width:       2px;
  --focus-ring-offset:      2px;
  --focus-ring-color:       var(--primary);
  --duration-fast:          100ms;
  --easing-standard:        cubic-bezier(0.2, 0, 0, 1);
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

.inspera-number {
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
  max-width: 100%;
  vertical-align: top;
  font-family: var(--font-sans);
}

.inspera-number__label {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

/* Decrease, the value, increase: three separate controls, 8px apart. The
   steppers are the canonical icon-only Primary button. */
.inspera-number__row {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* The value box: the number and its unit centred together, never under 80px. */
.inspera-number__row > * { flex-shrink: 0; }

.inspera-number__field {
  height: var(--control-height-md);
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 0 8px;
  border-radius: var(--radius-sm);
  border: var(--border-width-default) solid var(--border-control);
  background: var(--white);
  cursor: text;
}

.inspera-number--small .inspera-number__field { height: var(--control-height-sm); }

.inspera-number__field:hover { border-color: var(--border-control-strong); }
.inspera-number__field:focus-within {
  border-color: var(--primary);
  box-shadow: var(--effect-state-focus);
}

/* Only as wide as what it holds - set width to (characters)ch + 2px - so the
   number and the unit read as one: "45 min". Tabular figures make every digit
   exactly 1ch. The UA spinner is hidden: it doubles up with the steppers, and
   Chrome keeps its slot even under appearance: textfield. */
.inspera-number__control {
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-sans);
  font-size: 16px;
  color: var(--text-primary);
  text-align: center;
  font-variant-numeric: tabular-nums;
  cursor: inherit;
  appearance: textfield;
  -webkit-appearance: textfield;
}
.inspera-number__control::placeholder { color: var(--text-placeholder); opacity: 1; }
.inspera-number__control::-webkit-outer-spin-button,
.inspera-number__control::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

.inspera-number__suffix {
  font-family: var(--font-sans);
  font-size: 16px;
  color: var(--text-primary);
}

.inspera-number__help  { font-size: 12px; color: var(--muted-foreground); }
.inspera-number__error { font-size: 12px; color: var(--error); }

/* Invalid outranks hover and focus - the error has to stay legible. */
.inspera-number__field[data-invalid='true'],
.inspera-number__field[data-invalid='true']:hover,
.inspera-number__field[data-invalid='true']:focus-within {
  border-color: var(--error);
  box-shadow: var(--effect-state-error);
}
.inspera-number__field[data-disabled='true'] {
  background: var(--surface-disabled);
  opacity: 0.6;
  cursor: not-allowed;
}
.inspera-number__field[data-readonly='true'] { background: var(--gray-100); }
.inspera-number__field[data-readonly='true']:hover { border-color: var(--border-control); }
```

```html
<div class="inspera-number">
  <label class="inspera-number__label" for="duration">Duration</label>
  <div class="inspera-number__row">
    <button type="button" class="inspera-btn inspera-btn--primary inspera-btn--icon-only" aria-label="Decrease Duration">
      <span class="material-symbols-outlined" aria-hidden="true">remove</span>
    </button>
    <div class="inspera-number__field">
      <input class="inspera-number__control" id="duration" type="number" inputmode="numeric"
             min="0" max="240" step="5" value="45" style="width: calc(2ch + 2px)" />
      <span class="inspera-number__suffix">min</span>
    </div>
    <button type="button" class="inspera-btn inspera-btn--primary inspera-btn--icon-only" aria-label="Increase Duration">
      <span class="material-symbols-outlined" aria-hidden="true">add</span>
    </button>
  </div>
</div>
```


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


### Date Range Picker

Select a start and end date from a calendar. - category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { DateRangePicker } from '@inspera/components'

<DateRangePicker
  label="Test window"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Field label. Always required: it is the accessible name even when hidden. |
| `value` | `DateRange` | - | Selected range. Controlled - pair with onChange. |
| `defaultValue` | `DateRange` | - | Starting range when uncontrolled. |
| `onChange` | `(range: DateRange) => void` | - | Fired with the range once both ends are chosen. |
| `open` | `boolean` | - | Calendar open state. Controlled - pair with onOpenChange. |
| `defaultOpen` | `boolean` | `false` | Open the calendar initially, when uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | - | Fired when the calendar opens or closes. |
| `placeholder` | `string` | `'Select a range'` | Trigger text when no range is chosen. |
| `showLabel` | `boolean` | `true` | Render the visible label. When false, the label becomes `aria-label`. |
| `helpText` | `string` | - | Guidance shown below the field. Replaced by errorText when `error` is set. |
| `errorText` | `string` | - | Validation message, shown while `error` is true. |
| `error` | `boolean` | `false` | Marks the field invalid: red border and errorText shown. |
| `disabled` | `boolean` | `false` | Blocks interaction and dims the field. |

Also accepts any native `<button>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<button>`. `className` and `style` go on the outermost element.

```ts
export interface DateRange {
  /** Range start (YYYY-MM-DD). */
  start: string
  /** Range end (YYYY-MM-DD), on or after start. */
  end: string
}
```

**Accessibility** - role `dialog`, keyboard operable. Trigger uses aria-haspopup and aria-expanded; Calendar opens in a role="dialog" popover; Day cells use aria-pressed to mark the selected range.

**Do:** Show two months for cross-month ranges; Highlight the full span between endpoints; Confirm the range only once both ends are chosen.
**Don't:** Do not use for a single date - use Date Picker; Do not allow an end date before the start date.

**Choosing a variant:**
- `error`: The range is incomplete or impossible, such as a window that ends before it starts. Say what to fix.
- `disabled`: The range is set somewhere else, such as by the exam office. Say who sets it.

**Deprecated aliases** (do not use): `Range calendar`, `Date range`, `Period picker`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- The reusable surface is the closed trigger; the calendar it opens is a `role="dialog"` popover on `--surface` with `--shadow-200`, anchored under the trigger.
- The popover shows two months side by side (each a `repeat(7, 1fr)` grid) so a range that crosses a month boundary is visible without paging.
- The two endpoints are filled `--primary` with white text; every day between them is filled `--blue-100`. First click sets the start, second click sets the end and closes.
- The trigger shows "start - end" once both are chosen (`__value--set`), placeholder text otherwise. Store and emit ISO `YYYY-MM-DD`.
- Trigger chrome matches the other fields: 40px, `--radius-sm`, `--border-control` to `--primary` with `--effect-state-focus`.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --error:                  #D32F2F;
  --white:                  #ffffff;
  --gray-600:               #7A7A7A;
  --gray-700:               #595959;
  --gray-800:               #404040;
  --blue-300:               #B3D9FF;
  --red-300:                #F9B8B8;
  --action-active:          rgba(0, 0, 0, 0.56);
  --text-primary:           rgba(0, 0, 0, 0.87);
  --border-control:         var(--gray-600);
  --border-control-strong:  var(--gray-800);
  --text-placeholder:       var(--gray-700);
  --surface-disabled:       #F5F5F5;
  --radius-sm:              4px;
  --effect-state-focus:     0px 0px 0px 3px var(--blue-300);
  --effect-state-error:     0px 0px 0px 3px var(--red-300);
  --border-width-default:   1px;
  --font-sans:              'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-daterange {
  display: flex;
  flex-direction: column;
  gap: 4px;
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
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border-radius: var(--radius-sm);
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

/* The trigger and its panel share an anchor, so the calendar opens directly
   under the field whether or not a label sits above it. */
.inspera-daterange__anchor { position: relative; }

.inspera-daterange__trigger[data-invalid='true'],
.inspera-daterange__trigger[data-invalid='true']:hover {
  border-color: var(--error);
  box-shadow: var(--effect-state-error);
}
.inspera-daterange__trigger:disabled {
  background: var(--surface-disabled);
  opacity: 0.6;
  cursor: not-allowed;
}
.inspera-daterange__trigger:disabled:hover { border-color: var(--border-control); }

.inspera-daterange__error { font-size: 12px; color: var(--error); }

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

