import { describe, it, expect } from 'vitest'
import { ULink } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Link', () => {
  it.each([
    ['basic case', {}],
    ['with custom as prop', { props: { as: 'a' } }],
    ['with custom type prop', { props: { type: 'submit' } }],
    ['disabled set to true', { props: { disabled: true } }],
    ['active set to true', { props: { active: true } }],
    ['exact set to true', { props: { exact: true } }],
    ['exactQuery set to true', { props: { exactQuery: true } }],
    ['exactHash set to true', { props: { exactHash: true } }],
    ['with inactiveClass prop', { props: { inactiveClass: 'inactive-link' } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Link.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, ULink)
    expect(html).toMatchSnapshot()
  })
})
