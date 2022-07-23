import { fileURLToPath } from 'url'
import { defineNuxtModule } from '@nuxt/kit'
import { resolve } from 'pathe'
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

    // Push components with prefix
    nuxt.hook('components:dirs', (components) => {
      const rootIndex = components.findIndex((dir: any) => dir.path === resolveThemeDir('../components'))
      components.splice(rootIndex, 1)
      components.push(...getPrefixedComponents(options.prefix))
    })

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
