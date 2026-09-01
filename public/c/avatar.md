<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Avatar

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

### Avatar

Represent a user or entity with an image or initials. - category: `data-display`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Avatar } from '@inspera/components'

<Avatar
  size="Medium"
  content="Initials"
  status="None"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Medium'` | Diameter 32 / 40 / 56. |
| `content` | `'Image' \| 'Initials' \| 'Icon'` | `'Initials'` | What fills the avatar. |
| `status` | `'None' \| 'Online' \| 'Offline' \| 'Busy'` | `'None'` | Presence indicator dot. |
| `initials` | `string` | `'JC'` | One or two letters, used when content is Initials. Derive from the name rather than asking for them. |
| `imageSrc` | `string` | `'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=112&h=112&fit=crop&auto=format'` | Image URL, used when content is Image. Falls back to initials if it fails to load. |
| `alt` | `string` | `'User avatar'` | Alternative text for the image. Required whenever an image is shown. |
| `icon` | `string` | `'person'` | Material Symbols name, used when content is Icon. |

**Accessibility** - role `img`. Provide alt text for image avatars; Use aria-label for initials and icon variants.

**Do:** Use for user profiles and participant lists; Provide meaningful alt text; Use consistent sizing within a context.
**Don't:** Do not stretch or distort avatar images; Do not use random colors - use a deterministic palette.

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- Diameters are 32 / 40 / 56. Initials are 40% of that, the icon 55%, the status dot 28% - never a fixed size.
- The surface uses `--avatar-surface`, not a random grey, and `--radius-pill`.
- The status dot needs its 2px `--white` ring, or it disappears against a photo.
- The accessible name lives on the surface (`role="img"`); the initials themselves are decorative text.
- The wrapper is separate from the surface because the surface clips its image with `overflow: hidden`, which would cut the dot in half.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --error:        #D32F2F;
  --success:      #2E7D32;
  --white:        #ffffff;
  --gray-500:     #949494;
  --gray-600:     #7A7A7A;
  --gray-900:     #272727;
  --radius-pill:  9999px;
  --font-sans:    'Inter', system-ui, -apple-system, sans-serif;
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
```

```html
<!-- Initials. The accessible name carries them, since the text is decorative. -->
<span class="inspera-avatar">
  <span class="inspera-avatar__surface" role="img" aria-label="Jane Cooper (JC)">
    <span>JC</span>
  </span>
</span>

<!-- Photo, with a status dot. -->
<span class="inspera-avatar">
  <span class="inspera-avatar__surface" role="img" aria-label="Jane Cooper">
    <img src="/avatar.jpg" alt="Jane Cooper" />
  </span>
  <span class="inspera-avatar__status inspera-avatar__status--online" aria-label="Online"></span>
</span>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
