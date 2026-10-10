<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera Design System - Navigation

> Version 1.0.0. Part 7 of 7 of the AI spec: Tabs, Breadcrumb, Pagination, Menu, Stepper, Link.
>
> These specs build on `inspera-01-core.md` - its rules, its setup
> (fonts, icon class, tokens) and its foundations. If that file is not in your
> context, ask for it before building. Without it, fonts, icons and colours
> come out wrong.

## Components - navigation

### Tabs

Organise content into switchable panels. - category: `navigation`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Tabs } from '@inspera/components'

<Tabs
  items={[
    { label: 'Overview' },
    { label: 'Questions' },
    { label: 'Settings' },
    { label: 'Results' },
  ]}
  label="Assessment sections"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` **(required)** | `TabItem[]` | - | The tabs, in order. |
| `variant` | `'Underline' \| 'Contained'` | `'Underline'` | Visual treatment. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Tab height 40 / 48. |
| `fullWidth` | `boolean` | `false` | Stretch tabs to fill the row. |
| `value` | `string` | - | Active tab's value. Controlled - pair with onChange. |
| `defaultValue` | `string` | - | Starting tab when uncontrolled. Defaults to the first. |
| `onChange` | `(value: string) => void` | - | Fired with the newly selected tab's value. |
| `label` | `string` | - | Names the tab list for assistive tech, when no heading does. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

```ts
export interface TabItem {
  label: string
  /** Identifies the tab in value/onChange. Defaults to the label. */
  value?: string
  icon?: string
  /** The tab's panel. When items carry content, Tabs renders the panels too. */
  content?: ReactNode
}
```

**Accessibility** - role `tablist`, keyboard operable. Use role="tablist" on the tab container; Each tab uses role="tab" with aria-selected; Tab panels use role="tabpanel" linked by aria-labelledby; Arrow keys navigate between tabs.

**Do:** Use to organise related content sections; Label tabs clearly and concisely; Use a maximum of 6 tabs per set.
**Don't:** Do not use tabs for sequential steps - use Stepper instead; Do not nest tab sets inside other tab sets.

**Choosing a variant:**
- `variant="Underline"`: Sibling views of one thing, right under its title, such as a test's Overview, Candidates and Settings.
- `variant="Contained"`: A compact switch inside a panel, such as the rubric and the marking guide beside a response.
- `size="Small"`: Inside cards and panels, such as the views of a chart.
- `fullWidth`: A narrow panel, where the tabs share its width, such as Questions and Resources in the question set editor.

**Deprecated aliases** (do not use): `Tab bar`, `Tab navigation`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- Underline tabs are 48px tall (40px small) on a 1px `--border-strong` rail, with `margin-bottom: -1px` so the selected 2px `--primary` underline covers the rail.
- The resting bottom border is a transparent 2px, not none - otherwise selecting a tab shifts the whole row by two pixels.
- Contained tabs drop the rail entirely and become a pill group on `--gray-100`, with the selected tab a white `--shadow-100` card.
- `role="tablist"` / `role="tab"` / `role="tabpanel"`, each tab pointing at its panel with `aria-controls` and each panel back with `aria-labelledby`.
- Roving tabindex: only the selected tab is a tab stop; Left/Right move between them.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:        #004080;
  --white:          #ffffff;
  --gray-100:       #F7F7F7;
  --gray-300:       #D9D9D9;
  --gray-700:       #595959;
  --border-strong:  var(--gray-300);
  --radius-xs:      2px;
  --radius-sm:      4px;
  --shadow-100:     0px 4px 4px rgba(39, 39, 39, 0.08), 0px 2px 4px rgba(39, 39, 39, 0.12);
  --font-sans:      'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-tabs {
  display: flex;
  gap: 0;
  padding: 0;
  border-bottom: 1px solid var(--border-strong);
  background: transparent;
  border-radius: 0;
  width: auto;
}

.inspera-tabs--full { width: 100%; }

/* Contained: a pill group on a tinted track, with no rail underneath. */
.inspera-tabs--contained {
  gap: 4px;
  padding: 4px;
  border-bottom: none;
  background: var(--gray-100);
  border-radius: var(--radius-sm);
}

.inspera-tabs__tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 48px;
  padding: 0 16px;
  flex: none;
  border-top: none;
  border-right: none;
  border-left: none;
  /* A transparent 2px rail at rest, so selecting a tab does not shift the row. */
  border-bottom: 2px solid transparent;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  color: var(--gray-700);
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: -1px;
  transition: color 120ms ease, border-color 120ms ease;
}

.inspera-tabs--small .inspera-tabs__tab { height: 40px; }
.inspera-tabs--full .inspera-tabs__tab { flex: 1; }

.inspera-tabs__tab[aria-selected='true'] {
  border-bottom-color: var(--primary);
  color: var(--primary);
}

/* Contained tabs sit inside the track: no rail, a raised white card instead. */
.inspera-tabs--contained .inspera-tabs__tab {
  height: 40px;
  border-bottom: none;
  border-radius: var(--radius-xs);
  margin-bottom: 0;
}
.inspera-tabs--contained.inspera-tabs--small .inspera-tabs__tab { height: 32px; }

.inspera-tabs--contained .inspera-tabs__tab[aria-selected='true'] {
  background: var(--white);
  box-shadow: var(--shadow-100);
  color: var(--primary);
}

.inspera-tabs__tab .material-symbols-outlined { font-size: 20px; }
```

