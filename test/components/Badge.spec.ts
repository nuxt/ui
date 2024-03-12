import { describe, it, expect } from 'vitest'
import Badge, { type BadgeProps } from '../../src/runtime/components/Badge.vue'
import ComponentRender from '../component-render'

describe('Badge', () => {
  it.each([
    ['with label', { props: { label: 'Badge' } }],
    ['with class', { props: { label: 'Badge', class: 'rounded-full font-bold' } }],
    ['with size xs', { props: { label: 'Badge', size: 'xs' as const } }],
    ['with size sm', { props: { label: 'Badge', size: 'sm' as const } }],
    ['with size md', { props: { label: 'Badge', size: 'md' as const } }],
    ['with size lg', { props: { label: 'Badge', size: 'lg' as const } }],
    ['with color green', { props: { label: 'Badge', color: 'green' as const } }],
    ['with color white', { props: { label: 'Badge', color: 'white' as const } }],
    ['with color gray', { props: { label: 'Badge', color: 'gray' as const } }],
    ['with color black', { props: { label: 'Badge', color: 'black' as const } }],
    ['with variant outline', { props: { label: 'Badge', variant: 'outline' as const } }],
    ['with variant soft', { props: { label: 'Badge', variant: 'soft' as const } }],
    ['with variant link', { props: { label: 'Badge', variant: 'subtle' as const } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: BadgeProps, slots?: any }) => {
    const html = await ComponentRender(nameOrHtml, options, Badge)
    expect(html).toMatchSnapshot()
  })
})
