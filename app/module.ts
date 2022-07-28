import { fileURLToPath } from 'url'
import { defineNuxtModule } from '@nuxt/kit'
import { resolve } from 'pathe'
import colors from 'tailwindcss/colors.js'
import { name, version } from '../package.json'
import { colorsAsRegex, excludeColors } from '../utils/colors'

const themeDir = fileURLToPath(new URL('./', import.meta.url))
const resolveThemeDir = (path: string) => resolve(themeDir, path)

const getPrefixedComponents = (prefix: string) => ([
  {
    path: resolveThemeDir('../components/elements'),
    global: true,
    prefix,
    watch: false
  },
  {
    path: resolveThemeDir('../components/feedback'),
    global: true,
    prefix,
    watch: false
  },
  {
    path: resolveThemeDir('../components/forms'),
    global: true,
    prefix,
    watch: false
  },
  {
    path: resolveThemeDir('../components/layout'),
    global: true,
    prefix,
    watch: false
  },
  {
    path: resolveThemeDir('../components/navigation'),
    global: true,
    prefix,
    watch: false
  },
  {
    path: resolveThemeDir('../components/overlays'),
    global: true,
    prefix,
    watch: false
  }
])

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
  defaults: {
    prefix: 'U'
  },
  setup (options, nuxt) {
    // Set runtime config
    nuxt.options.runtimeConfig.public = nuxt.options.runtimeConfig.public || {}
    nuxt.options.runtimeConfig.public.ui = {
      prefix: options.prefix
    }

    const nitroConfig = nuxt.options.nitro
    nitroConfig.prerender = nitroConfig.prerender || {}
    nitroConfig.prerender.routes = nitroConfig.prerender.routes || []
    nuxt.options.nitro.prerender.routes.push('/api/component-meta')

    // Push components with prefix
    nuxt.hook('components:dirs', (components) => {
      const rootIndex = components.findIndex((dir: any) => dir.path === resolveThemeDir('../components'))
      components.splice(rootIndex, 1)
      components.push(...getPrefixedComponents(options.prefix))
    })

    // @ts-ignore
    nuxt.hook('tailwindcss:config', async (tailwindConfig: TailwindConfig) => {
      const gray = 'gray'
      const primary = 'indigo'
      const excludedColors = [
        'lightBlue',
        'warmGray',
        'trueGray',
        'coolGray',
        'blueGray'
      ]
      excludedColors.forEach(color => delete colors[color])

      tailwindConfig.darkMode = 'class'

      tailwindConfig.plugins = tailwindConfig.plugins ?? []
      tailwindConfig.plugins.push(
        await import('@tailwindcss/forms'),
        await import('@tailwindcss/line-clamp'),
        await import('@tailwindcss/aspect-ratio'),
        await import('@tailwindcss/typography')
      )

      const globalColors = {
        ...(tailwindConfig?.theme?.colors || colors),
        ...(tailwindConfig?.theme?.extend?.colors || [])
      }

      tailwindConfig.theme = tailwindConfig.theme ?? {}
      tailwindConfig.theme.extend = tailwindConfig.theme.extend ?? {}
      tailwindConfig.theme.extend.colors = tailwindConfig.theme.extend.colors ?? {}

      // Overwrite colors
      globalColors.primary = tailwindConfig.theme.extend.colors.primary = globalColors[primary] || colors[primary]

      // @ts-ignore
      globalColors.gray = tailwindConfig.theme.extend.colors.gray = globalColors[gray] || colors[gray]

      const variantColors = excludeColors(globalColors)
      const safeColorsAsRegex = colorsAsRegex(variantColors)

      tailwindConfig.safelist = tailwindConfig.safelist || []
      tailwindConfig.safelist.push(
        'dark',
        {
          pattern: /rounded-(sm|md|lg|xl|2xl|3xl)/,
          variants: ['sm']
        },
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
