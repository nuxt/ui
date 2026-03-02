import { markRaw } from 'vue'

const _cache = new Map<string, any>()

export async function cachedParseMarkdown(markdown: string) {
  const cached = _cache.get(markdown)
  if (cached) return cached

  const result = markRaw(await parseMarkdown(markdown))
  _cache.set(markdown, result)
  return result
}
