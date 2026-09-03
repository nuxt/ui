import type { ThemeDoc } from './engine/types'

export function encodeThemeDoc(doc: ThemeDoc): string {
  // btoa is latin1-only, and font names and palette ids can carry non-ascii
  const bytes = new TextEncoder().encode(JSON.stringify(doc))
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export function decodeThemeDoc(value: string): ThemeDoc | undefined {
  try {
    const binary = atob(value.replace(/-/g, '+').replace(/_/g, '/'))
    const doc = JSON.parse(new TextDecoder().decode(Uint8Array.from(binary, char => char.charCodeAt(0))))
    // shape only, applyThemeSettings sanitizes every value that reaches CSS
    return doc && typeof doc === 'object' && doc.version === 1 ? doc as ThemeDoc : undefined
  } catch {
    return undefined
  }
}
