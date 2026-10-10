<!-- Inspera Design System v1.0.0 - generated file, do not edit. -->

# Inspera Design System - Data display - content

> Version 1.0.0. Part 5 of 7 of the AI spec: Card, Badge, Avatar, Accordion, Tag, Divider, Empty State, Avatar Group, Stat.
>
> These specs build on `inspera-01-core.md` - its rules, its setup
> (fonts, icon class, tokens) and its foundations. If that file is not in your
> context, ask for it before building. Without it, fonts, icons and colours
> come out wrong.

## Components - data-display

### Card

Group related content in a contained surface. - category: `data-display`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Card } from '@inspera/components'

<Card
  title="Algebra Quiz"
  body="24 questions, 45 minutes. Covers linear equations and inequalities."
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | - | Heading for the card. Also the accessible name of an interactive card. |
| `body` | `string` | - | Short body copy. For anything richer, pass children instead. |
| `elevation` | `'Flat' \| 'Raised' \| 'Outlined'` | `'Raised'` | Surface treatment. |
| `padding` | `'Compact' \| 'Default' \| 'Spacious'` | `'Default'` | Internal padding (12 / 16 / 24). |
| `interactive` | `boolean` | `false` | The whole card becomes one click target: it lifts on hover, sinks when pressed and takes a focus ring. |
| `selected` | `boolean` | - | Selected state. Controlled - pair with onSelectedChange. Setting it makes the card a toggle: interactive, and selected or not with each click. |
| `defaultSelected` | `boolean` | - | Starting selection when uncontrolled. Also makes the card a toggle. |
| `onSelectedChange` | `(selected: boolean) => void` | - | Fired with the new selection when the card is clicked. |
| `children` | `ReactNode` | - | Card contents. Replaces title and body. |
| `onClick` | `MouseEventHandler<HTMLButtonElement>` | - | Fired when an interactive card is activated. |

Also accepts any native `<article>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<article>`. `className` and `style` go on the outermost element.

**Accessibility** - role `article`, keyboard operable. An interactive card is an article with one button stretched over it, named by the title; A selectable card is a toggle: its button carries aria-pressed, and the selected tick is a second cue besides the border colour; Non-interactive cards use role="article" or a semantic section.

**Do:** Use to group related content; Maintain consistent padding within a view; Use raised elevation for primary content cards.
**Don't:** Do not nest cards inside other cards; Do not use an empty card just for layout.

**Choosing a variant:**
- `elevation="Raised"`: Cards that lead a page on the grey canvas, such as what to continue on the home page.
- `elevation="Flat"`: Page content on the grey canvas, such as the summaries on a test's overview. No shadow, so it stays quiet.
- `elevation="Outlined"`: Cards on a white page, where a shadow would be heavy, such as tests in the Cards view.
- `padding="Compact"`: Dense grids and side panels, where many cards share the space.
- `padding="Spacious"`: A card with one main message that needs room to read, such as a summary before publishing.
- `interactive`: The whole card opens one thing, such as a question type to start from. Put no other buttons or links inside it.
- `selected`: People pick options laid out as cards, such as the question types to add to a set. Each click selects or clears the card.

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- Radius is `--radius-lg`. Padding is 12 / 16 / 24 for Compact / Default / Spacious.
- Flat has neither border nor shadow, Raised adds `--shadow-200`, Outlined adds a 1px `--border-strong`. Never both a shadow and a strong border.
- The transparent 1px border at rest is deliberate: without it, Outlined would be 2px wider than Flat.
- An interactive card stays an `<article>` with one transparent `<button class="inspera-card__link">` stretched over it, named by the title. Never wrap the card in a `<button>` (headings inside a button are invalid) and never put a click handler on a `<div>`.
- Interactive states: hover and keyboard focus lift to `--shadow-300`; pressed sinks to `--shadow-100` with the `--action-hover` wash over the white; keyboard focus also draws the standard focus ring around the whole card.
- A selectable card is a toggle: the button carries `aria-pressed`. Selected is a 2px `--primary` edge (border plus a 1px outline inset by 2px) and a `check_circle` tick at the top right; the right padding keeps room for the tick at all times.
- Title 16px/500, body 16px/1.4 in `--gray-700` - the body is not smaller than the title.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:            #004080;
  --white:              #ffffff;
  --gray-300:           #D9D9D9;
  --gray-700:           #595959;
  --action-hover:       rgba(0, 0, 0, 0.04);
  --text-primary:       rgba(0, 0, 0, 0.87);
  --border-strong:      var(--gray-300);
  --radius-lg:          12px;
  --shadow-100:         0px 4px 4px rgba(39, 39, 39, 0.08), 0px 2px 4px rgba(39, 39, 39, 0.12);
  --shadow-200:         0px 8px 8px rgba(39, 39, 39, 0.08), 0px 4px 6px rgba(39, 39, 39, 0.12);
  --shadow-300:         0px 8px 16px rgba(39, 39, 39, 0.08), 0px 6px 8px rgba(39, 39, 39, 0.12);
  --focus-ring-width:   2px;
  --focus-ring-offset:  2px;
  --focus-ring-color:   var(--primary);
  --font-sans:          'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 16px;
  border-radius: var(--radius-lg);
  background: var(--white);
  color: var(--text-primary);
  font-family: var(--font-sans);
  /* A transparent border at rest, so switching to Outlined does not resize the
     card. Dropping it and adding a border only on the modifier shifts layout. */
  border: 1px solid transparent;
  box-shadow: none;
  text-align: left;
  cursor: default;
}

.inspera-card--compact  { padding: 12px; }
.inspera-card--spacious { padding: 24px; }

.inspera-card--raised   { box-shadow: var(--shadow-200); }
.inspera-card--outlined { border-color: var(--border-strong); }

/* Interactive: one transparent button stretched over the whole card. The
   card stays an <article>, so its heading is still a heading - wrapping it all
   in a <button> flattened title and body into one long button name. */
