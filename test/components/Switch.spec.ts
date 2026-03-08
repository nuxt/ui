import { describe, it, expect, test } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import Switch from '../../src/runtime/components/Switch.vue'
import theme from '#build/ui/switch'
import { flushPromises, mount } from '@vue/test-utils'
import { renderForm } from '../utils/form'
import type { FormInputEvents } from '../../src/module'

describe('Switch', () => {
  const sizes = Object.keys(theme.variants.size) as any

  renderEach(Switch, [
    // Props
    ['with modelValue', { props: { modelValue: true } }],
    ['with defaultValue', { props: { defaultValue: true } }],
    ['with id', { props: { id: 'id' } }],
    ['with name', { props: { name: 'name' } }],
    ['with value', { props: { value: 'value' } }],
    ['with disabled', { props: { disabled: true } }],
    ['with checkedIcon', { props: { checkedIcon: 'i-lucide-check', defaultValue: true } }],
    ['with uncheckedIcon', { props: { uncheckedIcon: 'i-lucide-x' } }],
    ['with loading', { props: { loading: true } }],
    ['with loadingIcon', { props: { loading: true, loadingIcon: 'i-lucide-loader' } }],
    ['with label', { props: { label: 'Label' } }],
    ['with required', { props: { label: 'Label', required: true } }],
    ['with description', { props: { label: 'Label', description: 'Description' } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ['with color neutral', { props: { color: 'neutral', defaultValue: true } }],
    ['with ariaLabel', { attrs: { 'aria-label': 'Aria label' } }],
    ['with trueValue/falseValue as string', { props: { trueValue: 'on', falseValue: 'off', defaultValue: 'on' } }],
    ['with trueValue/falseValue as number', { props: { trueValue: 1, falseValue: 0, defaultValue: 1 } }],
    ['with trueValue/falseValue unchecked', { props: { trueValue: 'on', falseValue: 'off', defaultValue: 'off' } }],
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'inline-flex' } }],
    ['with ui', { props: { ui: { wrapper: 'ms-4' } } }],
    // Slots
    ['with label slot', { slots: { label: () => 'Label slot' } }],
    ['with description slot', { slots: { label: () => 'Description slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Switch, {
      props: {
        modelValue: true,
        required: true,
        label: 'Label',
        description: 'Description'
      }
    })
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  describe('emits', () => {
    test('update:modelValue event', async () => {
      const wrapper = mount(Switch)
      const input = wrapper.findComponent({ name: 'SwitchRoot' })
      await input.vm.$emit('update:modelValue', true)
      expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [[true]] })
    })

    test('change event', async () => {
      const wrapper = mount(Switch)
      const input = wrapper.findComponent({ name: 'SwitchRoot' })
      await input.vm.$emit('update:modelValue', true)
      expect(wrapper.emitted()).toMatchObject({ change: [[{ type: 'change' }]] })
    })

    test('toggle with custom trueValue/falseValue via click', async () => {
      const wrapper = mount(Switch, {
        props: { trueValue: 'on', falseValue: 'off', defaultValue: 'off' }
      })
      const button = wrapper.find('button')

      await button.trigger('click')
      await flushPromises()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['on'])
      expect(wrapper.emitted('change')).toHaveLength(1)

      await button.trigger('click')
      await flushPromises()
      expect(wrapper.emitted('update:modelValue')?.[1]).toEqual(['off'])
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
          <USwitch v-model="state.value" />
        </UFormField>
        `
      })
      const input = wrapper.findComponent({ name: 'SwitchRoot' })
      return {
        wrapper,
        input
      }
    }

    test('validate on change works', async () => {
      const { input, wrapper } = await createForm(['change'])
      await input.setValue(false)
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
