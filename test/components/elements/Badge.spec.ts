import { describe, it, expect } from 'vitest'
import { UBadge } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Badge', () => {
  it.each([
    ['with label', { props: { label: 'Badge' } }],
    ['with size', { props: { label: 'Badge', size: 'lg' } }],
    ['with color', { props: { label: 'Badge', color: 'red' } }],
    ['with variant', { props: { label: 'Badge', variant: 'outline' } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UBadge.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UBadge)
    expect(html).toMatchSnapshot()
  })
})
