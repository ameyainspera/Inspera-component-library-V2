<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Avatar Group

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

### Avatar Group

Show a set of users as overlapping avatars with an overflow count. - category: `data-display`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { AvatarGroup } from '@inspera/components'

<AvatarGroup
  size="Medium"
  max={4}
  avatars={[{ name: 'Ada Lovelace' }, { name: 'Linus Torvalds' }]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `avatars` | `AvatarGroupItem[]` | `defaultAvatars` | Avatars to display. |
| `max` | `number` | `4` | Maximum shown before overflow. |
| `size` | `AvatarSize` | `'Medium'` | Avatar diameter. |

```ts
export interface AvatarGroupItem {
  content?: AvatarContent
  name?: string
}
```

**Accessibility** - role `group`. Wrap in a group with an aria-label describing the set; Each avatar keeps its own accessible label; The overflow chip states the hidden count.

**Do:** Use for participant and collaborator lists; Cap visible avatars and show a +N overflow; Keep sizing consistent within a context.
**Don't:** Do not show dozens of avatars inline; Do not omit the overflow count.

**Deprecated aliases** (do not use): `Avatar stack`, `Facepile`

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

- Overlap is 30% of the diameter as a negative left margin - 10 / 12 / 17px for small / medium / large - and the first item has none.
- The separating ring is a `box-shadow`, not a border: a border would grow each avatar and break the spacing.
- The overflow chip is `+N` on `--gray-200` at 34% of the diameter, sized identically to an avatar.
- The group carries `role="group"` and a count in its label; the chip carries "N more". Overlapping avatars are meaningless to a screen reader without both.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --error:           #D32F2F;
  --success:         #2E7D32;
  --white:           #ffffff;
  --gray-200:        #EDEDED;
  --gray-500:        #949494;
  --gray-600:        #7A7A7A;
  --gray-700:        #595959;
  --gray-900:        #272727;
  --avatar-surface:  #E0E0E0;
  --radius-pill:     9999px;
  --font-sans:       'Inter', system-ui, -apple-system, sans-serif;
}

/* The wrapper exists so the status dot can be positioned against the
   avatar without being clipped by its overflow: hidden. */
.inspera-avatar {
  position: relative;
  display: inline-flex;
}

.inspera-avatar__surface {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-pill);
  background: var(--avatar-surface);
  color: var(--gray-900);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  font-family: var(--font-sans);
  font-weight: 500;
  /* Initials are 40% of the diameter, so they scale with the avatar. */
  font-size: 16px;
}

.inspera-avatar--small .inspera-avatar__surface  { width: 32px; height: 32px; font-size: 12.8px; }
.inspera-avatar--large .inspera-avatar__surface  { width: 56px; height: 56px; font-size: 22.4px; }

.inspera-avatar__surface img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* The icon variant is 55% of the diameter, larger than the initials. */
.inspera-avatar__surface .material-symbols-outlined {
  font-size: 22px;
  color: var(--gray-600);
}
.inspera-avatar--small .inspera-avatar__surface .material-symbols-outlined { font-size: 17.6px; }
.inspera-avatar--large .inspera-avatar__surface .material-symbols-outlined { font-size: 30.8px; }

/* The dot is 28% of the diameter, with a 2px white ring so it stays legible
   against a photo. */
.inspera-avatar__status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 11.2px;
  height: 11.2px;
  border-radius: 9999px;
  border: 2px solid var(--white);
}
.inspera-avatar--small .inspera-avatar__status { width: 8.96px; height: 8.96px; }
.inspera-avatar--large .inspera-avatar__status { width: 15.68px; height: 15.68px; }

.inspera-avatar__status--online  { background: var(--success); }
.inspera-avatar__status--offline { background: var(--gray-500); }
.inspera-avatar__status--busy    { background: var(--error); }

.inspera-avatar-group {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-sans);
}

/* Each avatar sits in a ring and pulls left over the one before it. The ring
   is a box-shadow, not a border, so it does not change the avatar's size. */
.inspera-avatar-group__item {
  display: inline-flex;
  border-radius: 9999px;
  box-shadow: 0 0 0 2px var(--white);
  margin-left: -12px;
}
.inspera-avatar-group--small .inspera-avatar-group__item { margin-left: -10px; }
.inspera-avatar-group--large .inspera-avatar-group__item { margin-left: -17px; }

/* Last, so it outranks the size modifiers above: nothing overlaps the first. */
.inspera-avatar-group__item:first-child { margin-left: 0; }

/* The overflow chip is the same circle, filled and labelled +N. */
.inspera-avatar-group__more {
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--gray-200);
  color: var(--gray-700);
  font-size: 13.6px;
  font-weight: 500;
}
.inspera-avatar-group--small .inspera-avatar-group__more { width: 32px; height: 32px; font-size: 10.88px; }
.inspera-avatar-group--large .inspera-avatar-group__more { width: 56px; height: 56px; font-size: 19.04px; }
```

```html
<div class="inspera-avatar-group" role="group" aria-label="6 participants">
  <span class="inspera-avatar-group__item">
    <span class="inspera-avatar">
      <span class="inspera-avatar__surface" role="img" aria-label="Ada Lovelace (AL)"><span>AL</span></span>
    </span>
  </span>
  <span class="inspera-avatar-group__item">
    <span class="inspera-avatar">
      <span class="inspera-avatar__surface" role="img" aria-label="Grace Hopper (GH)"><span>GH</span></span>
    </span>
  </span>
  <span class="inspera-avatar-group__item inspera-avatar-group__more" aria-label="4 more">+4</span>
</div>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
