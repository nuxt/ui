import { describe, it, expect } from 'vitest'
import { UIcon } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Icon', () => {
  it.each([
    ['basic case', {}],
    ['with name', { props: { name: 'i-heroicons-academic-cap' } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UIcon.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UIcon)
    expect(html).toMatchSnapshot()
  })
})