.inspera-card__link {
  position: absolute;
  inset: 0;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: inherit;
  background: transparent;
  cursor: pointer;
}
.inspera-card__link:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

/* Hover and keyboard focus lift the card; pressing sinks it below its rest
   and lays the neutral --action-hover wash over the white. */
.inspera-card--interactive:hover,
.inspera-card--interactive:has(:focus-visible) { box-shadow: var(--shadow-300); }
.inspera-card--interactive:active {
  background: linear-gradient(var(--action-hover), var(--action-hover)), var(--white);
  box-shadow: var(--shadow-100);
}

/* Selectable: the link toggles aria-pressed. The right padding keeps room for
   the tick whether or not the card is selected, so selecting never reflows. */
.inspera-card--selectable { padding-right: 44px; }
.inspera-card--compact.inspera-card--selectable  { padding-right: 40px; }
.inspera-card--spacious.inspera-card--selectable { padding-right: 52px; }

/* Selected: a 2px primary edge - the border plus an outline just inside it,
   so the card keeps its size - and a tick, so colour is not the only cue. */
.inspera-card--selected {
  border-color: var(--primary);
  outline: 1px solid var(--primary);
  outline-offset: -2px;
}
.inspera-card__tick {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 20px;
  color: var(--primary);
}
.inspera-card--compact  .inspera-card__tick { top: 12px; right: 12px; }
.inspera-card--spacious .inspera-card__tick { top: 24px; right: 24px; }

.inspera-card__title {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.inspera-card__body {
  margin: 0;
  font-size: 16px;
  line-height: 1.4;
  color: var(--gray-700);
}
```

```html
<article class="inspera-card inspera-card--raised">
  <h3 class="inspera-card__title">Algebra Quiz</h3>
  <p class="inspera-card__body">24 questions, 45 minutes.</p>
</article>

<!-- Interactive: the card stays an <article>; one button stretched over it, named by the title. -->
<article class="inspera-card inspera-card--outlined inspera-card--interactive">
  <h3 class="inspera-card__title">History Midterm</h3>
  <p class="inspera-card__body">Open the assessment.</p>
  <button type="button" class="inspera-card__link" aria-label="History Midterm"></button>
</article>

<!-- Selected: a toggle. Flip aria-pressed and the --selected class together, and show the tick. -->
<article class="inspera-card inspera-card--outlined inspera-card--interactive inspera-card--selectable inspera-card--selected">
  <h3 class="inspera-card__title">Multiple choice</h3>
  <p class="inspera-card__body">One or more correct answers.</p>
  <span class="material-symbols-outlined inspera-card__tick" aria-hidden="true">check_circle</span>
  <button type="button" class="inspera-card__link" aria-label="Multiple choice" aria-pressed="true"></button>
</article>
```


### Badge

Display a short status label or count. - category: `data-display`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Badge } from '@inspera/components'

<Badge
  label="Neutral"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | The badge text. One or two words. |
| `intent` | `'Neutral' \| 'Info' \| 'Success' \| 'Warning' \| 'Error'` | `'Neutral'` | Semantic colour. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Height 20 / 24. |
| `withIcon` | `boolean` | `false` | Show a leading status icon. |
| `icon` | `string` | - | Material Symbols name shown before the label when withIcon is set. |

Also accepts any native `<span>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<span>`. `className` and `style` go on the outermost element.

**Accessibility** - role `status`. Use aria-label for icon-only badges; Use role="status" for dynamic count badges.

**Do:** Use for status indicators and counts; Keep labels short - 1 to 2 words; Use each intent for the same meaning everywhere.
**Don't:** Do not use for long text; Do not make badges interactive - use Tag or Button.

**Choosing a variant:**
- `intent="Neutral"`: A status with no judgement, such as Draft or Archived.
- `intent="Info"`: Something upcoming or for information, such as Scheduled.
- `intent="Success"`: A good or finished state, such as Live or Graded.
- `intent="Warning"`: Needs attention soon, such as Needs grading.
- `intent="Error"`: Something has gone wrong, such as Overdue or Failed.
- `size="Medium"`: Next to a page or card title.
- `size="Small"`: Inside dense rows, such as the status column of a table.

**Deprecated aliases** (do not use): `Status Badge`, `Tag`, `Chip`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- Height is 24px (20px small) and the radius is a full pill - not `rounded-md`.
- Type is 12px/500 at both sizes; Small changes height and padding only.
- Neutral is `--surface-neutral` with `--gray-900` text, not a grey chip with white text.
- Every intent pairs a `*-surface` tint with the matching solid as the text colour.
- The icon is Material Symbols Outlined with `FILL 1`, at 16px (14px small).
- Static text, not a live region: `role="status"` on every badge makes a table of 50 rows announce 50 times. Announce a status change once, from where it happened.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --gray-900:         #272727;
  --blue-800:         #004080;
  --green-800:        #106542;
  --red-700:          #A50D0D;
  --orange-800:       #7E5501;
  --info-surface:     #E1F5FE;
  --success-surface:  #E8F5E9;
  --warning-surface:  #FFF3E0;
  --error-surface:    #FFEBEE;
  --info-text:        var(--blue-800);
  --success-text:     var(--green-800);
  --warning-text:     var(--orange-800);
  --error-text:       var(--red-700);
  --surface-neutral:  #F0F0F0;
  --radius-pill:      9999px;
  --font-sans:        'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-badge {
  /* Fill and text come from the intent modifier below. */
  --badge-bg: var(--surface-neutral);
  --badge-fg: var(--gray-900);

  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 24px;
  padding: 0 8px;
  border-radius: var(--radius-pill);
  background: var(--badge-bg);
  color: var(--badge-fg);
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
}

/* Small changes height and padding only - never the 12px type. */
.inspera-badge--small { height: 20px; padding: 0 6px; }

/* Neutral is written out even though it matches the base, so the class name
   stays correct if the default ever moves. */
.inspera-badge--neutral { --badge-bg: var(--surface-neutral); --badge-fg: var(--gray-900); }
.inspera-badge--info    { --badge-bg: var(--info-surface);    --badge-fg: var(--info-text); }
.inspera-badge--success { --badge-bg: var(--success-surface); --badge-fg: var(--success-text); }
.inspera-badge--warning { --badge-bg: var(--warning-surface); --badge-fg: var(--warning-text); }
.inspera-badge--error   { --badge-bg: var(--error-surface);   --badge-fg: var(--error-text); }

/* The icon is filled, not outlined, at 16px (14px in a small badge). */
.inspera-badge .material-symbols-outlined {
  font-size: 16px;
  font-variation-settings: 'FILL' 1;
}
.inspera-badge--small .material-symbols-outlined { font-size: 14px; }
```

```html
<span class="inspera-badge inspera-badge--success">Live</span>

<span class="inspera-badge inspera-badge--neutral inspera-badge--small">Draft</span>

<!-- With an icon. Material Symbols Outlined, filled - never another set. -->
<span class="inspera-badge inspera-badge--error">
  <span class="material-symbols-outlined" aria-hidden="true">error</span>
  Failed
</span>
```


### Avatar

Represent a user or entity with an image or initials. - category: `data-display`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Avatar } from '@inspera/components'

