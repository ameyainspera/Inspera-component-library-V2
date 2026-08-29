import type { CSSProperties } from 'react'

export type IconStyle = 'outlined' | 'rounded' | 'sharp'

export interface IconProps {
  /** Material Symbols ligature name, e.g. "search" or "check_circle". */
  name: string
  /** Which Material Symbols face to use. */
  style?: IconStyle
  /** Rendered size in px. 16 compact, 20 in controls, 24 standalone. */
  size?: number
  /** Filled (1) or outlined (0). Filled reads as a status glyph. */
  fill?: 0 | 1
  /** Stroke weight. 400 matches body text. */
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700
  /** Optical grade. Use 200 on dark backgrounds to hold weight. */
  grade?: -25 | 0 | 200
  /** Optical size axis. Match to the rendered size. */
  opticalSize?: 20 | 24 | 40 | 48
  /** Icon colour. Defaults to currentColor so it inherits from text. */
  color?: string
  /** Additional classes, merged with the Material Symbols class. */
  className?: string
  /** Accessible name. Required when the icon carries meaning on its own. */
  'aria-label'?: string
  /** Hides the icon from assistive technology. Defaults to true unless aria-label is set. */
  'aria-hidden'?: boolean | 'true' | 'false'
}

const classMap: Record<IconStyle, string> = {
  outlined: 'material-symbols-outlined',
  rounded: 'material-symbols-rounded',
  sharp: 'material-symbols-sharp',
}

export default function Icon({
  name,
  style = 'outlined',
  size = 24,
  fill = 0,
  weight = 400,
  grade = 0,
  opticalSize = 24,
  color,
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
}: IconProps) {
  const cssStyle: CSSProperties = {
    fontSize: size,
    fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opticalSize}`,
    color,
    lineHeight: 1,
    userSelect: 'none',
  }

  return (
    <span
      className={[classMap[style], className].filter(Boolean).join(' ')}
      style={cssStyle}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden ?? (ariaLabel ? undefined : true)}
    >
      {name}
    </span>
  )
}
