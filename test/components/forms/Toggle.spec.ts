import { describe, it, expect } from 'vitest'
import { UToggle } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Toggle', () => {
  it.each([
    ['basic case', {}],
    ['with id', { props: { id: 'toggle id' } }],
    ['with name', { props: { name: 'Toggle name' } }],
    ['with disabled', { props: { disabled: true } }],
    ['with onIcon', { props: { onIcon: 'i-heroicons-book-open' } }],
    ['with offIcon', { props: { offIcon: 'i-heroicons-archive-box' } }],
    ['with color', { props: { color: 'red' } }],
    ['with size', { props: { size: 'sm' } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UToggle.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UToggle)
    expect(html).toMatchSnapshot()
  })
})