<Avatar
  name="Jane Cooper"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` **(required)** | `string` | - | The person's name. Gives the initials and the accessible name. |
| `src` | `string` | - | Photo URL. Without one - or if it fails to load - the initials show. |
| `icon` | `string` | - | Material Symbols name shown instead of initials, e.g. for a guest. |
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Medium'` | Diameter 32 / 40 / 56. |
| `status` | `'None' \| 'Online' \| 'Offline' \| 'Busy'` | `'None'` | Presence indicator dot. Announced with the name. |

Also accepts any native `<span>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<span>`. `className` and `style` go on the outermost element.

**Accessibility** - role `img`. Provide alt text for image avatars; Use aria-label for initials and icon variants.

**Do:** Use for user profiles and participant lists; Provide meaningful alt text; Use consistent sizing within a context.
**Don't:** Do not stretch or distort avatar images; Do not use random colours - the same person always gets the same colour.

**Choosing a variant:**
- `size="Small"`: Dense rows, such as who wrote each comment in a thread.
- `size="Medium"`: Lists and request rows. The default size.
- `size="Large"`: The header of a page or panel about one person, such as a candidate's details.
- `status="Online"`: The person is available now, such as a grader you could hand a script to. Say it in words beside it.
- `status="Offline"`: The person is not connected. Say since when, such as Last seen 14:02.
- `status="Busy"`: The person is busy with something others have to wait for, such as marking the script you opened.

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- Diameters are 32 / 40 / 56. Initials are 40% of that, the icon 55%, the status dot 28% - never a fixed size.
- The surface uses `--avatar-surface`, not a random grey, and `--radius-pill`.
- The status dot needs its 2px `--white` ring, or it disappears against a photo.
- The accessible name lives on the surface (`role="img"`); the initials themselves are decorative text.
- The wrapper is separate from the surface because the surface clips its image with `overflow: hidden`, which would cut the dot in half.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --error:           #D32F2F;
  --success:         #2E7D32;
  --white:           #ffffff;
  --gray-500:        #949494;
  --gray-600:        #7A7A7A;
  --gray-900:        #272727;
  --avatar-surface:  #E0E0E0;
  --radius-pill:     9999px;
  --font-sans:       'Inter', system-ui, -apple-system, sans-serif;
}

/* The wrapper exists so the status dot can be positioned against the
   avatar without being clipped by its overflow: hidden. */
.inspera-avatar {
  position: relative;
  display: inline-flex;
}

.inspera-avatar__surface {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-pill);
  background: var(--avatar-surface);
  color: var(--gray-900);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  font-family: var(--font-sans);
  font-weight: 500;
  /* Initials are 40% of the diameter, so they scale with the avatar. */
  font-size: 16px;
}

.inspera-avatar--small .inspera-avatar__surface  { width: 32px; height: 32px; font-size: 12.8px; }
.inspera-avatar--large .inspera-avatar__surface  { width: 56px; height: 56px; font-size: 22.4px; }

.inspera-avatar__surface img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* The icon variant is 55% of the diameter, larger than the initials. */
.inspera-avatar__surface .material-symbols-outlined {
  font-size: 22px;
  color: var(--gray-600);
}
.inspera-avatar--small .inspera-avatar__surface .material-symbols-outlined { font-size: 17.6px; }
.inspera-avatar--large .inspera-avatar__surface .material-symbols-outlined { font-size: 30.8px; }

/* The dot is 28% of the diameter, with a 2px white ring so it stays legible
   against a photo. */
.inspera-avatar__status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 11.2px;
  height: 11.2px;
  border-radius: 9999px;
  border: 2px solid var(--white);
}
.inspera-avatar--small .inspera-avatar__status { width: 8.96px; height: 8.96px; }
.inspera-avatar--large .inspera-avatar__status { width: 15.68px; height: 15.68px; }

.inspera-avatar__status--online  { background: var(--success); }
.inspera-avatar__status--offline { background: var(--gray-500); }
.inspera-avatar__status--busy    { background: var(--error); }
```

```html
<!-- Initials. The accessible name carries them, since the text is decorative. -->
<span class="inspera-avatar">
  <span class="inspera-avatar__surface" role="img" aria-label="Jane Cooper (JC)">
    <span>JC</span>
  </span>
</span>

<!-- Photo, with a status dot. -->
<span class="inspera-avatar">
  <span class="inspera-avatar__surface" role="img" aria-label="Jane Cooper">
    <img src="/avatar.jpg" alt="Jane Cooper" />
  </span>
  <span class="inspera-avatar__status inspera-avatar__status--online" aria-label="Online"></span>
