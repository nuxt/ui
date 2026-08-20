import { reactive } from 'vue'
import { describe, it, expect, test } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import WheelPicker from '../../src/runtime/components/WheelPicker.vue'
import { renderEach } from '../component-render'
import { renderForm } from '../utils/form'
import theme from '#build/ui/wheel-picker'

describe('WheelPicker', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const colors = Object.keys(theme.variants.color) as any
  const variants = Object.keys(theme.variants.variant) as any
  const orientations = Object.keys(theme.variants.orientation) as any

  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5']
  const objectItems = [
    { label: 'London', value: 'lon' },
    { label: 'Paris', value: 'par' },
    { label: 'Tokyo', value: 'tok', icon: 'i-lucide-map-pin' },
    { label: 'Berlin', value: 'ber', disabled: true }
  ]

  renderEach(WheelPicker, [
    // Props
    ['with items', { props: { items } }],
    ['with object items', { props: { items: objectItems } }],
    ['with modelValue', { props: { items, modelValue: 'Item 3' } }],
    ['with defaultValue', { props: { items, defaultValue: 'Item 2' } }],
    ['with name', { props: { items, name: 'name' } }],
    ['with placeholder', { props: { placeholder: 'No data' } }],
    ['with disabled', { props: { items, disabled: true } }],
    ['with readonly', { props: { items, readonly: true } }],
    ['with haptics', { props: { items, haptics: true } }],
    ['with sensitivity', { props: { items, sensitivity: 2 } }],
    ['with loop', { props: { items, loop: true } }],
    ['with visibleItems', { props: { items, visibleItems: 3 } }],
    ['with itemHeight', { props: { items, itemHeight: 48 } }],
    ['with ariaLabel', { props: { items, ariaLabel: 'Pick an item' } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { items, size } }]),
    ...colors.map((color: string) => [`with color ${color}`, { props: { items, color, modelValue: 'Item 1' } }]),
    ...variants.map((variant: string) => [`with variant ${variant}`, { props: { items, variant } }]),
    ...orientations.map((orientation: string) => [`with orientation ${orientation}`, { props: { items, orientation } }]),
    ['with as', { props: { items, as: 'section' } }],
    ['with class', { props: { items, class: 'w-40' } }],
    ['with ui', { props: { items, ui: { item: 'font-bold' } } }],
    // Slots
    ['with item slot', { props: { items }, slots: { item: ({ item }: any) => `Item: ${item.label}` } }],
    ['with selected slot', { props: { items }, slots: { selected: ({ item }: any) => `Selected: ${item.label}` } }],
    ['with prefix slot', { props: { items }, slots: { prefix: () => 'Prefix' } }],
    ['with suffix slot', { props: { items }, slots: { suffix: () => 'Suffix' } }],
    ['with empty slot', { props: { items: [] }, slots: { empty: () => 'Nothing here' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(WheelPicker, {
      props: {
        items,
        ariaLabel: 'Accessible wheel',
        modelValue: 'Item 2'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  describe('accessibility', () => {
    test('exposes listbox and option roles', async () => {
      const wrapper = await mountSuspended(WheelPicker, {
        props: { items, modelValue: 'Item 1' }
      })

      const listbox = wrapper.find('[role="listbox"]')
      expect(listbox.exists()).toBe(true)
      expect(listbox.attributes('aria-orientation')).toBe('vertical')

      const selected = wrapper.find('[role="option"][aria-selected="true"]')
      expect(selected.exists()).toBe(true)
      expect(listbox.attributes('aria-activedescendant')).toBe(selected.attributes('id'))
    })

    test('is focusable when enabled and not focusable when disabled', async () => {
      const wrapper = await mountSuspended(WheelPicker, { props: { items } })
      expect(wrapper.find('[role="listbox"]').attributes('tabindex')).toBe('0')

      const disabledWrapper = await mountSuspended(WheelPicker, { props: { items, disabled: true } })
      expect(disabledWrapper.find('[role="listbox"]').attributes('tabindex')).toBe('-1')
    })
  })

  describe('keyboard navigation', () => {
    async function mountKeyboard() {
      const wrapper = await mountSuspended(WheelPicker, {
        props: { items, modelValue: 'Item 3', animationDuration: 0 }
      })
      return { wrapper, listbox: wrapper.find('[role="listbox"]') }
    }

    test('ArrowDown selects the next item', async () => {
      const { wrapper, listbox } = await mountKeyboard()
      await listbox.trigger('keydown', { key: 'ArrowDown' })
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['Item 4'])
    })

    test('ArrowUp selects the previous item', async () => {
      const { wrapper, listbox } = await mountKeyboard()
      await listbox.trigger('keydown', { key: 'ArrowUp' })
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['Item 2'])
    })

    test('Home selects the first item', async () => {
      const { wrapper, listbox } = await mountKeyboard()
      await listbox.trigger('keydown', { key: 'Home' })
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['Item 1'])
    })

    test('End selects the last item', async () => {
      const { wrapper, listbox } = await mountKeyboard()
      await listbox.trigger('keydown', { key: 'End' })
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['Item 5'])
    })

    test('does not move past the boundaries when not looping', async () => {
      const wrapper = await mountSuspended(WheelPicker, {
        props: { items, modelValue: 'Item 1', animationDuration: 0 }
      })
      await wrapper.find('[role="listbox"]').trigger('keydown', { key: 'ArrowUp' })
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })

    test('wraps around the boundaries when looping', async () => {
      const wrapper = await mountSuspended(WheelPicker, {
        props: { items, modelValue: 'Item 1', loop: true, animationDuration: 0 }
      })
      await wrapper.find('[role="listbox"]').trigger('keydown', { key: 'ArrowUp' })
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['Item 5'])
    })

    test('does nothing when disabled', async () => {
      const wrapper = await mountSuspended(WheelPicker, {
        props: { items, modelValue: 'Item 3', disabled: true, animationDuration: 0 }
      })
      await wrapper.find('[role="listbox"]').trigger('keydown', { key: 'ArrowDown' })
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })

    test('does nothing when readonly but stays focusable', async () => {
      const wrapper = await mountSuspended(WheelPicker, {
        props: { items, modelValue: 'Item 3', readonly: true, animationDuration: 0 }
      })
      const listbox = wrapper.find('[role="listbox"]')
      expect(listbox.attributes('tabindex')).toBe('0')
      expect(listbox.attributes('aria-readonly')).toBe('true')
      await listbox.trigger('keydown', { key: 'ArrowDown' })
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })

    test('type-ahead jumps to the matching item', async () => {
      const wrapper = await mountSuspended(WheelPicker, {
        props: { items: objectItems, modelValue: 'lon', animationDuration: 0 }
      })
      // Typing "t" should jump to the first item starting with T → Tokyo.
      await wrapper.find('[role="listbox"]').trigger('keydown', { key: 't' })
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['tok'])
    })

    test('skips disabled items', async () => {
      const wrapper = await mountSuspended(WheelPicker, {
        props: { items: objectItems, modelValue: 'tok', animationDuration: 0 }
      })
      // 'ber' (index 3) is disabled, so moving down from 'tok' should be blocked.
      await wrapper.find('[role="listbox"]').trigger('keydown', { key: 'ArrowDown' })
      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted?.at(-1)).not.toEqual(['ber'])
    })
  })

  describe('emits', () => {
    test('change event', async () => {
      const wrapper = await mountSuspended(WheelPicker, {
        props: { items, modelValue: 'Item 1', animationDuration: 0 }
      })
      await wrapper.find('[role="listbox"]').trigger('keydown', { key: 'ArrowDown' })
      expect(wrapper.emitted('change')?.at(-1)).toEqual([{ value: 'Item 2', index: 1 }])
    })

    test('scroll-start and scroll-end events', async () => {
      const wrapper = await mountSuspended(WheelPicker, {
        props: { items, modelValue: 'Item 1', animationDuration: 0 }
      })
      await wrapper.find('[role="listbox"]').trigger('keydown', { key: 'ArrowDown' })
      expect(wrapper.emitted('scroll-start')).toBeTruthy()
      expect(wrapper.emitted('scroll-end')).toBeTruthy()
    })
  })

  describe('controlled mode', () => {
    test('reflects external modelValue changes', async () => {
      const wrapper = await mountSuspended(WheelPicker, {
        props: { items, modelValue: 'Item 1', animationDuration: 0 }
      })

      await wrapper.setProps({ modelValue: 'Item 4' })
      await flushPromises()

      const selected = wrapper.find('[role="option"][aria-selected="true"]')
      expect(selected.text()).toContain('Item 4')
    })
  })

  describe('form integration', () => {
    test('validates on change', async () => {
      const wrapper = await renderForm({
        state: reactive({ value: 'Item 1' }),
        props: {
          validateOn: ['change'],
          validateOnInputDelay: 0,
          async validate(state: any) {
            if (state.value !== 'Item 2') return [{ name: 'value', message: 'Error message' }]
            return []
          }
        },
        slotTemplate: `
          <UFormField name="value">
            <UWheelPicker v-model="state.value" :items="['Item 1', 'Item 2', 'Item 3']" :animation-duration="0" />
          </UFormField>
        `
      })

      await wrapper.find('[role="listbox"]').trigger('keydown', { key: 'ArrowDown' })
      await flushPromises()
      expect(wrapper.html()).not.toContain('Error message')
    })
  })
})
