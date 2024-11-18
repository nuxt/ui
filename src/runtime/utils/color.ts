import type { HSBColor, RGBColor } from '../types/color'

export function validateHSB(hsb: HSBColor): HSBColor {
  return {
    h: Math.min(360, Math.max(0, hsb.h)),
    s: Math.min(100, Math.max(0, hsb.s)),
    b: Math.min(100, Math.max(0, hsb.b))
  }
}

export function validateRGB(rgb: RGBColor): RGBColor {
  return {
    r: Math.min(255, Math.max(0, rgb.r)),
    g: Math.min(255, Math.max(0, rgb.g)),
    b: Math.min(255, Math.max(0, rgb.b))
  }
}

export function validateHEX(hex: string): string {
  return hex.padEnd(6, '0')
}

export function transformHSBtoRGB(hsb: HSBColor): RGBColor {
  const saturation = hsb.s / 100
  const brightness = hsb.b / 100

  const chroma = brightness * saturation
  const x = chroma * (1 - Math.abs((hsb.h / 60) % 2 - 1))
  const m = brightness - chroma

  let r = 0, g = 0, b = 0

  if (hsb.h >= 0 && hsb.h < 60) {
    r = chroma
    g = x
    b = 0
  } else if (hsb.h >= 60 && hsb.h < 120) {
    r = x
    g = chroma
    b = 0
  } else if (hsb.h >= 120 && hsb.h < 180) {
    r = 0
    g = chroma
    b = x
  } else if (hsb.h >= 180 && hsb.h < 240) {
    r = 0
    g = x
    b = chroma
  } else if (hsb.h >= 240 && hsb.h < 300) {
    r = x
    g = 0
    b = chroma
  } else if (hsb.h >= 300 && hsb.h <= 360) {
    r = chroma
    g = 0
    b = x
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  }
}

export function transformHSBtoHEX(hsb: HSBColor): string {
  return transformRGBtoHEX(transformHSBtoRGB(hsb))
}

export function transformRGBtoHSB(rgb: RGBColor): HSBColor {
  const red = rgb.r / 255
  const green = rgb.g / 255
  const blue = rgb.b / 255

  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const delta = max - min

  let hue = 0
  if (delta !== 0) {
    if (max === red) {
      hue = ((green - blue) / delta + (green < blue ? 6 : 0)) * 60
    } else if (max === green) {
      hue = ((blue - red) / delta + 2) * 60
    } else if (max === blue) {
      hue = ((red - green) / delta + 4) * 60
    }
  }

  const saturation = max === 0 ? 0 : (delta / max) * 100
  const brightness = max * 100

  return {
    h: Math.round(hue),
    s: Math.round(saturation),
    b: Math.round(brightness)
  }
}

export function transformRGBtoHEX(rgb: RGBColor): string {
  const toHex = (value: number) => value.toString(16).padStart(2, '0')

  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase()
}

export function transformHEXtoRGB(hex: string): RGBColor {
  const hexValue = Number.parseInt(hex.includes('#') ? hex.substring(1) : hex, 16)

  return {
    r: hexValue >> 16,
    g: (hexValue & 0x00FF00) >> 8,
    b: hexValue & 0x0000FF
  }
}

export function transformHEXtoHSB(hex: string): HSBColor {
  return transformRGBtoHSB(transformHEXtoRGB(hex))
}
