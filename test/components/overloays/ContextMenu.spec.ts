import { describe, it, expect } from 'vitest'
import { UContextMenu } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('ContextMenu', () => {
  it.each([
    ['basic case', {}]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof ContextMenu.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UContextMenu)

    expect(html).toMatchSnapshot()
  })
})
