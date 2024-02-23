import { describe, it, expect } from 'vitest'
import { UModal } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Modal', () => {
  it.each([
    //TODO: try to fix Error: A <Transition /> is used but it is missing a `:show="true | false"` prop
    ['basic case', {}]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UModal.props>) => {

    const html = await ComponentRender(nameOrHtml, options, UModal)
    expect(html).toMatchSnapshot()
  })
})
