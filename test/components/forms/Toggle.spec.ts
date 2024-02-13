import { describe, it, expect } from 'vitest'
import { UToggle } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Toggle', () => {
  it.each([
    ['basic case', {}],
    ['with id', { id: 'MyId' }],
    ['with name', { name: 'MyToggle' }],
    ['with modelValue', { modelValue: true }],
    ['with disabled', { disabled: true }],
    ['with onIcon', { onIcon: 'i-heroicons-book-open' }],
    ['with offIcon', { offIcon: 'i-heroicons-archive-box-16-solid' }],
    ['with color', { color: 'red' }],
    ['with size', { size: 'md' }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Toggle.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UToggle)
    expect(html).toMatchSnapshot()
  })
})
