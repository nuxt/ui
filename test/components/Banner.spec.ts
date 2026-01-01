import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Banner from '../../src/runtime/components/Banner.vue'
import type { BannerProps, BannerSlots } from '../../src/runtime/components/Banner.vue'
import ComponentRender from '../component-render'

describe('Banner', () => {
  const props = { id: 'banner' }

  it.each([
    // Props
    ['with id', { props }],
    ['with title', { props: { ...props, title: 'Title' } }],
    ['with icon', { props: { ...props, title: 'Title', icon: 'i-lucide-rocket' } }],
    ['with close', { props: { ...props, close: true } }],
    ['with actions', { props: { ...props, title: 'Title', icon: 'i-lucide-rocket', actions: [{ label: 'Learn more', trailingIcon: 'i-lucide-arrow-right' }] } }],
    ['with to', { props: { ...props, to: '/getting-started' } }],
    ['with target', { props: { ...props, to: 'https://nuxt.com', target: '_blank' } }],
    ['with neutral color', { props: { ...props, title: 'Title', icon: 'i-lucide-rocket', color: 'neutral' as const } }],
    ['with closeIcon', { props: { ...props, closeIcon: 'i-lucide-trash' } }],
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'z-10' } }],
    ['with ui', { props: { ...props, ui: { container: 'gap-6' } } }],
    // Slots
    ['with leading slot', { props, slots: { leading: () => 'Leading slot' } }],
    ['with title slot', { props, slots: { title: () => 'Title slot' } }],
    ['with actions slot', { props, slots: { actions: () => 'Actions slot' } }],
    ['with close slot', { props, slots: { close: () => 'Close slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: BannerProps, slots?: Partial<BannerSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Banner)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Banner, {
      props: {
        id: 'banner',
        title: 'Title',
        icon: 'i-lucide-rocket',
        actions: [{ label: 'Learn more', trailingIcon: 'i-lucide-arrow-right' }],
        close: true
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
