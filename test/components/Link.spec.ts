import { describe, it, expect } from 'vitest'
import Link, { type LinkProps } from '../../src/runtime/components/Link.vue'
import ComponentRender from '../component-render'

describe('Link', () => {
  it.each([
    ['with as', { props: { as: 'div' } }],
    ['with to', { props: { to: '/' } }],
    ['with type', { props: { type: 'submit' as const } }],
    ['with disabled', { props: { disabled: true } }],
    ['with activeClass', { props: { active: true, to: '/', activeClass: 'text-sm' } }],
    ['with inactiveClass', { props: { active: false, to: '/', inactiveClass: 'text-gray-300' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props: LinkProps }) => {
    const html = await ComponentRender(nameOrHtml, options, Link)
    expect(html).toMatchSnapshot()
  })
})