</span>
```


### Accordion

Show and hide sections of related content. - category: `data-display`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Accordion } from '@inspera/components'

<Accordion
  items={[
    {
      title: 'What is Inspera?',
      content: 'A digital assessment platform for education and certification.',
    },
    {
      title: 'How are results scored?',
      content: 'Automatically for objective items, with manual grading for essays.',
    },
    {
      title: 'Is it accessible?',
      content: 'Yes - components follow WCAG 2.1 AA guidance.',
    },
  ]}
  defaultValue={[0]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` **(required)** | `AccordionItem[]` | - | Accordion sections. |
| `selection` | `'Single' \| 'Multiple'` | `'Single'` | Whether one or several sections can be open at once. |
| `value` | `number[]` | - | Open section indexes. Controlled - pair with onChange. |
| `defaultValue` | `number[]` | `[]` | Sections open at first, when uncontrolled. All closed by default. |
| `onChange` | `(open: number[]) => void` | - | Fired with the open section indexes after a toggle. |
| `iconPosition` | `'Left' \| 'Right'` | `'Right'` | Chevron placement. |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` | `3` | Heading level wrapping each trigger, to fit the page outline. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

```ts
export interface AccordionItem {
  /** Stable key. Defaults to the title. */
  id?: string
  title: string
  content: ReactNode
}
```

**Accessibility** - role `region`, keyboard operable. Header is a button with aria-expanded and aria-controls; Panel uses role="region" linked via aria-labelledby; Enter / Space toggle the section.

**Do:** Use to reveal detail only when people ask for it; Keep section titles scannable; Use Single mode when only one section is relevant at a time.
**Don't:** Do not nest accordions deeply; Do not hide critical content behind collapsed sections.

**Choosing a variant:**
- `selection="Single"`: Reference people look up one part at a time, such as what to do when a candidate loses connection.
- `selection="Multiple"`: People work across several sections at once, such as the groups of a test's settings.
- `iconPosition="Right"`: Most accordions. The title leads and the chevron sits at the end of the row.
- `iconPosition="Left"`: Lists that read like a tree, such as the sections of a question set, so the chevrons line up the levels.

**Deprecated aliases** (do not use): `Disclosure`, `Collapse`, `Expander`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- Each header is a `<button>` inside an `<h3>`. The heading gives the section its place in the document outline; the button makes it operable.
- `aria-expanded` on the trigger and `aria-controls` pointing at the panel, with the panel as `role="region"` labelled back by the trigger id. All four, or the pattern does not work.
- Collapse with the `hidden` attribute so the panel leaves both the tab order and the accessibility tree.
- The chevron rotates 180deg driven off `[aria-expanded="true"]`, so the attribute and the arrow cannot disagree.
- Icon-left reverses the flex row rather than reordering the markup, so the title is still read first.
- Single mode closes the open panel when another opens; multiple leaves them independent. Neither changes the markup.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --white:             #ffffff;
  --gray-200:          #EDEDED;
  --gray-700:          #595959;
  --text-primary:      rgba(0, 0, 0, 0.87);
  --border:            var(--gray-200);
  --muted-foreground:  var(--gray-700);
  --radius-md:         8px;
  --font-sans:         'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-accordion {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  font-family: var(--font-sans);
  background: var(--white);
}

/* Rules between items, not around them - the wrapper already has a border. */
.inspera-accordion__item + .inspera-accordion__item {
  border-top: 1px solid var(--border);
}

.inspera-accordion__heading { margin: 0; }

.inspera-accordion__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 14px 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  font: inherit;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

/* Icon on the left: reverse the row rather than reordering the markup, so the
   reading order still starts with the title. */
.inspera-accordion--icon-left .inspera-accordion__trigger { flex-direction: row-reverse; }

.inspera-accordion__title { flex: 1; text-align: left; }

.inspera-accordion__chevron {
  font-size: 24px;
  color: var(--muted-foreground);
  transition: transform 160ms ease;
  transform: rotate(0deg);
}

.inspera-accordion__trigger[aria-expanded='true'] .inspera-accordion__chevron {
  transform: rotate(180deg);
}

.inspera-accordion__panel {
  padding: 0 16px 16px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--gray-700);
}

/* Collapsed panels use the "hidden" attribute, so they leave the tab order and
   the accessibility tree. display:none via a class does the first but is
   easier to get wrong. */
.inspera-accordion__panel[hidden] { padding: 0 16px; }
```

```html
<div class="inspera-accordion">
  <div class="inspera-accordion__item">
    <h3 class="inspera-accordion__heading">
      <button type="button" class="inspera-accordion__trigger"
              id="acc-h1" aria-expanded="true" aria-controls="acc-p1">
        <span class="inspera-accordion__title">How is my exam graded?</span>
        <span class="material-symbols-outlined inspera-accordion__chevron" aria-hidden="true">expand_more</span>
      </button>
    </h3>
    <div class="inspera-accordion__panel" id="acc-p1" role="region" aria-labelledby="acc-h1">
      Responses are marked against the rubric configured for each question.
    </div>
  </div>
  <div class="inspera-accordion__item">
    <h3 class="inspera-accordion__heading">
      <button type="button" class="inspera-accordion__trigger"
              id="acc-h2" aria-expanded="false" aria-controls="acc-p2">
        <span class="inspera-accordion__title">Can I review my answers?</span>
        <span class="material-symbols-outlined inspera-accordion__chevron" aria-hidden="true">expand_more</span>
      </button>
    </h3>
    <div class="inspera-accordion__panel" id="acc-p2" role="region" aria-labelledby="acc-h2" hidden>
      You can revisit any answered question before submitting.
    </div>
  </div>
</div>
```


### Tag

Label, categorise or filter with a removable chip. - category: `data-display`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Tag } from '@inspera/components'

<Tag
  label="Neutral"
  leadingIcon="label"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Tag text. |
| `intent` | `'Neutral' \| 'Info' \| 'Success' \| 'Warning' \| 'Error'` | `'Neutral'` | Semantic colour. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Tag height. |
| `removable` | `boolean` | `false` | Show a remove button. Pair with onRemove. |
| `leadingIcon` | `string` | - | Optional leading icon. |
| `onRemove` | `() => void` | - | Fired when the remove button is activated. |
| `onClick` | `MouseEventHandler<HTMLButtonElement>` | - | Makes the tag text itself a button. |

