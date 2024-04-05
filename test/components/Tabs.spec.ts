import { describe, it, expect } from 'vitest'
import Tabs, { type TabsProps } from '../../src/runtime/components/Tabs.vue'
import ComponentRender from '../component-render'

const items = [{
  label: 'Tab1',
  icon: 'i-heroicons-home',
  content: 'This is the content shown for Tab1'
}, {
  label: 'Tab2',
  icon: 'i-heroicons-user',
  content: 'And, this is the content for Tab2'
}, {
  label: 'Tab3',
  icon: 'i-heroicons-bell',
  content: 'Finally, this is the content for Tab3'
}]

describe('Tabs', () => {
  it.each([
    ['basic case', { props: { items } }],
    ['with class', { props: { items, class: 'w-96' } }],
    ['with ui', { props: { items, ui: { content: 'w-full ring ring-gray-200 dark:ring-gray-800' } } }],
    ['with orientation', { props: { items, orientation: 'vertical' as const } }],
    ['with modelValue', { props: { items, modelValue: '1' } }],
    ['with defaultValue', { props: { items, defaultValue: '1' } }],
    ['with default slot', { props: { items }, slots: { default: () => 'Default slot' } }],
    ['with content slot', { props: { items }, slots: { content: () => 'Content slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: TabsProps<typeof items[number]>, slots?: any }) => {
    const html = await ComponentRender(nameOrHtml, options, Tabs)
    expect(html).toMatchSnapshot()
  })
})
