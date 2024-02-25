import { describe, it, expect } from 'vitest'
import { UPopover } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Popover', () => {
  it.each([
    ['basic case', { props: { modelValue: true } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UPopover.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UPopover)
    expect(html).toMatchSnapshot()
  })
})
