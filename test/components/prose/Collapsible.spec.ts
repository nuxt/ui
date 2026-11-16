import { ref } from 'vue'
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Collapsible from '../../../src/runtime/components/prose/Collapsible.vue'
import ja from '../../../src/runtime/locale/ja'

describe('Collapsible', () => {
  it('orders the trigger label with the locale `label` message', async () => {
    const wrapper = await mountSuspended(Collapsible, {
      global: { provide: { [Symbol.for('nuxt-ui.locale-context')]: ref(ja) } }
    })

    expect(wrapper.find('button').text()).toBe('プロパティを表示')

    wrapper.unmount()
  })
})