```html
<div class="inspera-tabs" role="tablist" aria-label="Section tabs">
  <button type="button" class="inspera-tabs__tab" role="tab" aria-selected="true"
          id="tab-overview" aria-controls="panel-overview" tabindex="0">Overview</button>
  <button type="button" class="inspera-tabs__tab" role="tab" aria-selected="false"
          id="tab-questions" aria-controls="panel-questions" tabindex="-1">Questions</button>
</div>

<div id="panel-overview" role="tabpanel" aria-labelledby="tab-overview" tabindex="0">...</div>
<div id="panel-questions" role="tabpanel" aria-labelledby="tab-questions" tabindex="0" hidden>...</div>
```


### Breadcrumb

Show the user's current location in a hierarchy. - category: `navigation`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Breadcrumb } from '@inspera/components'

<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Assessments', href: '/assessments' },
    { label: 'Mathematics', href: '/assessments/mathematics' },
    'Algebra Quiz',
  ]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` **(required)** | `(string \| BreadcrumbItem)[]` | - | Trail from root to current page. The last entry is the current page and is not a link. |
| `separator` | `'Slash' \| 'Chevron'` | `'Chevron'` | Divider glyph between items. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Text size 14 / 16. |
| `onNavigate` | `(index: number) => void` | - | Fired with the index of a crumb without an href, for client-side routing. |
| `label` | `string` | `'Breadcrumb'` | Names the navigation landmark. |

Also accepts any native `<nav>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<nav>`. `className` and `style` go on the outermost element.

```ts
export interface BreadcrumbItem {
  label: string
  /** Link target. Crumbs with an href are real links - they open in a new tab and show their URL. */
  href?: string
}
```

**Accessibility** - role `navigation`, keyboard operable. Wrap in nav with aria-label="Breadcrumb"; Use an ordered list for semantic structure; Mark current page with aria-current="page".

**Do:** Use where pages sit in a hierarchy; Always include the current page as the last item; Keep breadcrumb labels concise.
**Don't:** Do not use for flat navigation; Do not make the current page a link.

**Choosing a variant:**
- `separator="Chevron"`: Pages in a hierarchy, in the location bar or above a page title. The default.
- `separator="Slash"`: A path of folders, such as where a question is saved in the question bank.
- `size="Small"`: The location bar under the product's top bar.

**Deprecated aliases** (do not use): `Breadcrumbs`, `Path navigation`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- It is a `<nav aria-label="Breadcrumb">` wrapping an `<ol>` - order is the meaning, so not a `<div>` of spans.
- The last crumb is the current page: `aria-current="page"`, `--text-primary` at 500 weight, and not a control.
- Each separator is an `aria-hidden="true"` span inside the item of the crumb before it, so a wrapped trail never starts a line with one. Left announced, a screen reader reads "chevron right" between every crumb.
- Crumbs are 16px (14px small) in `--primary`, underlined on hover only. The chevron runs 2px larger than the text.
- With real URLs use `<a href>` rather than `<button>`, keeping the same class - a breadcrumb should be openable in a new tab.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:       #004080;
  --gray-400:      #BCBCBC;
  --text-primary:  rgba(0, 0, 0, 0.87);
  --font-sans:     'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-breadcrumb {
  font-family: var(--font-sans);
}

.inspera-breadcrumb__list {
  display: flex;
  align-items: center;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
}

/* Each separator sits in the item of the crumb before it, so a wrapped trail
   breaks after a separator and never starts a line with one. */
.inspera-breadcrumb__list > li {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* A crumb. Rendered as <button> in the React component because navigation runs
   through a router callback; with real URLs, use <a href> and the same class. */
.inspera-breadcrumb__crumb {
  padding: 0;
  border: none;
  background: none;
  color: var(--primary);
  font-family: var(--font-sans);
  font-size: 16px;
  text-decoration: none;
  cursor: pointer;
}
.inspera-breadcrumb__crumb:hover { text-decoration: underline; }

.inspera-breadcrumb--small .inspera-breadcrumb__crumb { font-size: 14px; }

/* The last crumb is the current page: darker, heavier, and not interactive. */
.inspera-breadcrumb__current {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}
.inspera-breadcrumb--small .inspera-breadcrumb__current { font-size: 14px; }

/* The separator sizes its own glyph, so the chevron can run 2px larger than
   the text while the slash matches it. */
.inspera-breadcrumb__separator {
  color: var(--gray-400);
  display: inline-flex;
  align-items: center;
}

.inspera-breadcrumb__separator .material-symbols-outlined { font-size: 18px; }
.inspera-breadcrumb--small .inspera-breadcrumb__separator .material-symbols-outlined { font-size: 16px; }

.inspera-breadcrumb__slash { font-size: 16px; }
.inspera-breadcrumb--small .inspera-breadcrumb__slash { font-size: 14px; }
```

