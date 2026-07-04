/**
 * Minimal sRGB ↔ OKLCH conversion (Björn Ottosson's OKLab), kept
 * dependency-free so the engine stays portable. Only what the palette
 * generator needs: parse a hex, move through OKLCH space, come back to a
 * gamut-safe hex.
 */

export interface Oklch {
  /** Perceptual lightness, 0–1 */
  l: number
  /** Chroma, 0–~0.4 in sRGB */
  c: number
  /** Hue in degrees, 0–360 */
  h: number
}

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055
}

export function hexToRgb(hex: string): [number, number, number] {
  let value = hex.replace('#', '')
  if (value.length === 3) {
    value = value.split('').map(ch => ch + ch).join('')
  }
  return [
    Number.parseInt(value.slice(0, 2), 16) / 255,
    Number.parseInt(value.slice(2, 4), 16) / 255,
    Number.parseInt(value.slice(4, 6), 16) / 255
  ]
}

export function rgbToHex([r, g, b]: [number, number, number]): string {
  const to = (c: number) => Math.round(Math.min(1, Math.max(0, c)) * 255).toString(16).padStart(2, '0')
  return `#${to(r)}${to(g)}${to(b)}`.toUpperCase()
}

export function rgbToOklch([r, g, b]: [number, number, number]): Oklch {
  const lr = srgbToLinear(r)
  const lg = srgbToLinear(g)
  const lb = srgbToLinear(b)

  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)

  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s

  const c = Math.sqrt(a * a + bb * bb)
  let h = Math.atan2(bb, a) * 180 / Math.PI
  if (h < 0) h += 360

  return { l: L, c, h }
}

/** Raw conversion — channels may fall outside [0, 1] when out of gamut. */
function oklchToLinearRgb({ l: L, c, h }: Oklch): [number, number, number] {
  const hr = h * Math.PI / 180
  const a = Math.cos(hr) * c
  const b = Math.sin(hr) * c

  const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3)
  const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3)
  const s = Math.pow(L - 0.0894841775 * a - 1.291485548 * b, 3)

  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
  ]
}

const GAMUT_EPSILON = 0.000005

export function inGamut(color: Oklch): boolean {
  return oklchToLinearRgb(color).every(channel => channel >= -GAMUT_EPSILON && channel <= 1 + GAMUT_EPSILON)
}

/** Reduce chroma (binary search) until the color fits in sRGB. */
export function clampToGamut(color: Oklch): Oklch {
  if (inGamut(color)) return color

  let low = 0
  let high = color.c
  for (let i = 0; i < 24; i++) {
    const mid = (low + high) / 2
    if (inGamut({ ...color, c: mid })) {
      low = mid
    } else {
      high = mid
    }
  }
  return { ...color, c: low }
}

export function oklchToHex(color: Oklch): string {
  const clamped = clampToGamut(color)
  return rgbToHex(oklchToLinearRgb(clamped).map(linearToSrgb) as [number, number, number])
}

export function hexToOklch(hex: string): Oklch {
  return rgbToOklch(hexToRgb(hex))
}

/**
 * Normalize a CSS color value to hex. Handles the forms the studio actually
 * meets: hex, `oklch(…)` (tailwind v4's format) and `rgb(…)`.
 */
export function parseCssColor(value: string): string | undefined {
  const input = value.trim()

  if (input.startsWith('#')) {
    return rgbToHex(hexToRgb(input))
  }

  const oklch = input.match(/^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)/i)
  if (oklch) {
    const l = Number(oklch[1]) / (oklch[2] === '%' ? 100 : 1)
    return oklchToHex({ l, c: Number(oklch[3]), h: Number(oklch[4]) })
  }

  const rgb = input.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i)
  if (rgb) {
    return rgbToHex([Number(rgb[1]) / 255, Number(rgb[2]) / 255, Number(rgb[3]) / 255])
  }

  return undefined
}

/** WCAG 2.x relative luminance. */
function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map(srgbToLinear) as [number, number, number]
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG 2.x contrast ratio between two hex colors, 1–21. */
export function contrastRatio(hexA: string, hexB: string): number {
  const la = luminance(hexA)
  const lb = luminance(hexB)
  const [lighter, darker] = la > lb ? [la, lb] : [lb, la]
  return (lighter + 0.05) / (darker + 0.05)
}
