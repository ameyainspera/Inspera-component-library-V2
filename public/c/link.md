<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Link

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Link

Navigate to another location or resource. — category: `navigation`.

```tsx
import { Link } from '@inspera/components'

<Link
  href="/docs"
  label="Learn more"
  intent="Default"
  underline="Hover"
  external={false}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — |  |
| `label` | `string` | `'Learn more'` |  |
| `href` | `string` | `'#'` |  |
| `intent` | `'Default' \| 'Muted'` | `'Default'` | Color emphasis. Values: Default \| Muted. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Text size. Values: Small \| Medium. |
| `underline` | `'Always' \| 'Hover' \| 'None'` | `'Hover'` | Underline behavior. Values: Always \| Hover \| None. |
| `external` | `boolean` | `false` | Open in a new tab with an icon. Values: true \| false. |
| `disabled` | `boolean` | `false` | Non-interactive state. Values: true \| false. |
| `leadingIcon` | `string` | — |  |
| `trailingIcon` | `string` | — |  |
| `onClick` | `(e: React.MouseEvent) => void` | — |  |

**Accessibility** — role `link`, keyboard operable. Use a real anchor with a valid href; External links set target="_blank" and rel="noreferrer"; Disabled links set aria-disabled and prevent navigation; Focus ring is visible on keyboard focus.

**Do:** Use for navigation, not actions; Signal external links with an icon; Keep link text descriptive.
**Don't:** Do not use links to trigger actions — use Button; Do not use "click here" as link text.

**Deprecated aliases** (do not use): `Hyperlink`, `Text link`, `Anchor`


---

Tokens: ./tokens.css · Full system: ./llms.txt
