import { describe, it, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import InputNumber, { type InputNumberProps, type InputNumberSlots } from '../../src/runtime/components/InputNumber.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/input-number'

describe('InputNumber', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const variants = Object.keys(theme.variants.variant) as any

  it.each([
    // Props
    ['with class', { props: { class: 'absolute' } }],
    ['with ui', { props: { ui: { base: 'rounded-full' } } }],
    ['with name', { props: { name: 'name' } }],
    ['with placeholder', { props: { placeholder: 'Number...' } }],
    ['with disabled', { props: { disabled: true } }],
    ['with required', { props: { required: true } }],
    ['with orientation vertical', { props: { orientation: 'vertical' } }],
    ['with incrementIcon', { props: { incrementIcon: 'i-lucide-arrow-left' } }],
    ['with decrementIcon', { props: { decrementIcon: 'i-lucide-arrow-right' } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ...variants.map((variant: string) => [`with primary variant ${variant}`, { props: { variant } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant}`, { props: { variant, color: 'neutral' } }]),
    // Slots
    ['with increment slot', { slots: { increment: () => '+' } }],
    ['with decrement slot', { slots: { decrement: () => '-' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: InputNumberProps, slots?: Partial<InputNumberSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, InputNumber)
    expect(html).toMatchSnapshot()
  })

  describe('emits', () => {
    test.todo('update:modelValue event', async () => {
      const _wrapper = mount(InputNumber)
    })

    test.todo('change event', async () => {
      const _wrapper = mount(InputNumber)
    })

    test.todo('blur event', async () => {
      const _wrapper = mount(InputNumber)
    })
  })

  describe('controls', async () => {
    test.todo('increment', async () => {
      const _wrapper = mount(InputNumber)
    })

    test.todo('decrement', async () => {
      const _wrapper = mount(InputNumber)
    })
  })

  describe('form integration', async () => {
    test.todo('validate on blur works', async () => {

    })

    test.todo('validate on change works', async () => {

    })
  })
})
