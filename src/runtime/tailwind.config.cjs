const { resolve } = require('path')
const { defaultExtractor: createDefaultExtractor } = require('tailwindcss/lib/lib/defaultExtractor.js')

const defaultExtractor = createDefaultExtractor({ tailwindConfig: { separator: ':' } })

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/forms')({ strategy: 'class' }),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
    require('@headlessui/tailwindcss')
  ],
  content: {
    files: [
      resolve('<%= options.runtimeDir %>', 'components/**/*.{vue,mjs,ts}'),
      resolve('<%= options.runtimeDir %>', 'ui.config/**/*.{mjs,js,ts}')
    ],
    transform: {
      vue: (content) => {
        return content.replaceAll(/(?:\r\n|\r|\n)/g, ' ')
      }
    },
    extract: {
      vue: (content) => {
        return [
          ...defaultExtractor(content),
          // ...customSafelistExtractor(options.prefix, content, nuxt.options.appConfig.ui.colors, options.safelistColors)
        ]
      }
    }
  }
}
