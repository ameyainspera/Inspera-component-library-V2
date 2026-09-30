# Inspera Component Library

The reference site and distribution hub for the Inspera Design System: React + Vite + Tailwind CSS, running inside Figma Make. `DISTRIBUTION.md` covers the outputs and every check.

## Where things live

- `src/components/inspera/` - the library components (one file each, plus shared `types.ts`, `overlay.tsx`, `useControllableState.ts`, `useModalBehavior.ts`, `calendar.tsx`; barrel in `index.ts`).
- `src/data/tokens.ts` - token values. `src/data/components.ts` - component semantics for the docs and the AI spec.
- `src/docs/registry.tsx` - each component page's playground controls, snippets and "Variants & states" gallery. `src/data/recipes.tsx` - the HTML+CSS recipe for each component.
- `src/docs/` - the docs shell (`App.tsx` routes by hash); `src/docs/pages/` - the prototyping kits.
- `src/imports/runtime.css` - hand-written CSS the components need (states, keyframes). `src/imports/tokens.css` is generated.
- `scripts/build-portable.ts` - generates everything under `public/`, `kit/`, `packages/components/styles.css`, and the `*.generated.ts` files.

## Rules for library components

- No Tailwind classes in `src/components/inspera/`: inline styles with `var(--token)` values and `runtime.css` classes only, so a component renders in an app without Tailwind.
- Content is a required prop; never a placeholder default. State props come in pairs (`value` + `defaultValue` + `onChange`) through `useControllableState`.
- Accept `className`, `style` and native attributes via `NativeAttrs`, and spread them on the root element.
- Docs-only props (`forceState`, `forceVisible`, `embedded`) are marked `/** @internal */` and never reach snippets or the spec.
- After changing a component, its tokens or its registry entry: run `pnpm generate`, then `pnpm typecheck`, `pnpm audit:snippets` and `pnpm audit:recipes`.

---

The sections below come from the Figma Make scaffold.

# figma-make-app

React + Vite + Tailwind CSS project running inside Figma Make.

## Development Server

A Vite development server is **already running** on `$PORT` (default 8443). You don't need to start it manually.

- Preview URL: The user can access the running app through the preview panel
- Hot reload: Changes to source files are reflected immediately

## Project Structure

This is the canonical project structure. Start with task-relevant files below. Only follow imports or inspect other files when required, when a documented path is missing, or when the repository contradicts this guide.

- `src/main.tsx` - React entrypoint; imports `src/index.css` and mounts `src/App.tsx` into the `#root` element
- `src/App.tsx` - Primary application component and the usual starting point for UI work
- `src/index.css` - Global CSS entrypoint and Tailwind CSS v4 import
- `index.html` - Vite HTML shell containing the `#root` element and loading `src/main.tsx`
- `package.json` - Project dependencies and the Vite build, development, preview, and formatting scripts
- `vite.config.ts` - Vite configuration with React, Tailwind CSS v4, and Figma Make plugins plus the `@` alias for `src`
- `.mise.toml` - Toolchain versions for Node.js and pnpm

## Dependencies

- Runtime: React 19 and React DOM 19
- Styling: Tailwind CSS v4 with the `@tailwindcss/vite` plugin
- Build tooling: Vite 8, TypeScript 5.7, and `@vitejs/plugin-react`
- Formatting: oxfmt

## Styling

This project uses **Tailwind CSS v4** through the `@tailwindcss/vite` plugin configured in `vite.config.ts`. `src/index.css` imports Tailwind with `@import 'tailwindcss';`. Use Tailwind utility classes directly in JSX (except in `src/components/inspera/` - see above) and put global CSS or Tailwind v4 theme customization in `src/index.css`. This scaffold does not need a Tailwind config file or PostCSS config.

`src/main.tsx` imports `src/index.css`, so global font wiring belongs in `src/index.css`. Keep CSS `@import` statements first, then add any `@font-face` rules and font-family defaults there.

## Code quality

- Use double quotes for strings containing apostrophes (`"We're here to help"`), or escape them in single-quoted strings. An unescaped apostrophe in a single-quoted string breaks the build.
- Ensure JSX tags are closed and braces are balanced.
- Export components as default exports.
