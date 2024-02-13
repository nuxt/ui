import { describe, it, expect } from 'vitest'
import { UCommandPaletteGroup } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('CommandPaletteGroup', () => {
  it.each([
    ['basic case', {}],
    ['with group', { group: { id: 1, name: 'Example Group' } }],
    ['with query', { query: 'exampleQuery' }],
    ['with groupAttribute', { groupAttribute: 'groupName' }],
    ['with commandAttribute', { commandAttribute: 'commandName' }],
    ['with selectedIcon', { icon: 'i-heroicons-check' }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof CommandPaletteGroup.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UCommandPaletteGroup)
    expect(html).toMatchSnapshot()
  })
})