```html
<nav class="inspera-breadcrumb" aria-label="Breadcrumb">
  <ol class="inspera-breadcrumb__list">
    <li>
      <a class="inspera-breadcrumb__crumb" href="/">Home</a>
      <span class="inspera-breadcrumb__separator" aria-hidden="true"><span class="material-symbols-outlined">chevron_right</span></span>
    </li>
    <li>
      <a class="inspera-breadcrumb__crumb" href="/assessments">Assessments</a>
      <span class="inspera-breadcrumb__separator" aria-hidden="true"><span class="material-symbols-outlined">chevron_right</span></span>
    </li>
    <li><span class="inspera-breadcrumb__current" aria-current="page">Algebra Quiz</span></li>
  </ol>
</nav>
```


### Pagination

Navigate between pages of content. - category: `navigation`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Pagination } from '@inspera/components'

<Pagination
  pageCount={12}
  defaultPage={4}
  onChange={loadPage}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `pageCount` **(required)** | `number` | - | Total number of pages. |
| `page` | `number` | - | Current page (1-based). Controlled - pair with onChange. |
| `defaultPage` | `number` | `1` | Starting page when uncontrolled. |
| `siblingCount` | `number` | `1` | Pages shown either side of current. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Control height. |
| `showEdges` | `boolean` | `true` | Show first / last controls. |
| `onChange` | `(page: number) => void` | - | Fired with the requested page number, 1-based. |
| `label` | `string` | `'Pagination'` | Names the navigation landmark. Give each pager on a page its own. |

Also accepts any native `<nav>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<nav>`. `className` and `style` go on the outermost element.

**Accessibility** - role `navigation`, keyboard operable. Wrap in nav with aria-label="Pagination"; Mark the current page with aria-current="page"; Disable Previous on the first page and Next on the last.

**Do:** Use for long, paged result sets; Show current, first, and last pages; Collapse large gaps with an ellipsis.
**Don't:** Do not use for a handful of items; Do not hide the current page indicator.

**Choosing a variant:**
- `size="Medium"`: Under a long list that fills the page, such as all tests. The default size.
- `size="Small"`: Dense or narrow places, such as stepping through responses while marking.
- `showEdges`: Many pages, where jumping to the first or last one saves clicks.
- `showEdges="false"`: Up to about 7 pages, when every page number is already shown.

**Deprecated aliases** (do not use): `Pager`, `Page navigation`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- A `<nav aria-label="Pagination">` around a `<ul>`; the current page is a button with `aria-current="page"`, filled `--primary`.
- Every page button needs a real label ("Page 4"), and the arrows need "Previous page" / "Next page". A bare chevron announces as nothing.
- The ellipsis is a `<span>` marked `aria-hidden`, not a disabled button - it is a gap marker, not a control.
- Cells are 40px (32px small) with `--radius-md` and a 4px gap, and the list wraps rather than overflowing in a narrow column.
- Disable the arrows at the ends rather than hiding them, so the control does not change width as you page.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:           #004080;
  --white:             #ffffff;
  --gray-700:          #595959;
  --action-hover:      rgba(0, 0, 0, 0.04);
  --action-disabled:   rgba(0, 0, 0, 0.38);
  --text-primary:      rgba(0, 0, 0, 0.87);
  --muted-foreground:  var(--gray-700);
  --radius-sm:         4px;
  --font-sans:         'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-pagination__list {
  display: flex;
  align-items: center;
  /* Wrap rather than overflow: a long pager has to degrade in a narrow column,
     not spill out of it. */
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.inspera-pagination__item {
  min-width: 40px;
  height: 40px;
  padding: 0 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease;
}

.inspera-pagination--small .inspera-pagination__item {
  min-width: 32px;
  height: 32px;
  font-size: 14px;
}

.inspera-pagination__item:hover:not(:disabled):not([aria-current='page']) {
  background: var(--action-hover);
}

.inspera-pagination__item[aria-current='page'] {
  background: var(--primary);
  color: var(--white);
}

.inspera-pagination__item:disabled {
  color: var(--action-disabled);
  cursor: not-allowed;
}

