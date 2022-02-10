import { resolve } from 'pathe'
import { defineNuxtModule, installModule, addComponentsDir, addTemplate, addPlugin, resolveModule } from '@nuxt/kit'
import { colors } from '@unocss/preset-mini'
import defu from 'defu'
import type { UnocssNuxtOptions } from '@unocss/nuxt'

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

  unocss?: UnocssNuxtOptions
}

const defaults = {
  preset: 'default',
  prefix: 'u',
  colors: {
    primary: 'indigo',
    gray: 'zinc'
  },
  unocss: {
    shortcuts: [],
    rules: [],
    variants: [],
    theme: {}
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nuxthq/ui',
    configKey: 'ui',
    compatibility: {
      nuxt: '^3.0.0',
      bridge: true
    }
  },
  defaults,
  async setup (_options, nuxt) {
    const { preset, prefix, colors: { primary = 'indigo', gray = 'zinc' } = {} } = _options
    const { shortcuts = [], rules = [], variants = [], theme = {} } = _options.unocss || {}

    const options: UnocssNuxtOptions = {
      theme: {
        colors: {
          gray: typeof gray === 'object' ? gray : (colors && colors[gray]),
          primary: typeof primary === 'object' ? primary : (colors && colors[primary])
        },
        ...theme
      },
      preflight: true,
      icons: {
        prefix: ''
      },
      shortcuts: {

        ...shortcuts
      },
      rules: [
        // [/^shadow-?(.*)$/, ([, d], { theme }) => {
        //   // @ts-ignore
        //   const value = theme?.boxShadow?.[d || 'DEFAULT']
        //   if (value) {
        //     return {
        //       '--un-shadow-color': '0,0,0',
        //       '--un-shadow': value,
        //       'box-shadow': 'var(--un-shadow)'
        //     }
        //   }
        // }],
        ...rules
      ],
      variants,
      layers: {
        icons: 0,
        default: 1,
        shortcuts: 2
      }
    }
    await installModule('@nuxtjs/tailwindcss', {
      viewer: false,
      config: {
        theme: {
          extend: {
            colors: {
              gray: typeof gray === 'object' ? gray : (colors && colors[gray]),
              primary: typeof primary === 'object' ? primary : (colors && colors[primary])
            },
            ...theme
          }
        },
        plugins: [
          require('@tailwindcss/forms'),
          require('@tailwindcss/line-clamp'),
          require('@tailwindcss/aspect-ratio')
        ]
      }
    })

    // Transpile runtime
    const runtimeDir = resolve(__dirname, './runtime')
    nuxt.options.build.transpile.push(runtimeDir)
    nuxt.options.build.transpile.push('@popperjs/core', '@headlessui/vue')

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

    // Add CSS
    nuxt.options.css.push(resolve(runtimeDir, 'css', 'shortcuts.css'))
  }
})
