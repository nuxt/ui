import { markRaw } from 'vue'

const _cache: Map<string, any> | null = import.meta.server ? new Map() : null

export async function cachedParseMarkdown(markdown: string) {
  if (_cache) {
    const cached = _cache.get(markdown)
    if (cached) return cached

    const result = markRaw(await parseMarkdown(markdown))
    _cache.set(markdown, result)
    return result
  }

  return markRaw(await parseMarkdown(markdown))
}
