<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Avatar

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Avatar

Represent a user or entity with an image or initials. — category: `data-display`.

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
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Medium'` | Diameter 32 / 40 / 56. Values: Small \| Medium \| Large. |
| `content` | `'Image' \| 'Initials' \| 'Icon'` | `'Initials'` | What fills the avatar. Values: Image \| Initials \| Icon. |
| `status` | `'None' \| 'Online' \| 'Offline' \| 'Busy'` | `'None'` | Presence indicator dot. Values: None \| Online \| Offline \| Busy. |
| `initials` | `string` | `'JC'` |  |
| `imageSrc` | `string` | `'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=112&h=112&fit=crop&auto=format'` |  |
| `alt` | `string` | `'User avatar'` |  |
| `icon` | `string` | `'person'` |  |

**Accessibility** — role `img`. Provide alt text for image avatars; Use aria-label for initials and icon variants.

**Do:** Use for user profiles and participant lists; Provide meaningful alt text; Use consistent sizing within a context.
**Don't:** Do not stretch or distort avatar images; Do not use random colors — use a deterministic palette.


---

Tokens: ./tokens.css · Full system: ./llms.txt
