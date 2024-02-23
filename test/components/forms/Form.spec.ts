import { describe, it, expect } from 'vitest'
import { UForm } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Form', () => {
  it.each([
    ['basic case', {}],
    ['with default slot', { slots: { default: () => 'Default slot' } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UForm.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UForm)
    expect(html).toMatchSnapshot()
  })
})
