import { describe, it, expect, test } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises, mount } from '@vue/test-utils'
import { renderEach } from '../component-render'
import { renderForm } from '../utils/form'
import { expectEmitPayloadType } from '../utils/types'
import theme from '#build/ui/listbox'
import type { FormInputEvents } from '../../src/module'
import Listbox from '../../src/runtime/components/Listbox.vue'

describe('Listbox', () => {
  const sizes = Object.keys(theme.variants.size) as any

  const items = [{
    label: 'France',
    icon: 'i-lucide-map-pin',
    value: 'FR'
  }, {
    label: 'Germany',
    icon: 'i-lucide-map-pin',
    value: 'DE'
  }, {
    label: 'Italy',
    icon: 'i-lucide-map-pin',
    value: 'IT'
  }, {
    label: 'Spain',
    icon: 'i-lucide-map-pin',
    value: 'ES'
  }]

  const itemsWithDescription = items.map(item => ({ ...item, description: 'Description' }))

  const props = { items }

  renderEach(Listbox, [
    // Props
    ['with items', { props }],
    ['with items with description', { props: { ...props, items: itemsWithDescription } }],
    ['with modelValue', { props: { ...props, modelValue: items[0] } }],
    ['with defaultValue', { props: { ...props, defaultValue: items[0] } }],
    ['with valueKey', { props: { ...props, valueKey: 'value', defaultValue: 'FR' } }],
    ['with by', { props: { ...props, by: 'value', defaultValue: items[0] } }],
    ['with labelKey', { props: { ...props, labelKey: 'value' } }],
    ['with descriptionKey', { props: { ...props, descriptionKey: 'description' } }],
    ['with multiple', { props: { ...props, multiple: true } }],
    ['with multiple and modelValue', { props: { ...props, multiple: true, modelValue: [items[0], items[1]] } }],
    ['with id', { props: { ...props, id: 'id' } }],
    ['with name', { props: { ...props, name: 'name' } }],
    ['with required', { props: { ...props, required: true } }],
    ['with filter', { props: { ...props, filter: true } }],
    ['with filter and placeholder', { props: { ...props, filter: { placeholder: 'Filter...' } } }],
    ['with disabled', { props: { ...props, disabled: true } }],
    ['with loading', { props: { ...props, loading: true } }],
    ['with loadingIcon', { props: { ...props, loading: true, loadingIcon: 'i-lucide-loader' } }],
    ['with selectedIcon', { props: { ...props, selectedIcon: 'i-lucide-check' } }],
    ['with virtualize', { props: { ...props, virtualize: true } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { ...props, size } }]),
    ['with highlight', { props: { ...props, highlight: true } }],
    ['with highlight neutral', { props: { ...props, highlight: true, color: 'neutral' } }],
    ['with class', { props: { ...props, class: 'max-h-64' } }],
    ['with ui', { props: { ...props, ui: { content: 'p-2' } } }],
    // Slots
    ['with item slot', { props, slots: { item: () => 'Item slot' } }],
    ['with item-leading slot', { props, slots: { 'item-leading': () => 'Item leading slot' } }],
    ['with item-label slot', { props, slots: { 'item-label': () => 'Item label slot' } }],
    ['with item-description slot', { props: { ...props, items: itemsWithDescription }, slots: { 'item-description': () => 'Item description slot' } }],
    ['with item-trailing slot', { props, slots: { 'item-trailing': () => 'Item trailing slot' } }]
  ])

  renderEach(
    Listbox,
    [
      ['with .trim modifier', { props: { ...props, modelModifiers: { trim: true } } }, { input: 'input  ', expected: 'input' }],
      ['with .number modifier', { props: { ...props, modelModifiers: { number: true } } }, { input: '42', expected: 42 }],
      ['with .nullable modifier', { props: { ...props, modelModifiers: { nullable: true } } }, { input: null, expected: null }],
      ['with .optional modifier', { props: { ...props, modelModifiers: { optional: true } } }, { input: undefined, expected: undefined }]
    ],
    '%s works', async (_, options, spec) => {
      const wrapper = mount(Listbox, {
        ...options
      })

      const listbox = wrapper.findComponent({ name: 'ListboxRoot' })
      await listbox.setValue(spec.input)

      expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [[spec.expected]] })
    }
  )

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Listbox, {
      props: {
        ...props,
        modelValue: items[0]
      },
      attrs: {
        ariaLabel: 'Countries'
      }
    })
    expect(await axe(wrapper.element, {
      rules: {
        'aria-input-field-name': { enabled: false }
      }
    })).toHaveNoViolations()
  })

  describe('emits', () => {
    test('update:modelValue event', async () => {
      const wrapper = mount(Listbox, { props })
      const input = wrapper.findComponent({ name: 'ListboxRoot' })
      await input.setValue(items[0])

      expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [[items[0]]] })
    })

    test('change event', async () => {
      const wrapper = mount(Listbox, { props })
      const input = wrapper.findComponent({ name: 'ListboxRoot' })
      await input.setValue(items[0])
      expect(wrapper.emitted()).toMatchObject({ change: [[{ type: 'change' }]] })
    })
  })

  describe('form integration', async () => {
    const item1 = { label: 'Option 1', value: 'opt1' }
    const item2 = { label: 'Option 2', value: 'opt2' }

    async function createForm(validateOn?: FormInputEvents[]) {
      const wrapper = await renderForm({
        props: {
          validateOn,
          validateOnInputDelay: 0,
          async validate(state: any) {
            if (!state.value?.some((i: any) => i.value === 'opt2'))
              return [{ name: 'value', message: 'Error message' }]
            return []
          }
        },
        slotVars: {
          items: [item1, item2]
        },
        slotTemplate: `
        <UFormField name="value" label="Listbox">
          <UListbox id="input" v-model="state.value" :items="items" multiple />
        </UFormField>
        `
      })
      const input = wrapper.findComponent({ name: 'ListboxRoot' })
      return { wrapper, input }
    }

    test('validate on change works', async () => {
      const { input, wrapper } = await createForm(['change'])

      input.setValue([item1])
      await flushPromises()
      expect(wrapper.text()).toContain('Error message')

      input.setValue([item2])
      await flushPromises()
      expect(wrapper.text()).not.toContain('Error message')
    })

    test('validate on input works', async () => {
      const { input, wrapper } = await createForm(['input'])

      input.setValue([item1])
      await flushPromises()
      expect(wrapper.text()).toContain('Error message')

      input.setValue([item2])
      await flushPromises()
      expect(wrapper.text()).not.toContain('Error message')
    })

    test('should have the correct types', () => {
      // with object item
      expectEmitPayloadType('update:modelValue', () => Listbox({
        items: [{ label: 'foo', value: 'bar' }]
      })).toEqualTypeOf<[{ label: string, value: string }]>()

      // with object item and multiple
      expectEmitPayloadType('update:modelValue', () => Listbox({
        items: [{ label: 'foo', value: 1 }],
        multiple: true
      })).toEqualTypeOf<[{ label: string, value: number }[]]>()

      // with object item and valueKey
      expectEmitPayloadType('update:modelValue', () => Listbox({
        items: [{ label: 'foo', value: 'bar' }],
        valueKey: 'value'
      })).toEqualTypeOf<[string]>()

      // with object item and multiple and valueKey
      expectEmitPayloadType('update:modelValue', () => Listbox({
        items: [{ label: 'foo', value: 1 }],
        multiple: true,
        valueKey: 'value'
      })).toEqualTypeOf<[number[]]>()

      // with object item and object valueKey
      expectEmitPayloadType('update:modelValue', () => Listbox({
        items: [{ label: 'foo', value: { id: 1, name: 'bar' } }],
        valueKey: 'value'
      })).toEqualTypeOf<[{ id: number, name: string }]>()

      // with groups
      expectEmitPayloadType('update:modelValue', () => Listbox({
        items: [[{ label: 'foo', value: 'bar' }]]
      })).toEqualTypeOf<[{ label: string, value: string }]>()

      // with groups and multiple
      expectEmitPayloadType('update:modelValue', () => Listbox({
        items: [[{ label: 'foo', value: 1 }]],
        multiple: true
      })).toEqualTypeOf<[{ label: string, value: number }[]]>()

      // with groups, multiple and valueKey
      expectEmitPayloadType('update:modelValue', () => Listbox({
        items: [[{ label: 'foo', value: 'bar' }]],
        multiple: true,
        valueKey: 'value'
      })).toEqualTypeOf<[string[]]>()
    })
  })
})
