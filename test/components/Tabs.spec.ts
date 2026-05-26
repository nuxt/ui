import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import Tabs from '../../src/runtime/components/Tabs.vue'
import theme from '#build/ui/tabs'

describe('Tabs', () => {
  const variants = Object.keys(theme.variants.variant) as any
  const sizes = Object.keys(theme.variants.size) as any

  const items = [{
    label: 'Tab1',
    avatar: {
      src: 'https://github.com/benjamincanac.png',
      alt: 'Benjamín Canac'
    },
    content: 'This is the content shown for Tab1'
  }, {
    label: 'Tab2',
    icon: 'i-lucide-user',
    content: 'And, this is the content for Tab2'
  }, {
    label: 'Tab3',
    icon: 'i-lucide-bell',
    content: 'Finally, this is the content for Tab3',
    slot: 'custom',
    badge: 'badge'
  }]

  const props = { items }

  renderEach(Tabs, [
    // Props
    ['with items', { props }],
    ['with modelValue', { props: { ...props, modelValue: '1' } }],
    ['with defaultValue', { props: { ...props, defaultValue: '1' } }],
    ['with valueKey', { props: { ...props, valueKey: 'label', defaultValue: 'Tab1' } }],
    ['with labelKey', { props: { ...props, labelKey: 'icon' } }],
    ['with orientation vertical', { props: { ...props, orientation: 'vertical' } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { ...props, size } }]),
    ...variants.map((variant: string) => [`with primary variant ${variant}`, { props: { ...props, variant } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant}`, { props: { ...props, variant, color: 'neutral' } }]),
    ['without content', { props: { ...props, content: false } }],
    ['with unmountOnHide', { props: { ...props, unmountOnHide: false } }],
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'w-96' } }],
    ['with ui', { props: { ...props, ui: { content: 'w-full ring ring-default' } } }],
    // Slots
    ['with leading slot', { props, slots: { leading: () => 'Leading slot' } }],
    ['with default slot', { props, slots: { default: () => 'Default slot' } }],
    ['with trailing slot', { props, slots: { trailing: () => 'Trailing slot' } }],
    ['with content slot', { props, slots: { content: () => 'Content slot' } }],
    ['with custom slot', { props, slots: { custom: () => 'Custom slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Tabs, {
      props: {
        items,
        modelValue: '0'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