.inspera-pagination__item .material-symbols-outlined { font-size: 20px; }
.inspera-pagination--small .inspera-pagination__item .material-symbols-outlined { font-size: 18px; }

/* The gap marker is not a control: a span, hidden from assistive tech. */
.inspera-pagination__ellipsis {
  cursor: default;
  color: var(--muted-foreground);
}
```

```html
<nav class="inspera-pagination" aria-label="Pagination">
  <ul class="inspera-pagination__list">
    <li><button type="button" class="inspera-pagination__item" aria-label="Previous page">
      <span class="material-symbols-outlined" aria-hidden="true">chevron_left</span>
    </button></li>
    <li><button type="button" class="inspera-pagination__item" aria-label="Page 1">1</button></li>
    <li><span class="inspera-pagination__item inspera-pagination__ellipsis" aria-hidden="true">...</span></li>
    <li><button type="button" class="inspera-pagination__item" aria-label="Page 4" aria-current="page">4</button></li>
    <li><button type="button" class="inspera-pagination__item" aria-label="Next page">
      <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
    </button></li>
  </ul>
</nav>
```


### Menu

Present a list of actions in a dropdown. - category: `navigation`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Menu } from '@inspera/components'

<Menu
  label="Actions"
  items={[
    { label: 'Edit', icon: 'edit' },
    { label: 'Duplicate', icon: 'content_copy' },
    { label: 'Share', icon: 'share' },
    { label: '', divider: true },
    { label: 'Delete', icon: 'delete', danger: true },
  ]}
  onSelect={handleSelect}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Trigger text. With `iconOnly` it is not shown but names the trigger and the menu, so make it specific: "Actions for Algebra Quiz", not "Actions". |
| `items` **(required)** | `MenuItem[]` | - | Menu items, in order. |
| `placement` | `'BottomStart' \| 'BottomEnd'` | `'BottomStart'` | Aligns the menu to the trigger's start or end edge. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Trigger height 32 / 40 (`--control-height-sm/md`). Small also steps down to 14px text and a 16px icon. |
| `iconOnly` | `boolean` | `false` | Show only an icon - a Text icon-only Button. The overflow trigger for table rows, card headers and toolbars. |
| `icon` | `string` | `'more_vert'` | Material Symbols name for the icon-only trigger. |
| `open` | `boolean` | - | Open state. Controlled - pair with onOpenChange. |
| `defaultOpen` | `boolean` | `false` | Open on mount, when uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | - | Fired when the menu opens or closes. |
| `onSelect` | `(value: string, item: MenuItem) => void` | - | Fired with the chosen item's value (its label, unless set). |

Also accepts any native `<button>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<button>`. `className` and `style` go on the outermost element.

```ts
export interface MenuItem {
  label: string
  /** Passed to onSelect. Defaults to the label. */
  value?: string
  icon?: string
  /** Red text, for destructive actions. Put these last, after a divider. */
  danger?: boolean
  disabled?: boolean
  /** A separator line instead of an item; `label` is ignored. */
  divider?: boolean
  /** Fired when this item is chosen, before the menu-level onSelect. */
  onSelect?: () => void
}
```

**Accessibility** - role `menu`, keyboard operable. Trigger uses aria-haspopup="menu" and aria-expanded; An icon-only trigger is named by label, which says what it acts on: "Actions for Ada Lovelace"; Items use role="menuitem"; Arrow keys move, Enter selects, Escape closes; Outside click closes the menu.

**Do:** Use for grouped actions and overflow; Separate destructive actions with a divider; Start item labels with a verb.
**Don't:** Do not use for selecting a value - use Select; Do not nest menus more than one level.

**Choosing a variant:**
- `placement="BottomStart"`: A trigger at the left of a toolbar, such as the actions for selected candidates. The menu lines up with its left edge.
- `placement="BottomEnd"`: A trigger at the right edge, such as More in a page header or the actions on a table row, so the menu opens inward.
- `iconOnly`: The actions for one table row or one card, where a labelled trigger repeated on every row would crowd it. Name it for its row.
- `size="Small"`: Table rows and dense toolbars, beside Small buttons and inputs.

**Deprecated aliases** (do not use): `Dropdown menu`, `Action menu`, `Context menu`, `Overflow menu`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- The trigger takes `aria-haspopup="menu"`, `aria-expanded` and `aria-controls`; the panel is `role="menu"` with `role="menuitem"` buttons at `tabindex="-1"`.
- Focus stays on the trigger and the arrows move a highlight, so hover and the keyboard cursor must drive the same `--active` state.
- Separators are `role="separator"` and `aria-hidden`, 1px of `--border` with a 4px margin.
- Destructive items are `--error` text, never a red fill - a filled row reads as selected.
- The trigger is `--radius-sm`, like the buttons and fields beside it: 40px, or 32px with 14px text for Small. The panel is `--radius-md` on `--surface` with `--shadow-200` and a 180px floor, anchored 4px under the trigger. Bottom End flips it to `right: 0` for menus near the viewport edge.
- For row and card actions, use the icon-only trigger: a Text icon-only button with `more_vert`, keeping its hover fill while open. It shows no text, so its `aria-label` names the thing it acts on ("Actions for Ada Lovelace").
- Escape closes and returns focus to the trigger; an outside click closes without moving focus.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --error:                  #D32F2F;
  --success:                #2E7D32;
  --white:                  #ffffff;
  --gray-100:               #F7F7F7;
  --gray-200:               #EDEDED;
  --gray-300:               #D9D9D9;
  --gray-700:               #595959;
  --gray-900:               #272727;
  --orange-600:             #F2A202;
  --primary-focus-ring:     rgba(0, 64, 128, 0.3);
  --action-hover:           rgba(0, 0, 0, 0.04);
  --action-disabled:        rgba(0, 0, 0, 0.38);
  --text-primary:           rgba(0, 0, 0, 0.87);
  --surface:                var(--white);
  --border:                 var(--gray-200);
  --border-strong:          var(--gray-300);
  --control-height-sm:      32px;
  --control-height-md:      40px;
  --control-height-lg:      44px;
  --radius-sm:              4px;
  --radius-md:              8px;
  --shadow-200:             0px 8px 8px rgba(39, 39, 39, 0.08), 0px 4px 6px rgba(39, 39, 39, 0.12);
  --effect-button-shadow:   inset 0px -1px 0px rgba(0, 0, 0, 0.2), 0px 1px 0px rgba(0, 0, 0, 0.08);
  --border-width-default:   1px;
  --focus-ring-width:       2px;
  --focus-ring-offset:      2px;
  --focus-ring-color:       var(--primary);
  --duration-fast:          100ms;
  --easing-standard:        cubic-bezier(0.2, 0, 0, 1);
  --z-dropdown:             300;
  --font-sans:              'Inter', system-ui, -apple-system, sans-serif;
  --medium-14-size:         14px;
  --medium-14-line-height:  1.4;
}

.inspera-btn {
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
  height: var(--control-height-md);
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

/* Sizes change height and padding. Small also steps down to 14px type and a
   16px icon (see the end of this block). */
.inspera-btn--small {
  height: var(--control-height-sm);
  padding: 0 12px;
  gap: 4px;
  font-size: var(--medium-14-size);
  line-height: var(--medium-14-line-height);
}
.inspera-btn--large { height: var(--control-height-lg); padding: 0 20px; }

/* Icon only: a square the height of the button. It still needs aria-label. */
.inspera-btn--icon-only { width: var(--control-height-md); min-width: 0; padding: 0; }
.inspera-btn--small.inspera-btn--icon-only { width: var(--control-height-sm); }
.inspera-btn--large.inspera-btn--icon-only { width: var(--control-height-lg); }

/* Solid intents differ only in fill; hover and pressed derive from it. */
.inspera-btn--primary     { --btn-bg: var(--primary); }
.inspera-btn--success     { --btn-bg: var(--success); }
/* Warning takes dark text on orange-600: white on --warning is 3.08:1. */
.inspera-btn--warning     { --btn-bg: var(--orange-600); --btn-fg: var(--gray-900); }
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
/* A button that opens a menu keeps its hover fill while the menu is open. */
.inspera-btn[aria-expanded='true'] { background: var(--btn-bg-hover); }
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

.inspera-btn .material-symbols-outlined { font-size: 20px; }
.inspera-btn--small .material-symbols-outlined { font-size: 16px; }

.inspera-menu {
  position: relative;
  display: inline-block;
  font-family: var(--font-sans);
}

.inspera-menu__trigger {
  height: var(--control-height-md);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-strong);
  background: var(--white);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: none;
  transition: box-shadow 120ms ease;
}

.inspera-menu__trigger[aria-expanded='true'] {
  box-shadow: 0 0 0 3px var(--primary-focus-ring);
}

.inspera-menu__trigger .material-symbols-outlined {
  font-size: 20px;
  transition: transform 140ms ease;
}
.inspera-menu__trigger[aria-expanded='true'] .material-symbols-outlined { transform: rotate(180deg); }

/* Small: 32px, with 14px text and a 16px chevron, as a Small button. */
.inspera-menu__trigger--small {
  height: var(--control-height-sm);
  gap: 4px;
  padding: 0 8px;
  font-size: 14px;
}
.inspera-menu__trigger--small .material-symbols-outlined { font-size: 16px; }

/* Icon only (table rows, card headers, toolbars): the trigger is the canonical
   Text icon-only button with more_vert, and the menu sits beside it as usual. */

.inspera-menu__list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: auto;
  min-width: 180px;
  padding: 4px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-200);
  z-index: var(--z-dropdown, 20);
}

/* Bottom End aligns the panel's right edge to the trigger's, for a menu near
   the right edge of the viewport. */
.inspera-menu__list--end { left: auto; right: 0; }

.inspera-menu__item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
  text-align: left;
  cursor: pointer;
  opacity: 1;
  transition: background 120ms ease;
}

/* The highlight follows the keyboard cursor, so hover and arrow keys have to
   drive the same state. */
.inspera-menu__item--active,
.inspera-menu__item:hover:not(:disabled) { background: var(--action-hover); }

.inspera-menu__item--danger { color: var(--error); }

.inspera-menu__item:disabled {
  color: var(--action-disabled);
  cursor: not-allowed;
  opacity: 0.6;
}

.inspera-menu__item .material-symbols-outlined { font-size: 20px; }

.inspera-menu__separator {
  height: 1px;
  background: var(--border);
  margin: 4px 0;
}
```

