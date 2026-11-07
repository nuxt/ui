import { test } from 'vitest'
import { defineComponent, h } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useComponentProps } from '../../src/runtime/composables/useComponentProps'

const Probe = defineComponent({
  props: { size: String, color: String },
  setup(rawProps) {
    const props = useComponentProps('button', rawProps)
    return { props }
  },
  render: () => h('i')
})

// A single read is far below CodSpeed's noise floor, so each iteration repeats it.
const READS = 1000

test('useComponentProps prop reads', async ({ bench }) => {
  const props = (await mountSuspended(Probe, { props: { size: 'md' } }) as any).setupState.props

  await bench(`passed + unset prop x${READS}`, () => {
    for (let i = 0; i < READS; i++) {
      void props.size
      void props.color
    }
  }).run()
})
