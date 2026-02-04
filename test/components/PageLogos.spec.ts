import { describe, it, expect, test } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PageLogos from '../../src/runtime/components/PageLogos.vue'
import type { PageLogosProps, PageLogosSlots } from '../../src/runtime/components/PageLogos.vue'
import ComponentRender from '../component-render'
import { UTheme } from '#components'

describe('PageLogos', () => {
  const items = [
    { src: 'https://avatars.githubusercontent.com/u/739984?v=4', alt: 'Benjamin Canac' },
    { src: 'https://avatars.githubusercontent.com/u/71938701?v=4', alt: 'Hugo Richard' }
  ]
  it.each([
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'text-xl' } }],
    ['with title', { props: { title: 'Title' } }],
    ['with items', { props: { items } }],
    ['with marquee', { props: { marquee: true, items } }],
    ['with ui', { props: { ui: { title: 'font-bold text-xl' } } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: PageLogosProps, slots?: Partial<PageLogosSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, PageLogos)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(PageLogos, {
      props: {
        title: 'Title',
        items
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  test('with theme works', async () => {
    const wrapper = await mountSuspended({
      components: { PageLogos, UTheme },
      template: `
        <UTheme :ui="{ pageLogos: { slots: { root: 'test-theme-class' } } }">
          <PageLogos title="Test" />
        </UTheme>
      `
    })

    expect(wrapper.find('[data-slot="root"]').classes()).toContain('test-theme-class')
  })
})
