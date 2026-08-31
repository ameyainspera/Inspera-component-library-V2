<!-- Inspera Design System v1.0.0 — generated file, do not edit. -->

# Inspera — Accordion

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

### Accordion

Show and hide sections of related content. — category: `data-display`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library — build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Accordion } from '@inspera/components'

<Accordion
  type="Single"
  iconPosition="Right"
  items={[{ title: 'What is Inspera?', content: '…' }]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `AccordionItem[]` | `defaultItems` | Accordion sections. |
| `type` | `'Single' \| 'Multiple'` | `'Single'` | Allow one or many open at once. |
| `defaultOpenIndex` | `number` | `0` | Initially open section. |
| `iconPosition` | `'Left' \| 'Right'` | `'Right'` | Chevron placement. |

```ts
export interface AccordionItem {
  title: string
  content: ReactNode
}
```

**Accessibility** — role `region`, keyboard operable. Header is a button with aria-expanded and aria-controls; Panel uses role="region" linked via aria-labelledby; Enter / Space toggle the section.

**Do:** Use to progressively disclose content; Keep section titles scannable; Use Single mode when only one section is relevant at a time.
**Don't:** Do not nest accordions deeply; Do not hide critical content behind collapsed sections.

**Deprecated aliases** (do not use): `Disclosure`, `Collapse`, `Expander`

#### Without the package — exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- Each header is a `<button>` inside an `<h3>`. The heading gives the section its place in the document outline; the button makes it operable.
- `aria-expanded` on the trigger and `aria-controls` pointing at the panel, with the panel as `role="region"` labelled back by the trigger id. All four, or the pattern does not work.
- Collapse with the `hidden` attribute so the panel leaves both the tab order and the accessibility tree.
- The chevron rotates 180° driven off `[aria-expanded="true"]`, so the attribute and the arrow cannot disagree.
- Icon-left reverses the flex row rather than reordering the markup, so the title is still read first.
- Single mode closes the open panel when another opens; multiple leaves them independent. Neither changes the markup.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --white:             #ffffff;
  --gray-200:          #EDEDED;
  --gray-600:          #7A7A7A;
  --gray-700:          #595959;
  --text-primary:      rgba(0, 0, 0, 0.87);
  --border:            var(--gray-200);
  --muted-foreground:  var(--gray-600);
  --radius-md:         8px;
  --font-sans:         'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-accordion {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  font-family: var(--font-sans);
  background: var(--white);
}

/* Rules between items, not around them — the wrapper already has a border. */
.inspera-accordion__item + .inspera-accordion__item {
  border-top: 1px solid var(--border);
}

.inspera-accordion__heading { margin: 0; }

.inspera-accordion__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 14px 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  font: inherit;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

/* Icon on the left: reverse the row rather than reordering the markup, so the
   reading order still starts with the title. */
.inspera-accordion--icon-left .inspera-accordion__trigger { flex-direction: row-reverse; }

.inspera-accordion__title { flex: 1; text-align: left; }

.inspera-accordion__chevron {
  font-size: 24px;
  color: var(--muted-foreground);
  transition: transform 160ms ease;
  transform: rotate(0deg);
}

.inspera-accordion__trigger[aria-expanded='true'] .inspera-accordion__chevron {
  transform: rotate(180deg);
}

.inspera-accordion__panel {
  padding: 0 16px 16px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--gray-700);
}

/* Collapsed panels use the "hidden" attribute, so they leave the tab order and
   the accessibility tree. display:none via a class does the first but is
   easier to get wrong. */
.inspera-accordion__panel[hidden] { padding: 0 16px; }
```

```html
<div class="inspera-accordion">
  <div class="inspera-accordion__item">
    <h3 class="inspera-accordion__heading">
      <button type="button" class="inspera-accordion__trigger"
              id="acc-h1" aria-expanded="true" aria-controls="acc-p1">
        <span class="inspera-accordion__title">How is my exam graded?</span>
        <span class="material-symbols-outlined inspera-accordion__chevron" aria-hidden="true">expand_more</span>
      </button>
    </h3>
    <div class="inspera-accordion__panel" id="acc-p1" role="region" aria-labelledby="acc-h1">
      Responses are marked against the rubric configured for each question.
    </div>
  </div>
  <div class="inspera-accordion__item">
    <h3 class="inspera-accordion__heading">
      <button type="button" class="inspera-accordion__trigger"
              id="acc-h2" aria-expanded="false" aria-controls="acc-p2">
        <span class="inspera-accordion__title">Can I review my answers?</span>
        <span class="material-symbols-outlined inspera-accordion__chevron" aria-hidden="true">expand_more</span>
      </button>
    </h3>
    <div class="inspera-accordion__panel" id="acc-p2" role="region" aria-labelledby="acc-h2" hidden>
      You can revisit any answered question before submitting.
    </div>
  </div>
</div>
```


---

Tokens: ./tokens.css · Full system: ./llms.txt
