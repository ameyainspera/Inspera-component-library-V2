import type { CSSProperties } from 'react'

export type IconStyle = 'outlined' | 'rounded' | 'sharp'

export interface IconProps {
  name: string
  style?: IconStyle
  size?: number
  fill?: 0 | 1
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700
  grade?: -25 | 0 | 200
  opticalSize?: 20 | 24 | 40 | 48
  color?: string
  className?: string
  'aria-label'?: string
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
