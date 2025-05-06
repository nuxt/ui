import { describe, it, expect, test } from 'vitest'
import CheckboxGroup, { type CheckboxGroupProps, type CheckboxGroupSlots } from '../../src/runtime/components/CheckboxGroup.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/checkbox-group'
import themeCheckbox from '#build/ui/checkbox'
import { flushPromises, mount } from '@vue/test-utils'
import { renderForm } from '../utils/form'
import type { FormInputEvents } from '~/src/module'

describe('CheckboxGroup', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const variants = Object.keys(themeCheckbox.variants.variant) as any
  const indicators = Object.keys(themeCheckbox.variants.indicator) as any

  const items = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' }
  ]

  const props = { items }

  it.each([
    ['with items', { props }],
    ['with modelValue', { props: { ...props, modelValue: ['1'] } }],
    ['with defaultValue', { props: { ...props, defaultValue: ['1'] } }],
    ['with valueKey', { props: { ...props, valueKey: 'label' } }],
    ['with labelKey', { props: { ...props, labelKey: 'value' } }],
    ['with descriptionKey', { props: { ...props, descriptionKey: 'value' } }],
    ['with disabled', { props: { ...props, disabled: true } }],
    ['with description', { props: { items: items.map((opt, count) => ({ ...opt, description: `Description ${count}` })) } }],
    ['with required', { props: { ...props, legend: 'Legend', required: true } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { ...props, size, defaultValue: ['1'] } }]),
    ...variants.map((variant: string) => [`with primary variant ${variant}`, { props: { ...props, variant, defaultValue: ['1'] } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant}`, { props: { ...props, variant, color: 'neutral', defaultValue: ['1'] } }]),
    ...variants.map((variant: string) => [`with horizontal variant ${variant}`, { props: { ...props, variant, orientation: 'horizontal', defaultValue: ['1'] } }]),
    ...indicators.map((indicator: string) => [`with indicator ${indicator}`, { props: { ...props, indicator, defaultValue: ['1'] } }]),
    ['with ariaLabel', { props, attrs: { 'aria-label': 'Aria label' } }],
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'absolute' } }],
    ['with ui', { props: { ...props, ui: { fieldset: 'gap-x-4', label: 'text-red' } } }],
    // Slots
    ['with legend slot', { props, slots: { legend: () => 'Legend slot' } }],
    ['with label slot', { props, slots: { label: () => 'Label slot' } }],
    ['with description slot', { props, slots: { description: () => 'Description slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: CheckboxGroupProps, slots?: Partial<CheckboxGroupSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, CheckboxGroup)
    expect(html).toMatchSnapshot()
  })

  describe('emits', () => {
    test('update:modelValue event', async () => {
      const wrapper = mount(CheckboxGroup, { props: { items: ['Option 1', 'Option 2'] } })
      const input = wrapper.findComponent({ name: 'CheckboxGroupRoot' })
      await input.setValue('Option 1')
      expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [['Option 1']] })
    })

    test('change event', async () => {
      const wrapper = mount(CheckboxGroup, { props: { items: ['Option 1', 'Option 2'] } })
      const input = wrapper.findComponent({ name: 'CheckboxGroupRoot' })
      await input.setValue('Option 1')
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
            if (!state.value?.includes('Option 2'))
              return [{ name: 'value', message: 'Error message' }]
            return []
          }
        },
        slotVars: {
          items: ['Option 1', 'Option 2']
        },
        slotTemplate: `
        <UFormField name="value" label="Checkbox group">
          <UCheckboxGroup id="input" v-model="state.value" :items="items" />
        </UFormField>
        `
      })
      const input = wrapper.findComponent({ name: 'CheckboxGroupRoot' })
      return {
        wrapper,
        input
      }
    }

    test('validate on change works', async () => {
      const { input, wrapper } = await createForm(['change'])

      input.setValue(['Option 1'])
      await flushPromises()
      expect(wrapper.text()).toContain('Error message')

      input.setValue(['Option 2'])
      await flushPromises()
      expect(wrapper.text()).not.toContain('Error message')
    })

    test('validate on input works', async () => {
      const { input, wrapper } = await createForm(['input'])

      input.setValue(['Option 1'])
      await flushPromises()
      expect(wrapper.text()).toContain('Error message')

      input.setValue(['Option 2'])
      await flushPromises()
      expect(wrapper.text()).not.toContain('Error message')
    })

    test('no label for=... on FormField', async () => {
      const { wrapper } = await createForm()
      const formFieldLabel = wrapper.findAll('label').map(label => label.attributes()).filter(label => !label.for?.includes(':'))[0]
      expect(formFieldLabel.for).toBeUndefined()
    })
  })
})
