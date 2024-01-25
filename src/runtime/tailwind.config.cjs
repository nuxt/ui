const { resolve } = require('path')
const { defaultExtractor: createDefaultExtractor } = require('tailwindcss/lib/lib/defaultExtractor.js')
const { customSafelistExtractor } = require('<%= options.runtimeDir %>/utils/colors')
const { iconsPlugin, getIconCollections } = require('@egoist/tailwindcss-icons')

const defaultExtractor = createDefaultExtractor({ tailwindConfig: { separator: ':' } })

const optionsIcon = <%= JSON.stringify(options.icons) %>
const iconsPluginParam = Array.isArray(optionsIcon) ? { collections: getIconCollections(optionsIcon) } : typeof optionsIcon === 'object' ? optionsIcon : {}

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/forms')({ strategy: 'class' }),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
    require('@headlessui/tailwindcss'),
    iconsPlugin(iconsPluginParam)
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
          ...customSafelistExtractor('<%= options.prefix %>', content, <%= JSON.stringify(nuxt.options.appConfig.ui.colors) %>, <%= JSON.stringify(options.safelistColors) %>)
        ]
      }
    }
  }
}
