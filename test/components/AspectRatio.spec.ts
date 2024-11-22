import { describe, it, expect } from 'vitest'
import AspectRatio, { type AspectRatioProps, type AspectRatioSlots } from '../../src/runtime/components/AspectRatio.vue'
import ComponentRender from '../component-render'

describe('AspectRatio', () => {
  it.each([
    // Props
    ['with as', { props: { as: 'div' } }],
    ['with class', { props: { class: 'block' } }],
    ['with ui', { props: { ui: { root: 'block' } } }],
    ['with aspect 4/3', { props: { ratio: 4 / 3 } }],
    ['with aspect 16/9', { props: { ratio: 16 / 9 } }],
    // Slots
    ['with default slot', { slots: { default: () => 'default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: AspectRatioProps, slots?: Partial<AspectRatioSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, AspectRatio)
    expect(html).toMatchSnapshot()
  })
})
