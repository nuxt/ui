import { describe, it, expect } from 'vitest'
import { UBadge } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Badge', () => {
  it.each([
    ['basic case', {}],
    ['with default values', { props: { label: 'Badge' } }],
    ['with custom size', { props: { label: 'Badge', size: 'lg' } }],
    ['with custom color', { props: { label: 'Badge', color: 'red' } }],
    ['with custom variant', { props: { label: 'Badge', variant: 'outline' } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Badge.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UBadge)
    expect(html).toMatchSnapshot()
  })
})
