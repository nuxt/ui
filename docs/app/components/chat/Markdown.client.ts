import { defineMarkdownComponent } from '@comark/vue'
import highlight from '@comark/vue/plugins/highlight'

export default defineMarkdownComponent({
  name: 'ChatMarkdown',
  plugins: [
    highlight()
  ],
  class: '*:first:mt-0 *:last:mb-0'
})
