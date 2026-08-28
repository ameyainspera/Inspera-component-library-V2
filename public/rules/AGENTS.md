# Inspera Design System

All UI in this project uses the Inspera Design System (v1.0.0).

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

## Reference

They live in this repo's `public/` directory (set INSPERA_DS_BASE_URL and regenerate to emit absolute URLs)

- `llms.txt` — component index. Read this first.
- `c/<component>.md` — full spec for one component. Fetch only what you use.
- `api.json` — every prop, type and default, machine-readable.
- `tokens.css` — import once at the app root.
- `inspera.theme.css` — Tailwind v4 `@theme` block, if this project uses Tailwind.

## Foundations

Every value below is a CSS custom property. Import the stylesheet once at the
app root and reference tokens as `var(--primary)`, `var(--space-4)`,
`var(--radius-md)`. Never hardcode a colour that is not in this list.

### Colour — brand & semantic

| Token | CSS variable | Value | Use |
| --- | --- | --- | --- |
| `primary.main` | `var(--primary)` | #004080 | Primary brand / interactive |
| `secondary.main` | `var(--secondary)` | #322060 | Secondary brand, used sparingly |
| `error` | `var(--error)` | #D32F2F | Use only for its meaning (error) |
| `warning` | `var(--warning)` | #EF6C00 | Use only for its meaning (warning) |
| `info` | `var(--info)` | #0288D1 | Use only for its meaning (info) |
| `success` | `var(--success)` | #2E7D32 | Use only for its meaning (success) |
| `accent.zest` | `var(--accent-zest)` | #FA5101 | Sparingly, for accent moments |
| `accent.berry` | `var(--accent-berry)` | #89239A | Sparingly, for accent moments |
| `accent.algae` | `var(--accent-algae)` | #00A788 | Sparingly, for accent moments |

### Colour — palette

Each family runs 100 (lightest) to 900 (darkest). 600–900 are safe for text on
a light background; 100–300 are surface tints.

- **gray** — 100 `#F7F7F7` · 200 `#EDEDED` · 300 `#D9D9D9` · 400 `#BCBCBC` · 500 `#949494` · 600 `#7A7A7A` · 700 `#595959` · 800 `#404040` · 900 `#272727`
- **blue** — 100 `#F0F7FF` · 200 `#DBEDFF` · 300 `#B3D9FF` · 400 `#7ABDFF` · 500 `#3399FF` · 600 `#007BF5` · 700 `#0059B3` · 800 `#004080` · 900 `#002E5C`
- **green** — 100 `#F2FDF8` · 200 `#E0FAEF` · 300 `#BDF4DD` · 400 `#8DECC5` · 500 `#50E2A5` · 600 `#1BA76D` · 700 `#147B50` · 800 `#106542` · 900 `#0D4F33`
- **red** — 100 `#FEF1F1` · 200 `#FCDEDE` · 300 `#F9B8B8` · 400 `#F58484` · 500 `#F04242` · 600 `#E21212` · 700 `#A50D0D` · 800 `#760A0A` · 900 `#550707`
- **yellow** — 100 `#FFFCF0` · 200 `#FFF8DC` · 300 `#FEF0B3` · 400 `#FEE67C` · 500 `#FDD835` · 600 `#F2C602` · 700 `#B19102` · 800 `#7E6701` · 900 `#5B4A01`
- **orange** — 100 `#FFFAF0` · 200 `#FFF3DC` · 300 `#FEE5B3` · 400 `#FED27C` · 500 `#FDBA35` · 600 `#F2A202` · 700 `#D99102` · 800 `#7E5501` · 900 `#5B3D01`
- **purple** — 100 `#F6F4FB` · 200 `#E9E4F6` · 300 `#D0C6EC` · 400 `#9F88D7` · 500 `#8366CC` · 600 `#603DB8` · 700 `#462D86` · 800 `#322060` · 900 `#241745`
- **pink** — 100 `#FEF1F5` · 200 `#FCDFE8` · 300 `#F8B9CE` · 400 `#F386AB` · 500 `#ED457D` · 600 `#DF1659` · 700 `#A21041` · 800 `#740B2E` · 900 `#540821`

### Colour — roles

Prefer a role token over a raw palette shade wherever one exists.

