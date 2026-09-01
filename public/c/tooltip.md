<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Tooltip

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

### Tooltip

Provide contextual help on hover or focus. - category: `feedback`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Tooltip } from '@inspera/components'

<Tooltip
  content="Supplementary help text"
  placement="Top"
  theme="Dark"
  type="Default"
>
  <IconButton icon="help" />
</Tooltip>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | `string` | `'Supplementary help text'` | The hint text. Keep it short; never put essential information here alone. |
| `placement` | `'Top' \| 'Bottom' \| 'Left' \| 'Right'` | `'Top'` | Position relative to the trigger. |
| `theme` | `'Light' \| 'Dark'` | `'Dark'` | Surface color. |
| `type` | `'Default' \| 'Accessibility'` | `'Default'` | Accessibility type uses larger text. |
| `children` | `ReactNode` | - | The element the tooltip describes. |
| `forceVisible` | `boolean` | `false` | Keep the tooltip visible regardless of hover - used for documentation. |

**Accessibility** - role `tooltip`, keyboard operable. Use role="tooltip" on the tooltip element; Link trigger and tooltip with aria-describedby; Escape key dismisses the tooltip; Tooltip must not contain interactive content.

**Do:** Use for supplementary information; Keep tooltip text short and scannable; Position to avoid clipping viewport edges.
**Don't:** Do not put critical information only in tooltips; Do not use for interactive content - use Popover instead.

**Deprecated aliases** (do not use): `Tooltips`, `Walkthrough`, `a11y tooltips`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- The trigger points at the bubble with `aria-describedby`, and the bubble is `role="tooltip"`. A custom trigger needs that attribute too - the tooltip is not announced without it.
- Show on `:hover` **and** `:focus-within`. A hint only a mouse can reach is unreachable for anyone navigating by keyboard.
- The bubble takes `pointer-events: none` so it can never sit between the pointer and what it describes.
- Dark is `--gray-900` with white text and no border; Light is white with a 1px `--border-strong`, and the arrow has to pick up that border on its two trigger-facing edges.
- Default type is 12px; the accessibility type is 14px with more padding, for hints that carry real instruction.
- Escape must dismiss it (WCAG 1.4.13), and nothing essential may live only here - a tooltip is supplementary by definition.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --white:          #ffffff;
  --gray-300:       #D9D9D9;
  --gray-900:       #272727;
  --action-active:  rgba(0, 0, 0, 0.56);
  --text-primary:   rgba(0, 0, 0, 0.87);
  --border-strong:  var(--gray-300);
  --radius-sm:      4px;
  --radius-pill:    9999px;
  --shadow-100:     0px 4px 4px rgba(39, 39, 39, 0.08), 0px 2px 4px rgba(39, 39, 39, 0.12);
  --z-tooltip:      800;
  --font-sans:      'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-tooltip {
  position: relative;
  display: inline-flex;
}

.inspera-tooltip__bubble {
  position: absolute;
  max-width: 240px;
  width: max-content;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  background: var(--gray-900);
  color: var(--white);
  border: none;
  font-family: var(--font-sans);
  font-size: 12px;
  line-height: 1.4;
  box-shadow: var(--shadow-100);
  z-index: var(--z-tooltip, 30);
  /* Never a pointer target: hovering the hint must not keep it open, and it
     must never sit between the pointer and the thing it describes. */
  pointer-events: none;
  opacity: 0;
  transition: opacity 140ms ease;
}

/* Shown on hover and on keyboard focus. Focus is not optional - a hint only
   available to a mouse is unreachable for half the people who need it. */
.inspera-tooltip:hover .inspera-tooltip__bubble,
.inspera-tooltip:focus-within .inspera-tooltip__bubble { opacity: 1; }

/* The accessibility type is larger, for hints that carry real instruction. */
.inspera-tooltip__bubble--accessibility { padding: 10px 12px; font-size: 14px; }

.inspera-tooltip__bubble--light {
  background: var(--white);
  color: var(--text-primary);
  border: 1px solid var(--border-strong);
}

.inspera-tooltip__bubble--top    { bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); }
.inspera-tooltip__bubble--bottom { top: calc(100% + 8px); left: 50%; transform: translateX(-50%); }
.inspera-tooltip__bubble--left   { right: calc(100% + 8px); top: 50%; transform: translateY(-50%); }
.inspera-tooltip__bubble--right  { left: calc(100% + 8px); top: 50%; transform: translateY(-50%); }

.inspera-tooltip__arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--gray-900);
  transform: rotate(45deg);
  z-index: 31;
}

.inspera-tooltip__bubble--light .inspera-tooltip__arrow { background: var(--white); }

.inspera-tooltip__bubble--top .inspera-tooltip__arrow {
  bottom: -4px; left: 50%; margin-left: -4px;
  border-right: 1px solid transparent; border-bottom: 1px solid transparent;
}
.inspera-tooltip__bubble--bottom .inspera-tooltip__arrow {
  top: -4px; left: 50%; margin-left: -4px;
  border-left: 1px solid transparent; border-top: 1px solid transparent;
}
.inspera-tooltip__bubble--left .inspera-tooltip__arrow {
  right: -4px; top: 50%; margin-top: -4px;
  border-right: 1px solid transparent; border-top: 1px solid transparent;
}
.inspera-tooltip__bubble--right .inspera-tooltip__arrow {
  left: -4px; top: 50%; margin-top: -4px;
  border-left: 1px solid transparent; border-bottom: 1px solid transparent;
}

.inspera-tooltip__bubble--light.inspera-tooltip__bubble--top .inspera-tooltip__arrow {
  border-right-color: var(--border-strong); border-bottom-color: var(--border-strong);
}
.inspera-tooltip__bubble--light.inspera-tooltip__bubble--bottom .inspera-tooltip__arrow {
  border-left-color: var(--border-strong); border-top-color: var(--border-strong);
}
.inspera-tooltip__bubble--light.inspera-tooltip__bubble--left .inspera-tooltip__arrow {
  border-right-color: var(--border-strong); border-top-color: var(--border-strong);
}
.inspera-tooltip__bubble--light.inspera-tooltip__bubble--right .inspera-tooltip__arrow {
  border-left-color: var(--border-strong); border-bottom-color: var(--border-strong);
}

.inspera-tooltip__default-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-strong);
  background: var(--white);
  font-family: var(--font-sans);
  cursor: help;
}
.inspera-tooltip__default-trigger .material-symbols-outlined {
  font-size: 20px;
  color: var(--action-active);
}
```

```html
<span class="inspera-tooltip">
  <button type="button" class="inspera-tooltip__default-trigger" aria-describedby="tip-1">
    <span class="material-symbols-outlined" aria-hidden="true">help</span>
  </button>
  <span class="inspera-tooltip__bubble inspera-tooltip__bubble--top" id="tip-1" role="tooltip">
    Supplementary help text
    <span class="inspera-tooltip__arrow" aria-hidden="true"></span>
  </span>
</span>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
