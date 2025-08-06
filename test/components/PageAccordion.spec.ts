import { describe, it, expect } from 'vitest'
import PageAccordion from '../../src/runtime/components/PageAccordion.vue'
import type { PageAccordionProps, PageAccordionSlots } from '../../src/runtime/components/PageAccordion.vue'
import ComponentRender from '../component-render'

describe('PageAccordion', () => {
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
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
  }]

  const props = { items }

  it.each([
    // Props
    ['with items', { props }],
    ['with class', { props: { ...props, class: 'max-w-3xl mx-auto' } }],
    ['with ui', { props: { ...props, ui: { trigger: 'text-lg' } } }],
    // Slots
    ['with body slot', { props, slots: { body: () => 'Body slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: PageAccordionProps, slots?: Partial<PageAccordionSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, PageAccordion)
    expect(html).toMatchSnapshot()
  })
})
