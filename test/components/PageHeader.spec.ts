import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PageHeader from '../../src/runtime/components/PageHeader.vue'
import type { PageHeaderProps, PageHeaderSlots } from '../../src/runtime/components/PageHeader.vue'
import ComponentRender from '../component-render'

describe('PageHeader', () => {
  it.each([
    // Props
    ['with title', { props: { title: 'Title' } }],
    ['with description', { props: { description: 'Description' } }],
    ['with headline', { props: { headline: 'Headline' } }],
    ['with links', { props: { links: [{ label: 'GitHub', icon: 'i-simple-icons-github' }] } }],
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'py-12' } }],
    ['with ui', { props: { ui: { container: 'py-12' } } }],
    // Slots
    ['with title slot', { slots: { title: () => 'Title slot' } }],
    ['with description slot', { slots: { description: () => 'Description slot' } }],
    ['with headline slot', { slots: { headline: () => 'Headline slot' } }],
    ['with links slot', { slots: { links: () => 'Links slot' } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: PageHeaderProps, slots?: Partial<PageHeaderSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, PageHeader)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(PageHeader, {
      props: {
        title: 'Title',
        description: 'Description',
        headline: 'Breaking News',
        links: [{ label: 'GitHub', icon: 'i-simple-icons-github', to: 'https://github.com' }]
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
