import { ref } from 'vue'
import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Collapsible from '../../../src/runtime/components/prose/Collapsible.vue'
import ja from '../../../src/runtime/locale/ja'

describe('Collapsible', () => {
  const global = { provide: { [Symbol.for('nuxt-ui.locale-context')]: ref(ja) } }

  it('orders the trigger label with the locale `label` message', async () => {
    const wrapper = await mountSuspended(Collapsible, { global })

    expect(wrapper.find('button').text()).toBe('プロパティを表示')
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('button').text()).toBe('プロパティを非表示')

    wrapper.unmount()
  })

  it('composes the label from custom `name`, `openText` and `closeText`', async () => {
    const wrapper = await mountSuspended(Collapsible, {
      props: { name: '例', openText: '開く', closeText: '閉じる' },
      global
    })

    expect(wrapper.find('button').text()).toBe('例を開く')
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('button').text()).toBe('例を閉じる')

    wrapper.unmount()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Collapsible, { global })

    expect(await axe(wrapper.element)).toHaveNoViolations()

    wrapper.unmount()
  })
})
