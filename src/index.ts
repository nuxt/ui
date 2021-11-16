import { join } from 'pathe'
import { defineNuxtModule, installModule } from '@nuxt/kit'
import { colors } from '@unocss/preset-uno'

export default defineNuxtModule({
  name: '@nuxthq/ui',
  configKey: 'ui',
  async setup (_options, nuxt) {
    const _prefix = _options?.prefix || 'u'
    const _primary = _options?.primary || 'indigo'

    const options = {
      // eslint-disable-next-line no-useless-escape
      exclude: [/[\/\\]dist[\/\\]/, /\.(css|postcss|sass|scss|less|stylus|styl)$/],
      theme: {
        colors: {
          primary: typeof _primary === 'object' ? _primary : (colors && colors[_primary])
        }
      },
      preflight: true,
      icons: {
        prefix: ''
      },
      shortcuts: {
        'bg-tw-white': 'bg-white dark:bg-gray-900',
        'bg-tw-gray-50': 'bg-gray-50 dark:bg-gray-800',
        'bg-tw-gray-100': 'bg-gray-100 dark:bg-gray-700',
        'bg-tw-gray-200': 'bg-gray-200 dark:bg-gray-600',
        'bg-tw-gray-300': 'bg-gray-300 dark:bg-gray-500',
        'bg-tw-gray-400': 'bg-gray-400 dark:bg-gray-400',
        'bg-tw-gray-500': 'bg-gray-500 dark:bg-gray-300',
        'bg-tw-gray-600': 'bg-gray-600 dark:bg-gray-200',
        'bg-tw-gray-700': 'bg-gray-700 dark:bg-gray-100',
        'bg-tw-gray-800': 'bg-gray-800 dark:bg-gray-50',
        'bg-tw-gray-900': 'bg-gray-900 dark:bg-white',
        'text-tw-white': 'text-white dark:text-gray-900',
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
        // TailwindCSS `maxWidth` aliases
        'max-w-0': 'max-w-0rem',
        'max-w-none': 'max-w-none',
        'max-w-xs': 'max-w-20rem',
        'max-w-sm': 'max-w-24rem',
        'max-w-md': 'max-w-28rem',
        'max-w-lg': 'max-w-32rem',
        'max-w-xl': 'max-w-36rem',
        'max-w-2xl': 'max-w-42rem',
        'max-w-3xl': 'max-w-48rem',
        'max-w-4xl': 'max-w-56rem',
        'max-w-5xl': 'max-w-64rem',
        'max-w-6xl': 'max-w-72rem',
        'max-w-7xl': 'max-w-80rem'
      }
    }

    await installModule(nuxt, { src: '@unocss/nuxt', options })

    nuxt.hook('components:dirs', (dirs) => {
      dirs.push({
        path: join(__dirname, 'components/elements'),
        prefix: _prefix
      })
      dirs.push({
        path: join(__dirname, 'components/feedback'),
        prefix: _prefix
      })
      dirs.push({
        path: join(__dirname, 'components/forms'),
        prefix: _prefix
      })
      dirs.push({
        path: join(__dirname, 'components/layout'),
        prefix: _prefix
      })
      dirs.push({
        path: join(__dirname, 'components/navigation'),
        prefix: _prefix
      })
      dirs.push({
        path: join(__dirname, 'components/overlays'),
        prefix: _prefix
      })
    })
  }
})
