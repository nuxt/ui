import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Card from '../../../src/runtime/components/prose/Card.vue'

describe('Card', () => {
  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Card, {
      props: { title: 'Card' }
    })
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  it('forwards attrs to root when `to` prop is absent', async () => {
    const wrapper = await mountSuspended(Card, {
      props: { title: 'Card' },
      attrs: { 'aria-label': 'test-label', 'data-testid': 'test-id' }
    })
    expect(wrapper.attributes('aria-label')).toBe('test-label')
    expect(wrapper.attributes('data-testid')).toBe('test-id')
  })

  it('forwards attrs to link when `to` prop is set', async () => {
    const wrapper = await mountSuspended(Card, {
      props: { title: 'Card', to: 'https://github.com/benjamincanac' },
      attrs: { 'aria-label': 'test-label' }
    })
    expect(wrapper.attributes('aria-label')).toBeUndefined()
    expect(wrapper.find('a').attributes('aria-label')).toBe('test-label')
  })
})
