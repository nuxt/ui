import { describe, it, expect } from 'vitest'
import { UPopover } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'


describe('Popover', () => {
  it.each([
    ['basic case', {}]
    //TODO: try to fix Cannot read properties of undefined (reading 'Symbol(parentNode)')
    // ['with open', { props: { open: true } }],

    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Popover.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UPopover)
    expect(html).toMatchSnapshot()
  })
})
