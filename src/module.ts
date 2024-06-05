import { defu } from 'defu'
import { createResolver, defineNuxtModule, addComponentsDir, addImportsDir, addVitePlugin, addPlugin, installModule } from '@nuxt/kit'
import tailwindcss from '@tailwindcss/vite'
import { addTemplates } from './templates'
import icons from './theme/icons'

export interface ModuleOptions {
  /**
   * Prefix for components
   * @defaultValue U
   */
  prefix?: string
  /**
   * Colors to generate classes for (based on TailwindCSS colors)
   * @defaultValue ['primary', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchia', 'pink', 'rose']
   */
  colors?: string[]
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'ui',
    configKey: 'ui',
    compatibility: {
      nuxt: '^3.10.0'
    }
  },
  defaults: {
    prefix: 'U',
    colors: undefined
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    options.colors = options.colors?.length ? ['primary', ...options.colors] : ['primary', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchia', 'pink', 'rose']

    nuxt.options.ui = options

    nuxt.options.alias['#ui'] = resolve('./runtime')

    nuxt.options.appConfig.ui = defu(nuxt.options.appConfig.ui || {}, {
      primary: 'green',
      gray: 'cool',
      icons
    })

    // nuxt.options.postcss = nuxt.options.postcss || {}
    // nuxt.options.postcss.plugins = nuxt.options.postcss.plugins || {}
    // nuxt.options.postcss.plugins['@tailwindcss/postcss'] = {}

    addVitePlugin(tailwindcss)

    await installModule('nuxt-icon', {
      componentName: 'UIcon',
      cssLayer: 'components'
    })
    // await installModule('@nuxtjs/color-mode', { classSuffix: '' })

    addPlugin({
      src: resolve('./runtime/plugins/colors')
    })
    addPlugin({
      src: resolve('./runtime/plugins/modal')
    })

    addComponentsDir({
      path: resolve('./runtime/components'),
      prefix: options.prefix,
      pathPrefix: false
    })

    addImportsDir(resolve('./runtime/composables'))

    addTemplates(options, nuxt)
  }
})
