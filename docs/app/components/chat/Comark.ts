import highlight from '@comark/nuxt/plugins/highlight'
import html from '@shikijs/langs/html'
import css from '@shikijs/langs/css'

export default defineComarkComponent({
  name: 'ChatComark',
  plugins: [
    highlight({
      languages: [html, css]
    })
  ],
  class: '*:first:mt-0 *:last:mb-0'
})
