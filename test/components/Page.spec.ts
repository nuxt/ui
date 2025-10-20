import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Page from '../../src/runtime/components/Page.vue'
import type { PageProps, PageSlots } from '../../src/runtime/components/Page.vue'
import ComponentRender from '../component-render'

describe('Page', () => {
  it.each([
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'lg:gap-4' } }],
    ['with ui', { props: { ui: { right: 'order-last lg:order-first' } } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' as any } }],
    ['with left slot', { slots: { left: () => 'Left slot' as any } }],
    ['with right slot', { slots: { right: () => 'Right slot' as any } }],
    ['with all slots', { slots: { left: () => 'Left slot' as any, right: () => 'Right slot' as any, default: () => 'Default slot' as any } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: PageProps, slots?: Partial<PageSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Page)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Page, {
      slots: {
        default: () => 'Default slot',
        left: () => 'Left slot',
        right: () => 'Right slot'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
