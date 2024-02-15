import { describe, it, expect } from 'vitest'
import { URange } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Range', () => {
  it.each([
    ['basic case', {}],
    ['with custom id', { props: { id: 'myRange' }, }],
    ['with custom name', { props: { name: 'myRangeInput' }, }],
    ['with disabled', { props: { disabled: true }, }],
    ['with custom min', { props: { min: 10 }, }],
    ['with custom max', { props: { max: 200 }, }],
    ['with custom step', { props: { step: 5 }, }],
    ['with custom size', { props: { size: 'lg' } }],
    ['with custom color', { props: { color: 'red' } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Range.props>) => {
    const html = await ComponentRender(nameOrHtml, options, URange)
    expect(html).toMatchSnapshot()
  })
})
