import { describe, it, expect } from 'vitest'
import LinkNoRouter from '../../../../../src/runtime/vue/overrides/none/Link.vue'
import type { LinkProps, LinkSlots } from '../../../../../src/runtime/vue/overrides/none/Link.vue'
import ComponentRender from '../../../../component-render'

describe('Link (router: `none`)', () => {
  it.each([
    // Basic props
    ['with href', { props: { href: '/test' } }],
    ['with to prop', { props: { to: '/test' } }],
    ['with external href', { props: { href: 'https://example.com', external: true } }],
    ['with target _blank', { props: { href: '/test', target: '_blank' } }],
    ['with rel attribute', { props: { href: '/test', rel: 'nofollow' } }],
    ['with disabled state', { props: { href: '/test', disabled: true } }],
    ['with active forced true', { props: { href: '/test', active: true } }],
    ['with active forced false', { props: { href: '/test', active: false } }],
    ['with custom class', { props: { href: '/test', class: 'custom-link' } }],
    ['without href (button mode)', { props: { as: 'button', type: 'button' as const } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Click me' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: LinkProps, slots?: Partial<LinkSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, LinkNoRouter)
    expect(html).toMatchSnapshot()
  })

  it('should never be active when no active prop is set', async () => {
    const options = {
      props: { href: '/test' },
      slots: { default: ({ active }: { active: boolean }) => `Active: ${active}` }
    }
    const html = await ComponentRender('active state test', options, LinkNoRouter)
    expect(html).toContain('Active: false')
  })

  it('should respect forced active state', async () => {
    const options = {
      props: { href: '/test', active: true },
      slots: { default: ({ active }: { active: boolean }) => `Active: ${active}` }
    }
    const html = await ComponentRender('forced active test', options, LinkNoRouter)
    expect(html).toContain('Active: true')
  })
})
