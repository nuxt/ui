import { describe, it, expect } from 'vitest'
import { UContainer } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Container', () => {
  it.each([
    ['basic case', {}],
    ['with as', { props: { as: 'article' } }],
    ['with default slot', { slots: { default: 'default slot' } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Container.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UContainer)
    expect(html).toMatchSnapshot()
  })
})
