import type { ComponentPropsWithRef, CSSProperties, JSX, Ref } from 'react'

/**
 * The native attributes a component forwards, minus the props it defines
 * itself - so `<Button type="submit" aria-describedby="hint" />` and
 * `<TextInput name="email" autoComplete="email" />` work without the library
 * listing every attribute HTML already has.
 *
 * `className` and `style` always land on the component's outermost element;
 * everything else (`id`, `ref`, `aria-*`, `data-*`, handlers) lands on the
 * element the component says it forwards to - the `<input>` of a field, the
 * `<button>` of a button. The docs read the tag from this type, so keep
 * using it in the component's parameter annotation.
 */
export type NativeAttrs<Tag extends keyof JSX.IntrinsicElements, Own> = Omit<
  ComponentPropsWithRef<Tag>,
  keyof Own
>

/**
 * Preview-only states. The docs freeze a hover or focus look with these so
 * they can be shown without a pointer; application code never sets them, and
 * the Props table and published spec leave them out.
 */
export type ForceState = 'Hover' | 'Focused' | 'Pressed' | 'Open'

/** Joins class names, skipping empty ones. */
export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ')
}

/**
 * Hands a node to a caller's ref, whichever form it takes. Lets a component
 * keep its own ref on an element and still forward the one it was given.
 */
export function assignRef<T>(ref: Ref<T> | undefined, node: T | null) {
  if (typeof ref === 'function') ref(node)
  else if (ref) (ref as { current: T | null }).current = node
}

/** Hidden on screen, still read by assistive tech. */
export const srOnly: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
}
