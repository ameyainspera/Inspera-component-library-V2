<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - OTP Input

1. Do not invent design decisions. Never invent a colour, spacing value, radius, shadow, font size, weight, icon library, focus style, breakpoint, or component variant that this document defines.
2. Use a canonical component before building a lookalike. If one exists for the job, use it.
3. Never rename a canonical component or prop. A deprecated alias may be understood as input, but output must use the canonical name.
4. Consume tokens, not literals. Raw values here define what a token resolves to; application code references `var(--token)`.
5. Do not introduce another design system. No Material UI, Bootstrap, Ant, Chakra, shadcn default styling, Tailwind default palette, or Radix Themes look. Headless behaviour libraries are fine if restyled entirely to this spec.
6. No arbitrary Tailwind values where a token exists. Never `bg-[#004080]` - use the token.
7. Inter for product UI. Noto Sans Mono only for code, identifiers and technical values; Noto Serif only for long-form content.
8. Material Symbols Outlined only. Do not mix in Lucide, Heroicons, or Font Awesome.
9. Accessibility is part of the component contract, not an enhancement. Keyboard operation, visible focus, labels, roles, names, and states are required.
10. Never use colour alone to carry meaning. Pair it with text, an icon, or shape.
11. Respect `prefers-reduced-motion: reduce` - drop non-essential motion.
12. Compose rather than invent. If a pattern is not a canonical component, build it from canonical components using the patterns below.
13. Do not silently add a component. If the system genuinely cannot express something, emit `DESIGN_SYSTEM_GAP` in your output and use the closest documented composition.
14. No decoration that competes with hierarchy: no gradients, glassmorphism, oversized radii, decorative shadows, or animated backgrounds.

**Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
silently ignores an unknown prop, so a capitalised name renders the default
variant with no error at all. Variant *values* are Capitalised
(`intent="Primary"`, `size="Medium"`).

**When two instructions conflict**, this order wins:

1. Accessibility and safety requirements
2. The rules above
3. Token definitions
4. Canonical component specifications
5. Composition patterns
6. Product requirements supplied with the task
7. Examples

**When the spec does not answer your question:**

- Reuse the nearest canonical component or composition.
- Reuse an existing token.
- Preserve the established density and hierarchy.
- Do not infer a brand colour or visual style from framework defaults.
- Mark a genuinely missing primitive `DESIGN_SYSTEM_GAP` rather than presenting it as canonical.

### OTP Input

Enter a one-time verification code. - category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

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
| `value` | `string` | - | Current code value. |
| `state` | `'Default' \| 'Focused' \| 'Error' \| 'Disabled'` | `'Default'` | Freezes a visual state so documentation can show it without a pointer. `Focused` is presentation-only - leave it unset in application code, where CSS drives it from the real pointer and keyboard. `Error` and `Disabled` are real application state and belong in your code. |
| `onChange` | `(value: string) => void` | - | Fired with the full code as digits are entered or pasted. |

**Accessibility** - role `textbox`, keyboard operable. Each box has an aria-label "Digit N"; aria-invalid reflects the error state; Backspace moves focus to the previous box; paste distributes digits.

**Do:** Auto-advance focus as digits are entered; Support paste of the full code; Use a monospace font for even alignment.
**Don't:** Do not require manual box-by-box focus; Do not allow non-numeric characters.

**Deprecated aliases** (do not use): `PIN input`, `Verification code`, `Code input`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- One `<input>` per digit, 44x48, `--radius-md`, in `--font-mono` at 20px so the digits do not shift as they are typed.
- `autocomplete="one-time-code"` goes on the first box only, and `off` on the rest. On every box the platform offers the code once per field.
- Each box needs `aria-label="Digit N"` and `inputmode="numeric"`, plus `maxlength="1"`.
- Wire the behaviour: typing advances focus, Backspace on an empty box moves back and clears, arrows move between boxes, and a paste on any box fills the rest.
- Focus is per box - do not ring the whole row.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --error:                  #D32F2F;
  --white:                  #ffffff;
  --blue-300:               #B3D9FF;
  --red-300:                #F9B8B8;
  --text-primary:           rgba(0, 0, 0, 0.87);
  --border-control:         #C4C4C4;
  --border-control-strong:  #8C8C8C;
  --surface-disabled:       #F5F5F5;
  --radius-md:              8px;
  --effect-state-focus:     0px 0px 0px 3px var(--blue-300);
  --effect-state-error:     0px 0px 0px 3px var(--red-300);
  --border-width-default:   1px;
  --duration-fast:          100ms;
  --easing-standard:        cubic-bezier(0.2, 0, 0, 1);
  --font-mono:              'Noto Sans Mono', ui-monospace, SFMono-Regular, monospace;
}

.inspera-otp {
  display: inline-flex;
  gap: 8px;
}

.inspera-otp__box {
  width: 44px;
  height: 48px;
  text-align: center;
  border: var(--border-width-default) solid var(--border-control);
  border-radius: var(--radius-md);
  background: var(--white);
  /* Monospace so the digits do not shift as they are typed. */
  font-family: var(--font-mono);
  font-size: 20px;
  color: var(--text-primary);
  outline: none;
  transition:
    border-color var(--duration-fast) var(--easing-standard),
    box-shadow var(--duration-fast) var(--easing-standard);
}

.inspera-otp__box:hover { border-color: var(--border-control-strong); }

.inspera-otp__box:focus {
  border-color: var(--primary);
  box-shadow: var(--effect-state-focus);
}

.inspera-otp__box[data-invalid='true'] {
  border-color: var(--error);
  box-shadow: var(--effect-state-error);
}

.inspera-otp__box[data-disabled='true'] {
  background: var(--surface-disabled);
  opacity: 0.6;
}
```

```html
<!-- autocomplete="one-time-code" on the FIRST box only, so the platform
     offers the SMS code once rather than once per digit. -->
<div class="inspera-otp">
  <input class="inspera-otp__box" type="text" inputmode="numeric" maxlength="1"
         autocomplete="one-time-code" aria-label="Digit 1" />
  <input class="inspera-otp__box" type="text" inputmode="numeric" maxlength="1"
         autocomplete="off" aria-label="Digit 2" />
  <input class="inspera-otp__box" type="text" inputmode="numeric" maxlength="1"
         autocomplete="off" aria-label="Digit 3" />
</div>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
