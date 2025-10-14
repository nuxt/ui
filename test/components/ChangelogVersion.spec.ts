import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ChangelogVersion from '../../src/runtime/components/ChangelogVersion.vue'
import type { ChangelogVersionProps, ChangelogVersionSlots } from '../../src/runtime/components/ChangelogVersion.vue'
import ComponentRender from '../component-render'

describe('ChangelogVersion', () => {
  it.each([
    // Props
    ['with title', { props: { title: 'Title' } }],
    ['with description', { props: { description: 'Description' } }],
    ['with to', { props: { to: '/changelog' } }],
    ['with image', { props: { image: 'https://picsum.photos/640/360' } }],
    ['with to & image', { props: { to: '/changelog', image: 'https://picsum.photos/640/360' } }],
    ['with date', { props: { date: '2025-01-01' } }],
    ['with badge', { props: { badge: 'Badge' } }],
    ['with badge object', { props: { badge: { label: 'Badge', color: 'primary' as const } } }],
    ['with authors', { props: { authors: [{ name: 'Benjamin Canac', description: 'benjamincanac', avatar: { src: 'https://github.com/benjamincanac.png', alt: 'benjamincanac' } }] } }],
    ['without indicator', { props: { indicator: false } }],
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'absolute' } }],
    ['with ui', { props: { ui: { container: 'max-w-xl' } } }],
    // Slots
    ['with title slot', { slots: { title: () => 'Title slot' } }],
    ['with description slot', { slots: { description: () => 'Description slot' } }],
    ['with header slot', { slots: { header: () => 'Header slot' } }],
    ['with badge slot', { slots: { badge: () => 'Badge slot' } }],
    ['with date slot', { slots: { date: () => 'Date slot' } }],
    ['with title slot', { slots: { title: () => 'Title slot' } }],
    ['with description slot', { slots: { description: () => 'Description slot' } }],
    ['with image slot', { slots: { image: () => 'Image slot' } }],
    ['with body slot', { slots: { body: () => 'Body slot' } }],
    ['with footer slot', { slots: { footer: () => 'Footer slot' } }],
    ['with authors slot', { slots: { authors: () => 'Authors slot' } }],
    ['with actions slot', { slots: { actions: () => 'Actions slot' } }],
    ['with indicator slot', { slots: { indicator: () => 'Indicator slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ChangelogVersionProps, slots?: Partial<ChangelogVersionSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, ChangelogVersion)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(ChangelogVersion, {
      props: {
        title: 'Version 1.0.0',
        description: 'Initial release',
        date: '2025-01-01',
        badge: 'Badge',
        authors: [{ name: 'Benjamin Canac', description: 'benjamincanac', avatar: { src: 'https://github.com/benjamincanac.png', alt: 'Benjamin Canac' } }],
        indicator: true,
        to: '/changelog',
        image: 'https://picsum.photos/640/360'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
