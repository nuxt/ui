import { describe, it, expect, test } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import InputNumber, { type InputNumberProps, type InputNumberSlots } from '../../src/runtime/components/InputNumber.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/input-number'
import type { FormInputEvents } from '~/src/module'
import { renderForm } from '../utils/form'

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
    test('update:modelValue event', async () => {
      const wrapper = mount(InputNumber)
      await wrapper.setValue(1)
      expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [[1]] })
    })

    test('change event', async () => {
      const wrapper = mount(InputNumber)
      const input = wrapper.findComponent({ name: 'NumberFieldRoot' })
      await input.setValue(1)
      expect(wrapper.emitted()).toMatchObject({ change: [[{ type: 'change' }]] })
    })

    test('blur event', async () => {
      const wrapper = mount(InputNumber)
      const input = wrapper.findComponent({ name: 'NumberFieldInput' })
      await input.trigger('blur')
      expect(wrapper.emitted()).toMatchObject({ blur: [[{ type: 'blur' }]] })
    })
  })

  describe('controls', async () => {
    test.todo('increment', async () => {
      const wrapper = mount(InputNumber, { props: {
        'modelValue': 100,
        'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e })
      } })
      const increment = wrapper.findComponent({ name: 'NumberFieldIncrement' })
      await increment.find('button').trigger('click')

      await flushPromises()
      expect(wrapper.props('modelValue')).toBe(101)
    })

    test.todo('decrement', async () => {
      const wrapper = mount(InputNumber, { props: {
        'modelValue': 100,
        'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e })
      } })
      const increment = wrapper.findComponent({ name: 'NumberFieldIncrement' })
      await increment.find('button').trigger('click')

      await flushPromises()
      expect(wrapper.props('modelValue')).toBe(99)
    })
  })

  describe('form integration', async () => {
    async function createForm(validateOn?: FormInputEvents[]) {
      const wrapper = await renderForm({
        props: {
          validateOn,
          validateOnInputDelay: 0,
          async validate(state: any) {
            if (state.value !== 1)
              return [{ name: 'value', message: 'Error message' }]
            return []
          }
        },
        slotTemplate: `
        <UFormField name="value">
          <UInputNumber id="input" v-model="state.value" />
        </UFormField>
        `
      })
      const input = wrapper.findComponent({ name: 'NumberFieldInput' })
      return {
        wrapper,
        input
      }
    }

    test.todo('validate on blur works', async () => {
      const { input, wrapper } = await createForm(['blur'])

      await input.trigger('blur')
      expect(wrapper.text()).toContain('Error message')

      await input.setValue(1)
      await wrapper.trigger('blur')
      expect(wrapper.html()).not.toContain('Error message')
    })

    test.todo('validate on change works', async () => {
      const { input, wrapper } = await createForm(['change'])

      await input.setValue(2)
      await flushPromises()
      expect(input.text()).toContain('Error message')

      await input.setValue(1)
      await flushPromises()
      expect(wrapper.text()).not.toContain('Error message')
    })

    test.todo('validate on input works', async () => {
      const { input, wrapper } = await createForm(['input'])

      await input.setValue(2)
      expect(input.text()).toContain('Error message')

      await input.setValue(1)
      expect(wrapper.text()).not.toContain('Error message')
    })
  })
})
