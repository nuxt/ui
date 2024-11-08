import { describe, it, expect } from 'vitest'
import PinInput, { type PinInputProps, type PinInputSlots } from '../../src/runtime/components/PinInput.vue'
import ComponentRender from '../component-render'

describe('PinInput', () => {
  it.each([
    // Props
    ['with as', { props: { as: 'div' } }],
    ['with class', { props: { class: '' } }],
    ['with ui', { props: { ui: {} } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: PinInputProps, slots?: Partial<PinInputSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, PinInput)
    expect(html).toMatchSnapshot()
  })
})
