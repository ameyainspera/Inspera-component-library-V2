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
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | The badge text. One or two words. |
| `intent` | `'Neutral' \| 'Info' \| 'Success' \| 'Warning' \| 'Error'` | `'Neutral'` | Semantic colour. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Height 20 / 24. |
| `withIcon` | `boolean` | `false` | Show a leading status icon. |
| `icon` | `string` | - | Material Symbols name shown before the label when withIcon is set. |

Also accepts any native `<span>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<span>`. `className` and `style` go on the outermost element.

**Accessibility** - role `status`. Use aria-label for icon-only badges; Use role="status" for dynamic count badges.

**Do:** Use for status indicators and counts; Keep labels short - 1 to 2 words; Use each intent for the same meaning everywhere.
**Don't:** Do not use for long text; Do not make badges interactive - use Tag or Button.

**Choosing a variant:**
- `intent="Neutral"`: A status with no judgement, such as Draft or Archived.
- `intent="Info"`: Something upcoming or for information, such as Scheduled.
- `intent="Success"`: A good or finished state, such as Live or Graded.
- `intent="Warning"`: Needs attention soon, such as Needs grading.
- `intent="Error"`: Something has gone wrong, such as Overdue or Failed.
- `size="Medium"`: Next to a page or card title.
- `size="Small"`: Inside dense rows, such as the status column of a table.

**Deprecated aliases** (do not use): `Status Badge`, `Tag`, `Chip`

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

- Height is 24px (20px small) and the radius is a full pill - not `rounded-md`.
- Type is 12px/500 at both sizes; Small changes height and padding only.
- Neutral is `--surface-neutral` with `--gray-900` text, not a grey chip with white text.
- Every intent pairs a `*-surface` tint with the matching solid as the text colour.
- The icon is Material Symbols Outlined with `FILL 1`, at 16px (14px small).
- Static text, not a live region: `role="status"` on every badge makes a table of 50 rows announce 50 times. Announce a status change once, from where it happened.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --gray-900:         #272727;
  --blue-800:         #004080;
  --green-800:        #106542;
  --red-700:          #A50D0D;
  --orange-800:       #7E5501;
  --info-surface:     #E1F5FE;
  --success-surface:  #E8F5E9;
  --warning-surface:  #FFF3E0;
  --error-surface:    #FFEBEE;
  --info-text:        var(--blue-800);
  --success-text:     var(--green-800);
  --warning-text:     var(--orange-800);
  --error-text:       var(--red-700);
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
.inspera-badge--info    { --badge-bg: var(--info-surface);    --badge-fg: var(--info-text); }
.inspera-badge--success { --badge-bg: var(--success-surface); --badge-fg: var(--success-text); }
.inspera-badge--warning { --badge-bg: var(--warning-surface); --badge-fg: var(--warning-text); }
.inspera-badge--error   { --badge-bg: var(--error-surface);   --badge-fg: var(--error-text); }

/* The icon is filled, not outlined, at 16px (14px in a small badge). */
.inspera-badge .material-symbols-outlined {
  font-size: 16px;
  font-variation-settings: 'FILL' 1;
}
.inspera-badge--small .material-symbols-outlined { font-size: 14px; }
```

```html
<span class="inspera-badge inspera-badge--success">Live</span>

<span class="inspera-badge inspera-badge--neutral inspera-badge--small">Draft</span>

<!-- With an icon. Material Symbols Outlined, filled - never another set. -->
<span class="inspera-badge inspera-badge--error">
  <span class="material-symbols-outlined" aria-hidden="true">error</span>
  Failed
</span>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
