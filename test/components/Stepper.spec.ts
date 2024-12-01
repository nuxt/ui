import { describe, it, expect } from 'vitest'
import Stepper, { type StepperProps, type StepperSlots } from '../../src/runtime/components/Stepper.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/stepper'

const items = [
  {
    slot: 'address',
    title: 'Address',
    description: 'Add your address here',
    icon: 'i-lucide-house'
  }, {
    slot: 'shipping',
    title: 'Shipping',
    description: 'Set your preferred shipping method',
    icon: 'i-lucide-truck'
  }, {
    slot: 'checkout',
    title: 'Checkout',
    description: 'Confirm your order'
  }
]

describe('Stepper', () => {
  const sizes = Object.keys(theme.variants.size) as any

  it.each([
    // Props
    ['with as', { props: { as: 'div', items } }],
    ['with class', { props: { class: '', items } }],
    ['with ui', { props: { ui: {}, items } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size, items } }]),
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size, items, orientation: 'vertical' } }]),
    // Slots
    ['with default slot', { props: { items }, slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: StepperProps<any>, slots?: Partial<StepperSlots<any>> }) => {
    const html = await ComponentRender(nameOrHtml, options, Stepper)
    expect(html).toMatchSnapshot()
  })
})
