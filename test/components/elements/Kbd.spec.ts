import { describe, it, expect } from 'vitest'
import { UKbd } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Kbd', () => {
  it.each([
    ['with value', { props: { value: 'O' } }],
    ['with custom size', { props: { value: 'O', size: 'xs' } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UKbd.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UKbd)
    expect(html).toMatchSnapshot()
  })
})
