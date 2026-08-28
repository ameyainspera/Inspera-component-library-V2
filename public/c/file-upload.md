<!-- Inspera Design System v1.0.0 — generated 2026-08-28. Do not edit. -->

# Inspera — File Upload

- Use ONLY the 42 components listed here. Do not invent variants or rename props.
- **Prop names are camelCase and case-sensitive** (`intent`, not `Intent`). React
  silently ignores an unknown prop, so a capitalised name renders the default
  variant with no error at all. Copy prop names exactly as given.
- **Variant *values* are Capitalised** (`intent="Primary"`, `size="Medium"`).
- Never use a deprecated alias name; map it to the canonical component.
- Style with the tokens — never hardcode an off-palette color.
- Honor the accessibility notes (role, aria, keyboard) for every component.

### File Upload

Upload files via drag-and-drop or browse. — category: `input-controls`.

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
| `label` | `string` | `'Upload files'` |  |
| `accept` | `string` | — | Accepted MIME types / extensions. |
| `multiple` | `boolean` | `false` | Allow multiple files. Values: true \| false. |
| `state` | `'Default' \| 'Dragging' \| 'Disabled' \| 'Error'` | `'Default'` | Forces a visual state for documentation. Omit for real interactivity. |
| `helpText` | `string` | `'PNG, JPG or PDF up to 10MB'` | Constraint hint text. |
| `onFiles` | `(files: File[]) => void` | — |  |

**Accessibility** — role `button`, keyboard operable. Dropzone uses role="button" and is keyboard focusable; Enter / Space open the file browser; Provide an accessible label describing the action.

**Do:** Support both drag-and-drop and click-to-browse; State accepted file types and size limits; Give visible drag feedback.
**Don't:** Do not hide the browse affordance; Do not omit constraint help text.

**Deprecated aliases** (do not use): `Dropzone`, `File dropzone`, `Uploader`


---

Tokens: ./tokens.css · Full system: ./llms.txt
