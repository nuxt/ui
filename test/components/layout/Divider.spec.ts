import { describe, it, expect } from 'vitest'
import { UDivider } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Divider', () => {
  it.each([
    ['basic case', {}],
    ['with label', { props: { label: 'Divider label' } }],
    ['with icon', { props: { icon: 'i-heroicons-academic-cap' } }],
    ['with avatar', { props: { avatar: { src: 'https://repository-images.githubusercontent.com/428329515/43fec891-9030-4601-8233-5d45ba5c6013', alt: 'nuxt-ui' } } }],
    ['with orientation', { props: { orientation: 'vertical' } }],
    ['with type', { props: { type: 'dotted' } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UDivider.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UDivider)
    expect(html).toMatchSnapshot()
  })
})
