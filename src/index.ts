import { join } from 'pathe'
import { defineNuxtModule, installModule } from '@nuxt/kit'
import presetUno, { colors } from '@unocss/preset-uno'
import presetIcons from '@unocss/preset-icons'

export default defineNuxtModule({
  async setup (_options, nuxt) {
    const options = {
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
        path: join(__dirname, 'components'),
        prefix: _options.prefix || 'u'
      })
    })

    nuxt.options.css.unshift('@unocss/reset/tailwind.css')
  }
})
