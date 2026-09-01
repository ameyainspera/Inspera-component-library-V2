<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Link

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

### Link

Navigate to another location or resource. - category: `navigation`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Link } from '@inspera/components'

<Link
  href="/docs"
  label="Learn more"
  intent="Default"
  size="Medium"
  underline="Hover"
  external={false}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | - | Link text. Takes precedence over label. |
| `label` | `string` | `'Learn more'` | Link text, when not passing children. |
| `href` | `string` | `'#'` | Destination URL. Always provide a real one. |
| `intent` | `'Default' \| 'Muted'` | `'Default'` | Color emphasis. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Text size. |
| `underline` | `'Always' \| 'Hover' \| 'None'` | `'Hover'` | Underline behavior. |
| `external` | `boolean` | `false` | Open in a new tab with an icon. |
| `disabled` | `boolean` | `false` | Non-interactive state. |
| `leadingIcon` | `string` | - | Material Symbols name shown before the text. |
| `trailingIcon` | `string` | - | Material Symbols name shown after the text. |
| `onClick` | `(e: React.MouseEvent) => void` | - | Fired on activation. Use for routing, not to replace href. |

**Accessibility** - role `link`, keyboard operable. Use a real anchor with a valid href; External links set target="_blank" and rel="noreferrer"; Disabled links set aria-disabled and prevent navigation; Focus ring is visible on keyboard focus.

**Do:** Use for navigation, not actions; Signal external links with an icon; Keep link text descriptive.
**Don't:** Do not use links to trigger actions - use Button; Do not use "click here" as link text.

**Deprecated aliases** (do not use): `Hyperlink`, `Text link`, `Anchor`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- The default is underline **on hover only** - not always, and not never.
- Colour is `--primary` at 16px/500 (14px when small), with `text-underline-offset: 2px` so the rule clears the descenders.
- An external link gets `target="_blank"`, `rel="noreferrer"`, and the `open_in_new` icon. All three, not one.
- A disabled link carries no `href` and sets `aria-disabled="true"`. Do not leave the href and swallow the click.
- The focus ring is `--primary-focus-ring` at 2px with a 2px offset - different from the solid `--primary` ring buttons use.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:             #004080;
  --gray-600:            #7A7A7A;
  --primary-focus-ring:  rgba(0, 64, 128, 0.3);
  --action-disabled:     rgba(0, 0, 0, 0.38);
  --radius-xs:           2px;
  --duration-fast:       100ms;
  --easing-standard:     cubic-bezier(0.2, 0, 0, 1);
  --font-sans:           'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--primary);
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  text-underline-offset: 2px;
  border-radius: var(--radius-xs);
  cursor: pointer;
  transition: color var(--duration-fast) var(--easing-standard);
}

.inspera-link--small { font-size: 14px; }

.inspera-link--muted { color: var(--gray-600); }

/* Underline behaviour. Hover is the default; the other two are explicit. */
.inspera-link:hover { text-decoration: underline; }
.inspera-link--underline-always { text-decoration: underline; }
.inspera-link--underline-none:hover { text-decoration: none; }

.inspera-link:focus-visible {
  outline: 2px solid var(--primary-focus-ring);
  outline-offset: 2px;
}

/* Disabled: no href, announced with aria-disabled. A link with no href is not
   focusable, which is the behaviour you want. */
.inspera-link--disabled {
  color: var(--action-disabled);
  cursor: not-allowed;
  text-decoration: none;
}
.inspera-link--disabled:hover { text-decoration: none; }

.inspera-link .material-symbols-outlined { font-size: 18px; }
.inspera-link--small .material-symbols-outlined { font-size: 16px; }
```

```html
<a class="inspera-link" href="/docs">Learn more</a>

<!-- External links open in a new tab and say so with an icon. -->
<a class="inspera-link" href="https://inspera.com" target="_blank" rel="noreferrer">
  Documentation
  <span class="material-symbols-outlined" aria-hidden="true">open_in_new</span>
</a>

<a class="inspera-link inspera-link--muted inspera-link--small" href="/skip">Skip for now</a>

<!-- Disabled: no href at all. -->
<a class="inspera-link inspera-link--disabled" aria-disabled="true">Unavailable</a>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
