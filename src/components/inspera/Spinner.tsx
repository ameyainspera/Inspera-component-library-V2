import { type CSSProperties } from 'react'

export type SpinnerSize = 'Small' | 'Medium' | 'Large'
export type SpinnerIntent = 'Primary' | 'Neutral' | 'Inverse'

export interface SpinnerProps {
  /** Diameter 16 / 24 / 40. Values: Small | Medium | Large. */
  size?: SpinnerSize
  /** Arc color. Values: Primary | Neutral | Inverse. */
  intent?: SpinnerIntent
  /** Accessible label. */
  label?: string
}

const sizeMap: Record<SpinnerSize, number> = { Small: 16, Medium: 24, Large: 40 }
const intentMap: Record<SpinnerIntent, string> = {
  Primary: 'var(--primary)',
  Neutral: 'var(--gray-600)',
  Inverse: 'var(--white)',
}

const srOnly: CSSProperties = {
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

export default function Spinner({ size = 'Medium', intent = 'Primary', label = 'Loading' }: SpinnerProps) {
  const d = sizeMap[size]
  const stroke = size === 'Small' ? 2 : size === 'Medium' ? 3 : 4
  const r = (d - stroke) / 2
  const circumference = 2 * Math.PI * r
  const color = intentMap[intent]

  return (
    <span role="status" aria-label={label} style={{ display: 'inline-flex', width: d, height: d }}>
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
