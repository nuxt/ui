import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Breadcrumb from '../../src/runtime/components/Breadcrumb.vue'
import type { BreadcrumbProps, BreadcrumbSlots } from '../../src/runtime/components/Breadcrumb.vue'
import ComponentRender from '../component-render'

describe('Breadcrumb', () => {
  const items = [{
    label: 'Home',
    avatar: {
      src: 'https://github.com/benjamincanac.png',
      alt: 'Benjamin Canac'
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
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: BreadcrumbProps, slots?: Partial<BreadcrumbSlots & { custom: () => 'Custom slot' }> }) => {
    const html = await ComponentRender(nameOrHtml, { ...options, route: '/components/breadcrumb' }, Breadcrumb)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Breadcrumb, {
      props
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  it('highlights the current route link as active', async () => {
    const wrapper = await mountSuspended(Breadcrumb, {
      props: {
        items: [{
          label: 'Home',
          to: '/'
        }, {
          label: 'Components',
          to: '/components'
        }, {
          label: 'Breadcrumb',
          to: '/components/breadcrumb'
        }]
      },
      route: '/components'
    })

    const activeLink = wrapper.find('[aria-current="page"]')
    expect(activeLink.exists()).toBe(true)
    expect(activeLink.html()).toContain('Breadcrumb')
  })
})
