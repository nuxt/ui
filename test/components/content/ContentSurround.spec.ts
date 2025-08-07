import { describe, it, expect } from 'vitest'
import ContentSurround from '../../../src/runtime/components/content/ContentSurround.vue'
import type { ContentSurroundProps, ContentSurroundSlots } from '../../../src/runtime/components/content/ContentSurround.vue'
import ComponentRender from '../../component-render'

describe('ContentSurround', () => {
  const surround = [{
    path: '/getting-started',
    title: 'Nuxt UI',
    description: 'A collection of premium Vue components to create beautiful & responsive Nuxt applications in minutes.'
  }, {
    path: '/getting-started/theming',
    title: 'Theming',
    description: 'Learn how to customize Nuxt UI components.'
  }]

  const props = { surround }

  it.each([
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
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ContentSurroundProps, slots?: Partial<ContentSurroundSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, ContentSurround)
    expect(html).toMatchSnapshot()
  })
})
