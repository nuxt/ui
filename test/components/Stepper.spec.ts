import { describe, it, expect } from 'vitest'
import Stepper, { type StepperProps, type StepperSlots } from '../../src/runtime/components/Stepper.vue'
import ComponentRender from '../component-render'

describe('Stepper', () => {
  it.each([
    // Props
    ['with as', { props: { as: 'div' } }],
    ['with class', { props: { class: '' } }],
    ['with ui', { props: { ui: {} } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: StepperProps<any>, slots?: Partial<StepperSlots<any>> }) => {
    const html = await ComponentRender(nameOrHtml, options, Stepper)
    expect(html).toMatchSnapshot()
  })
})
