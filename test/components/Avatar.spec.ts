import { describe, it, expect } from 'vitest'
import Avatar, { type AvatarProps } from '../../src/runtime/components/Avatar.vue'
import ComponentRender from '../component-render'

describe('Avatar', () => {
  it.each([
    ['with src', { props: { src: 'https://avatars.githubusercontent.com/u/739984?v=4' } }],
    ['with alt', { props: { alt: 'Benjamin Canac' } }],
    ['with class', { props: { class: 'bg-white dark:bg-gray-900' } }],
    ['with fallback', { props: { fallback: '+1' } }],
    ['with icon', { props: { icon: 'i-heroicons-photo' } }],
    ['with size 3xs', { props: { size: '3xs' as const } }],
    ['with size 2xs', { props: { size: '2xs' as const } }],
    ['with size xs', { props: { size: 'xs' as const } }],
    ['with size sm', { props: { size: 'sm' as const } }],
    ['with size md', { props: { size: 'md' as const } }],
    ['with size lg', { props: { size: 'lg' as const } }],
    ['with size xl', { props: { size: 'xl' as const } }],
    ['with size 2xl', { props: { size: '2xl' as const } }],
    ['with size 3xl', { props: { size: '3xl' as const } }],
    ['with ui', { props: { ui: { fallback: 'font-bold' } } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: AvatarProps, slots?: any }) => {
    const html = await ComponentRender(nameOrHtml, options, Avatar)
    expect(html).toMatchSnapshot()
  })
})
