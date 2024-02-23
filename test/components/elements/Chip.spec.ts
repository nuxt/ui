import { describe, it, expect } from 'vitest'
import { UChip } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Chip', () => {
  it.each([
    ['basic case', {}],
    ['with custom size', { props: { size: 'lg' } }],
    ['with custom color', { props: { color: 'red' } }],
    ['with custom position', { props: { position: 'top-left' } }],
    ['with inset chip', { props: { inset: true } }],
    ['with hidden chip', { props: { show: false } }],
    ['with content slot', { slots: { content: () => 'Content slot' } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UChip.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UChip)
    expect(html).toMatchSnapshot()
  })
})
