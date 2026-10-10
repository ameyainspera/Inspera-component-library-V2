# Information hierarchy and progressive disclosure

> Reference file for `DESIGN.md` (Inspera Design System). Read it when you lay out a screen and decide what is visible, what is collapsed and how to reveal it. `DESIGN.md` wins if the two disagree.

## Step 1: Rank the content into tiers

List every piece of information and every action the screen could show. Then give each one a tier, based on the **primary role's** main task on this screen. The same data can sit in different tiers for different roles.

| Tier | Question it answers | Where it goes |
| --- | --- | --- |
| **1. Act now** | What is this, what state is it in, and what should I do next? | Always visible, at the top of its region and in the first viewport: title, status, key figures, blocking problems, the primary action |
| **2. Check and understand** | Is it right? What is it made of? | Visible lower on the screen, or one step away in a Tab or section: breakdowns, tables, rules, secondary actions |
| **3. Investigate** | Why? What exactly? What happened before? | Behind a disclosure: Accordion, Drawer, detail page, or Tooltip/helper text for definitions |
| **4. Technical and audit** | What does the system hold? | Collapsed "Technical details" at the end, or not shown to this role at all (see `DESIGN.md` → *Technical content*) |

**Put the tier map in your output**, for example: "Tier 1: ATC status, forms generated, items per form, parse warnings. Tier 2: section quotas, exposure rules. Tier 3: calibration, never-together items, fixed positions. Tier 4: raw JSON." This makes the hierarchy reviewable.

**Worked example: ATC specifications, by role**

| | Planner/admin | Author | Moderator |
| --- | --- | --- | --- |
| Tier 1 | Is ATC set up and valid; forms generated; items per form; any blocking warning | Which of my items are eligible, and why some are excluded | — (not a primary role for this screen) |
| Tier 2 | Section quotas; exposure and overlap rules | Section quotas; item-type tags needed | |
| Tier 3 | Calibration, never-together items, fixed positions | Item statistics (difficulty, usage) | |
| Tier 4 | Raw JSON, endpoint | Hidden | |

## Step 2: Show the hierarchy with the system, not with decoration

- **Order:** reading order is importance order: top before bottom, left before right. Keep the DOM order the same, so keyboard and screen-reader users get the same hierarchy.
- **One focal point per surface:** the page title and one Primary action. Squint at the screen: if more than one thing jumps out, demote the others.
- **Type:** one `h1` per page and at most three heading levels below it. Use weight and `text-secondary` to separate labels from values and secondary text from primary, not extra sizes.
- **Colour:** primary navy for interaction only. Status colours only when something needs attention, and always with a word or icon. If more than three highlighted items (badges, bold or colour) compete in one viewport, demote the least important.
- **Spacing before lines:** group with the spacing rhythm first (8 inside a group, 16 between regions, 24–32 between sections). Add a Divider or Card only when spacing alone doesn't separate them.
- **Summaries before detail:** lead each section with its conclusion ("40 items per form, 0% shared"), then the breakdown.

## Step 3: Choose how to reveal tiers 2–4

| What's being revealed | Use | Not |
| --- | --- | --- |
| The meaning of a term or figure | Helper text, or a Tooltip on an info icon | An Accordion or Dialog |
| Optional detail in the same context, short | An Accordion section, or "Show more" inside a section | A Dialog |
| Sibling views of the same object | Tabs (≤ 6) | A stack of Accordions |
| Detail about one row, while keeping the list in view | Drawer | Navigating away |
| Large or complex detail, or deep work | A detail page | A Drawer with a table wider than 5 columns |
| Rarely changed settings | A collapsed "Advanced settings" section at the end of the form | Settings hidden behind an icon-only button |
| More than about 3 secondary actions | Menu (overflow) | A row of small buttons |
| Long, multi-part input | Stepper, one topic per step | One very long form |
| Long lists | Pagination or "Show N more" | Rendering everything at once |

## Rules for disclosure

1. **Never hide tier 1.** Also never hide errors and warnings, required fields, the current state ("Live: settings locked"), or anything whose value changes the outcome for candidates.
2. **A collapsed region says what's inside it.** Name it after its content, and add a one-line summary or count when that helps the user decide whether to open it: "Advanced settings · 3 changed", "Technical details".
3. **Show when hidden content is non-default.** If a collapsed section holds values that differ from the defaults, mark the header (for example Badge Info "Changed") so nothing important stays out of sight.
4. **At most two disclosure levels** at once, for example a Drawer and an Accordion inside it. Never an Accordion inside an Accordion inside a Drawer.
5. **Collapse by default only what most users of this role don't need.** Disclosure relies on good defaults. If most users open a section every time, it belongs in a higher tier.
6. **Keep the user's place.** Opening a disclosure never scrolls the page or moves focus unexpectedly. Closing it returns focus to its trigger.
7. **Don't use disclosure to fit more in.** If a screen needs many collapsed sections to look clean, split it: tabs, steps or a detail page.
8. **White space is not wasted space.** Don't fill empty areas with extra figures or help text.

## Check before you call it done

- **5-second test:** from the top of the screen, can the primary role tell what this is, what state it's in, and what to do next?
- **Squint test:** only the title and the primary action stand out.
- Everything the role needs for the main task is visible without a click.
- Every collapsed region has a label that predicts its content, and non-default hidden values are flagged.
- The tier map is stated in your output.

