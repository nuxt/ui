import { defineComponent, h } from 'vue'
import { afterEach, describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import { TooltipProvider } from 'reka-ui'
import Tooltip from '../../src/runtime/components/Tooltip.vue'
import Checkbox from '../../src/runtime/components/Checkbox.vue'
import type { CheckboxProps } from '../../src/runtime/components/Checkbox.vue'

const TooltipWrapper = defineComponent({
  components: {
    TooltipProvider,
    UTooltip: Tooltip
  },
  inheritAttrs: false,
  template: `<TooltipProvider>
  <UTooltip v-bind="$attrs">
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </UTooltip>
</TooltipProvider>`
})

const TooltipProviderContentWrapper = defineComponent({
  components: {
    TooltipProvider,
    UTooltip: Tooltip
  },
  inheritAttrs: false,
  template: `<TooltipProvider :content="{ side: 'right', sideOffset: 12 }">
  <UTooltip v-bind="$attrs">
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </UTooltip>
</TooltipProvider>`
})

describe('Tooltip', () => {
  const props = { text: 'Tooltip', open: true, portal: false }

  renderEach(TooltipWrapper, [
    // Props
    ['with text', { props }],
    ['with arrow', { props: { ...props, arrow: true } }],
    ['with kbds', { props: { ...props, kbds: ['meta', 'K'] } }],
    ['with class', { props: { ...props, class: 'text-sm' } }],
    ['with ui', { props: { ...props, ui: { content: 'text-sm' } } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }],
    ['with content slot', { props, slots: { content: () => 'Content slot' } }]
  ])

  it('respects provider content defaults', async () => {
    const wrapper = await mountSuspended(TooltipProviderContentWrapper, {
      props: { text: 'Tooltip', open: true, portal: false }
    })

    const content = wrapper.find('[data-slot="content"]')
    expect(content.attributes('data-side')).toBe('right')
  })

  it('allows per-tooltip content to override provider defaults', async () => {
    const wrapper = await mountSuspended(TooltipProviderContentWrapper, {
      props: { text: 'Tooltip', open: true, portal: false, content: { side: 'top' } }
    })

    const content = wrapper.find('[data-slot="content"]')
    expect(content.attributes('data-side')).toBe('top')
  })

  it('labels the tooltip with the text and resolved kbds', async () => {
    const wrapper = await mountSuspended(TooltipWrapper, {
      props: { ...props, kbds: ['meta', 'K'] }
    })

    expect(wrapper.find('[role="tooltip"]').text()).toBe('Tooltip Ctrl K')
  })

  describe('with Checkbox', () => {
    let unmount: (() => void) | undefined

    afterEach(() => {
      unmount?.()
      vi.useRealTimers()
    })

    async function mountCheckboxTooltip(checkboxProps: CheckboxProps & Record<string, unknown> = {}, labelSlot = false) {
      const wrapper = await mountSuspended(defineComponent({
        props: {
          disabled: Boolean,
          delayDuration: { type: Number, default: 0 }
        },
        setup(props) {
          return () => h(TooltipProvider, { delayDuration: props.delayDuration }, {
            default: () => h(Tooltip, {
              text: 'Checkbox help',
              portal: false,
              disabled: props.disabled,
              disableHoverableContent: true
            }, {
              default: () => h(Checkbox, {
                id: 'tooltip-checkbox',
                label: 'Accept terms',
                ...checkboxProps
              }, labelSlot ? { label: () => h('span', 'Custom terms') } : undefined)
            })
          })
        }
      }), { attachTo: document.body })
      unmount = () => wrapper.unmount()
      return wrapper
    }

    it.each([undefined, 'list', 'card'] as const)('opens over the label with variant %s', async (variant) => {
      const wrapper = await mountCheckboxTooltip({ variant })

      await wrapper.find('[data-slot="label"]').trigger('pointermove', { pointerType: 'mouse' })

      await vi.waitFor(() => expect(wrapper.find('[role="tooltip"]').text()).toBe('Checkbox help'))
      expect(wrapper.find('[data-slot="base"]').attributes('data-state')).toBe('unchecked')
      expect(wrapper.find('[data-grace-area-trigger]').element).toBe(wrapper.find('[data-slot="root"]').element)
    })

    it('opens over nested label slot content', async () => {
      const wrapper = await mountCheckboxTooltip({}, true)

      await wrapper.find('[data-slot="label"] span').trigger('pointermove', { pointerType: 'mouse' })

      await vi.waitFor(() => expect(wrapper.find('[role="tooltip"]').exists()).toBe(true))
    })

    it('stays open between the box and label and closes when leaving the root', async () => {
      const onPointermove = vi.fn()
      const wrapper = await mountCheckboxTooltip({ onPointermove })
      const button = wrapper.find('[data-slot="base"]')

      await button.trigger('pointermove', { pointerType: 'mouse' })
      await vi.waitFor(() => expect(wrapper.find('[role="tooltip"]').exists()).toBe(true))
      button.element.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse', bubbles: false }))
      await wrapper.find('[data-slot="label"]').trigger('pointermove', { pointerType: 'mouse' })

      expect(wrapper.findComponent(Tooltip).emitted('update:open')).toEqual([[true]])
      expect(onPointermove).toHaveBeenCalledTimes(2)

      await wrapper.find('[data-slot="root"]').trigger('pointerleave', { pointerType: 'mouse' })
      await vi.waitFor(() => expect(wrapper.find('[role="tooltip"]').exists()).toBe(false))
    })

    it('cancels the opening delay when leaving the root', async () => {
      const wrapper = await mountCheckboxTooltip()
      await wrapper.setProps({ delayDuration: 100 })
      vi.useFakeTimers()

      await wrapper.find('[data-slot="label"]').trigger('pointermove', { pointerType: 'mouse' })
      await vi.advanceTimersByTimeAsync(99)
      expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)
      await wrapper.find('[data-slot="root"]').trigger('pointerleave', { pointerType: 'mouse' })
      await vi.advanceTimersByTimeAsync(100)
      expect(wrapper.findComponent(Tooltip).emitted('update:open')).toBeUndefined()

      await wrapper.find('[data-slot="label"]').trigger('pointermove', { pointerType: 'mouse' })
      await vi.advanceTimersByTimeAsync(100)
      expect(wrapper.find('[role="tooltip"]').exists()).toBe(true)
    })

    it('ignores touch hover and refreshes listeners when disabled changes', async () => {
      const wrapper = await mountCheckboxTooltip()
      vi.useFakeTimers()

      await wrapper.find('[data-slot="label"]').trigger('pointermove', { pointerType: 'touch' })
      await vi.advanceTimersByTimeAsync(0)
      expect(wrapper.findComponent(Tooltip).emitted('update:open')).toBeUndefined()

      await wrapper.setProps({ disabled: true })
      await wrapper.find('[data-slot="label"]').trigger('pointermove', { pointerType: 'mouse' })
      await vi.advanceTimersByTimeAsync(0)
      expect(wrapper.findComponent(Tooltip).emitted('update:open')).toBeUndefined()

      await wrapper.setProps({ disabled: false })
      await wrapper.find('[data-slot="label"]').trigger('pointermove', { pointerType: 'mouse' })
      await vi.advanceTimersByTimeAsync(0)
      expect(wrapper.find('[role="tooltip"]').exists()).toBe(true)
    })

    it('preserves keyboard focus, accessible description and checkbox state', async () => {
      const wrapper = await mountCheckboxTooltip({ 'name': 'terms', 'aria-label': 'Accept terms' })
      const button = wrapper.find('[data-slot="base"]')

      ;(button.element as HTMLElement).focus()
      await vi.waitFor(() => expect(wrapper.find('[role="tooltip"]').exists()).toBe(true))
      expect(button.attributes('aria-describedby')).toBe(wrapper.find('[role="tooltip"]').attributes('id'))
      expect(button.attributes('aria-label')).toBe('Accept terms')
      expect(wrapper.find('[data-slot="root"]').attributes('aria-describedby')).toBeUndefined()
      expect(await axe(wrapper.element)).toHaveNoViolations()

      ;(button.element as HTMLElement).blur()
      await vi.waitFor(() => expect(wrapper.find('[role="tooltip"]').exists()).toBe(false))
      await wrapper.find('[data-slot="label"]').trigger('click')
      expect(wrapper.findComponent(Checkbox).emitted('update:modelValue')).toEqual([[true]])
      expect(wrapper.findComponent(Checkbox).emitted('change')).toHaveLength(1)
      expect(button.attributes('data-state')).toBe('checked')
      expect(button.attributes('aria-checked')).toBe('true')
    })
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(TooltipWrapper, {
      props: {
        ...props,
        arrow: true,
        kbds: ['meta', 'K']
      }
    })
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
