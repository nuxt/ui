import { ref } from 'vue'
import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CodeCollapse from '../../../src/runtime/components/prose/CodeCollapse.vue'
import ja from '../../../src/runtime/locale/ja'

describe('CodeCollapse', () => {
  const global = { provide: { [Symbol.for('nuxt-ui.locale-context')]: ref(ja) } }

  it('orders the trigger label with the locale `label` message', async () => {
    const wrapper = await mountSuspended(CodeCollapse, { global })

    expect(wrapper.find('button').text()).toBe('コードを展開')
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('button').text()).toBe('コードを折りたたむ')

    wrapper.unmount()
  })

  it('composes the label from custom `name`, `openText` and `closeText`', async () => {
    const wrapper = await mountSuspended(CodeCollapse, {
      props: { name: '例', openText: '開く', closeText: '閉じる' },
      global
    })

    expect(wrapper.find('button').text()).toBe('例を開く')
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('button').text()).toBe('例を閉じる')

    wrapper.unmount()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(CodeCollapse, { global })

    expect(await axe(wrapper.element)).toHaveNoViolations()

    wrapper.unmount()
  })
})
