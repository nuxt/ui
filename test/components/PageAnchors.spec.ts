import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import PageAnchors from '../../src/runtime/components/PageAnchors.vue'

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

  renderEach(PageAnchors, [
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
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(PageAnchors, {
      props: {
        links
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
