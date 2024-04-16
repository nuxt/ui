import { describe, it, expect } from 'vitest'
import Breadcrumb, { type BreadcrumbProps } from '../../src/runtime/components/Breadcrumb.vue'
import ComponentRender from '../component-render'

describe('Breadcrumb', () => {
  const links = [{
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
    icon: 'i-heroicons-link'
  }]

  it.each([
    // Props
    ['with links', { props: { links } }],
    ['with separatorIcon', { props: { links, separatorIcon: 'i-heroicons-minus' } }],
    ['with class', { props: { class: 'w-48' } }],
    ['with ui', { props: { ui: { link: 'font-bold' } } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with leading slot', { slots: { leading: () => 'Leading slot' } }],
    ['with trailing slot', { slots: { trailing: () => 'Trailing slot' } }],
    ['with separator slot', { slots: { separator: () => '/' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: BreadcrumbProps<typeof links[number]>, slots?: any }) => {
    const html = await ComponentRender(nameOrHtml, options, Breadcrumb)
    expect(html).toMatchSnapshot()
  })
})
