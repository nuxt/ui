import plugin from 'tailwindcss/plugin'
import tailwindColors from 'tailwindcss/colors'
import { colors } from '../theme/color'
import type { Color } from '../theme/color'

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

/** A palette name, optionally followed by the light and dark shades the alias uses. */
export type ColorsOptions = Partial<Record<Color, string>>

const isShade = (word: string) => word === 'black' || word === 'white' || (shades as readonly number[]).includes(Number(word))

// `black` and `white` aren't shades of a palette, so they are the color itself
const shadeValue = (alias: string, shade: string) => shade === 'black' || shade === 'white' ? shade : `var(--ui-color-${alias}-${shade})`

// Edits between two words, for the palette a typo was probably meant as
function distance(a: string, b: string) {
  let row = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const next = [i]
    for (let j = 1; j <= b.length; j++) {
      next[j] = Math.min(next[j - 1]! + 1, row[j]! + 1, row[j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
    row = next
  }
  return row[b.length]!
}

// `theme('colors')` lists every shade flat, like `red-500`
function closestPalette(name: string, shadesByName: unknown) {
  let closest: string | undefined
  let closestDistance = 3
  for (const key of Object.keys(shadesByName ?? {})) {
    const palette = key.match(/^(.+)-500$/)?.[1]
    if (!palette || (palette !== 'neutral' && (colors as readonly string[]).includes(palette))) {
      continue
    }
    const edits = distance(name, palette)
    if (edits < closestDistance) {
      closest = palette
      closestDistance = edits
    }
  }
  return closest
}

/**
 * Points the color aliases at Tailwind palettes, one line per alias:
 * `@plugin "@nuxt/ui/colors" { primary: indigo; neutral: zinc; }`. Each writes
 * the alias's shades (`--ui-color-primary-50` to `950`) with the palette's
 * values, resolved when Tailwind compiles, so a prefixed or customized palette
 * works too.
 *
 * The shades an alias uses follow the palette, `500` in light mode and `400`
 * in dark mode by default (`900` and `50` for `neutral`): `primary: neutral
 * 900 200` picks others, a single shade applies to both, `black` and `white`
 * work as shades, and shades alone (`primary: black white`) keep the palette.
 *
 * The defaults are plain CSS in `base.css`, at zero specificity, so the
 * aliases you set win wherever you register it.
 */
const colorsPlugin: ReturnType<typeof plugin.withOptions<ColorsOptions>> = plugin.withOptions<ColorsOptions>(options => ({ addBase, theme }) => {
  const aliases: Record<string, string | undefined> = options ?? {}

  const declarations: Record<string, string> = {}
  const light: Record<string, string> = {}
  const dark: Record<string, string> = {}
  for (const [alias, value] of Object.entries(aliases)) {
    if (!(colors as readonly string[]).includes(alias)) {
      throw new Error(`[@nuxt/ui] \`${alias}\` isn't a color alias. The \`@nuxt/ui/colors\` plugin takes ${colors.map(color => `\`${color}\``).join(', ')}.`)
    }
    if (!value) {
      continue
    }
    const words = String(value).replace(/["']/g, '').trim().split(/\s+/)
    // The palette is optional: shades alone keep the alias's palette
    const palette = isShade(words[0]!) ? undefined : words.shift()
    const [lightShade, darkShade = lightShade, ...rest] = words
    if (lightShade) {
      if (rest.length || ![lightShade, darkShade].every(shade => isShade(shade!))) {
        throw new Error(`[@nuxt/ui] \`${alias}: ${value}\` takes a palette and up to two shades, for light and dark mode, from ${shades.join(', ')}, \`black\` or \`white\`, like \`${alias}: indigo 600 300\`.`)
      }
      light[`--ui-${alias}`] = shadeValue(alias, lightShade)
      dark[`--ui-${alias}`] = shadeValue(alias, darkShade!)
    }
    if (!palette) {
      continue
    }
    // An alias's palette is the alias itself (`--color-primary-500` reads
    // `--ui-color-primary-500`), so pointing one at another loops
    if (palette !== 'neutral' && (colors as readonly string[]).includes(palette)) {
      throw new Error(`[@nuxt/ui] \`${alias}: ${palette}\` points a color alias at another. Give it a Tailwind palette, like \`indigo\`.`)
    }
    // Nuxt UI's `neutral` alias takes over `--color-neutral-*`, so Tailwind's
    // own neutral palette is read from its package
    for (const shade of shades) {
      const value = palette === 'neutral' ? tailwindColors.neutral[shade] : theme(`colors.${palette}.${shade}`)
      if (typeof value !== 'string') {
        const closest = closestPalette(palette, theme('colors'))
        throw new TypeError(`[@nuxt/ui] \`${alias}: ${palette}\` needs the name of a Tailwind palette with shades from 50 to 950, like \`indigo\`, or of one you declare in \`@theme\` as \`--color-<name>-50\` to \`-950\`.${closest ? ` Did you mean \`${closest}\`?` : ''}`)
      }
      declarations[`--ui-color-${alias}-${shade}`] = value
    }
  }

  if (Object.keys(declarations).length) {
    addBase({ ':root, :host': declarations })
  }
  // After the palettes, `.dark` last so it wins on a dark root
  if (Object.keys(light).length) {
    addBase({ ':root, :host, .light': light })
    addBase({ '.dark': dark })
  }
})

export default colorsPlugin