```html
<div class="inspera-menu">
  <button type="button" class="inspera-menu__trigger"
          aria-haspopup="menu" aria-expanded="true" aria-controls="actions-menu">
    Actions
    <span class="material-symbols-outlined" aria-hidden="true">expand_more</span>
  </button>
  <div class="inspera-menu__list" id="actions-menu" role="menu" aria-label="Actions">
    <button type="button" class="inspera-menu__item inspera-menu__item--active" role="menuitem" tabindex="-1">
      <span class="material-symbols-outlined" aria-hidden="true">edit</span>Edit
    </button>
    <div class="inspera-menu__separator" role="separator" aria-hidden="true"></div>
    <button type="button" class="inspera-menu__item inspera-menu__item--danger" role="menuitem" tabindex="-1">
      <span class="material-symbols-outlined" aria-hidden="true">delete</span>Delete
    </button>
  </div>
</div>

<!-- Icon only, for a table row or a card: the trigger is named for what it acts on. -->
<div class="inspera-menu">
  <button type="button" class="inspera-btn inspera-btn--text inspera-btn--small inspera-btn--icon-only"
          aria-haspopup="menu" aria-expanded="false" aria-label="Actions for Ada Lovelace">
    <span class="material-symbols-outlined" aria-hidden="true">more_vert</span>
  </button>
</div>
```


