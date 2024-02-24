import { describe, it, expect } from 'vitest'
import { UModal } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe.skip('Modal', () => {
  it.each([
    ['basic case', { props: { modelValue: true } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UModal.props>) => {

    const html = await ComponentRender(nameOrHtml, options, UModal)
    expect(html).toMatchSnapshot()
  })
})
