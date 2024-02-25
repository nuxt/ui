import { describe, it, expect } from 'vitest'
import { UCard } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Card', () => {
  it.each([
    ['basic case', {}],
    ['with as', { props: { as: 'article' } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with header slot', { slots: { header: () => 'Header slot' } }],
    ['with footer slot', { slots: { footer: () => 'Footer slot' } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UCard.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UCard)
    expect(html).toMatchSnapshot()
  })
})
