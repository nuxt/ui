import { describe, it, expect } from 'vitest'
import { UProgress } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Progress', () => {
  it.each([
    ['basic case', {}],
    ['with custom value', { props: { value: 50 } }],
    ['with indicator', { props: { indicator: true } }],
    ['with slot indicator', { slots: { indicator: 'indicator slot' } }],
    ['with custom max', { props: { max: [200] } }],
    ['with steps', { props: { max: [50, 100, 150, 200] } }],
    ['with custom size', { props: { size: 'sm' } }],
    ['with custom color', { props: { color: 'red' } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Progress.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UProgress)
    expect(html).toMatchSnapshot()
  })
})
