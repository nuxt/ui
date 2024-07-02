import { describe, it, expect, test } from 'vitest'
import InputMenu, { type InputMenuProps, type InputMenuSlots } from '../../src/runtime/components/InputMenu.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/input'
import { renderForm } from '../utils/form'
import { flushPromises, mount } from '@vue/test-utils'
import type { FormInputEvents } from '~/src/module'

describe('InputMenu', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const colors = Object.keys(theme.variants.color) as any
  const variants = Object.keys(theme.variants.variant) as any

  const items = [{
    label: 'Backlog',
    icon: 'i-heroicons-question-mark-circle'
  }, {
    label: 'Todo',
    icon: 'i-heroicons-plus-circle'
  }, {
    label: 'In Progress',
    icon: 'i-heroicons-arrow-up-circle'
  }, {
    label: 'Done',
    icon: 'i-heroicons-check-circle'
  }, {
    label: 'Canceled',
    icon: 'i-heroicons-x-circle'
  }]

  const props = { open: true, portal: false, items }

  it.each([
    // Props
    ['with items', { props }],
    ['with modelValue', { props: { ...props, modelValue: items[0] } }],
    ['with defaultValue', { props: { ...props, defaultValue: items[0] } }],
    ['with id', { props: { ...props, id: 'id' } }],
    ['with name', { props: { ...props, name: 'name' } }],
    ['with placeholder', { props: { ...props, placeholder: 'Search...' } }],
    ['with disabled', { props: { ...props, disabled: true } }],
    ['with required', { props: { ...props, required: true } }],
    ['with icon', { props: { ...props, icon: 'i-heroicons-magnifying-glass' } }],
    ['with leading and icon', { props: { ...props, leading: true, icon: 'i-heroicons-magnifying-glass' } }],
    ['with leadingIcon', { props: { ...props, leadingIcon: 'i-heroicons-magnifying-glass' } }],
    ['with trailing and icon', { props: { ...props, trailing: true, icon: 'i-heroicons-magnifying-glass' } }],
    ['with trailingIcon', { props: { ...props, trailingIcon: 'i-heroicons-magnifying-glass' } }],
    ['with loading', { props: { ...props, loading: true } }],
    ['with loadingIcon', { props: { ...props, loading: true, loadingIcon: 'i-heroicons-sparkles' } }],
    ['with trailingIcon', { props: { ...props, trailingIcon: 'i-heroicons-chevron-down' } }],
    ['with selectedIcon', { props: { ...props, selectedIcon: 'i-heroicons-check' } }],
    ['with arrow', { props: { ...props, arrow: true } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { ...props, size } }]),
    ...colors.map((color: string) => [`with color ${color}`, { props: { ...props, color } }]),
    ...variants.map((variant: string) => [`with variant ${variant}`, { props: { ...props, variant } }]),
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'absolute' } }],
    ['with ui', { props: { ...props, ui: { group: 'p-2' } } }],
    // Slots
    ['with leading slot', { slots: { leading: () => 'Leading slot' } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with trailing slot', { slots: { trailing: () => 'Trailing slot' } }],
    ['with item slot', { props, slots: { item: () => 'Item slot' } }],
    ['with item-leading slot', { props, slots: { 'item-leading': () => 'Item leading slot' } }],
    ['with item-label slot', { props, slots: { 'item-label': () => 'Item label slot' } }],
    ['with item-trailing slot', { props, slots: { 'item-trailing': () => 'Item trailing slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: InputMenuProps<typeof items[number]>, slots?: Partial<InputMenuSlots<typeof items[number]>> }) => {
    const html = await ComponentRender(nameOrHtml, options, InputMenu)
    expect(html).toMatchSnapshot()
  })

  describe('emits', () => {
    test('update:modelValue event', async () => {
      const wrapper = mount(InputMenu, { props: { items: ['Option 1', 'Option 2'] } })
      const input = wrapper.findComponent({ name: 'ComboboxRoot' })
      await input.setValue('Option 1')
      expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [['Option 1']] })
    })

    test('change event', async () => {
      const wrapper = mount(InputMenu, { props: { items: ['Option 1', 'Option 2'] } })
      const input = wrapper.findComponent({ name: 'ComboboxRoot' })
      await input.setValue('Option 1')
      expect(wrapper.emitted()).toMatchObject({ change: [[{ type: 'change' }]] })
    })

    test('blur event', async () => {
      const wrapper = mount(InputMenu, { props: { items: ['Option 1', 'Option 2'] } })
      const input = wrapper.findComponent({ name: 'ComboboxRoot' })
      await input.vm.$emit('update:open', false)
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
            if (state.value !== 'Option 2')
              return [{ name: 'value', message: 'Error message' }]
            return []
          }
        },
        slotVars: {
          items: ['Option 1', 'Option 2']
        },
        slotTemplate: `
        <UFormField name="value">
          <UInputMenu id="input" v-model="state.value" :items="items" />
        </UFormField>
        `
      })
      const input = wrapper.findComponent({ name: 'ComboboxRoot' })
      return {
        wrapper,
        input
      }
    }

    test('validate on blur works', async () => {
      const { wrapper, input } = await createForm(['blur'])
      await input.vm.$emit('update:open', false)
      await flushPromises()

      expect(wrapper.text()).toContain('Error message')

      await input.setValue('Option 2')
      await input.vm.$emit('update:open', false)
      await flushPromises()

      expect(wrapper.text()).not.toContain('Error message')
    })

    test('validate on change works', async () => {
      const { input, wrapper } = await createForm(['change'])

      input.setValue('Option 1')
      await flushPromises()
      expect(wrapper.text()).toContain('Error message')

      input.setValue('Option 2')
      await flushPromises()
      expect(wrapper.text()).not.toContain('Error message')
    })
  })
})
