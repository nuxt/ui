import { describe, it, expect, test } from 'vitest'
import RadioGroup, { type RadioGroupProps, type RadioGroupSlots } from '../../src/runtime/components/RadioGroup.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/radio-group'
import { flushPromises, mount } from '@vue/test-utils'
import { renderForm } from '../utils/form'
import type { FormInputEvents } from '~/src/module'

describe('RadioGroup', () => {
  const sizes = Object.keys(theme.variants.size) as any

  const items = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' }
  ]

  const props = { items }

  it.each([
    ['with items', { props }],
    ['with modelValue', { props: { ...props, modelValue: '1' } }],
    ['with defaultValue', { props: { ...props, defaultValue: '1' } }],
    ['with valueKey', { props: { ...props, valueKey: 'label' } }],
    ['with labelKey', { props: { ...props, labelKey: 'value' } }],
    ['with descriptionKey', { props: { ...props, descriptionKey: 'value' } }],
    ['with disabled', { props: { ...props, disabled: true } }],
    ['with description', { props: { items: items.map((opt, count) => ({ ...opt, description: `Description ${count}` })) } }],
    ['with required', { props: { ...props, legend: 'Legend', required: true } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { ...props, size } }]),
    ['with color neutral', { props: { color: 'neutral', defaultValue: '1' } }],
    ['with orientation', { props: { ...props, orientation: 'horizontal' } }],
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'absolute' } }],
    ['with ui', { props: { ...props, ui: { wrapper: 'ms-4' } } }],
    // Slots
    ['with legend slot', { props, slots: { label: () => 'Legend slot' } }],
    ['with label slot', { props, slots: { label: () => 'Label slot' } }],
    ['with description slot', { props, slots: { label: () => 'Description slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: RadioGroupProps<any>, slots?: Partial<RadioGroupSlots<any>> }) => {
    const html = await ComponentRender(nameOrHtml, options, RadioGroup)
    expect(html).toMatchSnapshot()
  })

  describe('emits', () => {
    test('update:modelValue event', async () => {
      const wrapper = mount(RadioGroup, { props: { items: ['Option 1', 'Option 2'] } })
      const input = wrapper.findComponent({ name: 'RadioGroupRoot' })
      await input.setValue('Option 1')

      expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [['Option 1']] })
    })

    test('change event', async () => {
      const wrapper = mount(RadioGroup, { props: { items: ['Option 1', 'Option 2'] } })

      const input = wrapper.findComponent({ name: 'RadioGroupRoot' })
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
            if (state.value !== 'Option 2')
              return [{ name: 'value', message: 'Error message' }]
            return []
          }
        },
        slotVars: {
          items: ['Option 1', 'Option 2']
        },
        slotTemplate: `
        <UFormField name="value" label="Radio group">
          <URadioGroup id="input" v-model="state.value" :items="items" />
        </UFormField>
        `
      })
      const input = wrapper.findComponent({ name: 'RadioGroupRoot' })
      return {
        wrapper,
        input
      }
    }

    test('validate on change works', async () => {
      const { input, wrapper } = await createForm(['change'])

      input.setValue('Option 1')
      await flushPromises()
      expect(wrapper.text()).toContain('Error message')

      input.setValue('Option 2')
      await flushPromises()
      expect(wrapper.text()).not.toContain('Error message')
    })

    test('validate on input works', async () => {
      const { input, wrapper } = await createForm(['input'])

      input.setValue('Option 1')
      await flushPromises()
      expect(wrapper.text()).toContain('Error message')

      input.setValue('Option 2')
      await flushPromises()
      expect(wrapper.text()).not.toContain('Error message')
    })

    test('no label for=... on FormField', async () => {
      const { wrapper } = await createForm()
      const formFieldLabel = wrapper.findAll('label').map(label => label.attributes()).filter(label => !label.for?.includes('Option'))[0]
      expect(formFieldLabel.for).toBeUndefined()
    })
  })
})
