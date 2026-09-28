import plugin from 'tailwindcss/plugin'
import { colors } from '../theme/color'
import type { Color } from '../theme/color'

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

export type ColorsOptions = Partial<Record<Color, string>>

/**
 * Points the color aliases at Tailwind palettes, one line per alias:
 * `@plugin "@nuxt/ui/colors" { primary: indigo; neutral: zinc; }`. Each writes
 * the alias's shades (`--ui-color-primary-50` to `950`) with the palette's
 * values, resolved when Tailwind compiles, so a prefixed or customized palette
 * works too.
 *
 * The defaults are plain CSS in `base.css`, at zero specificity, so the
 * aliases you set win wherever you register it.
 */
const colorsPlugin: ReturnType<typeof plugin.withOptions<ColorsOptions>> = plugin.withOptions<ColorsOptions>(options => ({ addBase, theme }) => {
  const aliases: Record<string, string | undefined> = options ?? {}

  const declarations: Record<string, string> = {}
  for (const [alias, palette] of Object.entries(aliases)) {
    if (!(colors as readonly string[]).includes(alias)) {
      throw new Error(`[@nuxt/ui] \`${alias}\` isn't a color alias. The \`@nuxt/ui/colors\` plugin takes ${colors.map(color => `\`${color}\``).join(', ')}.`)
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
    // own neutral palette lives on as `old-neutral`
    const name = palette === 'neutral' ? 'old-neutral' : palette
    for (const shade of shades) {
      const value = theme(`colors.${name}.${shade}`)
      if (typeof value !== 'string') {
        throw new TypeError(`[@nuxt/ui] \`${alias}: ${palette}\` needs the name of a Tailwind palette with shades from 50 to 950, like \`indigo\`, or of one you declare in \`@theme\` as \`--color-<name>-50\` to \`-950\`.`)
      }
      declarations[`--ui-color-${alias}-${shade}`] = value
    }
  }

  if (Object.keys(declarations).length) {
    addBase({ ':root, :host': declarations })
  }
})

export default colorsPlugin
