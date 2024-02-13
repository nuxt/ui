import { describe, it, expect } from 'vitest'
import { UMeter } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Meter', () => {
  it.each([
    ['basic case', {}],
    ['with custom value', { props: { value: 50 } }],
    ['with custom min', { props: { min: 20 } }],
    ['with custom max', { props: { max: 200 } }],
    ['indicator enabled', { props: { indicator: true } }],
    ['label provided', { props: { label: 'Progress' } }],
    ['with custom size', { props: { size: 'lg' } }],
    ['with custom color', { props: { color: 'primary' } }],
    ['icon provided', { props: { icon: 'check' } }],
    ['with custom class', { props: { class: 'custom-class' } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Meter.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UMeter)
    expect(html).toMatchSnapshot()
  })
})
