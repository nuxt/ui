import { describe, it, expect, test } from 'vitest'
import ContentSurround from '../../../src/runtime/components/content/ContentSurround.vue'
import type { ContentSurroundProps, ContentSurroundSlots } from '../../../src/runtime/components/content/ContentSurround.vue'
import ComponentRender from '../../component-render'
import { UTheme } from '#components'

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

  test('with theme works', async () => {
    const { mountSuspended } = await import('@nuxt/test-utils/runtime')
    const wrapper = await mountSuspended({
      components: { ContentSurround, UTheme },
      template: `
        <UTheme :ui="{ contentSurround: { slots: { root: 'test-theme-class' } } }">
          <ContentSurround :surround="[{ path: '/prev', title: 'Prev' }, { path: '/next', title: 'Next' }]" />
        </UTheme>
      `
    })

    expect(wrapper.find('[data-slot="root"]').classes()).toContain('test-theme-class')
  })
})
