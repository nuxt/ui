// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mountSuspended } from 'nuxt-vitest/utils'
import Button from '../../src/runtime/components/elements/Button.vue'

describe.only('Button', () => {
  it.each([
    [ 'basic case', { slots: { default: () => 'hello' } } ],
    [ 'leading icon', { props: { leading: true, icon: 'heroicons-check' }, slots: { default: () => 'leading icon' } } ],
  ])('renders %s correctly', async (_, options) => {
    const component = await mountSuspended(Button, options)
    expect(component.html()).toMatchSnapshot()
  })
})
