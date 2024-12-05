import { describe, it, expect, test } from 'vitest'
import Slider, { type SliderProps } from '../../src/runtime/components/Slider.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/slider'
import { flushPromises, mount } from '@vue/test-utils'
import { renderForm } from '../utils/form'
import type { FormInputEvents } from '~/src/module'

describe('Slider', () => {
  const sizes = Object.keys(theme.variants.size) as any

  it.each([
    // Props
    ['with modelValue', { props: { modelValue: 10 } }],
    ['with defaultValue', { props: { defaultValue: 10 } }],
    ['with multiple thumbs', { props: { defaultValue: [0, 10] } }],
    ['with name', { props: { name: 'custom-name' } }],
    ['with disabled', { props: { disabled: true } }],
    ['with inverted', { props: { inverted: true } }],
    ['with orientation vertical', { props: { orientation: 'vertical' as const } }],
    ['with min max step', { props: { min: 4, max: 12, step: 2 } }],
    ['with min steps between thumbs', { props: { defaultValue: [0, 30], minStepsBetweenThumbs: 30 } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ['with color neutral', { props: { color: 'neutral', defaultValue: 10 } }],
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'w-48' } }],
    ['with ui', { props: { ui: { track: 'bg-[var(--ui-bg-elevated)]' } } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: SliderProps }) => {
    const html = await ComponentRender(nameOrHtml, options, Slider)
    expect(html).toMatchSnapshot()
  })

  describe('emits', () => {
    test('update:modelValue event', async () => {
      const wrapper = mount(Slider)

      const input = wrapper.findComponent({ name: 'SliderRoot' })
      input.vm.$emit('update:modelValue', 1)

      expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [[1], [1]] })
    })

    test('change event', async () => {
      const wrapper = mount(Slider)

      const input = wrapper.findComponent({ name: 'SliderRoot' })
      input.vm.$emit('valueCommit')

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
            if (state.value < 20)
              return [{ name: 'value', message: 'Error message' }]
            return []
          }
        },
        slotTemplate: `
        <UFormField name="value">
          <USlider v-model="state.value" />
        </UFormField>
        `
      })
      const input = wrapper.findComponent({ name: 'SliderRoot' })
      return {
        wrapper,
        input
      }
    }

    test('validate on change works', async () => {
      const { input, wrapper } = await createForm(['change'])

      await input.setValue(10)
      input.vm.$emit('valueCommit')
      await flushPromises()
      expect(wrapper.text()).toContain('Error message')

      await input.setValue(40)
      input.vm.$emit('valueCommit')
      await flushPromises()
      expect(wrapper.text()).not.toContain('Error message')
    })

    test('validate on input works', async () => {
      const { input, wrapper } = await createForm(['input'])
      await input.setValue(10)
      await flushPromises()
      expect(wrapper.text()).toContain('Error message')

      await input.setValue(40)
      await flushPromises()
      expect(wrapper.text()).not.toContain('Error message')
    })
  })
})
