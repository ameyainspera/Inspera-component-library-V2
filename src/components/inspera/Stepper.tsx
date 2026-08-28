import { type CSSProperties } from 'react'

export type StepperOrientation = 'Horizontal' | 'Vertical'
export type StepperSize = 'Small' | 'Medium'

export interface Step {
  label: string
  description?: string
}

export interface StepperProps {
  /** Ordered steps. */
  steps?: Step[]
  /** Zero-based index of the current step. */
  activeStep?: number
  /** Layout direction. Values: Horizontal | Vertical. */
  orientation?: StepperOrientation
  /** Indicator size. Values: Small | Medium. */
  size?: StepperSize
}

const defaultSteps: Step[] = [
  { label: 'Details', description: 'Assessment info' },
  { label: 'Questions', description: 'Add content' },
  { label: 'Settings', description: 'Rules & timing' },
  { label: 'Review', description: 'Publish' },
]

export default function Stepper({
  steps = defaultSteps,
  activeStep = 1,
  orientation = 'Horizontal',
  size = 'Medium',
}: StepperProps) {
  const vertical = orientation === 'Vertical'
  const circle = size === 'Small' ? 24 : 32
  const fontSize = size === 'Small' ? 13 : 14

  const container: CSSProperties = {
    display: 'flex',
    flexDirection: vertical ? 'column' : 'row',
    alignItems: vertical ? 'stretch' : 'flex-start',
    gap: 0,
    width: vertical ? 'auto' : '100%',
    fontFamily: 'var(--font-sans)',
  }

  return (
    <ol role="list" style={{ ...container, listStyle: 'none', margin: 0, padding: 0 }}>
      {steps.map((step, i) => {
        const completed = i < activeStep
        const active = i === activeStep
        const isLast = i === steps.length - 1

        const indicator: CSSProperties = {
          width: circle,
          height: circle,
          flexShrink: 0,
          borderRadius: 'var(--radius-pill)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          fontWeight: 600,
          background: completed || active ? 'var(--primary)' : 'transparent',
          color: completed || active ? '#FFFFFF' : 'var(--gray-600)',
          border: completed || active ? 'none' : '2px solid var(--border-strong)',
          boxShadow: active ? '0 0 0 4px var(--primary-focus-ring)' : 'none',
          transition: 'background 140ms ease, box-shadow 140ms ease',
        }

        const connector: CSSProperties = vertical
          ? {
              width: 2,
              flex: 1,
              minHeight: 20,
              margin: '4px 0',
              marginLeft: circle / 2 - 1,
              background: completed ? 'var(--primary)' : 'var(--border)',
            }
          : {
              height: 2,
              flex: 1,
              margin: '0 8px',
              marginTop: circle / 2 - 1,
              background: completed ? 'var(--primary)' : 'var(--border)',
            }

        return (
          <li
            key={step.label}
            aria-current={active ? 'step' : undefined}
            style={{
              display: 'flex',
              flexDirection: vertical ? 'column' : 'row',
              // Always top-align. Centring made the horizontal connector sit
              // against the full step height (circle + label + description),
              // so it rendered down at label level instead of through the
              // circles — and steps with a description knocked their circle
              // out of line with the rest.
              alignItems: 'flex-start',
              // '1 1 auto', not '1' (basis 0): with a zero basis every step
              // gets the same *total* width, so a step with a long label was
              // left with a stub of a connector while a short one got a long
              // run. Growing from the content width shares the free space
              // evenly, so every connector comes out the same length.
              flex: vertical ? 'none' : isLast ? 'none' : '1 1 auto',
              minWidth: 0,
            }}
          >
            <div style={{ display: 'flex', flexDirection: vertical ? 'row' : 'column', alignItems: vertical ? 'flex-start' : 'center', gap: vertical ? 12 : 8 }}>
              <span style={indicator} aria-hidden>
                {completed ? (
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check</span>
                ) : (
                  i + 1
                )}
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: vertical ? 'left' : 'center' }}>
                <span style={{ fontSize, fontWeight: active || completed ? 600 : 500, color: active || completed ? 'var(--text-primary)' : 'var(--gray-600)' }}>
                  {step.label}
                </span>
                {step.description && (
                  <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{step.description}</span>
                )}
              </span>
            </div>
            {!isLast && <span style={connector} aria-hidden />}
          </li>
        )
      })}
    </ol>
  )
}
