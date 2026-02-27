const _serverCache: Map<string, any> | null = import.meta.server ? new Map() : null

export async function cachedParseMarkdown(markdown: string, options?: Record<string, any>) {
  if (_serverCache) {
    const key = options ? `${markdown}\0${JSON.stringify(options)}` : markdown
    const cached = _serverCache.get(key)
    if (cached) return cached

    const result = await parseMarkdown(markdown, options)
    _serverCache.set(key, result)
    return result
  }

  return parseMarkdown(markdown, options)
}
