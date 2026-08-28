<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera Design System — Foundations

Version 1.0.0. Colour, typography, spacing, radius and depth. Components
are documented separately — see llms.txt for the index.

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

#### gray

| Shade | CSS variable | Value |
| --- | --- | --- |
| 100 | `var(--gray-100)` | #F7F7F7 |
| 200 | `var(--gray-200)` | #EDEDED |
| 300 | `var(--gray-300)` | #D9D9D9 |
| 400 | `var(--gray-400)` | #BCBCBC |
| 500 | `var(--gray-500)` | #949494 |
| 600 | `var(--gray-600)` | #7A7A7A |
| 700 | `var(--gray-700)` | #595959 |
| 800 | `var(--gray-800)` | #404040 |
| 900 | `var(--gray-900)` | #272727 |

#### blue

| Shade | CSS variable | Value |
| --- | --- | --- |
| 100 | `var(--blue-100)` | #F0F7FF |
| 200 | `var(--blue-200)` | #DBEDFF |
| 300 | `var(--blue-300)` | #B3D9FF |
| 400 | `var(--blue-400)` | #7ABDFF |
| 500 | `var(--blue-500)` | #3399FF |
| 600 | `var(--blue-600)` | #007BF5 |
| 700 | `var(--blue-700)` | #0059B3 |
| 800 | `var(--blue-800)` | #004080 |
| 900 | `var(--blue-900)` | #002E5C |

#### green

| Shade | CSS variable | Value |
| --- | --- | --- |
| 100 | `var(--green-100)` | #F2FDF8 |
| 200 | `var(--green-200)` | #E0FAEF |
| 300 | `var(--green-300)` | #BDF4DD |
| 400 | `var(--green-400)` | #8DECC5 |
| 500 | `var(--green-500)` | #50E2A5 |
| 600 | `var(--green-600)` | #1BA76D |
| 700 | `var(--green-700)` | #147B50 |
| 800 | `var(--green-800)` | #106542 |
| 900 | `var(--green-900)` | #0D4F33 |

#### red

| Shade | CSS variable | Value |
| --- | --- | --- |
| 100 | `var(--red-100)` | #FEF1F1 |
| 200 | `var(--red-200)` | #FCDEDE |
| 300 | `var(--red-300)` | #F9B8B8 |
| 400 | `var(--red-400)` | #F58484 |
| 500 | `var(--red-500)` | #F04242 |
| 600 | `var(--red-600)` | #E21212 |
| 700 | `var(--red-700)` | #A50D0D |
| 800 | `var(--red-800)` | #760A0A |
| 900 | `var(--red-900)` | #550707 |

#### yellow

| Shade | CSS variable | Value |
| --- | --- | --- |
| 100 | `var(--yellow-100)` | #FFFCF0 |
| 200 | `var(--yellow-200)` | #FFF8DC |
| 300 | `var(--yellow-300)` | #FEF0B3 |
| 400 | `var(--yellow-400)` | #FEE67C |
| 500 | `var(--yellow-500)` | #FDD835 |
| 600 | `var(--yellow-600)` | #F2C602 |
| 700 | `var(--yellow-700)` | #B19102 |
| 800 | `var(--yellow-800)` | #7E6701 |
| 900 | `var(--yellow-900)` | #5B4A01 |

#### orange

| Shade | CSS variable | Value |
| --- | --- | --- |
| 100 | `var(--orange-100)` | #FFFAF0 |
| 200 | `var(--orange-200)` | #FFF3DC |
| 300 | `var(--orange-300)` | #FEE5B3 |
| 400 | `var(--orange-400)` | #FED27C |
| 500 | `var(--orange-500)` | #FDBA35 |
| 600 | `var(--orange-600)` | #F2A202 |
| 700 | `var(--orange-700)` | #D99102 |
| 800 | `var(--orange-800)` | #7E5501 |
| 900 | `var(--orange-900)` | #5B3D01 |

#### purple

| Shade | CSS variable | Value |
| --- | --- | --- |
| 100 | `var(--purple-100)` | #F6F4FB |
| 200 | `var(--purple-200)` | #E9E4F6 |
| 300 | `var(--purple-300)` | #D0C6EC |
| 400 | `var(--purple-400)` | #9F88D7 |
| 500 | `var(--purple-500)` | #8366CC |
| 600 | `var(--purple-600)` | #603DB8 |
| 700 | `var(--purple-700)` | #462D86 |
| 800 | `var(--purple-800)` | #322060 |
| 900 | `var(--purple-900)` | #241745 |

#### pink

| Shade | CSS variable | Value |
| --- | --- | --- |
| 100 | `var(--pink-100)` | #FEF1F5 |
| 200 | `var(--pink-200)` | #FCDFE8 |
| 300 | `var(--pink-300)` | #F8B9CE |
| 400 | `var(--pink-400)` | #F386AB |
| 500 | `var(--pink-500)` | #ED457D |
| 600 | `var(--pink-600)` | #DF1659 |
| 700 | `var(--pink-700)` | #A21041 |
| 800 | `var(--pink-800)` | #740B2E |
| 900 | `var(--pink-900)` | #540821 |

### Colour — roles

Prefer a role token over a raw palette shade wherever one exists.

**Interaction** — `var(--primary-hover-overlay)` rgba(0, 64, 128, 0.04), `var(--primary-focus-ring)` rgba(0, 64, 128, 0.3), `var(--action-active)` rgba(0, 0, 0, 0.56), `var(--action-hover)` rgba(0, 0, 0, 0.04), `var(--action-focus)` rgba(0, 0, 0, 0.12), `var(--action-disabled)` rgba(0, 0, 0, 0.38)

**Text** — `var(--text-primary)` rgba(0, 0, 0, 0.87), `var(--text-secondary)` var(--gray-600), `var(--text-disabled)` var(--action-disabled), `var(--text-on-primary)` #ffffff

**Status** — `var(--info-surface)` #E1F5FE, `var(--success-surface)` #E8F5E9, `var(--warning-surface)` #FFF3E0, `var(--error-surface)` #FFEBEE

**Controls** — `var(--border-control)` #C4C4C4, `var(--border-control-strong)` #8C8C8C, `var(--text-placeholder)` #8C8C8C, `var(--surface-disabled)` #F5F5F5, `var(--surface-readonly)` var(--gray-100), `var(--surface-neutral)` #F0F0F0, `var(--avatar-surface)` #E0E0E0

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

