import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Th from '../../../src/runtime/components/prose/Th.vue'

describe('Th', () => {
  it('renders a column header scope', async () => {
    const wrapper = await mountSuspended(Th)
    expect(wrapper.attributes('scope')).toBe('col')
  })

  it('lets attrs override the scope', async () => {
    const wrapper = await mountSuspended(Th, {
      attrs: { scope: 'row' }
    })
    expect(wrapper.attributes('scope')).toBe('row')
  })
})
