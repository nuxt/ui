import { zlibSync, strToU8, strFromU8 } from 'fflate'

/**
 * Serializes Vue SFC code into a play.ui.nuxt.com URL.
 * Uses the same encoding format as @vue/repl (fflate zlib + base64).
 */
export function getPlaygroundUrl(code: string): string {
  const files = JSON.stringify({ 'App.vue': code })
  const buffer = strToU8(files)
  const zipped = zlibSync(buffer, { level: 9 })
  const binary = strFromU8(zipped, true)
  return `https://play.ui.nuxt.com/#${btoa(binary)}`
}
