import { describe, it, expect } from 'vitest'
import { URange } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Range', () => {
  it.each([
    ['basic case', {}],
    ['with custom id', { props: { id: 'myRange' }, options: {} }],
    ['with custom name', { props: { name: 'myRangeInput' }, options: {} }],
    ['with disabled', { props: { disabled: true }, options: {} }],
    ['with custom min', { props: { min: 10 }, options: {} }],
    ['with custom max', { props: { max: 200 }, options: {} }],
    ['with custom step', { props: { step: 5 }, options: {} }],
    ['with custom size', { props: { size: 'lg' }, options: {} }],
    ['with custom color', { props: { color: 'red' }, options: {} }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Range.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, URange)
    expect(html).toMatchSnapshot()
  })
})
