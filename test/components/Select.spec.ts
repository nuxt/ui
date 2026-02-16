import { describe, it, expect, test } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises, mount } from '@vue/test-utils'
import Select from '../../src/runtime/components/Select.vue'
import type { SelectProps, SelectSlots } from '../../src/runtime/components/Select.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/input'
import { renderForm } from '../utils/form'
import type { FormInputEvents } from '../../src/module'
import { expectEmitPayloadType } from '../utils/types'

describe('Select', () => {
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
    ['with modelValue', { props: { ...props, modelValue: items[0]?.value } }],
    ['with defaultValue', { props: { ...props, defaultValue: items[0]?.value } }],
    ['with valueKey', { props: { ...props, valueKey: 'label', defaultValue: 'Backlog' } }],
    ['with labelKey', { props: { ...props, labelKey: 'value' } }],
    ['with descriptionKey', { props: { ...props, descriptionKey: 'description' } }],
    ['with multiple', { props: { ...props, multiple: true } }],
    ['with multiple and modelValue', { props: { ...props, multiple: true, modelValue: [items[0], items[1]] } }],
    ['with id', { props: { ...props, id: 'id' } }],
    ['with name', { props: { ...props, name: 'name' } }],
    ['with placeholder', { props: { ...props, placeholder: 'Search...' } }],
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
    ['with arrow', { props: { ...props, arrow: true } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { ...props, size } }]),
    ...variants.map((variant: string) => [`with primary variant ${variant}`, { props: { ...props, variant } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant}`, { props: { ...props, variant, color: 'neutral' } }]),
    ['with ariaLabel', { props, attrs: { 'aria-label': 'Aria label' } }],
    ['with class', { props: { ...props, class: 'rounded-full' } }],
    ['with ui', { props: { ...props, ui: { group: 'p-2' } } }],
    // Slots
    ['with leading slot', { props, slots: { leading: () => 'Leading slot' } }],
    ['with trailing slot', { props, slots: { trailing: () => 'Trailing slot' } }],
    ['with item slot', { props, slots: { item: () => 'Item slot' } }],
    ['with item-leading slot', { props, slots: { 'item-leading': () => 'Item leading slot' } }],
    ['with item-label slot', { props, slots: { 'item-label': () => 'Item label slot' } }],
    ['with item-description slot', { props: { ...props, items: itemsWithDescription }, slots: { 'item-description': () => 'Item description slot' } }],
    ['with item-trailing slot', { props, slots: { 'item-trailing': () => 'Item trailing slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: SelectProps, slots?: Partial<SelectSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Select)
    expect(html).toMatchSnapshot()
  })

  it.each([
    ['with .trim modifier', { props: { modelModifiers: { trim: true } } }, { input: 'input  ', expected: 'input' }],
    ['with .number modifier', { props: { modelModifiers: { number: true } } }, { input: '42', expected: 42 }],
    ['with .nullable modifier', { props: { modelModifiers: { nullable: true } } }, { input: null, expected: null }],
    ['with .optional modifier', { props: { modelModifiers: { optional: true } } }, { input: undefined, expected: undefined }]
  ])('%s works', async (_nameOrHtml: string, options: { props?: any, slots?: any }, spec: { input: any, expected: any }) => {
    const wrapper = mount(Select, {
      ...options
    })

    const select = wrapper.findComponent({ name: 'SelectRoot' })
    await select.setValue(spec.input)

    expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [[spec.expected]] })
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Select, {
      props: {
        ...props,
        modelValue: items[0]?.value,
        required: true,
        avatar: {
          src: 'https://github.com/benjamincanac.png',
          alt: 'Benjamin Canac'
        }
      },
      attrs: {
        'aria-label': 'Select an item'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  describe('it should display correct label', () => {
    test.each([null, undefined, ''])('falsy model value %s should display placeholder', (modelValue) => {
      const wrapper = mount(Select, {
        props: {
          items,
          modelValue,
          placeholder: 'Select an item'
        }
      })

      expect(wrapper.text()).toBe('Select an item')
    })

    test('with string array and string value', () => {
      const wrapper = mount(Select, {
        props: {
          items: ['Apple', 'Banana', 'Cherry'],
          modelValue: 'Banana'
        }
      })

      expect(wrapper.text()).toBe('Banana')
    })

    test('with multiple and empty array value should display placeholder', () => {
      const wrapper = mount(Select, {
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
      const wrapper = mount(Select, {
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

  describe('emits', () => {
    test('update:modelValue event', async () => {
      const wrapper = mount(Select, { props: { items: ['Option 1', 'Option 2'] } })
      const input = wrapper.findComponent({ name: 'SelectRoot' })
      await input.setValue('Option 1')
      expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [['Option 1']] })
    })

    test('change event', async () => {
      const wrapper = mount(Select, { props: { items: ['Option 1', 'Option 2'] } })
      const input = wrapper.findComponent({ name: 'SelectRoot' })
      await input.setValue('Option 1')
      expect(wrapper.emitted()).toMatchObject({ change: [[{ type: 'change' }]] })
    })

    test('blur event', async () => {
      const wrapper = mount(Select, { props: { items: ['Option 1', 'Option 2'] } })
      const input = wrapper.findComponent({ name: 'SelectRoot' })
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
          <USelect id="input" v-model="state.value" :items="items" />
        </UFormField>
        `
      })
      const input = wrapper.findComponent({ name: 'SelectRoot' })
      return {
        wrapper,
        input
      }
    }

    test('validate on blur works', async () => {
      const { input, wrapper } = await createForm(['blur'])
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

    test('validate on input works', async () => {
      const { input, wrapper } = await createForm(['input'])

      input.setValue('Option 1')
      await flushPromises()
      expect(wrapper.text()).toContain('Error message')

      input.setValue('Option 2')
      await flushPromises()
      expect(wrapper.text()).not.toContain('Error message')
    })

    test('should have the correct types', () => {
      // with object item
      expectEmitPayloadType('update:modelValue', () => Select({
        items: [{ label: 'foo', value: 'bar' }]
      })).toEqualTypeOf<[string]>()

      // with string item
      expectEmitPayloadType('update:modelValue', () => Select({
        items: ['foo']
      })).toEqualTypeOf<[string]>()

      // with groups
      expectEmitPayloadType('update:modelValue', () => Select({
        items: [['foo']]
      })).toEqualTypeOf<[string]>()

      // with groups and mixed types
      expectEmitPayloadType('update:modelValue', () => Select({
        items: [['foo', { value: 1 }], [{ value: 'bar' }, 2]]
      })).toEqualTypeOf<[string | number]>()

      // with groups, multiple, mixed types and valueKey
      expectEmitPayloadType('update:modelValue', () => Select({
        items: [['foo', { value: 1 }], [{ value: 'bar' }, 2]],
        valueKey: 'value' // TODO: value is already the default valueKey
      })).toEqualTypeOf<[string | number]>()
    })
  })
})
