import { defineComponent, h, nextTick, ref } from 'vue'
import { describe, it, expect, test } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import Slider from '../../src/runtime/components/Slider.vue'
import FormField from '../../src/runtime/components/FormField.vue'
import theme from '#build/ui/slider'
import { flushPromises, mount } from '@vue/test-utils'
import { renderForm } from '../utils/form'
import type { FormInputEvents } from '../../src/module'

describe('Slider', () => {
  const sizes = Object.keys(theme.variants.size) as any

  renderEach(Slider, [
    // Props
    ['with modelValue', { props: { modelValue: 10 } }],
    ['with defaultValue', { props: { defaultValue: 10 } }],
    ['with multiple thumbs', { props: { defaultValue: [0, 10] } }],
    ['with name', { props: { name: 'custom-name' } }],
    ['with disabled', { props: { disabled: true } }],
    ['with inverted', { props: { inverted: true } }],
    ['with orientation vertical', { props: { orientation: 'vertical' } }],
    ['with min max step', { props: { min: 4, max: 12, step: 2 } }],
    ['with min steps between thumbs', { props: { defaultValue: [0, 30], minStepsBetweenThumbs: 30 } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ['with color neutral', { props: { color: 'neutral', defaultValue: 10 } }],
    ['with ariaLabel', { attrs: { 'aria-label': 'Aria label' } }],
    ['with ariaLabel and multiple thumbs', { props: { defaultValue: [0, 10] }, attrs: { 'aria-label': 'Aria label' } }],
    ['with ariaValueText', { props: { modelValue: 10 }, attrs: { 'aria-valuetext': '10 milliseconds' } }],
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'w-48' } }],
    ['with ui', { props: { ui: { track: 'bg-elevated' } } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Slider, {
      props: {
        modelValue: 10

      }
    })
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  describe('aria', () => {
    async function renderThumbs(options: { props?: any, attrs?: any } = {}) {
      const wrapper = await mountSuspended(Slider, options)
      return { wrapper, thumbs: wrapper.findAll('[role="slider"]') }
    }

    test('names a single thumb from aria-label', async () => {
      const { wrapper, thumbs } = await renderThumbs({ props: { modelValue: 10 }, attrs: { 'aria-label': 'Volume' } })

      expect(thumbs).toHaveLength(1)
      expect(thumbs[0]!.attributes('aria-label')).toBe('Volume')
      expect(wrapper.get('[data-slot="root"]').attributes('aria-label')).toBeUndefined()
    })

    test('names a single thumb from aria-labelledby', async () => {
      const { thumbs } = await renderThumbs({ props: { modelValue: 10 }, attrs: { 'aria-labelledby': 'volume-label' } })

      expect(thumbs[0]!.attributes('aria-labelledby')).toBe('volume-label')
      expect(thumbs[0]!.attributes('aria-label')).toBeUndefined()
    })

    test('falls back to a default label when a single thumb is unnamed', async () => {
      const { thumbs } = await renderThumbs({ props: { modelValue: 10 } })

      expect(thumbs[0]!.attributes('aria-label')).toBe('Thumb')
    })

    test('keeps Reka UI default labels for two thumbs', async () => {
      const { thumbs } = await renderThumbs({ props: { modelValue: [0, 10] } })

      expect(thumbs.map(thumb => thumb.attributes('aria-label'))).toStrictEqual(['Minimum', 'Maximum'])
    })

    test('keeps Reka UI default labels for three or more thumbs', async () => {
      const { thumbs } = await renderThumbs({ props: { modelValue: [0, 10, 20] } })

      expect(thumbs.map(thumb => thumb.attributes('aria-label'))).toStrictEqual(['Value 1 of 3', 'Value 2 of 3', 'Value 3 of 3'])
    })

    test('groups multiple thumbs under an aria-label instead of naming each of them', async () => {
      const { wrapper, thumbs } = await renderThumbs({ props: { modelValue: [10, 90] }, attrs: { 'aria-label': 'Price range' } })

      expect(thumbs.map(thumb => thumb.attributes('aria-label'))).toStrictEqual(['Minimum', 'Maximum'])

      const root = wrapper.get('[data-slot="root"]')
      expect(root.attributes('aria-label')).toBe('Price range')
      expect(root.attributes('role')).toBe('group')
    })

    test('groups three or more thumbs under an aria-label instead of naming each of them', async () => {
      const { wrapper, thumbs } = await renderThumbs({ props: { modelValue: [0, 10, 20] }, attrs: { 'aria-label': 'Levels' } })

      expect(thumbs.map(thumb => thumb.attributes('aria-label'))).toStrictEqual(['Value 1 of 3', 'Value 2 of 3', 'Value 3 of 3'])

      const root = wrapper.get('[data-slot="root"]')
      expect(root.attributes('aria-label')).toBe('Levels')
      expect(root.attributes('role')).toBe('group')
    })

    test('does not group an unlabelled slider', async () => {
      const { wrapper } = await renderThumbs({ props: { modelValue: [10, 90] } })

      expect(wrapper.get('[data-slot="root"]').attributes('role')).toBeUndefined()
    })

    test('forwards aria-valuetext to the thumb', async () => {
      const { thumbs } = await renderThumbs({ props: { modelValue: 10 }, attrs: { 'aria-valuetext': '10 milliseconds' } })

      expect(thumbs[0]!.attributes('aria-valuetext')).toBe('10 milliseconds')
    })

    test('forwards validity attributes to the thumb', async () => {
      const { wrapper, thumbs } = await renderThumbs({ props: { modelValue: 10 }, attrs: { 'aria-invalid': 'true', 'aria-errormessage': 'volume-error' } })

      expect(thumbs[0]!.attributes('aria-invalid')).toBe('true')
      expect(thumbs[0]!.attributes('aria-errormessage')).toBe('volume-error')
      expect(wrapper.get('[data-slot="root"]').attributes('aria-invalid')).toBeUndefined()
    })

    test('keeps non-aria attributes on the root', async () => {
      const { wrapper, thumbs } = await renderThumbs({ props: { modelValue: 10 }, attrs: { 'data-testid': 'slider' } })

      expect(wrapper.get('[data-slot="root"]').attributes('data-testid')).toBe('slider')
      expect(thumbs[0]!.attributes('data-testid')).toBeUndefined()
    })

    // Pin that attributes changed by a parent re-render still reach the thumb.
    test('tracks aria attributes changed after mount', async () => {
      const label = ref<string | undefined>('Volume')
      const Parent = defineComponent({
        setup: () => () => h(Slider, { 'modelValue': 10, 'aria-label': label.value })
      })

      const wrapper = await mountSuspended(Parent)
      expect(wrapper.get('[role="slider"]').attributes('aria-label')).toBe('Volume')

      label.value = undefined
      await nextTick()
      await nextTick()

      expect(wrapper.get('[role="slider"]').attributes('aria-label')).toBe('Thumb')
    })

    test('tracks aria attributes added after mounting without any', async () => {
      const extra = ref<Record<string, string>>({})
      const Parent = defineComponent({
        setup: () => () => h(Slider, { modelValue: 10, ...extra.value })
      })

      const wrapper = await mountSuspended(Parent)
      expect(wrapper.get('[role="slider"]').attributes('aria-label')).toBe('Thumb')

      extra.value = { 'aria-label': 'Volume', 'data-testid': 'slider' }
      await nextTick()
      await nextTick()

      expect(wrapper.get('[role="slider"]').attributes('aria-label')).toBe('Volume')
      expect(wrapper.get('[data-slot="root"]').attributes('data-testid')).toBe('slider')
    })

    test('keeps a caller role on a grouped slider', async () => {
      const { wrapper } = await renderThumbs({ props: { modelValue: [10, 90] }, attrs: { 'role': 'application', 'aria-label': 'Price range' } })

      expect(wrapper.get('[data-slot="root"]').attributes('role')).toBe('application')
    })

    // The thumb carries both the caller's `aria-*` and the ones `useFormField` derives.
    test('merges the form aria attributes with a caller label on the thumb', async () => {
      const wrapper = await mountSuspended(FormField, {
        props: { error: 'Error' },
        slots: { default: () => h(Slider, { 'modelValue': 10, 'aria-label': 'Volume' }) }
      })

      const thumb = wrapper.get('[role="slider"]')
      expect(thumb.attributes('aria-label')).toBe('Volume')
      expect(thumb.attributes('aria-invalid')).toBe('true')
      expect(thumb.attributes('aria-describedby')).toMatch(/-error$/)
    })
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
