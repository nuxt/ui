import { useFilter } from '@nuxt/ui/composables'

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

  const { filter } = useFilter()

  /**
   * Relevance-tiered (exact > prefix > substring, locale-aware) and
   * popularity-ordered within each tier, `filter`'s sort being stable.
   */
  function search(query: string, limit = 30): GoogleFont[] {
    const q = query.trim()
    if (!q) return []
    return filter(catalog.value, q, ['name']).slice(0, limit)
  }

  return { catalog, status, load, search }
}
