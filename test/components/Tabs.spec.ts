import { describe, it, expect } from 'vitest'
import Tabs, { type TabsProps, type TabsSlots } from '../../src/runtime/components/Tabs.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/tabs'

describe('Tabs', () => {
  const colors = Object.keys(theme.variants.color) as any
  const variants = Object.keys(theme.variants.variant) as any

  const items = [{
    label: 'Tab1',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/739984?v=4'
    },
    content: 'This is the content shown for Tab1'
  }, {
    label: 'Tab2',
    icon: 'i-heroicons-user',
    content: 'And, this is the content for Tab2'
  }, {
    label: 'Tab3',
    icon: 'i-heroicons-bell',
    content: 'Finally, this is the content for Tab3',
    slot: 'custom'
  }]

  const props = { items }

  it.each([
    // Props
    ['with items', { props }],
    ['with modelValue', { props: { ...props, modelValue: '1' } }],
    ['with defaultValue', { props: { ...props, defaultValue: '1' } }],
    ['with orientation vertical', { props: { ...props, orientation: 'vertical' as const } }],
    ...colors.map((color: string) => [`with color ${color}`, { props: { ...props, color } }]),
    ...variants.map((variant: string) => [`with variant ${variant}`, { props: { ...props, variant } }]),
    ['without content', { props: { ...props, content: false } }],
    ['with class', { props: { ...props, class: 'w-96' } }],
    ['with ui', { props: { ...props, ui: { content: 'w-full ring ring-gray-200 dark:ring-gray-800' } } }],
    // Slots
    ['with leading slot', { props, slots: { leading: () => 'Leading slot' } }],
    ['with default slot', { props, slots: { default: () => 'Default slot' } }],
    ['with trailing slot', { props, slots: { trailing: () => 'Trailing slot' } }],
    ['with content slot', { props, slots: { content: () => 'Content slot' } }],
    ['with custom slot', { props, slots: { custom: () => 'Custom slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: TabsProps<typeof items[number]>, slots?: Partial<TabsSlots<typeof items[number]>> }) => {
    const html = await ComponentRender(nameOrHtml, options, Tabs)
    expect(html).toMatchSnapshot()
  })
})
