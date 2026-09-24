import { useCallback, useRef, useState } from 'react'

/**
 * One rule for every stateful prop in the library.
 *
 * - `value` set: controlled. The component shows `value` and reports changes
 *   through `onChange`; the parent decides whether to accept them.
 * - `value` unset: uncontrolled. The component starts from `defaultValue` and
 *   keeps its own state, still reporting through `onChange`.
 *
 * Components used to read `value ?? internal`, with no `defaultValue`. Passing
 * `value` to set a starting point - the natural thing in a mockup - froze the
 * control: clicks updated internal state that `value` always overrode, and
 * because the native element always had an onChange attached, React never
 * warned.
 */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
): [T, (next: T) => void] {
  const [internal, setInternal] = useState<T>(defaultValue)
  const controlled = value !== undefined
  const current = controlled ? (value as T) : internal

  // Read through a ref so the setter is stable and never calls a stale handler.
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const set = useCallback(
    (next: T) => {
      if (!controlled) setInternal(next)
      onChangeRef.current?.(next)
    },
    [controlled],
  )

  return [current, set]
}
