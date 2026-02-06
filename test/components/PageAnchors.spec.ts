import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PageAnchors from '../../src/runtime/components/PageAnchors.vue'
import type { PageAnchorsProps, PageAnchorsSlots } from '../../src/runtime/components/PageAnchors.vue'
import ComponentRender from '../component-render'

describe('PageAnchors', () => {
  const links = [{
    label: 'Documentation',
    icon: 'i-lucide-book-open',
    to: '/docs'
  }, {
    label: 'Playground',
    icon: 'i-simple-icons-stackblitz',
    to: '/playground'
  }, {
    label: 'Roadmap',
    icon: 'i-lucide-map',
    to: '/roadmap',
    active: true
  }, {
    label: 'Releases',
    icon: 'i-lucide-rocket',
    to: 'https://github.com/nuxt/ui/releases',
    target: '_blank'
  }]

  const props = { links }

  it.each([
    // Props
    ['with links', { props }],
    ['with as', { props: { ...props, as: 'div' } }],
    ['with class', { props: { ...props, class: 'lg:mb-12' } }],
    ['with ui', { props: { ...props, ui: { list: 'gap-6' } } }],
    // Slots
    ['with link slot', { props, slots: { link: () => 'Link slot' } }],
    ['with link-leading slot', { props, slots: { 'link-leading': () => 'Link leading slot' } }],
    ['with link-label slot', { props, slots: { 'link-label': () => 'Link label slot' } }],
    ['with link-trailing slot', { props, slots: { 'link-trailing': () => 'Link trailing slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: PageAnchorsProps, slots?: Partial<PageAnchorsSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, PageAnchors)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(PageAnchors, {
      props: {
        links
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
