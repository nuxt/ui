import { describe, it, expect } from 'vitest'
import { UBreadcrumb } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'
import ui from '../../../src/runtime/ui.config/navigation/breadcrumb'

describe('Breadcrumb', () => {
  it.each([
    ['basic case', {}],
    ['with links', { props: { links: [{ label: 'Home', to: '/' }, { label: 'About', to: '/about' }], ui: { divider: { base: ui.divider.base }} } }],
    ['with divider', { props: { divider: '|', links: [{ label: 'Home', to: '/' }, { label: 'About', to: '/about' }], ui: { divider: { base: ui.divider.base } } } }],
    ['with icon', { props: { links: [{ label: 'Home', to: '/', icon: 'i-heroicons-academic-cap' }, { label: 'About', to: '/about', icon: 'i-heroicons-code-bracket-square' }], ui: { divider: { base: ui.divider.base }, icon: { base: ui.icon.base } } } }],
    ['with icon slot', { slots: { icon: 'icon slot' }, props: { links: [{ label: 'Home', to: '/', icon: 'i-heroicons-academic-cap' }, { label: 'About', to: '/about', icon: 'i-heroicons-code-bracket-square' }], ui: { divider: { base: ui.divider.base } } } }],
    ['with divider slot', { slots: { divider: 'divider slot' }, props: { links: [{ label: 'Home', to: '/' }, { label: 'About', to: '/about' }], ui: { divider: { base: ui.divider.base } } } }],
    ['with default slot', { slots: { default: 'default slot' }, props: { links: [{ label: 'Home', to: '/' }, { label: 'About', to: '/about' }], ui: { divider: { base: ui.divider.base } } } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Breadcrumb.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UBreadcrumb)
    expect(html).toMatchSnapshot()
  })
})
