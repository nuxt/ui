import { describe, it, expect } from 'vitest'
import { UCommandPaletteGroup } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('CommandPaletteGroup', () => {
  //TODO: try to fix TypeError: Cannot read properties of undefined (reading 'undefined')
  it.each([
    ['basic case', {}]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof CommandPaletteGroup.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UCommandPaletteGroup)
    expect(html).toMatchSnapshot()
  })
})