**Interaction** — `var(--primary-hover-overlay)` rgba(0, 64, 128, 0.04), `var(--primary-focus-ring)` rgba(0, 64, 128, 0.3), `var(--action-active)` rgba(0, 0, 0, 0.56), `var(--action-hover)` rgba(0, 0, 0, 0.04), `var(--action-focus)` rgba(0, 0, 0, 0.12), `var(--action-disabled)` rgba(0, 0, 0, 0.38)

**Text** — `var(--text-primary)` rgba(0, 0, 0, 0.87), `var(--text-secondary)` var(--gray-600), `var(--text-disabled)` var(--action-disabled), `var(--text-on-primary)` #ffffff

**Surface** — `var(--background)` var(--gray-100), `var(--surface)` var(--white), `var(--surface-sunken)` var(--gray-100), `var(--border)` var(--gray-200), `var(--border-strong)` var(--gray-300), `var(--border-interactive)` var(--gray-500), `var(--muted-foreground)` var(--gray-600)

### Typography

Inter for all UI text. JetBrains Mono for code and token values. Material
Symbols Outlined for icons.

| Token | CSS variable | Size | Weight |
| --- | --- | --- | --- |
| `heading.h1` | `var(--text-heading-h1-size)` | 28.83px | 600 |
| `heading.h2` | `var(--text-heading-h2-size)` | 22.78px | 500 |
| `heading.h3` | `var(--text-heading-h3-size)` | 20.25px | 500 |
| `heading.h4` | `var(--text-heading-h4-size)` | 18px | 500 |
| `heading.h5` | `var(--text-heading-h5-size)` | 16px | 500 |
| `body.mdRegular` | `var(--text-body-mdRegular-size)` | 16px | 400 |
| `body.mdMedium` | `var(--text-body-mdMedium-size)` | 16px | 500 |
| `body.semiBold16` | `var(--text-body-semiBold16-size)` | 16px | 600 |
| `body.caption` | `var(--text-body-caption-size)` | 12px | 400 |

### Spacing

Use the scale — no arbitrary pixel values.

| Token | CSS variable | Value |
| --- | --- | --- |
| `0` | `var(--space-0)` | 0px |
| `1` | `var(--space-1)` | 4px |
| `2` | `var(--space-2)` | 8px |
| `3` | `var(--space-3)` | 12px |
| `4` | `var(--space-4)` | 16px |
| `5` | `var(--space-5)` | 20px |
| `6` | `var(--space-6)` | 24px |
| `8` | `var(--space-8)` | 32px |
| `10` | `var(--space-10)` | 40px |
| `12` | `var(--space-12)` | 48px |
| `16` | `var(--space-16)` | 64px |

### Radius

Small-to-medium radii: `sm` for controls, `md` for inputs and alerts,
`lg` for cards and dialogs. Pills only for toggles, badges, radios, avatars.

| Token | CSS variable | Value |
| --- | --- | --- |
| `none` | `var(--radius-none)` | 0px |
| `xs` | `var(--radius-xs)` | 2px |
| `sm` | `var(--radius-sm)` | 4px |
| `md` | `var(--radius-md)` | 8px |
| `lg` | `var(--radius-lg)` | 12px |
| `xl` | `var(--radius-xl)` | 16px |
| `pill` | `var(--radius-pill)` | 9999px |

### Depth / elevation

Flat by default. Prefer a border over a shadow for separation; use `200` for
cards and `500` for dialogs.

| Token | CSS variable | Value |
| --- | --- | --- |
| `shadow.100` | `var(--shadow-100)` | `0px 4px 4px rgba(39, 39, 39, 0.08), 0px 2px 4px rgba(39, 39, 39, 0.12)` |
| `shadow.200` | `var(--shadow-200)` | `0px 8px 8px rgba(39, 39, 39, 0.08), 0px 4px 6px rgba(39, 39, 39, 0.12)` |
| `shadow.300` | `var(--shadow-300)` | `0px 8px 16px rgba(39, 39, 39, 0.08), 0px 6px 8px rgba(39, 39, 39, 0.12)` |
| `shadow.500` | `var(--shadow-500)` | `0px 10px 32px rgba(39, 39, 39, 0.1), 0px 6px 14px rgba(39, 39, 39, 0.12)` |


## Before you finish

Check every component you used against its `c/<component>.md`: prop names
camelCase, variant values Capitalised, no hardcoded colors, accessibility notes
implemented.
