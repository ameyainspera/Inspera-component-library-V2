<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — OTP Input

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### OTP Input

Enter a one-time verification code. — category: `input-controls`.

```tsx
import { OtpInput } from '@inspera/components'

<OtpInput
  length={6}
  value={code}
  onChange={setCode}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `length` | `number` | `6` | Number of digit boxes. |
| `value` | `string` | — | Current code value. |
| `state` | `'Error' \| 'Default' \| 'Focused' \| 'Disabled'` | `'Default'` | Forces a visual state for documentation. Omit for real interactivity. |
| `onChange` | `(value: string) => void` | — |  |

**Accessibility** — role `textbox`, keyboard operable. Each box has an aria-label "Digit N"; aria-invalid reflects the error state; Backspace moves focus to the previous box; paste distributes digits.

**Do:** Auto-advance focus as digits are entered; Support paste of the full code; Use a monospace font for even alignment.
**Don't:** Do not require manual box-by-box focus; Do not allow non-numeric characters.

**Deprecated aliases** (do not use): `PIN input`, `Verification code`, `Code input`


---

Tokens: ./tokens.css · Full system: ./llms.txt
