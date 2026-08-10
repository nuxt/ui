import { defineMarkdownComponent } from '@comark/vue'
import shiki from '@comark/vue/plugins/shiki'

export default defineMarkdownComponent({
  name: 'ChatMarkdown',
  plugins: [
    shiki()
  ],
  class: '*:first:mt-0 *:last:mb-0'
})
