import { describe, it, expect } from 'vitest'
import { UBreadcrumb } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Breadcrumb', () => {
  it.each([
    ['basic case', {}],
    ['with links', { links: [{ label: 'Home', to: '/' }, { label: 'About', to: '/about' }] }],
    ['with divider', { divider: '>' }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Breadcrumb.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UBreadcrumb)
    expect(html).toMatchSnapshot()
  })
})
