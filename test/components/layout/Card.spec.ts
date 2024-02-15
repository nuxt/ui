import { describe, it, expect } from 'vitest'
import { UCard } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Card', () => {
  it.each([
    ['basic case', { props: { ui: { body: { base: '' } } } }],
    ['with as', { props: { as: 'li', ui: { body: { base: '' } } } }],
    ['with default slot', { slots: { default: 'default slot' }, props: { ui: { body: { base: '' } } } }],
    ['with header slot', { slots: { header: 'Header slot' }, props: { ui: { body: { base: '' }, header: { base: '' } } } }],
    ['with footer slot', { slots: { footer: 'Footer slot' }, props: { ui: { body: { base: '' }, footer: { base: '' } } } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Card.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UCard)
    expect(html).toMatchSnapshot()
  })
})
