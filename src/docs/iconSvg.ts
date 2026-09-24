/**
 * Fetch real SVG path data for a Material Symbol.
 *
 * Material Symbols ships as a variable font, so there is no SVG in the page to
 * copy - the glyph is drawn by the font. Google publishes the same icons as SVG
 * in the material-design-icons repo, one file per axis combination, and serves
 * them with `access-control-allow-origin: *`, so the browser can fetch them
 * directly.
 *
 * File naming, verified against the repo:
 *
 *   <name>/materialsymbols<style>/<name>[_<variant>]_<size>px.svg
 *
 * where <variant> concatenates, in this order and omitting every default:
 *   wght<N>   omitted at 400
 *   grad<N>   omitted at 0; -25 is written `gradN25`, not `grad-25`
 *   fill1     omitted at 0
 *
 * All defaults means no variant segment at all: `home_24px.svg`.
 */
export type IconStyleName = 'outlined' | 'rounded' | 'sharp'

export interface IconAxes {
  fill: 0 | 1
  weight: number
  grade: number
  opticalSize: number
}

/** Sizes the repo publishes. Anything else 404s. */
export const SVG_SIZES = [20, 24, 40, 48] as const

export function iconSvgUrl(name: string, style: IconStyleName, axes: IconAxes): string {
  const parts: string[] = []
  if (axes.weight !== 400) parts.push(`wght${axes.weight}`)
  if (axes.grade !== 0) parts.push(`grad${axes.grade < 0 ? `N${Math.abs(axes.grade)}` : axes.grade}`)
  if (axes.fill === 1) parts.push('fill1')

  const variant = parts.length ? `_${parts.join('')}` : ''
  const size = (SVG_SIZES as readonly number[]).includes(axes.opticalSize) ? axes.opticalSize : 24
  return (
    'https://raw.githubusercontent.com/google/material-design-icons/master/symbols/web/' +
    `${name}/materialsymbols${style}/${name}${variant}_${size}px.svg`
  )
}

const cache = new Map<string, string>()

/**
 * Returns the SVG markup, or throws with a readable reason. Not every axis
 * combination exists for every icon, so a 404 is a normal outcome and must be
 * reported rather than silently producing an empty copy.
 */
export async function fetchIconSvg(name: string, style: IconStyleName, axes: IconAxes): Promise<string> {
  const url = iconSvgUrl(name, style, axes)
  const hit = cache.get(url)
  if (hit) return hit

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(
      res.status === 404
        ? `Google does not publish an SVG for this combination (${style}, weight ${axes.weight}, grade ${axes.grade}, fill ${axes.fill}, ${axes.opticalSize}px).`
        : `Could not reach the icon source (HTTP ${res.status}).`,
    )
  }

  const svg = (await res.text()).trim()
  if (!svg.startsWith('<svg')) throw new Error('The icon source returned something that is not an SVG.')
  cache.set(url, svg)
  return svg
}

/** Just the `d` attributes, for pasting into an existing <svg>. */
export function extractPathData(svg: string): string {
  return [...svg.matchAll(/\sd="([^"]+)"/g)].map((m) => m[1]).join(' ')
}

/** A ready-to-paste React component using the fetched markup. */
export function toJsx(name: string, svg: string): string {
  const componentName = name
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
  const body = svg
    .replace(/<svg([^>]*)>/, '<svg$1 {...props}>')
    .replace(/\bclass=/g, 'className=')
    .replace(/\bxmlns:xlink=/g, 'xmlnsXlink=')
    .replace(/\bstroke-width=/g, 'strokeWidth=')
    .replace(/\bfill-rule=/g, 'fillRule=')
    .replace(/\bclip-rule=/g, 'clipRule=')
  return `export function ${componentName}Icon(props: React.SVGProps<SVGSVGElement>) {\n  return (\n    ${body}\n  )\n}`
}
