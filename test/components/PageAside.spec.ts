import { describe, it, expect, test } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PageAside from '../../src/runtime/components/PageAside.vue'
import type { PageAsideProps, PageAsideSlots } from '../../src/runtime/components/PageAside.vue'
import ComponentRender from '../component-render'
import { UTheme } from '#components'

describe('PageAside', () => {
  it.each([
    // Props
    ['with as', { props: { as: 'div' } }],
    ['with class', { props: { class: 'lg:flex' } }],
    ['with ui', { props: { ui: { container: 'absolute' } } }],
    // Slots
    ['with top slot', { slots: { top: () => 'Top slot' } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with bottom slot', { slots: { bottom: () => 'Bottom slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: PageAsideProps, slots?: Partial<PageAsideSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, PageAside)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(PageAside, {
      slots: {
        top: () => 'Top slot',
        default: () => 'Default slot',
        bottom: () => 'Bottom slot'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  test('with theme works', async () => {
    const wrapper = await mountSuspended({
      components: { PageAside, UTheme },
      template: `
        <UTheme :ui="{ pageAside: { slots: { root: 'test-theme-class' } } }">
          <PageAside>Content</PageAside>
        </UTheme>
      `
    })

    expect(wrapper.find('[data-slot="root"]').classes()).toContain('test-theme-class')
  })
})
