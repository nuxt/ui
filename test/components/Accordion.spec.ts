import { describe, it, expect } from 'vitest'
import Accordion, { type AccordionProps, type AccordionSlots } from '../../src/runtime/components/Accordion.vue'
import ComponentRender from '../component-render'

describe('Accordion', () => {
  const items = [{
    label: 'Getting Started',
    icon: 'i-lucide-info',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
  }, {
    label: 'Installation',
    icon: 'i-lucide-download',
    disabled: true,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
  }, {
    label: 'Theming',
    icon: 'i-lucide-pipette',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
  }, {
    label: 'Layouts',
    icon: 'i-lucide-layout-dashboard',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
  }, {
    label: 'Components',
    icon: 'i-lucide-layers-3',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
  }, {
    label: 'Utilities',
    icon: 'i-lucide-wrench',
    trailingIcon: 'i-lucide-sun',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.',
    slot: 'custom'
  }]

  const props = { items }

  it.each([
    // Props
    ['with items', { props }],
    ['with modelValue', { props: { ...props, modelValue: '1' } }],
    ['with defaultValue', { props: { ...props, defaultValue: '1' } }],
    ['with labelKey', { props: { ...props, labelKey: 'icon' } }],
    ['with as', { props: { ...props, as: 'section' } }],
    ['with type', { props: { ...props, type: 'multiple' as const } }],
    ['with disabled', { props: { ...props, disabled: true } }],
    ['with collapsible', { props: { ...props, collapsible: false } }],
    ['with unmountOnHide', { props: { ...props, unmountOnHide: false } }],
    ['with trailingIcon', { props: { ...props, trailingIcon: 'i-lucide-plus' } }],
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'w-96' } }],
    ['with ui', { props: { ...props, ui: { item: 'border-[var(--ui-border-accented)]' } } }],
    // Slots
    ['with leading slot', { props: { ...props, modelValue: '1' }, slots: { leading: () => 'Leading slot' } }],
    ['with default slot', { props: { ...props, modelValue: '1' }, slots: { default: () => 'Default slot' } }],
    ['with trailing slot', { props: { ...props, modelValue: '1' }, slots: { trailing: () => 'Trailing slot' } }],
    ['with content slot', { props: { ...props, modelValue: '1' }, slots: { content: () => 'Content slot' } }],
    ['with body slot', { props: { ...props, modelValue: '1' }, slots: { body: () => 'Body slot' } }],
    ['with custom slot', { props: { ...props, modelValue: '5' }, slots: { custom: () => 'Custom slot' } }],
    ['with custom body slot', { props: { ...props, modelValue: '5' }, slots: { 'custom-body': () => 'Custom body slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: AccordionProps<typeof items[number]>, slots?: Partial<AccordionSlots<typeof items[number]>> }) => {
    const html = await ComponentRender(nameOrHtml, options, Accordion)
    expect(html).toMatchSnapshot()
  })
})
