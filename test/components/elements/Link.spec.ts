import { describe, it, expect } from 'vitest'
import { ULink } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Link', () => {
  it.each([
    ['with as', { props: { as: 'div' } }],
    ['with to', { props: { to: '/' } }],
    ['with type', { props: { type: 'submit' } }],
    ['with disabled', { props: { disabled: true } }],
    ['with activeClass', { props: { active: true, to: '/', activeClass: 'text-sm' } }],
    ['with inactiveClass', { props: { active: false, to: '/', inactiveClass: 'text-gray-300' } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof ULink.props>) => {
    const html = await ComponentRender(nameOrHtml, options, ULink)
    expect(html).toMatchSnapshot()
  })
})
