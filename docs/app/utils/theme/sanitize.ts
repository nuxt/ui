/**
 * The write boundary for untrusted theme input. AI `applyTheme` output and
 * the persisted theme both end up concatenated into `<style>` rules, so only
 * CSS-safe tokens may get through. Every character class here excludes `;`,
 * `}` and `<`, which is what keeps a value from ending its declaration early.
 */
export const SAFE_NAME = /^[\w -]{1,50}$/
// `__proto__` and friends pass SAFE_NAME but assigning them walks the
// prototype instead of adding a key, so the palette vanishes from
// Object.keys and its shades leak onto every lookup.
const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype'])
const SAFE_HEX = /^#[0-9a-f]{3,8}$/i
// The engine's canonical shade format is `oklch(62.3% 0.214 259.815)`, but
// every spelling parseColor reads has to pass too (a fractional lightness,
// a `.2` chroma, a `deg` hue, padding): the AI writes them all, and a
// rejected shade drops the whole palette. Digits, `%`, `deg`, `none` and
// spaces only, so a value still can't end its declaration early. Tailwind
// >=4.3.3 emits `none` for achromatic chroma/hue (the whole neutral ramp).
const OKLCH_NUMBER = String.raw`\d+(?:\.\d+)?|\.\d+`
const SAFE_OKLCH = new RegExp(String.raw`^oklch\(\s*(?:${OKLCH_NUMBER})%?\s+(?:${OKLCH_NUMBER}|none)\s+(?:(?:${OKLCH_NUMBER})(?:deg)?|none)\s*\)$`, 'i')
const SAFE_CSS_VAR_KEY = /^--[\w-]+$/
// var() refs, hex, keywords, px/% lengths, and literal oklch()/rgb() colors
// (an imported token override is as likely to be a literal as a ramp ref)
const SAFE_CSS_VAR_VALUE = /^(?:var\(--[\w-]+\)|#[0-9a-f]{3,8}|[a-z]+|-?\d{1,3}(?:\.\d+)?(?:px|%)|oklch\([\w.% -]{1,40}\)|rgba?\([\d.%, /]{1,40}\))$/i

// A palette name becomes `--color-<name>-<shade>`, one ident: a space, fine
// inside a quoted font family, would split the property and drop the ramp.
const SAFE_PALETTE_NAME = /^[\w-]{1,50}$/

export function sanitizeCustomColors(input: Record<string, any>): Record<string, Record<string, string>> {
  const result: Record<string, Record<string, string>> = {}
  for (const [name, shades] of Object.entries(input)) {
    if (!SAFE_PALETTE_NAME.test(name) || UNSAFE_KEYS.has(name) || typeof shades !== 'object' || !shades) continue
    const safeShades: Record<string, string> = {}
    for (const [shade, value] of Object.entries(shades as Record<string, unknown>)) {
      if (/^\d{2,3}$/.test(shade) && typeof value === 'string' && (SAFE_OKLCH.test(value) || SAFE_HEX.test(value))) {
        safeShades[shade] = value
      }
    }
    if (Object.keys(safeShades).length) result[name] = safeShades
  }
  return result
}

export function sanitizeCSSVariables(input: { light?: Record<string, any>, dark?: Record<string, any> }): { light: Record<string, string>, dark: Record<string, string> } {
  const clean = (vars?: Record<string, unknown>) => {
    const result: Record<string, string> = {}
    for (const [key, value] of Object.entries(vars || {})) {
      if (SAFE_CSS_VAR_KEY.test(key) && !UNSAFE_KEYS.has(key.slice(2)) && typeof value === 'string' && SAFE_CSS_VAR_VALUE.test(value)) {
        result[key] = value
      }
    }
    return result
  }
  return { light: clean(input.light), dark: clean(input.dark) }
}

const UNSAFE_OVERRIDE_KEYS = new Set(['__proto__', 'constructor', 'prototype'])

function cleanOverride(value: unknown, depth: number): unknown {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value
  if (depth > 6 || !value || typeof value !== 'object') return undefined
  if (Array.isArray(value)) return value.map(item => cleanOverride(item, depth + 1)).filter(item => item !== undefined)

  const result: Record<string, unknown> = {}
  for (const [key, item] of Object.entries(value)) {
    if (UNSAFE_OVERRIDE_KEYS.has(key)) continue
    const cleaned = cleanOverride(item, depth + 1)
    if (cleaned !== undefined) result[key] = cleaned
  }
  return result
}

/**
 * A component override from a link or the AI is theme data: class strings in `slots`,
 * `variants` and `compoundVariants`, and plain values in `defaultVariants`, which
 * components read as prop defaults.
 */
export function sanitizeComponentOverride(input: unknown): Record<string, any> {
  const result = cleanOverride(input, 0)
  if (!result || typeof result !== 'object' || Array.isArray(result)) return {}

  const override = result as Record<string, any>
  if (override.defaultVariants && typeof override.defaultVariants === 'object') {
    override.defaultVariants = Object.fromEntries(Object.entries(override.defaultVariants).filter(([, value]) => typeof value !== 'object'))
  }
  return override
}
