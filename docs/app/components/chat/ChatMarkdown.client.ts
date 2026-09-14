import { defineMarkdownComponent } from '@comark/vue'
import shiki from '@comark/vue/plugins/shiki'
import security from '@comark/vue/plugins/security'
import { SHIKI_OPTIONS } from '../../utils/markdown'

export default defineMarkdownComponent({
  name: 'ChatMarkdown',
  plugins: [
    shiki(SHIKI_OPTIONS),
    security({ blockedTags: ['script', 'style', 'iframe', 'object', 'embed', 'form'] })
  ],
  class: '*:first:mt-0 *:last:mb-0'
})
