import { describe, it, expect } from 'vitest'
import { UAvatarGroup } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('AvatarGroup', () => {
  it.each([
    ['basic case', {}],
    ['with max', { props: { max: 20 } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UAvatarGroup.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UAvatarGroup)
    expect(html).toMatchSnapshot()
  })
})
