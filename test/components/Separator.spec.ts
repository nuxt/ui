import { describe, it, expect } from 'vitest'
import Separator, { type SeparatorProps } from '../../src/runtime/components/Separator.vue'
import ComponentRender from '../component-render'

describe('Separator', () => {
  it.each([
    ['basic case', {}],
    ['with as', { props: { as: 'span' } }],
    ['with class', { props: { class: 'flex-row-reverse' } }],
    ['with size 2xs', { props: { size: '2xs' as const } }],
    ['with size xs', { props: { size: 'xs' as const } }],
    ['with size sm', { props: { size: 'sm' as const } }],
    ['with size md', { props: { size: 'md' as const } }],
    ['with size lg', { props: { size: 'lg' as const } }],
    ['with size xl', { props: { size: 'xl' as const } }],
    ['with label', { props: { label: '+1' } }],
    ['with icon', { props: { icon: 'i-heroicons-photo' } }],
    ['with avatar', { props: { avatar: { src: 'https://avatars.githubusercontent.com/u/739984?v=4' } } }],
    ['with orientation horizontal', { props: { orientation: 'horizontal' as const } }],
    ['with orientation vertical', { props: { orientation: 'vertical' as const } }],
    ['with type dashed', { props: { type: 'dashed' as const } }],
    ['with type dotted', { props: { type: 'dotted' as const } }],
    ['with color green', { props: { color: 'green' as const } }],
    ['with color white', { props: { color: 'white' as const } }],
    ['with color gray', { props: { color: 'gray' as const } }],
    ['with color black', { props: { color: 'black' as const } }],
    ['with decorative', { props: { decorative: true } }],
    ['with ui', { props: { ui: { label: 'text-lg' } } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: SeparatorProps, slots?: any }) => {
    const html = await ComponentRender(nameOrHtml, options, Separator)
    expect(html).toMatchSnapshot()
  })
})
