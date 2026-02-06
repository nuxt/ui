import { describe, it, expect, test } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SelectMenu from '../../src/runtime/components/SelectMenu.vue'
import type { SelectMenuProps, SelectMenuSlots } from '../../src/runtime/components/SelectMenu.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/input'
import { renderForm } from '../utils/form'
import { flushPromises, mount } from '@vue/test-utils'
import type { FormInputEvents } from '../../src/module'
import { expectEmitPayloadType } from '../utils/types'

describe('SelectMenu', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const variants = Object.keys(theme.variants.variant) as any

  const items = [{
    label: 'Backlog',
    value: 'backlog',
    icon: 'i-lucide-circle-help'
  }, {
    label: 'Todo',
    value: 'todo',
    icon: 'i-lucide-circle-plus'
  }, {
    label: 'In Progress',
    value: 'in_progress',
    icon: 'i-lucide-circle-arrow-up'
  }, {
    label: 'Done',
    value: 'done',
    icon: 'i-lucide-circle-check'
  }, {
    label: 'Canceled',
    value: 'canceled',
    icon: 'i-lucide-circle-x'
  }]

  const itemsWithDescription = [...items.map(item => ({ ...item, description: 'Description' }))]

  const props = { open: true, portal: false, items }

  it.each([
    // Props
    ['with items', { props }],
    ['with items with description', { props: { ...props, items: itemsWithDescription } }],
    ['with modelValue', { props: { ...props, modelValue: items[0] } }],
    ['with defaultValue', { props: { ...props, defaultValue: items[0] } }],
    ['with valueKey', { props: { ...props, valueKey: 'label', defaultValue: 'Backlog' } }],
    ['with by', { props: { ...props, by: 'value', defaultValue: items[0] } }],
    ['with labelKey', { props: { ...props, labelKey: 'value' } }],
    ['with descriptionKey', { props: { ...props, descriptionKey: 'description' } }],
    ['with multiple', { props: { ...props, multiple: true } }],
    ['with multiple and modelValue', { props: { ...props, multiple: true, modelValue: [items[0], items[1]] } }],
    ['with id', { props: { ...props, id: 'id' } }],
    ['with name', { props: { ...props, name: 'name' } }],
    ['with placeholder', { props: { ...props, placeholder: 'Search...' } }],
    ['without searchInput', { props: { ...props, searchInput: false } }],
    ['with searchInput placeholder', { props: { ...props, searchInput: { placeholder: 'Filter items...' } } }],
    ['with searchInput icon', { props: { ...props, searchInput: { icon: 'i-lucide-search' } } }],
    ['with disabled', { props: { ...props, disabled: true } }],
    ['with required', { props: { ...props, required: true } }],
    ['with icon', { props: { icon: 'i-lucide-search' } }],
    ['with leading and icon', { props: { leading: true, icon: 'i-lucide-arrow-left' } }],
    ['with leadingIcon', { props: { leadingIcon: 'i-lucide-arrow-left' } }],
    ['with trailing and icon', { props: { trailing: true, icon: 'i-lucide-arrow-right' } }],
    ['with trailingIcon', { props: { trailingIcon: 'i-lucide-arrow-right' } }],
    ['with avatar', { props: { avatar: { src: 'https://github.com/benjamincanac.png' } } }],
    ['with avatar and leadingIcon', { props: { avatar: { src: 'https://github.com/benjamincanac.png' }, leadingIcon: 'i-lucide-arrow-left' } }],
    ['with avatar and trailingIcon', { props: { avatar: { src: 'https://github.com/benjamincanac.png' }, trailingIcon: 'i-lucide-arrow-right' } }],
    ['with loading', { props: { loading: true } }],
    ['with loading and avatar', { props: { loading: true, avatar: { src: 'https://github.com/benjamincanac.png' } } }],
    ['with loading trailing', { props: { loading: true, trailing: true } }],
    ['with loading trailing and avatar', { props: { loading: true, trailing: true, avatar: { src: 'https://github.com/benjamincanac.png' } } }],
    ['with loadingIcon', { props: { loading: true, loadingIcon: 'i-lucide-loader' } }],
    ['with trailingIcon', { props: { ...props, trailingIcon: 'i-lucide-chevron-down' } }],
    ['with selectedIcon', { props: { ...props, selectedIcon: 'i-lucide-check' } }],
    ['with clear', { props: { ...props, clear: true, modelValue: items[0] } }],
    ['with clear and clearIcon', { props: { ...props, clear: true, clearIcon: 'i-lucide-x', modelValue: items[0] } }],
    ['with arrow', { props: { ...props, arrow: true } }],
    ['with virtualize', { props: { ...props, virtualize: true } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { ...props, size } }]),
    ...variants.map((variant: string) => [`with primary variant ${variant}`, { props: { ...props, variant } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant}`, { props: { ...props, variant, color: 'neutral' } }]),
    ['with ariaLabel', { props, attrs: { 'aria-label': 'Aria label' } }],
    ['with class', { props: { ...props, class: 'rounded-full' } }],
    ['with ui', { props: { ...props, ui: { group: 'p-2' } } }],
    // Slots
    ['with leading slot', { props, slots: { leading: () => 'Leading slot' } }],
    ['with default slot', { props, slots: { default: () => 'Default slot' } }],
    ['with trailing slot', { props, slots: { trailing: () => 'Trailing slot' } }],
    ['with item slot', { props, slots: { item: () => 'Item slot' } }],
    ['with item-leading slot', { props, slots: { 'item-leading': () => 'Item leading slot' } }],
    ['with item-label slot', { props, slots: { 'item-label': () => 'Item label slot' } }],
    ['with item-description slot', { props: { ...props, items: itemsWithDescription }, slots: { 'item-description': () => 'Item description slot' } }],
    ['with item-trailing slot', { props, slots: { 'item-trailing': () => 'Item trailing slot' } }],
    ['with create-item-label slot', { props: { ...props, searchTerm: 'New value', createItem: true }, slots: { 'create-item-label': () => 'Create item slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: SelectMenuProps, slots?: Partial<SelectMenuSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, SelectMenu)
    expect(html).toMatchSnapshot()
  })

  it.each([
    ['with .trim modifier', { props: { modelModifiers: { trim: true } } }, { input: 'input  ', expected: 'input' }],
    ['with .number modifier', { props: { modelModifiers: { number: true } } }, { input: '42', expected: 42 }],
    ['with .nullable modifier', { props: { modelModifiers: { nullable: true } } }, { input: null, expected: null }],
    ['with .optional modifier', { props: { modelModifiers: { optional: true } } }, { input: undefined, expected: undefined }]
  ])('%s works', async (_nameOrHtml: string, options: { props?: any, slots?: any }, spec: { input: any, expected: any }) => {
    const wrapper = mount(SelectMenu, {
      ...options
    })

    const selectMenu = wrapper.findComponent({ name: 'ComboboxRoot' })
    await selectMenu.setValue(spec.input)

    expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [[spec.expected]] })
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(SelectMenu, {
      props: {
        ...props,
        modelValue: items[0]

      }
    })
    expect(await axe(wrapper.element, {
      rules: {
        // "Certain ARIA roles must contain particular children (aria-required-children)"

        // Fix any of the following:
        //   Element has children which are not allowed: div[tabindex]
        'aria-required-children': { enabled: false }
      }
    })).toHaveNoViolations()
  })

  describe('emits', () => {
    test('update:modelValue event', async () => {
      const wrapper = mount(SelectMenu, { props: { items: ['Option 1', 'Option 2'] } })
      const input = wrapper.findComponent({ name: 'ComboboxRoot' })
      await input.setValue('Option 1')

      expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [['Option 1']] })
    })

    test('change event', async () => {
      const wrapper = mount(SelectMenu, { props: { items: ['Option 1', 'Option 2'] } })
      const input = wrapper.findComponent({ name: 'ComboboxRoot' })
      await input.setValue('Option 1')
      expect(wrapper.emitted()).toMatchObject({ change: [[{ type: 'change' }]] })
    })

    test('blur event', async () => {
      const wrapper = mount(SelectMenu, { props: { items: ['Option 1', 'Option 2'] } })
      const input = wrapper.findComponent({ name: 'ComboboxRoot' })
      input.vm.$emit('update:open', false)
      expect(wrapper.emitted()).toMatchObject({ blur: [[{ type: 'blur' }]] })
    })
  })

  describe('it should display correct label', () => {
    test.each([null, undefined, ''])('falsy model value %s should display placeholder', (modelValue) => {
      const wrapper = mount(SelectMenu, {
        props: {
          items,
          modelValue,
          placeholder: 'Select an item'
        }
      })

      expect(wrapper.text()).toBe('Select an item')
    })

    test('with string array and string value', () => {
      const wrapper = mount(SelectMenu, {
        props: {
          items: ['Apple', 'Banana', 'Cherry'],
          modelValue: 'Banana'
        }
      })

      expect(wrapper.text()).toBe('Banana')
    })

    test('with multiple and empty array value should display placeholder', () => {
      const wrapper = mount(SelectMenu, {
        props: {
          items,
          multiple: true,
          modelValue: [],
          placeholder: 'Select items'
        }
      })
      expect(wrapper.text()).toBe('Select items')
    })

    test('with falsy modelValue and options items contain falsy', () => {
      const wrapper = mount(SelectMenu, {
        props: {
          items: [
            {
              label: 'John Doe',
              value: null
            },
            {
              label: 'John Lennon',
              value: 1
            }
          ],
          valueKey: 'value',
          modelValue: null
        }
      })
      expect(wrapper.text()).toBe('John Doe')
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
          <USelectMenu id="input" v-model="state.value" :items="items" />
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
      const { input, wrapper } = await createForm(['blur'])
      input.vm.$emit('update:open', false)
      await flushPromises()

      expect(wrapper.text()).toContain('Error message')

      await input.setValue('Option 2')
      input.vm.$emit('update:open', false)
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

    test('should have the correct types', () => {
      // with object item
      expectEmitPayloadType('update:modelValue', () => SelectMenu({
        items: [{ label: 'foo', value: 'bar' }]
      })).toEqualTypeOf<[{ label: string, value: string }]>()

      // with object item and multiple
      expectEmitPayloadType('update:modelValue', () => SelectMenu({
        items: [{ label: 'foo', value: 1 }],
        multiple: true
      })).toEqualTypeOf<[{ label: string, value: number }[]]>()

      // with object item and valueKey
      expectEmitPayloadType('update:modelValue', () => SelectMenu({
        items: [{ label: 'foo', value: 'bar' }],
        valueKey: 'value'
      })).toEqualTypeOf<[string]>()

      // with object item and multiple and valueKey
      expectEmitPayloadType('update:modelValue', () => SelectMenu({
        items: [{ label: 'foo', value: 1 }],
        multiple: true,
        valueKey: 'value'
      })).toEqualTypeOf<[number[]]>()

      // with object item and object valueKey
      expectEmitPayloadType('update:modelValue', () => SelectMenu({
        items: [{ label: 'foo', value: { id: 1, name: 'bar' } }],
        valueKey: 'value'
      })).toEqualTypeOf<[{ id: number, name: string }]>()

      // with string item
      expectEmitPayloadType('update:modelValue', () => SelectMenu({
        items: ['foo']
      })).toEqualTypeOf<[string]>()

      // with string item and multiple
      expectEmitPayloadType('update:modelValue', () => SelectMenu({
        items: ['foo'],
        multiple: true
      })).toEqualTypeOf<[string[]]>()

      // with groups
      expectEmitPayloadType('update:modelValue', () => SelectMenu({
        items: [['foo']]
      })).toEqualTypeOf<[string]>()

      // with groups and multiple
      expectEmitPayloadType('update:modelValue', () => SelectMenu({
        items: [['foo']],
        multiple: true
      })).toEqualTypeOf<[string[]]>()

      // with groups, multiple and mixed types
      expectEmitPayloadType('update:modelValue', () => SelectMenu({
        items: [['foo', { value: 1 }], [{ value: 'bar' }, 2]],
        multiple: true
      })).toEqualTypeOf<[(string | number | { value: string } | { value: number })[]]>()

      // with groups, multiple, mixed types and valueKey
      expectEmitPayloadType('update:modelValue', () => SelectMenu({
        items: [['foo', { value: 1 }], [{ value: 'bar' }, 2]],
        multiple: true,
        valueKey: 'value'
      })).toEqualTypeOf<[(string | number)[]]>()
    })
  })
})
