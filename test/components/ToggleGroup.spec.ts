import { describe, it, expect, test } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ToggleGroup from '../../src/runtime/components/ToggleGroup.vue'
import { flushPromises } from '@vue/test-utils'
import { renderEach } from '../component-render'
import { renderForm } from '../utils/form'
import type { FormInputEvents } from '../../src/module'

describe('ToggleGroup', () => {
  const items = [{
    'value': 'left',
    'icon': 'i-lucide-align-left',
    'aria-label': 'Align left'
  }, {
    'value': 'center',
    'icon': 'i-lucide-align-center',
    'aria-label': 'Align center'
  }, {
    'value': 'right',
    'icon': 'i-lucide-align-right',
    'aria-label': 'Align right',
    'disabled': true
  }]

  const props = { items }

  renderEach(ToggleGroup, [
    // Props
    ['with items', { props }],
    ['with labels', { props: { items: [{ label: 'Day' }, { label: 'Week' }, { label: 'Month' }] } }],
    ['with defaultValue', { props: { ...props, defaultValue: 'center' } }],
    ['with modelValue', { props: { ...props, modelValue: 'center' } }],
    ['with type multiple', { props: { ...props, type: 'multiple', modelValue: ['left', 'center'] } }],
    ['with disabled', { props: { ...props, disabled: true } }],
    ['with orientation vertical', { props: { ...props, orientation: 'vertical' } }],
    ['with attached', { props: { ...props, attached: true, variant: 'outline' } }],
    ['with attached vertical', { props: { ...props, attached: true, variant: 'outline', orientation: 'vertical' } }],
    ['with color', { props: { ...props, color: 'primary' } }],
    ['with variant', { props: { ...props, variant: 'outline' } }],
    ['with activeColor', { props: { ...props, modelValue: 'center', activeColor: 'neutral' } }],
    ['with activeVariant', { props: { ...props, modelValue: 'center', activeVariant: 'solid' } }],
    ['with size', { props: { ...props, size: 'xl' } }],
    ['with valueKey', { props: { items: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }], valueKey: 'id', modelValue: 'b' } }],
    ['with labelKey', { props: { items: [{ value: 'a', name: 'A' }, { value: 'b', name: 'B' }], labelKey: 'name' } }],
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'gap-2' } }],
    ['with ui', { props: { ...props, ui: { root: 'gap-2', item: 'rounded-full' } } }],
    // Slots
    ['with leading slot', { props, slots: { leading: () => 'Leading slot' } }],
    ['with default slot', { props, slots: { default: () => 'Default slot' } }],
    ['with trailing slot', { props, slots: { trailing: () => 'Trailing slot' } }]
  ])

  it('presses a single item at a time', async () => {
    const wrapper = await mountSuspended(ToggleGroup, { props })
    const buttons = wrapper.findAll('button')

    await buttons[0]!.trigger('click')
    await buttons[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['left'], ['center']])
    expect(buttons.map(button => button.attributes('aria-pressed'))).toEqual(['false', 'true', 'false'])
  })

  it('presses several items with type multiple', async () => {
    const wrapper = await mountSuspended(ToggleGroup, { props: { ...props, type: 'multiple' } })
    const buttons = wrapper.findAll('button')

    await buttons[0]!.trigger('click')
    await buttons[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[['left']], [['left', 'center']]])
    expect(buttons.map(button => button.attributes('aria-pressed'))).toEqual(['true', 'true', 'false'])
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(ToggleGroup, { props: { ...props, defaultValue: 'center' } })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  describe('form integration', async () => {
    async function createForm(validateOn?: FormInputEvents[]) {
      const wrapper = await renderForm({
        props: {
          validateOn,
          validateOnInputDelay: 0,
          async validate(state: any) {
            if (state.value !== 'center')
              return [{ name: 'value', message: 'Error message' }]
            return []
          }
        },
        slotVars: { items },
        slotTemplate: `
        <UFormField name="value" label="Alignment">
          <UToggleGroup v-model="state.value" :items="items" />
        </UFormField>
        `
      })
      return { wrapper, buttons: wrapper.findAll('button') }
    }

    test('validate on change works', async () => {
      const { wrapper, buttons } = await createForm(['change'])

      await buttons[0]!.trigger('click')
      await flushPromises()
      expect(wrapper.text()).toContain('Error message')
      expect(wrapper.find('[role="group"]').attributes('aria-invalid')).toBe('true')

      await buttons[1]!.trigger('click')
      await flushPromises()
      expect(wrapper.text()).not.toContain('Error message')
    })

    test('validate on input works', async () => {
      const { wrapper, buttons } = await createForm(['input'])

      await buttons[0]!.trigger('click')
      await flushPromises()
      expect(wrapper.text()).toContain('Error message')

      await buttons[1]!.trigger('click')
      await flushPromises()
      expect(wrapper.text()).not.toContain('Error message')
    })

    test('labels the group with the FormField label', async () => {
      const { wrapper } = await createForm()
      const label = wrapper.find('label')

      expect(label.attributes('for')).toBeUndefined()
      expect(wrapper.find('[role="group"]').attributes('aria-labelledby')).toBe(label.attributes('id'))
    })
  })
})
