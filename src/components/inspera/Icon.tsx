import type { CSSProperties } from 'react'
import { cx, type NativeAttrs } from './types'

export interface IconProps {
  /** Material Symbols Outlined ligature name, e.g. "search" or "check_circle". */
  name: string
  /** Rendered size in px. 16 compact, 20 in controls, 24 standalone. */
  size?: number
  /** Filled (1) or outlined (0). Filled reads as a status glyph. */
  fill?: 0 | 1
  /** Stroke weight. 400 matches body text. */
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700
  /** Optical grade. Use 200 on dark backgrounds to hold weight. */
  grade?: -25 | 0 | 200
  /** Optical size axis. Follows `size` unless set. */
  opticalSize?: 20 | 24 | 40 | 48
  /** Icon colour. Defaults to currentColor so it inherits from text. */
  color?: string
  /**
   * Accessible name, for an icon that means something on its own. Without
   * one the icon is decorative and hidden from assistive tech.
   */
  label?: string
}

/** The optical size axis stop nearest the rendered size. */
const opszFor = (size: number): 20 | 24 | 40 | 48 =>
  size <= 20 ? 20 : size <= 32 ? 24 : size <= 44 ? 40 : 48

export default function Icon({
  name,
  size = 24,
  fill = 0,
  weight = 400,
  grade = 0,
  opticalSize,
  color,
  label,
  className,
  style,
  ...rest
}: IconProps & NativeAttrs<'span', IconProps>) {
  const cssStyle: CSSProperties = {
    fontSize: size,
    fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opticalSize ?? opszFor(size)}`,
    color,
    lineHeight: 1,
    userSelect: 'none',
    ...style,
  }

  // Only Outlined: it is the one face the system loads. Rounded and Sharp were
  // offered here, and rendered as plain text wherever that font was not loaded.
  return (
    <span
      className={cx('material-symbols-outlined', className)}
      style={cssStyle}
      // An aria-label on a plain span is not reliably read; role="img" makes it count.
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      {...rest}
    >
      {name}
    </span>
  )
}
