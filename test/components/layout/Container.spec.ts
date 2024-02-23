import { describe, it, expect } from 'vitest'
import { UContainer } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Container', () => {
  it.each([
    ['basic case', {}],
    ['with as', { props: { as: 'article' } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UContainer.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UContainer)
    expect(html).toMatchSnapshot()
  })
})
