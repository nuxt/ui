import { describe } from 'vitest'
import ContentSurround from '../../../src/runtime/components/content/ContentSurround.vue'
import { renderEach } from '../../component-render'

describe('ContentSurround', () => {
  const surround = [{
    path: '/getting-started',
    title: 'Introduction',
    description: 'Nuxt UI harnesses the combined strengths of Reka UI, Tailwind CSS, and Tailwind Variants to offer developers an unparalleled set of tools for creating sophisticated, accessible, and highly performant user interfaces.'
  }, {
    path: '/getting-started/theme',
    title: 'Theme',
    description: 'Learn how to customize Nuxt UI components using Tailwind CSS, CSS variables and the Tailwind Variants API for powerful and flexible theming.'
  }]

  const props = { surround }

  renderEach(ContentSurround, [
    // Props
    ['with surround', { props }],
    ['with prevIcon', { props: { ...props, prevIcon: 'i-lucide-chevron-left' } }],
    ['with nextIcon', { props: { ...props, nextIcon: 'i-lucide-chevron-right' } }],
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'gap-12' } }],
    ['with ui', { props: { ...props, ui: { linkTitle: 'text-xl' } } }],
    // Slots
    ['with link slot', { props, slots: { link: () => 'Link slot' } }],
    ['with link-leading slot', { props, slots: { 'link-leading': () => 'Link leading slot' } }],
    ['with link-title slot', { props, slots: { 'link-title': () => 'Link title slot' } }]
  ])
})
