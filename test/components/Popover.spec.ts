import type { Component } from 'vue'
import { defineComponent, h, nextTick } from 'vue'
import { afterEach, describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import Popover from '../../src/runtime/components/Popover.vue'
import Checkbox from '../../src/runtime/components/Checkbox.vue'
import Switch from '../../src/runtime/components/Switch.vue'

const reference = { getBoundingClientRect: () => ({ x: 0, y: 0, top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, toJSON: () => ({}) }) as DOMRect }

describe('Popover', () => {
  const props = { open: true, portal: false }

  renderEach(Popover, [
    // Props
    ['with open', { props }],
    ['with arrow', { props: { ...props, arrow: true } }],
    ['with class', { props: { ...props, class: 'shadow-xl' } }],
    ['with ui', { props: { ...props, ui: { content: 'shadow-xl' } } }],
    ['with reference', { props: { ...props, reference }, slots: { content: () => 'Content slot' } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }],
    ['with content slot', { props, slots: { content: () => 'Content slot' } }],
    ['with anchor slot', { props, slots: { anchor: () => 'Anchor slot' } }]
  ])

  it('anchors the content to a custom reference without rendering a trigger', async () => {
    const wrapper = await mountSuspended(Popover, {
      props: { ...props, reference },
      slots: { content: () => 'Tour step' }
    })

    // Content renders, positioned against the reference
    expect(wrapper.find('[data-slot="content"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Tour step')

    // No trigger and no leftover anchor placeholder element
    expect(wrapper.find('button').exists()).toBe(false)
    expect(wrapper.find('span[aria-hidden="true"]').exists()).toBe(false)
  })

  it('renders the trigger and anchors to the reference when both are provided', async () => {
    const wrapper = await mountSuspended(Popover, {
      props: { ...props, reference },
      slots: { default: () => 'Trigger', content: () => 'Anchored content' }
    })

    expect(wrapper.text()).toContain('Trigger')
    expect(wrapper.find('[data-slot="content"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Anchored content')
  })

  describe.each([
    { name: 'Checkbox', component: Checkbox as Component },
    { name: 'Switch', component: Switch as Component }
  ])('with $name', ({ component }) => {
    let unmount: (() => void) | undefined

    afterEach(() => {
      unmount?.()
      vi.useRealTimers()
    })

    async function mountControlPopover(popoverProps: Record<string, unknown> = {}, controlProps: Record<string, unknown> = {}) {
      const wrapper = await mountSuspended(defineComponent({
        props: {
          mode: { type: String, default: 'hover' },
          openDelay: { type: Number, default: 0 },
          closeDelay: { type: Number, default: 0 },
          enableTouch: Boolean
        },
        setup(props) {
          return () => h(Popover, {
            ...props,
            mode: props.mode as 'hover' | 'click',
            portal: false
          }, {
            default: () => h(component, {
              id: 'popover-control',
              label: 'Accept terms',
              ...controlProps
            }, { label: () => h('span', 'Custom terms') }),
            content: () => h('p', 'Control help')
          })
        }
      }), { props: popoverProps, attachTo: document.body })
      unmount = () => wrapper.unmount()
      return wrapper
    }

    it('opens when entering the label boundary without duplicating pointer listeners', async () => {
      const onPointerenter = vi.fn()
      const wrapper = await mountControlPopover({}, { onPointerenter })

      // pointerenter does not bubble. Browsers dispatch a separate event to the root when entering its label.
      wrapper.find('[data-slot="root"]').element.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse', bubbles: false }))
      wrapper.find('[data-slot="label"] span').element.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse', bubbles: false }))

      await vi.waitFor(() => expect(wrapper.find('[data-slot="content"]').text()).toBe('Control help'))
      expect(onPointerenter).toHaveBeenCalledTimes(1)
      expect(wrapper.find('[data-slot="base"]').attributes('data-state')).toBe('unchecked')
      expect(wrapper.find('[data-grace-area-trigger]').element).toBe(wrapper.find('[data-slot="root"]').element)
    })

    it('stays open across the control, label and content and closes outside', async () => {
      const wrapper = await mountControlPopover()
      const root = wrapper.find('[data-slot="root"]')

      root.element.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse', bubbles: false }))
      await vi.waitFor(() => expect(wrapper.find('[data-slot="content"]').exists()).toBe(true))
      wrapper.find('[data-slot="base"]').element.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse', bubbles: false }))
      wrapper.find('[data-slot="label"]').element.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse', bubbles: false }))
      expect(wrapper.findComponent(Popover).emitted('update:open')).toEqual([[true]])

      root.element.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse', bubbles: false }))
      const content = wrapper.find('[data-slot="content"]')
      content.element.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse', bubbles: false }))
      await content.trigger('pointermove', { pointerType: 'mouse' })
      expect(wrapper.find('[data-slot="content"]').exists()).toBe(true)

      content.element.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse', bubbles: false }))
      await nextTick()
      document.body.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'mouse', clientX: 1000, clientY: 1000, bubbles: true }))
      await vi.waitFor(() => expect(wrapper.find('[data-slot="content"]').exists()).toBe(false))
    })

    it('cancels delayed opening when leaving the label boundary', async () => {
      const wrapper = await mountControlPopover({ openDelay: 100 })
      vi.useFakeTimers()

      wrapper.find('[data-slot="root"]').element.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse', bubbles: false }))
      await vi.advanceTimersByTimeAsync(99)
      expect(wrapper.find('[data-slot="content"]').exists()).toBe(false)
      wrapper.find('[data-slot="root"]').element.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse', bubbles: false }))
      await vi.advanceTimersByTimeAsync(100)
      expect(wrapper.findComponent(Popover).emitted('update:open')).toBeUndefined()

      wrapper.find('[data-slot="root"]').element.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse', bubbles: false }))
      await vi.advanceTimersByTimeAsync(100)
      expect(wrapper.find('[data-slot="content"]').exists()).toBe(true)
    })

    it('ignores touch hover and preserves opt-in touch activation on the control', async () => {
      const wrapper = await mountControlPopover()
      vi.useFakeTimers()

      wrapper.find('[data-slot="root"]').element.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'touch', bubbles: false }))
      await vi.advanceTimersByTimeAsync(0)
      expect(wrapper.findComponent(Popover).emitted('update:open')).toBeUndefined()

      await wrapper.setProps({ enableTouch: true })
      await wrapper.find('[data-slot="base"]').trigger('pointerup', { pointerType: 'touch' })
      await vi.advanceTimersByTimeAsync(0)
      expect(wrapper.find('[data-slot="content"]').exists()).toBe(true)
      await wrapper.find('[data-slot="base"]').trigger('pointerup', { pointerType: 'touch' })
      await vi.advanceTimersByTimeAsync(0)
      expect(wrapper.find('[data-slot="content"]').exists()).toBe(false)
    })

    it('preserves focus, control attributes and label-click toggling', async () => {
      const wrapper = await mountControlPopover({}, { 'name': 'terms', 'aria-label': 'Accept terms' })
      const button = wrapper.find('[data-slot="base"]')

      ;(button.element as HTMLElement).focus()
      await vi.waitFor(() => expect(wrapper.find('[data-slot="content"]').exists()).toBe(true))
      expect(button.attributes('aria-label')).toBe('Accept terms')
      expect(wrapper.find('[data-slot="root"]').attributes('aria-label')).toBeUndefined()

      ;(button.element as HTMLElement).blur()
      await vi.waitFor(() => expect(wrapper.find('[data-slot="content"]').exists()).toBe(false))
      await wrapper.find('[data-slot="label"]').trigger('click')
      expect(wrapper.findComponent(component).emitted('update:modelValue')).toEqual([[true]])
      expect(wrapper.findComponent(component).emitted('change')).toHaveLength(1)
      expect(button.attributes('data-state')).toBe('checked')
      expect(button.attributes('aria-checked')).toBe('true')
    })

    it('preserves click-mode popovers and control toggling', async () => {
      const wrapper = await mountControlPopover({ mode: 'click' })

      await wrapper.find('[data-slot="label"]').trigger('click')

      await vi.waitFor(() => expect(wrapper.find('[data-slot="content"]').exists()).toBe(true))
      expect(wrapper.findComponent(component).emitted('update:modelValue')).toEqual([[true]])
      expect(wrapper.findComponent(component).emitted('change')).toHaveLength(1)
    })
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Popover, {
      props: {
        open: true,
        portal: false,
        arrow: true

      },
      slots: {
        default: () => 'Default Slot',
        content: () => 'Content Slot',
        anchor: () => 'Anchor Slot'
      }
    })

    expect(await axe(wrapper.element, {
      rules: {
        // RekaUI does not handle nor check for aria-dialog-name in their tests either
        // https://github.com/unovue/reka-ui/blob/v2/packages/core/src/Popover/Popover.test.ts
        'aria-dialog-name': {
          enabled: false
        }
      }
    })).toHaveNoViolations()
  })
})