### Stepper

Show progress through a sequence of steps. - category: `navigation`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Stepper } from '@inspera/components'

<Stepper
  steps={[
    { label: 'Details', description: 'Assessment info' },
    { label: 'Questions', description: 'Add content' },
    { label: 'Settings', description: 'Rules & timing' },
    { label: 'Review', description: 'Publish' },
  ]}
  activeStep={1}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `steps` **(required)** | `Step[]` | - | Ordered steps. |
| `activeStep` | `number` | `0` | Zero-based index of the current step. Steps before it show as completed. |
| `orientation` | `'Horizontal' \| 'Vertical'` | `'Horizontal'` | Layout direction. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Indicator size. |

Also accepts any native `<ol>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<ol>`. `className` and `style` go on the outermost element.

```ts
export interface Step {
  label: string
  description?: string
}
```

**Accessibility** - role `list`. Use an ordered list for step semantics; Mark the current step with aria-current="step"; Convey completion with an icon, not colour alone.

**Do:** Use for multi-step flows and wizards; Show completed, current, and upcoming states; Keep step labels short.
**Don't:** Do not use for non-sequential navigation - use Tabs; Do not use more than a handful of steps.

**Choosing a variant:**
- `orientation="Horizontal"`: Across the top of a flow of a few steps, such as New test.
- `orientation="Vertical"`: Beside the content, when each step needs a line of detail, such as what is left before a test can be published.
- `size="Small"`: Inside dialogs and panels, such as importing candidates.

**Deprecated aliases** (do not use): `Wizard`, `Progress steps`, `Step indicator`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- It is an `<ol>`: the order is the meaning. The current step carries `aria-current="step"`.
- Steps take `flex: 1 1 auto`, never `flex: 1`. A zero basis gives every step the same total width, so a long label ends up with a stub connector while a short one gets a long run.
- Keep steps top-aligned. Centring makes the connector sit against the full step height and render down at label level instead of through the circles.
- The connector is offset by half the circle (`margin-top: 15px`, or 11px small) so it passes through the centres.
- Completed and current share the `--primary` fill; only the current one gets the 4px `--primary-focus-ring` halo. Completed shows a tick, upcoming shows its number.
- Indicators are 32px (24px small) and the connector is 2px, filled `--primary` behind completed steps and `--border` ahead of them.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:             #004080;
  --white:               #ffffff;
  --gray-200:            #EDEDED;
  --gray-300:            #D9D9D9;
  --gray-700:            #595959;
  --primary-focus-ring:  rgba(0, 64, 128, 0.3);
  --text-primary:        rgba(0, 0, 0, 0.87);
  --text-secondary:      var(--gray-700);
  --border:              var(--gray-200);
  --border-strong:       var(--gray-300);
  --muted-foreground:    var(--gray-700);
  --radius-pill:         9999px;
  --font-sans:           'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-stepper {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 0;
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
  font-family: var(--font-sans);
}

