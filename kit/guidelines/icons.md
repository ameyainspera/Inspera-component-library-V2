# Icons

The kit uses **Material Symbols Outlined** (variable font). Render an icon with the `material-symbols-outlined` class and the icon's ligature name as the text content:

```tsx
<span className="material-symbols-outlined" aria-hidden>search</span>
```

Rules:

- Use only Material Symbols Outlined ligature names (e.g. `search`, `close`, `check_circle`, `info`, `warning`, `error`, `expand_more`, `chevron_right`). Do not paste raw SVG.
- Icon-only controls **must** have an accessible label (`aria-label`), and the icon itself should be `aria-hidden`.
- Default optical size 24, weight 400. Filled icons (e.g. status glyphs) use `font-variation-settings: 'FILL' 1`.
- Match icon color to its context (`currentColor` or a semantic token), never an off-palette color.

The `.material-symbols-outlined` helper class is defined in `styles.css`.
