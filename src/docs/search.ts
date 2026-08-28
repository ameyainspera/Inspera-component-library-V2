/**
 * Sidebar search.
 *
 * Built so you never have to know the canonical name. Four things have to work:
 *
 *   "dialog"   exact / prefix          — the easy case
 *   "modal"    a synonym               — keywords on each spec
 *   "dilaog"   a typo                  — bounded edit distance
 *   "txtinpt"  abbreviated / skipped   — subsequence match
 *
 * Scores are ordered so a weaker match on the *name* still loses to a strong
 * match on a keyword, and a fuzzy match never outranks a literal one.
 */

export interface Searchable {
  id: string
  name: string
  /** Shown under the name in results. */
  detail: string
  /** Grouping label, e.g. the component category. */
  group: string
  /** Synonyms, legacy names, related terms. */
  terms: string[]
  href: string
}

export interface SearchHit {
  item: Searchable
  score: number
  /** The term that matched, when it wasn't the name — shown as "matched: toast". */
  via?: string
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
const squash = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '')

/** Levenshtein, bailing out once the distance exceeds `max`. */
function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const curr = [i]
    let best = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost)
      best = Math.min(best, curr[j])
    }
    if (best > max) return max + 1
    prev = curr
  }
  return prev[b.length]
}

/**
 * Do the query's characters appear in order? Rewards runs and an early start,
 * so "txin" prefers "TextInput" over a token that merely contains the letters.
 */
function subsequenceScore(query: string, target: string): number {
  let qi = 0
  let run = 0
  let bonus = 0
  let firstIndex = -1
  for (let ti = 0; ti < target.length && qi < query.length; ti++) {
    if (target[ti] === query[qi]) {
      if (firstIndex < 0) firstIndex = ti
      run++
      bonus += run
      qi++
    } else {
      run = 0
    }
  }
  if (qi < query.length) return 0
  const density = query.length / target.length
  return bonus + density * 10 - firstIndex * 0.5
}

/** Typo tolerance scales with word length: short words get less latitude. */
const tolerance = (len: number) => (len <= 3 ? 0 : len <= 5 ? 1 : 2)

function scoreOne(query: string, item: Searchable): SearchHit | null {
  const q = norm(query)
  const qSquashed = squash(query)
  if (!q) return null

  const name = norm(item.name)
  const nameSquashed = squash(item.name)

  // Literal matches on the name.
  if (name === q) return { item, score: 1000 }
  if (name.startsWith(q) || nameSquashed.startsWith(qSquashed)) return { item, score: 900 }
  if (name.includes(q)) return { item, score: 800 }

  // Literal matches on a synonym or legacy name.
  for (const term of item.terms) {
    const t = norm(term)
    if (!t) continue
    if (t === q) return { item, score: 700, via: term }
    if (t.startsWith(q)) return { item, score: 650, via: term }
    if (t.includes(q)) return { item, score: 600, via: term }
  }

  // Every query word appearing somewhere in the description.
  const detail = norm(item.detail)
  const words = q.split(' ').filter(Boolean)
  if (words.length > 0 && words.every((w) => detail.includes(w))) {
    return { item, score: 500 }
  }

  // Typo tolerance, name first then synonyms.
  const nameDistance = editDistance(qSquashed, nameSquashed, tolerance(qSquashed.length))
  if (nameDistance <= tolerance(qSquashed.length)) {
    return { item, score: 450 - nameDistance * 20 }
  }
  for (const term of item.terms) {
    const t = squash(term)
    if (!t) continue
    const d = editDistance(qSquashed, t, tolerance(qSquashed.length))
    if (d <= tolerance(qSquashed.length)) return { item, score: 400 - d * 20, via: term }
  }

  // Abbreviations and dropped letters.
  const subName = subsequenceScore(qSquashed, nameSquashed)
  if (subName > 0) return { item, score: 200 + subName }
  for (const term of item.terms) {
    const sub = subsequenceScore(qSquashed, squash(term))
    if (sub > 0) return { item, score: 100 + sub, via: term }
  }

  return null
}

export function search(query: string, items: Searchable[], limit = 12): SearchHit[] {
  if (!query.trim()) return []
  return items
    .map((item) => scoreOne(query, item))
    .filter((hit): hit is SearchHit => hit !== null)
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
    .slice(0, limit)
}
