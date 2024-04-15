import { describe, it, expect } from 'vitest'
import Accordion, { type AccordionProps } from '../../src/runtime/components/Accordion.vue'
import ComponentRender from '../component-render'

describe('Accordion', () => {
  const items = [{
    label: 'Getting Started',
    icon: 'i-heroicons-information-circle',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
  }, {
    label: 'Installation',
    icon: 'i-heroicons-arrow-down-tray',
    disabled: true,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
  }, {
    label: 'Theming',
    icon: 'i-heroicons-eye-dropper',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
  }, {
    label: 'Layouts',
    icon: 'i-heroicons-rectangle-group',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
  }, {
    label: 'Components',
    icon: 'i-heroicons-square-3-stack-3d',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
  }, {
    label: 'Utilities',
    slot: 'toto',
    icon: 'i-heroicons-wrench-screwdriver',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
  }]

  it.each([
    // Props
    ['with items', { props: { items } }],
    ['with modelValue', { props: { items, modelValue: '1' } }],
    ['with defaultValue', { props: { items, defaultValue: '1' } }],
    ['with as', { props: { items, as: 'section' } }],
    ['with type', { props: { items, type: 'multiple' as const } }],
    ['with disabled', { props: { items, disabled: true } }],
    ['with collapsible', { props: { items, collapsible: false } }],
    ['with class', { props: { items, class: 'w-96' } }],
    ['with ui', { props: { ui: { items, item: 'border-gray-300 dark:border-gray-700' } } }],
    // Slots
    ['with default slot', { props: { items }, slots: { default: () => 'Default slot' } }],
    ['with content slot', { props: { items }, slots: { content: () => 'Content slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: AccordionProps<typeof items[number]>, slots?: any }) => {
    const html = await ComponentRender(nameOrHtml, options, Accordion)
    expect(html).toMatchSnapshot()
  })
})
