import { describe, it, expect } from 'vitest'
import Stepper, { type StepperProps, type StepperSlots } from '../../src/runtime/components/Stepper.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/stepper'

describe('Stepper', () => {
  const sizes = Object.keys(theme.variants.size) as any

  const items = [
    {
      title: 'Address',
      description: 'Add your address here',
      icon: 'i-lucide-house'
    }, {
      title: 'Shipping',
      description: 'Set your preferred shipping method',
      icon: 'i-lucide-truck'
    }, {
      slot: 'custom',
      title: 'Checkout',
      description: 'Confirm your order'
    }
  ]

  const props = { items }

  it.each([
    // Props
    ['with items', { props }],
    ['with defaultValue', { props: { ...props, defaultValue: 1 } }],
    ['with modelValue', { props: { ...props, modelValue: 1 } }],
    ['with neutral color', { props: { ...props, color: 'neutral' } }],
    ...sizes.map((size: string) => [`with size ${size} horizontal`, { props: { ...props, size } }]),
    ...sizes.map((size: string) => [`with size ${size} vertical`, { props: { ...props, size, orientation: 'vertical' } }]),
    ['without linear', { props: { ...props, linear: false } }],
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'gap-8' } }],
    ['with ui', { props: { ...props, ui: { title: 'font-bold' } } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }],
    ['with indicator slot', { props, slots: { indicator: () => 'Indicator slot' } }],
    ['with title slot', { props, slots: { title: () => 'Title slot' } }],
    ['with description slot', { props, slots: { description: () => 'Description slot' } }],
    ['with content slot', { props, slots: { content: () => 'Content slot' } }],
    ['with custom slot', { props, slots: { custom: () => 'Custom slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: StepperProps<any>, slots?: Partial<StepperSlots<any>> }) => {
    const html = await ComponentRender(nameOrHtml, options, Stepper)
    expect(html).toMatchSnapshot()
  })
})
