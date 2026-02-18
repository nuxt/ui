import { useFilter as useRekaFilter } from 'reka-ui'
import { get } from '../../utils'

export function useFilter() {
  const { contains, startsWith } = useRekaFilter({ sensitivity: 'base' })

  /**
   * Score a string match against a search term.
   * @returns 0 = exact, 1 = starts with, 2 = contains, null = no match
   */
  function score(value: string, searchTerm: string): number | null {
    if (!contains(value, searchTerm)) return null
    if (contains(searchTerm, value)) return 0
    if (startsWith(value, searchTerm)) return 1
    return 2
  }

  /**
   * Score an item (primitive or object) against a search term.
   * For objects, returns the best score across all specified fields.
   * Supports array field values (each element is scored independently).
   * @returns 0 = exact, 1 = starts with, 2 = contains, null = no match
   */
  function scoreItem(item: any, searchTerm: string, fields: string[]): number | null {
    if (typeof item !== 'object' || item === null) {
      return score(String(item), searchTerm)
    }

    let bestScore: number | null = null
    for (const field of fields) {
      const value = get(item, field)
      if (value == null) continue

      const values = Array.isArray(value) ? value.map(String) : [String(value)]
      for (const v of values) {
        const s = score(v, searchTerm)
        if (s !== null && (bestScore === null || s < bestScore)) bestScore = s
        if (bestScore === 0) return 0
      }
    }
    return bestScore
  }

  /**
   * Filter and sort a flat list of items by match quality.
   * Returns a new array with only matching items, sorted by relevance (exact > startsWith > contains).
   */
  function filter<T>(items: T[], searchTerm: string, fields: string[]): T[] {
    if (!searchTerm) return items

    const scored: { item: T, score: number }[] = []
    for (const item of items) {
      const s = scoreItem(item, searchTerm, fields)
      if (s !== null) {
        scored.push({ item, score: s })
      }
    }

    scored.sort((a, b) => a.score - b.score)
    return scored.map(({ item }) => item)
  }

  /**
   * Filter and sort grouped items by match quality, preserving group structure.
   * Structural items (labels, separators) are kept at their relative position.
   * Empty groups (containing only structural items) are removed.
   */
  function filterGroups<T>(
    groups: T[][],
    searchTerm: string,
    options: {
      fields: string[]
      isStructural?: (item: T) => boolean
    }
  ): T[][] {
    if (!searchTerm) return groups

    return groups.map((group) => {
      const result: { item: T, score: number }[] = []
      for (const item of group) {
        if (item === undefined || item === null) continue
        if (options.isStructural?.(item)) {
          result.push({ item, score: -1 })
          continue
        }
        const s = scoreItem(item, searchTerm, options.fields)
        if (s !== null) {
          result.push({ item, score: s })
        }
      }
      result.sort((a, b) => a.score - b.score)
      return result.map(({ item }) => item)
    }).filter(group => group.some(item => !options.isStructural?.(item)))
  }

  return { score, scoreItem, filter, filterGroups }
}
