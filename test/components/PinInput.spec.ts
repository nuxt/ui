import { describe, it, expect, test } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import PinInput, { type PinInputProps } from '../../src/runtime/components/PinInput.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/pin-input'

import { renderForm } from '../utils/form'
import type { FormInputEvents } from '~/src/module'

describe('PinInput', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const variants = Object.keys(theme.variants.variant) as any

  it.each([
    // Props
    ['with modelValue', { props: { modelValue: ['1'] } }],
    ['with defaultValue', { props: { defaultValue: ['1'] } }],
    ['with id', { props: { id: 'pin-input-id' } }],
    ['with name', { props: { name: 'pin-input-name' } }],
    ['with type', { props: { type: 'number' } }],
    ['with placeholder', { props: { placeholder: '*' } }],
    ['with length', { props: { length: 6 } }],
    ['with disabled', { props: { disabled: true } }],
    ['with required', { props: { required: true } }],
    ['with mask', { props: { mask: true } }],
    ['with otp', { props: { otp: true } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ...variants.map((variant: string) => [`with primary variant ${variant}`, { props: { variant } }]),
    ...variants.map((variant: string) => [`with primary variant ${variant} highlight`, { props: { variant, highlight: true } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant}`, { props: { variant, color: 'neutral' } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant} highlight`, { props: { variant, color: 'neutral', highlight: true } }]),
    ['with as', { props: { as: 'span' } }],
    ['with class', { props: { class: 'absolute' } }],
    ['with ui', { props: { ui: { base: 'rounded-full' } } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: PinInputProps }) => {
    const html = await ComponentRender(nameOrHtml, options, PinInput)
    expect(html).toMatchSnapshot()
  })

  describe('emits', () => {
    test('update:modelValue event', async () => {
      const wrapper = mount(PinInput)
      const input = wrapper.findComponent({ name: 'PinInputRoot' })
      await input.vm.$emit('update:modelValue', ['1', '2', '3'])
      expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [[['1', '2', '3']]] })
    })

    test('change event', async () => {
      const wrapper = mount(PinInput)
      const input = wrapper.findComponent({ name: 'PinInputRoot' })
      await input.vm.$emit('complete', ['1', '2', '3', '4', '5'])
      await flushPromises()
      expect(wrapper.emitted()).toMatchObject({ change: [[{ type: 'change' }]] })
    })

    test('blur event', async () => {
      const wrapper = mount(PinInput)
      const lastPin = wrapper.find('input[aria-label="pin input 5 of 0"]')
      lastPin.trigger('blur')
      await flushPromises()

      expect(wrapper.emitted()).toMatchObject({ blur: [[{ type: 'blur' }]] })
    })
  })

  describe('form integration', async () => {
    async function createForm(validateOn?: FormInputEvents[]) {
      const wrapper = await renderForm({
        props: {
          validateOn,
          validateOnInputDelay: 0,
          async validate(state: any) {
            if (state.value?.length !== 5)
              return [{ name: 'value', message: 'Error message' }]
            return []
          }
        },
        slotTemplate: `
        <UFormField name="value">
          <UPinInput id="input" v-model="state.value" />
        </UFormField>
        `
      })
      const input = wrapper.findComponent({ name: 'PinInputRoot' })
      return {
        wrapper,
        input
      }
    }

    test('validate on change works', async () => {
      const { input, wrapper } = await createForm(['change'])

      await input.vm.$emit('complete', ['1', '2', '3', '4'])
      await flushPromises()
      expect(wrapper.text()).toContain('Error message')

      await input.vm.$emit('update:modelValue', ['1', '2', '3', '4', '5'])
      await flushPromises()
      expect(wrapper.text()).not.toContain('Error message')
    })

    test('validate on blur works', async () => {
      const { input, wrapper } = await createForm(['blur'])
      const lastPin = wrapper.find('input[aria-label="pin input 5 of 5"]')

      await input.vm.$emit('update:modelValue', ['1', '2', '3', '4'])
      lastPin.trigger('blur')
      await flushPromises()
      expect(wrapper.text()).toContain('Error message')

      await input.vm.$emit('update:modelValue', ['1', '2', '3', '4', '5'])
      lastPin.trigger('blur')
      await flushPromises()
      expect(wrapper.text()).not.toContain('Error message')
    })

    test('validate on input works', async () => {
      const { input, wrapper } = await createForm(['input'])

      await input.vm.$emit('update:modelValue', ['1', '2', '3', '4'])
      await flushPromises()
      expect(wrapper.text()).toContain('Error message')

      await input.vm.$emit('update:modelValue', ['1', '2', '3', '4', '5'])
      await flushPromises()
      expect(wrapper.text()).not.toContain('Error message')
    })
  })
})
