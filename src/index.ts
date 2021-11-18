import { resolve } from 'pathe'
import { defineNuxtModule, installModule } from '@nuxt/kit'
import presetUno, { colors } from '@unocss/preset-uno'
import presetIcons from '@unocss/preset-icons'
import type { UnocssNuxtOptions } from '@unocss/nuxt'

export default defineNuxtModule({
  async setup (_options, nuxt) {
    const options: UnocssNuxtOptions = {
      theme: {
        colors: {
          primary: colors ? colors[_options?.primary || 'indigo'] : undefined
        }
      },
      presets: [
        presetUno(),
        presetIcons({
          prefix: ''
        })
      ]
    }

    await installModule(nuxt, { src: '@unocss/nuxt', options })

    nuxt.hook('components:dirs', (dirs) => {
      // Add ./components dir to the list
      dirs.push({
        path: resolve(__dirname, '../src/components'),
        prefix: _options.prefix || 'u'
      })
    })

    nuxt.options.css.unshift('@unocss/reset/tailwind.css')
  }
})