Also accepts any native `<span>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<span>`. `className` and `style` go on the outermost element.

**Accessibility** - role `status`, keyboard operable. Removable tags expose a button with aria-label "Remove {label}"; Interactive tags must be keyboard focusable; Use aria-label for icon-only tags.

**Do:** Use for filters, categories, and selections; Keep labels to 1-2 words; Provide a remove control when tags are dismissible.
**Don't:** Do not use for status that never changes - use Badge; Do not pack long text into a tag.

**Choosing a variant:**
- `intent="Neutral"`: Labels with no judgement, such as a question's topic.
- `intent="Info"`: A label that adds context people should notice, such as Calculator allowed.
- `intent="Success"`: A label that confirms something, such as Reviewed on a question.
- `intent="Warning"`: A label that asks for a second look, such as Needs review.
- `intent="Error"`: A label for a problem with the item, such as No answer key.
- `size="Small"`: Dense rows, such as the labels on each question in a list.
- `removable`: Filters in use and values people chose, which they can take off again. A filter tag keeps the intent of the label it filters by.

**Deprecated aliases** (do not use): `Chip`, `Pill`, `Label`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- Identical geometry to Badge: 24px tall (20px small), full pill radius, 12px/500 type.
- The remove control is a `<button>` with `aria-label="Remove <label>"` - never a bare icon span, and never just "close".
- The leading icon is filled (`FILL 1`); the close icon is not.
- A tag with no `onClick` is a `<span>` and takes `cursor: default`. Only a clickable tag becomes a `<button>`.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --gray-900:         #272727;
  --blue-800:         #004080;
  --green-800:        #106542;
  --red-700:          #A50D0D;
  --orange-800:       #7E5501;
  --info-surface:     #E1F5FE;
  --success-surface:  #E8F5E9;
  --warning-surface:  #FFF3E0;
  --error-surface:    #FFEBEE;
  --info-text:        var(--blue-800);
  --success-text:     var(--green-800);
  --warning-text:     var(--orange-800);
  --error-text:       var(--red-700);
  --surface-neutral:  #F0F0F0;
  --radius-pill:      9999px;
  --font-sans:        'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-tag {
  --tag-bg: var(--surface-neutral);
  --tag-fg: var(--gray-900);

  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 24px;
  padding: 0 8px;
  border: none;
  border-radius: var(--radius-pill);
  background: var(--tag-bg);
  color: var(--tag-fg);
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  cursor: default;
}

.inspera-tag--small { height: 20px; padding: 0 6px; }

/* Neutral is written out even though it matches the base, so the class name
   stays correct if the default ever moves. */
.inspera-tag--neutral { --tag-bg: var(--surface-neutral); --tag-fg: var(--gray-900); }
.inspera-tag--info    { --tag-bg: var(--info-surface);    --tag-fg: var(--info-text); }
.inspera-tag--success { --tag-bg: var(--success-surface); --tag-fg: var(--success-text); }
.inspera-tag--warning { --tag-bg: var(--warning-surface); --tag-fg: var(--warning-text); }
.inspera-tag--error   { --tag-bg: var(--error-surface);   --tag-fg: var(--error-text); }

.inspera-tag .material-symbols-outlined {
  font-size: 16px;
  font-variation-settings: 'FILL' 1;
}
.inspera-tag--small .material-symbols-outlined { font-size: 14px; }

/* The remove control. Square, inherits the tag's colour, and keeps its own
   accessible name - "Remove <label>", not a bare "close". */
.inspera-tag__remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font: inherit;
  width: 18px;
  height: 18px;
  margin-left: 2px;
  margin-right: -2px;
  padding: 0;
  border: none;
  border-radius: var(--radius-pill);
  background: transparent;
  color: inherit;
  cursor: pointer;
}
.inspera-tag--small .inspera-tag__remove { width: 16px; height: 16px; }

.inspera-tag__remove .material-symbols-outlined {
  font-variation-settings: 'FILL' 0;
}
```

```html
<span class="inspera-tag inspera-tag--neutral">Mathematics</span>

<!-- With a leading icon and a remove control. -->
<span class="inspera-tag inspera-tag--info">
  <span class="material-symbols-outlined" aria-hidden="true">label</span>
  Algebra
  <button type="button" class="inspera-tag__remove" aria-label="Remove Algebra">
    <span class="material-symbols-outlined" aria-hidden="true">close</span>
  </button>
</span>
```


### Divider

Separate content with a thin rule. - category: `data-display`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Divider } from '@inspera/components'

<Divider />
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'Horizontal' \| 'Vertical'` | `'Horizontal'` | Divider direction. A vertical divider needs a flex row around it. |
| `label` | `string` | - | Optional centred label (horizontal only). |
| `spacing` | `'Compact' \| 'Default' \| 'Spacious'` | `'Default'` | Surrounding margin, 8 / 16 / 24px on each side. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

**Accessibility** - role `separator`. Use role="separator" with aria-orientation; Purely decorative dividers may be aria-hidden.

**Do:** Use to group and separate related content; Use a labelled divider to introduce a section; Keep dividers hairline-thin.
**Don't:** Do not overuse dividers where whitespace suffices; Do not use heavy rules.

**Choosing a variant:**
- `orientation="Horizontal"`: Between groups stacked in a panel. Labelled or, it separates two ways to do the same thing, such as adding candidates.
- `orientation="Vertical"`: Between groups of controls in a row, such as the tool groups of an editor toolbar.
- `spacing="Compact"`: Dense panels, such as between the groups of a question's settings.
- `spacing="Spacious"`: Between the major sections of a long form.

