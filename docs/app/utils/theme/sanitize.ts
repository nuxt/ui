/**
 * The write boundary for untrusted theme input. AI `applyTheme` output and
 * the persisted theme both end up concatenated into `<style>` rules, so only
 * CSS-safe tokens may get through. Every character class here excludes `;`,
 * `}` and `<`, which is what keeps a value from ending its declaration early.
 */
export const SAFE_NAME = /^[\w -]{1,50}$/
const SAFE_HEX = /^#[0-9a-f]{3,8}$/i
// the engine's canonical shade format: `oklch(62.3% 0.214 259.815)`
const SAFE_OKLCH = /^oklch\(\d{1,3}(?:\.\d+)?% \d(?:\.\d+)? \d{1,3}(?:\.\d+)?\)$/i
const SAFE_CSS_VAR_KEY = /^--[\w-]+$/
// var() refs, hex, keywords, px/% lengths, and literal oklch()/rgb() colors
// (an imported token override is as likely to be a literal as a ramp ref)
const SAFE_CSS_VAR_VALUE = /^(?:var\(--[\w-]+\)|#[0-9a-f]{3,8}|[a-z]+|-?\d{1,3}(?:\.\d+)?(?:px|%)|oklch\([\d.% -]{1,40}\)|rgba?\([\d.%, /]{1,40}\))$/i

export function sanitizeCustomColors(input: Record<string, any>): Record<string, Record<string, string>> {
  const result: Record<string, Record<string, string>> = {}
  for (const [name, shades] of Object.entries(input)) {
    if (!SAFE_NAME.test(name) || typeof shades !== 'object' || !shades) continue
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
      if (SAFE_CSS_VAR_KEY.test(key) && typeof value === 'string' && SAFE_CSS_VAR_VALUE.test(value)) {
        result[key] = value
      }
    }
    return result
  }
  return { light: clean(input.light), dark: clean(input.dark) }
}
