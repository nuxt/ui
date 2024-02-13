import { describe, it, expect } from 'vitest'
import { UProgress } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Progress', () => {
  it.each([
    ['basic case', {}],
    ['with custom value', { props: { value: 50 } }],
    ['with custom max', { props: { max: 200 } }],
    ['with indicator', { props: { indicator: true } }],
    ['with custom animation', { props: { animation: 'carousel' } }],
    ['with custom size', { props: { size: 'sm' } }],
    ['with custom color', { props: { color: 'blue' } }],
    ['with custom class', { props: { class: 'custom-class' } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Progress.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UProgress)
    expect(html).toMatchSnapshot()
  })
})
