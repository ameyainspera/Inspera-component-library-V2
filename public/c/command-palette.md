<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera - Command Palette

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

### Command Palette

Search and run commands from a keyboard-driven overlay. - category: `feedback`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { CommandPalette } from '@inspera/components'

<CommandPalette
  hotkey={true}
  open={open}
  onOpenChange={setOpen}
  commands={[
    { id: 'new-test', label: 'Create new test', icon: 'add_circle', group: 'Actions', onSelect: createTest },
    { id: 'go-monitor', label: 'Go to Monitor', icon: 'monitor_heart', group: 'Navigate', onSelect: () => navigate('/monitor') },
  ]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `commands` | `Command[]` | `defaultCommands` | The commands to search. |
| `open` | `boolean` | - | Controlled open state. Omit to let the component manage its own. |
| `defaultOpen` | `boolean` | `false` | Open initially (uncontrolled). |
| `hotkey` | `boolean` | `true` | Bind Cmd/Ctrl+K to toggle the palette. |
| `embedded` | `boolean` | `false` | Render the panel inline without the portal or dimmed overlay. Used by the docs to show the palette on the page (and by the recipe audit, which cannot see through a portal). Mirrors the `embedded` prop on Dialog and Drawer. |
| `placeholder` | `string` | `'Type a command or search...'` | Search field placeholder. |
| `emptyText` | `string` | `'No matching commands'` | Shown when nothing matches. |
| `onOpenChange` | `(open: boolean) => void` | - | Fired when the open state should change. |
| `onSelect` | `(command: Command) => void` | - | Fired with the chosen command. |

```ts
export interface Command {
  /** Stable id. */
  id: string
  /** Primary label shown in the list. */
  label: string
  /** Optional Material Symbols icon. */
  icon?: string
  /** Optional grouping heading. */
  group?: string
  /** Right-aligned hint, e.g. a shortcut or section name. */
  hint?: string
  /** Extra words to match against beyond the label. */
  keywords?: string
  /** Fired when the command is chosen. */
  onSelect?: () => void
}
```

**Accessibility** - role `dialog`, keyboard operable. Panel is a role="dialog" with aria-modal; The list uses role="listbox" and items role="option"; Cmd/Ctrl+K toggles it; Up / Down / Enter navigate and run.

**Do:** Group commands by section; Bind a discoverable hotkey (Cmd/Ctrl+K); Filter commands as the user types.
**Don't:** Do not bury primary navigation only here; Do not leave focus trapped when it closes.

**Deprecated aliases** (do not use): `Command menu`, `Quick actions`, `Spotlight`

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

- On the page the panel sits inside a fixed, dimmed overlay (`position: fixed; inset: 0`) centred horizontally and pushed down ~12vh. `embedded` renders just the panel for documentation.
- The panel is `--radius-lg` on `--white` with `--shadow-300`; the 52px search row is divided from the list by a `--border` rule.
- Commands group under uppercase 12px headings; the heading renders inline as the list is walked so grouped and ungrouped commands share one keyboard index.
- The active option is filled `--blue-100` and starts on the first row. Up / Down move it, Enter runs it, Escape closes; Cmd/Ctrl+K toggles the whole palette.
- It is a `role="dialog"` with `aria-modal`; the input is `role="combobox"` over a `role="listbox"`. Return focus to the trigger when it closes.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --white:             #ffffff;
  --gray-200:          #EDEDED;
  --gray-600:          #7A7A7A;
  --blue-100:          #F0F7FF;
  --action-active:     rgba(0, 0, 0, 0.56);
  --text-primary:      rgba(0, 0, 0, 0.87);
  --border:            var(--gray-200);
  --muted-foreground:  var(--gray-600);
  --radius-xs:         2px;
  --radius-sm:         4px;
  --radius-lg:         12px;
  --shadow-300:        0px 8px 16px rgba(39, 39, 39, 0.08), 0px 6px 8px rgba(39, 39, 39, 0.12);
  --font-sans:         'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-cmdk {
  width: min(560px, calc(100vw - 32px));
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-300);
  overflow: hidden;
  font-family: var(--font-sans);
}

.inspera-cmdk__search {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 52px;
  padding: 0 16px;
  border-bottom: 1px solid var(--border);
}

.inspera-cmdk__search-icon { font-size: 22px; color: var(--muted-foreground); }

.inspera-cmdk__input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-sans);
  font-size: 18px;
  color: var(--text-primary);
}

.inspera-cmdk__kbd {
  font-size: 12px;
  color: var(--muted-foreground);
  border: 1px solid var(--border);
  border-radius: var(--radius-xs);
  padding: 2px 6px;
}

.inspera-cmdk__list {
  list-style: none;
  margin: 0;
  padding: 8px;
  max-height: 360px;
  overflow-y: auto;
}

.inspera-cmdk__group {
  padding: 10px 16px 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--muted-foreground);
}

.inspera-cmdk__option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  background: transparent;
  color: var(--text-primary);
  font-size: 16px;
}
.inspera-cmdk__option[aria-selected='true'] { background: var(--blue-100); }

.inspera-cmdk__option-icon { font-size: 22px; color: var(--action-active); }
.inspera-cmdk__option-label { flex: 1; }
.inspera-cmdk__option-hint { font-size: 13px; color: var(--muted-foreground); }
```

```html
<!-- The panel lives inside a fixed, dimmed overlay centred near the top. -->
<div class="inspera-cmdk" role="dialog" aria-modal="true" aria-label="Command palette">
  <div class="inspera-cmdk__search">
    <span class="material-symbols-outlined inspera-cmdk__search-icon" aria-hidden="true">search</span>
    <input class="inspera-cmdk__input" role="combobox" aria-expanded="true"
           aria-controls="cmdk-list" aria-autocomplete="list"
           placeholder="Type a command or search..." />
    <kbd class="inspera-cmdk__kbd">Esc</kbd>
  </div>
  <ul class="inspera-cmdk__list" id="cmdk-list" role="listbox">
    <li>
      <div class="inspera-cmdk__group">Actions</div>
      <div class="inspera-cmdk__option" role="option" aria-selected="true">
        <span class="material-symbols-outlined inspera-cmdk__option-icon" aria-hidden="true">add_circle</span>
        <span class="inspera-cmdk__option-label">Create new test</span>
        <span class="inspera-cmdk__option-hint">C then T</span>
      </div>
    </li>
    <li>
      <div class="inspera-cmdk__group">Navigate</div>
      <div class="inspera-cmdk__option" role="option" aria-selected="false">
        <span class="material-symbols-outlined inspera-cmdk__option-icon" aria-hidden="true">send</span>
        <span class="inspera-cmdk__option-label">Go to Deliver</span>
      </div>
    </li>
  </ul>
</div>
```


---

Tokens: ./tokens.css | Full system: ./llms.txt
