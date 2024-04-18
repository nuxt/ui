import { describe, it, expect } from 'vitest'
import Breadcrumb, { type BreadcrumbProps, type BreadcrumbSlots } from '../../src/runtime/components/Breadcrumb.vue'
import ComponentRender from '../component-render'

describe('Breadcrumb', () => {
  const items = [{
    label: 'Home',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/739984?v=4'
    },
    to: '/'
  }, {
    label: 'Navigation',
    icon: 'i-heroicons-square-3-stack-3d',
    disabled: true
  }, {
    label: 'Breadcrumb',
    icon: 'i-heroicons-link',
    slot: 'custom'
  }]

  const props = { items }

  it.each([
    // Props
    ['with items', { props }],
    ['with separatorIcon', { props: { ...props, separatorIcon: 'i-heroicons-minus' } }],
    ['with class', { props: { ...props, class: 'w-48' } }],
    ['with ui', { props: { ui: { ...props, link: 'font-bold' } } }],
    // Slots
    ['with leading slot', { props, slots: { leading: () => 'Leading slot' } }],
    ['with label slot', { props, slots: { default: () => 'Label slot' } }],
    ['with trailing slot', { props, slots: { trailing: () => 'Trailing slot' } }],
    ['with item slot', { props, slots: { item: () => 'Item slot' } }],
    ['with custom slot', { props, slots: { custom: () => 'Custom slot' } }],
    ['with separator slot', { props, slots: { separator: () => '/' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: BreadcrumbProps<typeof items[number]>, slots?: Partial<BreadcrumbSlots<typeof items[number]>> }) => {
    const html = await ComponentRender(nameOrHtml, options, Breadcrumb)
    expect(html).toMatchSnapshot()
  })
})
