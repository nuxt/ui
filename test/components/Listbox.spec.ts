import { describe, it, expect, test } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { renderEach } from '../component-render'
import { renderForm } from '../utils/form'
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
    ['with multiple', { props: { ...props, multiple: true } }],
    ['with multiple and modelValue', { props: { ...props, multiple: true, modelValue: [items[0], items[1]] } }],
    ['with filter', { props: { ...props, filter: true } }],
    ['with filter and placeholder', { props: { ...props, filter: { placeholder: 'Filter...' } } }],
    ['with disabled', { props: { ...props, disabled: true } }],
    ['with loading', { props: { ...props, loading: true } }],
    ['with loadingIcon', { props: { ...props, loading: true, loadingIcon: 'i-lucide-loader' } }],
    ['with selectedIcon', { props: { ...props, selectedIcon: 'i-lucide-check' } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { ...props, size } }]),
    ['with class', { props: { ...props, class: 'max-h-64' } }],
    ['with ui', { props: { ...props, ui: { content: 'p-2' } } }],
    // Slots
    ['with item slot', { props, slots: { item: () => 'Item slot' } }],
    ['with item-leading slot', { props, slots: { 'item-leading': () => 'Item leading slot' } }],
    ['with item-label slot', { props, slots: { 'item-label': () => 'Item label slot' } }],
    ['with item-description slot', { props: { ...props, items: itemsWithDescription }, slots: { 'item-description': () => 'Item description slot' } }]
  ])

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
  })
})
