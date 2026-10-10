<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - File Upload

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

### File Upload

Upload files via drag-and-drop or browse. - category: `input-controls`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { FileUpload } from '@inspera/components'

<FileUpload
  label="Attachments"
  accept="image/*,.pdf"
  helpText="PNG, JPG or PDF up to 10MB"
  onFiles={handleFiles}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | What to upload, e.g. "Attachments". The file input's accessible name. |
| `accept` | `string` | - | Accepted MIME types / extensions, e.g. "image/*,.pdf". Applies to drops too. |
| `multiple` | `boolean` | `false` | Allow more than one file. A drop of several is cut to the first when false. |
| `helpText` | `string` | - | Constraint hint, e.g. "PNG, JPG or PDF up to 10MB". Replaced by errorText when `error` is set. |
| `errorText` | `string` | - | Validation message, shown while `error` is true. |
| `error` | `boolean` | `false` | Marks the zone invalid: red border and `aria-invalid`. |
| `disabled` | `boolean` | `false` | Blocks interaction and dims the zone. |
| `onFiles` | `(files: File[]) => void` | - | Fired with the selected files, from both drop and browse. |

Also accepts any native `<input>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<input>`. `className` and `style` go on the outermost element.

**Accessibility** - role `button`, keyboard operable. Dropzone uses role="button" and is keyboard focusable; Enter / Space open the file browser; Provide an accessible label describing the action.

**Do:** Support both drag-and-drop and click-to-browse; State accepted file types and size limits; Give visible drag feedback.
**Don't:** Do not hide the option to browse; Do not leave out the accepted file types and size limit.

**Choosing a variant:**
- `multiple="false"`: One file, which a new upload replaces, such as invigilator instructions.
- `multiple`: Several files that go together, such as resources for a question set. List the files under the drop zone.
- `error`: The file can't be used. Say why and what to upload instead.
- `disabled`: Uploading isn't possible here, such as for someone who doesn't own the test. Say why.

**Deprecated aliases** (do not use): `Dropzone`, `File dropzone`, `Uploader`

#### One-time setup

Paste this once, at the root of the project. Without it the component inherits
the host tool's fonts and any icon renders as its own name instead of a glyph.

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Noto+Sans+Mono:wght@400;500&family=Noto+Serif:wght@400;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');

.material-symbols-outlined {
  font-weight: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  direction: ltr;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  font-feature-settings: 'liga';
  -webkit-font-feature-settings: 'liga';
  -moz-font-feature-settings: 'liga';
  user-select: none;
  font-family: 'Material Symbols Outlined';
}
```

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- The zone is a `<label>` around a visually hidden `<input type="file">`. Clicking the zone opens the picker natively, and the input is the one focusable control, named by `aria-label` and described by the help text. Do not use a `<div role="button">` with the input inside it - that nests one control in another.
- Filter dropped files by the same `accept` and `multiple` rules as the picker, and reset the input value after each choice so picking the same file twice still fires.
- Border is 2px dashed `--border-control`; a 1px dash reads as a table rule at this size.
- The drag state and hover share one look: `--primary` border on a `--blue-100` wash. A drag shows it even in error, because the zone is about to take a new file; hover keeps the error red. Handle `dragover`, `dragleave` and `drop`, and `preventDefault` on dragover or the browser opens the file instead.
- Always state the constraint ("PNG, JPG or PDF up to 10MB") - a bare drop zone gives no way to know what will be rejected.
- Disabled dims the icon and the prompt to 0.6 and drops the link look from "browse", but not the help text: say there why uploading is not possible, and keep it readable.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:            #004080;
  --error:              #D32F2F;
  --white:              #ffffff;
  --gray-600:           #7A7A7A;
  --gray-700:           #595959;
  --blue-100:           #F0F7FF;
  --text-primary:       rgba(0, 0, 0, 0.87);
  --border-control:     var(--gray-600);
  --surface:            var(--white);
  --muted-foreground:   var(--gray-700);
  --radius-md:          8px;
  --focus-ring-width:   2px;
  --focus-ring-offset:  2px;
  --focus-ring-color:   var(--primary);
  --duration-fast:      100ms;
  --easing-standard:    cubic-bezier(0.2, 0, 0, 1);
  --font-sans:          'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-upload {
  /* Anchors the visually hidden input, so focusing it never scrolls the page. */
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 32px 24px;
  /* Dashed, and 2px - a 1px dashed border reads as a table rule at this size. */
  border: 2px dashed var(--border-control);
  border-radius: var(--radius-md);
  background: var(--surface);
  cursor: pointer;
  text-align: center;
  font-family: var(--font-sans);
  transition: all var(--duration-fast) var(--easing-standard);
}

/* The input inside has the focus; the zone draws the ring for it. */
.inspera-upload:has(.inspera-upload__input:focus-visible) {
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

/* The native input is the real control: visually hidden but focusable, and
   named by aria-label. A 0x0 input is skipped by some browsers' Tab order. */
.inspera-upload__input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.inspera-upload--error {
  border-color: var(--error);
}
.inspera-upload--error .inspera-upload__icon,
.inspera-upload--error .inspera-upload__help { color: var(--error); }

/* The pointer and a drag share one look. A drag shows even in error - the
   zone is about to take a new file - while hover keeps an error's red. */
.inspera-upload:not(.inspera-upload--disabled):not(.inspera-upload--error):hover,
.inspera-upload--dragging {
  border-color: var(--primary);
  background: var(--blue-100);
}
.inspera-upload--dragging .inspera-upload__icon { color: var(--primary); }

.inspera-upload--disabled {
  cursor: not-allowed;
}
/* Disabled dims the icon and the prompt, not the help text: it usually says
   why uploading is not possible, so it stays readable. "browse" stops looking
   like a link. */
.inspera-upload--disabled .inspera-upload__icon,
.inspera-upload--disabled .inspera-upload__prompt { opacity: 0.6; }
.inspera-upload--disabled .inspera-upload__browse { color: inherit; font-weight: inherit; }
```

```html
<!-- A <label> around the file input: clicking anywhere opens the picker
     natively, and the input stays the one focusable, named control. -->
<label class="inspera-upload" for="attachments">
  <span class="material-symbols-outlined inspera-upload__icon" aria-hidden="true">upload_file</span>
  <span class="inspera-upload__prompt" aria-hidden="true">
    Drag &amp; drop or <span class="inspera-upload__browse">browse</span>
  </span>
  <span class="inspera-upload__help" id="attachments-help">PNG, JPG or PDF up to 10MB</span>
  <input class="inspera-upload__input" id="attachments" type="file" accept="image/*,.pdf" multiple
         aria-label="Attachments" aria-describedby="attachments-help" />
</label>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
