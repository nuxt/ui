import { describe, it, expect } from 'vitest'
import Chip, { type ChipProps } from '../../src/runtime/components/Chip.vue'
import ComponentRender from '../component-render'

describe('Chip', () => {
  it.each([
    ['basic case', {}],
    ['with as', { props: { as: 'span' } }],
    ['with class', { props: { class: 'mx-auto' } }],
    ['with ui', { props: { ui: { base: 'text-gray-500 dark:text-gray-400' } } }],
    ['with show', { props: { show: true } }],
    ['with inset', { props: { inset: true } }],
    ['with position top-right', { props: { show: true, position: 'top-right' as const } }],
    ['with position bottom-right', { props: { show: true, position: 'bottom-right' as const } }],
    ['with position top-left', { props: { show: true, position: 'top-left' as const } }],
    ['with position bottom-left', { props: { show: true, position: 'bottom-left' as const } }],
    ['with size 3xs', { props: { show: true, size: '3xs' as const } }],
    ['with size 2xs', { props: { show: true, size: '2xs' as const } }],
    ['with size xs', { props: { show: true, size: 'xs' as const } }],
    ['with size sm', { props: { show: true, size: 'sm' as const } }],
    ['with size md', { props: { show: true, size: 'md' as const } }],
    ['with size lg', { props: { show: true, size: 'lg' as const } }],
    ['with size xl', { props: { show: true, size: 'xl' as const } }],
    ['with size 2xl', { props: { show: true, size: '2xl' as const } }],
    ['with size 3xl', { props: { show: true, size: '3xl' as const } }],
    ['with color green', { props: { show: true, color: 'green' as const } }],
    ['with color white', { props: { show: true, color: 'white' as const } }],
    ['with color gray', { props: { show: true, color: 'gray' as const } }],
    ['with color black', { props: { show: true, color: 'black' as const } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with content slot', { slots: { content: () => 'Content slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ChipProps & { show?: boolean }, slots?: any }) => {
    const html = await ComponentRender(nameOrHtml, options, Chip)
    expect(html).toMatchSnapshot()
  })
})
