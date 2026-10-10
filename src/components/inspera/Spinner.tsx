import { cx, srOnly, type NativeAttrs } from './types'

export type SpinnerSize = 'Small' | 'Medium' | 'Large'
export type SpinnerIntent = 'Primary' | 'Neutral' | 'Inverse'

export interface SpinnerProps {
  /** Diameter 16 / 24 / 40. */
  size?: SpinnerSize
  /** Arc colour. */
  intent?: SpinnerIntent
  /** What is loading, announced to screen readers. */
  label?: string
}

const sizeMap: Record<SpinnerSize, number> = { Small: 16, Medium: 24, Large: 40 }
const intentMap: Record<SpinnerIntent, string> = {
  Primary: 'var(--primary)',
  Neutral: 'var(--gray-600)',
  Inverse: 'var(--white)',
}

export default function Spinner({
  size = 'Medium',
  intent = 'Primary',
  label = 'Loading',
  className,
  style,
  ...rest
}: SpinnerProps & NativeAttrs<'span', SpinnerProps>) {
  const d = sizeMap[size]
  const stroke = size === 'Small' ? 2 : size === 'Medium' ? 3 : 4
  const r = (d - stroke) / 2
  const circumference = 2 * Math.PI * r
  const color = intentMap[intent]

  return (
    // Named once, by the hidden text. It also carried aria-label, so some
    // screen readers read the label twice.
    <span role="status" className={cx('inspera', className)} style={{ position: 'relative', display: 'inline-flex', width: d, height: d, fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <svg
        width={d}
        height={d}
        viewBox={`0 0 ${d} ${d}`}
        style={{ animation: 'inspera-spin 0.8s linear infinite' }}
        aria-hidden
      >
        <circle cx={d / 2} cy={d / 2} r={r} fill="none" stroke="var(--gray-200)" strokeWidth={stroke} />
        <circle
          cx={d / 2}
          cy={d / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.7}
        />
      </svg>
      <span style={srOnly}>{label}</span>
    </span>
  )
}
