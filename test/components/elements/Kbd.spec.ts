import { describe, it, expect } from 'vitest'
import { UKbd } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Kbd', () => {
  it.each([
    ['basic case', {}],
    ['with custom size', { props: { size: 'md' } }],
    ['with custom class', { props: { class: 'custom-class' } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Kbd.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UKbd)
    expect(html).toMatchSnapshot()
  })
})
