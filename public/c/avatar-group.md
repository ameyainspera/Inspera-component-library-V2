<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Avatar Group

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Avatar Group

Show a set of users as overlapping avatars with an overflow count. — category: `data-display`.

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
| `size` | `AvatarSize` | `'Medium'` | Avatar diameter. Values: Small \| Medium \| Large. |

```ts
export interface AvatarGroupItem {
  content?: AvatarContent
  name?: string
}
```

**Accessibility** — role `group`. Wrap in a group with an aria-label describing the set; Each avatar keeps its own accessible label; The overflow chip states the hidden count.

**Do:** Use for participant and collaborator lists; Cap visible avatars and show a +N overflow; Keep sizing consistent within a context.
**Don't:** Do not show dozens of avatars inline; Do not omit the overflow count.

**Deprecated aliases** (do not use): `Avatar stack`, `Facepile`


---

Tokens: ./tokens.css · Full system: ./llms.txt
