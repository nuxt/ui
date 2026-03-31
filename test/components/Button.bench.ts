import { defineComponent, h } from 'vue'
import { describe, bench } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Button from '../../src/runtime/components/Button.vue'

const BUTTON_COUNT = 500

function createButtonList(props: Record<string, any>) {
  return defineComponent({
    setup() {
      return () => h('div', Array.from({ length: BUTTON_COUNT }, (_, i) =>
        h(Button, { key: i, label: `Button ${i}`, ...props })
      ))
    }
  })
}

describe('Button mount performance', () => {
  bench(`${BUTTON_COUNT} plain buttons`, async () => {
    const wrapper = await mountSuspended(createButtonList({}))
    wrapper.unmount()
  })

  bench(`${BUTTON_COUNT} link buttons`, async () => {
    const wrapper = await mountSuspended(createButtonList({ to: '/test' }))
    wrapper.unmount()
  })

  bench(`${BUTTON_COUNT} plain buttons with icon`, async () => {
    const wrapper = await mountSuspended(createButtonList({ icon: 'i-lucide-rocket' }))
    wrapper.unmount()
  })
})
