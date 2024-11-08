import { describe, it, expect } from 'vitest'
import InputNumber, { type InputNumberProps, type InputNumberSlots } from '../../src/runtime/components/InputNumber.vue'
import ComponentRender from '../component-render'

describe('InputNumber', () => {
  it.each([
    // Props
    ['with as', { props: { as: 'div' } }],
    ['with class', { props: { class: '' } }],
    ['with ui', { props: { ui: {} } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: InputNumberProps, slots?: Partial<InputNumberSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, InputNumber)
    expect(html).toMatchSnapshot()
  })
})