**Deprecated aliases** (do not use): `Separator`, `Rule`, `HR`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- The rule is 1px of `--border` as a background, not a border. A bare `<hr>` keeps the browser default and renders as a grey groove.
- Spacing is margin on the divider itself: 16px default, 8px compact, 24px spacious - on the block axis horizontally, the inline axis vertically.
- A labelled divider is a flex row of rule / label / rule, with the label at 13px `--muted-foreground`. It is not text laid over a line.
- Always carry `role="separator"` and `aria-orientation`; a labelled one also needs `aria-label`.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --gray-200:          #EDEDED;
  --gray-700:          #595959;
  --border:            var(--gray-200);
  --muted-foreground:  var(--gray-700);
  --font-sans:         'Inter', system-ui, -apple-system, sans-serif;
}

/* Horizontal, unlabelled. The border reset matters: a bare <hr> keeps the
   browser's inset border and renders as a two-tone groove. */
.inspera-divider {
  border: none;
  height: 1px;
  width: 100%;
  background: var(--border);
  margin: 16px 0;
}

.inspera-divider--compact  { margin: 8px 0; }
.inspera-divider--spacious { margin: 24px 0; }

/* Vertical: a 1px column that stretches to its flex parent. */
.inspera-divider--vertical {
  display: inline-block;
  width: 1px;
  height: auto;
  align-self: stretch;
  min-height: 1em;
  background: var(--border);
  margin: 0 16px;
}
.inspera-divider--vertical.inspera-divider--compact  { margin: 0 8px; }
.inspera-divider--vertical.inspera-divider--spacious { margin: 0 24px; }

/* Labelled: a flex row whose rules grow to fill either side of the text. */
.inspera-divider--labelled {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: auto;
  background: none;
  margin: 16px 0;
  font-family: var(--font-sans);
}
.inspera-divider--labelled.inspera-divider--compact  { margin: 8px 0; }
.inspera-divider--labelled.inspera-divider--spacious { margin: 24px 0; }

.inspera-divider__rule {
  flex: 1;
  height: 1px;
  background: var(--border);
}

.inspera-divider__label {
  font-size: 13px;
  color: var(--muted-foreground);
  white-space: nowrap;
}
```

```html
<hr class="inspera-divider" role="separator" aria-orientation="horizontal" />

<!-- Vertical, inside a flex row. -->
<span class="inspera-divider inspera-divider--vertical" role="separator" aria-orientation="vertical"></span>

<!-- Labelled: the label names the separator for assistive tech too. -->
<div class="inspera-divider inspera-divider--labelled" role="separator" aria-orientation="horizontal" aria-label="OR">
  <span class="inspera-divider__rule"></span>
  <span class="inspera-divider__label">OR</span>
  <span class="inspera-divider__rule"></span>
</div>
```


### Empty State

Communicate the absence of content and offer a next step. - category: `data-display`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { EmptyState } from '@inspera/components'

<EmptyState
  title="No assessments yet"
  description="Create your first assessment to get started."
  actionLabel="New assessment"
  onAction={createAssessment}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` **(required)** | `string` | - | Primary message, e.g. "No assessments yet". |
| `description` | `string` | - | Supporting explanation: why it is empty, or what to do next. |
| `icon` | `string` | `'inbox'` | Material Symbols icon name. |
| `actionLabel` | `string` | - | Optional action label. |
| `onAction` | `() => void` | - | Fired when the action is activated. Only rendered when actionLabel is set. |
| `actionIntent` | `'Primary' \| 'Secondary'` | `'Primary'` | The action's emphasis. Primary when it is the main thing to do on the page; Secondary inside a panel, or beside a page that already has its own main action, so the view keeps one Primary. |
| `size` | `'Small' \| 'Medium'` | `'Medium'` | Overall scale. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

**Accessibility** - role `status`, keyboard operable. Announce an empty state that appears after load with role="status"; The action must be a real focusable button; The illustration or icon is decorative (aria-hidden).

**Do:** Explain why the area is empty; Offer a clear next action when possible; Keep the tone helpful.
**Don't:** Do not leave empty areas blank with no guidance; Do not use for transient loading - use Skeleton.

**Choosing a variant:**
- `size="Medium"`: A page or a whole table with nothing in it yet, such as a first visit to Question sets.
- `size="Small"`: A card or panel with nothing in it, such as no candidates needing help.
- `actionIntent="Primary"`: The action is the main thing to do on the page, such as creating the first question set. The default.
- `actionIntent="Secondary"`: Inside a panel, or beside a page that already has its main action, so the view keeps one Primary.

**Deprecated aliases** (do not use): `Blank slate`, `Zero state`, `No data`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- The icon sits in an 80px circle of `--gray-100` (56px when small). Without the circle it reads as a broken image.
- Title 18px/500, body 14px `--muted-foreground` capped at 320px so it wraps to two short lines rather than one long one.
- The action is the ordinary Button component, not a bespoke link: `inspera-btn--primary` when it is the main thing to do on the page, `inspera-btn--secondary` inside a panel or beside a page that already has its main action, so the view keeps one Primary.
- Not a live region: an empty state is page content, and `role="status"` around it (action included) announces it every time it renders. When a filter empties a list, announce the result count from the filter, in a separate polite live region.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --primary:                #004080;
  --error:                  #D32F2F;
  --success:                #2E7D32;
  --white:                  #ffffff;
  --gray-100:               #F7F7F7;
  --gray-700:               #595959;
  --gray-900:               #272727;
  --orange-600:             #F2A202;
  --text-primary:           rgba(0, 0, 0, 0.87);
  --muted-foreground:       var(--gray-700);
  --control-height-sm:      32px;
  --control-height-md:      40px;
  --control-height-lg:      44px;
  --radius-sm:              4px;
  --effect-button-shadow:   inset 0px -1px 0px rgba(0, 0, 0, 0.2), 0px 1px 0px rgba(0, 0, 0, 0.08);
  --border-width-default:   1px;
  --focus-ring-width:       2px;
  --focus-ring-offset:      2px;
  --focus-ring-color:       var(--primary);
  --duration-fast:          100ms;
  --easing-standard:        cubic-bezier(0.2, 0, 0, 1);
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

.inspera-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  padding: 32px;
  font-family: var(--font-sans);
  color: var(--text-primary);
}

.inspera-empty--small { padding: 16px; }

