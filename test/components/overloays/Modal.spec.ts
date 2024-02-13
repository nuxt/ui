import { describe, it, expect } from 'vitest'
import { UModal } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Modal', () => {
  it.each([
    ['basic case', {}]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Modal.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UModal)
    expect(html).toMatchSnapshot()
  })
})
