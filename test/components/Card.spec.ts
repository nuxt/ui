import { describe, it, expect } from 'vitest'
import Card, { type CardProps } from '../../src/runtime/components/Card.vue'
import ComponentRender from '../component-render'

describe('Card', () => {
  it.each([
    ['basic case', {}],
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with header slot', { slots: { header: () => 'Header slot' } }],
    ['with footer slot', { slots: { footer: () => 'Footer slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: CardProps, slots?: any }) => {
    const html = await ComponentRender(nameOrHtml, options, Card)
    expect(html).toMatchSnapshot()
  })
})