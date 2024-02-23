import { describe, it, expect } from 'vitest'
import { ULink } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Link', () => {
  it.each([
    ['basic case', {}],
    ['with custom as prop', { props: { as: 'a' } }],
    ['NuxtLink with to prop', { props: { to: '/' } }],
    ['with custom type prop', { props: { type: 'submit' } }],
    ['disabled set to true', { props: { disabled: true } }],
    ['with active', { props: { active: true, to: '/', activeClass: 'text-sm' } }],
    ['with inactive', { props: { active: false, to: '/', inactiveClass: 'text-gray-300' } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof ULink.props>) => {
    const html = await ComponentRender(nameOrHtml, options, ULink)
    expect(html).toMatchSnapshot()
  })
})
