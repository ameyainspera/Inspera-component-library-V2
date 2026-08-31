<!-- Inspera Design System v1.0.0 — generated file, do not edit. -->

# Inspera — File Upload

1. Do not invent design decisions. Never invent a colour, spacing value, radius, shadow, font size, weight, icon library, focus style, breakpoint, or component variant that this document defines.
2. Use a canonical component before building a lookalike. If one exists for the job, use it.
3. Never rename a canonical component or prop. A deprecated alias may be understood as input, but output must use the canonical name.
4. Consume tokens, not literals. Raw values here define what a token resolves to; application code references `var(--token)`.
5. Do not introduce another design system. No Material UI, Bootstrap, Ant, Chakra, shadcn default styling, Tailwind default palette, or Radix Themes look. Headless behaviour libraries are fine if restyled entirely to this spec.
6. No arbitrary Tailwind values where a token exists. Never `bg-[#004080]` — use the token.
7. Inter for product UI. Noto Sans Mono only for code, identifiers and technical values; Noto Serif only for long-form content.
8. Material Symbols Outlined only. Do not mix in Lucide, Heroicons, or Font Awesome.
9. Accessibility is part of the component contract, not an enhancement. Keyboard operation, visible focus, labels, roles, names, and states are required.
10. Never use colour alone to carry meaning. Pair it with text, an icon, or shape.
11. Respect `prefers-reduced-motion: reduce` — drop non-essential motion.
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

### File Upload

Upload files via drag-and-drop or browse. — category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library — build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { FileUpload } from '@inspera/components'

<FileUpload
  label="Attachments"
  accept="image/*,.pdf"
  multiple={false}
  onFiles={handleFiles}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Upload files'` | Field label describing what to upload. |
| `accept` | `string` | — | Accepted MIME types / extensions. |
| `multiple` | `boolean` | `false` | Allow multiple files. |
| `state` | `'Default' \| 'Dragging' \| 'Disabled' \| 'Error'` | `'Default'` | Forces a visual state for documentation. Omit for real interactivity. |
| `helpText` | `string` | `'PNG, JPG or PDF up to 10MB'` | Constraint hint text. |
| `onFiles` | `(files: File[]) => void` | — | Fired with the selected files, from both drop and browse. |

**Accessibility** — role `button`, keyboard operable. Dropzone uses role="button" and is keyboard focusable; Enter / Space open the file browser; Provide an accessible label describing the action.

**Do:** Support both drag-and-drop and click-to-browse; State accepted file types and size limits; Give visible drag feedback.
**Don't:** Do not hide the browse affordance; Do not omit constraint help text.

**Deprecated aliases** (do not use): `Dropzone`, `File dropzone`, `Uploader`

#### Without the package — exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- The zone carries `role="button"`, `tabindex="0"` and an Enter/Space handler that clicks the hidden input. Drag and drop alone is not an accessible way to upload.
- Keep the native `<input type="file">` in the DOM, visually hidden — the zone triggers it with `.click()`.
- Border is 2px dashed `--gray-400`; a 1px dash reads as a table rule at this size.
- The drag state and hover share one look: `--primary` border on a `--blue-100` wash. Handle `dragover`, `dragleave` and `drop`, and `preventDefault` on dragover or the browser opens the file instead.
- Always state the constraint ("PNG, JPG or PDF up to 10MB") — a bare drop zone gives no way to know what will be rejected.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:            #004080;
  --error:              #D32F2F;
  --white:              #ffffff;
  --gray-400:           #BCBCBC;
  --gray-600:           #7A7A7A;
  --blue-100:           #F0F7FF;
  --text-primary:       rgba(0, 0, 0, 0.87);
  --surface:            var(--white);
  --muted-foreground:   var(--gray-600);
  --radius-md:          8px;
  --focus-ring-width:   2px;
  --focus-ring-offset:  2px;
  --focus-ring-color:   var(--primary);
  --font-sans:          'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 32px 24px;
  /* Dashed, and 2px — a 1px dashed border reads as a table rule at this size. */
  border: 2px dashed var(--gray-400);
  border-radius: var(--radius-md);
  background: var(--surface);
  cursor: pointer;
  text-align: center;
  font-family: var(--font-sans);
  transition: all 120ms ease;
}

/* Both the real drag state and the pointer share one look. */
.inspera-upload:hover,
.inspera-upload--dragging {
  border-color: var(--primary);
  background: var(--blue-100);
}

.inspera-upload:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.inspera-upload__icon {
  font-size: 40px;
  color: var(--primary);
}

.inspera-upload__prompt {
  font-size: 16px;
  color: var(--text-primary);
}

.inspera-upload__browse {
  color: var(--primary);
  font-weight: 600;
}

.inspera-upload__help {
  font-size: 12px;
  color: var(--muted-foreground);
}

/* The native input stays in the DOM so the zone can click() it. */
.inspera-upload__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.inspera-upload--error {
  border-color: var(--error);
}
.inspera-upload--error .inspera-upload__icon,
.inspera-upload--error .inspera-upload__help { color: var(--error); }

.inspera-upload--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
```

```html
<!-- role="button" + tabindex + a key handler, because a div is not focusable
     and Enter/Space do not activate it on their own. -->
<div class="inspera-upload" role="button" tabindex="0" aria-label="Attachments">
  <span class="material-symbols-outlined inspera-upload__icon" aria-hidden="true">upload_file</span>
  <div class="inspera-upload__prompt">
    Drag &amp; drop or <span class="inspera-upload__browse">browse</span>
  </div>
  <span class="inspera-upload__help">PNG, JPG or PDF up to 10MB</span>
  <input class="inspera-upload__input" type="file" accept="image/*,.pdf" multiple />
</div>
```


---

Tokens: ./tokens.css · Full system: ./llms.txt
