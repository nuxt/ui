const _serverCache: Map<string, any> | null = import.meta.server ? new Map() : null

export async function cachedParseMarkdown(markdown: string) {
  if (_serverCache) {
    const cached = _serverCache.get(markdown)
    if (cached) return cached

    const result = await parseMarkdown(markdown)
    _serverCache.set(markdown, result)
    return result
  }

  return parseMarkdown(markdown)
}
