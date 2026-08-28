<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — Toggle

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### Toggle

Switch a setting on or off instantly. — category: `input-controls`.

```tsx
import { Toggle } from '@inspera/components'

<Toggle
  label="Enable notifications"
  checked={false}
  size="Medium"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Toggle setting'` |  |
| `checked` | `boolean` | — | On / off state. Values: true \| false. |
| `state` | `'Default' \| 'Hover' \| 'Focused' \| 'Disabled'` | `'Default'` | Forces a visual state for documentation. Omit for real interactivity. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Track / thumb size. Values: Small \| Medium. |
| `withLabel` | `boolean` | `true` | Render the label. Values: true \| false. |
| `onChange` | `(checked: boolean) => void` | — |  |

**Accessibility** — role `switch`, keyboard operable. Use role="switch" for the toggle; Use aria-checked to reflect on/off state; Space key toggles the switch.

**Do:** Use for immediate on/off settings; Provide a clear label describing the setting; Show the current state visually.
**Don't:** Do not use for form submissions — use Checkbox instead; Do not use without a visible label.

**Deprecated aliases** (do not use): `Switch`, `Toggle switch`


---

Tokens: ./tokens.css · Full system: ./llms.txt
