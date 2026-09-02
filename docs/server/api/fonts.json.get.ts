type GoogleFont = {
  name: string
  category: string
}

/**
 * The Google Fonts catalog, slimmed to what the theme studio's font picker
 * needs (family name + category, popularity-ordered). Proxied because the
 * metadata endpoint sends no CORS headers, and cached, the catalog moves
 * a few families a month at most.
 */
export default defineCachedEventHandler(async (): Promise<GoogleFont[]> => {
  const text = await $fetch<string>('https://fonts.google.com/metadata/fonts', { responseType: 'text' })
  // Google JSON endpoints traditionally lead with an anti-hijacking prefix
  const data = JSON.parse(text.replace(/^\)\]\}'/, ''))

  // an HTML error page or a renamed field must not become a cached crash
  if (!Array.isArray(data?.familyMetadataList)) {
    throw createError({ statusCode: 502, statusMessage: 'Unexpected fonts metadata shape' })
  }

  return (data.familyMetadataList as Array<{ family: string, category: string, popularity?: number }>)
    .sort((a, b) => (a.popularity ?? Number.MAX_SAFE_INTEGER) - (b.popularity ?? Number.MAX_SAFE_INTEGER))
    .map(font => ({ name: font.family, category: font.category }))
// one cache entry no matter the query string: the default key hashes the
// full URL, letting `?anything` bypass the cache straight to Google
}, { name: 'google-fonts', getKey: () => 'catalog', maxAge: 60 * 60 * 24, swr: true })