.inspera-stepper--vertical {
  flex-direction: column;
  align-items: stretch;
  width: auto;
}

/* The step lays out body-then-connector along the stepper's own axis, so a
   horizontal stepper puts them in a row and a vertical one stacks them. Note
   this is the opposite of the body inside it, which stacks the circle over the
   label horizontally and sits them side by side vertically. */
.inspera-stepper__step {
  display: flex;
  flex-direction: row;
  /* Always top-aligned. Centring makes the horizontal connector sit against the
     full step height and render down at label level instead of through the
     circles. */
  align-items: flex-start;
  /* "1 1 auto", not "1": a zero basis gives every step the same total width, so
     a long label leaves a stub of a connector while a short one gets a long
     run. Growing from the content width shares the free space evenly. */
  flex: 1 1 auto;
  min-width: 0;
}

.inspera-stepper__step:last-child { flex: none; }
.inspera-stepper--vertical .inspera-stepper__step { flex-direction: column; flex: none; }

.inspera-stepper__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.inspera-stepper--vertical .inspera-stepper__body {
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
}

.inspera-stepper__indicator {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: var(--radius-pill);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  background: transparent;
  color: var(--text-secondary);
  border: 2px solid var(--border-strong);
  box-shadow: none;
  transition: background 140ms ease, box-shadow 140ms ease;
}

.inspera-stepper--small .inspera-stepper__indicator { width: 24px; height: 24px; }

/* Done and current share the fill; only the current one gets the halo. */
.inspera-stepper__indicator--done,
.inspera-stepper__indicator--active {
  background: var(--primary);
  color: var(--white);
  border: none;
}

.inspera-stepper__indicator--active { box-shadow: 0 0 0 4px var(--primary-focus-ring); }

.inspera-stepper__indicator .material-symbols-outlined { font-size: 18px; }

.inspera-stepper__text {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: center;
}
.inspera-stepper--vertical .inspera-stepper__text { text-align: left; }

/* The indicator is decorative, so each step's status is spoken here. */
.inspera-stepper__status {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

.inspera-stepper__label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
}
.inspera-stepper--small .inspera-stepper__label { font-size: 13px; }

.inspera-stepper__step--done .inspera-stepper__label,
.inspera-stepper__step--active .inspera-stepper__label {
  font-weight: 600;
  color: var(--text-primary);
}

.inspera-stepper__description {
  font-size: 12px;
  color: var(--muted-foreground);
}

/* The connector is nudged by half the circle so it runs through the centres
   rather than under the labels. */
.inspera-stepper__connector {
  height: 2px;
  flex: 1;
  margin: 0 8px;
  margin-top: 15px;
  background: var(--border);
}

.inspera-stepper--small .inspera-stepper__connector { margin-top: 11px; }

.inspera-stepper__connector--done { background: var(--primary); }

.inspera-stepper--vertical .inspera-stepper__connector {
  width: 2px;
  height: auto;
  flex: 1;
  min-height: 20px;
  margin: 4px 0;
  margin-left: 15px;
}
.inspera-stepper--vertical.inspera-stepper--small .inspera-stepper__connector { margin-left: 11px; }
```

```html
<ol class="inspera-stepper" role="list">
  <li class="inspera-stepper__step inspera-stepper__step--done">
    <div class="inspera-stepper__body">
      <span class="inspera-stepper__indicator inspera-stepper__indicator--done" aria-hidden="true">
        <span class="material-symbols-outlined">check</span>
      </span>
      <span class="inspera-stepper__text">
        <span class="inspera-stepper__label">Details</span>
        <span class="inspera-stepper__description">Assessment info</span>
      </span>
    </div>
    <span class="inspera-stepper__connector inspera-stepper__connector--done" aria-hidden="true"></span>
  </li>
  <li class="inspera-stepper__step inspera-stepper__step--active" aria-current="step">
    <div class="inspera-stepper__body">
      <span class="inspera-stepper__indicator inspera-stepper__indicator--active" aria-hidden="true">2</span>
      <span class="inspera-stepper__text">
        <span class="inspera-stepper__label">Questions</span>
      </span>
    </div>
  </li>
