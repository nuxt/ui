import { bench, describe } from 'vitest'
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

describe('useComponentProps prop reads', () => {
  let props: Record<string, any> | undefined

  // Mounted lazily: CodSpeed's analysis runner invokes the bench function
  // without tinybench's `setup`/`teardown` options.
  bench(`passed + unset prop x${READS}`, async () => {
    props ??= (await mountSuspended(Probe, { props: { size: 'md' } }) as any).setupState.props
    for (let i = 0; i < READS; i++) {
      void props!.size
      void props!.color
    }
  })
})
