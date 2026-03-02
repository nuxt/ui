import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import Modal from '../../src/runtime/components/Modal.vue'

describe('Modal', () => {
  const props = { open: true, portal: false }

  renderEach(Modal, [
    // Props
    ['with open', { props }],
    ['with title', { props: { ...props, title: 'Title' } }],
    ['with description', { props: { ...props, title: 'Title', description: 'Description' } }],
    ['with fullscreen', { props: { ...props, fullscreen: true, title: 'Title', description: 'Description' } }],
    ['without overlay', { props: { ...props, overlay: false, title: 'Title', description: 'Description' } }],
    ['without transition', { props: { ...props, transition: false, title: 'Title', description: 'Description' } }],
    ['with scrollable', { props: { ...props, scrollable: true, title: 'Title', description: 'Description' } }],
    ['with scrollable and fullscreen', { props: { ...props, scrollable: true, fullscreen: true, title: 'Title', description: 'Description' } }],
    ['with scrollable and without overlay', { props: { ...props, scrollable: true, overlay: false, title: 'Title', description: 'Description' } }],
    ['without close', { props: { ...props, close: false, title: 'Title', description: 'Description' } }],
    ['with closeIcon', { props: { ...props, closeIcon: 'i-lucide-trash' } }],
    ['with class', { props: { ...props, class: 'bg-elevated' } }],
    ['with ui', { props: { ...props, ui: { close: 'end-2' } } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }],
    ['with content slot', { props, slots: { content: () => 'Content slot' } }],
    ['with header slot', { props, slots: { header: () => 'Header slot' } }],
    ['with title slot', { props, slots: { title: () => 'Title slot' } }],
    ['with description slot', { props, slots: { description: () => 'Description slot' } }],
    ['with actions slot', { props, slots: { actions: () => 'Actions slot' } }],
    ['with close slot', { props, slots: { close: () => 'Close slot' } }],
    ['with body slot', { props, slots: { body: () => 'Body slot' } }],
    ['with footer slot', { props, slots: { footer: () => 'Footer slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Modal, {
      props: {
        open: true,
        portal: false,
        title: 'Modal Title',
        description: 'This is a modal description'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
