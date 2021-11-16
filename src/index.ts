import { join } from 'pathe'
import { defineNuxtModule, installModule } from '@nuxt/kit'
import presetUno, { colors } from '@unocss/preset-uno'
import presetIcons from '@unocss/preset-icons'

export default defineNuxtModule({
  async setup (_options, nuxt) {
    const _primary = _options?.primary || 'indigo'

    const options = {
      theme: {
        colors: {
          primary: typeof _primary === 'object' ? _primary : (colors && colors[_primary])
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
