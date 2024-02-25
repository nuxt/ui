import { describe, it, expect } from 'vitest'
import { USlideover } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

// FIXME: Remove skip
describe.skip('Slideover', () => {
  it.each([
    ['basic case', { props: { modelValue: true } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof USlideover.props>) => {
    const html = await ComponentRender(nameOrHtml, options, USlideover)
    expect(html).toMatchSnapshot()
  })
})
