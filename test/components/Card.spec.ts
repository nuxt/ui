import { describe, it, expect } from 'vitest'
import Card from '../../src/runtime/components/Card.vue'
import type { CardProps, CardSlots } from '../../src/runtime/components/Card.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/card'

describe('Card', () => {
  const variants = Object.keys(theme.variants.variant) as any

  it.each([
    // Props
    ['with as', { props: { as: 'section' } }],
    ...variants.map((variant: string) => [`with variant ${variant}`, { props: { variant } }]),
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
