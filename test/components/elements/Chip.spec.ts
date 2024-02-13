import { describe, it, expect } from 'vitest'
import { UChip } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Chip', () => {
  it.each([
    ['basic case', {}],
    ['with custom size', { props: { size: 'small' } }],
    ['with custom color', { props: { color: 'red' } }],
    ['with custom position', { props: { position: 'left' } }],
    ['with inset chip', { props: { inset: true } }],
    ['with hidden chip', { props: { show: false } }],
    ['with custom class', { props: { class: 'custom-class' } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Chip.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UChip)
    expect(html).toMatchSnapshot()
  })
})
