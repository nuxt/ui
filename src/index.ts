import { fileURLToPath } from 'url'
import { dirname, resolve } from 'pathe'
import { defineNuxtModule, installModule, addPlugin, addComponentsDir } from '@nuxt/kit'
import { colors } from '@unocss/preset-uno'
import type { UnocssNuxtOptions } from '@unocss/nuxt'

const dir = dirname(fileURLToPath(import.meta.url))

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
        'bg-tw-white': 'bg-white dark:bg-black',
        'bg-tw-gray-50': 'bg-gray-50 dark:bg-gray-900',
        'bg-tw-gray-100': 'bg-gray-100 dark:bg-gray-800',
        'bg-tw-gray-200': 'bg-gray-200 dark:bg-gray-700',
        'bg-tw-gray-300': 'bg-gray-300 dark:bg-gray-600',
        'bg-tw-gray-400': 'bg-gray-400 dark:bg-gray-500',
        'bg-tw-gray-500': 'bg-gray-500 dark:bg-gray-400',
        'bg-tw-gray-600': 'bg-gray-600 dark:bg-gray-300',
        'bg-tw-gray-700': 'bg-gray-700 dark:bg-gray-200',
        'bg-tw-gray-800': 'bg-gray-800 dark:bg-gray-100',
        'bg-tw-gray-900': 'bg-gray-900 dark:bg-gray-50',
        'bg-tw-black': 'bg-black dark:bg-white',
        'text-tw-white': 'text-white dark:text-black',
        'text-tw-gray-50': 'text-gray-50 dark:text-gray-900',
        'text-tw-gray-100': 'text-gray-100 dark:text-gray-800',
        'text-tw-gray-200': 'text-gray-200 dark:text-gray-700',
        'text-tw-gray-300': 'text-gray-300 dark:text-gray-600',
        'text-tw-gray-400': 'text-gray-400 dark:text-gray-500',
        'text-tw-gray-500': 'text-gray-500 dark:text-gray-400',
        'text-tw-gray-600': 'text-gray-600 dark:text-gray-300',
        'text-tw-gray-700': 'text-gray-700 dark:text-gray-200',
        'text-tw-gray-800': 'text-gray-800 dark:text-gray-100',
        'text-tw-gray-900': 'text-gray-900 dark:text-gray-50',
        'text-tw-black': 'text-black dark:text-white',
        'border-tw-gray-100': 'border-gray-100 dark:border-gray-900',
        'border-tw-gray-200': 'border-gray-200 dark:border-gray-800',
        'border-tw-gray-300': 'border-gray-300 dark:border-gray-700',
        'border-tw-gray-400': 'border-gray-400 dark:border-gray-600',
        'border-tw-gray-500': 'border-gray-500 dark:border-gray-500',
        'border-tw-gray-600': 'border-gray-600 dark:border-gray-400',
        'border-tw-gray-700': 'border-gray-700 dark:border-gray-300',
        'border-tw-gray-800': 'border-gray-800 dark:border-gray-200',
        'border-tw-gray-900': 'border-gray-900 dark:border-gray-100',
        'divide-tw-gray-100': 'divide-gray-100 dark:divide-gray-900',
        'divide-tw-gray-200': 'divide-gray-200 dark:divide-gray-800',
        'divide-tw-gray-300': 'divide-gray-300 dark:divide-gray-700',
        'divide-tw-gray-400': 'divide-gray-400 dark:divide-gray-600',
        'divide-tw-gray-500': 'divide-gray-500 dark:divide-gray-500',
        'divide-tw-gray-600': 'divide-gray-600 dark:divide-gray-400',
        'divide-tw-gray-700': 'divide-gray-700 dark:divide-gray-300',
        'divide-tw-gray-800': 'divide-gray-800 dark:divide-gray-200',
        'divide-tw-gray-900': 'divide-gray-900 dark:divide-gray-100',
        'ring-tw-gray-100': 'ring-gray-100 dark:ring-gray-900',
        'ring-tw-gray-200': 'ring-gray-200 dark:ring-gray-800',
        'ring-tw-gray-300': 'ring-gray-300 dark:ring-gray-700',
        'ring-tw-gray-400': 'ring-gray-400 dark:ring-gray-600',
        'ring-tw-gray-500': 'ring-gray-500 dark:ring-gray-500',
        'ring-tw-gray-600': 'ring-gray-600 dark:ring-gray-400',
        'ring-tw-gray-700': 'ring-gray-700 dark:ring-gray-300',
        'ring-tw-gray-800': 'ring-gray-800 dark:ring-gray-200',
        'ring-tw-gray-900': 'ring-gray-900 dark:ring-gray-100',
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

    await installModule(nuxt, { src: '@vueuse/core/nuxt' })
    await installModule(nuxt, { src: '@unocss/nuxt', options })

    addPlugin(resolve(dir, './runtime/plugin'))

    addComponentsDir({
      path: resolve(dir, './components/elements'),
      prefix,
      watch: false
    })
    addComponentsDir({
      path: resolve(dir, './components/feedback'),
      prefix,
      watch: false
    })
    addComponentsDir({
      path: resolve(dir, './components/forms'),
      prefix,
      watch: false
    })
    addComponentsDir({
      path: resolve(dir, './components/layout'),
      prefix,
      watch: false
    })
    addComponentsDir({
      path: resolve(dir, './components/navigation'),
      prefix,
      watch: false
    })
    addComponentsDir({
      path: resolve(dir, './components/overlays'),
      prefix,
      watch: false
    })

    nuxt.options.build.transpile.push('@popperjs/core', '@headlessui/vue', '@vueuse/core', '@nuxthq/ui')
  }
})

declare module '@nuxt/schema' {
  interface NuxtConfig {
    ui?: UiOptions
  }
}
