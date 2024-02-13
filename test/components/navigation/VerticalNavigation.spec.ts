import { describe, it, expect } from 'vitest'
import { UVerticalNavigation } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('VerticalNavigation', () => {
  it.each([
    ['basic case', {}],
    ['with links', {
      links: [
        { label: 'Home', labelClass: 'text-sm', icon: 'i-heroicons-academic-cap', iconClass: 'w-5 h-5' },
        { label: 'Settings', badge: 'badge' },
        { label: 'About', avatar: { src: 'https://repository-images.githubusercontent.com/428329515/43fec891-9030-4601-8233-5d45ba5c6013', alt: 'nuxtui' } }
      ]
    }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof VerticalNavigation.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UVerticalNavigation)
    expect(html).toMatchSnapshot()
  })
})
