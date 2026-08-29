/**
 * Framework-free visual contracts.
 *
 * The prop API in `components.ts` answers "how do I call this component".
 * It only helps someone who already *has* the component. In an AI builder
 * that cannot install `@inspera/components` — v0, Lovable, Bolt, a fresh
 * Figma Make file — the model hand-rolls the element instead, and every
 * visual fact the API doc leaves out (radius, fill, padding, weight, the
 * hover shade) gets filled in from that tool's defaults. That is the whole
 * reason a pasted spec produces an off-brand button.
 *
 * A recipe closes the gap: the same component expressed as plain HTML plus
 * plain CSS, with nothing left to infer. `scripts/audit-recipes.ts` renders
 * the real React component and the recipe side by side in Chrome and fails
 * if any computed value diverges, so this cannot quietly drift out of sync
 * with the implementation it describes.
 */

export interface Recipe {
  /** Root class the recipe defines, e.g. `inspera-btn`. */
  className: string
  /** Self-contained CSS. Every `var(--…)` it uses is emitted alongside it. */
  css: string
  /** Canonical markup, one line per realistic usage. */
  html: string
  /** Facts a model gets wrong when left to guess. */
  notes?: string[]
}

const button: Recipe = {
  className: 'inspera-btn',
  css: `.inspera-btn {
  /* Fill, text and border come from the intent modifier below. */
  --btn-bg: var(--primary);
  --btn-fg: var(--white);
  --btn-border: transparent;
  --btn-shadow: var(--effect-button-shadow);
  --btn-bg-hover: color-mix(in srgb, var(--btn-bg) 90%, black);
  --btn-bg-active: color-mix(in srgb, var(--btn-bg) 82%, black);
  --btn-shadow-hover: inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 2px 6px rgba(0, 64, 128, 0.24);
  --btn-shadow-active: inset 0 1px 2px rgba(0, 0, 0, 0.24);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  min-width: 80px;
  padding: 0 16px;
  border-radius: var(--radius-sm);
  border: var(--border-width-default) solid var(--btn-border);
  background: var(--btn-bg);
  color: var(--btn-fg);
  box-shadow: var(--btn-shadow);
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.25;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background var(--duration-fast) var(--easing-standard),
    border-color var(--duration-fast) var(--easing-standard),
    box-shadow var(--duration-fast) var(--easing-standard),
    transform var(--duration-fast) var(--easing-standard);
}

/* Sizes change height, padding and gap only — never the 16px type. */
.inspera-btn--small { height: 32px; padding: 0 12px; gap: 6px; }
.inspera-btn--large { height: 48px; padding: 0 24px; gap: 10px; }

/* Solid intents differ only in fill; hover and pressed derive from it. */
.inspera-btn--primary     { --btn-bg: var(--primary); }
.inspera-btn--success     { --btn-bg: var(--success); }
.inspera-btn--warning     { --btn-bg: var(--warning); }
.inspera-btn--destructive { --btn-bg: var(--error); }
.inspera-btn--secondary {
  --btn-bg: var(--gray-100);
  --btn-fg: var(--gray-900);
  --btn-border: var(--gray-700);
}

/* Outline and Text carry no fill and no shadow; they tint on interaction. */
.inspera-btn--outline,
.inspera-btn--text {
  --btn-bg: transparent;
  --btn-fg: var(--primary);
  --btn-shadow: none;
  --btn-shadow-hover: none;
  --btn-shadow-active: none;
  --btn-bg-hover: color-mix(in srgb, var(--primary) 8%, transparent);
  --btn-bg-active: color-mix(in srgb, var(--primary) 12%, transparent);
}
.inspera-btn--outline { --btn-border: var(--primary); }

.inspera-btn:hover:not(:disabled) {
  background: var(--btn-bg-hover);
  box-shadow: var(--btn-shadow-hover);
}
.inspera-btn:active:not(:disabled) {
  background: var(--btn-bg-active);
  box-shadow: var(--btn-shadow-active);
  transform: translateY(1px);
}
.inspera-btn:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}
.inspera-btn:disabled { opacity: 0.38; cursor: not-allowed; }

.inspera-btn .material-symbols-outlined { font-size: 20px; }`,
  html: `<button type="button" class="inspera-btn inspera-btn--primary">Save</button>

<button type="button" class="inspera-btn inspera-btn--secondary inspera-btn--small">Cancel</button>

<button type="button" class="inspera-btn inspera-btn--destructive">Delete test</button>

<!-- Icon + Text. The icon is Material Symbols Outlined, never another set. -->
<button type="button" class="inspera-btn inspera-btn--primary">
  <span class="material-symbols-outlined" aria-hidden="true">add</span>
  <span>Add question</span>
</button>

<!-- Icon-only still needs an accessible name. -->
<button type="button" class="inspera-btn inspera-btn--text" aria-label="More options">
  <span class="material-symbols-outlined" aria-hidden="true">more_vert</span>
</button>`,
  notes: [
    'Corner radius is 4px (`--radius-sm`). Not 6, not 8, not `rounded-lg`.',
    'Type is 16px/600 at every size — Small and Large change height, padding and gap only.',
    'Primary is `--primary` #004080, a deep navy. It is not a mid blue and never a gradient.',
    'Every solid intent carries the inset top-light button shadow; Outline and Text carry none.',
    'Hover darkens the fill to 90% and pressed to 82%, both mixed toward black — no separate hover token.',
    'Minimum width is 80px, so short labels still read as buttons.',
  ],
}

export const recipes: Record<string, Recipe> = { button }
