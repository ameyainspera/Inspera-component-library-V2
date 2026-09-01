<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Badge

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

### Badge

Display a short status label or count. - category: `data-display`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Badge } from '@inspera/components'

<Badge
  label="Neutral"
  intent="Neutral"
  size="Medium"
  withIcon={false}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Badge'` | The badge text. One or two words. |
| `intent` | `'Neutral' \| 'Info' \| 'Success' \| 'Warning' \| 'Error'` | `'Neutral'` | Semantic color. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Height 20 / 24. |
| `withIcon` | `boolean` | `false` | Show a leading status icon. |
| `icon` | `string` | - | Material Symbols name shown before the label when withIcon is set. |

**Accessibility** - role `status`. Use aria-label for icon-only badges; Use role="status" for dynamic count badges.

**Do:** Use for status indicators and counts; Keep labels short - 1 to 2 words; Use intent colors consistently.
**Don't:** Do not use for long text content; Do not make badges interactive without clear affordance.

**Deprecated aliases** (do not use): `Status Badge`, `Tag`, `Chip`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- Height is 24px (20px small) and the radius is a full pill - not `rounded-md`.
- Type is 12px/500 at both sizes; Small changes height and padding only.
- Neutral is `--surface-neutral` with `--gray-900` text, not a grey chip with white text.
- Every intent pairs a `*-surface` tint with the matching solid as the text colour.
- The icon is Material Symbols Outlined with `FILL 1`, at 16px (14px small).

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --error:            #D32F2F;
  --warning:          #EF6C00;
  --info:             #0288D1;
  --success:          #2E7D32;
  --gray-900:         #272727;
  --info-surface:     #E1F5FE;
  --success-surface:  #E8F5E9;
  --warning-surface:  #FFF3E0;
  --error-surface:    #FFEBEE;
  --surface-neutral:  #F0F0F0;
  --radius-pill:      9999px;
  --font-sans:        'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-badge {
  /* Fill and text come from the intent modifier below. */
  --badge-bg: var(--surface-neutral);
  --badge-fg: var(--gray-900);

  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 24px;
  padding: 0 8px;
  border-radius: var(--radius-pill);
  background: var(--badge-bg);
  color: var(--badge-fg);
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
}

/* Small changes height and padding only - never the 12px type. */
.inspera-badge--small { height: 20px; padding: 0 6px; }

/* Neutral is written out even though it matches the base, so the class name
   stays correct if the default ever moves. */
.inspera-badge--neutral { --badge-bg: var(--surface-neutral); --badge-fg: var(--gray-900); }
.inspera-badge--info    { --badge-bg: var(--info-surface);    --badge-fg: var(--info); }
.inspera-badge--success { --badge-bg: var(--success-surface); --badge-fg: var(--success); }
.inspera-badge--warning { --badge-bg: var(--warning-surface); --badge-fg: var(--warning); }
.inspera-badge--error   { --badge-bg: var(--error-surface);   --badge-fg: var(--error); }

/* The icon is filled, not outlined, at 16px (14px in a small badge). */
.inspera-badge .material-symbols-outlined {
  font-size: 16px;
  font-variation-settings: 'FILL' 1;
}
.inspera-badge--small .material-symbols-outlined { font-size: 14px; }
```

```html
<span class="inspera-badge inspera-badge--success" role="status">Live</span>

<span class="inspera-badge inspera-badge--neutral inspera-badge--small" role="status">Draft</span>

<!-- With an icon. Material Symbols Outlined, filled - never another set. -->
<span class="inspera-badge inspera-badge--error" role="status">
  <span class="material-symbols-outlined" aria-hidden="true">error</span>
  Failed
</span>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
