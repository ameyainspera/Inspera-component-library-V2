/**
 * WCAG 2 contrast, for the generator and the DESIGN.md audit.
 *
 * The spec said "600-900 are safe for text" for every palette family, typed
 * by hand. It was true for red and purple only: gray-600 is 4.29:1 on white
 * and yellow-600 under 2:1. Which shades are safe for text is now computed
 * from the palette, so the sentence cannot drift from the values again.
 */

/** Relative luminance of a `#rrggbb` colour. */
function luminance(hex: string): number {
  const channel = (i: number) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5)
}

/** The contrast ratio between two `#rrggbb` colours, 1 to 21. */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** WCAG AA for body text. */
export const TEXT_CONTRAST = 4.5

/**
 * For each palette family, the lightest shade that reaches 4.5:1 on every
 * background given - and so does every darker shade.
 */
export function textSafeShades(
  palette: Record<string, Record<string, string>>,
  backgrounds: string[],
): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [family, shades] of Object.entries(palette)) {
    const ordered = Object.entries(shades).sort(([a], [b]) => Number(a) - Number(b))
    let lightest: string | undefined
    for (let i = ordered.length - 1; i >= 0; i--) {
      const [shade, value] = ordered[i]
      if (!backgrounds.every((bg) => contrastRatio(value, bg) >= TEXT_CONTRAST)) break
      lightest = shade
    }
    if (lightest) out[family] = lightest
  }
  return out
}
