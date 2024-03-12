import { describe, it, expect } from 'vitest'
import Kbd, { type KbdProps } from '../../src/runtime/components/Kbd.vue'
import ComponentRender from '../component-render'

describe('Kbd', () => {
  it.each([
    ['with value', { props: { value: 'K' } }],
    ['with class', { props: { value: 'K', class: 'font-bold' } }],
    ['with size xs', { props: { value: 'K', size: 'xs' as const } }],
    ['with size sm', { props: { value: 'K', size: 'sm' as const } }],
    ['with size md', { props: { value: 'K', size: 'md' as const } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: KbdProps, slots?: any }) => {
    const html = await ComponentRender(nameOrHtml, options, Kbd)
    expect(html).toMatchSnapshot()
  })
})
