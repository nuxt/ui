import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PageBody from '../../src/runtime/components/PageBody.vue'
import type { PageBodyProps, PageBodySlots } from '../../src/runtime/components/PageBody.vue'
import ComponentRender from '../component-render'

describe('PageBody', () => {
  it.each([
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'mt-12' } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: PageBodyProps, slots?: Partial<PageBodySlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, PageBody)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(PageBody, {
      slots: {
        default: () => 'Default slot'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
