import type { ThemeDoc } from './engine/types'

// deflate-raw, not gzip: no header or trailer, which is the difference between
// shrinking and growing a short theme. A custom palette is 11 near-identical
// oklch strings, so a link with one goes ~750 chars to ~300, and a pair of
// 91-stop ramps goes ~9200 to ~1000.
async function squeeze(bytes: Uint8Array<ArrayBuffer>, direction: 'compress' | 'decompress') {
  const Stream = direction === 'compress' ? globalThis.CompressionStream : globalThis.DecompressionStream
  if (!Stream) return undefined

  try {
    // piped rather than written through a writer: a stream that rejects mid
    // write (anything not deflate reaching decompress) would leave the
    // writer's own promise unhandled
    const piped = new Response(bytes).body!.pipeThrough(new Stream('deflate-raw'))
    return new Uint8Array(await new Response(piped).arrayBuffer())
  } catch {
    return undefined
  }
}

function toBase64url(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function parseDoc(bytes: Uint8Array<ArrayBuffer> | undefined): ThemeLink | undefined {
  if (!bytes) return undefined

  try {
    const doc = JSON.parse(new TextDecoder().decode(bytes))
    // shape only, applyThemeSettings sanitizes every value that reaches CSS
    return doc && typeof doc === 'object' && doc.version === 1 ? doc as ThemeLink : undefined
  } catch {
    return undefined
  }
}

/**
 * A link carries the document, except when the document IS a preset, where the
 * id alone rebuilds it (834 chars down to ~60 for cobalt). The match has to be
 * exact: anything the user changed falls through to the full document, so a
 * custom theme is never approximated by the preset it started from.
 */
export type ThemeLink = ThemeDoc & { preset?: string }

export async function encodeThemeDoc(doc: ThemeLink): Promise<string> {
  // btoa is latin1-only, and font names and palette ids can carry non-ascii
  const json = new TextEncoder().encode(JSON.stringify(doc))
  return toBase64url(await squeeze(json, 'compress') ?? json)
}

export async function decodeThemeDoc(value: string): Promise<ThemeLink | undefined> {
  let bytes: Uint8Array<ArrayBuffer>
  try {
    bytes = Uint8Array.from(atob(value.replace(/-/g, '+').replace(/_/g, '/')), char => char.charCodeAt(0))
  } catch {
    return undefined
  }

  // Uncompressed is the fallback rather than a second format: it covers a
  // browser without DecompressionStream on either end of the link.
  return parseDoc(await squeeze(bytes, 'decompress')) ?? parseDoc(bytes)
}
