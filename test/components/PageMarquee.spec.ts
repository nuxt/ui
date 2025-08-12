import { describe, it, expect } from 'vitest'
import PageMarquee from '../../src/runtime/components/PageMarquee.vue'
import type { PageMarqueeProps, PageMarqueeSlots } from '../../src/runtime/components/PageMarquee.vue'
import ComponentRender from '../component-render'

describe('PageMarquee', () => {
  it.each([
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'text-xl' } }],
    ['with pauseOnHover', { props: { pauseOnHover: true } }],
    ['with reverse', { props: { reverse: true } }],
    ['with orientation', { props: { orientation: 'vertical' as const } }],
    ['with repeat', { props: { repeat: 6 } }],
    ['with overlay off', { props: { overlay: false } }],
    ['with ui', { props: { ui: { content: 'gap-4' } } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: PageMarqueeProps, slots?: Partial<PageMarqueeSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, PageMarquee)
    expect(html).toMatchSnapshot()
  })
})
