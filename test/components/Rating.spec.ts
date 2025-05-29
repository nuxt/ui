import { describe, it, expect } from 'vitest'
import Rating, { type RatingProps, type RatingSlots } from '../../src/runtime/components/Rating.vue'
import ComponentRender from '../component-render'

describe('Rating', () => {
  it.each([
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: '' } }],
    ['with ui', { props: { ui: {} } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: RatingProps, slots?: Partial<RatingSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Rating)
    expect(html).toMatchSnapshot()
  })
})
