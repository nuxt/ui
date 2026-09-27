import plugin from 'tailwindcss/plugin'
import { colors } from './theme/color'
import type { Color } from './theme/color'

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

const defaults: Record<Color, string> = {
  primary: 'green',
  secondary: 'blue',
  success: 'green',
  info: 'blue',
  warning: 'yellow',
  error: 'red',
  neutral: 'slate'
}

export type ColorsOptions = Partial<Record<Color, string>>

/**
 * Points the color aliases at Tailwind palettes, one line per alias:
 * `@plugin "@nuxt/ui/colors" { primary: indigo; neutral: zinc; }`. Each writes
 * the alias's shades (`--ui-color-primary-50` to `950`) with the palette's
 * values, resolved when Tailwind compiles, so a prefixed or customized palette
 * works too.
 *
 * Nuxt UI registers it without options for the defaults, at zero specificity,
 * so the aliases you set win wherever you register it.
 */
const colorsPlugin: ReturnType<typeof plugin.withOptions<ColorsOptions>> = plugin.withOptions<ColorsOptions>(options => ({ addBase, theme }) => {
  const aliases = options ?? defaults
  const selector = options ? ':root, :host' : ':where(:root, :host)'

  const declarations: Record<string, string> = {}
  for (const [alias, palette] of Object.entries(aliases)) {
    if (!(colors as readonly string[]).includes(alias)) {
      throw new Error(`[@nuxt/ui] \`${alias}\` isn't a color alias. The \`@nuxt/ui/colors\` plugin takes ${colors.map(color => `\`${color}\``).join(', ')}.`)
    }
    // Nuxt UI's `neutral` alias takes over `--color-neutral-*`, so Tailwind's
    // own neutral palette lives on as `old-neutral`
    const name = palette === 'neutral' ? 'old-neutral' : palette
    for (const shade of shades) {
      const value = theme(`colors.${name}.${shade}`)
      if (typeof value !== 'string') {
        throw new TypeError(`[@nuxt/ui] \`${alias}: ${palette}\` needs a Tailwind palette with shades from 50 to 950, like \`indigo\` or one you declare as \`--color-${palette}-500\` in \`@theme\`.`)
      }
      declarations[`--ui-color-${alias}-${shade}`] = value
    }
  }

  addBase({ [selector]: declarations })
})

export default colorsPlugin
