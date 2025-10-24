import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import InputTime from '../../src/runtime/components/InputTime.vue'
import type { InputTimeProps, InputTimeSlots } from '../../src/runtime/components/InputTime.vue'
import ComponentRender from '../component-render'

describe('InputTime', () => {
  const props = {}

  it.each([
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: '' } }],
    ['with ui', { props: { ui: {} } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: InputTimeProps, slots?: Partial<InputTimeSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, InputTime)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(InputTime, {
      props
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
