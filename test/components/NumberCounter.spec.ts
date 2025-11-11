import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import NumberCounter from '../../src/runtime/components/NumberCounter.vue'
import type { NumberCounterProps, NumberCounterSlots } from '../../src/runtime/components/NumberCounter.vue'
import ComponentRender from '../component-render'

describe('NumberCounter', () => {
  const props = {}

  it.each([
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: '' } }],
    ['with ui', { props: { ui: {} } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: NumberCounterProps, slots?: Partial<NumberCounterSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, NumberCounter)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(NumberCounter, {
      props
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
