<!-- Inspera Design System v1.0.0 — generated file, do not edit. -->

# Inspera — Drawer

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

### Drawer

Slide a panel in from the edge of the screen. — category: `feedback`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library — build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Drawer } from '@inspera/components'

<Drawer
  open={open}
  side="Right"
  size="Medium"
  title="Assessment details"
  hasCloseButton={true}
  onClose={() => setOpen(false)}
>
  {children}
</Drawer>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | `false` | Visibility. |
| `side` | `'Right' \| 'Left' \| 'Bottom'` | `'Right'` | Edge it slides from. |
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Medium'` | Panel width / height. |
| `title` | `string` | `'Panel'` | Header title. |
| `hasCloseButton` | `boolean` | `true` | Show the close affordance. |
| `children` | `ReactNode` | — | Panel contents. |
| `embedded` | `boolean` | `false` | Render just the panel inline (no overlay/scrim) — used for documentation previews. |
| `onClose` | `() => void` | — | Fired on the close button, the scrim, and Escape. |

**Accessibility** — role `dialog`, keyboard operable. Use role="dialog" with aria-modal="true"; Set aria-labelledby to the drawer title; Trap focus while open and restore it on close; Escape closes the drawer.

**Do:** Use for secondary tasks and detail panels; Provide a clear close control; Return focus to the trigger on close.
**Don't:** Do not use for critical confirmations — use Dialog; Do not open multiple drawers at once.

**Deprecated aliases** (do not use): `Sheet`, `Side panel`, `Off-canvas`

#### Without the package — exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- Side panels are 320 / 400 / 560 wide and pinned top-to-bottom; a bottom drawer takes that number as its height, spans the full width, and caps at 90% of the viewport.
- Same scrim and the same modal obligations as Dialog: focus in, Tab trapped, focus restored, Escape and scrim click close, body scroll locked.
- The body scrolls (`flex: 1; overflow-y: auto`), not the panel — the header has to stay put.
- The header is 16px/20px padding with an 18px/500 title, smaller than a Dialog’s because a drawer is a secondary surface.
- Slide it in from its own edge. A drawer that fades in reads as a dialog in the wrong place.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --white:          #ffffff;
  --gray-200:       #EDEDED;
  --gray-700:       #595959;
  --action-active:  rgba(0, 0, 0, 0.56);
  --text-primary:   rgba(0, 0, 0, 0.87);
  --surface:        var(--white);
  --border:         var(--gray-200);
  --shadow-500:     0px 10px 32px rgba(39, 39, 39, 0.1), 0px 6px 14px rgba(39, 39, 39, 0.12);
  --z-modal:        600;
  --font-sans:      'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(39, 39, 39, 0.48);
  z-index: var(--z-modal, 1000);
}

.inspera-drawer {
  display: flex;
  flex-direction: column;
  background: var(--surface);
  color: var(--text-primary);
  box-shadow: var(--shadow-500);
  font-family: var(--font-sans);
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 400px;
  max-width: 100%;
}

.inspera-drawer--left  { left: 0; right: auto; }
.inspera-drawer--small { width: 320px; }
.inspera-drawer--large { width: 560px; }

/* Bottom pins to the full width and takes its size as height instead. */
.inspera-drawer--bottom {
  top: auto;
  left: 0;
  right: 0;
  width: auto;
  height: 400px;
  max-height: 90%;
}
.inspera-drawer--bottom.inspera-drawer--small { width: auto; height: 320px; }
.inspera-drawer--bottom.inspera-drawer--large { width: auto; height: 560px; }

.inspera-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.inspera-drawer__title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.inspera-drawer__close {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--action-active);
  display: inline-flex;
}
.inspera-drawer__close .material-symbols-outlined { font-size: 22px; }

/* The body scrolls, not the panel — the header stays put. */
.inspera-drawer__body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  font-size: 16px;
  line-height: 1.5;
  color: var(--gray-700);
}
```

```html
<div class="inspera-drawer-overlay">
  <div class="inspera-drawer" role="dialog" aria-modal="true"
       aria-labelledby="drawer-title" tabindex="-1">
    <div class="inspera-drawer__header">
      <h2 class="inspera-drawer__title" id="drawer-title">Assessment details</h2>
      <button type="button" class="inspera-drawer__close" aria-label="Close">
        <span class="material-symbols-outlined" aria-hidden="true">close</span>
      </button>
    </div>
    <div class="inspera-drawer__body">Panel content.</div>
  </div>
</div>
```


---

Tokens: ./tokens.css · Full system: ./llms.txt
