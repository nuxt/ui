import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Callout from '../../../src/runtime/components/prose/Callout.vue'

describe('Callout', () => {
  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Callout, {
      props: {}
    })
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  it('forwards attrs to root when `to` prop is absent', async () => {
    const wrapper = await mountSuspended(Callout, {
      props: {},
      attrs: { 'aria-label': 'test-label', 'data-testid': 'test-id' }
    })
    expect(wrapper.attributes('aria-label')).toBe('test-label')
    expect(wrapper.attributes('data-testid')).toBe('test-id')
  })

  it('forwards attrs to link when `to` prop is set', async () => {
    const wrapper = await mountSuspended(Callout, {
      props: { to: 'https://github.com/benjamincanac' },
      attrs: { 'aria-label': 'test-label' }
    })
    expect(wrapper.attributes('aria-label')).toBeUndefined()
    expect(wrapper.find('a').attributes('aria-label')).toBe('test-label')
  })
})
