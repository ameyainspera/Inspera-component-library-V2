<!-- Inspera Design System v1.0.0 — generated file, do not edit. -->

# Inspera — Toggle

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

### Toggle

Switch a setting on or off instantly. — category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library — build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Toggle } from '@inspera/components'

<Toggle
  label="Enable notifications"
  checked={enabled}
  onChange={setEnabled}
  size="Medium"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Toggle setting'` | Text beside the switch describing the setting. |
| `checked` | `boolean` | — | On / off state. |
| `state` | `'Default' \| 'Hover' \| 'Focused' \| 'Disabled'` | `'Default'` | Freezes a visual state so documentation can show it without a pointer. `Hover` and `Focused` are presentation-only — leave them unset in application code, where CSS drives them from the real pointer and keyboard. `Disabled` is real application state and belongs in your code. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Track / thumb size. |
| `withLabel` | `boolean` | `true` | Render the label. |
| `onChange` | `(checked: boolean) => void` | — | Fired with the new on/off state. |

**Accessibility** — role `switch`, keyboard operable. Use role="switch" for the toggle; Use aria-checked to reflect on/off state; Space key toggles the switch.

**Do:** Use for immediate on/off settings; Provide a clear label describing the setting; Show the current state visually.
**Don't:** Do not use for form submissions — use Checkbox instead; Do not use without a visible label.

**Deprecated aliases** (do not use): `Switch`, `Toggle switch`

#### Without the package — exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- The input carries `role="switch"`. Without it the control announces as a checkbox, which promises a form value rather than an immediate change.
- Track 44×24 (36×20 small), thumb 20px (16px), 2px padding. Thumb travel is track − thumb − 2×padding: 20px, or 16px when small.
- The track fill is `--border-control` off and `--primary` on. It does not tint on hover — only the thumb shadow deepens.
- The focus ring goes on the track, since the real input is 0×0.
- A toggle applies immediately. If the change needs a Save button, use a Checkbox instead.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:            #004080;
  --white:              #ffffff;
  --text-primary:       rgba(0, 0, 0, 0.87);
  --border-control:     #C4C4C4;
  --radius-pill:        9999px;
  --focus-ring-width:   2px;
  --focus-ring-offset:  2px;
  --focus-ring-color:   var(--primary);
  --font-sans:          'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
}

.inspera-toggle__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.inspera-toggle__track {
  width: 44px;
  height: 24px;
  border-radius: var(--radius-pill);
  background: var(--border-control);
  padding: 2px;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  transition: background 140ms ease;
}

.inspera-toggle--small .inspera-toggle__track { width: 36px; height: 20px; }

.inspera-toggle__thumb {
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  background: var(--white);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  transform: translateX(0);
  transition: transform 160ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 120ms ease;
}

.inspera-toggle--small .inspera-toggle__thumb { width: 16px; height: 16px; }

.inspera-toggle__input:checked + .inspera-toggle__track { background: var(--primary); }

/* Travel is track − thumb − (2 × padding). */
.inspera-toggle__input:checked + .inspera-toggle__track .inspera-toggle__thumb {
  transform: translateX(20px);
}
.inspera-toggle--small .inspera-toggle__input:checked + .inspera-toggle__track .inspera-toggle__thumb {
  transform: translateX(16px);
}

.inspera-toggle:hover .inspera-toggle__thumb { box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); }

.inspera-toggle__input:focus-visible + .inspera-toggle__track {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.inspera-toggle--disabled { cursor: not-allowed; opacity: 0.38; }
```

```html
<label class="inspera-toggle" for="notify">
  <input class="inspera-toggle__input" id="notify" type="checkbox" role="switch" />
  <span class="inspera-toggle__track" aria-hidden="true">
    <span class="inspera-toggle__thumb"></span>
  </span>
  <span>Enable notifications</span>
</label>
```


---

Tokens: ./tokens.css · Full system: ./llms.txt
