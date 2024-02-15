import { describe, it, expect } from 'vitest'
import { UAvatarGroup } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('AvatarGroup', () => {
  it.each([
    // TODO: trye to fix TypeError: The "path" argument must be of type string. Received undefined
    // ['basic case', {}],
    // ['with max', { props: { max: 20 } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof AvatarGroup.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UAvatarGroup)
    expect(html).toMatchSnapshot()
  })
})
