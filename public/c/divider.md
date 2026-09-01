<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Divider

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

### Divider

Separate content with a thin rule. - category: `data-display`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Divider } from '@inspera/components'

<Divider
  orientation="Horizontal"
  spacing="Default"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'Horizontal' \| 'Vertical'` | `'Horizontal'` | Divider direction. |
| `label` | `string` | - | Optional centered label (horizontal only). |
| `spacing` | `'Compact' \| 'Default' \| 'Spacious'` | `'Default'` | Surrounding margin. |

**Accessibility** - role `separator`. Use role="separator" with aria-orientation; Purely decorative dividers may be aria-hidden.

**Do:** Use to group and separate related content; Use a labeled divider to introduce a section; Keep dividers hairline-thin.
**Don't:** Do not overuse dividers where whitespace suffices; Do not use heavy rules.

**Deprecated aliases** (do not use): `Separator`, `Rule`, `HR`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- The rule is 1px of `--border` as a background, not a border. A bare `<hr>` keeps the browser default and renders as a grey groove.
- Spacing is margin on the divider itself: 16px default, 8px compact, 24px spacious - on the block axis horizontally, the inline axis vertically.
- A labelled divider is a flex row of rule / label / rule, with the label at 13px `--muted-foreground`. It is not text laid over a line.
- Always carry `role="separator"` and `aria-orientation`; a labelled one also needs `aria-label`.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --gray-200:          #EDEDED;
  --gray-600:          #7A7A7A;
  --border:            var(--gray-200);
  --muted-foreground:  var(--gray-600);
  --font-sans:         'Inter', system-ui, -apple-system, sans-serif;
}

/* Horizontal, unlabelled. The border reset matters: a bare <hr> keeps the
   browser's inset border and renders as a two-tone groove. */
.inspera-divider {
  border: none;
  height: 1px;
  width: 100%;
  background: var(--border);
  margin: 16px 0;
}

.inspera-divider--compact  { margin: 8px 0; }
.inspera-divider--spacious { margin: 24px 0; }

/* Vertical: a 1px column that stretches to its flex parent. */
.inspera-divider--vertical {
  display: inline-block;
  width: 1px;
  height: auto;
  align-self: stretch;
  min-height: 1em;
  background: var(--border);
  margin: 0 16px;
}
.inspera-divider--vertical.inspera-divider--compact  { margin: 0 8px; }
.inspera-divider--vertical.inspera-divider--spacious { margin: 0 24px; }

/* Labelled: a flex row whose rules grow to fill either side of the text. */
.inspera-divider--labelled {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: auto;
  background: none;
  margin: 16px 0;
  font-family: var(--font-sans);
}
.inspera-divider--labelled.inspera-divider--compact  { margin: 8px 0; }
.inspera-divider--labelled.inspera-divider--spacious { margin: 24px 0; }

.inspera-divider__rule {
  flex: 1;
  height: 1px;
  background: var(--border);
}

.inspera-divider__label {
  font-size: 13px;
  color: var(--muted-foreground);
  white-space: nowrap;
}
```

```html
<hr class="inspera-divider" role="separator" aria-orientation="horizontal" />

<!-- Vertical, inside a flex row. -->
<span class="inspera-divider inspera-divider--vertical" role="separator" aria-orientation="vertical"></span>

<!-- Labelled: the label names the separator for assistive tech too. -->
<div class="inspera-divider inspera-divider--labelled" role="separator" aria-orientation="horizontal" aria-label="OR">
  <span class="inspera-divider__rule"></span>
  <span class="inspera-divider__label">OR</span>
  <span class="inspera-divider__rule"></span>
</div>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
