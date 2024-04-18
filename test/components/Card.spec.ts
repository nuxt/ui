import { describe, it, expect } from 'vitest'
import Card, { type CardProps, type CardSlots } from '../../src/runtime/components/Card.vue'
import ComponentRender from '../component-render'

describe('Card', () => {
  it.each([
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'rounded-xl' } }],
    ['with ui', { props: { ui: { body: 'font-bold' } } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with header slot', { slots: { header: () => 'Header slot' } }],
    ['with footer slot', { slots: { footer: () => 'Footer slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: CardProps, slots?: Partial<CardSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Card)
    expect(html).toMatchSnapshot()
  })
})
