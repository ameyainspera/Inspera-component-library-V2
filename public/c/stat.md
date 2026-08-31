<!-- Inspera Design System v1.0.0 — generated file, do not edit. -->

# Inspera — Stat

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

### Stat

Highlight a key metric with an optional trend. — category: `data-display`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library — build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Stat } from '@inspera/components'

<Stat
  label="Active candidates"
  value="12,480"
  delta="+8.2% vs last week"
  deltaIntent="up"
  icon="group"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | `'Average score'` | Metric name. |
| `value` **(required)** | `string \| number` | `'84%'` | Metric value. |
| `delta` | `string` | `'+4.2%'` | Change indicator text. |
| `deltaIntent` | `'up' \| 'down' \| 'neutral'` | `'up'` | Trend direction / color. |
| `icon` | `string` | — | Optional leading icon. |
| `helpText` | `string` | — | Optional context below the value, such as the comparison period. |

**Accessibility** — role `group`. Associate the value with its label for screen readers; Convey trend with text, not color alone; Use aria-label to summarize the metric and change.

**Do:** Use for dashboard summaries; Pair a value with a clear label; Indicate trend direction with an icon and text.
**Don't:** Do not rely on color alone for the delta; Do not crowd many stats without spacing.

**Deprecated aliases** (do not use): `Metric`, `KPI`, `Stat card`

#### Without the package — exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- The label is 12px/600 uppercase with 0.04em tracking in `--muted-foreground` — not body text.
- The value is 28px/600 at line-height 1.1. It is the only large type in the tile.
- The tile uses `--radius-lg` and a 1px `--border`, with no shadow.
- Trend colour is `--success` up, `--error` down, `--muted-foreground` flat, and always ships with the matching arrow so the direction is not colour-only.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --error:             #D32F2F;
  --success:           #2E7D32;
  --white:             #ffffff;
  --gray-200:          #EDEDED;
  --gray-600:          #7A7A7A;
  --text-primary:      rgba(0, 0, 0, 0.87);
  --border:            var(--gray-200);
  --muted-foreground:  var(--gray-600);
  --radius-lg:         12px;
  --font-sans:         'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-stat {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 200px;
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--white);
  font-family: var(--font-sans);
  color: var(--text-primary);
}

/* Label row: the metric name, with an optional icon pushed to the far end. */
.inspera-stat__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.inspera-stat__label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--muted-foreground);
}

.inspera-stat__head .material-symbols-outlined {
  font-size: 20px;
  color: var(--muted-foreground);
}

.inspera-stat__value {
  font-size: 28px;
  font-weight: 600;
  line-height: 1.1;
}

/* The delta carries the trend colour; the arrow is not decorative repetition,
   it is the direction for anyone who cannot rely on the colour alone. */
.inspera-stat__delta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
}
.inspera-stat__delta .material-symbols-outlined { font-size: 18px; }

.inspera-stat__delta--up      { color: var(--success); }
.inspera-stat__delta--down    { color: var(--error); }
.inspera-stat__delta--neutral { color: var(--muted-foreground); }
```

```html
<div class="inspera-stat">
  <div class="inspera-stat__head">
    <span class="inspera-stat__label">Active candidates</span>
    <span class="material-symbols-outlined" aria-hidden="true">group</span>
  </div>
  <span class="inspera-stat__value">12,480</span>
  <span class="inspera-stat__delta inspera-stat__delta--up">
    <span class="material-symbols-outlined" aria-hidden="true">trending_up</span>
    +8.2% vs last week
  </span>
</div>
```


---

Tokens: ./tokens.css · Full system: ./llms.txt
