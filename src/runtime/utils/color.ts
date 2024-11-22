import type { HSBColor, RGBColor } from '../types/color'

export function normalizeHSB(hsb: HSBColor): HSBColor {
  return {
    h: Math.min(360, Math.max(0, hsb.h)) || 0,
    s: Math.min(100, Math.max(0, hsb.s)) || 0,
    b: Math.min(100, Math.max(0, hsb.b)) || 0
  }
}

/**
 * Normalize hue
 *
 * Left - [0, 100] -> [0, 360]
 * Right - [0, 360] -> [0, 100]
 */
export function normalizeHue(hue: number, dir: 'left' | 'right' = 'left'): number {
  if (dir === 'right') {
    return (hue * 100) / 360
  }

  return (hue / 100) * 360
}

export function normalizeBrightness(brightness: number): number {
  return 100 - brightness
}

export function transformHSBtoRGB(hsb: HSBColor): RGBColor {
  let rgb = {
    r: 0,
    g: 0,
    b: 0
  }
  let h = Math.round(hsb.h)
  const s = Math.round((hsb.s * 255) / 100)
  const v = Math.round((hsb.b * 255) / 100)

  if (s === 0) {
    rgb = {
      r: v,
      g: v,
      b: v
    }
  } else {
    const t1 = v
    const t2 = ((255 - s) * v) / 255
    const t3 = ((t1 - t2) * (h % 60)) / 60

    if (h === 360) h = 0

    if (h < 60) {
      rgb.r = t1
      rgb.b = t2
      rgb.g = t2 + t3
    } else if (h < 120) {
      rgb.g = t1
      rgb.b = t2
      rgb.r = t1 - t3
    } else if (h < 180) {
      rgb.g = t1
      rgb.r = t2
      rgb.b = t2 + t3
    } else if (h < 240) {
      rgb.b = t1
      rgb.r = t2
      rgb.g = t1 - t3
    } else if (h < 300) {
      rgb.b = t1
      rgb.g = t2
      rgb.r = t2 + t3
    } else if (h < 360) {
      rgb.r = t1
      rgb.g = t2
      rgb.b = t1 - t3
    } else {
      rgb.r = 0
      rgb.g = 0
      rgb.b = 0
    }
  }

  return { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b) }
}

export function transformHSBtoHEX(hsb: HSBColor): string {
  return transformRGBtoHEX(transformHSBtoRGB(hsb))
}

export function transformRGBtoHSB(rgb: RGBColor): HSBColor {
  const hsb = {
    h: 0,
    s: 0,
    b: 0
  }
  const min = Math.min(rgb.r, rgb.g, rgb.b)
  const max = Math.max(rgb.r, rgb.g, rgb.b)
  const delta = max - min

  hsb.b = max
  hsb.s = max !== 0 ? (255 * delta) / max : 0

  if (hsb.s !== 0) {
    if (rgb.r === max) {
      hsb.h = (rgb.g - rgb.b) / delta
    } else if (rgb.g === max) {
      hsb.h = 2 + (rgb.b - rgb.r) / delta
    } else {
      hsb.h = 4 + (rgb.r - rgb.g) / delta
    }
  } else {
    hsb.h = -1
  }

  hsb.h *= 60

  if (hsb.h < 0) {
    hsb.h += 360
  }

  hsb.s *= 100 / 255
  hsb.b *= 100 / 255

  return hsb
}

export function transformRGBtoHEX(rgb: RGBColor): string {
  const hex = [rgb.r.toString(16), rgb.g.toString(16), rgb.b.toString(16)]

  for (const key in hex) {
    if (hex[key].length === 1) {
      hex[key] = '0' + hex[key]
    }
  }

  return hex.join('')
}

export function transformHEXtoRGB(hex: string): RGBColor {
  const hexValue = Number.parseInt(hex.includes('#') ? hex.substring(1) : hex, 16)

  return { r: hexValue >> 16, g: (hexValue & 0x00FF00) >> 8, b: hexValue & 0x0000FF }
}

export function transformHEXtoHSB(hex: string): HSBColor {
  return transformRGBtoHSB(transformHEXtoRGB(hex))
}
