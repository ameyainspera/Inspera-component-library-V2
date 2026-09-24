<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Stepper

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

### Stepper

Show progress through a sequence of steps. - category: `navigation`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Stepper } from '@inspera/components'

<Stepper
  steps={[{ label: 'Details' }, { label: 'Questions' }, { label: 'Review' }]}
  activeStep={1}
  orientation="Horizontal"
  size="Medium"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `steps` | `Step[]` | `defaultSteps` | Ordered steps. |
| `activeStep` | `number` | `1` | Zero-based index of the current step. |
| `orientation` | `'Horizontal' \| 'Vertical'` | `'Horizontal'` | Layout direction. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Indicator size. |

```ts
export interface Step {
  label: string
  description?: string
}
```

**Accessibility** - role `list`. Use an ordered list for step semantics; Mark the current step with aria-current="step"; Convey completion with an icon, not color alone.

**Do:** Use for multi-step flows and wizards; Show completed, current, and upcoming states; Keep step labels short.
**Don't:** Do not use for non-sequential navigation - use Tabs; Do not exceed a handful of steps.

**Deprecated aliases** (do not use): `Wizard`, `Progress steps`, `Step indicator`

#### One-time setup

Paste this once, at the root of the project. Without it the component inherits
the host tool's fonts and any icon renders as its own name instead of a glyph.

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Noto+Sans+Mono:wght@400;500&family=Noto+Serif:wght@400;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');

.material-symbols-outlined,
.material-symbols-rounded,
.material-symbols-sharp {
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
}

.material-symbols-outlined { font-family: 'Material Symbols Outlined'; }
.material-symbols-rounded  { font-family: 'Material Symbols Rounded'; }
.material-symbols-sharp    { font-family: 'Material Symbols Sharp'; }
```

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- It is an `<ol>`: the order is the meaning. The current step carries `aria-current="step"`.
- Steps take `flex: 1 1 auto`, never `flex: 1`. A zero basis gives every step the same total width, so a long label ends up with a stub connector while a short one gets a long run.
- Keep steps top-aligned. Centring makes the connector sit against the full step height and render down at label level instead of through the circles.
- The connector is offset by half the circle (`margin-top: 15px`, or 11px small) so it passes through the centres.
- Completed and current share the `--primary` fill; only the current one gets the 4px `--primary-focus-ring` halo. Completed shows a tick, upcoming shows its number.
- Indicators are 32px (24px small) and the connector is 2px, filled `--primary` behind completed steps and `--border` ahead of them.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:             #004080;
  --white:               #ffffff;
  --gray-200:            #EDEDED;
  --gray-300:            #D9D9D9;
  --gray-600:            #7A7A7A;
  --primary-focus-ring:  rgba(0, 64, 128, 0.3);
  --text-primary:        rgba(0, 0, 0, 0.87);
  --border:              var(--gray-200);
  --border-strong:       var(--gray-300);
  --muted-foreground:    var(--gray-600);
  --radius-pill:         9999px;
  --font-sans:           'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-stepper {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 0;
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
  font-family: var(--font-sans);
}

.inspera-stepper--vertical {
  flex-direction: column;
  align-items: stretch;
  width: auto;
}

/* The step lays out body-then-connector along the stepper's own axis, so a
   horizontal stepper puts them in a row and a vertical one stacks them. Note
   this is the opposite of the body inside it, which stacks the circle over the
   label horizontally and sits them side by side vertically. */
.inspera-stepper__step {
  display: flex;
  flex-direction: row;
  /* Always top-aligned. Centring makes the horizontal connector sit against the
     full step height and render down at label level instead of through the
     circles. */
  align-items: flex-start;
  /* "1 1 auto", not "1": a zero basis gives every step the same total width, so
     a long label leaves a stub of a connector while a short one gets a long
     run. Growing from the content width shares the free space evenly. */
  flex: 1 1 auto;
  min-width: 0;
}

.inspera-stepper__step:last-child { flex: none; }
.inspera-stepper--vertical .inspera-stepper__step { flex-direction: column; flex: none; }

.inspera-stepper__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.inspera-stepper--vertical .inspera-stepper__body {
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
}

.inspera-stepper__indicator {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: var(--radius-pill);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  background: transparent;
  color: var(--gray-600);
  border: 2px solid var(--border-strong);
  box-shadow: none;
  transition: background 140ms ease, box-shadow 140ms ease;
}

.inspera-stepper--small .inspera-stepper__indicator { width: 24px; height: 24px; }

/* Done and current share the fill; only the current one gets the halo. */
.inspera-stepper__indicator--done,
.inspera-stepper__indicator--active {
  background: var(--primary);
  color: var(--white);
  border: none;
}

.inspera-stepper__indicator--active { box-shadow: 0 0 0 4px var(--primary-focus-ring); }

.inspera-stepper__indicator .material-symbols-outlined { font-size: 18px; }

.inspera-stepper__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: center;
}
.inspera-stepper--vertical .inspera-stepper__text { text-align: left; }

.inspera-stepper__label {
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-600);
}
.inspera-stepper--small .inspera-stepper__label { font-size: 13px; }

.inspera-stepper__step--done .inspera-stepper__label,
.inspera-stepper__step--active .inspera-stepper__label {
  font-weight: 600;
  color: var(--text-primary);
}

.inspera-stepper__description {
  font-size: 12px;
  color: var(--muted-foreground);
}

/* The connector is nudged by half the circle so it runs through the centres
   rather than under the labels. */
.inspera-stepper__connector {
  height: 2px;
  flex: 1;
  margin: 0 8px;
  margin-top: 15px;
  background: var(--border);
}

.inspera-stepper--small .inspera-stepper__connector { margin-top: 11px; }

.inspera-stepper__connector--done { background: var(--primary); }

.inspera-stepper--vertical .inspera-stepper__connector {
  width: 2px;
  height: auto;
  flex: 1;
  min-height: 20px;
  margin: 4px 0;
  margin-left: 15px;
}
.inspera-stepper--vertical.inspera-stepper--small .inspera-stepper__connector { margin-left: 11px; }
```

```html
<ol class="inspera-stepper" role="list">
  <li class="inspera-stepper__step inspera-stepper__step--done">
    <div class="inspera-stepper__body">
      <span class="inspera-stepper__indicator inspera-stepper__indicator--done" aria-hidden="true">
        <span class="material-symbols-outlined">check</span>
      </span>
      <span class="inspera-stepper__text">
        <span class="inspera-stepper__label">Details</span>
        <span class="inspera-stepper__description">Assessment info</span>
      </span>
    </div>
    <span class="inspera-stepper__connector inspera-stepper__connector--done" aria-hidden="true"></span>
  </li>
  <li class="inspera-stepper__step inspera-stepper__step--active" aria-current="step">
    <div class="inspera-stepper__body">
      <span class="inspera-stepper__indicator inspera-stepper__indicator--active" aria-hidden="true">2</span>
      <span class="inspera-stepper__text">
        <span class="inspera-stepper__label">Questions</span>
      </span>
    </div>
  </li>
</ol>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
