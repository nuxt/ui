import { describe, it, expect } from 'vitest'
import { UBreadcrumb } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Breadcrumb', () => {
  it.each([
    ['basic case', {}],
    ['with links', { props: { links: [{ label: 'Home', to: '/' }, { label: 'About', to: '/about' }], ui: { divider: { base: 'flex-shrink-0 w-5 h-5' }} } }],
    ['with divider', { props: { divider: '|', links: [{ label: 'Home', to: '/' }, { label: 'About', to: '/about' }], ui: { divider: { base: 'flex-shrink-0 w-5 h-5' } } } }],
    ['with icon', { props: { links: [{ label: 'Home', to: '/', icon: 'i-heroicons-academic-cap' }, { label: 'About', to: '/about', icon: 'i-heroicons-code-bracket-square' }], ui: { divider: { base: 'flex-shrink-0 w-5 h-5' }, icon: { base: 'flex-shrink-0 w-5 h-5' } } } }],
    ['with icon slot', { slots: { icon: 'icon slot' }, props: { links: [{ label: 'Home', to: '/', icon: 'i-heroicons-academic-cap' }, { label: 'About', to: '/about', icon: 'i-heroicons-code-bracket-square' }], ui: { divider: { base: 'flex-shrink-0 w-5 h-5' } } } }],
    ['with divider slot', { slots: { divider: 'divider slot' }, props: { links: [{ label: 'Home', to: '/' }, { label: 'About', to: '/about' }], ui: { divider: { base: 'flex-shrink-0 w-5 h-5' } } } }],
    ['with default slot', { slots: { default: 'default slot' }, props: { links: [{ label: 'Home', to: '/' }, { label: 'About', to: '/about' }], ui: { divider: { base: 'flex-shrink-0 w-5 h-5' } } } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Breadcrumb.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UBreadcrumb)
    expect(html).toMatchSnapshot()
  })
})
