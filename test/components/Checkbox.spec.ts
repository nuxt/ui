import { describe, it, expect, test } from 'vitest'
import Checkbox, { type CheckboxProps, type CheckboxSlots } from '../../src/runtime/components/Checkbox.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/checkbox'
import { renderForm } from '../utils/form'
import { mount, flushPromises } from '@vue/test-utils'
import type { FormInputEvents } from '~/src/module'

describe('Checkbox', () => {
  const sizes = Object.keys(theme.variants.size) as any

  it.each([
    // Props
    ['with modelValue', { props: { modelValue: true } }],
    ['with defaultValue', { props: { defaultValue: true } }],
    ['with id', { props: { id: 'id' } }],
    ['with name', { props: { name: 'name' } }],
    ['with value', { props: { value: 'value' } }],
    ['with disabled', { props: { disabled: true } }],
    ['with icon', { props: { icon: 'i-lucide-heart' } }],
    ['with indeterminate', { props: { defaultValue: 'indeterminate' } }],
    ['with indeterminateIcon', { props: { defaultValue: 'indeterminate', indeterminateIcon: 'i-lucide-trash' } }],
    ['with label', { props: { label: 'Label' } }],
    ['with required', { props: { label: 'Label', required: true } }],
    ['with description', { props: { label: 'Label', description: 'Description' } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ['with color neutral', { props: { color: 'neutral', defaultValue: true } }],
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'inline-flex' } }],
    ['with ui', { props: { ui: { wrapper: 'ms-4' } } }],
    // Slots
    ['with label slot', { slots: { label: () => 'Label slot' } }],
    ['with description slot', { slots: { label: () => 'Description slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: CheckboxProps, slots?: Partial<CheckboxSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Checkbox)
    expect(html).toMatchSnapshot()
  })

  describe('emits', () => {
    test('update:modelValue event', async () => {
      const wrapper = mount(Checkbox)
      const input = wrapper.findComponent({ name: 'CheckboxRoot' })
      await input.vm.$emit('update:modelValue', true)
      expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [[true]] })
    })

    test('change event', async () => {
      const wrapper = mount(Checkbox)
      const input = wrapper.findComponent({ name: 'CheckboxRoot' })
      await input.vm.$emit('update:modelValue', false)
      expect(wrapper.emitted()).toMatchObject({ change: [[{ type: 'change' }]] })
    })
  })

  describe('form integration', async () => {
    async function createForm(validateOn?: FormInputEvents[]) {
      const wrapper = await renderForm({
        props: {
          validateOn,
          validateOnInputDelay: 0,
          async validate(state: any) {
            if (!state.value)
              return [{ name: 'value', message: 'Error message' }]
            return []
          }
        },
        slotTemplate: `
        <UFormField name="value">
          <UCheckbox v-model="state.value" />
        </UFormField>
        `
      })
      const input = wrapper.findComponent({ name: 'CheckboxRoot' })
      return {
        wrapper,
        input
      }
    }

    test('validate on change works', async () => {
      const { input, wrapper } = await createForm(['change'])
      await input.vm.$emit('update:modelValue', false)
      await flushPromises()

      expect(wrapper.text()).toContain('Error message')

      await input.vm.$emit('update:modelValue', true)
      await flushPromises()
      expect(wrapper.text()).not.toContain('Error message')
    })

    test('validate on input works', async () => {
      const { input, wrapper } = await createForm(['input'])
      await input.vm.$emit('update:modelValue', false)
      await flushPromises()

      expect(wrapper.text()).toContain('Error message')

      await input.vm.$emit('update:modelValue', true)
      await flushPromises()
      expect(wrapper.text()).not.toContain('Error message')
    })
  })
})
