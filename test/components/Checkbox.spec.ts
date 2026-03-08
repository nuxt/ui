import { describe, it, expect, test } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import { mount, flushPromises } from '@vue/test-utils'
import Checkbox from '../../src/runtime/components/Checkbox.vue'
import type { FormInputEvents } from '../../src/module'
import { renderForm } from '../utils/form'
import theme from '#build/ui/checkbox'

describe('Checkbox', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const variants = Object.keys(theme.variants.variant) as any
  const indicators = Object.keys(theme.variants.indicator) as any

  renderEach(Checkbox, [
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
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size, defaultValue: true } }]),
    ...variants.map((variant: string) => [`with primary variant ${variant}`, { props: { variant, defaultValue: true } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant}`, { props: { variant, color: 'neutral', defaultValue: true } }]),
    ...indicators.map((indicator: string) => [`with indicator ${indicator}`, { props: { indicator, defaultValue: true } }]),
    ['with ariaLabel', { attrs: { 'aria-label': 'Aria label' } }],
    ['with trueValue/falseValue as string', { props: { trueValue: 'yes', falseValue: 'no', defaultValue: 'yes' } }],
    ['with trueValue/falseValue as number', { props: { trueValue: 1, falseValue: 0, defaultValue: 1 } }],
    ['with trueValue/falseValue unchecked', { props: { trueValue: 'yes', falseValue: 'no', defaultValue: 'no' } }],
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'inline-flex' } }],
    ['with ui', { props: { ui: { wrapper: 'ms-4' } } }],
    // Slots
    ['with label slot', { slots: { label: () => 'Label slot' } }],
    ['with description slot', { slots: { label: () => 'Description slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Checkbox, {
      props: {
        label: 'Test checkbox'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
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

    test('toggle with custom trueValue/falseValue via click', async () => {
      const wrapper = mount(Checkbox, {
        props: { trueValue: 'yes', falseValue: 'no', defaultValue: 'no' }
      })
      const button = wrapper.find('button')

      await button.trigger('click')
      await flushPromises()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['yes'])
      expect(wrapper.emitted('change')).toHaveLength(1)

      await button.trigger('click')
      await flushPromises()
      expect(wrapper.emitted('update:modelValue')?.[1]).toEqual(['no'])
      expect(wrapper.emitted('change')).toHaveLength(2)
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
