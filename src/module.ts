import { fileURLToPath } from 'url'
import { resolve } from 'pathe'
import { defineNuxtModule, installModule, addComponentsDir, addTemplate, addPlugin, resolveModule } from '@nuxt/kit'
import defu from 'defu'
import type { TailwindConfig } from 'tailwindcss/tailwind-config'
import colors from 'tailwindcss/colors.js'
import { name, version } from '../package.json'
import { safeColorsAsRegex } from './runtime/utils/colors'

interface ColorsOptions {
  /**
   * @default 'indigo'
   */
  primary?: string

  /**
   * @default 'zinc'
   */
  gray?: string
}

export interface ModuleOptions {
  /**
   * @default 'tailwindui'
   */
  preset?: string | object

  /**
   * @default 'u'
   */
  prefix?: string

  colors?: ColorsOptions

  tailwindcss?: TailwindConfig
}

const defaults = {
  preset: 'default',
  prefix: 'u',
  colors: {
    primary: 'indigo',
    gray: 'zinc'
  },
  tailwindcss: {
    theme: {}
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'ui',
    compatibility: {
      nuxt: '^3.0.0',
      bridge: true
    }
  },
  defaults,
  async setup (options, nuxt) {
    const { preset, prefix, colors: { primary = 'indigo', gray = 'zinc' } = {}, tailwindcss: { theme = {} } = {} } = options

    // Transpile runtime
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir)
    nuxt.options.build.transpile.push('@popperjs/core', '@headlessui/vue')

    await installModule('@nuxtjs/tailwindcss', {
      viewer: false,
      config: {
        darkMode: 'class',
        theme: defu.arrayFn({
          extend: {
            colors: {
              // @ts-ignore
              gray: typeof gray === 'object' ? gray : (colors && colors[gray]),
              // @ts-ignore
              primary: typeof primary === 'object' ? primary : (colors && colors[primary])
            }
          }
        }, theme),
        plugins: [
          require('@tailwindcss/forms'),
          require('@tailwindcss/line-clamp'),
          require('@tailwindcss/aspect-ratio')
        ],
        content: [
          resolve(runtimeDir, 'components/**/*.{vue,js,ts}'),
          resolve(runtimeDir, 'presets/*.{mjs,js,ts}')
        ],
        // Safelist dynamic colors used in preset
        safelist: [{
          pattern: new RegExp(`(hover|disabled|dark:)?bg-(${safeColorsAsRegex})-(100|600|700)`)
        }, {
          pattern: new RegExp(`(dark:)?text-(${safeColorsAsRegex})-(100|800)`)
        }, {
          pattern: new RegExp(`(focus:)?ring-(${safeColorsAsRegex})-(500)`)
        }]
      },
      cssPath: resolve(runtimeDir, 'tailwind.css')
    })

    const presetsDir = resolve(runtimeDir, './presets')

    let ui: object = (await import(resolveModule(`./${defaults.preset}`, { paths: presetsDir }))).default
    try {
      if (typeof preset === 'object') {
        ui = defu(preset, ui)
      } else {
        // @ts-ignore
        ui = (await import(resolveModule(`./${preset}`, { paths: presetsDir }))).default
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Could not load preset file.')
    }

    addTemplate({
      filename: 'ui.mjs',
      getContents: () => `/* @unocss-include */ export default ${JSON.stringify(ui)}`
    })

    addPlugin(resolve(runtimeDir, 'plugins', 'toast.client'))
    addPlugin(resolve(runtimeDir, 'plugins', 'clipboard.client'))

    addComponentsDir({
      path: resolve(runtimeDir, 'components', 'elements'),
      prefix,
      watch: false
    })
    addComponentsDir({
      path: resolve(runtimeDir, 'components', 'feedback'),
      prefix,
      watch: false
    })
    addComponentsDir({
      path: resolve(runtimeDir, 'components', 'forms'),
      prefix,
      watch: false
    })
    addComponentsDir({
      path: resolve(runtimeDir, 'components', 'layout'),
      prefix,
      watch: false
    })
    addComponentsDir({
      path: resolve(runtimeDir, 'components', 'navigation'),
      prefix,
      watch: false
    })
    addComponentsDir({
      path: resolve(runtimeDir, 'components', 'overlays'),
      prefix,
      watch: false
    })

    // Add composables
    nuxt.hook('autoImports:dirs', (dirs) => {
      dirs.push(resolve(runtimeDir, 'composables'))
    })
  }
})
