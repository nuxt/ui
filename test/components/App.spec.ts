import { defineComponent, h } from 'vue'
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useId } from 'reka-ui'
import App from '../../src/runtime/components/App.vue'

const IdConsumer = defineComponent({
  setup() {
    const id = useId()
    return () => h('div', { id, 'data-testid': 'consumer' })
  }
})

describe('App', () => {
  it('defaults to Vue useId for Reka UI primitives', async () => {
    const wrapper = await mountSuspended(App, {
      slots: { default: () => h(IdConsumer) }
    })

    expect(wrapper.find('[data-testid="consumer"]').attributes('id')).toMatch(/^reka-v-?\d/)
  })

  it('forwards the useId prop to Reka UI primitives', async () => {
    let count = 0
    const wrapper = await mountSuspended(App, {
      props: { useId: () => `custom-${++count}` },
      slots: { default: () => h(IdConsumer) }
    })

    expect(wrapper.find('[data-testid="consumer"]').attributes('id')).toBe('reka-custom-1')
  })
})
