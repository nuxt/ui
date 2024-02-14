import { describe, it, expect } from 'vitest'
import { UKbd } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Kbd', () => {
  it.each([
    ['basic case', {}],
    ['with custom size', { props: { size: 'xs' } }],
    ['with custom class', { props: { class: 'w-full h-full' } }],
    ['with value', { props: { value: 'label' }}],
    ['with slot', { slots: { default: 'slot' }}],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Kbd.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UKbd)
    expect(html).toMatchSnapshot()
  })
})
