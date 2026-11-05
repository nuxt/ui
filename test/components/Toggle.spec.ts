import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Toggle from '../../src/runtime/components/Toggle.vue'
import { renderEach } from '../component-render'

describe('Toggle', () => {
  const props = { 'icon': 'i-lucide-bold', 'aria-label': 'Bold' }

  renderEach(Toggle, [
    // Props
    ['with label', { props: { label: 'Bold' } }],
    ['with icon', { props }],
    ['with defaultValue', { props: { ...props, defaultValue: true } }],
    ['with modelValue', { props: { ...props, modelValue: true } }],
    ['with disabled', { props: { ...props, disabled: true } }],
    ['with color', { props: { ...props, color: 'primary' } }],
    ['with variant', { props: { ...props, variant: 'outline' } }],
    ['with activeColor', { props: { ...props, modelValue: true, activeColor: 'neutral' } }],
    ['with activeVariant', { props: { ...props, modelValue: true, activeVariant: 'solid' } }],
    ['with size', { props: { ...props, size: 'xl' } }],
    ['with class', { props: { ...props, class: 'rounded-full' } }],
    ['with ui', { props: { ...props, ui: { leadingIcon: 'size-6' } } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with leading slot', { props, slots: { leading: () => 'Leading slot' } }],
    ['with trailing slot', { props, slots: { trailing: () => 'Trailing slot' } }]
  ])

  it('toggles the pressed state on click', async () => {
    const wrapper = await mountSuspended(Toggle, { props })
    const button = wrapper.find('button')

    expect(button.attributes('aria-pressed')).toBe('false')
    await button.trigger('click')
    expect(button.attributes('aria-pressed')).toBe('true')
    expect(button.attributes('data-state')).toBe('on')
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Toggle, { props })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