/* The icon lives inside a filled circle, not on its own. */
.inspera-empty__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 9999px;
  background: var(--gray-100);
  margin-bottom: 4px;
}
.inspera-empty--small .inspera-empty__icon { width: 56px; height: 56px; }

.inspera-empty__icon .material-symbols-outlined {
  font-size: 40px;
  color: var(--muted-foreground);
}
.inspera-empty--small .inspera-empty__icon .material-symbols-outlined { font-size: 28px; }

.inspera-empty__title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}
.inspera-empty--small .inspera-empty__title { font-size: 16px; }

.inspera-empty__body {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  color: var(--muted-foreground);
  max-width: 320px;
}

/* The action is a normal Button, spaced away from the copy. */
.inspera-empty__action { margin-top: 8px; }
```

```html
<div class="inspera-empty">
  <span class="inspera-empty__icon">
    <span class="material-symbols-outlined" aria-hidden="true">inbox</span>
  </span>
  <h3 class="inspera-empty__title">No assessments yet</h3>
  <p class="inspera-empty__body">Create your first assessment to get started.</p>
  <div class="inspera-empty__action">
    <button type="button" class="inspera-btn inspera-btn--primary">New assessment</button>
  </div>
</div>
```


### Avatar Group

Show a set of users as overlapping avatars with an overflow count. - category: `data-display`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { AvatarGroup } from '@inspera/components'

<AvatarGroup
  avatars={[
    { name: 'Ada Lovelace' },
    { name: 'Linus Torvalds' },
    { name: 'Grace Hopper' },
    { name: 'Alan Turing' },
    { name: 'Katherine Johnson' },
    { name: 'Edsger Dijkstra' },
  ]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `avatars` **(required)** | `AvatarGroupItem[]` | - | People to show, in order. |
| `max` | `number` | `4` | How many to show before collapsing the rest into "+N". |
| `size` | `'Small' \| 'Medium' \| 'Large'` | `'Medium'` | Avatar diameter. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

```ts
export interface AvatarGroupItem {
  /** The person's name: initials and accessible name. */
  name: string
  /** Photo URL. */
  src?: string
  /** Material Symbols name shown instead of initials. */
  icon?: string
}
```

**Accessibility** - role `group`. Wrap in a group with an aria-label describing the set; Each avatar keeps its own accessible label; The overflow chip states the hidden count.

**Do:** Use for participant and collaborator lists; Cap visible avatars and show a +N overflow; Keep sizing consistent within a context.
**Don't:** Do not show dozens of avatars inline; Do not omit the overflow count.

**Choosing a variant:**
- `size="Small"`: Dense rows, such as the graders on each test in a table.
- `size="Medium"`: Cards and headers, such as the graders on a test's overview. The default size.
- `size="Large"`: The header of a page about one team, such as a marking committee.

**Deprecated aliases** (do not use): `Avatar stack`, `Facepile`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- Overlap is about 20% of the diameter as a negative left margin - 6 / 8 / 12px for small / medium / large - and the first item has none. With the 2px ring, each avatar stops short of the initials it overlaps; more overlap hides their second letter.
- The separating ring is a `box-shadow`, not a border: a border would grow each avatar and break the spacing.
- The overflow chip is `+N` on `--gray-200` at 34% of the diameter, sized identically to an avatar.
- The group carries `role="group"` and a count in its label; the chip carries "N more". Overlapping avatars are meaningless to a screen reader without both.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --error:           #D32F2F;
  --success:         #2E7D32;
  --white:           #ffffff;
  --gray-200:        #EDEDED;
  --gray-500:        #949494;
  --gray-600:        #7A7A7A;
  --gray-700:        #595959;
  --gray-900:        #272727;
  --avatar-surface:  #E0E0E0;
  --radius-pill:     9999px;
  --font-sans:       'Inter', system-ui, -apple-system, sans-serif;
}

/* The wrapper exists so the status dot can be positioned against the
   avatar without being clipped by its overflow: hidden. */
.inspera-avatar {
  position: relative;
  display: inline-flex;
}

.inspera-avatar__surface {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-pill);
  background: var(--avatar-surface);
  color: var(--gray-900);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  font-family: var(--font-sans);
  font-weight: 500;
  /* Initials are 40% of the diameter, so they scale with the avatar. */
  font-size: 16px;
}

.inspera-avatar--small .inspera-avatar__surface  { width: 32px; height: 32px; font-size: 12.8px; }
.inspera-avatar--large .inspera-avatar__surface  { width: 56px; height: 56px; font-size: 22.4px; }

.inspera-avatar__surface img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* The icon variant is 55% of the diameter, larger than the initials. */
.inspera-avatar__surface .material-symbols-outlined {
  font-size: 22px;
  color: var(--gray-600);
}
.inspera-avatar--small .inspera-avatar__surface .material-symbols-outlined { font-size: 17.6px; }
.inspera-avatar--large .inspera-avatar__surface .material-symbols-outlined { font-size: 30.8px; }

/* The dot is 28% of the diameter, with a 2px white ring so it stays legible
   against a photo. */
.inspera-avatar__status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 11.2px;
  height: 11.2px;
  border-radius: 9999px;
  border: 2px solid var(--white);
}
.inspera-avatar--small .inspera-avatar__status { width: 8.96px; height: 8.96px; }
.inspera-avatar--large .inspera-avatar__status { width: 15.68px; height: 15.68px; }

.inspera-avatar__status--online  { background: var(--success); }
.inspera-avatar__status--offline { background: var(--gray-500); }
.inspera-avatar__status--busy    { background: var(--error); }

.inspera-avatar-group {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-sans);
}

/* Each avatar sits in a ring and pulls left over the one before it. The ring
   is a box-shadow, not a border, so it does not change the avatar's size. */
.inspera-avatar-group__item {
  display: inline-flex;
  border-radius: 9999px;
  box-shadow: 0 0 0 2px var(--white);
  margin-left: -8px;
}
.inspera-avatar-group--small .inspera-avatar-group__item { margin-left: -6px; }
.inspera-avatar-group--large .inspera-avatar-group__item { margin-left: -12px; }

/* Last, so it outranks the size modifiers above: nothing overlaps the first. */
.inspera-avatar-group__item:first-child { margin-left: 0; }

/* The overflow chip is the same circle, filled and labelled +N. */
.inspera-avatar-group__more {
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--gray-200);
  color: var(--gray-700);
  font-size: 13.6px;
  font-weight: 500;
}
.inspera-avatar-group--small .inspera-avatar-group__more { width: 32px; height: 32px; font-size: 10.88px; }
.inspera-avatar-group--large .inspera-avatar-group__more { width: 56px; height: 56px; font-size: 19.04px; }
```

