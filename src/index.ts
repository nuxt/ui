import { resolve } from 'pathe'
import { defineNuxtModule, installModule, addComponentsDir } from '@nuxt/kit'
import { colors } from '@unocss/preset-uno'
import type { UnocssNuxtOptions } from '@unocss/nuxt'

export interface UiColorsOptions {
  /**
   * @default 'indigo'
   */
  primary?: string

  /**
   * @default 'zinc'
   */
  gray?: string
}

export interface UiOptions {
  /**
   * Prefix of injected components.
   *
   * @default 'u'
   */
  prefix?: string

  colors?: UiColorsOptions

  unocss?: UnocssNuxtOptions
}

export default defineNuxtModule<UiOptions>({
  name: '@nuxthq/ui',
  configKey: 'ui',
  defaults: {
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
  },
  async setup (_options, nuxt) {
    const { prefix, colors: { primary = 'indigo', gray = 'zinc' } = {} } = _options
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
        [`${prefix}-bg-white`]: 'bg-white dark:bg-black',
        [`${prefix}-bg-gray-50`]: 'bg-gray-50 dark:bg-gray-900',
        [`${prefix}-bg-gray-100`]: 'bg-gray-100 dark:bg-gray-800',
        [`${prefix}-bg-gray-200`]: 'bg-gray-200 dark:bg-gray-700',
        [`${prefix}-bg-gray-300`]: 'bg-gray-300 dark:bg-gray-600',
        [`${prefix}-bg-gray-400`]: 'bg-gray-400 dark:bg-gray-500',
        [`${prefix}-bg-gray-500`]: 'bg-gray-500 dark:bg-gray-400',
        [`${prefix}-bg-gray-600`]: 'bg-gray-600 dark:bg-gray-300',
        [`${prefix}-bg-gray-700`]: 'bg-gray-700 dark:bg-gray-200',
        [`${prefix}-bg-gray-800`]: 'bg-gray-800 dark:bg-gray-100',
        [`${prefix}-bg-gray-900`]: 'bg-gray-900 dark:bg-gray-50',
        [`${prefix}-bg-black`]: 'bg-black dark:bg-white',
        [`${prefix}-text-white`]: 'text-white dark:text-black',
        [`${prefix}-text-gray-50`]: 'text-gray-50 dark:text-gray-900',
        [`${prefix}-text-gray-100`]: 'text-gray-100 dark:text-gray-800',
        [`${prefix}-text-gray-200`]: 'text-gray-200 dark:text-gray-700',
        [`${prefix}-text-gray-300`]: 'text-gray-300 dark:text-gray-600',
        [`${prefix}-text-gray-400`]: 'text-gray-400 dark:text-gray-500',
        [`${prefix}-text-gray-500`]: 'text-gray-500 dark:text-gray-400',
        [`${prefix}-text-gray-600`]: 'text-gray-600 dark:text-gray-300',
        [`${prefix}-text-gray-700`]: 'text-gray-700 dark:text-gray-200',
        [`${prefix}-text-gray-800`]: 'text-gray-800 dark:text-gray-100',
        [`${prefix}-text-gray-900`]: 'text-gray-900 dark:text-gray-50',
        [`${prefix}-text-black`]: 'text-black dark:text-white',
        [`${prefix}-border-white`]: 'border-white dark:border-black',
        [`${prefix}-border-gray-100`]: 'border-gray-100 dark:border-gray-900',
        [`${prefix}-border-gray-200`]: 'border-gray-200 dark:border-gray-800',
        [`${prefix}-border-gray-300`]: 'border-gray-300 dark:border-gray-700',
        [`${prefix}-border-gray-400`]: 'border-gray-400 dark:border-gray-600',
        [`${prefix}-border-gray-500`]: 'border-gray-500 dark:border-gray-500',
        [`${prefix}-border-gray-600`]: 'border-gray-600 dark:border-gray-400',
        [`${prefix}-border-gray-700`]: 'border-gray-700 dark:border-gray-300',
        [`${prefix}-border-gray-800`]: 'border-gray-800 dark:border-gray-200',
        [`${prefix}-border-gray-900`]: 'border-gray-900 dark:border-gray-100',
        [`${prefix}-border-black`]: 'border-black dark:border-white',
        [`${prefix}-divide-white`]: 'divide-white dark:divide-black',
        [`${prefix}-divide-gray-100`]: 'divide-gray-100 dark:divide-gray-900',
        [`${prefix}-divide-gray-200`]: 'divide-gray-200 dark:divide-gray-800',
        [`${prefix}-divide-gray-300`]: 'divide-gray-300 dark:divide-gray-700',
        [`${prefix}-divide-gray-400`]: 'divide-gray-400 dark:divide-gray-600',
        [`${prefix}-divide-gray-500`]: 'divide-gray-500 dark:divide-gray-500',
        [`${prefix}-divide-gray-600`]: 'divide-gray-600 dark:divide-gray-400',
        [`${prefix}-divide-gray-700`]: 'divide-gray-700 dark:divide-gray-300',
        [`${prefix}-divide-gray-800`]: 'divide-gray-800 dark:divide-gray-200',
        [`${prefix}-divide-gray-900`]: 'divide-gray-900 dark:divide-gray-100',
        [`${prefix}-divide-black`]: 'divide-black dark:divide-white',
        [`${prefix}-ring-white`]: 'ring-white dark:ring-black',
        [`${prefix}-ring-gray-100`]: 'ring-gray-100 dark:ring-gray-900',
        [`${prefix}-ring-gray-200`]: 'ring-gray-200 dark:ring-gray-800',
        [`${prefix}-ring-gray-300`]: 'ring-gray-300 dark:ring-gray-700',
        [`${prefix}-ring-gray-400`]: 'ring-gray-400 dark:ring-gray-600',
        [`${prefix}-ring-gray-500`]: 'ring-gray-500 dark:ring-gray-500',
        [`${prefix}-ring-gray-600`]: 'ring-gray-600 dark:ring-gray-400',
        [`${prefix}-ring-gray-700`]: 'ring-gray-700 dark:ring-gray-300',
        [`${prefix}-ring-gray-800`]: 'ring-gray-800 dark:ring-gray-200',
        [`${prefix}-ring-gray-900`]: 'ring-gray-900 dark:ring-gray-100',
        [`${prefix}-ring-black`]: 'ring-black dark:ring-white',
        ...shortcuts
      },
      rules: [
        [/^shadow-?(.*)$/, ([, d], { theme }) => {
          // @ts-ignore
          const value = theme?.boxShadow?.[d || 'DEFAULT']
          if (value) {
            return {
              '--un-shadow-color': '0,0,0',
              '--un-shadow': value,
              'box-shadow': 'var(--un-shadow)'
            }
          }
        }],
        ...rules
      ],
      variants
    }

    await installModule(nuxt, { src: '@unocss/nuxt', options })

    addComponentsDir({
      path: resolve(__dirname, './components/elements'),
      prefix,
      watch: false
    })
    addComponentsDir({
      path: resolve(__dirname, './components/feedback'),
      prefix,
      watch: false
    })
    addComponentsDir({
      path: resolve(__dirname, './components/forms'),
      prefix,
      watch: false
    })
    addComponentsDir({
      path: resolve(__dirname, './components/layout'),
      prefix,
      watch: false
    })
    addComponentsDir({
      path: resolve(__dirname, './components/navigation'),
      prefix,
      watch: false
    })
    addComponentsDir({
      path: resolve(__dirname, './components/overlays'),
      prefix,
      watch: false
    })

    nuxt.options.build.transpile.push('@popperjs/core')
  }
})

declare module '@nuxt/schema' {
  interface NuxtConfig {
    ui?: UiOptions
  }
}
