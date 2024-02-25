import { describe, it, expect } from 'vitest'
import { UBreadcrumb } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Breadcrumb', () => {
  it.each([
    ['with links', { props: { links: [{ label: 'Home', to: '/' }, { label: 'About', to: '/about' }] } }],
    ['with divider', { props: { divider: '|', links: [{ label: 'Home', to: '/' }, { label: 'About', to: '/about' }] } }],
    ['with icon', { props: { links: [{ label: 'Home', to: '/', icon: 'i-heroicons-academic-cap' }, { label: 'About', to: '/about', icon: 'i-heroicons-code-bracket-square' }] } }],
    ['with icon slot', { slots: { icon: () => 'Icon slot' }, props: { links: [{ label: 'Home', to: '/', icon: 'i-heroicons-academic-cap' }, { label: 'About', to: '/about', icon: 'i-heroicons-code-bracket-square' }] } }],
    ['with divider slot', { slots: { divider: () => 'Divider slot' }, props: { links: [{ label: 'Home', to: '/' }, { label: 'About', to: '/about' }] } }],
    ['with default slot', { slots: { default: () => 'Default slot' }, props: { links: [{ label: 'Home', to: '/' }, { label: 'About', to: '/about' }] } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UBreadcrumb.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UBreadcrumb)
    expect(html).toMatchSnapshot()
  })
})
