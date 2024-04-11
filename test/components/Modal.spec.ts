import { describe, it, expect } from 'vitest'
import Modal, { type ModalProps } from '../../src/runtime/components/Modal.vue'
import ComponentRender from '../component-render'

describe('Modal', () => {
  it.each([
    ['basic case', { props: { open: true, portal: false } }],
    ['with title', { props: { open: true, portal: false, title: 'Title' } }],
    ['with description', { props: { open: true, portal: false, title: 'Title', description: 'Description' } }],
    ['with fullscreen', { props: { open: true, portal: false, fullscreen: true, title: 'Title', description: 'Description' } }],
    ['without overlay', { props: { open: true, portal: false, overlay: false, title: 'Title', description: 'Description' } }],
    ['without transition', { props: { open: true, portal: false, transition: false, title: 'Title', description: 'Description' } }],
    ['without close', { props: { open: true, portal: false, close: null, title: 'Title', description: 'Description' } }],
    ['with class', { props: { open: true, portal: false, class: 'bg-gray-50 dark:bg-gray-800' } }],
    ['with ui', { props: { open: true, portal: false, ui: { close: 'right-2' } } }],
    ['with default slot', { props: { open: true, portal: false }, slots: { default: () => 'Default slot' } }],
    ['with content slot', { props: { open: true, portal: false }, slots: { content: () => 'Content slot' } }],
    ['with header slot', { props: { open: true, portal: false }, slots: { header: () => 'Header slot' } }],
    ['with title slot', { props: { open: true, portal: false }, slots: { title: () => 'Title slot' } }],
    ['with description slot', { props: { open: true, portal: false }, slots: { description: () => 'Description slot' } }],
    ['with close slot', { props: { open: true, portal: false }, slots: { close: () => 'Close slot' } }],
    ['with body slot', { props: { open: true, portal: false }, slots: { body: () => 'Body slot' } }],
    ['with footer slot', { props: { open: true, portal: false }, slots: { footer: () => 'Footer slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ModalProps, slots?: any }) => {
    const html = await ComponentRender(nameOrHtml, options, Modal)
    expect(html).toMatchSnapshot()
  })
})
