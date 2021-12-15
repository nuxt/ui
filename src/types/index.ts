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
   * @default 'tailwindui'
   */
  preset?: string | object

  /**
   * @default 'u'
   */
  prefix?: string

  colors?: UiColorsOptions

  unocss?: UnocssNuxtOptions
}

export * from './toast'
