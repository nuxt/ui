import { ref } from 'vue'
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CodeCollapse from '../../../src/runtime/components/prose/CodeCollapse.vue'
import ja from '../../../src/runtime/locale/ja'

describe('CodeCollapse', () => {
  it('orders the trigger label with the locale `label` message', async () => {
    const wrapper = await mountSuspended(CodeCollapse, {
      global: { provide: { [Symbol.for('nuxt-ui.locale-context')]: ref(ja) } }
    })

    expect(wrapper.find('button').text()).toBe('コードを展開')

    wrapper.unmount()
  })
})
