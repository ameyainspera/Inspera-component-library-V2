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

## Tokens

- primary.main: #004080 — Primary brand / interactive
- secondary.main: #322060 — Secondary brand, used sparingly
- error: #D32F2F
- warning: #EF6C00
- info: #0288D1
- success: #2E7D32
- accent.zest: #FA5101
- accent.berry: #89239A
- accent.algae: #00A788
- palette families (100–900 each): gray, blue, green, red, yellow, orange, purple, pink — e.g. `var(--blue-600)`
- radius: none 0px, xs 2px, sm 4px, md 8px, lg 12px, xl 16px, pill 9999px
- spacing (px): 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64 — `var(--space-1)`…`var(--space-16)`
- fonts: Inter (UI), JetBrains Mono (code), Material Symbols Outlined (icons)

## Before you finish

Check every component you used against its `c/<component>.md`: prop names
camelCase, variant values Capitalised, no hardcoded colors, accessibility notes
implemented.
