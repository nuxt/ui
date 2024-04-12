import { describe, it, expect } from 'vitest'
import Alert, { type AlertProps } from '../../src/runtime/components/Alert.vue'
import ComponentRender from '../component-render'

describe('Alert', () => {
  it.each([
    ['with title', { props: { title: 'Title' } }],
    ['with description', { props: { title: 'Title', description: 'Description' } }],
    ['with icon', { props: { title: 'Title', icon: 'i-heroicons-light-bulb' } }],
    ['with avatar', { props: { title: 'Title', avatar: { src: 'https://avatars.githubusercontent.com/u/739984?v=4' } } }],
    ['with as', { props: { title: 'Title', as: 'article' } }],
    ['with color green', { props: { title: 'Title', color: 'green' as const } }],
    ['with color white', { props: { title: 'Title', color: 'white' as const } }],
    ['with color gray', { props: { title: 'Title', color: 'gray' as const } }],
    ['with color black', { props: { title: 'Title', color: 'black' as const } }],
    ['with variant outline', { props: { title: 'Title', variant: 'outline' as const } }],
    ['with variant soft', { props: { title: 'Title', variant: 'soft' as const } }],
    ['with variant link', { props: { title: 'Title', variant: 'subtle' as const } }],
    ['with class', { props: { class: 'w-48' } }],
    ['with ui', { props: { ui: { title: 'font-bold' } } }],
    ['with leading slot', { slots: { title: () => 'Leading slot' } }],
    ['with title slot', { slots: { title: () => 'Title slot' } }],
    ['with description slot', { slots: { description: () => 'Description slot' } }],
    ['with close slot', { slots: { close: () => 'Close slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: AlertProps, slots?: any }) => {
    const html = await ComponentRender(nameOrHtml, options, Alert)
    expect(html).toMatchSnapshot()
  })
})
