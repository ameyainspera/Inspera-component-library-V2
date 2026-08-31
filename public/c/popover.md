<!-- Inspera Design System v1.0.0 — generated file, do not edit. -->

# Inspera — Popover

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

### Popover

Show interactive content anchored to a trigger. — category: `feedback`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library — build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Popover } from '@inspera/components'

<Popover
  placement="Bottom"
  title="Filter results"
  trigger={<Button label="Filters" />}
  content={<FilterForm />}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `trigger` | `ReactNode` | — | Element that toggles the popover. |
| `title` | `string` | `'Popover title'` | Optional panel heading. |
| `content` | `ReactNode` | `'Popover content with interactive elements.'` | Popover body content. |
| `placement` | `'Top' \| 'Bottom' \| 'Left' \| 'Right'` | `'Bottom'` | Position relative to the trigger. |
| `open` | `boolean` | — | Controlled open state. Leave unset to let the popover manage itself. |
| `defaultOpen` | `boolean` | `false` | Open on mount. |
| `forceVisible` | `boolean` | `false` | Keep the panel visible regardless of state — used for documentation. |
| `onOpenChange` | `(open: boolean) => void` | — | Fired when the popover opens or closes. |

**Accessibility** — role `dialog`, keyboard operable. Trigger uses aria-haspopup and aria-expanded; Panel uses role="dialog"; Escape and outside-click close the popover; May contain interactive content (unlike Tooltip).

**Do:** Use for rich, interactive overflow content; Anchor to the triggering element; Allow dismissal via Escape and outside click.
**Don't:** Do not use for simple hover hints — use Tooltip; Do not stack popovers.

**Deprecated aliases** (do not use): `Flyout`, `Overlay panel`

#### Without the package — exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- A popover holds interactive content, so it is `role="dialog"` (not `tooltip`), it is reachable by keyboard, and it does not disappear on mouseout.
- The panel is `--radius-md` on `--surface` with a 1px `--border` and `--shadow-300`, 16px padding, capped at 280px with `width: max-content`.
- Placement sets the offset and the centring transform together; the 10px gap leaves room for the arrow without it touching the trigger.
- The arrow is a 10px square rotated 45° that borrows exactly two of the panel’s borders — the two facing the trigger.
- Close on Escape and on an outside click, and return focus to the trigger.
- For plain text with no controls, use a Tooltip. For anything that must be acted on, this.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --white:             #ffffff;
  --gray-200:          #EDEDED;
  --gray-300:          #D9D9D9;
  --gray-600:          #7A7A7A;
  --text-primary:      rgba(0, 0, 0, 0.87);
  --surface:           var(--white);
  --border:            var(--gray-200);
  --border-strong:     var(--gray-300);
  --muted-foreground:  var(--gray-600);
  --radius-sm:         4px;
  --radius-md:         8px;
  --shadow-300:        0px 8px 16px rgba(39, 39, 39, 0.08), 0px 6px 8px rgba(39, 39, 39, 0.12);
  --z-popover:         400;
  --font-sans:         'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-popover {
  position: relative;
  display: inline-flex;
}

.inspera-popover__trigger { display: inline-flex; }

.inspera-popover__panel {
  position: absolute;
  z-index: var(--z-popover, 40);
  max-width: 280px;
  width: max-content;
  padding: 16px;
  border-radius: var(--radius-md);
  background: var(--surface);
  color: var(--text-primary);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-300);
  text-align: left;
  font-family: var(--font-sans);
}

/* Placement sets the offset and the centring transform together — a 10px gap
   leaves room for the arrow without it touching the trigger. */
.inspera-popover__panel--bottom { top: calc(100% + 10px); left: 50%; transform: translateX(-50%); }
.inspera-popover__panel--top    { bottom: calc(100% + 10px); left: 50%; transform: translateX(-50%); }
.inspera-popover__panel--left   { right: calc(100% + 10px); top: 50%; transform: translateY(-50%); }
.inspera-popover__panel--right  { left: calc(100% + 10px); top: 50%; transform: translateY(-50%); }

/* The arrow is a rotated square that borrows two of the panel's borders. */
.inspera-popover__arrow {
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--surface);
  transform: rotate(45deg);
}

.inspera-popover__panel--bottom .inspera-popover__arrow {
  top: -5px; left: 50%; margin-left: -5px;
  border-left: 1px solid var(--border);
  border-top: 1px solid var(--border);
}
.inspera-popover__panel--top .inspera-popover__arrow {
  bottom: -5px; left: 50%; margin-left: -5px;
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.inspera-popover__panel--left .inspera-popover__arrow {
  right: -5px; top: 50%; margin-top: -5px;
  border-right: 1px solid var(--border);
  border-top: 1px solid var(--border);
}
.inspera-popover__panel--right .inspera-popover__arrow {
  left: -5px; top: 50%; margin-top: -5px;
  border-left: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.inspera-popover__title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
}

.inspera-popover__body {
  font-size: 14px;
  line-height: 1.5;
  color: var(--muted-foreground);
}

.inspera-popover__default-trigger {
  height: 40px;
  padding: 0 16px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-strong);
  background: var(--white);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
}
```

```html
<span class="inspera-popover">
  <span class="inspera-popover__trigger" aria-expanded="true"
        aria-haspopup="dialog" aria-controls="filters-popover">
    <button type="button" class="inspera-popover__default-trigger">Filters</button>
  </span>
  <div class="inspera-popover__panel inspera-popover__panel--bottom" id="filters-popover"
       role="dialog" aria-labelledby="filters-title">
    <span class="inspera-popover__arrow" aria-hidden="true"></span>
    <h3 class="inspera-popover__title" id="filters-title">Filter results</h3>
    <div class="inspera-popover__body">Popovers can hold interactive content.</div>
  </div>
</span>
```


---

Tokens: ./tokens.css · Full system: ./llms.txt
