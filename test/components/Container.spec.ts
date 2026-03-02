import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import Container from '../../src/runtime/components/Container.vue'

describe('Container', () => {
  renderEach(Container, [
    // Props
    ['with as', { props: { as: 'article' } }],
    ['with class', { props: { class: 'max-w-5xl' } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Container)

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
