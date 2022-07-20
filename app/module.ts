import { defineNuxtModule } from '@nuxt/kit'
import { name, version } from '../package.json'
import { colorsAsRegex, excludeColors } from '../utils/colors'

export default defineNuxtModule({
  meta: {
    name,
    version,
    configKey: 'ui',
    compatibility: {
      nuxt: '^3.0.0',
      bridge: true
    }
  },
  setup (_, nuxt) {
    // @ts-ignore
    nuxt.hook('tailwindcss:config', function (tailwindConfig: TailwindConfig) {
      const globalColors = {
        ...(tailwindConfig?.theme?.colors || []),
        ...(tailwindConfig?.theme?.extend?.colors || [])
      }

      const variantColors = excludeColors(globalColors)
      const safeColorsAsRegex = colorsAsRegex(variantColors)

      tailwindConfig.safelist = tailwindConfig.safelist || []
      tailwindConfig.safelist.push(
        ...[{
          pattern: new RegExp(`bg-(${safeColorsAsRegex})-400`)
        },
        {
          pattern: new RegExp(`bg-(${safeColorsAsRegex})-(100|600|700)`),
          variants: ['hover', 'disabled', 'dark']
        },
        {
          pattern: new RegExp(`text-(${safeColorsAsRegex})-(100|800)`),
          variants: ['dark']
        },
        {
          pattern: new RegExp(`ring-(${safeColorsAsRegex})-(500)`),
          variants: ['focus']
        }]
      )
    })
  }
})
