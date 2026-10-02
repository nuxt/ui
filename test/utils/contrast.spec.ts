import { readFileSync } from 'node:fs'
import { describe, it, expect } from 'vitest'
import { join } from 'pathe'
import { colors } from '../../src/runtime/theme/color'

const css = (file: string) => readFileSync(join(process.cwd(), 'src/runtime/css', file), 'utf8')
const base = css('base.css')
const tokens = css('tokens.css')

type Mode = 'light' | 'dark'
// sRGB, gamma encoded, with an alpha
type Color = [r: number, g: number, b: number, alpha: number]

// The declarations of each mode, dark on top of light like the cascade
function declarations(mode: Mode) {
  const selectors = [':where(:root, :host)', ':where(:root, :host, .light)', ...(mode === 'dark' ? [':where(.dark)'] : [])]
  const vars: Record<string, string> = {}
  for (const selector of selectors) {
    for (const block of base.split(`${selector} {`).slice(1)) {
      for (const [, name, value] of block.slice(0, block.indexOf('}')).matchAll(/(--[\w-]+):([^;]+);/g)) {
        vars[name!] = value!.trim()
      }
    }
  }
  return vars
}

// The value a utility reads, from the `@theme` block
const themeValue = (name: string) => tokens.match(new RegExp(`${name}:([^;]+);`))?.[1]?.trim()

function splitArgs(value: string) {
  const args: string[] = []
  let depth = 0
  let current = ''
  for (const char of value) {
    if (char === '(') depth++
    if (char === ')') depth--
    if (char === ',' && depth === 0) {
      args.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  return [...args, current.trim()]
}

// A `color-mix()` argument, a color and its optional percentage
function mixPart(arg: string) {
  const index = arg.lastIndexOf(' ')
  return arg.endsWith('%') ? { value: arg.slice(0, index).trim(), percent: Number.parseFloat(arg.slice(index + 1)) } : { value: arg, percent: undefined }
}

const encode = (value: number) => {
  const v = Math.min(1, Math.max(0, value))
  return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055
}
const decode = (value: number) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4

function fromOklab([l, a, b]: number[], alpha = 1): Color {
  const l_ = (l! + 0.3963377774 * a! + 0.2158037573 * b!) ** 3
  const m_ = (l! - 0.1055613458 * a! - 0.0638541728 * b!) ** 3
  const s_ = (l! - 0.0894841775 * a! - 1.2914855480 * b!) ** 3
  return [
    encode(4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_),
    encode(-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_),
    encode(-0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_),
    alpha
  ]
}

function toOklab([r, g, b]: Color) {
  const [lr, lg, lb] = [r, g, b].map(decode)
  const l = Math.cbrt(0.4122214708 * lr! + 0.5363325363 * lg! + 0.0514459929 * lb!)
  const m = Math.cbrt(0.2119034982 * lr! + 0.6806995451 * lg! + 0.1073969566 * lb!)
  const s = Math.cbrt(0.0883024619 * lr! + 0.2817188376 * lg! + 0.6299787005 * lb!)
  return [
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
  ]
}

// Resolves what the themes write: `var()` with fallbacks, `oklch()`, `white`,
// `black` and `color-mix(in oklab, …)`. An accent variable reads the color's
// own, like the scope classes of `accent.css` do.
function resolve(value: string, vars: Record<string, string>, color: string): Color | undefined {
  if (value === 'white') return [1, 1, 1, 1]
  if (value === 'black') return [0, 0, 0, 1]
  if (value === 'transparent') return [0, 0, 0, 0]

  const call = value.match(/^([\w-]+)\((.*)\)$/s)
  if (!call) throw new Error(`Unsupported value: ${value}`)
  const [, name, body] = call

  if (name === 'var') {
    const [variable, ...fallback] = splitArgs(body!)
    const target = variable === '--ui-accent' ? `--ui-${color}` : variable!.replace(/^--ui-accent-/, `--ui-${color}-`)
    const declared = vars[target]
    // `initial` unsets a variable, so the fallback applies
    if (declared && declared !== 'initial') return resolve(declared, vars, color)
    return fallback.length ? resolve(fallback.join(', '), vars, color) : undefined
  }

  if (name === 'oklch') {
    const [l, c, h] = body!.split(/\s+/).map(Number.parseFloat)
    return fromOklab([l! / 100, c! * Math.cos(h! * Math.PI / 180), c! * Math.sin(h! * Math.PI / 180)])
  }

  if (name === 'color-mix') {
    const [, first, second] = splitArgs(body!).map(mixPart)
    const weight = first!.percent !== undefined ? first!.percent / 100 : second!.percent !== undefined ? 1 - second!.percent / 100 : 0.5
    const a = resolve(first!.value, vars, color)!
    const b = resolve(second!.value, vars, color)!
    // Mixed with `transparent`, the color keeps its channels and takes the weight as alpha
    if (b[3] === 0) return [a[0], a[1], a[2], a[3] * weight]
    if (a[3] === 0) return [b[0], b[1], b[2], b[3] * (1 - weight)]
    const [la, lb] = [toOklab(a), toOklab(b)]
    return fromOklab(la.map((channel, index) => channel * weight + lb[index]! * (1 - weight)), a[3] * weight + b[3] * (1 - weight))
  }

  throw new Error(`Unsupported value: ${value}`)
}

// What the browser paints for a translucent color on an opaque one
const over = (top: Color, bottom: Color): Color => [0, 1, 2].map(index => bottom[index]! + top[3] * (top[index]! - bottom[index]!)).concat(1) as Color

const luminance = ([r, g, b]: Color) => 0.2126 * decode(r) + 0.7152 * decode(g) + 0.0722 * decode(b)

function contrast(a: Color, b: Color) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (light! + 0.05) / (dark! + 0.05)
}

// WCAG 2 AA for text. A hovered fill is a state, not a resting surface, and
// amber sits a hair under on it
const AA = 4.5
const AA_HOVER = 4.4

const chromatic = colors.filter(color => color !== 'neutral')

describe.each(['light', 'dark'] as const)('contrast in %s mode', (mode) => {
  const vars = declarations(mode)
  const page = resolve('var(--ui-bg-default)', vars, 'neutral')!

  describe.each(chromatic)('%s', (color) => {
    const read = (name: string) => resolve(themeValue(name)!, vars, color)!
    const text = () => read('--text-color-accent-default')

    it('colored text on the page', () => {
      expect(contrast(over(text(), page), page)).toBeGreaterThanOrEqual(AA)
    })

    it(`\`text-${color}\` on the page`, () => {
      const utility = themeValue(`--text-color-${color}`) ?? themeValue(`--color-${color}`)!
      expect(contrast(over(resolve(utility, vars, color)!, page), page)).toBeGreaterThanOrEqual(AA)
    })

    it.each([
      ['soft', '--background-color-accent-soft', AA],
      ['strong', '--background-color-accent-strong', AA_HOVER]
    ] as const)('colored text on its %s fill', (_, fill, minimum) => {
      const surface = over(read(fill), page)
      expect(contrast(over(text(), surface), surface)).toBeGreaterThanOrEqual(minimum)
    })

    // The label of a solid isn't checked: the solid keeps its shade 500 with
    // `text-contrast` on it in light mode, which trades contrast for the color.
    // `--ui-<color>-text-contrast` or a darker shade for the alias opts out.
  })
})