```html
<div class="inspera-avatar-group" role="group" aria-label="6 participants">
  <span class="inspera-avatar-group__item">
    <span class="inspera-avatar">
      <span class="inspera-avatar__surface" role="img" aria-label="Ada Lovelace (AL)"><span>AL</span></span>
    </span>
  </span>
  <span class="inspera-avatar-group__item">
    <span class="inspera-avatar">
      <span class="inspera-avatar__surface" role="img" aria-label="Grace Hopper (GH)"><span>GH</span></span>
    </span>
  </span>
  <span class="inspera-avatar-group__item inspera-avatar-group__more" aria-label="4 more">+4</span>
</div>
```


### Stat

Highlight a key metric with an optional trend. - category: `data-display`.

> `@inspera/components` is **not published yet**. If you cannot resolve that import, do
> not swap in another UI library - build the markup from the HTML and CSS under
> **Without the package** below, which is this component exactly.

```tsx
import { Stat } from '@inspera/components'

<Stat
  label="Active candidates"
  value="12,480"
  delta="+8.2% vs last week"
  deltaIntent="Up"
  icon="group"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` **(required)** | `string` | - | Metric name. |
| `value` **(required)** | `string \| number` | - | Metric value. |
| `delta` | `string` | - | Change indicator text, e.g. "+8.2% vs last week". Omit when there is no comparison. |
| `deltaIntent` | `'Up' \| 'Down' \| 'Neutral'` | `'Neutral'` | Trend direction: sets the arrow, the colour and what is announced. |
| `icon` | `string` | - | Optional leading icon. |
| `helpText` | `string` | - | Optional context below the value, such as the comparison period. |

Also accepts any native `<div>` attribute (`id`, `name`, `aria-*`, `data-*`, event handlers, `ref`), forwarded to the `<div>`. `className` and `style` go on the outermost element.

**Accessibility** - role `group`. Associate the value with its label for screen readers; Convey the trend with text, not colour alone; Use aria-label to summarise the metric and change.

**Do:** Use for dashboard summaries; Pair a value with a clear label; Indicate trend direction with an icon and text.
**Don't:** Do not rely on colour alone for the change; Do not crowd many stats together without spacing.

**Choosing a variant:**
- `deltaIntent="Up"`: The figure rose and that is good, such as a higher pass rate than last sitting. The arrow is green.
- `deltaIntent="Down"`: The figure fell and that needs attention, such as fewer submissions on time. The arrow is red.
- `deltaIntent="Neutral"`: No real change, or a change that is neither good nor bad. Still say it in words, such as Same as last sitting.

**Deprecated aliases** (do not use): `Metric`, `KPI`, `Stat card`

#### Without the package - exact HTML and CSS

Use this whenever `@inspera/components` is not installed. It is the same
component, and it is complete: do not substitute a radius, colour, spacing or
font weight of your own, and do not restyle it with a UI kit's defaults.

- The label is 12px/600 uppercase with 0.04em tracking in `--muted-foreground` - not body text.
- The value is 28px/600 at line-height 1.1. It is the only large type in the tile.
- The tile uses `--radius-lg` and a 1px `--border`, with no shadow.
- Trend colour is `--success` up, `--error` down, `--muted-foreground` flat, and always ships with the matching arrow so the direction is not colour-only.

```css
/* Tokens this component needs. Paste once, at `:root`. */
:root {
  --error:             #D32F2F;
  --success:           #2E7D32;
  --white:             #ffffff;
  --gray-200:          #EDEDED;
  --gray-700:          #595959;
  --text-primary:      rgba(0, 0, 0, 0.87);
  --border:            var(--gray-200);
  --muted-foreground:  var(--gray-700);
  --radius-lg:         12px;
  --font-sans:         'Inter', system-ui, -apple-system, sans-serif;
}

.inspera-stat {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 200px;
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--white);
  font-family: var(--font-sans);
  color: var(--text-primary);
}

/* Label row: the metric name, with an optional icon pushed to the far end. */
.inspera-stat__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.inspera-stat__label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--muted-foreground);
}

.inspera-stat__head .material-symbols-outlined {
  font-size: 20px;
  color: var(--muted-foreground);
}

.inspera-stat__value {
  font-size: 28px;
  font-weight: 600;
  line-height: 1.1;
}

/* The delta carries the trend colour; the arrow is not decorative repetition,
   it is the direction for anyone who cannot rely on the colour alone. */
.inspera-stat__delta {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
}
.inspera-stat__delta .material-symbols-outlined { font-size: 18px; }

/* The arrow and colour carry direction for sighted users; this says it aloud. */
.inspera-stat__trend {
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

.inspera-stat__delta--up      { color: var(--success); }
.inspera-stat__delta--down    { color: var(--error); }
.inspera-stat__delta--neutral { color: var(--muted-foreground); }
```

```html
<div class="inspera-stat">
  <div class="inspera-stat__head">
    <span class="inspera-stat__label">Active candidates</span>
    <span class="material-symbols-outlined" aria-hidden="true">group</span>
  </div>
  <span class="inspera-stat__value">12,480</span>
  <span class="inspera-stat__delta inspera-stat__delta--up">
    <span class="material-symbols-outlined" aria-hidden="true">trending_up</span>
    +8.2% vs last week
  </span>
</div>
```

