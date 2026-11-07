import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Th from '../../../src/runtime/components/prose/Th.vue'

describe('Th', () => {
  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Th, {
      slots: { default: () => 'Header' }
    })
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  it('sets `scope="col"` by default', async () => {
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