</ol>
```


### Link

Navigate to another location or resource. - category: `navigation`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Link } from '@inspera/components'

<Link
  href="/docs"
  label="Learn more"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `href` **(required)** | `string` | - | Destination URL. Always a real one - use a Button for actions. |
| `children` | `ReactNode` | - | Link text. |
| `label` | `string` | - | Link text, when not passing children. |
| `intent` | `'Default' \| 'Muted'` | `'Default'` | Colour emphasis. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Text size. |
| `underline` | `'Always' \| 'Hover' \| 'None'` | `'Hover'` | Underline behaviour. |
| `external` | `boolean` | `false` | Open in a new tab, with an icon and a spoken "opens in a new tab". |
| `disabled` | `boolean` | `false` | Non-interactive state. |
| `leadingIcon` | `string` | - | Material Symbols name shown before the text. |
| `trailingIcon` | `string` | - | Material Symbols name shown after the text. |
| `onClick` | `(e: MouseEvent<HTMLAnchorElement>) => void` | - | Fired on activation. Use for client-side routing, not to replace href. |

Also accepts any native `<a>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<a>`. `className` and `style` go on the outermost element.

**Accessibility** - role `link`, keyboard operable. Use a real anchor with a valid href; External links set target="_blank" and rel="noreferrer"; Disabled links set aria-disabled and prevent navigation; Focus ring is visible on keyboard focus.

**Do:** Use for navigation, not actions; Signal external links with an icon; Keep link text descriptive.
**Don't:** Do not use links to trigger actions - use Button; Do not use "click here" as link text.

**Choosing a variant:**
- `intent="Muted"`: Secondary links that should not compete, such as the links at the foot of a page.
- `size="Small"`: Tables, captions and other 14px text, such as test titles in a roster.
- `underline="Hover"`: Links that stand apart from other text, such as one under a card. The underline appears on hover. The default.
- `underline="Always"`: Links inside a sentence, where colour alone would not set them apart from the words around them.
- `underline="None"`: Only where the layout already says it is a link, such as the items of a side navigation.
- `external`: Opens another site in a new tab, such as a download from a supplier. The icon says so.
- `disabled`: The page isn't available yet, such as results before marking ends. Say when it will be.

**Deprecated aliases** (do not use): `Hyperlink`, `Text link`, `Anchor`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- The default is underline **on hover only** - not always, and not never.
- Colour is `--primary` at 16px/500 (14px when small), with `text-underline-offset: 2px` so the rule clears the descenders.
- An external link gets `target="_blank"`, `rel="noreferrer"`, and the `open_in_new` icon. All three, not one.
- A disabled link carries no `href` and sets `aria-disabled="true"`. Do not leave the href and swallow the click.
- The focus ring is `--primary-focus-ring` at 2px with a 2px offset - different from the solid `--primary` ring buttons use.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:            #004080;
  --gray-700:           #595959;
  --action-disabled:    rgba(0, 0, 0, 0.38);
  --text-secondary:     var(--gray-700);
  --radius-xs:          2px;
  --focus-ring-width:   2px;
  --focus-ring-offset:  2px;
  --focus-ring-color:   var(--primary);
  --duration-fast:      100ms;
  --easing-standard:    cubic-bezier(0.2, 0, 0, 1);
  --font-sans:          'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--primary);
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  text-underline-offset: 2px;
  border-radius: var(--radius-xs);
  cursor: pointer;
  transition: color var(--duration-fast) var(--easing-standard);
}

.inspera-link--small { font-size: 14px; }

.inspera-link--muted { color: var(--text-secondary); }

/* Underline behaviour. Hover is the default; the other two are explicit. */
.inspera-link:hover { text-decoration: underline; }
.inspera-link--underline-always { text-decoration: underline; }
.inspera-link--underline-none:hover { text-decoration: none; }

.inspera-link:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

/* "(opens in a new tab)" for screen readers - the icon alone says nothing. */
.inspera-link__hint {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

/* Disabled: no href, announced with aria-disabled. A link with no href is not
   focusable, which is the behaviour you want. */
.inspera-link--disabled {
  color: var(--action-disabled);
  cursor: not-allowed;
  text-decoration: none;
}
.inspera-link--disabled:hover { text-decoration: none; }

.inspera-link .material-symbols-outlined { font-size: 18px; }
.inspera-link--small .material-symbols-outlined { font-size: 16px; }
```

```html
<a class="inspera-link" href="/docs">Learn more</a>

<!-- External links open in a new tab and say so with an icon. -->
<a class="inspera-link" href="https://inspera.com" target="_blank" rel="noreferrer">
  Documentation
  <span class="material-symbols-outlined" aria-hidden="true">open_in_new</span>
</a>

<a class="inspera-link inspera-link--muted inspera-link--small" href="/skip">Skip for now</a>

<!-- Disabled: no href at all. -->
<a class="inspera-link inspera-link--disabled" aria-disabled="true">Unavailable</a>
```

