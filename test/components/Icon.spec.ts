import { describe, it, expect } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { addIcon } from '@iconify/vue'
import Icon from '../../src/runtime/vue/components/Icon.vue'

describe('Icon', () => {
  it('renders a bundled icon during SSR', async () => {
    addIcon('lucide:rocket', { body: '<path d="M0 0h24v24H0z"/>' })

    const html = await renderToString(createSSRApp({ render: () => h(Icon, { name: 'i-lucide-rocket', mode: 'svg' }) }))

    expect(html).toContain('<path d="M0 0h24v24H0z"/>')
  })
})
