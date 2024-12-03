import { describe, it, expect } from 'vitest'
import Breadcrumb, { type BreadcrumbProps, type BreadcrumbSlots } from '../../src/runtime/components/Breadcrumb.vue'
import ComponentRender from '../component-render'

describe('Breadcrumb', () => {
  const items = [{
    label: 'Home',
    avatar: {
      src: 'https://github.com/benjamincanac.png'
    },
    to: '/'
  }, {
    label: 'Components',
    icon: 'i-lucide-box',
    disabled: true
  }, {
    label: 'Breadcrumb',
    to: '/components/breadcrumb',
    icon: 'i-lucide-link',
    slot: 'custom'
  }]

  const props = { items }

  it.each([
    // Props
    ['with items', { props }],
    ['with labelKey', { props: { ...props, labelKey: 'icon' } }],
    ['with separatorIcon', { props: { ...props, separatorIcon: 'i-lucide-minus' } }],
    ['with as', { props: { ...props, as: 'div' } }],
    ['with class', { props: { ...props, class: 'w-48' } }],
    ['with ui', { props: { ...props, ui: { link: 'font-bold' } } }],
    // Slots
    ['with item slot', { props, slots: { item: () => 'Item slot' } }],
    ['with item-leading slot', { props, slots: { 'item-leading': () => 'Item leading slot' } }],
    ['with item-label slot', { props, slots: { 'item-label': () => 'Item label slot' } }],
    ['with item-trailing slot', { props, slots: { 'item-trailing': () => 'Item trailing slot' } }],
    ['with custom slot', { props, slots: { custom: () => 'Custom slot' } }],
    ['with separator slot', { props, slots: { separator: () => '/' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: BreadcrumbProps<typeof items[number]>, slots?: Partial<BreadcrumbSlots<typeof items[number]>> }) => {
    const html = await ComponentRender(nameOrHtml, options, Breadcrumb)
    expect(html).toMatchSnapshot()
  })
})
