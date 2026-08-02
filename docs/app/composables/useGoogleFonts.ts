export interface GoogleFont {
  name: string
  category: string
}

/**
 * The full Google Fonts catalog (family + category, popularity-ordered),
 * served by /api/fonts.json, the metadata endpoint itself has no CORS
 * headers. Fetched lazily the first time a font picker opens and shared
 * through useState so every picker searches the same copy.
 */
export function useGoogleFonts() {
  const catalog = useState<GoogleFont[]>('google-fonts-catalog', () => [])
  const status = useState<'idle' | 'loading' | 'ready' | 'error'>('google-fonts-status', () => 'idle')

  async function load() {
    if (status.value === 'ready' || status.value === 'loading') return
    status.value = 'loading'
    try {
      catalog.value = await $fetch<GoogleFont[]>('/api/fonts.json')
      status.value = 'ready'
    } catch {
      status.value = 'error'
    }
  }

  /** Popularity-ordered matches, prefix matches ahead of substring hits. */
  function search(query: string, limit = 30): GoogleFont[] {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const starts: GoogleFont[] = []
    const contains: GoogleFont[] = []
    for (const font of catalog.value) {
      const name = font.name.toLowerCase()
      if (name.startsWith(q)) {
        if (starts.push(font) >= limit) break
      } else if (contains.length < limit && name.includes(q)) {
        contains.push(font)
      }
    }
    return [...starts, ...contains].slice(0, limit)
  }

  return { catalog, status, load, search }
}
