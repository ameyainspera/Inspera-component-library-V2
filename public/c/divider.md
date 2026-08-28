<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Divider

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Divider

Separate content with a thin rule. — category: `data-display`.

```tsx
import { Divider } from '@inspera/components'

<Divider
  orientation="Horizontal"
  spacing="Default"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'Horizontal' \| 'Vertical'` | `'Horizontal'` | Divider direction. Values: Horizontal \| Vertical. |
| `label` | `string` | — | Optional centered label (horizontal only). |
| `spacing` | `'Compact' \| 'Default' \| 'Spacious'` | `'Default'` | Surrounding margin. Values: Compact \| Default \| Spacious. |

**Accessibility** — role `separator`. Use role="separator" with aria-orientation; Purely decorative dividers may be aria-hidden.

**Do:** Use to group and separate related content; Use a labeled divider to introduce a section; Keep dividers hairline-thin.
**Don't:** Do not overuse dividers where whitespace suffices; Do not use heavy rules.

**Deprecated aliases** (do not use): `Separator`, `Rule`, `HR`


---

Tokens: ./tokens.css · Full system: ./llms.txt
