import { describe, it, expect } from 'vitest'
import Drawer, { type DrawerProps } from '../../src/runtime/components/Drawer.vue'
import ComponentRender from '../component-render'

describe('Drawer', () => {
  it.each([
    ['basic case', { props: { open: true, portal: false } }],
    ['with title', { props: { open: true, portal: false, title: 'Title' } }],
    ['with description', { props: { open: true, portal: false, title: 'Title', description: 'Description' } }],
    ['without overlay', { props: { open: true, portal: false, overlay: false, title: 'Title', description: 'Description' } }],
    ['with class', { props: { open: true, portal: false, class: 'bg-gray-50 dark:bg-gray-800' } }],
    ['with ui', { props: { open: true, portal: false, ui: { handle: 'w-20' } } }],
    ['with default slot', { props: { open: true, portal: false }, slots: { default: () => 'Default slot' } }],
    ['with content slot', { props: { open: true, portal: false }, slots: { content: () => 'Content slot' } }],
    ['with header slot', { props: { open: true, portal: false }, slots: { header: () => 'Header slot' } }],
    ['with title slot', { props: { open: true, portal: false }, slots: { title: () => 'Title slot' } }],
    ['with description slot', { props: { open: true, portal: false }, slots: { description: () => 'Description slot' } }],
    ['with body slot', { props: { open: true, portal: false }, slots: { body: () => 'Body slot' } }],
    ['with footer slot', { props: { open: true, portal: false }, slots: { footer: () => 'Footer slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: DrawerProps, slots?: any }) => {
    const html = await ComponentRender(nameOrHtml, options, Drawer)
    expect(html).toMatchSnapshot()
  })
})
