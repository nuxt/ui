import { describe, it, expect } from 'vitest'
import Accordion, { type AccordionProps, type AccordionSlots } from '../../src/runtime/components/Accordion.vue'
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
    icon: 'i-heroicons-wrench-screwdriver',
    trailingIcon: 'i-heroicons-sun',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.',
    slot: 'custom'
  }]

  const props = { items }

  it.each([
    // Props
    ['with items', { props }],
    ['with modelValue', { props: { ...props, modelValue: '1' } }],
    ['with defaultValue', { props: { ...props, defaultValue: '1' } }],
    ['with as', { props: { ...props, as: 'section' } }],
    ['with type', { props: { ...props, type: 'multiple' as const } }],
    ['with disabled', { props: { ...props, disabled: true } }],
    ['with collapsible', { props: { ...props, collapsible: false } }],
    ['with trailingIcon', { props: { ...props, trailingIcon: 'i-heroicons-plus' } }],
    ['with class', { props: { ...props, class: 'w-96' } }],
    ['with ui', { props: { ...props, ui: { item: 'border-gray-300 dark:border-gray-700' } } }],
    // Slots
    ['with leading slot', { props, slots: { leading: () => 'Leading slot' } }],
    ['with default slot', { props, slots: { default: () => 'Default slot' } }],
    ['with trailing slot', { props, slots: { trailing: () => 'Trailing slot' } }],
    ['with content slot', { props, slots: { content: () => 'Content slot' } }],
    ['with custom slot', { props, slots: { custom: () => 'Custom slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: AccordionProps<typeof items[number]>, slots?: Partial<AccordionSlots<typeof items[number]>> }) => {
    const html = await ComponentRender(nameOrHtml, options, Accordion)
    expect(html).toMatchSnapshot()
  })
})
